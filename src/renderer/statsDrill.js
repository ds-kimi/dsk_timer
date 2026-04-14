window.statsDrill = (function () {
  let stack = [];
  const clip = () => window.dateRangeClip;

  function isoFromDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function daysFromIso(iso, n) {
    const d = new Date(iso + "T12:00:00");
    d.setDate(d.getDate() + n);
    return isoFromDate(d);
  }

  function monthStepIso(iso, dir) {
    const d = new Date(iso + "T12:00:00");
    d.setMonth(d.getMonth() + dir);
    d.setDate(15);
    return isoFromDate(d);
  }

  function reset() {
    stack = [];
  }

  function effective(tab, getBase) {
    const b = getBase(tab);
    if (!stack.length) return { start: b.start, end: b.end, labelMode: tab };
    const z = stack[stack.length - 1];
    return { start: z.start, end: z.end, labelMode: z.labelMode };
  }

  function barClick(tab, dateStr, getBase) {
    const b = getBase(tab);
    const c = clip();
    if (tab === "week") return;
    if (tab === "month") {
      if (stack.length === 0) stack.push(c.weekClipped(dateStr, b.start, b.end));
      return;
    }
    if (tab === "year") {
      if (stack.length === 0) stack.push(c.monthClipped(dateStr, b.start, b.end));
      else if (stack.length === 1) stack.push(c.weekClipped(dateStr, stack[0].start, stack[0].end));
      else stack[1] = c.weekClipped(dateStr, stack[0].start, stack[0].end);
    }
  }

  function canDrill(tab) {
    if (tab === "week") return false;
    if (tab === "month") return stack.length === 0;
    return tab === "year";
  }

  function shouldShowNav(tab) {
    if (tab === "month") return stack.length === 1 && stack[0].labelMode === "week";
    if (tab === "year") return stack.length >= 1;
    return false;
  }

  function canNavPrev(tab, getBase) {
    if (!shouldShowNav(tab)) return false;
    const b = getBase(tab);
    const frame = stack[stack.length - 1];
    const clipS = tab === "year" && stack.length === 2 ? stack[0].start : b.start;
    return frame.start > clipS;
  }

  function canNavNext(tab, getBase) {
    if (!shouldShowNav(tab)) return false;
    const b = getBase(tab);
    const frame = stack[stack.length - 1];
    const clipE = tab === "year" && stack.length === 2 ? stack[0].end : b.end;
    return frame.end < clipE;
  }

  function navigate(tab, dir, getBase) {
    if (dir !== -1 && dir !== 1) return;
    const b = getBase(tab);
    const c = clip();
    if (tab === "month" && stack.length === 1 && stack[0].labelMode === "week") {
      stack[0] = c.weekClipped(daysFromIso(stack[0].start, dir * 7), b.start, b.end);
      return;
    }
    if (tab === "year" && stack.length === 1) {
      stack[0] = c.monthClipped(monthStepIso(stack[0].start, dir), b.start, b.end);
      return;
    }
    if (tab === "year" && stack.length === 2) {
      stack[1] = c.weekClipped(daysFromIso(stack[1].start, dir * 7), stack[0].start, stack[0].end);
    }
  }

  return {
    reset, effective, barClick, canDrill, shouldShowNav, canNavPrev, canNavNext, navigate,
  };
})();
