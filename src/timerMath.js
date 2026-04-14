function elapsed(f) {
  if (!f.sessionStart) return 0;
  if (f.sessionPaused) return Math.floor(f.accumulatedElapsed);
  const seg = (Date.now() - f.lastSpeedChange) / 1000;
  return Math.floor(f.accumulatedElapsed + seg * f.speedMultiplier);
}

module.exports = { elapsed };
