## ADDED Requirements

### Requirement: Methodology tab
The app SHALL have a top-level Methodology tab at `/methodology`, between Streets and Assumptions. It SHALL explain in plain language, in about 450 to 650 words and with no equations, how the simulation and its proposals are made and what the results cannot tell you. It SHALL name the study area and read the calibration status and note from the area data, stating no calibration figure of its own.

#### Scenario: Direct load
- **WHEN** a person opens `/methodology`
- **THEN** the Methodology tab is open and its sections have anchors named after their headings

#### Scenario: Calibration status is read, not written
- **WHEN** the area's calibration status or note changes
- **THEN** the Checking the model section shows the new status and note with no change to the page's copy

#### Scenario: Diagrams
- **WHEN** the page is read
- **THEN** it has three inline SVG diagrams (a four-step pipeline, a schematic of three trips against the study area, a five-step flow), each with `role="img"`, a title and description and the same information in the text beside it, drawn in theme colors with the trips told apart by line style as well as color, with no animation

#### Scenario: Phone
- **WHEN** the page is opened on a phone
- **THEN** the diagrams stack, nothing scrolls sideways and the tab row still scrolls

#### Scenario: Text page
- **WHEN** the text pages are generated
- **THEN** `/methodology.md` carries the same copy and the diagrams' descriptions, and `llms.txt` links it

## MODIFIED Requirements

### Requirement: Tab URLs
The path SHALL name the tab: `/` is the Map, and `/proposals`, `/streets`, `/methodology`, `/assumptions` and `/sources` are the others, each derived from the tab's id. Loading any of those paths SHALL open that tab. A path that names no tab SHALL open the Map and the address SHALL be corrected to `/`.

#### Scenario: Direct load
- **WHEN** a person opens `/assumptions` directly
- **THEN** the Assumptions tab is open, its link is marked as the current page and the title starts with "Assumptions"

#### Scenario: Unknown path
- **WHEN** a person opens `/nope`
- **THEN** the Map is open and the address reads `/`

### Requirement: Assumptions tab
The app SHALL have a top-level Assumptions tab between Methodology and Sources. It SHALL open by saying its contents are the judgment calls in the model, the parts that rest on reasoning and not on a count, that they are the first things to question and that changing them would change the results, and it SHALL link to Sources for the measured inputs.

#### Scenario: Tab order
- **WHEN** the navigation is read in order
- **THEN** it lists Map, Proposals, Streets, Methodology, Assumptions, Sources, and all six fit on a phone without a horizontal page scroll

#### Scenario: Pointer from Sources
- **WHEN** a person opens Sources
- **THEN** a line says the judgment calls are on the Assumptions tab and links to it, and the assumed-movement provenance entry is not listed there
