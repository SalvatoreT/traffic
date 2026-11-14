## ADDED Requirements

### Requirement: Station results are reported by source and count year
The demand fit report and the assessment SHALL list, for each period, the number of stations below GEH 5 per source and count year, fitted and held out, and SHALL state the station rule (more than 85% below GEH 5) for all sources and, separately, for sources counted within `recentYears` of the reference year. The rule SHALL NOT be redefined; whether it applies to recent sources only is the owner's decision.

#### Scenario: Recent sources
- **WHEN** a period's stations are scored
- **THEN** the report gives the pass counts for all stations and for the stations of age at most `recentYears`, fitted and held out
