// TwinDesk — Copyright (C) 2026 inukaasith. GPL-3.0, see LICENSE.
// General tab, in sections: Startup (start with Windows, received files), Appearance (the switching
// popup, the phone's wallpaper, media controls), Overview (what it shows), Network and Bluetooth,
// Permissions (firewall self-check + Fix, Bluetooth, Location) and This computer (its name, the
// helper, the virtual display driver for Extend).
'use strict';

UI.tab({
  id: 'general',
  order: 100,
  title: 'General',
  color: 'linear-gradient(#aeaeb2, #636366)',
  desc: '',
  bottom: true,
  badge: (s) => (s.firewall && s.firewall.ok === false && !s.firewall.checking ? 'warn' : ''),
  build(body) {
    const { el, api } = UI;
    const startup = UI.switch((v) => api.setStartup(v), { label: 'Start with Windows' });
    // Received files (shared/received.js): where files sent here and saved from a phone go.
    const recvChange = UI.button('Change…', () => api.chooseReceivedFolder(), 'small');
    const recvReset = UI.button('Downloads', () => api.resetReceivedFolder(), 'small');
    const recvOpen = UI.button('Open', () => api.openReceivedFolder(), 'small');
    const recvRow = UI.row('Received files', '', [recvOpen, recvReset, recvChange]);
    const hudSw = UI.switch((v) => api.setApp({ hud: v }), { label: 'Show a popup when switching' });
    const fwPill = el('span', { class: 'pill' });
    const fwCheck = UI.button('Check again', () => api.checkFirewall(), 'small');
    const fwFix = UI.button('Fix', () => api.fixFirewall(), 'small primary');
    const fwRow = UI.row('Firewall', '', [fwPill, fwCheck, fwFix]);
    // (as the Mac): wake is a switch; Send to sends files from Explorer.
    const wakeSw = UI.switch((v) => api.setWake(v), { label: 'Wake from the network' });
    const wakeRow = UI.row('Let the other computer wake {me}', '', [wakeSw]);
    const sendToRow = UI.row('DuoDesk in Send to', '');
    const helperPill = el('span', { class: 'pill' });
    const helperRow = UI.row('Mouse and keyboard helper', '', [helperPill]);
    const vddPill = el('span', { class: 'pill' });
    const vddInstall = UI.button('Install', () => api.installVdd(), 'small primary');
    const vddRow = UI.row('Virtual display driver', '', [vddPill, vddInstall]); // Share screen › Extend (vdd.js)
    // Bluetooth when not on the same network: with phones (on unless switched off), with computers (off unless switched on).
    const bleSw = UI.switch((v) => api.setNet({ ble: v }), { label: 'Bluetooth with phones' });
    const bleRow = UI.row('Bluetooth with phones', '', [bleSw]);
    const blePcSw = UI.switch((v) => api.setNet({ blePc: v }), { label: 'Bluetooth with computers' });
    const blePcRow = UI.row('Bluetooth with computers', '', [blePcSw]);
    // Bluetooth off altogether while the session is on the same Wi-Fi (blepolicy.js wifiQuiet).
    const bleWifiSw = UI.switch((v) => api.setNet({ bleWifiOff: v }), { label: 'Turn off Bluetooth on Wi-Fi connections' });
    const bleWifiRow = UI.row('Turn off Bluetooth on Wi-Fi connections', '', [bleWifiSw]);
    // What Windows has to allow, in one place (each is also asked for where a feature needs it).
    const btPill = el('span', { class: 'pill' });
    const btRow = UI.row('Bluetooth', 'For a phone or computer that isn’t on this network', [btPill, UI.button('Open', () => api.openBluetoothSettings(), 'small')]);
    const locRow = UI.row('Location', 'To join a phone’s or computer’s Wi-Fi Direct (Windows shows Wi-Fi networks only with it)', [UI.button('Open', () => api.netLocation(), 'small')]);
    const media = UI.mediaControlsRow(); // a phone's media controls on the Phone page (shared/ui-nowplaying.js)
    const deviceName = el('span', { class: 'value' });
    const deviceRow = UI.row('Computer name', 'How other computers see this one', [deviceName]);

    // Appearance: the phone's wallpaper behind it here (settings.phone.wallpaper, was on the Phone page).
    const wallSw = UI.switch((v) => api.setPhone({ wallpaper: v }), { label: 'Show the phone’s wallpaper' });
    const wallRow = UI.row('Show the phone’s wallpaper', 'On its tile and Overview. DuoDesk on the phone reads it once wireless debugging is set up', [wallSw]);
    // Overview: what it shows (settings.ui.overview).
    const parts = [['media', 'Now playing', 'What plays on the phone, with its controls'], ['qs', 'Quick actions', 'Wi-Fi, Bluetooth, torch, Do not disturb and more, with volume and ringer'],
      ['notifs', 'Latest notifications', 'The newest few, with Copy for one-time codes'], ['apps', 'Most used apps', 'The phone’s most used apps this week'],
      ['clipboard', 'Clipboard', 'Its recent items, while Clipboard is on'], ['files', 'Send files', 'A drop zone that sends files to the device']];
    const partSw = {};
    const partRows = parts.map(([k, label, hint]) => {
      partSw[k] = UI.switch((v) => api.setOverview && api.setOverview({ [k]: v }), { label });
      return UI.row(label, hint, [partSw[k]]);
    });

    const relay = UI.relayCard ? UI.relayCard() : null; // Cloud relay (shared/ui-relay.js)
    body.append(
      UI.card('Startup', [
        UI.row('Start with Windows', 'DuoDesk waits in the tray', [startup]),
        recvRow,
      ]),
      UI.card('Appearance', [
        UI.row('Show a popup when switching', 'When the mouse and keyboard move between devices', [hudSw]),
        wallRow,
        media.el,
      ]),
      UI.card('Overview', partRows),
      UI.card('Network and Bluetooth', [bleRow, blePcRow, bleWifiRow, wakeRow, sendToRow]),
      ...(relay ? [relay.el] : []),
      UI.card('Permissions', [fwRow, btRow, locRow]),
      UI.card('This computer', [deviceRow, helperRow, vddRow]),
    );

    return (s) => {
      media.update(s);
      if (relay) relay.update(s);
      wallSw.set(!s.phone || !s.phone.settings || s.phone.settings.wallpaper !== false);
      const ov = (s.ui && s.ui.overview) || {};
      for (const k of Object.keys(partSw)) partSw[k].set(ov[k] !== false);
      startup.set(s.startup);
      hudSw.set(s.app.hud);
      const f = s.files || {};
      recvReset.hidden = !f.receivedFolder;
      recvRow.setHint((f.receivedFolder && f.received !== f.receivedFolder ? f.receivedFolder + ' isn’t there now: Downloads meanwhile. ' : (f.received || 'Downloads') + ' · ')
        + 'Files sent to {me} from another computer or a phone, and what’s saved from a phone’s Files and Photos');
      const fw = s.firewall || {};
      fwPill.textContent = fw.checking ? 'Checking…' : fw.ok ? 'OK' : fw.ok === false ? 'Needs a fix' : '';
      fwPill.className = 'pill ' + (fw.checking ? 'muted' : fw.ok ? 'good' : 'bad');
      fwRow.setHint(fw.ok === false ? fw.message || '' : '');
      fwCheck.disabled = !!fw.checking;
      fwFix.hidden = fw.checking || fw.ok !== false || !!fw.error;
      const w = s.wake || {};
      wakeSw.set(w.on === true);
      wakeSw.disable(!w.checked || w.on == null || !!w.busy);
      wakeRow.setHint(w.error ? w.error : w.busy ? 'Changing…' : !w.checked ? 'Checking…'
        : w.on == null ? 'No network adapter here can wake {me}'
          : 'Its network adapter wakes {me} on a magic packet. Asks for administrator rights to change it');
      sendToRow.setHint(s.peer ? 'Right-click files › Send to › ' + s.peer.name + ' (DuoDesk)' : 'Shows up once a computer is paired');
      const h = s.kvmState.helper;
      helperPill.textContent = h ? (h === 'starting' ? 'Starting…' : 'Not running') : 'Running';
      helperPill.className = 'pill ' + (h ? (h === 'starting' ? 'muted' : 'bad') : 'good');
      helperRow.setHint(h && h !== 'starting' ? h : '');
      const v = s.pcScreen.vdd;
      vddPill.textContent = !v.checked ? 'Checking…' : v.busy === 'install' ? 'Installing…' : v.busy === 'remove' ? 'Removing…' : v.installed ? 'Installed' : 'Not installed';
      vddPill.className = 'pill ' + (!v.checked || v.busy ? 'muted' : v.installed ? 'good' : 'bad');
      vddInstall.hidden = !v.checked || v.installed;
      vddInstall.disabled = !!v.busy;
      vddRow.setHint(v.message ? v.message : v.installed ? 'Adds the extra screen for Share screen › Extend'
        : 'Needed for Share screen › Extend. Asks for administrator rights once');
      const n = s.net || {};
      const radio = n.radio === 'off' ? 'Bluetooth is off in Windows settings'
        : n.radio === 'unsupported' ? 'This PC’s Bluetooth can’t do it (needs Bluetooth LE)' : '';
      bleSw.set(n.ble !== false);
      bleRow.setHint(n.ble === false ? 'Only phones on this network or a USB cable connect'
        : radio || 'A phone nearby connects through Bluetooth; files and screens switch to Wi-Fi Direct for a moment');
      blePcSw.set(n.blePc === true);
      bleWifiSw.set(n.bleWifiOff !== false);
      bleWifiRow.setHint(n.bleWifiOff === false ? 'Bluetooth stays on beside the Wi-Fi, the way back if it drops'
        : n.bleOff ? 'Off now: the session is on the same Wi-Fi. Bluetooth comes back when it ends'
          : 'On the same Wi-Fi network (not Wi-Fi Direct), Bluetooth goes off until the session ends. With a computer, phones can’t find this one meanwhile');
      blePcRow.setHint(n.blePc !== true ? 'Only computers on this network connect'
        : radio || 'A computer nearby connects through Bluetooth; files and screens switch to Wi-Fi Direct for a moment');
      btPill.textContent = n.radio === 'off' ? 'Off' : n.radio === 'unsupported' ? 'Not supported' : n.radio ? 'On' : 'Unknown';
      btPill.className = 'pill ' + (n.radio === 'off' || n.radio === 'unsupported' ? 'bad' : n.radio ? 'good' : 'muted');
      deviceName.textContent = s.device.name;
    };
  },
});
