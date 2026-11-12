## Why

The app shows what a set of interventions does only after a simulated hour. A package
that leaves one parallel street open looks as good as a watertight one until the run
shows the diverted traffic. Low-traffic-neighborhood design practice has a quick test
for this that needs no simulation: can a driver still get from one boundary road to
another through the area?

## What Changes

- An instant check, updated as interventions are added or removed, that divides the
  streets inside the study area into cells and lists the through routes that remain.
- The Scenario panel reports the count of remaining through routes and lets the user
  show them on the map.
- Each proposal on the Proposals tab shows the same figure next to its simulated results.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `simulator-ui`: a through-route check that runs without the simulation

## Impact

`src/` only. Graph analysis on the loaded network. No data change.

## Out of scope

Using the check inside the proposal search. Predicting how much traffic each remaining
route would carry: that is what the simulation is for.
