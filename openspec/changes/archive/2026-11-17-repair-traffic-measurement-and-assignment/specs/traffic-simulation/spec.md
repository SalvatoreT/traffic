## MODIFIED Requirements

### Requirement: Local trips start and end along the block
A locally starting or ending car SHALL use the same physical curb location for the same request across scenarios. A legal baseline route SHALL identify its curb blocks when the demand provides only nodes. A gate or a block shorter than 20 m SHALL retain its junction endpoint. Drivers SHALL obey the scenario's movement and access restrictions and the existing insertion gaps [Treiber2000].

#### Scenario: Filter at the origin junction
- **WHEN** an origin junction is filtered and a legal route still serves the requested curb
- **THEN** a local driver can enter from the curb without crossing the filtered junction

#### Scenario: Gate trips
- **WHEN** a trip starts at a gate
- **THEN** it enters at the start of its first link and its gate endpoint stays fixed across scenarios

#### Scenario: A filter changes the route
- **WHEN** the ordinary approach to a local address is closed
- **THEN** the car may reach that address on another legal approach and an inaccessible address yields an unserved request

## ADDED Requirements

### Requirement: Physical movements and routing costs
A stop-line detector SHALL count a vehicle passing that line. A marked left-turn lane SHALL retain its permitted movement under a change of control. Signal splits SHALL honor observed phase minima and the feasible generic minimum during adaptation. Every router SHALL charge the approach and its outgoing turn together and the final link once.

#### Scenario: Parking before the signal
- **WHEN** a trip finishes before the end of the approach link
- **THEN** it records link use without a stop-line passage

#### Scenario: No perceived cost dispersion
- **WHEN** forward and reverse routing minimize the same costs with no noise
- **THEN** they agree on the minimum cost even when movement adjustments are negative
