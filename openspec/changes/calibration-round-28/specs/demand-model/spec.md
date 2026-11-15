## MODIFIED Requirements

### Requirement: Derived targets are marked
A count station whose target in a period is another period's count times a factor SHALL list that period in `derived` in the station file. This covers the AM and midday targets of ADT-based and gate stations, of ramps with no count in the period, and of turning-count legs counted in the PM only.

#### Scenario: Midday
- **WHEN** a station's midday target is its PM count times the period ratio
- **THEN** the station lists `midday` as derived

#### Scenario: Turning-count leg counted in the PM only
- **WHEN** an Oakland turning-movement count gives one PM hour and the AM and midday leg targets are that count times the period factors
- **THEN** the station lists `am_peak` and `midday` as derived and the station rule does not judge them
