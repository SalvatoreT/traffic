## Decisions

- **Hide the map on phones, offer "Show on map".** A phone has no pointer hover, so the map strip's only job (outlining the hovered block) is lost there. A strip would still need its own legend, camera fit and sheet clearance. The Streets table stays the text alternative to the map, and a button per row reaches the map when a person wants to see the block. Selecting uses the existing `list` selection path, so the sheet opens on the Scenario tab for that block.
- **Cards, not a scrolling grid.** Nine numeric columns do not fit 360 to 412 px next to a name. Cards give the name the full width and keep every figure labeled. Each cell carries its label as text content from `data-label`, so the figures read the same for a screen reader as a table (headers remain in the DOM, hidden visually).
- **Sort menu on phones.** Header buttons are not visible in the card layout. A select with the same choices as the headers plus a direction button (36 px) keeps sorting available; the current sort is announced through `aria-sort` on the hidden header.
- **Fixed header heights.** Header cells do not wrap, so the second sticky row's `top` equals the first row's height.
- **Scenario columns need a scenario.** `streetcols.ts` holds which sort choices and default sort exist with and without a scenario so the table and its tests agree.
- **Like-for-like labels unchanged.** All cars and through cars keep their separate columns and definitions.
