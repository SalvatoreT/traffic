## MODIFIED Requirements

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
