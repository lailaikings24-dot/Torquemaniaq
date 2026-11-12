# TorqueMedic

An OBD-II scan tool that runs on Android and iPhone: read and clear trouble
codes, stream live sensor data, and work through a guided repair instead of just
staring at a code number.

## Use it now

**https://site-d29bccb8b69e4f628bad28288fc50584.freebuff.page**

The production build is already live there — open it on a phone, choose *Install*
(or *Add to Home Screen* on iPhone), and it stays available offline afterwards.
No dev server, no laptop, no build step.

A separate preview deployment tracks the same build at
<https://site-9bd393e17a2e4512a5b6148dbbacaef8.freebuff.page>.

Every screen is a real URL — `/`, `/live`, `/codes`, `/repair`, `/vehicle`,
`/tools`, `/connect` — so links can be bookmarked and shared, and the browser's
back and forward buttons move between screens. The outer shell stays mounted
while the panel below it swaps.

## What it does

- **Codes** — stored, pending and permanent DTCs, attributed to individual ECUs;
  clear with Mode 04 and re-verify after the repair.
- **Live data** — batched PID polling on CAN, gauges, trends, CSV export.
- **Diagnostics** — freeze frame, readiness monitors, Mode 06 on-board test
  results, supported-PID listing, VIN decode, calibration ID / CVN.
- **Repairs** — ranked causes, ordered diagnostic steps, parts and cost bands,
  a drive-or-stop verdict, a repair log, and a printable report.
- **Custom PIDs** — Mode 22 with header and formula, for manufacturer-specific
  ABS/body/transmission data.
- **Demo vehicle** — a real ELM327 emulator with two ECUs, so the app is fully
  usable before you buy a dongle.

## Run it

```bash
npm ci
npm run dev          # http://localhost:3000
npm run build        # typecheck + production bundle
npm run check:protocol   # protocol checks against the simulator
npm run check:host       # routing/caching checks for the deploy worker
npm run icons        # regenerate the PNG app icons
```

## Getting it onto a phone

**Android / desktop browser (PWA)** — open the site in Chrome or Edge and choose
*Install*. Works offline; Bluetooth LE via Web Bluetooth.

**iPhone** — Safari cannot reach Bluetooth from a web page at all, so the
installed app is the supported route. Wi-Fi adapters work in Safari through the
WebSocket bridge without any native build.

**Installable apps** — `android/` and `ios/` are real Capacitor projects built
from this same web app, each with a native Bluetooth plugin, launcher icons and
permissions already wired:

```bash
npm run native:sync            # build + copy the web app into both projects
npx cap open android           # Android Studio → run, or gradlew assembleDebug
npx cap open ios               # Xcode → run on a device (needs macOS)
```

See [native/README.md](native/README.md) for signing, the remote-server option
and what each platform can and cannot reach.

## Adapters

| Link | Where it works |
| --- | --- |
| Bluetooth LE (Web Bluetooth) | Android Chrome/Edge, desktop Chrome/Edge |
| Bluetooth (native plugin) | Android app — BLE **and** Classic SPP; iOS app — BLE |
| Wi-Fi / WebSocket bridge | everywhere |

Classic “MINI” Bluetooth dongles need the native app (Android) or a serial bridge:
no browser can open an SPP socket. iOS additionally forbids Classic entirely
without MFi certification.

## Coverage, honestly

OBD-II is a standard, so powertrain data works on every compliant car: US petrol
from 1996, EU petrol from 2001, EU diesel from 2004. That is what “any vehicle”
means here — the adapter auto-detects CAN, ISO 9141 and KWP2000.

ABS, airbag, body and manufacturer-specific modules answer only on their own
protocols. The app reaches them through Tools → Custom PIDs (Mode 22) rather
than pretending the generic standard covers them.

## Layout

```
src/
├── lib/
│   ├── elm327.ts          ELM327 driver: init, ISO-TP reassembly, per-ECU grouping
│   ├── transport.ts       BLE / Wi-Fi transports
│   ├── native/            Capacitor bridge + native transport
│   ├── platform.ts        Android/iOS/capability detection, install flow
│   ├── obd/               PID table, DTC parsing, VIN decoding, monitors
│   ├── dtc/               repair knowledge base
│   ├── demo.ts            virtual vehicle (ELM327 emulator)
│   └── service.ts         scan / live data / clear orchestration
├── components/            shared UI
└── pages/                 Connect, Dashboard, Live, Codes, Repair, Vehicle, Tools
android/ ios/              generated Capacitor projects (see native/README.md)
native/                    plugin sources + the native build guide
scripts/                   protocol checks, icon generation
```

## Verification

- `npm run build` — typecheck and bundle clean.
- `npm run check:protocol` — the full suite driving the real transport → parser →
  service → store stack against the emulator.
- `npm run check:host` — shell routing for every app URL, canonical slash
  redirects, honest 404s, cache headers, and that the worker's route map still
  matches the app's.
- `npm run check:native` — the Android and iOS projects carry the same web
  build, register the Bluetooth plugin, declare their permissions and usage
  strings, and apply the Kotlin plugin the Android source needs.
- `cd android && ./gradlew assembleDebug` — builds a real debug APK (needs a JDK
  and the Android SDK; verified: 4.5 MB, targetSdk 36, Bluetooth permissions
  merged, plugin classes in the dex).

## Shipping to the stores

Signed release artifacts (`release/`), store copy and graphics (`store/`), and the
full submission checklist are described in [store/SUBMISSION.md](store/SUBMISSION.md).
Store screenshots are captured from the running app at both stores' exact pixel
sizes with `npm run store:screenshots` (see `scripts/store-screenshots.mjs`).

That document also lists what only the store account owner can do and what remains
unverified: the iOS app has not been compiled (no Xcode here) and no build has run
on a physical phone for either platform.

## Hosting

The site is a static Worker: [`deploy-worker.js`](deploy-worker.js) serves
`dist/` and is described by [`deploy.json`](deploy.json). To publish a
change, run `npm run build`, then deploy that manifest to the Sites project. The
service worker ([`public/sw.js`](public/sw.js)) pre-caches the shell and the
hashed bundle on install, so the app opens with no network after one visit.
- Native shell: TypeScript is typechecked; the Kotlin/Swift plugins are not
  compiled here (no Android SDK or Xcode in this environment).
