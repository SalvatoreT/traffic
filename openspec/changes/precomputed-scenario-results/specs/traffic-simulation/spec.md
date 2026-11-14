## ADDED Requirements

### Requirement: Simulator fingerprint
The simulator SHALL expose a fingerprint computed at build time from its own sources (names and contents, line endings normalized, tests, bins and the proposal search excluded), so the same sources give the same value on any machine and a change to a source that can affect a run changes it. The WASM build SHALL export it as `simulatorFingerprint()`.

#### Scenario: Same sources
- **WHEN** the simulator is built twice from the same sources on different machines
- **THEN** the fingerprint is identical
