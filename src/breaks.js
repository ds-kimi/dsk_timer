const { notifyBreakStart, notifyBreakOver } = require("./breaksNotify");

const WORK_BEFORE_BREAK = 1800;
const BREAK_DURATION = 300;
let breakStart = null;
let breakNotified = false;
let mainWin = null;

function init(win) { mainWin = win; }

function getRemaining() {
  if (!breakStart) return 0;
  return Math.max(0, Math.ceil(BREAK_DURATION - (Date.now() - breakStart) / 1000));
}

function startBreak() {
  breakStart = Date.now();
  breakNotified = false;
  notifyBreakStart(mainWin);
}

function canResumeWork() { return !breakStart || getRemaining() <= 0; }

module.exports = {
  init, startBreak, canResumeWork,
  endBreak: () => { breakStart = null; breakNotified = false; },
  checkBreakOver: () => {
    if (!breakStart || breakNotified || getRemaining() > 0) return;
    breakNotified = true;
    notifyBreakOver(mainWin);
  },
  getStatus: () => ({ onBreak: !!breakStart, remaining: getRemaining(), workLimit: WORK_BEFORE_BREAK }),
};
