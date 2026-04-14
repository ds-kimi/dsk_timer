const timer = require("./timer");
const breaks = require("./breaks");
const { checkFunLimits } = require("./alertsFun");

let interval = null;
let breakAlerted = false;

function start(mainWindow) {
  interval = setInterval(() => check(mainWindow), 1000);
}

function stop() {
  if (interval) { clearInterval(interval); interval = null; }
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
