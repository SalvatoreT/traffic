## ADDED Requirements

### Requirement: Per-link through cars for the card picture
Each proposal in the proposals file SHALL carry a `picture` holding, for one period, the through cars an hour on each link that has any in either column, today and with the package, as parallel arrays keyed by link id. The values SHALL come from the same per-link counters, window, seeds and run length as the proposal's block figures. The period SHALL be the PM peak when it was searched, otherwise the first searched period. Links with no through cars in either column SHALL be omitted. Each group's `computed` SHALL record the run length in minutes.

#### Scenario: Search output
- **WHEN** the search writes a group
- **THEN** every package, search and reference alike, carries a `picture` with its period, link ids, baseline values and scenario values of equal length

#### Scenario: Zeros omitted
- **WHEN** a link carries no through cars today and none with the package
- **THEN** it is not in the arrays

### Requirement: Annotating an existing file
`explore --annotate` SHALL read the proposals file at `--out`, check that every group was computed on the current network and demand hashes, re-simulate only the baseline and the published packages for each group's picture period with the group's seeds and run length, and write the `picture` of every package into the same file without changing anything else. It SHALL NOT run a search, and its arrays SHALL equal those the search writes for the same inputs.

#### Scenario: Matching inputs
- **WHEN** a file is annotated on the inputs it was computed on
- **THEN** each package gains a `picture` identical to what the search wrote for it

#### Scenario: Other inputs
- **WHEN** a group's network or demand hash differs from the current inputs
- **THEN** the command stops with a message naming the group and leaves the file unchanged
