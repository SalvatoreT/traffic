# Study areas

One JSON file per area, read by `tools/import-osm.ts` (`npm run data`). Nothing area-specific lives in code.

| Field | Meaning |
| --- | --- |
| `id`, `name` | Output file prefix and display name |
| `extract` | Overpass JSON path (`data/osm/...`) |
| `bbox` | `[minLon, minLat, maxLon, maxLat]` of the extract; ways are clipped to it and cut ends become gates |
| `studyArea` | Closed lon/lat polygon |
| `boundingStreets` | Optional `west/east/south/north` street names; `npx tsx tools/lib/derive-study-area.ts data/areas/<id>.json` rewrites `studyArea` from them (street centrelines between corner intersections, buffered 15 m outward) |
| `center`, `zoom` | Map view for `public/data/areas.json` |

## Import defaults

Classes: `motorway`/`motorway_link` → motorway; `primary`, `secondary`, `tertiary` (+ `_link`) keep their class;
`residential`, `unclassified`, `living_street` → residential; `service` → service (skipped when `service=parking_aisle|driveway`
or `access`/`motor_vehicle` is `private`/`no`). Footways, cycleways, paths, steps and pedestrian ways appear in the basemap only.

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

Control: `highway=traffic_signals` on a junction or on an approach within 30 m → signal. `highway=stop` is attributed to the
nearest junction along its way (within 60 m) and, with `direction=forward|backward|both`, to the approach heading into it;
`stop=all` forces all-way stop. Roundabout ways and `mini_roundabout` → traffic circle. Stops on all approaches → all-way stop, some → two-way stop.

Gates: ends of ways clipped by `bbox`, plus dead ends within 60 m of the bbox edge. Only the largest strongly connected
component (plus one-way spurs leading to or from gates) is kept. Humps: `traffic_calming=hump|bump|table|cushion` on a way interior.
