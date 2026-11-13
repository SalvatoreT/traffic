## MODIFIED Requirements

### Requirement: Proposals tab
The UI SHALL provide a Proposals tab listing the published options in order from fewest interventions to greatest reduction, each with its title, description, interventions, reduction in cut-through as a percentage and as through vehicles an hour before and after, worst-affected inside block and the size of its increase, and SHALL let the user open any option on the map as a scenario. A group of options computed with an earlier measure SHALL be marked out of date and list no options.

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

#### Scenario: Count in view
- **WHEN** an option is listed
- **THEN** it reads "N → M through vehicles an hour" and shows no distance unit

#### Scenario: Older file
- **WHEN** a group in the file reports vehicle-miles
- **THEN** the tab says it is out of date and does not show its options

## ADDED Requirements

### Requirement: Cut-through results
The Results panel SHALL show cut-through as "Cut-through vehicles" in veh/h for baseline and scenario with the difference, defined as gate-to-gate trips that use at least one residential or service street inside the study area, counted once each. Distance units SHALL NOT appear in user-facing copy. A secondary row MAY show the through share of side-street driving, labeled so that it does not read as the headline.

#### Scenario: Comparing a scenario
- **WHEN** a scenario has run
- **THEN** the cut-through card shows vehicles per hour for baseline and scenario, the change, and the definition
