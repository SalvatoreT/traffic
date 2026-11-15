## 1. Define source-compatible measures

- [x] 1.1 Read the full [Lubbe2022] closing-speed definition and document its mapping to simulated velocities and supported encounter geometry; preserve source-check limits in the bibliography. (Only the abstract could be reached; the vector mapping and the geometry cutoff are labeled ASSUMPTION in the bibliography and design.)
- [x] 1.2 Define separate pedestrian and cyclist output fields for endpoint, encounter counts, support status, and mean severity; define missing-data semantics and schema migration.

## 2. Correct computation and reporting

- [x] 2.1 Use source-compatible kinematics for supported cyclist events; report unsupported encounter geometry without applying an unverified severity curve.
- [x] 2.2 Remove the sum of different injury endpoints from shared summaries; expose exposure counts and distinguish no observations from measured zero across UI, CLI, and generated prose.
- [x] 2.3 Version changed safety outputs and reject or explicitly identify stored results computed with the old meaning.

## 3. Correct evidence scope

- [x] 3.1 Replace external-mean-as-target wording in the bibliography and active documentation; state the difference between observed all-traffic counts and the app's distinct-through-car metric.
- [x] 3.2 Correct or annotate the audit's fixed-demand upper-bound statements and apply consistent conditional-experiment language to shared copy and generated text.

## 4. Validate

- [x] 4.1 Add deterministic cases for equal car speed with differing cyclist velocities and for supported versus unsupported encounter geometries.
- [x] 4.2 Test separate endpoints, a doubled identical encounter sample, no supported encounters, and legacy stored-result handling.
- [x] 4.3 Run targeted Rust and TypeScript tests, typecheck, and native/WASM parity if simulation outputs change; inspect the rendered and headless safety summaries.
- [ ] 4.4 Validate the completed OpenSpec change, apply the humanizer skill to changed prose, and archive only after implementation and checks pass.
