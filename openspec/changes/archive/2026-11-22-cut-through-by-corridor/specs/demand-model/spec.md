## ADDED Requirements

### Requirement: Cut-through corridors are area data
The area config MAY define `cutThroughCorridors`: ordered corridors, each with an id, a name, street names and a direction mode, plus a remainder name, a nearest-block distance, a second-corridor share and optional bounding streets for the west and east sides. A street SHALL be in at most one corridor and exist in the study area. The tools SHALL name no street in code.

#### Scenario: Assignment rule
- **WHEN** a through car uses side streets of several corridors
- **THEN** it is counted once, in the corridor where it drives the most side-street distance, and an unnamed side street takes the corridor of the nearest named block within the distance, both labeled assumptions

#### Scenario: Malformed settings
- **WHEN** a street is in two corridors, a corridor names a street that is not in the study area, or an id is repeated or reserved
- **THEN** the tool stops and names the corridor and the street

#### Scenario: Another area
- **WHEN** a study area defines other corridors or none
- **THEN** the tab and the text page show those corridors, or no corridor table, without a code change
