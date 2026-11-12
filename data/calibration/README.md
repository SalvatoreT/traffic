# Calibration targets

`<area>.targets.json` holds observed route shares the baseline model should reproduce.

## Rockridge

Headline figures from a StreetLight Data select-link analysis (January to July 2025) of
Hillegass Ave and Colby St between Alcatraz Ave and Claremont Ave, provided by residents.
Only summary percentages are recorded; the underlying deliverable is not redistributed.
StreetLight samples connected devices, so the shares are estimates and not exact counts.

The ramp section of the targets file says the via-street shares are for trips from (on-ramp) or to (off-ramp) the north of the ramps: `freewayRamp.side` names that side, and a via street with a qualifier such as "Telegraph Avenue north of Alcatraz Avenue" counts only its links on that side of the cross street. The same file drives two readers: the report below and the demand fit (`tools/lib/share-targets.ts`), which turns each headline and ramp share into a ratio constraint.

Key finding: roughly half the traffic on both streets is traveling to or from the
freeway ramps at Claremont Ave, and almost none of the northbound traffic ends up on
College Ave. The model's baseline should show the same pattern before interventions
are compared.

## Running the calibration report

No npm needed (Rust only; reads `public/data/<area>.{network,demand}.json` and `<area>.targets.json`):

```
cargo run --release -p traffic-sim --bin calibrate -- --area rockridge --period pm_peak --minutes 60 --scale 1.0 --seed 1
```

Options: `--local-factor <x>` (override the residential/service perceived-cost multiplier), `--guided-share <x>` (share of drivers that follow live guidance and re-evaluate their route every 60 s epoch, 0 to 1, default 0.46; `--reroute-share` is the old name), `--switch-band <x>` (relative indifference band, default 0.2), `--legacy-reroute` (the route choice before the commitment rules: 80% of drivers re-plan each epoch and take the result, for A/B runs), `--no-rtor` (forbid right turns on red; they are allowed after a stop by default, an ASSUMPTION), `--select-od <path>` (write the origin-destination pairs and trip counts of each headline select-link block), `--demand <path>` and `--network <path>` (read other files than `public/data/<area>.{demand,network}.json`, for A/B runs of variant demand), `--cars-only` and `--drop bicycle,pedestrian` (leave modes out), `--adapt-min <m>` (minutes between signal adaptations, default 5, 0 keeps the start-up plans), `--motorway-removal` (apply the gridlock breaker on ramps and the freeway stub too), `--warmup <min>` (flow tables ignore the first N minutes of runs of 30+ min, default 10), `--out <dir>`, `--no-write`, `--link-flows` (adds per-link flow and the mean delay per exiting vehicle, `linkMeanDelayS`, to the JSON; `tools/cost-loop.ts` reads both).
The ramp table of the report has two modeled columns: all trips on the ramps with any visit to the street (the first definition, kept for comparison with earlier rounds) and the trips from (to) the side named in the targets file with qualified streets resolved to their links (`modelled` and `modelledSide` in the JSON; `nSide` is the trip count of the second).
It prints a markdown report and writes `reports/<area>-<period>-s<scale>-seed<seed>.{md,json}`: stability criteria, vehicles in
network every 5 min, modeled vs observed select-link shares (target blocks resolved from street name, direction and the
two cross streets), ramp shares, top 15 links by delay, top 15 nodes by blocked time (with each signal's cycle and greens at the end of the run), gridlock removals and entry backlog by
location, and flow per direction on the key streets. A full 60-minute run took about 5 s on the original small network; on the current model area (about 27,000 veh/h offered in the PM peak, 1,800 nodes) it takes about 60 s, and runs of different seeds are independent processes, so run them in parallel (three seeds took about 70 s on four cores). The report has a wandering section (per completed car trip: route switches, detour ratio against the shortest distance and against the free-flow route, loops, reversals, share of study-area vehicle-miles driven by trips with a detour above 1.3; rows for all trips, gate to gate, trips with a local end, guided and other drivers) and a reported-patterns section that reads `patterns` in the targets file: (a) local-street vehicle-miles of trips between the surface gates on one side of the ramps and the freeway mainline gates, (b) for each bypass and arterial pair, the share of corridor trips by direction that use the bypass for at least N blocks. Neither has an observed counterpart. `CAL_DUMP_TRIPS=<path>` writes the trips with a reversal or a detour above 1.3 for inspection. The report also has a per-mode table (cars, cyclists, pedestrians: trips, mean time, crossing delay) and the surrogate-safety counts.

The calibration record with every tuned parameter is `rockridge.record.md`. The demand audit (relevance of the offered trips to the study area, gate by gate, and the cordon check) is written by the demand builder to `data/demand/<area>.audit.md`; see `data/demand/README.md`.

## Ten-seed runs and the assessment (decisions D16 to D18)

Results are judged over the fixed seed list 1 to 10, never chosen. The binary runs them in parallel processes:

```
cargo run --release -p traffic-sim --bin calibrate -- --area rockridge --period pm_peak --minutes 60 --scale 1.0 --seeds 1-10 --jobs 4 [--keep-seeds DIR]
```

It writes `reports/<area>-<period>-s<scale>-seeds1-10.{md,json}` (the stability rule of `acceptance.stability` in the targets file, then every headline metric with mean, standard deviation, min, max and the 95% interval of the mean: removals, backlog, backlog growth, completed trips, arterial speed, cut-through vehicle-miles, each route share and ramp share, each corridor flow) and the first seed in full (`...-seed1.{md,json}`). `--keep-seeds` keeps every seed's report with per-link flows and delays. The stability rule is in `design.md` D16 with the old rule beside it; the judged window is the whole run (the start-up state is described in the record), with the first 10 minutes left out of the flow tables.

`npm run assess` (`tools/assess.ts`) runs the seeds for all periods and writes `<area>.assessment.md`: the stability verdict per period, the route shares with intervals, the ramp via-street shares, the count stations scored on the simulator's link flows (GEH below 5 and the size bands, fitted and held-out; stations come from `data/demand/<area>.stations.json`), corridor ratios, and the suggested status. `--noise` also writes `public/data/<area>.noise.json`, the per-link standard deviation of flow over the seeds (integers in units of 0.5 veh/h), which the importer lists as `noise` in `areas.json`. `npm run cost-loop` is the damped feedback loop with the demand fit (`data/demand/README.md`, step 29); its result is `<area>.cost-loop.md`. `tools/route-consistency.ts` compares the router's penalties with the delays the simulator imposes (`<area>.route-consistency.md`).

Acceptance criteria as published (sources `[WebTAG-M3.1]`, `[TfL-TMG4]`, `[Aimsun-Manual]` in `docs/references.md`; the table is in `docs/simulator-audit.md`): GEH = sqrt(2 (M - C)^2 / (M + C)); GEH below 5 in more than 85% of cases; within 100 veh/h below 700, within 15% from 700 to 2,700, within 400 above; the guidance says either criterion suffices, so both are reported. The held-out stations are about a quarter of the stations, at least one per corridor, never in the fit that is scored.

## Validation suite

`validation.md` holds the benchmark of the simulator's own primitives, separate from the area fit. Each case is a tiny synthetic network with saturated demand (cars only unless the case adds pedestrians or cyclists) that measures one quantity against a published range:

```
cargo run --release -p traffic-sim --bin validate                      # prints the table, writes validation.md
cargo run --release -p traffic-sim --bin validate -- --before old.json # adds a before column (JSON from --json of an older build)
cargo test --release -p traffic-sim --test validate                    # regression: no case outside its range except KNOWN_DEVIATIONS
```

The cases are lettered: a saturation flow at a signal, b signalized approach capacity (through, left with and without a pocket, right), c two signals 100 and 200 m apart with fixed and adaptive plans (c5 and c6: vehicles served at a signal with a saturated arterial and a cross street, adaptive against start-up plan), d all-way stop, e two-way stop gap acceptance, f traffic circle entry, g single-lane link capacity, h gate insertion, i motorway lane, exit ramp and off-ramp terminal, j effect of pedestrians and cyclists, k junction traversal. The code is `crates/sim/src/validate.rs`; every expected range names a key of `docs/references.md` or is labeled ASSUMPTION. A run takes a few seconds. Add a case whenever a capacity rule in the simulator changes, and run the suite before tuning demand: a network that jams at half its counted flow has a low primitive somewhere.
