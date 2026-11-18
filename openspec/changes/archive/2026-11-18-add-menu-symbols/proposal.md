## Why

The map marks interventions with sign pictures, but the menu that places them still lists plain text. People cannot see which mark a choice will put on the map. The same review found two gaps in the pictures: a one-way sign could hide a change number in a proposal's picture, and a turn ban always showed a left-turn arrow.

## What changes

- Each choice in the selection menu that places a mark shows that mark's picture beside its text, in a fixed-width column.
- A turn ban shows a left-turn, right-turn or U-turn arrow from the geometry of its two links, on the map, in the scenario list, in the keys, in the menu and in the proposal picture.
- In a proposal's picture the one-way sign is smaller and a number label moves to a free spot so no picture covers it.
- Wording: the modal-filter requirement no longer says "badge".

## Impact

- Spec: `simulator-ui`.
- Code: `SelectionMenu.tsx`, `src/lib/menusymbols.ts`, `signs.ts`, `turnkind.ts`, `picture.ts`, `legend.ts`.
- Generated data: proposal share images and link-preview cards change, as in `pictogram-intervention-symbols`.
