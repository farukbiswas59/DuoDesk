// WebRTC through the cloud relay, as DuoDesk uses it: run with Electron
//   ../mac/node_modules/.bin/electron relay/test/media.js
// Two CloudRelays ("home" and "office") meet at a local relay server. A video goes from office to
// home first with office's WebRTC reaching home's TURN relay only through the tunnel (the path
// screens take when the office computer is far away), then with the full ice() on both sides.
'use strict';

const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const WebSocket = require(path.join(__dirname, '..', 'node_modules', 'ws'));
const { server } = require('../server.js');
const { CloudRelay, newCode } = require('../../shared/cloudrelay.js');

const wait = (cond, ms = 8000) => new Promise((resolve, reject) => {
  const t0 = Date.now();
  const tick = () => (cond() ? resolve() : Date.now() - t0 > ms ? reject(new Error('timed out')) : setTimeout(tick, 20));
  tick();
});

const PAGE = `<!doctype html><meta charset="utf-8"><body><script>
const { ipcRenderer } = require('electron');
ipcRenderer.on('run', async (_e, { iceSend, iceRecv }) => {
  try {
    const c = document.createElement('canvas'); c.width = 320; c.height = 240;
    const g = c.getContext('2d'); let n = 0;
    setInterval(() => { g.fillStyle = 'hsl(' + (n++ * 7 % 360) + ',80%,50%)'; g.fillRect(0, 0, 320, 240); }, 33);
    const stream = c.captureStream(30);
    const a = new RTCPeerConnection(iceSend), b = new RTCPeerConnection(iceRecv);
    a.onicecandidate = (e) => e.candidate && b.addIceCandidate(e.candidate);
    b.onicecandidate = (e) => e.candidate && a.addIceCandidate(e.candidate);
    a.addTrack(stream.getVideoTracks()[0], stream);
    const frames = new Promise((res) => { b.ontrack = (e) => { const v = document.createElement('video'); v.muted = true; v.srcObject = e.streams[0]; v.play(); res(v); }; });
    await a.setLocalDescription(await a.createOffer());
    await b.setRemoteDescription(a.localDescription);
    await b.setLocalDescription(await b.createAnswer());
    await a.setRemoteDescription(b.localDescription);
    const v = await frames;
    const t0 = Date.now();
    while (Date.now() - t0 < 15000) {
      const st = [...(await b.getStats()).values()];
      const inb = st.find((s) => s.type === 'inbound-rtp' && s.kind === 'video');
      const pair = st.find((s) => s.type === 'candidate-pair' && s.state === 'succeeded' && s.nominated);
      const local = pair && st.find((s) => s.id === pair.localCandidateId);
      if (inb && inb.framesDecoded > 30) {
        ipcRenderer.send('done', { ok: true, frames: inb.framesDecoded, width: v.videoWidth, rtt: pair && pair.currentRoundTripTime, type: local && local.candidateType });
        a.close(); b.close(); return;
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    ipcRenderer.send('done', { ok: false, error: 'no frames', state: a.connectionState + '/' + b.connectionState });
  } catch (e) { ipcRenderer.send('done', { ok: false, error: String(e) }); }
});
ipcRenderer.send('ready');
</script>`;

app.whenReady().then(async () => {
  try {
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    const url = `ws://127.0.0.1:${server.address().port}`;
    const code = newCode();
    const mk = (name, base) => new CloudRelay({ WebSocket, info: () => ({ id: name, name, os: 'linux', port: 1, fp: '' }), ports: { fwd: base, turn: base + 1, fwdTurn: base + 2 } });
    const home = mk('home', 48830);
    const office = mk('office', 49830);
    home.configure({ on: true, url, code });
    office.configure({ on: true, url, code });
    await wait(() => home.list().length && office.list().length && home.turn && office.turn);

    const win = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true, contextIsolation: false, backgroundThrottling: false } });
    const ready = new Promise((r) => ipcMain.once('ready', r));
    await win.loadURL('data:text/html;base64,' + Buffer.from(PAGE).toString('base64'));
    await ready;
    const run = (iceSend, iceRecv) => new Promise((r) => { ipcMain.once('done', (_e, v) => r(v)); win.webContents.send('run', { iceSend, iceRecv }); });

    // Office reaches home's TURN only through the tunnel; home uses it directly.
    const oi = office.ice();
    const hi = home.ice();
    const tunnelOnly = await run({ ...oi, iceServers: [oi.iceServers[1]] }, { ...hi, iceServers: [hi.iceServers[0]] });
    console.log(tunnelOnly.ok ? 'ok ' : 'FAIL', ' video office -> home through the tunnel', JSON.stringify(tunnelOnly));
    const both = await run(oi, hi);
    console.log(both.ok ? 'ok ' : 'FAIL', ' video with the full ice() on both sides', JSON.stringify(both));
    home.stop(); office.stop();
    app.exit(tunnelOnly.ok && both.ok ? 0 : 1);
  } catch (e) {
    console.error('FAIL', e);
    app.exit(1);
  }
});
