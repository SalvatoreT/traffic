## Why

The app lets people try interventions one at a time, but the space of combinations is
large and most of it is bad. People want to know which packages of changes cut the most
cut-through traffic in the Trapezoid without pushing that traffic onto a neighbor's
street. That takes a search, and the results belong in the app where anyone can open
them on the map and check them.

## What Changes

- A search tool runs the simulation over many intervention sets and keeps the ones that
  reduce cut-through most for the least harm.
- A Proposals tab lists about five options, from light-touch to strongest. Each says what
  it does, what it achieves, what it costs, and opens on the map with one action.
- Proposals are generated ahead of time and published as data. The tab states which
  baseline they were computed against and that the baseline is not yet calibrated.

## Capabilities

### New Capabilities

- `proposals`: how candidate intervention packages are searched, scored and published

### Modified Capabilities

- `simulator-ui`: the Proposals tab

## Impact

A new search binary in `crates/sim`, a generated file `public/data/<area>.proposals.json`,
a new tab in the UI. Searching takes tens of minutes of compute per run.

## Out of scope

Searching in the browser. Cost estimates, emergency access review and parking effects.
New traffic signals: the user ruled them out.
