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

A Play Store bundle needs JDK 21 and Android SDK 36:

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
whenever a `v*` tag is pushed. Set this up once:

**1. Encode the keystore.**

```bash
# Linux
base64 -w0 ~/keys/torquemedic-upload.jks > ~/keys/upload.b64

# macOS
base64 -i ~/keys/torquemedic-upload.jks | tr -d '\n' > ~/keys/upload.b64
```

PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$HOME\keys\torquemedic-upload.jks")) |
  Set-Content -NoNewline "$HOME\keys\upload.b64"
```

The value must be one line, with no `base64:` prefix.

**2. Add four repository secrets** — Settings → Secrets and variables → Actions
→ New repository secret:

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | contents of `upload.b64` |
| `ANDROID_KEYSTORE_PASSWORD` | store password |
| `ANDROID_KEY_ALIAS` | `upload` (must match the alias) |
| `ANDROID_KEY_PASSWORD` | key password (same as store if you pressed Enter) |

Or with the GitHub CLI:

```bash
gh secret set ANDROID_KEYSTORE_BASE64 < ~/keys/upload.b64
gh secret set ANDROID_KEYSTORE_PASSWORD   # prompts; keeps it out of history
gh secret set ANDROID_KEY_ALIAS --body upload
gh secret set ANDROID_KEY_PASSWORD        # prompts
```

Then `rm ~/keys/upload.b64`. Secrets are write-only; you cannot read them back.

**3. Tag the commit you want to ship.** A tag stays on the commit it was created
at, so check it before pushing:

```bash
git rev-parse --short v1.0.0^{commit}
git rev-parse --short HEAD
```

If they differ, recreate it:

```bash
git tag -d v1.0.0
git tag -a v1.0.0 -m "TorqueMedic 1.0.0"
git push origin v1.0.0
```

If the remote already has the tag, don't force it — use a new tag such as
`v1.0.1`. Bump `versionCode` first if that code has been uploaded to any track.

**4. Check the run.** Actions → *Android release bundle* → the tag's run. The
workflow reconstructs `android/keystore.properties` in the runner, requires
`jar verified`, writes the version, asset and AAB hashes to the job summary,
uploads `torquemedic-<tag>`, and deletes the keystore even when a step fails.
Download the artifact and re-check locally:

```bash
jarsigner -verify -verbose -certs torquemedic-v1.0.0.aab | tail -3
# expect: jar verified.
```

**Common failures.** `keystore password was incorrect` or `Cannot recover key`
means the store password, key password or alias is wrong (the alias is
case-sensitive). `base64: invalid input` means the secret has line breaks.
`jar is unsigned` in a tag run means the signing steps were skipped — check the
"Require signing secrets" step. Avoid backslashes and leading or trailing spaces
in passwords; they are written into a Java properties file.

**Dry run without secrets.** Actions → *Android release bundle* → *Run workflow*
builds the same bundle unsigned: the signing steps are skipped, the check flips
to `jar is unsigned`, and the artifact is named `torquemedic-dry-run-<run>`. Use
it to confirm the SDK, Node and Gradle toolchain before configuring secrets or
pushing a tag.

The same run also uploads `torquemedic-debug-<run>`, a debug-signed APK that can
be installed straight from the artifact for testing. It is signed with the
runner's throwaway debug key, so uninstall any Play or upload-key build first —
Android will refuse to install it over a differently signed copy.

Before building, the workflow runs the protocol, host and version checks
(`npm run check:static`). It does not build there — `android:sync` builds the web
app once — so a code or routing failure stops the job before Gradle starts.

Every run also writes a **job summary** listing the version code and name, the
packaged web asset with its SHA-256, and the AAB hash, so a build can be checked
against the local one without downloading the artifact.

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
