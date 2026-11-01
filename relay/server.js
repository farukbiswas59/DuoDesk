// DuoDesk cloud relay — GPL-3.0, see LICENSE.
// Lets two DuoDesk computers that aren't on the same network (home and office) reach each other.
// Both dial out to this server over HTTPS/WSS (port 443 behind a host like Render or Fly), so
// neither needs an open port. The server only pairs sockets and copies bytes: everything the
// computers say is sealed end to end with a key made from their relay code (shared/cloudrelay.js),
// and the session inside is DuoDesk's own TLS on top. The server never sees the code.
//
//   /v1/agent?room=<32 hex>&id=<16 hex>   one per computer: who is in the room, and sealed notes
//                                         between them ({t:'msg', to|from, d})
//   /v1/stream?room=<32 hex>&sid=<32 hex> one per tunnelled TCP connection: the first two sockets
//                                         with the same sid are joined (both get the text 'ready'),
//                                         then binary frames are copied as they are
//
// Env: PORT (default 8080), RELAY_TOKEN (optional: then every socket must send ?token=<it>).
'use strict';

const http = require('http');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');

const PORT = Number(process.env.PORT) || 8080;
const TOKEN = process.env.RELAY_TOKEN || '';
const MAX_ROOMS = Number(process.env.MAX_ROOMS) || 1000;
const MAX_PEERS = 2; // a room joins two computers
const MAX_STREAMS = 64; // open or waiting streams per room
const PAIR_WAIT_MS = 15000; // a stream socket without its other half by then is closed
const MAX_MSG = 64 * 1024; // agent notes
const MAX_FRAME = 1024 * 1024; // stream frames
const HIGH = 4 * 1024 * 1024; // bytes queued to one side before the other side is paused
const LOW = 1024 * 1024;
const PING_MS = 20000;

const HEX = (n) => new RegExp(`^[0-9a-f]{${n}}$`);
const rooms = new Map(); // room -> {agents: Map(id -> ws), streams: Map(sid -> {a, b, timer})}
const log = (...a) => console.log(new Date().toISOString(), ...a);

function room(id, create) {
  let r = rooms.get(id);
  if (!r && create) {
    if (rooms.size >= MAX_ROOMS) return null;
    r = { agents: new Map(), streams: new Map() };
    rooms.set(id, r);
  }
  return r;
}

function dropIfEmpty(id) {
  const r = rooms.get(id);
  if (r && !r.agents.size && !r.streams.size) rooms.delete(id);
}

const tokenOk = (t) => !TOKEN || (typeof t === 'string' && t.length === TOKEN.length && crypto.timingSafeEqual(Buffer.from(t), Buffer.from(TOKEN)));
const send = (ws, obj) => ws.readyState === ws.OPEN && ws.send(JSON.stringify(obj));

const server = http.createServer((req, res) => {
  // Health check for the host (Render, Fly) and a quick look in a browser.
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end(`DuoDesk relay OK (${rooms.size} room${rooms.size === 1 ? '' : 's'})\n`);
});

const wss = new WebSocketServer({ noServer: true, maxPayload: MAX_FRAME, perMessageDeflate: false });

server.on('upgrade', (req, sock, head) => {
  const url = new URL(req.url, 'http://x');
  const q = url.searchParams;
  const reject = (code, why) => sock.end(`HTTP/1.1 ${code} ${why}\r\nConnection: close\r\n\r\n`);
  if (!tokenOk(q.get('token') || '')) return reject(401, 'Unauthorized');
  const roomId = q.get('room') || '';
  if (!HEX(32).test(roomId)) return reject(400, 'Bad room');
  if (url.pathname === '/v1/agent') {
    const id = q.get('id') || '';
    if (!HEX(16).test(id)) return reject(400, 'Bad id');
    return wss.handleUpgrade(req, sock, head, (ws) => onAgent(ws, roomId, id));
  }
  if (url.pathname === '/v1/stream') {
    const sid = q.get('sid') || '';
    if (!HEX(32).test(sid)) return reject(400, 'Bad stream');
    return wss.handleUpgrade(req, sock, head, (ws) => onStream(ws, roomId, sid));
  }
  reject(404, 'Not Found');
});

wss.on('connection', () => {}); // (handleUpgrade callers do the work)

function track(ws) {
  ws.alive = true;
  ws.on('pong', () => { ws.alive = true; });
  ws.on('error', () => {});
}

function onAgent(ws, roomId, id) {
  track(ws);
  const r = room(roomId, true);
  if (!r) return ws.close(1013, 'Relay full');
  const old = r.agents.get(id);
  if (old) old.close(4000, 'Replaced');
  else if (r.agents.size >= MAX_PEERS) return ws.close(4009, 'Room full');
  r.agents.set(id, ws);
  send(ws, { t: 'peers', peers: [...r.agents.keys()].filter((x) => x !== id) });
  for (const [other, o] of r.agents) if (other !== id) send(o, { t: 'join', id });
  log(`[agent] ${roomId.slice(0, 6)}… ${id} joined (${r.agents.size})`);

  ws.on('message', (data, isBinary) => {
    if (isBinary || data.length > MAX_MSG) return;
    let m;
    try { m = JSON.parse(data); } catch { return; }
    if (!m || m.t !== 'msg' || typeof m.d !== 'string' || typeof m.to !== 'string') return;
    const to = r.agents.get(m.to);
    if (to) send(to, { t: 'msg', from: id, d: m.d });
  });
  ws.on('close', () => {
    if (r.agents.get(id) !== ws) return;
    r.agents.delete(id);
    for (const o of r.agents.values()) send(o, { t: 'leave', id });
    log(`[agent] ${roomId.slice(0, 6)}… ${id} left`);
    dropIfEmpty(roomId);
  });
}

function onStream(ws, roomId, sid) {
  track(ws);
  const r = room(roomId, false);
  if (!r || !r.agents.size) return ws.close(4004, 'Nobody in the room');
  const s = r.streams.get(sid);
  if (!s) {
    if (r.streams.size >= MAX_STREAMS) return ws.close(1013, 'Too many streams');
    const entry = { a: ws, b: null };
    entry.timer = setTimeout(() => ws.close(4008, 'No other side'), PAIR_WAIT_MS);
    r.streams.set(sid, entry);
    ws.on('close', () => {
      if (r.streams.get(sid) !== entry || entry.b) return;
      clearTimeout(entry.timer);
      r.streams.delete(sid);
      dropIfEmpty(roomId);
    });
    return;
  }
  if (s.b) return ws.close(4009, 'Stream taken');
  clearTimeout(s.timer);
  s.b = ws;
  join(s.a, ws, () => {
    if (r.streams.get(sid) === s) r.streams.delete(sid);
    dropIfEmpty(roomId);
  });
}

// Copy frames both ways, as they are (message boundaries matter: each is one sealed chunk).
// A side that can't keep up pauses the other's socket instead of growing a queue here.
function join(a, b, done) {
  let ended = false;
  const end = () => {
    if (ended) return;
    ended = true;
    for (const w of [a, b]) if (w.readyState === w.OPEN) w.close();
    done();
  };
  const pipe = (from, to) => {
    let queued = 0;
    let paused = false;
    from.on('message', (data, isBinary) => {
      if (!isBinary || to.readyState !== to.OPEN) return;
      queued += data.length;
      to.send(data, { binary: true }, () => {
        queued -= data.length;
        if (paused && queued < LOW) {
          paused = false;
          if (from._socket) from._socket.resume();
        }
      });
      if (!paused && queued > HIGH) {
        paused = true;
        if (from._socket) from._socket.pause();
      }
    });
    from.on('close', end);
  };
  pipe(a, b);
  pipe(b, a);
  for (const w of [a, b]) if (w.readyState === w.OPEN) w.send('ready');
  if (a.readyState !== a.OPEN || b.readyState !== b.OPEN) end();
}

// Keep sockets alive through proxies that close idle connections (Render, Fly: ~60 s), and drop
// the ones whose computer went away without closing.
setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.alive) { ws.terminate(); continue; }
    ws.alive = false;
    try { ws.ping(); } catch {}
  }
}, PING_MS).unref();

module.exports = { server };

if (require.main === module) {
  server.listen(PORT, () => log(`DuoDesk relay listening on :${PORT}${TOKEN ? ' (token required)' : ''}`));
}
