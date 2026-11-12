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
- [ ] 8.5 Remaining deviations: start-up lost time, adaptive plan on a saturated arterial, circle entry at high circulating flow, two-lane pocket overflow
- [ ] 8.6 Reach D4 at full demand (the PM peak is stable at demand scale 0.4, not above 0.45)

