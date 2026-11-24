## ADDED Requirements

### Requirement: The search can cap the turn bans in a package
The search SHALL accept `--max-turn-bans N`. A package's turn bans SHALL be counted as the individual bans it holds: each ban set counts its size, each single turn ban counts 1. With the cap, a ban set with more than N bans SHALL NOT be a candidate and SHALL be reported as dropped with the reason, and the search SHALL NOT simulate, keep or publish a package that holds more than N. Without the flag the candidates, the search and every output SHALL be those of a search before this requirement.

#### Scenario: A set over the cap
- **WHEN** the search runs with `--ban-sets --max-turn-bans 5`
- **THEN** a set of 21 bans is not a candidate, the dropped list names it with "over the turn-ban cap", and no option in the list holds more than 5 individual turn bans

#### Scenario: A package of two sets
- **WHEN** the beam extends a package that holds a 3-ban set with another set of 3 bans under a cap of 5
- **THEN** the package is rejected before any simulation and is not counted among the evaluations

#### Scenario: No cap
- **WHEN** the search runs without `--max-turn-bans`
- **THEN** the candidate list, the options and the proposals file equal those of the same search before this requirement, and the file has no `turnBanCap` record

### Requirement: Known packages over the cap are skipped
With a cap, a known package, a hand-added seed or a warm-start package that holds more turn bans than the cap SHALL be skipped, not rechecked. The reason SHALL be logged, listed in the report and counted in `computed.knownPackages.droppedBy`.

#### Scenario: A 41-ban seed
- **WHEN** the seeds file holds a package of a 41-ban set and a filter, and the cap is 5
- **THEN** the search logs it as not used because it is over the turn-ban cap, and recheck costs nothing

### Requirement: The candidate pool under the cap
With a cap and `--ban-sets`, the search SHALL add the sets `top-2` to `top-N`, each made of the k highest-ranked single turn-ban candidates in the candidate order. The sets SHALL come from that ranking only, and SHALL pass the access check and be distinct from the other sets.

#### Scenario: Top sets
- **WHEN** the search runs with a cap of 5 and has ten single turn-ban candidates
- **THEN** the candidates include `top-2`, `top-3`, `top-4` and `top-5`, each holding the first k single candidates

### Requirement: The cap is recorded
The proposals file's `computed` block SHALL record the cap in `turnBanCap` (`max`, the rule with its label as an assumption, the sets dropped for it and the known packages skipped), and the report SHALL state it where it describes the search. A file written without a cap SHALL have neither.

#### Scenario: Recorded
- **WHEN** a search with a cap of 5 finishes
- **THEN** `computed.turnBanCap.max` is 5 and the report's Search section says a package holds at most 5 individual turn bans and that the cap is an assumption of the project lead
