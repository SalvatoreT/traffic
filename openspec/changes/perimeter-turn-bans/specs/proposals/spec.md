## ADDED Requirements

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
