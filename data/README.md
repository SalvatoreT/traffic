# Data

Git holds nothing large: a pre-commit hook rejects files over 200 KB. Source extracts
and generated study-area files live in the Cloudflare R2 bucket `traffic-data`:

| Local path (gitignored) | R2 key | What |
| --- | --- | --- |
| `data/osm/<area>.overpass.json` | `osm/<area>.overpass.json` | Raw OpenStreetMap extract (Rockridge: 8.7 MB) |
| `data/demand/raw/*` | `demand/raw/*` | Raw counts / census downloads |
| `public/data/*` | `areas/*` | Generated network, demand, basemap served to the app |

- `npm run data:fetch`: download source data from its origins (Overpass, Oakland open data, Census)
- `npm run data`: regenerate `public/data/*` from the local source files, in order: network (`import-osm`), then demand (`build-demand`), which reads the network
- `npm run data:push`: upload sources and generated files to R2 and update `data/manifest.json`
  (needs `wrangler login`)
- `npm run data:pull`: download everything listed in `data/manifest.json` from R2

The deployed Worker reads `areas/*` from the bucket at `/data/*`; local dev serves
`public/data/*` directly. To publish new data, run `data:fetch`, then `data`, then `data:push`.

The OSM extract now includes bicycle route relations. A machine that holds an older extract can add them without changing any way or node id: `npx tsx tools/fetch-osm.ts --relations`.

The OSM fetch tries the Overpass mirrors first. When none answers (the case on 2026-11-12), `tools/fetch-osm.ts` falls back to the OpenStreetMap map API, tiled into 40 requests and converted to the same JSON shape; `npx tsx tools/fetch-osm.ts --force --api` uses it directly. The extract covers the model area in `data/areas/<area>.json` (`bbox`), which is wider than the study area.

## Publishing without a Cloudflare token

The Worker takes data files at `/api/data/<key>` from requests that carry the upload
secret in an `X-Upload-Token` header. It only reads and writes keys under `areas/`,
`osm/` and `demand/`, and it is off until the secret exists.

One-time setup, on a machine where wrangler is logged in:

```
openssl rand -hex 32
npx wrangler secret put UPLOAD_TOKEN
```

Then publish or fetch with the site's address:

```
TRAFFIC_UPLOAD_URL=https://<site> TRAFFIC_UPLOAD_TOKEN=<secret> npm run data:push
TRAFFIC_UPLOAD_URL=https://<site> TRAFFIC_UPLOAD_TOKEN=<secret> npm run data:pull
```

In a cloud session the secret is stored as a network secret for the site's host, so
`TRAFFIC_UPLOAD_TOKEN` is left unset and the proxy fills in the header. Behind a proxy,
Node needs `NODE_USE_ENV_PROXY=1`.
