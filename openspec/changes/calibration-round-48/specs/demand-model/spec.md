## ADDED Requirements

### Requirement: Stations the report binary exports can take simulated membership
When the area's demand config has a `countFit.throughTargets.simulatedMembership` entry, every fitted station that `calibrate --select-od` exports SHALL take its route membership from simulated trips in the membership file of its view: link stations with a detector list or counted at the block, and movement and route stations. A station without an export (a gate total) SHALL keep static membership. With no entry the stations, the membership and every output SHALL be unchanged.

#### Scenario: Rule on
- **WHEN** the config has the entry and its membership file matches the build's evidence
- **THEN** the fit report lists, per period of the file, how many fitted stations took simulated membership and how many runs the file pools

#### Scenario: Rule off
- **WHEN** the config has no entry
- **THEN** the demand file of each view is byte-identical to the build before this change

### Requirement: The station set is chosen without reading names or counts
The stations that take simulated membership SHALL be chosen from the stations file and the frozen split alone. The choice SHALL read no street name, station name or count value, and the entry SHALL replace the `measuredStations` list while it is present.

#### Scenario: Renamed stations
- **WHEN** every station is renamed and every target rescaled
- **THEN** the rule selects the same number of stations

### Requirement: The training view's membership comes from training-view runs only
The membership file of the training view SHALL be pooled only from runs of the training demand and SHALL name no station that the frozen split withholds, in its pair lists or in its list of stations without trips. Its pair list SHALL contain only pairs that a kept station used. The loop SHALL NOT change the split file.

#### Scenario: Run of the wrong view
- **WHEN** a seed run made on the shipped demand is offered to the training view's pool
- **THEN** the pool is refused with the view named

#### Scenario: Withheld station in a pooled file
- **WHEN** a pooled training file would name a withheld station
- **THEN** the loop stops before writing it

### Requirement: Station choice and the stop rule read no held-out result
The loop SHALL NOT read an assessment, a held-out score or a count value to choose stations or to stop. Its stop rule SHALL use simulated flows only.

#### Scenario: Stop decision
- **WHEN** the loop decides whether to run another pass
- **THEN** it compares simulated station and pair flows of two passes and reads no score

### Requirement: Iteration runs are pooled with equal weight
The loop SHALL pool the seed runs of every pass with equal weight, using the same number of seeds, at least two, in each pass. A station with no simulated trip in any pooled run SHALL keep its static membership and SHALL be listed in the file and in the loop's report.

#### Scenario: Unequal seed counts
- **WHEN** two passes carry different numbers of seeds
- **THEN** pooling is refused

### Requirement: The loop stops early only on seed noise
From the second pass on, the loop SHALL compare the seed-mean flow of each station, and the seed-mean flow of each pair at the station, with the previous pass, as root mean squares over stations against the combined seed standard errors. It SHALL stop early only when both ratios are at most 1 in every view and period.

#### Scenario: Nothing moved
- **WHEN** two passes differ by no more than their seed standard errors
- **THEN** the loop builds the final demand from the pool of the passes run so far

#### Scenario: A station moved by many standard errors
- **WHEN** one station's flow differs between passes by many combined standard errors
- **THEN** the loop runs the next pass

### Requirement: A build that falls back to static membership stops the loop
After each build the loop SHALL read the fit report. From the second pass on the report SHALL carry the note that names the membership file and the view and, for each period of the file, a note whose run count and station count equal what the file holds. Otherwise the loop SHALL stop with the missing note named. The first pass SHALL build without a file and the report SHALL say so.

#### Scenario: Evidence does not match
- **WHEN** the build reports that the membership file lacks matching evidence
- **THEN** the loop stops instead of continuing on static membership
