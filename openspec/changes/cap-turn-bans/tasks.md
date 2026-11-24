## 1. The cap in the search (container)

- [x] 1.1 `Params::max_turn_bans`, `--max-turn-bans N` in `explore`; `bansets::generate_capped`, `over_cap_reason`, the `OVER_CAP` reason (design D2)
- [x] 1.2 `eval_batch` rejects a package over the cap before the table or the access check; `adopt_packages` skips known, hand and warm-start packages over it, before the depth check
- [x] 1.3 Top-2 to top-N sets from the single turn-ban candidates' order, only with a cap (design D4)
- [x] 1.4 `computed.turnBanCap` in the proposals file and the cap paragraph in the report's Search section
- [x] 1.5 Rust tests (`crates/sim/tests/ban_sets.rs`): set dropped, package rejected without a simulation, known package skipped, top sets, record present only with the cap, no effect without the flag
- [x] 1.6 The fingerprint is unchanged (`6b886c8f52ee07397773ddd0ebbcb447`)

## 2. Small sets and wording (container)

- [x] 2.1 `tools/turn-ban-sets.ts --max-bans N`: packages of at most N bans, `top-2` to `top-N` from the `--check-singles` log, `street-<name>-top-3`; fixture test
- [x] 2.2 Card line "N turn restrictions at entrances to the area" (`src/lib/proposals.ts`), test for a handful of bans, `docs/data-files.md`
- [x] 2.3 `data/proposals/README.md`: the flag, the pool under the cap
- [x] 2.4 Humanizer pass on the prose; `npx openspec validate cap-turn-bans --strict --no-interactive`

## 3. Laptop run (runbook.md)

- [x] 3.1 Runbook, `laptop/*.zsh`, `scripts/verify.cjs`, `install.md` written and the scripts syntax-checked
- [ ] 3.2 Step A: worktree, gates, build, tests, ban-set list under the cap
- [ ] 3.3 Step B: the search with `--ban-sets --max-turn-bans 5` writing the real files in the worktree
- [ ] 3.4 Step C: redistribution and stored results
- [ ] 3.5 Step D: `verify.zsh` passes and `headline.md` is read
- [ ] 3.6 Step E: pack to the dev branch

## 4. Publish (lead session, install.md)

- [ ] 4.1 Verify checksums, install into `public/data` and `data/`, `data:llms`, `data:previews`, tests
- [ ] 4.2 Commit the tracked files (report, seeds, README), deploy the app, `data:push`
- [ ] 4.3 Read the live site back (hashes and the pages in `install.md`)
- [ ] 4.4 Record entry in `data/calibration/rockridge.record.md`
- [ ] 4.5 Archive this change
