## 1. Preparation (container)

- [x] 1.1 Read how the search treats turn bans, packages larger than the depth, seeds and `--check` (design D4, D5, with file references)
- [x] 1.2 Entry movements and package generator: `tools/lib/turn-ban-sets.ts`, `tools/turn-ban-sets.ts` (design D1 to D3)
- [x] 1.3 Unit tests on a small network and a sanity test on the study area network, `tools/turn-ban-sets.test.ts`
- [x] 1.4 Packages on the real network: `target/turn-bans/packages.{json,md,tsv}`, with the access preview (`all-turns-access`, design D3a)
- [x] 1.5 Decision rule and limits written before any run (design D7, D8)
- [x] 1.6 `laptop/{env,a,b,c,d,pack}.zsh`, `scripts/{parse-check,summary,pick-seeds}.cjs`, `runbook.md`
- [x] 1.7 Reduced smoke of `explore --check`, `--check-singles`, `b.zsh`, `d.zsh` and the seeding step of `c.zsh`
- [x] 1.8 Humanizer pass on the prose; `openspec validate perimeter-turn-bans --strict --no-interactive`
- [x] 1.9 `npx vitest run tools/ worker/ src/lib` and the typecheck

## 2. Laptop runs (runbook.md)

- [ ] 2.1 Step A: worktree, gates, candidate ranking, packages
- [ ] 2.2 Step B: `explore --check` of p1 and every package on the published settings
- [ ] 2.3 Step C: the published search command against the scratch seeds file
- [ ] 2.4 Step D: the summary table
- [ ] 2.5 Step E: pack the evidence

## 3. Verdict (project lead)

- [ ] 3.1 Read the summary and the p1 re-check
- [ ] 3.2 Decide, under design D7, whether any package or search option goes further (a seeds-file or references-file entry, a search candidate for whole-street sets, a published proposal)
- [ ] 3.3 If anything is adopted: publish by the documented procedure in `data/README.md` (nothing is published by this change)
