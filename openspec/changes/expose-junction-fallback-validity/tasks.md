## 1. Measure current behavior

- [ ] 1.1 Add diagnostics for each recovery reason, distinguishing evaluated eligibility, blocked attempts and actual affected admissions; define rate denominators and event deduplication.
- [ ] 1.2 Record node, movement, time and wait for detailed recovery events, with bounded storage or streaming and separate initialization/measurement totals.
- [ ] 1.3 Run current Rockridge baselines and representative intervention scenarios with matched seeds to establish whether and where fallback decisions occur.

## 2. Preserve physical constraints

- [ ] 2.1 Separate behavioral courtesy and gap-acceptance fallback from physical exclusion; document each policy and its empirical basis or assumption status.
- [ ] 2.2 Replace the wait-based physical-conflict bypass with a recovery policy that preserves occupancy and downstream-space constraints and accounts for every reroute/removal.
- [ ] 2.3 Extend invariants to node-transit membership and conflict-point occupancy, including vehicles held beyond their planned crossing time.
- [ ] 2.4 Add the synthetic cases in `design.md`, including active `transit_blocks` protection beyond the threshold, valid nonoverlapping concurrency and malformed bookkeeping.

## 3. Compare and report

- [ ] 3.1 Run matched sensitivity cases for current behavior, disabled behavioral fallback and the proposed production policy; report uncertainty across seeds and per-node concentrations.
- [ ] 3.2 Explain effects on backlog, throughput, removals, time and safety surrogates before retuning any demand or capacity parameter.
- [ ] 3.3 Include recovery policy and validity summaries in calibration reports, exported/stored results and their user-facing interpretation; coordinate schema changes with other review proposals.
- [ ] 3.4 Run the Rust suite, native/WASM parity and relevant report tests; validate the OpenSpec and archive only after implementation passes.
