# Cloud relay: your home computer from the office

DuoDesk normally needs both computers on the same network, a cable or Bluetooth. **Cloud relay**
connects two computers that are anywhere: your home laptop and your office computer each connect
*out* to a small relay server you run, and DuoDesk works between them as if they sat side by side.
Pair, see and control the other screen, open its apps, use one mouse and keyboard, and share the
clipboard, files and sound.

- **No ports to open, no VPN.** Both computers only make an outgoing HTTPS connection, which office
  networks allow.
- **End-to-end encrypted.** Every byte is sealed with AES-256-GCM, using keys made from a **relay
  code** that only your two computers know. DuoDesk's own pinned TLS session runs inside that. The
  server sees neither the code nor what you send: it only passes sealed bytes between the two.
- **Works on Mac, Windows and Linux**, in any combination.

## 1. Run the relay server (once)

The server is the `relay/` folder: one small Node.js file. Pick one way to run it.

**Render** (free tier available)

1. Fork this repository on GitHub.
2. On [render.com](https://render.com): **New › Blueprint**, and pick your fork. Render reads
   `render.yaml` and creates the `duodesk-relay` web service.
3. When it's live, note its address, such as `duodesk-relay-abcd.onrender.com`, and the
   generated `RELAY_TOKEN` under **Environment**.

Free Render services go to sleep after 15 minutes without requests. DuoDesk sends one every 10
minutes while it's connected, and a sleeping server wakes within about a minute when the computers
reconnect. For an always-on relay, use Render's Starter plan or Fly.io.

**Fly.io**

```sh
cd relay
fly launch --copy-config --name <your-relay-name> --no-deploy
fly secrets set RELAY_TOKEN=$(openssl rand -hex 24)
fly deploy
```

The address is `<your-relay-name>.fly.dev`.

**Your own server** (any Linux VPS with Docker, behind HTTPS)

```sh
docker build -t duodesk-relay relay
docker run -d --restart=always -p 8080:8080 -e RELAY_TOKEN=<something long> duodesk-relay
```

Put it behind a reverse proxy that serves HTTPS and passes WebSockets (Caddy:
`relay.example.com { reverse_proxy localhost:8080 }`). Opening `https://<address>/` in a browser
shows `DuoDesk relay OK` when it's running.

`RELAY_TOKEN` is optional, but set it: without it, anyone who finds the address can use your
server's bandwidth. They still couldn't reach your computers without the relay code.

## 2. Turn it on, on both computers

On the **home** computer: **General › Cloud relay**.

1. **Relay server:** the address from step 1.
2. **Relay code:** click **New code**, then **Copy**. You'll type this code on the other computer.
3. **Access token:** the `RELAY_TOKEN`, if you set one.
4. Click **Save and connect**. Status shows **Online**.

On the **office** computer: the same page, with the **same server, code and token** (paste the
code, don't make a new one). Click **Save and connect**. Status shows **Online with &lt;home
computer&gt;**.

Keep the relay code secret like a password: anyone who has it can pair with your computers.
Click **New code** on both computers to replace it.

## 3. Pair, from the office

Open **Connection**. Your home computer is in **Nearby** like a computer on the same network.
Click it to pair. **Nobody needs to be at the home computer:** through the relay, knowing the code
is the proof, so both sides accept the pairing by themselves.

After that the two connect on their own whenever both are running with Cloud relay on: open
**Receive screen** to see and control the home computer, **Apps** for its apps in windows of their
own, and so on.

Which computer *hosts* is the usual DuoDesk rule (with a Mac and a PC, the Mac hosts). It doesn't
matter here: both computers connect out to the relay, so either one can be at home.

## Good to know

- **One pair per code.** A relay code joins exactly two computers. Use another code (and another
  computer's Cloud relay page) for another pair.
- **Speed.** Everything goes through the relay server, so the picture's quality and delay depend on
  both internet connections and on how close the server is: pick a region near you. The top bar
  shows the delay.
- **The home computer must be awake** with DuoDesk running. Turn on **Open at login** in General,
  and stop it sleeping (or use **Keep the display awake**).
- **Not through the relay yet:** the terminal (`ssh duodesk`), mounting shared folders over SMB,
  Wake-on-LAN, DuoDesk Mesh (more than two devices at once), and phones. Send files with
  **File Sharing** instead; it works through the relay.
- **Updates.** The in-app updater installs official DuoDesk releases, which don't have Cloud relay
  unless it has been merged there. Skip the update to keep it.

## How it works

```
office computer                    relay server                     home computer
DuoDesk ──TLS──> 127.0.0.1:47830 ═══ sealed WSS ═══> relay ═══ sealed WSS ═══> DuoDesk :47800
WebRTC ──TURN──> 127.0.0.1:47832 ═══ sealed WSS ═══> relay ═══ sealed WSS ═══> TURN :47831
```

- `shared/cloudrelay.js` runs in each app. It joins a *room* named by a hash of the relay code and
  tells the other computer who it is (sealed). The other computer then shows up in Nearby at
  `127.0.0.1:47830`. Each TCP connection made there becomes a stream through the relay to the other
  computer's DuoDesk port, sealed with keys from the code and both sides' fresh nonces: one key and
  counter per direction, so the server can't read, change, replay, drop or reorder anything.
- Screens, apps, sound and cameras use WebRTC. Each computer runs a TURN relay on `127.0.0.1:47831`
  and reaches the other's through the tunnel at `127.0.0.1:47832`, so WebRTC needs no direct path.
- `relay/server.js` pairs the two computers' sockets and copies bytes. It has no accounts and stores
  nothing.
- Tests: `cd relay && npm install && npm test` (the tunnel), and
  `mac/node_modules/.bin/electron relay/test/media.js` (video through the TURN relays).
