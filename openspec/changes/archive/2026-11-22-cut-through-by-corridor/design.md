## Context

The project lead's request on 2026-11-22, verbatim:

> For the assumptions section, it might make more sense to group by the region of the Trapezoid that's getting cut through, Hillegass, Colby, and Southwest part (give it a better name). Maybe also show each direction? if there's a materials East-West cut through that'd be interesting but surprising. The "other ramp" looks non material. We want the heavy impact more so that the full possibility of everything.

This is the decision. The simulator tallies each through car under a reason slot and the links it used (`intentLinks`, `intentTrips`), but not where in the study area it drove. Adding counters would change the simulator fingerprint and invalidate every stored result.

## Decisions

### D1. Corridors are area data

`data/areas/<area>.json` gets `cutThroughCorridors`: ordered corridors `{id, name, streets, directionBy}`, `otherName`, `nearestM`, `secondShare` and optional `sides`. Every block of a named street belongs to that corridor. A street is in one corridor only, a street that is not in the study area is an error, and the id `other` is reserved.

Rockridge defines Hillegass Ave, Colby St and the southwest streets (Canning, McAuley, Howell, Ayala, Martin, Forest, Hermann, Vicente, 57th, 58th, 59th). The streets that cross between them (60th to 63rd, Dana, North) are not named. Each of their blocks goes to the corridor of the nearest named block, measured from the block's midpoint, within `nearestM` (400 m), else to the remainder "Other side streets". ASSUMPTION: this grouping rule is a modeling choice, stated on the page. With it every side-street block of the study area lands in a corridor, and the remainder is empty for Rockridge. A cross street is split where the nearest spine changes, so 62nd Street is in all three corridors and the list shows it as a part.

The southwest corridor is named "Southwest streets (McAuley St, Howell St, Ayala Ave and neighbors)". The direction rows name its ends. Alternatives: "Southwest streets (Telegraph Ave to Claremont Ave)", which repeats the direction rows, and "West-side streets between Telegraph Ave and Colby St", which is wrong for Forest St and Ayala Ave.

### D2. One corridor per car, with a stated rule

A through car is the app's existing definition: neither trip end in the study area and at least one residential or service block inside it. It is assigned to the corridor where it drives the most side-street distance (sum of block lengths; ties go to the corridor listed first). Corridor totals add up to the area's through cars. ASSUMPTION: a trip that uses two corridors is filed under one. The table records how many trips drive at least `secondShare` (30%) of their side-street distance in a second corridor, and the page states the number.

### D3. Direction

`directionBy: compass` names the direction of the net displacement along the corridor's own blocks in the trip (Northbound, Eastbound, Southbound, Westbound). A flow along the other axis from the corridor's named streets is marked "on cross streets". `directionBy: ends` names a flow by the bounding streets the trip entered and left the side streets by ("Telegraph Ave to Claremont Ave"), found from the bounding streets that meet the entry and exit nodes (the area config's `boundary`), then from the last bounding street on the route. A trip still on the side streets at the end of the hour is named "From <street>, still driving". Hillegass and Colby use compass, the southwest streets use ends.

### D4. The measurement comes from a traced hour, without simulator changes

`tools/lib/corridor-trace.ts` runs one traced hour per period at the stored baseline's seed and settings (seed 1, 3,600 s, demand 100%). It steps one second at a time and reads `intentTrips` after each step. Growth of an entry (reason slot, origin, destination) says the simulator counted a car with those ends and that reason in that step. The trace's link exits give each request's route, and the instant a car is counted is its first exit from a side street at or after time zero. The car in that step with the same ends is the one counted, so the simulator's own classification, not a copy of it, sets every reason. The run checks that every counted car is matched (0 unmatched on all three periods), that no route events were dropped, that the traced run's through cars by reason equal the stored baseline's, and that the flows add up to the total. It stops otherwise. Tracing changes no result.

Steps where two cars with the same ends and different reasons were counted together cannot be told apart. There were none in the Rockridge runs.

### D5. Materiality is a presentation limit

A flow is a headline when it carries at least 5% of the area's through cars in some period. The others are summed in "Smaller flows" with a closed list. ASSUMPTION: 5% is a presentation choice, stated on the page. Nothing is removed from the totals or from the stored table. "Other on-ramps", "Other off-ramps" and the Other reason can appear only inside the disclosures.

### D6. East-west crossing

The area config's `sides` names the bounding streets on each side (Telegraph Ave on the west; College Ave and Claremont Ave on the east). The table stores, per period, the cars that enter on one side and leave on the other, by bounding street and corridor. Result on seed 1, PM peak: Telegraph Ave and College Ave in either direction, 21 an hour (2% of through cars), mostly on the Colby cross streets. Telegraph Ave and Claremont Ave, 381 an hour (43%), 88% of it on the southwest streets, which is the corridor's main flow. Full-width east-west cut-through is small; the large crossing is the diagonal from Telegraph Ave to Claremont Ave. Ten seeds (101 to 110, PM) give 10.5 an hour for College Ave and 332 for Claremont Ave. The page states both figures from the data.

### D7. Data path and seeds

The table is stored in `baseline-intents.json` (per period `corridors`, top level `corridorDefs` with a hash of the settings) because that file already carries the validity keys and the same run settings. `data:results` recomputes it when the settings hash changes. The seed is unchanged (1), so the file's other contents are byte-identical in content. The published proposals file is on seeds 101 to 110; the traced PM hour on those seeds averages 793.7 through cars an hour, the proposals file's baseline, which checks the trace against it. One seed's small flows move from run to run (standard deviation 3 to 36 an hour across the ten PM seeds), so the page says so. The order of the four heaviest flows is the same on seed 1 and on the ten-seed mean.

### D8. Movements follow the corridors

`<area>.assumptions.json` records `corridors` (id, name) and a `corridor` per movement, taken from the corridor of the movement's approach or exit block. The tab groups movements under the corridor names, in the config's order.

## Risks

- Cross streets are split by a nearest-block rule that has no field data behind it. It is stated on the page, and the street lists show which streets are shared.
- Single-seed figures for small flows are noisy.
