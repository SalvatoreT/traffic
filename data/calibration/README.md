# Calibration targets

`<area>.targets.json` holds observed route shares the baseline model should reproduce.

## Rockridge

Headline figures from a StreetLight Data select-link analysis (January to July 2025) of
Hillegass Ave and Colby St between Alcatraz Ave and Claremont Ave, provided by residents.
Only summary percentages are recorded; the underlying deliverable is not redistributed.
StreetLight samples connected devices, so the shares are estimates and not exact counts.

Key finding: roughly half the traffic on both streets is traveling to or from the
freeway ramps at Claremont Ave, and almost none of the northbound traffic ends up on
College Ave. The model's baseline should show the same pattern before interventions
are compared.

## Running the calibration report

No npm needed (Rust only; reads `public/data/<area>.{network,demand}.json` and `<area>.targets.json`):

```
cargo run --release -p traffic-sim --bin calibrate -- --area rockridge --period pm_peak --minutes 60 --scale 1.0 --seed 1
```

Options: `--local-factor <x>` (override the residential/service perceived-cost multiplier), `--reroute-share <x>` (share of drivers that re-route per 60 s epoch, 0 to 1, default 0.8), `--demand <path>` and `--network <path>` (read other files than `public/data/<area>.{demand,network}.json`, for A/B runs of variant demand), `--cars-only` and `--drop bicycle,pedestrian` (leave modes out), `--adapt-min <m>` (minutes between signal adaptations, default 5, 0 keeps the start-up plans), `--motorway-removal` (apply the gridlock breaker on ramps and the freeway stub too), `--warmup <min>` (flow tables ignore the first N minutes of runs of 30+ min, default 10), `--out <dir>`, `--no-write`, `--link-flows` (adds per-link flow to the JSON).
It prints a markdown report and writes `reports/<area>-<period>-s<scale>-seed<seed>.{md,json}`: stability criteria, vehicles in
network every 5 min, modeled vs observed select-link shares (target blocks resolved from street name, direction and the
two cross streets), ramp shares, top 15 links by delay, top 15 nodes by blocked time (with each signal's cycle and greens at the end of the run), gridlock removals and entry backlog by
location, and flow per direction on the key streets. A full 60-minute run took about 5 s on the original small network; on the wider model area (about 25,000 veh/h offered, 2,162 nodes) it takes about 55 s, and runs of different seeds are independent processes, so run them in parallel (three seeds took about 70 s on four cores). The report also has a per-mode table (cars, buses, cyclists, pedestrians: trips, mean time, crossing delay) and the surrogate-safety counts.

The calibration record with every tuned parameter is `rockridge.record.md`.

## Validation suite

`validation.md` holds the benchmark of the simulator's own primitives, separate from the area fit. Each case is a tiny synthetic network with saturated demand (cars only unless the case adds pedestrians or cyclists) that measures one quantity against a published range:

```
cargo run --release -p traffic-sim --bin validate                      # prints the table, writes validation.md
cargo run --release -p traffic-sim --bin validate -- --before old.json # adds a before column (JSON from --json of an older build)
cargo test --release -p traffic-sim --test validate                    # regression: no case outside its range except KNOWN_DEVIATIONS
```

The cases are lettered: a saturation flow at a signal, b signalized approach capacity (through, left with and without a pocket, right), c two signals 100 and 200 m apart with fixed and adaptive plans, d all-way stop, e two-way stop gap acceptance, f traffic circle entry, g single-lane link capacity, h gate insertion, i motorway lane, exit ramp and off-ramp terminal, j effect of pedestrians and cyclists, k junction traversal. The code is `crates/sim/src/validate.rs`; every expected range names a key of `docs/references.md` or is labeled ASSUMPTION. A run takes a few seconds. Add a case whenever a capacity rule in the simulator changes, and run the suite before tuning demand: a network that jams at half its counted flow has a low primitive somewhere.
