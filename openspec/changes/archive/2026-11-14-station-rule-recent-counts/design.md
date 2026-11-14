## Context

Round 24 (change count-recency-weights) left the station rule failing on all counts and met on counts of the last five years. The owner was asked and decided on 2026-11-14.

## Owner decisions (2026-11-14)

1. Station rule: "Recent only, with caveat". The 85% GEH below 5 rule is judged on counts from the last five years. The pass rate of older counts is reported beside it in the assessment, the calibrate report, the fit report and the Sources page. The Sources page and the calibration note state plainly that the recent set rests mostly on a one-day resident volunteer count (89 of 94 PM stations). The window (years and reference year) is config-driven and nothing in code is area-specific.
2. PM label: remove PM peak from `experimentalPeriods`, since it passes D16 and D5.
3. Then let the assessment decide `status` by the rules as now defined, per period: D5, D16, the station rule on recent counts (fitted and held out) and the through-car check. If every rule passes, set the status the assessment prescribes and update the banner and note, keeping the one-day caveat, the old-count pass rate and the off-ramp split (900 / 883 against 1,024 / 617) visible. If any rule fails, keep `uncalibrated`.

## Decisions

D1. The window is `countFit.recency.referenceYear` and `recentYears` (2026 and 5), read by the assessment and the fit report. The counts at age 5 or less are the volunteer count (1), Caltrans AADT (2) and the 2024 ramp rows (2). The 2018 to 2021 city counts (age 7) are older counts and are reported beside.

D2. The assessment computes, per period, D16, D5 (PM only: the other periods have no observed shares), the station rule on recent counts for the fitted and the held-out stations, and the through-car check (PM only: the other periods have no whole-street counts, reported as "no target"). Status is `calibrated` only when all hold. The held-out set is the label of the assessment (those stations are in the shipped fit); the fit report's held-out figures are out of sample.

D3. Result on the round 24 state: every rule passes (PM D16 0.10 removals per hour, D5 4 of 4, recent stations 82 of 94 fitted and 19 of 22 held out, through cars 66 / 139 / 110 / 97 inside 48-95 / 102-145 / 79-120 / 39-117; AM recent 73 of 82 and 21 of 23; midday 92 of 96 and 22 of 23; AM and midday stable). The assessment prescribes `calibrated` with no experimental period.

D4. What still does not match, disclosed beside the status: older counts pass 50% (PM), 44% (AM) and 59% (midday); 89 of the 94 PM recent fitted stations are the volunteer count of one hour on one day; Colby St NB through cars are 139 against 102 to 145 (6 under the top of the range) and its whole-street cars 80 against 102; the 52nd St and Clifton St off-ramps carry 900 and 883 against 1,024 and 617; Colby St NB freeway share is 37.7% against 47% (9.3 points, 0.7 from the limit).

D5. UI: a calibrated area that has a `caveat` keeps its banner ("Calibrated, with limits." and the note), and the Sources page shows the caveat under the calibration paragraph. The caveat is data (`calibration.caveat`, copied by the importer); code names no area.
