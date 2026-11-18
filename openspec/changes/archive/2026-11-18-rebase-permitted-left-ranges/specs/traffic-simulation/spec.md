## ADDED Requirements

### Requirement: Pocketed permissive-left approaches are validated against the permitted-left method
Validation cases b3, b4, b9 and l1 SHALL take their expected per-lane capacity from the smaller of the permitted-left capacity over the left share and s x green share over the through share [Fambro1991] [FHWA-SIG2004], using the parameter band of cases p1 to p3.

#### Scenario: Assumptions are labeled
- **WHEN** the case notes or the report text for these cases are read
- **THEN** the 0.8 lower factor and the 3-vehicle class-rule pocket are labeled ASSUMPTION, and the notes say the band is wide and would also have passed the earlier left-turn rule

#### Scenario: One lane, 20% left turns, pocket
- **WHEN** case b4 runs
- **THEN** it reports the mean of seeds 1 to 10, compared with the band computed from the case's own mean green share, and its text says so
