# simulator-ui Specification

## Purpose
What the web interface shows and lets people do: watch traffic, edit a scenario, compare it with the baseline and share it.

## Requirements

### Requirement: Live traffic map
The UI SHALL show the study area's streets with moving vehicles, signal states and a per-street overlay selectable between flow, speed and cut-through volume, with OpenStreetMap attribution.

#### Scenario: Opening the app
- **WHEN** a user opens the app
- **THEN** the Rockridge network loads and vehicles begin moving without further input

### Requirement: Playback control
Users SHALL be able to pause, resume, change simulation speed, choose the time period and reset.

#### Scenario: Reduced motion
- **WHEN** the user's system prefers reduced motion
- **THEN** the simulation starts paused and the overlay conveys traffic state without animation

### Requirement: Intervention editing
Users SHALL be able to add an intervention by first selecting a street block or intersection, on the map or from a searchable list, and then choosing from the interventions that apply to that place, and SHALL be able to review and remove interventions from a list and from the selected place.

#### Scenario: Keyboard-only editing
- **WHEN** a user operates the app with only a keyboard
- **THEN** they can add and remove every intervention type

#### Scenario: Selecting a street on the map
- **WHEN** a user clicks a street block on the map
- **THEN** the block is highlighted and a menu offers the interventions that apply to a street, along with any already on that block

#### Scenario: Selecting an intersection
- **WHEN** a user selects an intersection
- **THEN** the menu offers only interventions that apply to an intersection

#### Scenario: Phone
- **WHEN** a user taps a street on a phone
- **THEN** the choices appear in the bottom sheet, which rises so they are visible

#### Scenario: Dismissing a selection
- **WHEN** a user presses Escape or selects empty map
- **THEN** the selection clears and focus returns to where it was

### Requirement: Baseline comparison
The UI SHALL show the scenario's metrics beside the baseline's for the same period, seed and simulated duration, with the direction and size of change stated in text.

#### Scenario: After adding a modal filter
- **WHEN** a scenario has run for the comparison window
- **THEN** cut-through, safety and delay metrics show baseline, scenario and difference

### Requirement: Accessibility
The UI SHALL meet WCAG 2.2 AA: full keyboard operation with visible focus, labeled controls, 4.5:1 text contrast in light and dark themes, color never the sole carrier of meaning, and a text/table alternative for information shown only on the map.

#### Scenario: Screen reader user
- **WHEN** a screen reader user explores results
- **THEN** a table lists streets with their flow, speed and cut-through values and metric updates are announced politely

### Requirement: Sources visible
The UI SHALL provide a page listing the research references and data sources behind the model.

#### Scenario: Viewing sources
- **WHEN** a user opens "Sources"
- **THEN** they see the bibliography and data provenance with links

### Requirement: Location-based scenario links
Shareable scenario links SHALL encode each intervention by geographic location (a 10-character geohash, about 1 m), with a bearing where direction matters, together with the area id and a format version, and SHALL NOT depend on network link or node indices.

#### Scenario: Network regenerated
- **WHEN** a link is opened after the street network has been rebuilt with different link and node indices
- **THEN** each intervention is restored on the same street block or intersection as before

#### Scenario: Location no longer exists
- **WHEN** an intervention's location has no matching street or intersection within tolerance
- **THEN** the rest of the scenario loads and the unplaced intervention is listed with an explanation

#### Scenario: Unreadable link
- **WHEN** a link has an unknown version, an unknown area or a malformed item
- **THEN** the baseline loads and a short dismissible notice says the link couldn't be read

### Requirement: Offering the diagonal diverter
The UI SHALL offer a diagonal diverter when a four-leg intersection is selected, as two choices labeled by the streets that stay connected, and SHALL draw the diverter on the map along its barrier line.

#### Scenario: Four-leg intersection
- **WHEN** a user selects an intersection with four legs
- **THEN** the menu offers two diagonal diverter options, each naming the two pairs of streets that remain connected

#### Scenario: Other intersections
- **WHEN** a user selects an intersection with three or five legs
- **THEN** the diagonal diverter is not offered

#### Scenario: Shared link
- **WHEN** a link containing a diagonal diverter is opened
- **THEN** the diverter is restored at the same intersection with the same orientation
