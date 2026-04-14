// Titlebar
$("#btn-stats").addEventListener("click", () => window.statsUI.open());
$("#btn-settings").addEventListener("click", () => window.settingsUI.open());
$("#btn-minimize").addEventListener("click", () => window.timerAPI.minimize());
$("#btn-close").addEventListener("click", () => window.timerAPI.close());

// Settings
$("#btn-settings-close").addEventListener("click", () => window.settingsUI.close());
$("#btn-settings-save").addEventListener("click", () => window.settingsUI.save());

// Stats
$("#btn-stats-close").addEventListener("click", () => window.statsUI.close());
document.querySelectorAll(".stats-tab").forEach(tab => {
  tab.addEventListener("click", () => window.setStatsRange(tab.dataset.range));
});
$("#btn-stats-nav-prev").addEventListener("click", () => window.statsNavWire(-1));
$("#btn-stats-nav-next").addEventListener("click", () => window.statsNavWire(1));

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
  window.statsDrill.reset();
  await window.statsUI.refresh();
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
  $("#break-hint").textContent = "Break over — get back to work!";
});

// Init
updateUI().then(() => {
  window.timerAPI.getStatus().then((st) => {
    if (st.mode) window.polling.start();
  });
});
