const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const toIco = require("to-ico");

const root = path.join(__dirname, "..");
const svgPath = path.join(root, "assets", "clock-minimal.svg");
const outDir = path.join(root, "assets");

async function main() {
  const svg = fs.readFileSync(svgPath);
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const pngBuffers = await Promise.all(
    sizes.map((s) => sharp(svg).resize(s, s).png().toBuffer())
  );
  fs.writeFileSync(path.join(outDir, "icon.ico"), await toIco(pngBuffers));
  fs.writeFileSync(path.join(outDir, "icon.png"), pngBuffers[3]);
  await sharp(svg).resize(128).png().toFile(path.join(outDir, "logo.png"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
