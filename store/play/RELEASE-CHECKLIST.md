# Google Play release checklist

Everything below is on the account/console side or a deliberate version bump.
Build, signing, branding and listing art are already done in this repo.

## 1. Blockers to clear first

- [x] **Target API 36 — done.** Since 31 August 2026 Google Play rejects new
      apps and updates below Android 16 (API 36). `android/variables.gradle` now
      sets `compileSdkVersion`/`targetSdkVersion` to 36, and AGP is 8.9.1 (the
      official minimum for API 36; Gradle 8.11.1 in the wrapper satisfies it).
      Re-check every August — the minimum rises yearly.
      Source: https://developer.android.com/build/releases/about-agp
- [x] **Privacy policy URL — published.**
      https://site-d29bccb8b69e4f628bad28288fc50584.freebuff.page/privacy
      Source: `src/pages/Privacy.tsx` (route `/privacy`, served by the deploy
      worker). The page lists `privacy@torquemaniaq.com` as the contact, so that
      mailbox must exist or the address must be changed before submitting.
- [ ] **Play Console account.** Personal or organisation, one-time registration
      fee, identity verification. Organisation accounts need a D-U-N-S number.
- [ ] **Upload keystore.** Create it, back it up, and add the four
      `ANDROID_*` secrets described in `native/README.md` if you want tag builds.

## 2. App setup in Play Console

- [ ] **Create the app.** Name `TorqueMedic`, default language, App (not game),
      Free. The package name `com.torquemedic.app` becomes permanent once the
      first bundle is uploaded.
- [ ] **App access.** All functionality is reachable without an account; the
      demo vehicle covers Bluetooth. State that no login is required.
- [ ] **Ads.** No ads.
- [ ] **Content rating.** Complete the IARC questionnaire (utility/tools, no
      user-generated content, no violence). Expect Everyone / PEGI 3.
- [ ] **Target audience.** Not designed for children; do not opt into the
      Families programme.
- [ ] **Data safety.** Answer **No** to collecting or sharing data. The exact
      console answers and the code-backed reasons are in
      [DATA-SAFETY.md](DATA-SAFETY.md); re-check it if any SDK or sync feature is
      added.
- [ ] **Permissions declaration.** Bluetooth scan/connect is core functionality;
      no `MANAGE_EXTERNAL_STORAGE`, SMS or call-log permissions are requested,
      so no sensitive-permission form applies.
- [ ] **Government / financial / health.** None apply.

## 3. Store listing

Assets are in `store/play/` and already meet Play's specs:

- [ ] Icon — `store/play/icon-512.png` (512×512, opaque)
- [ ] Feature graphic — `store/play/feature-graphic-1024x500.png`
- [ ] Phone screenshots — `store/play/screenshots/01`–`05` (1080×1920, five of
      the eight allowed)
- [ ] Short description (≤80 chars), e.g.
      `Read OBD-II codes, watch live sensor data, and follow guided repairs.`
- [ ] Full description (≤4000 chars): cover codes, live data, guided repair
      costs/steps, demo vehicle, Bluetooth Classic/BLE and Wi-Fi adapters.
- [ ] Category: Auto & Vehicles (or Tools), tags, contact email, website URL.
- [ ] Countries/regions and pricing (free).

## 4. Cut a release

- [ ] Bump `versionCode` (and `versionName`) in
      `android/app/build.gradle` — Play rejects a version code already used on
      any track.
- [ ] Commit, then either:
      - tag and let CI build it: `git tag v1.2.0 && git push origin v1.2.0`,
        then download `torquemedic-v1.2.0` from the run's Artifacts, or
      - build locally: `npm run android:bundle` and verify with `jarsigner -verify`.
- [ ] Upload the `.aab` to a track. Accept Play App Signing; the keystore is
      then only your upload key.

## 5. Testing and production access

- [ ] **Internal testing** first — up to 100 testers, no review wait, confirms
      the bundle installs and the Bluetooth permission prompt behaves.
- [ ] **Closed testing** — personal accounts created after 13 November 2023
      must keep **at least 12 testers opted in continuously for 14 days** before
      they can even apply for production. Internal testing does not count, and
      an opted-out tester restarts their clock. Organisation accounts are exempt.
- [ ] Apply for production access from the Dashboard and answer the closed-test
      questions (who tested, what you fixed, what changed).
- [ ] Roll out to production, starting with a staged percentage.

## 6. Every future release

- [ ] Increment `versionCode`.
- [ ] Re-check the target API requirement each August — it rises yearly.
- [ ] Re-run `npm run icons:android` only if the brand art changes.
- [ ] Refresh screenshots if the UI changes.

## References

- Target API levels: https://support.google.com/googleplay/android-developer/answer/11926878
- Testing for new personal accounts: https://support.google.com/googleplay/android-developer/answer/14151465
- Data safety: https://support.google.com/googleplay/android-developer/answer/10787469

iOS is not covered here: it needs macOS, Xcode and an Apple Developer account,
and the iOS platform has not been generated yet.
