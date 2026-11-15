## Why

The ten-seed assessment and the proposal search each take hours on one machine. Cloud child sessions have four cores each and only a fresh clone of `main`, so a batch can be split across them if the inputs that are not in git reach them and the results come back and merge without any silent mixing of simulators or inputs.

## What Changes

- `tools/shard.ts` (npm script `shard`) with `inputs push|pull|verify`, `assess run|fetch` and `explore run|fetch`.
- The Worker's authenticated data endpoint accepts a `jobs/` key prefix. Objects under it are never served by the public `/data` route.
- A `fingerprint` binary prints the simulator fingerprint of the local build, so a child can compare its build with the lead's without running a simulation.
- `docs/sharded-runs.md`: the commands for a child and for the lead.

## Capabilities

### New Capabilities
- `batch-runs`: splitting seed runs and proposal searches across machines and merging the results with integrity checks.

### Modified Capabilities
- `project-foundation`: the authenticated endpoint accepts the `jobs/` prefix.

## Impact

`worker/upload.ts` (new prefix, tests), `crates/sim/src/bin/fingerprint.rs` (new, not part of the fingerprint), `tools/shard.ts` and `tools/lib/shard*.ts`, `package.json`, `docs/sharded-runs.md`. `tools/assess.ts` is unchanged: `--reuse DIR` already reads the cross-validation runs from `DIR-cv`.
