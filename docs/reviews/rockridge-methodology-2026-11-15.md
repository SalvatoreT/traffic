# Rockridge methodology review, 2026-11-15

Audited source: `415df88c33224b433abc52e52fbed5132849be63`. The review covers simulator accounting, signal behavior, junction recovery, calibration evidence, proposal reporting, and the meaning of safety and transferability claims. Reproductions use synthetic fixtures or the downloaded Rockridge data identified in the linked designs. Downloaded data are a separate input from the Git revision.

The findings support six open changes for later implementation. They establish defects and limits in the evidence behind comparisons; they do not establish which Rockridge intervention would perform best after repair. The area already declares its baseline uncalibrated.

## Evidence and priorities

Evidence classes describe what each finding establishes:

- Executed reproduction: a bounded probe produced the reported behavior. Synthetic inputs establish an implementation defect, without measuring its prevalence or effect in Rockridge.
- Source/data trace: the relevant control flow, calculation, or input dependency is identified. A reachable path does not establish how often full runs use it.
- Methodological limitation: the calculation or cited evidence does not support the stated interpretation. This does not quantify the resulting error or prove that a published ranking is wrong.

P1 (high) means a defect can invalidate a scenario contract, reported comparison, or calibration verdict. P2 (medium) means a metric or claim has misleading semantics or missing validity evidence that needs correction before that interpretation is used. Priority reflects the use of the evidence, not a measured traffic impact.

## Findings and proposed work

| Change | Main findings | Evidence and priority |
| --- | --- | --- |
| [Local trip measurement integrity](../../openspec/changes/archive/2026-11-22-repair-local-trip-measurement-integrity/proposal.md) | Delay subtracts complete first/last links for partial local trips. One-link trips receive identical origin and destination positions and can complete with zero distance. Completion clocks can precede arrival, and terminal movement is omitted from exposure counters. | Executed synthetic WASM reproduction for delay, endpoints, and negative time; source trace for terminal accounting. E1/E2 P1; E3 P2. |
| [Signal timing contracts](../../openspec/changes/archive/2026-11-22-repair-signal-timing-contracts/proposal.md) | Observed timing overrides an explicit scenario cycle. Colby/Claremont remains at 79 seconds when 100 or 150 seconds is requested. A separate observed ramp plan declares 50 seconds but executes 52 seconds after clearance is added. | Public Rust API reproduction and source/data trace. SIG-1/SIG-2 P1. The ramp worksheet's effective/displayed green and clearance meanings still need reconciliation. |
| [Junction fallback validity](../../openspec/changes/expose-junction-fallback-validity/proposal.md) | Prolonged waiting relaxes approach-gap/stop-order checks at 90 seconds and skips active in-node conflict checks at 120 seconds. The invariant checker does not inspect node-transit occupancy. Recovery needs separate behavioral diagnostics and unconditional physical conflict exclusion. | Source trace, P2. Physical collisions, usage frequency, and the effect on Rockridge results have not been demonstrated. Tests must distinguish simultaneous occupancy conflicts from valid nonoverlapping crossing movements. |
| [Calibration evidence](../../openspec/changes/archive/2026-11-22-protect-calibration-evidence/proposal.md) | Held-out directions can be reconstructed from fitted derivatives of the same AADT; count-derived priors are built before the split. Spatial exclusion omits interior whole-street dependencies. Reused assessment runs can receive an unrelated stability verdict and an incorrect seed count. Variant outputs can replace shared evidence, and primitive deviations do not enter the final verdict. | Source/data traces for C1-C3/C5-C6; bounded synthetic assessment reproduction for C4. C1/C2/C4 P1; C3/C5/C6 P2. |
| [Proposal evidence integrity](../../openspec/changes/archive/2026-11-22-proposal-evidence-integrity/proposal.md) | Proposal freshness omits simulator identity; annotation can mix new pictures with old figures. The reported block that gains most is selected by adjusted penalty and need not have the largest raw increase. Baseline-only spread cannot measure uncertainty in paired scenario effects or option differences. | Executed reader/Rust probes and source traces for R1/R2; methodological limitation for R3. R1/R3 P1; R2 P2. |
| [Safety and transferability claims](../../openspec/changes/archive/2026-11-22-correct-safety-and-transferability-claims/proposal.md) | Cyclist severity uses car speed where the source uses relative closing speed; passing geometry lacks a source-compatible justification. The summary adds pedestrian AIS4+ and cyclist MAIS3+ means and omits encounter denominators. External London averages are described as local targets, and fixed-demand displacement is called an upper bound without establishing one. | Source/code traces and source-scope review, with source-access limits recorded in the design. SAF-1/SAF-2/EVD-1 P2. |

Each change's `design.md` contains the evidence, reproduction details, decisions, alternatives, and limits. Its unchecked `tasks.md` defines the implementation and verification work. The table does not imply that a proposed repair is already present.

## Implementation order and dependencies

1. Preserve the audited inputs and evidence before regenerating reports. Implement calibration run manifests/output isolation and proposal provenance checks early so later repairs cannot silently reuse incompatible figures. These protections can proceed alongside engine work.
2. Add junction recovery diagnostics before changing its policy. Repair local trip accounting and signal timing, reconcile invalid observed timing data, and define physical junction invariants. Use corrected travel-time and exposure accounting when comparing recovery policies. Establish primitive validity and native/WASM agreement before tuning demand to the changed engine.
3. Rebuild calibration demand with observation lineage and a split applied before count-derived preprocessing. Reassess the exact compatible run set, carrying primitive deviations and limits on independent validation. Do not interpret a better pass rate alone as proof that a repair improved validity.
4. Implement paired comparison reporting, raw maximum semantics, and the safety output changes with explicit schema/version handling. Coordinate safety metric identity with proposal and stored-result provenance. Regenerate baseline evidence and affected package comparisons only after those contracts agree, retaining the old/new identities and changed classifications.

The existing [search-keeps-known-packages](../../openspec/changes/search-keeps-known-packages/proposal.md) remains separate. It addresses candidate retention and beam behavior. Its stable-option comparison must consume the paired-effect contract from proposal evidence integrity; retaining known packages does not repair measurement, calibration, or uncertainty defects.

## Scope and remaining work

This is a software and methodology review, not independent field validation. It does not verify every imported observation, rederive every source equation, rerun the full proposal search, measure every defect's effect on published results, or establish causal traffic or crash effects. Source checks and access limits are recorded in the individual designs. Prior use of evaluation data during model development remains relevant even after a cleaner retrospective split.

The user requested findings and implementable OpenSpec proposals for a later agent. Simulator behavior, demand, acceptance thresholds, current claims, and published results remain intentionally unchanged by this review. The six changes stay open and their implementation tasks remain unchecked; they must not be archived as completed work.
