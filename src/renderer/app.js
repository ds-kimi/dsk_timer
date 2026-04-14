const $ = (sel) => document.querySelector(sel);
let pollInterval = null;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function formatTime(totalSec) {
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatStat(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return `${h}h ${m}m`;
}

async function updateUI() {
  const st = await window.timerAPI.getStatus();
  $("#timer-value").textContent = formatTime(st.elapsed);
  $("#stat-work").textContent = formatStat(st.totals.work + (st.mode === "work" ? st.elapsed : 0));
  $("#stat-fun").textContent = formatStat(st.totals.fun + (st.mode === "fun" ? st.elapsed : 0));
  setActiveMode(st.mode);
}

function setActiveMode(mode) {
  document.body.className = mode ? `mode-${mode}` : "";
  $("#status-text").textContent = mode ? (mode === "work" ? "Working" : "Having Fun") : "Idle";
  $("#btn-work").classList.toggle("active", mode === "work");
  $("#btn-fun").classList.toggle("active", mode === "fun");
  $("#btn-work").disabled = mode === "work";
  $("#btn-fun").disabled = mode === "fun";
  $("#btn-stop").disabled = !mode;
}

async function startMode(mode) {
  await window.timerAPI.start(mode);
  startPolling();
}

async function stopMode() {
  await window.timerAPI.stop();
  stopPolling();
  await updateUI();
}

function startPolling() {
  stopPolling();
  updateUI();
  pollInterval = setInterval(updateUI, 1000);
}

function stopPolling() {
  if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
}

// Titlebar buttons
$("#btn-minimize").addEventListener("click", () => window.timerAPI.minimize());
$("#btn-close").addEventListener("click", () => window.timerAPI.close());

// Mode buttons
$("#btn-work").addEventListener("click", () => startMode("work"));
$("#btn-fun").addEventListener("click", () => startMode("fun"));
$("#btn-stop").addEventListener("click", stopMode);

// Dev mode: hold-to-speed button
window.timerAPI.isDev().then((dev) => {
  if (!dev) return;
  const btn = $("#btn-speed");
  btn.hidden = false;
  btn.addEventListener("mousedown", () => window.timerAPI.setSpeed(200));
  btn.addEventListener("mouseup", () => window.timerAPI.setSpeed(1));
  btn.addEventListener("mouseleave", () => window.timerAPI.setSpeed(1));
});

// Alert beep — 3 short warning tones
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

window.timerAPI.onBeep(() => playBeep());

// Init
updateUI().then(() => {
  window.timerAPI.getStatus().then((st) => {
    if (st.mode) startPolling();
  });
});
