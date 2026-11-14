## Why

The owner opened a scenario with five node filters and one block filter and asked why 57th St and Ayala Ave near Martin St did not gain traffic, and whether the filter was meant to stop traffic on that section too. The map showed one badge per filter and nothing about which streets it closes. A node filter closes every car movement through the node, so all legs are closed to through cars, including legs of a merged (offset) junction that a driver would call a separate crossing.

## What Changes

- A node filter draws a barrier-tape bar across the mouth of every leg it closes, next to the existing badge. A block filter draws tape along the block.
- The Scenario list, the selection pop-up and the badge tooltip describe a filter in words: what it blocks, the closed legs by street and compass word, that walking and cycling still pass, and, for a merged junction, that the filter covers the whole junction.
- The add-filter action at an intersection previews the closed legs before it is chosen.
- The map image export draws the leg bars.
- Diagonal diverters are unchanged. Stored proposal labels are unchanged.

## Impact

- `src/lib/blocked.ts` (new), `src/lib/describe.ts`, `src/lib/diverter.ts`, `src/lib/mapexport.ts`
- `src/components/MapView.tsx`, `InterventionPanel.tsx`, `SelectionMenu.tsx`, `src/styles.css`
- No change to the simulator or to study-area data.
