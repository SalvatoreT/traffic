## ADDED Requirements

### Requirement: Search for low-harm packages
The project SHALL provide a search that evaluates sets of interventions in the simulation and returns packages that reduce cut-through traffic on streets inside the study area while limiting the largest traffic increase on any single inside street block.

#### Scenario: Running the search
- **WHEN** a contributor runs the search for an area
- **THEN** it writes a proposals file whose packages were each rechecked over the full hour, every searched period and several seeds

#### Scenario: A package that moves traffic next door
- **WHEN** a candidate package removes cut-through from one block by adding a large amount to another inside block
- **THEN** its harm reflects that worst block and it ranks below packages with the same reduction and less harm

### Requirement: Allowed contents
A proposal SHALL use only interventions the app offers, SHALL NOT add a traffic signal, and SHALL leave every block inside the study area reachable by car from outside in both directions.

#### Scenario: Stranded block
- **WHEN** a candidate package leaves a block with no way in or out by car
- **THEN** the package is rejected

### Requirement: Published with provenance
The proposals file SHALL record the network and demand it was computed on, the periods and seeds used, the date and the baseline's calibration status.

#### Scenario: Baseline changes
- **WHEN** the published network or demand differs from the one recorded in the proposals file
- **THEN** the proposals are treated as out of date
