<p align="center">
  <img src="assets/logo.png" alt="DSK Timer logo" width="96" height="96">
</p>

<h1 align="center">DSK Timer</h1>

<p align="center">
  <strong>Desktop work &amp; fun timer for Windows</strong><br>
  <sub>Frameless window · tray · local data only · optional floating overlay</sub>
</p>

<p align="center">
  <a href="https://github.com/ds-kimi/dsk_timer/releases"><img src="https://img.shields.io/github/v/release/ds-kimi/dsk_timer?sort=semver&amp;style=for-the-badge&amp;logo=github&amp;label=release" alt="GitHub release"></a>
  <a href="https://github.com/ds-kimi/dsk_timer"><img src="https://img.shields.io/github/stars/ds-kimi/dsk_timer?style=for-the-badge&amp;logo=github" alt="GitHub stars"></a>
  <img src="https://img.shields.io/badge/Windows-10%20%7C%2011-0078D6?style=for-the-badge&amp;logo=windows&amp;logoColor=white" alt="Windows">
  <a href="https://www.electronjs.org/"><img src="https://img.shields.io/badge/Electron-33-47848F?style=for-the-badge&amp;logo=electron&amp;logoColor=white" alt="Electron"></a>
</p>

<br>

## Screenshots

<table>
  <tr>
    <td width="50%" align="center">
      <a href="assets/main_ui.png"><img src="assets/main_ui.png" alt="Main timer window"></a>
      <p align="center"><sub><b>Main</b> — work / fun session, elapsed time, today’s totals</sub></p>
    </td>
    <td width="50%" align="center">
      <a href="assets/stats.png"><img src="assets/stats.png" alt="Activity and statistics"></a>
      <p align="center"><sub><b>Activity</b> — work vs fun by day (week / month / year)</sub></p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <a href="assets/break_time.png"><img src="assets/break_time.png" alt="Mandatory break countdown"></a>
      <p align="center"><sub><b>Break</b> — mandatory rest countdown before work resumes</sub></p>
    </td>
    <td width="50%" align="center">
      <a href="assets/overlay.png"><img src="assets/overlay.png" alt="Floating overlay bar"></a>
      <p align="center"><sub><b>Overlay</b> — always-on-top status and timer</sub></p>
    </td>
  </tr>
</table>

---

## What it does

- Start **Work** or **Fun**; see elapsed time as `HH:MM:SS` and today’s saved totals.
- After enough continuous work, a **mandatory break** locks work until the countdown finishes.
- Optional **fun limits** (per session and per day) trigger Windows notifications and in-app beeps.
- **Activity** view shows work vs fun per day (week / month / year) and lets you reset history.

---

## Features

| Area | Behaviour |
|------|-----------|
| **Tray** | Close hides the window; the process stays running. Tray menu: Show, Quit. |
| **Single instance** | Starting the app again focuses the existing window instead of opening a second copy. |
| **Persistence** | Settings and session history are stored on your PC and persist between launches. |
| **Idle pause** | Optional: pause the active session when the system has been idle long enough (settings). |
| **Floating overlay** | Optional small always-on-top bar (status + time). Position is adjusted from Settings (Move / Done). Stays on top of normal windows; exclusive fullscreen (many games) can still cover it. |
| **Display scaling** | Window and overlay scale up on wide work areas (roughly 1920px baseline, capped) so the UI stays usable on large or 4K-class desktops. |
| **Alert volume** | Slider 0–100 for in-app beeps; **Test** plays a sample. Windows toast sounds follow system volume. |
| **Dev** | `npm run dev` enables a speed multiplier control for testing. |
| **Updates** | Installed builds check GitHub Releases on launch (after a short delay). If a newer version exists, you are asked to download; when the installer is ready, you can restart to apply. Does not run in development (`electron .`). |

---

## Development

```bash
npm install
npm start
```

```bash
npm run dev
```

---

## Build installer

Needs Node.js on the build machine.

```bash
npm run build
```

Regenerates icons from `assets/clock-minimal.svg`, runs **electron-builder** for Windows (NSIS), then **`scripts/after-pack.js`** uses **rcedit** so the packaged `DSK Timer.exe` carries `assets/icon.ico` (shortcuts and search show your icon, not the default Electron one).

Output: `dist\` — e.g. `DSK Timer Setup <version>.exe` (one-click install, desktop and Start Menu shortcuts).

Icons only:

```bash
npm run icons
```

---

## Requirements

- **Windows** (installer and shortcuts target Windows)
- **Node.js** for `npm install`, `npm start`, and `npm run build`
