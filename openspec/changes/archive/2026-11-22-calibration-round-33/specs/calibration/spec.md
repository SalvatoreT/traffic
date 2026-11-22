## ADDED Requirements

### Requirement: Permissive left-turn validation cases
The validation suite SHALL include cases p1 to p3, a saturated left-only lane against 200, 400 and 600 veh/h of opposing flow, judged against the permitted-left method of [Fambro1991]: left turns only after the opposing queue clears, Drew's gap model, then sneakers. Each note SHALL give the value under `Config::queue_first_left`.

#### Scenario: Permissive left against heavy opposing flow
- **WHEN** the suite runs p3
- **THEN** the table shows the simulator's left turns, the band of the method and the queue-first value

### Requirement: Protected left-turn validation case
The validation suite SHALL include case b13, a one-lane all-left approach in an observed phase of its own (phasing without timing) against 500 veh/h opposing, judged against s x green share with s 1,500 to 2,000 veh/h [FHWA-SIG2004], with the permissive value in its note.

#### Scenario: Opposing flow does not matter
- **WHEN** the suite runs b13
- **THEN** the left turns discharge at a saturation flow over the green of their own phase

### Requirement: l1 shows the cited method
The note of case l1 SHALL give the left-limited approach capacity by the [Fambro1991] method and the queue-first value beside its range.

#### Scenario: Reading l1
- **WHEN** a reviewer reads l1
- **THEN** the note shows the range, the method's capacity and the queue-first value
