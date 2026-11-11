## ADDED Requirements

### Requirement: Headless calibration run
The project SHALL provide a command that runs the baseline simulation natively for a chosen period and duration and writes a report comparing modeled select-link shares with the observed targets for the area.

#### Scenario: Running calibration
- **WHEN** a contributor runs the calibration command for Rockridge
- **THEN** a report lists each observed share, the modeled value and the difference, plus network-health indicators

### Requirement: Select-link analysis
The simulation SHALL be able to record, for nominated links, the origins, destinations and upstream/downstream streets of trips traversing them.

#### Scenario: Freeway share on a residential street
- **WHEN** select-link analysis is enabled for a block of Hillegass Avenue
- **THEN** the share of traversing trips that originated at a freeway gate is reported

### Requirement: Stable baseline
The published baseline SHALL run a 60-minute PM peak at full demand with no gridlock removals, backlog under 2% of spawned trips and arterial mean speed above 4 m/s.

#### Scenario: Full-demand run
- **WHEN** the baseline runs for 60 simulated minutes at demand scale 1.0
- **THEN** the stability thresholds are met

### Requirement: Recorded fit
Calibration results and every tuned parameter SHALL be recorded in the repository with the value before and after and the reason, and the UI SHALL state the baseline's calibration status.

#### Scenario: Reading the calibration record
- **WHEN** someone opens the calibration record
- **THEN** they see the fit to each observed share and the list of adjustments made
