async function openSettings() {
  const cfg = await window.timerAPI.loadConfig();
  $("#cfg-fun-session").value = cfg.funSessionLimit;
  $("#cfg-fun-daily").value = cfg.funDailyLimit;
  $("#cfg-work-before").value = cfg.workBeforeBreak;
  $("#cfg-break-dur").value = cfg.breakDuration;
  $("#settings-panel").hidden = false;
}

function closeSettings() {
  $("#settings-panel").hidden = true;
}

async function saveSettings() {
  const cfg = {
    funSessionLimit: parseInt($("#cfg-fun-session").value, 10) || 60,
    funDailyLimit: parseInt($("#cfg-fun-daily").value, 10) || 180,
    workBeforeBreak: parseInt($("#cfg-work-before").value, 10) || 30,
    breakDuration: parseInt($("#cfg-break-dur").value, 10) || 5,
  };
  await window.timerAPI.saveConfig(cfg);
  closeSettings();
}

window.settingsUI = { open: openSettings, close: closeSettings, save: saveSettings };
