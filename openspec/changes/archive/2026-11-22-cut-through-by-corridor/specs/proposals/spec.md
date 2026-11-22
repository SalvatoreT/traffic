## MODIFIED Requirements

### Requirement: Baseline by reason file
`npm run data:results` SHALL also write `results/<area>/baseline-intents.json`: per demand period, today's through cars an hour in total and by intent and the links each intent's cars used, at the stored results' seed and run length, with the network hash, demand hash and simulator fingerprint. For an area that defines corridors it SHALL also store, per period, the same through cars by corridor, direction and intent, the cars that cross between the west and east bounding streets, and the number that use a second corridor, with the corridor definitions and a hash of their settings. The table SHALL come from a traced run at the same seed and run length, using the simulator's own intent for each car, and the run SHALL stop if the traced run's through cars by intent differ from the baseline's or if the flows do not add up to the total. A file whose inputs match SHALL be reused, the corridor table SHALL be recomputed when the corridor settings change, and `--baselines-only` SHALL run only these baselines.

#### Scenario: Stale file
- **WHEN** the demand file changes
- **THEN** the app ignores the file until it is regenerated, and the Assumptions tab shows its cards without maps

#### Scenario: Table adds up
- **WHEN** the corridor table is written for a period
- **THEN** its flows sum to the period's `totalVph` and each flow's reasons sum to the flow

#### Scenario: Settings change
- **WHEN** a corridor name or street list in the area config changes
- **THEN** the next run recomputes the corridor tables and leaves the rest of the file unchanged
