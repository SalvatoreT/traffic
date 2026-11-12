## ADDED Requirements

### Requirement: Map limited to the study area
The map SHALL draw streets, traffic, agents, signals and markers only within the study area and a fixed buffer around it, SHALL keep the camera within that region, and SHALL leave the simulation and its results covering the whole network.

#### Scenario: Zooming out
- **WHEN** a user zooms out or pans as far as the map allows
- **THEN** the view stays within the study area and its buffer, and nothing is drawn beyond it

#### Scenario: Intervention outside the region
- **WHEN** a shared link contains an intervention outside the visible region
- **THEN** the intervention is applied, listed as outside the map and shown without a marker

### Requirement: Fixed overlay scales
Each traffic overlay SHALL use a fixed scale whose top value does not change while the simulation runs, SHALL show values above the top in the top color, and SHALL label the top with a plus sign; a top value that is not backed by a verified source SHALL be labeled an assumption.

#### Scenario: Traffic builds up
- **WHEN** traffic on a street rises during a run
- **THEN** the street's color moves along a scale whose labels stay the same

### Requirement: Opening period
On first load the app SHALL select a period that is not marked experimental when one exists, and a shared link that names a period SHALL open on that period.

#### Scenario: First visit
- **WHEN** a user opens the app without a link
- **THEN** the selected period is not marked experimental
