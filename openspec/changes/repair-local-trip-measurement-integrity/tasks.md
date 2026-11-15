## 1. Establish regression evidence

- [x] 1.1 Convert the evidence fixtures into native unit tests and reproduce the current single-link zero-distance and two-link delay errors.
- [x] 1.2 Add instrumentation for requested arrival, insertion, endpoint positions, completion, driven distance and free-flow reference; verify which Rockridge flows exercise the defects.
- [x] 1.3 Record a matched-seed baseline for each period and representative stored proposals before implementation.

## 2. Correct endpoints and event accounting

- [x] 2.1 Define and document the local endpoint placement policy, including one-link direction, repeated runs, paired scenarios and initial loading; label unmeasured distribution choices as assumptions.
- [x] 2.2 Store separate origin and destination positions and use them consistently at insertion, initial placement and completion.
- [x] 2.3 Compute the free-flow reference over actual first/last portions, traversed humps and movements, with no display clamp hiding negative errors.
- [x] 2.4 Make arrival eligibility, insertion, movement and completion causal under one within-step time convention; check all three modes.
- [x] 2.5 Record the distance and exposure of terminal movement before removing the agent, without charging time after its exit.

## 3. Validate and report

- [x] 3.1 Test one-link and multiple-link routes, gate/local combinations, queued insertion, same-step exits, interventions, and reset determinism. Assert per-trip event ordering and distance accounting.
- [x] 3.2 Compare free-flow references with unobstructed traversals and explain remaining discretization error, including the gate fixtures.
- [x] 3.3 Run the Rust suite, build WASM and check native/WASM parity.
- [x] 3.4 Repeat matched-seed Rockridge runs and document changes in delay, distance, exposure and proposal comparisons without retuning demand in the same step.
- [ ] 3.5 Invalidate and regenerate affected stored results and reports under the corrected fingerprint; archive only after implementation and checks pass.
