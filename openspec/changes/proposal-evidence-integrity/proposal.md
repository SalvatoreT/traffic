## Why

The proposal pipeline can present results as current after the simulator changes, and its "block that gains the most" can be a block with a smaller raw increase. It also uses the baseline's seed spread to make claims about scenario differences, without measuring the spread of those differences. These are separate failures in the evidence behind the proposal cards. The findings, executable examples, and limits of the audit are in `design.md`.

## What Changes

- Record the simulator fingerprint and the reporting method version with every proposal group. Refuse to mix pictures and figures from different model runs, and mark missing provenance as unverified.
- Preserve paired results by seed for the final comparisons. Report uncertainty in scenario effects and option differences using a documented method, with enough fixed seeds to support the precision claimed [WebTAG-M3.1; TfL-TMG4]. Keep a practical screening threshold distinct from an uncertainty interval.
- Report the block with the largest raw increase separately from the block that contributes the largest adjusted search penalty. Give unresolved increases their value and uncertainty status.
- Carry these meanings into the UI, text pages, and exported proposal pictures.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `proposals`: provenance checks, annotation consistency, paired effect estimates, and the meaning of the worst-block figures.

## Impact

Primary files: `crates/sim/src/explore/{report,search,annotate}.rs`, `src/lib/proposals.ts`, `src/components/Proposals.tsx`, and proposal text/image generators. The proposal schema needs a version change or explicit legacy treatment. Recomputing final comparisons and generated artifacts will be necessary after implementation.

The existing `search-keeps-known-packages` change remains responsible for candidate retention and the beam. Its use of a baseline-derived noise band for choosing stable options must consume the comparison contract introduced here.

## Out of scope

This proposal does not choose an intervention package, change the beam search, calibrate demand, or establish real-world causal effects. It does not implement the fixes. The user requested review findings and future work on `main` on 2026-11-15; implementation tasks remain open for a later agent.
