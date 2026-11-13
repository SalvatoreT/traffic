## ADDED Requirements

### Requirement: An observed timing can name one side of a street and give it its own phase
A signal observation in the area config MAY carry the compass heading of the approach it is about, so that it applies to the links of the street that arrive on that heading only, and MAY mark the approach as running in a phase of its own. Observations of one signal with the same periods and cycle SHALL be written to the network as one timing with several approaches.

#### Scenario: Two sides of one street
- **WHEN** two observations name the same street at one signal with headings 80 and 260 degrees and their own greens
- **THEN** the node carries one timing whose two approaches hold the eastbound and the westbound link and their greens

### Requirement: Drive-through ways are not streets
The importer SHALL leave out service ways tagged as parking aisles, driveways or drive-through lanes [OSMService].

#### Scenario: A drive-through between two streets
- **WHEN** a way tagged `service=drive-through` connects two streets
- **THEN** the network has no link for it and no route can pass through it
