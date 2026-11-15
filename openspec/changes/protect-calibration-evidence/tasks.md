## 1. Observation lineage

- [ ] 1.1 Reproduce C1, C3, and C4 with the attached bounded probe; add isolated fixtures for the C2 and C5 code traces before changing behavior.
- [ ] 1.2 Assign source-observation IDs and dependency groups to directional/period targets, gate totals, class defaults, ramp splits, local-trip scaling, aggregate/path counts, and assumed movement inputs.
- [ ] 1.3 Freeze a group-level split before preprocessing; build cross-validation priors and fitted demand using only training observations.
- [ ] 1.4 Add a held-value perturbation test: preserve the split, alter only withheld raw values, and verify identical training artifacts and predictions with changed scoring targets.
- [ ] 1.5 Cover the Ashby/Tunnel/San Pablo directional pairs and all four whole-street features; test actual path matching, including detours, and record remaining correlated evidence.

## 2. Assessment integrity

- [ ] 2.1 Add compatible manifests to seed reports, summaries, and validation results, including hashes and complete evaluation settings.
- [ ] 2.2 Reject missing, duplicate, mislabeled, stale, or incompatible runs before issuing authoritative verdicts; support clearly labeled partial diagnostics if needed.
- [ ] 2.3 Compute stability from the selected runs or verify their exact identity against the summary. The 9,999-removal probe must never report stable.
- [ ] 2.4 Isolate every variant output, including native summaries and noise. Test that suffixed variants preserve published file hashes.
- [ ] 2.5 Carry primitive failures and known-deviation relevance into the assessment; ensure regression exemptions never become primitive-validation passes.

## 3. Evidence and reporting

- [ ] 3.1 Label existing repeatedly consulted holdouts as diagnostic and record what independent validation would require under [WebTAG-M3.1] and [FHWA-TAT3-2019].
- [ ] 3.2 Regenerate the Rockridge split, both demand variants, and the complete assessment on a recorded revision; report missing evidence and changed pass populations without retuning to the test.
- [ ] 3.3 Run relevant TypeScript/native regression tests, typecheck, and strict OpenSpec validation; update the calibration record and user-facing evidence claims.
- [ ] 3.4 Review the final prose with `.claude/skills/humanizer/SKILL.md`, then archive only after implementation and verification are complete.
