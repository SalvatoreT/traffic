# simulator-ui Specification

## Purpose
TBD - created by archiving change rockridge-vehicle-microsim. Update Purpose after archive.

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
Users SHALL be able to add an intervention by choosing a tool and selecting a street or intersection on the map or from a searchable list, and to review and remove interventions from a list.

#### Scenario: Keyboard-only editing
- **WHEN** a user operates the app with only a keyboard
- **THEN** they can add and remove every intervention type

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
