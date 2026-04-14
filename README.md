# DSK Timer

A lightweight desktop work/fun activity timer built with Electron. Track how you spend your time, enforce healthy work breaks, and get alerts when you've been having too much fun.

## Features

- **Work / Fun modes** — toggle between the two with a single click
- **Live timer** — large `HH:MM:SS` display updating every second
- **Daily stats** — bottom cards show total work and fun time for the day
- **System tray** — closing the window hides to tray, timer keeps running in the background
- **Session persistence** — all sessions saved to a local JSON file in AppData

### Work Breaks

After **30 minutes** of continuous work, a mandatory **5-minute break** is enforced:

- The timer auto-stops and a blue break panel with a countdown appears
- A Windows notification and beep sound fire
- Clicking Work before the 5 minutes are up plays an error buzzer and blocks you
- When the break ends, another notification tells you to get back to work

### Fun Limits

- **1 hour per session** — notification + beep when a single fun session hits 60 minutes
- **3 hours per day** — notification + beep when total daily fun time reaches 3 hours

### Dev Mode

Run with `npm run dev` to enable a 200x speed button for testing time-based features quickly.

## Install

```
npm install
```

## Run

```
npm start
```

## Dev Mode

```
npm run dev
```

## Project Structure

```
src/
├── main.js          Electron main process, window, tray, IPC
├── preload.js       Secure IPC bridge (contextIsolation)
├── timer.js         Timer state machine (start/stop/speed/elapsed)
├── storage.js       JSON session persistence to AppData
├── alerts.js        1-second check loop for work breaks + fun limits
├── alertsFun.js     Fun session and daily limit checking
├── breaks.js        Break state (start/end/remaining/canResume)
├── breaksNotify.js  Windows notifications for break start/end
└── renderer/
    ├── index.html   App layout
    ├── styles.css   Dark UI with glow effects
    ├── format.js    Time formatting helpers
    ├── sounds.js    Beep and error sound generators (Web Audio)
    ├── breakui.js   Break panel show/hide/countdown
    ├── app.js       Core UI updates, mode switching, polling
    └── events.js    Button listeners, IPC event handlers, init
```
