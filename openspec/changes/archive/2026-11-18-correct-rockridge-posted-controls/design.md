## Claremont Avenue

Oakland identifies the 302-meter stretch from Hillegass Avenue to College Avenue as a 30 mph enforcement zone [OakDOTClaremontSpeed2026]. In the published network with SHA-256 beginning `f9fa09a57266`, the two blocks are links 2754 through 2757, each at 11.18 m/s. OSM way 281365722 extends past the posted zone. Editing the speed on the entire way would also change adjacent blocks.

Both Rockridge area configurations name the way and the OSM junction IDs at the two ends of the zone. These source identifiers survive link renumbering. The importer reads the surviving junctions in OSM way order, counting consecutive occurrences of a joined junction once. If the way returns to a junction after visiting another, the importer skips the entire correction, even when the revisit is outside the posted zone. For a linear way it sets the speed between the named ends in both directions. If two corrections claim a common link, it skips both. The importer reports an unresolved or ambiguous extent so a maintainer can check the new geometry against the city's record.

## 53rd and Gaskill streets

Oakland records the November 2022 installation of an all-way stop where these two neighborhood bike routes meet [OakDOT53rdGaskill2022]. In the same network, node 15 is uncontrolled and incoming links 22, 39 and 91 all lack a stop. The Rockridge configuration sets `highway=stop` and `stop=all` on OSM node 53128522 so each incoming link gets its stop during import. This junction is in the surrounding routing network, west of the study area.

## Verification

The full Rockridge import produced 1,762 nodes and 4,411 links. Four speed limits became 13.41 m/s. Node 15 became an all-way stop and its three incoming links gained stop signs. The corrected network's SHA-256 starts with `53c823f20d91`. Reverting those eight fields in memory reproduced the published network's SHA-256 exactly. The rebuilt shipped and training demand hashes start with `9cdebdabf05c` and `2f9ae152b9bb` on the same validation split.

A 60-minute PM run on seed 1 completed 26,884 trips. The simulator cleared seven vehicles from gridlock, all outside the judged zone, and the entry backlog was 0.5%. The November 17 ten-seed assessment describes the earlier network. Rockridge remains uncalibrated.
