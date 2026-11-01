// TwinDesk — Copyright (C) 2026 inukaasith. GPL-3.0, see LICENSE.
// Connection page (was Overview): this PC's address and Connect by address, pairing a phone with a
// QR code, the computers and phones found nearby, the link itself (connect, take over, Wi-Fi
// Direct, a phone's hotspot), the phone's wireless debugging and what is paired. The start page
// until something is connected; then Overview (shared/ui-device.js) shows the device.
'use strict';

UI.tab({
  id: 'connection',
  order: 90,
  title: 'Connection',
  heading: 'Connection',
  icon: 'link',
  desc: '',
  color: 'linear-gradient(#5ac8fa, #007aff)',
  badge: (s) => (s.link.state === 'identity_changed' || (s.discovery && !s.discovery.on) || s.found.some((d) => d.invited) ? 'warn' : ''),
  build(body) {
    const { el, api } = UI;
    const WHERE = { driving: 'You’re using {there}', driven: '{There} is using {me}' };

    const linkLine = el('div', { class: 'hero-link' }, [el('span', { class: 'hero-pulse' })]);
    const linkText = el('div', { class: 'hero-link-text' });
    const pcName = el('div', { class: 'hero-name' });
    const macName = el('div', { class: 'hero-name' });
    const status = el('div', { class: 'hero-status' });
    // The session: Disconnect it; Connect again after one (or Take over while another device has it).
    const discBtn = UI.button('Disconnect', () => api.disconnect(), 'small');
    const againBtn = UI.button('Connect', () => api.connectAgain(), 'small primary');
    const sessionBtns = el('div', { class: 'hero-actions' }, [againBtn, discBtn]);
    const peerDev = el('div', { class: 'device mac' });
    const netCancel = UI.button('Cancel', () => api.netCancel(), 'small');
    netCancel.hidden = true;
    // A session on Bluetooth: onto a direct Wi-Fi link on request, until Back to Bluetooth.
    let wifiOn = false;
    const wifiBtn = UI.button('Connect with Wi-Fi Direct', () => api.netWifi(!wifiOn), 'small');
    wifiBtn.hidden = true;
    // A phone: its hotspot instead. It switches it on; its name and password here once (saved for it).
    const hotspotBtn = UI.button('Connect with hotspot', () => api.netWifi('hotspot'), 'small');
    hotspotBtn.hidden = true;
    const hsSsid = el('input', { type: 'text', placeholder: 'Hotspot name', autocomplete: 'off', spellcheck: false, attrs: { 'aria-label': 'Hotspot name' } });
    const hsPass = el('input', { type: 'password', placeholder: 'Password', autocomplete: 'off', attrs: { 'aria-label': 'Hotspot password' } });
    const hsJoin = UI.button('Join', () => api.netJoinHotspot({ ssid: hsSsid.value, pass: hsPass.value }), 'small primary');
    hsSsid.onkeydown = hsPass.onkeydown = (e) => { if (e.key === 'Enter') hsJoin.click(); };
    const hsForm = el('div', { class: 'hero-actions' }, [hsSsid, hsPass, hsJoin]);
    hsForm.hidden = true;
    let hsShown = false;
    const hero = el('div', { class: 'card hero' }, [
      el('div', { class: 'hero-devices' }, [
        el('div', { class: 'hero-device' }, [el('div', { class: 'device pc' }), pcName]),
        el('div', { class: 'hero-mid' }, [linkLine, linkText]),
        el('div', { class: 'hero-device' }, [peerDev, macName]),
      ]),
      status,
      hsForm,
      netCancel,
      el('div', { class: 'hero-actions' }, [wifiBtn, hotspotBtn]),
      sessionBtns,
    ]);

    // ---- this computer + connect by address (always visible) ----
    const addrVal = el('span', { class: 'value addr' });
    const copyBtn = UI.button('Copy', () => UI.state && api.copyText(UI.state.addresses[0] || ''), 'small');
    const addrRow = UI.row('{me}', '', [addrVal, copyBtn]);
    const ipInput = el('input', { type: 'text', placeholder: '192.168.1.20', autocomplete: 'off', spellcheck: false, attrs: { 'aria-label': 'Address' } });
    let asking = '';
    const ipBtn = UI.button('Connect', async () => {
      const v = ipInput.value.trim();
      if (!v || asking) return;
      asking = v;
      render();
      try { await api.connectAddress(v); } finally { asking = ''; render(); }
    }, 'small primary');
    ipInput.onkeydown = (e) => { if (e.key === 'Enter') ipBtn.click(); };
    const ipRow = UI.row('Connect by address', '', [ipInput, ipBtn]);

    // ---- found nearby (always visible) ----
    const discRow = UI.row('Can’t look for computers on this network.', '', [UI.button('Fix firewall', () => api.fixFirewall(), 'small')]);
    const foundList = el('div');
    // General's two Bluetooth switches, here too: who can turn up through Bluetooth.
    const bleSw = UI.switch((v) => api.setNet({ ble: v }), { label: 'Bluetooth with phones' });
    const blePcSw = UI.switch((v) => api.setNet({ blePc: v }), { label: 'Bluetooth with computers' });
    const bleRows = [UI.row('Bluetooth with phones', '', [bleSw]), UI.row('Bluetooth with computers', '', [blePcSw])];
    const refresh = UI.button('Refresh', () => { // the list empties and fills again with whoever answers
      api.refreshFound();
      refresh.disabled = true;
      refresh.textContent = 'Looking…';
      setTimeout(() => { refresh.disabled = false; refresh.textContent = 'Refresh'; }, 1500);
    }, 'small');

    // ---- a connected phone's wireless debugging (shared/ui-adb.js) and pairing by QR code (shared/ui-qrpair.js) ----
    const adb = UI.adbCard();
    const qrPair = UI.qrPairCard ? UI.qrPairCard() : null;

    const pairedList = el('div');
    body.append(
      UI.card('', [addrRow, ipRow]),
      UI.card('Found nearby', [discRow, foundList, ...bleRows], { actions: [refresh] }),
      ...(qrPair ? [qrPair.el] : []),
      hero,
      adb.el,
      UI.card('Paired', [pairedList]),
    );

    let last = null;
    let foundKey = '';
    let pairedKey = '';
    const render = () => last && update(last);

    // Each found row shows its own progress, set on the click itself and then followed from the link
    // (s.pairing, the session): Connecting… → Check the code → Waiting for Allow → Paired ✓, or the
    // reason and Retry. pending: dev id -> {kind: 'pair' | 'take', since}; done: dev id -> when it connected.
    const LIMIT_MS = 8000; // shared/pairlimit.js: connecting; Take over has no link state to time it
    const pending = {};
    const done = {};
    const redraw = () => { foundKey = ''; render(); };
    const go = (dev, kind, fn) => {
      pending[dev.id] = { kind, since: Date.now() };
      delete done[dev.id];
      redraw(); // this row changes now, before the request goes out
      fn();
      setTimeout(redraw, LIMIT_MS + 50);
    };
    const named = (text, dev) => String(text || '').replace(/\{name\}|\{Name\}/g, dev.name);
    // {busy, text} | {code} | {wait} | {fail, text} | {ok, text} | null
    function rowState(s, dev, online) {
      const p = s.pairing && s.pairing.role !== 'host' && (s.pairing.id ? s.pairing.id === dev.id : s.pairing.address === dev.address) ? s.pairing : null;
      const mine = pending[dev.id];
      if (online) {
        if (mine) {
          delete pending[dev.id];
          done[dev.id] = { at: Date.now(), kind: mine.kind };
          setTimeout(redraw, 1550);
        }
        const d = done[dev.id];
        return d && Date.now() - d.at < 1500 ? { ok: true, text: d.kind === 'pair' ? 'Paired ✓' : 'Connected' } : null;
      }
      if (p) {
        if (mine) mine.seen = true;
        if (p.phase === 'failed') {
          const fw = s.firewall && s.firewall.ok === false ? ' The firewall blocks DuoDesk here: Fix firewall above.' : '';
          return { fail: true, text: named(p.error, dev) + fw };
        }
        if (p.phase === 'code') return { code: p.code };
        if (p.phase === 'waiting') return { wait: true, text: 'Waiting for ' + dev.name + ' to allow…' };
        return { busy: true, text: 'Connecting…' };
      }
      if (!mine) return null;
      if (mine.seen) { // its pairing ended without connecting (Cancel)
        delete pending[dev.id];
        return null;
      }
      if (Date.now() - mine.since > LIMIT_MS) {
        return { fail: true, text: 'Can’t reach ' + dev.name + ' at ' + dev.address + '. Is DuoDesk open there, on the same Wi-Fi?' };
      }
      return { busy: true, text: mine.kind === 'take' ? 'Taking over…' : 'Connecting…' };
    }
    const update = (s) => {
      last = s;
      bleSw.set(!s.net || s.net.ble !== false);
      blePcSw.set(!!s.net && s.net.blePc === true);
      const l = s.link;
      const connected = l.state === 'connected';
      pcName.textContent = s.device.name;
      const p = UI.peer(s);
      macName.textContent = s.peer ? s.peer.name : 'The other computer';
      peerDev.className = 'device ' + UI.osClass(p.os);
      if (UI.phoneWall && p.phone) peerDev.style.setProperty('--phone-wall', UI.phoneWall);
      else peerDev.style.removeProperty('--phone-wall');
      linkLine.className = 'hero-link' + (connected ? ' up' : '');
      const ble = s.net && s.net.transport === 'ble';
      linkText.textContent = connected ? (l.rtt != null ? l.rtt + ' ms · ' : '') + UI.via(s)
        : s.pairing ? 'Pairing…' : s.paired ? 'Connecting…' : 'Not connected';
      const bad = l.state === 'identity_changed';
      status.textContent = bad ? 'This ' + p.kind + ' looks different now. Forget it and pair again.'
        : connected ? s.kvmState.message || (WHERE[s.input] || 'Connected').replace('{there}', p.the).replace('{There}', p.the.charAt(0).toUpperCase() + p.the.slice(1))
          : s.peer ? 'Open DuoDesk on ' + s.peer.name + '.'
            : 'Pick a computer below, or connect by address.';
      status.classList.toggle('bad', bad);
      // Disconnected here or by the other side, taken over, or in use by another device.
      const stopped = l.state === 'stopped';
      const busyBy = !connected && !stopped && l.busy;
      if (s.paired && !connected && (stopped || busyBy)) {
        status.textContent = stopped ? (l.message || 'Disconnected').replace(/\{Name\}/g, s.paired.macName) + '.' : busyBy + '.';
      }
      discBtn.hidden = !connected;
      againBtn.hidden = connected || !s.paired || !(stopped || busyBy);
      againBtn.textContent = busyBy || (stopped && l.message) ? 'Take over' : 'Connect';
      sessionBtns.hidden = discBtn.hidden && againBtn.hidden;
      // Moving the session to Wi-Fi (files, screens through Bluetooth: netlink.js)
      const n = s.net || {};
      const moving = { hotspot: 'Switch on {name}’s hotspot, then type its name and password here.', asking: 'Asking {name} for Wi-Fi…', hosting: 'Starting Wi-Fi for {name}…', joining: 'Joining ' + (n.ssid || 'Wi-Fi') + '…', joined: 'On Wi-Fi with {name}' }[n.state];
      if (connected && !bad && (moving || n.state === 'failed')) {
        status.textContent = n.state === 'failed' ? n.error || 'Wi-Fi didn’t come up' : moving;
        status.classList.toggle('bad', n.state === 'failed');
      }
      netCancel.hidden = !(connected && ['asking', 'hosting', 'joining', 'hotspot'].includes(n.state));
      hsForm.hidden = !(connected && n.state === 'hotspot');
      if (!hsForm.hidden && !hsShown) { // filled in once, not while typing
        hsSsid.value = n.hotspotSsid || '';
        hsPass.value = '';
        hsPass.placeholder = n.hotspotSaved ? 'Password (saved)' : 'Password';
        setTimeout(() => (n.hotspotSsid ? hsPass : hsSsid).focus(), 0);
      }
      hsShown = !hsForm.hidden;
      wifiOn = (n.why || []).includes('user') || !!n.linked; // made for the screen or files too
      wifiBtn.textContent = wifiOn ? 'Back to Bluetooth' : 'Connect with Wi-Fi Direct';
      wifiBtn.hidden = !connected || !netCancel.hidden || !(wifiOn || ble);
      hotspotBtn.hidden = !connected || !netCancel.hidden || wifiOn || !ble || !UI.isPhone(s);


      adb.update(s);
      if (qrPair) qrPair.update(s);

      // this computer
      addrVal.textContent = s.addresses.length ? s.addresses[0] : 'No network'; // The one the other computer can reach
      copyBtn.hidden = !s.addresses.length;
      const busy = !!s.pairing && s.pairing.phase !== 'failed';
      ipBtn.disabled = busy || !!asking;
      const failed = s.pairing && s.pairing.phase === 'failed';
      ipRow.setHint(asking ? 'Looking for DuoDesk at ' + asking + '…' : failed ? s.pairing.error : '');
      ipRow.hint.classList.toggle('bad', !asking && !!failed);

      // found nearby
      const d = s.discovery || { on: true, error: '' };
      const fwBad = s.firewall && s.firewall.ok === false && !s.firewall.checking;
      const blocked = !d.on || fwBad;
      discRow.hidden = !blocked;
      discRow.setHint(!d.on ? d.error + '. Connect by address still works.' : 'The firewall blocks it. Connect by address may still work.');
      // Paired both ways: the computer we connect to (s.paired) and the ones that connect to us (s.guests).
      const known = new Set([...(s.paired ? [s.paired.macId] : []), ...s.guests.map((g) => g.id)]);
      const live = s.peer && connected ? s.peer.id : '';
      const fk = JSON.stringify([s.found, [...known], live, busy, blocked, s.pairing, Object.keys(pending)]);
      if (fk !== foundKey) {
        foundKey = fk;
        let focus = null;
        const rows = s.found.map((dev) => {
          const isKnown = known.has(dev.id);
          const online = dev.id === live;
          const st = dev.os === 'android' ? null : rowState(s, dev, online); // a phone has its own card
          const pairIt = () => go(dev, 'pair', () => api.pair(dev.id));
          // A Mac hosts; with a PC or another Linux computer the one who clicks is the guest (L4).
          // A phone is asked to pair.
          const btn = online || isKnown || (st && !st.fail) ? null
            : UI.button(st ? 'Retry' : dev.os === 'mac' || dev.os === 'android' ? 'Pair' : 'Connect', pairIt, 'small' + (dev.invited || st ? ' primary' : ''));
          if (btn) btn.disabled = (busy && !st) || connected;
          // Paired: Take over (the computer we're a guest of: a takeover hello; one that connects to us:
          // invited, and its hello takes the session from whoever has it).
          const take = !online && isKnown && !(st && !st.fail) ? UI.button(st ? 'Retry' : 'Take over',
            () => go(dev, 'take', () => (s.paired && dev.id === s.paired.macId ? api.connectAgain() : api.connectGuest(dev.id))), 'small') : null;
          if (take) take.disabled = busy;
          const match = st && st.code ? UI.button('Codes match', () => api.confirmCode(), 'small primary') : null;
          if (btn && dev.invited && !busy) focus = btn;
          const hint = !st || st.ok ? (dev.relay ? 'Through the cloud relay' : dev.address) + (dev.invited ? ' · wants to connect' : '')
            : st.code ? 'Check the code: ' + st.code.slice(0, 3) + ' ' + st.code.slice(3) + ' (the same on ' + dev.name + '?)'
              : st.text;
          const r = UI.row(dev.name, hint, [
            st && (st.busy || st.wait) ? el('span', { class: 'spin', attrs: { 'aria-hidden': 'true' } }) : null,
            st && st.ok ? el('span', { class: 'pill good', text: st.text }) : online ? el('span', { class: 'pill good', text: 'Connected' }) : isKnown && !st ? el('span', { class: 'pill muted', text: 'Paired' }) : null,
            match, btn, take]);
          if (st && st.fail) r.hint.classList.add('bad');
          if (st && st.code) r.hint.classList.add('code-hint');
          r.querySelector('.text').prepend(UI.osIcon(dev.os));
          r.classList.add('with-ico');
          return r;
        });
        if (!rows.length && !blocked) rows.push(UI.row('Looking for computers…', 'Open DuoDesk on the other computer.'));
        foundList.replaceChildren(...rows);
        if (focus) focus.focus();
      }

      // paired
      const wk = s.wake || { peers: {} };
      const near = new Set(s.found.map((dev) => dev.id));
      const pk = JSON.stringify([s.paired, s.guests, live, [...near], l.state, Object.keys(wk.peers), wk.waking]);
      if (pk === pairedKey) return;
      pairedKey = pk;
      const all = [
        ...(s.paired ? [{ id: s.paired.macId, name: s.paired.macName, os: s.paired.os, hint: s.paired.address, forget: () => api.forget(), connect: () => api.connectAgain() }] : []),
        ...s.guests.map((g) => ({ id: g.id, name: g.name, os: g.os, hint: g.lastSeen ? 'Last seen ' + UI.ago(g.lastSeen) : '', forget: () => api.forgetGuest(g.id),
          connect: near.has(g.id) ? () => api.connectGuest(g.id) : null })),
      ];
      pairedList.replaceChildren(...(all.length ? all.map((x) => {
        const online = x.id === live;
        const waking = !online && wk.waking === x.id;
        // An offline computer that told us how to wake it gets Wake.
        const wakeBtn = !online && wk.peers[x.id] ? UI.button(waking ? 'Waking…' : 'Wake', () => api.wakePeer(x.id), 'small') : null;
        if (wakeBtn) wakeBtn.disabled = waking;
        const r = UI.row(x.name, online ? 'Connected' : waking ? 'Waking ' + x.name + '…' : x.hint, [
          online ? el('span', { class: 'pill good', text: 'Online' }) : null,
          wakeBtn,
          // Switch to it: whatever the session is now, it ends (paired, and nearby to be reached).
          !online && x.connect ? UI.button(live ? 'Switch' : 'Connect', x.connect, 'small') : null,
          UI.button('Forget', x.forget, 'small'),
        ]);
        r.querySelector('.text').prepend(UI.osIcon(x.os));
        r.classList.add('with-ico');
        return r;
      }) : [UI.row('Nothing paired yet', 'Pair with a computer in Found nearby.')]));
    };
    return update;
  },
});
