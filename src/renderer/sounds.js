const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep() {
  [0, 300, 600].forEach((delay) => {
    setTimeout(() => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 520;
      osc.type = "sine";
      gain.gain.value = 0.02;
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.12);
    }, delay);
  });
  document.body.classList.add("alert-flash");
  setTimeout(() => document.body.classList.remove("alert-flash"), 1000);
}

function playErrorBeep() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 220;
  osc.type = "sine";
  gain.gain.value = 0.06;
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.2);
  document.body.classList.add("alert-flash");
  setTimeout(() => document.body.classList.remove("alert-flash"), 600);
}

window.sounds = { playBeep, playErrorBeep };
