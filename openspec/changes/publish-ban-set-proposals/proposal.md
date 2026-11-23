## Why

The search with ban sets (`turn-ban-set-candidates`, laptop run of 2026-11-22) returned a list in which none of the six published options survives. Its top option, a ban set with five other changes, removes 84.6% of through cars an hour against 74.0% for published p1, and it needs no closure. It also adds 27.4 s per requested resident trip, against 16.0 s for p1, because the model gives residents no exemption from a ban. The project lead chose to publish both families: the best package with turn bans and the best package without, so the list keeps today's six-filter option next to the ban packages.

## What changes

- A fifth objective, `no-turn-bans` ("no turn restrictions"), that guarantees the list holds the best package without any turn ban, chosen inside its own family so a ban package cannot dominate, fold or displace it. It has its own beam over candidates that are not turn bans.
- A sixth objective, `most-removed-no-turn-bans` ("most cut-through removed without turn restrictions"): among packages without turn bans, the largest through-car reduction. It has no beam of its own and only chooses among the finalists that exist. The laptop run found a new five-closure package for `no-turn-bans`; the project lead decided to publish both it and the package that removes the most (the six-change package published today).
- The Proposals card for a package with turn bans says the scale in its visible part (the count of turn restrictions around the edge of the area), carries a standing caveat, lists every ban by the street it starts on, and draws one mark for each intersection instead of one for each ban. Every card shows the resident detour next to the headline.
- The Map tab folds six or more turn bans into one scenario entry with one Remove.
- The text pages and link-preview cards carry the count, the caveat and the resident detour.
- The published search command gains `--ban-sets` (the flag stays explicit, so older files reproduce).
- A laptop runbook and zsh scripts for the full publish chain, and an install checklist for the lead session.

No simulator change: the fingerprint stays `6b886c8f52ee07397773ddd0ebbcb447` (`crates/sim/src/explore/` and `bin/` are outside it). Nothing is published by the container; the lead session publishes after reading the laptop's headline table.

## Impact

- Code: `crates/sim/src/explore/{objectives,report,search,bench}.rs`, `crates/sim/src/bin/explore.rs`; `src/lib/{proposals,bans,picture,signs,legend}.ts`, `src/components/{Proposals,InterventionPanel}.tsx`, `src/App.tsx`, `src/styles.css`; `tools/lib/{llms-docs,previews}.ts`.
- Tests: `crates/sim/tests/objectives.rs`, `src/lib/bans.test.ts`.
- Docs: `data/proposals/README.md`, `docs/data-files.md`, `docs/scenario-links.md`.
- Spec: `proposals`, `simulator-ui`, `agent-access`.
- A changed top proposal is the lead's call; it was made on 2026-11-22 (design).
