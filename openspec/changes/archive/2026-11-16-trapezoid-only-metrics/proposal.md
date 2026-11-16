## Why

The app exists to show cut-through traffic on the Trapezoid's side streets. Today the map shades every street of the wider modeled network, and the Results panel mixes figures that cover the whole network (trip time, delay, completed trips, walking and biking indicators) with figures about the side streets. A reader cannot tell which numbers describe the neighborhood.

## What changes

- Metrics apply only to the residential and service streets inside the study area. The map, hover and tap values, the legend, the Streets table and phone cards, the Results cards, the text pages and the headless report all list and color those streets only.
- Bounding streets (Telegraph, Alcatraz, College, Claremont) and everything outside the study area are drawn as plain context: thin dashed lines, no ramp, no figures. A street inside the area with no traffic keeps the ramp's lowest color with a casing, so the two never look alike.
- The Speed map mode is removed, with its legend, hover values and every speed figure (side-street mean speed, 85th percentile, shares above 20 and 25 mph, arterial mean speed). The map modes are Cut-through and Flow.
- Whole-network figures are removed from the app, the text pages and the docs: mean trip time and delay, completed and unroutable trips, the walking and biking card, trips by mode, and the network health counts. A one-sentence oversaturation caution stays.
- Close-following conflicts stay, because the simulator counts them on residential streets inside the study area.
- Proposal cards drop the bounding-streets table and the "Inside the area" block. In "Where traffic goes" the net-change table lists study-area side-street blocks, with one summary row, "Bounding streets and outside", for the net all-car change on every other street.
- The simulator is not changed. It still computes every figure; the app does not show them. Stored results keep working.

## Impact

- Specs: `simulator-ui`, `agent-access`.
- Code: `src/lib/scope.ts` (new), map layers, legend, change and ramp helpers, metrics cards, Streets table, redistribution summary, `tools/lib/llms-docs.ts`, `tools/lib/simulate-report.ts`, docs.
