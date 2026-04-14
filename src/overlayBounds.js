const { screen } = require("electron");
const config = require("./config");

function readBounds(cfg, SIZE, scale) {
  const s = scale > 0 ? scale : 1;
  const dw = Math.round(SIZE.width * s);
  const dh = Math.round(SIZE.height * s);
  const b = cfg.overlayBounds;
  if (b && Number.isFinite(b.x) && Number.isFinite(b.y)) {
    const w = Number.isFinite(b.width) && b.width >= 72 ? b.width : dw;
    const h = Number.isFinite(b.height) && b.height >= 24 ? b.height : dh;
    return { x: b.x, y: b.y, width: w, height: h };
  }
  const { workArea } = screen.getPrimaryDisplay();
  return {
    x: Math.round(workArea.x + workArea.width - dw - 16),
    y: Math.round(workArea.y + workArea.height - dh - 16),
    width: dw,
    height: dh,
  };
}

function persist(win) {
  const cfg = config.load();
  const r = win.getBounds();
  cfg.overlayBounds = { x: r.x, y: r.y, width: r.width, height: r.height };
  config.save(cfg);
}

module.exports = { readBounds, persist };
