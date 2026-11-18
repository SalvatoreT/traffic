## MODIFIED Requirements

### Requirement: Stored redirect data for published proposals
`npm run data:redistribution` SHALL write `public/data/redistribution/<area>/<group>.<proposal>.json`, under 200 KB, for each published proposal with a picture, from traced runs of today's traffic and the package on the proposal's confirmation seeds. For each intervention that closes a car movement it SHALL record how many through cars an hour drove it, where they went, the top routes with their links, and the receiving blocks. A route's links SHALL be a connected path (each link starts where the one before it ends) from the first to the last link within the local radius of the closed junctions, and its street list SHALL name every street those links drive. The generator SHALL fail without writing the file when a route breaks either rule, and the map SHALL NOT draw a segment between non-adjacent nodes.

#### Scenario: Generation
- **WHEN** the generator runs for a proposal with six interventions, five of them filters
- **THEN** the file lists the five filters with cars an hour used, the breakdown, routes and receiving blocks, and leaves out a change that closes no car movement

#### Scenario: A route leaves the radius and returns
- **WHEN** a followed trip drives a link inside the radius, several links outside it, and a link inside it again
- **THEN** the stored links include the links outside the radius in between, and the street list names them

#### Scenario: A stored route has a gap
- **WHEN** a link list has consecutive links that do not meet at a node
- **THEN** the generator reports the route and writes nothing, and the map draws the runs as separate lines
