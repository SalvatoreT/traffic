## MODIFIED Requirements

### Requirement: Options are chosen for named objectives
The search SHALL choose the published options for five objectives, each a documented rule with its weights labeled assumptions: most cut-through removed, no street closures, least detour for residents, fewest changes and no turn restrictions. Each objective SHALL grow its own beam over the shared screening cache, finalists SHALL be pooled and rechecked together, and each option SHALL name the objectives it is the best for. The list SHALL stay one list, largest through-car removal first.

#### Scenario: One package, two objectives
- **WHEN** the same package is the best for most cut-through removed and for fewest changes
- **THEN** it appears once, with both tags

#### Scenario: Remaining places
- **WHEN** fewer options than the list size are objective winners
- **THEN** the rest are the best remaining by through cars removed that are not similar to an option already chosen

## ADDED Requirements

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
