const timer = require("./timer");
const breaks = require("./breaks");
const { checkFunLimits } = require("./alertsFun");

let timeoutId = null;
let breakAlerted = false;

function tick(mainWindow) {
  check(mainWindow);
  const st = timer.getStatus();
  const delay = st.mode || breaks.getStatus().onBreak ? 1000 : 5000;
  timeoutId = setTimeout(() => tick(mainWindow), delay);
}

function start(mainWindow) {
  if (timeoutId) clearTimeout(timeoutId);
  tick(mainWindow);
}

function stop() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

function resetFlags() {
  breakAlerted = false;
  checkFunLimits.reset();
}

function check(mainWindow) {
  breaks.checkBreakOver();
  const st = timer.getStatus();
  if (!st.mode) return;
  if (st.mode === "work" && !breakAlerted && st.elapsed >= breaks.getStatus().workLimit) {
    breakAlerted = true;
    timer.stopSession();
    breaks.startBreak();
    mainWindow.webContents.send("break:start");
  }
  if (st.mode === "fun") checkFunLimits(st, mainWindow);
}

module.exports = { start, stop, resetFlags };
