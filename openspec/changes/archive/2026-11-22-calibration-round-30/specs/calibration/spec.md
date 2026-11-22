## ADDED Requirements

### Requirement: Route costs of through trips can be written for diagnosis
The calibration command SHALL accept `--od-costs PATH` (with optional `--od-links` naming extra links) and write every completed through trip that uses a counted select-link block or a named link, with its origin and destination groups and its times. Trip records and timings SHALL be matched by trip id.

#### Scenario: Who are the through cars on a block
- **WHEN** a contributor runs `calibrate --seed 1 --od-costs out.json --od-links 2622,2697`
- **THEN** `out.json` lists each through trip on the counted blocks and on links 2622 and 2697 with its groups and times

### Requirement: The diagnostic costs the driven and the arterial route by term
For each trip the diagnostic SHALL cost the surface part of the route it drove and the cheapest route avoiding the study area's residential and service streets, on the router's costs at departure, each split into measured time, traversal, turn penalty, control constant and local-street weight. It SHALL also give the cheapest unrestricted route at entry and whether the trip drove it.

#### Scenario: A trip on a costlier route
- **WHEN** a trip drove a side-street route whose cost at departure exceeds the router's best route
- **THEN** its entry shows both costs by term, the links where measured time exceeds free-flow time by more than 5 s, and that it did not drive the best route

### Requirement: The delay-feedback loop does not select on held-out stations
`tools/cost-loop.ts` SHALL decide whether to keep an iteration from removals, backlog, the headline-share error and the fitted station GEH shares only. It SHALL report the held-out GEH shares in its table without using them in the decision.

#### Scenario: An iteration that only helps held-out stations
- **WHEN** an iteration raises the held-out GEH share but fails the rule on removals
- **THEN** the loop does not keep it, and the held-out share appears only as a reported column
