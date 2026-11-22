> Round 32 ran on 2026-11-16 (`data/calibration/rockridge.record-archive-*.md`). Archived late, on 2026-11-22; its requirements were merged into the specs by hand first, so the archive ran with --skip-specs.

## Why

After round 31 the PM peak still sends too many through cars down Hillegass Ave and Colby St southbound (155 and 160 an hour against counted ranges of 79 to 120 and 39 to 117), and Forest St eastbound carries four times its count. The delay-feedback fit can bring the southbound blocks into range, but only by loading the arterials until the PM peak is unstable. The lead's reading is that the arterials have a capacity deficit: the real ones carry their counted PM volumes without gridlock and the model's cannot. Rounds 29 and 30 named the candidates (lane use around a left-turn queue, the closely spaced signals at the SR-24 interchange and at 52nd St and 51st St, the College Ave / Claremont Ave / 62nd St signal) and did not try them. This round tries each as its own measured step and keeps a step only when both the validation suite and the network improve.

## What changes

- Step 1, diagnosis with no model change: on the delay-feedback demand of round 31 (iteration 2, built to a scratch output), PM seeds 1 to 4, where removals and the longest queues are, with throughput against the nearest count and against a saturation-flow capacity for the modeled timing [FHWA-SIG2004], ranked by the through cars whose arterial alternative they slow. `calibrate --node-report` writes the per-link and per-signal figures this needs.
- Step 2: lane changes along a link by MOBIL [Kesting2007]. Through drivers move to a free lane around a waiting left-turner or an obstruction, and drivers change toward a lane that serves their next movement, including into a left-turn pocket. New validation cases l1 (a pocket that overflows every cycle) and l2 (a two-lane link with one lane blocked). `calibrate --no-lane-changes` for A/B runs.
- Step 3: closely spaced signals. Two signals joined by at most 120 m of road, directly or straight on through uncontrolled nodes, run one cycle (the longer of theirs) and the downstream green for the joining road starts one travel time after the upstream green, in the busier direction [FHWA-STM2008] ch. 6. `calibrate --coord-max-m` for A/B runs. Cases c1 and c2 report the uncoordinated value beside the coordinated one.
- Step 4: the observed 2010 PM plan at College Ave / Claremont Ave / 62nd St [SafewayCollege-DEIR2011] retested on the new engine. Kept only if stability holds.
- Step 5: `npm run data` (network, demand and frozen split unchanged), the delay-feedback fit to its stop rule, the validation suite, ten seeds in each period, the station assessment, `--od-costs`, round 32 in the calibration record and the area's `calibration` note.

## Capabilities

### New Capabilities

### Modified Capabilities

- `traffic-simulation`: lane changes along a link; one cycle and travel-time offsets for closely spaced signals.
- `calibration`: validation cases l1 and l2; `calibrate --node-report`, `--no-lane-changes` and `--coord-max-m`.

## Impact

- `crates/sim/src/sim/lanechange.rs` (new), `sim.rs`, `sim/diag.rs`, `eff.rs`, `params.rs`, `model.rs`, `validate.rs`, `bin/calibrate.rs`: the simulator fingerprint changes and every run changes; native and WASM stay bit-identical.
- `data/calibration/*` (validation results, a new unreviewed deviation l1, cost loop, record, assessment), `data/areas/rockridge.json` and `public/data/areas.json` (calibration note). No link is renumbered and the frozen split is unchanged.
