# proposals Specification

## Purpose
TBD - created by archiving change proposals. Update Purpose after archive.

## Requirements

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

### Requirement: Allowed contents
A proposal SHALL use only interventions the app offers, SHALL NOT add a traffic signal, and SHALL leave every block inside the study area reachable by car from outside in both directions.

#### Scenario: Stranded block
- **WHEN** a candidate package leaves a block with no way in or out by car
- **THEN** the package is rejected

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
When a proposals file already holds a group computed on the same network and demand, a search with a profile SHALL start from that group's chosen packages that the profile allows: screen them, extend them in a beam of their own and recheck them with the other finalists. Those packages SHALL always be rechecked, whatever one-seed screening or the screening budget said, and SHALL NOT be dropped for failing to beat a simpler package. A profile that does not keep off the boundary SHALL offer every location a profile that does would offer. Within one invocation, a later profile SHALL start from the groups the earlier ones wrote.

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
`npm run data:results` SHALL also write `results/<area>/baseline-intents.json`: per demand period, today's through cars an hour in total and by intent and the links each intent's cars used, at the stored results' seed and run length, with the network hash, demand hash and simulator fingerprint. For an area that defines corridors it SHALL also store, per period, the same through cars by corridor, direction and intent, the cars that cross between the west and east bounding streets, and the number that use a second corridor, with the corridor definitions and a hash of their settings. The table SHALL come from a traced run at the same seed and run length, using the simulator's own intent for each car, and the run SHALL stop if the traced run's through cars by intent differ from the baseline's or if the flows do not add up to the total. A file whose inputs match SHALL be reused, the corridor table SHALL be recomputed when the corridor settings change, and `--baselines-only` SHALL run only these baselines.

#### Scenario: Stale file
- **WHEN** the demand file changes
- **THEN** the app ignores the file until it is regenerated, and the Assumptions tab shows its cards without maps

#### Scenario: Table adds up
- **WHEN** the corridor table is written for a period
- **THEN** its flows sum to the period's `totalVph` and each flow's reasons sum to the flow

#### Scenario: Settings change
- **WHEN** a corridor name or street list in the area config changes
- **THEN** the next run recomputes the corridor tables and leaves the rest of the file unchanged

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
No package the search builds SHALL have more interventions than `--depth`, and a seed with more SHALL be dropped with that reason. A ban set counts as one intervention, however many turn bans it holds.

#### Scenario: Large seed
- **WHEN** a seed has ten interventions and the depth is 6
- **THEN** it is not rechecked and the run reports that it has more interventions than the search depth

#### Scenario: A seed made of a ban set and a filter
- **WHEN** ban sets are on and a seed link holds the 21 turn bans of a generated set and one modal filter, and the depth is 6
- **THEN** the seed has two interventions, is rechecked, and starts a beam

### Requirement: Partial packages are ranked with a phased harm weight
Inside the beam, a package SHALL be ranked by its cut-through reduction minus a harm weight that is zero for one intervention and grows linearly to the full weight at the search depth. A line of descent SHALL stop when no package of the next level beats the previous level's best at the new level's weight. The score published for a package, the finalists' recheck and the choice of options SHALL use the full weight.

#### Scenario: Interventions that work together
- **WHEN** no single intervention of a package scores above zero because each displaces traffic that the others absorb
- **THEN** the beam still keeps the singles that cut through cars most, and the package can be reached

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
The search SHALL choose the published options for six objectives, each a documented rule with its weights labeled assumptions: most cut-through removed, no street closures, least detour for residents, fewest changes, no turn restrictions and most cut-through removed without turn restrictions. Each objective except the last SHALL grow its own beam over the shared screening cache, finalists SHALL be pooled and rechecked together, and each option SHALL name the objectives it is the best for. The list SHALL stay one list, largest through-car removal first.

#### Scenario: One package, two objectives
- **WHEN** the same package is the best for most cut-through removed and for fewest changes
- **THEN** it appears once, with both tags

#### Scenario: Remaining places
- **WHEN** fewer options than the list size are objective winners
- **THEN** the rest are the best remaining by through cars removed that are not similar to an option already chosen

### Requirement: Residents' detour
Each proposal SHALL compare the same resident car requests on the same seed through the same cutoff. Completed trips SHALL contribute their time from request to completion. Other requests SHALL contribute their elapsed time at cutoff. The report SHALL show the difference in seconds per request, the aggregate time difference per hour and completion coverage. Old completed-trip metrics SHALL remain identifiable. A missing or mismatched cohort SHALL be ineligible for the least-detour objective.

#### Scenario: Reading the detour
- **WHEN** a reader opens an option with comparable resident request cohorts
- **THEN** the option gives its difference in seconds per request, interval and completion coverage

#### Scenario: A resident still waits at cutoff
- **WHEN** a resident request finishes in the baseline run and remains unserved in the scenario
- **THEN** both runs include that request in the denominator and the scenario counts its time through cutoff

### Requirement: Older files are still read
A proposals file written before objectives SHALL be read as options with no tags and no residents' detour, and shown without them.

#### Scenario: Older file
- **WHEN** the app loads a version 5 file with no `objectives` fields
- **THEN** the cards show no "Best for" row and no detour line

### Requirement: Stored redirect data for published proposals
`npm run data:redistribution` SHALL write `public/data/redistribution/<area>/<group>.<proposal>.json`, under 200 KB, for each published proposal with a picture, from traced runs of today's traffic and the package on the proposal's confirmation seeds. For each intervention that closes a car movement it SHALL record how many through cars an hour drove it, where they went, the top routes with their links, and the receiving blocks. A route's links SHALL be a connected path (each link starts where the one before it ends) from the first to the last link within the local radius of the closed junctions, and its street list SHALL name every street those links drive. The generator SHALL fail without writing the file when a route breaks either rule, and the map SHALL NOT draw a segment between non-adjacent nodes.

#### Scenario: Generation
- **WHEN** the generator runs for a proposal with six interventions, five of them filters
- **THEN** the file lists the five filters with cars an hour used, the breakdown, routes and receiving blocks, and leaves out a change that closes no car movement

#### Scenario: A route leaves the radius and returns
- **WHEN** a followed trip drives a link inside the radius, several links outside it, and a link inside it again
- **THEN** the stored links include the links outside the radius in between, and the street list names them

#### Scenario: A stored route has a gap
- **WHEN** a link list has consecutive links that do not meet at a node
- **THEN** the generator reports the route and writes nothing, and the map draws the runs as separate lines

### Requirement: Redirect data is shown only when current
Each file SHALL record the proposal's link, the period, the seeds, the simulator fingerprint and the network and demand hashes. The app SHALL use a file only when its link, period and seeds equal the proposal's and its hashes and simulator equal the proposal group's and the ones loaded. The generator SHALL skip a current file unless forced.

#### Scenario: Freshness
- **WHEN** a file was made for another link, period, seeds, network, demand or simulator
- **THEN** the app does not show it and the generator makes it again

### Requirement: Rules of the four goals
No street closures SHALL use the search score among packages that close nothing to cars. Least detour for residents SHALL choose the smallest residents' detour in seconds per trip among packages removing at least half of the most removed (an assumption). A detour difference the paired comparison cannot resolve SHALL go to the package removing more through cars, then to the one with fewer changes. Fewest changes SHALL use the search score among packages of at most two changes.

#### Scenario: A closing package cannot hide the best package without closures
- **WHEN** a package with a filter removes more through cars than every package without closures
- **THEN** the best package without closures is still an option, tagged "no street closures"

#### Scenario: Lowest detour that still removes half
- **WHEN** packages remove 73%, 49%, 48% and 46% of through cars with detours of 9.5, 8.3, 4.4 and 0.2 seconds per trip, the last differing from the third on the paired seeds
- **THEN** the option tagged "least detour for residents" is the 46% package

#### Scenario: The floor holds
- **WHEN** a package removes less than half of the most removed
- **THEN** it cannot win least detour, whatever its detour

#### Scenario: Unresolved difference
- **WHEN** two packages above the floor differ in detour by less than the paired interval resolves
- **THEN** the one that removes more through cars wins, then the one with fewer changes

### Requirement: Beam for the detour goal
The beam for least detour SHALL rank a screened package by its detour, lowest first, once its reduction passes half of the best reduction screened so far, and by reduction below that. Every package above that floor SHALL rank ahead of every package below it.

#### Scenario: A low-detour partial package survives
- **WHEN** a partial package passes the floor with a smaller detour than a package that removes more
- **THEN** it ranks ahead of it in the beam for least detour, and a package below the floor ranks behind both

### Requirement: Displacement of untagged options
An option that wins no goal SHALL NOT be published when another published option displaces it: that option removes at least as many through cars or cannot be told from it on the paired comparison, and its largest all-car rise on one block is smaller by more than the noise of the two rises. Goal winners SHALL never be dropped by this rule. The rule SHALL run on the search seeds when the options are chosen and again on the confirmation figures, which are the published ones: the worst displaced option SHALL be dropped, the rest judged again, and the list SHALL NOT be refilled with finalists that were not confirmed. Every drop SHALL be recorded with its reason in the group's `computed` and in the report, with `basis` (`search` or `confirmation`) and the `seeds` its figures come from, and the reason text SHALL say which.

#### Scenario: Larger rise, same removal
- **WHEN** an untagged option removes 269 through cars an hour with a largest all-car rise of 208, and a tagged option removes 266 with a largest rise of 56, a difference the paired seeds do not resolve
- **THEN** the untagged option is not published and `computed.displacement.dropped` names it, the tagged option and both rises

#### Scenario: Noise of the rises
- **WHEN** the two rises have paired intervals
- **THEN** the noise is their half widths combined, and a floor labeled as an assumption when either has none

#### Scenario: A rise inside the noise
- **WHEN** the other option's rise is smaller by less than the noise of the two rises
- **THEN** the option stays

#### Scenario: Goal winner
- **WHEN** the option with the large rise is the winner of a goal
- **THEN** it stays

#### Scenario: Survives the search seeds, displaced on confirmation
- **WHEN** an untagged option stays on search-seed figures, and on the confirmation seeds another option removes at least as many through cars with a largest all-car rise of +57 against its +112
- **THEN** the option is removed from the published list, the options after it are renumbered, and its record has `basis` `confirmation`, the confirmation seeds, and a reason ending "figures from the confirmation seeds"

#### Scenario: Not refilled
- **WHEN** the pass after confirmation drops an option and a finalist that was not confirmed is next best
- **THEN** the published list is one shorter and the finalist is not added

#### Scenario: Drops from the search seeds say so
- **WHEN** the search drops an option on search-seed figures
- **THEN** its record has `basis` `search` and the search seeds, and its reason ends "figures from the search seeds"

### Requirement: Per-link all cars for the card picture
Each proposal SHALL carry `pictureAll` beside `picture`: for the same period, the same seeds and the same run length, all cars an hour on each link of the side-street blocks the search measures that carries any, today and with the package, as parallel arrays keyed by link id in ascending order. Zeros SHALL be omitted. `explore --annotate` SHALL write it with `picture`, and its arrays SHALL equal those the search writes for the same inputs.

#### Scenario: Search output
- **WHEN** the search writes a group
- **THEN** every package carries a `pictureAll` with the period of its `picture`, and no link outside the measured blocks

#### Scenario: Size
- **WHEN** a group is written
- **THEN** `pictureAll` adds one array triple of at most a few hundred links to each package, and the file stays well under a few hundred kilobytes

#### Scenario: Older file
- **WHEN** a file has `picture` and no `pictureAll`
- **THEN** it is read as before and the card says all cars are not in the file

### Requirement: Proposal selection keeps desktop lists stationary

For fixed viewport dimensions and proposal data, hovering or focusing a street or intervention in the desktop proposal card SHALL update its map selection and details without changing the position or dimensions of the street and intervention lists. Selected text SHALL retain its unselected font dimensions. Details that exceed the reserved space SHALL remain readable through a named, keyboard-focusable scrolling panel with visible focus.

#### Scenario: Hovering a street

- **WHEN** a pointer enters a street name, remains stationary, and then leaves
- **THEN** the details update and clear as appropriate while the list and its rows retain their geometry

#### Scenario: Long selected names

- **WHEN** a long street or intervention name is selected by pointer or keyboard
- **THEN** selection styling does not change its wrapping or move neighboring entries

#### Scenario: Overflowing details

- **WHEN** the selected intervention's details exceed the desktop panel's reserved height
- **THEN** all content remains reachable by pointer and keyboard scrolling without expanding the panel or moving the lists

#### Scenario: Mobile layout

- **WHEN** the viewport uses the mobile proposal layout
- **THEN** details retain their natural height and narrow street tables retain full-width street names with labeled figures underneath

### Requirement: Reapplying the displacement rule to a finished file
`explore --reapply-displacement FILE` SHALL apply the same rule, on the confirmation figures stored in the file, to every group whose estimates are confirmation figures, without a search. It SHALL remove the options the rule drops, renumber the remaining search options `p1`..`pN` in order, rebuild `optionComparisons` for them, append a record for each drop with `basis` `confirmation`, label records without a `basis` as search-seed figures with the group's discovery seeds, and leave the rest of the file as it was. It SHALL edit the report named by `--report` (default `data/proposals/<area>.md`) to match, and a second run SHALL change nothing.

#### Scenario: Ids stay consecutive
- **WHEN** option p3 of five is dropped
- **THEN** the former p4 and p5 become p3 and p4, `optionComparisons` has one entry for each neighboring pair of the four, and reference options keep their ids

#### Scenario: Report follows the file
- **WHEN** an option is dropped from a file that has a report
- **THEN** the report's chosen options, comparison lines, all-traffic rows and finalist notes use the new numbers, the dropped option's note says why it is not published, and "Dropped for displacement" lists every record with its seeds

#### Scenario: Nothing to drop
- **WHEN** the rule drops nothing and every record already has a `basis`
- **THEN** neither the file nor the report is written

### Requirement: Period-specific checks and confirmation
Search and reference checks SHALL evaluate the baseline and proposed movement graph in each searched period. Publication and objective tags SHALL use confirmation health for the frozen shortlist.

#### Scenario: Closure leaves only a timed prohibited turn
- **WHEN** a package cuts the last available access in a searched period
- **THEN** the package fails the access check for that period

#### Scenario: Unhealthy confirmation
- **WHEN** a shortlisted option fails a required confirmation check
- **THEN** it cannot receive a winning objective tag

### Requirement: Reuse measured initial route costs
A search MAY share the baseline's measured initial route costs across packages of the same study, period and seed. Every scenario SHALL build its own initial state and give the same results as an independent warm-up.

#### Scenario: Parallel packages on one seed
- **WHEN** packages share the baseline cost measurement
- **THEN** vehicle states, link measurements and metrics match independently initialized runs

### Requirement: Finite-space search benchmark

The project SHALL provide a benchmark that evaluates every conflict-compatible package up to a declared depth in a frozen candidate set, using production evaluation and objective meanings. It SHALL report the best-score gap and nondominated coverage within that set, retain rejection reasons, and distinguish visited packages from forwarded finalists. Its inputs and protocol SHALL be recorded before scoring.

#### Scenario: Frozen protocol

- **WHEN** a benchmark starts
- **THEN** it records the candidate set, source and method identities, input hashes, run settings, budgets, and tie rules before evaluating candidates

#### Scenario: Search cannot inspect the reference results

- **WHEN** a heuristic is compared with exhaustive evaluation
- **THEN** its decisions use only its own charged evaluations and declared prior inputs, and the exhaustive results are used afterward to assess coverage

#### Scenario: Replay equals the live search

- **WHEN** a search is replayed against a finished table of the same inputs and run settings
- **THEN** it asks for the same packages in the same order and is charged the same simulations as the live search, and it receives only the rows it asks for

#### Scenario: Rejected combination

- **WHEN** an enumerated package fails conflict, access, or simulation checks
- **THEN** its identity and reason are retained, and the report distinguishes enumeration counts from simulation counts

#### Scenario: A bounded claim

- **WHEN** a search reaches the highest score in the benchmark
- **THEN** the result states the candidate set, depth, objective, model inputs, and evaluation settings, without claiming an optimum outside that scope or real-world validation

### Requirement: Candidate coverage is inspectable

A search benchmark SHALL compare its frozen candidates with the production generator by canonical effective intervention and record inclusion or exclusion reasons. Experimental supplementary closure candidates SHALL use the canonical legal movement graph, record their bypass or connectivity evidence, obey current intervention/profile rules, and pass the same package access checks as other candidates. Supplement generation SHALL be bounded and deterministic under recorded settings.

#### Scenario: Quiet bypass

- **WHEN** a legal bypass is absent from the baseline hotspot candidates
- **THEN** the coverage report records that omission and the supplementary generator can consider permitted closure candidates on that bypass without asserting a traffic volume from connectivity alone

#### Scenario: Equivalent intervention representations

- **WHEN** a supplementary candidate and a baseline candidate decode to the same effective intervention
- **THEN** the search evaluates one canonical candidate and records both origins

#### Scenario: Existing type restriction

- **WHEN** a supplementary candidate would violate an existing intervention eligibility rule
- **THEN** it is excluded with that reason unless the rule has been explicitly amended

### Requirement: Supplementary search can revisit pruned choices

The search SHALL support a bounded experimental supplement for deletions, replacements, and coordinated starts, including weak singles and alternative junction designs. It SHALL retain conflict, depth, access, and objective restrictions, deduplicate through the shared canonical package cache, and record its budget, deterministic ordering, evaluation origins, and stop reason.

#### Scenario: Weak alone and useful together

- **WHEN** a valid coordinated start includes an intervention that worsens through traffic alone
- **THEN** the supplement can evaluate the combination within its declared allowance rather than rejecting it solely because of the single-intervention result

#### Scenario: Junction variant depends on its neighbors

- **WHEN** the supplement proposes replacing an intervention with another permitted design at that junction
- **THEN** the candidate package can be evaluated even if the replacement lost the initial same-place ranking, and the package never contains both conflicting designs

#### Scenario: Off by default

- **WHEN** a search runs without the experimental supplement settings
- **THEN** its candidates, screening runs and options are those of the search without them, and a search that uses them records the settings with its results

#### Scenario: Deleting a change

- **WHEN** the supplement evaluates a finalist with one intervention removed
- **THEN** the smaller package uses the ordinary evaluator and can compete for the same eligible objectives

### Requirement: Search improvements use declared comparison budgets

A proposed production search change SHALL be evaluated against the unchanged search under a comparison protocol frozen before scoring. The protocol SHALL declare benchmark cases, prior known packages, budget allocation, charged simulation work, tie rules, and practical quality/runtime acceptance criteria. Cold discovery and known-package runs SHALL be reported separately. Exact reference evaluation MAY use more work but SHALL be labeled as the quality reference, not an equal-budget competitor.

#### Scenario: Added exploration costs more

- **WHEN** a supplementary method uses evaluations beyond the original search's allowance
- **THEN** the report labels that comparison as extra budget and includes an equal-budget comparison before claiming an algorithmic improvement

#### Scenario: Known packages differ

- **WHEN** two competitors receive different prior packages
- **THEN** the comparison is identified as differing prior information and is not presented as an equal-input search comparison

#### Scenario: Challenger fails the declared criteria

- **WHEN** a challenger does not meet the frozen quality/runtime criteria
- **THEN** production defaults remain unchanged and the result is retained with the benchmark evidence

### Requirement: Screening fidelity is measured separately

A search-method evaluation SHALL distinguish candidate omission, pruning, and screening versus full-hour ordering. Screening duration or seed-count changes SHALL record simulation cost and compare finalist retention and ordering against full-hour selection on unchanged inputs. Independent confirmation SHALL freeze the shortlist before reading unused seeds and retain every outcome under the existing paired-evidence contract.

#### Scenario: Screening and confirmation reverse two packages

- **WHEN** the screening winner has a lower score than another frozen package in confirmation
- **THEN** the report preserves both results, identifies the runs used for selection, and does not infer the best full-hour package across unconfirmed candidates

#### Scenario: Through difference remains unresolved

- **WHEN** paired confirmation cannot resolve the through-traffic difference between packages with different worst-block increases
- **THEN** the report states that uncertainty and the street-level tradeoffs without claiming equivalent through effects or improvement on every street

#### Scenario: Network extent changes

- **WHEN** a benchmark is repeated on another network extent or input identity
- **THEN** it has separate provenance and results, and the prior benchmark's numerical findings are not assigned to the new model

### Requirement: Proposal map selection is described in one detail box

The proposal card SHALL describe a selected street or change in its detail box only, and the card map SHALL NOT show a floating pop-up for it. Hovering, focusing or tapping a street or change on the map, or choosing it from a list, SHALL select it and update the box. The map SHALL keep a visible highlight on the selected street or change. The box SHALL be announced once when the selection changes.

#### Scenario: Hovering a street on the map

- **WHEN** a pointer enters a street on the card map
- **THEN** the street is highlighted, the detail box shows its figures, and no pop-up element is on the page

#### Scenario: Tapping a change marker

- **WHEN** a person taps a change marker on a touch screen
- **THEN** the marker is ringed, the box shows that change, and no pop-up element is on the page

### Requirement: Detail box figures are labeled in a table

The detail box SHALL show figures in a table with header cells, one figure per cell, a caption naming the period and unit once, and like-for-like quantities sharing a row or column. Figures SHALL be right-aligned with tabular numerals and the true minus sign, and the change column SHALL carry a sign. A footnote SHALL define through cars and name the run basis.

#### Scenario: Street columns and rows

- **WHEN** a street block is selected
- **THEN** the columns are today, with this proposal and change, and the rows are through cars plus, when the file has them, local trips and all cars

#### Scenario: Street with all cars

- **WHEN** a street block with published all-car figures is selected
- **THEN** the table has Through cars, Local trips and All cars rows, and each row's change equals its with-proposal figure minus its today figure

#### Scenario: Street without all cars

- **WHEN** a street block has no all-car figures in the file
- **THEN** the table has the Through cars row and the box says all cars are not in the published file

#### Scenario: Narrow screen

- **WHEN** the viewport is 360 px wide
- **THEN** the box fits without horizontal page scroll

### Requirement: Proposal card map shows all cars on each block

When a proposal carries an all-car picture, the card map SHALL color each block, and number the largest gain and drop, by the change in all cars an hour for the shown period, mean of the runs. The legend and the map's text alternative SHALL say so.

#### Scenario: Legend

- **WHEN** the map shows all cars
- **THEN** the legend says colors and numbers are the change in all cars an hour on each block, and that the card headline counts through cars over the whole area

#### Scenario: Map number equals box cell

- **WHEN** a block carries a number on the map
- **THEN** it equals the All cars Change cell of that block's detail box

#### Scenario: Through cars rise less than all cars

- **WHEN** a block's through cars go 20 → 90 and its all cars go 38 → 284
- **THEN** the map colors it by +246 and labels +246, and the box shows Through cars +70, Local trips +176 and All cars +246

#### Scenario: Through cars fall while all cars rise

- **WHEN** a block's through cars fall and its all cars rise
- **THEN** the map colors it as a rise and the box's Through cars row shows the fall

#### Scenario: Older file

- **WHEN** a proposal has no all-car picture
- **THEN** the map is drawn by through cars and the legend says the file has no all-car map

### Requirement: Proposal cards have readable anchors

A proposal card SHALL be addressable by the fragment `proposal-<n>` for option p<n> of the default group, `proposal-<reference id>` for a reference, and `proposal-<group id>-<n or reference id>` for any other group. An address that uses an older card id SHALL open the same card and be rewritten to the new fragment without a reload.

#### Scenario: Default group option

- **WHEN** a person opens `/proposals#proposal-1` or `/proposals#unconstrained-p1`
- **THEN** the page scrolls to card 1 and the address bar shows `#proposal-1`

#### Scenario: Reference proposal

- **WHEN** a reference with id `earlier-62nd-diverters` is listed
- **THEN** its card is `#proposal-earlier-62nd-diverters`

### Requirement: Shared images show all cars like the card map

The Download image picture and the link-preview card of a proposal with an all-car picture SHALL color and number blocks by the change in all cars an hour, with the card map's data, scale, label rule and rounding. Captions, legend text and text alternatives SHALL say all cars. The headline SHALL stay the through-car figure, worded so it does not imply the map shows through cars.

#### Scenario: Download image legend

- **WHEN** Download image is pressed for a proposal with an all-car picture
- **THEN** the caption and legend say change in all cars an hour, the key names the biggest gain and drop in all cars, and the legend says the headline counts through cars over the whole area

#### Scenario: Number matches the card

- **WHEN** a block is numbered on the card map, the downloaded image or the preview card
- **THEN** all three show the same number, equal to the All cars Change cell of its detail box

#### Scenario: Preview card

- **WHEN** a preview card is built for a proposal with an all-car picture
- **THEN** the legend chip says all cars, the two labeled outlines are drawn without street names, the headline figure is the through-car figure, and the image alt text names the labeled blocks and their numbers

#### Scenario: Older file

- **WHEN** a proposal has no all-car picture
- **THEN** the image and the preview draw through cars with the through-car legend and alt text

### Requirement: Stored route samples do not depend on run order
The stored links of each route SHALL come from the lowest seed whose run drove that street list, so the file is the same for any `--jobs` value and any order in which seed results finish. Counts, per-hour figures and shares SHALL NOT depend on the sample.

#### Scenario: Arrival order
- **WHEN** the same seed results arrive in two different orders
- **THEN** the stored routes and their links are identical

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

### Requirement: Entry movements are derived from the network
`tools/turn-ban-sets.ts` SHALL list the entry movements of a study area from its network file alone. An entry movement SHALL be a turn from a link that is not a residential or service link inside the study area onto one that is, where the source link lies on a bounding street or outside the study area and the turn does not return to the node the source link came from. No study area or street SHALL be named in code.

#### Scenario: A movement from a bounding street
- **WHEN** a link of a bounding street meets a residential link inside the study area at a node
- **THEN** the turn from the first onto the second is an entry movement with that street as its bounding street, and the turn from the residential link back onto the bounding street is not

#### Scenario: A movement from outside
- **WHEN** an outside residential link meets an in-study residential link at a node on the study-area edge
- **THEN** the movement is an entry movement of kind `outside`, and it is straight-across when the two links continue each other

### Requirement: Bounding streets are read from the network
A bounding street SHALL be an in-study link that is not residential or service, taken with the other links of its name. An outside link with a bounding street's name SHALL count as on that street, and an outside link with another name SHALL be an outside source.

#### Scenario: Continuation outside the area
- **WHEN** a link outside the study area has the name of an in-study bounding link
- **THEN** a movement from it onto an interior street has that bounding street

### Requirement: Entry movements are classified
The tool SHALL classify each entry movement by its bounding street, its side of the study area, its turn (left, right or straight-across, by `turnKindOf`), the interior street it enters and whether the base network already bans it. It SHALL treat local links with one name that share intersections as one interior street, and SHALL mark an interior street as a through street when it touches two different bounding streets.

#### Scenario: Already banned
- **WHEN** the network file bans a movement in every period
- **THEN** it is listed with that base ban and is left out of every package

#### Scenario: Through street
- **WHEN** an interior street touches two bounding streets and another touches one
- **THEN** the first is a through street and the second is not

### Requirement: Turn-ban packages are named sets of entry bans
The tool SHALL write these packages: every entry movement, every left and right turn, every left and right turn except those that would strand a node, left turns, right turns, every turn from each bounding street, every turn onto the through streets, every movement onto the through streets, and, when a ranking of the search's turn-ban candidates is given, the first k of them for k of 3, 5 and 10. It SHALL report for each the count of bans and the streets involved.

#### Scenario: Straight-across movements stay open
- **WHEN** the package of every entry turn is written
- **THEN** it holds no straight-across movement

#### Scenario: Turns that would strand a node
- **WHEN** banning every entry turn leaves an in-study node with no way in that the base network does not already lack
- **THEN** the package of turns that strand no node leaves out the turns onto the street next to that node and lists them

#### Scenario: No ranking
- **WHEN** no ranking of turn-ban candidates is given
- **THEN** no top-k package is written and the table says why

### Requirement: Package links are written and checked by the repository's encoder
Each package SHALL be written as a scenario link made by `encodeScenario` and decoded by `decodeScenario` to the same set of bans, with no unplaced item and no more than 200 items. A movement whose link item does not decode to itself SHALL be left out of every package and reported. The tool SHALL write nothing under `public/data` or `data`.

#### Scenario: Link round trip fails
- **WHEN** a package's link does not decode to the package's bans
- **THEN** the tool names the package and exits with an error

#### Scenario: Movement that does not decode
- **WHEN** a movement's link item decodes to another movement
- **THEN** the movement is in no package and the table lists it

### Requirement: Experiment output never replaces a published file
The scripts of an experiment on turn-ban packages SHALL check the published inputs (network, demand, proposals file, seeds file and simulator fingerprint) before running and the published files after each step. They SHALL pass `--known` a scratch copy of the seeds file whose `cap` leaves the published seeds in place, SHALL write the search's proposals file and report under `target/`, and SHALL NOT publish, upload or push data.

#### Scenario: A package larger than the search depth
- **WHEN** a package has more bans than `--depth`
- **THEN** it is measured with `explore --check` and is not added as a seed, and the log says why

#### Scenario: Seeds file at its cap
- **WHEN** a hand seed is added to a scratch copy of a seeds file that already holds its cap
- **THEN** the scratch copy's cap is raised first so that no published seed is dropped

#### Scenario: Published file changed
- **WHEN** a step ends and the proposals file or the seeds file differs from its published hash
- **THEN** the log says the run is not to be used and the script stops

### Requirement: Experiment results are labeled and left to the project lead
Results of the experiment SHALL be reported as a model that is not calibrated, with bans applying to every vehicle in every period and compliance assumed complete. A changed top proposal, or a change of more than 15% in a headline figure, SHALL be left to the project lead's decision, and nothing SHALL be published from the experiment without it.

#### Scenario: Different top option
- **WHEN** the search with turn-ban seeds ends with a top option whose interventions differ from the published one's
- **THEN** the summary says so and the decision is the project lead's

### Requirement: Ban sets are candidates behind a flag
With `--ban-sets` the search SHALL add ban-set candidates after the generated ones. Without it the candidate list, the search and every output SHALL be what they were without the feature. A ban set SHALL be one candidate, and depth, beam width and the number-of-interventions objective SHALL count it as one intervention.

#### Scenario: Flag off
- **WHEN** the search runs without `--ban-sets`
- **THEN** its candidates are those of the generator, and its proposals file is byte-identical to the one the same search made before the feature

#### Scenario: Flag on
- **WHEN** the search runs with `--ban-sets`
- **THEN** the single candidates keep their indices, the ban sets follow them, and a package of a ban set and five other changes has six interventions

### Requirement: Ban sets are derived from the network
The ban sets SHALL be made from the network file alone and SHALL hold entry turns only: left and right turns from a bounding street or from outside the study area onto a residential or service street inside it. They SHALL be the left turns, the right turns, all turns (and a variant that keeps access), the turns onto the through streets, and each street's turns and left turns. No street SHALL be named in code.

#### Scenario: Counts on the study-area network
- **WHEN** the sets are generated for the Rockridge network over its three periods
- **THEN** there are 53 entry movements, the left-turn set has 21 bans, the right-turn set 22, the access-safe all-turns set 41, the through-streets set 19, and the sets of Alcatraz, Claremont and College Avenues 6, 12 and 4

#### Scenario: Same movements as the TypeScript generator
- **WHEN** the Rust sets and the packages of `tools/turn-ban-sets.ts` are compared on one network
- **THEN** each pair that both define holds the same movements

### Requirement: Invalid and repeated ban sets are dropped
A ban set that strands an in-study node in a searched period SHALL be dropped with the access reason, like any other invalid candidate. A set equal to an earlier one SHALL be merged into it. A set of fewer than two bans SHALL not be a set. A movement banned in the base network in every searched period, or whose link item does not decode to itself, SHALL be in no set.

#### Scenario: A set that strands a node
- **WHEN** banning every entry turn leaves an in-study node with no way in
- **THEN** that set is dropped with the node named, and the access-safe set leaves out the turns onto the street next to it

#### Scenario: Two names for one set
- **WHEN** the left turns of the only bounding street are the left-turn set
- **THEN** the per-street set is merged into the earlier one and reported as the same bans

### Requirement: A ban set is listed in full wherever the package is shown
The scenario link of a package SHALL list every ban of every ban set in it, and the access check and the simulation SHALL apply every one. The report and the proposals file SHALL say how many individual turn bans the package holds: an optional `bans` on each ban-set entry of `interventions` and an optional `turnBans` on the proposal, absent for a package without a ban set. A reader of the proposals file SHALL read a file that has neither as before.

#### Scenario: A package of a set and a filter
- **WHEN** an option holds a 21-ban set and one filter
- **THEN** it lists two interventions, `turnBans` is 21, its link has 22 items, and the card's changes list says that the set is one change of 21 turn bans

#### Scenario: An older file
- **WHEN** the app reads a proposals file with no `bans` or `turnBans`
- **THEN** it shows the changes as before

### Requirement: A link that holds a whole ban set reads as the set
With ban sets on, the turn bans of a decoded seed or checked link that make up a whole generated set SHALL be folded into that set, the largest first, and the bans that are not part of a whole set SHALL stay single.

#### Scenario: Part of a set
- **WHEN** a link holds 2 of the 3 bans of a set
- **THEN** they stay two single turn bans

### Requirement: Ban sets can be listed without a search
`explore --list-ban-sets FILE` SHALL write the ban sets of a study area (id, label, bans, movements and link), the sets it dropped with the reason, and the entry movements, and SHALL simulate nothing.

#### Scenario: List
- **WHEN** it runs on a network
- **THEN** the file lists each set and each dropped set, and nothing else is written

### Requirement: Results of a ban-set search are left to the project lead
The scripts of an experiment on ban sets SHALL check the published inputs and the simulator fingerprint before running and the published files after each step, SHALL write the search's output under `target/`, and SHALL NOT publish, upload or push data. A different top option, a top option more than 15 points from the published one, or any package that beats the published top option on the same seeds SHALL be left to the project lead.

#### Scenario: A different top option
- **WHEN** the search with ban sets ends with a top option whose interventions differ from the published one's
- **THEN** the summary says so and the decision is the project lead's

### Requirement: The best package without turn bans is always in the list
The search SHALL choose, for the objective `no-turn-bans` (label "no turn restrictions"), the package with the largest score among the rechecked packages that hold no turn ban, neither a ban set nor a single ban. The choice SHALL apply the main choice's rules inside that family only, so a package with turn bans SHALL NOT dominate, fold or displace it, and it SHALL NOT be dropped as an untagged option.

#### Scenario: A ban package dominates the filter package
- **WHEN** a package with a ban set removes more through cars than the best filter-only package, with no more changes and a smaller rise on one block
- **THEN** the filter-only package is still listed, tagged `no-turn-bans`, next to the ban package

#### Scenario: The top option has no bans
- **WHEN** the best package overall holds no turn ban and another option in the list does
- **THEN** it is listed once with the tags for most cut-through removed and no turn restrictions, and no duplicate option appears

#### Scenario: No ban in the list
- **WHEN** no option in the finished list holds a turn ban
- **THEN** no option carries the `no-turn-bans` tag

#### Scenario: Cheap packages stay
- **WHEN** a ban package with one ban set (left turns alone) is the best of its objective
- **THEN** the new objective does not remove it from the list

### Requirement: The objective for no turn bans has its own beam
The beam for `no-turn-bans` SHALL combine only candidates that are not turn bans or ban sets and SHALL share the screening cache. The objective SHALL be part of `--objectives all`. The recorded cases of the search benchmark SHALL keep their four objectives.

#### Scenario: Beam candidates
- **WHEN** the beam for `no-turn-bans` grows a package
- **THEN** no candidate of kind turn ban or ban set is added to it

### Requirement: The published search includes ban sets
The published search command SHALL include `--ban-sets`. The flag SHALL stay explicit, and a search without it SHALL make the candidate list and the output of the earlier files, so files written before the flag reproduce from their recorded settings.

#### Scenario: Older file
- **WHEN** a proposals file written before ban sets is reproduced from its recorded settings
- **THEN** the search runs without `--ban-sets` and its candidates are those of that file

### Requirement: The no-ban package that removes the most is also in the list
The search SHALL choose, for the objective `most-removed-no-turn-bans` (label "most cut-through removed without turn restrictions"), the rechecked package with the largest through-car reduction among those that hold no turn ban, after the main choice's rules applied inside that family. Ties SHALL go to fewer changes, then the earlier finalist. Its winner SHALL NOT be dropped by the displacement rule.

#### Scenario: The score prefers a smaller reduction
- **WHEN** the best-scoring package without bans removes fewer through cars than another package without bans that rises more on one block
- **THEN** both are listed, the first tagged `no-turn-bans` and the second `most-removed-no-turn-bans`

#### Scenario: Same package
- **WHEN** one package is the best-scoring and the largest reduction among packages without bans
- **THEN** it is listed once with both tags

#### Scenario: No ban in the list
- **WHEN** no option in the finished list holds a turn ban
- **THEN** no option carries the `most-removed-no-turn-bans` tag

### Requirement: The most-removed objective without bans adds no search
The objective `most-removed-no-turn-bans` SHALL grow no beam and SHALL NOT change the screening runs, the candidate budgets, the seeds or the finalist set; it SHALL choose among the finalists that exist. Its winner SHALL be confirmed on the confirmation seeds like every chosen option.

#### Scenario: Screening unchanged
- **WHEN** the search runs with `--objectives all`
- **THEN** the objectives that grow a beam are the five of the earlier list, and the finalists are those of a run without the sixth objective
