function drawChart(canvas, data, range) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  if (!data.length) return;
  const maxVal = Math.max(...data.map(d => d.work + d.fun), 1);
  const labels = data.map(d => formatLabel(d.date, range));
  const barArea = w - 32;
  const barW = Math.min(24, (barArea / data.length) * 0.6);
  const gap = (barArea - barW * data.length) / (data.length + 1);
  const top = 8, bottom = 22;
  const chartH = h - top - bottom;

  drawBars(ctx, data, maxVal, barW, gap, top, chartH);
  drawLabels(ctx, labels, data.length, barW, gap, h, bottom);
}

function drawBars(ctx, data, max, bw, gap, top, ch) {
  const x0 = 16;
  data.forEach((d, i) => {
    const x = x0 + gap + i * (bw + gap);
    const wH = (d.work / max) * ch;
    const fH = (d.fun / max) * ch;
    ctx.fillStyle = "#dcdce0";
    ctx.fillRect(x, top + ch - wH - fH, bw, wH);
    ctx.fillStyle = "#4a4a52";
    ctx.fillRect(x, top + ch - fH, bw, fH);
  });
}

function drawLabels(ctx, labels, count, bw, gap, h, bot) {
  ctx.fillStyle = "#68686f";
  ctx.font = "9px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  const step = count > 14 ? Math.ceil(count / 10) : 1;
  const x0 = 16;
  labels.forEach((l, i) => {
    if (i % step !== 0) return;
    const x = x0 + gap + i * (bw + gap) + bw / 2;
    ctx.fillText(l, x, h - bot + 14);
  });
}

function formatLabel(dateStr, range) {
  const d = new Date(dateStr + "T00:00:00");
  if (range === "year") return d.toLocaleString("en", { month: "short" });
  if (range === "month") return d.getDate().toString();
  return d.toLocaleString("en", { weekday: "short" });
}

window.chart = { draw: drawChart };
