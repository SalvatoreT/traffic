## 1. Left turns at signals as primitives

- [x] 1.1 Find and verify a source for permissive left capacity with sneakers ([Fambro1991]; [FHWA-STM2008] 4.8.4 re-read) and add it to `docs/references.md`.
- [x] 1.2 Validation cases p1 to p3 against the [Fambro1991] method; check how the simulator serves a permissive left (gap estimate of a starting opposing car, courtesy wait, sneakers).
- [x] 1.3 Queue-first left-turn model as `Config::queue_first_left` and `calibrate --queue-first-left`; measure it on the suite and the network (shipped and iteration-2 demand, PM seeds 1 to 20); keep it off (network less stable).
- [x] 1.4 l1: the [Fambro1991] capacity and the queue-first value in its note; range unchanged; deviation not reviewed. New deviations p2, p3, b13 listed as not reviewed.
- [x] 1.5 Ashby Ave / Claremont Ave: OSM tags, the 2010 PM worksheet, the field observation relayed by the project lead; an observed phase without timing in the engine and importer; the observation in the area config; validation case b13.

## 2. Ashby Ave / Claremont Ave on the iteration-2 demand

- [x] 2.1 Rebuild round 32's iteration-2 demand to a scratch output (reproduces round 32's seed 1 exactly) and run PM seeds 1 to 20 with and without the protected left: Claremont Ave northbound throughput, removals by node.

## 3. Delay-feedback fit

- [x] 3.1 `npm run data`: network changes at one signal, demand flows and frozen split unchanged, no link renumbered.
- [x] 3.2 `tools/cost-loop.ts --no-stop` to convergence under the unchanged acceptance rule.

## 4. Evaluation and record

- [x] 4.1 Tests, WASM parity, trace on/off identity, `tests/cut_through_shift.rs`.
- [x] 4.2 Validation suite; PM, AM and midday seeds 1 to 10 and PM seeds 11 to 20; `npm run assess -- --publish --noise`; `--od-costs`.
- [x] 4.3 Round 33 in the calibration record (older rounds archived, every file under 200 KB); the area's `calibration` note; `tsx tools/import-osm.ts`.
