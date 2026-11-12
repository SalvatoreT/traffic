## Why

Residents want to try a diagonal diverter: a barrier across an intersection that turns a
four-way crossing into two separate L-shaped turns, so nobody can drive straight through
on either street. The existing intersection filter blocks every motor movement, which is
a different treatment. The intersection that prompted this is Hillegass Avenue and 62nd
Street, whose two offset legs act as one intersection.

## What Changes

- A new intervention, the diagonal diverter, for intersections with four legs. The person
  chooses which of the two diagonals the barrier follows, which decides the pairs of
  streets that stay connected.
- Motor vehicles, buses included, can only make the two permitted turns. People walking
  and biking pass through.
- Shared links carry the diverter and its orientation.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `interventions`: adds the diagonal diverter
- `simulator-ui`: offers it at four-leg intersections and draws it on the map

## Impact

`crates/sim` (intervention parsing and turn permissions), `src/` (selection menu, map
marker, link encoding). No data files change.

## Out of scope

Diverters at intersections with three or five legs. Emergency-vehicle or bus gates.
