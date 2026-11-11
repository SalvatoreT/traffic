## Why

The repository is empty. The first end-to-end slice lets people open a web page,
watch today's traffic in the Rockridge Trapezoid (North Oakland: Telegraph / College /
Claremont / Alcatraz) move on a map, add an intervention, and see what changes. The
model must trace to published traffic research. The user's priority questions are
cut-through traffic and safety.

## What Changes

- Project foundation: Cloudflare Worker + Vite/React/TypeScript UI, Rust simulation core
  compiled to WASM, OpenSpec, AGENTS.md with model-delegation policy, bibliography.
- Street-network import from OpenStreetMap into an area-agnostic network file.
- Baseline demand synthesized from public data (Oakland counts, Census LODES), with every
  assumption labeled.
- Microscopic vehicle simulation: car-following, intersection control (signals, stop
  signs, uncontrolled), congestion-responsive route choice, cut-through and safety metrics.
- Interventions: modal filters/diverters, traffic calming (humps, circles, speed limits),
  intersection control changes and signal timing, one-way conversion and turn bans.
- Accessible simulator UI: map, playback, intervention editor, baseline-vs-scenario metrics.

## Capabilities

### New Capabilities

- `project-foundation`: repo structure, build/deploy targets, agent and research conventions
- `street-network`: import and representation of a study area's street network
- `demand-model`: baseline travel demand derived from public data
- `traffic-simulation`: the microscopic simulation model and its outputs
- `interventions`: the set of changes a user can apply to a scenario and their modeled effect
- `simulator-ui`: the web interface for viewing traffic and editing scenarios

### Modified Capabilities

None.

## Impact

New code everywhere. New runtime dependencies: React, MapLibre GL. Build needs Rust +
`wasm-pack`. Deploy target: Cloudflare Workers (static assets).

## Out of scope

- Pedestrians, cyclists and buses as simulated agents (the user wants a fully multimodal v1;
  it arrives as the next change, `multimodal-agents`, on top of this vehicle core).
- Lane changing within multi-lane links (MOBIL), emissions, noise.
- Mode shift / demand elasticity ("traffic evaporation"). Demand is fixed in this change.
- Saving/sharing scenarios server-side; areas other than Rockridge.
