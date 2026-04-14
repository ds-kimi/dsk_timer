const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require("electron");
const path = require("path");
const timer = require("./timer");
const alerts = require("./alerts");

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
  const icon = nativeImage.createEmpty();
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
    alerts.resetFlags();
    return timer.startSession(mode);
  });
  ipcMain.handle("timer:stop", () => timer.stopSession());
  ipcMain.handle("timer:status", () => timer.getStatus());
  ipcMain.handle("timer:speed", (_, mult) => timer.setSpeed(mult));
  ipcMain.handle("app:isDev", () => IS_DEV);
  ipcMain.handle("win:minimize", () => mainWindow.hide());
  ipcMain.handle("win:close", () => mainWindow.hide());
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  registerIPC();
  alerts.start(mainWindow);
});

app.on("window-all-closed", () => app.quit());
