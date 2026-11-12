# Data

Git holds nothing large: a pre-commit hook rejects files over 200 KB. Source extracts
and generated study-area files live in the Cloudflare R2 bucket `traffic-data`:

| Local path (gitignored) | R2 key | What |
| --- | --- | --- |
| `data/osm/<area>.overpass.json` | `osm/<area>.overpass.json` | Raw OpenStreetMap extract |
| `data/demand/raw/*` | `demand/raw/*` | Raw counts / census downloads |
| `data/transit/raw/*` | `transit/raw/*` | Raw GTFS zip (see `data/transit/README.md`) |
| `public/data/*` | `areas/*` | Generated network, demand, basemap served to the app |

- `npm run data:fetch`: download source data from its origins (Overpass, Oakland open data, Census, transit GTFS). The transit step needs an agency token, see `data/transit/README.md`
- `npm run data`: regenerate `public/data/*` from the local source files, in order: network (`import-osm`), transit (`build-transit`), demand (`build-demand`). Demand runs last because walking trips to bus stops read the transit file
- `npm run data:push`: upload sources and generated files to R2 and update `data/manifest.json`
  (needs `wrangler login`)
- `npm run data:pull`: download everything listed in `data/manifest.json` from R2

The deployed Worker reads `areas/*` from the bucket at `/data/*`; local dev serves
`public/data/*` directly. To publish new data, run `data:fetch`, then `data`, then `data:push`.

The OSM extract now includes bicycle route relations. A machine that holds an older extract can add them without changing any way or node id: `npx tsx tools/fetch-osm.ts --relations`.
