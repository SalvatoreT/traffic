## ADDED Requirements

### Requirement: Objective tags on proposal cards
A proposal card SHALL show a tag row under the title, "Best for: " followed by the objectives the option is best for, in the order most cut-through removed, no street closures, least detour for residents, fewest changes. An option with no tags SHALL show no row. The text pages and the link-preview text SHALL carry the same words.

#### Scenario: Tags
- **WHEN** an option is the best for two objectives
- **THEN** its card shows both after "Best for:"

#### Scenario: Older file
- **WHEN** a file has no objectives
- **THEN** the card shows no tag row

### Requirement: Residents' detour on proposal cards
A proposal card SHALL show residents' detour as seconds per resident trip with its interval. The Methodology page SHALL say in one plain sentence that options are chosen for different goals and tagged.

#### Scenario: Detour line
- **WHEN** an option has a recorded detour
- **THEN** its card shows seconds per resident trip and the interval over runs
