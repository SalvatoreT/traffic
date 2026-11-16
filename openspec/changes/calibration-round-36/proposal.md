## Why

Rounds 33 to 35 changed the phasing, the timing and one approach's lanes at Ashby Ave / Claremont Ave, and none of them reduced the cars cleared from gridlock there or on the hillside streets behind it. The delay-feedback fit stays rejected on that gridlock (10 to 16 cars an hour). The lead's reading: two northbound lanes with even 17 s of green in 100 s discharge about 600 an hour, yet the model passes 260 to 370, so the junction is limited by something other than its signal. This round finds that constraint before any further change to the signal.

## What changes

- Diagnosis without model changes: on round 33's iteration-2 demand and on the shipped demand (PM, seeds 1 to 4), every 0.25 s state of each lane on the approaches to Ashby Ave / Claremont Ave and on the links around it (green, queue, discharges, and what held the head vehicle), with the trips' routes through them. The read-only probe that records this is kept outside the repository so the simulator fingerprint, on which the published proposals were confirmed, stays the same.
- The data along the causal chain checked against OSM, [SafewayCollege-DEIR2011] and City of Berkeley documents.
- Candidate fixes at the source, measured on scratch networks: Claremont Ave / Russell St as a minor-road stop instead of an all-way stop, and bans on two movements through the Ashby Ave right-turn slip lane. A change is kept only if cars cleared from gridlock get no worse on any demand and seed set.
- Round 36 in the calibration record; the area's `calibration` note.

## Capabilities

### New Capabilities

### Modified Capabilities

- `calibration`: a round that changes a signal to address gridlock at it first locates the constraint on the approach's discharge.

## Impact

- `data/calibration/rockridge.record.md`, `data/areas/rockridge.json` (calibration note), `openspec/specs/calibration/spec.md` on archive.
- No change to the simulator, the importer, the network or the demand; the frozen split and the link numbering are unchanged.
