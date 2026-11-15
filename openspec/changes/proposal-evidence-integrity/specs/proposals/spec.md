## MODIFIED Requirements

### Requirement: Published with provenance
The proposals file SHALL record, for each group, the network and demand hashes, simulator fingerprint, reporting-method version, effective run settings, periods, seeds, date, source revision, and baseline calibration status. Readers SHALL distinguish current, stale, and unverified evidence. Missing required provenance SHALL be unverified, and a mismatch in simulation or reporting inputs SHALL make the figures stale. Evidence from different simulator versions SHALL NOT be combined into one current package result.

#### Scenario: Group provenance
- **WHEN** a proposals file holds more than one group
- **THEN** each group records the provenance of its own results

#### Scenario: Baseline changes
- **WHEN** the published network or demand differs from the one recorded in the proposals file
- **THEN** the proposals are treated as out of date

#### Scenario: Simulator changes with identical data
- **WHEN** network and demand hashes match but the simulator fingerprint differs
- **THEN** proposal figures and pictures are treated as stale

#### Scenario: Older group lacks a simulator identity
- **WHEN** a group has no simulator fingerprint
- **THEN** readers mark its evidence unverified and do not assign the current engine's fingerprint to it

#### Scenario: Reporting method changes
- **WHEN** the published uncertainty or reporting method version is incompatible with the reader's current contract
- **THEN** the figures are identified as using an older method and are not presented as current evidence under the new method

### Requirement: Annotating an existing file
`explore --annotate` SHALL check every group's network and demand hashes, simulator fingerprint, compatible reporting-method version, and effective run settings before re-simulating pictures. It SHALL reject missing or incompatible provenance before writing any part of the file. For compatible groups it SHALL run only the stored picture period, seeds, and run length, update the pictures, and preserve the numeric figures and their provenance. Its arrays SHALL equal those the search writes for those same inputs.

#### Scenario: Matching inputs
- **WHEN** a file is annotated with all required provenance matching
- **THEN** each package gains a picture identical to what the search wrote for the same inputs

#### Scenario: Other inputs
- **WHEN** a group's network or demand hash differs from the current inputs
- **THEN** the command stops with a message naming the group and leaves the file unchanged

#### Scenario: Code-only model change
- **WHEN** network and demand are unchanged but a group's simulator fingerprint differs
- **THEN** annotation stops, names the incompatible group, and leaves the file unchanged

#### Scenario: Legacy provenance
- **WHEN** a group's required provenance is missing
- **THEN** annotation requires a full result recomputation instead of adding current-engine pictures to the old figures

## ADDED Requirements

### Requirement: Paired uncertainty in proposal comparisons
Final proposal comparisons SHALL retain baseline and scenario runs by period and seed and compute effects from matched pairs. Uncertainty SHALL describe the effect, option difference, and period aggregation reported, with an explicit method, sample count, interval level, seed schedule, precision rule, and unresolved status [WebTAG-M3.1; TfL-TMG4].

#### Scenario: Practical screening floor
- **WHEN** a screening rule uses a minimum change threshold
- **THEN** the output labels that assumption separately from sampling uncertainty

#### Scenario: Scope of an interval
- **WHEN** uncertainty is computed from seeds under fixed model inputs
- **THEN** the output states that it covers seed variability and does not cover calibration error or real-world demand uncertainty

#### Scenario: Equal means with different scenario spread
- **WHEN** two comparisons have the same baseline and mean effect but different paired differences across seeds
- **THEN** their uncertainty summaries reflect those differences and do not depend only on baseline spread

#### Scenario: Comparing options
- **WHEN** the output says one package's effect differs from another package's effect
- **THEN** it reports a comparison using their matching seed results and identifies an unresolved difference as unresolved

#### Scenario: Missing or insufficient pairs
- **WHEN** paired runs are missing or the sample is insufficient for the documented uncertainty method
- **THEN** the comparison reports insufficient evidence and does not substitute a zero variance estimate

#### Scenario: Several periods
- **WHEN** the headline aggregates periods
- **THEN** uncertainty is computed for that same aggregate with its declared weighting and pairing, rather than averaging unrelated baseline coefficients of variation

### Requirement: Confirmation is distinguishable from selection
The output SHALL state whether reported runs participated in selecting the published options. A claim of independent confirmation SHALL require a frozen shortlist and a recorded seed schedule excluded from candidate discovery and selection. Results without that separation SHALL be identified as exploratory estimates.

#### Scenario: Finalist rechecks choose the published options
- **WHEN** the same runs both choose an option and estimate its effect
- **THEN** the published estimate is labeled exploratory and does not claim independent confirmation

#### Scenario: Independent confirmation
- **WHEN** a frozen shortlist is evaluated on previously unused seeds
- **THEN** the output records the shortlist, confirmation seeds, precision rule, and every evaluated outcome

### Requirement: Raw maxima and adjusted penalties have distinct meanings
The proposal file SHALL identify the block with the largest raw mean increase and its before/after values, for through traffic across the stated periods and all traffic within each period. Any adjusted-penalty block and value SHALL be separate. "The block that gains the most" SHALL refer to the raw maximum. Unresolved estimates SHALL remain visible with their uncertainty status.

#### Scenario: Larger raw increase has a larger dead band
- **WHEN** block A gains 100 cars/hour with a screening band of 80 and block B gains 50 with a band of 10
- **THEN** A is the raw-maximum block and B may be the adjusted-penalty block, with the two identities labeled separately

#### Scenario: Maximum is unresolved
- **WHEN** the raw maximum's uncertainty interval does not resolve its sign
- **THEN** the output shows the estimate and unresolved status without asserting that no block gains traffic

#### Scenario: Equal raw maxima
- **WHEN** two blocks have equal raw increases
- **THEN** the writer uses a documented deterministic tie rule and all readers show the same selected block and values
