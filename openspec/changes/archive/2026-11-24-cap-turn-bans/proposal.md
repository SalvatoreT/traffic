## Why

The search with ban sets (`publish-ban-set-proposals`, published 2026-11-22) put a 41-ban package at the top of the list: 522.5 to 80.4 through cars an hour, with one filter next to it at 142.4. The project lead decided on 2026-11-23 that 41 turn-restriction signs are not reasonable. Turn restrictions may go on a few entrances only, and a package may hold at most 5 individual turn bans in total. The 41-ban options are being taken off the live list separately. This change makes the next search respect the cap, so a rerun cannot bring them back.

## What changes

- `explore --max-turn-bans N`. Each ban set counts its size and each single turn ban counts 1. A ban set with more than N bans is not a candidate and is reported as dropped with the reason. The search never simulates or keeps a package over N. A known or hand-added package over N is skipped with a logged reason and counted in the report. Without the flag nothing changes.
- With the cap, the candidate pool holds the small ban sets the generator already makes (College Avenue's four turns, left turns from Alcatraz Avenue, the turns onto one side street) and top-2 to top-N sets built from the search's own ranked single turn-ban candidates.
- The cap is written to `computed.turnBanCap` in the proposals file and to the report's Search section.
- `tools/turn-ban-sets.ts --max-bans N` writes the small named packages as scenario links, with top-2 to top-N from a `--check-singles` log and the three highest-ranked movements of each bounding street.
- The turn-restriction line on the Proposals card reads "N turn restrictions at entrances to the area", which is true for 3 signs as well as for 41. The standing caveat stays.
- A laptop runbook, zsh scripts and a verify script for the rerun, and an install checklist for the lead session.

No simulator change: the fingerprint stays `6b886c8f52ee07397773ddd0ebbcb447`. Nothing is published by the container; the lead session publishes after reading the laptop's headline table.

## Impact

- Code: `crates/sim/src/explore/{mod,bansets,cands,check,search,report}.rs`, `crates/sim/src/bin/explore.rs`; `tools/turn-ban-sets.ts`, `tools/lib/turn-ban-sets.ts`; `src/lib/proposals.ts`.
- Tests: `crates/sim/tests/ban_sets.rs`, `tools/turn-ban-sets.test.ts`, `src/lib/bans.test.ts`.
- Docs: `data/proposals/README.md`, `docs/data-files.md`.
- Spec: `proposals`, `simulator-ui`.
- The list that replaces today's is the project lead's call after reading `headline.md`.
