## Context

The browser and the native command-line programs use the same Rust engine. Each simulated hour has 14,400 steps of 0.25 seconds [Treiber2015]. The wide Rockridge model has physical routes outside the Trapezoid that drivers use when an intervention closes a street.

## Decisions

### Benchmark one complete hour

The reference is commit `eef4a5d` with the published Rockridge network and demand. Compare release builds on the same host, with the same inputs, seeds, and simulated duration. Report initialization and stepping together for each fresh run. A tenfold speedup would take one tenth of the reference time. Report the measured ratio even when it falls short. Repeated reads of a cached result or a faster sweep over parallel seeds would measure a different workload.

### Preserve trajectories

Keep the model's timestep, demand, extent, numerical operations that affect agent decisions, and order of random draws. Coarser steps can change braking distances, junction admissions, and the resulting queues. Trimming the boundary changed traffic inside the Trapezoid in the earlier experiment. An index or cache can save time here when it reproduces the decisions in the reference run.

Check a morning, midday, and evening baseline and the evening proposal with filters at 63rd and Colby and 63rd and Hillegass. At simulated seconds 0, 60, 300, 600, 1,200, 1,800, 2,700, and 3,600, compare vehicle positions, signal states, link statistics, trip intents, and dashboard metrics. Also compare the final trace of trip requests and link exits. Use the same specific intervention locations in both builds.

### Work removed from each step

Route searches reuse open movements and the driver-independent part of each movement cost until costs or interventions change. A queue groups candidate links by travel time while retaining each full-precision route cost. An ordered search resolves a tie that could change the selected path. If a search processes too many entries in the same time bin, it switches the remaining entries to a heap. This bounds repeat work on roads with very small traversal costs. Walking trips that share a destination reuse distances on the sidewalk graph.

Each step checks when the next demand flow is due and visits occupied links in the existing update order. Vehicles waiting to enter keep their original priority. Junctions reuse their conflicting approaches and signals share the position in a cycle across approaches. These changes save work when many roads are empty or many agents need the same information.

### Reproducing the comparison

Fetch the two Rockridge files from the public model. The hashes identify the inputs used in this comparison even if the public files change.

| Input | SHA-256 |
| --- | --- |
| [rockridge.network.json](https://traffic.transit.directory/data/rockridge.network.json) | `53c823f20d9165ed186be3f7b31564f967383e0274a0dae6bf38017bd20f972b` |
| [rockridge.demand.json](https://traffic.transit.directory/data/rockridge.demand.json) | `2d16d8f8eb0950ca00405683e5050bf1fcdeb5623c3c56d0777fc29dd6c8c642` |

Call `Simulation::new` with these input strings and `{"period":"pm_peak","seed":1,"demandScale":1,"initialLoad":true}`. Advance with `Simulation::step(5.0)` until 3,600 simulated seconds. Repeat with seeds 2 through 5. The before and after processes alternate order across seeds and use the same native release settings (optimization level 3 with link-time optimization). Time the same final readout in each process, including dashboard metrics, vehicle positions, link counters and diagnostics.

For the intervention check, close the nodes at 63rd and Colby and 63rd and Hillegass to through cars with two `modal_filter` interventions. Their OSM node IDs are `53045610` and `53103314`. In a separate live run, apply those filters at simulated second 60 and remove them at second 600 to check caches on a running model.

For the WebAssembly timing, a fresh Node process loads the release package, initializes the same simulation, advances an hour, and reads final dashboard metrics, vehicle poses, signals and link statistics. Compare PM seeds 1, 2 and 3. Browser rendering and map loading have their own costs.

### Replay commands

Set `bench_dir` to the absolute path of the [benchmark drivers](bench) beside this file. Set `data_dir` to the directory with the two verified JSON files and `output_dir` to a writable results directory. Run these commands once in a checkout of the reference commit and once in the optimized checkout. Give each checkout its own output directory. The native driver is built as a binary in the crate so it uses the checkout's simulation code.

```sh
mkdir -p "$output_dir"
cp "$bench_dir/rockridge_hour.rs" crates/sim/src/bin/rockridge_hour.rs
CARGO_PROFILE_RELEASE_LTO=true CARGO_PROFILE_RELEASE_DEBUG=1 \
  cargo build --release -p traffic-sim --bin rockridge_hour
for seed in 1 2 3 4 5; do
  printf '{"seed":%d,"period":"pm_peak","demandScale":1,"initialLoad":true}\n' \
    "$seed" > "$output_dir/config-$seed.json"
  time target/release/rockridge_hour "$data_dir" "$output_dir/config-$seed.json" \
    3600 "$output_dir/native-$seed.json"
done
sha256sum "$output_dir"/native-*.json

CARGO_PROFILE_RELEASE_LTO=true npm run wasm
for seed in 1 2 3; do
  time node "$bench_dir/wasm-hour.mjs" "$PWD/src/sim/pkg" "$data_dir" "$seed"
done
```

For a paired comparison, alternate which checkout runs first on each seed and use one dedicated CPU per timing series. Keep both input files in the operating system's file cache.

## Results

The native mean fell from 38.49 to 20.53 seconds per PM hour across five seeds (1.88×). In Node, the release WebAssembly build fell from 47.79 to 23.96 seconds across three seeds (1.99×). Both measurements include initializing a fresh process. The mean of the five paired native time savings was 46.68% (95% Student t interval 40.10% to 53.27%). CPU time averaged 38.27 and 20.44 seconds for the native engine, and 47.45 and 23.66 for WebAssembly. The tenfold target would require 3.85 and 4.78 seconds respectively.

| Engine | Seed | Reference wall (s) | Optimized wall (s) | Matching output SHA-256 prefix |
| --- | ---: | ---: | ---: | --- |
| Native | 1 | 39.48 | 24.36 | `c1f58215af6c` |
| Native | 2 | 38.02 | 20.34 | `7cde99a47415` |
| Native | 3 | 38.25 | 19.02 | `514d37b83e96` |
| Native | 4 | 37.16 | 19.96 | `da25f768e602` |
| Native | 5 | 39.54 | 18.95 | `7efc5c636c36` |
| WebAssembly in Node | 1 | 49.71 | 24.41 | `6628ae5a714c` |
| WebAssembly in Node | 2 | 47.07 | 23.14 | `6f1935b3ec56` |
| WebAssembly in Node | 3 | 46.58 | 24.32 | `32996d5af776` |

The small-cost routing fixture preserved all 6,600 reference route, cost and distance-table results. The queue fallback took 0.418 CPU seconds on the smallest weights. The reference took 0.398 seconds and the initial implementation took 7.987 seconds before the fallback was added.

Native and WebAssembly reproduced the reference observations at every checkpoint across the four full-hour runs. The final traces matched for 2,941,400 stored car link exits across those runs. The two builds also reproduced the live filter changes at every checkpoint. Four additional congested fixtures checked duplicate origins, unreachable destinations, initial loading, and filters, including runs with 470 to 1,561 cars queued to enter at the end.

All 338 tests in the default Rust suite passed. The three opt-in performance tests also passed, including the 30-minute run on the published Rockridge network. The production web build and the normal 300-second cross-platform smoke test passed. The production WebAssembly file has SHA-256 `5f8b528eb759c7e172010ca2af071b455216e52d32c3d5c793ae8170d1b63981` and simulator fingerprint `6b886c8f52ee07397773ddd0ebbcb447`. The TypeScript suite passed 1,108 of 1,109 tests with a single worker and a 60-second timeout. The bibliography assertion also fails on the reference checkout because fifteen Crossref-only citations put a qualifier after the required final check date.
