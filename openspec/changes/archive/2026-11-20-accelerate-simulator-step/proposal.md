## Why

Running one hour on the full Rockridge network takes tens of seconds. Comparing proposals across several periods and seeds repeats that cost. The user asked for a tenfold reduction in the time for one run.

## What Changes

- Profile a release build on the published wide network and demand, then reduce repeated work in the simulator's fixed-step loop.
- Compare elapsed time for identical fresh runs. Check the resulting traffic and individual trajectories on native and WebAssembly builds.

## Capabilities

### Modified Capabilities

- `traffic-simulation` — preserve the seeded vehicle states, through trips, and per-street counts across a performance-only change.

## Impact

The change covers the Rust simulation core used by the browser, the proposal search, and the native calibrator. Calibration, demand fitting, the modeled area, and browser rendering are outside this change.
