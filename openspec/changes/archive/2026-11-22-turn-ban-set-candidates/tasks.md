## 1. Search (container)

- [x] 1.1 Confirm `crates/sim/src/explore/` is outside the simulator fingerprint (`crates/sim/fingerprint.rs`, `SKIP_DIRS`) and that the fingerprint stays `6b886c8f52ee07397773ddd0ebbcb447`
- [x] 1.2 `explore/bansets.rs`: entry movements, the sets, labels, counting, `flatten`, `collapse`; `street::expand` and `link::encode_scenario` write a set as its turn bans (design D1 to D3)
- [x] 1.3 `cands::generate_search` behind `Params::ban_sets` and `--ban-sets`; conflicts, profile, `adopt`, `same_intervention`, the no-closures objective (design D6)
- [x] 1.4 Report and proposals JSON: `bans`, `turnBans`, the summary sentence, the title and the finalists table (design D4)
- [x] 1.5 Seeds and `--check` fold a link's whole sets (`seeds::prepare_with`, `collapse`; design D5); `--list-ban-sets FILE`
- [x] 1.6 UI: `bans` and `turnBans` in `src/lib/proposals.ts`, the card's changes list, `changeAt` for the map's labels
- [x] 1.7 Tests: `crates/sim/tests/ban_sets.rs`, `src/lib/proposals.test.ts`; `cargo test --release -p traffic-sim`, `npx vitest run tools/ worker/ src`, the typecheck
- [x] 1.8 The default search is unchanged: reduced search before and after, byte-identical proposals JSON
- [x] 1.9 Reduced smoke with `--ban-sets` (one period, one seed, 6-minute runs): a package of a ban set and filters formed and was published as an option
- [x] 1.10 Laptop runbook and scripts, `scripts/{parity,pick-checks,summary}.cjs`, the decision rule (design D7) written before any run
- [x] 1.11 Humanizer pass on the prose; `openspec validate turn-ban-set-candidates --strict --no-interactive`

## 2. Laptop runs (runbook.md)

- [x] 2.1 Step A: worktree, gates, build, tests, the ban-set list and the parity with the TypeScript packages
- [x] 2.2 Step B: the published search command plus `--ban-sets`
- [x] 2.3 Step C: `explore --check` of the search's options with a ban set and the hand combinations, with p1 on the same seeds
- [x] 2.4 Step D: the summary table
- [x] 2.5 Step E: pack the evidence to the dev branch

## 3. Verdict (project lead)

- [x] 3.1 Read the summary and the p1 re-check
- [x] 3.2 Decide, under design D7, whether anything goes further: both families are published (design, Decision, 2026-11-22), and the work moves to `publish-ban-set-proposals`
- [x] 3.3 Publishing follows the documented procedure in `data/README.md` and happens under `publish-ban-set-proposals`; nothing is published by this change
