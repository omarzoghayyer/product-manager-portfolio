const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const dist = path.resolve(__dirname, "../dist");
const docs = path.resolve(__dirname, "../docs");

if (!fs.existsSync(dist)) {
  console.error("dist/ not found — run npm run build first");
  process.exit(1);
}

fs.rmSync(docs, { recursive: true, force: true });
fs.cpSync(dist, docs, { recursive: true });
console.log("Copied dist/ → docs/");

execSync("git add docs", { stdio: "inherit" });
execSync('git commit -m "Deploy: update docs from dist"', { stdio: "inherit" });
execSync("git push origin master", { stdio: "inherit" });
console.log("Pushed to GitHub Pages (docs/)");
