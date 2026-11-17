## Why

A restricted benchmark found that the existing beam search reaches the best short-run score efficiently, but discards useful combinations. It visited 75 packages, compared with 239 scenario simulations for exhaustive evaluation, and found seven of nine nondominated screening tradeoffs. In the subsequent full-hour checks, the strongest missed package scored 27.07 against 24.38 for the beam's screening winner. The difference in through traffic remained unresolved; the higher score came with a smaller worst-block penalty and some increases elsewhere.

These are results for one frozen, uncalibrated PM model and a deliberately small candidate set. They justify testing candidate coverage and pruning rules. They do not establish a preferred street plan. [findings.md](findings.md) records the protocol, packages, and evidence.

## What Changes

- Add a repeatable finite-space benchmark that distinguishes candidate omissions, search pruning, and short-run ranking errors.
- Record why candidates and package paths disappear, including baseline hotspot cutoffs, weak single interventions, and competing designs at the same junction.
- Test a bounded supplement to the existing beam: legal bypass candidates, coordinated starts, and deletion or replacement of interventions. Compare alternatives under declared simulation budgets before choosing production defaults.
- Test whether longer or additional screening runs improve shortlist quality. Preserve the existing separation between selection and independent confirmation.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `proposals`: search coverage diagnostics, finite-space benchmarking, bounded supplementary exploration, and screening-fidelity evaluation.

## Impact

Likely implementation files are `crates/sim/src/explore/{cands,search,report}.rs`, the proposal search CLI, and a benchmark runner. Canonical graph and access checks already exist; use them when generating supplementary candidates. Reuse the comparison and provenance contracts from `proposal-evidence-integrity` and the legal movement graph from `explain-traffic-redistribution`.

## Out of scope

This change records findings and future work only. It does not change production search behavior, choose or publish a package, upload data, replace the simulator, or recalibrate demand. It does not require an evolutionary optimizer. The compact-area experiment on newer `main` is outside the completed benchmark; a different extent needs its own evaluation. The user requested this handoff on `main` on 2026-11-17 so another session can implement it.
