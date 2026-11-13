## ADDED Requirements

### Requirement: Published intersection counts enter the fit as count stations
The demand build SHALL read peak-hour turning-movement counts of intersections from a data file that names each count's source, date, location, legs and volumes by approach and movement. Each leg SHALL become a station for the volume entering and one for the volume leaving, and each left or right turn at or above a configured volume SHALL become a movement constraint at a lower weight. A period without a count SHALL get no target.

#### Scenario: A counted intersection
- **WHEN** the file holds the PM approach volumes of a four-leg intersection inside the model
- **THEN** the fit has an entering and a leaving station for each leg and a movement constraint for each turn of at least the configured volume

#### Scenario: A leg that is not in the network
- **WHEN** no link of the leg's street ends within the configured distance of the count's location on the leg's bearing
- **THEN** that leg's volume is not used and the fit report says so

### Requirement: A counted hour on a ramp replaces its ADT times K
Where a leg of a counted intersection is a freeway ramp that also has a published ADT, the station from the count SHALL replace the station from the ADT times the assumed peak-hour factor, with the ramp weight, and the fit report SHALL state both values. In a period the count does not cover, the ramp SHALL keep its ADT-based target scaled by the ratio of the count to the ADT-based value in the PM peak, labeled as an assumption.

#### Scenario: Off-ramp with a count
- **WHEN** an off-ramp has an ADT-based PM target of 1,278 veh/h and a counted PM peak hour of 1,024
- **THEN** the fit targets 1,024 on the ramp link and the report notes the replaced value

### Requirement: A census block loads the junctions around it
The demand build SHALL assign the resident workers and jobs of a census block in equal parts to every non-gate node on a residential street within a configured distance of the block's centroid, and to the nearest such node when none is that close. The distance is an assumption.

#### Scenario: Block between four corners
- **WHEN** four residential-street junctions lie within the distance of a block's centroid
- **THEN** each takes a quarter of the block's trip ends

### Requirement: Fit report within the file size limit
The fit report SHALL write the station tables of each period to a file of their own and point to them from the main report.

#### Scenario: Three periods
- **WHEN** the build writes the fit report for three periods
- **THEN** there are three station files and the main report names them

