## Context and evidence

The user requested this proposal on 2026-11-15 after questioning the Colby/North closure's effects on 63rd and Dana. The proposal was prepared against `5f56c0d`, after incorporating 36 commits following the original audit. Earlier repairs are already being implemented; this change builds on their new contracts.

The motivating experiment used source `4820dddd2077090422e5cd492cdcb7603dc3d2e6`, simulator fingerprint `96d6b7a11c8815f8a06ba543256eae6e`, network hash `5fe8241a6ba1e306`, and demand hash `8ef2c6578dfbb9fc`. It ran one PM hour after initial loading and settling, at demand scale 1, seeds 1, 2, and 3. Its compact output is [evidence/colby-north-before-repairs.json](evidence/colby-north-before-repairs.json). The field `currentPackage` means the package fetched during that experiment, identified by its full scenario link; it does not mean the latest package when this proposal is read.

| Block | Baseline all cars/h | Colby/North alone | Historical six-change package |
| --- | ---: | ---: | ---: |
| 63rd, Colby to Dana | 63.3 | 77.7 | 106.3 |
| Dana, 63rd to North | 37.0 | 46.7 | 51.0 |
| Dana, North to Alcatraz | 26.7 | 34.0 | 45.0 |

These are both-direction averages of model outputs, not field measurements or confidence intervals. On 63rd, the package raised total traffic by 43 cars/h while through traffic fell by 7. The existing classification calls a trip through traffic when both trip endpoints lie outside the study area. The residual is traffic with an endpoint inside the area, including visitors. Full-package seed 3 removed five vehicles for gridlock and was flagged oversaturated. No individual trajectories were matched, so these differences do not identify which cars used a detour. Three seeds are descriptive and insufficient under the implemented `paired-t-1` reporting method.

For that network, the legal bypass northbound was Colby, west on 63rd, north on Dana, then Alcatraz: links `[2599,1855,1924,1926]`; the reverse was `[1927,1925,1856,2600]`. Rust `Eff`/`Topo` checks found both directions open under the single closure and the captured packages. Link IDs are fixture-specific. Future tests must identify their geography or use small synthetic networks.

To repeat the block comparison on a matching checkout and matching input files, build its WASM and run the existing CLI for seeds 1, 2, and 3, substituting each of the evidence file's two `links` values:

```sh
node --import tsx tools/simulate.ts --link '#v1;a=rockridge;p=pm_peak;s=mn,9q9p3fr7b5' --seed 1 --minutes 60 --blocks all --json --no-cache > /tmp/colby-single-1.json
```

Verify the output hashes before comparing numbers. The original input bytes are not vendored by this proposal; a new download may differ. Repeating on the repaired engine is required during implementation and must produce a new evidence record, not overwrite this historical sample. The example is a regression question, not a target to tune toward.

## Existing implementation and dependencies

`route.rs` already routes through legal link-to-link movements with travel-time costs [Wardrop1952; Peeta2001]. `src/lib/throughroutes.ts` is a separate bounded structural screen: its representative routes, direction merging, and period handling do not establish actual route volumes. `TripRecord` and `TripTiming` currently record completed, non-preplaced car trips; trails hold links entered, while published link flows count link exits in the measurement window. Neither structure alone accounts for all requests or reconciles a finite-hour flow table.

The global `uid_next` counter is consumed by scenario-dependent initial loading before ordinary arrivals. A matching UID across runs is therefore not proof of a matching requested trip. Physical endpoint sampling also uses UID. Runtime flow indices can change after filtering, so those indices are not stable source identities either.

The `proposal-evidence-integrity` implementation provides v5 provenance, reporting-method versions, matched seed differences, and explicit insufficient/exploratory states. Reuse that work instead of defining a second estimator. `repair-local-trip-measurement-integrity`, `protect-calibration-evidence`, and `expose-junction-fallback-validity` provide endpoint, run-manifest, and recovery contracts. `search-keeps-known-packages` is archived; its candidate retention is not changed here. Batch execution may use `docs/sharded-runs.md` when the diagnostic is expensive.

## Decisions

### D1. Keep legal possibilities distinct from simulated choices

Use a shared engine API or an exported effective graph derived from the canonical Rust movement permissions. A bypass witness must respect direction, the selected period's restrictions, mode, and exact intervention scope, including partial-leg filters and diverters. Record the graph/input identity. A UI implementation may cache or search this representation, but it must pass parity fixtures against engine permissions. Maintain the current structural screen's fast response where possible.

Label structural paths as possible, and paths with recorded usage as simulated. Search limits, route merging, truncation, and omitted paths must be visible. Failure of a bounded search to find a path is not a proof of disconnection. An exhaustive reachability result may make that claim for its declared graph and scope. Path counts never supply traffic weights. This preserves the distinction between feasible routes and assignment under the existing routing model [Wardrop1952; Peeta2001]. A new unweighted junction graph was rejected because it would lose turn and period semantics.

### D2. Match requests before attributing routes

Add an opt-in request/event ledger with a stable key based on immutable source demand identity, mode, seed, and within-flow requested-arrival ordinal, or an equivalently verified schedule identity. Record the source-to-runtime-flow mapping and requested arrival. Check matching requested arrival times, origin/destination, driver attributes relevant to routing, and requested physical endpoint attributes across runs. Treat changed attributes as a visible mismatch, not evidence about the same driver's response. A recycled vehicle slot or current global UID is insufficient.

Adding the diagnostic must leave an otherwise identical run unchanged. If existing initialization or UID-keyed endpoint sampling prevents a valid comparison, expose that limitation. A necessary repair that gives persistent attributes scenario-independent keys must be reviewed as a behavior change, fingerprinted, and measured before/after; enabling tracing in the resulting implementation must still have no effect. Do not redesign initial loading merely to force a perfect match. Initial/preplaced and warm-up-only agents have separate strata, with explicit pairing coverage or unmatched status.

### D3. Define the cohort and preserve the finite observation window

The first implementation traces car traffic. The primary cohort is the set of baseline car requests whose vehicles traversed the directed links or movements invalidated or altered by the selected intervention during the stated measurement window. A partial-leg filter must not classify unaffected turns as directly displaced. A broader all-junction-crossings selector may be offered but must be labeled separately. Follow those requests in each comparison, including the paths they take before reaching the selected neighborhood. Preserve requests that remain pending, active, completed, unroutable, removed, or unmatched at the horizon. These outcome bins must be mutually exclusive at the stated time; transition/event counters may be reported separately.

Collect timestamped link-exit and junction-movement events for the window using the existing flow-counting convention. Preserve repeat passages. Count a cohort trip once in a trip-outcome table, but count each qualifying passage in a link-flow table. Distinguish a complete trip path from an observed partial path. Do not extend the scenario horizon silently until trips finish, or infer an empty path from an unrecorded completion.

Derive gross route usage from matched cohort events. Reconcile each block's net change with contributions from the selected cohort, other requests, and explicitly identified initial/unmatched strata under the same window and counting convention. A zero net change can conceal arrivals and departures of equal size. A falling count can reflect delayed completion or failed demand, so show lifecycle and recovery evidence beside the route result [FHWA-TAT3-2019]. Aggregate block subtraction alone was rejected as a way to identify which trips moved.

### D4. Compare named scenarios without additive attribution

Use baseline, the selected closure alone, and the complete package, with identical network, demand, period, requested seed schedule, horizon, initialization policy, and measurement window. A closure-only variant must preserve the chosen intervention's exact semantics. If it cannot be extracted or decoded unambiguously, require a valid explicit selection and show no inferred variant.

Show baseline-to-closure and baseline-to-package changes and, when requested, the paired difference between package and closure-only. Those are conditional model comparisons. They do not assign an additive contribution to each intervention; interacting changes and congestion can make order matter. A package-minus-one experiment would be a different named comparison and is outside the initial scope.

### D5. Make all-car redistribution visible and uncertainty consistent

Show absolute baseline/scenario counts and signed changes for all cars and, where classification is available, external-to-external trips versus trips with an endpoint inside the area. The existing neighborhood through counter applies only to local in-study links. A zero through counter on a boundary or outside link is not evidence that all its cars are local: use consistent origin/destination passage classes for every displayed decomposition, or mark that decomposition unavailable. Keep these classes distinct from the narrower neighborhood cut-through metric. Always show all-car boundary totals. Preserve direction and period in exports, with an explicitly labeled both-direction view for residents. Show boundary-road changes alongside interior roads without treating every outside link as a neighborhood harm score. The map's geographic scope must be declared; a table can retain relevant detours outside the normal map viewport. Display raw gains even when uncertainty is unresolved. Reuse the existing paired estimator, method identity, minimum-pair rule, and selection/confirmation labels [WebTAG-M3.1; TfL-TMG4; NIST-Handbook]. A fixed-input seed interval does not include demand or calibration uncertainty.

Maps and tables distinguish possible bypasses, simulated cohort usage, and net all-car changes by names and non-color cues. Proposal cards expose the all-traffic consequence and a route-diagnostic entry point without requiring readers to interpret a through-only headline as a complete account of displacement. Reuse existing v5 all-traffic fields and provenance; do not rewrite the search penalty or ranking rule.

### D6. Bound instrumentation and identify every result

Keep request/outcome counts exact. Bound detailed route storage with a documented opt-in policy, deterministic grouping, and explicit coverage/truncation metadata; sampling must not be displayed as a complete count or expanded into a full-population claim without a validated estimator. Retain enough exact event aggregates to reconcile flow counts even when individual path details are capped. Measure memory and runtime on the representative area and a synthetic larger case before selecting implementation limits.

The result identity includes network/demand/simulator fingerprints, diagnostic schema and method version, requested cohort selector, scenario links, period, seeds, run settings, and tracing coverage. Extend existing manifests and freshness checks. Old stored results without lifecycle/route evidence may still show their valid aggregate figures but cannot acquire an attributed detour explanation. CLI and browser consume the same result meanings. No server-side simulation or upload endpoint is needed.

## Validation and delivery

Use small deterministic networks for a single bypass, two alternative routes, a period-specific turn ban, a partial-leg filter, repeated passages, and a route that takes longer than the observation window. Include initially placed, failed-entry, unroutable, removed, and unmatched requests. Include a boundary link carrying external-to-external cars to prevent an out-of-scope through counter from turning them into local traffic. Verify conservation and pair-attribute checks before interpreting any route share. Toggle tracing and compare simulator outputs bit-for-bit; compare native and WASM diagnostics under the established parity contract.

Rerun the Colby/North question on repaired inputs with fresh provenance, using the current paired seed policy and reporting any insufficient evidence. Record whether the 63rd/Dana bypass remains legal, all-car changes on those blocks, cohort routes, and every recovery/unfinished outcome. A numerical match to the historical table is not required. Review the map and keyboard-accessible table together, including unresolved, unavailable, and truncated states.

The user authorized a proposal on `main` for later implementation. All implementation tasks remain open. No graph behavior, simulation result, or published proposal is changed by landing this document.

## Implementation record

### 2026-11-15: requested-trip keys (task 1.2)

The divergence in D2 is real. A fixture test (`crates/sim/src/tests/redistribution.rs`) runs a corridor with a residential-row closure. The closure changes the initial population by one agent (28 against 29 on seed 1). Before the repair, the request with the same flow, origin, destination and requested arrival got a different uid in the two runs. Two draws key on the uid: `mid_block_pos`, which places a local trip's start and end along its block, and the driver's crosswalk yield draw (`PedWorld::yields`). So the same request started from another point on its block, and a match on uid would have paired different requests.

Repair: agents placed by initial loading take uids from `INITIAL_UID_BASE` (2^31) upward (`sim/initial.rs`, `sim/ped.rs`). Requested trips keep the global arrival counter from 0. That counter advances only in `generate_arrivals`, flow by flow in index order, on a fixed step. Its sequence therefore depends only on the demand, period, scale and seed, and is the same in every scenario of a seed. The request key the trace records is the source flow index in the demand period (not the runtime flow index) and the ordinal of the arrival within that flow. Matching also checks the uid, origin, destination, requested arrival and a hash of the driver parameters and route-noise seed (D2's attribute check). Initial agents form their own stratum and are never paired.

This changes every run, the baseline included: the uid-keyed draws are drawn again from other uids. It was measured on the Rockridge PM peak, seeds 1 to 3, one hour after loading, for the baseline, the Colby/North closure (`mn,9q9p3fr7b5`) and the two-filter package. Simulator fingerprint `447ddb0b99a951ddb43c7be778800317` before, `304b6245f7967e52fd5ecc5084d0018c` after the repair alone. Link exits changed by a summed absolute 6.1 to 8.0% of all exits per run. Between seeds 1, 2 and 3 of the same baseline the figure is 8.7 to 11.0%, so the change is the size of drawing new random numbers. Completed trips moved by at most 1.1% (24,544 to 24,905 across runs before and after), mean trip time by at most 1.9%, and gridlock removals stayed between 0 and 11 a run. The summed paired difference between closure and baseline did not shrink (46,500 to 58,500 before, 54,000 to 58,700 after): congestion makes the runs diverge anyway, so the repair is about identity and comparable attributes, not variance reduction. The table generator (`bin/compare_runs.rs`) is kept for later before/after checks.

### 2026-11-15: request records and the effective graph (tasks 2.1, 2.2, 2.5)

Tracing is a config flag (`trace`, with `traceDetailMax`) and lives in `crates/sim/src/sim/trace.rs`; the engine calls it from seven places (arrival, initial placement, entry, link exit, completion, unroutable drop, removal). It records each car request with its key, stratum (requested or initially placed), attributes, lifecycle times and final state, and one event per link exit, the counting convention of the published link flows. Exits before time zero are kept so a path can be complete, and window counts use time >= 0. Per-link exit counts since time zero are exact for every request. Event detail stops for requests created after `traceDetailMax` events (default 1,500,000), and the summary says how many requests and events lack detail. The states (pending, active, completed, unroutable, removed) partition the requests at the time of export.

Cost on the Rockridge PM hour, seed 1, native: 30.7 s without tracing and 31.9 s with it, peak memory 104 MB against 130 MB, 29,273 requests and 837,969 events (13 MB exported). At twice the demand, an oversaturated network with 58,140 requests and 1,094,342 events, the run took 196 s either way and peak memory went from 334 to 372 MB. The default bound is about 1.8 times a Rockridge hour. Runs with and without tracing gave identical metrics and link flows in both cases, and the unit tests compare every output bit for bit. The parity script now also compares the traced run's exports and the graph query between native and WASM.

The graph query (`crates/sim/src/redistribution.rs`, WASM `redistributionGraph`) builds `Topo` and `Eff` exactly as a run does, with the period's turn bans, for the baseline and for the selected closure. A movement is legal when `mv_ok` holds and neither link is closed, the test the router applies. Closed movements are the direct cohort selector; every movement that was legal at the changed nodes is the broader one. For each closed movement the witness search starts on links up to two junctions upstream of its approach and rejoins at links up to two junctions downstream of its exit (ASSUMPTION: enough for a one-block dogleg). Each start gets the cheapest legal path on free-flow perceived costs, with the baseline cost from the same start to the same link beside it. Dijkstra explores the whole graph, so "disconnected" is an exhaustive result for that graph, mode, period and reach. Only the listing is capped, at three paths per movement, and the output states the cap and the number found. A test checks that the query's `mv_ok` and closed links equal those of a simulation with the same interventions.

### Decision of 2026-11-15 (project lead): a cut counted turn keeps its intent through a local bypass

Before this change, a trip of an assumed-movement (`via`) flow whose counted turn an intervention cut tried the configured parallel-street alternatives and otherwise fell back to its plain route. The plain route of such a flow is, by construction, one that does not make the counted turn (the builder adds `via` flows because the router never picks the turn). A whole-street car on Colby Street northbound therefore left Colby entirely when Colby/North was filtered, instead of turning off one block early.

The project lead decided that the fallback also considers a local bypass. Implementation (`crates/sim/src/sim/via_bypass.rs`, ASSUMPTION): when the primary movement cannot be made at all from where the trip is (closed, or no legal path to its approach or from its exit), and no alternative fits the tolerance, the trip takes the cheapest legal route that drives the counted approach street in the counted direction upstream of the turn and then the onward street in the onward direction from the turn's exit on. The streets are followed by name over straight-through movements, up to 12 links each way. The route must cost at most the flow's `maxDetour` (1.3) times the plain route on free-flow costs, the tolerance the builder used, and it may not pass a node twice that the plain route does not. The movement onto the onward street becomes the trip's pending movement, so the car keeps the bypass until it is back on that street; after that it routes as before. A movement that is only over the tolerance, not cut, still falls back to the plain route. That keeps every run without a cut identical: the Rockridge baseline and the fixture without a filter did not change.

Fixture: `crates/sim/src/tests/via_bypass.rs`, a grid where Mid Street is filtered one block before its counted left turn onto Top Avenue. The trips now drive Mid Street north, turn onto First Street, take West Street north and rejoin Top Avenue westbound. With the fallback disabled the same test fails: the trips take the fast East Boulevard.

Effect, Rockridge PM peak, seeds 1 to 3, one hour after loading, cars an hour both directions, mean of the seeds (fingerprint `93afccde5345db515343fd1b3ff8dca7` before, `81642472ba01179203a2fcd5aa8f02c8` after; the commit's source, which differs only in a doc comment, has `177c67157000bd5896590679af7d9036`):

| Block | Baseline | Closure, before | Closure, after | Package, before | Package, after |
| --- | ---: | ---: | ---: | ---: | ---: |
| 63rd St, Colby to Dana | 94.7 | 117.3 | 170.7 | 177.3 | 334.0 |
| Dana St, 63rd to North | 51.7 | 66.0 | 103.0 | 98.3 | 240.0 |
| Dana St, North to Alcatraz | 47.3 | 48.7 | 87.0 | 79.3 | 225.0 |

The package is `#v1;a=rockridge;p=pm_peak;s=mn,9q9p642ut2,175.355~mn,9q9p3fr7b5`; its Hillegass Avenue leg filter cuts the counted Alcatraz/Hillegass movements as well, and their bypass also runs over 63rd and Dana. Baseline runs were identical bit for bit. Gridlock removals in the closure runs went from 7, 2 and 3 to 9, 17 and 8, and in the package runs from 4, 9 and 5 to 12, 14 and 2. These are three seeds of an uncalibrated model; section 4.3's record has the ten-seed paired figures.

### 2026-11-15: the comparison contract and the CLI (tasks 1.1, 2.3, 2.4, 3.1, 3.4)

The contract lives in `src/lib/redistribution.ts`, shared by the CLI and the app. A result has `kind: "redistribution"`, `schema` 1 and `method` `redistribution-1`, and reuses `paired-t-1` for every interval through the engine's `pairedEffect` (the estimator in `explore/paired.rs`, exported to WASM so no second implementation exists). Its identity holds the area, period, seeds, run length, demand scale, initial loading, the measurement window and its counting rule, the network and demand hashes, the simulator fingerprint, the three scenario links with their interventions, the closure item, the cohort selector, the route-grouping radius and the trace bound.

- Selectors: `direct` (default) takes the movements and links the closure makes illegal for cars in the period, so a partial-leg filter selects only its legs' movements; `crossings` takes every movement that was legal at the changed junctions and is labeled as the broader selector.
- Window: link exits at or after time zero and before the end of the run, the convention of the published link flows. A car on the selected movement's exit link at the end of the run counts as having made it.
- Cohort: baseline requests of the requested stratum that drove a selected movement or link in the window. Initially placed agents that did are counted apart and never paired. Baseline requests without detail are counted, not tested.
- Outcomes in each comparison partition the cohort: pending, active, completed, unroutable, removed (the engine's states at the end of the run), unmatched (key absent) and mismatched (key present, attributes differ).
- Routes: the part of a request's recorded path within 400 m of the closed junctions, street by street (ASSUMPTION: about three blocks). Counts are cohort trips, with complete paths (completed) and observed partial paths (active, removed) apart. A pending request has no path and counts as unknown in the route-change tally, never as an unchanged route.
- Blocks: absolute all-car counts for the baseline, the closure and the package, both directions summed and per direction, split into external-to-external trips and trips with an end in the study area by the trip's own end nodes, on every link, boundary links included. Passages without detail are reported as unclassified, and the through and local changes are then left out rather than estimated. Each change carries the paired estimate over seeds. The net change reconciles exactly with the cohort, other paired requests, unpaired requests, initially placed agents and undetailed passages, and the cohort's gross additions and removals are given beside it.
- Listed blocks: those on a witness path, those on streets the caller names, and the twelve with the largest net change in the focus area.
- Stored results: `checkStored` accepts a stored diagnostic only when the schema, method, network and demand hashes, simulator fingerprint, period and scenario links all match; anything else is refused with the reason. The CLI's `--from <file>` uses it and exits 3 on a mismatch.

The CLI is `npm run simulate -- --redistribution` (see `docs/run-locally.md`). It runs the three scenarios per seed in worker threads on the WASM build, analyzes each seed as soon as its runs are in, and writes the summary. `--graph-only` returns the legal paths without running anything. The closure must be one item of the package link; a package without it, an item that does not decode to exactly one intervention, or an unplaceable package item is an error, never an inferred variant.

Witness check revised after the first Rockridge query: a (start, end) pair now counts only when a cheapest baseline path between them makes the closed movement, otherwise the listing filled with paths that never needed it. A movement no cheapest path uses is reported as `unused`.
