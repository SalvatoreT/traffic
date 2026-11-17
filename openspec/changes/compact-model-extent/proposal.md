## Why

The app is about cut-through traffic on the side streets of the Rockridge Trapezoid. The shipped model reaches 1.0 to 1.4 km beyond the study area, into the Berkeley hills north of Ashby Ave and west toward Market St, where there are few counts. Calibration rounds 33 to 37 traced gridlock and rejected demand fits to junctions out there (the Claremont Ave and Russell St all-way stop, Ashby Ave at Claremont Ave, Avalon Ave), not to junctions near the study area. The project lead decided on 2026-11-16 to build a compact model next to the current one, without touching what is published, and to compare the two before deciding whether to switch.

## What changes

- An area config can state the model extent: a polygon, a buffer distance along the network from the study area, and ways or nodes that must be in. The importer keeps only the network inside the extent and puts a gate where a way crosses the polygon edge. Without `extent` the importer behaves as before (the `rockridge` network is byte-identical).
- An area config can be marked `preview`. A preview area goes last in `areas.json` and is never the app's default; a scenario link that names it (`a=<id>`) opens it.
- `tools/build-demand.ts` drops census blocks outside the extent, so their trips arrive through the gates. Everything else in the demand build is unchanged and reads its settings from the area's demand config.
- A second area, `rockridge-compact`, with the same study area, counts and targets as `rockridge`, its own demand config, its own frozen validation split and its own outputs. It is a preview.
- An evaluation of the compact model by the same rules as the current one, and a comparison document, `data/calibration/rockridge.extent-comparison.md`.

## Capabilities

### New Capabilities

### Modified Capabilities

- `street-network`: the model extent as area data; gates where the extent cuts a way.
- `demand-model`: census blocks outside the extent are left out.
- `simulator-ui`: preview areas.

## Impact

- `tools/lib/network.ts`, `tools/lib/types.ts`, `tools/import-osm.ts`, `tools/build-demand.ts`, `src/data.ts`, `src/types.ts`, tests.
- New data: `data/areas/rockridge-compact.json`, `data/demand/rockridge-compact.config.json`, `data/demand/rockridge-compact.split.json` and the generated fit reports, stations and groups of the compact area, `data/calibration/rockridge-compact.targets.json` (a copy of the `rockridge` targets), `data/calibration/rockridge.extent-comparison.md`.
- The simulator engine is not changed. The published `rockridge` files, its split and its proposals are not changed. `public/data/areas.json` gains a preview entry when regenerated; nothing is pushed to R2 by this change.
