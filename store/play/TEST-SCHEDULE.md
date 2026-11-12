# Closed-test schedule

A worked 14-day plan for the closed test that unlocks production access. The
dates assume testers start on **Monday 30 November 2026**; if that slips, move
every row by the same number of days.

The rule being scheduled: **at least 12 testers opted in continuously for the
preceding 14 days** when you apply. Each tester's clock starts at their own
opt-in, so the tracker matters more than the calendar.

## At a glance

| Offset | Example date | What happens |
| --- | --- | --- |
| D-14 | Mon 16 Nov | Prep: Console setup, closed release prepared, device check |
| D-10 | Fri 20 Nov | First invitations go out |
| D-7 | Mon 23 Nov | Roll out the closed track so review has a week |
| D-6 | Tue 24 Nov | Follow up with anyone who has not replied |
| D-5 | Wed 25 Nov | Tester list created; confirm Google accounts |
| D-3 | Fri 27 Nov | Confirm the track is available; copy the opt-in link |
| D-1 | Sun 29 Nov | "We start tomorrow" message; confirm 15 people ready |
| **D0** | **Mon 30 Nov** | Share the opt-in link; testers join and install |
| D+1 | Tue 01 Dec | Verify installs and versions; replace no-shows |
| D+3 | Thu 03 Dec | First engagement check; start the feedback log |
| D+7 | Mon 07 Dec | Mid-test reminder message |
| D+10 | Thu 10 Dec | Vitals review; ship any fix (does not reset opt-ins) |
| D+11 | Fri 11 Dec | Confirm 12+ still opted in; draft the application answers |
| D+14 | Mon 14 Dec | Eligibility window closes; check the Console |
| **D+15** | **Tue 15 Dec** | **Apply for production access** |
| D+15…D+22 | 15–22 Dec | Review, usually about a week; keep the track live |
| D+22 | Tue 22 Dec | Decision; start a staged production rollout |

D+15 rather than D+14 gives a one-day margin for late opt-ins. If the Console
shows the requirement is already met on D+14, apply then.

## Phase 1 — recruit (D-14 to D-3)

- Invite **18–20 people** to end up with 12+. A dropout only resets that
  tester's clock, but replacing them means waiting 14 days from the replacement's
  opt-in.
- Ask for the **Google account email** they use on Play, not a forwarding address.
- State the commitment in the invitation: install from Play, stay opted in for
  14 continuous days, open the app on several days.
- Use the invite and day-7 messages in [TESTER-GUIDE.md](TESTER-GUIDE.md).
- Send the first batch on D-10 and follow up on D-6. Avoid starting the test on a
  public holiday; the example starts after US Thanksgiving for that reason.
- Submit the closed track for review by D-7. First closed releases are reviewed,
  and this leaves a week of buffer before testers start.
- Create the tester email list on D-5 and paste the exact addresses. Ask each
  person to confirm the address before D0. The opt-in link may not appear until
  the review completes; confirm it on D-3.

## Phase 2 — run the test (D0 to D+14)

- Send the opt-in link on the morning of D0 and ask everyone to join and install
  the same day. Record each opt-in date as it happens.
- On D+1, check the Console tester count and ask anyone missing to install.
  Replace no-shows immediately so their 14 days still finish in time.
- On D+3, confirm people are opening the app on more than one day. A silent,
  never-opened install weakens the application even if it counts toward 12.
- On D+7, send the reminder from the tester guide. Do not add pressure; restate
  that leaving early resets their clock.
- On D+10, review Android vitals. You can ship updates during the test without
  resetting opt-ins; bump `versionCode` for each upload.
- On D+11, count again. If fewer than 12 have been continuously opted in, the
  application date moves; work out the new earliest date from the 12th-oldest
  active opt-in.
- Keep the track, the tester list and the rollout live until the decision. Do not
  pause the track or remove testers after applying.

## Tracker

Use [closed-test-tracker.csv](closed-test-tracker.csv) — open it in Sheets or
Excel and add one row per tester. Fill it on the day, not from memory.

Use ISO dates (`YYYY-MM-DD`). Status values: `Invited`, `Opted in`, `Active`,
`Dropped`, `Replaced`. `eligible_from` is that tester's `opt_in_date` plus 14
days; the application date is the latest `eligible_from` among the 12 oldest
still-active testers.

## Phase 3 — apply and after

1. On D+14, open Play Console → Dashboard. If the requirement is met, **Apply for
   production**. Otherwise wait a day and re-check.
2. Answer the three sections using [PRODUCTION-ACCESS.md](PRODUCTION-ACCESS.md)
   and the tracker: real tester counts, repeat use, feedback, fixes, device
   coverage and vitals.
3. Review usually takes about a week, sometimes longer. Keep the closed test
   running throughout.
4. If refused, the email names the unmet criterion. Fix that specific issue,
   keep the same track, and reapply after the additional testing it asks for.
5. On approval, roll out to production at a staged percentage and watch vitals.

A decision around 22 December lands just before the holidays. If review slips,
keep the track live and let the testers know; do not unpublish or pause it while
waiting.

## Slip rules

- **Track not live by D-3?** Shift D0 and all following rows; recruitment can
  continue, but do not promise a start date until the opt-in link works.
- **A tester opts out on D+9?** Their replacement cannot finish 14 days before
  D+15. Either extend the schedule or apply with a larger buffer of testers who
  opted in on D0.
- **Internal testers want to join?** They must leave the internal track before
  opting into closed testing.
- **Fewer than 12 installed by D+2?** Recruit more immediately; the buffer is
  there for exactly this.
