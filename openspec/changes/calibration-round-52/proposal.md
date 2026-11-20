## Why

Round 51 passed the keep rule on seeds 1 to 10 and failed the fresh-seed confirmation on one line: PM Colby Street southbound whole-street traversal, 78 cars an hour against 39 counted (GEH 5.0; the baseline is 58 on the same seeds). The project lead decided on 2026-11-19 not to adopt it and to work next on getting the counted whole-street traversals right on top of round 51.

The question card said the whole-street counts would be "added as fit targets" and would "stop being an independent check". That premise was wrong, and the lead told the project lead so in the same conversation. The four volunteer-count route stations (`count route 2591>2605`, `2606>2592`, `2676>2670`, `2669>2675` in `data/demand/rockridge.stations.json`) are already fit targets: a `kind: 'path'` feature, weight `routeWeight` 1.0 (`tools/lib/volunteer-count.ts`, config `volunteerCount.routeWeight`), fitted in the shipped view and in the published model. The frozen split withholds all four from the training view. In rounds 48 to 51 they also took simulated membership.

What the round 51 fit does with them: it ends at 67 cars an hour for PM Colby Street SB against 39 counted (ratio 1.72, outside its tolerance), while the seven counted Colby Street SB blocks want 139 to 170 and end at 106 to 132 (ratios 0.66 to 0.81). A flow that drives the whole street touches seven block stations that are low and one route station that is high, at equal weights, so the blocks win. The counts say most cars on Colby Street SB use part of the street (about 160 per block, 39 end to end). The model fills the blocks with end-to-end cars.

A read-only breakdown from the laptop (2026-11-19) of the round 51 PM shipped candidate shows what the fit has to work with, and why a weight alone will not do. About 64 of each block's 101 to 126 cars an hour are whole-street trips. Whole-street trips come from pairs whose simulated route membership is fractional. The largest pure partial-use pairs start on Colby Street itself. The model lacks trips that begin or end along the street, and the node ceilings of rounds 50 and 51 stop the fit from adding trip ends inside the study area (non-gate origins inside fell 951 to 727 in round 51 PM shipped).

## What changes

- A sub-switch `routeWeightPerBlock` of the candidate's `simulatedMembership` entry. When present, a route station that takes simulated membership in a period weighs `routeWeight` times the number of block stations of the same count on the route's links that are fitted with a target in that period and view. Static membership keeps `routeWeight`. The fit report gives the weight of every route station and period.
- A ceiling scope `outsideStudyArea` for `gatePriorTotals`: ceilings on gate directions and on non-gate nodes outside the study area (the network's `inStudyArea` flag), none on non-gate nodes inside it. The fit may then add trip ends along the counted streets. The 3% abort above the static fit stays as the guard on total volume. The fit report counts the inside nodes that grew.
- One candidate, `route-weight`: round 51's entries with `scope` `outsideStudyArea` and `routeWeightPerBlock` true. The loop, the three-seed screen, ten seeds if the screen passes, then automatically seeds 11 to 20 with the baseline.
- The keep rule and the screen are unchanged. The low-demand line is a reported figure, no longer a stop.
- A runbook for the laptop.
- No simulator, network or split change, and no edit to `calibrate.rs`.

## Impact

Tools only. Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9, network 53c823f20d9165ed. With the entries absent the shipped demand stays 9cdebdabf05c4460 and the training demand 2f9ae152b9bbf78e. With the candidate entry the config hash changes, and the demand periods stay the baseline's until a membership file is in use. If the candidate is adopted, the published proposals, results and redistribution files need a new search. If it fails the keep rule or the confirmation, nothing published changes. Adoption is the project lead's decision.
