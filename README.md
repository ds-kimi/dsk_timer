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
| **Persistence** | Sessions and settings live under your user data folder (see below). |
| **Idle pause** | Optional: pause the active session when the system has been idle long enough (settings). |
| **Floating overlay** | Optional small always-on-top bar (status + time). Position is adjusted from Settings (Move / Done). Stays on top of normal windows; exclusive fullscreen (many games) can still cover it. |
| **Display scaling** | Window and overlay scale up on wide work areas (roughly 1920px baseline, capped) so the UI stays usable on large or 4K-class desktops. |
| **Alert volume** | Slider 0–100 for in-app beeps; **Test** plays a sample. Windows toast sounds follow system volume. |
| **Dev** | `npm run dev` enables a speed multiplier control for testing. |
| **Updates** | Installed builds check GitHub Releases on launch (after a short delay). If a newer version exists, you are asked to download; when the installer is ready, you can restart to apply. Does not run in development (`electron .`). |

---

## GitHub auto-updates

1. In **`package.json`**, set **`repository.url`**, **`build.publish[].owner`**, and **`build.publish[].repo`** to your real GitHub user/org and repository name (replace `YOUR_GITHUB_USER` / `dsk_timer`).
2. Bump **`version`** in **`package.json`** for every release (semver).
3. **Ship a release** so **`electron-builder`** uploads the NSIS installer, **`latest.yml`**, and related files to a **GitHub Release** (not only loose files in a tag).

Create a [personal access token](https://github.com/settings/tokens) with **`repo`** scope. Copy **`.env.example`** to **`.env`**, set **`GH_TOKEN=`**, then:

```bash
npm run release
```

If **`GH_TOKEN`** is already set in your shell, that value is used and **`.env`** does not override it.

The packaged app embeds the update feed; users who installed an older build get the prompt on the next launch once the new release is public.

---

## Settings

All saved to `config.json`:

- Fun per session / per day (minutes)
- Work before break / break duration (minutes)
- Pause after idle (seconds; `0` disables)
- Alert volume (0–100) and floating overlay on/off
- Launch on startup (Windows login item)

---

## Data location (Windows)

Typical path: `%APPDATA%\dsk-timer\`

| File | Contents |
|------|----------|
| `sessions.json` | Finished sessions (mode, start, duration) |
| `config.json` | Settings and overlay position |

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

## Project layout (short)

```
assets/           SVG source, generated .ico / .png
scripts/          Icon generation, after-pack rcedit step
src/
  main.js         Window, tray, IPC, single instance, scaling, updater
  updater.js      GitHub Releases check (packaged builds only)
  config.js       Settings
  timer*.js       Session timing, pause, checkpoint
  storage.js      sessions.json
  statsData.js    Aggregates for charts
  breaks*.js      Break flow and notifications
  alerts*.js      Break trigger, fun limits
  idle*.js        Idle detection and notifications
  overlay*.js     Floating bar window
  displayScale.js UI scale from primary display work area
  preload*.js     Context bridges
  renderer/       HTML, CSS, UI scripts, charts, overlay UI
```

---

## Requirements

- **Windows** (installer and shortcuts target Windows)
- **Node.js** for `npm install`, `npm start`, and `npm run build`
