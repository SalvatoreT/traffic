# proposals Specification

## Purpose
TBD - created by archiving change proposals. Update Purpose after archive.

## Requirements

### Requirement: Search for low-harm packages
The project SHALL provide a search that evaluates sets of interventions in the simulation and returns packages that reduce cut-through traffic on streets inside the study area, measured as through cars per hour, while limiting the largest increase in all traffic (through cars and local trips together) on any single inside street block. The proposals file SHALL report each package's cut-through as baseline and scenario cars per hour and the percent change, SHALL report the side-street block that gains the most through cars per hour, averaged over the same periods, and for each period the all-traffic change on the block with the largest all-traffic increase with its through-car part, and SHALL be versioned so that readers can tell files that report a distance, files that report one all-traffic worst block, and files that report both measures.

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
- **WHEN** no block's average through-car gain passes its noise band
- **THEN** the file reports zero blocks above noise for the through measure

#### Scenario: Per-period all traffic
- **WHEN** a package is published
- **THEN** each searched period reports the all-traffic worst block with its before and after cars per hour, how much of the change is through cars, and how many blocks gain beyond noise in that period

### Requirement: Allowed contents
A proposal SHALL use only interventions the app offers, SHALL NOT add a traffic signal, and SHALL leave every block inside the study area reachable by car from outside in both directions.

#### Scenario: Stranded block
- **WHEN** a candidate package leaves a block with no way in or out by car
- **THEN** the package is rejected

### Requirement: Published with provenance
The proposals file SHALL record the network and demand it was computed on, the periods and seeds used, the date and the baseline's calibration status.

#### Scenario: Group provenance
- **WHEN** a proposals file holds more than one group
- **THEN** each group records its own date, periods, seeds, hashes and calibration status

#### Scenario: Baseline changes
- **WHEN** the published network or demand differs from the one recorded in the proposals file
- **THEN** the proposals are treated as out of date

### Requirement: Constraint profiles
The search MAY accept a named profile from a data file given with `--profiles` that excludes intervention types and, optionally, every intervention on a bounding street or at an intersection with one. No profile SHALL be published: the proposals are one list searched without limits, and the repository holds no profiles file. A run with a profile SHALL write its results as one group of the proposals file, replacing only the group with the same id and keeping the others. A run without a profile SHALL write the unconstrained group alone, replacing the file and the report. The harm definition SHALL NOT depend on the profile.

#### Scenario: Two runs, one file
- **WHEN** the search runs without a profile on a file that holds other groups
- **THEN** the file holds one group, and the report holds one section

#### Scenario: Limits of the 2025 neighborhood pilot
- **WHEN** the search runs with a profile that excludes speed humps, traffic circles and the boundary
- **THEN** no candidate or proposal contains a speed hump or traffic circle, or touches a bounding street or an intersection with one, and the group is written beside the others

#### Scenario: Earlier single-list file
- **WHEN** a profile run merges into a proposals file in the earlier format with one list
- **THEN** that list is kept as the unconstrained group

#### Scenario: Traffic moved onto a bounding street
- **WHEN** a package adds traffic to a bounding street
- **THEN** that increase is not counted as harm and is shown with the other bounding-street figures

#### Scenario: Packages from limited searches
- **WHEN** the seeds file holds packages recorded from a search that used limits
- **THEN** they are rechecked as known packages and compete for the options on equal terms

### Requirement: Per-street filter candidates
The search SHALL offer, at each intersection where it offers a whole-junction filter, a filter on each single street when closing that street leaves at least two other legs connected, labeled "Modal filter on <street> at <intersection>". Such a candidate SHALL conflict with every other intervention on the same intersection, and a constraint profile SHALL apply to it as to the whole-junction filter.

#### Scenario: Four-way crossing
- **WHEN** candidates are generated for a crossing of two residential streets
- **THEN** the whole-junction filter and one filter per street are offered, and no package holds two of them

#### Scenario: T-junction
- **WHEN** candidates are generated for a T-junction
- **THEN** only the side street is offered alone, because closing the through street would leave a single leg

#### Scenario: Pilot limits
- **WHEN** a profile excludes intersections with a bounding street or an intervention type
- **THEN** no per-street filter is offered at those intersections or of that type

### Requirement: A looser search is never worse than a stricter one
When a proposals file already holds a group computed on the same network and demand, a search with a profile SHALL start from that group's chosen packages that the profile allows: screen them, extend them in a beam of their own and recheck them with the other finalists. Those packages SHALL always be rechecked, whatever one-seed screening or the screening budget said, and SHALL NOT be dropped as within noise of a simpler package. A profile that does not keep off the boundary SHALL offer every location a profile that does would offer. Within one invocation, a later profile SHALL start from the groups the earlier ones wrote.

#### Scenario: Pilot packages seed the unconstrained search
- **WHEN** a search without limits runs after a search with a profile on the same inputs
- **THEN** every package the limited group chose is rechecked in the later run, and the later group's best option cuts through cars at least as much

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

### Requirement: Consistent chosen options
The options chosen SHALL be listed by through cars removed an hour, largest first, as published to one decimal. Ties SHALL go to the option with fewer changes, then to the smaller largest all-car rise on any block in any period. The order SHALL follow the figures the file publishes, which are the confirmation runs when there are any. A package SHALL be listed only if it cuts through cars by more than every smaller package listed.

#### Scenario: More changes, less effect
- **WHEN** a finalist has more interventions than another finalist and cuts through cars less
- **THEN** it is not listed, and its note says a smaller finalist cuts through cars at least as much

#### Scenario: Order
- **WHEN** options remove 30, 20, 30 and 50 through cars an hour, the first with three changes and the third with two
- **THEN** they are listed 50, 30 (two changes), 30 (three changes), 20, and numbered in that order

#### Scenario: Confirmation reorders
- **WHEN** the confirmation runs rank two options differently from the runs that chose them
- **THEN** the file lists them in the confirmation order

### Requirement: Per-link through cars for the card picture
Each proposal in the proposals file SHALL carry a `picture`: for one period, the through cars an hour on each link that has any, today and with the package, as parallel arrays keyed by link id. The values SHALL come from the same counters, window, seeds and run length as the proposal's block figures. Each group's `computed` SHALL record the run length in minutes.

#### Scenario: Search output
- **WHEN** the search writes a group
- **THEN** every package, search and reference alike, carries a `picture` with its period, link ids, baseline values and scenario values of equal length

#### Scenario: Period
- **WHEN** the PM peak was searched
- **THEN** the picture is for the PM peak, and otherwise for the first searched period

#### Scenario: Zeros omitted
- **WHEN** a link carries no through cars today and none with the package
- **THEN** it is not in the arrays

### Requirement: Annotating an existing file
`explore --annotate` SHALL read the proposals file at `--out`, check that every group was computed on the current network and demand hashes, re-simulate only the baseline and the published packages for each group's picture period with the group's seeds and run length, and write the `picture` of every package into the same file without changing anything else. It SHALL NOT run a search, and its arrays SHALL equal those the search writes for the same inputs.

#### Scenario: Matching inputs
- **WHEN** a file is annotated on the inputs it was computed on
- **THEN** each package gains a `picture` identical to what the search wrote for it

#### Scenario: Other inputs
- **WHEN** a group's network or demand hash differs from the current inputs
- **THEN** the command stops with a message naming the group and leaves the file unchanged

### Requirement: Precomputed results for published proposals
A tool SHALL compute, for every published proposal in every group and each demand period, the finished hour of the scenario beside the baseline, with the simulator build the app runs, the app's seed, 100% demand and 60 simulated minutes. It SHALL write one file per distinct (scenario, period) to `public/data/results/<area>/<key>.json`, keyed by a hash of the order-independent scenario and the period, plus an index, and SHALL NOT write the proposals file.

#### Scenario: Shared scenario
- **WHEN** two proposals have the same interventions
- **THEN** they share one file per period

#### Scenario: Equals a fresh run
- **WHEN** a stored result is compared with a fresh run of the same scenario, period and seed
- **THEN** the link stats and metrics are equal

### Requirement: Contents and validity of a stored result
Each file SHALL hold both runs' metrics, per-link stats and per-intent link usage, and record the network hash, the demand hash and the simulator fingerprint. The tool SHALL reuse a file whose three inputs still match. Files SHALL be published with the other generated data and served under `/data/`.

#### Scenario: Inputs changed
- **WHEN** the network, the demand or the simulator's sources change
- **THEN** the next run of the tool recomputes the affected files and drops files for scenarios that are no longer published

### Requirement: Baseline by reason file
`npm run data:results` SHALL also write `results/<area>/baseline-intents.json`: per demand period, today's through cars an hour in total and by intent and the links each intent's cars used, at the stored results' seed and run length, with the network hash, demand hash and simulator fingerprint. A file whose inputs match SHALL be reused, and `--baselines-only` SHALL run only these baselines.

#### Scenario: Stale file
- **WHEN** the demand file changes
- **THEN** the app ignores the file until it is regenerated, and the Assumptions tab shows its cards without maps

### Requirement: The search measures the run the app makes
Every simulation the search makes SHALL start loaded and settled as the app's does and SHALL measure every figure over the run from t = 0. Published figures SHALL come from rechecks of 60 simulated minutes, and screening runs, which are the same run but shorter, SHALL NOT feed them. Each group's `computed` SHALL state the initial load, settle seconds, minutes, screening minutes, seeds and window.

#### Scenario: Equals a direct run
- **WHEN** the search's run of a scenario, period, seed and length is compared with a `Simulation` built and stepped as the app does
- **THEN** the cut-through rate and the per-link flow and through-car figures are equal

### Requirement: Speed hump candidates survive the link round trip
A speed hump candidate SHALL be at the link and position the link decoder returns for it, and every candidate of every type, written as a link and read back, SHALL give the same effective network.

#### Scenario: Block whose first link runs west
- **WHEN** a hump candidate is generated on a block whose first link runs west
- **THEN** reading its link gives an identical hump on the same links

### Requirement: Reference packages report the access check
A reference package SHALL be checked for stranded blocks like a search package, and the result SHALL be published on the package (`accessProblem`) and in the report. The package SHALL be published either way.

#### Scenario: Reference strands a block
- **WHEN** a reference package closes the only way into a dead-end street
- **THEN** it is rechecked and published with `accessProblem` naming the stranded block

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

### Requirement: Near-duplicate options are folded
The search SHALL fold near-duplicate packages into one option before it picks the options, and SHALL keep the lightest option only if it survives the fold. The similarity thresholds are assumptions.

#### Scenario: Same places, other variant
- **WHEN** two finalists act at the same set of places and differ only in the variant at a place, such as the leg a filter sits on
- **THEN** one is kept and the other is recorded as folded into it

#### Scenario: One change apart, not different
- **WHEN** two finalists differ by at most one change (added, dropped or swapped) and neither beats the other under the paired comparison, or by more than the 1% floor when there are too few pairs
- **THEN** one is kept and the other is folded into it

#### Scenario: One change apart, clearly better
- **WHEN** a finalist with one more change beats the smaller one on the paired comparison
- **THEN** both are kept

#### Scenario: Same picture
- **WHEN** the distance between two finalists' through-car changes on the side-street blocks, `sum |a - b| / (sum |a| + sum |b|)` over the blocks averaged over periods and seeds, is at most 0.10
- **THEN** one is kept and the other is folded into it, with the distance recorded

#### Scenario: Which one is kept
- **WHEN** two packages are similar
- **THEN** the one with the larger reduction is kept if it wins the paired comparison, otherwise the one with fewer changes, then the smaller largest all-car rise, then the one an earlier search published, then the earlier finalist

#### Scenario: Nothing disappears silently
- **WHEN** a package is folded
- **THEN** the finalists table notes the package it folded into and why, the report has a "Similar packages" section, and `computed.similarity` lists the fold

### Requirement: Variants on the kept option
Each published option SHALL carry the packages folded into it as `variants`, each with a scenario link, one plain line per difference against the option, why it was folded, its origin, and its through cars an hour before and after with the seeds and role of the runs behind them. A variant SHALL NOT be a proposal: it has no share path, stored result, picture or preview card.

#### Scenario: Swap at one place
- **WHEN** a folded package has a different change at the same place as one of the option's
- **THEN** its line reads "Use <its change> instead of <the option's change>"

#### Scenario: Added or dropped change
- **WHEN** a folded package has one more change than the option, or one fewer
- **THEN** its line reads "Add: <change>" or "Drop: <change>"

#### Scenario: Fold into an unpublished option
- **WHEN** the option a package folded into is not published
- **THEN** the package appears in `computed.similarity` with `intoPublished` false and on no card

### Requirement: The default search is one run
Without arguments for seeds, `explore` SHALL search and recheck on seeds 1 to 3 and then rerun the frozen shortlist on seeds 101 to 110, which took no part in the search, and publish the confirmation runs. `--no-confirm` SHALL turn the confirmation off, and the file SHALL then label its estimates exploratory. The reporting method SHALL change when the selection rules do.

#### Scenario: Default
- **WHEN** `explore` runs with only an area and periods
- **THEN** the file's `computed.seeds` are 101 to 110 and its options' evidence role is `confirmation`

#### Scenario: Overlapping seeds
- **WHEN** `--seeds` includes a confirmation seed
- **THEN** the command stops and says the ranges must not overlap

### Requirement: Speed reductions are Slow Streets in the search
The proposal search SHALL offer speed reductions only as Slow Streets, one per street whose busiest block carries at least a quarter of the busiest block's through traffic in the baseline, ranked like other candidates. It SHALL NOT generate per-block speed limits. Packages in the seeds file that hold per-block limits SHALL stay loadable.

#### Scenario: Candidates
- **WHEN** the candidate list is generated
- **THEN** it holds Slow Streets and no per-block speed limit

#### Scenario: Filter on a Slow Street
- **WHEN** a package holds a Slow Street and a modal filter on a block of that street
- **THEN** the two do not conflict

### Requirement: Places of a Slow Street
A Slow Street SHALL occupy one place per street name, so it combines with a filter or a one-way on the same street. A Slow Street and per-block limits on the same street SHALL count as the same change in conflict and similarity rules.

#### Scenario: Same street, two forms
- **WHEN** a package holds a Slow Street and another holds per-block limits on the same street
- **THEN** the search treats them as the same place

### Requirement: Options are chosen for named objectives
The search SHALL choose the published options for four objectives, each a documented rule with its weights labeled assumptions: most cut-through removed, no street closures, least detour for residents and fewest changes. Each objective SHALL grow its own beam over the shared screening cache, finalists SHALL be pooled and rechecked together, and each option SHALL name the objectives it is the best for. The list SHALL stay one list, largest through-car removal first.

#### Scenario: One package, two objectives
- **WHEN** the same package is the best for most cut-through removed and for fewest changes
- **THEN** it appears once, with both tags

#### Scenario: Remaining places
- **WHEN** fewer options than the list size are objective winners
- **THEN** the rest are the best remaining by through cars removed that are not similar to an option already chosen

### Requirement: Rules of the objectives
No street closures SHALL use the search score among packages made only of Slow Streets, one-ways, all-way stops, traffic circles, speed humps and turn bans. Least detour for residents SHALL subtract a light weight times the added trip time of trips that start or end inside the study area and SHALL NOT lift a package that removes less than half of the most removed. Fewest changes SHALL use the search score among packages of at most two changes.

#### Scenario: A closing package cannot hide the best package without closures
- **WHEN** a package with a filter removes more through cars than every package without closures
- **THEN** the best package without closures is still an option, tagged "no street closures"

#### Scenario: The detour weight is light
- **WHEN** the least-detour objective chooses between packages
- **THEN** it may reorder packages with similar reductions and it never lifts a package that removes less than half of the most removed

### Requirement: Residents' detour
Each published option SHALL report residents' detour: the added mean trip time, in seconds per trip, of completed car trips that start or end inside the study area, scenario minus baseline on the same seed, averaged over the searched periods, with its interval over runs, and the same trips' added time in vehicle-minutes an hour. Trips that do not complete in the run SHALL NOT be timed, and the documentation SHALL say so.

#### Scenario: Reading the detour
- **WHEN** a reader opens an option
- **THEN** it shows seconds per resident trip with its interval beside through cars before and after and the largest all-car rise

### Requirement: Older files are still read
A proposals file written before objectives SHALL be read as options with no tags and no residents' detour, and shown without them.

#### Scenario: Older file
- **WHEN** the app loads a version 5 file with no `objectives` fields
- **THEN** the cards show no "Best for" row and no detour line
