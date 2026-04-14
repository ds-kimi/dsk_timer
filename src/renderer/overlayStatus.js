function overlayElapsedForDisplay(st) {
  if (st.onBreak) return st.breakRemaining ?? 0;
  return st.elapsed;
}

function overlayLabel(st) {
  if (st.mode) {
    return st.paused ? "Paused" : (st.mode === "work" ? "Work" : "Fun");
  }
  if (st.onBreak) return "Break";
  return "Idle";
}

function overlayModeClass(st) {
  if (st.mode && st.paused) return "mode-paused";
  if (st.mode === "work") return "mode-work";
  if (st.mode === "fun") return "mode-fun";
  if (st.onBreak) return "mode-break";
  return "mode-idle";
}

window.overlayStatus = { overlayElapsedForDisplay, overlayLabel, overlayModeClass };
