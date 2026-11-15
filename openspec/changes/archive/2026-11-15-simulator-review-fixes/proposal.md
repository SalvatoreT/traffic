## Why

An independent review of the simulator core and the proposal search reproduced a set of defects with a probe. The ones that move results:

- The search ran from an empty network and counted through cars over the whole run including the warm-up, while its per-block figures left the warm-up out and the app starts loaded. For the same scenario and period a proposal card said 598 to 512 where the app said 632 to 538.
- The native and WASM builds disagreed on the same inputs (633 against 646 through cars, same fingerprint) because they used different `powf`, `exp`, `ln` and trigonometric implementations.
- Agents placed at start-up ignored their flow's assumed movement. A re-plan around a blocked link could leave a stale assumed movement. Per-intent link usage credited links left during the settle interval (3,696 against 3,673 on local links). A modal filter that named one direction of a leg left the other direction open.
- Speed humps did not survive the link encode and decode round trip. Warm-start packages from a stricter group could be dropped by one-seed screening, the budget, or the within-noise rule. Reference packages skipped the access check.
- The fingerprint hashed files that cannot change a result, and several constants had neither a citation nor an ASSUMPTION label. Some comments and one spec sentence disagreed with the code.

## What changes

- One run definition for the app, stored results, `calibrate` and the proposal search: initial load, the same settle interval, every figure over t = 0 to the end. Screening is the same run, shorter. The output file records what run produced each number.
- Every transcendental call in the simulator goes through `libm`. A parity script compares a native and a WASM run bit for bit.
- Start-up placement, re-planning, per-intent link usage and the leg filter follow their specs. Humps are generated at the position the decoder returns.
- Packages from a stricter group are always rechecked and exempt from the within-noise drop. Reference packages carry the access check result as a flag.
- The fingerprint hashes only result-affecting sources, compiled-in data files and the used dependencies in `Cargo.lock`.
- Dead experiment switches, silenced variables and the legacy re-route path are removed without changing any result. Parameters that had neither a citation nor an ASSUMPTION label now carry one.
