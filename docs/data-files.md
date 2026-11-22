# Data files

Everything the app shows comes from static JSON files under `/data/`. They are public, read-only, and need no JavaScript to fetch. Paths below are relative to the site root; `<area>` is an area id from `areas.json`. All distances are meters, all speeds meters per second, all rates vehicles an hour, unless a field says otherwise. Local coordinates (`x`, `y`) are meters east and north of the network's `origin`.

Every file is a snapshot. The files that depend on others record the SHA-256 of those inputs (see "Hashes and staleness" below), and a result computed on other inputs is out of date.

## `/data/areas.json`

A list of study areas. Each entry:

- `id`, `name`: the area's id and display name.
- `network`, `demand`, `basemap`, `noise`, optional `proposals`: paths of the area's files.
- `center` (`[lon, lat]`), `zoom`: where the map opens.
- `calibration`: `status` (`calibrated` or `uncalibrated`), `note` (the one-line status shown on the Map tab), `caveat` (the full statement of what the calibration does and does not show), `defaultPeriod`, `experimentalPeriods`.
- `preview`: present and true for an area that is not public yet; the app never opens it by default, only from a link that names it. Preview areas come after the others.

## `/data/<area>.network.json`

The street network the simulator runs on, much wider than the study area, from OpenStreetMap (ODbL).

- `version` (1), `id`, `name`, `origin` (`lon`, `lat` of local coordinates `0, 0`), `bbox` (`[west, south, east, north]`), `studyArea` (the study-area outline as `[lon, lat]` points).
- `nodes[]`: `id` (the array index), `osmId` (negative for a node the importer added: a roundabout center, or a gate where the model's extent cuts a street), `x`, `y`, `control` (`signal`, `all_way_stop`, `two_way_stop`, `uncontrolled`, `traffic_circle`), `gate` (true at the network edge, where trips enter and leave), `inStudyArea`, optional `canEnter`, `canExit`, `markedCrossing`.
- `links[]`: one per direction of a street, `id` (the array index), `osmWayId`, `from`, `to` (node ids), `reverse` (the opposite direction's link id, or null for a one-way street), `name`, `class` (`motorway`, `primary`, `secondary`, `tertiary`, `residential`, `service`), `lanes`, `speedLimit` (m/s), `length` (m), `geometry` (`[x, y]` points in local meters), `fromBearing`, `toBearing` (compass degrees the street leaves and reaches its ends), `stopAtEnd`, `humps` (positions in m of speed humps already there), `inStudyArea`, optional `bikeLane`, `bikeRoute`, `sidewalk`, `crossings`.
- `turnBans[]`: `from`, `to` (link ids) and optional `periods`: turns banned by OpenStreetMap, in the listed periods or always.

A "block" in the app is a link and its reverse together. A "side street" is a link with `inStudyArea` true and `class` `residential` or `service`.

## `/data/<area>.demand.json`

The trips the simulator makes, one table per period. An optional `pedestrianCount` gives the counted intersection (`node`), `period`, observed crosswalk traversals per hour (`observedPerHour`) and final planned traversals per hour (`plannedPerHour`, null when count scaling is disabled).

- `version` (1), `area`.
- `periods[]`: `id` (such as `pm_peak`), `label`, and `flows[]`. Each flow is `origin` and `destination` (node ids), `vehPerHour`, optional `mode` (`car` by default, `bicycle`, `pedestrian`), optional `intent` (the id of the reason it belongs to) and optional `via`: an assumed movement the trips take, `{from, to, maxDetour, then?}`, the link they arrive on, the link they leave on, and the longest detour factor allowed (a trip joins only if the turn costs at most that multiple of its best route). A trip is fixed: the same trips are made before and after every change.
- `intents[]`: the reasons through cars cross the area: `id`, `label`, `section` (the heading it is listed under), `basis` (`observed`: a count limits how many cars go this way; `assumed`: no count limits it), `note`, `avoids` and, for freeway-ramp reasons, `onRamp` or `offRamp` (a `ramps` id or `other`). The through-car tally by reason in a run follows this order and ends with `other`.
- `ramps[]`: freeway ramps derived from the network: `id`, `kind` (`on` or `off`), `node` (the surface node), `links`, `label`, `direction`.
- `provenance[]`: `source`, `url`, `note` for each input. A note that starts with DATA rests on a count; one that says ASSUMPTION is a judgment call.

## `/data/<area>.assumptions.json`

The assumed movements behind the Assumptions tab. `version`, `area`, `generated`, `inputs.demandHash` (full SHA-256 of the demand file it was made for), `count` (`label` of the count it rests on, the `measured` periods, and the `scaled` periods that have no count and use assumed factors), and `movements[]`: `id`, `label`, `from`, `to`, `node` (link and node ids of the turn), `maxDetour`, `counted` (cars an hour the count shows per period), `assigned` (per period: `total` cars an hour the model assigns, `through` how many have no trip end in the study area), `intents[]` (the reasons that make up the movement: `id`, `label`, `through`, `vph` per period), and, when the count is below the fit's minimum, `belowThreshold` and `belowThresholdNote`. When the area defines corridors, `corridors[]` (`id`, `name`, in the area's order) and a `corridor` id on each movement that turns from or onto a corridor's street; the Assumptions tab groups the movements under those names.

## `/data/<area>.proposals.json`

Packages of interventions found by searching the simulation. `version` (5; version 4 files are still read), `area`, `groups[]`; each group is a ranked list found under one set of limits:

- `id`, `title`, `note` (the limits in words), `legacy` (true when computed with an older measure; its options are not shown).
- `computed`: `date`, `periods`, `seeds` (those of the published estimates), `minutes`, `networkHash`, `demandHash` (the first 16 hex characters of the SHA-256 of the file bytes), `calibration` (the status when it ran), and in version 5 `simulator` (the simulator build's fingerprint), `reportMethod` (the version of the pairing, interval and selection rules), `sourceRevision`, `settings` (the search settings) and `estimation` (the interval method and level, the minimum of 10 paired runs, what the interval does not cover, and whether the estimates are exploratory or a confirmation on unused seeds, with both seed lists and the frozen shortlist).
- `baseline.cutThroughVehPerHour`: through cars an hour on the side streets today, per period.
- `proposals[]`: `id`, `title`, `summary`, `kind` (`search`, or `reference` for a hand-written package with a `note`), `link` (a scenario link fragment for the first searched period), `interventions[]` (`type`, `label` in the app's words; a ban set, `type` `ban_set`, is one change that holds several turn bans and also has `bans`, its count), optional `turnBans` (individual turn bans in a package that holds a ban set; the card says "N turn restrictions around the edge of the area" from it and from single `turn_ban` changes), optional `objectives[]` (ids such as `most-removed`, `no-closures`, `least-detour`, `fewest-changes` and `no-turn-bans`, the best package that holds no turn ban; the card prints them as "Best for"), `residentsDetour` (seconds added per requested resident trip, shown beside the headline on every card), `cutThrough` (`baselineVehPerHour`, `scenarioVehPerHour`, `changePct`: through cars an hour on all side streets together, averaged over the periods and seeds; negative is a reduction; `effect` and `changePctEffect`: the paired change with its 95% interval over seeds and a `status`), `harm.through` (`largestIncrease`: the side-street block with the largest raw increase in through cars, with before and after values and its interval; `adjustedPenalty`: the separate block behind the search's ranking penalty after an assumed noise band; `blocksAboveBand`, `blocksResolvedIncrease`), `byPeriod[period]` (`cutThrough` for that period, and `allTraffic`: `largestIncrease`, `adjustedPenalty` and `blocksAboveBand`, about all cars, through cars and local trips together), `context` (`boundingStreets[]` with `flowChangePct` and `speedChangeMph`, `insideTripTimeChangePct`, `pedConflictsChangePct`, `bikeConflictsChangePct`), `evidence` (`role`, `seeds`, and the per-seed through cars an hour behind the figures), and optional `picture`. A group also has `optionComparisons[]`: each option against the next simpler one on the same seeds, in points of through cars cut. Version 5 files record `computed.simulator`, `reportMethod`, `sourceRevision`, `settings` and `estimation`; an older file lacks them and its figures are unverified.
- `picture`: `period`, `links` (link ids), `base` and `scen` (through cars an hour on each of those links today and with the package, parallel arrays of integers, averaged over the group's seeds). Links with no through cars in either column are left out; add the two directions of a block to get the block's figure.
- `pictureAll` (optional): the same shape and period for all cars an hour, through cars and local trips together, on the links of the side-street blocks the search measures. Absent in older files.

With report method `paired-t-3`, `residentsDetour` measures elapsed time from each resident car request to completion or the common cutoff. A resident trip starts or ends inside the study area. Requests made before time zero and vehicles placed during initialization are excluded. `cutoffMinutes` gives the observation window. `coverage` gives the number of requested and unfinished trips in each scenario and the number of period and seed pairs with matching requests. If any pair has no requests or the paired requests differ, `secondsPerTrip`, `vehicleMinutesPerHour` and `effect` are null. Earlier methods used completed trips only.

A shortlist remains frozen when a confirmation run fails. The omitted option's link, title and reason appear in `computed.estimation.selection.failed`. A reference package remains visible with `accessProblem` or `simulationProblem` if it fails a check.

## `/data/results/<area>/index.json`

The stored simulations. `version` (1), `area`, `inputs` (`networkHash`, `demandHash`, `simulator`, the simulator's source fingerprint), `computed`, and `results[]`: `key`, `period`, `items` (the scenario as sorted link items joined by `~`), and `proposals[]` (`group`, `id`) that share it. A shared link to a published proposal opens already at the end of the hour, from one of these.

## `/data/results/<area>/<key>.json`

One scenario in one period, one simulated hour at seed 1 and demand 1, with today's baseline beside it, exactly as the app would show after running to the end. `key` is the first 16 hex characters of the SHA-256 of `<items>|<period>`.

- `version`, `area`, `period`, `key`, `items`, `inputs` (as in the index), `seed`, `demandScale`, `seconds` (3600), `computed`.
- `scenario` and `baseline`: each `{metrics, linkStats, intentLinks?}`.
  - `metrics`: the simulator's end-of-run figures. `cutThrough.vehiclesPerHour` is through cars an hour on all side streets, `cutThrough.byIntent[]` the same by reason in the demand's `intents` order then `other`, `safety`, `meanTripTime` and `meanTripDelay` (s), `arterialMeanSpeed` (m/s), `completedTrips`, `backlog`, `unroutableTrips`, `gridlockRemoved`, `junctionRecovery`, `modes` and `vulnerable` (walking and biking). `vulnerable.safetyVersion` is 2: `pedestrian` (AIS 4+) and `cyclist` (MAIS 3+) each give `encounters`, `supported`, `unsupported`, `meanSeverity` (null when no encounter was scored, with `unavailable` giving the reason) and the injury `endpoint`; `cyclist.passes` counts passes of cyclists on shared streets, which are not scored. The two injury levels are never added together. A stored result without `safetyVersion` carries the older car-speed scores and is not read.
  - `metrics.junctionRecovery`: how often the junction recovery rules decided an admission, over the whole run from t = 0 (absent in results from older simulator builds). `policy` is `physical` (production: an occupied conflict point blocks a vehicle however long it waits), `no_behavioral` (physical, with courtesy and the yield fallback switched off) or `historical` (the earlier engine, kept for comparison only). `crossings` is the number of node entries, the denominator for any share, and `initCrossings` the part of them in the settle interval. `courtesy`, `yieldFallback` and `conflictBypass` each give `invokedS` (head-of-queue seconds in which the rule applied), `blockedS` (those seconds in which physical exclusion still held the vehicle back), `admissions` (vehicles it let in that the ordinary rule would have refused, counted once when the crossing starts) and `initAdmissions` (the part before the settle interval ends). `heldRemovals` is cars cleared from gridlock after standing at the end of a node crossing for the removal time (already part of `gridlockRemoved`) and `initHeldRemovals` its settle-interval part. `eventsDropped` counts logged recovery events that did not fit the bounded log. Divide counts by `seconds / 3600` for an hour. Under `physical` and `no_behavioral`, `conflictBypass.admissions` is 0; a nonzero value, or `historical`, means the run admitted vehicles past an occupied conflict point and does not pass the physical junction check. The courtesy and yield-fallback waits are assumptions, not measurements, and a low `gridlockRemoved` or few close-following conflicts do not by themselves show valid junction operation. The app shows this as a plain-language note under the comparison.
  - `linkStats`: base64 of little-endian 32-bit floats, four per link in link order (the array length is four times the number of links in the network): flow (cars an hour over the run), mean speed (m/s), through cars (cars an hour over the run), density (cars per km at the end). Block figures sum both directions' flow and through cars; speed is flow-weighted.
  - `intentLinks`: base64 of little-endian 32-bit floats, three per entry: reason slot (position in `intents`, `other` last), link id, cars that left the link in the run. Divide by `seconds / 3600` for cars an hour. Only nonzero entries.

## `/data/results/<area>/baseline-intents.json`

Today's traffic by reason, one finished hour per period. `version`, `area`, `inputs`, `seed`, `seconds`, `computed`, and `periods[period]`: `totalVph`, `byIntent[]` (`id`, `vehiclesPerHour`), `intentLinks` (as above), and `ends` (where each reason's cars start and end, by approach group), and, for an area with corridors, `corridors`: the same through cars by corridor, direction and reason. `flows[]` has `corridor` (an id of `corridorDefs`, or `other`), `direction` (a compass word such as `Northbound`, or `<street> to <street>` for a corridor named by its bounding streets), `vph` (cars an hour) and `byIntent[]` (cars an hour per reason, parallel to the demand's `intents` and then Other). `crossing[]` has `from`, `to`, `corridor` and `vph` for cars that enter on the west side of the study area and leave on the east side or the reverse. `multi` has `vph` (all through cars) and `second` (those that drive at least `corridorDefs.secondShare` of their side-street distance in a second corridor). Each car is in one flow, so `flows[].vph` adds up to `totalVph`. Top level `corridorDefs`: `corridors[]` (`id`, `name`, `directionBy`, `streets[]` with `name` and `part`, true when only some blocks of the street are in the corridor), `otherName`, `secondShare`, `sides` and `configHash` (the settings it was made from). The table comes from one traced run of the same hour (seed, 3,600 s, demand 100%) and the simulator's own reason for each car, so its totals equal the rest of the file.

## `/data/<area>.noise.json`

The seed-to-seed spread of the baseline link flows, which is what "beyond run-to-run variation" is measured against: `sd[period][link]` times 0.5 is the standard deviation in cars an hour, across the listed `seeds`.

## `/data/<area>.basemap.json`

A GeoJSON FeatureCollection of footways, buildings and the like that the map draws under the network. Not needed to run or read results.

## Hashes and staleness

The proposals file records the first 16 hex characters of the SHA-256 of the exact bytes of the network and demand files it was computed on. Stored results and `baseline-intents.json` record the full hashes and the simulator fingerprint. When any of them differs from the file now served, the numbers were computed on other inputs and are out of date: the app ignores a stored result and runs the scenario live instead, and marks a proposal group "Out of date". The generated pages (`/proposals.md` and `/index.md`) say so in the same way and still show the numbers they have. A change of the simulator fingerprint has the same effect on every stored result until the set is regenerated (`data/README.md`, "When the simulator fingerprint changes").

## Licenses

Map data, and the network and basemap derived from it, are (c) OpenStreetMap contributors under the [ODbL](https://www.openstreetmap.org/copyright). Keep that attribution when you reuse them. The demand inputs come from public sources, listed with their URLs in `provenance`, each under its own terms. The repository's code is under the license in `LICENSE`; the repository does not say that the generated results carry a separate license, so cite the site and the source repository when you use them.
