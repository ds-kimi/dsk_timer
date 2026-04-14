async function openSettings() {
  const cfg = await window.timerAPI.loadConfig();
  const info = await window.timerAPI.getAppInfo();
  $("#settings-about").textContent =
    `App version ${info.version} · ${info.osLine}`;
  $("#cfg-fun-session").value = cfg.funSessionLimit;
  $("#cfg-fun-daily").value = cfg.funDailyLimit;
  $("#cfg-work-before").value = cfg.workBeforeBreak;
  $("#cfg-break-dur").value = cfg.breakDuration;
  $("#cfg-idle-stop").value = cfg.idleStopAfterSeconds ?? 30;
  const vol = cfg.notificationVolume ?? 100;
  $("#cfg-notify-vol").value = String(vol);
  $("#cfg-notify-vol-val").textContent = String(vol);
  $("#cfg-overlay").checked = !!cfg.overlayEnabled;
  $("#btn-overlay-move").disabled = !cfg.overlayEnabled;
  $("#btn-overlay-move").hidden = false;
  $("#btn-overlay-done").hidden = true;
  $("#cfg-autolaunch").checked = cfg.autoLaunch;
  $("#settings-panel").hidden = false;
}

async function closeSettings() {
  await window.timerAPI.overlayStopMove();
  $("#btn-overlay-move").hidden = false;
  $("#btn-overlay-done").hidden = true;
  $("#settings-panel").hidden = true;
}

async function saveSettings() {
  await window.timerAPI.overlayStopMove();
  $("#btn-overlay-move").hidden = false;
  $("#btn-overlay-done").hidden = true;
  const prev = await window.timerAPI.loadConfig();
  const idleRaw = parseInt($("#cfg-idle-stop").value, 10);
  const idleStopAfterSeconds = Number.isFinite(idleRaw)
    ? Math.min(3600, Math.max(0, idleRaw))
    : 30;
  const volRaw = parseInt($("#cfg-notify-vol").value, 10);
  const notificationVolume = Number.isFinite(volRaw)
    ? Math.min(100, Math.max(0, volRaw))
    : 100;
  const cfg = {
    funSessionLimit: parseInt($("#cfg-fun-session").value, 10) || 60,
    funDailyLimit: parseInt($("#cfg-fun-daily").value, 10) || 180,
    workBeforeBreak: parseInt($("#cfg-work-before").value, 10) || 30,
    breakDuration: parseInt($("#cfg-break-dur").value, 10) || 5,
    idleStopAfterSeconds,
    notificationVolume,
    autoLaunch: $("#cfg-autolaunch").checked,
    overlayEnabled: $("#cfg-overlay").checked,
    overlayBounds: prev.overlayBounds,
  };
  await window.timerAPI.saveConfig(cfg);
  $("#settings-panel").hidden = true;
}

window.settingsUI = { open: openSettings, close: closeSettings, save: saveSettings };
