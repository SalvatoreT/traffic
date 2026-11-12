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
- Config `signalAdaptMin: number` (minutes between signal adaptations, default 5, 0 keeps the start-up plan) and `motorwayGridlockRemoval: boolean` (default false) are additive.
