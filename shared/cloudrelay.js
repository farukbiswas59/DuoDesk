// DuoDesk cloud relay, the computer's side (Mac, PC and Linux). GPL-3.0, see LICENSE.
// Two computers that aren't on the same network (home and office) and share a relay code both
// dial out to a relay server (relay/server.js). Each then sees the other in Nearby like one on the
// same Wi-Fi, at 127.0.0.1:FWD_PORT: a TCP connection made there is carried through the relay to
// the other computer's DuoDesk port. The same goes for its TURN relay (FWD_TURN_PORT ->
// TURN_PORT), so WebRTC (screens, apps, sound, cameras) works too: both ends use both TURN
// servers over TCP (ice()), and the pair that meets on one of them carries the media.
//
// Sealing: every byte between the two computers is AES-256-GCM with keys made from the relay code
// (HKDF). The server routes by a room id made from the code and never sees the code itself; a
// stream's keys come from the code and both sides' fresh nonces, each direction its own key and
// counter, so a frame can't be read, changed, dropped, replayed or moved by the server. DuoDesk's
// own TLS (pinned) runs inside, as on a network.
//
// Pairing through the relay needs nobody at the other computer: knowing the code is the proof.
// The host side Allows a relay pairing by itself (owns(ctx)), the guest side confirms the code by
// itself (isRelayAddress), and an invite sent through the relay starts pairing over there.
//
//   const relay = new CloudRelay({ WebSocket: require('ws'), info: () => beacon, server: () => hostServer });
//   relay.configure({ on, url, code, token }); relay.view(); relay.list(); relay.ice();
// Events: 'change' (status, the other computer), 'invite' (device): it asked us to connect.
'use strict';

const net = require('net');
const crypto = require('crypto');
const { EventEmitter } = require('events');
const { TurnThread } = require('./turn.js');

const FWD_PORT = 47830; // here: the other computer's DuoDesk port
const TURN_PORT = 47831; // here: our TURN relay for media through the cloud relay
const FWD_TURN_PORT = 47832; // here: the other computer's TURN relay
const RECONNECT_MS = [1000, 2000, 5000, 10000, 30000];
const PING_MS = 15000;
const HELLO_MS = 30000; // our beacon again now and then (a name or port that changed)
const AWAKE_MS = 10 * 60000; // an HTTPS request this often: free hosts (Render) sleep without one
const NOTE_MAX_AGE_MS = 5 * 60000; // sealed notes older than this are dropped (replays)
const STREAM_TIMEOUT_MS = 15000;
const HIGH = 1024 * 1024; // bytes waiting on the relay socket before the TCP side is paused
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I

// ---- the code and its keys ----

// A new relay code: 25 letters and digits (125 bits) in five groups, e.g. K7M2Q-…
function newCode() {
  const bytes = crypto.randomBytes(25);
  let s = '';
  for (const b of bytes) s += ALPHABET[b & 31];
  return s.match(/.{5}/g).join('-');
}

// The code as typed (any case, spaces or dashes) -> the canonical form, or '' if too short.
function normCode(code) {
  const s = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return s.length >= 16 ? s : '';
}

function keysOf(code) {
  const ikm = Buffer.from(normCode(code), 'utf8');
  const k = (info, n) => Buffer.from(crypto.hkdfSync('sha256', ikm, 'duodesk-relay-v1', info, n));
  return {
    room: k('room', 16).toString('hex'),
    note: k('note', 32),
    stream: k('stream', 32),
    turn: k('turn', 12).toString('hex'),
  };
}

function seal(key, obj) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([c.update(JSON.stringify(obj), 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]).toString('base64');
}

function open(key, text) {
  try {
    const b = Buffer.from(text, 'base64');
    const d = crypto.createDecipheriv('aes-256-gcm', key, b.subarray(0, 12));
    d.setAuthTag(b.subarray(12, 28));
    return JSON.parse(Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8'));
  } catch {
    return null;
  }
}

// One direction of a stream: AES-256-GCM, the frame counter is the IV.
class Box {
  constructor(key) {
    this.key = key;
    this.n = 0n;
  }

  _iv() {
    const iv = Buffer.alloc(12);
    iv.writeBigUInt64BE(this.n++, 4);
    return iv;
  }

  seal(buf) {
    const c = crypto.createCipheriv('aes-256-gcm', this.key, this._iv());
    const body = Buffer.concat([c.update(buf), c.final()]);
    return Buffer.concat([body, c.getAuthTag()]);
  }

  open(buf) {
    if (buf.length < 16) throw new Error('short frame');
    const d = crypto.createDecipheriv('aes-256-gcm', this.key, this._iv());
    d.setAuthTag(buf.subarray(buf.length - 16));
    return Buffer.concat([d.update(buf.subarray(0, buf.length - 16)), d.final()]);
  }
}

const streamKey = (keys, sid, nd, na, dir) => Buffer.from(crypto.hkdfSync('sha256', keys.stream, Buffer.concat([Buffer.from(sid, 'hex'), nd, na]), dir, 32));

// The relay server's address as typed -> its wss:// base, or '' when it isn't one.
function normUrl(url) {
  let s = String(url || '').trim().replace(/\/+$/, '');
  if (!s) return '';
  if (!/^[a-z]+:\/\//i.test(s)) s = 'wss://' + s;
  s = s.replace(/^https:/i, 'wss:').replace(/^http:/i, 'ws:');
  try {
    const u = new URL(s);
    return /^wss?:$/.test(u.protocol) ? u.origin + u.pathname.replace(/\/+$/, '') : '';
  } catch {
    return '';
  }
}

class CloudRelay extends EventEmitter {
  // WebSocket: the ws package's class. info() -> this computer's beacon {id, name, os, port, fp}.
  // server() -> the DuoDesk host server here (for owns(ctx)), or null. ports: other local ports
  // ({fwd, turn, fwdTurn}), for two of these on one machine in a test.
  constructor({ WebSocket, info, server = () => null, ports = {} }) {
    super();
    this.p = { fwd: FWD_PORT, turn: TURN_PORT, fwdTurn: FWD_TURN_PORT, ...ports };
    this.WebSocket = WebSocket;
    this.info = info;
    this.server = server;
    this.cfg = { on: false, url: '', code: '', token: '' };
    this.state = 'off'; // 'off' | 'connecting' | 'online' | 'error'
    this.error = '';
    this.ws = null;
    this.agentId = crypto.randomBytes(8).toString('hex'); // this run's seat in the room
    this.peer = null; // {agent, info: {id, name, os, port, fp}, invited, seen}
    this.ports = new Set(); // local ports of our sockets to the DuoDesk server here (owns)
    this.streams = new Set();
    this.listeners = [];
    this.turn = null;
    this.attempt = 0;
    this.timers = {};
  }

  // {on, url, code, token}: what Settings says; starts, restarts (force: even when unchanged) or stops.
  configure(cfg, force = false) {
    const next = { on: !!cfg.on, url: normUrl(cfg.url), code: normCode(cfg.code) ? String(cfg.code).trim() : '', token: String(cfg.token || '').trim() };
    const same = ['on', 'url', 'code', 'token'].every((k) => next[k] === this.cfg[k]);
    this.cfg = next;
    if (same && !force && (this.state !== 'off' || !next.on)) return;
    this.stop();
    if (!next.on) return this._set('off', '');
    if (!next.url) return this._set('error', 'Enter the relay server’s address');
    if (!normCode(next.code)) return this._set('error', 'Enter the relay code (the same on both computers)');
    this.keys = keysOf(next.code);
    this._startLocal().then(() => this._connect(), (e) => this._set('error', e.message));
  }

  stop() {
    for (const t of Object.values(this.timers)) { clearTimeout(t); clearInterval(t); }
    this.timers = {};
    if (this.ws) { const ws = this.ws; this.ws = null; try { ws.terminate(); } catch {} }
    for (const s of this.streams) s.destroy();
    this.streams.clear();
    for (const l of this.listeners) l.close();
    this.listeners = [];
    if (this.turn) this.turn.stop();
    this.turn = null;
    if (this.peer) { this.peer = null; this.emit('change'); }
  }

  view() {
    const p = this.peer;
    return {
      on: this.cfg.on, url: this.cfg.url, code: this.cfg.code, token: this.cfg.token, state: this.state, error: this.error,
      peer: p && p.info ? { id: p.info.id, name: p.info.name, os: p.info.os } : null,
    };
  }

  // For discovery's extras: the other computer, as if it were on the network.
  list() {
    const p = this.peer;
    if (!p || !p.info) return [];
    const { id, name, os, fp } = p.info;
    return [{ id, name, os, address: '127.0.0.1', port: this.p.fwd, fp, relay: true, invited: !!p.invited }];
  }

  // Ask the other computer to connect to us (it pairs first when it hasn't).
  invite(id) {
    if (!this.peer || !this.peer.info || this.peer.info.id !== id) return false;
    this._note({ t: 'invite' });
    return true;
  }

  clearInvite(id) {
    if (this.peer && this.peer.info && this.peer.info.id === id && this.peer.invited) {
      this.peer.invited = false;
      this.emit('change');
    }
  }

  // A session on the DuoDesk server here that came through the relay.
  owns(ctx) {
    if (!ctx || !ctx.ws) return false;
    const s = ctx.ws._socket;
    return !!s && (s.remoteAddress === '127.0.0.1' || s.remoteAddress === '::ffff:127.0.0.1') && this.ports.has(s.remotePort);
  }

  // Our socket to a host goes through the relay (a guest's session: its media uses ice()).
  isRelaySocket(ws) {
    const s = ws && ws._socket;
    return !!s && this.isRelayAddress(String(s.remoteAddress || '').replace(/^::ffff:/, ''), s.remotePort);
  }

  // A host address that is the other computer through the relay (a guest's pairing target).
  isRelayAddress(address, port) {
    return address === '127.0.0.1' && Number(port) === this.p.fwd;
  }

  // WebRTC through the relay: both TURN servers, ours and the other computer's (one of the pairs
  // meets on each), over TCP only.
  ice() {
    if (!this.keys) return null;
    const cred = { username: 'td', credential: this.keys.turn };
    return {
      iceServers: [
        { urls: `turn:127.0.0.1:${this.p.turn}?transport=tcp`, ...cred },
        { urls: `turn:127.0.0.1:${this.p.fwdTurn}?transport=tcp`, ...cred },
      ],
      iceTransportPolicy: 'relay',
    };
  }

  // ---- the app's side, the same on every computer ----

  // Settings live in relay.json (store: the app's {read, write}).
  load(store) {
    this.store = store;
    this.configure(store.read('relay.json', null) || {});
  }

  // The card's calls (ipc 'relay'): {op: 'get' | 'set' (on, url, code, token) | 'newCode'}.
  handle(m) {
    const op = m && typeof m === 'object' ? m : {};
    if (op.op === 'newCode') return newCode();
    if (op.op === 'set') {
      const cfg = { ...this.cfg };
      for (const k of ['on', 'url', 'code', 'token']) if (k in op) cfg[k] = k === 'on' ? !!op[k] : String(op[k] || '').slice(0, 300);
      this.configure(cfg, true);
      if (this.store) this.store.write('relay.json', { on: this.cfg.on, url: this.cfg.url, code: this.cfg.code, token: this.cfg.token });
    }
    return this.view();
  }

  // The DuoDesk server here and its pairing: a session through the relay uses the TURN relays
  // (server.relayIce, read when it says hello), and pairing through it is Allowed here by itself.
  watchHost(server, pairing) {
    server.relayIce = (ctx) => (this.owns(ctx) ? this.ice() : null);
    pairing.on('change', () => {
      const p = pairing.pending;
      if (p && p.code && !p.allowed && this.owns(p.ctx)) setImmediate(() => pairing.pending === p && !p.allowed && pairing.respond(true));
    });
  }

  // Our pairing with a host through the relay: the codes are confirmed here by themselves.
  // pairState() -> {phase, address, port} | null; confirm() presses Codes match.
  autoConfirm(pairState, confirm) {
    const ps = pairState();
    if (ps && ps.phase === 'code' && this.isRelayAddress(ps.address, ps.port)) setImmediate(() => pairState() === ps && ps.phase === 'code' && confirm());
  }

  // ---- the room ----

  _set(state, error) {
    if (this.state === state && this.error === error) return;
    this.state = state;
    this.error = error;
    this.emit('change');
  }

  _url(path, q) {
    const u = new URL(this.cfg.url + path);
    for (const [k, v] of Object.entries(q)) u.searchParams.set(k, v);
    if (this.cfg.token) u.searchParams.set('token', this.cfg.token);
    return u.toString();
  }

  _connect() {
    clearTimeout(this.timers.reconnect);
    if (!this.cfg.on) return;
    if (this.state !== 'online') this._set('connecting', this.error);
    const ws = new this.WebSocket(this._url('/v1/agent', { room: this.keys.room, id: this.agentId }), { handshakeTimeout: 10000, perMessageDeflate: false });
    this.ws = ws;
    ws.on('open', () => {
      if (ws !== this.ws) return;
      this.attempt = 0;
      this._set('online', '');
      clearInterval(this.timers.ping);
      this.timers.ping = setInterval(() => { try { ws.ping(); } catch {} }, PING_MS);
      clearInterval(this.timers.hello);
      this.timers.hello = setInterval(() => this._note({ t: 'hello', info: this.info() }), HELLO_MS);
      clearInterval(this.timers.awake);
      const page = this.cfg.url.replace(/^ws/, 'http');
      this.timers.awake = setInterval(() => typeof fetch === 'function' && fetch(page).catch(() => {}), AWAKE_MS);
    });
    ws.on('message', (data, isBinary) => ws === this.ws && !isBinary && this._onRoom(String(data)));
    ws.on('unexpected-response', (_req, res) => {
      if (ws !== this.ws) return;
      this.error = res.statusCode === 401 ? 'The relay server refused the access token' : `The relay server answered ${res.statusCode}`;
    });
    ws.on('error', (e) => { if (ws === this.ws && !this.error) this.error = e.code || e.message; });
    ws.on('close', (code, reason) => {
      if (ws !== this.ws) return;
      this.ws = null;
      clearInterval(this.timers.ping);
      clearInterval(this.timers.hello);
      clearInterval(this.timers.awake);
      if (code === 4009) this.error = 'Two computers already use this relay code';
      else if (code === 4000) this.error = 'This relay code was opened again elsewhere';
      else if (!this.error) this.error = String(reason || '') || 'Lost the relay server';
      if (this.peer) { this.peer = null; this.emit('change'); }
      this._set('error', this.error);
      const delay = RECONNECT_MS[Math.min(this.attempt++, RECONNECT_MS.length - 1)];
      this.timers.reconnect = setTimeout(() => { this.error = ''; this._connect(); }, delay);
    });
  }

  _onRoom(text) {
    let m;
    try { m = JSON.parse(text); } catch { return; }
    if (!m) return;
    if (m.t === 'peers') {
      if (m.peers && m.peers[0]) this._join(m.peers[0]);
    } else if (m.t === 'join') {
      this._join(m.id);
    } else if (m.t === 'leave') {
      if (this.peer && this.peer.agent === m.id) {
        this.peer = null;
        this.emit('change');
      }
    } else if (m.t === 'msg' && this.peer && m.from === this.peer.agent) {
      const n = open(this.keys.note, m.d);
      if (!n || typeof n.ts !== 'number' || Math.abs(Date.now() - n.ts) > NOTE_MAX_AGE_MS) return; // not ours, or a replay
      this._onNote(n);
    }
  }

  _join(agent) {
    if (typeof agent !== 'string') return;
    this.peer = { agent, info: null, invited: false };
    this._note({ t: 'hello', info: this.info() });
  }

  _note(obj) {
    if (!this.peer || !this.ws || this.ws.readyState !== this.WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ t: 'msg', to: this.peer.agent, d: seal(this.keys.note, { ...obj, ts: Date.now() }) }));
  }

  _onNote(n) {
    const p = this.peer;
    if (n.t === 'hello' && n.info && typeof n.info.id === 'string') {
      const i = n.info;
      const info = { id: i.id.slice(0, 64), name: String(i.name || 'Computer').slice(0, 64), os: String(i.os || ''), port: Number(i.port) || 47800, fp: String(i.fp || '') };
      const first = !p.info;
      const changed = first || ['id', 'name', 'os', 'port', 'fp'].some((k) => p.info[k] !== info[k]);
      p.info = info;
      if (first) this._note({ t: 'hello', info: this.info() }); // they may have joined before us
      if (changed) this.emit('change');
    } else if (n.t === 'invite' && p.info) {
      p.invited = true;
      this.emit('change');
      this.emit('invite', this.list()[0]);
    } else if (n.t === 'open' && p.info && /^[0-9a-f]{32}$/.test(n.sid)) {
      // Only DuoDesk's own port and our TURN relay are ever reachable through the relay.
      const port = n.what === 'turn' ? this.p.turn : n.what === 'duodesk' ? (this.info().port || 47800) : 0;
      if (port) this._accept(n.sid, port, n.what === 'duodesk');
    }
  }

  // ---- streams ----

  async _startLocal() {
    const listen = (port, what) => new Promise((resolve, reject) => {
      const srv = net.createServer({ allowHalfOpen: true }, (sock) => this._dial(sock, what));
      srv.once('error', (e) => reject(new Error(e.code === 'EADDRINUSE' ? `Port ${port} is in use` : e.message)));
      srv.listen(port, '127.0.0.1', () => { srv.removeAllListeners('error'); srv.on('error', () => {}); resolve(srv); });
    });
    this.listeners.push(await listen(this.p.fwd, 'duodesk'));
    this.listeners.push(await listen(this.p.fwdTurn, 'turn'));
    const turn = new TurnThread({ port: this.p.turn, password: this.keys.turn });
    try {
      await turn.start();
      this.turn = turn;
    } catch (e) {
      console.error(`[relay] TURN: ${e.message}`); // screens won't work, the rest still does
    }
  }

  // A connection to 127.0.0.1:FWD_PORT (or the TURN one): to the other computer.
  _dial(sock, what) {
    if (!this.peer || !this.peer.info || this.state !== 'online') return sock.destroy();
    const sid = crypto.randomBytes(16).toString('hex');
    this._note({ t: 'open', sid, what });
    this._stream(sock, sid, true);
  }

  // The other computer opened one: connect it to our port.
  _accept(sid, port, own) {
    const sock = net.connect({ host: '127.0.0.1', port, allowHalfOpen: true });
    sock.on('connect', () => {
      if (own) {
        sock.ownPort = sock.localPort;
        this.ports.add(sock.localPort);
      }
    });
    this._stream(sock, sid, false);
  }

  // Join a local TCP socket and a stream socket at the relay, sealed both ways.
  _stream(sock, sid, dialer) {
    sock.pause();
    sock.setNoDelay(true);
    const ws = new this.WebSocket(this._url('/v1/stream', { room: this.keys.room, sid }), { handshakeTimeout: 10000, perMessageDeflate: false });
    const mine = crypto.randomBytes(16);
    let tx = null;
    let rx = null;
    let done = false;
    const s = {
      destroy: () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        this.streams.delete(s);
        if (sock.ownPort) setTimeout(() => this.ports.delete(sock.ownPort), 1000);
        sock.destroy();
        // What is queued for the relay still goes (a close follows it); a stuck socket goes anyway.
        if (ws.readyState === this.WebSocket.OPEN) {
          ws.close();
          setTimeout(() => ws.terminate(), 5000).unref();
        } else {
          try { ws.terminate(); } catch {}
        }
      },
    };
    this.streams.add(s);
    const timer = setTimeout(() => !tx && s.destroy(), STREAM_TIMEOUT_MS);
    ws.on('message', (data, isBinary) => {
      if (!isBinary) {
        if (String(data) === 'ready') ws.send(mine, { binary: true }); // our nonce, now that both are there
        return;
      }
      if (!tx) { // their nonce: the keys, then bytes may flow
        if (data.length !== 16) return s.destroy();
        const [nd, na] = dialer ? [mine, data] : [data, mine];
        tx = new Box(streamKey(this.keys, sid, nd, na, dialer ? 'd2a' : 'a2d'));
        rx = new Box(streamKey(this.keys, sid, nd, na, dialer ? 'a2d' : 'd2a'));
        clearTimeout(timer);
        sock.resume();
        return;
      }
      let plain;
      try { plain = rx.open(data); } catch { return s.destroy(); } // not sealed with our code
      if (!plain.length) { // their end of the stream (TCP half-close); ours may still go on
        theyEnded = true;
        sock.end();
        return finish();
      }
      if (!sock.write(plain) && ws._socket) {
        ws._socket.pause();
        sock.once('drain', () => ws._socket && ws._socket.resume());
      }
    });
    sock.on('data', (buf) => {
      if (!tx || ws.readyState !== this.WebSocket.OPEN) return;
      ws.send(tx.seal(buf), { binary: true });
      if (ws.bufferedAmount > HIGH) {
        sock.pause();
        const wait = () => (done ? null : ws.bufferedAmount > HIGH / 4 ? setTimeout(wait, 5) : sock.resume());
        setTimeout(wait, 5);
      }
    });
    // Both ends done (an empty sealed frame each way): the stream closes.
    let weEnded = false;
    let theyEnded = false;
    const finish = () => weEnded && theyEnded && ws.readyState === this.WebSocket.OPEN && ws.close();
    sock.on('end', () => {
      weEnded = true;
      if (tx && ws.readyState === this.WebSocket.OPEN) ws.send(tx.seal(Buffer.alloc(0)), { binary: true });
      finish();
    });
    sock.on('error', () => s.destroy());
    sock.on('close', () => s.destroy());
    ws.on('error', () => s.destroy());
    ws.on('close', () => s.destroy());
  }
}

module.exports = { CloudRelay, newCode, normCode, normUrl, keysOf, FWD_PORT, TURN_PORT, FWD_TURN_PORT };
