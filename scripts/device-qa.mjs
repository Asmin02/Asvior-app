/**
 * Android device QA helper — captures screenshots via adb after navigation.
 * Usage: node scripts/device-qa.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../docs/screenshots/qa-final");
const PKG = "com.asvior.app";

function adb(cmd) {
  return execSync(`adb ${cmd}`, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function sleep(ms) {
  execSync(`powershell -Command "Start-Sleep -Milliseconds ${ms}"`, { stdio: "ignore" });
}

function shot(name) {
  const remote = `/sdcard/asvior-qa-${name}.png`;
  const local = path.join(outDir, `${name}.png`);
  adb(`shell screencap -p ${remote}`);
  adb(`pull ${remote} "${local.replace(/\\/g, "/")}"`);
  console.log(`✓ ${name}`);
}

function launch(pathname = "/") {
  const url = pathname.startsWith("http") ? pathname : `https://asvior.app${pathname}`;
  adb(
    `shell am start -a android.intent.action.VIEW -d "${url}" -p ${PKG} -f 0x14000000`,
  );
}

function tap(x, y) {
  adb(`shell input tap ${x} ${y}`);
}

function swipe(x1, y1, x2, y2, ms = 400) {
  adb(`shell input swipe ${x1} ${y1} ${x2} ${y2} ${ms}`);
}

fs.mkdirSync(outDir, { recursive: true });

console.log("=== ASVIOR Device QA ===\n");

// Cold start + splash
adb(`shell am force-stop ${PKG}`);
sleep(300);
adb(`shell am start -n ${PKG}/.MainActivity`);
sleep(1800);
shot("01-splash-or-home");

// Home
sleep(1500);
shot("02-home");

// Settings
launch("/settings");
sleep(2000);
shot("03-settings");

// Dark mode toggle (approx coords for 1080x2220)
tap(980, 520);
sleep(800);
shot("04-settings-dark");

// Light mode back
tap(980, 520);
sleep(600);

// Language — open Spanish (scroll if needed, tap Español ~y 680)
tap(540, 680);
sleep(1200);
shot("05-settings-es");

// Back to English
tap(540, 620);
sleep(800);

// Visa
launch("/visa-check");
sleep(2000);
shot("06-visa");

// Checklist
launch("/checklist");
sleep(2000);
shot("07-checklist");

// Budget
launch("/budget-planner");
sleep(2000);
shot("08-budget");

// Auth
launch("/auth");
sleep(2000);
shot("09-auth");

// Country + AI shortcut
launch("/country/AL");
sleep(2500);
swipe(540, 1800, 540, 800, 350);
sleep(800);
shot("10-country-albania");

// Tap first AI shortcut (~y 1750 after scroll)
tap(540, 1650);
sleep(3500);
shot("11-ai-auto-send-albania");

// Assistant direct with query
launch("/assistant?q=What%20is%20the%20best%20time%20to%20visit%20France%3F");
sleep(4000);
shot("12-ai-auto-send-france");

// Home via nav
launch("/");
sleep(1500);
shot("13-home-final");

// Launcher icon
adb("shell input keyevent KEYCODE_HOME");
sleep(800);
swipe(540, 1700, 540, 700, 300);
sleep(1200);
shot("14-launcher-icon");

console.log(`\nScreenshots saved to ${outDir}`);
