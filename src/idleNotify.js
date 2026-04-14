const { Notification } = require("electron");

function notifyIdlePaused(mode) {
  const work = mode === "work";
  new Notification({
    title: "DSK Timer — Paused",
    body: work
      ? "Work timer paused — no keyboard or mouse activity."
      : "Fun timer paused — no keyboard or mouse activity.",
  }).show();
}

function notifyIdleResumed(mode) {
  const work = mode === "work";
  new Notification({
    title: "DSK Timer — Resumed",
    body: work ? "Work timer is running again." : "Fun timer is running again.",
  }).show();
}

module.exports = { notifyIdlePaused, notifyIdleResumed };
