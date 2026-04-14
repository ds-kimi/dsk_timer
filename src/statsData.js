const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const DATA_FILE = path.join(app.getPath("userData"), "sessions.json");

function loadAll() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")); }
  catch { return []; }
}

function getRange(startDate, endDate) {
  const all = loadAll();
  const days = {};
  for (const s of all) {
    if (s.date < startDate || s.date > endDate) continue;
    if (!days[s.date]) days[s.date] = { work: 0, fun: 0 };
    days[s.date][s.mode] = (days[s.date][s.mode] || 0) + s.duration;
  }
  return buildSeries(startDate, endDate, days);
}

function buildSeries(startDate, endDate, days) {
  const result = [];
  const cur = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  while (cur <= end) {
    const key = cur.toISOString().slice(0, 10);
    const d = days[key] || { work: 0, fun: 0 };
    result.push({ date: key, work: d.work, fun: d.fun });
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

function clearAll() {
  fs.writeFileSync(DATA_FILE, "[]");
}

module.exports = { getRange, clearAll };
