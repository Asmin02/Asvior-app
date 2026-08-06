import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..", "src");

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(name)) {
      let c = readFileSync(p, "utf8");
      const n = c
        .replaceAll("atlas-", "asv-")
        .replaceAll("@/components/atlas", "@/components/asvior")
        .replaceAll("atlas-app", "asv-app");
      if (c !== n) {
        writeFileSync(p, n);
        console.log("updated", p);
      }
    }
  }
}

walk(root);
