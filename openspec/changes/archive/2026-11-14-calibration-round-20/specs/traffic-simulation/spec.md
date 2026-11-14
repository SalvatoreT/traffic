## ADDED Requirements

### Requirement: A flow can make a given movement
A demand flow MAY carry `via`, a movement given as the ids of an entry link and an exit link. A trip of such a flow SHALL be routed to the entry link, through the movement, and on to its destination, and every re-plan before the movement is made SHALL keep it. The trip SHALL fall back to its plain route when the movement is not usable (closed link, banned movement, entry link unreachable), and a demand file without `via` SHALL give the same results as before.

#### Scenario: Counted left turn
- **WHEN** a flow of 5 veh/h carries a via movement from the southbound approach of one street to a left turn onto the cross street
- **THEN** its trips take that left turn

#### Scenario: Closed exit
- **WHEN** an intervention closes the exit link of the movement
- **THEN** the trips of the flow take their plain routes
