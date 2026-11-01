// Two CloudRelays (shared/cloudrelay.js) on one machine through a local relay server: they find
// each other, invite, and carry TCP both ways byte for byte; a wrong code sees nobody.
'use strict';

const assert = require('assert');
const net = require('net');
const crypto = require('crypto');
const WebSocket = require('ws');
const { server } = require('../server.js');
const { CloudRelay, newCode } = require('../../shared/cloudrelay.js');

const wait = (cond, ms = 5000) => new Promise((resolve, reject) => {
  const t0 = Date.now();
  const tick = () => (cond() ? resolve() : Date.now() - t0 > ms ? reject(new Error('timed out')) : setTimeout(tick, 20));
  tick();
});

// A stand-in for DuoDesk's port: answers each connection with the sha256 of what it got.
function hashServer() {
  const ports = [];
  const srv = net.createServer((s) => {
    ports.push(s.remotePort);
    const h = crypto.createHash('sha256');
    s.on('data', (b) => h.update(b));
    s.on('end', () => s.end(h.digest('hex')));
  });
  return new Promise((r) => srv.listen(0, '127.0.0.1', () => r({ srv, port: srv.address().port, ports })));
}

function send(port, buf) {
  return new Promise((resolve, reject) => {
    const s = net.connect(port, '127.0.0.1', () => s.end(buf));
    let out = '';
    s.on('data', (b) => { out += b; });
    s.on('end', () => resolve(out));
    s.on('error', reject);
  });
}

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const url = `ws://127.0.0.1:${server.address().port}`;
  const code = newCode();
  const hA = await hashServer();
  const hB = await hashServer();
  const mk = (name, h, base) => new CloudRelay({
    WebSocket,
    info: () => ({ id: name.toLowerCase() + '-id', name, os: 'linux', port: h.port, fp: 'AA' }),
    ports: { fwd: base, turn: base + 1, fwdTurn: base + 2 },
  });
  const a = mk('Home', hA, 48830);
  const b = mk('Office', hB, 49830);
  a.configure({ on: true, url, code });
  b.configure({ on: true, url, code });
  await wait(() => a.list().length && b.list().length);
  assert.strictEqual(a.list()[0].name, 'Office');
  assert.strictEqual(b.list()[0].name, 'Home');
  assert.strictEqual(b.list()[0].port, 49830);
  console.log('ok  they see each other');

  let invited = null;
  a.on('invite', (d) => { invited = d; });
  b.invite('home-id');
  await wait(() => invited);
  assert.strictEqual(invited.id, 'office-id');
  console.log('ok  invite');

  for (const [from, to, h] of [[b, 'home', hA], [a, 'office', hB]]) {
    const data = crypto.randomBytes(20 * 1024 * 1024);
    const t0 = Date.now();
    const got = await send(from.p.fwd, data);
    assert.strictEqual(got, crypto.createHash('sha256').update(data).digest('hex'));
    console.log(`ok  20 MB to ${to} intact (${Date.now() - t0} ms)`);
  }
  // The accepting side knows the sockets it made to its DuoDesk port (owns), while they are open.
  const held = net.connect(b.p.fwd, '127.0.0.1');
  const n0 = hA.ports.length;
  await wait(() => hA.ports.length > n0);
  assert.ok(a.ports.has(hA.ports[hA.ports.length - 1]));
  held.destroy();
  console.log('ok  relay sockets are recognised');
  const many = await Promise.all([...Array(8)].map((_, i) => send(b.p.fwd, Buffer.from('x'.repeat(i * 1000 + 1)))));
  assert.strictEqual(new Set(many).size, 8);
  console.log('ok  8 streams at once');

  const c = mk('Stranger', hA, 50830);
  c.configure({ on: true, url, code: newCode() });
  await wait(() => c.state === 'online');
  await new Promise((r) => setTimeout(r, 300));
  assert.strictEqual(c.list().length, 0);
  console.log('ok  a different code sees nobody');

  const ice = a.ice();
  assert.strictEqual(ice.iceTransportPolicy, 'relay');
  assert.strictEqual(ice.iceServers[0].credential, b.ice().iceServers[0].credential);
  console.log('ok  ice');

  b.configure({ on: false });
  await wait(() => !a.list().length);
  console.log('ok  leaving is seen');
  for (const r of [a, b, c]) r.stop();
  server.close();
  process.exit(0);
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
