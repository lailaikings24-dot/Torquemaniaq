# Production access application — draft answers

Play Console → **Dashboard → Apply for production**. The form has three sections:
*About your closed test*, *About your app/game* and *About your production
readiness*. Review usually takes about a week.

These are drafts, not testimony. Text in `[square brackets]` is a placeholder for
something only your test can produce: tester numbers, device names, feedback and
fixes. Replace every one before submitting. Reviewers can see your track, tester
list and Android vitals, so invented numbers or feedback are the fastest way to
be sent back for more testing.

## Before you apply

- [ ] At least 12 testers opted in **continuously** for the preceding 14 days,
      and the track is still live.
- [ ] Each tester actually installed from Play and opened the app on more than
      one day.
- [ ] You shipped at least one build during the test if feedback called for it.
- [ ] Android vitals checked for crashes and ANRs in the final week.
- [ ] Store listing, Data safety, content rating and privacy policy complete.
- [ ] `privacy@torquemaniaq.com` is monitored — it is the support address in the
      listing and the app.
- [ ] Keep the closed track and tester list in place until the decision arrives.

## Keep a feedback log from day one

The form asks what testers said and how you collected it. Reconstructing this on
day 15 produces vague answers, which is the most common reason applications are
refused. Keep a running table:

| Date | Tester | Device / Android | Adapter | What they tried | Feedback | Action / version |
| ---- | ------ | ---------------- | ------- | --------------- | -------- | ---------------- |
|      |        |                  |         |                 |          |                  |

Play's **Monitor and improve → Ratings and reviews → Testing feedback** page
collects private feedback separately; check it weekly and copy anything useful
into the table.

## Section A — About your closed test

### How did you recruit users for your closed test?

Name the real channels. Friends-and-family and paid testing services are both
acceptable answers; what matters is that the testers were real people who used
the app.

> I recruited through [personal contacts and a car-enthusiast community]. I
> invited [17] people to leave room for dropouts, and [14] stayed opted in for
> the full 14 days. Most were [DIY car owners who already own an ELM327
> adapter]; a few tested only the demo vehicle because they do not have one.

### How easy was it to recruit testers for your app?

A five-point scale from very difficult to very easy. Pick what actually happened;
there is no advantage to claiming it was easy. Most indie developers answer
*difficult* or *neither difficult nor easy*, and that is fine.

### Describe the engagement you received from testers

This is where weak applications fail. Be specific about repeat use, features and
stability.

> [11] of [14] testers opened the app on more than one day, and [6] used it on
> three or more separate days. Most tried [the demo vehicle, reading and clearing
> codes, and live data]; [4] connected a real adapter ([2] Bluetooth LE, [1]
> Bluetooth Classic, [1] Wi-Fi). Android vitals showed no crashes or ANRs in the
> final week across [N] sessions.

If vitals did show crashes, give the count and what you fixed instead of claiming
a clean week. If testers installed once and never returned, fix that before
applying rather than describing it as engagement.

### Summarise the feedback you received, including how you collected it

Three to five concrete points, good and bad, and the channel. "All positive, no
issues" from twelve people reads as a test that did not happen.

> I collected feedback by email to [privacy@torquemaniaq.com], through Play's
> private testing feedback, and from adapter logs testers exported from the app.
> The main points were:
>
> - [Two testers found the connection screen confusing when more than one
>   adapter was paired; I added the adapter name to each row.]
> - [One tester's Bluetooth Classic adapter connected but returned no data; the
>   exported log showed the initialization sequence timing out.]
> - [Three testers asked for the last scan to survive closing the app.]
> - [Several said the plain-language repair guidance was the reason they would
>   keep it installed.]
> - [No crashes were reported, and vitals showed none.]

## Section B — About your app/game

These answers describe the product, so most of this text can be final now.

### Who is the intended audience of your app?

> DIY car owners and enthusiasts who service their own vehicles, plus apprentices
> and independent mechanics who want a quick second opinion. They drive cars built
> since OBD-II became mandatory (1996 in the US, 2001 for EU petrol, 2004 for EU
> diesel) and typically own a low-cost ELM327 adapter. The app is Android-only and
> requires Android 6.0 or newer.

### Describe how your app provides value to users

> TorqueMedic turns a cheap OBD-II adapter into a readable diagnosis. It reads and
> clears emissions-related trouble codes, explains what each code means and what
> commonly causes it, shows live sensor data, and lets you watch or log specific
> PIDs. Everything runs on the phone: no account, no cloud and no ads, so the VIN
> and driving data never leave the car and the app still works in a garage with no
> signal. A built-in demo vehicle lets people try the whole workflow before they
> buy an adapter.

### How many installs do you expect?

Give an honest, modest range. Inflating it does not help and invites questions.

> I expect [1,000–5,000] installs in the first year, well under 10,000. This is a
> niche utility with no marketing budget; installs will come from car forums, word
> of mouth and the store listing itself, mostly in [the US and Europe].

## Section C — About your production readiness

### What changes did you make based on what you learned during the closed test?

At least one concrete change, tied to feedback, with a version number. If the
test genuinely found nothing, say what you verified instead of leaving it blank —
but a test that changed nothing is a weak story.

> Based on tester feedback I shipped [version 1.0.x] (versionCode [N]):
>
> - [Added the adapter name to each row on the connection screen after two
>   testers picked the wrong device.]
> - [Increased the initialization timeout for Bluetooth Classic adapters after
>   one adapter returned no data.]
> - [Persisted the last scan result so it survives the app being closed.]
>
> [If nothing changed: testers reported no blocking defects, so the release build
> was unchanged. I re-ran the full flow checklist on [devices] and confirmed
> [results].]

### How did you decide that your app is ready for production?

Evidence, not adjectives: devices, Android versions, flows and stability.

> [14] testers ran the app on [12] devices across Android [6] to [16], including
> [Pixel 7, Galaxy S22, Moto G Power]. Between them they exercised [demo mode,
> Bluetooth LE, Bluetooth Classic and Wi-Fi connections, reading and clearing
> codes, live data, the repair assistant, custom PIDs, CSV export and clear all
> data]. Android vitals showed no crashes or ANRs during the final week. The store
> listing, Data safety form, content rating and privacy policy are complete, and
> support mail to [privacy@torquemaniaq.com] is answered.

If vitals recorded crashes, state the number and the fix instead of the clean-week
sentence.

## Things that get applications refused

- One-line answers, or text that reads like a template.
- Numbers that do not match the tester list or vitals.
- Claiming real-car or multi-device testing that did not happen.
- Removing testers, or pausing the track, before the decision.
- Applying with fewer than 12 testers still opted in.
- Leaving the store listing or policy declarations incomplete.

## After you apply

Keep the closed test running until you hear back. If the application is refused,
the email names the criterion that was not met — usually tester count, engagement
or feedback quality. Fix that specific thing, keep the same track live, and
reapply rather than starting a new test.
