## 1. Measurement
- [x] 1.1 Select-link recording in the sim core
- [x] 1.2 Native calibration CLI and report
- [x] 1.3 Diagnostics for the gridlock at full demand

## 2. Network and demand fixes
- [x] 2.1 Collapse roundabout rings
- [x] 2.2 Gate direction flags; routable flows only

## 3. Tuning
- [ ] 3.1 Stable baseline at full demand
- [ ] 3.2 Fit headline select-link shares
- [x] 3.3 Calibration record

## 4. Publish
- [x] 4.1 UI calibration status
- [ ] 4.2 Regenerate data and re-publish to R2
- [ ] 4.3 Archive change

## 5. Second round (junctions, boundary, ramps)
- [x] 5.1 Importer junction joining with `junctionJoinRadius` (spec delta, tests); dead signal-cluster code removed from the simulator
- [x] 5.2 Study area from ordered `boundary` streets, boundary links inside
- [x] 5.3 Claremont Ave and SR-24 ramp terminals checked; re-route share raised
- [ ] 5.4 Reach D4 (zero gridlock removals) and the Hillegass SB freeway share

## 6. Third round (signals and ramp terminals)
- [x] 6.1 Signal phases by street name with bearing fallback, up to four phases; tests on a synthetic skewed five-leg junction
- [x] 6.2 Adaptive Webster splits every 5 min with pinned user cycles; tests for the 4:1 imbalance and determinism
- [x] 6.3 Off-ramp lanes checked against OSM (kept per segment, test added); queued ramp vehicles wait instead of being removed
- [x] 6.4 Re-route share re-checked (30 / 50 / 80%), kept at 80%
- [x] 6.5 `assumedGateScale` re-checked up to 0.7; stays 0.35 (D4 not met)
- [x] 6.6 Headline shares and arterial flow ratios re-measured; ramp direction split tried and not kept
- [ ] 6.7 Reach D4 (zero gridlock removals): remaining removals sit on Telegraph near the SR-24 ramps

## 7. Wider model area
- [x] 7.1 Extend the extract, network and demand to the wider area; study area unchanged
- [x] 7.2 Browser performance at the larger size
- [ ] 7.3 Fine-tune round on the wider network with all modes
- [ ] 7.4 Reach D4 on the wider network (SR-24 west-end ramp capacity, south-edge corner, spread-out gridlock)

## 8. Validation of the simulator's primitives
- [x] 8.1 Benchmark suite in `crates/sim` (`validate` module, `validate` binary, `tests/validate.rs`) covering saturation flow, signal capacity with turns, close signals, all-way and two-way stops, circles, link capacity, gate insertion, ramps, other modes and junction traversal
- [x] 8.2 Verify and add the sources the ranges need to `docs/references.md` ([FHWA-SIG2004], [FHWA-STM2008], [Treiber2014], [TxDOT-TSAP], [NCHRP08-135])
- [x] 8.3 Fix the mechanisms found: turn-speed backstop, IIDM with cited urban means, gate entry speed, crossing conflicts that end at the conflict point, queue roll-up at stop signs; golden-metrics values replaced
- [x] 8.4 Record the steps, describe the suite in the calibration README, update the area calibration note, restore `assumedGateScale` 1.0
- [x] 8.5 Remaining deviations: the adaptive-plan case reframed and passing (c5, c6; the plan was right and the case wrong); start-up lost time, circle entry at high circulating flow and two-lane pocket overflow stay listed with their mechanisms
- [ ] 8.6 Reach D4 at full demand (the PM peak is stable at demand scale 0.4, not above 0.45)

## 9. Demand audit and gate placement (sixth round)
- [x] 9.1 Demand audit: relevance of every trip to the study area, per-gate table, cordon check (`tools/lib/demand-audit.ts`, `data/demand/<area>.audit.md`)
- [x] 9.2 Peripheral trips: corner-clipping drop and per-gate cap, config-driven and logged (`peripheral`)
- [x] 9.3 Through-trip balancing keeps counted gates at their counts; no double counting found
- [x] 9.4 Class default ADT from counted streets (`classDefaultFromCounts`), `assumedGateScale` removed
- [x] 9.5 Adaptive plan on a saturated arterial: mechanism found, case c5 reframed, case c6 added
- [x] 9.6 South and west edges moved inward, importer warning for gates within 60 m of a signal, LODES blocks outside the box dropped
- [x] 9.7 Walking and biking count scaling without a clamp, fitted on the final flow list
- [x] 9.8 Re-run: validation suite and all three periods at scale 1.0 (seeds 1 to 3), demand scales that meet D4, reports, record
- [ ] 9.9 Reach D4 at full demand (met at 0.4 PM, 0.35 AM, 0.6 midday; the SR-24 west-end ramps and the arterial signals behind them limit it)

## 10. Count-constrained demand (seventh round)
- [x] 10.1 Static free-flow assignment in `tools/lib/assign.ts` with the simulator router's generalized cost, one-ways, turn bans and per-period bans; tests on a toy network
- [x] 10.2 Count stations as link constraints: gate counts, turning-movement legs, Caltrans AADT stations inside the model, ramp ADT (`tools/lib/demand-fit.ts`)
- [x] 10.3 Matrix adjustment with per-flow bounds and the median rule for uncounted flows (`tools/lib/fit-counts.ts`); [VanZuylen1980] and [Willumsen1981] verified through Crossref and added to `docs/references.md`; tests for convergence on a toy case with two stations, for the bounds and for gate counts by origin and destination
- [x] 10.4 Capacity guard from the validation suite's measured values, held in `countFit.capacityGuard.capacity`; counted links exempt; counts win a conflict
- [x] 10.5 Fit report `data/demand/<area>.fit.md`: offered trips by type before and after, station ratio tables, factor distribution, flows at bounds, guard links, gate consistency
- [x] 10.6 Re-run: three periods at scale 1.0, seeds 1 to 3, one 120-minute PM run, scale sweeps, reports replaced, record round, README method steps 12 to 16
- [x] 10.7 Area `calibration` entry: `defaultPeriod` and `experimentalPeriods` in the type and copied by the importer
- [ ] 10.8 Reach D4 in the PM and AM peaks at full demand (PM: removals 7 to 10 and 3% backlog at the SR-24 west-end mainline gate; AM: 0 to 5 removals)
- [ ] 10.9 Reach D5 (the count fit moved the freeway-bound trips toward Hillegass Ave NB and away from Colby St SB; 1 of 4 PM headline shares within 10 points)

## 11. Demand fit: convergence, observed shares, restrained assignment, ramp pools (eighth round)
- [x] 11.1 Fit stopping rule: convergence on the unblocked count stations, stall detection, tension and blocked stations excluded and reported with the stations that oppose them (`tools/lib/fit-counts.ts`); the old criterion could never hold because three stations conflict; tests for conflicts, consistent stations and the bounds
- [x] 11.2 Gate groups: gates that split one count are one station (`gate group <id>`), so the Tunnel Road pair is one station on the pair's trips
- [x] 11.3 Observed route shares as ratio constraints (`tools/lib/share-targets.ts`, `countFit.shares`), headline select-link and Claremont ramp via-street shares, weight 0.5 below the counts; tests on the toy cross; report with and without
- [x] 11.4 Assignment that follows the simulator's route choice (cost-to-go walks with per-driver noise) and averages passes over BPR link costs (`assignMsa`); [PowellSheffi1982] and [Spiess1990] verified through Crossref and added to `docs/references.md`; tests on a two-route toy network; before and after agreement with the simulator
- [x] 11.5 Mechanism of the Telegraph Ave share of the Claremont on-ramp trips: ramp trips were drawn per mainline gate over the ramps it reaches, so the whole west side was sent to the one on-ramp that reaches the west-bound gate; drawn per ramp with an access decay now; the calibration report counts the ramp via shares over the trips from the north and resolves "north of Alcatraz Avenue" to its links
- [x] 11.6 52nd St off-ramp at 0.47 of its count: found in the simulator's merge rule at the 52nd St merge (one vehicle at a time onto a multilane exit); rule changed and a validation case (i4) and a unit test added
- [x] 11.7 SR-24 west-end stub: lane counts match OSM; lane choice by branch tried and not kept (no effect); the isolated gate run carries its counted volume, so the shortfall comes from the surface demand that shares the junctions behind the ramps
- [x] 11.8 Re-run: PM, AM and midday at scale 1.0 (seeds 1 to 3), one 120-minute PM run, reports replaced, record, README, area `calibration` entry
- [ ] 11.9 D4 and D5 (see 12.9)

## 12. Freeway-edge stubs, one count once, right turn on red, measured costs (ninth round)
- [x] 12.1 Importer: freeway-edge stubs merged into one mainline gate per direction and end (`freewayGateMergeM`), parallel stub links joined, fork gates cleared; ramp reachability check with a warning and a list; tests on a synthetic fork and on Rockridge
- [x] 12.2 Demand: per-ramp pools kept (the merged gate reaches 9 to 10 ramps up to 4.5 km apart); A/B recorded
- [x] 12.3 Stations carry their source records; a gate station and a link station on the same record are one constraint (the link station stays); the build fails when a record is used more than once; test in `tools/station-records.test.ts`
- [x] 12.4 Simulator: right turn on red after a stop (ASSUMPTION, switch `no_right_turn_on_red`), validation cases b10 and b11, golden metrics updated with the reason
- [x] 12.5 Simulator: the adaptive plan counts the queue standing on every link feeding an unsignalized merge that the queue has reached; calibration report lists the phases of the five most blocked signals
- [x] 12.6 Select-link comparison of assignment and simulator (`calibrate --select-od`, `ASSIGN_DUMP`), record
- [x] 12.7 Cost loop (`tools/cost-loop.ts`, `linkMeanDelayS`, optional `countFit.assignment.measured`): run three iterations; shares 12.6, 9.9, 15.1 points off and PM removals 0, 4.7, 4.7, so iteration 0 is kept
- [x] 12.8 Re-run: PM, AM and midday at scale 1.0 (seeds 1 to 3) and a 120-minute PM run; reports replaced, `public/data/*` regenerated, record, READMEs, area `calibration` entry (`uncalibrated`, PM experimental, default midday); D4 holds in midday, fails in the PM peak in 2 of 3 seeds and in AM in 1 of 3
- [x] 12.10 Staggered T-junction join (`staggeredJoinRadius`, 14 pairs, Colby St/62nd St), tests, README and spec; final numbers re-run on the resulting network
- [ ] 12.9 Reach D4 in the PM peak in every seed and D5 (Colby St SB to the freeway is 18 points under); long-peak entry backlog at two gates (120-minute run: 2.6%)
