## 1. Simulator
- [x] 1.1 `crates/sim/build.rs` computes the fingerprint; `FINGERPRINT` in the lib; `simulatorFingerprint()` in the WASM wrapper; Rust test for its shape
- [x] 1.2 Worker posts a `version` message before the first build; client callback

## 2. Precompute
- [x] 2.1 `tools/lib/run-result.ts`: load the WASM in Node, build and run like the worker
- [x] 2.2 `src/lib/stored-results.ts`: key, encoding, verdict, parse, fetch
- [x] 2.3 `tools/precompute-results.ts` and `npm run data:results`: all proposals, all periods, shared baselines, incremental, index, sizes
- [x] 2.4 Tests: key, encoding, match and mismatch of each input; stored equals a fresh run, a reset run and a different step size

## 3. App and Worker
- [x] 3.1 Lookup on open and on change; finished state from a stored result; "Run again"; note and announcements
- [x] 3.2 No stored result: run to the end at Max when opened with a scenario
- [x] 3.3 Open on the map sets the period and 100% demand; links with interventions name the period
- [x] 3.4 `MapView` `still`: layers and marks without cars
- [x] 3.5 Worker serves `/data/results/<area>/<file>`; 404 for a missing result; tests

## 4. Verify and ship
- [x] 4.1 `npm test`, `npx tsc --noEmit -p .`
- [x] 4.2 Browser check at 1280 px and phone width
- [x] 4.3 `data/README.md`, `AGENTS.md`; precompute all; archive; commit and push
