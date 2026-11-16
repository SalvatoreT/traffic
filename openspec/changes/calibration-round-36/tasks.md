## 1. Reproduction

- [x] 1.1 Check that `npm run data` reproduces network f9fa09a5726644d7 and demand 1c798217e72fb1ba and that PM seed 1 matches round 35's run.

## 2. Diagnosis (no model change)

- [x] 2.1 Read-only lane probe in `calibrate` (kept out of the repository to keep the fingerprint); check that a probed run equals an unprobed one.
- [x] 2.2 Iteration-2 and shipped demand, PM seeds 1 to 4: green, discharge rate while green and queued, and what held the head on each approach and on the links around Ashby Ave / Claremont Ave; routes through them; the chain followed to its cause.

## 3. Sources along the chain

- [x] 3.1 OSM tags of every link and junction on the chain; [SafewayCollege-DEIR2011]; Caltrans and City of Berkeley documents; verified entries added to `docs/references.md`.

## 4. Fixes at the source

- [x] 4.1 Claremont Ave / Russell St as a minor-road stop (scratch network): measured, fails the step rule, not kept.
- [x] 4.2 Bans on the eastbound left into the slip lane and the U-turn out of it (scratch network): measured, no gain, not kept.
- [x] 4.3 Stop: the constraint cannot be settled without field data; record the observation that would settle it. No network or demand change, so the fit (task 3.1 of round 35) and the assessment stand.

## 5. Record

- [x] 5.1 Round 36 in the calibration record; the area's `calibration` note.
