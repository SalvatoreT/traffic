## Context

Decided with the user on 2026-11-12, after an account-level R2 token was judged too broad
and bucket-scoped R2 keys turned out to be unusable from the cloud session (they need
request signing with a secret the session never sees).

## Decisions

### D1 A shared secret on the Worker, not a Cloudflare token
The Worker checks an `X-Upload-Token` header against the `UPLOAD_TOKEN` secret. Holding
the secret allows reading and replacing data files in this one bucket and nothing else.
The cloud session stores it as a network secret that the proxy attaches, so the value
never appears in the session.

### D2 Closed by default and narrow
With no secret configured the endpoint answers 503. The token is checked before the key,
by comparing SHA-256 digests in constant time. Keys must start with `areas/`, `osm/` or
`demand/`, use a small character set and contain no empty or dot segments. Writes need a
`Content-Length` of at most 64 MB. Only GET and PUT exist: nothing can be listed or
deleted through it.

### D3 Wrangler stays as the fallback
`npm run data:push` and `data:pull` keep working with wrangler on a machine that is
logged in. Setting `TRAFFIC_UPLOAD_URL` switches both to the endpoint.
