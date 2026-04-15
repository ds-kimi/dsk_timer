let breakInterval = null;

let speedWasVisible = false;

function showBreakPanel() {
  speedWasVisible = !$("#btn-speed").hidden;
  $("#break-panel").hidden = false;
  $("#timer-display").hidden = true;
  $("#mode-buttons").hidden = true;
  $("#btn-stop").hidden = true;
  $("#btn-speed").hidden = true;
  document.body.className = "mode-break";
  $("#status-text").textContent = "On break";
  $("#break-hint").textContent = "Relax, you earned it";
  startCountdown();
}

function hideBreakPanel() {
  $("#break-panel").hidden = true;
  $("#timer-display").hidden = false;
  $("#mode-buttons").hidden = false;
  $("#btn-stop").hidden = false;
  if (speedWasVisible) $("#btn-speed").hidden = false;
  if (breakInterval) { clearInterval(breakInterval); breakInterval = null; }
}

async function startCountdown() {
  if (breakInterval) clearInterval(breakInterval);
  breakInterval = setInterval(async () => {
    const bs = await window.timerAPI.breakStatus();
    const m = String(Math.floor(bs.remaining / 60)).padStart(2, "0");
    const s = String(bs.remaining % 60).padStart(2, "0");
    $("#break-countdown").textContent = `${m}:${s}`;
    if (bs.remaining <= 0) {
      clearInterval(breakInterval);
      breakInterval = null;
      $("#break-hint").textContent = "Ready to work!";
      hideBreakPanel();
      if (window.updateUI) void window.updateUI();
    }
  }, 1000);
}

function setCountdownPaused(paused) {
  if (paused) {
    if (breakInterval) {
      clearInterval(breakInterval);
      breakInterval = null;
    }
  } else if (!$("#break-panel").hidden) {
    startCountdown();
  }
}

window.breakUI = { showBreakPanel, hideBreakPanel, setCountdownPaused };
