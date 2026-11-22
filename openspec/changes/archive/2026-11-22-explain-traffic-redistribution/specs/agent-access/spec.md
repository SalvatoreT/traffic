## ADDED Requirements

### Requirement: Agents can run redistribution diagnostics locally
The local CLI SHALL accept intervention/cohort selectors and baseline, closure-only, and package variants. Its machine-readable export SHALL preserve the UI's versioned evidence contract and full provenance, coverage, effects, uncertainty, and health. It SHALL run without a web server or upload write. Invalid selectors or incompatible evidence SHALL produce actionable errors or explicit unavailable states.

#### Scenario: Reproducing a neighborhood detour question
- **WHEN** an agent supplies a valid Colby/North selection, package link, period, and seed schedule to the local CLI
- **THEN** it can export the legal bypass check and requested scenario comparisons with enough provenance and coverage information for the UI or another agent to interpret the result

#### Scenario: Inputs do not match a stored diagnostic
- **WHEN** network, demand, simulator, settings, or diagnostic versions differ from stored evidence
- **THEN** the CLI rejects incompatible reuse or marks the missing comparison unavailable rather than attaching a stale route explanation to fresh aggregate flows
