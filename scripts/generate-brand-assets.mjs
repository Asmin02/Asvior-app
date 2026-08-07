/**
 * Generates premium Asvior brand assets from the sign-in screen mark (AsviorMark).
 * - Android adaptive launcher icons (all densities)
 * - Android splash screens (all orientations/sizes)
 * - iOS App Icon set (resources/ios/AppIcon.appiconset)
 * - Web/PWA icons, favicons, notification icon
 *
 * Run: npm run brand:assets
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const markSvgPath = path.join(__dirname, "assets/asvior-mark-premium.svg");
const markPngPath = path.join(root, "src/assets/asvior-mark.png");
const androidRes = path.join(root, "android/app/src/main/res");
const publicDir = path.join(root, "public");
const iosIconDir = path.join(root, "resources/ios/AppIcon.appiconset");

/** grad-ink brand palette (matches styles.css) */
const INK_TOP = "#3D6BB3";
const INK_MID = "#1E3A8A";
const INK_DEEP = "#0B1F3A";
const SPLASH_BG = INK_MID;
const THEME_COLOR = "#0F172A";

const LAUNCHER_MARK_FILL = 0.68;

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

/** iOS App Store + device icon sizes */
const iosIconSizes = [
  { size: 20, scale: 2, idiom: "iphone", filename: "Icon-App-20x20@2x.png" },
  { size: 20, scale: 3, idiom: "iphone", filename: "Icon-App-20x20@3x.png" },
  { size: 29, scale: 2, idiom: "iphone", filename: "Icon-App-29x29@2x.png" },
  { size: 29, scale: 3, idiom: "iphone", filename: "Icon-App-29x29@3x.png" },
  { size: 40, scale: 2, idiom: "iphone", filename: "Icon-App-40x40@2x.png" },
  { size: 40, scale: 3, idiom: "iphone", filename: "Icon-App-40x40@3x.png" },
  { size: 60, scale: 2, idiom: "iphone", filename: "Icon-App-60x60@2x.png" },
  { size: 60, scale: 3, idiom: "iphone", filename: "Icon-App-60x60@3x.png" },
  { size: 20, scale: 1, idiom: "ipad", filename: "Icon-App-20x20@1x.png" },
  { size: 20, scale: 2, idiom: "ipad", filename: "Icon-App-20x20@2x-ipad.png" },
  { size: 29, scale: 1, idiom: "ipad", filename: "Icon-App-29x29@1x.png" },
  { size: 29, scale: 2, idiom: "ipad", filename: "Icon-App-29x29@2x-ipad.png" },
  { size: 40, scale: 1, idiom: "ipad", filename: "Icon-App-40x40@1x.png" },
  { size: 40, scale: 2, idiom: "ipad", filename: "Icon-App-40x40@2x-ipad.png" },
  { size: 76, scale: 1, idiom: "ipad", filename: "Icon-App-76x76@1x.png" },
  { size: 76, scale: 2, idiom: "ipad", filename: "Icon-App-76x76@2x.png" },
  { size: 83.5, scale: 2, idiom: "ipad", filename: "Icon-App-83.5x83.5@2x.png" },
  { size: 1024, scale: 1, idiom: "ios-marketing", filename: "Icon-App-1024x1024@1x.png" },
];

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function createBrandBackground(width, height, { rounded = false } = {}) {
  const radius = rounded ? Math.round(Math.min(width, height) * 0.223) : 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${INK_TOP}"/>
        <stop offset="52%" stop-color="${INK_MID}"/>
        <stop offset="100%" stop-color="${INK_DEEP}"/>
      </linearGradient>
      <radialGradient id="shine" cx="28%" cy="18%" r="62%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" ${rounded ? `rx="${radius}"` : ""} fill="url(#bg)"/>
    <rect width="${width}" height="${height}" ${rounded ? `rx="${radius}"` : ""} fill="url(#shine)"/>
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
  const buffer = await renderMarkPng(512);
  await fs.promises.writeFile(markPngPath, buffer);
  await fs.promises.writeFile(path.join(publicDir, "asvior-mark.png"), buffer);
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

  const background = await createBrandBackground(size, size, { rounded: true });
  return sharp(background)
    .composite([{ input: mark, left: offset, top: offset }])
    .png({ compressionLevel: 9, quality: 100 })
    .toBuffer();
}

async function createSpinner(width) {
  const dot = Math.max(6, Math.round(width * 0.018));
  const gap = Math.round(dot * 1.6);
  const totalW = dot * 3 + gap * 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${dot}">
    <circle cx="${dot / 2}" cy="${dot / 2}" r="${dot / 2}" fill="#FFFFFF" opacity="0.95"/>
    <circle cx="${dot / 2 + dot + gap}" cy="${dot / 2}" r="${dot / 2}" fill="#FFFFFF" opacity="0.55"/>
    <circle cx="${dot / 2 + (dot + gap) * 2}" cy="${dot / 2}" r="${dot / 2}" fill="#FFFFFF" opacity="0.3"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function createSplashLogo(maxWidth) {
  const markWidth = Math.round(maxWidth * 0.52);
  const mark = await renderMarkPng(markWidth);

  const wordSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${maxWidth}" height="${Math.round(maxWidth * 0.14)}">
    <text x="50%" y="78%" text-anchor="middle"
      font-family="Sora, Manrope, Inter, system-ui, sans-serif"
      font-size="${Math.round(maxWidth * 0.1)}"
      font-weight="700"
      letter-spacing="0.22em"
      fill="#FFFFFF">ASVIOR</text>
  </svg>`;
  const word = await sharp(Buffer.from(wordSvg)).png().toBuffer();
  const spinner = await createSpinner(maxWidth);

  const markMeta = await sharp(mark).metadata();
  const wordMeta = await sharp(word).metadata();
  const spinnerMeta = await sharp(spinner).metadata();

  const canvasW = maxWidth;
  const canvasH =
    (markMeta.height ?? markWidth) +
    (wordMeta.height ?? 0) +
    (spinnerMeta.height ?? 0) +
    Math.round(maxWidth * 0.12);

  const markLeft = Math.round((canvasW - (markMeta.width ?? markWidth)) / 2);
  const wordTop = (markMeta.height ?? markWidth) + Math.round(maxWidth * 0.05);
  const spinnerLeft = Math.round((canvasW - (spinnerMeta.width ?? 0)) / 2);
  const spinnerTop = wordTop + (wordMeta.height ?? 0) + Math.round(maxWidth * 0.06);

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
      { input: spinner, left: spinnerLeft, top: spinnerTop },
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

async function writeSplashAssets() {
  for (const [folder, width] of Object.entries(splashSizes)) {
    const dir = path.join(androidRes, folder);
    await ensureDir(dir);
    const height = Math.round(width * 2.1);
    const bg = await createBrandBackground(width, height);
    const logo = await createSplashLogo(Math.round(width * 0.56));
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

async function writeIosIcons() {
  await ensureDir(iosIconDir);
  const images = [];

  for (const spec of iosIconSizes) {
    const px = Math.round(spec.size * spec.scale);
    const icon = await createLauncherBuffer(px);
    await fs.promises.writeFile(path.join(iosIconDir, spec.filename), icon);
    images.push({
      filename: spec.filename,
      idiom: spec.idiom,
      scale: `${spec.scale}x`,
      size: spec.idiom === "ios-marketing" ? "1024x1024" : `${spec.size}x${spec.size}`,
    });
  }

  await fs.promises.writeFile(
    path.join(iosIconDir, "Contents.json"),
    JSON.stringify({ images, info: { version: 1, author: "xcode" } }, null, 2),
  );
}

async function writeWebIcons() {
  const icon512 = await createLauncherBuffer(512);
  const icon192 = await createLauncherBuffer(192);
  const favicon32 = await createLauncherBuffer(32);
  const favicon48 = await createLauncherBuffer(48);
  const appleTouch = await createLauncherBuffer(180);

  await fs.promises.writeFile(path.join(publicDir, "icon-512.png"), icon512);
  await fs.promises.writeFile(path.join(publicDir, "icon-192.png"), icon192);
  await fs.promises.writeFile(path.join(publicDir, "favicon.png"), favicon32);
  await fs.promises.writeFile(path.join(publicDir, "favicon-48.png"), favicon48);
  await fs.promises.writeFile(path.join(publicDir, "apple-touch-icon.png"), appleTouch);

  const mark = await loadMarkBuffer();
  const notifMark = await sharp(mark)
    .resize(96, 96, { fit: "contain", background: { r: 30, g: 58, b: 138, alpha: 1 } })
    .extend({
      top: 16,
      bottom: 16,
      left: 16,
      right: 16,
      background: { r: 30, g: 58, b: 138, alpha: 1 },
    })
    .png()
    .toBuffer();
  await fs.promises.writeFile(path.join(publicDir, "notification-icon.png"), notifMark);

  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="8" fill="${INK_MID}"/>
    <g transform="translate(4 3.5) scale(0.15)">
      ${await fs.promises.readFile(markSvgPath, "utf8").then((s) =>
        s.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, ""),
      )}
    </g>
  </svg>`;
  await fs.promises.writeFile(path.join(publicDir, "favicon.svg"), faviconSvg);
}

async function writeAndroidColors() {
  const valuesDir = path.join(androidRes, "values");
  await ensureDir(valuesDir);
  const colors = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="splash_background">${SPLASH_BG}</color>
    <color name="colorPrimary">${INK_MID}</color>
    <color name="colorPrimaryDark">${INK_DEEP}</color>
    <color name="colorAccent">#D7B06A</color>
    <color name="ic_launcher_background">${INK_MID}</color>
</resources>
`;
  await fs.promises.writeFile(path.join(valuesDir, "colors.xml"), colors);
}

async function writeManifest() {
  const manifest = {
    name: "Asvior",
    short_name: "Asvior",
    description:
      "Visa intelligence, trip budgets, packing checklists, and AI travel guidance.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: THEME_COLOR,
    theme_color: THEME_COLOR,
    orientation: "portrait",
    lang: "en",
    categories: ["travel", "productivity", "lifestyle"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
  await fs.promises.writeFile(
    path.join(publicDir, "manifest.webmanifest"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
}

async function main() {
  if (!fs.existsSync(markSvgPath)) {
    throw new Error(`Missing premium mark SVG at ${markSvgPath}`);
  }

  console.log("Generating premium Asvior brand assets (sign-in mark)…");
  await writeAndroidColors();
  await writeLauncherIcons();
  await writeSplashAssets();
  await writeIosIcons();
  await writeWebIcons();
  await writeManifest();
  console.log("Done — Android adaptive icons, iOS AppIcon set, splash, and web icons updated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
