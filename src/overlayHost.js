const path = require("path");
const config = require("./config");
const displayScale = require("./displayScale");
const boundsUtil = require("./overlayBounds");
const { createOverlay, applyTop } = require("./overlayBuild");

const SIZE = { width: 96, height: 28 };
let win = null;
let uiScale = 1;

function passthroughClicks(on) {
  if (!win || win.isDestroyed()) return;
  if (on) win.setIgnoreMouseEvents(true, { forward: true });
  else win.setIgnoreMouseEvents(false);
}

function syncEnabled() {
  const cfg = config.load();
  uiScale = displayScale.getUiScale();
  if (!cfg.overlayEnabled) {
    destroy();
    return;
  }
  if (win && !win.isDestroyed()) {
    applyTop(win);
    if (!win.isVisible()) win.show();
    passthroughClicks(true);
    return;
  }
  const b = boundsUtil.readBounds(cfg, SIZE, uiScale);
  const preload = path.join(__dirname, "preloadOverlay.js");
  const html = path.join(__dirname, "renderer", "overlay.html");
  win = createOverlay(b, preload, html, uiScale);
  win.on("closed", () => { win = null; });
  win.once("show", () => passthroughClicks(true));
}

function setMoveMode(on) {
  if (!win || win.isDestroyed()) return;
  passthroughClicks(!on);
  win.webContents.send("overlay:moveMode", !!on);
}

function stopMove() {
  if (win && !win.isDestroyed()) boundsUtil.persist(win);
  setMoveMode(false);
}

function setContentSize(cw, ch) {
  if (!win || win.isDestroyed()) return;
  const w = Math.max(72, Math.round(cw));
  const h = Math.max(24, Math.round(ch));
  const cur = win.getContentSize();
  if (Math.abs(cur[0] - w) < 2 && Math.abs(cur[1] - h) < 2) return;
  win.setContentSize(w, h);
}

function destroy() {
  if (win && !win.isDestroyed()) win.destroy();
  win = null;
}

module.exports = { syncEnabled, setMoveMode, stopMove, setContentSize, destroy };
