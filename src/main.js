const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require("electron");
const fs = require("fs");
const path = require("path");

const ICON_PATH = path.join(__dirname, "..", "assets", "icon.ico");
const timer = require("./timer");
const alerts = require("./alerts");
const breaks = require("./breaks");
const config = require("./config");
const statsData = require("./statsData");

const IS_DEV = process.argv.includes("--dev");
let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 520,
    resizable: false,
    frame: false,
    transparent: true,
    icon: fs.existsSync(ICON_PATH) ? ICON_PATH : undefined,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
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
  ipcMain.handle("timer:status", () => timer.getStatus());
  ipcMain.handle("timer:speed", (_, mult) => timer.setSpeed(mult));
  ipcMain.handle("break:status", () => breaks.getStatus());
  ipcMain.handle("config:load", () => config.load());
  ipcMain.handle("config:save", (_, cfg) => {
    config.save(cfg);
    applyAutoLaunch();
  });
  ipcMain.handle("stats:range", (_, s, e) => statsData.getRange(s, e));
  ipcMain.handle("stats:clear", () => statsData.clearAll());
  ipcMain.handle("app:isDev", () => IS_DEV);
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

app.on("before-quit", () => timer.persistNow());

app.whenReady().then(() => {
  applyAutoLaunch();
  timer.restoreFromDisk();
  createWindow();
  createTray();
  registerIPC();
  breaks.init(mainWindow);
  alerts.start(mainWindow);
});

app.on("window-all-closed", () => app.quit());
