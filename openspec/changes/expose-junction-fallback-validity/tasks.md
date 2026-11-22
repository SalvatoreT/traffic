Status (2026-11-22): left open. Tasks 1.1 to 3.3 are done, and the stored results already carry the figures: `Metrics::junctionRecovery` is serialized into every proposal result file under `public/data/results/rockridge/` (policy, node entries, and per reason the head-seconds invoked and blocked and the admissions), and the seed report, multi-seed summary and assessment state the policy and the admissions per hour (`crates/sim/src/bin/calibrate/multi.rs:252-256`, `tools/lib/assess.ts` `recoverySentence`, `tools/recovery-sentence.test.ts`). What remains for 3.3b is the user-facing interpretation of those stored figures: no UI surface shows a recovery validity summary (the only reader is `healthOf` in `src/lib/redistribution.ts:181`, which takes `heldRemovals`), and `docs/data-files.md` and the generated text pages do not describe the `junctionRecovery` object or say how to read it. The proposal names a compact validity summary for the UI and the stored-result contract, and that has not been built. Task 3.4 follows from it: it is ticked off only after 3.3b, since archiving waits on implementation, and the suites should be rerun then. Both tasks are left unticked on purpose, because closing them needs a UI and documentation change and a decision on its form that this housekeeping pass does not make.

## 1. Measure current behavior

- [x] 1.1 Add diagnostics for each recovery reason, distinguishing evaluated eligibility, blocked attempts and actual affected admissions; define rate denominators and event deduplication.
- [x] 1.2 Record node, movement, time and wait for detailed recovery events, with bounded storage or streaming and separate initialization/measurement totals.
- [x] 1.3 Run current Rockridge baselines and representative intervention scenarios with matched seeds to establish whether and where fallback decisions occur.

## 2. Preserve physical constraints

- [x] 2.1 Separate behavioral courtesy and gap-acceptance fallback from physical exclusion; document each policy and its empirical basis or assumption status.
- [x] 2.2 Replace the wait-based physical-conflict bypass with a recovery policy that preserves occupancy and downstream-space constraints and accounts for every reroute/removal.
- [x] 2.3 Extend invariants to node-transit membership and conflict-point occupancy, including vehicles held beyond their planned crossing time.
- [x] 2.4 Add the synthetic cases in `design.md`, including active `transit_blocks` protection beyond the threshold, valid nonoverlapping concurrency and malformed bookkeeping.

## 3. Compare and report

- [x] 3.1 Run matched sensitivity cases for current behavior, disabled behavioral fallback and the proposed production policy; report uncertainty across seeds and per-node concentrations.
- [x] 3.2 Explain effects on backlog, throughput, removals, time and safety surrogates before retuning any demand or capacity parameter.
- [x] 3.3 Include recovery policy and validity summaries in calibration reports (seed report, multi-seed summary, assessment; calibration round 28).
- [ ] 3.3b Carry them into exported/stored results and their user-facing interpretation; coordinate schema changes with other review proposals.
- [ ] 3.4 Run the Rust suite, native/WASM parity and relevant report tests; validate the OpenSpec and archive only after implementation passes.
