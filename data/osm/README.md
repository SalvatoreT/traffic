# OSM extract

`rockridge.overpass.json` (gitignored; R2 key `osm/rockridge.overpass.json`) is an Overpass API result fetched 2026-11-11 from
`overpass.kumi.systems`, bbox `37.836,-122.264,37.855,-122.248`.

Query: all `way[highway]`; nodes tagged `highway~traffic_signals|stop|crossing|mini_roundabout`
or `traffic_calming`; plus member nodes; plus `relation[route=bicycle]` (members by id, no geometry). Bus routes come from GTFS, not from OSM.

The four bicycle route relations in the bbox were fetched from Overpass on 2026-11-12 (`maps.mail.ru` mirror; the main endpoints timed out) and added to the 2026-11-11 extract, leaving every way and node as it was. `npx tsx tools/fetch-osm.ts --relations` does the same refresh. The importer also works on an extract without relations, using way tags only.

© OpenStreetMap contributors, ODbL 1.0, https://www.openstreetmap.org/copyright
