## ADDED Requirements

### Requirement: Observed arterial travel times in the assessment
The targets file MAY list arterial segments by street and the two cross streets, with their published length and observed peak-period speeds by year. For each listed segment the assessment SHALL report the free-flow time, the simulated time (free-flow time plus the mean delay per vehicle on each link, seed mean with its interval, scaled to the published length), the observed speeds and whether the simulated time lies inside the range of the observed years.

#### Scenario: Telegraph Avenue
- **WHEN** the targets file lists Telegraph Avenue from 51st Street to Russell Street with four observed PM speeds
- **THEN** the PM section of the assessment has a row with the simulated seconds and speed, the four observed speeds and yes or no for the range
