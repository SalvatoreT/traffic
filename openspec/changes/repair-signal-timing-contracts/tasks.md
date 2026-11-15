## 1. Reproduce and pin the contract

- [ ] 1.1 Add small signal fixtures combining observed timing and explicit cycle interventions; reproduce SIG-1 before changing behavior.
- [ ] 1.2 Add an incompatible observed-cycle fixture with the SIG-2 duration budget, plus an infeasible explicit cycle and a feasible control case.
- [ ] 1.3 Inspect the cited ramp worksheet and document effective/displayed green and clearance interpretation before editing its data.

## 2. Implement signal plan validation and precedence

- [ ] 2.1 Give explicit cycles precedence, retain observed phase topology, and release observed green-duration pins for the scenario.
- [ ] 2.2 Validate duration budgets in observed and generic plan allocation; propagate actionable diagnostics through native, WASM, CLI, and UI paths.
- [ ] 2.3 Preserve the successful explicit cycle through adaptation and restore the baseline observation when the intervention is removed.
- [ ] 2.4 Reconcile incompatible Rockridge observation data with source provenance, adding observation-specific clearance support only if justified.

## 3. Verify and update affected evidence

- [ ] 3.1 Pass tests for initial plans, own/shared phases, adaptation, invalid budgets, and removal of interventions.
- [ ] 3.2 Run native/WASM parity and the relevant TypeScript/import tests.
- [ ] 3.3 Recheck all observed Rockridge junctions and rerun affected baseline calibration periods; report changed results without compensating demand edits.
- [ ] 3.4 Regenerate affected stored results and reports with current hashes through the normal data workflow, if those artifacts are published as part of implementation.
- [ ] 3.5 Validate this OpenSpec change strictly and archive it only after implementation and verification.
