## ADDED Requirements

### Requirement: An assumed signal timing is labeled as an assumption
A `signalObservations` entry that the area config enters without a field source, such as a trial green for an approach nobody timed, SHALL state ASSUMPTION in its `source`. The importer SHALL treat it like an observed entry: it joins the timing of the same signal, periods and cycle, the simulator holds its green fixed, and the other phases share the rest of the cycle by flow ratio [Webster1958].

#### Scenario: Forest Street green beside the observed Colby Street green
- **WHEN** the config holds an observed Colby Street green of 4 s in a 79 s cycle and an assumed Forest Street green of 25 s in the same cycle and period, with `heading` selecting the eastbound approach
- **THEN** the node carries one timing with both greens, the eastbound Forest Street link holds 25 s, the opposite Forest Street link is not listed, and Claremont Avenue gets the rest of the cycle after the clearance intervals
