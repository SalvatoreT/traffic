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

Options: `--local-factor <x>` (override the residential/service perceived-cost multiplier), `--guided-share <x>` (share of drivers that follow live guidance and re-evaluate their route every 60 s epoch, 0 to 1, default 0.46; `--reroute-share` is the old name), `--switch-band <x>` (relative indifference band, default 0.2), `--legacy-reroute` (the route choice before the commitment rules: 80% of drivers re-plan each epoch and take the result, for A/B runs), `--no-rtor` (forbid right turns on red; they are allowed after a stop by default, an ASSUMPTION), `--select-od <path>` (write the origin-destination pairs and trip counts of each headline select-link block), `--demand <path>` and `--network <path>` (read other files than `public/data/<area>.{demand,network}.json`, for A/B runs of variant demand), `--cars-only` and `--drop bicycle,pedestrian` (leave modes out), `--adapt-min <m>` (minutes between signal adaptations, default 5, 0 keeps the start-up plans), `--motorway-removal` (apply the gridlock breaker on ramps and the freeway stub too), `--warmup <min>` (flow tables ignore the first N minutes of runs of 30+ min, default 10), `--out <dir>`, `--no-write` (print only; with `--seeds` no report file is written either, and seed files go to the system temp directory unless `--keep-seeds` names one), `--link-flows` (adds per-link flow and the mean delay per exiting vehicle, `linkMeanDelayS`, to the JSON; `tools/cost-loop.ts` reads both).
The ramp table of the report has two modeled columns: all trips on the ramps with any visit to the street (the first definition, kept for comparison with earlier rounds) and the trips from (to) the side named in the targets file with qualified streets resolved to their links (`modelled` and `modelledSide` in the JSON; `nSide` is the trip count of the second).
It prints a markdown report and writes `reports/<area>-<period>-s<scale>-seed<seed>.{md,json}`: stability criteria, vehicles in
network every 5 min, modeled vs observed select-link shares (target blocks resolved from street name, direction and the
two cross streets), ramp shares, top 15 links by delay, top 15 nodes by blocked time (with each signal's cycle and greens at the end of the run), gridlock removals and entry backlog by
location, and flow per direction on the key streets. A full 60-minute run took about 5 s on the original small network; on the current model area (about 27,000 veh/h offered in the PM peak, 1,800 nodes) it takes about 60 s, and runs of different seeds are independent processes, so run them in parallel (three seeds took about 70 s on four cores). The report has a wandering section (per completed car trip: route switches, detour ratio against the shortest distance and against the free-flow route, loops, reversals, share of study-area vehicle-miles driven by trips with a detour above 1.3; rows for all trips, gate to gate, trips with a local end, guided and other drivers) and a reported-patterns section that reads `patterns` in the targets file: (a) local-street vehicle-miles of trips between the surface gates on one side of the ramps and the freeway mainline gates, (b) for each bypass and arterial pair, the share of corridor trips by direction that use the bypass for at least N blocks. Neither has an observed counterpart. `CAL_DUMP_TRIPS=<path>` writes the trips with a reversal or a detour above 1.3 for inspection. `CAL_DUMP_RAMP_TRIPS=<path>` with `CAL_RAMP_LINKS=<link,link,...>` writes one line per completed trip that used one of those links (origin node, destination node, the link, guided, route switches), for the split between two parallel ramps. `CAL_TRACE="<every s>:<from min>:<to min>:<link,link,...>"` prints, for each lane of the listed links, the vehicles, the signal state, the head vehicle's next link, wait and flags, the movement inside the node that holds it (`held by <in link>><out link>`), and the pedestrians at the crosswalk, to stderr. The report also has a per-mode table (cars, cyclists, pedestrians: trips, mean time, crossing delay) and the surrogate-safety counts.

The calibration record with every tuned parameter is `rockridge.record.md`. The demand audit (relevance of the offered trips to the study area, gate by gate, and the cordon check) is written by the demand builder to `data/demand/<area>.audit.md`; see `data/demand/README.md`.

## Ten-seed runs and the assessment (decisions D16 to D18)

Results are judged over the fixed seed list 1 to 10, never chosen. The binary runs them in parallel processes:

```
cargo run --release -p traffic-sim --bin calibrate -- --area rockridge --period pm_peak --minutes 60 --scale 1.0 --seeds 1-10 --jobs 4 [--keep-seeds DIR]
```

It writes `reports/<area>-<period>-s<scale>-seeds1-10.{md,json}` (the stability rule of `acceptance.stability` in the targets file, then every headline metric with mean, standard deviation, min, max and the 95% interval of the mean: removals, backlog, backlog growth, completed trips, arterial speed, cut-through vehicle-miles, each route share and ramp share, each corridor flow) and the first seed in full (`...-seed1.{md,json}`). `--keep-seeds` keeps every seed's report with per-link flows and delays. The stability rule is in `design.md` D16 with the old rule beside it; the judged window is the whole run (the start-up state is described in the record), with the first 10 minutes left out of the flow tables.

Intent map (round 21). With `data/demand/<area>.groups.json` present (written by the demand build from the `approachGroups` of the area config), the report and the ten-seed summary add a section that lists, for each counted block and for all residential and service streets of the study area, the through cars per hour (neither trip end in the study area) by origin group and destination group, with the arterial each trip would otherwise use: the boundary streets that the shortest free-flow path runs on near the study area when the study area's local streets are closed (`calibrate/intent.rs`; ignores signals and turn bans). `intentMap` in the targets file lists, per block, the intents the volunteer count and the headline shares imply (veh/h with a range; basis OBSERVED or ASSUMPTION) and the report sets the model beside them. Nothing in the data gives origins and destinations, so the implied intents are inferences from turn counts and freeway shares; the note of each block says how.

`npm run assess` (`tools/assess.ts`) runs the seeds for all periods and writes `<area>.assessment.md`: the stability verdict per period, the route shares with intervals, the ramp via-street shares, the count stations scored on the simulator's link flows (GEH below 5 and the size bands, fitted and held-out; stations come from `data/demand/<area>.stations.json`), corridor ratios, and the suggested status. `--noise` also writes `public/data/<area>.noise.json`, the per-link standard deviation of flow over the seeds (integers in units of 0.5 veh/h), which the importer lists as `noise` in `areas.json`. `npm run cost-loop` is the damped feedback loop with the demand fit (`data/demand/README.md`, step 29); its result is `<area>.cost-loop.md`. `tools/route-consistency.ts` compares the router's penalties with the delays the simulator imposes (`<area>.route-consistency.md`).

`npm run cost-loop` (`tools/cost-loop.ts`) feeds the simulator's measured link delays back into the demand fit. `--objective ramp` keeps an iteration only when PM removals stay below 1.0 per hour, the counted off-ramps move toward their counts and the headline error holds; `--no-stop` continues after an unstable iteration; `--resume N` replays the first N iterations from `target/cost-loop`. Round 20 result: no iteration kept (`<area>.cost-loop.md`).

Demand flows may carry `via`, a movement the trip must make (assumed movement flows, an ASSUMPTION listed in the demand provenance; `data/demand/README.md`, steps 51 to 54). The calibrate report counts such a movement like any counted turning movement.

Acceptance criteria as published (sources `[WebTAG-M3.1]`, `[TfL-TMG4]`, `[Aimsun-Manual]` in `docs/references.md`; the table is in `docs/simulator-audit.md`): GEH = sqrt(2 (M - C)^2 / (M + C)); GEH below 5 in more than 85% of cases; within 100 veh/h below 700, within 15% from 700 to 2,700, within 400 above; the guidance says either criterion suffices, so both are reported. The held-out stations are about a quarter of the stations, at least one per corridor, never in the fit that is scored.

## Observed arterial travel times

`travelTimes` in the targets file lists arterial segments with observed weekday peak-period speeds from the Alameda CTC level-of-service monitoring ([ACTC-LOS2014] for 2012 and 2014, [ACTC-LOS2018] for 2016 and 2018; floating-car runs or commercial probe speeds): Telegraph Ave between 51st St and Russell St, Shattuck Ave between 51st St and Alcatraz Ave, College Ave between Miles Ave and Ashby Ave, each direction, AM and PM. `tools/assess.ts` finds the links of each segment by street and cross streets, adds the free-flow time and the mean delay per vehicle of every link (seed mean), scales the result to the published segment length and reports it beside the four observed years. The four years differ by up to a factor of 1.7 on one segment (College Ave northbound, 9.4 to 15.9 mph in the PM), so "inside the observed range" is a weak test. The speeds are a target for reading and are not fitted.

## Validation suite

`validation.md` holds the benchmark of the simulator's own primitives, separate from the area fit. Each case is a tiny synthetic network with saturated demand (cars only unless the case adds pedestrians or cyclists) that measures one quantity against a published range:

```
cargo run --release -p traffic-sim --bin validate                      # prints the table, writes validation.md
cargo run --release -p traffic-sim --bin validate -- --before old.json # adds a before column (JSON from --json of an older build)
cargo test --release -p traffic-sim --test validate                    # regression: no case outside its range except KNOWN_DEVIATIONS
```

The cases are lettered: a saturation flow at a signal, b signalized approach capacity (through, left with and without a pocket, right), c two signals 100 and 200 m apart with fixed and adaptive plans (c5 and c6: vehicles served at a signal with a saturated arterial and a cross street, adaptive against start-up plan), d all-way stop, e two-way stop gap acceptance, f traffic circle entry, g single-lane link capacity, h gate insertion, i motorway lane, exit ramp and off-ramp terminal, j effect of pedestrians and cyclists, k junction traversal. The code is `crates/sim/src/validate.rs`; every expected range names a key of `docs/references.md` or is labeled ASSUMPTION. A run takes a few seconds. Add a case whenever a capacity rule in the simulator changes, and run the suite before tuning demand: a network that jams at half its counted flow has a low primitive somewhere.

## Resident volunteer count, February 25, 2025

`rockridge.volunteer-count-2025-02-25.json` holds the figures of a manual turning-movement
count by more than 50 resident volunteers for the neighborhood working group on Tuesday,
February 25, 2025, from 8 to 9 AM and from 5 to 6 PM. `rockridge.volunteer-count-2025-02-25.notes.md`
lists what was read from images and where the figures disagree. It is the only measured data on
the interior streets. The JSON holds 98 AM and 109 PM directed block volumes (`blocks`), the
entries at the 18 access points, 255 turning movements, the whole-street counts on Colby Street
and Hillegass Avenue, the Alcatraz Avenue exit split, and the queue and signal observations for
Colby Street at Claremont Avenue and Forest Street.

It is one day and one hour per period, so a single figure is good to perhaps 15 to 20 percent
(the sampling error of a count of 160 is about 8 percent by itself, and one day's volume differs
from another's by more than that [FHWA-TAT3-2019]). The demand build reads it as count stations
(`tools/lib/volunteer-count.ts`, section "Twelfth round" of `data/demand/README.md`), the
simulator's flows are scored against the blocks, the entries, the movements and the whole-street
counts in `rockridge.assessment.md`, and `signalObservations` in `data/areas/rockridge.json`
carries the signal timing into the network. The count's hour 5 to 6 PM lies inside the period
window 16:00 to 18:00 of `pm_peak` and 8 to 9 AM inside 7:00 to 9:00 of `am_peak`. The model's
period rate is the hourly rate of the whole window, so the busiest hour of the window can be
somewhat above it. The Oakland and Caltrans counts are peak hours too, so all counts are used as
the hourly rate of their period in the same way. Midday has no interior count.

The router's control delays (signal, all-way stop, minor stop approach, circle) are in `crates/sim/data/node-delays.json`, read by the simulator and by the demand fit. `npx tsx tools/node-delays.ts --dir DIR --seeds 1-3 --write` rewrites them from kept seed reports (`--keep-seeds DIR`) and writes `rockridge.node-delays.md`. `calibrate` reports, in the seed JSON, the simulator's count of the volunteer count's turning movements and whole-street routes (`features`, select-link trips per hour, read from the station file the demand build writes) and the plan of every signal with an observed timing (`observedSignals`); `tools/assess.ts` prints them with the interior blocks, the entries by side and Colby Street and Hillegass Avenue block by block.
