## Context

Round 28 is the first calibration round on the engine of expose-junction-fallback-validity, repair-local-trip-measurement-integrity and repair-signal-timing-contracts. The order of `data/calibration/rockridge.record.md` applies: validate the simulator's primitives, then tune demand. The results and every number below are in round 28 of the record; this file records the decisions.

## Decisions

D1. Primitives before demand. Each validation case that failed or moved was traced by switching the parts of the new junction policy back to their old form one at a time and by rerunning over five seeds. Two rules were wrong and were repaired in the engine (D11 and D12 of expose-junction-fallback-validity, with D13 adding the lane-drop case i5). Physical exclusion was kept; no non-physical storage in nodes was restored. The cases that still fail (a3, e2, e3, f2, f3, j6, j8, j9, j12) are reviewed in `data/calibration/validation.deviations.json`. Review of f2 and f3 found that the Harmon St traffic circles cause about a fifth of the PM removals and two fifths of the AM removals, so the circle entry rule is named as a repair needed before D16 can pass.

D2. Recovery figures in the reports. The seed report of `calibrate` gains a junction recovery section (policy, node entries, admissions per hour and per 1,000 entries by reason, head-seconds, held-vehicle removals, and the nodes with the most of them), the seed JSON carries `junctionRecovery`, the multi-seed summary carries admissions and held removals per hour, and the assessment states them in its stability paragraph [FHWA-TAT3-2019; TfL-TMG4].

D3. Turning-count legs counted in the PM only (user decision, 2026-11-15). The Oakland turning-movement counts give one PM hour; their AM and midday leg targets are that count times the period factors. They are scaled copies and are marked `derived` for those periods, like the ADT-based, gate and ramp stations. The 16 stations are from 2013 to 2019, so the recent-count rule does not change.

D4. Demand tuning levers and what they were judged on. Only levers that the training view also gets were tried, and they were judged on fitted stations, headline shares, through cars and removals over PM seeds 1 to 4; the held-out stations were not consulted. Measured simulator delays fed back into the fit (`tools/cost-loop.ts`, the method of [PowellSheffi1982] that the baseline-calibration design D18 names) and the trip-rate factor of the neighbor blocks across Alcatraz Ave (`local.countCalibration.neighborScale`, an ASSUMPTION of round 20) were tried. The cost loop's acceptance rule also reads the held-out GEH column on the shipped demand; it rejected both iterations on removals, so that column decided nothing.

D5. No variant is kept. The delay feedback is the only lever that moves the southbound through cars much, and after two iterations they stay above their ranges while removals rise from 4 to 7 to 10 an hour and the Colby St northbound share leaves the 10-point band. The neighbor-block factor fixes Colby St northbound and the headline shares but leaves the southbound blocks near 180 and 200 and doubles to quadruples the removals. Following the instruction to stop when the through-car ranges cannot be met without breaking another rule, the shipped demand stays as built (83bdd362657a) and the trade-off is reported. Keeping the delay feedback would also need delays measured on the cross-validation demand for its training view, since delays from the shipped demand carry the held-out counts into the training fit.

D6. Verdict. Status stays `uncalibrated` with no experimental period: D16 fails in the AM and PM peaks, D5 and the through-car check fail in the PM peak, and the station rule fails in the PM peak and, out of sample, in the AM peak. The area's `calibration` note and caveat say so with the round's numbers.

## Risks

- The southbound excess comes from route choice under congestion in the simulator (diversion off Telegraph Ave and College Ave, and an adaptive signal at College Ave / Claremont Ave / 62nd St that sizes the 62nd St phase from diverted traffic). A repair there changes model behavior and needs its own change and citations.
- Stored proposal results, text pages and previews were made on the old engine and are stale until the user regenerates them.
