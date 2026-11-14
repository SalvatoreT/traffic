## Context

A run is one simulated hour. Running to the end at Max takes about a minute in the browser, so a shared link that opens at zero hides the answer behind a wait. The published proposals are a fixed, small set (11 options, 6 distinct scenarios today), so their finished hours can be computed ahead of time. Visitors' own scenarios cannot.

## Owner decisions

- Every published proposal, in all groups and the reference packages, is precomputed for all three periods: PM peak, AM peak and midday.
- A shared link to a scenario that is not a published proposal opens and runs straight to the end of the hour at Max, then shows the finished state. Visitors' scenarios are not stored on any server.

## Decisions

**D1. A stored result is what the app would show after running that scenario itself.** The tool runs the same WASM build in Node (`initSync` on `traffic_sim_bg.wasm`) with the app's seed (1), 100% demand, 60 simulated minutes and the same construction as the worker (`seed`, `period`, `demandScale` and `interventions` in the config; the baseline built with none). It also applies the same junction straightening the app applies before handing the network to the worker. We chose WASM in Node over the native build so no float difference between targets can show up. Step size does not change a run (the simulator accumulates time and steps a fixed interval), and the unit tests check that a run from zero, a `reset()` of the same simulation with the scenario set (what "Run again" does) and a quarter-second stepping all give identical link stats and metrics.

**D2. What a file holds.** Metrics for the baseline and the scenario (which carry the Results numbers, network health and the per-intent "Why cars cut through" numbers), the per-link stats (stride 4: flow, speed, through cars, density) and the per-intent link usage (stride 3) for both runs, and the clock (3600 s). Vehicle positions are not stored. The finished state draws the end-of-hour layers and no cars. Float32 arrays are stored as base64 of their bytes so values round-trip exactly; JSON gzip brings a file to about 90 KB.

**D3. Key.** `key` is the first 16 hex characters of the SHA-256 of `<canonical scenario>|<period>`. The canonical scenario is the intervention list as the link encodes it (`encodeScenario`), with its items sorted, so order does not matter and two proposals that share a scenario share a file. The app computes the key from the decoded interventions the same way. Demand level and seed are not in the key: a stored result applies only at 100% demand and seed 1, and the file records both.

**D4. Validity.** Each file records `networkHash` and `demandHash` (SHA-256 of the files' text as served, the recipe the proposals file uses) and `simulator`, a fingerprint of the simulator. `crates/sim/build.rs` hashes the simulator's own sources (every `.rs` file under `src` except `bin`, `explore` and the tests, the data files `include_str!` reads, `Cargo.toml` and `build.rs`) with FNV-1a over sorted relative paths and contents with line endings normalized, so the value is the same on any machine for the same sources. `lib.rs` exposes it as `FINGERPRINT` and the WASM wrapper as `simulatorFingerprint()`. The worker posts it in a `version` message as soon as the engine loads, before the first build, so the lookup does not wait for the build. The app uses a stored result only when the three values match what it loaded; otherwise it ignores the file and runs live. On the mock engine the fingerprint is null and nothing matches.

**D5. App behavior.** On a scenario in the URL the app looks up the key for the current period. A valid result shows at once and marks the run finished; the live worker still builds in the background, so "Run again" is ready. The result applies to one exact (interventions, period, demand) triple; any change to those stops it applying at the same render, with no flash of the wrong numbers. Changing the period looks up that period's result. A change to the scenario or demand goes live as before. If the page was opened with a scenario (a link, a pasted link, or "Open on the map") and no valid result exists, the speed is set to Max and the run starts, with the toolbar's "Running to the end of the hour" note. A visitor with no scenario in the link gets the existing behavior (20x, running). Reduced motion does not stop the Max run: Max draws no frames.

**D6. Links name their period.** The hash already carried `p=` when the period differed from the area's default. Links with interventions now always carry it, so a later change of the default does not change what an old link means. Links without `p=` still open on the default period.

**D7. Files and publishing.** Files are generated into `public/data/results/<area>/`, not committed. `data:push` and `data:pull` already walk `public/data` recursively, so the files go to the R2 key `areas/results/<area>/<key>.json`, which the upload API already allows. The Worker now accepts a name with up to two folders under `results/`, serves it from R2 (falling back to local assets in dev), and answers 404 for a missing result so the single-page fallback does not return the app page. The tool is incremental: a file whose three inputs still match is kept.

**D8. Not done.** No server-side storage of visitors' scenarios. No stored result for the empty scenario. The index (`index.json`) is for people and tools; the app fetches the one file it needs.

## Risks

- Stored results go stale whenever the network, the demand or the simulator's sources change. The app falls back to a live run, so nothing wrong is shown, but links lose the instant result until `npm run data:results` runs again and the files are pushed.
- Any edit to a hashed simulator source file changes the fingerprint, including comment-only edits. That errs toward recomputing.
