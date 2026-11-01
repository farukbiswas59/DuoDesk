<p align="center">
  <img src=".github/assets/icon.png" width="112" alt="DuoDesk icon">
</p>

<h1 align="center"><a href="https://getduodesk.vercel.app">DuoDesk</a></h1>

<p align="center">
  <b>All your computers and your phone, working as one desk.</b><br>
  Screens, apps, files, clipboard, cameras, calls, texts, notifications, mouse and keyboard, shared between Mac, Windows, Linux and Android.<br>
  Free and open source. No account, no cloud, no shared network needed.
</p>

<p align="center">
  <a href="#download"><b>⬇️ Download 2.5</b></a> ·
  <a href="https://getduodesk.vercel.app"><b>Website</b></a> ·
  <a href="https://github.com/0xCodez/DuoDesk"><b>Source</b></a> ·
  <a href="#-new-in-23"><b>What's new</b></a> ·
  <a href="#-get-started"><b>Get started</b></a> ·
  <a href="#how-it-works"><b>How it works</b></a>
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/github/v/release/0xCodez/DuoDesk?include_prereleases&label=version&color=4b8bff">
  <img alt="macOS 13+" src="https://img.shields.io/badge/macOS-13%2B-black">
  <img alt="Windows 10/11" src="https://img.shields.io/badge/Windows-10%20%7C%2011-0078d4">
  <img alt="Linux X11 and Wayland" src="https://img.shields.io/badge/Linux-X11%20%7C%20Wayland-f0a30a">
  <img alt="Android 10+" src="https://img.shields.io/badge/Android-10%2B-3ddc84">
  <img alt="License: GPL-3.0" src="https://img.shields.io/badge/license-GPL--3.0-blue">
  <a href="https://github.com/0xCodez/DuoDesk/releases"><img src="https://img.shields.io/github/downloads/0xCodez/DuoDesk/total" alt="Downloads"></a>
</p>

<p align="center">
  <img src=".github/assets/hero.jpg" alt="The DuoDesk Overview window, 'What should your desks do?', with cards for Workstation, Studio-Mac and Pixel 8, between a Windows PC on the left and a MacBook and a phone on the right, on one glowing desk line" width="100%">
</p>

Your devices are good at their own jobs and bad at working together. DuoDesk fixes that.
Put a **Mac and a Windows PC** side by side and use them with one mouse and keyboard. Open the
PC's apps on the Mac. Turn an old laptop or your **Android tablet** into a second screen. Answer
your **phone's calls and texts** from the computer, use its **camera in a video call**, and paste
on one device what you copied on another.

- **Any combination.** Mac ↔ Windows, Mac ↔ Mac, PC ↔ PC, Linux ↔ anything, and Android ↔ any computer. Or, with [DuoDesk Mesh](#-duodesk-mesh-every-device-at-once), all of them at once.
- **Anywhere.** Same Wi-Fi, a USB cable, or no shared network at all: Bluetooth and a direct Wi-Fi link of their own.
- **No account, no cloud.** Devices talk only to each other, on an encrypted link.
- **Only what you turn on.** Every feature starts off and isn't even loaded until you switch it on.

<table>
<tr>
<td width="33%" valign="top">

### 💻 [Computers](#-computer-to-computer)
One mouse and keyboard · second screen · the other computer's apps in windows · files · clipboard · **camera** · sound · terminal

</td>
<td width="33%" valign="top">

### 📱 [Phones and tablets](#-phone-and-tablet)
Calls · texts · photos · files · **camera** · **remote and gamepad** · screen and apps in windows · tablet as a second screen

</td>
<td width="33%" valign="top">

### 📡 [Connections](#-connections)
Same Wi-Fi · USB cable · **Bluetooth** · **Wi-Fi Direct** and **hotspot** links made on demand · picked for you, moved for you

</td>
</tr>
<tr>
<td width="33%" valign="top">

### 🚀 [Get started](#-get-started)
Download · open on both · pair once with a code · turn on what you want · [privacy](#privacy): no account, no telemetry

</td>
<td width="33%" valign="top">

### 🐧 [Linux](#linux) and 🤖 [Android](#android-in-detail) in detail
X11 and Wayland · shared folders through Samba · the phone app page by page · [wireless debugging](#wireless-debugging), set up once

</td>
<td width="33%" valign="top">

### 🛠 [Under the hood](#how-it-works)
[How it works](#how-it-works) · [build and run](#build-and-run) on macOS, Windows, Linux, NixOS and Android · [GitHub Actions](#github-actions)

</td>
</tr>
</table>

<a name="download"></a>

## ⬇️ Download

<table>
<tr>
<td width="25%" align="center" valign="top">

**🍎 macOS**<br><sub>13 Ventura or later</sub>

<a href="https://github.com/0xCodez/DuoDesk/releases/download/v2.5.0/DuoDesk-2.5.0-arm64.dmg"><img src="https://img.shields.io/badge/Apple_Silicon-.dmg-000000?style=for-the-badge" alt="macOS, Apple Silicon"></a>

</td>
<td width="25%" align="center" valign="top">

**🪟 Windows**<br><sub>10 and 11</sub>

<a href="https://github.com/0xCodez/DuoDesk/releases/download/v2.5.0/DuoDesk-Setup-2.5.0.exe"><img src="https://img.shields.io/badge/x64-Installer-0078d4?style=for-the-badge" alt="Windows, x64"></a><br>
<a href="https://github.com/0xCodez/DuoDesk/releases/download/v2.5.0/DuoDesk-Setup-2.5.0-arm64.exe"><img src="https://img.shields.io/badge/ARM64-Installer-005a9e?style=for-the-badge" alt="Windows on ARM"></a>

</td>
<td width="25%" align="center" valign="top">

**🐧 Linux**<br><sub>X11 and Wayland, x86_64</sub>

<a href="https://github.com/0xCodez/DuoDesk/releases/download/v2.5.0/DuoDesk-2.5.0-amd64.deb"><img src="https://img.shields.io/badge/Debian_·_Ubuntu-.deb-d70a53?style=for-the-badge" alt="Linux, .deb"></a><br>
<a href="https://github.com/0xCodez/DuoDesk/releases/download/v2.5.0/DuoDesk-2.5.0-x86_64.AppImage"><img src="https://img.shields.io/badge/Any_distro-AppImage-f0a30a?style=for-the-badge" alt="Linux, AppImage"></a><br>
<a href="https://github.com/0xCodez/DuoDesk/releases"><img src="https://img.shields.io/badge/Arch-pkg.tar.zst-1793d1?style=for-the-badge" alt="Linux, Arch package"></a><br>
<sub>NixOS: <code>nix run github:0xCodez/DuoDesk</code> (<a href="#nixos--nix-flakes">more</a>)</sub>

</td>
<td width="25%" align="center" valign="top">

**🤖 Android**<br><sub>10 or later, phones and tablets</sub>

<a href="https://github.com/0xCodez/DuoDesk/releases/download/v2.5.0/DuoDesk-2.5.0.apk"><img src="https://img.shields.io/badge/Phone_app-.apk-3ddc84?style=for-the-badge" alt="Android app"></a><br>
<a href="https://github.com/0xCodez/DuoDesk/releases/download/v2.5.0/DuoDesk-2.5.0-full.apk"><img src="https://img.shields.io/badge/Full_app-.apk-1b8a4c?style=for-the-badge" alt="Android full app"></a><br>
<sub>The full app adds notifications, texts and Accessibility; the computer can install it for you over wireless debugging</sub>

</td>
</tr>
</table>

<a name="first-launch"></a>

<details>
<summary><b>⚠️ First launch: the apps aren't code-signed</b> <sub>how to allow them on macOS, Windows and Android</sub></summary>

DuoDesk is free and has no paid Apple Developer ID or Windows code-signing certificate, so
macOS and Windows don't know who made it and ask once before opening it. The source is all here.

**🍎 macOS**

1. Drag DuoDesk into Applications and open it. macOS says it can't verify DuoDesk: click **Done**
   (not Move to Bin).
2. Open **System Settings › Privacy & Security**, scroll down to Security and click **Open Anyway**
   next to "DuoDesk was blocked". Enter your password, then click **Open Anyway** again.

You do this once; updates open normally. If macOS says DuoDesk **is damaged and can't be
opened**, it isn't: run this in Terminal, then open it again:

```sh
xattr -dr com.apple.quarantine /Applications/DuoDesk.app
```

**🪟 Windows**

1. If the browser warns that the file isn't commonly downloaded, choose **Keep** (in Edge: **⋯ ›
   Keep › Show more › Keep anyway**).
2. When the installer shows **Windows protected your PC** (SmartScreen), click **More info**, then
   **Run anyway**.

On Windows 11 with **Smart App Control** on, unsigned apps are blocked with no Run anyway button.
The only way past it is turning it off (Windows Security › App & browser control › Smart App Control
settings), and on many Windows 11 versions it can't be turned back on without reinstalling Windows.

**🤖 Android**

1. Open the downloaded .apk. Android asks to allow your browser or Files app to **install unknown
   apps**: tap **Settings**, turn on **Allow from this source**, go back and tap **Install**.
2. If Play Protect warns about an unrecognised developer, tap **More details › Install anyway**.

The **full app** (notifications, texts and Accessibility) is easiest installed by the computer over
[wireless debugging](#wireless-debugging) (Phone page › Notifications from the phone): Android then
lets you turn those on. Installed by hand, Play Protect may block it, and Android 13 and later grey
out notification access and Accessibility as a **restricted setting**: open **Settings › Apps ›
DuoDesk**, tap **⋮ › Allow restricted settings**, then turn them on.

</details>

<p align="center"><sub>Every file and older version is on the <a href="https://github.com/0xCodez/DuoDesk/releases">releases page</a>.</sub></p>

---

# ✨ New in 2.3

<p align="center">
  <img src=".github/assets/v23-whats-new.jpg" alt="DuoDesk 2.3: your phone is now a camera, a remote and a gamepad. The Camera page, with one phone showing the Remote touchpad and keys and another turned sideways showing the gamepad" width="100%">
</p>

Your phone is now **a camera, a remote and a gamepad**. Use its camera in any video call, drive your
computer from the couch, or play with it as a controller. Copy pictures and screenshots across every
screen, and lock the pointer to one computer with a key.

| | What's new | |
|---|---|---|
| 📷 | **Camera.** The phone's camera, or the other computer's, in a window or as a webcam for Zoom, Teams and Meet | [More](#-phone-camera) |
| 🎮 | **Remote and gamepad.** A touchpad and keyboard for the computer, and a controller it sees as a real one | [More](#-remote-and-gamepad) |
| 🖼 | **Pictures on the clipboard.** Copy a screenshot on the PC, paste it on the Mac or the phone | [More](#-shared-clipboard) |
| 🔒 | **Cursor lock.** Scroll Lock keeps the pointer on the computer it's on | [More](#-one-mouse-and-keyboard) |
| 🎵 | **Media controls.** What's playing on the phone, with play, pause and skip on the computer | [More](#-media-controls-and-phone-sound) |
| 🪶 | **Lighter.** Every feature off until you turn it on, and about half the memory in the tray | [More](#-also-new-in-23) |

## ➕ Also new in 2.3

- **Every feature is off on a fresh install** and nothing of it is loaded until you switch it on. Updating keeps your settings.
- **Closed to the tray or menu bar, the window is gone too:** a Windows PC went from about 240 MB to about 125 MB.
- **<kbd>Ctrl+Alt+V</kbd> / <kbd>⌃⌥V</kbd> pastes files straight into the app in front**, a chat or an email, not only into a folder.
- **Choose where received files go** (General › Received files) on Windows and Linux, as on the Mac.
- **Phone windows:** Enter sends in WhatsApp, Instagram and Telegram; on Windows the controls sit in a side panel, with Rotate and a screenshot button.
- **The phone's own screen on the computer**, started from the phone's Screen page.
- **Touchpad mode** for the computer's screen on the phone: slide to move the pointer, tap to click.
- **The phone's battery:** a locked phone no longer lights up by itself, and discovery no longer keeps it awake.
- **Wireless debugging can switch itself off** when the computer is gone (General › Allow on the phone).
- **The pointer on the phone** shows over the notification shade and on Settings screens too.
- **Steadier Bluetooth and Wi-Fi Direct with phones**, and Android Studio or scrcpy's own adb is used before the bundled one, so they stop knocking each other off.
- **Intel Mac downloads** of their own, and builds that can be signed and notarized with a Developer ID.

Thanks to everyone who sent pull requests for this release: see [Thanks](#thanks).

<sub>Older releases: 2.2 brought [DuoDesk Mesh](#-duodesk-mesh-every-device-at-once), 2.1 brought
[Bluetooth and Wi-Fi Direct](#-connections) and the phone's [calls, texts, photos and files](#-calls-and-messages).
Every release's notes are on the [releases page](https://github.com/0xCodez/DuoDesk/releases).</sub>

---

# 💻 Computer to computer

<p align="center">
  <img src=".github/assets/mac-windows.jpg" alt="DuoDesk on a Mac (Studio-Mac) connected to a Windows PC (Workstation): the Mac's Apps page lists the PC's apps, and behind it the PC's Overview shows Studio-Mac connected at 9 ms" width="100%">
</p>

The same app on every platform, so a Mac and a PC pair just like two Macs.

## 🖱 One mouse and keyboard

Push the pointer off the edge of your screen and **keep working on the other computer**, as if
they were one. Your keyboard follows the pointer. Trackpad gestures (Spaces swipes, pinch to zoom,
show desktop) carry over, and a double-tap of the hotkey brings everything home. Set which side the
other computer is on, edge resistance and pointer speed.

**Cursor lock** (new in 2.3) keeps the pointer on the computer it's on, even the one the mouse isn't
plugged into: press **Scroll Lock** (F14 on a Mac), or use the Cursor tab or the tray / menu bar.

## 🖥 Extended display and remote screen

Extend your Mac onto a PC or another Mac with a **real virtual display**, or mirror it. Or bring
the other computer's screen into a window and control it from there. Low-latency H.264 with
*Fastest* and *Smooth* playback, and optional frame generation.

<p align="center">
  <img src=".github/assets/mac-screen-window.jpg" alt="Workstation's screen in a window on the Mac, with its toolbar (Extend, Mirror, Frame generation, Full screen, Stop), and the Receive screen page in front: live at 60 fps, 1920 × 1080, H.264" width="100%">
</p>

## 🪟 The other computer's apps, in windows of their own

Open a **Windows app on your Mac** (or a Mac app on your PC) and it gets **a window of its own**,
with its own Dock icon or Start-menu pin. No full remote desktop, just the app you need, next to
your own.

<p align="center">
  <img src=".github/assets/mac-apps.jpg" alt="The Mac's Apps page with Paint, Notepad and Terminal from Workstation open in their own windows, and behind it the PC's Apps page with 3 windows on Studio-Mac" width="100%">
</p>

## 📷 Camera sharing

Show the other computer's camera in a window, or send it to **a webcam every app can pick**:
**DuoDesk Camera** in Zoom, Teams, Meet or the browser. A computer shares its camera only when you
turn on *Let … see this camera* on it, and a popup there says who is watching. The same works with
a [phone's camera](#-phone-camera).

The virtual camera installs the first time you turn it on: a Windows 11 camera (one administrator
prompt), v4l2loopback on Linux (one password prompt), and on the Mac it goes into **OBS Virtual
Camera** (or DuoDesk's own camera extension, in builds signed for it).

## 📁 Files, shared folders and terminal

**Drag files across the screen edge** and drop them anywhere, or copy with <kbd>⌃⌥C</kbd> and
paste with <kbd>⌃⌥V</kbd> (<kbd>Ctrl+Alt+C/V</kbd> on Windows and Linux), into a folder or straight
into the app in front. Send from the macOS Share menu or Explorer's *Send to*, or **share a folder**
that shows up as a network drive on the other side. Files on their way show **live progress**.
Need a shell? `ssh duodesk` opens one on the other computer, no passwords needed.

<p align="center">
  <img src=".github/assets/computers-files.jpg" alt="The File Sharing page on the Mac sending Brand assets.zip to Workstation, and the Terminal page on the PC with the shell on Studio-Mac ready (ssh duodesk)" width="100%">
</p>

## 📋 Shared clipboard

Copy on one computer and paste on the other, instantly or when you switch over. **Pictures** go too
(new in 2.3), up to 10 MB: take a screenshot with <kbd>Win+Shift+S</kbd> on the PC and paste it on
the Mac. Entries from password managers are skipped, and a Recent list keeps the last few things
you copied, pictures with a preview.

<p align="center">
  <img src=".github/assets/computers-clipboard.jpg" alt="The same three copied texts in the clipboard history on the Mac and on the Windows PC, marked To Workstation on one and From Studio-Mac on the other" width="100%">
</p>

## 🔔 Notifications, sound and Wake-on-LAN

See one computer's notifications on the other as native notifications, and hear one computer's
sound on the other. Wake a sleeping computer with Wake-on-LAN, and every switch you flip is
shared by both sides and remembered for the pair.

## 🔀 More than two devices

Pair as many computers and phones as you like. **Switch** moves the session to another paired
device nearby, **Take over** claims one that's busy with someone else, and **Disconnect** lets go.
All from the Overview, the menu bar or the tray.

## 🕸 DuoDesk Mesh: every device at once

<p align="center">
  <img src=".github/assets/v22-mesh-desk.jpg" alt="One mouse, every screen: the pointer's path across a Windows PC, a MacBook, a Linux laptop and a phone, with the Multi-device layout map of Workstation, Studio-Mac, ThinkPad and Pixel 8 below" width="100%">
</p>

Your laptop, your desktop, the Linux box in the corner and your phone, **all connected at once**,
each talking straight to the others with no hub in between.

- **One mouse, every screen.** Line your devices up on the map once, and the pointer goes from the PC to the Mac to the Linux laptop to the phone.
- **One clipboard.** Copy on any of them, paste on any other. The newest copy wins.
- **One notification pool.** Your phone buzzes, and every computer shows it.
- **Pair once, join all.** A new device paired with one computer meets the rest by itself.

Mesh works on Windows, Mac and Linux: turn it on in the **Multi-device** tab, and off again
any time with everything as you left it. Connecting just two devices? You won't need it. Still
coming to Mesh: pictures on the clipboard, and files dragged to more than one device at a
time; the phone connects to one computer at a time, and Linux joins over the same Wi-Fi only.

---

# 📱 Phone and tablet

Most phone links stop at notifications and a file drop. In DuoDesk your Android phone or tablet is
a **full peer**: it pairs like a computer and gets the same features, plus its calls, texts, photos,
files and camera.

## 📞 Calls and messages

Answer, decline and make your phone's calls from the computer. When it rings, a small window shows
who's calling with **Answer** and **Decline**. With Bluetooth, the computer becomes **the phone's
headset**, so you talk and listen right there. The **Calls** page has a number pad, your contacts
and the call history.

Read and reply to your texts on **Messages**: every conversation, pictures included, and a count in
the sidebar.

<p align="center">
  <img src=".github/assets/v21-calls-messages.jpg" alt="DuoDesk with Pixel 8 connected: the Calls page with an incoming call from Alex and the recent calls, and the Messages page with a conversation" width="100%">
</p>

## 🖼 Photos and phone files

Browse the phone's **photos and videos** on **Photos**, open any of them big, and save one or many
to the computer. **Phone Files** browses the phone's whole storage: save, upload, rename, delete, or
just drop files on the page. **Shared folders work both ways:** a folder the phone shares opens in
Finder, Explorer or the Linux file manager, and one the computer shares shows up in the phone's
Files app.

<p align="center">
  <img src=".github/assets/v21-photos-files.jpg" alt="The Photos page with the phone's gallery, and the Phone Files page with the phone's free space, folders shared both ways and its storage" width="100%">
</p>

## 📷 Phone camera

The phone's **back or front camera**, in a window on the computer or as the **DuoDesk Camera**
webcam in any video call. Switch cameras and rotate the picture from the Camera tab, or start it
from the phone's own Camera page.

## 🎮 Remote and gamepad

<p align="center">
  <img src=".github/assets/v23-remote.jpg" alt="The phone's Remote: the touchpad with a row of keys and left and right click, and the gamepad held sideways, laid out like an Xbox controller" width="100%">
</p>

The phone's **Remote** page turns it into the computer's remote, for the couch or a presentation:

- **Touchpad and keyboard.** Slide to move, tap to click, two fingers to scroll, with the keys a
  phone keyboard lacks (Esc, Tab, Ctrl, Alt, arrows, media and volume). Rotate it for landscape.
- **Gamepad,** laid out like an Xbox controller. Its buttons press the keys you choose, or turn on
  **Real gamepad** and the computer sees an actual controller: an Xbox 360 controller on Windows,
  a gamepad on Linux.
- **A Bluetooth gamepad for any computer**, the Mac included, with no DuoDesk and no driver there:
  pair the phone in the computer's Bluetooth settings once.

Turn on **Remote** on the computer to let the phone drive it.

## 🎵 Media controls and phone sound

What's playing on the phone shows in its card on the Overview, with its art, **Previous,
Play/Pause, Next** and a bar to seek. On Windows and Linux, **Play phone sound here** makes the
computer the phone's Bluetooth speaker.

## 📲 Phone screen and apps on the computer

See your phone's screen in a window and control it with your mouse, trackpad and keyboard. Better
still, open **single Android apps in windows of their own**, side by side with your desktop apps.
Pin them to the Dock or the Start menu and use them like any other app. In WhatsApp, Instagram and
Telegram, Enter sends.

<p align="center">
  <img src=".github/assets/phone-on-mac.jpg" alt="The Phone apps page listing the phone's apps, and the Mirroring page with the phone screen, Calculator, Calendar and Clock open as their own windows on the computer" width="100%">
</p>

## 🖥 Tablet as a second screen

Turn a tablet or phone into an **extra monitor**. **Extend** for more desktop space, or **Mirror**
to show what's on your screen. Use touch as the mouse, or switch on touchpad mode.

<p align="center">
  <img src=".github/assets/second-screen.jpg" alt="The Share screen page sharing Workstation to Galaxy Tab in Extend mode at 2560 × 1600 and 60 fps, and the tablet showing the extended screen" width="100%">
</p>

## 📤 Files, clipboard, notifications, mouse and keyboard

- **Files.** *Send to computer* or *Copy to computer* from any Android app's share menu; from the
  computer, the Share menu, *Send to*, a drag across the screen edge or <kbd>⌃⌥C</kbd> / <kbd>Ctrl+Alt+C</kbd>.
- **Clipboard.** Text and pictures both ways, the phone's screenshots included, and a Quick Settings tile to send it.
- **Notifications.** The phone's on the computer as native notifications, and the other way around. Hide the text or mute single apps.
- **Mouse and keyboard.** Push the pointer past the screen edge and it **carries on onto the phone**;
  type with your real keyboard in any Android app.

<p align="center">
  <img src=".github/assets/share-files.jpg" alt="The File Sharing page sending Trip photos.zip to Pixel 8, next to the Clipboard page with the latest copy from Pixel 8 and the Notifications page with Pixel 8's notifications" width="100%">
</p>

## 📱 The Android app

The Android app adapts to the device: tabs at the bottom on a phone, a full sidebar on a tablet.
Every page names the computer you're connected to and shows what's shared in each direction.

<p align="center">
  <img src=".github/assets/android-phone.jpg" alt="DuoDesk on the computer with Pixel 8 connected (its battery and what it shares), and the Android app's Remote page on the phone" width="100%">
</p>

---

# 📡 Connections

<p align="center">
  <img src=".github/assets/v21-connections.jpg" alt="Five ways to link: same Wi-Fi, Bluetooth LE, Wi-Fi Direct, phone hotspot and USB cable, next to the Connection page with a Bluetooth link at 38 ms" width="100%">
</p>

You never have to choose. DuoDesk uses the same network when there is one, moves a phone onto
the **USB cable** when you plug it in, and falls back to **Bluetooth** when the Wi-Fi goes: on a
train, or in a café whose guest Wi-Fi blocks devices. The link and its latency are always shown at
the top of the app (*38 ms · Bluetooth*).

Bluetooth is great for the session but too slow for a screen or a big file. So when you start one,
DuoDesk **brings up a direct Wi-Fi link** between the two devices for as long as it's needed, then
goes back to Bluetooth. Press **Connect with Wi-Fi Direct** to keep it, or let the computer join the
phone's **hotspot**.

| | Same Wi-Fi | USB cable | Bluetooth | + Wi-Fi Direct or hotspot |
|---|:-:|:-:|:-:|:-:|
| Session, clipboard text, notifications | ✅ | ✅ | ✅ | ✅ |
| Mouse and keyboard, remote | ✅ | ✅ | ✅ | ✅ |
| Calls and texts | ✅ | ✅ | ✅ | ✅ |
| Screens, apps, cameras, files, photos, clipboard pictures | ✅ | ✅ | moves to Wi-Fi Direct | ✅ |
| Terminal between computers (`ssh duodesk`) | ✅ | — | on Wi-Fi Direct | ✅ |

Who can turn up over Bluetooth is up to you: **Bluetooth with phones** (on) and **Bluetooth with
computers** (off until you want it), on the Overview and in General.

**Not on the same network at all?** With **Cloud relay** (General › Cloud relay) your home computer
and your office computer both connect out to a small relay server you run (`relay/`, one click on
Render or Fly.io), and work together as if they sat side by side: see and control the other screen,
its apps, files, clipboard and sound. Everything is end-to-end encrypted with a relay code only your
two computers know, and pairing from the office needs nobody at home. See
[docs/cloud-relay.md](docs/cloud-relay.md).

---

# 🚀 Get started

<p align="center">
  <img src=".github/assets/tour.gif" alt="A tour of the DuoDesk window: Overview, Mouse, Clipboard, Share screen, Camera and File Sharing" width="820">
</p>

1. **Download** DuoDesk for each computer and your phone ([above](#download), or from the [releases](https://github.com/0xCodez/DuoDesk/releases)).
2. **Open it on both.** They find each other on the same network, over Bluetooth, or over a USB cable for a phone.
3. **Pair once** by comparing a code (on a USB cable, just click Allow). From then on they connect by themselves.
4. **Turn on what you want.** Each feature has a tab with a switch, and shows what it does until you turn it on.

For the phone's screen, apps and camera in windows, DuoDesk walks you through turning on Android's
wireless debugging once ([details](#wireless-debugging)). Files, clipboard, calls and photos work
without it. The phone's notifications, texts, media controls and mouse and keyboard through
Accessibility come with the full app, which the computer installs once over wireless debugging.

| Pair | What you get |
|---|---|
| Mac ↔ Windows PC, Mac ↔ Mac, PC ↔ PC | Every computer feature |
| Linux ↔ Mac, PC or Linux | Every computer feature ([a few differences](#linux)) |
| Android ↔ Mac, Windows or Linux | Every phone and tablet feature (Real gamepad on Windows and Linux) |
| All of them at once | [DuoDesk Mesh](#-duodesk-mesh-every-device-at-once) |

## Privacy

DuoDesk only talks to devices you've paired with, directly over your own network, Bluetooth, a
direct Wi-Fi link or a cable. There are no accounts, no telemetry and no cloud relay. Your calls,
texts, photos and camera go straight from the phone to your computer and nowhere else. The only
internet request is an update check against GitHub's public releases, which you can turn off.

<br>

---


Everything below is for the curious and for people building DuoDesk themselves.

<a name="linux"></a>
<details>
<summary><h2>🐧 Linux</h2> <sub>X11 and Wayland, shared folders, Extend, virtual camera and gamepad</sub></summary>

On Linux, DuoDesk runs on both X11 and Wayland. On Wayland, the mouse and keyboard go through
evdev and uinput (the Setup screen grants access once), and screens are captured through the
desktop portal. A few things work a little differently:

- **Shared folder.** Sharing uses Samba. The first time, one password prompt installs it if it's
  missing and adds a network-only account. The other computer's folder is connected with GVFS
  and shows in the file manager's sidebar.
- **Copy and paste files.** <kbd>Ctrl+Alt+C</kbd> copies what's selected in the file manager in
  front (or files you already copied), and <kbd>Ctrl+Alt+V</kbd> pastes into the file manager
  window in front (else Downloads). Right-click › *Send to* works in Nautilus, Nemo, Caja,
  Dolphin and Thunar.
- **Dragging files across the edge.** Files dragged in from the other computer are dropped into
  the folder under the pointer, or the desktop. On Wayland, they go to the file manager window in
  front. Dragging files out of Linux needs an Xorg session.
- **Extend.** On GNOME (Wayland) it uses Mutter's own virtual monitor; pick "Virtual remote
  monitor" when the desktop asks which screen to share. On X11 it switches on a spare output of
  the graphics driver (not available on NVIDIA's driver). That needs a small helper, which the
  .deb installs; with the AppImage, Share screen › *TwinDesk virtual display* › Install puts it in
  once, with your password.
- **Apps.** Opening this computer's apps on the other side needs an Xorg session.
- **Virtual camera and gamepad.** DuoDesk Camera is a v4l2loopback device, and Real gamepad a
  uinput controller ("TwinDesk Gamepad"); each asks for your password once, the first time it's
  turned on.
- **Bluetooth and Wi-Fi Direct.** Bluetooth LE goes through BlueZ, and direct Wi-Fi links through
  NetworkManager, hosted beside the computer's own Wi-Fi where the adapter allows (2.4 GHz groups
  for a phone).
- **Android phone.** Everything in [Android](#android-in-detail) works on Linux too: the phone's screen and
  apps in windows, the mouse and keyboard across the edge, files, clipboard, notifications and
  sound. The package carries adb; the Setup screen's firewall fix opens mDNS (5353/udp) so the
  phone's wireless debugging is found.

</details>

<a name="android-in-detail"></a>
<details>
<summary><h2>🤖 Android in detail</h2> <sub>the phone app page by page, and wireless debugging</sub></summary>

Install DuoDesk on the phone, open it next to DuoDesk on the computer and pair from Overview › Nearby. The phone needs Android 10, and Android 11 for everything that goes through wireless debugging.

### The phone app

The app is laid out like the computers' (a sidebar on tablets, tabs at the bottom on phones), and
every page names the computer it's connected to:

| Page | What it does |
|---|---|
| **Overview** | The computer you're connected to, Connect and Disconnect, nearby computers to pair with, and the wireless debugging card until that's set up |
| **Screen** | Use the phone as a screen for the computer: Mirror, or Extend the desktop onto it. Touch works as the mouse (tap to click, hold to right click, drag to select or move windows, two fingers to scroll), with the computer's sound and Smooth playback |
| **Cursor** | The computer's mouse on the phone across the screen edge, its pointer speed here, reverse scrolling, right and middle click |
| **Keyboard** | The computer's keyboard types on the phone, every key as a key, so any layout works and the soft keyboard stays out of the way. A keyboard on the phone types on the computer |
| **Remote** | The phone as the computer's touchpad and keyboard, or as a gamepad: keys of your choosing, a real controller (Windows, Linux), or a Bluetooth gamepad for any computer |
| **Camera** | The phone's back or front camera on the computer, and whether its virtual camera takes it |
| **Clipboard** | Copy on one, paste on the other, each way on its own switch, at once or when sent |
| **Notifications** | The phone's notifications on the computer, with the text hidden if you like, and the computer's on the phone |
| **Files** | Send files, copy them to paste on the computer, and see where the computer's files land |
| **Sound** | The phone's sound on the computer, and the computer's sound on the phone |
| **General** | The phone's name, background running, and the permissions DuoDesk uses, each with its switch |
| **About** | Source code, releases, the license, and what goes over wireless debugging and the network |

And outside the app:

- **Share sheet:** *Send to computer* and *Copy to computer* in every app's Share menu.
- **Quick Settings tiles:** *Send clipboard* and *Wireless debugging*.
- **Home screen shortcuts:** the computer's screen, and wireless debugging on in one tap.
- **The ongoing notification** shows what's connected, with Exit.
- **Copied on the computer:** files copied with <kbd>⌃⌥C</kbd> / <kbd>Ctrl+Alt+C</kbd> arrive as a
  notification with Copy (paste them in any app) and Save.
- **The computer can install the full app** over wireless debugging (Phone page › Notifications
  from the phone): Play Protect blocks downloaded apps that read notifications or texts, or use
  Accessibility, so the download leaves those out and the computer adds them. Settings and pairing stay.

<a name="wireless-debugging"></a>

### Wireless debugging

Files, the clipboard and notifications work right away. The phone's screen, its apps in windows,
touch, your mouse and keyboard on the phone and its sound go through **wireless debugging**, which
DuoDesk pairs with once:

<p align="center">
  <img src=".github/assets/ui-phone-pair.jpg" alt="Connection page: the wireless debugging card under the connected computers, with the 6-digit pairing code" width="820">
</p>

- Until it's paired, a card under the connected computers on Connection (on the computer and on the
  phone) walks you through it. Open *Developer options › Wireless debugging › Pair device with
  pairing code* on the phone and type the 6-digit code on the computer, or on the phone in
  DuoDesk's notification (Settings' dialog stays open). The phone sends the code to whichever
  computer it's connected to: Mac, PC or Linux.
- After that DuoDesk switches wireless debugging on by itself when it needs it, follows it to its
  new port every time it restarts, and keeps the pairing from expiring (Android otherwise forgets
  a computer after 7 days unused). Phones that switch it off on every Wi-Fi change or screen lock
  (MIUI, HyperOS) get it switched back on as soon as they're unlocked, or a prompt if they refuse.
  Wireless debugging only runs while **USB debugging** is on too, so DuoDesk turns both on.
- **Xiaomi, Redmi and POCO** also need *Developer options › USB debugging (Security settings)* for
  touch, mouse and keyboard (it asks for a Mi account). Without it the screen shows but input is
  refused; the computer's Phone page says "Touch blocked" until it's on.
- **On a Mac, the phone in Finder.** Turn it on in the Mount tab and click Mount: the phone shows
  under Locations like any server. Until then DuoDesk never looks at the phone's files. It goes
  through the cable when USB debugging is allowed, else over wireless debugging. Finder's `.DS_Store` and `._` files never land on the phone.

</details>

<a name="how-it-works"></a>
<details>
<summary><h2>⚙️ How it works</h2> <sub>the Electron app, the native helpers and the link between devices</sub></summary>

<p align="center">
  <img src=".github/assets/how-it-works.svg" alt="Architecture: an Electron app and a native helper on each computer, linked by a TLS control channel, WebRTC media and system services" width="100%">
</p>

Each computer runs an **Electron app**, which handles the window, pairing, the link and the state
machines. Next to it runs a small **native helper** for everything the OS keeps to itself:
capturing and injecting input, virtual displays, gestures, window capture and native drag and drop.

| Folder | What's in it |
|---|---|
| `mac/` | macOS app (Electron) |
| `mac-helper/` | macOS helper (Swift): virtual display, event tap, input injection, audio, apps, SMB |
| `windows/` | Windows app (Electron) and installer |
| `windows-helper/` | Windows helper (C#): hooks, SendInput, Raw Input touchpad, window capture, native drag |
| `linux/` | Linux app (Electron) |
| `linux-helper/` | Linux helper (C): XInput2 / XTest on X11, evdev / uinput on Wayland, XRandR, window list, XDND edge strip |
| `android/` | Android app (Kotlin, Jetpack Compose); the computers drive the phone through adb and [scrcpy](https://github.com/Genymobile/scrcpy)'s server |
| `shared/` | Used by every app: the wire protocol, the Bluetooth pipe and Wi-Fi Direct links, the phone hub (Calls, Messages, Photos, Phone Files), shared folders, frame generation and icons |

The link between two devices is one TLS session wherever it runs: on the local network, through
a phone's USB cable (adb), or through **Bluetooth LE** (a GATT pipe of DuoDesk's own,
`shared/blepipe.js`). When a session on Bluetooth needs bandwidth, `shared/netlink.js` brings up a
**Wi-Fi Direct** group or joins a phone's hotspot, moves the session onto it, and takes it down
again once nothing needs it. Calls, Messages, Photos and Phone Files are `shared/phonehub.js` on
the computers, answered by DuoDesk on the phone.

Files between two computers on the network or a cable stream over HTTPS on the same port, beside the
control link and up to four at a time (`shared/fastfile.js`), so mouse and keyboard never wait
behind a big file. Through Bluetooth, Wi-Fi Direct, a hotspot, or with an older TwinDesk on the
other side, they go as before: in pieces on the control link.

Ports: TCP **47800** (control link and files) and UDP **47801** (discovery) on the local network.

</details>

<a name="build-and-run"></a>
<details>
<summary><h2>🛠 Build and run</h2> <sub>macOS, Windows, Linux, NixOS, Android and GitHub Actions</sub></summary>

You need [Node.js](https://nodejs.org) 18+ on every platform.

### macOS (13 Ventura or later)

```sh
xcode-select --install          # Swift compiler for the helper
cd mac
npm install
npm run build:helper
npm start                       # run from source
npm run dist && npm run dmg     # build DuoDesk.app and DuoDesk-<version>-<arch>.dmg in mac/dist/
```

The disk image is named after the app inside it: `DuoDesk-2.4.0-arm64.dmg` for Apple Silicon,
`DuoDesk-2.4.0-x64.dmg` for Intel. Keep those names on a release: the in-app updater picks the
one for each Mac by them.

By default, `npm run dist` targets the Mac's current architecture. To build an Intel
package from an Apple Silicon Mac, use:

```sh
npm run dist:x64 && npm run dmg
```

To build the Intel app and its image in one step, run `npm run dmg:intel`; it writes
`mac/dist/DuoDesk-<version>-x64.dmg`.

Use `npm run dist:arm64 && npm run dmg` for Apple Silicon explicitly. The x64 build
cross-compiles the Swift helpers and packages the x64 Electron runtime, so it does
not require an Intel Mac.

On first launch, DuoDesk asks for **Screen Recording**, **Accessibility** and **Input
Monitoring** (once; after that the General tab shows each permission's status).

`npm run dist` signs the app with a certificate of its own, made the first time in
`~/.twindesk-signing` (keep a backup). macOS keeps permissions per signature, so with the same
certificate they carry over when an update is dragged into Applications. An app built without it is
signed ad-hoc, and macOS treats every update as a new app; DuoDesk then clears the stale entries so
Allow works again.

### Windows 10 / 11

```bat
cd windows
npm install
npm run build:helper            :: uses the .NET Framework C# compiler that ships with Windows
npm start
npm run dist                    :: NSIS installer in windows\dist\
npm run dist -- arm64           :: the Windows on ARM installer (or `x64 arm64` for both)
```

`npm run dist` also works on a Mac or Linux: it skips the helper build and packages the
`macshare-winhelper.exe` already in `windows-helper\bin\` (for example, one taken from a release).

The installer adds the firewall rules (for every network profile, so a standard account on a
Public network doesn't need an administrator later). The Setup screen, shown once, offers to fix
the firewall if something changed (that needs an administrator) and to install the optional Virtual
Display Driver for Extend.

### Linux (X11 or Wayland)

```sh
sudo apt install build-essential libx11-dev libxi-dev libxtst-dev libxext-dev libxrandr-dev libxfixes-dev
cd linux
npm install
npm run build:helper
npm start
npm run dist                    # AppImage and .deb in linux/dist/
```

The Setup screen walks you through the rest. On Wayland that means input access (one admin
prompt, then log out and back in once). It can also install OpenSSH for the terminal. Extend on
GNOME Wayland uses Python 3 with GObject and GStreamer's PipeWire plugin (`python3-gi`,
`gstreamer1.0-pipewire`), which GNOME desktops already have.

<a name="nixos--nix-flakes"></a>

#### NixOS & Nix Flakes

DuoDesk includes a `flake.nix` with package, dev shell, and NixOS module support:

```sh
# Run directly with flakes
nix run github:0xCodez/DuoDesk

# Or enter development environment
nix develop
```

On NixOS, enable the module in your system configuration:

```nix
{
  programs.twindesk = {
    enable = true;
    user = "yourusername"; # adds to input/uinput groups for Wayland KVM
  };
}
```

See [docs/nixos.md](docs/nixos.md) for full options (firewall, Wi-Fi Direct capability wrappers, virtual displays, and more).


#### Testing the Linux app from a Mac

`linux/scripts/vm-test.sh` runs it in a [Parallels Desktop](https://www.parallels.com) Linux VM
(Ubuntu with the packages above and Node.js): it copies this checkout into the VM, builds the
helper, starts DuoDesk in the VM's desktop session and drives it from the Mac.

```sh
linux/scripts/vm-test.sh start            # sync, build and (re)start it in the VM
linux/scripts/vm-test.sh shot linux.png   # screenshot of its window
linux/scripts/vm-test.sh eval "UI.go('cursor')"
linux/scripts/vm-test.sh log
```

On the VM's shared network it finds the Mac's DuoDesk and pairs like any Linux computer.

### Android

```sh
cd android
./gradlew assembleRelease        # JDK 17+; app/build/outputs/apk/{standard,full}/release/
```

`standard` is the build people download. `full` adds notification access, the SMS permissions
(Messages) and the Accessibility service (mouse and keyboard without wireless debugging), which Play Protect blocks in downloaded apps; the computers install it over wireless debugging (Phone page ›
Notifications from the phone), so `npm run dist` on each platform bundles the newest
`android/dist/*-full.apk`.

<a name="github-actions"></a>

### GitHub Actions

**Build Android**, **Build Linux** and **Build Windows** (Actions tab › Run workflow) make the
standard and full APKs, the AppImage and .deb, and the x64 and arm64 installers, helpers included.
Set the `ANDROID_KEYSTORE` secret to the key the Android app is signed with
(`base64 -i ~/.android/debug.keystore`): the APKs then install over existing ones, and the Linux and
Windows builds carry the full Android app. Without it the APKs get the runner's own key and the
computers' builds leave the Android app out.

To Authenticode-sign the Windows installers, set the `WIN_CSC_LINK` secret to a base64-encoded
Windows code-signing `.pfx` certificate and `WIN_CSC_KEY_PASSWORD` to its password. Keep the
certificate and password out of the repository. When `WIN_CSC_LINK` is set, the Windows build fails
if signing cannot complete instead of silently publishing an unsigned installer. Signing gives
users a verified publisher and can help SmartScreen reputation build over time; it does not
guarantee that antivirus products will stop flagging a file.

</details>

## Thanks

DuoDesk builds on TwinDesk, which is better for everyone who sent it a pull request (links go to the TwinDesk repository):

- [@DevPsycho-07](https://github.com/DevPsycho-07): the phone as a remote ([#44](https://github.com/InukaAsith/TwinDesk/pull/44)), screenshots across the clipboard ([#45](https://github.com/InukaAsith/TwinDesk/pull/45)), phone window controls ([#46](https://github.com/InukaAsith/TwinDesk/pull/46)) and phone fixes ([#43](https://github.com/InukaAsith/TwinDesk/pull/43))
- [@benzntech](https://github.com/benzntech): the phone's camera ([#48](https://github.com/InukaAsith/TwinDesk/pull/48)), Developer ID signing and notarization ([#40](https://github.com/InukaAsith/TwinDesk/pull/40)) and the Mac's downloads ([#39](https://github.com/InukaAsith/TwinDesk/pull/39))
- [@atse25029-collab](https://github.com/atse25029-collab): WhatsApp and Instagram in phone windows ([#42](https://github.com/InukaAsith/TwinDesk/pull/42))
- [@philopaterwaheed](https://github.com/philopaterwaheed): Cursor lock ([#49](https://github.com/InukaAsith/TwinDesk/pull/49))
- [@ghustanov](https://github.com/ghustanov): wireless debugging's auto-off ([#31](https://github.com/InukaAsith/TwinDesk/pull/31)) and the Mac helpers' Info.plist ([#30](https://github.com/InukaAsith/TwinDesk/pull/30))
- [@m-uvex](https://github.com/m-uvex): the Nix flake and NixOS module ([#37](https://github.com/InukaAsith/TwinDesk/pull/37))
- Erdoğan Yeşil ([@erdodo](https://github.com/erdodo)): the mesh DuoDesk Mesh is built on ([#29](https://github.com/InukaAsith/TwinDesk/pull/29)), and [#8](https://github.com/InukaAsith/TwinDesk/pull/8) and [#9](https://github.com/InukaAsith/TwinDesk/pull/9)
- [@Jay-Prajapati01](https://github.com/Jay-Prajapati01): signed Windows installers ([#13](https://github.com/InukaAsith/TwinDesk/pull/13))

And thanks to everyone who reports problems and shares ideas in the [issues](https://github.com/0xCodez/DuoDesk/issues).

## Credits

DuoDesk is made by [0xCodez](https://github.com/0xCodez) ([source](https://github.com/0xCodez/DuoDesk), [website](https://getduodesk.vercel.app)).
It is a fork of [TwinDesk](https://github.com/InukaAsith/TwinDesk) by [Inuka Asith](https://github.com/InukaAsith),
released under the GNU GPL v3.0; DuoDesk keeps that licence and every original copyright notice.

## License

DuoDesk is free software, licensed under the [GNU General Public License v3.0](LICENSE).
Copyright © 2026 0xCodez; based on TwinDesk, Copyright © 2026 inukaasith.

Parts are adapted from [DeskPad](https://github.com/Stengo/DeskPad) (MIT). See [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES)
for details.
