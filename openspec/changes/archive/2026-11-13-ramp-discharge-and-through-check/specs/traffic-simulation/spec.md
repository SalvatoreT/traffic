## ADDED Requirements

### Requirement: A crossing vehicle does not reserve exit-lane room
A vehicle that begins to cross a node SHALL NOT add its length to the room that the next vehicle sees on the exit lane. A vehicle SHALL begin to cross only when the lane has room in front of its tail vehicle, with the leader's motion over `NODE_CROSS_S` credited, and a vehicle that finds no physical room on emerging SHALL stay in the node until there is.

#### Scenario: A left turn into a short single-lane link
- **WHEN** a saturated left-turn lane discharges during a protected green into a single-lane link of 32 m
- **THEN** vehicles begin to cross about every 2 to 3 s while the link is free, instead of every 3 to 4 s
