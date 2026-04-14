const { Notification } = require("electron");
const timer = require("./timer");

const SESSION_LIMIT = 3600;     // 1h per fun session
const DAILY_LIMIT = 10800;      // 3h total fun per day
let interval = null;
let sessionAlerted = false;
let dailyAlerted = false;

function start(mainWindow) {
  interval = setInterval(() => check(mainWindow), 1000);
}

function stop() {
  if (interval) { clearInterval(interval); interval = null; }
}

function resetFlags() {
  sessionAlerted = false;
  dailyAlerted = false;
}

function check(mainWindow) {
  const st = timer.getStatus();
  if (st.mode !== "fun") return;
  const dailyTotal = st.totals.fun + st.elapsed;

  if (!sessionAlerted && st.elapsed >= SESSION_LIMIT) {
    fireAlert("1 hour of fun this session!", mainWindow);
    sessionAlerted = true;
  }
  if (!dailyAlerted && dailyTotal >= DAILY_LIMIT) {
    fireAlert("3 hours of fun today! Time to work.", mainWindow);
    dailyAlerted = true;
  }
}

function fireAlert(body, mainWindow) {
  new Notification({
    title: "DSK Timer — Fun Limit",
    body,
    urgency: "critical",
  }).show();
  // Trigger beep sound in renderer
  mainWindow.webContents.send("alert:beep");
}

module.exports = { start, stop, resetFlags };
