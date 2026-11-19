## Context

Baseline for this round: the published model of 2026-11-18, unchanged by rounds 44 to 48. Network 53c823f20d9165ed, demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9. Ten seeds per period: PM fitted 74 of 92 recent stations within GEH 5, PM held out 14 of 24, AM fitted 70 of 77, AM held out 14 of 19, D5 4 of 4, whole-street traversals 8 of 8, D16 holds, validation 67 of 74.

Round 48 ran the simulated-membership loop (`tools/membership-loop.ts`) with the ceiling idea still missing. Its candidate raised PM fitted to 78 of 92 and AM fitted to 72 of 77 and halved the training view's diagonal overshoot, and it failed three lines: PM held out 13 of 24, D5 2 of 4, D16 in AM and PM. The failure was backlog. The fit added 1,200 to 2,100 veh/h of car demand at gates with no count. Trips waiting at the end of the PM run went from 78 to 830 (SR-24 eastbound entry, node 602: 46 to 270; San Pablo Ave, node 183: 14 to 229; Claremont Ave, node 1756, and Claremont Blvd, node 1398: about 0 to 142 and 55). The round 48 screen passed on three seeds because it does not measure backlog.

How the fit lets a gate grow (`tools/lib/fit-counts.ts` `fitToCounts`): every flow's factor is a weighted geometric mean over the constraints on its paths, bounded only by the per-flow `lo` and `hi`. A gate with a gate station has its total pulled to the count. A gate without one has no constraint, so its flows move only through the link and movement stations they cross. With simulated membership a station's missing trips can come from flows at an uncounted gate, and nothing holds that gate's total.

## Decisions

The lead made D1 to D9 on 2026-11-19, before any run and before this change was written. They are recorded here as the lead's. Preparation choices follow as P1 to P7 and are marked as such.

D1. No simulator change. The fingerprint stays d45a275dd7be0713cec6a64394b7d8a9. Baseline hashes: network 53c823f20d9165ed, demand 9cdebdabf05c4460, training 2f9ae152b9bbf78e.

D2. A new switch `countFit.gatePriorTotals`, absent by default. Absent, both demand hashes are byte-identical to the baseline. The shape is `{ "tolerancePct": 10, "weight": 10 }`. It is inserted on the laptop by an `apply-candidate.py`, as in earlier rounds, because any text in the committed config changes both demand hashes.

D3. With the entry present, for every gate node (surface gates and freeway mainline gates) and each direction it has (origin and destination) that no surviving `kind: 'gate'` station covers after `dedupeStations`, the fit appends a one-sided ceiling station (`Station.kind` `'gate-prior'`, no links, origins or destinations the gate, static membership 1). The ceiling is the gate's pre-fit car total for the period times (1 + tolerancePct / 100). It uses the existing `Constraint.ceiling` (the constraint acts only while the assigned volume is above it). `Station` gets an optional `ceiling`, passed through `toCons` in `tools/lib/demand-fit.ts`. A gate whose gate station `dedupeStations` dropped (the count is used by another station) is covered by nothing and gets the ceiling too. The stations are appended inside the fit only, so they do not disturb `checkManifest`, the stations output file (the loop driver hashes it) or the split. `calibrate` and `assess` do not score them and the membership rule does not select them. The ceiling applies in all periods, midday included, and in both views. In the training view the pre-fit total is that view's own, so no count value sets a ceiling. Tolerance 10% reuses the reasoning of `countFit.tolerancePct.gate`. Weight 10 is five times the ramp weight. Both are ASSUMPTIONS, labeled so in the code, the config candidate and the report.

D4. The fit report gets a section listing, per period, the number of ceiling stations, how many end above their ceiling and by how much (the sum, and the worst five gates with node id and street), and the total offered car demand before and after. The membership loop's per-pass report includes the count above ceiling and the excess sum.

D5. Two candidates, in `candidates/`.

- `gate-ceiling-static.json`: `gatePriorTotals` only, static membership. Stage 1: build both views, then a three-seed screen. No loop.
- `gate-ceiling-membership.json`: `gatePriorTotals` plus `throughTargets.simulatedMembership` exactly as round 48's candidate. Stage 2: the three-pass loop, then the screen, then a ten-seed assessment if the screen passes.

Stage 2 runs regardless of stage 1's screen unless stage 1 shows cars cleared from gridlock in the judged zone that the ceiling caused. Stage 1 is a control: it shows what the ceiling does alone. It gets a ten-seed assessment only if its screen passes and at least one of its four screen counts is above the baseline screen.

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

D9. Heavy runs go to the project lead's laptop from `runbook.md`: stage 1, then stage 2, with the expected hashes, what to report back, no push to main, no `data:push`, `validation.json` checked out after `validate`, evidence under `evidence/`, commits on `salvatoret/peaceful-fermi-dlwt0u`. Round 48's run sets are not reused: the config hash differs.

P1. (Preparation choice.) The ceiling stations are built in `fitPeriod`, from `FitConfig.gatePrior` and the period's offered flows, and not appended to the station list in `build-demand.ts`. The station list feeds the stations output, `checkManifest`, the split and the report's station tables; building them where the fit consumes them leaves all of that untouched by construction. The gate node list is the network's nodes with `gate: true` (surface and freeway mainline gates).

P2. (Preparation choice.) A direction is covered when a `kind: 'gate'` station that is in the fit for the period (not held, target above zero) names the node. A gate station that the recency rule holds out of the fit (`outOfFit`) is not a constraint, so its gate gets a ceiling. This follows D3's reading "no surviving gate station".

P3. (Preparation choice.) The pre-fit total is the sum of `vehPerHour` over every car flow of the period that starts, or ends, at the node: the plain flows and the pinned assumed-movement flows. Flows that cannot be routed are included, which is a few veh/h at most.

P4. (Preparation choice.) "Above ceiling" in the report means more than 0.5 veh/h above, so float noise and the fit's own 1% tolerance do not make every station count. The report prints the excess itself, so a reader can apply another threshold.

P5. (Preparation choice.) Both views write the same report section. The loop reads the one-line summary per period (`Gate prior ceilings <period>: N stations; K above ceiling; excess X veh/h; ...`) from each build's report and stores it in `state.json`; a final-build line is in the log and the report table.

P6. (Preparation choice.) Backlog for the screen's added line. The D16 backlog figure is `health.backlogPct` of each seed's run: entry backlog at the end of the run, in percent of spawned trips (`crates/sim/src/bin/calibrate/multi.rs`, `tools/lib/verdict.ts` `computeStability`). `tools/assess.ts` prints it in each period's "Stability rule (D16)" line as "backlog under 2% in k of n seeds (mean x%, max y%)", and it prints that line in diagnostic mode too, only replacing the verdict word with "not judged". For the screen, k must be 3 of 3 for AM and for PM (equivalently, max below 2%). Per-seed values are in each seed's run file; the screen output carries only k, the mean and the max.

P7. (Preparation choice.) The ceiling stations enter the fit's constraint list as ordinary constraints with a ceiling. A consequence follows from D3's wording: flows at an uncovered gate now count as touching a constraint, so they no longer take the median rule for flows that touch no count (in the shipped view that factor is the lower bound 0.10 in every period), and the capacity guard's cut of such flows does not apply to them. They move only when their ceiling binds, or through the stations they cross. The container builds measured this (see "Checked in the container" and "Open question for the lead"): it releases flows the baseline crushed, so offered demand does not fall.

## Checked in the container

Both views were built here with `--out-root`, so no file under `data/` or `public/data/` changed. The inputs are the ones the baseline used: the committed network (53c823f20d9165ed), the OSM extract and the raw demand files copied from the main checkout.

- Switch absent reproduces the baseline. The shipped build gave demand 9cdebdabf05c4460 and the training build gave 2f9ae152b9bbf78e. The stations file written by the shipped build is byte-identical to the committed one. The simulator, the network and the split are untouched, so the fingerprint stays d45a275dd7be0713cec6a64394b7d8a9.
- Switch present, static membership (the `gate-ceiling-static` candidate; the scratch config is the exact output of `apply-candidate.py` on the committed config). Shipped demand f5d31d99ffe7e8d3, training demand f0ad1650cc0cd49a. Both builds ran in about 13 minutes at once on 4 cores. The stations file with the entry present is byte-identical to the committed one, so the loop driver's hash check holds.

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
- `npx vitest run tools/`: 465 passed, 5 skipped, including the 8 new tests in `tools/gate-prior.test.ts` (off means no extra constraints and no report; stations only for uncovered gate directions; the ceiling value; a gate below its ceiling is not pulled up; a count that would grow two gates by 50% leaves them about 1.5% above their ceilings, against 50% above without; covered gates get no ceiling; ceiling stations stay out of `stationRows`, `heldRows` and the input station list; the report section and the loop's parse of its line). `npx tsc --noEmit` reports only the missing WASM package. `npm test` with the Rust tests was not run.
- `npx openspec validate calibration-round-49 --strict --no-interactive` passes.

## Open question for the lead

The ceiling is a one-sided limit at the gate's pre-fit total plus 10%. Two facts from the container builds mean it does not do quite what D3's reasoning expects, and the lead should decide before the laptop spends hours.

1. The baseline's final totals at uncounted gates are mostly below the pre-fit totals (149 of 216 in the PM), so a ceiling at pre-fit plus 10% sits far above them (node 602: 3,945 final, 5,139 ceiling). Round 48's growth there (4,114 at node 602, 854 at node 1726) would not have been stopped. The ceilings only bind where the baseline fit itself raised a gate above its pre-fit total.
2. With the ceilings in the constraint list as D3 says, flows at an uncovered gate stop taking the median rule that crushes them to 0.10, so they regrow toward their pre-fit totals (P7). In the shipped view the total stays near the baseline's (27,601 against 27,609 in the PM); in the training view it rises 5% (PM 25,042 to 26,340).

Options: (a) run as written: stage 1 is then the control that shows exactly this; (b) keep the ceiling stations out of the "touches a count" test (a three-line change in `fitToCounts`, prototyped above): offered demand falls about 4%, gates above their ceilings are held, gates below stay at their baseline level or grow only up to the ceiling; (c) anchor the ceiling on the totals of a first fit without ceilings instead of the pre-fit total (a two-pass fit, which D3 does not describe, and still reads no count value); (d) a lower tolerance than 10%, which does not close a 15% to 30% gap at the gates that matter. I implemented (a), as D3 and P7 state, and changed nothing else.

## What is not known

- Whether the ceilings hold against the pull of the counted stations in the loop. They are soft with weight 10 against weights of 1 to 2. In the static fit of the container build they hold (at most 15 veh/h of excess in a period). With simulated membership the counted stations ask for more trips from uncounted gates, which is the case the ceilings are for, and no run says how large the excess becomes. The report and the loop lines state it per build.
- Whether holding the gates helps the three lines round 48 failed. D5 and PM held out failed with gates growing, but the held-out loss may come from the membership fit alone. Stage 1 is the control for the ceiling; stage 2 shows the two together.
- Ceilings at "via" gates. San Pablo Ave (node 183) is a gate whose static-fit total already exceeds its target in some periods, and a ceiling built on the pre-fit total can sit below what the link counts there ask for. The soft constraint lets the counts win in part (weight 10 against 1), and the report names such gates. Whether that costs fitted stations is for the screen to show.
- How much the ceilings change the static baseline beyond the gates. The container builds show the demand differs from the baseline without any simulated membership: shipped PM and AM offered demand within 0.3%, midday +2.4%, training PM +5.2%, AM +4.0%. What that does to the station scores is stage 1's result.
- Whether a pre-fit total is a sound ceiling for a gate. It is the gate's own total from the demand build (gravity and ramp steps, scaled to counts at counted gates), not an observed total. For an uncounted gate it is the best available prior and nothing more; the 10% tolerance is an assumption. The container builds show it is above the baseline's final total at most gates (149 of 216 in the PM).
- Whether the loop with ceilings runs end to end on the laptop. The loop driver's new lines were tested against the fake build and fake simulator only.
- Whether `assess --diagnostic` prints the backlog line on the laptop as the code says it does (P6). It was read, not run.
- Where the per-gate "trips waiting at the end of the run" figures come from on the laptop. The per-seed calibrate report lists the top 10 origin nodes by entry backlog ("Entry backlog by origin node at end of run"). Round 48's evidence scripts that tabulated all gates are not in the repository. If the top 10 does not show a gate in the list, the runbook has the laptop rerun one seed and read the kept per-seed reports.

## Risks

- Ceilings that bind while counts disagree show up as stations outside tolerance in the fit report ("Stations that cannot be met"), which can lower fitted scores. The screen shows it early.
- A ceiling at a gate that the simulator needs to fill (the SR-24 mainline entries) can starve a counted ramp or movement downstream. The ramp table in the reported lists shows it.
- Soft ceilings can leak. Weight 10 does not make the constraint hard, and the leak is reported, not bounded.
- Ceilings built on pre-fit totals move the static baseline (P7), so stage 2 compares with the round 48 candidate and the original baseline, not with a static fit that has no ceilings.
- The ceilings may not stop what failed in round 48 (see "Open question for the lead"): at node 602 the ceiling is far above both the baseline total and round 48's total, so the SR-24 eastbound entry can still receive more than the mainline carries.
- The loop's memory of the first pass is permanent in the pool (1/n weighting), as in round 48.
