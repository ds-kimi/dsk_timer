let currentRange = "week";

function getDateRange(range) {
  const now = new Date();
  const end = now.toISOString().slice(0, 10);
  const start = new Date(now);
  if (range === "week") start.setDate(start.getDate() - 6);
  else if (range === "month") start.setDate(start.getDate() - 29);
  else start.setFullYear(start.getFullYear() - 1);
  return { start: start.toISOString().slice(0, 10), end };
}

async function openStats() {
  $("#stats-panel").hidden = false;
  await refreshChart();
}

function closeStats() {
  $("#stats-panel").hidden = true;
  $("#reset-confirm").hidden = true;
}

async function refreshChart() {
  const { start, end } = getDateRange(currentRange);
  const data = await window.timerAPI.statsRange(start, end);
  const canvas = $("#stats-canvas");
  window.chart.draw(canvas, data, currentRange);
  window.chartTooltip.ensure(canvas);
  updateSummary(data);
}

function updateSummary(data) {
  let w = 0, f = 0;
  data.forEach(d => { w += d.work; f += d.fun; });
  const days = Math.max(data.length, 1);
  const fmtH = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };
  $("#summary-work").textContent = fmtH(w);
  $("#summary-fun").textContent = fmtH(f);
  $("#summary-avg").textContent = fmtH(Math.round((w + f) / days));
}

window.statsUI = { open: openStats, close: closeStats, refresh: refreshChart };

window.setStatsRange = (range) => {
  currentRange = range;
  document.querySelectorAll(".stats-tab").forEach(t => {
    t.classList.toggle("active", t.dataset.range === range);
  });
  refreshChart();
};
