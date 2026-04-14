const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("timerAPI", {
  start: (mode) => ipcRenderer.invoke("timer:start", mode),
  stop: () => ipcRenderer.invoke("timer:stop"),
  getStatus: () => ipcRenderer.invoke("timer:status"),
  setSpeed: (m) => ipcRenderer.invoke("timer:speed", m),
  breakStatus: () => ipcRenderer.invoke("break:status"),
  loadConfig: () => ipcRenderer.invoke("config:load"),
  saveConfig: (c) => ipcRenderer.invoke("config:save", c),
  statsRange: (s, e) => ipcRenderer.invoke("stats:range", s, e),
  statsClear: () => ipcRenderer.invoke("stats:clear"),
  isDev: () => ipcRenderer.invoke("app:isDev"),
  minimize: () => ipcRenderer.invoke("win:minimize"),
  close: () => ipcRenderer.invoke("win:close"),
  overlaySetMoveMode: (on) => ipcRenderer.invoke("overlay:setMoveMode", on),
  overlayStopMove: () => ipcRenderer.invoke("overlay:stopMove"),
  onBeep: (cb) => ipcRenderer.on("alert:beep", cb),
  onBreakStart: (cb) => ipcRenderer.on("break:start", cb),
  onBreakOver: (cb) => ipcRenderer.on("break:over", cb),
  onIdlePause: (cb) => ipcRenderer.on("timer:idle-pause", cb),
  onIdleResume: (cb) => ipcRenderer.on("timer:idle-resume", cb),
});
