const { Notification } = require("electron");
const config = require("./config");

let sessionAlerted = false;
let dailyAlerted = false;

function checkFunLimits(st, mainWindow) {
  const cfg = config.load();
  const sessionLimit = cfg.funSessionLimit * 60;
  const dailyLimit = cfg.funDailyLimit * 60;
  const dailyTotal = st.totals.fun + st.elapsed;
  if (!sessionAlerted && st.elapsed >= sessionLimit) {
    fireAlert(`${cfg.funSessionLimit}min of fun this session!`, mainWindow);
    sessionAlerted = true;
  }
  if (!dailyAlerted && dailyTotal >= dailyLimit) {
    fireAlert(`${cfg.funDailyLimit}min of fun today! Time to work.`, mainWindow);
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
