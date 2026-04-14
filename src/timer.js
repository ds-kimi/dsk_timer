const fields = require("./sessionFields");
const storage = require("./storage");
const checkpoint = require("./timerCheckpoint");
const timerPause = require("./timerPause");
const { elapsed } = require("./timerMath");

function startSession(mode) {
  if (fields.currentMode) stopSession();
  fields.currentMode = mode;
  fields.sessionStart = Date.now();
  fields.lastSpeedChange = Date.now();
  fields.accumulatedElapsed = 0;
  fields.speedMultiplier = 1;
  fields.sessionPaused = false;
  checkpoint.onStart();
  return { mode, startTime: fields.sessionStart };
}

function setSpeed(mult) {
  fields.accumulatedElapsed = elapsed(fields);
  fields.lastSpeedChange = Date.now();
  fields.speedMultiplier = mult;
}

function stopSession() {
  if (!fields.currentMode) return null;
  const duration = elapsed(fields);
  const startIso = new Date(fields.sessionStart).toISOString();
  storage.addSession(fields.currentMode, startIso, duration);
  const result = { mode: fields.currentMode, duration };
  checkpoint.onStop();
  fields.currentMode = null;
  fields.sessionStart = null;
  fields.speedMultiplier = 1;
  fields.accumulatedElapsed = 0;
  fields.sessionPaused = false;
  return result;
}

function getStatus() {
  return {
    mode: fields.currentMode,
    elapsed: elapsed(fields),
    paused: fields.sessionPaused,
    totals: storage.getTodayTotals(),
  };
}

module.exports = {
  startSession,
  stopSession,
  getStatus,
  setSpeed,
  pauseSession: timerPause.pause,
  resumeSession: timerPause.resume,
  persistNow: checkpoint.persistNow,
  restoreFromDisk: checkpoint.restoreFromDisk,
};
