## 1. Spec

- [x] 1.1 Proposal, design and spec delta; validate strictly

## 2. Implementation

- [x] 2.1 Remove the map pop-up and its placement code from `ProposalMap.tsx`
- [x] 2.2 Add table-building helpers to `src/lib/proposal-map.ts` with tests
- [x] 2.3 Render the street box and the change box as labeled tables
- [x] 2.4 Style the tables (tabular numerals, right-aligned, light and dark, 360 px)
- [x] 2.5 Color and number the map by all cars; legend, text alternative and headline sentence

## 3. Verification

- [x] 3.1 `npx tsc --noEmit` and `npx vitest run`
- [x] 3.2 Playwright: no pop-up element after hover, focus, tap; box shows the grid; screenshots
- [x] 3.3 Archive the change
