let currentRange = "week";

function getDateRange(range) {
  const now = new Date();
  if (range === "week") {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monOffset = (d.getDay() + 6) % 7;
    const mon = new Date(d);
    mon.setDate(d.getDate() - monOffset);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    const iso = (x) =>
      `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    return { start: iso(mon), end: iso(sun) };
  }
  const end = now.toISOString().slice(0, 10);
  const start = new Date(now);
  if (range === "month") start.setDate(start.getDate() - 29);
  else start.setFullYear(start.getFullYear() - 1);
  return { start: start.toISOString().slice(0, 10), end };
}

async function refreshChart(opts) {
  const anim = opts && opts.chartAnim;
  const eff = window.statsDrill.effective(currentRange, getDateRange);
  const data = await window.timerAPI.statsRange(eff.start, eff.end);
  const canvas = $("#stats-canvas");
  window.chart.draw(canvas, data, eff.labelMode, { animate: anim });
  window.chartTooltip.ensure(canvas);
  if (!canvas.dataset.drillBound) {
    canvas.dataset.drillBound = "1";
    canvas.addEventListener("click", (e) => {
      const c = e.currentTarget;
      const L = c._chartLayout;
      if (!L || !L.data.length) return;
      const rect = c.getBoundingClientRect();
      const idx = window.chartHit.barIndex(L, e.clientX - rect.left, e.clientY - rect.top);
      if (idx < 0) return;
      window.statsDrill.barClick(currentRange, L.data[idx].date, getDateRange);
      refreshChart({ chartAnim: true });
    });
  }
  canvas.classList.toggle("chart-drillable", window.statsDrill.canDrill(currentRange));
  window.statsSummary.apply(data);
  window.statsNavUi.updateRangesNav(eff, currentRange, getDateRange);
}

window.statsNavWire = (dir) => {
  window.statsDrill.navigate(currentRange, dir, getDateRange);
  refreshChart({ chartAnim: true });
};

async function openStats() {
  if (window.loadStatsCharts) await window.loadStatsCharts();
  $("#stats-panel").classList.add("stats-open");
  await refreshChart({ chartAnim: true });
}

function closeStats() {
  window.statsDrill.reset();
  const canvas = document.getElementById("stats-canvas");
  if (canvas && window.__statsChartsLoaded && window.chartBarAnim) {
    window.chartBarAnim.cancel(canvas);
    canvas._chartLayout = null;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 1;
    canvas.height = 1;
  }
  $("#stats-panel").classList.remove("stats-open");
  $("#reset-confirm").hidden = true;
}

window.statsUI = { open: openStats, close: closeStats, refresh: refreshChart };

window.setStatsRange = (range) => {
  window.statsDrill.reset();
  currentRange = range;
  document.querySelectorAll(".stats-tab").forEach(t => {
    t.classList.toggle("active", t.dataset.range === range);
  });
  refreshChart({ chartAnim: true });
};
