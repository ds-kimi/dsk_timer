function mix(n) {
  n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d) >>> 0;
  n = Math.imul(n ^ (n >>> 13), 0x297a2d39) >>> 0;
  return (n ^ (n >>> 16)) >>> 0;
}

function series(startDate, endDate) {
  const out = [];
  const cur = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  let idx = 0;
  while (cur <= end) {
    const key = cur.toISOString().slice(0, 10);
    let s = 2166136261;
    for (let i = 0; i < key.length; i++) s = Math.imul(s ^ key.charCodeAt(i), 16777619) >>> 0;
    const a = mix(s ^ idx * 0x517cc1b7);
    const b = mix(a ^ cur.getDay() * 0x2048b13f);
    const c = mix(b ^ 0x9e3779b9);
    const light = a % 9 === 0;
    const cap = light ? 5400 : 32400;
    const base = light ? 180 : 900;
    const total = base + (b % (cap - base));
    const share = 0.12 + (c % 8888) / 8888 * 0.82;
    const work = Math.floor(total * share);
    out.push({ date: key, work, fun: total - work });
    cur.setDate(cur.getDate() + 1);
    idx++;
  }
  return out;
}

module.exports = { series };
