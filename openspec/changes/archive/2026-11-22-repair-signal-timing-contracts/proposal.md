## Why

Signal retiming can be accepted without changing the simulated signal. On the audited Rockridge data, a request for a 100-second cycle at Colby Street and Claremont Avenue leaves the cycle at 79 seconds because an observed timing takes precedence over the intervention. A separate timing-budget defect makes the MLK Way ramp signal run a 52-second cycle although its observation specifies 50 seconds. Both affect route costs, queues, and comparisons of proposed changes.

These are confirmed implementation defects at commit `415df88`, reproduced through the public Rust `Eff` and `Topo` APIs. Their effect on published proposal rankings has not been measured.

## What Changes

- Give an explicit cycle intervention precedence over baseline observed timing, and state how that releases observed green-duration constraints while retaining the phase structure.
- Validate that phase greens and clearance intervals fit the requested or observed cycle. Report incompatible timing data before running a simulation.
- Reconcile the Rockridge ramp observation with its source and the simulator's clearance convention; keep the provenance of any correction.
- Cover initial plans, adaptive updates, removal of interventions, and native/WASM behavior with regression tests.

## Capabilities

### Modified Capabilities
- `interventions`: explicit signal cycle precedence and invalid-cycle reporting.
- `traffic-simulation`: observed timing budgets and diagnostics.

## Impact

Primary code: `crates/sim/src/eff.rs`, `crates/sim/src/model.rs`, `crates/sim/src/sim.rs`, `crates/sim/src/wasm.rs`, and their signal tests. Data/import paths: `tools/lib/signal-obs.ts`, `data/areas/rockridge.json`, and the generated network. The UI and CLI need to report a rejected plan clearly.

Out of scope: changing demand, fitting the model to compensate for these defects, new signal-control algorithms, or changing published rankings before rerunning the affected cases. This change is a proposal for later implementation; no model fixes or new results are included.
