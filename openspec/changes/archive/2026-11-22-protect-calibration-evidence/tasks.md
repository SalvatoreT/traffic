## 1. Observation lineage

- [x] 1.1 Reproduce C1, C3, and C4 with the attached bounded probe; add isolated fixtures for the C2 and C5 code traces before changing behavior.
- [x] 1.2 Assign source-observation IDs and dependency groups to directional/period targets, gate totals, class defaults, ramp splits, local-trip scaling, aggregate/path counts, and assumed movement inputs.
- [x] 1.3 Freeze a group-level split before preprocessing; build cross-validation priors and fitted demand using only training observations.
- [x] 1.4 Add a held-value perturbation test: preserve the split, alter only withheld raw values, and verify identical training artifacts and predictions with changed scoring targets.
- [x] 1.5 Cover the Ashby/Tunnel/San Pablo directional pairs and all four whole-street features; test actual path matching, including detours, and record remaining correlated evidence.

## 2. Assessment integrity

- [x] 2.1 Add compatible manifests to seed reports, summaries, and validation results, including hashes and complete evaluation settings.
- [x] 2.2 Reject missing, duplicate, mislabeled, stale, or incompatible runs before issuing authoritative verdicts; support clearly labeled partial diagnostics if needed.
- [x] 2.3 Compute stability from the selected runs or verify their exact identity against the summary. The 9,999-removal probe must never report stable.
- [x] 2.4 Isolate every variant output, including native summaries and noise. Test that suffixed variants preserve published file hashes.
- [x] 2.5 Carry primitive failures and known-deviation relevance into the assessment; ensure regression exemptions never become primitive-validation passes.

## 3. Evidence and reporting

- [x] 3.1 Label existing repeatedly consulted holdouts as diagnostic and record what independent validation would require under [WebTAG-M3.1] and [FHWA-TAT3-2019].
- [x] 3.2 Regenerate the Rockridge split, both demand variants, and the complete assessment on a recorded revision; report missing evidence and changed pass populations without retuning to the test.
- [x] 3.3 Run relevant TypeScript/native regression tests, typecheck, and strict OpenSpec validation; update the calibration record and user-facing evidence claims.
- [x] 3.4 Review the final prose with `.claude/skills/humanizer/SKILL.md`, then archive only after implementation and verification are complete.
  Closed 2026-11-22: every other task is ticked and the code is on main: `tools/assess.ts` takes `--suffix` and `--diagnostic` (lines 4 to 9) and reads the run manifests (`tools/lib/assess.ts`, `readRuns`), and it hashes the primitive-validation cases and `data/calibration/validation.deviations.json` into the assessment (`tools/assess.ts:153-157`). The frozen split is `data/demand/<area>.split.json`. Five of the six ADDED requirements are new to `openspec/specs/`. The MODIFIED "Station results are reported by source and count year" is older than the main text, which since 2026-11-22 also covers derived targets ("Derived targets are left out of the pass counts"). The delta was hand-merged: it now carries the main text unchanged, plus the one sentence this change adds (out-of-sample claims must satisfy the observation-dependency and validation-scope requirements). The change prose was read against `.claude/skills/humanizer/SKILL.md` with no tells to fix. Validated strictly, then archived.
