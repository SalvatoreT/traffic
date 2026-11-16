## 1. Ashby Ave / Claremont Ave from the field observations

- [x] 1.1 Check that `npm run data` reproduces network 6a8285d5076f9ddc and demand bef51b684a8c079c and that PM seed 1 matches round 34's report.
- [x] 1.2 Importer: an observation may give only the lane coding (`noLeftTurnLane`), with a test.
- [x] 1.3 Ashby Ave eastbound two lanes on the approach (`osmTagOverrides`, way 34361024), worksheet lane coding (no left-turn lane); Claremont Ave southbound own phase; Ashby Ave westbound checked against the worksheet and OSM. No link renumbered.
- [x] 1.4 Measure PM seeds 1 to 10 and 11 to 20 on the shipped demand and on round 33's iteration-2 and iteration-3 demand: cars cleared from gridlock by node, Claremont Ave and Ashby Ave throughput against the counts, through cars, headline shares. Keep or revert under the step rule.

## 2. Queue-first left turns

- [x] 2.1 Rerun with `--queue-first-left` on the shipped and iteration demand, both seed sets; switch it on only if gridlock clearing gets worse nowhere.

## 3. Delay-feedback fit

- [x] 3.1 `tools/cost-loop.ts --no-stop` to convergence under the unchanged acceptance rule; an accepted iteration becomes the shipped demand (frozen split unchanged).

## 4. Evaluation and record

- [ ] 4.1 Tests, WASM parity, trace on/off identity, `tests/cut_through_shift.rs`.
- [ ] 4.2 Validation suite; PM seeds 1 to 10 and 11 to 20, AM and midday seeds 1 to 10; `npm run assess -- --publish --noise`.
- [ ] 4.3 Round 35 in the calibration record (older rounds archived, every file under 200 KB); the area's `calibration` note; `tsx tools/import-osm.ts`.
