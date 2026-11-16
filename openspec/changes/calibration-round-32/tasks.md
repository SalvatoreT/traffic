## 1. Locate the deficit

- [x] 1.1 `calibrate --node-report`; build the delay-feedback demand of round 31 (iteration 2) to a scratch output and check it reproduces the stored runs.
- [x] 1.2 PM seeds 1 to 4 with `--node-report` and `--od-costs`: removals, queues, throughput against counts and saturation-flow capacity, through cars whose arterial alternative each location slows.

## 2. Lane changes along a link

- [x] 2.1 Re-read the MOBIL equations and parameter values ([Kesting2007], arXiv 1012.4913 and Treiber's page).
- [x] 2.2 `sim/lanechange.rs`: safety, incentive, forced changes toward the next movement and into the pocket; `Config::lane_changes`, `calibrate --no-lane-changes`.
- [x] 2.3 Validation cases l1 and l2; l1 listed as an unreviewed deviation.
- [x] 2.4 PM seeds 1 to 20 with and without, shipped and delay-feedback demand: keep or revert.

## 3. Closely spaced signals

- [x] 3.1 Common cycle and travel-time offsets for signals joined by at most 120 m, through uncontrolled nodes; `Config::coord_max_m`, `calibrate --coord-max-m`; c1 and c2 notes give the uncoordinated value.
- [x] 3.2 PM seeds 1 to 20: keep or revert; why round 29's attempt failed.

## 4. College Ave / Claremont Ave / 62nd St

- [x] 4.1 Observed 2010 PM plan on the new engine, PM seeds 1 to 20: keep only if stability holds.

## 5. Demand, evaluation and record

- [ ] 5.1 Tests, WASM parity, trace on/off identity; commit.
- [ ] 5.2 `npm run data` (network, demand and split unchanged); delay-feedback fit to its stop rule.
- [ ] 5.3 Validation suite, ten seeds PM, AM and midday, assessment, `--od-costs`.
- [ ] 5.4 Round 32 in the calibration record (older rounds archived), the area's `calibration` note, `tsx tools/import-osm.ts`.
