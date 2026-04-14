function applyStatsSummary(data) {
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

window.statsSummary = { apply: applyStatsSummary };
