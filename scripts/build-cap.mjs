import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = "production";

function readCapEnv() {
  const files = [".env", ".env.local", ".env.production", ".env.production.local"];
  const loaded = loadEnv(mode, root, "");

  const url =
    process.env.VITE_SUPABASE_URL ||
    loaded.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    loaded.SUPABASE_URL;
  const publishableKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    loaded.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    loaded.SUPABASE_PUBLISHABLE_KEY;

  return { url, publishableKey, files };
}

function missingEnvMessage(existingFiles) {
  const present = existingFiles.filter((file) => existsSync(path.join(root, file)));
  const fileHint =
    present.length > 0
      ? `Checked: ${present.join(", ")}`
      : "No .env file found. Copy .env.example to .env and fill in VITE_SUPABASE_PUBLISHABLE_KEY.";

  return [
    "Capacitor bundled builds require Supabase client env vars at Vite build time.",
    "Missing: VITE_SUPABASE_URL and/or VITE_SUPABASE_PUBLISHABLE_KEY.",
    fileHint,
    "See SUPABASE_SETUP.md and .env.example.",
  ].join("\n");
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const { url, publishableKey, files } = readCapEnv();

if (!url || !publishableKey) {
  console.error(missingEnvMessage(files));
  process.exit(1);
}

process.env.VITE_SUPABASE_URL = url;
process.env.VITE_SUPABASE_PUBLISHABLE_KEY = publishableKey;
process.env.SUPABASE_URL = url;
process.env.SUPABASE_PUBLISHABLE_KEY = publishableKey;

run("npx", ["vite", "build"]);
run("node", ["scripts/prepare-cap-web.mjs"]);

const bundlePath = path.join(root, "dist", "client", "assets");
console.log("Capacitor web bundle built with Supabase client env inlined.");
