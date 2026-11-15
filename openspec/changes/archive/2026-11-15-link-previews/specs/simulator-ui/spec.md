## ADDED Requirements

### Requirement: Share paths for published proposals
Every published proposal SHALL have a stable path `/p/<slug>` that does not depend on its position in the file. Opening it SHALL open the Map with the proposal's scenario and period as its scenario link does, and an unknown slug SHALL open the Proposals tab with a notice that the proposal is no longer published. Cards, the picture's QR code and the Map's "Copy link to this scenario" for a scenario equal to a published proposal SHALL give the share path.

#### Scenario: Opening a share path
- **WHEN** a person opens `/p/<slug>` of a published proposal
- **THEN** the Map shows that proposal's interventions in its period and the address bar shows the scenario link

#### Scenario: Retired slug
- **WHEN** a person opens a slug that is not in the proposals file
- **THEN** the Proposals tab opens with "That proposal is no longer published."

### Requirement: Link previews
The server SHALL return, for `/`, each tab path and `/p/<slug>`, the app page with a title, description, canonical link, Open Graph tags and a large Twitter card for that path, with an absolute image URL of a 1200x630 JPEG.

#### Scenario: Proposal preview
- **WHEN** a crawler requests a published `/p/<slug>`
- **THEN** the HTML carries the proposal's title, description and card image, with all index text escaped

### Requirement: Previews state what the figures are
A proposal's preview SHALL state its like-for-like through-car figure, its changes and that it is a simulation, not a forecast, and show its map. It SHALL NOT present uncalibrated results as validated, and none SHALL be written for a group computed on inputs other than those now served.

#### Scenario: Stale group
- **WHEN** a group was computed on another network or demand
- **THEN** no card is written for its proposals and the generator lists them as skipped
