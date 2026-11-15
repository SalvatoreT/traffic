# Run the model yourself

The site has no "run this scenario" API, on purpose: the public site only serves static files. To test an idea, run the simulator on your own machine. It is the same simulator, compiled to WebAssembly, that runs in the browser, so for the same period, seed and demand it gives the same numbers as the app.

## Prerequisites

- Node.js 22 or newer, and npm.
- A Rust toolchain with the `wasm32-unknown-unknown` target (`rustup target add wasm32-unknown-unknown`). `npm run wasm` installs `wasm-pack` itself when it is missing. The build takes a few minutes the first time.
- About 400 MB of disk for the dependencies, the build and the data.
- Network access only for the downloads: `npm install`, the Rust crates, and the data files.

## Set up

```sh
git clone https://github.com/SalvatoreT/traffic
cd traffic
npm install
npm run wasm            # builds the simulator once
npm run data:download   # the published study-area files, plain HTTPS GET, no credentials
```

`npm run data:download` fetches `/data/areas.json` and the area's network and demand files from the public site into `public/data/`. Add `--all` for the proposals, assumptions and stored results as well (needed to regenerate the text pages). `npm run data` instead rebuilds the files from the repository's own sources and needs `npm run data:fetch` or `npm run data:pull` first; use it only when you change the data.

## Look up places

```sh
npm run simulate -- --find "Colby St & 60th St"
npm run simulate -- --find "Hillegass Ave"
npm run simulate -- --places
npm run simulate -- --list-interventions
```

`--find` takes street names, abbreviated or not, joined by `&`, `and`, `at` or `/`. It prints every block and intersection that matches, and for each the interventions that can go there with the `item` that encodes it in a scenario link, the app's own label for it, and its JSON form. `--places` lists the study area's streets and intersections. `--list-interventions` prints each intervention type, its code, parameters and exact meaning.

## Run a scenario

```sh
npm run simulate -- --link "https://<site>/#v1;a=rockridge;p=pm_peak;s=mn,9q9p3cz9dy,175.355"
npm run simulate -- --interventions my-scenario.json --period midday
npm run simulate -- --area rockridge --period pm_peak            # the baseline alone
```

Options: `--area` (default `rockridge`), `--period` (default: the link's `p=`, else the area's default), `--seed` (default 1, the app's), `--minutes` (default 60, the app's full hour), `--demand` (scale 0.1 to 3, default 1), `--blocks side|all|none` (per-block changes), `--top N`, `--strict`, `--json` or `--pretty`, `--no-cache`.

A run takes about a minute on one core: it simulates today's traffic (the baseline, reused from a saved copy for the next scenario with the same period, seed, demand and data) and then the scenario. Progress goes to stderr and the JSON to stdout. The format of a link is in `docs/scenario-links.md`.

Exit codes: 0 done; 2 bad arguments or a link that cannot be decoded (the message says which part); 3 data files missing or unusable (it names the command that fetches them); 4 the WASM build is missing; 1 anything else.

## Output

JSON with these fields, in the same units and over the same window as the app (a whole simulated hour after the same warm-up of vehicles already on the streets):

- `disclaimer`: this is a simulation result, not a forecast.
- `inputs`: `area`, `period`, `seed`, `simulatedSeconds`, `demandScale`, `link` (the scenario as a link you can open in the app), `interventions` (each with its label), `unplacedInterventions` (items that matched no street or intersection, each with its type, position, nearest street and reason), `hashes` (first 16 hex characters of the network and demand files, and the simulator's fingerprint) and `notes` (anything that differs from the app's defaults).
- `calibration`: the area's status, note and caveat. The Rockridge baseline is not calibrated; read results as comparisons with the baseline.
- `headline.throughCarsPerHour`: through cars an hour on all the study area's side streets together, baseline, scenario, change and percent. A through car has neither trip end in the study area and uses a residential or service street in it; each is counted once.
- `metrics[]`: every figure of the app's Results cards with `baseline`, `scenario`, `change`, `changePct`, `unit` and `lowerIsBetter`: through cars and their share of distance driven, safety indicators (local speeds, shares above 20 and 25 mph, close-following conflicts), trip time and delay (minutes), completed trips, arterial mean speed, unroutable trips, and walking and biking conflicts, trips and injury severity. Severity is reported for walking (AIS 4+) and biking (MAIS 3+) separately, each with the number of encounters scored and, for biking, the number not scored (passes and near-parallel paths); a mean with no scored encounters is `null`, shown as unavailable, never zero. Safety figures are surrogate indicators, not crash predictions; walking and biking volumes are assumed.
- `throughCarsByReason`: cars an hour by the reason they cut through, baseline, scenario and change, with each reason's basis (`observed` or `assumed`).
- `networkHealth`: for baseline and scenario, vehicles on the network, trips waiting to enter, vehicles removed to clear gridlock, unroutable trips, and whether the run is oversaturated, plus the count of interventions the simulator skipped as invalid and the count of unplaced items. An oversaturated run understates congestion.
- `blocks`: with `--blocks side` (default), `topGains` and `topDrops`: the study area's residential and service blocks with the largest change in through cars an hour, each with its name, class, `allCars` (every car on the block, both directions, through cars and local trips together), `throughCars` (only the through cars among them; `beyondNoise` is true past 7.5 cars an hour, the map's noise band) and `meanSpeedMph`. With `--blocks all`, `all`: every block the Streets tab lists. A through number is never compared with an all-cars number.

One seed is one sample. Differences of a few cars an hour on a block are within run-to-run variation; run `--seed 2` and `--seed 3` to see the spread.

## Where traffic goes when you add a closure

A closure's effect on one street is the sum of many trips moving. `--redistribution` follows them. It runs today, the closure alone and the whole package with every car trip recorded, for each seed, and reports three things that are kept apart:

- Possible paths: legal routes around each movement the closure removes, found on the simulator's own turn rules for the period. They carry no traffic. The search covers the whole network; only the listing stops at three paths per movement.
- Simulated cohort routes: the trips that drove a removed movement today (the cohort), followed into the other two runs by a request key that does not depend on the scenario. For each run they are counted by the route they took near the closure, and by where they stand at the end of the hour: finished, still driving, still waiting to start, found no route, removed to clear gridlock, or not matched.
- Net change, all cars: every car on a block, today and in each scenario, with the through part (neither trip end in the study area) and the local part, a paired interval over seeds, and a split of the change into the cohort's trips (with the cars it added and took away), other trips, and cars already on the streets when the run started.

```sh
npm run simulate -- --redistribution --closure mn,9q9p3fr7b5 \
  --link "#v1;a=rockridge;p=pm_peak;s=mn,9q9p642ut2,175.355~mn,9q9p3fr7b5" \
  --seeds 1-10 --streets "63rd Street,Dana Street" --out colby.json
npm run simulate -- --redistribution --closure mn,9q9p3fr7b5 --graph-only   # legal paths only, in a second
npm run simulate -- --redistribution --closure mn,9q9p3fr7b5 --link "<package>" --from colby.json   # reuse a stored result
```

`--closure` is one item of the package link (find items with `--find`); it may be left out when the link has one item. Without `--link` the package is the closure alone. `--seeds` takes a list or a range (default 1). Ten seeds are the fewest for which an interval makes a statement; with fewer, every interval reads "insufficient". `--jobs` sets how many runs go at once (default up to 4); each run takes about a minute and a half on one core. `--cohort crossings` follows every trip that crossed the closed junctions instead of only those that drove a removed movement, and says so in the output. `--trace-max` bounds the stored route events per run (default 1,500,000, about twice a Rockridge hour); counts stay exact when it is reached, and the output says how many trips lack route detail. `--from` prints a stored result only if it was made on the same network, demand, simulator, period and scenarios, and otherwise exits with code 3.

The JSON has `kind: "redistribution"`, `schema` and `method` (the accounting version), and `identity`: area, period, seeds, run length, measurement window and counting rule, file hashes, simulator fingerprint, the three scenario links with their interventions, and the cohort selector. `graph` holds the legal paths for the closure alone and for the package; `cohort` the outcome bins, route counts and pairing checks; `blocks` the listed blocks (those on a possible path, those on `--streets`, and the largest changes) with counts by direction; `health` gridlock removals, unroutable trips and waiting trips per run; `coverage` the route detail kept. The app shows the same evidence from a scenario's intervention list or a proposal card, under "Where traffic goes".

Limits: cars only. Trips are fixed, so a closure moves trips and never removes them. The model is not calibrated, the seed interval covers run-to-run variation only, and an unfinished trip at the end of the hour is reported as unfinished, not as a route.

## What not to do

- Do not run scenarios against the public site. It has no such endpoint; only plain GETs of pages and `/data/` files are expected of visitors.
- Do not call `/api/*`. It is the data upload endpoint for the maintainers, it needs a secret, and it is not for visitors.
- Do not commit generated data: the repository blocks files over 200 KB, and `public/data/` is not tracked.
