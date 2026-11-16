## 1. Ashby Ave / Claremont Ave: the worksheet plan on the default engine

- [ ] 1.1 Per-approach clearance and the no-left-turn-lane coding in the engine and the importer, with tests.
- [ ] 1.2 The worksheet plan in `signalObservations` (PM DATA; AM and midday the PM plan reused, ASSUMPTION); the engine's plan check accepts it.
- [ ] 1.3 Measure PM seeds 1 to 10 and 11 to 20 on the shipped demand and on round 33's iteration-2 and iteration-3 demand: gridlock clearing by node, Claremont Ave and Ashby Ave throughput against the worksheet and Caltrans counts, through cars, headline shares.

## 2. Queue-first left turns

- [ ] 2.1 Rerun with `--queue-first-left` on the shipped and iteration demand, seeds 1 to 10 and 11 to 20; switch it on only if gridlock clearing does not get worse on either demand on both seed sets.

## 3. Delay-feedback fit

- [ ] 3.1 `npm run data` (network changes at one signal; frozen split unchanged; no link renumbered).
- [ ] 3.2 `tools/cost-loop.ts --no-stop` to convergence under the unchanged acceptance rule.

## 4. serde_json float round trip

- [ ] 4.1 `float_roundtrip` in `crates/sim/Cargo.toml`; a solo seed-1 report and the `--seeds` copy byte-identical apart from the revision stamp; simulation numbers unchanged.

## 5. Evaluation and record

- [ ] 5.1 Tests, WASM parity, trace on/off identity, `tests/cut_through_shift.rs`.
- [ ] 5.2 Validation suite; PM seeds 1 to 10 and 11 to 20, AM and midday seeds 1 to 10; `npm run assess -- --publish --noise`.
- [ ] 5.3 Round 34 in the calibration record (older rounds archived, every file under 200 KB); the area's `calibration` note; `tsx tools/import-osm.ts`.
