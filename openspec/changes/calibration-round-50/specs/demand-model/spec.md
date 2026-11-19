## ADDED Requirements

### Requirement: The ceilings can cover every node
The `countFit.gatePriorTotals` entry SHALL accept an optional `scope`, `gates` or `allNodes`. Absent or `gates`, the build SHALL behave as before. With `allNodes`, the count fit SHALL add a one-sided ceiling station, anchored on the static fit as for gates, for every node direction with trips in the period, gate or not, that no station of kind `gate` in the fit counts.

#### Scenario: Scope absent
- **WHEN** the entry has no `scope`
- **THEN** only gate directions get ceiling stations and the flows equal those of a build with `scope` set to `gates`

#### Scenario: Scope allNodes
- **WHEN** the entry has `scope` `allNodes`, the period takes simulated membership and a non-gate node is the origin of car flows
- **THEN** that node's origin direction has a ceiling at its static-fit total and its final total is at most 0.1% above it

#### Scenario: Through demand cannot become local demand
- **WHEN** simulated pairs at a counted station would raise the flows of a non-gate origin above its static-fit total
- **THEN** the final total of that origin does not exceed the static-fit total, where with `scope` `gates` it can

#### Scenario: Zero total
- **WHEN** a node direction has a static-fit total of 0
- **THEN** it has no ceiling station

#### Scenario: Unknown scope
- **WHEN** the entry has a `scope` other than `gates` or `allNodes`
- **THEN** the build stops with an error naming the entry

### Requirement: The fit report splits the ceilings by kind and shows where trip ends go
With the entry present, the fit report SHALL state per period the ceiling stations of gates and of non-gate nodes separately (stations, number above ceiling, excess, volume removed by the projection), and the car trip ends at non-gate nodes inside and outside the study area, as origins and as destinations, in the static fit and in the final fit. The existing per-period ceiling line SHALL keep its format.

#### Scenario: Report lines
- **WHEN** a build runs with the entry present and simulated membership
- **THEN** the report has, per period, a line "Ceiling stations by kind" with the gate and non-gate counts and a line "Non-gate node trip ends" with the four static-to-final pairs

### Requirement: The loop reports offered demand against the static fit and warns when it falls far below
The membership loop SHALL read the kind, flow-type and trip-end lines of the report and print them with each build, together with the offered car demand of the build as a percentage of the static fit's. After a final build, if the offered car demand of any view and period is more than 10% below the static fit's, it SHALL print a warning that tells the runner to stop and report. The 10% threshold is an assumption written before any run. The loop SHALL NOT stop on it.

#### Scenario: Final build far below the static fit
- **WHEN** the final build of a view offers 11% less car demand than its static fit in a period
- **THEN** the loop prints a warning naming the view, period and shortfall, and finishes

#### Scenario: Round 49 report
- **WHEN** a fit report has only the round 49 ceiling line
- **THEN** the loop reads it as before and prints no kind or trip-end lines
