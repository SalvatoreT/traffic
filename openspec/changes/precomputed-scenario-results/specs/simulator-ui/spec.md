## ADDED Requirements

### Requirement: Stored result for a shared scenario
When the page opens with a scenario, or the scenario, period or demand changes, and a stored result exists for exactly that scenario, period and 100% demand whose network hash, demand hash and simulator fingerprint all match what the app has loaded, the app SHALL show that result's finished state at once instead of running. The result SHALL stop applying the moment the scenario, period or demand changes. "Run again" SHALL start a live simulation from zero.

#### Scenario: Link to a published proposal
- **WHEN** a user opens a link to a published proposal's scenario and period
- **THEN** the finished state shows within moments, without waiting for the simulation to build

#### Scenario: Changing period
- **WHEN** the user changes the period and a stored result exists for the new period
- **THEN** that period's stored result is shown

#### Scenario: Anything else changes
- **WHEN** the user changes the scenario or the demand level so that no stored result applies
- **THEN** the stored result stops showing at once and a live run starts as before

#### Scenario: Stored inputs differ
- **WHEN** a stored result's network hash, demand hash or simulator fingerprint differs from what the app has loaded, or the app runs on the mock engine
- **THEN** the result is ignored and the app runs live

### Requirement: What a stored result shows
A stored result SHALL show the clock at 1:00:00, Results marked as covering the full hour, the map layers and the "Why cars cut through" numbers filled from the stored values, and the play control reading "Run again". A visible note and the status region SHALL say that this is the stored result of the simulation and that Run again watches it. Cars and signals SHALL NOT be drawn.

#### Scenario: Run again
- **WHEN** the user chooses Run again on a stored result
- **THEN** the stored note goes away, the clock restarts from 0:00, cars are drawn, and running to the end gives the same headline numbers

### Requirement: Running to the end for a link without a stored result
When the page is opened from a link that carries a scenario (or a scenario is opened from the Proposals page) and no valid stored result exists, the app SHALL set the speed to Max and run to the end of the hour, saying "Running to the end of the hour", then show the finished state. Visitors' scenarios SHALL NOT be stored on a server. A link without a scenario SHALL behave as before: 20x and running.

#### Scenario: Link to an unpublished scenario
- **WHEN** a user opens a link whose scenario is not a published proposal
- **THEN** the run starts at Max, results are withheld while it runs, and the finished state appears at the end of the hour

#### Scenario: No scenario
- **WHEN** a user opens the site without a scenario
- **THEN** the simulation starts at 20x as before

### Requirement: Links name their period
A scenario link that carries interventions SHALL name its period. A link without a period SHALL open on the area's default period. Opening a proposal on the map SHALL set the proposal's period (the period of its picture, else the one in its link) and a demand level of 100%.

#### Scenario: Open on the map
- **WHEN** the user opens a proposal from the Proposals page
- **THEN** the map shows its stored result for the picture's period
