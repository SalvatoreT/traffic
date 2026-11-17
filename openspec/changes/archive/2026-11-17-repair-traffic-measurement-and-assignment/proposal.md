## Why

The audit found that Rockridge could pass a station on missing data and could train on trips derived from a held-out count. Several estimates counted different events than the field observations. Those differences also affected which street changes the project recommended.

## What Changes

- Check station coverage, seed identity and primitive evidence before issuing a calibration verdict.
- Match vehicle and pedestrian counts to the movement and location observed. Keep excluded route diagrams out of every training input.
- Correct directional gate volumes and ramp share estimates. Assign the final demand to routes before scoring it.
- Keep local addresses fixed between scenarios. Compare the same requested resident trips through a common cutoff.
- Preserve signal green floors, marked turn lanes and legal routes. Apply timed restrictions and confirmation checks when choosing proposals.
- Reuse measured baseline route costs across packages with the same inputs, period and seed.

## Capabilities

### Modified Capabilities

- `calibration`
- `demand-model`
- `traffic-simulation`
- `proposals`

## Impact

Changes affect the native and browser simulators, demand builds, assessment and proposal search. Existing calibration and proposal runs describe the simulator and inputs named in their provenance.
