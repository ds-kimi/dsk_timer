function barIndex(L, x, y) {
  if (y < L.top || y > L.top + L.chartH) return -1;
  const x0 = 16;
  for (let j = 0; j < L.data.length; j++) {
    const bx = x0 + L.gap + j * (L.barW + L.gap);
    if (x >= bx && x <= bx + L.barW) return j;
  }
  return -1;
}

window.chartHit = { barIndex };
