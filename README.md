# DSK Timer

A desktop work/fun activity timer for Windows, built with Electron. Track time, enforce breaks, set your own limits, and review history in a simple chart.

## Features

- **Work / Fun** — start either mode with one click; live `HH:MM:SS` display
- **Today’s totals** — work and fun time for the current day on the main screen
- **System tray** — closing the window hides to tray; the timer keeps running
- **Persistence** — sessions and settings are stored under your user AppData folder

### Settings (gear icon)

Configurable in minutes (saved to disk):

- Fun limit per session and per day
- How long you work before a mandatory break
- Break duration
- **Launch on startup** — registers with Windows login (can be turned off)

### Work breaks

When continuous work reaches your configured “work before break” time, the session stops and a break screen appears with a countdown. You cannot start work again until the break ends. Notifications and soft sounds remind you when the break starts and when it is over.

### Fun limits

When fun time hits your per-session or per-day limits, you get a Windows notification and a short sound.

### Activity (stats icon)

- Stacked bar chart of work vs fun by day
- Ranges: **Week**, **Month**, **Year**
- Summary totals and average per day
- **Reset all data** — clears stored session history (with confirmation)

### Dev mode

```bash
npm run dev
```

Enables a high speed multiplier on a dev-only button for testing timers quickly.

## Data files (Windows)

Stored under `%APPDATA%\dsk-timer\` (or Electron’s `userData` path for the app):

- `sessions.json` — logged sessions (mode, date, duration)
- `config.json` — limits and launch-on-startup preference

## Install and run (development)

```bash
npm install
npm start
```

## Build Windows installer

Requires Node.js on the machine that builds.

```bash
npm run build
```

This regenerates icons from `assets/clock-minimal.svg`, runs **electron-builder**, then **`scripts/after-pack.js`** embeds `assets/icon.ico` into `DSK Timer.exe` with **rcedit** (so desktop/Start Menu shortcuts show your logo, not the default Electron icon). The NSIS installer is written to `dist\`:

- **`DSK Timer Setup <version>.exe`** — one-click install
- Desktop and Start Menu shortcuts (so the app appears in Windows Search)
- The installed app uses the custom icon from `assets/icon.ico`

To rebuild only the icon files from the SVG:

```bash
npm run icons
```

## Project layout

```
assets/
  clock-minimal.svg   Source logo
  icon.ico / icon.png Generated for app and build (run npm run icons)
scripts/
  generate-icons.js   SVG → ICO/PNG for Windows
  after-pack.js       Embeds icon into built exe (rcedit) after pack
src/
  main.js             Window, tray, IPC, startup login item
  preload.js          Context bridge
  config.js             Settings load/save
  timer.js              Session timer + dev speed multiplier
  storage.js            Session JSON read/write
  statsData.js          Date-range aggregates for charts
  alerts.js             Periodic checks (break trigger, fun limits)
  alertsFun.js          Fun limit notifications
  breaks.js             Mandatory break state
  breaksNotify.js       Break notifications
  renderer/
    index.html, styles.css, app.js, events.js
    format.js, sounds.js, breakui.js, settings.js
    chart.js, statsPanel.js
```

## Requirements

- **Windows** (installer and shortcuts are Windows-focused)
- **Node.js** for development and building
