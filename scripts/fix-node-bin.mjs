import fs from "fs";
import path from "path";

const binDir = path.resolve("node_modules", ".bin");
const bins = [
  { name: "tsc", target: "../typescript/lib/tsc.js" },
  { name: "next", target: "../next/dist/bin/next" },
];

for (const { name, target } of bins) {
  const binPath = path.join(binDir, name);
  if (!fs.existsSync(binPath)) {
    continue;
  }

  let stat;
  try {
    stat = fs.lstatSync(binPath);
  } catch {
    continue;
  }

  if (stat.isSymbolicLink()) {
    continue;
  }

  const wrapper = `#!/usr/bin/env node\nrequire("${target}");\n`;

  let current = "";
  try {
    current = fs.readFileSync(binPath, "utf8");
  } catch {
    // Ignore read errors and rewrite below.
  }

  if (current === wrapper) {
    continue;
  }

  fs.writeFileSync(binPath, wrapper, "utf8");
  fs.chmodSync(binPath, 0o755);
}
