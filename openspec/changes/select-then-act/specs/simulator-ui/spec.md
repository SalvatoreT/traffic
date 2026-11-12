## MODIFIED Requirements

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
