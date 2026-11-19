## ADDED Requirements

### Requirement: Measured control delay replaces the constant per approach
The static assignment SHALL accept a measured control delay per approach link and period. A measured value SHALL replace the constant of the approach's control type in the cost of every movement that leaves the approach. An approach without a value SHALL keep the constant, and an approach with no control delay SHALL ignore a value.

#### Scenario: A measured delay changes the route
- **WHEN** two otherwise equal paths differ only in a signal approach, and the measured delay of that approach is below the signal constant
- **THEN** the assignment loads the path through the signal

#### Scenario: No measurement
- **WHEN** an approach has no measured value
- **THEN** its movements cost what they cost with the constants

### Requirement: Control delay is measured from baseline runs
The measured value SHALL be the flow-weighted mean delay per car on the approach link over the kept seeds, less the flow-weighted median delay of links that end at no control and carry no hump, floored at zero. Only approaches with at least 20 veh/h on average over the seeds SHALL have a value (ASSUMPTION: the cut `tools/node-delays.ts` uses).

#### Scenario: Approach with too few cars
- **WHEN** an approach carries under 20 veh/h on average over the seeds
- **THEN** the file has no value for it and the assignment uses the constant

### Requirement: A control delay file names what it was measured on
A control delay file SHALL record the area, the demand view, the network hash, the demand hash, the simulator fingerprint, the seeds and the run length. The measuring tool SHALL refuse reports whose manifest names another demand or network, or more than one simulator fingerprint.

#### Scenario: Reports of another demand
- **WHEN** a seed report names a demand other than the one given to the tool
- **THEN** the tool stops without writing a file

### Requirement: The demand build checks the control delay file
The demand build SHALL use a file only when its area, view, network hash and simulator fingerprint equal the build's. Otherwise it SHALL use the constants, print a warning and name the mismatch in the fit report. A missing file SHALL change nothing.

#### Scenario: File measured on another network
- **WHEN** the network hash in the file differs from the network the build reads
- **THEN** the build uses the constants, warns, and the fit report states the mismatch

#### Scenario: Training view
- **WHEN** the build is the training view of the validation split
- **THEN** it reads the training file, which was measured on training-view demand only, so no held-out count informs any input

### Requirement: Measured control delay is off unless the area config names a file
The demand build SHALL read a control delay file only when the area's demand config names one under the count fit's assignment settings. Without that entry the build SHALL ignore every control delay file on disk and use the constants of the control types.

#### Scenario: Default build
- **WHEN** the demand config has no control delay entry and delay files exist in the data folder
- **THEN** the build output is the same as a build without those files
