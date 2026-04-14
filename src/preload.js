const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("timerAPI", {
  start: (mode) => ipcRenderer.invoke("timer:start", mode),
  stop: () => ipcRenderer.invoke("timer:stop"),
  getStatus: () => ipcRenderer.invoke("timer:status"),
  setSpeed: (m) => ipcRenderer.invoke("timer:speed", m),
  isDev: () => ipcRenderer.invoke("app:isDev"),
  minimize: () => ipcRenderer.invoke("win:minimize"),
  close: () => ipcRenderer.invoke("win:close"),
  onBeep: (cb) => ipcRenderer.on("alert:beep", cb),
});
