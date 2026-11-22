## MODIFIED Requirements

### Requirement: Packages are no larger than the search depth
No package the search builds SHALL have more interventions than `--depth`, and a seed with more SHALL be dropped with that reason. A ban set counts as one intervention, however many turn bans it holds.

#### Scenario: Large seed
- **WHEN** a seed has ten interventions and the depth is 6
- **THEN** it is not rechecked and the run reports that it has more interventions than the search depth

#### Scenario: A seed made of a ban set and a filter
- **WHEN** ban sets are on and a seed link holds the 21 turn bans of a generated set and one modal filter, and the depth is 6
- **THEN** the seed has two interventions, is rechecked, and starts a beam

## ADDED Requirements

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
