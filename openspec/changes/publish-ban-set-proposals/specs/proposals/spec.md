## MODIFIED Requirements

### Requirement: Options are chosen for named objectives
The search SHALL choose the published options for six objectives, each a documented rule with its weights labeled assumptions: most cut-through removed, no street closures, least detour for residents, fewest changes, no turn restrictions and most cut-through removed without turn restrictions. Each objective except the last SHALL grow its own beam over the shared screening cache, finalists SHALL be pooled and rechecked together, and each option SHALL name the objectives it is the best for. The list SHALL stay one list, largest through-car removal first.

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
