const fields = require("./sessionFields");
const activeSession = require("./activeSession");
const { elapsed } = require("./timerMath");

let intervalId = null;

function persistNow() {
  if (!fields.currentMode) return;
  activeSession.write({
    mode: fields.currentMode,
    sessionStart: fields.sessionStart,
    accumulatedElapsed: elapsed(fields),
    speedMultiplier: fields.speedMultiplier,
  });
}

function restoreFromDisk() {
  const data = activeSession.read();
  if (!data || !data.mode) return;
  fields.currentMode = data.mode;
  fields.sessionStart = data.sessionStart;
  fields.accumulatedElapsed = data.accumulatedElapsed;
  fields.speedMultiplier = data.speedMultiplier;
  fields.lastSpeedChange = Date.now();
  onStart();
}

function onStart() {
  persistNow();
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(persistNow, 60_000);
}

function onStop() {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  activeSession.clear();
}

module.exports = { persistNow, restoreFromDisk, onStart, onStop };
