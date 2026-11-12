## Why

The first version simulates cars only. The questions people bring to this tool are about
safety for people walking and biking, so those modes have to be in the model before
results mean much. The user asked for a multimodal first version.

## What Changes

- Pedestrians and cyclists become simulated agents alongside cars.
- The network carries what those modes need: bike lanes, sidewalks and marked crossings.
- Demand gains a mode per flow. Walking and biking demand is synthesized and labeled as
  an assumption.
- Results report safety and delay by mode: conflicts between cars and people walking or
  biking, speeds where they mix, and trip times per mode.
- The map draws each mode with its own shape and lets people show or hide modes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `traffic-simulation`: agent types, their interactions and per-mode metrics
- `demand-model`: mode per flow, walking and biking demand
- `street-network`: bike and pedestrian attributes
- `simulator-ui`: per-mode rendering, toggles and results

## Impact

`crates/sim` (agents, interactions, metrics, WASM API), `tools/` (importer, demand) and the
UI. The data in R2 has to be regenerated and pushed again.

## Out of scope

- Buses. Bus routes matter too little to the questions this tool answers to justify a
  transit data pipeline and an agency token. Cut on 2026-11-12; no transit file was ever
  built or published.
- Mode shift: people do not change mode in response to interventions.
- New interventions for these modes (bike lanes, crossings). They come next.
- Calibration of walking and biking volumes; there is no count data yet.
