## Context

A full assessment is three periods by ten seeds on two demands, and a search runs for hours. Child sessions are separate cloud machines with four cores and a fresh clone of `main`. Git cannot carry the network, demand and proposals files (over the 200 KB limit and generated), so the inputs and the outputs go through the R2 bucket and the Worker's authenticated data endpoint, the way `tools/r2-sync.ts` already uploads. The session's network proxy injects the credential; no token is stored in a variable or file.

## Decisions

### D1. Up to six child sessions (project-lead decision, 2026-11-15)

The ten-seed assessment and the proposal search and confirmation use up to six child sessions. Shards are chosen by the lead; the tool does not start sessions.

### D2. The `jobs/` prefix and no listing

Job objects live under `jobs/<job>/` and are reached only through `/api/data/<key>` with the upload secret. The public `/data` route reads `areas/<name>` and cannot reach them. The endpoint has no listing, so every shard writes an `index.json` naming its files, and the lead names the shards it expects (`--shards a,b,c`). A missing or incomplete index is an error that names the shard. The existing 64 MB limit per object stays.

### D3. What makes results mergeable

Every shard works from the job's `inputs.json`, written by `inputs push`: SHA-256 and key of each non-git input, SHA-256 of the git-tracked inputs the run reads (targets, stations, split, demand config, area config, groups, and the proposal profiles, references and seeds), the simulator fingerprint and the git revision. `inputs pull` and every `run` re-verify the local files and build against it. The fingerprint comes from a new `fingerprint` binary, which links the same library as `calibrate` and `explore`, so it names the code those binaries contain; the source of the fingerprint (`crates/sim/fingerprint.rs`) skips `src/bin`, so adding it changes no fingerprint. The revision is information: a child on a newer `main` with identical hashes and fingerprint is fine, and the hashes decide. `inputs push` stops when the simulator sources are uncommitted (a child cannot have them) unless `--allow-dirty`. A job id is immutable: pushing to an existing job needs `--replace`.

### D4. Assessment shards run `calibrate` exactly as `tools/assess.ts` does

`--area`, `--period`, `--minutes`, `--scale 1`, `--seeds`, `--jobs`, `--keep-seeds` and, for the cross-validation view, `--demand` with the file named by `countFit.validation.demandOutput`. The cross-validation view is skipped for a period with no counts of its own (the assessment's `hasCounts` rule). A test pins the argument shape against `tools/assess.ts`. Each (view, period) unit is uploaded when it finishes and the index says `complete` only when every unit of the request is uploaded, so a child that is killed keeps its finished units: a rerun reuses local reports that still check out and uploads again. This is how a job stays under a two-hour command limit: the child starts the command in the background and polls.

### D5. The assessment already accepts a merged directory

`--reuse DIR` reads shipped runs from `DIR` and cross-validation runs from `DIR-cv`, and checks seeds, manifests, compatibility and inputs against the files on disk. `assess fetch` writes that layout, so `tools/assess.ts` needs no change. Before it writes anything `assess fetch` checks each report against the job (fingerprint, each input hash, minutes) and then runs the assessment's own run-set check, so a bad shard stops the merge with a message that names the shard.

### D6. Search shards are one profile each

A search is one sequential beam per profile; `explore` writes its group into a file that may hold other groups and keeps them. A shard therefore runs `explore` on a shard-local copy of the proposals, seeds and report files (`--out`, `--known`, `--report`), so the repository files are untouched and a profile that warm-starts from other groups sees the proposals file the job pushed. Confirmation (`--confirm-seeds`) happens inside the run, after the shortlist is frozen, so it is part of the shard's arguments and not a separate pass. The shard's groups are those that are new or changed against the pushed file. The merge replaces or adds exactly those groups in the lead's proposals file (version 5, same area, order of the profiles file, other groups kept) and rewrites the matching sections of the report. Mixed provenance with groups that were kept is reported as a warning.

### D7. Known packages merged by the binary

`explore --seed-proposals FILE` adds every search option of a proposals file to the seeds file with the same key-based dedupe and the same cap as the search (`crates/sim/src/explore/seeds.rs`). The merge writes the shards' groups to a scratch proposals file and runs that mode, so the cap and dedupe rules stay in one place. An entry already in the file keeps its earlier figures and dates; the mode does not refresh them (`record` does that inside a search). That difference is documented in the runbook.

## Risks

- The shard tool and the lead's tree can drift (a changed engine after `inputs push`): the fingerprint check in `run` and `fetch` stops it.
- The first real round trip is untested: all of it is tested against a local stub of the endpoint.
