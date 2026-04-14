function placeTooltip(tip, clientX, clientY) {
  const pad = 8;
  const gap = 10;
  const below = 22;
  tip.style.position = "fixed";
  tip.style.left = "0";
  tip.style.top = "0";
  tip.style.transform = "none";
  tip.hidden = false;
  const w = tip.offsetWidth;
  const h = tip.offsetHeight;
  let left = clientX - w / 2;
  let top = clientY - h - gap;
  if (top < pad) top = clientY + below;
  left = Math.max(pad, Math.min(left, window.innerWidth - w - pad));
  top = Math.max(pad, Math.min(top, window.innerHeight - h - pad));
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

function ensureChartTooltip(canvas) {
  if (canvas.dataset.tipBound) return;
  canvas.dataset.tipBound = "1";
  const tip = document.getElementById("chart-tooltip");
  if (!tip) return;
  canvas.addEventListener("mousemove", (e) => {
    const L = canvas._chartLayout;
    if (!L || !L.data.length) return;
    const rect = canvas.getBoundingClientRect();
    const idx = window.chartHit.barIndex(L, e.clientX - rect.left, e.clientY - rect.top);
    if (idx < 0) {
      tip.hidden = true;
      return;
    }
    const row = L.data[idx];
    const dt = new Date(row.date + "T00:00:00");
    const ds = dt.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
    tip.textContent = `${ds} — Work ${window.fmt.formatStat(row.work)}, Fun ${window.fmt.formatStat(row.fun)}`;
    placeTooltip(tip, e.clientX, e.clientY);
  });
  canvas.addEventListener("mouseleave", () => { tip.hidden = true; });
}

window.chartTooltip = { ensure: ensureChartTooltip };
