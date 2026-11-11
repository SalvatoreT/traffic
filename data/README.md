# Data

Nothing large lives in git (a pre-commit hook rejects files over 200 KB). Source extracts
and generated study-area files live in the Cloudflare R2 bucket **`traffic-data`**:

| Local path (gitignored) | R2 key | What |
| --- | --- | --- |
| `data/osm/<area>.overpass.json` | `osm/<area>.overpass.json` | Raw OpenStreetMap extract |
| `data/demand/raw/*` | `demand/raw/*` | Raw counts / census downloads |
| `public/data/*` | `areas/*` | Generated network, demand, basemap served to the app |

- `npm run data:pull` — download everything from R2 (needs Cloudflare credentials)
- `npm run data` — regenerate `public/data/*` from the local source files
- `npm run data:push` — upload local files to R2

Without R2 access the sources can be re-fetched from their origins; each directory's
README records the URL and query used.
