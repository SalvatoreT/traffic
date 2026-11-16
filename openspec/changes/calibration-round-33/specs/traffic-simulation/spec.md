## ADDED Requirements

### Requirement: An observed phase can come without timing
An observed signal timing MAY give the phasing alone: an approach in a phase of its own with no cycle and no green (both 0). The plan SHALL keep that phase structure and take its cycle and greens from the flows by Webster's method [Webster1958]. The area config SHALL accept such an observation only with `ownPhase` and with both `cycleSeconds` and `greenSeconds` left out.

#### Scenario: Protected left seen in the field
- **WHEN** a field observation says an approach has a left-turn arrow and no timing sheet exists
- **THEN** the approach runs in a phase of its own, its left turns meet no opposing flow, and the cycle stays within 75 to 120 s

### Requirement: Queue-first permissive left turns as an option
`Config::queue_first_left` SHALL switch permissive left turns at a signal to the queue-first gap model of [Fambro1991]. Off by default, every run SHALL be identical to the simulator without the option. `calibrate --queue-first-left` SHALL set it and record it in the run manifest.

#### Scenario: Default
- **WHEN** `queue_first_left` is not set
- **THEN** the run is identical to the round 32 simulator on the same inputs

### Requirement: Queue-first left turns yield to a starting opposing queue
Under `queue_first_left`, a conflicting car below its desired speed SHALL count as arriving after speeding up at its acceleration from its current speed, the critical gap of a permissive left at a signal SHALL be 4.5 s [Fambro1991], and the left-turner SHALL get neither the courtesy wait nor the yield fallback.

#### Scenario: Opposing queue at the start of green
- **WHEN** the opposing approach has a standing queue as its green starts
- **THEN** left-turners wait until the queue has cleared and then turn in gaps or as sneakers in the change interval (validation cases p1 to p3 report the value)
