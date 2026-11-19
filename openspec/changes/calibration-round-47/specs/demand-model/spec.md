## ADDED Requirements

### Requirement: Stations that carry one source row can be one station over the sum of their links
When the area's demand config lists a link group, the stations it names SHALL be replaced by one station. Its links and detectors are the members' in order and its target in every period is the sum of the member targets. The fit and the scoring SHALL read it as one count over the sum of the flows on those links. With no link group in the config the stations and every output SHALL be unchanged, and the merge SHALL read no street names.

#### Scenario: One ADT row split over two ramps
- **WHEN** a config lists two on-ramp stations that took halves of one Caltrans row, and both are fitted
- **THEN** the station file has one station over both ramp links with the sum of the two targets, and the fit may place the row's flow on either ramp

### Requirement: A link group respects the frozen split
The merge SHALL run after the frozen validation split is applied and SHALL NOT change the split file. Members SHALL be link stations that share a source observation and have no link in common. The build SHALL stop when the members are on different sides of the split, when only some members are in the view, or when a member does not meet these conditions. A group none of whose members is in the view SHALL be left out with a note.

#### Scenario: Members on different sides of the split
- **WHEN** one listed station is held out and the other is fitted
- **THEN** the build fails with a message that names both and says the split is not re-frozen

#### Scenario: Group withheld in the training view
- **WHEN** the training view withholds the row that both members come from
- **THEN** neither member is in the view and the build notes that the group is left out
