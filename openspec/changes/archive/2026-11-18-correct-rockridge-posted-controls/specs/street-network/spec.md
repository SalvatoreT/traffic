## ADDED Requirements

### Requirement: Posted speed limit on part of a way

The area config MAY specify a posted speed in mph, its source, an OSM way ID and two OSM junction IDs. The importer SHALL support ways whose surviving junctions form a linear sequence without revisits. It SHALL apply the limit to the matching links between the named ends in each direction and preserve speeds on adjacent blocks. It SHALL report and skip any correction it cannot resolve.

#### Scenario: Speed zone ends before the OSM way ends

- **WHEN** two junctions on a longer two-way OSM way delimit a 30 mph zone with an intervening junction
- **THEN** all four directed links between the ends carry 30 mph and adjacent links retain their previous limit

#### Scenario: The extent cannot be resolved

- **WHEN** a named end is missing or the matching way offers multiple paths between the ends
- **THEN** the importer reports the source entry and preserves the imported limits for that entry

#### Scenario: The way returns to a junction outside the posted zone

- **WHEN** the way passes through one surviving junction, passes through a different one, then returns to the first anywhere on the way
- **THEN** the importer reports and skips the whole correction, even if the requested stretch lies away from the repeated junction

#### Scenario: Overlapping corrections

- **WHEN** two entries claim the same link
- **THEN** the importer reports both entries and skips both corrections in full

#### Scenario: Existing area with no speed override

- **WHEN** a study area specifies no posted speed correction
- **THEN** links take their limits from the map tags or the documented street-class defaults

### Requirement: All-way stop recorded by the road authority

The importer SHALL honor a sourced area tag override identifying an all-way stop. The junction SHALL have all-way stop control and each incoming link SHALL carry a stop sign.

#### Scenario: Three approaches to an all-way stop

- **WHEN** the area config sets an all-way stop at a T-junction with three approaching streets or street segments
- **THEN** cars face a stop on each of those three approaches
