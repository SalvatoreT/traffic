## ADDED Requirements

### Requirement: Preview areas
An area config SHALL be able to mark the area as a preview. The importer SHALL copy the flag into `areas.json` and list preview areas after the others. The app SHALL never open a preview area by default; a scenario link that names it SHALL open it.

#### Scenario: Plain visit
- **WHEN** a visitor opens the site without a scenario link and `areas.json` lists a public area and a preview area
- **THEN** the app opens the public area

#### Scenario: Link to the preview
- **WHEN** a scenario link names the preview area with `a=<id>`
- **THEN** the app opens the preview area
