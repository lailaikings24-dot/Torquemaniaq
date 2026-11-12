// Generates the fixed-size images the stores require, from the app's own icon
// artwork, so the listing never drifts from what is installed.
//
//   node scripts/store-assets.mjs
//
// Output (store/):
//   play-icon-512.png           512x512, opaque — Play Store listing icon
//   appstore-icon-1024.png      1024x1024, no alpha — App Store icon
//   feature-graphic-1024x500.png 1024x500 — Play Store feature graphic
//
// Text is drawn by librsvg, which needs a fontconfig setup and at least one font
// installed. On a bare container install a font first (see store/SUBMISSION.md);
// without one, every glyph renders as a box.
import fs from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = 'assets/icon-only.png';
const OUT = 'store';
const BG = '#0b1015';

await fs.mkdir(OUT, { recursive: true });

const source = await sharp(SOURCE).metadata();
if (source.width < 1024) {
  throw new Error(`${SOURCE} is ${source.width}px wide; 1024 is required for the App Store icon`);
}

// Play icon: 512, flattened because the store composites its own background.
await sharp(SOURCE)
  .resize(512, 512, { fit: 'cover' })
  .flatten({ background: BG })
  .png()
  .toFile(`${OUT}/play-icon-512.png`);

// App Store icon: 1024, strictly no alpha channel.
await sharp(SOURCE)
  .resize(1024, 1024, { fit: 'cover' })
  .flatten({ background: BG })
  .removeAlpha()
  .png()
  .toFile(`${OUT}/appstore-icon-1024.png`);

// The icon artwork is a square tile; round it so it sits on the graphic as a
// deliberate app tile instead of a picture pasted on top of the background.
const SIZE = 300;
const tile = await sharp(SOURCE)
  .resize(SIZE, SIZE, { fit: 'cover' })
  .composite([
    {
      input: Buffer.from(
        `<svg width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" rx="64" ry="64" fill="#ffffff"/></svg>`,
      ),
      blend: 'dest-in',
    },
  ])
  .png()
  .toBuffer();

const backdrop = Buffer.from(`
<svg width="1024" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1015"/>
      <stop offset="0.55" stop-color="#10202b"/>
      <stop offset="1" stop-color="#0a2f3d"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.26" cy="0.5" r="0.6">
      <stop offset="0" stop-color="#39b7ff" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#39b7ff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#bg)"/>
  <rect width="1024" height="500" fill="url(#glow)"/>
  <g stroke="#5cc8ff" stroke-opacity="0.09" stroke-width="1">
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 128}" y1="0" x2="${i * 128}" y2="500"/>`).join('')}
    ${Array.from({ length: 4 }, (_, i) => `<line x1="0" y1="${i * 125}" x2="1024" y2="${i * 125}"/>`).join('')}
  </g>
  <text x="468" y="238" font-family="DejaVu Sans, Roboto, sans-serif" font-size="74"
        font-weight="bold" fill="#ffffff" letter-spacing="-2">TorqueMedic</text>
  <text x="470" y="292" font-family="DejaVu Sans, Roboto, sans-serif" font-size="30"
        fill="#5cc8ff">OBD-II diagnostics and repair</text>
  <text x="470" y="344" font-family="DejaVu Sans, Roboto, sans-serif" font-size="22"
        fill="#8fa6b8">Bluetooth and Wi-Fi · no account · no data collection</text>
  <g transform="translate(468, 380)">
    <rect width="188" height="34" rx="17" fill="#123240" stroke="#2a5a70"/>
    <text x="94" y="23" text-anchor="middle" font-family="DejaVu Sans, Roboto, sans-serif"
          font-size="16" fill="#7fd4ff">Android · iOS · Web</text>
  </g>
</svg>`);

await sharp(backdrop)
  .composite([{ input: tile, left: 68, top: 100 }])
  .flatten({ background: BG })
  .removeAlpha()
  .png()
  .toFile(`${OUT}/feature-graphic-1024x500.png`);

for (const file of ['play-icon-512.png', 'appstore-icon-1024.png', 'feature-graphic-1024x500.png']) {
  const meta = await sharp(`${OUT}/${file}`).metadata();
  console.log(`${file}: ${meta.width}x${meta.height}, alpha=${meta.hasAlpha}`);
}
