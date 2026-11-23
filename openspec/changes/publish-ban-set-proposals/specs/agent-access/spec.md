## MODIFIED Requirements

### Requirement: Search options for objectives
`explore` SHALL accept `--objectives` (`all` or a list of `most-removed`, `no-closures`, `least-detour`, `fewest-changes`, `no-turn-bans`, `most-removed-no-turn-bans`), and SHALL write each option's objectives and residents' detour into the proposals file and the report. It SHALL NOT accept a detour weight.

#### Scenario: One objective
- **WHEN** `explore` runs with `--objectives most-removed`
- **THEN** only the main beam runs and options carry only that tag when they win it
