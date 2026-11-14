## Why

A shared link to a scenario opens at time zero and the viewer waits an hour of simulated time (about a minute at Max) before the Results mean anything. The owner asked that a shared link arrive at the end of the simulation, with the results showing, and that the viewer can still start the simulation over.

## What Changes

- A new tool, `npm run data:results`, runs every published proposal (all groups and reference packages) for all three periods with the simulator the app runs, and writes the finished state to `public/data/results/<area>/<key>.json`, plus an index.
- Each file records the network hash, the demand hash and a fingerprint of the simulator's sources. The simulator exposes the fingerprint (computed by `crates/sim/build.rs`), and the app uses a stored result only when all three match what it has loaded.
- Opening a link whose scenario has a valid stored result shows the finished state at once: clock at 1:00:00, results marked final, no cars drawn, with a note and the existing "Run again" control that starts a live run from zero.
- Opening a link with a scenario that has no valid stored result runs straight to the end of the hour at Max and shows the finished state. Nothing is stored for visitors' scenarios.
- Opening a proposal from the Proposals page now also sets its period and demand level (100%) so its stored result applies. Scenario links always name the period when they carry interventions.
- The Worker serves `/data/results/<area>/<file>` from R2 and answers 404 for a result that is not stored.

## Capabilities

### Modified Capabilities
- `simulator-ui`: opening a scenario link shows a stored finished state or runs to the end at Max.
- `proposals`: published proposals have precomputed results for every period.
- `traffic-simulation`: the simulator reports a fingerprint of its sources.

## Impact

- `crates/sim/build.rs`, `crates/sim/src/lib.rs`, `crates/sim/src/wasm.rs`
- `src/lib/stored-results.ts`, `src/App.tsx`, `src/sim/*` (a `version` message), `src/components/MapView.tsx` (`still`)
- `tools/precompute-results.ts`, `tools/lib/run-result.ts`
- `worker/index.ts`, `worker/paths.ts`
- `data/README.md`, `AGENTS.md`
