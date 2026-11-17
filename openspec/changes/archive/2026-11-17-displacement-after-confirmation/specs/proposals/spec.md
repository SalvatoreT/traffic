## MODIFIED Requirements

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

## ADDED Requirements

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
