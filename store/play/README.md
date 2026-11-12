# Play Store listing assets

Upload-ready art for the Google Play listing, generated from the app's own brand
(`public/icon.svg`) and the running app — no stock imagery.

| File | Play requirement | Size |
| --- | --- | --- |
| `icon-512.png` | App icon, 32-bit PNG, no transparency | 512 × 512 |
| `feature-graphic-1024x500.png` | Feature graphic, PNG/JPEG, no transparency, no rounded corners | 1024 × 500 |
| `screenshots/01-dashboard.png` | Phone screenshot, 16:9, min 320 px | 1080 × 1920 |
| `screenshots/02-codes.png` | Phone screenshot | 1080 × 1920 |
| `screenshots/03-vehicle.png` | Phone screenshot | 1080 × 1920 |
| `screenshots/04-live-data.png` | Phone screenshot | 1080 × 1920 |
| `screenshots/05-repair.png` | Phone screenshot | 1080 × 1920 |

## Regenerating

**Icon** — the square plate is the brand SVG with its rounded plate replaced by
the full-bleed gradient:

```bash
node -e "
const sharp = require('sharp'), fs = require('fs');
const svg = fs.readFileSync('public/icon.svg', 'utf8').replace(
  /<rect width=\"512\" height=\"512\" rx=\"112\" fill=\"#0b0f14\"\/>/,
  '<defs><linearGradient id=\"bg\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#0a0e13\"/><stop offset=\"1\" stop-color=\"#121c26\"/></linearGradient></defs><rect width=\"512\" height=\"512\" fill=\"url(#bg)\"/>'
);
sharp(Buffer.from(svg), { density: 384 }).resize(512, 512).removeAlpha()
  .png().toFile('store/play/icon-512.png');
"
```

**Feature graphic** — `feature-graphic.html` is the source. With the dev server
running, open `/store/play/feature-graphic.html`, set the viewport to 1024 × 500,
screenshot, and downscale if the capture came out at 2×.

**Screenshots** — from the app in demo mode, so no dongle is needed:

1. `npm run dev`, open the site with a 540 × 960 viewport at deviceScaleFactor 2
   (screenshots land at 1080 × 1920 and use the phone layout).
2. Connect the **Demo vehicle**.
3. Capture Home, Codes, Vehicle, Live data and Repair from the bottom tab bar.
4. Hide scrollbars (`*::-webkit-scrollbar{display:none}`) before capturing.

## Not included

- Tablet screenshots and the 7-inch/10-inch graphics.
- A promotional video.
- Localised screenshots — all art here is English only.
