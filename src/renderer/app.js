window.$ = (sel) => document.querySelector(sel);
let pollInterval = null;

async function updateUI() {
  const st = await window.timerAPI.getStatus();
  $("#timer-value").textContent = window.fmt.formatTime(st.elapsed);
  $("#stat-work").textContent = window.fmt.formatStat(st.totals.work + (st.mode === "work" ? st.elapsed : 0));
  $("#stat-fun").textContent = window.fmt.formatStat(st.totals.fun + (st.mode === "fun" ? st.elapsed : 0));
  setActiveMode(st.mode, st.onBreak, st.paused);
}

function setActiveMode(mode, onBreak, paused) {
  if (mode) {
    document.body.className = `mode-${mode}`;
    $("#status-text").textContent = paused
      ? "Paused (idle)"
      : (mode === "work" ? "Working" : "Having Fun");
    $("#btn-work").classList.toggle("active", mode === "work");
    $("#btn-fun").classList.toggle("active", mode === "fun");
    $("#btn-work").disabled = mode === "work";
    $("#btn-fun").disabled = mode === "fun";
    $("#btn-stop").disabled = false;
    return;
  }
  if (onBreak) {
    document.body.className = "mode-break";
    $("#status-text").textContent = "On break";
    $("#btn-work").classList.remove("active");
    $("#btn-fun").classList.remove("active");
    $("#btn-work").disabled = false;
    $("#btn-fun").disabled = false;
    $("#btn-stop").disabled = true;
    return;
  }
  document.body.className = "";
  $("#status-text").textContent = "Idle";
  $("#btn-work").classList.remove("active");
  $("#btn-fun").classList.remove("active");
  $("#btn-work").disabled = false;
  $("#btn-fun").disabled = false;
  $("#btn-stop").disabled = true;
}

async function startMode(mode) {
  const res = await window.timerAPI.start(mode);
  if (res && res.error === "break") {
    window.sounds.playErrorBeep();
    return;
  }
  window.breakUI.hideBreakPanel();
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(updateUI, 1000);
  updateUI();
}

async function stopMode() {
  await window.timerAPI.stop();
  if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
  await updateUI();
}

window.startMode = startMode;
window.stopMode = stopMode;
window.updateUI = updateUI;
window.polling = {
  start: () => {
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(updateUI, 1000);
    updateUI();
  },
  stop: () => {
    if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
  },
};

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
    window.breakUI.setCountdownPaused(true);
    const c = document.getElementById("stats-canvas");
    if (c && window.__statsChartsLoaded && window.chartBarAnim) window.chartBarAnim.cancel(c);
  } else {
    window.breakUI.setCountdownPaused(false);
    window.timerAPI.getStatus().then((st) => {
      if (!st.mode && !st.onBreak) return;
      if (pollInterval) clearInterval(pollInterval);
      pollInterval = setInterval(updateUI, 1000);
      updateUI();
    });
  }
});
