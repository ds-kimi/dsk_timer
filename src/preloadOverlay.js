const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("overlayAPI", {
  getStatus: () => ipcRenderer.invoke("timer:status"),
  setContentSize: (w, h) => ipcRenderer.invoke("overlay:setContentSize", w, h),
  onMoveMode: (cb) => ipcRenderer.on("overlay:moveMode", (_, v) => cb(v)),
});
