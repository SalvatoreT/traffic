## Why

The owner reviewed the filter marks on a phone and found two faults. A block filter drew striped tape along the whole block ("running along Ayala"), and the leg bars were fixed-size marks placed at least 36 px from the badge, so zoomed out they floated away from the streets and overlapped.

## What Changes

- Every barrier is a short bar across the street, never along it.
- Bars are map features in ground units. They stay on their street at every zoom and shrink with the roads.
- A block filter draws one bar at the block midpoint instead of tape along the block.
- The map image export draws the same bars.

## Impact

`src/lib/blocked.ts`, `src/components/MapView.tsx`, `src/lib/mapexport.ts`, `src/styles.css`, and the simulator-ui spec. No simulator or data change.
