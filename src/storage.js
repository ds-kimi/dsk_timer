const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const DATA_FILE = path.join(app.getPath("userData"), "sessions.json");

function loadSessions() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(sessions, null, 2));
}

function addSession(mode, startIso, durationSec) {
  const sessions = loadSessions();
  sessions.push({
    mode,
    date: new Date().toISOString().slice(0, 10),
    start: startIso,
    duration: Math.round(durationSec),
  });
  saveSessions(sessions);
}

function getTodayTotals() {
  const today = new Date().toISOString().slice(0, 10);
  let work = 0, fun = 0;
  for (const s of loadSessions()) {
    if (s.date !== today) continue;
    if (s.mode === "work") work += s.duration;
    else fun += s.duration;
  }
  return { work, fun };
}

module.exports = { addSession, getTodayTotals };
