## Decisions

### D1 Coordinates, not OpenStreetMap ids
Each intervention is stored as a point: the midpoint of a street block, the position of a
hump, or an intersection's location, rounded to 5 decimal places (about 1 m). Directional
interventions (one-way, turn ban) also store a compass bearing rounded to 5 degrees.
OpenStreetMap way and node ids were considered. They survive importer changes but break
when mappers split or redraw a way, and merged junctions have no single id. A point on
the ground survives both.

### D2 Matching on load
Street interventions match the nearest link of a drivable class within 25 m whose bearing
agrees within 45 degrees when a bearing is stored. Intersection interventions match the
nearest node within 30 m. A turn ban stores the turn's intersection point with inbound
and outbound bearings. No match within tolerance means the intervention is reported as
unplaced.

### D3 Format
`#v2;a=<area>;s=<items>` where each item is a compact, URL-safe tuple of type code,
coordinates and parameters. Readable enough to debug, short enough to share. A hash
without `v2` is treated as the old format: the app shows a notice that the link predates
a map update and cannot be restored, and starts from the baseline.
