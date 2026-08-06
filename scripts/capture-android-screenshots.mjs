import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import WebSocket from "ws";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../docs/screenshots");
const WS_URL = process.env.WS_URL;

function cdp(ws, method, params = {}) {
  const id = Math.floor(Math.random() * 1e9);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout ${method}`)), 20000);
    const onMessage = (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.id !== id) return;
      clearTimeout(timer);
      ws.off("message", onMessage);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    };
    ws.on("message", onMessage);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function shot(ws, name) {
  await new Promise((r) => setTimeout(r, 900));
  const { data } = await cdp(ws, "Page.captureScreenshot", { format: "png", fromSurface: true });
  await fs.promises.mkdir(outDir, { recursive: true });
  await fs.promises.writeFile(path.join(outDir, `${name}.png`), Buffer.from(data, "base64"));
  console.log(`saved ${name}.png`);
}

async function main() {
  if (!WS_URL) throw new Error("WS_URL required");
  const ws = new WebSocket(WS_URL);
  await new Promise((resolve, reject) => {
    ws.once("open", resolve);
    ws.once("error", reject);
  });

  await cdp(ws, "Page.enable");
  await cdp(ws, "Page.navigate", { url: "https://localhost/" });
  await shot(ws, "android-home-webview");

  await cdp(ws, "Page.navigate", { url: "https://localhost/assistant" });
  await shot(ws, "android-assistant");

  await cdp(ws, "Page.navigate", { url: "https://localhost/auth" });
  await shot(ws, "android-auth");

  await cdp(ws, "Page.navigate", { url: "https://localhost/about" });
  await shot(ws, "android-about");

  ws.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
