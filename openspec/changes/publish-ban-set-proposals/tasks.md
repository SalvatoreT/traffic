## 1. Record the ban-set run (container)

- [x] 1.1 Tick the laptop tasks of `turn-ban-set-candidates`, add its Outcome section with the table and the D7 triggers, `evidence/README.md` pointing at `2aa765f`
- [x] 1.2 Update `data/proposals/README.md` (candidates, turn-ban packages with these results, the published command)
- [x] 1.3 Settle the label wording ("streets outside the area") in the Rust labels and `expected-sets.tsv`
- [x] 1.4 Archive `perimeter-turn-bans` with the verdict "superseded by `turn-ban-set-candidates`; the project lead chose to publish both families"

## 2. The objective (container)

- [x] 2.1 `Objective::NoTurnBans`, `Final::has_bans`, `objectives::{is_ban, allowed, eligible}`, its beam, the tag rule (design D1)
- [x] 2.2 Tests: selection, exemption from cross-family domination, coincidence, no tag without a ban in the list, left turns alone kept (`crates/sim/tests/objectives.rs`)
- [x] 2.3 Reduced search on the real network: the filter-only option equals published p1's interventions (design D2)
- [x] 2.4 `search_bench` keeps its four objectives (`objectives::BENCHMARK`)

- [x] 2.5 `Objective::MostRemovedNoTurnBans` (`most-removed-no-turn-bans`): no beam (`has_beam`), tag dropped with the no-turn-bans tag when no option holds a ban, tests, TypeScript label, docs (design D9)
- [x] 2.6 `scripts/verify.cjs` and `laptop/verify.zsh`: the old p1 checks move to the new tag, the stored-results count excludes `index.json` and `baseline-intents.json`

## 3. Card, scenario panel, text pages (container)

- [x] 3.1 `src/lib/proposals.ts`: `banHeadline`, `banCount`, `BAN_CAVEAT`, `detourHeadline`, the objective label
- [x] 3.2 `src/components/Proposals.tsx`: scale line and caveat in the visible part, resident detour beside the headline, the disclosure of every ban by street
- [x] 3.3 `src/lib/{bans,picture,signs,legend}.ts`: one mark for each intersection, the `turn_ban_both` sign
- [x] 3.4 `src/components/InterventionPanel.tsx`, `src/App.tsx`: one grouped scenario entry with one Remove
- [x] 3.5 `tools/lib/{llms-docs,previews}.ts`, `docs/data-files.md`, `docs/scenario-links.md`
- [x] 3.6 Tests: `src/lib/bans.test.ts` (grouping, marks, 41-ban link round trip, card text); screenshots at 1300 px and 375 px
- [x] 3.7 `cargo test --release -p traffic-sim`, `npx vitest run tools/ worker/ src`, the typecheck; the fingerprint is unchanged
- [x] 3.8 Humanizer pass on the prose; `openspec validate publish-ban-set-proposals --strict --no-interactive`

## 4. Laptop publish run (runbook.md)

- [x] 4.1 Runbook, `laptop/*.zsh`, `scripts/verify.cjs`, `install.md` written and the scripts syntax-checked
- [ ] 4.2 Step A: worktree, gates, build, tests, ban-set list
- [ ] 4.3 Step B: the search with `--ban-sets` writing the real files in the worktree (rerun after pulling the commit with the sixth objective; the first run's outputs are replaced)
- [ ] 4.4 Step C: redistribution and stored results
- [ ] 4.5 Step D: `verify.zsh` passes and `headline.md` is read
- [ ] 4.6 Step E: pack to the dev branch

## 5. Publish (lead session, install.md)

- [ ] 5.1 Verify checksums, install into `public/data` and `data/`, `data:llms`, `data:previews`, tests
- [ ] 5.2 Commit the tracked files (report, seeds, README), deploy the app, `data:push`
- [ ] 5.3 Read the live site back (hashes and the pages in `install.md`)
- [ ] 5.4 Record entry in `data/calibration/rockridge.record.md` (written by the lead after the read-back)
- [ ] 5.5 Archive this change
