## MODIFIED Requirements

### Requirement: Search for low-harm packages
The project SHALL provide a search that evaluates sets of interventions in the simulation and returns packages that reduce cut-through traffic on streets inside the study area, measured as through vehicles per hour, while limiting the largest traffic increase on any single inside street block. The proposals file SHALL report each package's cut-through as baseline and scenario vehicles per hour and the percent change, and SHALL be versioned so that readers can tell files that report a distance from files that report a count.

#### Scenario: Running the search
- **WHEN** a contributor runs the search for an area
- **THEN** it writes a proposals file whose packages were each rechecked over the full hour, every searched period and several seeds, with cut-through in vehicles per hour

#### Scenario: A package that moves traffic next door
- **WHEN** a candidate package removes cut-through from one block by adding a large amount to another inside block
- **THEN** its harm reflects that worst block and it ranks below packages with the same reduction and less harm

#### Scenario: A package that only shortens through trips
- **WHEN** a package changes how far through vehicles drive on local streets but not how many of them use those streets
- **THEN** its reduction is zero
