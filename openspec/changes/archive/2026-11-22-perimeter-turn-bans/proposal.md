## Why

The project lead asked on 2026-11-22: "Have you searched for the best proposals? I'd expect restricting turns into streets from outside the Trapezoid to be helpful."

The published search (round 52 demand, baseline 522.5 through cars an hour) has turn bans only as single movements: the heaviest cut-through movements from a bounding street onto a local street, ten candidates in `data/proposals/rockridge.md`. Its top option, p1 (five modal filters and a diverter), takes 522.5 to 135.7 (-74.0%). Two hand packages on an older demand banned the four turns onto Hillegass Avenue (-5.7%) and the eight turns onto Hillegass Avenue and Colby Street (-12.6%), and in both cases the through traffic moved to the next street. The proposals README says generating whole-street and paired-street ban sets as search candidates is not built.

The project lead's hypothesis is that banning the entry turns around the whole perimeter at once leaves no next street to move to. That has never been measured. The search cannot measure it as built: it drops a known package with more interventions than its depth (6), and a perimeter set has 20 to 53 bans.

## What changes

- A generator, `tools/turn-ban-sets.ts` with its logic in `tools/lib/turn-ban-sets.ts`, lists every entry movement of an area from its network file and writes named packages as scenario links, with a table (`target/turn-bans/packages.{json,md,tsv}`). No place is named in code (design D1, D2).
- A laptop runbook and scripts that measure every package with `explore --check` on the published settings beside published p1, run the published search command against a scratch seeds file that holds the packages that were not rejected, and write one summary table (design D4, D5).
- A decision rule, written before any run, for what the project lead decides (design D7).

No simulator change (fingerprint `6b886c8f52ee07397773ddd0ebbcb447` stays), no Rust change, no change to a published file. The change prepares code, runbook and scripts; no simulation of the packages ran in the container that wrote it, apart from one reduced smoke of the command line.

## Impact

- Code: `tools/lib/turn-ban-sets.ts`, `tools/turn-ban-sets.ts`, tests in `tools/turn-ban-sets.test.ts`.
- Experiment files under `openspec/changes/perimeter-turn-bans/` (`runbook.md`, `laptop/*.zsh`, `scripts/*.cjs`).
- Spec: `proposals` (seven added requirements).
- Nothing is published from this change. A changed top proposal, or a headline change over 15%, is the project lead's decision.
