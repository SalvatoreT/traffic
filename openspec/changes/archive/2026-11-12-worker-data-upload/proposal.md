## Why

Publishing data to the R2 bucket needs a Cloudflare API token with write access to every
bucket in the account. The cloud session that generates the data should not hold that.
The Worker already has a binding to the one bucket this project uses.

## What Changes

- The Worker accepts authenticated reads and writes of data files at `/api/data/<key>`,
  limited to the `areas/`, `osm/` and `demand/` prefixes of its own bucket.
- Requests must carry a secret in the `X-Upload-Token` header. The secret is a Worker
  secret; without it the endpoint is off.
- `tools/r2-sync.ts` uses the endpoint when `TRAFFIC_UPLOAD_URL` is set and falls back to
  wrangler otherwise.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `project-foundation`: how data is published

## Impact

`worker/`, `tools/r2-sync.ts`, `data/README.md`. One new Worker secret, `UPLOAD_TOKEN`.

## Out of scope

Listing or deleting objects. Per-user accounts. Uploads from the browser.
