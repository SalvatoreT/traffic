# proposals Specification

## Purpose
TBD - created by archiving change proposals. Update Purpose after archive.

## Requirements

### Requirement: Search for low-harm packages
The project SHALL provide a search that evaluates sets of interventions in the simulation and returns packages that reduce cut-through traffic on streets inside the study area, measured as through cars per hour, while limiting the largest increase in all traffic (through cars and local trips together) on any single inside street block. The proposals file SHALL report each package's cut-through as baseline and scenario cars per hour and the percent change, SHALL report the side-street block that gains the most through cars per hour, averaged over the same periods, and for each period the all-traffic change on the block with the largest all-traffic increase with its through-car part, and SHALL be versioned so that readers can tell files that report a distance, files that report one all-traffic worst block, and files that report both measures.

#### Scenario: Running the search
- **WHEN** a contributor runs the search for an area
- **THEN** it writes a proposals file whose packages were each rechecked over the full hour, every searched period and several seeds, with cut-through in cars per hour

#### Scenario: A package that moves traffic next door
- **WHEN** a candidate package removes cut-through from one block by adding a large amount of all traffic to another inside block
- **THEN** its ranking penalty reflects that worst block and it ranks below packages with the same reduction and less penalty

#### Scenario: A package that only shortens through trips
- **WHEN** a package changes how far through cars drive on local streets but not how many of them use those streets
- **THEN** its reduction is zero

#### Scenario: Through cars on a block
- **WHEN** a package is rechecked
- **THEN** each block's through-car flow comes from the simulator's per-link cut-through counters over the same window as its all-car flow, and is never larger than its all-car flow

#### Scenario: No block gains through traffic
- **WHEN** no block's average through-car gain passes its noise band
- **THEN** the file reports zero blocks above noise for the through measure

#### Scenario: Per-period all traffic
- **WHEN** a package is published
- **THEN** each searched period reports the all-traffic worst block with its before and after cars per hour, how much of the change is through cars, and how many blocks gain beyond noise in that period

### Requirement: Allowed contents
A proposal SHALL use only interventions the app offers, SHALL NOT add a traffic signal, and SHALL leave every block inside the study area reachable by car from outside in both directions.

#### Scenario: Stranded block
- **WHEN** a candidate package leaves a block with no way in or out by car
- **THEN** the package is rejected

### Requirement: Published with provenance
The proposals file SHALL record the network and demand it was computed on, the periods and seeds used, the date and the baseline's calibration status.

#### Scenario: Group provenance
- **WHEN** a proposals file holds more than one group
- **THEN** each group records its own date, periods, seeds, hashes and calibration status

#### Scenario: Baseline changes
- **WHEN** the published network or demand differs from the one recorded in the proposals file
- **THEN** the proposals are treated as out of date

### Requirement: Constraint profiles
The search SHALL accept a named profile from a per-area data file that excludes intervention types and, optionally, every intervention on a bounding street or at an intersection with one. A run SHALL write its results as one group of the proposals file, replacing only the group with the same id and keeping the others. A run without a profile SHALL write the unconstrained group. The harm definition SHALL NOT depend on the profile.

#### Scenario: Limits of the 2025 neighborhood pilot
- **WHEN** the search runs with the profile that excludes speed humps, traffic circles and the boundary
- **THEN** no candidate or proposal contains a speed hump or traffic circle, or touches a bounding street or an intersection with one

#### Scenario: Two runs, one file
- **WHEN** the search runs once with a profile and once without
- **THEN** the proposals file holds both groups, and rerunning either replaces only its own

#### Scenario: Earlier single-list file
- **WHEN** a profile run merges into a proposals file in the earlier format with one list
- **THEN** that list is kept as the unconstrained group

#### Scenario: Traffic moved onto a bounding street
- **WHEN** a package adds traffic to a bounding street
- **THEN** that increase is not counted as harm and is shown with the other bounding-street figures

### Requirement: Per-street filter candidates
The search SHALL offer, at each intersection where it offers a whole-junction filter, a filter on each single street when closing that street leaves at least two other legs connected, labeled "Modal filter on <street> at <intersection>". Such a candidate SHALL conflict with every other intervention on the same intersection, and a constraint profile SHALL apply to it as to the whole-junction filter.

#### Scenario: Four-way crossing
- **WHEN** candidates are generated for a crossing of two residential streets
- **THEN** the whole-junction filter and one filter per street are offered, and no package holds two of them

#### Scenario: T-junction
- **WHEN** candidates are generated for a T-junction
- **THEN** only the side street is offered alone, because closing the through street would leave a single leg

#### Scenario: Pilot limits
- **WHEN** the pilot profile excludes intersections with a bounding street or an intervention type
- **THEN** no per-street filter is offered at those intersections or of that type

### Requirement: A looser search is never worse than a stricter one
When a proposals file already holds a group computed on the same network and demand, a search with a profile SHALL start from that group's chosen packages that the profile allows: screen them, extend them in a beam of their own and recheck them with the other finalists. Those packages SHALL always be rechecked, whatever one-seed screening or the screening budget said, and SHALL NOT be dropped as within noise of a simpler package. A profile that does not keep off the boundary SHALL offer every location a profile that does would offer. Within one invocation, a later profile SHALL start from the groups the earlier ones wrote.

#### Scenario: Pilot packages seed the unconstrained search
- **WHEN** the unconstrained search runs after the pilot profile on the same inputs
- **THEN** every package the pilot group chose is rechecked in the unconstrained run, and the unconstrained group's best option cuts through cars at least as much as the pilot group's

#### Scenario: Budget spent
- **WHEN** the screening budget is exhausted before a stricter group's package is screened
- **THEN** the package is still rechecked

#### Scenario: Package that breaks the limits
- **WHEN** a seed package holds an intervention the current profile excludes, or one on a bounding street
- **THEN** that package is left out of the start and a line on stderr says why

#### Scenario: Different inputs
- **WHEN** the file's group was computed on another network or demand hash
- **THEN** its packages are not used

#### Scenario: Candidate cap
- **WHEN** the busiest locations include many on bounding streets
- **THEN** the unconstrained candidate list still holds the top locations that are off the boundary

### Requirement: Consistent chosen options
The options chosen for a group SHALL be listed from fewest interventions to most, and a package SHALL be listed only if it cuts through cars by more than every smaller package listed.

#### Scenario: More changes, less effect
- **WHEN** a finalist has more interventions than another finalist and cuts through cars less
- **THEN** it is not listed, and its note says a smaller finalist cuts through cars at least as much

### Requirement: Per-link through cars for the card picture
Each proposal in the proposals file SHALL carry a `picture`: for one period, the through cars an hour on each link that has any, today and with the package, as parallel arrays keyed by link id. The values SHALL come from the same counters, window, seeds and run length as the proposal's block figures. Each group's `computed` SHALL record the run length in minutes.

#### Scenario: Search output
- **WHEN** the search writes a group
- **THEN** every package, search and reference alike, carries a `picture` with its period, link ids, baseline values and scenario values of equal length

#### Scenario: Period
- **WHEN** the PM peak was searched
- **THEN** the picture is for the PM peak, and otherwise for the first searched period

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

### Requirement: Precomputed results for published proposals
A tool SHALL compute, for every published proposal in every group and each demand period, the finished hour of the scenario beside the baseline, with the simulator build the app runs, the app's seed, 100% demand and 60 simulated minutes. It SHALL write one file per distinct (scenario, period) to `public/data/results/<area>/<key>.json`, keyed by a hash of the order-independent scenario and the period, plus an index, and SHALL NOT write the proposals file.

#### Scenario: Shared scenario
- **WHEN** two proposals have the same interventions
- **THEN** they share one file per period

#### Scenario: Equals a fresh run
- **WHEN** a stored result is compared with a fresh run of the same scenario, period and seed
- **THEN** the link stats and metrics are equal

### Requirement: Contents and validity of a stored result
Each file SHALL hold both runs' metrics, per-link stats and per-intent link usage, and record the network hash, the demand hash and the simulator fingerprint. The tool SHALL reuse a file whose three inputs still match. Files SHALL be published with the other generated data and served under `/data/`.

#### Scenario: Inputs changed
- **WHEN** the network, the demand or the simulator's sources change
- **THEN** the next run of the tool recomputes the affected files and drops files for scenarios that are no longer published

### Requirement: Baseline by reason file
`npm run data:results` SHALL also write `results/<area>/baseline-intents.json`: per demand period, today's through cars an hour in total and by intent and the links each intent's cars used, at the stored results' seed and run length, with the network hash, demand hash and simulator fingerprint. A file whose inputs match SHALL be reused, and `--baselines-only` SHALL run only these baselines.

#### Scenario: Stale file
- **WHEN** the demand file changes
- **THEN** the app ignores the file until it is regenerated, and the Assumptions tab shows its cards without maps

### Requirement: The search measures the run the app makes
Every simulation the search makes SHALL start loaded and settled as the app's does and SHALL measure every figure over the run from t = 0. Published figures SHALL come from rechecks of 60 simulated minutes, and screening runs, which are the same run but shorter, SHALL NOT feed them. Each group's `computed` SHALL state the initial load, settle seconds, minutes, screening minutes, seeds and window.

#### Scenario: Equals a direct run
- **WHEN** the search's run of a scenario, period, seed and length is compared with a `Simulation` built and stepped as the app does
- **THEN** the cut-through rate and the per-link flow and through-car figures are equal

### Requirement: Speed hump candidates survive the link round trip
A speed hump candidate SHALL be at the link and position the link decoder returns for it, and every candidate of every type, written as a link and read back, SHALL give the same effective network.

#### Scenario: Block whose first link runs west
- **WHEN** a hump candidate is generated on a block whose first link runs west
- **THEN** reading its link gives an identical hump on the same links

### Requirement: Reference packages report the access check
A reference package SHALL be checked for stranded blocks like a search package, and the result SHALL be published on the package (`accessProblem`) and in the report. The package SHALL be published either way.

#### Scenario: Reference strands a block
- **WHEN** a reference package closes the only way into a dead-end street
- **THEN** it is rechecked and published with `accessProblem` naming the stranded block
