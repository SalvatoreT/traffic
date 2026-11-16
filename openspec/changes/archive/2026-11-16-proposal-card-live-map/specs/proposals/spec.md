## ADDED Requirements

### Requirement: Stored redirect data for published proposals
`npm run data:redistribution` SHALL write `public/data/redistribution/<area>/<group>.<proposal>.json`, under 200 KB, for each published proposal with a picture, from traced runs of today's traffic and the package on the proposal's confirmation seeds. For each intervention that closes a car movement it SHALL record how many through cars an hour drove it, where they went, the top routes with their links, and the receiving blocks.

#### Scenario: Generation
- **WHEN** the generator runs for a proposal with six interventions, five of them filters
- **THEN** the file lists the five filters with cars an hour used, the breakdown, routes and receiving blocks, and leaves out a change that closes no car movement

### Requirement: Redirect data is shown only when current
Each file SHALL record the proposal's link, the period, the seeds, the simulator fingerprint and the network and demand hashes. The app SHALL use a file only when its link, period and seeds equal the proposal's and its hashes and simulator equal the proposal group's and the ones loaded. The generator SHALL skip a current file unless forced.

#### Scenario: Freshness
- **WHEN** a file was made for another link, period, seeds, network, demand or simulator
- **THEN** the app does not show it and the generator makes it again
