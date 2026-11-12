## ADDED Requirements

### Requirement: Proposals tab
The UI SHALL provide a Proposals tab listing the published options in order from fewest interventions to greatest reduction, each with its title, description, interventions, reduction in cut-through, worst-affected inside block and the size of its increase, and SHALL let the user open any option on the map as a scenario.

#### Scenario: Opening an option
- **WHEN** a user chooses to open a proposal
- **THEN** the map view loads that proposal's interventions as the current scenario

#### Scenario: Uncalibrated baseline
- **WHEN** the baseline's calibration status is not calibrated
- **THEN** the tab states that the proposals are exploratory and why

#### Scenario: Out-of-date proposals
- **WHEN** the proposals were computed on a different network or demand than the one loaded
- **THEN** the tab says they are out of date

#### Scenario: No proposals published
- **WHEN** no proposals file exists for the area
- **THEN** the tab explains that none have been computed yet

### Requirement: Groups of proposals
The Proposals tab SHALL show each group of the proposals file under its own heading and plain-language note, in file order. Each group SHALL have its own ranked list, computed date, exploratory notice and out-of-date notice.

#### Scenario: Two groups
- **WHEN** the file holds a group of packages that follow the 2025 neighborhood pilot's limits and a group without limits
- **THEN** the tab lists the first group, then the second, each with its heading and note

#### Scenario: Empty group
- **WHEN** a group holds no options
- **THEN** its heading and note appear with a message that none were found under those limits

#### Scenario: Earlier file format
- **WHEN** the file has one list and no groups
- **THEN** the tab shows it as a single group without limits
