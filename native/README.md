# Native Android & iOS builds

The web app in `../src` is the whole product. These two files are the piece the
browser cannot provide: a Bluetooth stack.

| Platform | Browser (PWA) | This native shell |
| --- | --- | --- |
| Android | BLE only (Web Bluetooth, Chrome/Edge) | BLE **and** Bluetooth Classic (SPP) |
| iOS | nothing — Safari has no Bluetooth API | BLE (CoreBluetooth) |
| Desktop | BLE only | not applicable |

Wi-Fi (ELM327 WiFi / OBDLink WiFi) works everywhere through the WebSocket
transport, no native build required.

## What is here

```
native/
├── android/VehicleLinkPlugin.kt     Capacitor plugin — BLE + Classic SPP
├── ios/VehicleLinkPlugin.swift      Capacitor plugin — BLE (CoreBluetooth)
├── AndroidManifest.additions.xml    permissions to merge
├── Info.plist.additions.xml         usage strings to merge
└── README.md
```

The JavaScript side already exists and needs no changes:

- `src/lib/native/bridge.ts` — typed, dependency-free client for the plugin
- `src/lib/native/transport.ts` — `Transport` implementation used by the OBD service
- `src/pages/Connect.tsx` — scan list, shown automatically when the plugin is present

The bridge is discovered at runtime via `window.Capacitor.Plugins.VehicleLink`,
so the web build stays a plain web build and has no Capacitor dependency.

## Android

The Capacitor project is committed under `android/` and the Bluetooth plugin is
already wired, so there is nothing to copy by hand:

- `android/app/src/main/java/com/torquemedic/app/VehicleLinkPlugin.kt` — the plugin
- `MainActivity.java` — registers it with `registerPlugin(VehicleLinkPlugin.class)`
- `AndroidManifest.xml` — BLE + Classic permissions, `neverForLocation`, and
  `usesCleartextTraffic` so `ws://` Wi-Fi adapters reach the WebView

```bash
npm run android:sync     # web build + copy assets into the Android project
npm run android:open     # open android/ in Android Studio
npm run icons:android    # launcher icons + splash, rendered from public/icon.svg
```

A Play Store bundle needs JDK 21 and Android SDK 35:

```bash
npm run android:bundle   # android/app/build/outputs/bundle/release/app-release.aab
```

### Release signing (upload key)

`android/app/build.gradle` reads signing material from
`android/keystore.properties`, which is gitignored. With no such file the build
still succeeds — it just produces an **unsigned** bundle — so a fresh clone and
CI can build without secrets.

**1. Create your upload keystore** (once; keep it forever, outside the repo):

```bash
keytool -genkeypair -v \
  -keystore ~/keys/torquemedic-upload.jks \
  -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

`keytool` ships with the JDK. Use a strong password and store a backup of the
file somewhere safe — without it you cannot ship updates to the same Play
listing. Google also recommends enrolling in Play App Signing, where this is
only the *upload* key and Google holds the app-signing key.

**2. Point Gradle at it:**

```bash
cp android/keystore.properties.example android/keystore.properties
# then edit storeFile / storePassword / keyAlias / keyPassword
```

`storeFile` may be absolute or relative to `android/app`. `*.jks`, `*.keystore`
and `keystore.properties` are all ignored by git.

**3. Build the signed bundle:**

```bash
npm run android:bundle
# android/app/build/outputs/bundle/release/app-release.aab
```

**4. Check it really is signed:**

```bash
jarsigner -verify android/app/build/outputs/bundle/release/app-release.aab
# expect: "jar verified."  (without keystore.properties: "jar is unsigned.")
```

Bump `versionCode` in `android/app/build.gradle` for every Play upload; Play
rejects a bundle that reuses a code already on the track.

### CI: signed bundles on tags

`.github/workflows/android-release.yml` builds, verifies and uploads a signed AAB
whenever a `v*` tag is pushed. Add four repository secrets first
(Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 ~/keys/torquemedic-upload.jks` |
| `ANDROID_KEYSTORE_PASSWORD` | store password |
| `ANDROID_KEY_ALIAS` | key alias, usually `upload` |
| `ANDROID_KEY_PASSWORD` | key password |

The workflow reconstructs `android/keystore.properties` in the runner, fails the
build if the AAB is not signed, uploads it as an artifact, and deletes the
keystore and properties file even when a step fails. The AAB lands under
Actions → the tag's run → Artifacts.

### iOS project (macOS only)

```bash
npm i @capacitor/ios
npx cap add ios
npx cap sync ios
```

Then follow the iOS steps below.

## iOS

1. Copy `ios/VehicleLinkPlugin.swift` to `ios/App/App/VehicleLinkPlugin.swift`.
2. Open `ios/App/App.xcworkspace` in Xcode and add the file to the **App** target.
   Xcode 15's file-system groups pick it up automatically.
3. Merge `Info.plist.additions.xml` into `ios/App/App/Info.plist`.
4. Set a development team under *Signing & Capabilities* (Bluetooth needs no
   special capability, just the usage strings).
5. Run on a physical iPhone — the simulator has no Bluetooth radio.

```bash
npx cap run ios 
```=

Bluetooth Classic / SPP dongles cannot be supported on iOS: Apple requires MFi
certification for those. BLE adapters and Wi-Fi adapters both work.

## How the plugin behaves

Both implementations expose the same five methods and two events:

| Method | Purpose |
| --- | --- |
| `available()` | radio present / powered / permission granted, with a human reason |
| `scan({ timeoutMs })` | nearby adapters: `{ id, name, rssi, link: 'ble' \| 'classic' }` |
| `connect({ id, link })` | opens GATT (or RFCOMM on Android) and resolves `{ name, profile }` |
| `write({ data })` | sends ELM327 text, chunked to 20 bytes for BLE serial bridges |
| `disconnect()` | closes the link |

Events: `data` → `{ data }` (adapter output) and `linkLost` → `{ reason }`.
The transport reconnects nothing on its own — a dropped link surfaces in the UI
so the user is not shown stale sensor values.

## Verification status

These native files have **not been compiled**: this workspace has no Android SDK
or Xcode. The TypeScript side they talk to is typechecked and unit-exercised
through the simulator, but building and running the two native projects — and
pairing a real dongle on a real phone — has to happen in Android Studio and
Xcode.
