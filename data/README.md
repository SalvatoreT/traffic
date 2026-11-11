# Data

Nothing large lives in git (a pre-commit hook rejects files over 200 KB). Source extracts
and generated study-area files live in the Cloudflare R2 bucket **`traffic-data`**:

| Local path (gitignored) | R2 key | What |
| --- | --- | --- |
| `data/osm/<area>.overpass.json` | `osm/<area>.overpass.json` | Raw OpenStreetMap extract |
| `data/demand/raw/*` | `demand/raw/*` | Raw counts / census downloads |
| `public/data/*` | `areas/*` | Generated network, demand, basemap served to the app |

- `npm run data:fetch` — download source data from its origins (Overpass, Oakland open data, Census)
- `npm run data` — regenerate `public/data/*` from the local source files
- `npm run data:push` — upload sources and generated files to R2, update `data/manifest.json`
  (needs `wrangler login`)
- `npm run data:pull` — download everything listed in `data/manifest.json` from R2

The deployed Worker reads `areas/*` from the bucket at `/data/*`; local dev serves
`public/data/*` directly. Publishing new data is therefore `data:fetch` → `data` → `data:push`.
