# Google Play release checklist

Everything below is on the account/console side or a deliberate version bump.
Build, branding and listing art are already done in this repo. The upload key
and signing are not: sections 1 and 4 create them.

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
      worker). The page lists `lailaikings24@gmail.com` as the contact; keep that
      mailbox monitored. Do not switch to a `@torquemaniaq.com` address until the
      domain has working mail records.
- [ ] **Play Console account.** Personal or organisation, one-time registration
      fee, identity verification. Organisation accounts need a D-U-N-S number.
- [ ] **Upload keystore.** Create it, back it up, and add the four
      `ANDROID_*` secrets described in `native/README.md` if you want tag builds.

## 2. App setup in Play Console

For the first Console session, follow [FIRST-SESSION.md](FIRST-SESSION.md) in
order. Copy-paste answers for every App content section — app access, ads,
content rating, target audience, Data safety, permissions and listing fields —
are in [CONSOLE-ANSWERS.md](CONSOLE-ANSWERS.md).

- [ ] **Create the app.** Name `TorqueMedic: OBD2 Scanner` (25 characters),
      default language, App (not game), Free. The package name
      `com.torquemedic.app` becomes permanent once the first bundle is uploaded.
- [ ] **App access.** All functionality is reachable without an account; the
      demo vehicle covers Bluetooth. State that no login is required.
- [ ] **Ads.** No ads.
- [ ] **Content rating.** Complete the IARC questionnaire as a utility app and
      answer **No** to every content question. The answer sheet and the expected
      regional ratings are in [CONTENT-RATING.md](CONTENT-RATING.md).
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
- [ ] Short and full description, release notes, category and contact details —
      ready to paste from [STORE-LISTING.md](STORE-LISTING.md).
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

### Internal-test upload (developer side)

1. **Verify the tag artifact.** Unzip `torquemedic-v1.0.0` from the Actions run
   and run `jarsigner -verify -verbose -certs app-release.aab`. It must say
   `jar verified.` — not `jar is unsigned` or `CN=Android Debug`. Confirm
   `versionCode 2` and `versionName 1.0.0` in the job summary.
2. **Create the app record** if this is the first upload (section 2). The package
   name `com.torquemedic.app` is permanent from that point.
3. **Create the release.** Test and release → Testing → Internal testing →
   Create new release. If the button is disabled, finish the Dashboard tasks
   first. Accept Play App Signing with the default Google-generated key, upload
   the `.aab`, name the release (for example `1.0.0 (2) internal`), add one line
   of release notes, then Start rollout to Internal testing.
4. **Wait for "Available to internal testers".** The first opt-in link can take
   several hours to start working, even though the rollout itself is quick.
5. **Add testers.** Testers tab → Create email list → add the exact Google
   accounts (up to 100) → Save. Copy the opt-in link; it only appears once the
   release is available. Testers cannot find an internal build by searching Play.
6. **Send the install instructions.** Each tester must be signed in as the
   address on the list:
   > 1. Open this link on your Android phone: `<opt-in link>`
   > 2. Accept the invitation and install TorqueMedic from Play.
   > 3. Check Tools → About shows 1.0.0, then try Connect → Demo vehicle.
   > 4. Email lailaikings24@gmail.com with your phone model and anything broken.
7. **Before the closed test,** have internal testers opt out of the internal
   track. A tester opted into internal testing generally cannot join the closed
   test until they leave it — use separate accounts if that is simpler.

Internal testing can start before the store listing and App content are complete;
closed testing and production access cannot. The opt-in link only appears when
the app status is Published/Available, not Draft or Pending publication.

If upload fails, check the version code is unused, the AAB is signed with the
registered upload key rather than a debug or local key, and the tester is using
the exact account on the list.

- [ ] **Closed testing** — personal accounts created after 13 November 2023
      must keep **at least 12 testers opted in continuously for 14 days** before
      they can even apply for production. Internal testing does not count, and
      an opted-out tester restarts their clock. Organisation accounts are exempt.
      Tester instructions (Play opt-in, debug APK, bug reports) are in
      [TESTER-GUIDE.md](TESTER-GUIDE.md); a dated 14-day plan is in
      [TEST-SCHEDULE.md](TEST-SCHEDULE.md).

### Closed-test setup (developer side)

1. Finish every **App content** declaration first — testing tracks stay locked
   until the required forms are complete.
2. **Test and release → Testing → Closed testing → Create track.** Name it (for
   example `Beta`), add the countries your testers are in, and roll out the
   signed AAB. The first rollout goes through Play review.
3. **Testers tab → Manage testers.** Use an email list or a Google Group, and
   add more than 12 people — 15–20 gives a buffer, because one dropout drops you
   below the requirement.
4. Copy the **opt-in link** from the Testers tab (it looks like
   `https://play.google.com/apps/testing/com.torquemedic.app`) and send it with
   the invite message from TESTER-GUIDE.md.
5. Ask each tester to confirm they installed from Play. Someone who joins the
   list but never installs is a wasted slot.
6. Leave the track and the rollout live for the whole 14 days. Pausing or
   removing it breaks the run.

- [ ] Apply for production access from the Dashboard and answer the closed-test
      questions (who tested, what you fixed, what changed). Draft answers with
      placeholders for your real numbers are in
      [PRODUCTION-ACCESS.md](PRODUCTION-ACCESS.md).
- [ ] Roll out to production, starting with a staged percentage.

## 6. Every future release

- [ ] Increment `versionCode`.
- [ ] Re-check the target API requirement each August — it rises yearly.
- [ ] Re-run `npm run icons:android` only if the brand art changes.
- [ ] Refresh screenshots if the UI changes.

## References

- Target API levels: https://support.google.com/googleplay/android-developer/answer/11926878
- Testing for new personal accounts: https://support.google.com/googleplay/android-developer/answer/14151465
- Internal testing setup: https://support.google.com/googleplay/android-developer/answer/9845334
- Preparing and rolling out a release: https://support.google.com/googleplay/android-developer/answer/9859348
- Data safety: https://support.google.com/googleplay/android-developer/answer/10787469

iOS is not covered here: it needs macOS, Xcode and an Apple Developer account,
and the iOS platform has not been generated yet.
