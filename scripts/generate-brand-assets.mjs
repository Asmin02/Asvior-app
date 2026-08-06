/**
 * Generates V6 premium brand assets:
 * - Royal blue adaptive launcher icon with gold "A" + airplane mark
 * - Animated-style splash frames (royal blue + mark)
 * - Web/PWA icons and favicons
 *
 * Run: npm run brand:assets
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const markSvgPath = path.join(__dirname, "assets/asvior-icon-foreground.svg");
const markPngPath = path.join(root, "src/assets/asvior-mark.png");
const androidRes = path.join(root, "android/app/src/main/res");
const publicDir = path.join(root, "public");

const ROYAL_BLUE = "#6D28D9";
const ROYAL_BLUE_DEEP = "#5B21B6";
const ACCENT_CYAN = "#22D3EE";
const GOLD = "#F59E0B";
const SPLASH_BG = ROYAL_BLUE;

const LAUNCHER_MARK_FILL = 0.72;

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

async function createLauncherBackground(size) {
  const radius = Math.round(size * 0.223);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3B82F6"/>
        <stop offset="52%" stop-color="${ROYAL_BLUE}"/>
        <stop offset="100%" stop-color="${ROYAL_BLUE_DEEP}"/>
      </linearGradient>
      <radialGradient id="shine" cx="28%" cy="18%" r="62%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)"/>
    <rect width="${size}" height="${size}" rx="${radius}" fill="url(#shine)"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function renderMarkPng(size) {
  return sharp(markSvgPath)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, quality: 100 })
    .toBuffer();
}

async function loadMarkBuffer() {
  const size = 512;
  const buffer = await renderMarkPng(size);
  await fs.promises.writeFile(markPngPath, buffer);
  return buffer;
}

async function createLauncherBuffer(size, { transparent = false } = {}) {
  const markSize = Math.round(size * LAUNCHER_MARK_FILL);
  const mark = await renderMarkPng(markSize);
  const offset = Math.round((size - markSize) / 2);

  if (transparent) {
    return sharp({
      create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: mark, left: offset, top: offset }])
      .png({ compressionLevel: 9, quality: 100 })
      .toBuffer();
  }

  const background = await createLauncherBackground(size);
  return sharp(background)
    .composite([{ input: mark, left: offset, top: offset }])
    .png({ compressionLevel: 9, quality: 100 })
    .toBuffer();
}

async function createSplashLogo(maxWidth) {
  const markWidth = Math.round(maxWidth * 0.42);
  const mark = await renderMarkPng(markWidth);

  const wordSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${maxWidth}" height="${Math.round(maxWidth * 0.22)}">
    <text x="50%" y="72%" text-anchor="middle"
      font-family="Manrope, Inter, system-ui, sans-serif"
      font-size="${Math.round(maxWidth * 0.11)}"
      font-weight="800"
      letter-spacing="-0.03em"
      fill="#FFFFFF">Asvior</text>
  </svg>`;
  const word = await sharp(Buffer.from(wordSvg)).png().toBuffer();
  const wordMeta = await sharp(word).metadata();
  const markMeta = await sharp(mark).metadata();

  const canvasW = maxWidth;
  const canvasH = Math.round(maxWidth * 0.55);
  const markLeft = Math.round((canvasW - (markMeta.width ?? markWidth)) / 2);
  const wordTop = (markMeta.height ?? markWidth) + Math.round(maxWidth * 0.04);

  return sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: mark, left: markLeft, top: 0 },
      { input: word, left: 0, top: wordTop },
    ])
    .png({ compressionLevel: 9, quality: 100 })
    .toBuffer();
}

async function writeLauncherIcons() {
  for (const [folder, size] of Object.entries(mipmapSizes)) {
    const dir = path.join(androidRes, `mipmap-${folder}`);
    await ensureDir(dir);
    const legacy = await createLauncherBuffer(size);
    const foreground = await createLauncherBuffer(size, { transparent: true });
    await fs.promises.writeFile(path.join(dir, "ic_launcher.png"), legacy);
    await fs.promises.writeFile(path.join(dir, "ic_launcher_round.png"), legacy);
    await fs.promises.writeFile(path.join(dir, "ic_launcher_foreground.png"), foreground);
  }
}

async function createSplashBackground(width, height) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="splash" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3B82F6"/>
        <stop offset="50%" stop-color="${ROYAL_BLUE}"/>
        <stop offset="100%" stop-color="${ROYAL_BLUE_DEEP}"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="38%" r="55%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#splash)"/>
    <rect width="${width}" height="${height}" fill="url(#glow)"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function writeSplashAssets() {
  for (const [folder, width] of Object.entries(splashSizes)) {
    const dir = path.join(androidRes, folder);
    await ensureDir(dir);
    const height = Math.round(width * 2.1);
    const bg = await createSplashBackground(width, height);
    const logo = await createSplashLogo(Math.round(width * 0.52));
    const logoMeta = await sharp(logo).metadata();
    const left = Math.round((width - (logoMeta.width ?? width)) / 2);
    const top = Math.round((height - (logoMeta.height ?? width)) / 2);

    const splash = await sharp(bg)
      .composite([{ input: logo, left, top }])
      .png({ compressionLevel: 9, quality: 100 })
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

  const splashLogo = await createSplashLogo(720);
  await fs.promises.writeFile(path.join(drawableDir, "splash_logo.png"), splashLogo);
}

async function writeWebIcons() {
  const icon512 = await createLauncherBuffer(512);
  const icon192 = await createLauncherBuffer(192);
  const favicon32 = await createLauncherBuffer(32);
  const favicon48 = await createLauncherBuffer(48);

  await fs.promises.writeFile(path.join(publicDir, "icon-512.png"), icon512);
  await fs.promises.writeFile(path.join(publicDir, "icon-192.png"), icon192);
  await fs.promises.writeFile(path.join(publicDir, "favicon.png"), favicon32);
  await fs.promises.writeFile(path.join(publicDir, "favicon-48.png"), favicon48);

  const mark = await loadMarkBuffer();
  const notifMark = await sharp(mark)
    .resize(96, 96, { fit: "contain", background: { r: 37, g: 99, b: 235, alpha: 1 } })
    .extend({
      top: 16,
      bottom: 16,
      left: 16,
      right: 16,
      background: { r: 37, g: 99, b: 235, alpha: 1 },
    })
    .png()
    .toBuffer();
  await fs.promises.writeFile(path.join(publicDir, "notification-icon.png"), notifMark);
  await fs.promises.writeFile(path.join(publicDir, "asvior-mark.png"), mark);
}

async function writeAndroidColors() {
  const valuesDir = path.join(androidRes, "values");
  await ensureDir(valuesDir);
  const colors = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="splash_background">${SPLASH_BG}</color>
    <color name="colorPrimary">${ROYAL_BLUE}</color>
    <color name="colorPrimaryDark">${ROYAL_BLUE_DEEP}</color>
    <color name="colorAccent">${GOLD}</color>
    <color name="ic_launcher_background">${ROYAL_BLUE}</color>
</resources>
`;
  await fs.promises.writeFile(path.join(valuesDir, "colors.xml"), colors);
}

async function main() {
  if (!fs.existsSync(markSvgPath)) {
    throw new Error(`Missing icon SVG at ${markSvgPath}`);
  }

  console.log("Generating V6 premium brand assets…");
  await loadMarkBuffer();
  await writeAndroidColors();
  await writeLauncherIcons();
  await writeSplashAssets();
  await writeWebIcons();
  console.log("V6 brand assets generated (royal blue + gold A mark).");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
