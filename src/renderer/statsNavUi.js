function formatRangeLabel(startIso, endIso) {
  const opt = { month: "short", day: "numeric", year: "numeric" };
  const a = new Date(startIso + "T12:00:00");
  const b = new Date(endIso + "T12:00:00");
  if (startIso === endIso) return a.toLocaleDateString("en", opt);
  return `${a.toLocaleDateString("en", opt)} – ${b.toLocaleDateString("en", opt)}`;
}

function updateRangesNav(eff, tab, getBase) {
  const nav = $("#stats-chart-nav");
  if (!nav) return;
  if (!window.statsDrill.shouldShowNav(tab)) {
    nav.hidden = true;
    return;
  }
  nav.hidden = false;
  $("#stats-range-label").textContent = formatRangeLabel(eff.start, eff.end);
  $("#btn-stats-nav-prev").disabled = !window.statsDrill.canNavPrev(tab, getBase);
  $("#btn-stats-nav-next").disabled = !window.statsDrill.canNavNext(tab, getBase);
}

window.statsNavUi = { updateRangesNav };
