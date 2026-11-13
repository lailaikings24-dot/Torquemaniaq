# TorqueMedic closed-test guide

For the people testing TorqueMedic before its first Play release. It covers how
to install a build, what to try, and how to report what breaks.

## Why the test matters

Google Play requires personal developer accounts created after 13 November 2023
to run a **closed test with at least 12 testers opted in continuously for 14
days** before the developer can even apply for production access. Internal
testing does not count, and a tester who opts out restarts their own clock when
they opt back in. Staying installed and opted in for the full two weeks is the
most useful thing you can do.

Only testers who join through the **Play closed-testing link** count toward that
requirement. The debug APK below is for quick checks and does not count.

## Invite message you can send

Replace the three bracketed placeholders. It is deliberately short and states
the commitment before anyone clicks.

```text
Hi — I need a small favour for a two-week Android test.

I've built TorqueMedic, an OBD-II scanner app for cars. Google Play requires new
developer accounts to keep at least 12 testers opted into a closed test for 14
days in a row before the app can be released publicly.

What it involves:
1. Open this link and tap "Become a tester": [opt-in link]
2. Install TorqueMedic from Play.
3. Keep it installed and stay opted in until [end date]. Please don't leave the
   test early — opting out restarts your 14 days.
4. Open it once or twice. Connect the demo vehicle if you don't have a Bluetooth
   OBD adapter.

That's all. No account, no ads, and nothing leaves your phone. If something
looks wrong, send me your phone model and what happened.

Can you join by [start date]? Thanks!
```

## Reminder message (around day 7)

Send this once, midway through the window. It leads with "no action needed", so
it reads as an update rather than a chase.

```text
Hi — a quick update on the TorqueMedic test. If the app is still installed and
you're still opted in, you don't need to do anything: that's exactly what we need.

We're at [day X] of the 14 days Google requires. The one thing that helps most is
simply leaving it installed until [end date] — uninstalling or opting out restarts
your 14 days and can drop us below the 12 testers we need.

If you have two minutes, open it once and try the demo vehicle, then reply with
anything that looked confusing. "Works fine on my phone" is a useful reply too.

Thanks again for sitting through this.
```

## Install option A — Play closed testing (counts)

1. Open the opt-in link the developer sends you. It looks like
   `https://play.google.com/apps/testing/com.torquemedic.app`.
2. Sign in with the Google account you gave the developer.
3. Tap **Become a tester**, then **Download it on Google Play**.
4. Install TorqueMedic and keep it installed for the whole test period.
5. Leave the test only when the developer says it is finished. Opting out before
   the 14 days are up means your install no longer counts.

The app can take a few minutes to appear after you opt in, and the first opt-in
link can take several hours to activate. If Play says the app is not available,
tell the developer rather than removing yourself from the test.

## Install option B — debug APK from GitHub Actions

Use this only if the developer has given you access to the repository. It does
not count toward Play's tester requirement.

1. Open the repository's **Actions** tab → **Android release bundle**.
2. Pick the most recent successful run and download the
   `torquemedic-debug-<run>.zip` artifact.
3. Unzip it to get `app-debug.apk`.
4. On the phone, allow installs from the app you are using to open the file
   (Settings → Apps → Special access → Install unknown apps).
5. If a Play or earlier build is already installed, uninstall it first: the
   debug APK is signed with a different key, so Android will refuse to replace
   the existing install.
6. Install, open the app, and check **Tools → About** shows the expected version.

## Install option C — browser / home screen

The same app runs at
https://site-d29bccb8b69e4f628bad28288fc50584.freebuff.page. Chrome/Edge can
install it from the address bar; on iPhone use Share → Add to Home Screen. This
is the quickest way to look at the interface, but it is not the Play build and
does not count toward the closed test.

## What you need

- Android 6.0 or newer for the app (the web version runs in Chrome or Edge).
- An ELM327-compatible Bluetooth LE, Bluetooth Classic or Wi-Fi adapter if you
  want to test against a real car. Bluetooth Classic needs the Android app.
- No adapter? Use **Connect → Demo vehicle** — a simulated car with two ECUs
  that answers real OBD-II commands.

## First run

1. **Tools → About** — note the version; quote it in every report.
2. **Connect → Demo vehicle** — confirm the dashboard, codes and live data load.
3. Grant the Bluetooth prompt when connecting a real adapter. Android 12+ asks
   for nearby devices; Android 11 and older may also ask for location because
   Bluetooth scanning required it there. The app does not read or store your
   position.
4. Try the app once with mobile data and Wi-Fi off, to confirm the installed
   version still opens.

## What to try

- **Read codes** on a real car: stored, pending and permanent codes, and whether
  the module attribution looks right.
- **Clear codes**, then re-scan. Do not do this on a car with an upcoming
  emissions test: clearing resets readiness monitors, which can fail the test
  until the car has been driven through its cycles.
- **Live data**: add or remove gauges, watch values update, export a CSV.
- **Repair assistant**: open a code you know and check the causes, steps, parts
  and cost band are plausible for your car.
- **Custom PIDs** (Tools): add a Mode 22 PID for a module you know.
- **Wi-Fi adapter**: connect through a bridge address if you have one.
- **Clear all app data** (Tools): confirm it wipes the profile and repair notes
  and leaves the app usable.
- **Adapters**: note the make and model of anything that pairs but does not
  produce data — that is the most valuable bug report of all.

Please test parked. Do not interact with the app while driving, and do not treat
its output as a substitute for a mechanic on brakes, steering, airbags or
anything safety-related.

## Reporting a problem

Email **lailaikings24@gmail.com** with the subject
`TorqueMedic test — <phone model>` and include:

1. **Version** from Tools → About, and whether it is the Play build, the debug
   APK or the browser version.
2. **Phone and Android version** (Settings → About phone).
3. **Adapter** make/model and link type (BLE, Classic or Wi-Fi).
4. **Steps**: what you tapped, what you expected, what happened.
5. **Screenshot** if the problem is visual.
6. **Adapter log** if it is a connection or data problem: Tools → Adapter
   traffic log → Export, then attach the file.

The adapter log can contain raw responses from your car, including the VIN.
Open it and remove the VIN and anything else you would rather not share before
sending.

Feature requests and "this wording confused me" notes are welcome too — say what
you were trying to do rather than only what you would change.

## What this test does not cover

- iOS: the iPhone app is not built yet. The browser version opens on iPhone,
  but Safari has no Web Bluetooth, so real Bluetooth adapters need the Android
  app.
- ABS, airbag, body and other manufacturer modules: generic OBD-II does not expose
  them. Use custom PIDs if you know the identifiers.
- Accounts, sync or cloud features: there are none. Diagnostics stay on the phone.
- Play billing, ads or subscriptions: none exist.

## Privacy and removing your data

No account is needed and nothing is uploaded. Uninstalling the app, or using
**Tools → Settings & data → Clear all app data**, removes what it stored. See the
privacy policy at
https://site-d29bccb8b69e4f628bad28288fc50584.freebuff.page/privacy.

## When the test ends

The developer will tell you when the 14 days are complete and production access
has been requested. Please keep the app installed and stay opted in until then —
opting out early removes your install from the count.
