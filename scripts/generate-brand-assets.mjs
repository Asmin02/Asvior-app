/**
 * Generates Android launcher icons and splash assets from the official ASVIOR logo.
 * Run: node scripts/generate-brand-assets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const logoPath = path.join(root, "src/assets/asvior-logo-full.png");
const markSvgPath = path.join(root, "scripts/assets/asvior-mark.svg");
const androidRes = path.join(root, "android/app/src/main/res");
const publicDir = path.join(root, "public");

const WARM_WHITE = { r: 250, g: 248, b: 244, alpha: 1 };
const NAVY = "#0B1F3A";

const mipmapSizes = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

const splashSizes = {
  "drawable-port-mdpi": 320,
  "drawable-port-hdpi": 480,
  "drawable-port-xhdpi": 720,
  "drawable-port-xxhdpi": 1080,
  "drawable-port-xxxhdpi": 1440,
};

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function createMarkBuffer(size, { padding = 0.05, background = null } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  let pipeline = sharp(markSvgPath).resize(inner, inner, { fit: "contain" });

  if (background) {
    pipeline = pipeline.extend({
      top: Math.round(size * padding),
      bottom: Math.round(size * padding),
      left: Math.round(size * padding),
      right: Math.round(size * padding),
      background,
    });
  } else {
    pipeline = pipeline.extend({
      top: Math.round(size * padding),
      bottom: Math.round(size * padding),
      left: Math.round(size * padding),
      right: Math.round(size * padding),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }

  return pipeline.png().toBuffer();
}

/** Legacy/full launcher tile — warm white background, ~87% mark fill. */
async function createLegacyLauncherBuffer(size) {
  return createMarkBuffer(size, { padding: 0.065, background: WARM_WHITE });
}

/** Adaptive foreground — transparent background, mark fills safe zone. */
async function createAdaptiveForegroundBuffer(size) {
  return createMarkBuffer(size, { padding: 0.035, background: null });
}

async function createFullLogoBuffer(maxWidth) {
  return sharp(logoPath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .png()
    .toBuffer();
}

async function writeLauncherIcons() {
  for (const [folder, size] of Object.entries(mipmapSizes)) {
    const dir = path.join(androidRes, `mipmap-${folder}`);
    await ensureDir(dir);
    const legacy = await createLegacyLauncherBuffer(size);
    const foreground = await createAdaptiveForegroundBuffer(size);
    await fs.promises.writeFile(path.join(dir, "ic_launcher.png"), legacy);
    await fs.promises.writeFile(path.join(dir, "ic_launcher_round.png"), legacy);
    await fs.promises.writeFile(path.join(dir, "ic_launcher_foreground.png"), foreground);
  }
}

async function createSplashBackground(width, height) {
  return sharp({
    create: { width, height, channels: 4, background: WARM_WHITE },
  })
    .png()
    .toBuffer();
}

async function writeSplashAssets() {
  for (const [folder, width] of Object.entries(splashSizes)) {
    const dir = path.join(androidRes, folder);
    await ensureDir(dir);
    const height = Math.round(width * 2.1);
    const bg = await createSplashBackground(width, height);
    const logo = await createFullLogoBuffer(Math.round(width * 0.58));
    const logoMeta = await sharp(logo).metadata();
    const left = Math.round((width - logoMeta.width) / 2);
    const top = Math.round((height - logoMeta.height) / 2);

    const splash = await sharp(bg)
      .composite([{ input: logo, left, top }])
      .png()
      .toBuffer();

    await fs.promises.writeFile(path.join(dir, "splash.png"), splash);
  }

  const drawableDir = path.join(androidRes, "drawable");
  await ensureDir(drawableDir);
  await fs.promises.writeFile(
    path.join(drawableDir, "splash.xml"),
    `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_logo"/>
    </item>
</layer-list>
`,
  );

  const splashLogo = await createFullLogoBuffer(640);
  await fs.promises.writeFile(path.join(drawableDir, "splash_logo.png"), splashLogo);
}

async function writeWebIcons() {
  const symbol512 = await createLegacyLauncherBuffer(512);
  const symbol192 = await createLegacyLauncherBuffer(192);
  await fs.promises.writeFile(path.join(publicDir, "icon-512.png"), symbol512);
  await fs.promises.writeFile(path.join(publicDir, "icon-192.png"), symbol192);

  const symbolSvg = await fs.promises.readFile(path.join(publicDir, "favicon.svg"), "utf8");
  await fs.promises.writeFile(path.join(publicDir, "icon-192.svg"), symbolSvg);
  await fs.promises.writeFile(path.join(publicDir, "icon-512.svg"), symbolSvg);
}

async function writeAndroidColors() {
  const valuesDir = path.join(androidRes, "values");
  await ensureDir(valuesDir);
  const colorsPath = path.join(valuesDir, "colors.xml");
  let existing = "";
  try {
    existing = await fs.promises.readFile(colorsPath, "utf8");
  } catch {
    existing = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n</resources>\n';
  }

  if (!existing.includes("splash_background")) {
    const updated = existing.replace(
      "</resources>",
      `    <color name="splash_background">#FAF8F4</color>\n    <color name="colorPrimary">${NAVY}</color>\n    <color name="colorPrimaryDark">${NAVY}</color>\n    <color name="colorAccent">#D4AF37</color>\n</resources>`,
    );
    await fs.promises.writeFile(colorsPath, updated);
  }

  if (!existing.includes("ic_launcher_background")) {
    const updated = existing.replace(
      "</resources>",
      `    <color name="ic_launcher_background">#FAF8F4</color>\n</resources>`,
    );
    await fs.promises.writeFile(colorsPath, updated);
  }
}

async function main() {
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Missing logo at ${logoPath}`);
  }

  await writeAndroidColors();
  await writeLauncherIcons();
  await writeSplashAssets();
  await writeWebIcons();
  console.log("Brand assets generated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
