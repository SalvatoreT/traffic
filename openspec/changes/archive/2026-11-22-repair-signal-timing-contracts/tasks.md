## 1. Reproduce and pin the contract

- [x] 1.1 Add small signal fixtures combining observed timing and explicit cycle interventions; reproduce SIG-1 before changing behavior.
- [x] 1.2 Add an incompatible observed-cycle fixture with the SIG-2 duration budget, plus an infeasible explicit cycle and a feasible control case.
- [x] 1.3 Inspect the cited ramp worksheet and document effective/displayed green and clearance interpretation before editing its data.

## 2. Implement signal plan validation and precedence

- [x] 2.1 Give explicit cycles precedence, retain observed phase topology, and release observed green-duration pins for the scenario.
- [x] 2.2 Validate duration budgets in observed and generic plan allocation; propagate actionable diagnostics through native, WASM, CLI, and UI paths.
- [x] 2.3 Preserve the successful explicit cycle through adaptation and restore the baseline observation when the intervention is removed.
- [x] 2.4 Reconcile incompatible Rockridge observation data with source provenance, adding observation-specific clearance support only if justified.

## 3. Verify and update affected evidence

- [x] 3.1 Pass tests for initial plans, own/shared phases, adaptation, invalid budgets, and removal of interventions.
- [x] 3.2 Run native/WASM parity and the relevant TypeScript/import tests.
- [x] 3.3 Recheck all observed Rockridge junctions and rerun affected baseline calibration periods; report changed results without compensating demand edits.
- [x] 3.4 Regenerate affected stored results and reports with current hashes through the normal data workflow, if those artifacts are published as part of implementation.
  Closed 2026-11-22: the affected artifacts are published and were regenerated on the current simulator through the normal workflow. The published network carries `clearanceS: 4` on the three timings of the MLK Way ramp signal (the data import of `data/areas/rockridge*.json`); `public/data/results/rockridge/*.json` holds 26 stored results, all with `inputs.simulator` 6b886c8f52ee07397773ddd0ebbcb447 and network hash 53c823f20d9165ed, the build the later regenerations stamped; and `data/calibration/rockridge.record.md` ("Published set regenerated on the faster simulator (2026-11-21)", 2026-11-21 evening publish) records the full chain: `npm run data`, `validate`, `assess --publish --noise`, proposal search, redistribution, results, text pages and preview cards, followed by the 2026-11-21 derived-targets publish. No signal-timing figure was edited by hand.
- [x] 3.5 Validate this OpenSpec change strictly and archive it only after implementation and verification.
  Closed 2026-11-22: the code is on main (`crates/sim/src/eff.rs:858-873`: explicit cycles, observed clearance, and a plan whose greens and clearances do not fill its cycle is returned as an issue, never silently stretched). The two ADDED interventions requirements and the one traffic-simulation requirement do not exist in `openspec/specs/`, so the deltas apply unchanged. The change prose was read against `.claude/skills/humanizer/SKILL.md` with no tells to fix. Validated strictly, then archived.
