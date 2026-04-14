const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require("electron");
const fs = require("fs");
const path = require("path");

const ICON_PATH = path.join(__dirname, "..", "assets", "icon.ico");
const timer = require("./timer");
const alerts = require("./alerts");
const breaks = require("./breaks");
const config = require("./config");
const statsData = require("./statsData");
const idleWatch = require("./idleWatch");
const overlayHost = require("./overlayHost");
const displayScale = require("./displayScale");
const updater = require("./updater");

const IS_DEV = process.argv.includes("--dev");
let mainWindow = null;
let tray = null;

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });
}

function createWindow() {
  const s = displayScale.getUiScale();
  mainWindow = new BrowserWindow({
    width: Math.round(420 * s),
    height: Math.round(520 * s),
    resizable: false,
    frame: false,
    transparent: true,
    icon: fs.existsSync(ICON_PATH) ? ICON_PATH : undefined,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
      backgroundThrottling: true,
      zoomFactor: s,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  mainWindow.on("close", (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
}

function createTray() {
  const icon = fs.existsSync(ICON_PATH)
    ? nativeImage.createFromPath(ICON_PATH)
    : nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip("DSK Timer");
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Show", click: () => mainWindow.show() },
    { label: "Quit", click: () => { mainWindow.destroy(); app.quit(); } },
  ]));
  tray.on("click", () => mainWindow.show());
}

function registerIPC() {
  ipcMain.handle("timer:start", (_, mode) => {
    if (mode === "work" && !breaks.canResumeWork()) {
      return { error: "break", remaining: breaks.getStatus().remaining };
    }
    breaks.endBreak();
    alerts.resetFlags();
    return timer.startSession(mode);
  });
  ipcMain.handle("timer:stop", () => timer.stopSession());
  ipcMain.handle("timer:status", () => ({
    ...timer.getStatus(),
    onBreak: breaks.getStatus().onBreak,
  }));
  ipcMain.handle("timer:speed", (_, mult) => timer.setSpeed(mult));
  ipcMain.handle("break:status", () => breaks.getStatus());
  ipcMain.handle("config:load", () => config.load());
  ipcMain.handle("config:save", (_, cfg) => {
    config.save(cfg);
    applyAutoLaunch();
    overlayHost.syncEnabled();
  });
  ipcMain.handle("overlay:setMoveMode", (_, on) => overlayHost.setMoveMode(!!on));
  ipcMain.handle("overlay:stopMove", () => overlayHost.stopMove());
  ipcMain.handle("overlay:setContentSize", (_, w, h) => overlayHost.setContentSize(w, h));
  ipcMain.handle("stats:range", (_, s, e) => statsData.getRange(s, e));
  ipcMain.handle("stats:clear", () => statsData.clearAll());
  ipcMain.handle("app:isDev", () => IS_DEV);
  ipcMain.handle("app:uiScale", () => displayScale.getUiScale());
  ipcMain.handle("win:minimize", () => {
    timer.persistNow();
    mainWindow.hide();
  });
  ipcMain.handle("win:close", () => {
    timer.persistNow();
    mainWindow.hide();
  });
}

function applyAutoLaunch() {
  const cfg = config.load();
  app.setLoginItemSettings({ openAtLogin: cfg.autoLaunch });
}

app.on("before-quit", () => {
  idleWatch.stop();
  timer.persistNow();
  overlayHost.destroy();
});

if (gotLock) {
  app.whenReady().then(() => {
    applyAutoLaunch();
    timer.restoreFromDisk();
    createWindow();
    createTray();
    registerIPC();
    breaks.init(mainWindow);
    alerts.start(mainWindow);
    idleWatch.start(mainWindow);
    overlayHost.syncEnabled();
    updater.wireMainWindow(() => mainWindow);
    updater.checkOnLaunch();
  });
}

app.on("window-all-closed", () => app.quit());
