## Context

Baseline for this round: the published model of 2026-11-18, unchanged by rounds 44 to 48. Network 53c823f20d9165ed, demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9. Ten seeds per period: PM fitted 74 of 92 recent stations within GEH 5, PM held out 14 of 24, AM fitted 70 of 77, AM held out 14 of 19, D5 4 of 4, whole-street traversals 8 of 8, D16 holds, validation 67 of 74.

Round 48 ran the simulated-membership loop (`tools/membership-loop.ts`) with the ceiling idea still missing. Its candidate raised PM fitted to 78 of 92 and AM fitted to 72 of 77 and halved the training view's diagonal overshoot, and it failed three lines: PM held out 13 of 24, D5 2 of 4, D16 in AM and PM. The failure was backlog. The fit added 1,200 to 2,100 veh/h of car demand at gates with no count. Trips waiting at the end of the PM run went from 78 to 830 (SR-24 eastbound entry, node 602: 46 to 270; San Pablo Ave, node 183: 14 to 229; Claremont Ave, node 1756, and Claremont Blvd, node 1398: about 0 to 142 and 55). The round 48 screen passed on three seeds because it does not measure backlog.

How the fit lets a gate grow (`tools/lib/fit-counts.ts` `fitToCounts`): every flow's factor is a weighted geometric mean over the constraints on its paths, bounded only by the per-flow `lo` and `hi`. A gate with a gate station has its total pulled to the count. A gate without one has no constraint, so its flows move only through the link and movement stations they cross. With simulated membership a station's missing trips can come from flows at an uncounted gate, and nothing holds that gate's total.

## Decisions

The lead made D1 to D9 on 2026-11-19, before any run. After the container builds of the first version showed the pre-fit anchor does not hold the gates ("Why the anchor moved"), the lead revised D2, D3, D5 and D9 the same day; the revised text replaces the first. Preparation choices follow as P1 to P7 and are marked as such.

D1. No simulator change. The fingerprint stays d45a275dd7be0713cec6a64394b7d8a9. Baseline hashes: network 53c823f20d9165ed, demand 9cdebdabf05c4460, training 2f9ae152b9bbf78e.

D2'. (Lead, 2026-11-19, replaces D2.) A new switch `countFit.gatePriorTotals`, absent by default, shape `{ "anchor": "staticFit", "tolerancePct": 0, "weight": 10 }`. Absent, both demand hashes are byte-identical to the baseline. It is inserted on the laptop by `apply-candidate.py`, as in earlier rounds, because any text in the committed config changes both demand hashes. Tolerance 0 because with this anchor 10% would allow node 602 to reach 4,340, above round 48's 4,114. Weight 10 (five times the ramp weight) is an ASSUMPTION. The first version's pre-fit anchor code path is removed; there is one mode.

D3'. (Lead, 2026-11-19, replaces D3.) The ceiling is anchored on the static fit, not on the pre-fit total. With the entry present and a simulated-membership file in use for the view and period, `fitPeriod` first runs the fit exactly as the baseline does (static membership, no ceilings), takes each uncovered gate direction's car total from that result, and then runs the fit with simulated membership plus a ceiling station per uncovered gate direction at that total times (1 + tolerancePct / 100). Meaning: simulated membership may move a gate's trips among pairs but may not add trips at any gate beyond what the static fit of the same view and period gives. ASSUMPTION: a regularizer toward the static fit, with no reference. The training view anchors on its own static fit, so no count value is read to set a ceiling.

- Covered gate directions, gates counted via a dropped gate station, the one-sided behavior (the existing `Constraint.ceiling`), `Station.ceiling` passed through `toCons`, the stations living inside the fit only (not in the stations output, `checkManifest`, the split, the scores or the membership rule), and all gate nodes (surface and freeway mainline gates) are as in the first version of D3.
- Ceiling stations stay out of the `touched`/`counted` test and out of anything else that changes how unconstrained flows are treated (the median-of-type rule, the capacity guard's cut). They act only as ceilings (`Constraint.ceilingOnly`).
- With no membership file in use (the entry present but static membership: the loop's pass 0, or midday), no second fit runs and no ceiling applies, so pass 0 reproduces the baseline's demand periods exactly and the driver's pass-0 check keeps passing. Midday stays as baseline unless midday membership is run.

D4. The fit report gets a section listing, per period, the number of ceiling stations, how many end above their ceiling and by how much (the sum, and the worst five gates with node id and street), the total offered car demand of the static fit against the final fit, and (lead's addition) that demand by flow type, so growth that moves to local origins is visible. The membership loop's per-pass report includes the count above ceiling and the excess sum.

D3''. (Lead, 2026-11-19, after the made-up-membership check showed node 602 ending 5.6% over its ceiling at weight 10, above round 48's 4,114.) Hard projection. After the fit with ceilings has converged, and after the median rule and the guard cut (on the final flows), the fit scales down the car flows of every ceiling gate direction that still exceeds its ceiling by more than 0.1% so it ends at the ceiling. The scaling is proportional over that gate's flows and alternates over origin and destination sides for up to 200 passes until no ceiling gate direction exceeds its ceiling by more than 0.1%. Scaling only lowers flows, so it terminates. The soft ceiling stays in the iteration so the fit plans around it; the projection is the guarantee. The report states, per period, the volume removed by the projection (sum and the worst five gates) and the number of fitted stations within their tolerance before and after it, so the cost to the count fit is visible (`projectToCeilings` in `tools/lib/demand-fit.ts`).

D5'. (Lead, 2026-11-19, replaces D5.) One candidate, `candidates/gate-ceiling-membership.json`: `gatePriorTotals` plus `throughTargets.simulatedMembership` exactly as round 48's candidate. Stage 1 (the ceiling alone on static membership) is dropped: static plus this ceiling is the baseline by construction. The path is the three-pass loop (`tools/membership-loop.ts`), the screen with the backlog addition (D6), and ten seeds if the screen passes.

D6. Keep rule: round 48's D7, unchanged. A candidate is adopted only if none of these is worse than the baseline.

- PM fitted recent stations within GEH 5: at least 74 of 92
- PM held out: at least 14 of 24
- AM fitted: at least 70 of 77
- AM held out: at least 14 of 19
- D5 headline shares: 4 of 4 within 10 points
- whole-street traversals: 8 of 8 within GEH 5
- D16 stability holds in every period
- validation suite: 67 of 74 at the same fingerprint

Screen: round 46's D6, unchanged: three seeds (1 to 3), AM and PM, no verdict. A candidate gets the ten-seed assessment only if each of the four counts is no more than 3 stations below the baseline's own three-seed screen and no car is cleared from gridlock in the judged zone. One addition, written before any run: the screen fails if in any of the three seeds, AM or PM, the end-of-run backlog is 2% or more (the D16 backlog line). Round 48's screen passed while ten seeds failed on backlog.

D7. Reported, not conditions: the lists of round 48's D7 (the five diagonal stations in the PM, Colby St northbound, gate totals and the SR-24 mainline gate, mean through cars per hour in the study area, every SR-24 ramp against its count or target) plus the per-gate origin and destination totals, baseline against candidate, for the 20 gates that grew most in round 48 (nodes 1398, 1756, 276, 577, 1719, 1219, 974, 952, 675, 602, 288, 8, 1726, 1674, 973, 1672, 183, 184, 943, 275), trips waiting at the end of the run by gate, and the 12 travel times.

D8. Citations: no new reference from memory. The ceiling is a constraint on a trip-table estimate. It is labeled ASSUMPTION. The method family is count-based trip-table estimation, [VanZuylen1980] (the entry says only its title was read: it states the problem of estimating a table from link counts); the ceiling is not in that paper as far as this change knows. [PowellSheffi1982] stays the source of the 1/n pooling in the loop, with the limits its entry states.

D9'. (Lead, replaces D9 for the single stage.) Heavy runs go to the project lead's laptop from `runbook.md`: the loop, with the expected hashes, what to report back, no push to main, no `data:push`, `validation.json` checked out after `validate`, evidence under `evidence/`, commits on `salvatoret/peaceful-fermi-dlwt0u`. Round 48's run sets are not reused: the config hash differs. From pass 1 each build runs the fit twice per period that takes simulated membership, so builds take roughly twice as long.

D11'. (Lead, 2026-11-19, written before any run; the 3% threshold is an ASSUMPTION.) Loop abort. After each build from pass 1 on (the final builds included), if the total offered car demand in any view and period exceeds that view and period's static fit by more than 3%, the driver stops with a clear message and a non-zero exit before running that pass's seeds. Round 48 failed at +4.4% to +9.0%. The gates are now held, so growth past 3% would have moved to non-gate origins, and the result goes back to the lead instead of spending laptop hours. The driver reads the static fit's and the final fit's offered totals from the report's ceiling line (`CEILING_ABORT_SHARE` in `tools/lib/membership-loop.ts`).

P1. (Preparation choice.) The second fit is a recursive call of `fitPeriod` on the same flows with `gatePrior` and the measured memberships removed from the config, so it is the baseline's code path, not a copy. The ceiling stations are built in `fitPeriod`, not appended to the station list in `build-demand.ts`: that list feeds the stations output, `checkManifest`, the split and the report's station tables, and building them where the fit consumes them leaves all of that untouched. The gate node list is the network's nodes with `gate: true`.

P2. (Preparation choice.) A direction is covered when a `kind: 'gate'` station that is in the fit for the period (not held, target above zero) names the node. A gate station that the recency rule holds out of the fit is not a constraint, so its gate gets a ceiling.

P3. (Preparation choice.) A period "takes simulated membership" when at least one fitted station has simulated pairs for it (the set `measSt` is not empty). With `measuredStations: 'all'` that holds for the periods in the membership file.

P4. (Preparation choice.) "Above ceiling" in the report means more than 0.5 veh/h above, so float noise and the fit's own 1% tolerance do not make every station count. The report prints the excess itself.

P5. (Preparation choice.) The loop reads the one-line summary per period (`Gate prior ceilings <period>: N stations; K above ceiling; excess X veh/h; ...`) from each build's report, stores it in `state.json`, prints it per build and puts it in the report table.

P6. (Preparation choice.) Backlog for the screen's added line. The D16 backlog figure is `health.backlogPct` of each seed's run: entry backlog at the end of the run, in percent of spawned trips (`crates/sim/src/bin/calibrate/multi.rs`, `tools/lib/verdict.ts` `computeStability`). `tools/assess.ts` prints it in each period's "Stability rule (D16)" line as "backlog under 2% in k of n seeds (mean x%, max y%)", in diagnostic mode too (only the verdict word changes). For the screen k must be 3 of 3 in AM and in PM, equivalently the max below 2%. Per-seed values are in each seed's run file; the screen output carries only k, the mean and the max.

P7. (Preparation choice.) A ceiling station that is left in the constraint list only as a cap needs one change in `fitToCounts`: constraints with `ceilingOnly` are skipped when marking flows `counted` and `touched`. Nothing else in the fit reads that flag.

## Why the anchor moved

The first version anchored the ceiling on each gate's own total before the fit (plus 10%). Its container builds (shipped and training views, static membership, ceilings in every period) gave these results; they are the reason for the lead's revision.

- First version (ceiling on the pre-fit total plus 10%, no membership; scratch config). Shipped demand f5d31d99ffe7e8d3, training demand f0ad1650cc0cd49a. Both builds ran in about 13 minutes at once on 4 cores. The stations file with the entry present is byte-identical to the committed one, so the loop driver's hash check holds.

  | View, period | Ceiling stations | Above ceiling after the fit | Excess (veh/h) | Offered car before the fit | After the fit, baseline | After the fit, with ceilings |
  | --- | --- | --- | --- | --- | --- | --- |
  | Shipped PM | 216 | 11 | 15 | 27,719 | 27,609 | 27,601 |
  | Shipped AM | 217 | 6 | 15 | 22,637 | 23,202 | 23,267 |
  | Shipped midday | 217 | 2 | 3 | 16,636 | 16,218 | 16,605 |
  | Training PM | 222 | 9 | 11 | 25,374 | 25,042 | 26,340 |
  | Training AM | 223 | 3 | 5 | 20,273 | 20,582 | 21,415 |
  | Training midday | 223 | 2 | 2 | 15,395 | 16,590 | 17,053 |

  The demand files carry 27,612 (PM) and 23,204 (AM) for the baseline; the table uses the fit report's own totals. The gates that end above their limit are few and small (worst PM gates: Caldecott Lane 40 against a ceiling of 36, Claremont Boulevard 230 against 227, Whitmore Street 38 against 36), and the largest sum of excess is 15 veh/h, so in the static fit the soft constraint holds.
- What the ceilings do to the static fit, shipped PM (the 20 gates of D7; per-direction totals in veh/h, the baseline's final, the gate's pre-fit total, the ceiling, and the build with ceilings):

| Gate node | Street | Direction | Baseline | Pre-fit total | Ceiling | With the ceiling | Above baseline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1398 | Claremont Boulevard | entering | 357 | 207 | 227 | 230 | -127 |
| 1398 | Claremont Boulevard | leaving | 49 | 251 | 276 | 50 | +1 |
| 1756 | Claremont Avenue | entering | 412 | 372 | 409 | 410 | -2 |
| 1756 | Claremont Avenue | leaving | 567 | 455 | 500 | 501 | -66 |
| 276 | Martin Luther King Junior Way | entering | 347 | 359 | 395 | 396 | +49 |
| 276 | Martin Luther King Junior Way | leaving | 798 | 452 | 498 | 499 | -299 |
| 577 | Martin Luther King Junior Way | entering | 178 | 203 | 223 | 156 | -22 |
| 577 | Martin Luther King Junior Way | leaving | 417 | 248 | 273 | 273 | -144 |
| 1719 | Grove Shafter Freeway | entering | 947 | 1075 | 1182 | 1048 | +101 |
| 1219 | College Avenue | entering | 300 | 205 | 226 | 226 | -74 |
| 1219 | College Avenue | leaving | 195 | 249 | 274 | 231 | +36 |
| 974 | Broadway | entering | 924 | 573 | 630 | 631 | -293 |
| 952 | Shattuck Avenue | entering | 171 | 369 | 405 | 230 | +59 |
| 675 | (unnamed) | leaving | 3778 | 4213 | 4635 | 3787 | +9 |
| 602 | Grove Shafter Freeway | entering | 3945 | 4671 | 5139 | 4044 | +99 |
| 288 | Adeline Street | entering | 174 | 320 | 352 | 133 | -41 |
| 288 | Adeline Street | leaving | 150 | 413 | 454 | 229 | +79 |
| 8 | Powell Street | leaving | 253 | 415 | 456 | 405 | +152 |
| 1726 | Grove Shafter Freeway | leaving | 709 | 963 | 1059 | 822 | +113 |
| 1674 | Warren Freeway | leaving | 1305 | 1023 | 1126 | 1126 | -179 |
| 973 | Broadway | leaving | 1126 | 674 | 741 | 742 | -384 |
| 1672 | Warren Freeway | entering | 660 | 874 | 962 | 725 | +65 |
| 183 | San Pablo Avenue | entering | 1023 | 759 | 835 | 835 | -188 |
| 184 | Alcatraz Avenue | entering | 308 | 536 | 590 | 376 | +68 |
| 184 | Alcatraz Avenue | leaving | 771 | 613 | 674 | 675 | -96 |
| 943 | Ward Street | entering | 1194 | 919 | 1011 | 938 | -256 |
| 943 | Ward Street | leaving | 990 | 906 | 996 | 991 | +1 |
| 275 | Market Street | entering | 308 | 543 | 597 | 338 | +30 |
| 275 | Market Street | leaving | 42 | 403 | 443 | 105 | +63 |

- The same for the shipped AM:

| Gate node | Street | Direction | Baseline | Pre-fit total | Ceiling | With the ceiling | Above baseline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1398 | Claremont Boulevard | entering | 364 | 200 | 220 | 220 | -144 |
| 1398 | Claremont Boulevard | leaving | 221 | 185 | 203 | 157 | -64 |
| 1756 | Claremont Avenue | entering | 487 | 360 | 396 | 396 | -91 |
| 1756 | Claremont Avenue | leaving | 428 | 338 | 371 | 366 | -62 |
| 276 | Martin Luther King Junior Way | entering | 223 | 306 | 336 | 255 | +32 |
| 276 | Martin Luther King Junior Way | leaving | 651 | 302 | 332 | 335 | -316 |
| 577 | Martin Luther King Junior Way | entering | 198 | 130 | 143 | 143 | -55 |
| 577 | Martin Luther King Junior Way | leaving | 193 | 162 | 179 | 174 | -19 |
| 1719 | Grove Shafter Freeway | entering | 337 | 915 | 1007 | 390 | +53 |
| 1219 | College Avenue | entering | 235 | 153 | 168 | 168 | -67 |
| 1219 | College Avenue | leaving | 199 | 167 | 184 | 175 | -24 |
| 974 | Broadway | entering | 405 | 392 | 432 | 432 | +27 |
| 952 | Shattuck Avenue | entering | 101 | 204 | 225 | 151 | +50 |
| 675 | (unnamed) | leaving | 3159 | 3574 | 3931 | 3195 | +36 |
| 602 | Grove Shafter Freeway | entering | 3656 | 3964 | 4360 | 3686 | +30 |
| 288 | Adeline Street | entering | 266 | 271 | 298 | 298 | +32 |
| 288 | Adeline Street | leaving | 111 | 299 | 328 | 240 | +129 |
| 8 | Powell Street | leaving | 230 | 382 | 420 | 275 | +45 |
| 1726 | Grove Shafter Freeway | leaving | 818 | 819 | 901 | 846 | +28 |
| 1674 | Warren Freeway | leaving | 1081 | 867 | 954 | 954 | -127 |
| 973 | Broadway | leaving | 816 | 616 | 678 | 678 | -138 |
| 1672 | Warren Freeway | entering | 821 | 745 | 819 | 820 | -1 |
| 183 | San Pablo Avenue | entering | 824 | 527 | 580 | 587 | -237 |
| 184 | Alcatraz Avenue | entering | 207 | 457 | 502 | 285 | +78 |
| 184 | Alcatraz Avenue | leaving | 343 | 409 | 449 | 385 | +42 |
| 943 | Ward Street | entering | 970 | 632 | 695 | 616 | -354 |
| 943 | Ward Street | leaving | 455 | 559 | 615 | 537 | +82 |
| 275 | Market Street | entering | 460 | 465 | 512 | 458 | -2 |
| 275 | Market Street | leaving | 66 | 259 | 285 | 127 | +61 |

- Reading the two tables. In the baseline's own final table 55 of 216 PM gate directions (54 of 217 in the AM) are above the ceiling that this change would give them, by 3,089 veh/h in all in the PM. The ceilings pull those down (node 1398 entering 357 to 230, node 276 leaving 798 to 499, node 973 leaving 1,126 to 742, node 183 entering 1,023 to 835). In the baseline 149 of 216 PM gate directions end below their pre-fit total, because flows that touch no count take the median factor, and that factor is the lower bound of 0.10 in every period of the shipped view (the fit report's "Uncounted-flow rule medians" line). With the ceilings those flows are no longer "uncounted" (P7), and 116 gate directions end above their baseline total (2,250 veh/h in all). The ceiling of the pre-fit total plus 10% does not hold a gate at its baseline total. Round 48's growth at node 602 (PM entering 3,945 to 4,114 veh/h) is far below this change's ceiling there (5,139), and 1726 (leaving 709 to 854) is below its ceiling of 1,059. Only San Pablo Ave, Claremont and a few other gates that sat above their pre-fit total in the baseline are held. This is the main finding of the container work (see "Open question for the lead").
- A prototype of the other reading of P7, with ceiling stations left out of the "touches a count" test so the median rule still applies to those flows (not committed; the lead decides): shipped PM 26,496 and AM 22,223 offered after the fit (about 4% below the baseline), training PM 24,045 and AM 19,363, node 602 PM 3,956, node 1726 801, node 8 322. It holds the gates the baseline pushed above their ceilings and lets flows at the other gates shrink to 0.10 as before, so offered demand falls rather than rises. Its shipped demand hash is 783a6b5ab4f57a47.
- The reasons the pre-fit anchor fails: the baseline's final totals at uncounted gates are mostly below the pre-fit totals (149 of 216 in the PM, because flows that touch no count take the median factor, the lower bound 0.10), so a pre-fit ceiling sits far above them (node 602: 3,945 final, 5,139 ceiling; round 48 reached 4,114). And because those ceiling stations counted as touching a count, the flows at uncovered gates escaped the median rule, so they regrew (the training view rose 5.2% in the PM). The revised design anchors on the static fit's totals and keeps the median rule.

## Checked in the container

All builds used `--out-root`, so no file under `data/` or `public/data/` changed. Inputs: the committed network (53c823f20d9165ed), the OSM extract and raw demand files copied from the main checkout.

1. Switch absent reproduces the baseline with the revised code: shipped demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e. The first version's builds also showed the stations file is byte-identical with the entry present; the revised code builds the ceilings the same way (inside `fitPeriod`) and the stations output is written before the fit.
2. Entry present, no membership file (shipped view, scratch config = `apply-candidate.py` output; the build says "No simulated membership file for the shipped view"): every period's flows are identical to the baseline's (`JSON.stringify(periods)` equal), the report has no ceiling stations and no second fit ran. Pass 0 of the loop therefore reproduces the baseline periods.
3. Entry present with a made-up membership file (valid evidence; 8 random pairs per selected station, 30% of their offered trips, 20 runs; shipped view; plumbing check, not a model result). The fit report says "20 runs; 337 of 343 fitted stations" (PM) and "272 of 278" (AM). The reference is the same file and config with the ceilings removed (a second config, so a second file with its own evidence). Results with the hard projection (D3''):

   | Shipped view, offered car veh/h | Static fit (baseline) | Made-up membership, no ceilings | Made-up membership, ceilings and projection |
   | --- | --- | --- | --- |
   | PM | 27,609 | 57,373 | 33,551 |
   | AM | 23,202 | 53,527 | 28,970 |
   | Midday (no membership in the file) | 16,218 | 16,218 | 16,218 |

   | Period, run (veh/h, from the demand files) | All | Gate origins | Gate destinations | Non-gate origins | Node 602 entering | Node 675 leaving |
   | --- | --- | --- | --- | --- | --- | --- |
   | PM static | 27,612 | 17,136 | 18,976 | 10,475 | 3,945 | 3,778 |
   | PM no ceilings | 57,375 | 32,979 | 34,685 | 24,396 | 12,079 | 9,619 |
   | PM ceilings | 33,552 | 17,033 | 18,432 | 16,519 | 3,940 | 3,766 |
   | AM static | 23,204 | 15,103 | 14,464 | 8,101 | 3,656 | 3,159 |
   | AM no ceilings | 53,529 | 29,986 | 32,598 | 23,543 | 11,061 | 9,712 |
   | AM ceilings | 28,970 | 14,870 | 14,433 | 14,099 | 3,654 | 3,158 |

   By flow type, PM, static fit then final: through 5,907 to 3,541, local 10,360 to 18,684, ramp 11,342 to 11,326 (AM: through 3,745 to 2,245, local 9,586 to 16,857, ramp 9,871 to 9,868).

   Reading it. All 216 PM and 217 AM ceiling stations end at or below their ceilings. Before the projection the soft constraint at weight 10 had left PM node 602 at 4,165 against a ceiling of 3,944 (+5.6%, above round 48's 4,114), node 675 at 3,939 against 3,777 and AM node 602 at 3,837 against 3,656. The projection removed 727 veh/h in the PM (node 602 215, node 675 154, node 1719 33, node 1674 29, node 1672 24) and 657 in the AM (602 177, 675 174, 1672 25, 1674 25, 1719 24), and node 602 now ends at 3,940 (PM) and 3,654 (AM). The cost to the count fit: fitted stations within their tolerance go from 65 to 64 of 343 (PM) and from 69 to 62 of 278 (AM), under made-up pairs, so most stations are far off already. The demand that the ceilings keep out of the gates goes to local origins and destinations (PM non-gate origins 10,475 to 16,519; offered demand ends 21.5% above the static fit in the PM and 24.8% in the AM). The loop's abort rule (D11', 3%) would stop a loop that saw this. With made-up pairs this shows how the constraint behaves, not what the model does.
4. `npx vitest run tools/`, `npx tsc --noEmit` (only the missing WASM package) and `openspec validate calibration-round-49 --strict --no-interactive` pass; the new tests are listed in the commit and cover the anchor value, no ceilings without membership, the held gates, one-sided behavior, unchanged treatment of unconstrained flows, and the exclusion from scored stations.


## What is not known

- How much the projection costs the count fit with real pairs. In the made-up-pairs check it removed about 700 veh/h per peak, mostly at nodes 602 and 675, and fitted stations within tolerance fell by 1 (PM) and 7 (AM). The report gives the same two numbers for every build of the loop.
- Whether holding the gates helps the three lines round 48 failed. D5 and PM held out failed with gates growing, but the held-out loss may come from the membership fit alone. The loop, the screen and the ten seeds show it.
- Where the demand goes. In the made-up check the demand kept out of the gates moves to local origins and destinations. The report prints the flow types for each period so the loop's real pairs show whether local demand grows.
- Ceilings at "via" gates. San Pablo Ave (node 183) is a gate whose static-fit total already exceeds its target in some periods; its ceiling is that static-fit total, so the counted stations that need more trips there lose to the ceiling in part.
- Whether the loop with ceilings runs end to end on the laptop, and how long a build takes with two fits per period. The loop driver's new lines were tested against the fake build and fake simulator only; the doubled fit is an estimate (the container's two-fit build took about 15 minutes with five builds sharing four cores).
- Whether `assess --diagnostic` prints the backlog line on the laptop as the code says it does (P6). It was read, not run.
- Where the per-gate "trips waiting at the end of the run" figures come from on the laptop. The per-seed calibrate report lists the top 10 origin nodes by entry backlog. Round 48's evidence scripts that tabulated all gates are not in the repository; if a gate is not in the top 10 the runbook has the laptop rerun one seed.

## Found on the laptop

On 2026-11-19, before any seed ran, the laptop found that a start without `--resume` did not clear the loop directory: leftover `iterK/<view>/demand.json` files from round 48 would have been reused, and leftover membership files would have been read by the pass-0 build. It moved the round 48 folders to `target/r48-loop/` and restarted. The driver now refuses to start without `--resume` when the loop directory is non-empty or a configured membership file exists; it deletes nothing.

## Risks

- Ceilings that bind while counts disagree show up as stations outside tolerance in the fit report ("Stations that cannot be met"), which can lower fitted scores. The screen shows it early.
- A ceiling at a gate the simulator needs to fill (the SR-24 mainline entries) can starve a counted ramp or movement downstream. The ramp table in the reported lists shows it.
- Soft ceilings leak (4% to 6% at the large gates before the projection in the check above); the projection removes the leak and the report states its cost. Demand moves to local origins; the 3% abort rule stops the loop when that growth passes the limit, and a run can still end at 3% or less with the shift.
- The static fit is itself not a good estimate everywhere (the diagonal overshoot round 48 set out to fix). Anchoring on it means simulated membership cannot add trips at the gates, only move them.
- The loop's memory of the first pass is permanent in the pool (1/n weighting), as in round 48.
