## MODIFIED Requirements

### Requirement: Native and WASM builds give identical results
Every transcendental function the simulator uses (exponential, logarithm, power, sine, cosine, arctangent, hypotenuse) SHALL come from one deterministic implementation (`libm`), so the native and WASM builds compute the same bits for the same network, demand, scenario and seed.

#### Scenario: One PM hour
- **WHEN** the same PM hour is run natively and in the WASM build
- **THEN** the metrics, the vehicle positions, the link statistics and the per-intent link usage are identical, and `npm run check:wasm` compares them

#### Scenario: Optimizing the simulation step
- **WHEN** an optimization skips redundant work in the fixed-step loop and the network, demand, interventions, settings and seed match the reference run
- **THEN** both builds reproduce the reference run's vehicle positions, signal states, link statistics, trip intents and metrics at the same simulated times, including runs with a street intervention
