## MODIFIED Requirements

### Requirement: Fit rule on seed means
Calibrated status SHALL require stability in every period, the recent fitted and held-out station rules, PM whole-street counts, current primitive validation and PM headline shares within ten percentage points of the observed values on seed means. Show their 95% intervals. Missing, mismatched or nonfinite evidence for a required seed, detector or primitive SHALL block a pass. List periods failing stability in `experimentalPeriods`.

#### Scenario: One failing period
- **WHEN** stability fails only in the PM peak
- **THEN** the area stays uncalibrated and the manifest lists that period

#### Scenario: Every rule holds
- **WHEN** complete current evidence passes each applicable rule
- **THEN** the assessment recommends calibrated status and lists no experimental periods

#### Scenario: Missing measurement
- **WHEN** a required detector has no finite measurement on one expected seed
- **THEN** the station and run set cannot supply passing evidence, and the assessment identifies the missing measurement

#### Scenario: Incomplete primitive report
- **WHEN** the primitive report omits a required case or belongs to a different simulator
- **THEN** it cannot support a calibrated verdict

### Requirement: Through cars on the counted blocks
The calibration report SHALL keep observed block volumes and freeway shares separate from simulated unique vehicles using any part of the corridor. When an observation counts vehicles traveling a whole street in one direction, the model SHALL count continuous traversals in that direction between the recorded endpoints. Counts of vehicles ending along a street and summaries across blocks SHALL NOT supply an upper bound on unique users of a corridor.

#### Scenario: Colby Street northbound
- **WHEN** the observation counts 102 drivers traveling the full street northbound
- **THEN** the report compares it with simulated continuous northbound traversals

#### Scenario: Fitted through figure
- **WHEN** a legacy fit inferred corridor-wide traffic from block volumes and cars ending along the street
- **THEN** those figures remain historical evidence and cannot serve as a measured corridor-wide target

#### Scenario: Vehicle leaves after one block
- **WHEN** a driver uses the first counted block and turns off before the last one
- **THEN** it counts toward its block and any-use metrics and contributes zero whole-street traversals

### Requirement: Through figures carry their standard error
The assessment SHALL report the modeled mean and its standard error across seeds beside each observed whole-street count. It SHALL identify the detector or corridor and compare like quantities in vehicles per hour.

#### Scenario: Twenty seeds
- **WHEN** the standard deviation for a direction is 16 cars an hour over twenty seeds
- **THEN** the table shows a standard error of about 3.6 beside its mean
