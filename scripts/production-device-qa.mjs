/**
 * Production device QA for bundled Capacitor Android build.
 * Usage: node scripts/production-device-qa.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../docs/screenshots/qa-production");
const PKG = "com.asvior.app";

function adb(cmd) {
  return execSync(`adb ${cmd}`, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function sleep(ms) {
  execSync(`powershell -Command "Start-Sleep -Milliseconds ${ms}"`, { stdio: "ignore" });
}

function shot(name) {
  fs.mkdirSync(outDir, { recursive: true });
  const remote = `/sdcard/asvior-prod-${name}.png`;
  const local = path.join(outDir, `${name}.png`);
  adb(`shell screencap -p ${remote}`);
  adb(`pull ${remote} "${local.replace(/\\/g, "/")}"`);
  console.log(`✓ ${name}`);
}

function openRoute(pathname) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  adb(
    `shell am start -a android.intent.action.VIEW -d "asvior://${path}" -p ${PKG} -f 0x14000000`,
  );
}

function tap(x, y) {
  adb(`shell input tap ${x} ${y}`);
}

function swipe(x1, y1, x2, y2, ms = 400) {
  adb(`shell input swipe ${x1} ${y1} ${x2} ${y2} ${ms}`);
}

console.log("=== ASVIOR Production Device QA ===\n");

adb(`shell am force-stop ${PKG}`);
sleep(400);
adb(`shell am start -n ${PKG}/.MainActivity`);
sleep(2500);
shot("01-cold-start");

sleep(1000);
shot("02-home");

openRoute("/visa-check");
sleep(2200);
shot("03-visa-check");

openRoute("/assistant");
sleep(2200);
shot("04-assistant-empty");

openRoute("/checklist");
sleep(2000);
shot("05-checklist");

openRoute("/budget-planner");
sleep(2000);
shot("06-budget");

openRoute("/auth");
sleep(2000);
shot("07-auth");

openRoute("/countries");
sleep(2000);
shot("08-countries-search");

openRoute("/country/JP");
sleep(2500);
shot("09-country-japan");

openRoute("/settings");
sleep(2000);
shot("10-settings");

openRoute("/");
sleep(1500);
tap(540, 2180);
sleep(2200);
shot("11-nav-ai-tab");

adb("shell input keyevent KEYCODE_HOME");
sleep(800);
swipe(540, 1700, 540, 700, 300);
sleep(1200);
shot("12-launcher-icon");

console.log(`\nScreenshots saved to ${outDir}`);
