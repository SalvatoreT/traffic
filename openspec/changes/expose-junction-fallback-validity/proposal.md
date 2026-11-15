## Why

The simulator stops checking active node conflicts after a vehicle waits 120 seconds. Both admission checks contain this exception. An earlier fallback drops approach-gap and stop-order checks after 90 seconds. These values are documented assumptions, but the results do not report how often they influence admissions. `check_invariants` checks lanes and does not validate node-transit occupancy.

This code path can affect simulated capacity and the interpretation of safety indicators. The audit did not measure its frequency in Rockridge or demonstrate a collision. Low gridlock removals alone cannot establish that junction operation remained physically valid.

## What changes

- Report fallback decisions by reason, node and time, distinguishing eligible attempts from admissions that actually needed a fallback.
- Preserve physical conflict exclusion through every production recovery policy; document courtesy behavior separately.
- Check node-transit bookkeeping and the time intervals in which vehicles occupy shared conflict points.
- Compare current behavior, fallback-disabled behavior and a physically valid recovery alternative using matched inputs and seeds.
- Carry fallback evidence into calibration and proposal reports before interpreting stability or safety results.

## Capabilities

### New capabilities

None.

### Modified capabilities

- `traffic-simulation`: fallback diagnostics, physical junction invariants and documented recovery behavior.
- `calibration`: sensitivity to junction recovery assumptions and reporting of their use.

## Impact

Affected code includes `crates/sim/src/sim.rs`, `params.rs`, diagnostics and calibration report generation. The UI and stored-result contracts need a compact validity summary. A recovery change may reduce modeled throughput or reveal queues that the current behavior clears. Recalibration must follow these checks.

## Out of scope

This proposal does not assert that current Rockridge runs contain collisions, set a numeric acceptance threshold for fallback use, or replace gap-acceptance parameters with new fitted values. User decision, 2026-11-15: commit the observations and proposals to `main`; implementation and archival remain later work.
