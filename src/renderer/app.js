const $ = (sel) => document.querySelector(sel);
let pollInterval = null;

async function updateUI() {
  const st = await window.timerAPI.getStatus();
  $("#timer-value").textContent = window.fmt.formatTime(st.elapsed);
  $("#stat-work").textContent = window.fmt.formatStat(st.totals.work + (st.mode === "work" ? st.elapsed : 0));
  $("#stat-fun").textContent = window.fmt.formatStat(st.totals.fun + (st.mode === "fun" ? st.elapsed : 0));
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
  const res = await window.timerAPI.start(mode);
  if (res && res.error === "break") {
    window.sounds.playErrorBeep();
    return;
  }
  window.breakUI.hideBreakPanel();
  pollInterval = setInterval(updateUI, 1000);
  updateUI();
}

async function stopMode() {
  await window.timerAPI.stop();
  if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
  await updateUI();
}

window.polling = { start: () => { pollInterval = setInterval(updateUI, 1000); updateUI(); } };
