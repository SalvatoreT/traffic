## Context

Integration on 2026-11-11: AM peak at demand scale 1.0 (~12k veh/h) produced gridlock
removals and arterial mean speed near 2 m/s; scale 0.3 ran freely. Only two gates have
count data; the rest use per-class default volumes. Observed route shares are available
for two residential streets and the freeway ramps.

## Decisions

### D1 Measure before tuning
Build the measurement tool first, then tune by hand and record each change. An automatic
optimizer would overfit: there are ~10 observed shares and dozens of free parameters. A short,
explained list of adjustments can be audited.

### D2 Select-link analysis in the core
The simulation records, for configured links, each traversing trip's origin, destination
and the named streets used before and after. This mirrors how the observed data was
produced, so modeled and observed shares compare directly.

### D3 Tune demand before behavior
Order of suspicion: default gate volumes (assumptions), then the origin/destination
distribution, then intersection capacity parameters marked ASSUMPTION, then
literature-sourced parameters (left alone unless clearly mis-applied). Car-following parameters from [Treiber2000] and
calibrated ranges stay fixed.

### D4 Stability criterion
The baseline is "stable" when a 60-minute PM-peak run at scale 1.0 has zero gridlock
removals, backlog below 2% of spawned trips, and arterial mean speed above 4 m/s.

### D5 Fit tolerance
Modeled select-link shares within ±10 percentage points of observed for the headline
shares (freeway origin/destination share on Hillegass and Colby); others are reported but
not gated. StreetLight samples are themselves approximate.

### D6 Signals follow the street and the measured flow (third round)
Phases group approaches by street name, falling back to bearing when names do not resolve, because grouping by bearing put two streets of a skewed junction in one phase. Every five minutes each signal recomputes its Webster cycle and splits from the approach flows measured in the last window, with the standing queue counted as unserved demand, so the plan follows the demand as actuated or coordinated control would [Webster1958]. A user-set cycle stays pinned. Phase caps, cycle range (75 to 120 s), adaptation interval, smoothing and the left-turn trial are recorded in `data/calibration/rockridge.record.md`; every value is an assumption.

### D7 Vehicles queued on ramps wait
The gridlock breaker does not apply to a vehicle on a motorway-class link whose next link is also motorway class. The queue stays in the origin backlog and is metered at the ramp's discharge rate. The record reports removals with and without the rule because it changes how D4 reads.

### D8 D4 stays open after the third round
Street phases, adaptive splits and the ramp rule did not bring the removal count to zero at `assumedGateScale` 0.35 (PM 6.7, AM 6.0 over three seeds), and the re-route share and gate scale cannot be moved without more removals. The remaining removals concentrate on Telegraph between 55th and 59th. The baseline stays labeled uncalibrated.

## Contract changes

Additive changes to the Network contract (`version` stays 1; consumers ignore unknown fields):

```ts
interface Node {
  // ...existing fields...
  canEnter?: boolean;   // gates only: trips can start here (outgoing link connected to the main network)
  canExit?: boolean;    // gates only: trips can end here (incoming link reachable from the main network)
}
```

- A roundabout or traffic-circle ring is one `traffic_circle` node at the ring centroid; ring ways are not links and approach geometry ends at the center.
- Motorway-class links, and nodes touched only by motorway links, are never `inStudyArea`. The study area is derived from an ordered `boundary` list of streets in the area config; Rockridge is bounded by Telegraph Ave, Alcatraz Ave, College Ave, Claremont Ave and the northern carriageway of SR-24. Links on a boundary street count as inside.
- Config `selectLinks: number[]` (sim `Config`) enables select-link recording; empty by default.
- Network `turnBans?: { from: number; to: number; periods?: string[] }[]`: motor-vehicle movements banned by OSM turn restrictions (link into the junction, link out of it). `periods` lists the demand periods of a time-conditional ban; the simulator drops the others at start-up. Link `leftLanes?: number`: lanes marked left-turn only in OSM `turn:lanes` at the end of the link.
- Config `rerouteShare: number` (0 to 1, default 0.8) is additive.
- Config `signalAdaptMin: number` (minutes between signal adaptations, default 5, 0 keeps the start-up plan) and `motorwayGridlockRemoval: boolean` (default false) are additive.

### D6 Simulate a wider area than the study area
Decided with the user on 2026-11-12. Round three sent 56% of freeway-bound trips down
Telegraph from north of Alcatraz against 8% observed. Trips enter at gates fixed by
assumption, so the choice a driver makes farther out (Shattuck to the 51st/52nd ramps,
Ashby to Tunnel Road, or through the neighborhood to the Claremont ramps) was baked into
demand. The simulated network now reaches Ashby Ave in the north, Sacramento St in the
west, 51st/52nd St with the SR-24 ramps there in the south, and Tunnel Road to SR-13 and
SR-24 in the east. The study area (outline, cut-through and safety metrics) is unchanged.
Gates move out to larger roads, more of which have counts, and displaced traffic can use
another ramp. A regional assignment feeding a small window was considered and deferred:
it generalizes better but is more than this needs now. Tuning resumes after the wider
network is in place.

Implementation notes (2026-11-12). The model area is bbox `-122.286, 37.830, -122.220, 37.8605`; the study-area polygon is unchanged. The OSM extract was fetched through the OpenStreetMap map API because no Overpass mirror answered. Ramp demand is generated between the freeway mainline gates and surface gates or in-area nodes, so the router chooses the ramp; the ramp ADT from Caltrans is kept as a check on the modeled ramp flows. `assumedGateScale` is 1.0 and the class defaults are back to their documented values, so the first run is untuned and gridlocks (PM, scale 1.0: 450 removals, 20% backlog). Tuning follows in task 7.3.

### D9 Fourth round: accounting, importer and fit on the wider network (task 7.3)
Decided and measured on 2026-11-12; every step is in `data/calibration/rockridge.record.md` (steps P to X).

- Accounting. The demand total (28.8k veh/h PM) was the sum of the gate targets and the ramp counts, not double counting, but two errors changed its composition: one Caltrans ramp row (7,800 ADT) was counted for each of two aliased ramps, and the cut to 8,000 flows renormalized with one factor, so ramp trips were 23% above the ramp counts and local trips a fifth of their volume. The cut now thins the tail and fits each class back to its origin and destination volumes [DemingStephan1940]. Ramp trips equal the ramp counts within 1.3%, and counted gates take 1.01 to 1.03 of their inflow target.
- Importer. Signal pairs up to 40 m apart that are joined by two-way links become one node, including near the extract edge. OSM turn restrictions become `turnBans` (80 entries, 11 of them timed for the peaks), and marked left-turn lanes are read from `turn:lanes` so the pocket does not add a lane (185 links). Lane counts of 1,142 links on the wider arterials already matched OSM. One-way chains of signals at ramp terminals stay separate, because joining them would create movements that do not exist.
- Simulator. An unflagged approach of a lower class at a two-way stop node yields, as at an uncontrolled node.
- Stability. `assumedGateScale` is 0.5 and the re-route share stays at 80%. D4 is not met in any period and cannot be met by the factor: with the assumption gates at zero and half the ramp trips, 17k veh/h still gives about 60 removals and 4% backlog. The limits are the SR-24 west-end ramps (32,600 ADT of off-ramp demand against two-lane arterials), the south-edge corner cut by the extract, and about 170 removals per run spread over many signals. D4 stays open (tasks 3.1, 5.4 and 6.7).
- Fit. `ramps.localShare` is 0.60. Three of four PM headline shares are within 10 points (Colby NB from the freeway is 13 under). The ramp via-street shares of Colby St, Hillegass Ave, Martin St and College Ave are within 10 points of the observed values, except that Telegraph Ave north of Alcatraz Ave is 52% against 8%. The area stays uncalibrated.

### D10 Validate the primitives before tuning demand (fifth round)
Decided on 2026-11-12. The wider network jammed while the counted corridors carried about half their expected flow, so the simulator's basic capacities were measured in isolation against published values (`data/calibration/validation.md`). Five mechanisms were below real values and were fixed in general form: a turn-speed limit that held turning head vehicles to 4 to 5 m/s along the whole link; car following that left a larger gap than the time-gap parameter (IIDM, [Treiber2014], with the signal-discharge means T = 1.2 s and a = 1.5 m/s2 of the same paper); a fixed 4 m/s gate entry speed; crossing conflicts held for the whole crossing instead of until the conflict point is clear; and a second full stop for each queued driver at a stop line (HCM follow-up times, [HCM7]). No parameter was moved away from a cited value to pass a case. `assumedGateScale` went back to 1.0. Cases that still fail are listed with their mechanism in the record. D4 is still not met at full demand; the PM peak meets it at demand scale 0.4, and no demand factor was applied.

