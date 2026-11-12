# Store submission

## What is built and signed

| Artifact | Path | Size |
| --- | --- | --- |
| Play App Bundle (signed) | `release/torquemedic-1.0.0.aab` | 3.3 MB |
| Installable APK (signed) | `release/torquemedic-1.0.0.apk` | 3.4 MB |
| Play listing icon 512×512 | `store/play-icon-512.png` | — |
| App Store icon 1024×1024 (no alpha) | `store/appstore-icon-1024.png` | — |
| Play feature graphic 1024×500 | `store/feature-graphic-1024x500.png` | — |
| Play phone screenshots (6) | `store/screenshots/play-phone/` | 1080×1920 |
| App Store 6.7" screenshots (6) | `store/screenshots/appstore-6.7/` | 1290×2796 |
| App Store 6.5" screenshots (6) | `store/screenshots/appstore-6.5/` | 1242×2688 |

- Application ID / bundle ID: `com.torquemedic.app`
- Version: `1.0.0` (versionCode 1)
- Signed with APK Signature Scheme v2; certificate `CN=TorqueMedic Upload`
- Built from the same `dist/` bundle as the deployed web app, so all three targets
  run identical code

Regenerate at any time:

```bash
npm run build
npx cap sync
node scripts/native-register.mjs
cd android && ./gradlew bundleRelease assembleRelease
```

## Regenerating the graphics

`npm run store:assets` redraws the three images above from `assets/icon-only.png`.
It draws text through librsvg, which needs fontconfig and at least one font; on a
bare Linux container install a TTF and point fontconfig at it (`~/.fonts` plus a
`fonts.conf` with that directory) or the text renders as empty boxes. This was
caught by looking at the generated image, not by the exit status — always open the
feature graphic before uploading it.

## Signing material — read this before anything else

The upload key is `android/keystore/torquemedic-release.jks`, and its randomly
generated password is in `android/keystore.properties`. Both are gitignored.

- **Back both files up now**, in a password manager or an encrypted drive. This is
  the upload key Google Play accepts for every future release.
- With **Play App Signing** enabled (the default), Google holds the real app
  signing key and this keystore only authorises uploads. If it is lost, you can
  request an upload-key reset from Play support — a slow process, not a brick.
- Never commit the keystore, never paste its password into a listing, an issue or
  a chat. `android/keystore.properties` is only read on the build machine.

## Google Play — what you have to do

Only the account owner can do these; none of it can be automated from here.

1. Create a Google Play Console account (one-time $25) and complete identity
   verification.
2. Create the app: name **TorqueMedic**, default language English, app (not game),
   free.
3. Upload `release/torquemedic-1.0.0.aab` to **Production → Create new release**.
   Let Play manage app signing.
4. Fill the listing from `store/listing.md`, upload the 512 icon and 1024×500
   feature graphic, and add at least two phone screenshots (see below).
5. Complete the forms:
   - **Data safety** — no data collected, no data shared, no data types selected.
     Encryption in transit is "not applicable" (nothing leaves the device).
   - **Content rating** — no to every category; expected Everyone / PEGI 3.
   - **Target audience** — 18+ or "not designed for children".
   - **Ads** — no ads.
   - **App access** — all functionality available without login.
   - **Privacy policy** — the URL from `store/listing.md`.
   - **Government apps / financial features / health** — no.
6. Run a closed test if the account is new (Play requires a test with real users
   before production for new personal developer accounts), then promote.

## App Store — what you have to do

1. Apple Developer Program membership ($99/year), then create the app record for
   `com.torquemedic.app` in App Store Connect.
2. Build and upload the iOS app. Either:
   - open `ios/App/App.xcodeproj` on a Mac, set the team, archive, and upload; or
   - run the `iOS release` workflow with the eight secrets listed at the top of
     `.github/workflows/ios-release.yml` (certificate, provisioning profile, team
     ID, App Store Connect API key).
3. Fill the listing from `store/listing.md`. Privacy label: **Data Not Collected**.
   Export compliance: the app only uses HTTPS through the system WebView, so it
   qualifies for the standard encryption exemption.
4. Add iPhone screenshots (6.7" and 6.5" are the safest pair) and, if you claim
   iPad support, iPad screenshots.
5. Submit for review.

**iOS status: not compiled.** There is no macOS or Xcode in the Linux workspace
where this project was prepared, so the Swift plugin, App-target membership and
Info.plist entries are checked but unproven until the first Mac build. Expect to
fix small Swift errors on that first archive.

## Screenshots

The full set is already captured from the built app — no device needed. Each
size shows Dashboard, Trouble codes, Live data, Repair guide, Vehicle and Tools,
in that order:

| Folder | Pixels | Use |
| --- | --- | --- |
| `store/screenshots/play-phone/` | 1080×1920 | Play phone (16:9, within 320–3840 px) |
| `store/screenshots/appstore-6.7/` | 1290×2796 | App Store 6.7" |
| `store/screenshots/appstore-6.5/` | 1242×2688 | App Store 6.5" |

Regenerate after any UI change:

```bash
npm run build
npm run store:screenshots
```

The script serves `dist/`, connects the built-in demo vehicle, clicks through the
screens and writes the images. It needs a Chromium: either set `CHROME_PATH`, or
install the self-contained build with
`npm i --no-save @sparticuz/chromium puppeteer-core`. On this image Chromium is
missing only NSS, extracted from `libnspr4` and `libnss3` into
`~/toolchain/sysroot`; the script picks that directory up automatically.

The first run caught a genuine phone-layout bug: two dashboard cards side by
side left about 156 px each, and their stat labels and adapter pill painted past
the viewport, cropping the right edge. `.grid-2` now stacks below 640 px. The
script also refuses to write an image when the page's layout viewport differs
from the requested width, which is what makes that kind of crop impossible to
miss.

## Versioning for the next release

Bump `versionCode` (must increase by at least 1) and `versionName` in
`android/app/build.gradle`, then tag the commit `v1.0.1` to trigger the CI
workflows. The iOS build number lives in the Xcode project and can be overridden
with the `CURRENT_PROJECT_VERSION` build setting.

## What is not verified

- Nothing has been installed on a physical phone, and no OBD-II adapter has been
  paired. The Bluetooth code compiles on Android but its runtime behaviour is
  untested.
- The iOS app has never been built.
- The CI workflows have never run (no repository secrets, and the macOS runner is
  outside this workspace).
- No upload to either store has happened; these artifacts are ready to upload,
  not published.
