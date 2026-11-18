## ADDED Requirements

### Requirement: Permissive left turns at a signal wait for the opposing queue
A left-turner at a signal with no green arrow SHALL turn only once the opposing queue has cleared, then in gaps of the opposing stream or as one of at most two sneakers in the change interval [Fambro1991] [FHWA-STM2008]. A conflicting car below its desired speed SHALL count as arriving after speeding up at its own acceleration, the critical gap SHALL be 4.5 s [Fambro1991], and the left-turner SHALL get neither the courtesy wait nor the yield fallback.

#### Scenario: Opposing queue at the start of green
- **WHEN** the opposing approach has a standing queue as its green starts
- **THEN** left-turners wait until it has cleared and turn in gaps or in the change interval, and validation cases p1 to p3 fall within the range of the [Fambro1991] method

### Requirement: The earlier permissive-left rule stays available for comparison
`Config::queue_first_left` SHALL default to the queue-first rule. `Some(false)` (`calibrate --no-queue-first-left`) SHALL restore the rule used before this change, and the run manifest SHALL record which rule ran.

#### Scenario: Earlier rule for comparison
- **WHEN** a run sets `queue_first_left` to false
- **THEN** permissive left-turners take the courtesy wait and the yield fallback and estimate a starting opposing car's arrival as before this change

### Requirement: A trip waiting at a gate waits only behind trips for the same branch
Trips waiting at a gate SHALL enter in order per first link and, where the first link forks into straight-ahead branches with lanes of their own, per branch. A trip SHALL NOT pass another waiting trip with the same first link and branch. A gate SHALL examine at most 512 waiting trips per step (ASSUMPTION); a trip whose route is already planned and whose first link and branch are blocked in that step SHALL be passed over without counting toward that limit.

#### Scenario: One branch queued back to the gate
- **WHEN** one branch of a forking first link is queued back to the gate and the other is free
- **THEN** trips for the free branch enter at the rate they would with the other branch unqueued (validation case h4)

## MODIFIED Requirements

### Requirement: Yielding is bounded and ignores vehicles that cannot come
A driver SHALL NOT wait for a conflicting lane whose head stands at the stop line with no room to leave. After the courtesy wait (45 s, ASSUMPTION) a driver SHALL enter ahead of conflicting vehicles that move slower than queue speed, and a driver yielding to a waiting pedestrian SHALL move on. A conflicting stream at speed SHALL be given a real gap until the fallback wait (90 s, ASSUMPTION). Toward conflicting vehicles, a permissive left-turner at a signal SHALL get neither the courtesy wait nor the fallback: it turns after the opposing queue, in a gap or in the change interval.

#### Scenario: Blocked major-street lane
- **WHEN** the head of a major-street lane stands at the line because its exit is full
- **THEN** a minor-street driver whose own exit has room crosses without waiting for it

#### Scenario: Heavy cross flow at speed
- **WHEN** a minor through movement or left turn faces 1,000 veh/h per direction on the major street
- **THEN** its capacity is within the range of the gap-acceptance formula [Brilon1999] (validation cases e6 and e9)

#### Scenario: Permissive left after a long wait at a signal
- **WHEN** a permissive left-turner at a signal has waited more than 45 s and the opposing queue is still moving off
- **THEN** it does not cut in ahead of the opposing queue
