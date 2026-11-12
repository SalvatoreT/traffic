## ADDED Requirements

### Requirement: Through-route check without simulation
The UI SHALL report, without running the simulation and updated whenever the scenario changes, how many routes still let a car cross the interior of the study area between perimeter streets, SHALL let the user see those routes and the cells of mutually reachable interior streets on the map, and SHALL state that the check is a screening aid that ignores traffic volumes.

#### Scenario: Baseline
- **WHEN** the scenario has no interventions
- **THEN** the panel shows the number of through routes in today's street network

#### Scenario: Adding a filter
- **WHEN** a user adds a filter that cuts a through route
- **THEN** the count drops at once, before any simulation result changes

#### Scenario: Watertight scheme
- **WHEN** no through route remains
- **THEN** the panel says no car can cross the area on interior streets

#### Scenario: Viewing routes
- **WHEN** a user asks to see the remaining routes
- **THEN** each route is listed by the streets it uses and can be highlighted on the map
