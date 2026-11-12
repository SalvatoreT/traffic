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

### D12 Fit the demand to link counts by assignment (seventh round)
Decided on 2026-11-12; steps AM to AQ of the record. After the sixth round the simulator's capacities sat in published ranges, yet at full demand the peaks completed about 14,000 of 24,500 offered trips an hour, while the counted corridors already carried roughly their counts. The trip table was fitted to counts at the gates only; nothing checked what it loaded onto links inside the model. The builder now does the standard thing:

- Static assignment in `tools/` (no simulator): every car flow goes to its free-flow shortest path with the router's cost (link time, turn and control penalties, the 1.25 factor on local streets, one-ways, turn bans per period). 5 assignments with seeded cost noise of 8% split each flow, which approximates the router's per-driver noise.
- Every count the pipeline holds is a target on directed links: counted gates (as trips generated at or absorbed by the gate node), turning-movement legs, Caltrans stations inside the model, and ramp ADT at the freeway link of each counted ramp. AM and midday targets are the PM counts times the period factors (ASSUMPTION).
- Multiplicative proportional updating of the flows [VanZuylen1980], [Willumsen1981]: each flow is multiplied by the weighted geometric mean, over the counted links on its paths, of target over assigned volume; cumulative factors are bounded (0.1 to 3; ramp flows 0.1 to 10, because the free-flow router sends most ramp trips toward a few ramps and reaching the published ADT of the others needs larger factors; ramp stations weigh 2). Flows that cross no counted link take the volume-weighted median factor of the counted flows of their type. The update rule is ours; neither paper's equations were read (both entries are V-meta).
- A capacity sanity guard (ASSUMPTION, not data): an uncounted link carries at most 110% of the capacity the validation suite measured for its end-node control. It acts as soft upper limits of weight 0.5 inside the fit, so counts win a conflict.
- Counts win. A gate whose count conflicts with another count on its paths gives way and the fit report says so: the two Tunnel Road gates each take the full Caltrans station ADT (the street is counted twice), so they end at 0.68 and 0.69 of it in the PM peak while the station inside the model keeps its count.

Measured effect: PM offered 25,462 to 23,524 veh/h, AM 20,602 to 20,341, midday 16,010 to 15,282. 66 of 69 stations are within 15% of their target in every period (28 before), ramp totals are within 1% of ADT x K. Simulator, scale 1.0, mean of seeds 1 to 3: PM completes 18,245 trips (13,885 before) with 8.7 removals (88 before) and 3.3% backlog (5.1%); AM 16,533 (14,198) with 3.3 (32) and 1.4% (1.2%); midday 13,237 (12,670) with 0.3 (8) and 0.0%. D4 still fails in the PM and AM peaks, and the 120-minute PM run shows the backlog at the SR-24 west-end mainline gate growing without bound (657 trips at 60 min, 1,966 at 120) while vehicles in the network grow only from 4,600 to 5,300 and the area does not fill. D5 got worse (1 of 4 PM headline shares within 10 points, 3 of 4 on the same seeds before): the fit keeps all the freeway-ramp volume and cuts local and through volume, which raises the freeway share on Hillegass Ave NB and lowers it on Colby St SB. The baseline stays uncalibrated. A period is listed as experimental in the area manifest when D4 fails in at least half the seeds run (PM 3 of 3, AM 2 of 3; midday 2 of 6, each by one removal), and the app opens on midday (`defaultPeriod`). D4 holds at demand scale 0.6 (PM) and 0.8 (AM).

### D13 Fit stopping, observed shares, restrained assignment, ramp pools and merges (eighth round)
Decided on 2026-11-12; steps AN to AS of the record. The seventh round's fit never converged, its route shares fit worse, and the simulator showed three network mechanisms the static model could not see.

- The fit stops on a criterion. Three PM stations cannot be met together (the Caldecott Lane on-ramp and the two Tunnel Road gates), and pairs of turning-movement legs that share 95% of their flow differ by 16% in their counts, so "every station within 1%" could never hold. The loop stops when the stations that can still move are within 1% and the flows have stopped drifting, or stalls, and every station set aside is listed with the stations that oppose it. Damping stays 1: 2 and 3 oscillate.
- Observed shares are soft constraints in the same update (weight 0.5, below the counts, because they come from a device sample). The ramp shares in the targets file are for trips from the north of the ramps, so the constraint and the calibration report both use the side and the "north of X" qualifier from the targets file. Street names stay in data.
- The assignment follows the simulator's route choice (least cost-to-go with a per-driver factor on each candidate link) and averages passes over BPR link costs (method of successive averages [PowellSheffi1982], BPR form [Spiess1990], alpha 0.15 and beta 4 ASSUMPTION). Agreement with the simulator on the route shares improves from 15.7 to 6.7 points; link volumes agree better (correlation 0.65 to 0.70) but the assignment still puts 2 to 11 times less traffic on the Hillegass Ave and Colby St blocks than the simulator.
- Ramp trips are drawn per ramp with an access decay (300 s, ASSUMPTION), not once per mainline gate. The Telegraph Ave share of the Claremont on-ramp trips is not a ramp-pool problem alone: the two westbound stubs of SR-24 at the west edge (nodes 689 and 699) are one carriageway, and merging them in the importer is the remaining fix. The share constraints remove the symptom in the model (5% against 8% observed).
- The simulator's merge onto a multilane exit keeps a time gap instead of blocking until the node is empty (0.85 of the path, ASSUMPTION). It was the throttle at the 52nd St off-ramp: PM removals 5.7 to 2.3 and backlog 3.9 to 2.1% on the same demand. A lane choice by fork branch was tried and left out (no effect).

Effect on the final state (mean of seeds 1 to 3, before to after): PM completes 19,098 trips (18,245) with 4.7 removals (8.7) and 2.8% backlog (3.3%); AM 17,459 (16,533), 0.7 removals (3.3), 0.6% (1.4%); midday 13,361 (13,237), 0 (0.3), 0.0%. D4 fails in the PM peak (all seeds) and in two of three AM seeds (one removal each); midday holds. D5: one of four PM headline shares within 10 points; the ramp via-street shares are within 5 points except Martin St from the freeway (22 against 10). The status stays `uncalibrated`; `experimentalPeriods` are `pm_peak` and `am_peak`.

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
- Link `fromBearing?: number` and `toBearing?: number` (degrees clockwise from north): how the link leaves its start node and arrives at its end node as a driver experiences the street, a chord over the first or last 25 m of the way geometry measured from where the link met the street before a junction join moved its end to the cluster centroid. A merged staggered junction draws each side-street link along the through street for its first stretch, so geometry near the node misreads the leg. The importer always writes both. Consumers (diverter legs, phase grouping, turn classification, pedestrian legs, reference labels, the UI) use them and fall back to the same chord over the node-to-link geometry when absent (`Network::leg_bearing`, `legBearing`). Link and node ids and every other field are unchanged. Rendering and vehicle paths still follow the merged geometry.
- Config `rerouteShare: number` (0 to 1, default 0.8) is additive. Replaced in the tenth round by `guidedShare` (share of drivers following live guidance), `switchBand`, `recordTrips` and `legacyReroute` (A/B runs); the old key is gone.
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

### D11 Audit the perimeter demand and place the gates mid-block (sixth round)
Decided on 2026-11-12; steps AE to AL of the record. The lead's reading was that offered demand (28.8k veh/h in the PM peak) was about twice what the network completes and that much of the excess sat at the model edges. The demand builder now audits every trip: 47% of PM trips never came within 400 m of the study area (59% of through trips, 72% of local trips, 29% of ramp trips). Rules, all config-driven and logged:

- Corner-clipping through pairs are dropped, not refit, because refitting kept the gate totals but moved the volume to longer pairs and cost 7% of completed trips. The drop is 1,642 veh/h on the earlier area (606 on the current one) and took 242 removals to 61. Counted gates lose up to 11% of their count by it; that is accepted and stated in the demand-model spec.
- A per-gate cap at min(target, lane capacity x 837 veh/h per lane) on peripheral trips removes nothing: no gate direction is above its lane capacity (the highest is 0.86). The cordon is not the limit; the interior signals are.
- Counted gates keep both directions in the through balancing and the assumed gates take the scaling. The earlier balancing cut every gate's PM outflow to 0.77 of its target; no double counting was found.
- Class defaults are the median ADT of counted streets of the class when at least three exist. The data say the documented defaults are low for tertiary (12,200 against 5,000), which raises offered volume; counted streets are the busiest, so this is a high estimate. The record shows the documented-default variant (13,885 completed, 88 removals against 13,239 and 150) for the lead's decision. `assumedGateScale` is removed.
- The model area's south and west edges moved inward (south 37.8325, west -122.2845) after comparing candidate edges by the number of gates within 60 m of a signal (17 before, 2 after; 40th St and the San Pablo Ave/Ashby Ave junctions are outside). Extending south would add the MacArthur Maze and uncounted ramps. The importer warns about gates near signals on every side.
- The adaptive signal plan was not changed. The case that showed 16% less green for a saturated arterial rewarded a start-up plan that starves the cross street (it serves 588 of 1,000 veh/h); the case now compares vehicles served.
- Count scaling for walking and biking has no clamp and is fitted on the final flow list.

D4 is still not met at scale 1.0 (PM 150 removals, 5.9% backlog; AM 42 removals; midday 11 removals). It is met at scale 0.4 (PM), 0.35 (AM) and 0.6 (midday). The remaining limit is the interior: the SR-24 west-end ramps (32,600 ADT of DATA through one mainline gate) and the arterial signals behind them. D5 holds for two of four headline shares. The baseline stays uncalibrated.


### D14 Ninth round: merge freeway-edge stubs, count once, right turn on red (task 12)
Decided on 2026-11-12 (lead's instruction); measured in the ninth round of the record.

- The model box cuts a freeway carriageway into stubs. Mainline gates of one direction within 80 m, with similar bearings and only freeway-class links, are one gate; so every ramp of that end reaches it. Options considered: extend each stub to one node (chosen, with the lanes of parallel stub links added) and join separate carriageways with a zero-length connector (not needed: at no end of SR-24 were the stubs separate roads that cars cannot move between). A check lists ramps that cannot reach a mainline gate.
- Per-ramp pools in the demand stay: they were made for the split gate, but after the merge a gate pool would mix ramps 4.5 km apart.
- A count is used once. When a gate station and a link station carry the same Caltrans or TMC record, the link station stays, because it measures all trips at that place; the gate keeps the record as its offered volume.
- Right turn on red is allowed after a stop at every signal (ASSUMPTION; the California Vehicle Code text could not be read here). It is the largest single change in stability: PM removals 6 to 0.7 an hour on the same network. It yields to every conflicting movement with the minor-right critical gap.
- The adaptive signal plan counts the queue on every link feeding an unsignalized merge that the queue reached, since an off-ramp merging ahead of a signal otherwise looked like no demand.
- Simulator-measured link costs in the assignment: built and run for three iterations (shares 12.6, 9.9, 15.1 points off; PM removals 0, 4.7, 4.7). Stability came before share error, so the published demand does not use them and the mechanism stays optional.
- Staggered T-junctions of a same-named cross street (35 m along the through street) are one intersection (user decision, via the lead); 14 pairs on Rockridge.
- After that join D4 holds in midday, fails in the PM peak in 2 of 3 seeds and in AM in 1 of 3 (it held in all three periods before it). D5 fails on Colby St SB, so the status stays `uncalibrated`, the PM peak is experimental and midday is the default.

### D15 Tenth round: drivers commit to a route (task 13)
The user reported cars that wander through the neighborhood and expected Berkeley traffic cutting through to SR-24 and College Ave traffic bypassing on Hillegass Ave. Every trip already had an origin and destination. In the code, every 60 s epoch 80% of en-route cars re-planned from the current link and took the result whatever the gain (the share was raised from 30% to 80% in step I as a stabilizer for gridlock that other fixes have since removed). Measured first (step 13.1): about one route change per trip in the PM peak (43% of trips changed at least once, 60% of gate-to-gate trips), mean detour 1.115 against the shortest distance, 9% of trips above 1.3, 0.3% above 2, 0.1% looping, 6.6% with a reversal within 200 m.

Decisions:
- Indifference band: a guided driver switches only if the alternative remaining route is cheaper than the current one by more than 20% and more than 30 s. [Mahmassani1987], [Srinivasan2000] and [Di2016] establish the mechanism; [Guin2021] reports that 3 to 5 min of saving was needed to accept a rerouting on commute-length trips. No source gives a value for neighborhood trips, so 20% and 30 s are ASSUMPTIONS (`SWITCH_BAND`, `SWITCH_MIN_GAIN_S`; config `switchBand`).
- Like with like: both costs use current link times and the driver's per-link noise, which was already fixed per trip (`noise(seed, link)`); the cost of a path is summed link by link.
- No backtracking: an alternative may not touch a node already visited on the trip, which covers reversing onto the link just left and U-turns. A blocked route lifts the rule.
- At most 2 voluntary changes per trip, at least 120 s apart (ASSUMPTION).
- Two classes: 46% follow guidance [Guin2021] (regular commute trips; first-time trips 78%), the rest keep the departure route unless blocked. A blocked route is a closed link or banned movement on the remaining route (intervention), or a next link without room for 60 s (ASSUMPTION); both classes then re-plan from the current link.
- Departure routing is unchanged (current measured link times). Local trip ends are nodes (nearest residential node to the census block); a trip ends on first arrival at its destination node, so it cannot circle; the metrics show no loops for trips with a local end.
- The diagnostics (a) and (b) are configured in the targets file under `patterns`. They have no observed counterpart.

### D16 Eleventh round: judge stability over ten seeds, on means and shares of seeds (task 14)
Decision of the user, 2026-11-12, with `docs/simulator-audit.md` (C1 to C5, C8, I3, R1) as the source. Results are judged and reported over ten runs with the fixed, documented seed list 1 to 10, never chosen: [WebTAG-M3.1] C.9.1 and C.3.14 ask for at least ten runs and strongly discourage choosing seeds; [TfL-TMG4] 7.5.1 asks for consecutive seeds, the same list for base and proposal, and the seeds listed in the report. `calibrate --seeds 1-10 --jobs N` runs them as parallel processes and reports, for every headline metric, mean, standard deviation, min, max and the 95% interval of the mean (Student t, n - 1 degrees of freedom): removals, backlog, backlog growth, completed trips, arterial speed, cut-through vehicle-miles, every route share, ramp share and corridor flow. Demand is fixed, so seed noise is the only noise in the intervals (the FHWA 2019 argument that day-to-day variation dominates does not apply here; [FHWA-TAT3-2019] chapter 5).

D4 as first written (60-minute PM run at scale 1.0: zero gridlock removals, backlog below 2% of spawned trips, arterial mean speed above 4 m/s, evaluated on seeds 1 to 3) flipped on one vehicle: the PM peak failed in 2 of 3 seeds by one removal or 0.04 points of backlog (audit C3). The old numbers stay in every report for comparison. The new stability rule, thresholds in `acceptance.stability` of the targets file:

| Check | Old D4 | D16 | Reason |
| --- | --- | --- | --- |
| Gridlock removals | 0 in every seed | mean below 1.0 per hour over the seeds | [TfL-TMG4] 7.5.2.7 asks that the error file (removed vehicles, vehicles not loaded, circular routes) be "empty or small". In the record, stable states show 0 to 1 removals per seed (ninth round PM 0 / 0 / 0) and failing ones 2 to 3 (tenth round PM 2 / 2 / 1, mean 1.7 per hour), so 1.0 sits between them, and one removal in one of ten seeds moves the mean by 0.1 |
| Entry backlog | below 2% of spawned trips in every seed | below 2% in at least 9 of 10 seeds | keeps the per-seed budget and tolerates one outlier seed; no published numeric limit exists (audit C4), so the budget stays an ASSUMPTION |
| Runaway growth | not tested | no seed adds more than 2.0 points of spawned trips to the entry backlog in the second half of the run | the 120-minute PM run grew its backlog from 389 trips at 60 minutes to 1,192 at 120 (audit C8): on the base of a 60-minute run that is about 2 points per half hour, so a seed that grows that fast is not a steady state ([WebTAG-M3.1] C.2.14 asks for the judged period to be in a loaded, non-saturating network). ASSUMPTION for the exact value |
| Arterial mean speed | above 4 m/s | seed mean above 4 m/s | unchanged |

Judged window: the run starts from the simulator's start-up state (see the record for whether it is empty or pre-loaded) and the whole 60 minutes are judged for removals and backlog; speed and flow tables skip the first 10 minutes (`--warmup`). No cool-down period is simulated. This is the statement audit C8 asks for. The 120-minute PM run is reported beside the 60-minute ones.

### D17 Standard acceptance tests and a hold-out set (task 14)
Decision of the user, 2026-11-12. The published flow criteria are implemented exactly as `docs/simulator-audit.md` states them from [WebTAG-M3.1] (3.3.10 to 3.3.12, table 2) and [TfL-TMG4] (appendix II): GEH = sqrt(2 (M - C)^2 / (M + C)) for hourly flows; GEH below 5 in more than 85% of cases; size bands within 100 veh/h below 700 veh/h, within 15% from 700 to 2,700, within 400 above 2,700, in more than 85% of cases; the guidance says either criterion suffices and both are reported. The vendor classes (0 to 5 good, 5 to 10 investigate, above 10 unacceptable) come from [Aimsun-Manual]. The code is `tools/lib/acceptance.ts` with tests.

Count stations are scored twice: the static assignment against the counts it was fitted to (`rockridge.fit.md`, every station with GEH and pass or fail) and the simulator's own link flows, mean over the seeds, for the stations that sit on links (`tools/assess.ts`; gate stations have no link and appear only in the fit report). Hold-out, [WebTAG-M3.1] C.3.2 and 4.2.1 and audit C2: about a quarter of the stations are validation-only, chosen deterministically so that every corridor (a street of gates, a turning-movement intersection, a Caltrans station street, all freeway ramps together; 9 on Rockridge) has at least one, the largest count of a corridor staying in the fit. Leaving them out of the fit that ships is a trade: in a trial it lowered the PM demand by 19%, because flows that touch no count fall to the median factor. The build therefore fits twice: without the validation stations (the out-of-sample figures, reported separately, and a demand file the simulator is run on to score them) and on every count (the demand that ships). Leave-one-corridor-out, which the audit prefers, costs one fit per corridor and was not run; it remains a task. A passing share on weak counts says little: counts here are single-day or ADT-derived ([WebTAG-M3.1] 3.3.9 and 3.3.12: explain, do not force).

### D18 Fit rule from seed means, and a damped cost loop (task 14)
Decision of the user, 2026-11-12. D5 (four headline select-link shares within 10 points of observed) is judged on the seed means with the 95% interval shown, not on one run. The audit notes that no published rule gates on every share (flow criteria gate on more than 85% of cases and explain each miss; audit C4), so the headline gate stays but the report lists every share with its interval and names each miss. A period is `calibrated` only if (a) the D16 stability rule holds in every period, (b) in the PM peak all four headline shares are within 10 points on the seed mean, and (c) in the PM peak GEH below 5 or the size bands hold at more than 85% of the fitted stations on the simulator's flows; held-out stations are reported and not gated, because no published rule sets a hold-out threshold. Otherwise the status is `uncalibrated`, the periods that fail D16 are `experimentalPeriods`, and `defaultPeriod` is a period that passes.

Cost feedback (audit R1): the ninth round's loop used one seed's delays and replaced the costs each iteration (share error 12.6, 9.9, 15.1 points; stability lost on the second pass). The loop now (1) takes each iteration's costs as flow-weighted means over several seeds, (2) averages them into a running cost vector by the method of successive averages with weight 1/n ([WebTAG-M3.1] 3.4, [Aimsun-Manual] DUE page, [SUMO-Docs] dynamic user assignment; the 2/(n+1) variant is implemented), (3) measures the relative gap of the cost vector and the share of links whose cost changed by under 1% (the WebTAG criterion of four consecutive iterations with more than 98% of links changing by under 1% is stricter than the simulator's noise allows, so the stop is a relative gap under 0.10, the 5% to 10% range of [Aimsun-Manual]), and (4) keeps an iteration only if it improves the headline-share error by at least 0.5 points while the PM peak stays stable under D16 and the GEH shares do not fall by more than 5 points. The thresholds 0.10, 0.5 points and 5 points are ASSUMPTIONS.

Noise band (audit I3): the per-link standard deviation of flow over the ten seeds, per period, is written to `public/data/<area>.noise.json` (Uint16 counts of 0.5 veh/h as JSON numbers) and listed as `noise` in `areas.json`, so the app can later draw "no change" from the measured spread. It measures simulator noise at the baseline only; a scenario's spread is assumed similar (ASSUMPTION).

Resident observation (2026-11-12): Hillegass Ave and Colby St carry clearly more than about 100 veh/h at the PM peak, many Berkeley drivers cut through to SR-24, and Hillegass Ave is a bypass of College Ave. It is recorded in the targets file as a qualitative note, not a count. Volumes implied by two published numbers (ramp count x via-street share / freeway share of the street's traffic; DERIVED, soft constraint weight 0.5) enter the demand fit; both readings of the ramp share's denominator are computed (all ramp trips; trips from the north side) and the target is the midpoint.

### D19 Runs start with traffic on the streets (user report, 2026-11-12)
At time zero the simulator started with an empty network and filled over several minutes, so the first minutes of every run showed unrealistically light traffic and the one-hour comparison window included the fill-up. The native calibration CLI discarded a 10-minute warm-up, the app did not, and stepping 10 to 15 minutes in the browser would cost tens of seconds per run (a baseline and a scenario). Decision: `Simulation` places agents already en route at construction and at reset (`Config::initial_load`, default true; the calibration CLI takes `--no-initial-load` and keeps `--warmup`), then steps a settle interval before time zero.
- Count: for every flow of the active period (cars, cyclists, pedestrians) a Poisson number with mean rate x expected trip time (Little's law). The trip time is the free-flow route time with the expected control delay at each node, scaled by `INITIAL_CONGESTION` = 1.3 (ASSUMPTION, one value for all periods and modes, tuned on the real network, see the record). The extra time of a loaded network is put in the delay in front of stop lines, so queues at signals start with the right order of magnitude.
- Position: uniform by travel time along the agent's own route (drawn with the departure-time perception noise), in its lane in queue order, shifted back or skipped (counted in `initialSkipped`) when the gap to the leader is below the vehicle length plus s0 plus 0.5 m; speed is the highest that keeps the IDM desired gap to the leader, or for the lane head a comfortable stop at a controlled stop line and the turn speed of its next movement. Pedestrians are placed on a sidewalk or waiting at a crosswalk. Own random stream, so the placement depends only on the seed and the inputs.
- Scenario first: the interventions travel in `Config::interventions`, so the placement already respects closures; `reset` keeps the scenario. The app passes the scenario to the scenario run and none to the baseline, with the same seed, so both start from the same placement except where a link is closed.
- Settle: `INITIAL_SETTLE_S` = 120 s (ASSUMPTION) with the clock running from -120 s to 0, then route costs are updated once and signal splits adapted once from the settle flows. Measured in the browser for the Rockridge network: 1.7 s (midday) and 1.9 s (PM) to build one simulation, so the interval was not shortened.
- Results count from zero: every statistic, diagnostic, record and counter is cleared at time zero. Placed agents count in completed trips, flows, vehicle-miles, cut-through, speeds and conflicts, but not in mean trip time, delay, crossing delay or the wandering records, because their trips are partial. `initialAgents` and `initialSkipped` are in the metrics.
- Limits: the placement uses free-flow routes, so it puts about 20 to 30% fewer cars on residential streets and more on primary and secondary streets than a warmed-up run (drivers have moved onto local streets by then); the settle interval corrects part of it. Mean trip time and delay of the first minutes are biased toward short trips, because trips that began before time zero are excluded. The early-results caution in the UI is five simulated minutes instead of ten.
- The headless search tool (`explore`) keeps starting from an empty network with its own warm-up so its tested results do not move.
