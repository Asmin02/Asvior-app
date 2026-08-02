import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");

function parseEnv(content) {
  const values = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    values[trimmed.slice(0, index).trim()] = trimmed.slice(index + 1).trim();
  }
  return values;
}

function hasRequired(values) {
  return Boolean(values.VITE_SUPABASE_URL && values.VITE_SUPABASE_PUBLISHABLE_KEY);
}

async function extractFromProductionBundle() {
  const home = await fetch("https://asvior.app/");
  const html = await home.text();
  const scriptMatch = html.match(/\/assets\/index-[^"']+\.js/);
  if (!scriptMatch) {
    throw new Error("Could not locate production client bundle on asvior.app.");
  }

  const bundle = await fetch(`https://asvior.app${scriptMatch[0]}`);
  const source = await bundle.text();

  const urlMatch = source.match(/https:\/\/[a-z0-9-]+\.supabase\.co/);
  const keyMatch =
    source.match(/sb_publishable_[A-Za-z0-9_-]+/) ??
    source.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);

  if (!urlMatch || !keyMatch) {
    throw new Error("Could not extract Supabase client config from production bundle.");
  }

  return { url: urlMatch[0], publishableKey: keyMatch[0] };
}

async function main() {
  if (existsSync(envPath)) {
    const existing = parseEnv(readFileSync(envPath, "utf8"));
    if (hasRequired(existing)) {
      return;
    }
  }

  const { url, publishableKey } = await extractFromProductionBundle();
  const body = [
    "# Generated for local Capacitor bundled builds. Publishable key is public client config.",
    `VITE_SUPABASE_URL=${url}`,
    `VITE_SUPABASE_PUBLISHABLE_KEY=${publishableKey}`,
    `SUPABASE_URL=${url}`,
    `SUPABASE_PUBLISHABLE_KEY=${publishableKey}`,
    "",
  ].join("\n");

  writeFileSync(envPath, body, "utf8");
  console.log("Created .env with public Supabase client config for Capacitor builds.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  console.error("Create .env manually from .env.example before running npm run cap:sync.");
  process.exit(1);
});
