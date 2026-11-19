## Context

Baseline for this round: the published model of 2026-11-18, unchanged by rounds 44 to 49. Network 53c823f20d9165ed, demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9. Ten seeds per period: PM fitted 74 of 92 recent stations within GEH 5, PM held out 14 of 24, AM fitted 70 of 77, AM held out 14 of 19, D5 4 of 4, whole-street traversals 8 of 8, D16 holds, validation 67 of 74.

Round 49 ran the simulated-membership loop with one-sided ceilings on the car total of every gate direction that no gate count holds, anchored on the static fit. The ceilings held: no gate grew, D16 held in every period, the PM diagonal fell from 495 to 355 (counted 178), and the screen passed. The ten-seed keep rule failed on three lines: PM held out 13 of 24, D5 headline shares 2 of 4, and whole-street traversals 7 of 8 (PM Colby St southbound, modeled 81 against 39). The fit turned 20 to 26% of through demand into local demand (+829 veh/h shipped PM, +704 shipped AM).

The project lead's laptop broke that growth down (archived round 49 `evidence/laptop/nodes50-shipped.md`, `nodes50-training.md`, `shares50-pm.md`, produced by `nodes50.cjs` and `shares50.cjs`, commit 05906b8 on the dev branch):

- Shipped PM, local flows by their ends (veh/h, change from the baseline): outside node to gate +480, outside to outside +339, gate to outside +102. Flows that touch a study-area node: in to gate +9, in to in +6, gate to in -21, outside to in -42, in to outside -45, together -93. None of the growth is at a study-area node.
- Non-gate origin nodes: 841 with trips; the study area's 57 nodes fell from 951 to 648 veh/h in all and the 784 outside nodes rose from 9,524 to 10,537. Many grew from near zero (node 1210, Hillegass Ave and Woolsey St, origin 1 to 92; node 659, Carberry Ave and 56th St, 1 to 72; node 1373, Domingo Ave and Ashby Ave, 3 to 101).
- Colby St southbound, PM, shipped view, ten-seed means (cars per hour): not headed to the freeway 151.5 to 187.2, headed to the freeway 106.1 to 83.1, all cars on the block 257.6 to 270.3. The whole-street traversals there went from 56.5 to 81.5 against 39 observed, and the extra cars mostly turned in from Alcatraz Ave (from Alcatraz Ave eastbound 58.9 to 69.7, westbound 43.4 to 73.1).

The round 49 ceilings cover gates only, and the fit put its new trip ends at ordinary nodes. That the extra local trip ends caused the Colby St southbound overshoot is an inference from these tables: no trip was traced from its origin to the block.

## Decisions

The lead made D1 to D7 on 2026-11-19, before any run, and they are recorded here as the lead's. Preparation choices follow as P1 to P6 and are marked as such.

D1. (Lead.) No simulator change. Fingerprint d45a275dd7be0713cec6a64394b7d8a9. Baseline network 53c823f20d9165ed, demand 9cdebdabf05c4460, training 2f9ae152b9bbf78e.

D2. (Lead.) Extend the round 49 mechanism with a scope option: `countFit.gatePriorTotals: { "anchor": "staticFit", "tolerancePct": 0, "weight": 10, "scope": "allNodes" }`. A missing scope means `gates`, which is the round 49 behavior unchanged (its tests keep passing). With `allNodes`, every node that is an origin or a destination of any car flow in the period gets a ceiling per direction at its static-fit car total: same anchor, same soft weight, same hard projection, same exclusion from the touched and counted tests, same "only when simulated membership is in use". Gate directions covered by a surviving gate-kind station stay uncapped, as in round 49. A node direction with a static-fit total of 0 has a ceiling of 0 only if flows exist for it; if that is awkward in the multiplicative fit, a tiny total stands in and the design says so. Meaning: simulated membership may move trips among pairs but may not add trip ends at any node, so through demand cannot be converted into local demand. ASSUMPTION: a regularizer toward the static fit. No verified reference gives a weight or a hard total (`openspec/changes/archive/2026-11-19-calibration-round-48/literature.md`). [Cascetta1993] and [Toledo2013] are cited only for what their entries in `docs/references.md` say: both feed outdated or historical demand into a count-based estimate as a prior.

D3. (Lead.) Reports. As in round 49, plus per period: a split of the ceiling stations into gate and non-gate (count, above ceiling, excess, volume removed by the projection), offered demand by flow type static against final, and non-gate node totals inside and outside the study area (origins and destinations) static against final. The loop driver prints the same per pass. `GATE_PRIOR_DUMP` stays.

D4. (Lead.) One candidate, `node-ceiling-membership.json` (`allNodes` ceilings and the round 48 `simulatedMembership`). The loop, then the screen, then ten seeds if the screen passes. Three passes as before. The 3% abort stays (it compares total offered demand to the static fit). Added, written before any run: the driver also reports, per pass, total offered demand as a share of the static fit, and the runbook says to stop and report if after the final build total offered car demand in any view and period is more than 10% below the static fit. The 10% is an ASSUMPTION. With every node capped the fit can only cut, and a large cut would mean it is trading volume for fit.

D5. (Lead.) Keep rule unchanged: PM fitted at least 74 of 92, PM held out at least 14 of 24, AM fitted at least 70 of 77, AM held out at least 14 of 19, D5 4 of 4, whole-street 8 of 8, D16 holds in every period, validation 67 of 74. Screen as in round 49: three seeds (1 to 3), AM and PM, no verdict; a candidate gets ten seeds only if each of the four counts is no more than 3 stations below the baseline's own three-seed screen, no car is cleared from gridlock in the judged zone, and the backlog is under 2% in 3 of 3 seeds in AM and in PM. One figure below its line fails the candidate; the rule is not loosened after a result.

D6. (Lead.) Reported, not conditions: round 49's lists (the five diagonal stations in the PM, Colby St northbound, gate totals and the SR-24 mainline gate, mean through cars per hour in the study area, every SR-24 ramp against its count or target, per-gate origin and destination totals for the 20 gates, trips waiting at the end of the run by gate, the 12 travel times), plus the PM Colby St SB and Hillegass Ave SB to-freeway numerators and denominators (cars per hour, to the freeway and not to it) and the Colby St SB whole-street figure, computed as `shares50.cjs` did. The scripts are committed in cleaned form under `scripts/` so the laptop does not rewrite them.

D7. (Lead.) Runbook for the laptop modeled on round 49's: single stage, the leftover-file refusal already in the driver, a line telling the laptop to move `target/membership-loop` and `target/membership` from round 49 aside, the expected time, the never-list, evidence under `openspec/changes/calibration-round-50/evidence/`, and commits on the dev branch `salvatoret/peaceful-fermi-dlwt0u` by merging `origin/calibration-round-50`.

P1. (Preparation choice.) `scope` lives in `GatePriorConfig` next to `gateIds`; `gatePriorStations` takes the node list from the flows when the scope is `allNodes` and from `gateIds` otherwise. Everything else in round 49's path (the static fit as a recursive `fitPeriod`, ceiling stations built inside `fitPeriod`, `ceilingOnly` so they do not mark flows as counted or touched, the projection) is reused as it is. A non-gate node is never named by a gate station, so under `allNodes` only gate directions can be covered.

P2. (Preparation choice.) A node direction with a static-fit total of 0 gets no ceiling. The fit scales every flow by a factor, so a flow at 0 stays at 0 and a node whose flows are all 0 cannot gain trip ends. A ceiling of 0 would also be dropped by the fit's `target > 0` filter. So the zero case needs no station, and there is no tiny-total stand-in.

P3. (Preparation choice.) A ceiling at a node with a small total is a ceiling at that small total: node 1210 as an origin stays at about 1 veh/h plus the 0.1% the projection allows. That is the point of the round, and it also freezes whatever error the static fit has there.

P4. (Preparation choice.) The report's trip-end figures count non-gate nodes only (a gate node is any node with `gate: true`), split by the network's `inStudyArea` flag, and read the static fit's volumes and the final volumes of every car flow of the period. They are printed whenever the entry is present, in either scope. The study-area list comes from the network (`studyIds` in the config built by `tools/build-demand.ts`).

P5. (Preparation choice.) The ceiling stations of the report's section keep kind `gate-prior` and the id format `gate-prior origin N` for every node, so every filter that skips them (the within-tolerance count, the stations output, the loop's selection) still works. The projection's worst-five table now says "Node" and marks non-gate nodes. The first line per period, which the loop parses, keeps its format. The loop's per-period summary header changes from "Gate ceiling stations" to "Ceiling stations" and gains the column "Offered / static fit".

P6. (Preparation choice.) The 10% shortfall is a warning printed by the driver after a final build, not an abort: the lead wants the numbers and the runbook tells the laptop to stop and report, as written in D4. The share is final offered car demand divided by the static fit's, read from the first ceiling line (`offeredShare` in `tools/lib/membership-loop.ts`, `CEILING_LOW_SHARE`).

## Checked in the container

All builds used `--out-root` (scratch directories), so nothing under `data/` or `public/data/` changed in the checkout. Inputs: the committed network (53c823f20d9165ed, copied from the main checkout's ignored `public/data`; its hash matches), and the OSM extract and raw demand files copied from the main checkout. A 4-core container.

1. Switch absent, with the new code: shipped demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e, stations file byte-identical to the committed one. Both builds took about 11.5 minutes side by side.
2. Entry present (`apply-candidate.py` output, scope `allNodes`), no membership file: the build says "No simulated membership file for the shipped view", the periods are identical to the baseline's (`JSON.stringify(periods)` equal), and the report has no ceiling stations. Pass 0 of the loop therefore reproduces the baseline periods.
3. Entry present with a made-up membership file (valid evidence; 8 random pairs per selected station drawn from the shipped baseline's flows, each pair taking 30% of its offered trips, 20 runs; plumbing check, not a model result; the generator is not committed). The reference is the same file and config without the entry (a second config, so a second file with its own evidence). Shipped view, three builds running at once.

   | Offered car veh/h | Static fit (baseline) | Made-up pairs, no ceilings | Made-up pairs, node ceilings and projection | Final against static fit |
   | --- | --- | --- | --- | --- |
   | PM | 27,609 | 59,301 | 25,236 | -8.6% |
   | AM | 23,202 | 53,885 | 21,404 | -7.8% |

   Round 49's gate-only ceilings gave 33,551 (PM) and 28,970 (AM) on its own made-up pairs, 21.5% and 24.8% above the static fit. With the ceilings on every node the same kind of stress ends below the static fit.

   By flow type, static fit then final: PM through 5,907 to 5,732, local 10,360 to 8,260, ramp 11,342 to 11,244; AM through 3,745 to 3,850, local 9,586 to 7,789, ramp 9,871 to 9,764. Round 49's PM local figure under its stress was 10,360 to 18,684. Here local demand falls and nothing is converted into it.

   Ceiling stations: PM 1,991 (216 gate, 1,775 non-gate), AM 2,034 (217 gate, 1,817 non-gate); none ends above its ceiling by more than 0.5 veh/h. The hard projection removed 876 veh/h in the PM (gates 558, non-gate 318; worst: node 602 77, node 675 44, node 1672 37, node 1719 32, node 1674 29) and 779 in the AM (gates 470, non-gate 309; worst: node 1719 55, node 675 53, node 952 52, node 1674 35, node 1672 31). Fitted stations within their tolerance, before and after the projection: PM 55 and 56 of 343, AM 42 and 38 of 278. The stations are mostly far off under made-up pairs, so the projection's cost cannot be read from this.

   Non-gate trip ends, veh/h, static fit to final (origins inside the study area, outside; destinations inside, outside): PM 951 to 639, 9,523 to 7,889; 734 to 429, 7,901 to 6,356. AM 612 to 474, 7,488 to 6,188; 528 to 304, 8,211 to 7,073. Every group falls and none rises, which is what the ceilings promise. For comparison the made-up run without ceilings had non-gate origins at 23,718 (PM) and 21,443 (AM) against 10,475 and 8,101 in the static fit.

   Build time: 1,166 s (19.4 minutes) for the shipped build with the ceilings, against 691 and 695 s for the other two builds that ran at the same time (the second fit plus about 3,800 more constraints, about 1.7 times as long). The three builds shared four cores for the first 11.5 minutes and the ceiling build ran alone after. Round 49's two-fit build was reported as about 15 minutes with five builds on four cores; the two figures are not comparable, and round 49's was not re-timed.
4. `npx vitest run tools/` (all pass except one timeout in `tools/import-osm.test.ts`, run while three builds used every core), `npx tsc --noEmit -p .` (only the missing WASM package) and `openspec validate calibration-round-50 --strict --no-interactive`. The new tests (`tools/node-prior.test.ts`, one addition in `tools/membership-loop.test.ts`) cover: scope absent equal to scope `gates`; one station per node direction with trips, no station for covered gates or for zero totals; a pair set that turns through demand into local demand being held where the gate scope lets it grow; the projection holding non-gate nodes; the report lines by kind and their reading by the loop; and the below-10% warning. One existing assertion changed: the loop report's column header "Gate ceiling stations" is now "Ceiling stations", and the test looks for the new header.

Reading the stress. The mechanism does what D2 says. With made-up pairs that make the fit want about twice the demand, every node direction stays at or below its static-fit total, trip ends fall at every group, and the fit cannot convert through demand into local demand. It costs volume: offered demand ends 8.6% (PM) and 7.8% (AM) below the static fit, close to the 10% line of D4 although the pairs are made up. With real pairs the figure will be different; the driver prints it for every build and warns after the final one.

## What is not known

- Whether capping every node at its static-fit total freezes the static fit's own errors at counted stations. The static fit is the baseline, which has the diagonal overshoot round 48 set out to fix. The ceilings keep the fit from adding trip ends, so a station that needs trips can only get them from pair changes (moving trips among origins and destinations). If too few such moves exist the fit stalls at counted stations; the fit report's "Stations that cannot be met" and the fitted-within-tolerance counts before and after the projection show it.
- How much the projection costs the count fit with real pairs. In round 49 it was small at gates. With about 840 non-gate nodes also capped it may be larger. The report states the volume removed by kind and the fitted stations within tolerance before and after, for every build.
- Where the demand goes now. If the ceilings hold every node, total offered demand can only fall. The driver reports offered demand against the static fit per pass and warns after the final build at more than 10% below.
- Whether the Colby St southbound overshoot follows the added trip ends. The ceilings test that: if the overshoot falls with the ends held, the inference holds; if it stays, something else produces it.
- How long a build takes. The container's measurement is in the checks above, with the constraint counts. The loop has not run with these ceilings.
- Whether the three-pass loop converges with ceilings on every node. Round 49's stop rule did not fire.

## Risks

- Over-constraint may stall the fit at counted stations. With a ceiling on every node and a hard projection after the fit, the stations that need more trips than the static fit gave them cannot be met except by moving trips among pairs.
- Ceilings at static-fit node totals freeze the static fit's errors. A node that the static fit under-served stays under-served.
- The number of constraints grows to roughly 2 x (gates + about 840 non-gate nodes) per period, so the build is slower per fit iteration; the report gives the build time.
- A ceiling at a node the simulator needs to fill (the SR-24 mainline entries, the large gates) can starve a counted ramp or movement downstream, as in round 49. The ramp table in the reported lists shows it.
- Soft ceilings leak and the projection removes the leak, so the final fit can sit a little below what the soft fit planned, and fitted stations within tolerance can fall by the projection.
- The loop's memory of the first pass is permanent in the pool (1/n weighting), as in round 48.
