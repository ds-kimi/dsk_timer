const fields = require("./sessionFields");
const checkpoint = require("./timerCheckpoint");
const { elapsed } = require("./timerMath");

function pause() {
  if (!fields.currentMode || fields.sessionPaused) return false;
  fields.accumulatedElapsed = elapsed(fields);
  fields.sessionPaused = true;
  fields.lastSpeedChange = Date.now();
  checkpoint.persistNow();
  return true;
}

function resume() {
  if (!fields.currentMode || !fields.sessionPaused) return false;
  fields.sessionPaused = false;
  fields.lastSpeedChange = Date.now();
  checkpoint.persistNow();
  return true;
}

module.exports = { pause, resume };
