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

### Requirement: Search for low-harm packages
The project SHALL provide a search that evaluates sets of interventions in the simulation and returns packages that reduce cut-through traffic on streets inside the study area, measured as through cars per hour, while limiting the largest increase in all traffic (through cars and local trips together) on any single inside street block past an assumed noise band. The proposals file SHALL report each package's cut-through as baseline and scenario cars per hour and the percent change, SHALL report the side-street block with the largest raw increase in through cars per hour, averaged over the same periods and seeds, and for each period the block with the largest raw all-traffic increase with its through-car part, and SHALL report the block behind the search's ranking penalty separately from those. The file SHALL be versioned so that readers can tell files that report a distance, files that report one all-traffic worst block, files that report both measures, and files that also record provenance, paired intervals and the raw maximum.

#### Scenario: Running the search
- **WHEN** a contributor runs the search for an area
- **THEN** it writes a proposals file whose packages were each rechecked over the full hour, every searched period and several seeds, with cut-through in cars per hour

#### Scenario: A package that moves traffic next door
- **WHEN** a candidate package removes cut-through from one block by adding a large amount of all traffic to another inside block
- **THEN** its ranking penalty reflects that worst block and it ranks below packages with the same reduction and less penalty

#### Scenario: A package that only shortens through trips
- **WHEN** a package changes how far through cars drive on local streets but not how many of them use those streets
- **THEN** its reduction is zero

#### Scenario: Through cars on a block
- **WHEN** a package is rechecked
- **THEN** each block's through-car flow comes from the simulator's per-link cut-through counters over the same window as its all-car flow, and is never larger than its all-car flow

#### Scenario: No block gains through traffic
- **WHEN** no block's average through-car change is an increase
- **THEN** the file still names the block with the largest raw change and its value, and the readers say only that no block gains on average

#### Scenario: Per-period all traffic
- **WHEN** a package is published
- **THEN** each searched period reports the block with the largest raw all-traffic increase with its before and after cars per hour and how much of the change is through cars, and separately the block behind the ranking penalty and the penalty after its band

### Requirement: Stable options
When a package no earlier search published is not beaten by one an earlier search published on through cars, has at least as much harm (within the harm noise floor) and no fewer interventions, the earlier package SHALL be listed and the new one dropped with a note saying so. "Beats" SHALL mean that the interval of the per-seed difference in through cars, with the two packages paired on the same seeds, lies on the side of the new package and the mean difference is at least the practical floor of the reduction. With fewer paired runs than the comparison needs, or runs that are not the same pairs, only the practical floor on the means SHALL apply, and the output SHALL say that the evidence is insufficient. A package an earlier search published SHALL be dropped for dominance only by a package that beats it. The list SHALL always include its lightest option.

#### Scenario: Within noise
- **WHEN** a new package cuts through cars 2 points more than a published one on average, but the per-seed differences change sign so that their interval includes zero
- **THEN** the published one is listed

#### Scenario: A lead on every seed
- **WHEN** a new package cuts through cars 2 points more than a published one on average, by a similar amount on every seed
- **THEN** the new one is listed and the published one is dominated

#### Scenario: Clearly better
- **WHEN** a new package beats a published one, with no more harm or interventions
- **THEN** the new one is listed and the published one is dominated

#### Scenario: Too few runs
- **WHEN** fewer paired runs exist than the comparison needs
- **THEN** only the practical floor on the means screens the packages and the output labels the evidence insufficient

### Requirement: A looser search is never worse than a stricter one
When a proposals file already holds a group computed on the same network and demand, a search with a profile SHALL start from that group's chosen packages that the profile allows: screen them, extend them in a beam of their own and recheck them with the other finalists. Those packages SHALL always be rechecked, whatever one-seed screening or the screening budget said, and SHALL NOT be dropped for failing to beat a simpler package. A profile that does not keep off the boundary SHALL offer every location a profile that does would offer. Within one invocation, a later profile SHALL start from the groups the earlier ones wrote.

#### Scenario: Pilot packages seed the unconstrained search
- **WHEN** the unconstrained search runs after the pilot profile on the same inputs
- **THEN** every package the pilot group chose is rechecked in the unconstrained run, and the unconstrained group's best option cuts through cars at least as much as the pilot group's

#### Scenario: Budget spent
- **WHEN** the screening budget is exhausted before a stricter group's package is screened
- **THEN** the package is still rechecked

#### Scenario: Package that breaks the limits
- **WHEN** a seed package holds an intervention the current profile excludes, or one on a bounding street
- **THEN** that package is left out of the start and a line on stderr says why

#### Scenario: Different inputs
- **WHEN** the file's group was computed on another network or demand hash
- **THEN** its packages are not used

#### Scenario: Candidate cap
- **WHEN** the busiest locations include many on bounding streets
- **THEN** the unconstrained candidate list still holds the top locations that are off the boundary

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

### Requirement: Older files stay readable and are marked
The app SHALL keep reading a version 4 proposals file. It SHALL show the figures and mark the group as lacking simulator and reporting-method provenance, run settings, intervals and the raw-maximum block, and SHALL describe the one worst block such a file records as the block the search flagged with its noise band, not as the block that gains the most. A group that lacks the through-car measures stays out of date with no options.

#### Scenario: Version 4 file
- **WHEN** the published file is version 4
- **THEN** each group shows its figures with a notice that provenance and intervals were not recorded, and no card calls the recorded block the one with the largest increase

### Requirement: Every figure says what it is
Each figure on a card, in a text page, in a preview card and in an exported picture SHALL say that it is through cars an hour or all cars an hour, for which period or average of periods, whether it is a mean over seeds or one run and how many, and SHALL compare only like with like. An exported picture SHALL carry the stale or unverified status of its group.

#### Scenario: Card figure
- **WHEN** a card shows the through-car change for a package
- **THEN** it names the periods, says it is the mean of the recorded runs with their seeds, and gives the paired interval or says that none was recorded

#### Scenario: Stale picture
- **WHEN** a picture is exported from a group whose figures are stale or unverified
- **THEN** the picture says so in its own text
