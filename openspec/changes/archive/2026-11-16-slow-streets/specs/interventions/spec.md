## ADDED Requirements

### Requirement: Slow Street
A Slow Street SHALL be one intervention that limits every block of one named street inside the study area to 15 mph. A street SHALL be identified by its name in the study area; where the street has a gap or changes name, only the connected run that contains the chosen block SHALL be limited, and the label SHALL say so. A block already at or below 15 mph SHALL keep its limit. The label SHALL read "Slow Street on <street> (15 mph, <from> to <to>)". The code SHALL NOT name any street or area.

#### Scenario: Whole street
- **WHEN** a user chooses a Slow Street on any block of a street
- **THEN** every block of that street's connected run inside the study area is at 15 mph and the scenario list shows one change

#### Scenario: Split street
- **WHEN** a street's blocks inside the study area are not all connected
- **THEN** only the run that holds the chosen block is limited and the label says it is the connected stretch only

### Requirement: Slow Street scenario link
A scenario link SHALL carry a Slow Street as the item `ss,<geohash>` with no parameter, where the point names any block of the street. The item SHALL be written at the middle of the lowest-numbered block of the run, so one Slow Street is one string. Links written with per-block `sl` items SHALL keep opening and running as before.

#### Scenario: Any block, one link
- **WHEN** a Slow Street is written from two different blocks of the same street
- **THEN** both links are identical

#### Scenario: Old link
- **WHEN** a link holds per-block `sl` items
- **THEN** it decodes to per-block speed limits and runs the same as before this change

### Requirement: Speed limit on a Slow Street, in the editor
Choosing "Set speed limit" on a block SHALL list "Apply to the whole street (Slow Street, 15 mph)" first, with the street's label, and SHALL open with it suggested; the per-block limits SHALL stay available below it, labeled "This block only".

#### Scenario: Choosing the street
- **WHEN** a user opens "Set speed limit" on a named street
- **THEN** the first choice applies a Slow Street to the whole street

### Requirement: What a Slow Street assumes
Documentation and Assumptions-facing copy SHALL say that a Slow Street sets the desired speed of cars on the street to 15 mph on average with the model's own spread, raises the street's free-flow routing time, and assumes full compliance with no enforcement and no physical measure; this SHALL be labeled an ASSUMPTION unless a source in `docs/references.md` supports a compliance rate.

#### Scenario: Reading the assumption
- **WHEN** a reader opens the Slow Street entry in the docs or the text pages
- **THEN** it states the full-compliance assumption
