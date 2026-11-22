## ADDED Requirements

### Requirement: OSM tag corrections from the area config
The importer SHALL apply `osmTagOverrides` of the area config, keyed `way/<id>` or `node/<id>`, before it builds the network: each entry sets the listed tags (an empty value removes the tag) and carries a `source`. A correction that is not observed SHALL say ASSUMPTION in its source. No correction SHALL exempt a node from the gridlock rule.

#### Scenario: A lane count that cannot be right
- **WHEN** the area config sets `lanes` and `lanes:backward` on a way whose northbound lane count drops from two to one for 30 m after a signal
- **THEN** the network carries the corrected lane counts on that way and the importer output is otherwise unchanged

### Requirement: Lanes from turn lanes when the lane count is missing
For a chain of one-way ways with no `lanes` tag whose last way lists its lanes in `turn:lanes` [OSMTurnLanes], the link SHALL have as many lanes as that list has entries (at least the default). The rule SHALL be applied to finished links so chain merging, and with it every link id, is unchanged.

#### Scenario: A one-way approach tagged only with turn lanes
- **WHEN** a one-way secondary way has `turn:lanes=left||` and no `lanes` tag
- **THEN** its link has 3 lanes and one left-turn lane, and no other link id changes
