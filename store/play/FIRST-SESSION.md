# First Play Console session — order of operations

One page, in order. Budget 45–60 minutes of Console work once the developer
account is verified. The first test link can lag by hours, so treat step 12 as a
separate check; closed testing is a separate session.

## Before you open the Console

- [ ] Account approved and identity verification complete; 2FA enabled.
- [ ] Signed AAB downloaded, and `jarsigner -verify` says `jar verified.`
      (see [native/README.md](../../native/README.md)).
- [ ] The policy URL loads and `lailaikings24@gmail.com` is monitored.
- [ ] Listing text and art open: [STORE-LISTING.md](STORE-LISTING.md).
- [ ] Answers open: [CONSOLE-ANSWERS.md](CONSOLE-ANSWERS.md).
- [ ] Decide the target audience: 13+ (recommended) or 18+ only.

## The session

1. **Create the app** — All apps → Create app. Name
   `TorqueMedic: OBD2 Scanner`, default language, **App**, **Free**, accept the
   declarations. The package `com.torquemedic.app` is permanent after the first
   upload.
2. **Store listing** — Main store listing: paste the name, short and full
   description, choose **Auto & Vehicles**, add tags, contact email, website and
   privacy URL. Upload the 512×512 icon, 1024×500 feature graphic and the five
   1080×1920 screenshots. Save.
3. **Privacy policy** — App content → Privacy policy: the `/privacy` URL.
4. **App access** — All functionality available without special access; paste
   the reviewer note from CONSOLE-ANSWERS.
5. **Ads** — No.
6. **Content rating** — Start the IARC questionnaire, category *Utility,
   Productivity, Communication or Other*, contact email, answer **No** to every
   content question, submit. Keep the certificate email.
7. **Target audience** — 13–15, 16–17, 18+; leave Under 13 unchecked; not
   designed for children; do not opt into Families.
8. **Data safety** — No collection or sharing, no third-party SDK data, no
   independent validation. In-app deletion is Tools → Settings & data → Clear
   all app data.
9. **Other declarations** — Government: No. Financial: None. Health: No. News:
   No. COVID tracing: No. Advertising ID: No.
10. **Internal release** — Test and release → Testing → Internal testing →
    Create new release. Accept Play App Signing with the Google-generated key,
    upload the AAB, name it `1.0.0 (2) internal`, add one line of notes, start
    the rollout.
11. **Testers** — Testers tab → Create email list → add the Google accounts →
    save. Copy the opt-in link once the release is available. The first link can
    take several hours.
12. **Install it yourself** — On a phone signed in as a listed account: opt in,
    install from Play, check Tools → About shows 1.0.0, open Connect → Demo
    vehicle. If you have an adapter, grant the Bluetooth prompt and read codes.

## Stop rules

- Do not upload the local unsigned build or anything saying `jar is unsigned`.
- Do not select Under 13, and do not opt into the Families programme.
- Do not start the closed test yet — you need 12 testers lined up first.
- Do not change the package name; it is fixed after the first upload.
- Do not delete testers or pause the track while people are installing.

## If something blocks you

| Symptom | Fix |
| --- | --- |
| Create new release is disabled | Finish the outstanding Dashboard tasks |
| Version code already used | Bump `versionCode`, rebuild, tag a new version |
| Wrong signing key | Upload the build signed with the registered upload key |
| No opt-in link | Wait for the release to become available; check it is not Draft |
| "App not available" for a tester | Wrong Google account, not on the list, or propagation delay |
| Store listing rejected | Fix the flagged field; screenshots and copy are already within limits |

## Next session

Closed testing: 12 testers opted in for 14 continuous days, then apply for
production access. Steps are in [RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md),
with tester instructions in [TESTER-GUIDE.md](TESTER-GUIDE.md).
