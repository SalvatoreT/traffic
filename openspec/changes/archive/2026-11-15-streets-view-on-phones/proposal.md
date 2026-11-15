## Why

The owner opened the Streets tab on a phone (Android Chrome, dark theme, about 412 px wide, no scenario) and called it "pretty broken". The screenshot showed five problems at once:

1. The map stayed on screen, squeezed, and its legend row sat across the middle of the map instead of at its bottom edge.
2. The table's sticky header covered the first data row and clipped its own second line.
3. The "Street block" column was so narrow that a name wrapped to seven lines, and only four columns fit.
4. The Scenario / Results sheet still covered the bottom of the view.
5. The Scenario and Change columns showed dashes with no explanation when there was no scenario.

Causes, found by reproducing with Pixel 7 emulation:

1. The Streets tab kept the map in a sticky strip 36% of the viewport high, but the phone rules that lift the legend 96 px above the bottom to clear the sheet still applied, so the legend floated 96 px up inside a 300 px strip.
2. The second header row used a fixed `top: 33px`; the first row wrapped to two lines at phone width, so it was taller than that.
3. Nine columns at `width: 100%` with no minimum for the name column.
4. The sheet is rendered for every view that shows the scenario panel, and the stage only added 104 px of bottom padding.
5. The scenario cells were printed as a dash whenever `comparing` was false.

## What changes

- On phones the Streets tab hides the map and the bottom sheet and becomes a full-height list. Each block is a card: name and class on top, a labeled grid of figures below, and a "Show on map" button that opens the Map tab with that block selected. Chosen over a collapsible map strip because it needs no second layout for the map, its legend or the sheet.
- Sorting on phones uses a "Sort by" menu with a direction button, in place of header buttons. The table stays a real table for assistive tech (headers are present but visually hidden).
- Without a scenario the table drops the Scenario and Change columns and says "Add a change on the Map tab to compare."
- Headers carry units ("All cars, cars an hour", "Mean speed, mph", "Through cars, cars an hour") and never wrap, so the sticky second header row sits flush under the first on wide screens.
- While a run is withheld, cells show a dash instead of zeros.
- The "Show service roads" check box lays out as a row.

Desktop and tablet layouts keep the map strip above the table.
