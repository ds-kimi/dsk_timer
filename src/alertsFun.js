const { Notification } = require("electron");

const SESSION_LIMIT = 3600;
const DAILY_LIMIT = 10800;
let sessionAlerted = false;
let dailyAlerted = false;

function checkFunLimits(st, mainWindow) {
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

checkFunLimits.reset = () => {
  sessionAlerted = false;
  dailyAlerted = false;
};

function fireAlert(body, mainWindow) {
  new Notification({
    title: "DSK Timer — Fun Limit",
    body,
    urgency: "critical",
  }).show();
  mainWindow.webContents.send("alert:beep");
}

module.exports = { checkFunLimits };
