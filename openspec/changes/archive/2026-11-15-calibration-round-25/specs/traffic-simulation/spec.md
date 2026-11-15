## ADDED Requirements

### Requirement: A debug dump lists the trails of trips that use given links
`calibrate` SHALL write, when `CAL_DUMP_PATH_TRIPS` names a file and `CAL_PATH_LINKS` lists link ids, one line per completed trip that used any of those links, with its identifier, origin, destination, whether the driver was guided and its whole trail. The dump SHALL not change the run.

#### Scenario: Trips on a street
- **WHEN** the links of one street are listed
- **THEN** the file has a line for each completed trip that drove any of them, with the links in driving order
