## Why

An independent review of round 25 confirmed problems in the demand and in the checks that decide the calibration status, each reproduced with the real data:

- The "held out" station rule that gates `calibrated` was measured in sample. The shipped demand is fitted with every station, so the validation stations passed (19 of 22 recent ones) by construction.
- Every midday target is the PM count times 0.62, yet the midday station rule gated `calibrated` and the caveat quoted midday pass rates as if they came from counts.
- The AM local trip rates counted five Telegraph Ave entries that were not counted in the AM as zero, so AM local trips were 25 to 30% low and the AM through share was inflated.
- Plain flows of other pairs that make a counted turn kept at least 0.1 of their volume on top of the pinned assumed flows, so the turn was overshot (Hillegass Ave northbound left: count 43, fit 60, simulator 56).
- Chained freeway links counted as separate off-ramps, and an assessment of the cross-validation demand ran a different model (no ramp split, no intent annotation).
- Local intent flows had the other street's turn as an alternative, so a scenario could move a Colby St resident's trip to Hillegass Ave.
- Smaller items: hard-coded observed values in two report tools, a through-car check that passed with no data, a recency summary that printed the wrong weight, turns counted below the fit minimum shown as "not counted", stale config keys and text.

## What changes

- `tools/assess.ts` scores the held-out stations on the cross-validation demand with the same seeds; the status gate uses that out-of-sample figure and says "too few to judge" instead of passing when fewer than 10 recent held-out stations exist. The in-sample figure stays, labeled.
- Stations carry `derived` periods; the station rule leaves them out; midday is judged on stability only.
- `--demand` and `--reuse` need `--suffix`; no through-car rows is a failure.
- The cross-validation demand gets the ramp split and the intent annotation.
- AM trip-end scaling fills entries and exits that were not counted in a period from the other period (ASSUMPTION).
- Plain flows that make a counted turn on their best route give up volume until the turn carries no more than its count (ASSUMPTION, `naturalDetour`).
- Off-ramps: links starting at a surface node and ramps chained on one path are not separate ramps.
- Alternatives only for through flows; Hillegass Ave and Colby St intent notes agree with the numbers they apply to.
- Movements counted below the fit minimum are shown as counted, with the reason.
- Config and text cleanup; atomic result files; the R2 sync follows no symlinks.

Nothing here tunes toward a verdict. The status is whatever the corrected rules say.
