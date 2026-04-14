function toIsoLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function weekClipped(dateStr, pStart, pEnd) {
  const d = new Date(dateStr + "T12:00:00");
  const monOffset = (d.getDay() + 6) % 7;
  const mon = new Date(d);
  mon.setDate(d.getDate() - monOffset);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  let start = toIsoLocal(mon);
  let end = toIsoLocal(sun);
  if (start < pStart) start = pStart;
  if (end > pEnd) end = pEnd;
  return { start, end, labelMode: "week" };
}

function monthClipped(dateStr, pStart, pEnd) {
  const d = new Date(dateStr + "T12:00:00");
  const y = d.getFullYear();
  const m = d.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  let start = toIsoLocal(first);
  let end = toIsoLocal(last);
  if (start < pStart) start = pStart;
  if (end > pEnd) end = pEnd;
  return { start, end, labelMode: "month" };
}

window.dateRangeClip = { weekClipped, monthClipped };
