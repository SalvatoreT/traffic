## Why

The Assumptions tab sorts through cars by the reason the model assigns them: a named freeway on-ramp, "Other on-ramps", a named off-ramp, "Other off-ramps", three origin-destination groups and a large leftover "Other" (37, 26 and 158 cars an hour in the AM peak, midday and PM peak). The project lead found that organized around the wrong thing and too exhaustive. The question people ask is where in the neighborhood the cars drive, and which way. Several of the headline groups are also too small to matter.

## What Changes

- Add the section "Where cars cut through" above "Why cars cut through". It lists through cars by corridor and direction, heaviest first, with cars an hour for each period and the share of all through cars. Flows under 5% of the through cars in every period are folded into one "Smaller flows" line with a closed disclosure.
- Under each headline row, a closed disclosure "Why these cars are here" keeps the existing reason breakdown for that flow, with the Observed counts and Assumed labels and the "would otherwise use" notes, and lists the streets of the corridor. The reason cards and their maps move into a closed disclosure in "Why cars cut through".
- Group the assumed movement flows under the same corridor headings. The numbers do not change.
- Define corridors as data in the area config (`cutThroughCorridors`). The code names no street.
- Compute the table from a traced baseline hour per period, using the simulator's own reason for each car and the trace's routes. No simulator source changes, so the fingerprint stays `6b886c8f52ee07397773ddd0ebbcb447`.
- Store the table in `baseline-intents.json` and the corridor of each movement in `<area>.assumptions.json`. Mirror the section in `assumptions.md`.

## Impact

- Specs: `simulator-ui`, `proposals` (the baseline file), `demand-model` (the area config).
- Code: `tools/lib/corridor-trace.ts`, `tools/lib/cut-corridors.ts`, `tools/precompute-results.ts`, `tools/build-assumptions.ts`, `tools/lib/llms-docs.ts`, `src/lib/corridors.ts`, `src/components/Corridors.tsx`, `src/components/Assumptions.tsx`.
- Data: `data/areas/rockridge.json`; regenerated `baseline-intents.json`, `rockridge.assumptions.json` and the text pages. The network, demand, proposals and stored proposal results are unchanged.
