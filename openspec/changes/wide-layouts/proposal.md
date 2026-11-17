## Why

The tab pages sat in a narrow column on large screens (Proposals 900 px, Streets and Sources 1100 px), leaving most of a 1920 px screen empty. On a proposal card, the readout that hover updates could be scrolled out of view, and hovering a list row highlighted a map that could be off screen.

## What Changes

- Tab pages use a fluid, centered container up to 1760 px. Running prose keeps a 68 to 80 character measure; Methodology and Sources flow into two columns, Assumptions cards fill as many columns as fit, the Streets table uses the full width.
- A proposal card arranges itself by its own width: one column under 44rem, two columns from 44rem, three from 76rem.
- On two- and three-column cards the map column and the readout stay in view while the lists scroll, unless the screen is shorter than 640 px.
- A tooltip on the card map shows the essential line for the hovered, focused or tapped street or change.
- On narrow cards, tapping a list row scrolls the map into view and offers "Back to list"; while the map is off screen a "Show on map" bar sticks to the bottom of the card.

## Impact

- `src/styles.css`, `src/components/assumptions.css`, `src/components/methodology.css`
- `src/components/ProposalMap.tsx`, `Proposals.tsx`, `Methodology.tsx`, `Sources.tsx`
- `src/lib/proposal-map.ts`, `src/lib/stored-redistribution.ts`
