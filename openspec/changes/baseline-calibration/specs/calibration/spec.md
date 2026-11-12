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

### Requirement: Primitive validation suite
The project SHALL provide a command that runs benchmark cases on small synthetic networks with saturated demand, each measuring one simulator primitive, and prints the simulated value, expected range, source key, ratio and result for every case. Each expected range SHALL cite a verified key of the bibliography or be labeled an assumption.

#### Scenario: Running the validation suite
- **WHEN** a contributor runs the validation command
- **THEN** a table lists each case with its simulated value, expected range, source, ratio and result, and `validation.md` is written

#### Scenario: A capacity rule regresses
- **WHEN** a change to the car-following, junction or signal rules moves a case outside its range and the case is not a known deviation
- **THEN** the regression test fails and names the case and its range

#### Scenario: Known deviations are listed
- **WHEN** a case is outside its range
- **THEN** the regression test passes only if the case is on the documented list of known deviations

### Requirement: Period status in the area manifest
The area config SHALL be able to name the demand period the app opens with (`defaultPeriod`) and the periods whose baseline fails the stability criterion (`experimentalPeriods`), and the importer SHALL copy both into `areas.json`; the calibration status SHALL be `calibrated` only when the stability criterion and the headline shares hold in every period.

#### Scenario: A period fails stability
- **WHEN** the PM peak run at full demand fails the stability criterion
- **THEN** the area config lists `pm_peak` under `experimentalPeriods` and the status stays `uncalibrated`
