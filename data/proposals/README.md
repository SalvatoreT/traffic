# Proposal search

`cargo run --release -p traffic-sim --bin explore` searches for packages of interventions that cut cut-through traffic on the study area's residential and service streets without piling more traffic onto any one block. It writes `public/data/<area>.proposals.json` (read by the app's Proposals tab) and a short report, `data/proposals/<area>.md`. The design is in `openspec/changes/proposals/design.md`; the code is in `crates/sim/src/explore/`.

```
cargo run --release -p traffic-sim --bin explore -- --area rockridge \
  --periods pm_peak,am_peak --seeds 1,2,3 --beam 3 --depth 8 --candidates 40 \
  [--screen-minutes 30] [--minutes 60] [--budget-evals N] [--jobs N] [--harm-weight 0.1] \
  [--expand 16] [--finalists 12] [--options 5] [--out FILE] [--report FILE] \
  [--profile ID] [--profiles FILE]
```

The simulator results change whenever the network, the demand or the model changes, so rerun the search after any of them. The output is not meant to be edited by hand.

## Profiles

`data/proposals/<area>.profiles.json` lists constraint profiles: `{ id, title, note, excludeTypes, excludeBoundary }`. `--profile ID` removes the excluded intervention types from the candidates, and with `excludeBoundary` also every candidate on a bounding street or at an intersection with one (the non-residential, non-service links inside the study area, and the nodes they touch). A block that ends at a bounding street counts as at its intersection. Reference packages are skipped for a constrained profile. Without `--profile` the run is the unconstrained group, titled and described by the file's `unconstrained` entry if it has one.

Each run writes only its own group in `public/data/<area>.proposals.json` (version 4, `groups` in the profiles file's order) and its own section in the report, and keeps the other groups. A file in the earlier single-list format counts as the unconstrained group. Run each profile separately:

```
cargo run --release -p traffic-sim --bin explore -- --area rockridge --periods pm_peak,am_peak --seeds 1,2,3 --profile charter
```

Do not start an unconstrained run from an older build while another run is writing: whichever finishes last rewrites the file in its own format.

## What it measures

Two kinds of car are counted, and every figure says which. **Through cars** are cars that cross the area without a trip that starts or ends in it. **All cars** are every car on a block, through cars and the local trips of people who start or end a trip in the area. Through cars are part of all cars. They are never added to them, and a through number is never compared with an all-cars number.

- **Goal.** Through cars an hour across all the area's residential and service streets together (`metrics().cutThrough.vehiclesPerHour`), each car counted once, averaged over the periods.
- **Side effect shown on the proposal card (like for like).** The side-street block that gains the most through cars an hour, both directions summed, averaged over the same periods and seeds as the goal. A block counts as gaining only past its noise band, `max(2 x the standard deviation of the block's baseline through flow across seeds, 10 cars an hour)`; for an average over periods the standard deviation is combined across the periods as independent. Both constants are in `explore/mod.rs`. With one seed there is no spread, so the band is the 10 cars an hour floor, which is too low for short runs; use at least two seeds for a run you publish.
- **Search penalty (all traffic).** The ranking penalizes the largest increase in all cars (through and local trips together, both directions summed) on any one block, taken over the periods, after the same kind of noise band computed on all-car flow, floored at zero. The search deliberately uses all traffic here: residents experience every car on their street, so a filter that sends local trips down the next street counts against it. The cards report through cars so that the two headline figures are the same kind of car; the all-traffic change on each period's worst block, with its split into through cars and local trips, is in the card's details.
- **Context** (information only): all-car flow and speed change on the arterials that run through the study area, mean time of trips that start or end inside it, and pedestrian and bicycle conflict counts.

Flow figures, through and all, use the same window: after a warm-up of the first 25% of the run, at most 10 minutes. Through cars per block come from the simulator's per-link cut-through counters (the ones behind the map's cut-through overlay) over that window. The area-wide through count covers the whole run from an empty network and is divided by the run length, the same as the metric in the app, so the area figure and the per-block figures differ slightly in window and are not meant to be added up.

## Candidates

Select-link analysis of the baseline ranks the in-study blocks and intersections by cut-through trips. The top `--candidates` locations get every intervention the app offers there and that fits: modal filter on a block; modal filter at an intersection and diagonal diverters (both orientations, four-leg intersections), only where every street is residential or service; one-way in each direction on two-way blocks; speed hump at mid-block where none exists; traffic circle at four-leg uncontrolled or stop-controlled intersections of local streets; 15 and 20 mph limits where the limit is higher; all-way stop where the control is a two-way stop or none; 60 and 120 s cycles at existing signals that cut-through passes. Turn bans cover the heaviest cut-through movements from an arterial onto a local street. A proposal never adds a signal. Equivalent candidates are merged.

## Search

Every candidate is screened alone on the first period and seed at `--screen-minutes`. A beam of the best `--beam` packages is then extended one intervention at a time, up to `--depth`, with the best `--expand` singles plus repair moves (candidates on or next to the blocks that gained traffic). The score is the reduction in through cars in percent minus `--harm-weight` percent per car an hour of the all-traffic penalty above; the weight is an assumption. Screening shares seeds with the baseline. The search keeps every evaluated package and takes the non-dominated ones on (reduction, harm, number of interventions); up to `--finalists` of them are rerun for `--minutes` over all periods and seeds. Only those results are published.

A package is rejected before simulation if an intervention is invalid or any in-study node loses its way in from a gate or out to one (nodes already cut off in the baseline do not count). It is rejected after a run if unroutable trips exceed the baseline's. Gridlock removals and entry backlog beyond the baseline's by more than 20% plus 10 vehicles, and 5% of spawned trips, are also rejected, because removed or queued vehicles would otherwise read as a reduction. Results do not depend on `--jobs`.

## Choosing the options

From the rechecked finalists the tool keeps those that no other finalist beats on reduction, harm and size, drops any whose reduction is within noise of a simpler one, always keeps the best single intervention and the best overall, and spreads the rest by reduction up to `--options`. Two reductions are within noise when they differ by less than `max(1%, 2 x the baseline's run-to-run spread of cut-through)`.

## Reading the file

`public/data/<area>.proposals.json` follows the contract in the design. Interpretations worth knowing:

- `cutThrough.changePct` is negative for a reduction. `baselineVehPerHour` and `scenarioVehPerHour` are through cars an hour across the area's side streets, averaged over the periods and seeds. The file is version 4; groups written by version 2 (vehicle-miles) or version 3 (one all-traffic worst block beside through cars) are shown by the app as out of date until they are computed again.
- `harm.through.worstBlock` is the block that gains the most through cars an hour, averaged over the periods (with no block past its noise band, the block with the largest raw gain). `increaseVehPerHour` is that block's raw average gain in through cars, both directions. `blocksAboveNoise` counts blocks past their band. When it is 0 the app says no block gains through traffic beyond run-to-run variation and shows no number.
- `byPeriod[p].cutThrough` is the same triple as the overall `cutThrough` for one period. `byPeriod[p].allTraffic` is about all cars, not through cars: `worstBlock` is the block with the largest all-traffic increase in that period (past its band, else the largest raw one), `baselineVehPerHour` and `scenarioVehPerHour` its all-car flow, `throughIncreaseVehPerHour` how much of the change is through cars (the difference of the block's through flow), and `blocksAboveNoise` how many blocks gain all traffic beyond noise in that period. The local trips' share of the change is all-car change minus `throughIncreaseVehPerHour`.
- `context.boundingStreets` lists the named primary, secondary and tertiary streets with in-study links, summed over their in-study links. `flowChangePct` compares summed flow, `speedChangeMph` the flow-weighted mean speed.
- `link` opens the package on the first searched period.
- `computed.networkHash` and `demandHash` are the first 16 hex characters of the SHA-256 of the file bytes of `public/data/<area>.network.json` and `<area>.demand.json`. `calibration` is the status in `public/data/areas.json`.

Scenario links come from a Rust port of `src/lib/hash.ts`; `crates/sim/tests/fixtures/links.json` holds strings made by the TypeScript encoder (`npx tsx tools/gen-proposal-link-fixtures.ts`) that the Rust tests must match.

## Reference packages

`data/proposals/<area>.references.json` lists packages written by hand, evaluated by the same full recheck and published after the search options with `kind: "reference"` and a `note`. They skip the non-dominated filter and the option cap. Places are given by street name so the file survives network rebuilds: `{ "type": "modal_filter", "at": ["A", "B"] }` for a node, `{ "type": "modal_filter", "on": "A", "between": ["B", "C"] }` for a block, and for diverters `"connect": [["A", "south"], ["B", "west"]]` (a pair of legs that stay connected). The resolver fails with a clear message when the names match no node or more than one. Search entries have `kind: "search"`.
