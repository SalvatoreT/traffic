## ADDED Requirements

### Requirement: Published intersection counts enter the fit as count stations
The demand build SHALL read peak-hour turning-movement counts of intersections from a data file that names, for every count, its source document, count date, location, the street and bearing of each leg and the volumes by approach and movement. Each leg SHALL become a station on the links that carry it toward and away from the intersection, with the volume entering and leaving, and each left or right turn at or above a configured volume SHALL become a movement constraint at a lower weight. A period without a count SHALL get no target, except that midday MAY take the PM count times the ratio of the period volume factors at reduced weight, labeled as an assumption. The fit report SHALL list every leg that could not be placed on the network.

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
