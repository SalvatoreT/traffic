# Data files

Everything the app shows comes from static JSON files under `/data/`. They are public, read-only, and need no JavaScript to fetch. Paths below are relative to the site root; `<area>` is an area id from `areas.json`. All distances are meters, all speeds meters per second, all rates vehicles an hour, unless a field says otherwise. Local coordinates (`x`, `y`) are meters east and north of the network's `origin`.

Every file is a snapshot. The files that depend on others record the SHA-256 of those inputs (see "Hashes and staleness" below), and a result computed on other inputs is out of date.

## `/data/areas.json`

A list of study areas. Each entry:

- `id`, `name`: the area's id and display name.
- `network`, `demand`, `basemap`, `noise`, optional `proposals`: paths of the area's files.
- `center` (`[lon, lat]`), `zoom`: where the map opens.
- `calibration`: `status` (`calibrated` or `uncalibrated`), `note` (the one-line status shown on the Map tab), `caveat` (the full statement of what the calibration does and does not show), `defaultPeriod`, `experimentalPeriods`.

## `/data/<area>.network.json`

The street network the simulator runs on, much wider than the study area, from OpenStreetMap (ODbL).

- `version` (1), `id`, `name`, `origin` (`lon`, `lat` of local coordinates `0, 0`), `bbox` (`[west, south, east, north]`), `studyArea` (the study-area outline as `[lon, lat]` points).
- `nodes[]`: `id` (the array index), `osmId`, `x`, `y`, `control` (`signal`, `all_way_stop`, `two_way_stop`, `uncontrolled`, `traffic_circle`), `gate` (true at the network edge, where trips enter and leave), `inStudyArea`, optional `canEnter`, `canExit`, `markedCrossing`.
- `links[]`: one per direction of a street, `id` (the array index), `osmWayId`, `from`, `to` (node ids), `reverse` (the opposite direction's link id, or null for a one-way street), `name`, `class` (`motorway`, `primary`, `secondary`, `tertiary`, `residential`, `service`), `lanes`, `speedLimit` (m/s), `length` (m), `geometry` (`[x, y]` points in local meters), `fromBearing`, `toBearing` (compass degrees the street leaves and reaches its ends), `stopAtEnd`, `humps` (positions in m of speed humps already there), `inStudyArea`, optional `bikeLane`, `bikeRoute`, `sidewalk`, `crossings`.
- `turnBans[]`: `from`, `to` (link ids) and optional `periods`: turns banned by OpenStreetMap, in the listed periods or always.

A "block" in the app is a link and its reverse together. A "side street" is a link with `inStudyArea` true and `class` `residential` or `service`.

## `/data/<area>.demand.json`

The trips the simulator makes, one table per period.

- `version` (1), `area`.
- `periods[]`: `id` (such as `pm_peak`), `label`, and `flows[]`. Each flow is `origin` and `destination` (node ids), `vehPerHour`, optional `mode` (`car` by default, `bicycle`, `pedestrian`), optional `intent` (the id of the reason it belongs to) and optional `via`: an assumed movement the trips take, `{from, to, maxDetour, then?}`, the link they arrive on, the link they leave on, and the longest detour factor allowed (a trip joins only if the turn costs at most that multiple of its best route). A trip is fixed: the same trips are made before and after every change.
- `intents[]`: the reasons through cars cross the area: `id`, `label`, `section` (the heading it is listed under), `basis` (`observed`: a count limits how many cars go this way; `assumed`: no count limits it), `note`, `avoids` and, for freeway-ramp reasons, `onRamp` or `offRamp` (a `ramps` id or `other`). The through-car tally by reason in a run follows this order and ends with `other`.
- `ramps[]`: freeway ramps derived from the network: `id`, `kind` (`on` or `off`), `node` (the surface node), `links`, `label`, `direction`.
- `provenance[]`: `source`, `url`, `note` for each input. A note that starts with DATA rests on a count; one that says ASSUMPTION is a judgment call.

## `/data/<area>.assumptions.json`

The assumed movements behind the Assumptions tab. `version`, `area`, `generated`, `inputs.demandHash` (full SHA-256 of the demand file it was made for), `count` (`label` of the count it rests on, the `measured` periods, and the `scaled` periods that have no count and use assumed factors), and `movements[]`: `id`, `label`, `from`, `to`, `node` (link and node ids of the turn), `maxDetour`, `counted` (cars an hour the count shows per period), `assigned` (per period: `total` cars an hour the model assigns, `through` how many have no trip end in the study area), `intents[]` (the reasons that make up the movement: `id`, `label`, `through`, `vph` per period), and, when the count is below the fit's minimum, `belowThreshold` and `belowThresholdNote`.

## `/data/<area>.proposals.json`

Packages of interventions found by searching the simulation. `version` (4), `area`, `groups[]`; each group is a ranked list found under one set of limits:

- `id`, `title`, `note` (the limits in words), `legacy` (true when computed with an older measure; its options are not shown).
- `computed`: `date`, `periods`, `seeds`, `minutes`, `networkHash`, `demandHash` (the first 16 hex characters of the SHA-256 of the file bytes), `calibration` (the status when it ran).
- `baseline.cutThroughVehPerHour`: through cars an hour on the side streets today, per period.
- `proposals[]`: `id`, `title`, `summary`, `kind` (`search`, or `reference` for a hand-written package with a `note`), `link` (a scenario link fragment for the first searched period), `interventions[]` (`type`, `label` in the app's words), `cutThrough` (`baselineVehPerHour`, `scenarioVehPerHour`, `changePct`: through cars an hour on all side streets together, averaged over the periods and seeds; negative is a reduction), `harm.through` (`worstBlock`, `increaseVehPerHour`, `blocksAboveNoise`: the side-street block that gains the most through cars, past run-to-run variation), `byPeriod[period]` (`cutThrough` for that period, and `allTraffic`: `worstBlock`, `baselineVehPerHour`, `scenarioVehPerHour`, `throughIncreaseVehPerHour`, `blocksAboveNoise`, about all cars, through cars and local trips together, on the block that gains the most), `context` (`boundingStreets[]` with `flowChangePct` and `speedChangeMph`, `insideTripTimeChangePct`, `pedConflictsChangePct`, `bikeConflictsChangePct`), and optional `picture`.
- `picture`: `period`, `links` (link ids), `base` and `scen` (through cars an hour on each of those links today and with the package, parallel arrays of integers, averaged over the group's seeds). Links with no through cars in either column are left out; add the two directions of a block to get the block's figure.

## `/data/results/<area>/index.json`

The stored simulations. `version` (1), `area`, `inputs` (`networkHash`, `demandHash`, `simulator`, the simulator's source fingerprint), `computed`, and `results[]`: `key`, `period`, `items` (the scenario as sorted link items joined by `~`), and `proposals[]` (`group`, `id`) that share it. A shared link to a published proposal opens already at the end of the hour, from one of these.

## `/data/results/<area>/<key>.json`

One scenario in one period, one simulated hour at seed 1 and demand 1, with today's baseline beside it, exactly as the app would show after running to the end. `key` is the first 16 hex characters of the SHA-256 of `<items>|<period>`.

- `version`, `area`, `period`, `key`, `items`, `inputs` (as in the index), `seed`, `demandScale`, `seconds` (3600), `computed`.
- `scenario` and `baseline`: each `{metrics, linkStats, intentLinks?}`.
  - `metrics`: the simulator's end-of-run figures. `cutThrough.vehiclesPerHour` is through cars an hour on all side streets, `cutThrough.byIntent[]` the same by reason in the demand's `intents` order then `other`, `safety`, `meanTripTime` and `meanTripDelay` (s), `arterialMeanSpeed` (m/s), `completedTrips`, `backlog`, `unroutableTrips`, `gridlockRemoved`, `modes` and `vulnerable` (walking and biking). `vulnerable.safetyVersion` is 2: `pedestrian` (AIS 4+) and `cyclist` (MAIS 3+) each give `encounters`, `supported`, `unsupported`, `meanSeverity` (null when no encounter was scored, with `unavailable` giving the reason) and the injury `endpoint`; `cyclist.passes` counts passes of cyclists on shared streets, which are not scored. The two injury levels are never added together. A stored result without `safetyVersion` carries the older car-speed scores and is not read.
  - `linkStats`: base64 of little-endian 32-bit floats, four per link in link order (the array length is four times the number of links in the network): flow (cars an hour over the run), mean speed (m/s), through cars (cars an hour over the run), density (cars per km at the end). Block figures sum both directions' flow and through cars; speed is flow-weighted.
  - `intentLinks`: base64 of little-endian 32-bit floats, three per entry: reason slot (position in `intents`, `other` last), link id, cars that left the link in the run. Divide by `seconds / 3600` for cars an hour. Only nonzero entries.

## `/data/results/<area>/baseline-intents.json`

Today's traffic by reason, one finished hour per period. `version`, `area`, `inputs`, `seed`, `seconds`, `computed`, and `periods[period]`: `totalVph`, `byIntent[]` (`id`, `vehiclesPerHour`), `intentLinks` (as above), and `ends` (where each reason's cars start and end, by approach group).

## `/data/<area>.noise.json`

The seed-to-seed spread of the baseline link flows, which is what "beyond run-to-run variation" is measured against: `sd[period][link]` times 0.5 is the standard deviation in cars an hour, across the listed `seeds`.

## `/data/<area>.basemap.json`

A GeoJSON FeatureCollection of footways, buildings and the like that the map draws under the network. Not needed to run or read results.

## Hashes and staleness

The proposals file records the first 16 hex characters of the SHA-256 of the exact bytes of the network and demand files it was computed on. Stored results and `baseline-intents.json` record the full hashes and the simulator fingerprint. When any of them differs from the file now served, the numbers were computed on other inputs and are out of date: the app ignores a stored result and runs the scenario live instead, and marks a proposal group "Out of date". The generated pages (`/proposals.md`, `/streets.md`, `/index.md`) say so in the same way and still show the numbers they have.

## Licenses

Map data, and the network and basemap derived from it, are (c) OpenStreetMap contributors under the [ODbL](https://www.openstreetmap.org/copyright). Keep that attribution when you reuse them. The demand inputs come from public sources, listed with their URLs in `provenance`, each under its own terms. The repository's code is under the license in `LICENSE`; the repository does not say that the generated results carry a separate license, so cite the site and the source repository when you use them.
