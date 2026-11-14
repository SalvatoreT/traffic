## ADDED Requirements

### Requirement: Precomputed results for published proposals
A tool SHALL compute, for every published proposal in every group and each demand period, the finished hour of the scenario beside the baseline, with the simulator build the app runs, the app's seed, 100% demand and 60 simulated minutes. It SHALL write one file per distinct (scenario, period) to `public/data/results/<area>/<key>.json`, keyed by a hash of the order-independent scenario and the period, plus an index, and SHALL NOT write the proposals file.

#### Scenario: Shared scenario
- **WHEN** two proposals have the same interventions
- **THEN** they share one file per period

#### Scenario: Equals a fresh run
- **WHEN** a stored result is compared with a fresh run of the same scenario, period and seed
- **THEN** the link stats and metrics are equal

### Requirement: Contents and validity of a stored result
Each file SHALL hold both runs' metrics, per-link stats and per-intent link usage, and record the network hash, the demand hash and the simulator fingerprint. The tool SHALL reuse a file whose three inputs still match. Files SHALL be published with the other generated data and served under `/data/`.

#### Scenario: Inputs changed
- **WHEN** the network, the demand or the simulator's sources change
- **THEN** the next run of the tool recomputes the affected files and drops files for scenarios that are no longer published
