// Titlebar
$("#btn-stats").addEventListener("click", async () => {
  await window.loadStatsCharts();
  window.statsUI.open();
});
$("#btn-settings").addEventListener("click", () => window.settingsUI.open());
$("#btn-minimize").addEventListener("click", () => window.timerAPI.minimize());
$("#btn-close").addEventListener("click", () => window.timerAPI.close());

// Settings
$("#btn-settings-close").addEventListener("click", () => window.settingsUI.close());
$("#btn-settings-save").addEventListener("click", () => window.settingsUI.save());
$("#cfg-notify-vol").addEventListener("input", () => {
  $("#cfg-notify-vol-val").textContent = $("#cfg-notify-vol").value;
});
$("#btn-test-alert").addEventListener("click", () => {
  const raw = parseInt($("#cfg-notify-vol").value, 10);
  const pct = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 100;
  window.sounds.playBeep(pct);
});
$("#cfg-overlay").addEventListener("change", async () => {
  $("#btn-overlay-move").disabled = !$("#cfg-overlay").checked;
  if (!$("#cfg-overlay").checked) {
    await window.timerAPI.overlayStopMove();
    $("#btn-overlay-move").hidden = false;
    $("#btn-overlay-done").hidden = true;
  }
});
$("#btn-overlay-move").addEventListener("click", async () => {
  if ($("#btn-overlay-move").disabled) return;
  await window.timerAPI.overlaySetMoveMode(true);
  $("#btn-overlay-move").hidden = true;
  $("#btn-overlay-done").hidden = false;
});
$("#btn-overlay-done").addEventListener("click", async () => {
  await window.timerAPI.overlayStopMove();
  $("#btn-overlay-move").hidden = false;
  $("#btn-overlay-done").hidden = true;
});

// Stats
$("#btn-stats-close").addEventListener("click", () => {
  if (window.statsUI) window.statsUI.close();
});
document.querySelectorAll(".stats-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    if (window.setStatsRange) window.setStatsRange(tab.dataset.range);
  });
});
$("#btn-stats-nav-prev").addEventListener("click", () => {
  if (window.statsNavWire) window.statsNavWire(-1);
});
$("#btn-stats-nav-next").addEventListener("click", () => {
  if (window.statsNavWire) window.statsNavWire(1);
});

// Stats reset with confirmation
$("#btn-stats-reset").addEventListener("click", () => {
  $("#reset-confirm").hidden = false;
});
$("#btn-reset-no").addEventListener("click", () => {
  $("#reset-confirm").hidden = true;
});
$("#btn-reset-yes").addEventListener("click", async () => {
  await window.timerAPI.statsClear();
  $("#reset-confirm").hidden = true;
  if (window.__statsChartsLoaded) {
    window.statsDrill.reset();
    await window.statsUI.refresh();
  }
});

// Mode buttons
$("#btn-work").addEventListener("click", () => startMode("work"));
$("#btn-fun").addEventListener("click", () => startMode("fun"));
$("#btn-stop").addEventListener("click", stopMode);

// Dev mode
window.timerAPI.isDev().then((dev) => {
  if (!dev) return;
  const btn = $("#btn-speed");
  btn.hidden = false;
  btn.addEventListener("mousedown", () => window.timerAPI.setSpeed(200));
  btn.addEventListener("mouseup", () => window.timerAPI.setSpeed(1));
  btn.addEventListener("mouseleave", () => window.timerAPI.setSpeed(1));
});

// IPC events
window.timerAPI.onBeep(() => window.sounds.playBeep());
window.timerAPI.onBreakStart(() => window.breakUI.showBreakPanel());
window.timerAPI.onBreakOver(() => {
  window.sounds.playBeep();
  if (!$("#break-panel").hidden) window.breakUI.hideBreakPanel();
  updateUI();
});
window.timerAPI.onIdlePause(() => updateUI());
window.timerAPI.onIdleResume(() => updateUI());

// Init
updateUI().then(() => {
  window.timerAPI.getStatus().then((st) => {
    if (st.mode || st.onBreak) window.polling.start();
  });
});
