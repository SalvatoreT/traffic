## MODIFIED Requirements

### Requirement: A flow can make a given movement
A demand flow MAY carry `via`, a movement given as the ids of an entry link and an exit link, with an optional `maxDetour` (a ratio, default 1.3, ASSUMPTION) and an optional ordered list of `alternatives`, each an entry link and an exit link (ASSUMPTION: movements of the same turn family on parallel streets). A trip of such a flow SHALL be routed to the entry link, through the movement, and on to its destination, and every re-plan before the movement is made SHALL keep it, while the movement counts. A movement counts only when it is open, its route costs at most `maxDetour` times the plain route to the destination in the current network, and the route visits no node twice. The primary movement SHALL be taken when it counts, else the cheapest alternative that counts, else the trip SHALL take its plain route. The check SHALL run when the trip starts and at each re-plan before the movement is made. A demand file without `via` SHALL give the same results as before.

#### Scenario: Counted left turn
- **WHEN** a flow of 5 veh/h carries a via movement from the southbound approach of one street to a left turn onto the cross street
- **THEN** its trips take that left turn

#### Scenario: Closed exit
- **WHEN** an intervention closes the exit link of the movement
- **THEN** the trips of the flow take their plain routes unless an alternative counts

#### Scenario: Detour beyond the tolerance
- **WHEN** an intervention makes the route through the movement cost more than `maxDetour` times the plain route
- **THEN** the trips skip the movement and take an alternative that counts or their plain routes

#### Scenario: Blocked primary, open alternative
- **WHEN** the primary movement is banned and an alternative counts
- **THEN** every trip of the flow makes the alternative and none makes the primary

#### Scenario: Loop
- **WHEN** reaching the movement would pass a node twice
- **THEN** the movement does not count
