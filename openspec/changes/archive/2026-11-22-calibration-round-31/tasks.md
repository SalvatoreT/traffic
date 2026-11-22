## 1. Route choice

- [x] 1.1 Verify and add [DaganzoSheffi1977] and [Sheffi1985] to `docs/references.md`.
- [x] 1.2 Perceived-cost shortest path per driver (`route::Perceived`), deviates fixed per (driver, arc); remove the per-node factor and `ROUTE_NOISE`.
- [x] 1.3 Departure, re-planning, blocked-route re-planning, assumed movements, cut-turn bypass legs and initial loading on the perceived costs; keep a waiting trip's route until the costs change.
- [x] 1.4 Validation cases r1 to r6 with the old rule's shares in the notes; `calibrate --route-dispersion`.
- [x] 1.5 Tests: trace on/off identity, cut-through fixtures (bands restated from the cost model where they move), golden metrics.
- [x] 1.6 Probit loading in `tools/lib/assign.ts`; config `dispersion`.

## 2. Dispersion

- [x] 2.1 Sweep the dispersion (each value with its own demand build), judged on fitted stations, headline shares, removals and arterial travel times; through cars reported as a check.

## 3. Demand

- [x] 3.1 `npm run data` (frozen split unchanged); delay-feedback loop to its stop rule.

## 4. Evaluation and record

- [x] 4.1 Validation suite, ten-seed PM, AM and midday, `--od-costs` breakdown, Rust and TypeScript tests, WASM parity.
- [x] 4.2 Round 31 in the calibration record (older rounds archived), the area's `calibration` note, `public/data/areas.json`.
