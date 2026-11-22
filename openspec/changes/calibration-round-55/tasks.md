## 1. Preparation (container)

- [x] 1.1 Read how the loop decides passes, pools, stops and aborts (design D1, with file and line)
- [x] 1.2 `stopDecision` in `tools/lib/membership-loop.ts`; the loop logs the blocking lines each pass and says at the cap whether the rule was met (`tools/lib/membership-loop-run.ts`)
- [x] 1.3 `tools/lib/loop-diagnostics.ts`, `--watch`, `diagnostics.md` and the log lines; `watch.json`
- [x] 1.4 Pooled-file copies in the loop folder (`pools/`)
- [x] 1.5 Unit tests in `tools/membership-loop.test.ts` (stop in both views, cap, weights, default plan, larger cap leaves the first passes unchanged, diagnostics)
- [x] 1.6 Keep rule and improvement test written before any run (design D4), `scripts/keep-rule.cjs`
- [x] 1.7 `scripts/identity.cjs`, `scripts/headline.cjs`
- [x] 1.8 `runbook.md` and `laptop/{env,a,b,c,d,restore,pack}.zsh`
- [x] 1.9 Humanizer pass on the prose; `openspec validate calibration-round-55 --strict --no-interactive`
- [x] 1.10 `npx vitest run tools/ worker/ src/lib` and the typecheck

## 2. Laptop runs (runbook.md)

- [x] 2.1 Step A: worktree, gates, dry runs, baseline assessments
- [x] 2.2 Step B: the loop with a cap of 8 passes, the identity checks
- [x] 2.3 Step C: validation, the candidate's assessments on seeds 1 to 10 and 11 to 20, the keep rule and the improvement test
- [ ] 2.4 Step D, only if C passes: the staged proposal search and the headline check (not run: step C failed)
- [x] 2.5 Step E: pack the evidence

## 3. Verdict (project lead)

- [x] 3.1 Read the diagnostics, the keep rule and the headline check
- [x] 3.2 Record the round in `data/calibration/rockridge.record.md`, adopted or not
- [ ] 3.3 If adopted: publish by the documented procedure in `data/README.md` (not applicable: not adopted)
