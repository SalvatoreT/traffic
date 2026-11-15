## 1. Worker

- [x] 1.1 Accept the `jobs/` prefix in `worker/upload.ts`; test the key rules and that `/data/` cannot read a job object.

## 2. Simulator fingerprint

- [x] 2.1 Add the `fingerprint` binary that prints `traffic_sim::FINGERPRINT`.

## 3. Shard tool

- [x] 3.1 Store client (upload endpoint, retries), job and shard names, input manifest, local verification.
- [x] 3.2 `inputs push`, `inputs pull`, `inputs verify`.
- [x] 3.3 `assess run` (calibrate arguments as in `tools/assess.ts`, resume, upload with index) and `assess fetch` (completeness, integrity, layout for `--reuse`).
- [x] 3.4 `explore run` and `explore fetch` (group merge, report merge, seeds through `--seed-proposals`).
- [x] 3.5 Tests against a local stub store and the calibrate stub; npm script `shard`.

## 4. Docs

- [x] 4.1 `docs/sharded-runs.md`, run through the humanizer skill.
- [x] 4.2 Mention the job prefix in `data/README.md`.
