## Why

Street colors on the map blinked between blue, gray and orange (or between colors and gray with no intervention) instead of holding a value. Each street's number came from the last five simulated minutes, and on a quiet street one vehicle is worth 12 veh/h, which is more than the 7.5 veh/h noise band used for cut-through. Streets crossed the band back and forth as single vehicles entered and left the window. People also asked for a faster way to see where a scenario ends up, and for a way to save what the map shows.

## What Changes

- Per-street values are averages over the simulated time so far, so they move slowly and never fall back to "no data" once a street has carried traffic. The change view fades in from the noise band instead of switching on at it. The legend says what the values are.
- Playback opens at 20x and gains an Instant option that runs both simulations to the end of the hour without drawing frames, shows progress, and can be stopped by pausing or choosing another speed. Results match a normally played run.
- Right-clicking the map, pressing the Menu key or Shift+F10, or choosing "Download map image" in the playback controls saves the map as a PNG (JPEG from the context menu) with legend, caption and the OpenStreetMap credit.
- The simulator reports link statistics averaged over the run (WASM `linkStats`); the rolling five-minute figures stay for native callers.

## Capabilities

### Modified Capabilities
- `simulator-ui`: playback speeds and Instant, steady street values, soft noise band, image export.
- `traffic-simulation`: run-averaged link statistics.

## Impact

`crates/sim/src/sim.rs` (link-stat reporting only), `crates/sim/src/wasm.rs`, `src/sim/*`, `src/lib/change.ts`, `src/lib/legend.ts`, `src/lib/mapexport.ts`, `src/components/MapView.tsx`, `MapMenu.tsx`, `Toolbar.tsx`, `src/App.tsx`. Scenario links are unchanged and do not carry the speed.
