## Why

`npm run data:redistribution` stored, for each street label of a route, the path from whichever seed's result arrived first. Seeds run in a worker pool, so the stored path depended on `--jobs` and on finishing order. On 2026-11-21 a faster simulator changed that order and 9 drawn paths in `unconstrained.p1.json` and `unconstrained.p3.json` changed (a "Telegraph Avenue" route drawn northbound instead of southbound). Counts, per-hour figures, shares and labels were identical.

## What changes

- The stored path for each street label comes from the lowest seed that has one, whatever order results arrive in.
- A unit test feeds the same results in two arrival orders and expects identical output.

## Impact

Only the drawn `links` of stored routes. No count, per-hour figure or share changes.
