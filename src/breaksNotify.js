const { Notification } = require("electron");

function notifyBreakStart(mainWin) {
  new Notification({
    title: "DSK Timer — Break Time",
    body: "You worked 30min! Take a 5 minute break.",
    urgency: "critical",
  }).show();
  if (mainWin) mainWin.webContents.send("alert:beep");
}

function notifyBreakOver(mainWin) {
  new Notification({
    title: "DSK Timer — Break Over",
    body: "5 minutes are up, time to get back to work!",
    urgency: "critical",
  }).show();
  if (mainWin) mainWin.webContents.send("break:over");
}

module.exports = { notifyBreakStart, notifyBreakOver };
