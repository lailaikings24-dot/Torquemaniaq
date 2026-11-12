# Play Console — IARC content rating answers

Prepared 12 November 2026 against commit `186f985`. The questionnaire is served
by IARC inside Play Console; its wording changes from time to time, so treat the
answers below as the position to defend, not as a transcript.

## Before the questions

- **Path:** Play Console → Policy → App content → Content rating → Start.
- **Contact email:** use a mailbox you monitor. IARC correspondence (including
  the rating certificate) goes there. Use `lailaikings24@gmail.com`, the address
  on the policy page and in the app.
- **Category:** *Utility, Productivity, Communication or Other*. TorqueMedic is a
  diagnostic tool, not a game, and not reference/news/educational content.
- **Privacy policy:** https://site-d29bccb8b69e4f628bad28288fc50584.freebuff.page/privacy

## Answers

Every content question is **No**. The app displays OBD-II diagnostics and repair
guidance; it contains no narrative, media, social features or purchases.

| Section | Question | Answer |
| --- | --- | --- |
| Violence | Does the app contain violence, blood, gore or weapons? | No |
| Violence | Is violence depicted realistically, or against defenceless characters? | No |
| Sexuality | Does the app contain sexual content, nudity or suggestive themes? | No |
| Language | Does the app contain profanity, crude humour or sexual references? | No |
| Controlled substances | Does the app reference or depict drugs, alcohol or tobacco? | No |
| Gambling | Does the app contain gambling or simulated gambling? | No |
| Fear | Does the app contain horror themes or content that may frighten children? | No |
| Discrimination | Does the app contain discriminatory or hateful content? | No |
| User-generated content | Can users create, upload or share content with others? | No |
| Social features | Can users communicate or interact with each other? | No |
| Location | Does the app share the user's location with other users? | No |
| Web access | Does the app contain a browser or unrestricted web access? | No |
| Purchases | Does the app sell digital goods or take payments? | No |
| Advertising | Does the app contain ads? | No |
| Miscellaneous | Does the app promote illegal activity or self-harm? | No |
| Miscellaneous | Does the app contain political, religious or sensitive current-affairs content? | No |

If the form asks anything not listed, the answer follows from the same facts: no
content is authored for entertainment, nothing is shared between users, and no
money changes hands.

## Answers that need a reason, not just "No"

- **Web access — No.** The Android app is a WebView, but it only loads the
  bundled app and a WebSocket to the adapter address the user types. There is no
  address bar, no link following and no general-purpose browsing, so it is not
  "unrestricted web access".
- **User-generated content — No.** Repair notes, custom PIDs and logs are private
  to the device. Nothing is published, no profile exists and no other user can
  see them.
- **Shares location — No.** Bluetooth discovery needs location only on Android 11
  and older, and that permission is capped at `maxSdkVersion="30"`. No location
  is read, stored or sent.
- **Users interact — No.** A Bluetooth or Wi-Fi link runs between the phone and
  the user's own adapter. That is hardware, not another person.
- **Ads — No.** Nothing is served, sold or sponsored inside the app.
- **Airbag and high-voltage repair text.** The repair guide includes factory-style
  safety instructions ("disconnect the battery and wait before touching airbag
  circuits"). That is technical service information, not a depiction of violence,
  and does not change any answer above.

## Expected result

IARC issues a rating per territory from the same answers. With all content
questions negative and no interactive elements beyond local hardware, expect:

| Authority | Expected rating |
| --- | --- |
| IARC generic | 3+ |
| ESRB (North America) | Everyone |
| PEGI (Europe) | 3 |
| USK (Germany) | 0 |
| CERO (Japan) | A |
| ClassInd (Brazil) | Livre |
| GRAC (Korea) | All |

The certificate, not this table, is authoritative. If a rating comes back higher
than expected, re-read the answers before accepting it — a wrong "Yes" is the
usual cause.

## What requires a new questionnaire

Submit a new rating if any of these are added:

- ads, sponsorships or affiliate links;
- in-app purchases, subscriptions or donations;
- chat, comments, profiles, leaderboards or any shared content;
- a real browser, embedded videos or news feeds;
- AI chat or generated text/images;
- gambling, alcohol, tobacco or drug references in new content.

Google requires a new questionnaire whenever content or features change enough to
affect an answer; the existing rating can be removed if it no longer matches.
