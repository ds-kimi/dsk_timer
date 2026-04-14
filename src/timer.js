const storage = require("./storage");

let currentMode = null;
let sessionStart = null;
let speedMultiplier = 1;
let lastSpeedChange = null;
let accumulatedElapsed = 0;

function startSession(mode) {
  if (currentMode) stopSession();
  currentMode = mode;
  sessionStart = Date.now();
  lastSpeedChange = Date.now();
  accumulatedElapsed = 0;
  speedMultiplier = 1;
  return { mode, startTime: sessionStart };
}

function setSpeed(mult) {
  accumulatedElapsed = getElapsed();
  lastSpeedChange = Date.now();
  speedMultiplier = mult;
}

function stopSession() {
  if (!currentMode) return null;
  const duration = getElapsed();
  const startIso = new Date(sessionStart).toISOString();
  storage.addSession(currentMode, startIso, duration);
  const result = { mode: currentMode, duration };
  currentMode = null;
  sessionStart = null;
  speedMultiplier = 1;
  accumulatedElapsed = 0;
  return result;
}

function getElapsed() {
  if (!sessionStart) return 0;
  const segmentReal = (Date.now() - lastSpeedChange) / 1000;
  return Math.floor(accumulatedElapsed + segmentReal * speedMultiplier);
}

function getStatus() {
  return {
    mode: currentMode,
    elapsed: getElapsed(),
    totals: storage.getTodayTotals(),
  };
}

module.exports = { startSession, stopSession, getStatus, setSpeed };
