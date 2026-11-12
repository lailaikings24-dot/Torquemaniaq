# Play Console — Data safety answers

Prepared 12 November 2026 against the current app (commit `5fd317b`). Re-check
this page whenever a dependency, SDK or feature that moves data is added.

Privacy policy URL:
https://site-d29bccb8b69e4f628bad28288fc50584.freebuff.page/privacy

## The short answer

**Does your app collect or share any of the required user data types? → No.**

Every data safety section that asks for data types, purposes, retention or
encryption is then skipped. The console will summarise the app as
*No data collected* and *No data shared*.

This is not a shortcut: Google defines collection as transmitting data off the
device. TorqueMedic transmits nothing to the developer or to any third party.
See <https://support.google.com/googleplay/android-developer/answer/10787469>.

## Questions the console asks, in order

| Question | Answer |
| --- | --- |
| Does your app collect or share any of the required user data types? | **No** |
| Is all of the user data collected by your app encrypted in transit? | Not shown after "No"; if it appears, there is no collected data to encrypt |
| Do you provide a way for users to request deletion of their data? | Not shown after "No". In practice: **Tools → Settings & data → Clear all app data**, or uninstall the app |
| Has your app been independently validated against a global security standard? | **No** |
| Data collected by third-party SDKs | None — there are no third-party runtime SDKs |

## Why each data type is "not collected"

| What the app touches | Where it goes | Why it is not collection |
| --- | --- | --- |
| Trouble codes, freeze frames, monitors, sensor values, VIN, calibration IDs | Read from the adapter the user paired, shown on screen, optionally saved in the app's private storage | Never leaves the device except to the user's own adapter; no developer server exists |
| Vehicle profile, custom PIDs, repair notes, unit preference | `localStorage` under `torquemedic:` keys (`customPids`, `repairs`, `livePids`, `imperial`) | On-device storage only; no sync, no account, no backup to us |
| Adapter traffic log | In-memory for the session | Not persisted, never uploaded |
| CSV / report / log exports | Created only on an explicit tap, handed to the browser download or Android share sheet | Destination is chosen by the user; the app does not send it anywhere |
| Wi-Fi bridge address and traffic | Direct WebSocket from the phone to the address the user types (their own adapter or bridge) | Device-to-device on the user's network; not routed through us |
| Bluetooth scan results | Android Bluetooth stack, filtered to OBD adapters | The adapter is the user's hardware, not a third-party data recipient |

## Related declarations (not part of Data safety, but asked nearby)

- **App access:** all functionality is available without an account or login.
  Demo mode covers evaluation without an adapter.
- **Ads:** the app contains no ads.
- **Permissions:** `BLUETOOTH_SCAN` (with `neverForLocation`) and
  `BLUETOOTH_CONNECT` on Android 12+; legacy `BLUETOOTH`/`BLUETOOTH_ADMIN` only
  up to Android 11; `ACCESS_FINE_LOCATION` capped at `maxSdkVersion="30"` for
  legacy discovery only. No background location, no all-files access, no SMS or
  call-log permissions.
- **Target audience:** not directed at children; do not opt into Families.
- **Content rating:** complete the IARC questionnaire as a utility/tool with no
  user-generated content, violence, gambling or purchases.

## What would force this answer to change

Update Data safety **before** shipping any of these:

- analytics, crash reporting, remote logging or A/B testing SDKs;
- ads or attribution SDKs;
- accounts, cloud sync, backups, or a backend that receives vehicle data;
- Google Play Billing or any purchase history;
- push notifications through a third-party service that receives a device token;
- a "send diagnostics to support" feature.

Any of those makes the answer **Yes**, and each one brings its own data types,
purposes, optionality and deletion rules.

## Where the claims come from

- Outbound network calls in `src/`: only `new WebSocket(...)` to the
  user-supplied adapter URL (`src/lib/transport.ts`, `src/lib/service.ts`).
  No `fetch`, `sendBeacon` or hard-coded http(s) endpoints.
- Runtime dependencies: React, React DOM, Zustand and three Capacitor packages —
  no analytics, ads or networking SDKs.
- Android manifest: the permission set listed above; the native plugin makes no
  HTTP calls.
- Persistence: only the four `save(...)` keys listed above (`src/state/store.ts`).
