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

