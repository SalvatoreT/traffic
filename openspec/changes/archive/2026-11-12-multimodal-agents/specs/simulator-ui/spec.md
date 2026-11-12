## ADDED Requirements

### Requirement: Modes on the map
The map SHALL draw cars, bicycles and pedestrians with distinct shapes as well as colors, explain them in the legend, and let people show or hide each mode.

#### Scenario: Hiding cars
- **WHEN** a user turns off cars
- **THEN** only bicycles and pedestrians are drawn and the legend reflects the choice

### Requirement: Results by mode
Results SHALL show, for baseline and scenario, safety indicators for people walking and biking, pedestrian crossing delay and per-mode trip times, with the change stated in words and the surrogate-indicator caveat visible.

#### Scenario: After adding a modal filter
- **WHEN** a scenario with a modal filter has run for the comparison window
- **THEN** the results show how conflicts with pedestrians and cyclists changed

### Requirement: Assumed volumes are stated
The UI SHALL state that walking and biking volumes are assumptions wherever their metrics appear.

#### Scenario: Viewing walking results
- **WHEN** a user views pedestrian metrics
- **THEN** a note says the walking volumes are assumed, not counted
