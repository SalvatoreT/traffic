## Why

A speed limit is offered one block at a time, at 15 and 20 mph, so the proposal search tries two copies of it on every block and no published proposal uses one. Lowering speeds on a street means the whole street. The project lead asked for "Slow Streets", for example Colby and Hillegass at 15 mph, applied to the whole street so nobody marks block by block, and for the 15 mph option only.

## What changes

- A new intervention, Slow Street: a 15 mph limit on every block of one named street inside the study area. It is one change in the scenario list, in the editor, in labels, in the search and in the published options.
- Scenario link item `ss,<geohash>`. The point names any block of the street; the app, the CLI and the search resolve it to the connected run of that street inside the study area. The item has no parameter. It is written at the run's lowest-numbered block, so one Slow Street is one string and one stored-result key.
- Links written earlier with a per-block `sl` item still open and run as before. Packages in the seeds file that hold per-block limits stay loadable.
- The editor's "Set speed limit" list gains "Apply to the whole street (Slow Street, 15 mph)" first, and opens with it suggested.
- Label: "Slow Street on <street> (15 mph, <from> to <to>)". When the street has a gap or changes name, only the connected run that holds the chosen block counts, and the label says so.
- The search stops generating per-block 15 and 20 mph candidates. It generates one Slow Street per street whose busiest block carries at least a quarter of the busiest block's through traffic in the baseline. The simulator and the editor can still apply a limit to one block.
- A Slow Street occupies one place per street name for the search's one-variant-per-place and similarity rules, so it combines with a filter or a one-way on the same street and counts as the same thing as per-block limits on that street.
- `explore --check-singles` works without `--check`: it scores every candidate alone, prints one row each, says which periods, seeds and run length it ran, and every check flag refuses to write the proposals or report files.

## Impact

- Specs: `interventions`, `proposals`, `agent-access`.
- Code: `crates/sim/src/explore/street.rs` (new), `cands.rs`, `decode.rs`, `link.rs`, `naming.rs`, `search.rs`, `check.rs`, `wasm.rs`, `src/lib/slowstreet.ts` (new), `hash.ts`, `describe.ts`, `selection.ts`, the selection menu, badges, docs.
- The engine is not changed. No file the simulator fingerprint hashes is touched, so the fingerprint, every stored result and the published proposals keep their freshness. The search's candidate list changes, so the next full search will not offer per-block limits.
