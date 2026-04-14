const fs = require("fs");
const path = require("path");
const rcedit = require("rcedit");

module.exports = async (context) => {
  if (context.electronPlatformName !== "win32") return;
  const name = `${context.packager.appInfo.productFilename}.exe`;
  const exePath = path.join(context.appOutDir, name);
  if (!fs.existsSync(exePath)) return;
  const iconPath = path.join(__dirname, "..", "assets", "icon.ico");
  await rcedit(exePath, { icon: iconPath });
};
