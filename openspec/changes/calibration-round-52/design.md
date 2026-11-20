## Context

Baseline for this round: the published model of 2026-11-18, unchanged by rounds 44 to 51. Network 53c823f20d9165ed, demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9. Ten seeds per period: PM fitted 74 of 92 recent stations within GEH 5, PM held out 14 of 24, AM fitted 70 of 77, AM held out 14 of 19, D5 4 of 4, whole-street traversals 8 of 8, D16 holds, validation 67 of 74.

Round 51 (route shares on simulated membership, node ceilings on every node) passed the keep rule on seeds 1 to 10 (82, 14, 74, 15, D5 4 of 4, whole-street 8 of 8, D16 holds, validation 67 of 74) and failed the fresh-seed confirmation on seeds 11 to 20 on one line: whole-street traversals 7 of 8 against the baseline's 8 of 8, PM Colby Street SB 78 cars an hour against 39 counted (GEH 5.0; the baseline is 58 on those seeds). The project lead decided on 2026-11-19 not to adopt it and to work next on the counted whole-street traversals.

What the code does with the whole-street counts, checked in this round:

- The eight whole-street counts are already fit targets. Four are volunteer-count route stations (`count route 2591>2605`, `2606>2592`, `2676>2670`, `2669>2675`) with a `kind: 'path'` feature, weight `routeWeight` 1.0 (`tools/lib/volunteer-count.ts`, config `volunteerCount.routeWeight`), fitted in the shipped view. The frozen split withholds all four from the training view.
- In rounds 48 to 51 they also took simulated membership (`wanted === 'all'` in `fitPeriod`: every fitted station with pairs in the file).
- Round 51's own fit ends at 67 cars an hour for PM Colby Street SB against 39 (ratio 1.72, outside its tolerance). The seven counted Colby Street SB blocks want 139 to 170 and end at 106 to 132 (ratios 0.66 to 0.81). In the fit's update a flow that drives the whole street touches seven block stations that are low and one route station that is high, at equal weights, so the blocks win. The counts together say most cars on Colby Street SB use part of the street (about 160 per block, 39 end to end), and the model fills the blocks with end-to-end cars.

Laptop breakdown, read-only, 2026-11-19 (round 51 PM shipped candidate, Colby Street SB, reported by the lead before any round 52 run): about 64 of each block's 101 to 126 cars an hour are whole-street trips. Pairs with any whole-street hit carry 82 to 94 per block and pairs with none only 16 to 35. Whole-street trips come from pairs whose simulated route membership is fractional: 2.3 cars an hour on pairs at 0.5 or more, 31.7 at 0.2 to 0.5, 16.5 at 0.05 to 0.2 and 13.3 under 0.05; by type 31.4 ramp, 29.9 local, 2.4 through; 15.0 of the 63.7 are pinned via-flows the fit cannot change. The largest pure partial-use pairs start on Colby Street itself (node 819 North St/Colby to node 276: 14.8 veh/h; node 799 60th St/Colby to node 973: 7.1). So a route weight alone can only cut the blocks further. The model lacks trips that begin or end along the street (the count's `endAlongVehPerHour`), and round 50 and 51's node ceilings stop the fit from adding trip ends inside the study area (non-gate origins inside fell 951 to 727 in round 51 PM shipped). The question whether the fit's own flows are bounded per pair could not be answered from that breakdown: it needs a dump of the flows before the fit, which the loop does not write.

## Decisions

D0 to D8 are the lead's, written before any run on 2026-11-19 and 2026-11-20 (D8 and the revision of D3 on 2026-11-20 after the breakdown above). Preparation choices follow as P1 to P5 and are marked as such.

D0. (Project lead decision, 2026-11-19, question card.) Round 51 is not adopted; the next round is about getting the counted whole-street traversals right on top of round 51. The card's wording said the whole-street counts would be "added as fit targets" and would "stop being an independent check". That premise was wrong: they already are fit targets, in the published model too. The lead told the project lead so in the same conversation, and this design is the corrected reading. The record entry of round 51 carries a dated correction.

D1. (Lead.) No simulator change. Fingerprint d45a275dd7be0713cec6a64394b7d8a9. Baseline network 53c823f20d9165ed, demand 9cdebdabf05c4460, training 2f9ae152b9bbf78e.

D2. (Lead.) New sub-switch of the candidate's `simulatedMembership` entry, `"routeWeightPerBlock": true` (absent = round 51 behavior, existing tests untouched). When present, a volunteer-count route station that takes simulated membership in the period has the weight `routeWeight` times the number of block stations of the same count, on links of the route, that are in the fit with a target in that period and view. ASSUMPTION: the traversal count is one observation about the whole path and competes in the multiplicative update with one station per block it spans, so weighting by the blocks spanned lets it balance them. There is no reference for the multiplier. With static membership (pass 0, midday, a route with no simulated trip) the weight stays `routeWeight`, so pass 0 still reproduces the baseline periods and the static fit that anchors the ceilings is unchanged. The weight used per route station and period goes in the fit report.

D3. (Lead, revised 2026-11-20.) One candidate, `route-weight.json`: round 51's `shares-membership.json` with `gatePriorTotals.scope` set to `outsideStudyArea` and `routeWeightPerBlock` true. The loop, the screen, ten seeds if the screen passes. The low-demand line (10% below the static fit) is a reported figure only (lead decision of 2026-11-19 in round 51); the 3% abort above the static fit stays.

D3 variant, not run. The first version of D3 had scope `allNodes` with the route weight alone. It is not run unless the lead asks: the breakdown above predicts that it trades block counts for the traversal count. The route weight lowers the end-to-end share the blocks carry, while every node still has a ceiling at its static-fit total, so nothing can supply the along-the-street trips that fill the blocks again, and the blocks fall further from their 139 to 170. If the lead asks for it, the candidate is `route-weight.json` with `scope` `allNodes`; nothing else changes.

D4. (Lead.) Keep rule and screen unchanged from round 51: PM fitted at least 74 of 92, PM held out at least 14 of 24, AM fitted at least 70 of 77, AM held out at least 14 of 19, D5 4 of 4, whole-street 8 of 8, D16 holds in every period, validation 67 of 74. The screen, three seeds (1 to 3) in AM and PM: each of the four counts no more than 3 stations below the baseline's own three-seed screen, no car cleared from gridlock in the judged zone, backlog under 2% in 3 of 3 seeds in AM and PM. One figure below its line fails the candidate; the rule is not loosened after a result. New, written before any run: a candidate that passes the keep rule on seeds 1 to 10 is then run on seeds 11 to 20 together with the baseline (as in round 51, `evidence/confirm/`), and must be no worse than the baseline on every keep-rule line on those seeds. The runbook does this automatically after a pass and reports both. Adoption remains the project lead's decision.

D5. (Lead.) Reported, not conditions: round 51's lists, plus, for each of the four route stations and the Colby Street and Hillegass Avenue block stations, the target, the fit value (after fit and final) per pass and the ten-seed simulated value; the count of Colby Street SB and Hillegass Avenue SB block stations within GEH 5; the non-gate trip ends inside the study area (origins, destinations), static against final.

D6. (Lead.) Known limits, to be stated with the result. The training view never sees the route stations (the split withholds them), so the held-out counts are fitted without them. The whole-street line of the keep rule is a fitted quantity in the shipped view; it always was. Passing it shows the fit meets its own targets in the simulator; the held-out station counts remain the independent check.

D7. (Lead.) Runbook modeled on round 51's: round 51's loop folders moved aside, evidence under `openspec/changes/calibration-round-52/evidence/`, dev branch `salvatoret/peaceful-fermi-dlwt0u`, the same never-list, compact node-prior CSVs, and the automatic fresh-seed confirmation of D4.

D8. (Lead, 2026-11-20.) New ceiling scope `"outsideStudyArea"` for `gatePriorTotals`: ceilings on gate directions (as scope `gates`) and on non-gate nodes outside the study area (the network's `inStudyArea` flag), and no ceiling on non-gate nodes inside the study area, so the fit may add trip ends along the counted streets. Round 49's growth was entirely outside the study area, which this scope still caps. ASSUMPTION, as the other scopes. The 3% abort above the static fit stays as the guard on total volume. The report gives the non-gate trip ends inside the study area, static against final, per build (D5), and the count of inside nodes that grew.

P1. (Preparation choice.) The route weight is applied where the fit builds the station constraints (`stationCons` in `fitPeriod`): only a station in `measSt`, that is one with simulated pairs in this period, gets the scaled weight. A station is a route station when its id starts with `count route ` and its feature is a path; block stations are those whose id starts with `count block ` with one link on the route's links, in `countCons0` (not held out, with a target in the period, in the view). A route with no fitted block keeps its weight (the count is at least 1). The static fit that anchors the ceilings runs with no membership, so it reweights nothing.

P2. (Preparation choice.) The report has a section "Route weights (round 52, ASSUMPTION)" with one line per route station and period, simulated or static, base weight, blocks and weight, and a per-period note. The loop parses the lines, prints them per build, writes them under "Share and through targets, by build", and stops if a shipped build from pass 1 has no line while the sub-switch is on (the build did not apply it). A route that took static membership in a pass prints a warning.

P3. (Preparation choice.) `outsideStudyArea` is `allNodes` minus the non-gate nodes inside the study area: in `gatePriorStations` the flow totals of such nodes are not collected, so they have no ceiling station, and the hard projection works only on ceiling stations, so it leaves them alone. The report counts the inside non-gate nodes whose origin or destination total grew over the static fit by more than 0.5 veh/h, and the nodes with trips.

P4. (Preparation choice.) The loop keeps each build's fit reports under `target/membership-loop/fits/<step id>/` so that the after-fit and final values of the route and block stations can be read per pass (D5); until now only the last build's reports survived. A script, `scripts/route-lines.cjs`, reads them and the per-seed reports.

P5. (Preparation choice.) The loop's low-demand message no longer says "STOP and report"; it says the figure is reported and the run carries on (D3).

## Checked in the container

All builds ran in the container on 2026-11-20 with `--out-root`, so nothing under `data/` or `public/data/` changed. Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9 (RAN).

- Switch absent, config as committed: shipped demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, network 53c823f20d9165ed. Both baseline hashes reproduce.
- Candidate entry, no membership file: the shipped build's periods are identical to the baseline's (JSON equal). The report says static route shares, lists the ceiling scope and prints every route weight as `static; weight 1`.
- Candidate entry and a made-up membership file (PM only, 26 stations with pairs: the seven Colby Street and four Hillegass Avenue blocks per direction plus the four route stations, pairs taken from the static assignment of the baseline fit, each pair at 10 trips and hits at the static share times 10; this is a wiring check and carries no evidence about real simulated membership). The weights used: Colby Street routes 7 (base 1 times 7 blocks), Hillegass Avenue routes 4. AM and midday print static, weight 1.

| PM, made-up membership | Without `routeWeightPerBlock` | With it |
| --- | --- | --- |
| Colby Street SB whole street, fit / final (39 counted) | 65 / 75 (GEH 4.7) | 53 / 54 (GEH 2.2) |
| Colby Street SB blocks, final (counts 139 to 170) | 127 to 184 | 108 to 173 |
| Hillegass Avenue SB whole street, final (79 counted) | 74 | 73 |
| Non-gate trip ends inside the study area, static fit to final: origins | 951 to 954 | 951 to 961 |
| same, destinations | 734 to 677 | 734 to 690 |
| Inside nodes that grew: origins, destinations | 11 of 57, 19 of 56 | 10 of 57, 18 of 56 |
| Offered car demand, static fit to final | 27609 to 26216 | 27609 to 26181 |

Both builds end 5% under the static fit, far from the 3% abort above it. The route weight moves the whole-street figure toward its count and takes the Colby Street SB blocks down by 7 to 19 cars an hour each, the cost the design predicts. The inside trip ends hardly move on this file, which has no fractional membership and so no incentive to add along-the-street trips; whether they grow on real membership is for the laptop run to show.

## What is not known

- Whether the weight moves the traversal count without costing the blocks more than the fit can give back. The weight is an assumption with no reference.
- Whether the fit can use the freed inside nodes. With the ceilings on gates and outside nodes, partial-street trips can come from two places: re-weighting pairs that exist, and new trip ends along the street. The pooled round 51 membership would let you check which pairs carry end-to-end trips and how many of the along-the-street pairs the static table offers (what share of the Colby Street blocks' 101 to 126 cars an hour could be moved to pairs that begin or end on the street, and whether their offered volume is bounded). That check needs the two membership files of round 51 (7 gzip parts on the laptop's development branch, commit 74afa36); they are not available in this container, so it was not done. The per-flow bound question stays open for the same reason (no dump of the flows before the fit).
- Whether inside trip ends that the fit adds are plausible. The count's `endAlongVehPerHour` says some trips begin or end along the street, but no reference sets how many. The 3% abort bounds total volume only.
- How the held-out counts move. The fit adds trip ends inside the study area near held-out blocks as well; D5 reports them.

## Risks

- Colby Street SB block counts may fall further: the weight pulls end-to-end cars out of the blocks, and if the fit cannot add partial-street trips the blocks end lower than round 51's 106 to 132.
- Free inside nodes may take volume that belongs elsewhere. Local trips and the load on the interior streets could grow, and so could backlog (round 51 PM ended at 1.1% mean backlog, under the 2% line).
- Total offered demand may rise up to the 3% abort line, where round 51 fell 10 to 11% below the static fit, and a rise at inside nodes changes the loads the proposals are measured on.
- The weight multiplies a count's influence by up to 8 for Colby Street. If the traversal count is noisier than a block count (one day, a volunteer tally of the whole street), the fit now trusts it eight times as much as one block.
- The ceilings outside the study area still freeze the static fit's errors at gates and outside nodes.
- The loop has not run with the new report lines or the fits copy. A mismatch stops the loop at the check.
- The shares and the loop's other round 51 checks are unchanged. The shares now see inside nodes that grow, which they could not before.

## Outcome so far

The candidate passes the screen and every line of the keep rule (D4) on seeds 1 to 10: PM fitted 81, PM held out 14 (exactly at its line), AM fitted 72, AM held out 15, D5 4 of 4, whole-street 8 of 8, D16 holds in every period, validation 67 of 74. It also passes the fresh-seed confirmation on seeds 11 to 20: no keep-rule line is worse than the baseline's on the same seeds, and PM Colby St SB whole-street is 67 (GEH 3.9) against round 51's failed 78 (GEH 5.0). PM Colby St SB stays the weakest line (74.5, GEH 4.7, on seeds 1 to 10; 39 counted). D5 and the whole-street line are fitted quantities in the shipped view; the held-out station counts are the independent check, and the assessment's 85% station rule still fails for held-out stations (PM 14 of 24, AM 15 of 19). The cost shows in congestion: PM backlog roughly fourfold but under 2% in every seed, trips waiting at gate 602 from 46 to 170, and one more travel time out of range. The shipped PM build offers 10.3% less demand than the static fit (reported only).

The evidence is under `evidence/`, from laptop commit d2bfe91 on the development branch (unsigned; the membership parts stay on that branch and are not on main). The record entry is in `data/calibration/rockridge.record.md`. The code is on `main` with the switches off, and the shipped config has neither `gatePriorTotals` nor `simulatedMembership`. The published data are unchanged.

Adoption is pending the project lead's review. A proposal search on the candidate is running on the laptop and will be staged, not published. The change stays open until adoption is decided.

## Decision of the project lead (2026-11-20): adopt and publish round 52

Asked on 2026-11-20 (about 1:35 AM Pacific), the project lead decided to publish round 52 as the model, with its assumptions, maps and the staged proposals. The model status stays "Not calibrated".

What they were shown:

- The keep rule on seeds 1 to 10: PM fitted 81 of 92, PM held out 14 of 24, AM fitted 72 of 77, AM held out 15 of 19, D5 4 of 4, whole-street 8 of 8, D16 holds in every period, validation 67 of 74. The fresh-seed confirmation on seeds 11 to 20 holds: no line is worse than the baseline's.
- The costs:
  - PM Colby St southbound whole-street goes from 67 to 75 cars an hour against 39 counted (GEH 4.7), so it is the weakest line.
  - PM backlog is about fourfold (mean 0.28% to 1.07% of trips) and stays under 2% in every seed.
  - PM Telegraph Ave southbound travel time is now out of range (400 s against 300 to 376 s observed).
  - The shipped PM build offers 10.3% less demand than the static fit.
  - The demand is fitted on the simulator's own route choice with caps on trip ends. That is an assumption without a published reference.
- The staged proposals: baseline 522.5 through cars an hour against 508.4 for the published set, and the top option unchanged at -74.0%.

Adoption steps:

1. This branch (`adopt-round-52`): the demand config with the candidate entry (sha256 2405ff02c92b2837), the fit reports and audit from the byte-identical rebuild, membership files synced through R2 (`demand/membership/`), the area status text, and the staged proposals as the published set (`data/proposals/rockridge.md`, `rockridge.seeds.json`).
2. Laptop, after it merges the branch: pull the membership files, rebuild the demand and check its hashes (demand 2d16d8f8eb0950ca, cross-validation demand 1c3b1666f24156f1), `npm run assess -- --publish --noise`, the validation suite, `npm run data:redistribution`, `npm run data:results`, `npm run data:assumptions`, `npm run data:llms`, `npm run data:previews`.
3. Cloud: merge to main, copy the proposals file (`evidence/search/proposals.json`, sha256 197a99cdafc026f8) to `public/data/rockridge.proposals.json`, `data:push` (membership files included), write the record entry for the publish, archive the change.
