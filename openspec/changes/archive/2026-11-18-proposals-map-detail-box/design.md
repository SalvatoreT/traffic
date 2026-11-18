## Decision

The project lead, verbatim: "I don't need the pop-up on the map showing the changes on Proposals if I also have the box that shows the changes. Just make sure that the box is more readable. Right now, it kind of has too many numbers flowing together in a row."

## Choices

- The box (`pm-read`) is always rendered in every layout (wide, stacked, phone), with a hint when nothing is selected, so the pop-up is removed everywhere in this component. No state needs a fallback.
- Pointer hover, keyboard focus and tap or click still set the selection; only the pop-up and its placement code go. Escape still clears it. The selected street keeps its dark halo and the selected change its dashed ring.
- Street box: a heading, then a table captioned with the period and the unit ("PM peak, cars an hour"). Columns: Today, With this proposal, Change. Rows: Through cars, Local trips and All cars when the published file has all cars for that block; otherwise only Through cars and a plain statement that all cars are missing. Local trips are all cars minus through cars, rounded the same way as the other cells so each row adds up.
- Change box: the through cars that used the closed movement today, then a two-column table of where they go with the proposal (routes, then the stored breakdown), each row a label and a figure in cars an hour. The list of receiving side streets stays under a disclosure.
- The definition of through cars and the run basis stay as one quiet footnote.
- Figures use tabular numerals, right alignment and the real minus sign. Change cells carry a sign, so color is never the only signal.
- One live region: the box has `aria-live="polite"` and `aria-atomic`; the map overlay is gone, so nothing else announces the selection. The "Show on map" bar for a scrolled-away map stays hidden from assistive technology as before.
- Heading order: the card heading is h3. The box name is a paragraph, not a new heading, so no level is skipped.

## Decision: the map shows all cars

The project lead, decided by card: the number drawn on a street and the street's color on the Proposals card maps show the change in all cars on the block, not through cars only. Reason: on option p1 (PM peak), "60th Street between Claremont Avenue / Hillegass Avenue and Colby Street" showed +70 on the map (through cars 20 → 90) while all cars go 38 → 284 (+246: through +70, local trips +176). The map understated the block's rise and two different numbers confused the lead.

- Source: the file's `pictureAll` (all cars per link, same period, links and seeds as `picture`). The map uses it when present and falls back to `picture` (through cars) for older files, saying so in the legend. Nothing is invented: `pictureAll` carries every measured block the map draws.
- Scale: the app's existing change scale for all cars (the "flow" layer: soft dead band 40 cars an hour, top 800), because the through-car scale (dead band 7.5, top 100) is tuned for a smaller quantity. This is an assumption carried over from the Map tab, not a new calibration.
- A block whose through cars fall but whose all cars rise is colored by all cars; the box's Through cars row still shows the fall.
- Number labels: the largest all-car gain (solid) and the largest all-car drop (dashed), in place of the block the card names by through cars. The label is the all-car change from figures rounded as in the box, so it equals the box's All cars, Change cell.
- The street list under the map is ordered by all-car change, with through cars beside it.
- The card headline is unchanged (through cars over the whole area). One sentence in the map legend says the headline counts through cars over the whole area and the map shows all cars block by block.
- Not changed: the share image and link-preview cards still draw through cars (`DownloadImage`, `tools/lib/previews.ts`).

## Decision: card anchors

The project lead, verbatim: "don't make the anchors called unconstrained. You can just be proposal one, proposal two, or proposal diverter, proposal Colby Hillegass slow streets."

- A card's fragment is `proposal-<n>` for search option p<n> of the default group, and `proposal-<reference id>` for a reference (for example `proposal-earlier-62nd-diverters`, `proposal-colby-hillegass-slow-streets`). Any other group uses `proposal-<group id>-<n or reference id>` so anchors stay unique. Nothing is area-specific.
- Old fragments (`unconstrained-p1`, with or without a `-v2` suffix, and `<group>-p<n>`) are mapped by `canonicalAnchor`, the same path that already redirects older Assumptions and Sources ids, so they scroll to the same card and the address is rewritten with `history.replaceState`. Another group's old reference ids cannot be told from the group id and are not mapped.
- The group id in the data files, React keys, the open and confirm state, and the share slug (`/p/unconstrained-<hash>`) and preview image paths keep the old composite id. Only the URL fragment and the copied card links change.
