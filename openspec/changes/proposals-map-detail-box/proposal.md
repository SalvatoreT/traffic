## Why

On a proposal card, hovering, focusing or tapping a street or a change shows the same information twice: in a floating pop-up on the map and in the detail box beside or below it. The project lead asked to drop the pop-up and to make the box easier to read, because it runs too many numbers together in a row.

## What changes

- The proposal card map no longer shows a floating pop-up. The detail box is the one place the selection is described.
- The detail box shows figures in a labeled table: one figure per cell, with its row and column label, and the period and unit named once in a caption.
- A selected street stays highlighted on the map, and a selected change keeps its dashed ring, so the map and the box stay linked.
- The box is announced once when the selection changes.

## Impact

- Spec: `proposals` (selection details on the card map).
- Code: `src/components/ProposalMap.tsx`, `src/lib/proposal-map.ts`, `src/styles.css`.
- The Map and Streets tabs do not use this component and are unchanged.
