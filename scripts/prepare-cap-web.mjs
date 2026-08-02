import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticDir = path.join(root, ".vercel", "output", "static");
const outDir = path.join(root, "dist", "client");
const previewPort = 4173;
const previewHost = "127.0.0.1";

function copyStaticAssets() {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  cpSync(staticDir, outDir, { recursive: true });
}

function assetBaseName(filename) {
  return filename.replace(/-[A-Za-z0-9_-]+\.[^.]+$/, "");
}

function buildBundledAssetMap(assetsDir) {
  const map = new Map();

  for (const file of readdirSync(assetsDir)) {
    const ext = path.extname(file).slice(1);
    if (!ext) continue;
    map.set(`${assetBaseName(file)}.${ext}`, file);
  }

  return map;
}

function reconcileBundledAssetPaths(html, assetsDir) {
  const assetMap = buildBundledAssetMap(assetsDir);
  let reconciled = html;

  for (const [assetKey, actualFile] of assetMap) {
    const [base, ext] = assetKey.split(".");
    const pattern = new RegExp(`/assets/${base}-[A-Za-z0-9_-]+\\.${ext}`, "g");
    reconciled = reconciled.replace(pattern, `/assets/${actualFile}`);
  }

  return reconciled;
}

function waitForPreviewReady(url, timeoutMs = 60_000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url, { redirect: "follow" });
        if (res.ok) {
          resolve(await res.text());
          return;
        }
      } catch {
        // Preview still starting.
      }

      if (Date.now() - started > timeoutMs) {
        reject(new Error(`Timed out waiting for vite preview at ${url}`));
        return;
      }

      setTimeout(tick, 400);
    };

    void tick();
  });
}

async function prerenderHomeHtml() {
  const preview = spawn("npx", ["vite", "preview", "--host", previewHost, "--port", String(previewPort), "--strictPort"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
    shell: true,
  });

  let stderr = "";
  preview.stderr?.on("data", (chunk) => {
    stderr += String(chunk);
  });

  try {
    const html = await waitForPreviewReady(`http://${previewHost}:${previewPort}/`);
    const assetsDir = path.join(outDir, "assets");
    const reconciledHtml = reconcileBundledAssetPaths(html, assetsDir);
    writeFileSync(path.join(outDir, "index.html"), reconciledHtml, "utf8");
  } finally {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(preview.pid), "/f", "/t"], { stdio: "ignore" });
    } else {
      preview.kill("SIGTERM");
    }
  }

  if (!stderr.includes("error") && stderr.length > 0) {
    // Non-fatal preview logs only.
  }
}

async function main() {
  copyStaticAssets();
  await prerenderHomeHtml();
  console.log(`Prepared Capacitor web bundle at ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
