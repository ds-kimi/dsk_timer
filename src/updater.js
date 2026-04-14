const { app, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

let getMain = null;
let wired = false;

function wireMainWindow(fn) {
  getMain = fn;
}

function mainWin() {
  const w = getMain && getMain();
  return w && !w.isDestroyed() ? w : null;
}

function ensureWired() {
  if (wired) return;
  wired = true;
  autoUpdater.autoDownload = false;
  autoUpdater.on("update-available", async (info) => {
    const r = await dialog.showMessageBox(mainWin(), {
      type: "info",
      buttons: ["Download", "Not now"],
      defaultId: 0,
      cancelId: 1,
      title: "Update available",
      message: `Version ${info.version} is available.`,
    });
    if (r.response === 0) void autoUpdater.downloadUpdate();
  });
  autoUpdater.on("update-downloaded", async (info) => {
    const r = await dialog.showMessageBox(mainWin(), {
      type: "info",
      buttons: ["Restart now", "Later"],
      defaultId: 0,
      cancelId: 1,
      title: "Update ready",
      message: `Version ${info.version} is ready. Restart to finish installing.`,
    });
    if (r.response === 0) {
      app.removeAllListeners("window-all-closed");
      autoUpdater.quitAndInstall(false, true);
    }
  });
  autoUpdater.on("error", (e) => console.error("[updater]", e.message));
}

function checkOnLaunch() {
  if (!app.isPackaged) return;
  ensureWired();
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(() => {});
  }, 2500);
}

module.exports = { wireMainWindow, checkOnLaunch };
