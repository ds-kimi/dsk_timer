function barIndexAt(L, x, y) {
  if (y < L.top || y > L.top + L.chartH) return -1;
  const x0 = 16;
  for (let j = 0; j < L.data.length; j++) {
    const bx = x0 + L.gap + j * (L.barW + L.gap);
    if (x >= bx && x <= bx + L.barW) return j;
  }
  return -1;
}

function ensureChartTooltip(canvas) {
  if (canvas.dataset.tipBound) return;
  canvas.dataset.tipBound = "1";
  const tip = document.getElementById("chart-tooltip");
  const wrap = canvas.parentElement;
  if (!tip) return;
  canvas.addEventListener("mousemove", (e) => {
    const L = canvas._chartLayout;
    if (!L || !L.data.length) return;
    const rect = canvas.getBoundingClientRect();
    const idx = barIndexAt(L, e.clientX - rect.left, e.clientY - rect.top);
    if (idx < 0) {
      tip.hidden = true;
      return;
    }
    const row = L.data[idx];
    const dt = new Date(row.date + "T00:00:00");
    const ds = dt.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
    tip.textContent = `${ds} — Work ${window.fmt.formatStat(row.work)}, Fun ${window.fmt.formatStat(row.fun)}`;
    tip.hidden = false;
    const wr = wrap.getBoundingClientRect();
    tip.style.left = `${e.clientX - wr.left}px`;
    tip.style.top = `${e.clientY - wr.top}px`;
  });
  canvas.addEventListener("mouseleave", () => { tip.hidden = true; });
}

window.chartTooltip = { ensure: ensureChartTooltip };
