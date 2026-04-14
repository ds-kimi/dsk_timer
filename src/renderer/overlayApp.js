const root = document.getElementById("root");
const elLabel = document.getElementById("status-label");
const elTime = document.getElementById("time");
let lastW = 0;
let lastH = 0;

function setMoving(on) {
  root.classList.toggle("moving", !!on);
}

function pushSize() {
  const r = root.getBoundingClientRect();
  const w = Math.ceil(r.width);
  const h = Math.ceil(r.height);
  if (w === lastW && h === lastH) return;
  lastW = w;
  lastH = h;
  window.overlayAPI.setContentSize(w, h);
}

async function refresh() {
  const st = await window.overlayAPI.getStatus();
  const moving = root.classList.contains("moving");
  elLabel.textContent = window.overlayStatus.overlayLabel(st);
  elTime.textContent = window.fmt.formatTime(st.elapsed);
  root.className = `shell ${window.overlayStatus.overlayModeClass(st)}`;
  if (moving) root.classList.add("moving");
  requestAnimationFrame(() => requestAnimationFrame(pushSize));
}

function wire() {
  window.overlayAPI.onMoveMode((on) => {
    setMoving(on);
    requestAnimationFrame(() => requestAnimationFrame(pushSize));
  });
  new ResizeObserver(pushSize).observe(root);
  setInterval(refresh, 1000);
  refresh();
}

wire();
