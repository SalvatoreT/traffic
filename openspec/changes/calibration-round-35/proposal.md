## Why

Round 34 left the delay-feedback fit rejected on gridlock at Ashby Ave / Claremont Ave and on the hillside streets behind it. The model codes Ashby Ave eastbound into that junction with one lane, from OSM, while the 2010 PM worksheet in [SafewayCollege-DEIR2011] codes two, and with one lane the approach cannot carry the 1,163 vehicles an hour Caltrans counted in 2024. On 2026-11-16 the project lead relayed two resident-provided field observations: Ashby Ave eastbound has two travel lanes at Claremont Ave in the PM peak, and Claremont Ave southbound has a green left arrow, as northbound does. With the worksheet, the second observation means both Claremont Ave approaches run as split phases.

## What changes

- Ashby Ave eastbound into Claremont Ave: two lanes on the approach link (an `osmTagOverrides` entry on way 34361024; DATA: field observation). The extent (the whole 129 m link from Claremont Crescent, the shortest the network has without splitting a link) and all periods are ASSUMPTIONS. The worksheet codes the approach as one shared lane group with no left-turn lane, so the approach gets no class-rule pocket.
- The importer accepts an observation that gives only the lane coding (`noLeftTurnLane` without timing or `ownPhase`).
- Claremont Ave southbound at Ashby Ave: an observed own phase next to the northbound one (DATA: field observation; the worksheet's split phasing). Cycle and greens follow the flows (Webster), an ASSUMPTION pending a timing sheet; Ashby Ave keeps one phase with permitted lefts, as in the worksheet.
- Ashby Ave westbound is checked against the worksheet; it is changed only if the worksheet and the OSM lane tags agree.
- Queue-first left turns are retested on the new network; the delay-feedback fit is redone to convergence under its unchanged acceptance rule.
- Evaluation, round 35 in the calibration record and the area's `calibration` note.

## Capabilities

### New Capabilities

### Modified Capabilities

- `street-network`: an observation in `signalObservations` may carry only the lane coding.

## Impact

- `tools/lib/signal-obs.ts`, `tools/signal-obs.test.ts`.
- `data/areas/rockridge.json` (lane override, observations, calibration note), `public/data/*` (network, demand, noise, assumptions), `data/calibration/*` (validation, record, assessment).
- No link is renumbered; the frozen split is unchanged.
