/**
 * Captures store screenshots from the built app (`dist/`), automatically:
 * serves the build, connects the demo vehicle, visits each screen and writes
 * images at the exact pixel sizes Google Play and the App Store require.
 *
 *   npm run build
 *   npm run store:screenshots
 *
 * Output:
 *   store/screenshots/play-phone/          1080x1920  (16:9, Play phone)
 *   store/screenshots/appstore-6.7/        1290x2796  (App Store 6.7")
 *   store/screenshots/appstore-6.5/        1242x2688  (App Store 6.5")
 *
 * Rendering needs a Chromium. This workspace has no root, so it uses the
 * self-contained build plus a local sysroot:
 *
 *   npm i --no-save @sparticuz/chromium puppeteer-core
 *   # Chromium's only missing libs on this image are NSS; they are extracted
 *   # into ~/toolchain/sysroot (see store/SUBMISSION.md for the two .debs).
 *
 * Any other Chromium works too: set CHROME_PATH and PUPPETEER_LIBS to point at
 * a browser and its library directory.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve('dist');
const OUT = path.join('store', 'screenshots');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

// A plain static server with SPA fallback: the app routes every screen to a
// real path, so a screenshot must load /codes even though only index.html is
// on disk for that URL.
function serve() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = path.join(ROOT, path.normalize(urlPath));
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end();
      return;
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      if (path.extname(urlPath)) {
        res.writeHead(404).end('not found');
        return;
      }
      file = path.join(ROOT, 'index.html');
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

const PROFILES = [
  { id: 'play-phone', width: 360, height: 640, scale: 3 },
  { id: 'appstore-6.7', width: 430, height: 932, scale: 3 },
  { id: 'appstore-6.5', width: 414, height: 896, scale: 3 },
];

// Store order tells a story: what the car says, what it means, what to do.
const SCREENS = [
  { label: 'Home', slug: 'dashboard' },
  { label: 'Codes', slug: 'trouble-codes' },
  { label: 'Live', slug: 'live-data' },
  { label: 'Repair', slug: 'repair-guide' },
  { label: 'Vehicle', slug: 'vehicle' },
  { label: 'Tools', slug: 'tools' },
];

const clickButton = (page, matcher) =>
  page.evaluate((needle) => {
    const buttons = [...document.querySelectorAll('button')];
    const target = buttons.find((b) => b.textContent && b.textContent.includes(needle));
    if (!target) return false;
    target.click();
    return true;
  }, matcher);

async function launch() {
  if (process.env.CHROME_PATH) {
    return puppeteer.launch({
      executablePath: process.env.CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
  }
  const { default: chromium } = await import('@sparticuz/chromium');
  const libs = process.env.PUPPETEER_LIBS || path.join(process.env.HOME || '', 'toolchain/sysroot/usr/lib/x86_64-linux-gnu');
  if (fs.existsSync(libs)) {
    process.env.LD_LIBRARY_PATH = [libs, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':');
  }
  return puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

async function main() {
  if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
    throw new Error('dist/index.html is missing — run npm run build first');
  }

  const { server, port } = await serve();
  const base = `http://127.0.0.1:${port}`;
  const browser = await launch();
  const written = [];

  try {
    for (const profile of PROFILES) {
      const dir = path.join(OUT, profile.id);
      fs.mkdirSync(dir, { recursive: true });

      const page = await browser.newPage();
      await page.setViewport({
        width: profile.width,
        height: profile.height,
        deviceScaleFactor: profile.scale,
        // Do not use Puppeteer's mobile emulation: it rescales the layout
        // viewport (innerWidth drifts from 360 to 386) and the capture then
        // crops the right edge. Width media queries already give the phone
        // layout, so keep the viewport exactly the requested size.
        isMobile: false,
        hasTouch: true,
      });

      await page.goto(base + '/', { waitUntil: 'networkidle2' });
      const inner = await page.evaluate(() => window.innerWidth);
      if (inner !== profile.width) {
        throw new Error(`${profile.id}: layout viewport ${inner}px vs ${profile.width}px capture — screenshots would be cropped`);
      }
      await page.waitForFunction(() => document.body.innerText.includes('Demo vehicle'), { timeout: 20000 });

      // Connect the simulated car so every screen has real content.
      const connected = await page.evaluate(() =>
        document.body.innerText.includes('Adapter connected'),
      );
      if (!connected) {
        const clicked = await clickButton(page, 'Virtual ELM327');
        if (!clicked) throw new Error('could not find the demo vehicle card');
        await page.waitForFunction(
          () => document.body.innerText.includes('Demo vehicle') && !document.body.innerText.includes('Connecting…'),
          { timeout: 45000 },
        );
      }

      // Let the first scan and the chart history fill in before capturing.
      await page.waitForFunction(() => !document.body.innerText.includes('Scanning'), { timeout: 45000 });
      await sleep(2500);

      for (const [index, screen] of SCREENS.entries()) {
        const ok = await clickButton(page, screen.label);
        if (!ok) throw new Error(`no nav button labelled ${screen.label}`);
        await sleep(1400);
        const file = path.join(dir, `${String(index + 1).padStart(2, '0')}-${screen.slug}.png`);
        await page.screenshot({ path: file });
        written.push(file);
      }

      await page.close();
      console.log(`${profile.id}: ${profile.width * profile.scale}x${profile.height * profile.scale}, ${SCREENS.length} screens`);
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n${written.length} screenshots written to ${OUT}/`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
