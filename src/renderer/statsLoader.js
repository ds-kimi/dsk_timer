const STATS_SCRIPTS = [
  "chartSeparators.js",
  "chartBarAnim.js",
  "chart.js",
  "chartHit.js",
  "dateRangeClip.js",
  "statsDrill.js",
  "chartTooltip.js",
  "statsSummary.js",
  "statsNavUi.js",
  "statsPanel.js",
];

let statsLoadInFlight = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}

function loadStatsCharts() {
  if (window.__statsChartsLoaded) return Promise.resolve();
  if (statsLoadInFlight) return statsLoadInFlight;
  statsLoadInFlight = (async () => {
    try {
      for (const name of STATS_SCRIPTS) {
        await loadScript(name);
      }
      window.__statsChartsLoaded = true;
    } finally {
      statsLoadInFlight = null;
    }
  })();
  return statsLoadInFlight;
}

window.loadStatsCharts = loadStatsCharts;
