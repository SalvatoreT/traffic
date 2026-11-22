## Why

The perimeter turn-ban experiment (change `perimeter-turn-bans`, laptop run of 2026-11-21 and 22, round 52 demand, baseline 522.5 through cars an hour) measured named sets of entry turn bans against published p1 (-74.0%). All left turns from the bounding streets onto side streets (21 bans) took 39.9% of through cars with almost no displacement (worst block +30 cars an hour in the PM peak). Every left and right turn but two (41 bans) took 63.1%, and the leak in the large sets was one block, Forest Street between Claremont/Colby and Ayala (155 to 340 cars an hour in the PM peak). No package reached p1, and the search with four small sets seeded returned the published options unchanged.

That points at a package the search cannot form: a ban set plus one or two filters, which could approach p1 with far fewer physical closures. The search cannot build it for two reasons. A seed with more interventions than `--depth` is dropped, and a set of 21 bans has 21. Its turn-ban candidates are single movements, so no beam level holds a whole set.

## What changes

- Ban-set candidates in the proposal search (`crates/sim/src/explore/bansets.rs`, `cands.rs`): one candidate is a named set of entry turn bans that counts as one intervention for depth, beam and the number of interventions, while the scenario link, the access check, the simulation and the published card list every ban. The sets are derived from the network alone and mirror `tools/lib/turn-ban-sets.ts`: all left turns, all right turns, all turns (and the access-safe variant), the turns onto the through streets, and for each bounding street and each interior street its turns and its left turns.
- A flag, `--ban-sets`, off by default. Without it the candidate list, the search and every output are unchanged.
- The proposals JSON carries `bans` on a ban-set entry and `turnBans` on a package that holds one (optional, absent otherwise); the report says how many individual bans a package holds; the Proposals tab shows both in its changes list.
- A seed link that holds the bans of a whole set reads as that set, so a hand package of a set and a filter counts two interventions.
- `explore --list-ban-sets FILE`: the sets of a network, with the ones dropped and why, without simulating anything.
- A laptop runbook and scripts (`laptop/`, `scripts/`): the published search command plus `--ban-sets`, `explore --check` of the search's options with a set and of the hand combinations, one summary table.

No simulator change (fingerprint `6b886c8f52ee07397773ddd0ebbcb447` stays; `crates/sim/src/explore/` is outside it) and no change to a published file. Nothing is published from this change.

## Impact

- Code: `crates/sim/src/explore/{bansets,cands,check,link,mod,naming,objectives,report,search,seeds,street,bypass}.rs`, `crates/sim/src/bin/explore.rs`; `src/lib/proposals.ts`, `src/components/{Proposals,ProposalMap}.tsx`.
- Tests: `crates/sim/tests/ban_sets.rs`, `src/lib/proposals.test.ts`.
- Spec: `proposals` (one modified and seven added requirements).
- Experiment files under `openspec/changes/turn-ban-set-candidates/` (`runbook.md`, `laptop/*.zsh`, `scripts/*.cjs`).
- A changed top proposal, or a headline change over 15 points, is the project lead's decision.
