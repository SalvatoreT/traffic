## Why

Local trips can finish with negative travel time and strongly negative delay. Their entry and exit points are sampled with the same key on a single-link route, so they finish where they started. On longer routes, delay subtracts free-flow time for road sections the trip never drove. These are confirmed accounting defects at `415df88c33224b433abc52e52fbed5132849be63`; the evidence script reproduces both through the public WASM API.

Incorrect delay can change comparisons when interventions move trips onto different blocks. The single-link defect also removes driving exposure while counting a completed trip. Its prevalence in full Rockridge runs has not been measured.

## What changes

- Give local trip origins and destinations distinct, reproducible physical positions, including trips that use one link.
- Compute a trip's free-flow reference over the actual first and last link portions, with movement and hump terms charged only where traversed.
- Make arrival, insertion and completion timestamps causal within the fixed simulation step.
- Account for the distance and elapsed time traveled in a trip's final step before removing it.
- Add synthetic regression cases and measure the effect on Rockridge reports before recalibrating or republishing results.

## Capabilities

### New capabilities

None.

### Modified capabilities

- `traffic-simulation`: local trip endpoints, time and delay accounting, and terminal-step exposure.

## Impact

Affected code includes `crates/sim/src/sim.rs`, initial loading, simulation tests and regenerated results. Native and WASM outputs must still agree. Fixes will change the simulator fingerprint and invalidate stored results from the old implementation.

## Out of scope

This change does not tune demand or claim a preferred intervention. It does not introduce a new behavioral distribution for parking or driveways without documenting that assumption. User decision, 2026-11-15: land review findings and implementable proposals on `main`; leave implementation and archival for a later agent.
