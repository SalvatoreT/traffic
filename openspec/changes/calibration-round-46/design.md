## Context

Baseline for this round: the published model of 2026-11-18 (commit b1ff0ef, assessment ff5d667), unchanged by round 45. Network 53c823f20d9165ed, demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9. Ten seeds per period: PM fitted 74 of 92 recent stations within GEH 5, PM held out 14 of 24, AM fitted 70 of 77, AM held out 14 of 19, D5 4 of 4, whole-street traversals 8 of 8, D16 holds, validation 67 of 74.

What the diagnosis found, and what turned out to be different. The Claremont Ave on-ramp at Hudson St (network node 833) carries 898 veh/h in the cross-validation simulation (PM, seed 1) against a counted 598 (2010 environmental-review study, [SafewayCollege-DEIR2011] in the data). The shipped simulation carries 740. The ramp is fitted:

- In the shipped demand the counted leg (598) is a station with the ramp weight 2, exempt from the age bands (`countFit.recency.exemptRamps`). The two turning movements onto the ramp (465 from Claremont Ave southbound, 62 from northbound) are stations at weight 0.5, and the other legs of the intersection are stations as well. The fit's own final assignment gives 724, 21% over its target, so the shipped fit reaches the ramp only loosely.
- The frozen split withholds that leg and the Clifton St off-ramp leg. In the training view the build skips withheld stations before it replaces a ramp's ADT x K station with a counted leg (`tools/build-demand.ts`, the intersection-count block), so the ramp keeps its ADT x K target: 9,800 x 0.09 = 882. The training fit meets it (894), and the simulation reproduces it (898). The held-out miss of 898 against 598 is the stand-in target missing the count.

K = 0.09 is `ramps.kFactor` in `data/demand/rockridge.config.json`, labeled ASSUMPTION: "peak-hour share of ramp ADT, same urban range as the arterial K-factor". No local value and no citation back it. [FHWA-TMG2022] defines K and `docs/references.md` records that the 0.08 to 0.10 range was not found in any source opened. The area README (item 41) already notes that counted hours came out under ADT x 0.09.

Where an ADT x K target is used:

1. `rampVeh` in `tools/build-demand.ts`: the volume each freeway gate offers to or takes from the surface streets is the sum over its ramps of ADT x K x period volume factor. This applies to every ramp, counted or not, in both views, and sets the 3,778 veh/h the PM demand sends to the SR-24 westbound gate.
2. Station targets of ramps with a published ADT (`tools/lib/demand-fit.ts`, section 4): ADT x K x period factor. In the shipped view this stands for every ramp without a counted leg; the share of an ADT row left over after a counted ramp takes its part (MLK Jr Way) also uses it. In the training view it also stands in for every ramp whose counted leg is withheld.
3. Two log lines that compare modeled ramp trips with ADT x K.

Counted hours exist for six ramp legs, all PM peak hours: 52nd St off (1,024) and on (996), MLK Jr Way off (1,614) and on (1,547) from the 2013 study, and the Claremont Ave on (598) and Clifton St off (617) ramps from 2010. AM and midday values of a counted ramp are its PM count times the ratio of the period volume factors (`derived` in the station file), so no AM ramp hour is counted and a per-period K cannot be estimated. The estimate is made on the PM hour and the period factors (AM 0.85, midday 0.62, assumptions) apply on top, as they do now.

## Decisions

D1. Lead decision, 2026-11-19: round 46 is the count-derived ramp peak-hour factor. The project lead decides adoption after the results. Caldecott Lane (below, D9) is left out.

D2. Mechanism. A config entry `countFit.rampK` = `{method: "counted-ramps", fallback, minRamps}`. Absent, K is `ramps.kFactor` and every output is unchanged. Present, `tools/build-demand.ts` pairs each counted ramp leg that the view may see with the ADT of the ramp and sets K for that view (`tools/lib/ramp-k.ts`). The value feeds the gate volumes, the station targets and the log lines. The code reads no street names. No spec delta: the demand-model spec says ramp volumes are ADT x K x period factor, which stays true with the rule off, and nothing shipped changes until a candidate is adopted. The change declares `skip_specs`, as round 45 did.

D3. Estimator. K = sum of counted PM hours / sum of ADTs, over the usable ramps (a pooled ratio, so a larger ramp counts for more). The median of the per-ramp ratios is printed beside it. A ramp is usable when its leg is counted, its ADT row is published and used by that ramp alone. The ADT of each Caltrans row is taken at the year nearest to the count (the later year on a tie), not the latest year the build uses for its own ADT x K targets. The MLK Jr Way on-ramp is skipped: its row (SEG WB ON FR GROVE ST, 19,300 in 2012) covers two network ramps and the counted leg covers one, so no ADT belongs to the counted ramp alone.

D4. Keep rule, written before any run of a candidate and the same as round 45's D4 against the baseline. A candidate is adopted only if none of these is worse:

- recent PM fitted stations within GEH 5: at least 74 of 92
- PM held out: at least 14 of 24
- AM fitted: at least 70 of 77
- AM held out: at least 14 of 19
- the baseline-calibration decision D5 holds, with 4 of 4 headline shares within 10 points
- all 8 whole-street traversal counts within GEH 5
- the baseline-calibration decision D16 (stability) holds in every period
- the validation suite still passes 67 of 74 at the same fingerprint

The station sets and their denominators (92, 24, 77, 19) do not change: no station is added, removed or moved between held out and fitted (`targets-changed.mjs` checks this on the stations file). The target of 16 stations does change (D5), so the first four lines are judged twice: with every station, and without the stations whose target moved. A candidate passes only if both pass. A station whose target moved cannot count as a gain. One figure below its line fails the candidate. The rule is not loosened after a result.

Reported, not conditions: the five diagonal stations in the PM (counted Forest St EB 66, McAuley St EB 12, 60th St EB 23, Ayala Ave NB 60, Howell St SB 17) in the shipped and the cross-validation view; every SR-24 ramp, simulated against its count or target; mean through cars per hour in the study area; Shattuck Ave, Telegraph Ave and College Ave travel times.

D5. Targets that change. Counted stations do not change. The ADT x K stations do, in every period:

| Ramp | Peak hour in the shipped build, baseline to candidate (veh/h) | Station status |
| --- | --- | --- |
| Telegraph Ave on-ramp, node 701 | 657 to 536 | held out, 2012 |
| Aileen St off-ramp, node 702 | 621 to 506 | fitted, 2012 |
| Keith Ave off-ramp, node 1133 | 477 to 389 | fitted, 2012 |
| Brookside Ave and Broadway on-ramps, nodes 1312 and 1320 | 351 to 286 each | fitted, 2012 |
| Broadway off-ramp, node 1350 | 315 to 257 | fitted, 2012 |
| Miles Ave on-ramp and off-ramp, nodes 1741 and 1743 | 360 to 293 and 315 to 257 | fitted, 2012 |
| Broadway Terrace, nodes 1556 (on and off), 1577 and 1669 | 218 to 178 and 317 to 259 | held out, 2012 |
| Caldecott Lane, nodes 1695 (off and on) and 1711 | 113 to 92, 61 to 50, 61 to 50 | fitted, 2024 (recent) |

That is 15 stations: 10 fitted, of which the three Caldecott Lane stations are recent and inside the 92 PM and 77 AM stations of the keep rule, and 5 held out, all 2012 and outside the 24 and 19 of the keep rule. AM and midday targets scale the same way. The training view with `ramp-k-counted-min2` lowers the same ramp stations by the ratio 0.0809 / 0.09 (for example Claremont Ave on-ramp 882 to 793, Clifton St off-ramp 972 to 874, Aileen St 621 to 558), and the training view with `ramp-k-counted` changes nothing. `evidence/container/*-targets-changed.txt` lists every target.

The MLK Jr Way on-ramp at node 280 keeps its 190. It shares its ADT row with the counted on-ramp at node 679, and the build gives it what the row leaves after the count. At K = 0.0734 the row (19,300 x 0.0734 = 1,417) is below the count of 1,547, which would leave 0 and drop the station. A first build did that, and the fit then sent about 650 more veh/h to the SR-24 westbound gate (PM 4,429 against 3,778 in the baseline). The remainder is now taken at the assumed K, which is exactly the baseline's 190.

D6. Screen, as in round 45's D5. A candidate gets the ten-seed assessment only if a three-seed diagnostic (seeds 1 to 3, AM and PM, no verdict) is no more than 3 stations below the baseline's own three-seed diagnostic on each of the four station counts and shows no car cleared from gridlock in the judged zone. The tolerance of 3 is an assumption about seed noise, written before any screen ran.

D7. Views and leakage. The shipped view sees every counted leg. The training view sees only the legs the frozen split does not withhold, and a ramp whose ADT row is withheld is not used. The training view holds out the Claremont Ave on-ramp, the Clifton St off-ramp and the MLK Jr Way on-ramp legs, which are the three lowest-K ramps of the six (0.061, 0.057, and the unusable shared row), so it is left with two ramps, 52nd St off-ramp (0.072) and MLK Jr Way off-ramp (0.088). Two ramps are a thin sample, and the sample is lopsided because of what the split holds out. `ramp-k-counted` requires 3 ramps (ASSUMPTION, written before the build) and so keeps K = 0.09 in the training view; its cross-validation demand has the same flows as the baseline's. `ramp-k-counted-min2` accepts 2 and gets 0.0809. The turning movements that restate a held-out leg stay fitted in the training view, as they were in the split's design (the split's `retained` note records that legs and movements of one intersection are not independent rows), so a held-out count is not strictly unseen by either view.

D8. What the candidates can and cannot show. The held-out scores come from the training view. With `ramp-k-counted` that view is unchanged, so held-out scores repeat the baseline's up to noise and only the shipped view, which the fitted scores and the published model use, can move. With `ramp-k-counted-min2` the Claremont Ave on-ramp stand-in falls 10% (882 to 793), which is still above the count of 598. A ratio fitted to counted ramps cannot take the held-out ramp to its count; the shipped K is a mean over ramps from 0.057 to 0.088.

D9. Caldecott Lane is left out. The audit found one Caltrans row (WB ON FR CALDECOTT LANE, 1,350 ADT in 2024) split 50/50 over two network ramps (nodes 1695 and 1711, 61 veh/h each in the PM peak) while a turn ban sends the flow to one of them. Constraining the pair by their sum is a new station family in the fit (a station over two ramps' links) and needs a change in `tools/lib/demand-fit.ts` and its report, not a config entry. It is separable and can be its own round. Its stations are recent (2024), so it would also move the keep-rule denominators.

D10. The heavy runs (screens, validation, assessments) run on the user's laptop from `runbook.md`, as in round 45. This change was prepared in a cloud container: one demand build per view per candidate ran there, no simulation.

## Checked in the container

- With no `rampK` entry the build reproduces the baseline byte for byte: shipped demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e (built with `--out-root`; the network file hashes to 53c823f20d9165ed, and the importer was not rerun). The `rampK` code does not touch the simulator or the network, so the fingerprint stays d45a275dd7be0713cec6a64394b7d8a9.
- Estimates, from the build logs. Shipped view, both candidates: K = 0.0734 from 5 counted ramps (pooled; median 0.0721). Inputs, counted hour over ADT at the year nearest to the count: Clifton St off-ramp 617 (2010) over 10,800 (2012) = 0.0571; Claremont Ave on-ramp 598 (2010) over 9,800 (2012) = 0.0610; 52nd St off-ramp 1,024 (2013) over 14,200 (2016) = 0.0721; 52nd St on-ramp 996 (2013) over 12,900 (2012) = 0.0772; MLK Jr Way off-ramp 1,614 (2013) over 18,400 (2016) = 0.0877. The MLK Jr Way on-ramp is skipped (shared ADT row). Training view: `ramp-k-counted` 0.09 from the fallback (2 usable ramps, 3 required); `ramp-k-counted-min2` 0.0809 from 52nd St off-ramp and MLK Jr Way off-ramp (median 0.0799).
- The label that goes with the numbers: an estimate from 5 ramps (2 in the training view) that mixes count years 2010 and 2013 with ADT years 2012 to 2016, one PM hour each, applied to ramps with no count and, through the period volume factors, to AM and midday. It is an ASSUMPTION-grade value and the fit report says so.
- The candidate demand files: `ramp-k-counted` shipped 8a28540b43bc3a75, training 650b9f0e12d6f563 (periods equal to the baseline's training demand); `ramp-k-counted-min2` shipped 583834696da85cfd, training 514c17c9f88af777. The two candidates' shipped stations files are byte-identical. The demand hashes differ from the baseline's because the provenance records the rule.
- Flow to the SR-24 westbound mainline gate (PM, veh/h, demand file): shipped 3,778 to 3,677 (AM 3,159 to 3,101); training 4,156 unchanged with `ramp-k-counted`, 4,156 to 3,738 with `ramp-k-counted-min2` (AM 3,859 to 3,435). Total PM trips: shipped 31,283 to 30,550; training 28,715 unchanged or 28,202.
- Static fit, PM, final assignment against target (the fit's own result, not the simulator). Shipped view, baseline to candidate: Claremont Ave on-ramp leg 724 to 698 against 598; Hudson St southbound onto the ramp 580 to 557 against 465; Clifton St off-ramp leg 711 to 692 against 617; 52nd St on 964 to 958 and off 1,045 to 1,053 against 996 and 1,024; MLK Jr Way on 1,325 to 1,331 against 1,547 and off 1,569 to 1,561 against 1,614; Telegraph Ave on-ramp 775 to 622 against a target of 657 to 536. The five diagonal stations, counted 66, 12, 23, 60, 17 (sum 178): Forest St EB 61 to 59, McAuley St EB 37 to 33, 60th St EB 34 to 25, Ayala Ave NB 49 to 46, Howell St SB 34 to 30; sum 215 to 193. Training view (fitted stations only; McAuley St, 60th St and Ayala Ave are held out and have no static row): with `ramp-k-counted-min2`, Claremont Ave on-ramp 894 to 840 against a stand-in of 793 and a count of 598, Forest St EB 65 to 60, Howell St SB 31 to 29, Hudson St southbound 686 to 627; with `ramp-k-counted` all unchanged.
- `npx vitest run tools` passes (424 tests, 5 skipped). The full `npm test` with the Rust tests was not run.

## What is not known

- Whether the simulator follows the fit. In the baseline the shipped fit has the Claremont Ave on-ramp at 724 and the simulator at 740 to 853, so a static change of 26 may or may not show.
- Whether K is the same for ramps with and without a counted hour. Counted ramps are the large ones at the 52nd St and MLK Jr Way interchanges and the two Claremont Ave ramps. The Broadway Terrace and Caldecott Lane ramps are much smaller.
- The year mismatch. The 2012 ADT rows predate the 2019 and 2024 rows, which fell (the 52nd St on-ramp 19,400 to 18,300). The estimate uses the nearest year, and the 2016 and 2017 segment rows for the 52nd St and MLK Jr Way off-ramps are the only ones near their 2013 counts.
- The AM and midday values rest on the assumed period factors; no AM ramp hour is counted.

## Risks

- All candidates may fail. Then the record says so and nothing published changes.
- Lower ramp targets reduce the through volume on the freeway side of the demand. The keep rule's D5 shares and the whole-street counts are the check for cars moving elsewhere.
- A candidate may pass the fitted-station counts because the ramp targets it moved are easier to meet. The second fill of the keep rule (without those stations) is the check.
