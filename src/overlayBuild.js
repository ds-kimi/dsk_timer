const { BrowserWindow } = require("electron");

function applyTop(w) {
  try {
    w.setAlwaysOnTop(true, "screen-saver");
  } catch {
    w.setAlwaysOnTop(true);
  }
}

function createOverlay(bounds, preloadPath, htmlPath, zoomFactor) {
  const z = zoomFactor > 0 ? zoomFactor : 1;
  const w = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
      backgroundThrottling: false,
      zoomFactor: z,
    },
  });
  applyTop(w);
  w.loadFile(htmlPath);
  w.once("ready-to-show", () => {
    applyTop(w);
    w.show();
  });
  return w;
}

module.exports = { createOverlay, applyTop };
