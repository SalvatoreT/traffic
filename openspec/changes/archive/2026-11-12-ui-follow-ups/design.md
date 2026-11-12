## Context

The importer joins staggered junctions into one node at the cluster centroid and moves the end of each leg there. The leg then runs through a connector segment that leaves the street's own bearing, so lines and vehicles draw as an S. Vehicle positions come from the simulator's buffer (x, y, no link id), so a fix that touches only the drawn lines would leave vehicles on the old path.

## Decisions

- **D1. Straighten the geometry where it loads (`src/lib/junctionends.ts`).** Where the first segment of a leg deviates from the importer's `fromBearing` / `toBearing` by more than 10 degrees, replace the end point with the foot of the centroid on the street's own line through the second point. Lines then meet the junction as in the OpenStreetMap geometry. Ends with no connector are untouched. Moves under 1 m or over 40 m are skipped. The function runs in `loadArea`; the simulator receives the changed text (`raw.simNetwork`), while the hash for proposals still uses the served text. `length` is not changed and the simulator scales positions by length over geometric length, so link lengths and topology are the same. Alternative rejected: editing `tools/lib/network.ts`, which another change is editing. The same function can be called from the importer later.
- **D2. Tablet scrolling.** The results tables overflowed their cards by 10 to 20 px at 768 to 1024 px. Cells now wrap anywhere and the cards no longer scroll, so no scroller is left without focusable content. Code blocks stay focusable and gain `role="region"` and a name. The Streets table region is no longer a tab stop itself; it holds focusable rows and buttons.
- **D3. Roving tabindex.** One row has `tabIndex=0` (the remembered one, else the first). Arrow keys, Page Up and Down, Home and End move focus (`src/lib/roving.ts`). Focus still lights the block on the map.
- **D4. Show more.** New rows animate opacity, padding and line height over 0.3 s. The global reduced-motion rule turns the animation off. Focus moves to the first new row and a polite status line says how many rows appeared.
- **D5. Change view is cars only.** Per-link statistics count motor vehicles (`record_link_exit` skips bicycles) and pedestrians are not on the street network. Walking and biking change is area-wide only, already in the results cards. The legend and help say so.
- **D6. Change view encoding.** Width and color use the square root of the intensity, so mid-size changes separate. The scale is fixed (`CHANGE_TOP`). Colors are blue and orange, mid tones for small changes and dark (light theme) or bright (dark theme) for large ones. Every non-zero step is at least 3:1 against the basemap fill; a test checks it. Within the noise band a street is thin neutral gray. Direction does not rest on color: the readout and legend ticks are signed, and arrows up and down mark changes at or above magnitude 0.75. Dashes are gone. The legend bar is thin in the middle and thick at both ends. The ramp hues are design choices, not calibrated values.

## Risks

Movement geometry in the browser simulator differs slightly from the offline tools until the importer applies D1. Re-run `calibrate` after it does.
