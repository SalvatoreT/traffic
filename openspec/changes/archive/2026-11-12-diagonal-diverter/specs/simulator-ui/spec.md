## ADDED Requirements

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
