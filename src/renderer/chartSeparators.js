function drawSeparators(ctx, data, bw, gap, top, chartH, x0, labelMode) {
  const yearView = labelMode === "year";
  ctx.save();
  for (let i = 1; i < data.length; i++) {
    const d = new Date(data[i].date + "T12:00:00");
    const prev = new Date(data[i - 1].date + "T12:00:00");
    const mon = d.getMonth() !== prev.getMonth() || d.getFullYear() !== prev.getFullYear();
    const wk = (d.getDay() + 6) % 7 === 0;
    if (!mon && !wk) continue;
    if (yearView && !mon) continue;
    const x = x0 + gap + i * (bw + gap) - gap / 2;
    ctx.beginPath();
    ctx.strokeStyle = mon ? "rgba(104,104,111,0.48)" : "rgba(104,104,111,0.2)";
    ctx.lineWidth = 1;
    ctx.moveTo(Math.floor(x) + 0.5, top);
    ctx.lineTo(Math.floor(x) + 0.5, top + chartH);
    ctx.stroke();
  }
  ctx.restore();
}

window.chartSeparators = { draw: drawSeparators };
