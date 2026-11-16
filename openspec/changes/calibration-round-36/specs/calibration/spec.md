## ADDED Requirements

### Requirement: Approach discharge is measured before a signal change
Before a calibration round changes the phasing, timing or lanes of a signal to reduce the cars cleared from gridlock at it, the round SHALL record for each approach the green it received and its discharge rate per lane while green and queued, against a cited saturation flow, with the shares of that time in which the head vehicle was held by a full downstream link (named), a vehicle in the junction, pedestrians or a priority rule.

#### Scenario: Approach limited by its green
- **WHEN** an approach discharges near saturation flow whenever it is green and queued
- **THEN** a change to its phasing, timing or lanes may be tried under the round's step rule

### Requirement: Spillback is followed to its cause
When an approach discharges well below saturation flow while green and queued because its head waits for a full downstream link, the round SHALL follow that link to the control at its far end and name the cause there, and SHALL NOT change the signal on that evidence.

#### Scenario: Approach held by spillback
- **WHEN** an approach's head is held by a full downstream link most of its queued green
- **THEN** the record names the chain of full links to the control that limits them
