## Why

The simulated network is about five times larger than the study area so that routes into
the neighborhood come from the model. Showing all of it made the map busy and drew the
eye away from the streets people care about. The overlay's color scale also re-scaled as
traffic changed, which made the colors hard to read from one moment to the next.

## What Changes

- The map shows the study area plus a 250 m buffer and nothing beyond it. The camera
  cannot leave that region. The simulation still runs on the whole network.
- The street picker and Streets table cover the same region. The toggle for streets
  outside the study area is removed.
- Overlay scales are fixed. Cut-through tops out at 150 vehicles an hour, flow at 800,
  and values above take the top color.
- The app opens on a period that is not marked experimental.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `simulator-ui`: what the map shows, how overlays are scaled, which period opens first

## Impact

`src/` only. No data or simulation change.

## Out of scope

Trimming the downloaded files to the visible region. They still carry the whole network,
because the simulation needs it.
