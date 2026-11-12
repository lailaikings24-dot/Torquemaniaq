# Play Console answer sheet

One pass through **App content** and the store settings for TorqueMedic 1.0.0
(`com.torquemedic.app`, versionCode 2). Every answer reflects the app as built.
If a feature adds accounts, analytics, ads, cloud sync or new permissions,
re-check this sheet before the next release.

Detailed reasoning lives in [DATA-SAFETY.md](DATA-SAFETY.md),
[CONTENT-RATING.md](CONTENT-RATING.md) and [STORE-LISTING.md](STORE-LISTING.md).

## Values used throughout

| Field | Value |
| --- | --- |
| App name (record and listing) | `TorqueMedic: OBD2 Scanner` (25 characters) |
| Package | `com.torquemedic.app` |
| Contact email | `lailaikings24@gmail.com` |
| Website | https://site-d29bccb8b69e4f628bad28288fc50584.freebuff.page |
| Privacy policy | https://site-d29bccb8b69e4f628bad28288fc50584.freebuff.page/privacy |
| Category | Auto & Vehicles |
| Price | Free |
| Contains ads | No |
| In-app purchases | No |

> Double-check the package against `android/app/build.gradle` (`applicationId`)
> before the first upload — it cannot be changed afterwards.

## 1. App access

Choose **All functionality is available without special access**.

Copy-paste reviewer instructions:

```text
TorqueMedic has no accounts, login or paywall. Every screen is available on first
launch. No test credentials are required.

To try the diagnostic flow without a vehicle or an OBD-II adapter, open Connect
and choose "Demo vehicle". It simulates two ECUs and covers reading codes, live
data and repair guidance. A Bluetooth LE, Bluetooth Classic or Wi-Fi ELM327
adapter is optional and only needed for data from a real car.
```

## 2. Ads

**Does your app contain ads? → No.**

There are no ad SDKs, no sponsored content and no advertising ID permission.

## 3. Content rating

Path: **Policy → App content → Content rating → Start**.

- **Category:** Utility, Productivity, Communication or Other
- **Contact email:** `lailaikings24@gmail.com`
- **Privacy policy:** the URL above

Every content question is **No**:

| Section | Question | Answer |
| --- | --- | --- |
| Violence | Violence, blood, gore or weapons | No |
| Violence | Realistic violence or violence against defenceless characters | No |
| Sexuality | Sexual content, nudity or suggestive themes | No |
| Language | Profanity, crude humour or sexual references | No |
| Controlled substances | Drugs, alcohol or tobacco | No |
| Gambling | Gambling or simulated gambling | No |
| Fear | Horror themes or content that may frighten children | No |
| Discrimination | Discriminatory or hateful content | No |
| User-generated content | Users can create, upload or share content | No |
| Social features | Users can communicate or interact | No |
| Location | Shares the user's location with other users | No |
| Web access | Browser or unrestricted web access | No |
| Purchases | Sells digital goods or takes payments | No |
| Advertising | Contains ads | No |
| Miscellaneous | Promotes illegal activity or self-harm | No |
| Miscellaneous | Political, religious or sensitive current-affairs content | No |

Reasons worth having ready if asked:

- **Web access — No.** The Android app is a WebView for the bundled app; it has
  no address bar, link following or general browsing. It opens a WebSocket only
  to the adapter address the user types.
- **User-generated content — No.** Repair notes and custom PIDs stay in private
  app storage; nothing is published and there are no profiles.
- **Location — No.** Bluetooth discovery required a location permission on
  Android 11 and older, capped at API 30. The app never reads, stores or sends a
  position.

Expected result: IARC 3+, ESRB Everyone, PEGI 3. The certificate is
authoritative; a higher rating usually means a question was answered wrongly.

## 4. Target audience and content

Recommended selection:

- **Age groups:** 13–15, 16–17, 18 and over. Leave **Under 13** unchecked.
- **Is the app designed for children?** No.
- **Could it appeal to children?** No — it is a diagnostic tool with repair
  instructions, not child-directed content.
- **Families programme:** do not opt in.

If you prefer the simplest review path, 18+ only is also defensible. Do not
include under-13: that pulls the app into the Families policy and additional
content requirements.

The content rating (3+) describes suitability, not the intended audience; a 13+
target with a 3+ content rating is normal for a utility.

## 5. Data safety

Path: **Policy → App content → Data safety**.

| Question | Answer |
| --- | --- |
| Does your app collect or share any required user data types? | **No** |
| Is all collected data encrypted in transit? | Not shown after "No"; no data is collected |
| Can users request deletion? | Not shown after "No". In practice: Tools → Settings & data → Clear all app data, or uninstall. No server copy exists |
| Independently validated against a security standard? | **No** |
| Data collected by third-party SDKs | **None** — no analytics, ads or crash-reporting SDKs |

The console should summarise the app as *No data collected* and *No data shared*.

Why "No" is correct:

- Vehicle data, codes, VIN and sensor values are read from the user's adapter,
  shown on screen and held in memory. Repair notes the user writes are stored
  locally. Nothing is transmitted to the developer or a third party.
- Wi-Fi traffic goes directly from the phone to the adapter address the user
  enters.
- CSV and report exports happen only on an explicit tap, to a destination the
  user chooses.
- There is no account, backend, sync, ads, analytics or crash reporting.

## 6. Privacy policy

Use the URL above. It is live, lists `lailaikings24@gmail.com` as the contact and
says no data is collected. The same address appears in the app under
**Tools → About → Support**.

## 7. Permissions and declarations

| Declaration | Answer |
| --- | --- |
| Bluetooth scan/connect is core functionality | Yes — used to talk to OBD-II adapters |
| Background location | No |
| `MANAGE_EXTERNAL_STORAGE` | No |
| SMS or call-log access | No |
| All-files access | No |
| Government app | No |
| Financial features | None |
| Health features | None |
| News app | No |
| COVID-19 contact tracing | No |
| Advertising ID | No |
| User-generated content / social features | No |
| In-app purchases or subscriptions | No |

`BLUETOOTH_SCAN` carries `neverForLocation`; `ACCESS_FINE_LOCATION` is capped at
`maxSdkVersion="30"` for legacy discovery only. No other runtime permission is
requested.

## 8. Store listing settings

| Field | Value |
| --- | --- |
| App name | `TorqueMedic: OBD2 Scanner` (25 characters) |
| Short description | `Read OBD-II codes, watch live data, and follow guided repairs.` (62) |
| Full description | paste from [STORE-LISTING.md](STORE-LISTING.md) (2,013 characters) |
| Category | Auto & Vehicles |
| Tags | OBD2, car scanner, diagnostics, ELM327, repair |
| Contact email | `lailaikings24@gmail.com` |
| Website | the `freebuff.page` URL until `www.torquemaniaq.com` verifies |
| Privacy policy | the `/privacy` URL |

Upload the five 1080×1920 screenshots, the 512×512 icon and the 1024×500 feature
graphic from `store/play/`. Pricing is free; select the countries you can support
before the closed test.

## 9. What forces a re-check

Update this sheet and the Data safety answers before shipping:

- analytics, crash reporting, remote logging or A/B testing;
- ads or attribution SDKs;
- accounts, cloud sync, backups or any backend receiving vehicle data;
- Play Billing or purchase history;
- a "send diagnostics to support" feature;
- new permissions, especially background location or storage.

A new content questionnaire is required for ads, purchases, chat/profiles, a real
browser, embedded media, AI-generated content, gambling or substance references.
