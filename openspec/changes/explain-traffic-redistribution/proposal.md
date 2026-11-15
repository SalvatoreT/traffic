## Why

A user reviewing the Colby Street / North Street filter asked why cars would not divert via 63rd Street and Dana Street. The graph permits that bypass. The earlier engine's three-seed PM runs also showed more total traffic on those blocks, even while their through-car counts fell. Aggregate figures could not identify which trips moved there or explain why other traffic appeared on Hillegass.

The project already has turn-aware routing and a structural through-route screen. It needs a way to inspect the paths available after a closure, follow a defined set of requested trips across scenarios, and show all traffic changes beside through traffic. The historical example is preserved with its source revision and limitations; it is not a prediction from the repaired engine.

## What Changes

- Add a redistribution diagnostic for a selected intersection or blocked movement, comparing baseline, that closure alone, and the complete package.
- Scope the first implementation to car traffic; retain mode in graph queries and request identities for compatibility.
- Validate possible bypasses against the simulator's effective movement graph for the selected period and mode.
- Match requested trips using scenario-independent identities and verified attributes; retain incomplete, removed, pending, and unmatched outcomes.
- Show observed route changes, gross diverted passages, and net block changes as distinct measures, with all-car, through-car, and local-trip counts.
- Provide an accessible map/table view and the same versioned diagnostic through the local CLI, reusing existing provenance and paired-uncertainty contracts.

## Capabilities

### New Capabilities
- `traffic-redistribution`: legal bypass witnesses, comparable trip cohorts, lifecycle accounting, and redistribution summaries.

### Modified Capabilities
- `simulator-ui`: inspect redistribution from a selected closure or proposal, with visible all-traffic effects.
- `agent-access`: run and export the same diagnostic locally.

## Impact

Likely implementation paths: `crates/sim/src/{sim,model,eff,route,topo}.rs`, `sim/initial.rs`, diagnostic native/WASM interfaces, `src/lib/throughroutes.ts`, `src/components/{ThroughRoutes,Proposals,MapView,StreetsTable}.tsx`, and `tools/simulate.ts` with its report helpers. Reuse `explore/paired.rs`, proposal provenance, and run manifests. The implementation should extend existing trip records where practical.

Out of scope: replacing the traffic model, retuning demand, selecting neighborhood interventions, redesigning search objectives, adding a demand-response model, or claiming field validation. The user requested an OpenSpec proposal on `main` for later implementation; tasks remain unchecked and this change stays open.
