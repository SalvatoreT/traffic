# OSM extract

`rockridge.overpass.json` (gitignored, 8.7 MB; R2 key `osm/rockridge.overpass.json`) covers the first wider model area, bbox `37.830,-122.286,37.8605,-122.220`; the current model `bbox` (`37.8325,-122.2845,37.8605,-122.220`, see `data/areas/README.md`) lies inside it, so no refetch was needed when the edges moved inward. It was fetched on 2026-11-12 through the OpenStreetMap map API (`api.openstreetmap.org/api/0.6/map.json`, 40 tiles), because every Overpass mirror reset or timed out that day. The result has the Overpass JSON shape: 15,313 highway ways, 62,905 nodes, 19 bicycle route relations and, added later with `--restrictions`, 199 turn-restriction relations (`type=restriction`, members by id).

Content: every `way[highway]` that touches the bbox with all its nodes, nodes tagged `highway~traffic_signals|stop|crossing|mini_roundabout` or `traffic_calming`, and `route=bicycle` relations (members by id). Bus routes come from GTFS, not from OSM. The map API returns relations that touch a tile, so the relation list can differ slightly from an Overpass fetch of the same bbox. The earlier extract (bbox `37.836,-122.264,37.855,-122.248`, Overpass, 2026-11-11) was replaced; way and node ids that lie in both are the same.

`npx tsx tools/fetch-osm.ts --restrictions` keeps the stored ways and nodes and adds the turn-restriction relations from the map API tiles (needs `NODE_USE_ENV_PROXY=1` behind a proxy). `npx tsx tools/fetch-osm.ts --force` refetches (Overpass first, map API after a failure), `--api` skips Overpass, `--relations` refreshes only the bicycle relations of an Overpass-style extract.

© OpenStreetMap contributors, ODbL 1.0, https://www.openstreetmap.org/copyright
