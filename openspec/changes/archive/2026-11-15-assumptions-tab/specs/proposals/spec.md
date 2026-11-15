## ADDED Requirements

### Requirement: Baseline by reason file
`npm run data:results` SHALL also write `results/<area>/baseline-intents.json`: per demand period, today's through cars an hour in total and by intent and the links each intent's cars used, at the stored results' seed and run length, with the network hash, demand hash and simulator fingerprint. A file whose inputs match SHALL be reused, and `--baselines-only` SHALL run only these baselines.

#### Scenario: Stale file
- **WHEN** the demand file changes
- **THEN** the app ignores the file until it is regenerated, and the Assumptions tab shows its cards without maps
