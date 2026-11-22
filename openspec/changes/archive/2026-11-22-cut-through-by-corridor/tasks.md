## 1. Data

- [x] 1.1 Add `cutThroughCorridors` to the Rockridge area config and document it in `data/areas/README.md`.
- [x] 1.2 Read each counted through car's reason and route from a traced hour without changing the simulator (`tools/lib/corridor-trace.ts`); check it against the stored baseline.
- [x] 1.3 Assign side-street blocks to corridors, read each trip's corridor, direction, bounding streets and second corridor (`tools/lib/cut-corridors.ts`).
- [x] 1.4 Store the table and the definitions in `baseline-intents.json`; recompute when the settings change; stop if the totals differ.
- [x] 1.5 Store the corridor of each movement in `<area>.assumptions.json`.
- [x] 1.6 Regenerate the baseline file, the assumptions file and the text pages; confirm the network, demand, proposals and stored results are unchanged.

## 2. Tab and text page

- [x] 2.1 Add "Where cars cut through" with the table, the folding, the disclosures, the notes on second corridors and east-west crossing.
- [x] 2.2 Move the reason cards into a closed disclosure; group the assumed movements under the corridor headings.
- [x] 2.3 Mirror the section in `assumptions.md`; update `docs/data-files.md` and `data/README.md`.

## 3. Tests and checks

- [x] 3.1 Tests for assignment, totals, direction naming, folding, the rendered section and the text page.
- [x] 3.2 `npx vitest run tools/ worker/ src` and `npm run typecheck`.
- [x] 3.3 Screenshots at 1300 px and 375 px, collapsed and expanded.
- [x] 3.4 Prose reviewed with `.claude/skills/humanizer/SKILL.md`; strict validation; archive.
