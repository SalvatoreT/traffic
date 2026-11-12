## Why

Five loose ends in the UI. Merged staggered junctions draw as a zigzag. At tablet widths some scrollable regions can't be reached by keyboard, and the Streets table adds about 150 tab stops. Rows from "Show more" appear without warning. The change view on the map covers cars only and says nothing about it. Its colors make small changes look alarming, and dashes carry direction.

## What Changes

- Straighten link geometry at merged junctions in the app, before it reaches the map and the simulator. Topology and link lengths stay as they are.
- Remove the horizontal scroll from the results cards at tablet widths, and give code blocks a name and role as scrollable regions.
- Make the Streets table one tab stop with arrow-key row navigation.
- Animate newly shown rows and move focus to the first one. Reduced motion turns the animation off.
- State that the map change view covers cars, and point to the area-wide walking and biking results. The simulator reports no walking or biking per street.
- Restyle the change view: thickness shows size, a diverging ramp that grows with size replaces the old colors, arrows mark the largest changes, and the dashed encoding goes away.

## Impact

- Affected spec: simulator-ui.
- Code: `src/lib/junctionends.ts`, `src/lib/roving.ts`, `src/lib/ramps.ts`, `src/lib/change.ts`, `src/components/{StreetsTable,MapView,Toolbar,Markdown}.tsx`, `src/data.ts`, `src/styles.css`.
- The simulator in the app now reads the straightened geometry, so movement paths and conflict geometry at about a dozen merged junctions differ slightly from the offline `validate` and `calibrate` runs until the importer applies the same function.
