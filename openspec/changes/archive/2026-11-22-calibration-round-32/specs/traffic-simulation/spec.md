## ADDED Requirements

### Requirement: Lane changes along a link are safe
A car SHALL be able to move to an adjacent lane of the link it is on, and only when the new follower's acceleration after the change is at least -4 m/s^2 (MOBIL safety criterion [Kesting2007]) and the changer keeps at least `LC_MIN_GAP_M` (ASSUMPTION) to its new leader and follower. A driver SHALL wait 3 s (ASSUMPTION) between two changes. `Config::lane_changes` false keeps every car in the lane it entered by.

#### Scenario: Off
- **WHEN** `lane_changes` is false
- **THEN** every run is identical to the simulator without lane changes along a link

#### Scenario: Obstruction in one lane
- **WHEN** a standing vehicle blocks the left lane of a two-lane link that carries less than one lane's capacity
- **THEN** the flow past it is within 10% of the offered flow (validation case l2)

### Requirement: Discretionary lane changes follow the MOBIL incentive
A car SHALL make a lane change it does not need for its next movement only when its acceleration gain plus the politeness factor times the gains of its new and old followers exceeds 0.2 m/s^2 [Kesting2007], and only to a lane on the side of the road it sorts for. The politeness factor 0.2 (within the source's 0 to 0.5) and the check once a second are ASSUMPTIONS.

#### Scenario: Through driver behind a waiting left-turner
- **WHEN** a left-turner that did not fit in the pocket waits at the stop line in the inner lane and the outer lane has room
- **THEN** through drivers behind it move to the outer lane when the gap there is safe

### Requirement: Forced lane changes toward the next movement
A car whose lane cannot serve its next movement, or a left-turner at the entrance of a left-turn pocket with room, SHALL change toward a lane that serves it whenever the safety rule holds. ASSUMPTION: the source's bias for forced changes has no value, so the bias is taken larger than any acceleration difference.

#### Scenario: Left-turner reaches a pocket with room
- **WHEN** a left-turner in the inner lane reaches the pocket entrance and the pocket holds fewer than its three vehicles
- **THEN** it moves into the pocket if the safety rule allows

### Requirement: Closely spaced signals run one cycle
Two signals joined by at most `COORD_MAX_M` (120 m, ASSUMPTION) of road, a single link or links that go straight on through uncontrolled nodes, SHALL run one cycle, the longest of the group's own cycles [FHWA-STM2008] 6.3.1, 6.6.2. `Config::coord_max_m` 0 turns this off.

#### Scenario: Signals 200 m apart
- **WHEN** two signals are 200 m apart
- **THEN** each keeps its own cycle and offset

### Requirement: Closely spaced signals are offset by travel time
In the direction with the larger approach flow, the downstream signal's green for the joining road SHALL start one free-flow travel time of that road after the upstream green of the approach that feeds it straight on [FHWA-STM2008] 6.6.4. At every adaptation the group's new plans SHALL take the common cycle and these offsets, each starting no earlier than the end of the signal's running cycle.

#### Scenario: SR-24 interchange on Telegraph Ave
- **WHEN** southbound carries more than northbound through the signals at Aileen St, 56th St and 55th St, 87 to 94 m apart
- **THEN** the southbound greens start in turn, each one travel time after the one upstream
