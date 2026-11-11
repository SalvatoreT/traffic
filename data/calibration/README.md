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

Options: `--local-factor <x>` (override the residential/service perceived-cost multiplier), `--warmup <min>` (flow tables ignore the first N minutes of runs of 30+ min, default 10), `--out <dir>`, `--no-write`, `--link-flows` (adds per-link flow to the JSON).
It prints a markdown report and writes `reports/<area>-<period>-s<scale>-seed<seed>.{md,json}`: stability criteria, vehicles in
network every 5 min, modeled vs observed select-link shares (target blocks resolved from street name, direction and the
two cross streets), ramp shares, top 15 links by delay, top 15 nodes by blocked time, gridlock removals and entry backlog by
location, and flow per direction on the key streets. A full 60-minute run takes about 5 s.

The calibration record with every tuned parameter is `rockridge.record.md`.
