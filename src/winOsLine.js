const os = require("os");
const { execSync } = require("child_process");

function regSz(name) {
  try {
    const out = execSync(
      `reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v ${name}`,
      { encoding: "utf8", maxBuffer: 4096, windowsHide: true, timeout: 4000 }
    );
    const m = out.match(new RegExp(`${name}\\s+REG_SZ\\s+(.+)`, "i"));
    return m ? m[1].trim() : "";
  } catch {
    return "";
  }
}

function getLine() {
  const parts = os.release().split(".");
  const build = parseInt(parts[2], 10) || 0;
  const brand = build >= 22000 ? "Windows 11" : "Windows 10";
  const dv = regSz("DisplayVersion") || regSz("ReleaseId");
  if (dv) return `${brand} (${dv})`;
  return brand;
}

module.exports = { getLine };
