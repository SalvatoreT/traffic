## ADDED Requirements

### Requirement: Tab URLs
The path SHALL name the tab: `/` is the Map, and `/proposals`, `/streets`, `/assumptions` and `/sources` are the others, each derived from the tab's id. Loading any of those paths SHALL open that tab. A path that names no tab SHALL open the Map and the address SHALL be corrected to `/`.

#### Scenario: Direct load
- **WHEN** a person opens `/assumptions` directly
- **THEN** the Assumptions tab is open, its link is marked as the current page and the title starts with "Assumptions"

#### Scenario: Unknown path
- **WHEN** a person opens `/nope`
- **THEN** the Map is open and the address reads `/`

### Requirement: Tab links
The tabs SHALL be links to their paths. A plain click SHALL stay in the page and add a history entry, so Back and Forward move between tabs; a click with a modifier key or another button SHALL be left to the browser. The current tab's link SHALL carry `aria-current="page"`.

#### Scenario: Back and Forward
- **WHEN** a person opens Proposals, then Streets, then presses Back
- **THEN** Proposals is open and the address is `/proposals`; Forward returns to Streets

#### Scenario: Open in a new tab
- **WHEN** a person middle-clicks the Sources link
- **THEN** the browser opens `/sources` in a new tab and the current page does not change

### Requirement: Document title
The document title SHALL name the tab and the area, as in "Proposals · Traffic: Rockridge Trapezoid", and SHALL change with the tab.

#### Scenario: Title follows the tab
- **WHEN** a person moves from the Map to Sources
- **THEN** the title changes from "Map · Traffic: Rockridge Trapezoid" to "Sources · Traffic: Rockridge Trapezoid"

### Requirement: Fragment is the scenario or a section anchor
A fragment that is `#v1` or begins `#v1;` SHALL be a scenario on any tab path, and existing links, QR codes and stored-result keys SHALL work unchanged on `/` and on every tab path. Any other non-empty fragment SHALL be a section anchor on the current tab, and SHALL NOT be reported as a scenario that could not be read. A URL whose fragment is an anchor SHALL open with no scenario.

#### Scenario: Scenario on another tab
- **WHEN** a person opens `/streets#v1;a=rockridge;s=…`
- **THEN** the Streets tab opens with that scenario applied, and switching to Sources and then Map keeps the scenario fragment in the address

#### Scenario: Old link
- **WHEN** a person opens `/#v1;a=rockridge;s=…`
- **THEN** the Map opens with the scenario, as before

#### Scenario: Anchor does not read as a bad link
- **WHEN** a person opens `/assumptions#why-cars-cut-through`
- **THEN** no "link couldn't be read" notice appears and the baseline is shown on the Map tab

### Requirement: The scenario survives navigation
Switching tabs SHALL keep the scenario fragment in the address whenever a scenario exists. Following an anchor link SHALL replace the fragment with the anchor while the scenario stays in the app, and the scenario fragment SHALL return when the person goes to a tab without an anchor or changes the scenario. Back and Forward between tabs SHALL NOT replace the scenario the app holds with one read from an older history entry.

#### Scenario: Back after an anchor
- **WHEN** a person with a scenario follows an anchor link on Sources and presses Back
- **THEN** the scenario fragment is in the address again and the scenario is unchanged

### Requirement: Section anchors
Every section heading on the Proposals, Assumptions, Sources and Streets tabs SHALL have an id that is a slug of its heading or a data id, unique on the page and stable across reloads and data rebuilds. A proposal card SHALL use its group's id and the proposal's id, a reason card its reason id, a movement card its movement id and a source its citation key. Ids used before this change (`ref-intents`, `ref-movements`, `ref-calibration`, `ref-<citation key>`) SHALL still reach their sections.

#### Scenario: Old id
- **WHEN** a person opens `/assumptions#ref-intents`
- **THEN** the address is corrected to `#why-cars-cut-through` and that section is shown

### Requirement: Opening an anchor
Opening a URL with an anchor SHALL wait for the section to render, scroll its heading to the top of the view below the top bar, respecting `prefers-reduced-motion`, and move focus to the heading. Scrolling SHALL stop when the person scrolls, types or touches the page.

#### Scenario: Cold load on a reason
- **WHEN** a person opens `/assumptions#reason-<id>` on a phone
- **THEN** that reason's heading is in view below the top bar and holds focus

#### Scenario: Cold load on a proposal
- **WHEN** a person opens `/proposals#<group>-<proposal>` before the proposals file has loaded
- **THEN** the page scrolls to that card once it renders

### Requirement: Anchor link control
Each anchored heading SHALL have a link control, named "Link to this section: <heading>", at least 24 by 24 CSS px, shown on hover and focus and always shown on devices without hover. It SHALL set the address to the section, copy the full URL to the clipboard and say "Link copied" in a polite status region. The control SHALL be reachable by keyboard with a visible focus indicator and SHALL NOT shift the layout when it appears.

#### Scenario: Copying a section link
- **WHEN** a person presses the control beside a heading
- **THEN** the address reads `<tab path>#<id>`, the clipboard holds the full URL and "Link copied" is announced

### Requirement: Internal links use tab URLs
"About these reasons" SHALL link to `/assumptions#why-cars-cut-through`, citations in Results to `/sources#<key>`, the Sources and Assumptions pointers to each other's paths, and the calibration banner's "Details" to `/sources#calibration`. "Copy link to this scenario" SHALL copy the current tab's path with the scenario fragment. The proposal image's QR code and short URL SHALL still point at `/` with the scenario fragment.

#### Scenario: Copy link on Streets
- **WHEN** a person copies the scenario link on the Streets tab
- **THEN** the copied address is `/streets` followed by the scenario fragment

### Requirement: Tab paths are served as the app
A direct request for a tab path SHALL return the app with status 200, and so SHALL any other path that is not under `/api/` or `/data/`, after which the app shows the Map and corrects the address. A missing file under `/data/` SHALL still return a 404 JSON body.

#### Scenario: Request for /proposals
- **WHEN** a browser requests `/proposals`
- **THEN** the response is the app page with status 200
