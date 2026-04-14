const { screen } = require("electron");

function getUiScale() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  return Math.min(1.75, Math.max(1, width / 1920));
}

module.exports = { getUiScale };
