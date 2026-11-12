## Context

Decided with the user on 2026-11-12: calibration of the car baseline is parked as an
uncalibrated preview (three of four observed route shares fit; peak periods still jam
near the freeway ramps), and work moves to the multimodal agents asked for in v1. The
`baseline-calibration` change stays open until better count data arrives.

## Decisions

### D1 One agent engine, three kinds
Every agent has a kind: 0 car, 2 bicycle, 3 pedestrian. Code 1 belonged to the bus (see
D2), is retired and stays unused, so the other codes do not change. Cars and bicycles
share the lane-based longitudinal model with kind-specific parameters. Pedestrians move
on sidewalks beside links and cross at nodes and marked crossings. A separate pedestrian
engine (a social force model [Helbing1995]) was considered and rejected: sidewalks here
are uncrowded, so the interactions that matter are at crossings, not between walkers.

### D2 Buses (withdrawn 2026-11-12)
Buses are not simulated. The user decided on 2026-11-12: "I don't think the bus routes
matter that much. You can cut them from the simulation altogether." Bus routes matter too
little to the questions this tool answers to justify the data pipeline (a GTFS download,
route matching and bus stops in the importer) and the agency token it needs. No transit
file was ever built or published, so no data had to be migrated. Removed: the agent kind,
its car-following parameters, the `transit` entry of `areas.json`, the `transitJson`
constructor argument and `modes.bus`. Cars, bicycles and pedestrians behave as before, and
on the real network the results are identical.

### D3 Bicycles
A cyclist follows the same car-following form with a desired speed drawn from a normal
distribution fitted to observed cyclists (mean 5.23 m/s, SD 1.25 m/s, [Twaddle2016]).
The car-following parameters themselves stay assumptions. On a link with a bike
lane, cyclists and motor vehicles do not interact along the link. On a shared link a
motor vehicle behind a cyclist follows until it can pass; passing needs a gap in oncoming
traffic on two-way single-lane streets and is free where a second lane exists. Each pass
is recorded, and a pass with small lateral room or high speed difference counts as a
close-pass conflict. The lateral threshold is the 3 ft legal minimum [CVC21760]; observed
passing distances are in [Beck2019] and [Hamm2026]. The oncoming-gap and speed-difference
thresholds are assumptions. Cyclists obey signals and stop control like vehicles and pass
through modal filters.

### D4 Pedestrians and crossings
Pedestrians walk at a speed drawn from a normal distribution (mean 1.44 m/s, SD 0.30 m/s,
from the median and 15th percentile of [Fitzpatrick2006]) and cross at intersections and
marked mid-block crossings. At signals they cross with the phase parallel to their path.
Elsewhere drivers yield with a probability taken from staged-pedestrian counts at
uncontrolled 25 mph two-lane crossings ([OBrien2022]: 0.33 marked, 0.08 unmarked; see also
[Bertulis2014] and [Fitzpatrick2006] for the fall with speed and lane count); a driver who yields treats the crosswalk as a stop line until
the pedestrian clears, and a pedestrian facing non-yielding traffic waits for a gap. The
critical gap is crossing width over walking speed plus a 3 s start-up margin
([Fitzpatrick2006], HCM Equation 18-17).
Pedestrians pass through modal filters.

### D5 Safety by mode
For each vehicle-pedestrian and vehicle-bicycle encounter the model records
post-encroachment time and the vehicle's speed. Encounters under the threshold count as
conflicts [Hayward1972, Mahmud2017, FHWA-SSAM2008], and the vehicle speed feeds an
exposure-weighted injury-risk index from published speed-risk curves: [Tefft2013] for
pedestrians and [Lubbe2022] for cyclists. The 1.5 s PET threshold is an assumption; no
published threshold for these encounters was found. These are surrogate
indicators, as with the car metrics, and the UI says so.

### D6 Walking and biking demand is an assumption
No counts exist for these modes here. Flows are synthesized from census workers and jobs
by block [LODES] with documented mode shares and trip lengths, plus trips to the commercial
streets. Every value is labeled an assumption and exposed in
the demand config.

## Contracts

All additions are optional fields so older files still load.

### Network additions
```ts
interface Link {
  bikeLane?: boolean;            // dedicated bike lane or track in this direction
  bikeRoute?: boolean;           // signed bike route or bike boulevard
  sidewalk?: boolean;            // walkable alongside (default true except motorway)
  crossings?: number[];          // marked mid-block crossings, meters from link start
}
interface Node { markedCrossing?: boolean }
```

### Demand additions
```ts
interface Flow { mode?: 'car' | 'bicycle' | 'pedestrian' }   // default 'car'
```

### WASM API changes
```
new Simulation(networkJson, demandJson, configJson)
vehicles(): Float32Array     // stride 6 unchanged; kind = 0 car, 2 bicycle, 3 pedestrian (1 retired)
metrics(): string            // adds:
  modes: {
    car:        { inNetwork, completedTrips, meanTripTime },
    bicycle:    { inNetwork, completedTrips, meanTripTime },
    pedestrian: { inNetwork, completedTrips, meanTripTime, meanCrossingDelay }
  },
  vulnerable: {
    pedConflicts, bikeConflicts, closePasses,
    pedInjuryRiskIndex, bikeInjuryRiskIndex,
    meanVehicleSpeedAtPedEncounter
  }
```
Existing fields keep their meaning and count cars only.
