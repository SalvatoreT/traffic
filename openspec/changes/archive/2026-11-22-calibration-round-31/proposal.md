> Round 31 ran on 2026-11-16 (`data/calibration/rockridge.record-archive-*.md`). Archived late, on 2026-11-22; its requirements were merged into the specs by hand first, so the archive ran with --skip-specs.

## Why

Round 30 found that most of the excess through cars on Hillegass Ave and Colby St southbound, 62nd St eastbound and Forest St eastbound drive a route the router itself ranked costlier at departure (a median 40 to 74 s, about 10%, more). The cause is the form of the route-choice error: the walk scales each candidate's whole remaining cost by a fresh factor (1 +/- 8%, `ROUTE_NOISE`, an unsourced ASSUMPTION) at every node it passes. A side-street grid offers a new draw at every block, so a route's chance of being taken depends on how many decision points it has, not only on its cost. Changing the size of the factor does not help: round 30 measured 0, 0.04, 0.08 and 0.16 and none fixes it.

## What changes

- Route choice becomes probit stochastic loading [DaganzoSheffi1977], [Sheffi1985]: each driver perceives every arc (a movement and the link it enters) with a normal error of variance `ROUTE_DISPERSION_S` x the arc's measured cost, drawn once for the trip from the driver's seed, and routes and re-plans on its perceived costs by an exact shortest path. A route's perceived variance is then the dispersion times its cost, however many junctions it has. The per-node factor and `ROUTE_NOISE` are removed.
- Departure routes, en-route re-planning (guided drivers, blocked routes), the assumed-movement (`via`) routes, the cut-turn bypass legs and the initial loading all use the same perceived costs. A waiting trip's route is kept until the costs change, so the search is not repeated at every step.
- The demand fit's static assignment (`tools/lib/assign.ts`) loads flows by the same model: each draw samples perceived link and movement costs and loads every flow on its shortest path ([Sheffi1985] ch. 11.2). The config's `noise` becomes `dispersion`.
- Validation cases r1 to r6: two routes of equal cost where one offers 1 or 20 side links onto the other must split near 50/50, and the share of a costlier route must follow the probit prediction.
- The dispersion is an ASSUMPTION (no value for urban street networks was found), chosen by a sweep judged on fitted evidence only.
- `calibrate --route-dispersion` overrides it for sweeps.
- Demand rebuilt, the delay-feedback fit rerun, ten-seed evaluation, round 31 of the calibration record, the area's `calibration` note.

## Capabilities

### New Capabilities

### Modified Capabilities

- `traffic-simulation`: route choice on perceived costs drawn once per driver.
- `demand-model`: the static assignment loads by probit draws.
- `calibration`: route-choice validation cases; `calibrate --route-dispersion`.

## Impact

- `crates/sim/src/route.rs`, `sim.rs`, `sim/initial.rs`, `sim/via_bypass.rs`, `sim/modes.rs`, `wander.rs`, `params.rs`, `model.rs`, `validate.rs`, `bin/calibrate.rs`, tests: simulator fingerprint changes; every run changes; native and WASM stay bit-identical. A PM run takes about 40 s instead of 30 s.
- `tools/lib/assign.ts`, `tools/lib/demand-fit.ts`, `tools/build-demand.ts`, `data/demand/rockridge.config.json`, regenerated demand.
- `docs/references.md` ([DaganzoSheffi1977], [Sheffi1985]); `data/calibration/*`, `data/areas/rockridge.json`, `public/data/areas.json`. Stored proposal results, text pages and previews stay stale until regenerated.
