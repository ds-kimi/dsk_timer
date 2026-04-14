const $ = (sel) => document.querySelector(sel);

// Titlebar
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

// Alert & break events from main process
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
