const $ = (sel) => document.querySelector(sel);
let breakInterval = null;

function showBreakPanel() {
  $("#break-panel").hidden = false;
  document.body.className = "mode-break";
  $("#status-text").textContent = "On Break";
  $("#btn-work").disabled = true;
  $("#btn-fun").disabled = false;
  $("#btn-stop").disabled = true;
  $("#timer-value").textContent = "00:00:00";
  $("#break-hint").textContent = "Relax, you earned it";
  startCountdown();
}

function hideBreakPanel() {
  $("#break-panel").hidden = true;
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
    }
  }, 1000);
}

window.breakUI = { showBreakPanel, hideBreakPanel };
