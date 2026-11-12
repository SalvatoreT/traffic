## Why

The first version simulates cars only. The questions people bring to this tool are about
safety for people walking and biking and about what a change does to the bus, so those
modes have to be in the model before results mean much. The user asked for a fully
multimodal first version.

## What Changes

- Pedestrians, cyclists and buses become simulated agents alongside cars.
- The network carries what those modes need: bike lanes, sidewalks, marked crossings and
  bus stops.
- Demand gains a mode per flow. Bus service comes from the transit agency's published
  schedule. Walking and biking demand is synthesized and labeled as an assumption.
- Results report safety and delay by mode: conflicts between vehicles and people walking
  or biking, speeds where they mix, and bus travel time.
- The map draws each mode with its own shape and lets people show or hide modes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `traffic-simulation`: agent types, their interactions and per-mode metrics
- `demand-model`: mode per flow, transit service, walking and biking demand
- `street-network`: bike, pedestrian and transit attributes
- `simulator-ui`: per-mode rendering, toggles and results

## Impact

`crates/sim` (agents, interactions, metrics, WASM API), `tools/` (importer, transit fetch,
demand), a new generated file `public/data/<area>.transit.json`, and the UI. The data in
R2 has to be regenerated and pushed again.

## Out of scope

- Mode shift: people do not change mode in response to interventions.
- New interventions for these modes (bike lanes, bus lanes, crossings). They come next.
- Crowding, boarding counts and fare payment on buses.
- Calibration of walking and biking volumes; there is no count data yet.
