# Transit data (Rockridge)

`public/data/rockridge.transit.json` lists the bus routes that run through the model: ordered network link ids, stops placed on links, and headways per demand period. The file is generated from the transit agency's GTFS feed by `tools/build-transit.ts`; settings are in `data/transit/rockridge.config.json`. Nothing in the code is specific to one agency or area.

## Source

AC Transit publishes its GTFS static feed on its data page, https://www.actransit.org/data-api-resource-center (section "General Transit Feed Specification"), and says it regenerates the feed at least three times a year. The download link on that page goes to `https://api.actransit.org/transit/gtfs/download` with an access token issued by the agency. The token is not stored in this repository.

Feed version and validity dates: not recorded yet. The feed has not been downloaded in this repository (see Status). `tools/build-transit.ts` writes the `feed_info.txt` fields it finds into the file's provenance entry, and this section should be updated with them after the first build.

## Fetch and build

```
ACTRANSIT_TOKEN=<token from the agency's data page> npx tsx tools/fetch-transit.ts    # raw zip to data/transit/raw/gtfs.zip
npx tsx tools/fetch-transit.ts --file <zip you downloaded>                            # or store a zip fetched another way
npx tsx tools/import-osm.ts && npx tsx tools/build-transit.ts                         # needs the network first
```

`data/transit/raw/` is gitignored and synced to R2 (`transit/raw/`) by `tools/r2-sync.ts`. `npm run data:pull` restores it, so most machines never need the token. `build-transit` prints a warning and exits cleanly when the zip is missing, so `npm run data` still completes without transit.

## Method

1. Pick a reference weekday: the Wednesday inside the feed's validity with the most scheduled trips (`referenceDate` in the config overrides it). Service ids come from `calendar.txt` and `calendar_dates.txt`.
2. For each route, direction and shape with weekday trips whose shape touches the model bounding box, map-match the shape to directed network links (`tools/lib/mapmatch.ts`, a simplified hidden Markov matcher after [Newson2009]). A shape that leaves and re-enters the model gives one entry per stretch, so routes enter and leave at gates. Stretches shorter than `minRouteLengthM` (300 m) are dropped as corner clips. Variants carrying under `minVariantShare` of a route direction's trips are dropped.
3. Project the stops of the pattern's longest trip onto the matched path in travel order; stops farther than `maxStopDistM` are skipped. `position` is meters from the link start.
4. Headway per period is the window length divided by the number of the pattern's weekday trips at one reference stop inside the area (the stop served by most trips, nearest the center on a tie). Windows are in the config: am_peak 07:00 to 09:00, midday 11:00 to 13:00, pm_peak 16:00 to 18:00, the same ids as the demand periods. A period with no trip gets no headway entry. `frequencies.txt` is not read.
5. Dwell is 20 s per stop. ASSUMPTION: no boarding data and no cited value in `docs/references.md`.

Data: routes, shapes, stops, trip times. Assumption: dwell. Matching is geometric and has not been checked against the agency's stop-to-street data.

## Status

The feed download was not completed when this was written: the only public link carries an agency-issued token that this session was not authorized to use, and no token-free mirror was reachable. The tools and tests are in place (tests use a synthetic feed built on the real network). Until someone runs the fetch with a token, `rockridge.transit.json` does not exist, `areas.json` has no `transit` entry, and walking trips to bus stops are skipped in the demand build.
