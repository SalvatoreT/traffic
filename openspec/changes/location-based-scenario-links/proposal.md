## Why

A shared scenario link stopped working after the street network was regenerated. Links
store interventions by link and node index, and those indices change whenever the
importer changes (junction merging, a new boundary, fresh OpenStreetMap data).

## What Changes

- Scenario links store where each intervention is on the ground (longitude and latitude,
  plus a travel bearing for directional ones) and the area id. Indices are no longer stored.
- On load, each intervention is matched to the nearest suitable street block or
  intersection in the current network.
- An intervention that can no longer be placed is listed with an explanation and left out
  of the run. The rest of the scenario still loads.
- The link format carries a version number.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `simulator-ui`: how scenarios are encoded in links and restored

## Impact

`src/lib/hash.ts` and its callers. The simulation API still takes link and node ids at
runtime; only the shareable encoding changes.

## Out of scope

Recovering links made in the old index format. The networks they referred to no longer
exist, so they cannot be mapped reliably; the app says so when it sees one.
