const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const CONFIG_FILE = path.join(app.getPath("userData"), "config.json");

const DEFAULTS = {
  funSessionLimit: 60,
  funDailyLimit: 180,
  workBeforeBreak: 30,
  breakDuration: 5,
};

function load() {
  if (!fs.existsSync(CONFIG_FILE)) return { ...DEFAULTS };
  try {
    return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8")) };
  } catch {
    return { ...DEFAULTS };
  }
}

function save(cfg) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
}

module.exports = { load, save, DEFAULTS };
