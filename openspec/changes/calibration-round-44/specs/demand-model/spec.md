## ADDED Requirements

### Requirement: Control delay per approach can be measured
The static assignment SHALL accept a measured control delay per approach link and period. A measured value SHALL replace the constant of the approach's control type in the cost of every movement that leaves the approach. An approach without a measured value SHALL keep the constant. An approach whose control type has no constant SHALL ignore a measured value. The measured value SHALL be the flow-weighted mean delay per car on the approach link over the kept seeds, less the flow-weighted median delay of links that end at no control and carry no hump, floored at zero, and only for approaches with at least 20 veh/h on average over the seeds (ASSUMPTION: the cut `tools/node-delays.ts` already uses).

#### Scenario: A measured delay changes the route
- **WHEN** two otherwise equal paths differ only in a signal approach, and the measured delay of that approach is below the signal constant
- **THEN** the assignment loads the path through the signal

#### Scenario: Approach with too few cars
- **WHEN** an approach carries under 20 veh/h on average over the seeds
- **THEN** the file has no value for it and the assignment uses the constant

### Requirement: A control delay file names what it was measured on
A control delay file SHALL record the area, the demand view, the SHA-256 of the network, the SHA-256 of the demand the runs used, the simulator fingerprint, the seeds and the run length. The measuring tool SHALL refuse reports whose manifest names another demand or network, or more than one simulator fingerprint. The demand build SHALL use a file only when its area, view, network hash and simulator fingerprint equal the build's, and SHALL otherwise fall back to the constants, print a warning and name the mismatch in the fit report. A missing file SHALL change nothing.

#### Scenario: File measured on another network
- **WHEN** the network hash in the file differs from the network the build reads
- **THEN** the build uses the constants, warns, and the fit report states the mismatch

#### Scenario: Training view
- **WHEN** the build is the training view of the validation split
- **THEN** it reads the training file, which was measured on training-view demand only, so no held-out count informs any input
