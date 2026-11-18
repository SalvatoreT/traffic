## Why

The project lead compared the stop control of all 36 side-street junctions in the study area with street-level imagery and found two where the model differs from the street (decisions by card, 2026-11-18). Hillegass Ave at 61st St is an all-way stop, and the model stops 61st St only. At Canning St and 62nd St the eastbound 62nd St approach has no stop, and the model stops all four approaches. Both junctions sit on routes the held-out count stations near Howell St and Canning St depend on.

## What Changes

- Hillegass Ave at 61st St (OSM node 53085953) becomes an all-way stop through the existing tag override (`stop=all`).
- Canning St at 62nd St (OSM node 53088342) keeps its stop on three approaches and loses it on the eastbound 62nd St approach. The map tags the stop on the junction node, which cannot leave one approach out, so the area config gets a new list, `stopExemptions`, that names the junction node, the way and the direction of the approach that does not stop.
- The network and the demand are rebuilt (`npm run data`, split not re-frozen) and assessed on ten seeds per period.
- Round 43 in the calibration record; the area note and caveat take the new figures only if the assessment is no worse than before on the station rule, stability and the whole-street counts.
- Outcome (design D10 to D13): with both corrections the PM fit got worse, so the project lead had the two data entries removed. The mechanism and its tests stay; the published network and demand are unchanged; the caveat names the discrepancy.

## Capabilities

### New Capabilities

### Modified Capabilities

- `street-network`: the area config can exempt one approach from the stop control the map tags on a junction node.

## Impact

- `tools/lib/network.ts`, `tools/lib/types.ts`, `tools/import-osm.ts`, `tools/import-osm.test.ts`; `data/areas/rockridge.json` and, because it shares the settings, `data/areas/rockridge-compact.json`.
- During the trial the network file changed (two nodes' control, three links' `stopAtEnd`) and the demand with it. After D13 the network, the demand and the cross-validation demand are the published ones again. The simulator and its fingerprint do not change.
