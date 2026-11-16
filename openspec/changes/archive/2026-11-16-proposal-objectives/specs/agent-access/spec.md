## ADDED Requirements

### Requirement: Search options for objectives
`explore` SHALL accept `--objectives` (`all` or a list of `most-removed`, `no-closures`, `least-detour`, `fewest-changes`) and `--detour-weight`, and SHALL write each option's objectives and residents' detour into the proposals file and the report.

#### Scenario: One objective
- **WHEN** `explore` runs with `--objectives most-removed`
- **THEN** only the main beam runs and options carry only that tag when they win it
