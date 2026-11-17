## ADDED Requirements

### Requirement: Proposal selection keeps desktop lists stationary

For fixed viewport dimensions and proposal data, hovering or focusing a street or intervention in the desktop proposal card SHALL update its map selection and details without changing the position or dimensions of the street and intervention lists. Selected text SHALL retain its unselected font dimensions. Details that exceed the reserved space SHALL remain readable through a named, keyboard-focusable scrolling panel with visible focus.

#### Scenario: Hovering a street

- **WHEN** a pointer enters a street name, remains stationary, and then leaves
- **THEN** the details update and clear as appropriate while the list and its rows retain their geometry

#### Scenario: Long selected names

- **WHEN** a long street or intervention name is selected by pointer or keyboard
- **THEN** selection styling does not change its wrapping or move neighboring entries

#### Scenario: Overflowing details

- **WHEN** the selected intervention's details exceed the desktop panel's reserved height
- **THEN** all content remains reachable by pointer and keyboard scrolling without expanding the panel or moving the lists

#### Scenario: Mobile layout

- **WHEN** the viewport uses the mobile proposal layout
- **THEN** details retain their natural height and narrow street tables retain full-width street names with labeled figures underneath
