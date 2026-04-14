const { powerMonitor } = require("electron");
const config = require("./config");
const timer = require("./timer");
const { notifyIdlePaused, notifyIdleResumed } = require("./idleNotify");

let intervalId = null;
let win = null;

function tick() {
  const threshold = config.load().idleStopAfterSeconds;
  const st0 = timer.getStatus();
  if (threshold < 1) {
    if (st0.mode && st0.paused) {
      timer.resumeSession();
      if (win && !win.isDestroyed()) win.webContents.send("timer:idle-resume");
    }
    return;
  }
  const idle = powerMonitor.getSystemIdleTime();
  const st = timer.getStatus();
  if (!st.mode) return;
  if (idle > threshold && !st.paused) {
    timer.pauseSession();
    notifyIdlePaused(st.mode);
    if (win && !win.isDestroyed()) win.webContents.send("timer:idle-pause");
    return;
  }
  if (idle <= threshold && st.paused) {
    timer.resumeSession();
    notifyIdleResumed(st.mode);
    if (win && !win.isDestroyed()) win.webContents.send("timer:idle-resume");
  }
}

function start(mainWindow) {
  stop();
  win = mainWindow;
  intervalId = setInterval(tick, 5000);
}

function stop() {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  win = null;
}

module.exports = { start, stop };
