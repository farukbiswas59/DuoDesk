// DuoDesk — GPL-3.0, see LICENSE.
// General › Cloud relay (Mac, PC and Linux): reach a computer on another network (home from the
// office) through a relay server both dial out to (shared/cloudrelay.js, relay/). Both computers get
// the same relay code: it is the key everything is sealed with, and the proof that lets pairing
// through the relay finish with nobody at the other computer. Once both are online, the other one
// is in Nearby like a computer on this network. Only where the app has it (api.relay).
// UI.relayCard() → {el, update(state)}
'use strict';

UI.relayCard = () => {
  const { el, api } = UI;
  if (!api.relay) return null;
  const input = (placeholder, label, type = 'text') => {
    const i = el('input', { type, placeholder, autocomplete: 'off', spellcheck: false, attrs: { 'aria-label': label } });
    i.oninput = () => { i.dirty = true; };
    i.onkeydown = (e) => { if (e.key === 'Enter') saveBtn.click(); };
    return i;
  };
  const sw = UI.switch((v) => api.relay({ op: 'set', on: v }).then(show), { label: 'Cloud relay' });
  const url = input('your-relay.onrender.com', 'Relay server');
  const code = input('XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', 'Relay code', 'password');
  const token = input('Only if the server has one', 'Access token', 'password');
  const reveal = UI.button('Show', () => {
    code.type = code.type === 'password' ? 'text' : 'password';
    reveal.textContent = code.type === 'password' ? 'Show' : 'Hide';
  }, 'small');
  const newBtn = UI.button('New code', async () => {
    code.value = await api.relay({ op: 'newCode' });
    code.dirty = true;
    code.type = 'text';
    reveal.textContent = 'Hide';
  }, 'small');
  const copyBtn = UI.button('Copy', () => code.value && api.copyText(code.value), 'small');
  const saveBtn = UI.button('Save and connect', async () => {
    const v = await api.relay({ op: 'set', on: true, url: url.value, code: code.value, token: token.value });
    for (const i of [url, code, token]) i.dirty = false;
    show(v);
  }, 'small primary');
  const statusRow = UI.row('Status', '');
  const status = el('span', { class: 'value' });
  statusRow.querySelector('.controls').append(status);

  const card = UI.card('Cloud relay', [
    UI.row('Reach a computer on another network', 'Home from the office: both computers connect out to your relay server, so no ports to open. Everything is encrypted end to end with the relay code', [sw]),
    UI.row('Relay server', 'The address you deployed relay/ to (see docs/cloud-relay.md)', [url]),
    UI.row('Relay code', 'The same on both computers. Keep it secret like a password: it lets a computer pair with this one', [code, reveal, newBtn, copyBtn]),
    UI.row('Access token', 'Optional: the RELAY_TOKEN set on the server', [token]),
    UI.row('', '', [saveBtn]),
    statusRow,
  ]);

  function show(r) {
    if (!r) return;
    sw.set(r.on);
    for (const [i, v] of [[url, r.url], [code, r.code], [token, r.token]]) if (!i.dirty && document.activeElement !== i) i.value = v || '';
    let text = 'Off';
    let hint = '';
    if (r.on && r.state === 'connecting') text = 'Connecting…';
    else if (r.on && r.state === 'online' && r.peer) {
      text = `Online with ${r.peer.name}`;
      hint = `${r.peer.name} is in Nearby on the Connection page: pair or connect there. Pairing through the relay needs nobody at the other computer.`;
    } else if (r.on && r.state === 'online') {
      text = 'Online';
      hint = 'Waiting for your other computer: turn on Cloud relay there with the same server and code.';
    } else if (r.on && r.state === 'error') {
      text = 'Not connected';
      hint = r.error || '';
    }
    status.textContent = text;
    statusRow.setHint(hint);
    statusRow.hint.classList.toggle('bad', r.on && r.state === 'error');
  }

  api.relay({ op: 'get' }).then(show);
  return {
    el: card,
    update(s) {
      if (s && s.relay) show(s.relay);
    },
  };
};
