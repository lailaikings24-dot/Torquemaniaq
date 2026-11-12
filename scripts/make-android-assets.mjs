/**
 * Generates the Android launcher icons and splash screens from public/icon.svg.
 *
 * The web icons are a hand-rolled rasteriser; Android needs transparent
 * adaptive-icon layers and a dozen density buckets, so this script renders the
 * same SVG with sharp instead. Run with `npm run icons:android`.
 *
 * What it writes, all under android/app/src/main/res:
 *   mipmap-<density>/ic_launcher.png             legacy icon (pre-Android 8)
 *   mipmap-<density>/ic_launcher_round.png       legacy round icon, circular mask
 *   mipmap-<density>/ic_launcher_foreground.png  adaptive foreground (transparent)
 *   drawable[-(port|land)-density]/splash.png    branded launch background
 */
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';

const RES = 'android/app/src/main/res';
const BG = '#0b0f14';

// The brand mark is the SVG minus its rounded dark plate, so it can sit on a
// transparent adaptive-icon layer and on the splash background.
const full = readFileSync('public/icon.svg', 'utf8');
const mark = full.replace(/\s*<rect[^>]*\/>/, '');

const DENSITIES = [
  { dir: 'mdpi', icon: 48, foreground: 108 },
  { dir: 'hdpi', icon: 72, foreground: 162 },
  { dir: 'xhdpi', icon: 96, foreground: 216 },
  { dir: 'xxhdpi', icon: 144, foreground: 324 },
  { dir: 'xxxhdpi', icon: 192, foreground: 432 },
];

const SPLASHES = [
  { dir: 'drawable', width: 960, height: 640 },
  { dir: 'drawable-land-mdpi', width: 480, height: 320 },
  { dir: 'drawable-land-hdpi', width: 800, height: 480 },
  { dir: 'drawable-land-xhdpi', width: 1280, height: 720 },
  { dir: 'drawable-land-xxhdpi', width: 1600, height: 960 },
  { dir: 'drawable-land-xxxhdpi', width: 1920, height: 1280 },
  { dir: 'drawable-port-mdpi', width: 320, height: 480 },
  { dir: 'drawable-port-hdpi', width: 480, height: 800 },
  { dir: 'drawable-port-xhdpi', width: 720, height: 1280 },
  { dir: 'drawable-port-xxhdpi', width: 960, height: 1600 },
  { dir: 'drawable-port-xxxhdpi', width: 1280, height: 1920 },
];

/** Rasterise an SVG to a square PNG buffer. */
async function raster(svg, size) {
  return sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

/** The full plate, used for legacy icons. */
async function icon(size) {
  return raster(full, size);
}

/** Legacy round icons: clip the plate to a circle. */
async function roundIcon(size) {
  const circle = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
       <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>
     </svg>`,
  );
  return sharp(await icon(size))
    .composite([{ input: circle, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

/**
 * Adaptive foreground: transparent, with the mark kept inside the 66dp safe
 * zone (the plate is 108dp and masks crop to 72dp).
 */
async function foreground(size) {
  const art = await raster(mark, Math.round(size * 0.94));
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: art, gravity: 'center' }])
    .png()
    .toBuffer();
}

/** Splash: brand gradient with the mark centred. */
async function splash(width, height) {
  const bg = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0" stop-color="#0a0e13"/>
           <stop offset="1" stop-color="#121c26"/>
         </linearGradient>
       </defs>
       <rect width="${width}" height="${height}" fill="url(#g)"/>
     </svg>`,
  );
  const art = await raster(mark, Math.round(Math.min(width, height) * 0.34));
  return sharp(bg).composite([{ input: art, gravity: 'center' }]).png().toBuffer();
}

const written = [];

for (const { dir, icon: iconSize, foreground: fgSize } of DENSITIES) {
  mkdirSync(`${RES}/mipmap-${dir}`, { recursive: true });
  const targets = [
    [`${RES}/mipmap-${dir}/ic_launcher.png`, await icon(iconSize)],
    [`${RES}/mipmap-${dir}/ic_launcher_round.png`, await roundIcon(iconSize)],
    [`${RES}/mipmap-${dir}/ic_launcher_foreground.png`, await foreground(fgSize)],
  ];
  for (const [path, buf] of targets) {
    await sharp(buf).toFile(path);
    written.push(`${path}  ${buf.width ?? ''}`.trim());
  }
}

for (const { dir, width, height } of SPLASHES) {
  mkdirSync(`${RES}/${dir}`, { recursive: true });
  const path = `${RES}/${dir}/splash.png`;
  await sharp(await splash(width, height)).toFile(path);
  written.push(`${path}  ${width}x${height}`);
}

console.log(`Brand colour ${BG}`);
for (const line of written) console.log(`  ${line}`);
