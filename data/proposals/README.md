# Proposal search

`cargo run --release -p traffic-sim --bin explore` searches for packages of interventions that cut cut-through traffic on the study area's residential and service streets without piling it onto any one block. It writes `public/data/<area>.proposals.json` (read by the app's Proposals tab) and a short report, `data/proposals/<area>.md`. The design is in `openspec/changes/proposals/design.md`; the code is in `crates/sim/src/explore/`.

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

Each run writes only its own group in `public/data/<area>.proposals.json` (version 2, `groups` in the profiles file's order) and its own section in the report, and keeps the other groups. A file in the earlier single-list format counts as the unconstrained group. Run each profile separately:

```
cargo run --release -p traffic-sim --bin explore -- --area rockridge --periods pm_peak,am_peak --seeds 1,2,3 --profile charter
```

Do not start an unconstrained run from an older build while another run is writing: whichever finishes last rewrites the file in its own format.

## What it measures

- **Goal.** Cut-through vehicles per hour (`metrics().cutThrough.vehiclesPerHour`): gate-to-gate trips that use at least one in-study residential or service link, each counted once, averaged over the periods.
- **Harm.** The largest increase in total flow, both directions summed, on any one in-study residential or service block, in veh/h, taken over the periods. Each block's increase is reduced by its noise band, `max(2 x the standard deviation of the block's baseline flow across seeds, 10 veh/h)`, and floored at zero. Both constants are in `explore/mod.rs`. With one seed there is no spread, so the band is the 10 veh/h floor, which is too low for short runs; use at least two seeds for a run you publish.
- **Context** (information only): flow and speed change on the arterials that run through the study area, mean time of trips that start or end inside it, and pedestrian and bicycle conflict counts.

Flow figures use the window after a warm-up of the first 25% of the run, at most 10 minutes. The cut-through count covers the whole run from an empty network and is divided by the run length, the same as the metric in the app.

## Candidates

Select-link analysis of the baseline ranks the in-study blocks and intersections by cut-through trips. The top `--candidates` locations get every intervention the app offers there and that fits: modal filter on a block; modal filter at an intersection and diagonal diverters (both orientations, four-leg intersections), only where every street is residential or service; one-way in each direction on two-way blocks; speed hump at mid-block where none exists; traffic circle at four-leg uncontrolled or stop-controlled intersections of local streets; 15 and 20 mph limits where the limit is higher; all-way stop where the control is a two-way stop or none; 60 and 120 s cycles at existing signals that cut-through passes. Turn bans cover the heaviest cut-through movements from an arterial onto a local street. A proposal never adds a signal. Equivalent candidates are merged.

## Search

Every candidate is screened alone on the first period and seed at `--screen-minutes`. A beam of the best `--beam` packages is then extended one intervention at a time, up to `--depth`, with the best `--expand` singles plus repair moves (candidates on or next to the blocks that gained traffic). The score is cut-through reduction in percent minus `--harm-weight` percent per veh/h of harm; the weight is an assumption. Screening shares seeds with the baseline. The search keeps every evaluated package and takes the non-dominated ones on (reduction, harm, number of interventions); up to `--finalists` of them are rerun for `--minutes` over all periods and seeds. Only those results are published.

A package is rejected before simulation if an intervention is invalid or any in-study node loses its way in from a gate or out to one (nodes already cut off in the baseline do not count). It is rejected after a run if unroutable trips exceed the baseline's. Gridlock removals and entry backlog beyond the baseline's by more than 20% plus 10 vehicles, and 5% of spawned trips, are also rejected, because removed or queued vehicles would otherwise read as a reduction. Results do not depend on `--jobs`.

## Choosing the options

From the rechecked finalists the tool keeps those that no other finalist beats on reduction, harm and size, drops any whose reduction is within noise of a simpler one, always keeps the best single intervention and the best overall, and spreads the rest by reduction up to `--options`. Two reductions are within noise when they differ by less than `max(1%, 2 x the baseline's run-to-run spread of cut-through)`.

## Reading the file

`public/data/<area>.proposals.json` follows the contract in the design. Interpretations worth knowing:

- `cutThrough.changePct` is negative for a reduction. `baselineVehPerHour` and `scenarioVehPerHour` are through vehicles an hour, averaged over the periods and seeds. The file is version 3; groups written by version 2 report vehicle-miles and the app shows them as out of date until they are computed again.
- `harm.worstIncreaseVehPerHour` is after the noise band. `harm.worstBlock` is the block with the largest such increase over the periods; when every block is inside its band it names the block with the largest raw increase and the value is 0. `blocksAboveNoise` counts blocks past their band in any period.
- `byPeriod[p].worstIncreaseVehPerHour` is the same figure for one period; the overall figure is the maximum over periods.
- `context.boundingStreets` lists the named primary, secondary and tertiary streets with in-study links, summed over their in-study links. `flowChangePct` compares summed flow, `speedChangeMph` the flow-weighted mean speed.
- `link` opens the package on the first searched period.
- `computed.networkHash` and `demandHash` are the first 16 hex characters of the SHA-256 of the file bytes of `public/data/<area>.network.json` and `<area>.demand.json`. `calibration` is the status in `public/data/areas.json`.

Scenario links come from a Rust port of `src/lib/hash.ts`; `crates/sim/tests/fixtures/links.json` holds strings made by the TypeScript encoder (`npx tsx tools/gen-proposal-link-fixtures.ts`) that the Rust tests must match.

## Reference packages

`data/proposals/<area>.references.json` lists packages written by hand, evaluated by the same full recheck and published after the search options with `kind: "reference"` and a `note`. They skip the non-dominated filter and the option cap. Places are given by street name so the file survives network rebuilds: `{ "type": "modal_filter", "at": ["A", "B"] }` for a node, `{ "type": "modal_filter", "on": "A", "between": ["B", "C"] }` for a block, and for diverters `"connect": [["A", "south"], ["B", "west"]]` (a pair of legs that stay connected). The resolver fails with a clear message when the names match no node or more than one. Search entries have `kind: "search"`.
