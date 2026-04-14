const path = require("path");
const { execSync } = require("child_process");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

if (!process.env.GH_TOKEN?.trim()) {
  console.error("GH_TOKEN is missing. Set it in .env (copy from .env.example) or in the environment.");
  process.exit(1);
}

const root = path.join(__dirname, "..");
process.env.CSC_IDENTITY_AUTO_DISCOVERY = "false";
execSync("npm run icons", { cwd: root, stdio: "inherit", env: process.env });
execSync("npx electron-builder --win --publish always", { cwd: root, stdio: "inherit", env: process.env });
