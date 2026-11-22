## 1. Streets tab

- [x] 1.1 Remove the tab, `StreetsTable`, `streetcols`, `roving`, their tests and styles; send old `/streets` links to the Map and test it.
- [x] 1.2 Fold the block table into `index.md`; drop `streets.md` from the generated set, `llms.txt`, `llms-full.txt`, docs, README, `index.html` and the Worker routes; redirect `/streets.md` to `/index.md`.
- [x] 1.3 Check the preview plan: the Streets card follows from `VIEWS`.

## 2. Proposals tab

- [x] 2.1 Card: title, headline figure, worst-block line, map and controls by default; the rest in closed disclosures with labeled summaries.
- [x] 2.2 Page: two sentences visible, the rest and the provenance in a disclosure; notices stay visible.
- [x] 2.3 Fold the map's street list, filter list and key into one disclosure; drop the three-column arrangement.
- [x] 2.4 Pin the card header like the Assumptions headings; offset the pinned map column and set scroll padding so focus is not obscured.

## 3. Tab row, footer and phone layout

- [x] 3.1 Replace the mask with an edge fade and arrow per side, update on scroll and resize, center the active tab; unit-test the helpers.
- [x] 3.2 Move Theme to the footer; show the footer on phones and keep the bottom sheet above it.
- [x] 3.3 Measure sideways overflow at 320, 375 and 414 px on every tab, closed and open, with touch drags; add the guards and `tools/check-mobile-layout.mjs`.

## 4. Verify

- [x] 4.1 `npx vitest run tools/ worker/ src` and `npm run -s typecheck` pass; `npx vite build` succeeds (the WASM step was skipped, the copied pkg was used).
- [x] 4.2 Screenshots before and after under the scratchpad folder.
- [x] 4.3 Validate the change with `--strict`, archive it and check that `openspec/specs/` no longer requires a Streets tab.
