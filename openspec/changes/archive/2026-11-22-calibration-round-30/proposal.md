> Round 30 ran 2026-11-15 to 2026-11-16 (`data/calibration/rockridge.record-archive-*.md`). Archived late, on 2026-11-22; its requirements were merged into the specs by hand first, so the archive ran with --skip-specs.

## Why

Round 29 left the southbound through cars on Hillegass Ave and Colby St at about 1.6 and 1.8 times the top of their counted ranges, with 62nd St and Forest St eastbound at three to four times their counts, and found that drivers choose the side streets at departure from the simulated costs. It did not say which trips those are or which cost makes the side street cheaper. Removals (4.5 an hour in the PM peak, 2.0 in the AM peak) still fail the stability rule, and the demand was fitted against the old engine's delays.

## What changes

- Diagnosis first. `calibrate --od-costs` writes, for every through trip on the counted blocks and on named links, the router's cost of the route it drove and of the best arterial route on the costs in force at departure, split into its terms, and the links where the arterial alternative loses time. Run on the repaired and the historical engine, PM seeds 1 to 4.
- Repaired: `reset_results` cleared the trip records at the end of the settle interval but not the trip timings, so the two lists no longer matched by position.
- Removal hot spots checked against OSM. Two import repairs: the importer reads the lane count of a one-way chain from `turn:lanes` when the `lanes` tag is missing (Stanford Ave at Market St and at Martin Luther King Jr Way, 51st St), applied after chain merging so no link id changes; and the area config can correct OSM tags (`osmTagOverrides`), used for the one-lane northbound tag on Telegraph Ave north of 55th St (ASSUMPTION pending a field check).
- The delay-feedback fit (`tools/cost-loop.ts`) rerun on the repaired network; its acceptance rule no longer reads held-out stations.
- Evaluation: validation suite, ten-seed summaries of all three periods, round 30 of the calibration record, the area's `calibration` note.

## Capabilities

### New Capabilities

### Modified Capabilities

- `calibration`: `calibrate --od-costs`; the cost loop's acceptance rule.
- `traffic-simulation`: trip records and timings cover the same trips.
- `street-network`: OSM tag corrections from the area config; lanes from turn lanes.

## Impact

- `crates/sim/src/sim/initial.rs`, `crates/sim/src/sim/diag.rs`, `crates/sim/src/sim.rs` (one module line), `crates/sim/src/bin/calibrate.rs`, `crates/sim/src/bin/calibrate/odcost.rs`: simulator fingerprint changes; native and WASM stay bit-identical.
- `tools/lib/network.ts`, `tools/lib/types.ts`, `tools/cost-loop.ts`, `tools/import-osm.test.ts`; `data/areas/rockridge.json`; regenerated network and demand.
- `data/calibration/*`, `public/data/areas.json`. Stored proposal results, text pages and previews stay stale until regenerated.
