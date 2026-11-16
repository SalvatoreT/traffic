## MODIFIED Requirements

### Requirement: Headless scenario runs
`npm run simulate` SHALL run one scenario from a link or an interventions file on the same WASM build as the app, at the app's seed, run length and demand by default, and print JSON with the inputs, baseline and scenario figures for the side streets inside the study area, whether either run is oversaturated, unplaced interventions and per-block changes. It SHALL NOT print whole-network figures such as trip times, delay, completed or unroutable trips, walking and biking indicators or network counts. It SHALL exit non-zero with a message for an undecodable link or missing data.

#### Scenario: Same as the app
- **WHEN** a published proposal's link is run at seed 1
- **THEN** the through cars an hour equal the app's after a full hour
