function easeCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function cancel(canvas) {
  if (canvas._barAnimRaf) {
    cancelAnimationFrame(canvas._barAnimRaf);
    canvas._barAnimRaf = null;
  }
}

function paintFlowBars(ctx, data, maxVal, barW, gap, top, chartH, globalT, stagger, workPhase, x0) {
  data.forEach((d, i) => {
    const wH = (d.work / maxVal) * chartH;
    const fH = (d.fun / maxVal) * chartH;
    const delay = Math.min(0.72, i * stagger);
    const u = Math.max(0, Math.min(1, (globalT - delay) / Math.max(0.08, 1 - delay)));
    const e = easeCubic(u);
    let wP, fP;
    if (e <= workPhase) {
      wP = easeCubic(e / workPhase);
      fP = 0;
    } else {
      wP = 1;
      fP = easeCubic((e - workPhase) / (1 - workPhase));
    }
    const curW = wH * wP;
    const curF = fH * fP;
    const x = x0 + gap + i * (barW + gap);
    const glow = globalT < 0.92 && (wP < 1 || fP < 1);
    ctx.shadowColor = glow ? "rgba(196,196,202,0.45)" : "transparent";
    ctx.shadowBlur = glow ? 10 : 0;
    ctx.fillStyle = "#dcdce0";
    ctx.fillRect(x, top + chartH - curW - curF, barW, curW);
    ctx.fillStyle = "#4a4a52";
    ctx.fillRect(x, top + chartH - curF, barW, curF);
    ctx.shadowBlur = 0;
  });
}

function run(canvas, ctx, w, h, dpr, data, range, layout, drawLabelsFn) {
  cancel(canvas);
  const { maxVal, barW, gap, top, chartH, labels, bottom } = layout;
  const x0 = 16;
  const n = data.length;
  const t0 = performance.now();

  function frame(now) {
    const globalT = Math.min(1, (now - t0) / 780);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    paintFlowBars(ctx, data, maxVal, barW, gap, top, chartH, globalT, 0.055, 0.38, x0);
    window.chartSeparators.draw(ctx, data, barW, gap, top, chartH, x0, range);
    drawLabelsFn(ctx, labels, n, barW, gap, h, bottom);
    canvas._chartLayout = { data, barW, gap, top, chartH };
    if (globalT < 1) canvas._barAnimRaf = requestAnimationFrame(frame);
    else canvas._barAnimRaf = null;
  }

  canvas._barAnimRaf = requestAnimationFrame(frame);
}

window.chartBarAnim = { run, cancel };
