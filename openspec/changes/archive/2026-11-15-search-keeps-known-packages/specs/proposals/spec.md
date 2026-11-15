## ADDED Requirements

### Requirement: Known packages are never lost
Each study area MAY have a seeds file, `data/proposals/<area>.seeds.json`, of scenario links of packages worth rechecking. Every search SHALL append the options it publishes to it, deduplicated by canonical link, decode its seeds on the current network and recheck each one it can use in full, outside the screening budget. A seed SHALL compete for the published options on equal terms with the search's own finalists.

#### Scenario: A package published before
- **WHEN** a later search runs on the same inputs
- **THEN** every package an earlier search published that the profile allows is rechecked in full, and the group's best option cuts through cars at least as much as the best of them within noise

#### Scenario: Same package, different order
- **WHEN** two seeds list the same interventions in a different order or for a different period
- **THEN** the file keeps one and the run rechecks it once

### Requirement: Seeds the search cannot use are reported
A search SHALL drop, with a stated reason, each seed that its profile forbids, that fails the access check, that combines two interventions at one place, that repeats another seed or that no longer decodes on the network. The report and `computed.knownPackages` SHALL give the counts and the reasons.

#### Scenario: A seed that no longer applies
- **WHEN** a seed holds an intervention the profile forbids, or cannot be placed on the network
- **THEN** it is not rechecked, and the report and `computed.knownPackages` say how many were dropped and why

### Requirement: The seeds file keeps to a cap
After a run the seeds file SHALL hold at most its cap of packages. Over the cap, the search-published entries that this run did not publish SHALL be dropped, the oldest first and the weakest first among equals. An entry added by hand and the options this run published SHALL never be dropped.

#### Scenario: Cap
- **WHEN** the file holds more packages than its cap after a run
- **THEN** the oldest weakest search-published entries that this run did not publish are removed, and entries added by hand and the options this run published stay

### Requirement: Seeds start a beam
Each seed and each package one intervention smaller than it SHALL be screened, and the best of them, taken in turn from each seed's family so one package's neighbors cannot fill the beam, SHALL start a beam of their own beside the one that grows from the best single interventions.

#### Scenario: Sub-packages
- **WHEN** a seed holds three interventions
- **THEN** the three packages made by removing one of them are screened and extended

### Requirement: Packages are no larger than the search depth
No package the search builds SHALL have more interventions than `--depth`, and a seed with more SHALL be dropped with that reason.

#### Scenario: Large seed
- **WHEN** a seed has ten interventions and the depth is 6
- **THEN** it is not rechecked and the run reports that it has more interventions than the search depth

### Requirement: Partial packages are ranked with a phased harm weight
Inside the beam, a package SHALL be ranked by its cut-through reduction minus a harm weight that is zero for one intervention and grows linearly to the full weight at the search depth. A line of descent SHALL stop when no package of the next level beats the previous level's best at the new level's weight. The score published for a package, the finalists' recheck and the choice of options SHALL use the full weight.

#### Scenario: Interventions that work together
- **WHEN** no single intervention of a package scores above zero because each displaces traffic that the others absorb
- **THEN** the beam still keeps the singles that cut through cars most, and the package can be reached

### Requirement: Stable options
When a package no earlier search published is within the noise band on through cars of one an earlier search published, has at least as much harm (within the harm noise floor) and no fewer interventions, the earlier package SHALL be listed and the new one dropped with a note saying so. A package an earlier search published SHALL be dropped for dominance only by a package that beats it by more than the noise band. The list SHALL always include its lightest option.

#### Scenario: Within noise
- **WHEN** a new package cuts through cars 2 points more than a published one and the noise band is 5 points
- **THEN** the published one is listed

#### Scenario: Clearly better
- **WHEN** a new package cuts through cars by more than the noise band beyond a published one, with no more harm or interventions
- **THEN** the new one is listed and the published one is dominated

### Requirement: Options say where they came from
Each published option SHALL carry `origin.kind`: `search` for a package this run found, `seed` for one from the seeds file published by an earlier run, `hand` for one added to the file by a person (with its date and note). Each group's `computed.knownPackages` SHALL give the counts loaded, rechecked and dropped, the dropped counts by reason and the dropped links. The report SHALL list the same.

#### Scenario: Output
- **WHEN** a search publishes an option that was in the seeds file
- **THEN** its origin names the seed's kind and first date, and the report says so
