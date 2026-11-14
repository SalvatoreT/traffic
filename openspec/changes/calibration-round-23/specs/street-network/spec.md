## ADDED Requirements

### Requirement: An observation can name the approach it runs with
An observation of the area config MAY give `runsWithHeading`, the compass direction of travel of another approach of the same street at the same signal. The importer SHALL list that approach's incoming links as `runsWith` in the approach's green, and SHALL warn about an observation whose partner matches no link.

#### Scenario: Partner found
- **WHEN** two observations of one street at a signal have headings 80 and 260 and the first gives `runsWithHeading` 260
- **THEN** the first approach's green lists the links of the second as `runsWith`

#### Scenario: No partner
- **WHEN** no incoming link of the street travels in the named direction
- **THEN** the observation is reported as not applied
