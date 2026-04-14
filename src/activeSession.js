const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const FILE = path.join(app.getPath("userData"), "active-session.json");

function write(state) {
  fs.writeFileSync(FILE, JSON.stringify(state));
}

function read() {
  if (!fs.existsSync(FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return null;
  }
}

function clear() {
  if (fs.existsSync(FILE)) fs.unlinkSync(FILE);
}

module.exports = { write, read, clear };
