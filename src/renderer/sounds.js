const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

async function gainScale(overridePercent) {
  if (overridePercent !== undefined && Number.isFinite(overridePercent)) {
    return Math.min(100, Math.max(0, overridePercent)) / 100;
  }
  const cfg = await window.timerAPI.loadConfig();
  return (cfg.notificationVolume ?? 100) / 100;
}

async function playBeep(overridePercent) {
  const v = await gainScale(overridePercent);
  const g = 0.02 * v;
  [0, 300, 600].forEach((delay) => {
    setTimeout(() => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 520;
      osc.type = "sine";
      gain.gain.value = g;
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.12);
    }, delay);
  });
  document.body.classList.add("alert-flash");
  setTimeout(() => document.body.classList.remove("alert-flash"), 1000);
}

async function playErrorBeep() {
  const v = await gainScale();
  const g = 0.06 * v;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 220;
  osc.type = "sine";
  gain.gain.value = g;
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.2);
  document.body.classList.add("alert-flash");
  setTimeout(() => document.body.classList.remove("alert-flash"), 600);
}

window.sounds = { playBeep, playErrorBeep };
