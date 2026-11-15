## 1. Worker

- [ ] 1.1 Accept the `jobs/` prefix in `worker/upload.ts`; test the key rules and that `/data/` cannot read a job object.

## 2. Simulator fingerprint

- [ ] 2.1 Add the `fingerprint` binary that prints `traffic_sim::FINGERPRINT`.

## 3. Shard tool

- [ ] 3.1 Store client (upload endpoint, retries), job and shard names, input manifest, local verification.
- [ ] 3.2 `inputs push`, `inputs pull`, `inputs verify`.
- [ ] 3.3 `assess run` (calibrate arguments as in `tools/assess.ts`, resume, upload with index) and `assess fetch` (completeness, integrity, layout for `--reuse`).
- [ ] 3.4 `explore run` and `explore fetch` (group merge, report merge, seeds through `--seed-proposals`).
- [ ] 3.5 Tests against a local stub store and the calibrate stub; npm script `shard`.

## 4. Docs

- [ ] 4.1 `docs/sharded-runs.md`, run through the humanizer skill.
- [ ] 4.2 Mention the job prefix in `data/README.md`.
