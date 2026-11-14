## ADDED Requirements

### Requirement: Intent map of through cars
The calibrate report SHALL list, for each counted block and for the study area's residential and service streets, the through cars per hour (neither trip end in the study area) by origin group and destination group, with the arterial each trip would otherwise use on the shortest free-flow path that avoids the study area's local streets, where that path runs on a boundary street near the study area. The ten-seed summary SHALL give the mean over the seeds.

#### Scenario: Block table
- **WHEN** the calibrate binary runs a PM peak with the groups file present
- **THEN** the report has a table per counted block of through cars per hour by (origin group, destination group)

#### Scenario: No groups file
- **WHEN** the groups file is absent
- **THEN** the report omits the intent map and says so

### Requirement: Intents the counts imply
The targets file MAY list, per counted block, the intents the volunteer count and the headline shares imply, each with origin and destination groups, a range and a basis marked OBSERVED or ASSUMPTION. The report SHALL show each intent's implied veh/h next to the model's and say whether the model is within, below or above the range, and SHALL show the model's through cars that no listed intent covers.

#### Scenario: Intent below its range
- **WHEN** the model carries 26 veh/h on an intent implied at 38 to 62
- **THEN** the report marks it below
