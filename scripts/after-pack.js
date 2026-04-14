const fs = require("fs");
const path = require("path");
const rcedit = require("rcedit");

module.exports = async (context) => {
  if (context.electronPlatformName !== "win32") return;
   const { productFilename, productName, version } = context.packager.appInfo;
  const name = `${productFilename}.exe`;
  const exePath = path.join(context.appOutDir, name);
  if (!fs.existsSync(exePath)) return;
  const iconPath = path.join(__dirname, "..", "assets", "icon.ico");
  const segs = String(version).split(".").slice(0, 4);
  while (segs.length < 4) segs.push("0");
  const ver = segs.join(".");
  await rcedit(exePath, {
    icon: iconPath,
    "file-version": ver,
    "product-version": ver,
    "version-string": {
      FileDescription: productName,
      ProductName: productName,
    },
  });
};
