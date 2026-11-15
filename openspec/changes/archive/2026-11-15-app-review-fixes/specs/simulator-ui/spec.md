## ADDED Requirements

### Requirement: Restarts never show the old run
After a period, demand, scenario or reset change, the UI SHALL show no report from the previous configuration, and the new run SHALL start from zero.

#### Scenario: Period changed after a finished run
- **WHEN** a run has finished and the user chooses another period
- **THEN** the clock reads 0:00:00, the old results are not shown as the new period's full hour, and the new run plays

### Requirement: Cut-through is colored per block
The cut-through and change-in-cut-through layers SHALL color a block from both directions added together, with a dead band of 7.5 and a top of 100 cars an hour, and both directions SHALL be drawn in the same color. Flow and speed SHALL stay per direction. The legend SHALL say which, and hovering SHALL list each direction and the block total.

#### Scenario: Two directions of one block
- **WHEN** a block carries 60 and 40 through cars an hour in its two directions
- **THEN** both directions are drawn in the color for 100, and the hover lists 60, 40 and "both directions" 100

### Requirement: Early figures are labeled
While an unfinished run has covered under five simulated minutes, every rate shown SHALL carry the text label "Early, noisy" or the early note.

#### Scenario: No scenario, first minutes
- **WHEN** a run has covered two simulated minutes
- **THEN** Results, Streets, the map hover and the reasons card show the early label

### Requirement: Scenario links apply fully
Opening a scenario link in an open tab SHALL apply its period and demand as well as its interventions.

#### Scenario: Link with a period
- **WHEN** the address changes to a link naming the midday period and 120% demand
- **THEN** the period and demand switch to those values and the address keeps them

### Requirement: Safe stored results
A stored result that fails validation (encoding, lengths, metrics shape) SHALL be ignored, falling back to a live run. A stored result that arrives after the user started a run SHALL NOT replace it. A link scenario on the synthetic fixture SHALL start running. An error at the app root SHALL show a plain recovery message.

#### Scenario: Damaged file
- **WHEN** a stored result has link statistics of the wrong length
- **THEN** the app runs live and shows no error

### Requirement: Reasons card announcements
The reasons card SHALL announce only when a reason is chosen or cleared. Changing figures SHALL stay out of live regions, and the path sentence SHALL keep a stable order while the run plays.

#### Scenario: Run in progress
- **WHEN** a reason is selected during a run
- **THEN** one short status is announced, and the figures do not re-announce each second

### Requirement: Legend keys
The on-screen legend and the exported map image SHALL include keys for filter bars, diverters, lettered badges and the reason line when they are drawn, and SHALL list no cars when none are drawn.

#### Scenario: Stored result export
- **WHEN** a stored result is exported
- **THEN** the key row has no "Cars" entry
