## 1. Measured set

- [x] 1.1 Add `src/lib/scope.ts` with `linkMeasured` and `blockMeasured` (inside the study area, residential or service) and tests.
- [x] 1.2 Map: color only measured links, draw the rest as dashed context, give no-traffic streets the ramp's lowest color with casing, and say "Outside the study area: not measured" on hover and selection.
- [x] 1.3 Streets table and phone cards list measured blocks only.

## 2. Remove Speed and whole-network figures

- [x] 2.1 Remove the Speed overlay from the types, ramps, change helpers, legend, hover line, toolbar and tests.
- [x] 2.2 Remove the speed rows, the delay and throughput card, the walking and biking card, trips by mode and the network health counts from Results; keep the oversaturation sentence.
- [x] 2.3 Remove the dead code and copy: mode cards, severity helpers, the bounding-street card and the proposal-card bounding table and "Inside the area" block.
- [x] 2.4 Text pages (`tools/lib/llms-docs.ts`), the headless report (`tools/lib/simulate-report.ts`) and the docs follow the app.

## 3. Where traffic goes

- [x] 3.1 List measured blocks only and add one "Bounding streets and outside" summary row with its paired interval.

## 4. Check

- [x] 4.1 `npx vitest run` and `npx tsc --noEmit` pass.
- [x] 4.2 Look at both themes and both layouts in Chromium: Map in both modes with a scenario, Results, Streets, Proposals with the version 5 fixture, Where traffic goes.
