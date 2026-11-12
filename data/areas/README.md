# Study areas

One JSON file per area, read by `tools/import-osm.ts` (`npm run data`). No area-specific values live in code.

| Field | Meaning |
| --- | --- |
| `id`, `name` | Output file prefix and display name |
| `extract` | Overpass JSON path (`data/osm/...`) |
| `bbox` | `[minLon, minLat, maxLon, maxLat]` of the model area: ways are clipped to it and cut ends become gates. It can be much larger than the study area (Rockridge: see Model area below) |
| `studyArea` | Closed lon/lat polygon (derived from `boundary` when that is set) |
| `junctionJoinRadius` | Optional, default 20 (m): graph nodes within this distance that form one intersection are joined into one node (see Junction joining below); 0 turns it off |
| `boundary` | Optional ordered list of boundary streets; `npx tsx tools/lib/derive-study-area.ts data/areas/<id>.json` rewrites `studyArea` from it. An entry is a street name (matched against OSM `name` or `ref`) or an object `{name?, ref?, class?}` (for example `{"ref": "CA 24", "class": "motorway"}`). Consecutive entries, and the last with the first, meet at the geometric crossing of their centerlines: a shared node, or a grade-separated crossing; with several crossings (a dual carriageway) the one nearest the area center is used, which puts the edge on the inner carriageway. Each edge follows the way geometry vertex by vertex (surface edges are simplified to 3 m; freeway edges keep every vertex). There is no outward buffer: links lying on a boundary street (center within 8 m of the polygon edge) count as inside, while motorway-class links never do. Rockridge: Telegraph Ave, Alcatraz Ave, College Ave, Claremont Ave, SR-24 (a five-sided area; nothing south-east of Claremont) |
| `center`, `zoom` | Map view for `public/data/areas.json` |

## Import defaults

Classes: `motorway`/`motorway_link` become motorway; `primary`, `secondary`, `tertiary` (+ `_link`) keep their class;
`residential`, `unclassified`, `living_street` become residential; `service` stays service (skipped when `service=parking_aisle|driveway`
or `access`/`motor_vehicle` is `private`/`no`). Footways, cycleways, paths, steps and pedestrian ways appear only in the basemap.

| Class | Speed when `maxspeed` missing | Lanes per direction when `lanes` missing |
| --- | --- | --- |
| motorway | 65 mph (ramps: 35 mph) | 2 |
| primary | 30 mph | 2 |
| secondary | 30 mph | 1 |
| tertiary | 25 mph | 1 |
| residential | 25 mph (California prima facie) | 1 |
| service | 15 mph | 1 |

Lanes: `lanes:forward`/`lanes:backward`, else `lanes` (one-way: all; two-way: floor(lanes/2), minimum 1). Unitless `maxspeed` is km/h per the OSM spec.

Direction: `oneway=yes|-1`, roundabouts and motorways (unless `oneway=no`) are one-way; a two-way segment yields two linked links.

Control: `highway=traffic_signals` on a junction or on an approach within 30 m is a signal. `highway=stop` is attributed to the
nearest junction along its way (within 60 m) and, with `direction=forward|backward|both`, to the approach heading into it;
`stop=all` forces all-way stop. Roundabout rings (collapsed to one node) and `mini_roundabout` become a traffic circle. Stops on all approaches make an all-way stop; stops on some make a two-way stop.

Gates: ends of ways clipped by `bbox`, plus dead ends within 60 m of the bbox edge. Only the largest strongly connected
component (plus one-way spurs leading to or from gates) is kept. Humps: `traffic_calming=hump|bump|table|cushion` on a way interior.

Study-area flags: motorway-class links and nodes touched only by motorway links are never `inStudyArea` (the freeway and its ramps are not local streets), so cut-through and safety metrics ignore them.

Junction joining: graph nodes within `junctionJoinRadius` (default 20 m) of their cluster centroid that are connected by a short non-freeway link, and share a street name (or are both signals), become one node at the centroid (dual carriageways, offset signal tags, offset T junctions, ramp terminals). A cluster is joined only if its internal links make it strongly connected, so no impossible movement appears; it never contains a gate, a node near the extract edge, a traffic circle or a freeway link. Control: signal if any member is a signal; all-way stop if every remaining approach has a stop; otherwise a two-way stop if some approach has one. Internal links are dropped, approaches keep their `stopAtEnd` flags and humps.

Collapsed circles: each `junction=roundabout|circular` ring becomes one `traffic_circle` node at the ring centroid (ring ways are dropped, approaches end at the center). Gate nodes carry `canEnter`/`canExit` flags (an outgoing / incoming link connected to the main network); demand uses only enterable origins and exitable destinations.

## Model area and study area

The network, basemap and demand cover the `bbox`; the `studyArea` polygon (derived from `boundary`) marks the part the metrics and the cut-through definition refer to. Everything outside it is context that supplies realistic route choice and traffic at the study-area edge. Changing the `bbox` changes the projection origin (the bbox center) and so every node and link id and every x, y value, but not the study-area outline or the set of in-study streets.

Rockridge `bbox` is `[-122.286, 37.830, -122.220, 37.8605]` (about 5.7 km by 3.4 km). It was set from the OSM geometry of the streets and ramps it has to contain:

| Edge | Value | Reason |
| --- | --- | --- |
| North | 37.8605 | Ashby Ave (SR-13) reaches 37.8581 at Tunnel Road; the rest is margin |
| West | -122.286 | Sacramento St at -122.282 to -122.278, plus margin (Ashby Ave is cut here) |
| South | 37.830 | 51st and 52nd St, and the SR-24 ramps at 51st/52nd St, Telegraph and Shattuck/MLK, all lie north of it (the MLK ramps reach 37.8335) |
| East | -122.220 | Tunnel Road with the Caldecott Lane ramps (-122.2224 to -122.2213) and the SR-24/SR-13 interchange (-122.2296 to -122.2277); SR-13 leaves the box cleanly in the south-east |

Import result at this size (`npx tsx tools/import-osm.ts`): 2,183 nodes and 5,443 links (residential 3,059, tertiary 726, secondary 513, service 755, primary 285, motorway 105). Controls: 123 signals, 97 all-way stops, 462 two-way stops, 39 traffic circles, 1,462 uncontrolled. 158 gates: 143 on surface streets, 15 on freeway mainlines (SR-24 south-west and east ends, SR-13 south-east, several carriageways each). 32 ramp nodes (19 off-ramp and 17 on-ramp connections) join SR-24 and SR-13 to the surface network. The study area keeps 75 nodes and 209 links (the earlier, narrower extract gave 74 and 207). The extra node and two links are a signal on Claremont Ave (OSM node 11007298147, `traffic_signals:direction=backward`) 33 m from the Clifton St junction; it is now its own signal node. All other study-area links and nodes are the same streets, with different representative node ids because the joined-junction centroids moved with the projection origin.

Edge effects: nodes within 60 m of the bbox edge are never joined, so a few signal pairs at the south edge (40th St) stay as two nodes; one-way chains of signals at freeway off-ramp terminals (Broadway at Patton and Keith) are not joined either. Neither affects the study area.
