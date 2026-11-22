## ADDED Requirements

### Requirement: Safety summaries preserve endpoints and exposure
Every safety summary SHALL keep pedestrian AIS4+ and cyclist MAIS3+ scores separate, state their endpoint and denominator, and identify unavailable or unsupported samples [Tefft2013, Lubbe2022]. It SHALL NOT add these means into a combined injury-risk score. Generated prose and headless result descriptions SHALL use the same meanings as the UI. Legacy scores SHALL be explicitly identified or recomputed when the safety contract changes.

#### Scenario: Modes change in different directions
- **WHEN** the pedestrian mean rises and the cyclist mean falls
- **THEN** the summary reports each mode's change with its own endpoint and support
- **AND** no arithmetic sum hides either change behind one combined verdict

#### Scenario: Equal means with different exposure
- **WHEN** baseline and scenario have equal mean severity but different encounter counts
- **THEN** both mean and count are visible
- **AND** the summary does not imply that equal per-encounter severity establishes equal total harm

#### Scenario: Stored safety result has an old meaning
- **WHEN** a stored result predates the current severity input or endpoint contract
- **THEN** the application rejects it for current safety comparisons or explicitly identifies its legacy meaning
- **AND** it does not relabel the old value as a newly defined measure
