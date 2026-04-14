const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep() {
  [0, 250, 500].forEach((delay) => {
    setTimeout(() => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.15);
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
  osc.frequency.value = 200;
  osc.type = "square";
  gain.gain.value = 0.25;
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.3);
  document.body.classList.add("alert-flash");
  setTimeout(() => document.body.classList.remove("alert-flash"), 600);
}

window.sounds = { playBeep, playErrorBeep };
