## ADDED Requirements

### Requirement: Attributes for walking and biking
The importer SHALL record, from OpenStreetMap, which links have bike lanes or are bike routes, which have sidewalks, where marked crossings are, and SHALL keep these as optional fields so existing files remain valid.

#### Scenario: Street with a bike lane
- **WHEN** OpenStreetMap tags a street with a bike lane in one direction
- **THEN** the link in that direction is flagged as having a bike lane

#### Scenario: Marked crossing
- **WHEN** OpenStreetMap has a marked crossing on a street between intersections
- **THEN** the link lists a crossing at that distance from its start
