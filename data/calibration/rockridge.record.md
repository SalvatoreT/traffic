# Rockridge baseline calibration record

Run: `cargo run --release -p traffic-sim --bin calibrate -- --area rockridge --period pm_peak --minutes 60 --scale 1.0 --seed 1` (about 5 s on the original small network, about 1 min on the wider network of the fourth round).
Reports for the final state (seed 1) are in `reports/` (all three periods; the model area of the sixth round). Every value below is an ASSUMPTION unless marked DATA.
Run-to-run noise from the chaotic congested regime is roughly +/-5% on completed trips, so single steps of that size are not significant.
Steps C0 to C3 were measured on the step B2 demand (before F); D, E, F on the later demand. PM peak, scale 1.0, 60 min, seed 1.
Headline shares are the four freeway shares, modeled (PM observed): Hillegass NB from freeway (47), Colby NB from (47), Hillegass SB to (68), Colby SB to (45).
Speeds are in m/s; multiply by 2.237 for mph.
Steps AT to AY belong to the ninth round (task 12, freeway-edge stubs, one count once, right turn on red, measured costs): PM peak, scale 1.0, 60 min, mean of seeds 1 to 3.
Steps AN to AS belong to the eighth round (task 11, fit convergence, observed route shares, restrained assignment, ramp pools, merge rule): PM peak, scale 1.0, 60 min, mean of seeds 1 to 3 unless a row says otherwise.
Step AM belongs to the seventh round (task 10, count-constrained demand): PM peak, scale 1.0, 60 min, mean of seeds 1 to 3, measured on the demand of the sixth round (the row above it, AK) and on the fitted demand.
Steps AE to AL (and the variant AKb) belong to the sixth round (task 9, demand audit and gate placement): PM peak, scale 1.0, 60 min, mean of seeds 1 to 3; AE to AJ were measured on the model area of the fourth round, AK on the new one.
Steps Y to AD belong to the fifth round (task 8, validation of the simulator's primitives, `validation.md`): the suite measures each fix on a tiny network, so the real-network columns are filled only for the final state (step AD, PM peak, scale 1.0, mean of seeds 1 to 3, `assumedGateScale` 1.0).
Steps P to W belong to the fourth round (task 7.3, the wider network of 2,162 nodes and 5,401 links with all modes). They are measured on the PM peak, scale 1.0, 60 min, as the mean of seeds 1 to 3, and each step was measured on the demand and network of that step, so rows differ in more than the one change named. Step 7.1 is the untuned state at the start of the round (seed 1 only).
Steps K to N belong to the third round (signals and ramp terminals), measured the same way on the final demand (seeds 1 to 3, PM peak). Steps G to J were measured on the second calibration round: the figures are the mean of seeds 1 to 3 (PM peak, scale 1.0, 60 min). The state before step G is the seed-1 row of step F. Seeds differ a lot at the same state (PM removals 8 to 54 across six seeds at one setting), so differences below about 10 removals are not significant.

| Step | Change (before -> after) | Type | Reason | Completed trips/h | Gridlock removals | Backlog | Arterial speed (m/s) | Headline shares (%) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Starting point | | | 2853 | 764 | 47.6% | 1.17 | 10 / 21 / 23 / 24 |
| A | One-way gate pairs split the street volume by direction (each of an enter-only/exit-only pair within 250 m sharing a street name took the full two-way volume; offered 13,106 -> 11,482 veh/h) | BUGFIX | Double counting | 3139 | 644 | 30.3% | 1.37 | 21 / 29 / 20 / 30 |
| B1 | Residential default ADT 800 -> 300 | ASSUMPTION | 800 is a collector value; a local street carries about 300 | 3164 | 535 | 27.3% | 1.43 | 14 / 18 / 18 / 27 |
| B2 | Tertiary default ADT 5000 -> 3000 | ASSUMPTION | Remaining tertiary gates are hillside collectors; the counted tertiary Alcatraz (about 13k) is not representative of them | 3366 | 488 | 22.8% | 1.61 | 14 / 23 / 20 / 29 |
| C0 | Downstream-room check before a node crossing credits 2 s of leader motion (`NODE_CROSS_S`) | BUGFIX | Followers braked at the stop line while the leader was still inside the node: discharge headway ~3.5 s | 3359 | 467 | 26.2% | 1.67 | 9 / 17 / 24 / 38 |
| C1 | Lane choice by movement (left -> inner lane, right -> outer lane, through -> lane with most room) | ASSUMPTION | One blocked left no longer blocks all lanes | 3387 | 460 | 22.5% | 1.74 | 10 / 24 / 27 / 36 |
| C2 | Left-turn pocket (extra lane, 3 vehicles, entry blocked by a through queue > 20 m) at signalized primary/secondary/tertiary approaches (`POCKET_*`) | ASSUMPTION | Class rule; no OSM-derived flag (OSM lane counts already include turn lanes) | 3725 | 458 | 22.4% | 1.99 | 9 / 22 / 29 / 42 |
| C3 | Permissive-left sneakers: 2 per cycle on yellow/all-red (`SNEAKERS`); opposing vehicles that will stop for a yellow are ignored | ASSUMPTION | Standard HCM practice; [HCM7] is only partly verified in references.md, so not cited | 4120 | 316 | 20.9% | 2.19 | 17 / 18 / 34 / 45 |
| C4 | Uncontrolled junctions: checked, minor class already yields to major (`plevel` = class rank); equal classes keep yield-to-the-right. No change; test added | none | Already correct | 4120 | 316 | 20.9% | 2.19 | unchanged |
| C5 | Signal plans: `CYCLE_MIN` 60 -> 75 s, `MIN_GREEN` 10 -> 15 s. Greens remain proportional to the per-lane critical flow ratio of each heading group; checked all plans: arterial approaches get 55-80% of the cycle where the cross street is residential, about 50/50 only at 52nd/Telegraph, 56th/Telegraph and Aileen/Telegraph (ramp-fed cross streets). Shared controllers for signals joined by links < 25 m were tried and rejected (more gridlock): `SIGNAL_CLUSTER_M` = 0 (off) | ASSUMPTION | Less lost time per hour; the cross-street floor keeps ramp feeders served | (7331 offered) 5722 | 62 | 2.9% | 4.27 | 20 / 38 / 33 / 56 |
| D | Route choice: perceived-cost factor 1.25 on residential/service links (`LOCAL_COST_FACTOR`, config `localCostFactor`); tested 1.0 / 1.25 / 1.4 / 1.6 | ASSUMPTION | Street-hierarchy preference. Outcome was noisy: 1.0 gave Hillegass 19/41, 1.4 gave 29/54 with Colby SB 68; 1.25 is the middle value | 4269 (B2 demand) | 417 | 19.8% | 2.12 | 10 / 24 / 27 / 37 |
| E | Ramp trips with an in-area end: `ramps.localShare` 0.15 -> 0.30 | ASSUMPTION | Moves more freeway traffic onto Hillegass/Colby side streets without fixing routes | (final state) | 69 | 5.0% | 3.68 | 26 / 36 / 45 / 61 |
| F | `assumedGateScale` 1.0 -> 0.3 on all non-count gate volumes (residential 300 -> 90 ADT, tertiary 3000 -> 900, primary 14000 -> 4200). Count-based gates and ramps untouched | ASSUMPTION | Offered 8.5k -> 7.3k veh/h. Scales 0.5 / 0.15 gave no better stability | 5246 | 69 | 5.0% | 3.68 | 26 / 36 / 45 / 61 |
| G | Study area from five ordered boundary streets (Telegraph, Alcatraz, College, Claremont, SR-24 north carriageway), no outward buffer; links on a boundary street count as inside (`boundary` in the area config) | BUGFIX | The old polygon cut a chord south-east of the freeway and kept streets south-east of Claremont. Measured with junction joining off | 5660 | 43.0 | 2.0% | 4.62 | 27 / 46 / 49 / 60 |
| H | Importer junction joining (`junctionJoinRadius` 20 m): 76 graph nodes joined into 35 nodes (offset signal tags, offset T junctions, dual-carriageway crossings, ramp terminals). Dead `SIGNAL_CLUSTER_M` code removed | BUGFIX | Two signals 11 m apart each held one vehicle (Telegraph/56th, Telegraph/Aileen, Claremont/Forest-Colby). The first version, which rejected clusters with a one-way stub, gave 5774 / 18.0 / 1.5% / 4.52 / 45 / 45 / 50 / 56; splitting off the stub at Telegraph/Aileen made that ramp terminal one node and measured worse (noise is about this size) | 5470 | 29.7 | 3.3% | 4.05 | 35 / 38 / 52 / 50 |
| I | Re-route share per 60 s epoch (`REROUTE_SHARE`) 30% -> 80%; tested 10 / 30 / 60 / 80 / 100% | ASSUMPTION | Drivers with live routing move off a spilled-back link sooner. PM removals over six seeds: 51 / 30 / 14 / 10 / 7; shares unchanged within noise | 5775 | 10.3 | 1.8% | 4.45 | 36 / 42 / 48 / 52 |
| J | `assumedGateScale` 0.3 -> 0.35 | ASSUMPTION | Highest value that keeps PM backlog below 2% and arterial speed above 4 m/s over six seeds (0.4: backlog 2.4%, 3.8 m/s; 0.5: 2.1%, 3.7 m/s with 20 removals; 0.7: 124 removals; 1.0: 265 removals) | 5829 | 9.3 | 0.7% | 4.23 | 43 / 47 / 48 / 51 |
| K | Signal phases grouped by street (`phase_groups` in `eff.rs`): approaches with the same street name and an axis within 80 degrees share a phase; approaches of different or unnamed streets share one only within 30 degrees of the same axis; at most 4 phases (`MAX_PHASES`), the closest axes merge beyond that. Splits still fixed from the start-up estimate, cycle 75 to 90 s. College/Claremont/62nd and 52nd/Claremont/Telegraph now run three phases | ASSUMPTION | Two streets that meet at a skewed junction no longer share a green. An early version with a 50 degree same-name limit split 51st Street into two phases and gave 5.4% PM backlog | 5697 | 13.3 | 1.4% | 4.10 | 34 / 42 / 51 / 49 |
| L | Adaptive splits: every 5 min (`ADAPT_INTERVAL_S`) each signal recomputes its Webster cycle and green split from the approach flows measured over the window ([Webster1958]; smoothing weight 0.5 on the newest window, minimum green 15 s). Cycle range 75 to 120 s, applied at the end of the running cycle; a cycle set by the signal-timing intervention stays pinned and only the splits adapt. Cycle minimum tested at 60 / 75 / 90 s (PM removals over three seeds 10.7 / 4.7 / 9.3, within noise); 75 chosen because three-phase junctions at 60 s lose a quarter of the cycle to intergreens | ASSUMPTION | The start-up splits come from a free-flow route estimate that overstates Telegraph; measured flows approximate actuated or coordinated control | 5843 | 4.7 | 0.7% | 4.43 | 44 / 47 / 52 / 48 |
| M | Measured approach demand includes the standing queue at the end of the window, also when it has spilled back over up to 3 single-feed links (`ADAPT_SPILL_HOPS`). Vehicles queued on a motorway-class link whose next link is also motorway class (ramp, or the freeway stub feeding it) are no longer removed by the gridlock breaker; they wait and the queue sits in the origin backlog (`motorwayGridlockRemoval` config, default false). Measured in the same state with and without that rule: removals PM 6.7 / AM 6.0 with the rule, 5.0 / 6.3 without (three seeds; the stub accounted for about one removal per run) | ASSUMPTION | Ramp discharge sets the pace of a ramp queue. Neither part changed the result beyond the seed spread | 5906 | 6.7 | 0.7% | 4.45 | 39 / 42 / 51 / 50 |
| N | Re-route share re-checked at 30 / 50 / 80% with K to M in place (six seeds, PM removals / backlog / arterial speed): 27.0 / 3.2% / 3.85; 12.3 / 1.9% / 4.13; 7.5 / 1.0% / 4.45. Kept 80% | ASSUMPTION | No share reaches zero removals, and each cut roughly doubles them, so no lower share is defensible on D4 | 5906 | 6.7 | 0.7% | 4.45 | 39 / 42 / 51 / 50 |
| O | `assumedGateScale` re-checked at 0 / 0.2 / 0.35 / 0.5 / 0.7 (PM removals, AM removals): 1.8 and 0.2 (six seeds); 6.8 and 1.5 (six seeds); 7.5 and 3.3 (six seeds); 21.7 and 25.3 (three seeds, backlog 1.5% and 1.2%, 3.75 m/s); 96.7 and 105.7 (three seeds, 5% backlog, 3.1 m/s). Kept 0.35 | ASSUMPTION | The target of 0.7 is out of reach: D4 fails at every scale above 0, and the removal count climbs steeply past 0.35. The floor of about 2 removals with zero non-count demand comes from the count-based gates and the ramps | 5906 | 6.7 | 0.7% | 4.45 | 39 / 42 / 51 / 50 |
| 7.1 | Start of the fourth round: wider network, class-default ADTs, `assumedGateScale` 1.0, ramp demand at mainline gates (seed 1 only; offered 28.8k veh/h) | | | 9124 | 450 | 20.4% | 3.39 | 45 / 48 / 62 / 59 |
| P | Demand accounting in `build-demand.ts`. (1) One Caltrans ramp row (EB ON FR BROADWAY, 7,800 ADT) was given in full to each of the two ramps that alias to it; ramps that alias to one row now share it (ramp trips 13,770 -> 13,068 veh/h, the sum of ramp ADT x K). (2) The cut to the 8,000 largest car flows was followed by one renormalizing factor for all trips, which inflated ramp trips by 23% (16,988 veh/h against 13,770 expected) and through trips by 21% and shrank local trips to a fifth of their volume. Now flows below the cut are thinned (a flow v is kept with probability v/t and carries t), each origin's and destination's volume is restored by fitting on the kept pairs [DemingStephan1940], and one factor per class restores the class total (ramp 1.01, through 1.00, local 1.12). Total offered stays 28,758 veh/h (it is the sum of the targets); the split became through 8,617, local 7,073, ramp 13,068 (was 9,827, 1,944, 16,988) | BUGFIX | Ramp trips must equal the counted ramp volume, and a gate's modeled inflow must equal its target | 10462 | 521 | 13.1% | 3.51 | 38 / 41 / 46 / 44 |
| Q | Importer: signal clusters join up to 40 m (`signalJoinRadius`), and nodes near the extract edge join (edge margin 60 m -> 2 m). Signal nodes 123 -> 112; the West St/40th St, Harlan St/40th St, MLK Jr Way/55th St, MLK Jr Way/59th St and 65th St/San Pablo Ave pairs are one node each. One-way chains stay separate (see the area README) | BUGFIX | Two signals 11 to 40 m apart each held a vehicle; the south-edge pairs were excluded only because of the edge margin | 10093 | 510 | 12.9% | 3.47 | 49 / 32 / 43 / 30 |
| R | Turn restrictions from OSM `restriction` relations (69 always-on bans, 11 timed bans for AM and PM peaks, mostly Ashby Ave) and the `turnBans` contract | BUGFIX | The importer read no restrictions; real bans change which streets ramp traffic can use [OSMRestriction] | 10279 | 520 | 12.7% | 3.49 | not recorded (reports overwritten) |
| S | Two-way stop nodes: an unflagged approach of a lower class than the best approach now yields (Mather/Montgomery/Pleasant Valley: the residential Montgomery St leg had equal priority with the secondary through road) | BUGFIX | Same rule as at an uncontrolled node (step C4); removals at Gilbert St/Pleasant Valley Ave fell from 42 to 22 per run | 10772 | 428 | 12.1% | 3.66 | 47 / 34 / 45 / 26 |
| T | `assumedGateScale` 1.0 -> 0.5 on the 125 gates with class-default ADT (the count-based gates and the ramps stay at their data values). Offered 28.8k -> 24.9k veh/h | ASSUMPTION | Stability workaround, not an estimate. D4 fails at every value including 0 (see "Gate scale check"); 0.5 is the highest of the values tested (0, 0.3, 0.5, 1.0) that leaves arterial speed above 4 m/s | 12088 | 146 | 11.0% | 4.37 | 54 / 40 / 51 / 35 |
| U | Re-route share per 60 s epoch retested at 30 / 50 / 80% on the wider network (PM removals, backlog, speed): 335 / 11.5% / 4.09; 197 / 11.1% / 4.30; 146 / 11.0% / 4.37 | ASSUMPTION | Each cut raises the removals and none reaches zero, so no lower share holds. Kept 80% | 12088 | 146 | 11.0% | 4.37 | 54 / 40 / 51 / 35 |
| V | `ramps.localShare` 0.30 -> 0.60. Tested 0.30 / 0.45 / 0.60 / 0.75 (headline shares 54 / 40 / 51 / 35, 51 / 34 / 61 / 43, 48 / 42 / 62 / 43, 53 / 44 / 61 / 46) | ASSUMPTION | The model area is now 5.7 by 3.4 km, so most ramp trips end inside it; 0.30 was set for a 1 km area. 0.60 brings all four headline shares within 10 points at this step and cuts the Colby St and College Ave ramp via-street shares to near the observed values | 11279 | 178 | 9.9% | 4.17 | 48 / 42 / 62 / 43 |
| W | Left-turn pockets use the OSM left-turn lane where `turn:lanes` has one (`leftLanes`, 185 links, 112 at signals): the pocket takes one of the tagged lanes and adds none | BUGFIX | OSM lane counts already include marked turn lanes, so the class rule added a second one [OSMTurnLanes] | 11375 | 158 | 10.8% | 4.17 | 48 / 33 / 66 / 47 |
| X | Final reports: the demand builder drops flows that round to 0.00 veh/h (a test caught one) | BUGFIX | Flow contract needs positive volumes | 11021 | 172 | 11.4% | 4.14 | 48 / 34 / 62 / 46 |
| Y | Turn-speed backstop in `compute_accels`: the kinematic braking limit toward the turn speed (4 to 5 m/s) applied at any distance, so a head vehicle with a left or right turn ahead was held at the turn speed along the whole link. It now applies only when the braking needed exceeds half the driver's comfortable deceleration (same rule for humps) | BUGFIX | Junction traversal delay of a free-flow left turn 12.5 s, right 15.8 s against about 4 to 5 s kinematic (case k2, k3); platoons behind a turner moved at turn speed | n/a | n/a | n/a | n/a | n/a |
| Z | Car following: IDM replaced by the Improved IDM of [Treiber2014] (steady-state time gap equals T); mean T 1.3 -> 1.2 s (range 0.9 to 1.5) and mean a 1.4 -> 1.5 m/s2 (range 1.1 to 1.9), the signal-discharge calibration of the same paper | BUGFIX, cited parameters | The plain IDM follows at a gap larger than s0 + v T, so a standing queue discharged every 2.38 s (1,510 veh/h/lane) against the observed 1,500 to 2,000 and the ideal 1,900 (case a1, a2); now 2.14 s (1,682) | n/a | n/a | n/a | n/a | n/a |
| AA | Gate entry speed: vehicles enter at the highest speed up to their desired speed whose IDM gap fits the leader's room (before: fixed 4 m/s with 4 m of room), and wait until they can enter at least as fast as the leader | BUGFIX | The fixed entry speed capped every gate at about 1,480 veh/h per lane (case h1), below the 25 mph link capacity; now 1,734 | n/a | n/a | n/a | n/a | n/a |
| AB | Node crossing conflicts: a crossing movement blocks an entering one only until its tail has passed the conflict point (or, for the entering vehicle, until it will have cleared it by the time the entering vehicle arrives, `NODE_SAFE_S` 0.5 s); merges onto one exit still block until the vehicle has left the node. The gap check measures arrival at the node center, not the stop line. Conflict positions are stored per movement pair | BUGFIX | Every conflicting movement waited for the whole crossing (3 to 4 s from a standing start): all-way stop 334 veh/h per approach (case d1), permissive left with 500 opposing 0.59 of the through limit (b4) | n/a | n/a | n/a | n/a | n/a |
| AC | A driver who slowed to queue speed (2 m/s, `QUEUE_V`) behind another vehicle rolls up to a stop line without a second full stop | BUGFIX | Queued minor-street vehicles stopped again at the line: 6.5 s per vehicle with no conflicting flow against the HCM follow-up of 3.3 to 4.0 s (case e1 to e9); now 3.5 s | n/a | n/a | n/a | n/a | n/a |
| AD | `assumedGateScale` 0.5 -> 1.0 (documented class defaults), demand rebuilt; final state of the fifth round, PM peak, mean of seeds 1 to 3 | ASSUMPTION restored | The 0.5 was a workaround for the capacities fixed above | 13056 | 242 (287 / 212 / 228) | 9.8% | 4.41 | 52 / 38 / 61 / 33 |
| AE | Demand audit (`data/demand/rockridge.audit.md`, no model change): relevance of every PM trip to the study area (free-flow route), per-gate share near the study area, cordon check | measurement | The offered 28.8k veh/h is about twice what the network completes; test whether the excess sits at the edges | 13056 | 242 | 9.8% | 4.41 | 52 / 38 / 61 / 33 |
| AF | Corner-clipping through pairs (gates < 600 m apart along the perimeter, or a route within 300 m of the model edge) excluded from the seed and the gate totals refit | ASSUMPTION, not kept | The refit moved 1,642 veh/h onto longer pairs at the same gates | 12130 | 266 | 9.7% | 4.12 | 45 / 27 / 47 / 30 |
| AG | The same pairs dropped (P1, 1,642 veh/h, 5.7% of offered) and a per-gate cap at min(target, lane capacity x 837) on peripheral trips (P2, 0 veh/h) | ASSUMPTION | Corner clippers only load the edge signals; offered 28,781 -> 27,139 | 14510 | 61 | 6.5% | 4.95 | 52 / 39 / 54 / 32 |
| AH | Through balancing: counted gates keep inflow and outflow, assumed gates are scaled to the supply (counted outflow was 0.77 of its count) | BUGFIX | No double counting found (counted gate inflow 1.01 to 1.03 of target over all trip types); the outflow of counted gates was cut to close a gap that belongs to the assumed gates | 13520 | 121 | 7.3% | 4.69 | 57 / 40 / 58 / 36 |
| AI | Class default ADT from counted streets of the class, median when at least three (secondary 9,000 -> 15,400, tertiary 5,000 -> 11,500 on the old network); `assumedGateScale` removed | DATA-derived | Counted streets are the busiest of their class, so the median overstates uncounted gates; applied as specified | 12271 | 253 | 9.0% | 3.74 | 37 / 29 / 40 / 24 |
| AJ | Validation case c5 reframed (vehicles served at the signal, new case c6 for the cross street); no change to the simulator | suite | The adaptive plan gives a saturated arterial less green because it serves the cross street's demand, which the start-up plan starves (see below) | n/a | n/a | n/a | n/a | n/a |
| AK | Model area `bbox` south 37.830 -> 37.8325 and west -122.286 -> -122.2845; importer warning for gates within 60 m of a signal; LODES blocks outside the `bbox` dropped | BUGFIX (gate placement) | The old edge cut 40th St and San Pablo Ave through their signals; 17 gates within 60 m of a signal, now 2 | 13239 | 150 | 5.9% | 4.32 | 61 / 46 / 58 / 39 |
| AL | Walking and biking count scaling without a clamp, fitted to the final flow list (bicycle factor 0.20 clamped -> 0.161, pedestrian 0.49 -> 0.355) | BUGFIX | Modeled cyclists at the counted intersection were twice the count | in AK | in AK | in AK | in AK | in AK |
| AKb | Variant of AK with the documented class defaults (no `classDefaultFromCounts`); not shipped | ASSUMPTION | Contrast for AI: offered 25,462 | 13885 | 88 | 5.0% | 4.82 | 62 / 47 / 62 / 40 |
| AM | Count-constrained demand (demand README steps 12 to 16): static free-flow assignment with the router's cost, every count as a link or gate target (69 stations), multiplicative fit with factor bounds 0.1 to 3 (ramp flows 0.1 to 10), median factor for flows that touch no count, capacity guard at 110% of the measured capacity on uncounted links. Offered 25,462 -> 23,524 veh/h | DATA targets; ASSUMPTION bounds, weights, guard | The trip table loaded far more travel onto links than the counts support: 40% of trips could not complete | 18245 | 8.7 | 3.3% | 7.28 | 75 / 42 / 53 / 21 |
| AN | Count fit stops on a criterion (unblocked stations within 1%, stall detection, blocked and tense stations reported); gates that split one count are one station | BUGFIX | The old test needed every station under 1% and three stations conflict, so every period ran 400 iterations | n/a | n/a | n/a | n/a | n/a |
| AO | Observed route shares as soft ratio constraints in the fit, weight 0.5 (gate pooling, free-flow assignment; seed 1 only) | DATA targets; ASSUMPTION weight | The StreetLight select-link and ramp shares were only checked after the fact | 18112 | 6 | 3.0% | 7.21 | 62 / 41 / 50 / 19 |
| AP | Ramp trips drawn per ramp with access decay 300 s (seeds 1 to 3) | ASSUMPTION | Ramps far apart that feed one mainline gate shared one pool of surface ends | 19067 | 6.0 | 3.1% | 7.4 | 63 / 23 / 45 / 19 (seed 1) |
| AQ | Assignment by successive averages over BPR costs with the simulator's driver walks, 2 rounds (seeds 1 to 3) | ASSUMPTION alpha, beta; [PowellSheffi1982], [Spiess1990] | The free-flow assignment put the static shares 15.7 points on average away from the simulator on the 15 route shares (6.7 after) | 18624 | 5.7 | 3.9% | 7.4 | 60 / 33 / 63 / 35 (seed 1) |
| AR | Simulator: merges onto a multilane exit keep a time gap only (same demand as AQ) | ASSUMPTION (0.85 of the path) | A two-lane ramp and a two-lane street merging onto a three-lane exit crossed one vehicle at a time (about 860 veh/h through node 742) | 19160 | 2.3 | 2.1% | 7.7 | 61 / 31 / 62 / 32 (seed 1) |
| AS | Final: noisy walks that loop fall back to the plain shortest path; fit stops as in AN with tension against the guard | BUGFIX | About 14% of the flows had a looping first walk, which was dropped from their shares | 19098 | 4.7 | 2.8% | 7.45 | 59 / 33 / 59 / 27 |
| AS-ns | Same as AS without the share constraints (seeds 1 to 3) | contrast | Telegraph Ave north of Alcatraz Ave is 54% of the north-side trips onto the ramps with no shares | 19258 | 5.3 | 2.4% | 7.4 | 67 / 29 / 61 / 24 |

Tried and not kept (PM, six seeds each, removals / backlog / arterial speed):
- Signal green split by lane load (a left or right movement on a multilane approach gets its own lane in the Webster flow ratio): 33.5 / 2.2% / 4.00 against 30.2 / 3.5% / 4.06 for the plain per-lane split; AM got worse (22.7 against 14.0). Reverted.
- Signal phases by axis (approaches within 30 degrees share a phase, up to four phases) instead of two groups: 23 / 7.9% / 4.0 (three seeds). Reverted; a College/Claremont/62nd node still puts College and Claremont in one phase.
- Protected left phase (third round): a street with an opposing approach got a left-only phase when an approach carried at least 200 left turners per hour and left x opposing flow reached 150,000 / 200,000 / 300,000 (cross-product warrant; left volume from stop-line crossings plus queued left-turners). PM removals / backlog over six seeds against 7.5 / 1.0% without: 5.0 / 2.9%, 4.7 / 1.9%, 8.0 / 1.9%; AM 2.7 / 3.1%, 3.3 / 2.3%, 3.2 / 1.3% against 3.3 / 1.7%. Fewer removals only came with more lost time. Removed again.
- Directional ramp volumes by period (off-ramp volume x 2 x inbound share, on-ramp x 2 x (1 - inbound share), the split the surface gates use): Hillegass SB to freeway 51 -> 52, Hillegass NB from freeway 39 -> 30 (three seeds), so the change trades one headline share for another. The Caltrans ramp ADT is a daily two-way count with no peak-hour direction, so the split would be an assumption with no data behind it. Not kept.
- Signal adaptation interval 2 / 5 / 10 min and no adaptation (PM / AM removals over three seeds): 14.0 / 1.7, 4.7 / 4.7, 10.7 / 12.3, 13.3 / 7.3 at that state. Smoothing weight 0.8 and minimum green 10 s (six seeds): PM 7.2 / 5.8, AM 5.0 / 4.5 against 7.5 / 3.3. Defaults kept.
- Maximum phases 2 / 3 / 4: identical at 3 and 4 (no Rockridge junction has four streets); 2 phases (closest axes merged) gave 9.3 PM removals and 1.9% backlog before adaptation.
- `ramps.localShare` 0.3 / 0.45 / 0.6 and local cost factor 1.0 / 1.4 / 1.8 (before step I): headline shares moved by less than the seed spread (Hillegass NB 33 to 43, Hillegass SB 49 to 55). No change kept.

Hillegass against Colby (OSM control data, compared with the network file): the network matches OSM. Hillegass has more stop control (all-way stops at 62nd and 63rd, stopped approaches at Alcatraz and at Claremont/60th; two humps). Colby has an all-way stop at 61st, a stopped approach at Alcatraz and five humps. The model's expected delay per block is similar for both (all-way 6 s, minor stop 5 s, hump 3 s each), so the route split follows the data and no parameter forces it. The observed freeway share on Hillegass SB (68%) is not reachable with the general levers: even with non-count gates at zero it is 60%.

Other measurements (final state, PM): the model now saturates at about 8k veh/h offered (was 6.5k): scale 0.5 offers 8.1k with 20 removals, scale 0.7 offers 8.9k with 124. With non-count gates at zero (6.2k veh/h) the PM peak still has 9 removals over six seeds, so the floor is the count-based and ramp demand plus the junction bottlenecks listed under "What remains off".

Claremont Ave: checked end to end. OSM lanes (3 with one forward and one backward = a center turn lane, or 4 = two each) match the network: 1 lane per direction between Telegraph/52nd and Clifton, 2 lanes elsewhere, speed 25 mph, signals at Clifton, Hudson, Colby/Forest, College and 52nd. No missing lanes and no broken connection to the SR-24 ramps (Clifton off-ramp, Hudson on-ramp) or to College. The under-loading came from the 11 m signal pair at Colby/Forest and the ramp-terminal gridlock (step H), which held the corridor at 0.33 to 0.63 of the expected flow. After joining it is 0.54 (north-east bound) and 0.95 (south-west bound).

Ramp junctions: after joining all four SR-24 terminals are single signalized nodes (Aileen/Telegraph and Clifton/Claremont off-ramps, Hudson/Claremont and 56th/Telegraph on-ramps) with 2-lane ramp approaches at 35 mph. Mean discharge in the PM peak (seeds 1 to 3, measured before the third round): Aileen off-ramp 584 veh/h (offered 656), Clifton off-ramp 914 veh/h (offered about 1,025), on-ramps 783 and 555 veh/h. That is 290 to 460 veh/h per lane averaged over the hour; the signal gives the ramp 30 to 45% of the cycle and the shortfall is downstream spill-back on Claremont and Telegraph, not the ramp signal itself. Before the third round the remaining gridlock removals were mostly vehicles queued on the 4-lane freeway stub behind the single-lane Clifton off-ramp (26 of about 45 removals over six seeds at scale 0.3). The third round checked the ramp lanes against OSM: the off-ramps are tagged one lane for most of their length and two lanes (turn lanes left | left;through;right at Clifton, left | right at Aileen) on the final way before the signal, and the importer keeps that per segment (a test covers it), so no lane count is lost. After step M the stub accounts for about one removal per run.

## Sixteenth round: where the PM removals came from, Colby St northbound, known limits (task 21)

Decisions D36 to D40 in `design.md`. Seeds 1 to 10, scale 1.0, 60 minutes, initial loading on, as before. Before is the shipped state of the fifteenth round. After is a corrected count station in the demand (demand hash a4952df61abc41fd, was 17c955264f97b476; offered AM 20,030, midday 15,672, PM 24,012 veh/h) and a pedestrian signal fix in the simulator. The network hash is unchanged (fc4e7eac8da330d0). The validation suite stays at 47 of 58; cases j2 and j3 (signal capacity with pedestrians) move from 0.85 and 0.75 to 0.87 and 0.79.

### Stability, before and after

| Period | Before: removals per hour (min to max) | Before: backlog (seeds under 2%) | Before: arterial speed (m/s) | After: removals per hour (min to max) | After: backlog (seeds under 2%) | After: arterial speed (m/s) | Rule D16 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PM peak | 4.20 (0 to 13) | 0.79% (9 of 10) | 7.14 | 1.80 (0 to 4) | 0.54% (10 of 10) | 7.60 | fails |
| AM peak | 0.20 (0 to 2) | 0.04% (10 of 10) | 8.87 | 0.10 (0 to 1) | 0.03% (10 of 10) | 9.27 | holds |
| Midday | 0.00 | 0.00% (10 of 10) | 9.89 | 0.00 | 0.00% (10 of 10) | 9.96 | holds |

PM now fails on one count of the rule, the removals (1.80 against 1.0). The backlog is under 2% in every seed (the worst is 0.86%), no seed grows in the second half, and completed trips are 22,881 per hour (22,470 before). PM over 120 minutes: 2.40 removals per hour (0.5 to 3.5), backlog 0.93% with every seed under 2% (the worst 1.91%), no runaway seed, 7.28 m/s. PM stays experimental and the area stays `uncalibrated`.

### Where the first blockages formed

The 42 removals of the ten PM seeds before this round, by place:

| Place | Removals | Seeds | Mechanism |
| --- | --- | --- | --- |
| Claremont Ave at Ashby Ave and the streets around it (links 3478, 3076, 3407, 3479, 3074, 3426, 4366, 3072, 3070) | 25 | 8 of 10 | too much demand through the all-way stop at Claremont Ave and Russell St |
| MLK Jr Way northbound at 52nd St (link 778) | 4 | 3 of 10 | pedestrians in the crosswalk during the approach's green |
| Elsewhere, one or two each | 13 | | |

Claremont Ave at Ashby Ave. The trace of seed 1 (`CAL_TRACE`, minutes 8 to 12) shows a left-turner from Claremont Ave southbound onto Ashby Ave eastbound standing 180 s at a green signal because the 37 m of Ashby Ave behind the junction (link 3456) is full. It is full of cars waiting for the slip road toward Claremont Ave north (link 3480), which is full because the block of Claremont Ave up to Russell St (link 3462) is full, and that block ends at an all-way stop. Four single-lane approaches met there with 1,406 veh/h in total, 873 of them leaving toward the Claremont Ave gate; drivers were going around the queue over Russell St from both sides. The demand explains it. The gate's volume came from the Caltrans record "SR-13 at Claremont Ave" (ahead AADT 23,500) times an assumed 0.6. That record counts SR-13, and its ahead side is Ashby Ave west of Claremont Ave. On the wider network the record had become a station on the block of Claremont Ave next to the junction (link 3477), and the rule that a count is used once had dropped the gate's own constraint in its favor. Most of the gate's traffic reaches it by the slip road and never uses that block, so the fit raised the flows that do and nothing held the gate: 1,136 veh/h left by it in the PM peak against a target of 698, and the fit report listed link 3462 at 802 veh/h against a guard of 520. Fix (D36): the record is a station on Ashby Ave, 65 m west of the junction, and the gate takes the secondary class default (446 veh/h leaving in the PM peak, 604 after the fit).

MLK Jr Way at 52nd St. Seed 1 added 2.2 points of backlog in the second half, all of it at the SR-24 mainline gate (550 trips waiting). The cause was the MLK Jr Way off-ramp, which is separate from the 52nd St off-ramp of D35: the 147 m of MLK Jr Way behind the 52nd St signal carried 1,063 veh/h in seed 1 against 1,523 in seed 4. The trace of seed 2 (minutes 46 to 49, every 5 s) shows the four northbound lanes with a green signal and five or six pedestrians in the crosswalk in front of them for the whole green, twice in a row. A pedestrian took the phase of the street they had walked along. One who came up MLK Jr Way and crossed MLK Jr Way therefore stepped off on its green. Pedestrians also stepped off at any moment of the green, so those who started late were still in a 23 m crosswalk when the next phase began. Fix (D37): each crosswalk is served with the phase of the parallel street, and nobody enters once the clearance interval has begun [FHWA-STM2008]. In the after state link 778 has no removal, the section carries 1,661 veh/h, and no seed has more than 0.86% backlog.

| State (PM, seeds 1 to 10) | Removals per hour (min to max) | Backlog, seeds under 2% | Runaway seeds | Arterial speed (m/s) |
| --- | --- | --- | --- | --- |
| Before | 4.20 (0 to 13) | 9 of 10 | seed 1 | 7.14 |
| Pedestrian fix, old demand | 6.50 (2 to 14) | 10 of 10 | none | 7.45 |
| Corrected station, old simulator | 1.40 (0 to 3) | 10 of 10 | none | 7.37 |
| Both (kept) | 1.80 (0 to 4) | 10 of 10 | none | 7.60 |

The pedestrian fix alone lets more traffic reach the Claremont Ave and Ashby Ave junction, where 37 of its 65 removals sit. The difference between 1.40 and 1.80 is inside the seed noise (the standard deviation of one seed is 1.1 to 1.7).

### What is left in the PM peak

18 removals in ten seeds. Ten are at Adeline St and Alcatraz Ave (links 1068, 1066, 1019, 1065), two at 66th St and Telegraph Ave, and six are single. The Adeline St ones start two blocks south, where Adeline St, MLK Jr Way and Stanford Ave meet (node 487). Adeline St southbound and MLK Jr Way northbound share a phase there because they lie on one axis within 30 degrees. The MLK Jr Way traffic that continues north turns 93 degrees left onto the short connector that OSM calls Stanford Ave (about 570 veh/h on the connector), across three lanes of Adeline St. The trace (seed 9, minutes 20 to 23, with the new `held by` field) shows every head of the three Adeline St lanes held by a car on that left turn for the whole green: each time a head is held back and rolls up to the line again, the next left-turner sees a gap in front of it. Adeline St southbound carries 556 veh/h with a mean delay of 168 s, the queue reaches Alcatraz Ave, and drivers leave Alcatraz Ave over King St to get around it.

Three changes to the left-turner's gap test were measured (D38):

| Variant (corrected station and pedestrian fix in all) | Seeds 1 to 10: removals per hour (min to max) | Seeds 11 to 20 | Validation b4 / b9 (share of the formula value; in range from about 0.87 and 0.86) |
| --- | --- | --- | --- |
| No change (kept) | 1.80 (0 to 4) | 1.70 (0 to 4) | 0.88 pass / 0.83 fail |
| A vehicle with green arrives as fast as its acceleration allows | 2.10 (0 to 7) | not run | 0.66 fail / 0.76 fail |
| A queue head within 10 m of a green signal, slower than 2 m/s, is not a gap | 0.50 (0 to 3) | 1.80 (0 to 9) | 0.84 fail / 0.86 pass |

The first variant is the physically plain one, and with it Adeline St southbound carries 1,154 veh/h at 59 s. But MLK Jr Way northbound then falls to 355 veh/h at 100 s, and the permissive-left capacity of the validation suite falls to 0.66 of the gap formula [Brilon1999]. So the simulator's permissive left has been reaching its published capacity partly by entering in front of queued vehicles. The second variant passed D16 on the fixed seed list and did not on ten further seeds, which were run to check it and are not a basis for judging the baseline. Neither was kept. Seeds 11 to 20 with no change give 1.70, so 1.80 is not an unlucky draw.

### Colby St northbound at Alcatraz Ave

| Quantity (PM) | Counted | Before | After |
| --- | --- | --- | --- |
| Colby St, median block NB / SB | 174 / 160 | 161 / 205 | 155 / 198 |
| Hillegass Ave, median block NB / SB | 110 / 168 | 115 / 182 | 103 / 189 |
| Colby St, North St to Alcatraz Ave NB | 164 | 68 | 57 |
| Colby St NB to Alcatraz Ave west | 131 | 9 | 5 |
| Colby St SB to Claremont Ave northeast | 75 (doubtful reading) | 1 | 0 |
| Colby St whole street NB / SB | 102 / 39 | not recorded | 44 / 97 |
| Entries from Alcatraz Ave at Colby St and Hillegass Ave | 360 | 362 | 313 |
| Entries from the Telegraph Ave side | 264 | not recorded | 443 |
| Corridor ratio, Colby St / Hillegass Ave | 1 / 1 | 1.08 / 1.07 | 1.04 / 1.02 |

No defect was found (D39). What was checked:

- The fit. The left turn onto Alcatraz Ave west, the turn toward Claremont Ave northeast and the whole-street counts are constraints in the fit with weight 0.5, and the last block is a link station with weight 1. The assignment before the fit puts 1 veh/h on the left turn; the fit raises the flows that use it to the upper bound of 3 (the fit report lists 60% to 99% of the movement's flow at the bound) and ends at 6 against 131.
- The router. The left turn from the stop sign costs 19.9 s (14 s minor stop, 4 s left, the traversal), the same rule as at every minor approach, and the simulator's own mean delay on the last block is 41 s. From the south end of Colby St the router reaches Telegraph Ave north of Alcatraz Ave in 163 s by 60th St and in about 181 s by Colby St and Alcatraz Ave.
- The trips. For every PM car trip in the demand, the cheapest route through the left turn was compared with the trip's cheapest route. No trip has the turn on its cheapest route. 26 veh/h are within 5% and 140 veh/h within 10%, and drivers' perceived costs vary by 8%. The trips within 10% to 13% are the ones the count would need: the SR-24 mainline gate to Telegraph Ave north of Alcatraz Ave (Ward St, Stuart St, Oregon St, 66th St; about 165 veh/h together), which the model sends up Telegraph Ave. The same test for the turn toward Claremont Ave northeast finds 0 veh/h within 5% and 4 within 10%.
- Gates and controls. The Alcatraz Ave gate lies 1.3 km west and is fitted to its count; the stop signs match OSM (fourteenth round).

The cross streets from Colby St to Telegraph Ave carry 1.5 to 1.9 times their counts (60th St 1.94, 61st St 1.69, 62nd St 1.55, 63rd St 1.54) and the Telegraph Ave side entries 443 against 264, which is the same traffic on the other route. The model's free-flow times make Telegraph Ave about 10% quicker than Colby St for these trips, and the count says drivers judge it the other way. Travel times on Telegraph Ave between Aileen St and Alcatraz Ave in the PM peak, or the origins and destinations of the cars on the last block of Colby St, would settle it.

### Headline shares and count stations, PM

| Share | Observed | Before | After |
| --- | --- | --- | --- |
| Hillegass Ave NB from the freeway | 47 | 66.7 | 71.4 |
| Colby St NB from the freeway | 47 | 74.2 | 78.1 |
| Hillegass Ave SB to the freeway | 68 | 73.2 (within 10) | 73.4 (within 10) |
| Colby St SB to the freeway | 45 | 67.0 | 60.5 |

Mean absolute error 18.5 points before, 19.1 after; one of four within 10 points in both.

| Set (GEH below 5, size bands in brackets, mean GEH) | Before | After |
| --- | --- | --- |
| All fitted, 120 stations | 76 (102), 63% (85%), 4.6 | 81 (102), 68% (85%), 4.2 |
| All held out, 31 stations | 18 (21), 58% (68%), 5.8 | 19 (23), 61% (74%), 5.8 |
| Interior blocks, fitted (89) | 63 (88), 71% (99%), 3.6 | 67 (88), 75% (99%), 3.4 |
| Interior blocks, held out (18) | 14 (17), 78% (94%), 3.3 | 14 (18), 78% (100%), 3.1 |
| Other stations, fitted (31) | 13 (14), 42% (45%), 7.3 | 14 (14), 45% (45%), 6.4 |
| Other stations, held out (13) | 4 (4), 31% (31%), 9.3 | 5 (5), 38% (38%), 9.6 |

The pooled rule (more than 85% of fitted stations) is still just short by the size bands (102 of 120). The new Ashby Ave station carries 709 veh/h eastbound and 499 westbound in the simulator against 1,163 and 952 from the AADT; the static assignment of the fit meets both. The 52nd St off-ramp carries 473 veh/h against 1,278 and the Clifton St ramp 1,527 against 972 (D35, unchanged in kind).

### Cross-validation assessment

Rerun on the cross-validation demand of this refit. The hold-out set changed with the station (the `claremont` corridor is gone, Ashby Ave has a station of its own).

| PM peak | Before | After |
| --- | --- | --- |
| Removals per hour (min to max) | 1.20 (0 to 5) | 1.20 (0 to 4) |
| Backlog | 0.06% (10 of 10) | 0.35% (10 of 10) |
| Fitted stations, GEH below 5 (size bands) | 82 (105) of 120 | 85 (104) of 120 |
| Held out, GEH below 5 (size bands), mean GEH | 14 (19) of 31, 45% (61%), 7.9 | 13 (20) of 31, 42% (65%), 8.9 |
| Interior held out | 12 of 18 (67%), 3.6 | 11 of 18 (61%), 3.3 |
| Other held out | 2 of 13 (15%), 13.8 | 2 of 13 (15%), 16.7 |

### Status under D18

Stability holds in AM and midday and fails in the PM peak on removals; the share rule fails; the station rule is 85% against more than 85%. The area stays `uncalibrated`, `experimentalPeriods` is `["pm_peak"]`, midday stays the default. The `calibration.note` reads: "The PM peak still removes about two stuck vehicles per hour, and the 52nd St off-ramp carries 473 veh/h against 1,278 counted."

### Known limits

Each is in `design.md` D40 with the data that would resolve it. The change is archived with these open.

1. PM removals (1.80 per hour, 2.40 over two hours). Adeline St at MLK Jr Way and Stanford Ave, and Adeline St at Alcatraz Ave. Needs the signal phasing at both and a turning count at the first.
2. Permissive left turns. A left-turner enters ahead of queued opposing vehicles; without that, capacity is 0.66 of the gap formula. Needs a look at follow-up headways and the pocket rule against a saturation study or the HCM procedure, which is not verified in `docs/references.md`.
3. The 52nd St off-ramp at Shattuck Ave (D35). Needs a turning count or the signal plan.
4. Headline freeway shares, 5 to 31 points too high. Needs origins and destinations (or paths) of the traffic on Hillegass Ave and Colby St.
5. Colby St northbound at Alcatraz Ave, the turn toward Claremont Ave northeast, and the cross streets to Telegraph Ave. Needs PM travel times on Telegraph Ave or the origins and destinations of the last block's traffic; a recount of the Claremont Ave exits (the three add to 218 against a block of 162).
6. Ashby Ave at Claremont Ave: 0.57 of the AADT-derived hourly volume, on one lane per direction. Needs a peak-hour count; K is assumed at 0.09.
7. Claremont Ave north of Ashby Ave has no count; its gate is a class default.
8. `YIELD_FALLBACK_S` is 90 s where 150 s fits the gap formula. Needs observed delays on the stop-controlled approaches to Telegraph Ave and Market St.
9. One count day and one hour per period on the interior streets; midday targets are scaled.
10. Leave-one-corridor-out cross-validation was not run; the station hold-out is the out-of-sample test. Needs no data, only nine fits and their seed runs.
11. A U-turn at the gate stub of Dana St at Ward St still takes part in single removals (one in the 120-minute runs).

The proposals in `data/proposals` and `public/data/rockridge.proposals.json` belong to the earlier demand and simulator and are stale by hash; the searches have to be rerun.

## Fifteenth round: the refit ships, the 52nd Street ramp is labeled (task 20)

Decisions D34 and D35 in `design.md`, both the user's, 2026-11-13. D34 ships the demand refit on the straightened geometry that D33 had held back, and accepts that the PM peak fails the stability rule. D35 stops tuning the 52nd St off-ramp at Shattuck Ave until a turning count or a signal plan exists. The simulator and the network did not change in this round (network hash unchanged, validation suite unchanged at 47 of 58). `npm run data` refit the demand: the shipped file now hashes to 17c955264f97b476 (it was b09ae43bb933ef43) and offers AM 20,108, midday 14,886 and PM 24,166 veh/h. Seeds 1 to 10, scale 1.0, 60 minutes, initial loading on, as in the earlier rounds. The ten-seed figures reproduce the refit rows of the fourteenth round to the digit, so the run is deterministic. Older rounds moved to `rockridge.record-archive.md`.

### Stability, before and after

Before is the demand of the fourteenth round (kept), after is the shipped refit.

| Period | Before: removals per hour (min to max) | Before: backlog (seeds under 2%) | Before: arterial speed (m/s) | After: removals per hour (min to max) | After: backlog (seeds under 2%) | After: arterial speed (m/s) | Rule D16 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PM peak | 0.70 (0 to 3) | 0.50% (10 of 10) | 7.94 | 4.20 (0 to 13) | 0.79% (9 of 10) | 7.14 | fails |
| AM peak | 0.00 | 0.03% (10 of 10) | 8.98 | 0.20 (0 to 2) | 0.04% (10 of 10) | 8.87 | holds |
| Midday | 0.00 | 0.00% (10 of 10) | 10.02 | 0.00 | 0.00% (10 of 10) | 9.89 | holds |

PM fails on both counts of the rule: the removals are above 1.0 per hour and seed 1 adds more than 2 points of backlog in the second half (the worst backlog is 2.66%). Completed PM trips per hour are 22,470 (22,672 before). PM is therefore marked experimental again; AM and midday hold and stay unmarked. The area stays `uncalibrated`.

### Headline shares, PM

Freeway shares, modeled against observed (10 points is the tolerance):

| Share | Observed | Before | After |
| --- | --- | --- | --- |
| Hillegass Ave NB from the freeway | 47 | 68.5 | 66.7 |
| Colby St NB from the freeway | 47 | 77.0 | 74.2 |
| Hillegass Ave SB to the freeway | 68 | 78.1 | 73.2 (within 10) |
| Colby St SB to the freeway | 45 | 70.1 | 67.0 |

Mean absolute error 21.7 points before, 18.5 after; none of four within 10 points before, one of four after. The shares are still 20 to 27 points too high on three of the four.

### Colby St and Hillegass Ave, PM

Seed mean against the volunteer count:

| Quantity | Counted | Before | After |
| --- | --- | --- | --- |
| Colby St, median block NB | 174 | 132 | 161 |
| Colby St, median block SB | 160 | 190 | 205 |
| Hillegass Ave, median block NB | 110 | 98 | 115 |
| Hillegass Ave, median block SB | 168 | 142 | 182 |
| Colby St, North St to Alcatraz Ave NB | 164 | 61 | 68 |
| Colby St NB to Alcatraz Ave west | 131 | 6 | 9 |
| Entries from Alcatraz Ave at Colby St and Hillegass Ave | 360 | 278 | 362 |
| Corridor ratio, Colby St (modeled / counted, 14 blocks) | 1 | 0.95 | 1.08 |
| Corridor ratio, Hillegass Ave (8 blocks) | 1 | 0.89 | 1.07 |

The northbound medians now sit within 8% of the counts. The southbound blocks of Colby St run 1.2 to 1.4 times their counts. The north end of Colby St northbound still loses its traffic before Alcatraz Ave (68 against 164 counted, GEH 8.9), and the Colby St turn toward Claremont Ave northeast still carries 1 veh/h against 75.

### Count stations, GEH, PM

Simulator flows, GEH below 5 (size bands in brackets), mean GEH:

| Set | Before | After |
| --- | --- | --- |
| All fitted, 120 stations | 87 (104) of 120, 73% (87%), 4.1 | 76 (102) of 120, 63% (85%), 4.6 |
| All held out, 31 stations | 19 (23), 61% (74%), 5.2 | 18 (21), 58% (68%), 5.8 |
| Interior blocks, fitted (89) | 71 (88), 80% (99%), 3.2 | 63 (88), 71% (99%), 3.6 |
| Interior blocks, held out (18) | 14 (17), 78% (94%), 2.9 | 14 (17), 78% (94%), 3.3 |
| Other stations, fitted (31) | 16 (16), 52% (52%), 6.5 | 13 (14), 42% (45%), 7.3 |
| Other stations, held out (13) | 5 (6), 38% (46%), 8.3 | 4 (4), 31% (31%), 9.3 |

The pooled fitted-station rule (more than 85% by GEH or size bands) held by the bands before (87%) and is now just short (85%, 102 of 120). The refit trades a few points of GEH across the arterials and ramps for the interior blocks it was after: counts closer on Colby St and Hillegass Ave, farther on the other stations.

### Cross-validation assessment

`rockridge.assessment-validation.md` was rerun on the cross-validation demand of this refit (held-out stations left out of the fit), so it matches the shipped demand. It was the thirteenth round's file before.

| PM peak | Before (thirteenth-round demand) | After (this refit) |
| --- | --- | --- |
| Removals per hour (min to max) | 1.80 (0 to 7) | 1.20 (0 to 5) |
| Backlog | 0.49% (10 of 10) | 0.06% (10 of 10) |
| Fitted stations, GEH below 5 (size bands) | 87 (104) of 120 | 82 (105) of 120 |
| Held out, GEH below 5 (size bands), mean GEH | 14 (19) of 31, 45% (61%), 7.9 | 14 (19) of 31, 45% (61%), 7.9 |
| Interior held out | 11 of 18 (61%), 3.5 | 12 of 18 (67%), 3.6 |
| Other held out | 3 of 13 (23%), 13.9 | 2 of 13 (15%), 13.8 |

Out of sample the interior blocks hold up (67% by GEH, 94% by bands) and the other stations do not (15%). The cross-validation demand also fails D16 in the PM peak (1.20 per hour), so the instability belongs to the refit and its simulator, not to the held-out stations.

### The 52nd Street off-ramp (D35)

Unchanged by the refit: 524 veh/h modeled against 1,278 counted, and the Clifton St ramp at 1.6 times its count. D35 stops tuning here. The gap is stated as a known limit in the area's calibration note, which the app shows. It reopens when a turning count or the signal plan at 52nd St and Shattuck Ave exists (task 19.8).

### Status under D18

Stability fails in the PM peak and holds in AM and midday; the share rule fails. The area stays `uncalibrated`, `experimentalPeriods` is `["pm_peak"]`, midday stays the default. The `calibration.note` reads: "Colby St and Hillegass Ave volumes are closer to counts, the PM peak is unsteady, and the 52nd St off-ramp carries 524 veh/h against 1,278 counted."

### What remains

- Whatever makes the refit unsteady in the PM peak (4.20 removals per hour, 0 to 13) is not located; D33 and this round only measured it. Task 20.7.
- `rockridge.assessment-120min.md` and the proposals in `data/proposals` belong to the earlier demand and are stale by hash; the proposal searches need a rerun on this demand.
- The open items of the fourteenth round (headline shares, Colby St northbound at Alcatraz Ave, the Colby St turn toward Claremont Ave northeast, `YIELD_FALLBACK_S`) stand.

## Fourteenth round: the Telegraph Ave lock, yielding, the 52nd Street ramp again, refit decision (task 19)

Decisions D30 to D33 in `design.md`. PM peak unless a row says otherwise, seeds 1 to 10, scale 1.0, 60 minutes, initial loading on, the demand file of the thirteenth round. The round starts from the simulator after D27 and D28 (placement on loaded costs, straightened junction ends), which had already moved the figures of the thirteenth round: PM 5.40 removals per hour with the backlog under 2% in all ten seeds (9.40 and 7 of 10 in the thirteenth round), AM 0.40 (1.10).

### The gridlock on Telegraph Ave north (seed 9)

Seed 9 had 34 removals on Telegraph Ave between Webster St and Ashby Ave, the first at minute 42. The new trace (`CAL_TRACE`, see the calibration README) shows what stood first. Between the two signals, 111 m apart, Telegraph Ave has two way-split nodes 25 m apart (nodes 967 and 968). From minute 38 the heads of the two 25 m links (2340 northbound, 2341 southbound) stand with room ahead, a green signal behind them and no conflicting car. Each is yielding to a pedestrian who waits at the crosswalk of its node. Neither pedestrian steps off, because a car is held inside each node: it was let in when the car ahead still moved, and it cannot leave the node while that car stands 8 m ahead. So the pedestrian at node 968 waits for the car in node 968, that car waits for the driver on link 2340, that driver yields to the pedestrian at node 967, who waits for the car in node 967, which waits for the driver on link 2341, who yields to the pedestrian at node 968. No signal phase is starved and nothing spills back at the start, and the demand has no part in it. The queues then grow back through both signals until vehicles are removed.

Every node gave pedestrians a crosswalk on each leg, including nodes that are only a point along one street, so pedestrians crossed four and five lanes of Telegraph Ave at a way split with drivers yielding to them. And a driver yielded for as long as a pedestrian waited.

| State | Removals per hour (min to max) | Backlog, seeds under 2% | Arterial speed (m/s) |
| --- | --- | --- | --- |
| Start of the round | 5.40 (0 to 34) | 0.72% (10 of 10) | 7.85 |
| No unmarked crosswalk at a node with two legs [CVC275] | 0.80 (0 to 3) | 0.53% (10) | 7.90 |
| And a yield to a pedestrian lapses after 45 s (D30) | 0.50 (0 to 2) | 0.58% (10) | 7.96 |
| Test: a car held in a node brakes to 1 m/s (no pedestrian rules) | 1.70 (0 to 6) | 2.01% (6) | 7.29 |
| Test: a car held in a node leaves at the speed it can stop from (no pedestrian rules) | 1.00 (0 to 3) | 0.94% (10) | 7.53 |
| The same with both pedestrian rules | 1.70 (0 to 10) | 0.70% (10) | 7.57 |

The braking tests were not kept: they lower the arterial speed and do not lower removals. A held car that leaves the node early waits on the link instead, where the wait counts in the link speed. AM with D30: 0.30 removals per hour (0.40 before); midday 0.00 in both.

### Yielding and the stop-controlled capacities (D31)

Looking for the cause of the low northbound volume on Colby St (below) led to the cross streets toward Telegraph Ave, which carry 1.4 to 2.1 times their counts, and from there to validation cases e6 and e9: a minor through movement and a minor left turn across 1,000 veh/h per direction ran at 108 and 88.5 veh/h against 61 and 45 from the gap formula [Brilon1999]. The cause is the bounded wait: after 45 s a driver entered whatever was coming, which is a floor of 80 veh/h per lane.

| `YIELD_FALLBACK_S` and rules | e6 (range 45.5 to 75.8) | e9 (33.9 to 56.5) | PM removals per hour (min to max) |
| --- | --- | --- | --- |
| 45 s (before) | 108 | 88.5 | 0.50 (0 to 2) |
| 90 s | 72.0 | 54.0 | 1.90 (0 to 5) |
| 150 s | 60.0 | 40.5 | 6.80 (1 to 14) |
| 45 s, a lane with no room to leave is not waited for | not run | not run | 0.40 (0 to 2) |
| 90 s with that rule | not run | not run | 1.50 (0 to 4) |
| 150 s with that rule | not run | not run | 4.10 (1 to 7) |
| 150 s, that rule, and entry ahead of crawling vehicles after 45 s | 60.0 | 40.5 | 1.30 (0 to 2) |
| 90 s with both rules (kept) | 72.0 | 54.0 | 0.70 (0 to 3) |
| no fallback, both rules | not run | not run | 6.10 (2 to 10) |

With a long fallback the removals sit where a minor street meets a queue: 10 of the 68 removals at 150 s are on 52nd St where it merges with its off-ramp (link 1686), 9 on 60th St at Market St. The old 45 s was doing the work of drivers who let someone into slow traffic, so that is now its own rule, and a stream at speed needs a real gap for 90 s. The validation suite goes from 45 to 47 of 58 cases. The Colby St volumes did not move with any of these (northbound median 131 to 143 veh/h), so the question that started this stays open.

### The 52nd Street off-ramp at Shattuck Ave (node 688)

OSM: the two carriageways of 52nd St cross Shattuck Ave at two signal nodes 16 m apart (506459075 and 53045875), joined by a two-lane piece of Shattuck Ave; the importer joins them into node 688. The eastbound approach (way 393902204) has four lanes tagged `left|||`, the westbound one `left|none||`, Shattuck Ave north of the junction one lane northbound and two southbound (`left;through|right`). The ramp (way 393902217) has two lanes tagged `right|right`. OSM carries no phasing. The lane counts in the network match. Two things differ from the tags: the tagged left lane stores 3 cars like an assumed pocket, and the ramp's vehicles all take the right lane because their one movement is a right turn.

| Variant (each on top of D30) | Removals per hour | Backlog, seeds under 2% | 52nd St off-ramp veh/h (1,278 counted) | Clifton St off-ramp veh/h (972) |
| --- | --- | --- | --- | --- |
| D30 only | 0.50 | 0.58% (10) | 531 | 1,536 |
| Tagged left lanes store the link length | 1.60 | 0.78% (10) | 527 | 1,536 |
| And left-turners keep to the left lanes, drivers sort one link early | 2.60 | 1.04% (9) | 473 | 1,441 |
| And the left turn at node 688 unopposed | 1.40 | 1.00% (9) | 561 | 1,415 |
| Gate queues by fork branch | 1.20 | 0.53% (10) | 520 | 1,548 |
| And a link end with one movement uses all its lanes | 0.80 | 0.40% (10) | 532 | 1,566 |
| All six | 1.20 | 0.55% (10) | 576 | 1,458 |
| One-movement rule alone | 0.90 | 0.66% (10) | 494 | 1,576 |

None was kept. In the traces of seed 1 the ramp is not held at the signal all the time: for minutes at a stretch (30 to 36, 50 to 54) the ramp and the approach are empty, then the ramp fills to 65 cars per lane. Drivers at the freeway gate choose their exit on measured link times, the ramp's mean delay is about 230 s, and they leave by the MLK Jr Way and Clifton St ramps instead, which is why Clifton St carries 1.6 times its count. When the ramp is full, about half of its drivers want the left turn into the one lane of Shattuck Ave north. With left-turners confined to their lanes, they wait on the 7 m link behind the approach (link 1766) and block the through lanes there, so two of the four approach lanes stand empty. And with the left turn unopposed and two lanes to turn from, the single receiving lane can take about 12 cars in the 27 s green at 2.1 s per car. The count of 1,278 is an ADT times a peak-hour factor, and the split of the ramp's traffic at this signal comes from the demand fit with no turning count behind it. The mechanism left to test is a hard lane choice two links ahead together with a protected left; D26 measured the protected left alone.

Ramp terminals, PM, seed mean (veh/h):

| Ramp | Counted | Start of the round | End of the round |
| --- | --- | --- | --- |
| Off, 52nd St (node 735) | 1,278 | 477 | 524 |
| Off, MLK Jr Way (727) | 1,656 | 1,470 | 1,488 |
| On, 52nd St (733) | 1,161 | 1,307 | 1,315 |
| On, MLK Jr Way (288 / 687, one count for both) | 869 | 444 / 1,113 | 431 / 1,124 |
| Off, Clifton St / Claremont Ave (691) | 972 | 1,560 | 1,552 |
| Off, Aileen St / Telegraph Ave (710) | 621 | 812 | 805 |
| On, 56th St / Telegraph Ave (709) | 657 | 842 | 858 |
| On, Hudson St / Claremont Ave (845) | 882 | 984 | 979 |
| Off, Keith Ave (1149) | 477 | 527 | 523 |

### Colby St, Hillegass Ave and the turn toward Claremont Ave northeast

PM, seed mean against the volunteer count, at the end of the round (the thirteenth round in brackets):

| Quantity | Counted | Modeled |
| --- | --- | --- |
| Colby St, median block NB / SB | 174 / 160 | 132 / 190 (125 / 199) |
| Colby St, North St to Alcatraz Ave NB | 164 | 61 (60) |
| Hillegass Ave, median block NB / SB | 110 / 168 | 98 / 142 (82 / 149) |
| Colby St whole street NB / SB | 102 / 39 | 49 / 95 |
| Colby St NB to Alcatraz Ave west | 131 | 6 |
| Colby St SB to Claremont Ave northeast | 75 (doubtful reading) | 2 |
| Entries from the Telegraph Ave side | 264 | 407 (448) |
| Entries from Claremont Ave and Forest St | 505 | 630 (565) |

The northbound shortfall on Colby St is at its north end. The count has 164 cars on the last block and 131 of them turning left onto Alcatraz Ave; the model has 61 and 6. In the model the northbound traffic leaves Colby St for 60th to 63rd St and reaches Telegraph Ave there. OSM tags the junction as the network has it: stop signs on Colby St and on Hillegass Ave, none on Alcatraz Ave. The last block has a mean delay of 25 s at 63 veh/h, and the gap formula gives a left turn across the 1,000 veh/h of Alcatraz Ave a capacity near 220 veh/h, so the counted 164 are possible but slow, and the router sends drivers where it is quicker. Nothing in the simulator was found wrong at this junction, and the yield rules of D31 did not move the volumes. The turn from Colby St southbound toward Claremont Ave northeast is open since D25 and carries 2 veh/h; no origin and destination pair in the demand has a use for it. Both stay open as questions about the routes drivers take, which the model has no observed paths for.

### Refit on the straightened geometry (D33)

Rule set before the runs: ship the refit only if D16 holds in all three periods with the final simulator. `npm run data` wrote the same network file (same hash) and a demand that differs by about 3% in total (AM 20,844 to 20,108 veh/h, midday 15,340 to 14,886, PM 23,442 to 24,166; the fit stops by stalling in every period).

| Period | Kept demand: removals per hour, backlog, speed | Refit: removals per hour, backlog, speed |
| --- | --- | --- |
| PM peak | 0.70 (0 to 3), 0.50% (10 of 10), 7.94 | 4.20 (0 to 13), 0.79% (9 of 10), 7.14 |
| AM peak | 0.00, 0.03% (10), 8.98 | 0.20 (0 to 2), 0.04% (10), 8.87 |
| Midday | 0.00, 0.00% (10), 10.02 | 0.00, 0.00% (10), 9.89 |

The refit puts more traffic on the two streets in the PM (Colby St medians 160 northbound and 205 southbound, Hillegass Ave 115 and 182) and brings the headline shares 2 to 5 points closer, but it fails D16 in the PM peak. The kept demand stays, and the fit reports in `data/demand` are the kept ones. The cross-validation demand in `target/validation` now belongs to the refit, so the out-of-sample assessment was not rerun; `rockridge.assessment-validation.md` is still the thirteenth round's.

### Ten-seed assessment at the end of the round

| Period | Start of the round: removals per hour / backlog (seeds under 2%) | End: removals per hour (min to max) | End: backlog (seeds under 2%) | Arterial speed (m/s) | Rule D16 |
| --- | --- | --- | --- | --- | --- |
| PM peak | 5.40 / 0.72% (10 of 10) | 0.70 (0 to 3) | 0.50% (10 of 10) | 7.94 | holds |
| AM peak | 0.40 / 0.03% (10 of 10) | 0.00 | 0.03% (10 of 10) | 8.98 | holds |
| Midday | 0.00 / 0.01% (10 of 10) | 0.00 | 0.00% (10 of 10) | 10.02 | holds |

No seed adds more than 2 points of backlog in the second half. PM over 120 minutes: 1.15 removals per hour (0 to 2.5), backlog 0.96% with every seed under 2% (the worst at 1.98%), no runaway growth, 7.51 m/s; in the thirteenth round it was 12.90, 1.96% and 6 of 10. The two-hour run is reported beside the rule and is just over its removal limit.

Headline shares, PM, modeled against observed: Hillegass Ave NB from the freeway 68.5 (47), Colby St NB from the freeway 77.0 (47), Hillegass Ave SB to the freeway 78.1 (68), Colby St SB to the freeway 70.1 (45). None is within 10 points; Hillegass Ave SB misses by 10.1 (it was 76.7 at the start of the round). Count stations on the simulator's flows, PM: fitted 87 of 120 with GEH below 5 (73%) and 104 in the size bands (87%, so the pooled rule is met by the bands); interior blocks 71 of 89 (80%) fitted and 14 of 18 (78%) held out; other stations 16 of 31 (52%) fitted and 5 of 13 (38%) held out.

Status under D18: stability holds in every period, the share rule fails, so the area stays `uncalibrated`. No period fails D16, so none is marked experimental any more; midday stays the default.

### What remains

- The 52nd St off-ramp carries 524 of 1,278 veh/h and the Clifton St ramp 1.6 times its count. It needs a turning count or the signal plan at 52nd St and Shattuck Ave, and lane choice that looks further than one link.
- The four headline shares are 10 to 30 points too high: the traffic on Colby St and Hillegass Ave is mostly freeway traffic in the model.
- Colby St northbound loses its traffic before Alcatraz Ave; the Colby St turn toward Claremont Ave northeast has no flow.
- `YIELD_FALLBACK_S` is 90 s because 150 s, which fits the gap formula better, costs stability. The PM peak passes D16 with 0.70 against 1.0 and the two-hour run does not.
- Single removals recur at MLK Jr Way and 52nd St, where left-turners stand in all four lanes of a 32 m approach, and at Ward St and Dana St, where a car makes a U-turn at the gate stub.
- The cross-validation run and the proposal searches have to be rerun on this simulator.

## Thirteenth round: the 52nd Street off-ramp, forks, gate queues, sharp turns (task 17)

Decisions D23 to D25 in `design.md`. The question: why does the 52nd Street off-ramp discharge 559 veh/h in the simulator against 1,278 counted, and does it explain the PM failure of the ten-seed rule (2.5 removals per hour, 3.88% backlog)? PM peak, seeds 1 to 10, scale 1.0, 60 minutes, initial loading on.

### Geometry check: the model matches OSM

The ramp (way 393902217, `lanes=2`, `turn:lanes=right|right`) meets 52nd Street at node 735, an uncontrolled merge of two ramp lanes and the two lanes of 52nd Street onto a three-lane exit (way 762084364, `lanes=3`). It continues over a 7 m and a 53 m link to the signal at Shattuck Avenue (node 688), a four-lane approach tagged `left|||`. The importer gives the same lane counts, the same left pocket (`leftLanes` 1) and the same merge. The ramp is not narrower in the model than in the data. The 52nd Street approach carries 29 veh/h onto the merge, so the merge is not the limit either. Controls at nodes 735, 730 and 688 are as tagged (no signal tag at the ramp terminal; the signal at 688 is `traffic_signals`, with no phasing in OSM).

### Where the limit sits (seed 1 trace)

The approach to the signal (link 1679, 53 m, 4 lanes) holds 16 to 25 stopped cars all through the run, the ramp link behind it (4191, 513 m) holds 40 to 140, and during a 28 s green the approach discharges 4 to 5 cars. The head vehicle of each lane wants the left turn onto Shattuck Avenue north: 270 of the 545 ramp trips an hour turn left, 231 go straight, 44 turn right. The left turn is permissive against 1,272 veh/h westbound (the 52nd Street on-ramp traffic, 1,161 counted), and the left-turners fill all three through lanes when the pocket (3 cars) is full, so through traffic waits behind them. Behind the left turn, Shattuck Avenue north is one lane per direction (OSM `lanes=2` both ways) with two unsignalized 54th Street junctions 40 m apart, and its queue reaches back to the signal.

Single-run tests (PM, trips through the approach in one hour; baseline 545 in seed 1, 521 in seed 2):

| Test | Seed 1 | Seed 2 |
| --- | --- | --- |
| Left turns at the signal unopposed | 603 | |
| Left-turners confined to the pocket and the left lane | 512 | |
| Both | 794 | 691 |
| Eastbound approach always green | 797 | |

None reaches 1,278. Ten-seed runs on the same demand file:

| State | Removals per hour | Backlog (seeds under 2%) | 52nd St ramp veh/h | MLK ramp veh/h |
| --- | --- | --- | --- | --- |
| Start of the round | 2.50 | 3.88% (0) | 559 | 1,064 |
| Protected left interval, sized from measured flows (built, removed) | 3.90 | 3.96% (1) | 571 | 1,043 |
| Test: left turns unopposed at node 688 and confined to the left lane | 4.60 | 4.74% (0) | 678 | 952 |
| Fork lanes (D23) with the interval | 2.30 | 2.80% (1) | 538 | 1,124 |
| Fork lanes and sharp turns | 3.00 | 2.88% (2) | 552 | 1,104 |
| Fork lanes, sharp turns, gate queues (D24) | 3.40 | 2.39% (3) | 522 | 1,205 |

The protected left interval did not help and was removed. What does move: the freeway diverge at node 1748 (way 782554093, three lanes tagged `slight_left|slight_left;slight_right|slight_right`) sends vehicles for the 52nd Street ramp and the MLK ramp down the same three lanes, so the 52nd Street queue (it fills the 513 m ramp) blocked the MLK vehicles behind it. The gate at the freeway end then held every waiting trip behind the first one that could not enter. The 52nd Street ramp itself stays at 555 veh/h: its discharge is set by the signal at Shattuck Avenue and by Shattuck Avenue north, and the model discharges less than half the counted volume there. The cause of that gap is not fixed.

### Ramp terminals, PM, modeled against counted (seed mean, veh/h)

| Ramp | Lanes | Counted | Before | After |
| --- | --- | --- | --- | --- |
| Off, 52nd St (node 735) | 2 | 1,278 | 559 | 555 |
| Off, MLK Jr Way (727) | 1 | 1,656 | 1,064 | 1,249 |
| On, 52nd St (733) | 2 | 1,161 | 1,276 | 1,273 |
| On, MLK Jr Way (288 / 687, one count for both) | 1 / 2 | 869 | 516 / 1,025 | 466 / 1,086 |
| Off, Clifton St / Claremont Ave (691) | 2 | 972 | 1,400 | 1,555 |
| Off, Aileen St / Telegraph Ave (710) | 2 | 621 | 785 | 796 |
| On, 56th St / Telegraph Ave (709) | 2 | 657 | 924 | 875 |
| On, Hudson St / Claremont Ave (845) | 2 | 882 | 962 | 1,005 |
| Off, Keith Ave (1149) | 2 | 477 | 346 | 519 |
| Broadway ramps (1328, 1336, 1366) | 1 / 1 / 2 | 351 / 351 / 315 | 521 / 216 / 230 | 543 / 198 / 166 |
| Broadway Terrace ramps (1572, 1593, 1685) | 1 | 317 / 218 / 317 / 218 | 324 / 235 / 264 / 137 | 324 / 233 / 297 / 230 |
| Caldecott Lane ramps (1711, 1727) | 1 | 113 / 61 / 61 | 107 / 66 / 150 | 106 / 62 / 143 |
| Miles Ave ramps (1756, 1758) | 1 | 360 / 315 | 422 / 347 | 435 / 386 |

The two ramps at the west end that fall short are the off-ramps to 52nd Street and MLK Jr Way (together 2,934 counted, 1,804 modeled). The Clifton St / Claremont Ave off-ramp takes 1.6 times its count: the simulator sends too many cars to that exit. The MLK on-ramp row is one Caltrans count shared by two ramps; the pair sums to 1,552 against 1,738 if the count applies to each. Geometry of the other terminals matches OSM in lanes and control; no lane count, turn pocket or merge was found missing.

### Changes kept

- Forks (D23): a multilane link that forks into two or more straight-ahead branches gives each branch its own lanes. Test: `a_fork_shares_its_lanes_out_by_branch_left_branch_in_the_left_lanes`.
- Gate queues (D24): a waiting trip whose first link has no room does not hold back trips with another first link. Test: `a_gate_vehicle_that_cannot_enter_does_not_hold_back_one_that_can`.
- Sharp turns (D25): a turn of 149 to 165 degrees onto a street of another name is a turn, not a U-turn. Test: `a_sharp_turn_onto_a_street_of_another_name_is_a_turn_and_a_reversal_stays_banned`. It opens 29 movements on the network (for example Adeline St to Market St, MLK Jr Way to West St, Colby St to Claremont Ave). Median-opening reversals on one street (about 165 to 180 degrees, same name) stay banned. `tools/lib/assign.ts` mirrors the rule.
- The golden corridor test changed in the fourth digit of its means (cut-through share, mean trip delay, vehicle-kilometers); trips, spawned and completed counts are identical. The cause is the gate queue rule, which lets a few vehicles enter a step earlier. Intended.

### Block volumes and the Colby St turn (PM, ten seeds, refit with `npm run data`)

OSM has no restriction at the Colby St, Claremont Ave and Forest St junction. Colby St southbound arrives at 181.6 degrees and Claremont Ave northeast leaves at 32.5, a turn of 149.1 degrees against the simulator's U-turn limit of 148.97. The movement is open now in the router and the simulator. The demand fit still gives it 0 to 1 veh/h against 75 counted (marked doubtful), because no origin and destination pair has a shortest route through it, so the fit has nothing to scale. The hold-out split was not changed (same stations, same rule).

| Block | Counted NB / SB | Before NB / SB | After NB / SB |
| --- | --- | --- | --- |
| Colby St, median block | 174 / 160 | 79 / 214 | 125 / 199 |
| Colby St, North St to Alcatraz Ave | 164 / 139 | 31 / 172 | 60 / 152 |
| Hillegass Ave, median block | 110 / 168 | 51 / 111 | 82 / 149 |
| Entries from Telegraph Ave side (8 points) | 264 | 454 | 448 |
| Entries from Claremont Ave and Forest St | 505 | 495 | 565 |

Interior stations on the simulator's flows: 83% of fitted blocks and 78% of held-out blocks have GEH below 5 (78% and 67% before); other stations 48% fitted, 38% held out (unchanged).

### Ten-seed stability

| Period | Before: removals per hour / backlog | After: removals per hour (min to max) | After: backlog, seeds under 2% | Rule D16 |
| --- | --- | --- | --- | --- |
| PM peak | 2.50 / 3.88% (0 of 10) | 9.40 (0 to 39) | 1.60% (7 of 10) | fails |
| AM peak | 1.00 / 0.20% (10 of 10) | 1.10 (0 to 5) | 0.03% (10 of 10) | fails (limit 1.0) |
| Midday | 0.00 / 0.00% | 0.10 (0 to 1) | 0.01% (10 of 10) | holds |

The PM backlog improved. The PM removal mean got worse because of single events: seeds 1 and 9 have 25 and 39 removals, both on Telegraph Ave north of the study area (links 2297 to 2300, Webster St and Ashby Ave), where a queue forms after 38 minutes. Eight of the ten seeds have 12 or fewer. Ten-seed attribution on the new demand, PM:

| Forks | Gate queues | Removals per hour (max seed) | Backlog (seeds under 2%) |
| --- | --- | --- | --- |
| off | off | 1.90 (5) | 3.65% (1) |
| on | off | 9.10 (49) | 2.51% (4) |
| off | on | 9.30 (73) | 2.45% (4) |
| on | on | 9.40 (39) | 1.60% (7) |

Either change delivers more ramp traffic to the next bottleneck, which then gridlocks in some seeds. `FORK_LANES` (params.rs) and `SPAWN_SCAN` (1 turns the gate rule off) restore the first row. Neither change fixes the 52nd Street ramp.

### Other runs

| Run | Removals per hour | Backlog (seeds under 2%) | Growth above 2 points |
| --- | --- | --- | --- |
| PM, 120 minutes (before: 5.80, 5.11%, 0 of 10) | 12.90 (0.5 to 46) | 1.96% (6 of 10) | seed 2 only (before: all ten) |
| Cross-validation demand, PM (before: 2.70, 1.92%, 6 of 10) | 1.80 (0 to 7) | 0.49% (10 of 10) | none |
| Cross-validation demand, AM and midday | 0.20 and 0.30 | 0.00% (10 of 10) | none |

The validation suite is unchanged (45 of 58 cases). The area `calibration` entry is unchanged: status `uncalibrated`, AM and PM experimental, midday the default (midday holds; the AM peak misses by 0.1 removals per hour).

### What remains

- The 52nd Street off-ramp is at 555 against 1,278 veh/h; the limit is the permissive left turn into Shattuck Avenue north and that single-lane street; the signal timing there is unknown (OSM has none).
- PM stability fails on removals (Telegraph Ave north near Webster St) and on seeds under 2% backlog (7 of 10).
- AM mean removals 1.10 against the limit 1.0.
- The Colby St turn toward Claremont Ave northeast has no flow in the demand.
- Telegraph Ave side entries are 70% over their count; Colby St north block 63% under northbound.

## Twelfth round: the resident volunteer count, router delays, the Colby Street signal (task 16)

Decisions of 2026-11-12 (design D20 to D22). The new data is the resident volunteer count of Tuesday, February 25, 2025 (8 to 9 AM and 5 to 6 PM): 98 AM and 109 PM directed block volumes, entries at 18 access points, 255 turning movements, the whole-street counts on Colby Street and Hillegass Avenue, and the queue and signal observations at Colby Street and Claremont Avenue. Decisions are judged over seeds 1 to 10 with the rules of D16 to D18; the exploring runs of this round used seeds 1 to 3 and are not listed unless a number from them is used. Runs include the initial loading (D19). Before the round the model carried, on Colby Street, a median block of 32 veh/h northbound and 99 southbound in the PM peak and, on Hillegass Avenue, 57 and 130; the count has 160 to 190 on every block of Colby Street and 93 to 178 on Hillegass Avenue.

### What was added

`tools/lib/volunteer-count.ts` (reader and mapper, no street names, tests in `tools/volunteer-count.test.ts`); route features in the assignment (turning movements and whole-street paths, `tools/lib/assign.ts`) and constraints on them in the fit (`tools/lib/fit-counts.ts`); count stations, hold-out, composition table and the interior/other split in the demand fit report; local trip rates scaled to the count's trip ends (`build-demand.ts`); `crates/sim/data/node-delays.json` read by the router and the assignment, written by `tools/node-delays.ts`; `signalObservations` (area config, importer `tools/lib/signal-obs.ts`, `Node::signal_timing`, `plan_with_observation` in `eff.rs`, Rust test); `calibrate` reports route features by select link and the observed signals; `tools/assess.ts` scores interior blocks apart from the other stations and lists the count's blocks, entries, movements, routes and signal; `tools/cost-loop.ts` keep rule for an unstable baseline.

### Counted blocks and movements on the network

Counted block values: 207 (98 AM, 109 PM). 203 map to a directed link (199 with both cross-street names matching, 4 approximate because the network merged a junction) and give 110 block stations, 91 fitted and 19 held out (every fourth block along each street and direction; none of the two uncertain readings). The 4 that do not map are the 61st Street values between Canning Street and Colby Street (AM 16 westbound, 14 eastbound; PM 8 and 13): the network splits that block into four links around park paths, so no single link has those cross streets. The Colby Street jog block between the two 63rd Street legs maps (link 2630 and 2631), and so does the 20 m link between 63rd Street and North Street.
Turning movements: 255 values, 221 mapped to a pair of links. The 34 that do not map are the movements at the Colby Street and North Street / 63rd Street junction, which the network has as two nodes 20 m apart (10 values), at Martin Street and Hermann Street / 58th Street (6, direction not legible or merged names), the "straight to" rows and the Forest Street straight-across rows (7), and a few more with no readable direction. 47 mapped movements go straight on one street and are left to the block counts; 68 are below 25 veh/h; 22 are constraints, one of them down-weighted for a doubtful reading (Colby Street SB to Claremont Avenue NE, PM, "75"). Whole-street counts: 4 of 9 rows are used (the Martin Street to Telegraph Avenue route has no PM figure and no street end at Alcatraz Avenue).
Entries: the 18 access points map to 18 entry links. Count hour against the model's period: the count's 5 to 6 PM is the last hour of `pm_peak` (16:00 to 18:00) and 8 to 9 AM the second hour of `am_peak` (7:00 to 9:00); the period rate is the mean hourly rate of the window, so the count is a high reading of it, and the same holds for the Oakland and Caltrans peak-hour counts, so all counts are used the same way. Midday: the interior targets are the PM count times 0.62 (the midday/PM ratio of `periodFactors`) at half weight, an ASSUMPTION.

### Hold-out: the count stations in the demand fit

The build fits twice (D17): once without the validation stations (the out-of-sample figures) and once on every count (the demand that ships). Static assignment against the counts, GEH below 5 (size bands), from `rockridge.fit.md`:

| Period | Interior blocks, fitted | Interior blocks, held out | Other stations, fitted | Other stations, held out |
| --- | --- | --- | --- | --- |
| AM peak | 76 of 96 (79%; bands 99%) | 13 of 19 (68%; 95%; mean GEH 4.6) | 58 of 72 (81%; 96%) | 2 of 16 (13%; 19%; mean GEH 15.6) |
| Midday | 91 of 110 (83%; 100%) | 13 of 19 (68%; 100%; mean GEH 3.9) | 58 of 69 (84%; 97%) | 6 of 16 (38%; 44%; mean GEH 10.1) |
| PM peak | 85 of 107 (79%; 95%) | 11 of 18 (61%; 89%; mean GEH 4.1) | 53 of 69 (77%; 91%) | 4 of 16 (25%; 25%; mean GEH 13.4) |

"Other stations" are the gates, ramps, Caltrans stations, the turning-movement legs, and the movements and routes of the count. The held-out interior blocks fit out of sample about as well as the fitted ones in the static assignment (61% to 68% against 79% to 83%), probably because the other blocks of the same street carry the information. The held-out arterial and ramp stations fit badly, as in the eleventh round (flows that touch no count fall to the median factor of their type); 25% in the PM against 31% before.
On the simulator's flows (seed mean, ten seeds), GEH below 5 (size bands within 100 veh/h below 700 veh/h; on counts of 100 to 190 veh/h that band is wide, so the bands pass easily):

| Period | Interior, fitted | Interior, held out | Other, fitted | Other, held out |
| --- | --- | --- | --- | --- |
| AM peak | 67 of 77 (87%; bands 100%) | 15 of 19 (79%; 100%) | 21 of 31 (68%; 61%) | 6 of 13 (46%; 54%) |
| Midday | 81 of 91 (89%; 100%) | 15 of 19 (79%; 100%) | 25 of 31 (81%; 81%) | 11 of 13 (85%; 92%) |
| PM peak | 69 of 89 (78%; 98%) | 12 of 18 (67%; 100%) | 15 of 31 (48%; 55%) | 5 of 13 (38%; 38%) |

Out of sample, on the demand of the cross-validation fit (held-out stations left out of the fit; `rockridge.assessment-validation.md`): PM interior held out 11 of 18 (61%; bands 94%; mean GEH 4.6) against fitted 64 of 89 (72%); PM other stations held out 2 of 13 (15%; mean GEH 15.0) against fitted 18 of 31 (58%). AM: interior held out 16 of 19 (84%), other 2 of 13 (15%); midday: 12 of 19 (63%) and 6 of 13 (46%). So the interior blocks are predicted out of sample (61% to 84%) much better than the arterials and ramps (15% to 46%); in the eleventh round the held-out arterial and ramp stations scored 1 of 13 (8%) out of sample on the simulator's flows. The pooled rule (more than 85% by GEH or bands) is met by the pooled fitted PM stations (87% by bands) only because the 89 interior blocks pass the wide band; the 31 other stations alone meet neither (48% and 55%).

### Where the trips come from

Trip ends with an end in the study area, PM peak, car trips per hour (flows with an origin or a destination node in the study area; `ii` = both ends inside), before the round and after:

| | Origins in the area | Destinations in the area | Both ends inside |
| --- | --- | --- | --- |
| Demand before the round (fit without the count) | 508 | 434 | 7 |
| Offered at the assumed rates, external ends of study-area blocks (build) | 224 | 275 | - |
| Implied by the count (entering and leaving less 268 whole-street cars; 1,195 entering, 1,208 leaving) | 940 | 927 | - |
| Demand after the round (shipped) | 1,088 | 989 | 3 |

The count shows about 1,175 to 1,195 vehicles entering the neighborhood in the PM hour and about 1,208 leaving, so the model, which offered 434 destination ends and 508 origin ends in the study area, did not generate nearly enough local trips: the rate of 3.2 trips per LODES resident worker and day covers workers only, and the ends it offers at the model's mode and peak-hour shares are about 29% (destinations) and 24% (origins) of what the count implies. The local rates of study-area blocks are now scaled by 3.4 (destinations) and 4.2 (origins, capped at 4.0) in the PM, 2.95 and 2.83 in the AM, and the mean of the two for midday (ASSUMPTION), so the offered external ends equal the count's. Through trips between the surrounding gates are not touched by this; they are the gate counts' business, and the fit lowers them by 22% in the PM (9,415 offered, 7,343 final) where the gates are over-supplied. Freeway-related trips keep the ramp counts (DATA): 13,068 offered and 13,174 final in the PM, off-ramp stations at 1.01 and on-ramp stations at 1.04 of target.
The arterial, gate and ramp counts are not violated by the extra local trips: gate stations are at 1.00 of their targets and the Caltrans and ramp stations at 0.98 to 1.04 in the PM; the turning-movement legs at Telegraph Avenue / Alcatraz Avenue and Market Street / 55th Street come to 0.96 in total (0.94 before the round).

Composition of the assigned traffic per block on the interior streets, PM peak, veh/h per block (static assignment; local-end = one end at a block, through = gate to gate, freeway = one end on the freeway; `rockridge.fit.md`, "Who uses the interior streets"):

| Street, direction | Before the round: local-end / through / freeway (total) | Offered after the rate change | After the fit (shipped) |
| --- | --- | --- | --- |
| Colby Street NB | 7 / 0 / 11 (18) | 1 / 0 / 23 (24) | 3 / 0 / 62 (65) |
| Colby Street SB | 4 / 0 / 24 (28) | 2 / 0 / 30 (33) | 7 / 1 / 49 (57) |
| Hillegass Avenue NB | 8 / 0 / 44 (53) | 5 / 0 / 113 (119) | 15 / 1 / 75 (90) |
| Hillegass Avenue SB | 16 / 3 / 66 (84) | 6 / 2 / 63 (70) | 17 / 5 / 107 (129) |

The static assignment still carries only 57 to 65 veh/h on a Colby block against 160 to 190 counted; in the simulator the blocks carry more (next sections), because drivers there also take Colby Street when the arterials are slow. The composition shows why the fit cannot reach the count by scaling alone: on Colby Street 86% to 95% of the assigned volume is freeway-related, and local-end and through trips together are 3 to 8 veh/h. No gate-to-gate trip in the table is routed over the whole of Colby Street (the count's full-route counts are 102 northbound and 39 southbound, and the assignment gives 0 and 3). The fit scales flows; it cannot create a route that no flow takes, and with the router's costs no pair of through gates has a route over Colby Street within 5% of its best route (above).

Observed shares against the count. The StreetLight shares say about 47% of the traffic on Colby Street northbound comes from the freeway and 45% of southbound goes to it; the count says 56% (northbound) and 28% (southbound) of the cars entering Colby Street at Claremont Avenue or Alcatraz Avenue in the PM hour drive its whole length, 51% and 44% on Hillegass Avenue, and 43% of the entrants across the two streets. These are different quantities (freeway end against whole-street trip), so they do not contradict each other. The volumes do conflict with the shares in the model: to put 160 to 190 veh/h on Colby Street the fit uses the trips that exist, which are almost all freeway-related, and the freeway-related share of the assigned traffic on the four select-link blocks comes out at 68% to 80% against 45% to 68% observed (final column of the share table in `rockridge.fit.md`: Hillegass NB 68, Colby NB 74, Hillegass SB 80, Colby SB 77, against 47, 47, 68, 45). Where they conflict the fit follows the counts (weight 1) over the shares (weight 0.5): counts are measured, the shares come from a device sample.

### Simulator consistency: control delays of the router (D21)

Measured in the PM peak on the first fit that used the count (seeds 1 to 3; `rockridge.node-delays.md` holds the table, `tools/node-delays.ts` the method): delay per vehicle on links that end at each control, time lost against the speed limit, flow-weighted.

| Link group | Links | Mean delay (s) | Flow-weighted median (s) | Router constant before (s) | After (s) |
| --- | --- | --- | --- | --- | --- |
| ends at no control | 1113 | 3.2 | 1.4 | - | - |
| major street at a two-way stop | 631 | 3.2 | 1.7 | 0 | 0 |
| signal | 298 | 15.4 | 11.7 | 10 | 10 |
| minor approach at a two-way stop | 378 | 28.4 | 15.5 | 5 | 14 |
| all-way stop | 220 | 11.3 | 9.4 | 6 | 8 |
| traffic circle | 79 | 9.0 | 5.6 | 3 | 4 |

Which is wrong: the router. A vehicle that has to stop loses more than 5 s with no conflicting traffic (the stop dwell of 1 s, the deceleration and the acceleration), and the gap-acceptance waits come from the rule validated against [Brilon1999] in `validation.md` (cases e1 to e9: e1, e4, e5, e7 and e8 inside the published ranges, e2 and e3 below, e6 and e9 above). The count's own evidence concerns signals, not stops, and is below. Signals and all-way stops agree within 2 s, so only the minor stop moves a lot (5 to 14 s; the flow-weighted mean, 28 s, is set by a few jammed approaches whose queues are already in the route costs the simulator updates every epoch, so the median is used). The constants now live in one file, `crates/sim/data/node-delays.json`, read by the router and the assignment; `tools/node-delays.ts --write` rewrites it from seed reports.
Effect on route choice (static router, all 9,900 ordered pairs of through gates): the free-flow cost of driving the whole of Colby Street changes from 108 s to 110 s (it has few minor stops), and the number of gate pairs for which a route over the whole street is within 15% of the best route falls from 251 to 205 northbound and from 126 to 107 southbound (within 30%: 1,539 to 1,367 and 1,378 to 1,290). No pair has a whole-Colby route within 5% of its best, so with this router a through trip takes Colby Street only when noise or arterial congestion tips it. In the fit, the interior blocks reached 79% of their summed target before the change (the first fit with the count) and 74% after it. Ten seeds of the PM peak with the old and the new constants (table under the ten-seed assessment) show no systematic effect on stability.

### Simulator consistency: Colby Street at Claremont Avenue and Forest Street (D22)

The count: cycle 79 s, 4 s of green for Colby Street, red 75 s (8 to 9 AM); a median of 4 cars (average 3.3) leave Colby per cycle; the queue averages 3.3 cars and reaches 13; from 9 AM the cycle is 147 s with 10 s of green. The PM cycle is not stated. The simulator, after the phase-grouping and adaptive-split fixes, planned this signal with three phases (Claremont Avenue, Forest Street, Colby Street) and the minimum green of 15 s for the smallest phase. Three seeds on the demand of the first fit:

| Period | Plan | Cycle (s) | Greens Claremont / Colby / Forest (s) | Colby SB discharge | Cars per cycle |
| --- | --- | --- | --- | --- | --- |
| AM | before (Webster) | 75 | 28 / 16.5 / 15 | 196 veh/h | 4.1 |
| AM | observed timing | 79 | 45 / 4 / 15 | 150 veh/h | 3.3 |
| PM | before (Webster) | 75 | 30 / 15 / 15 | 250 veh/h | 5.2 |
| PM | observed AM timing (ASSUMPTION) | 79 | 38 / 4 / 22 | 178 veh/h | 3.9 |

The plan gave Colby about four times the observed green (16.5 s against 4 s; the minimum green of 15 s alone is nearly four times) and let 30% to 55% more traffic out of Colby than the count shows (196 against the counted AM block of 163; 250 against the PM block of 162). The 15 s minimum green is not a bug, but an approach with several times the observed green lets far more traffic leave Colby than reality. The fix is data, not a change of rule: `signalObservations` in `data/areas/rockridge.json` sets the observed cycle and green in a listed period and lets the other phases share the rest by flow. With it the AM approach discharges 3.3 cars per cycle (counted: average 3.3, median 4). The PM cycle: 3.5 cars per cycle at the 162 veh/h counted on the last Colby block gives about 78 s, so the AM timing is used for the PM peak, an ASSUMPTION; midday takes the 147 s timing seen after 9 AM, also an ASSUMPTION. The simulator discharges 3.9 cars per cycle in the PM, about 10% above the median of 3.5. The queue (average 3.3 cars, maximum 13) was not measured in the simulator.

### Cost loop with measured delays (D18), run again on the new baseline

`npm run cost-loop`, the PM peak over seeds 1 to 10, other periods over seeds 1 to 3, successive averages. The keep rule was changed because the PM baseline is not stable: an iteration is kept when removals, backlog and the headline-share error are not worse than iteration 0 (the share error within 0.5 points), no GEH share falls by more than 5 points, interior blocks included, and the least removals plus backlog wins.

| Iteration | PM stable | Removals per hour | Backlog mean % | Seeds under 2% | Headline shares (47 / 47 / 68 / 45) | Error (points) | GEH<5 fitted / held | Interior GEH<5 fitted / held | Cost gap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 (free-flow and BPR costs) | no | 2.50 | 3.88 | 0 | 65 / 76 / 70 / 71 | 18.9 | 70% / 55% | 78% / 67% | - |
| 1 (measured delays, gap 0.34) | no | 25.60 | 1.85 | 5 | 49 / 77 / 56 / 68 | 17.1 | 70% / 55% | 78% / 78% | 0.337 |

Iteration 1 moved trips onto the links that were fast in iteration 0 and the next run gridlocked (25.6 removals per hour, as in the ninth round), so the loop was stopped after it (a third iteration was under way and was dropped) and no iteration was kept; the demand uses free-flow and BPR costs and the delays file was removed. The stations' GEH shares in the table are those of the simulator on the state at the time (they are not the final ten-seed figures).

### Ten-seed assessment of the shipped demand (D16 to D18)

All numbers are from `rockridge.assessment.md` (seeds 1 to 10, 60 minutes, scale 1.0, initial loading on).

| Period | Stability (D16) | Removals per hour, mean (min to max) | Backlog under 2% | Second-half growth above 2 points | Arterial speed (m/s) | Old rule |
| --- | --- | --- | --- | --- | --- | --- |
| AM peak | fails (at the limit) | 1.00 (0 to 6) | 10 of 10 (mean 0.20%) | none | 8.41 | 7 of 10 seeds |
| Midday | holds | 0.00 | 10 of 10 (mean 0.00%) | none | 10.01 | 10 of 10 |
| PM peak | fails | 2.50 (0 to 5) | 0 of 10 (mean 3.88%, max 6.23%) | seeds 1, 3, 4, 5, 6, 8, 9, 10 | 7.46 | 0 of 10 |
| PM peak, 120 minutes | fails | 5.80 (0.5 to 24.5) | 0 of 10 (mean 5.11%) | all ten | 7.18 | 0 of 10 |
| PM peak, cross-validation demand | fails | 2.70 (0 to 8) | 6 of 10 (mean 1.92%) | seeds 4, 6, 9 | 7.78 | 4 of 10 |

AM misses the rule at its limit: a mean of 1.00 per hour against "below 1.0" (seed 5 with 6 removals, seeds 6 and 9 with 2 each). The eleventh round had AM at 0.40 per hour and PM at 3.40 with a backlog of 1.88% (5 of 10 seeds under 2%). Those PM figures do not reproduce on the tree this session started from: ten seeds of the old demand file (the eleventh round's demand) with the simulator as it stood at the start of this round (old router constants, no observed signal) gave 4.2 removals per hour and a backlog of 4.82% (0 of 10 under 2%). The baseline had moved before this round's changes: commits after the eleventh round's runs (the leg-bearing work) changed `topo.rs`, `diverter.rs` and `model.rs`, and the network now carries bearings. These runs cannot separate the effects. Attribution runs, PM, seeds 1 to 10:

| Demand | Router constants | Colby signal | Removals per hour | Backlog (seeds under 2%) |
| --- | --- | --- | --- | --- |
| eleventh round demand | old (5, 6, 10, 3 s) | Webster | 4.2 | 4.82% (0) |
| eleventh round demand | old | observed | 5.5 | 4.18% (0) |
| eleventh round demand | new (14, 8, 10, 4 s) | observed | 3.9 | 4.24% (0) |
| this round's demand | old | observed | 7.0 (one seed with 61) | 3.88% (0) |
| this round's demand (shipped) | new | observed | 2.5 | 3.88% (0) |

No one change moves PM stability: the new demand with the count and the new constants is at least as stable as the old state (2.5 against 4.2 removals per hour, 3.88% against 4.82% backlog). The interior volumes are not the bottleneck.
Where the PM backlog sits (ten seeds): 855 trips on average wait at the SR-24 mainline gate (node 610, offered 4,810 veh/h), 13 at Telegraph Avenue / Ward Street, nothing inside the study area. The mainline link 611 to 1750 has a mean delay of 316 s, and the off-ramp to 52nd Street (link 4191) 371 s at 559 veh/h against 1,278 counted (GEH 23.7), and the ramp approach at the 52nd Street and Shattuck Avenue signal (node 688, the node with the most blocked time) 92 s. The queue of the 52nd Street off-ramp backs onto the mainline and holds back the mainline entry. The off-ramp to Claremont Avenue and Clifton Street carries 1,400 against 972 counted (GEH 12.4), so the simulator sends too many cars to one exit and too few to the other. Removals sit at Market Street and 60th Street (a two-way stop; 8 of 10 AM removals and 10 of 25 PM removals) and Market Street and Stanford Avenue, both outside the study area. I did not find a fix that is neither demand scaling nor a change of re-route share. By a rough estimate (four lanes and 42 s of green in a cycle of about 75 s) the ramp approach at node 688 could serve several times its 600 veh/h, so the limit lies downstream or in the merges, and finding it needs a look at the lane counts and the short links around nodes 730 to 734 that this round did not make.

### Modeled and counted volumes on Colby Street and Hillegass Avenue (PM, ten seeds)

Counted by the volunteers against the simulator's mean flow, veh/h per block, in order from Claremont Avenue to Alcatraz Avenue (held-out blocks marked h):

| Colby Street block | NB counted / modeled | SB counted / modeled |
| --- | --- | --- |
| Claremont Ave to McAuley St | 189 / 142 | 162 / 189 |
| McAuley St to 60th St (h) | 182 / 112 | 170 / 214 |
| 60th St to 61st St | 179 / 90 | 159 / 223 |
| 61st St to 62nd St | 174 / 70 | 160 / 207 |
| 62nd St to 63rd St | 158 / 79 | 162 / 217 |
| 63rd St jog (h) | 152 / 70 | 156 / 217 |
| North St to Alcatraz Ave | 164 / 31 | 139 / 172 |
| Median block | 174 / 79 | 160 / 214 |

| Hillegass Avenue block | NB counted / modeled | SB counted / modeled |
| --- | --- | --- |
| Claremont Ave to 61st St | 114 / 67 | 152 / 109 |
| 61st St to 62nd St (h) | 110 / 44 | 151 / 111 |
| 62nd St to 63rd St | 93 / 38 | 168 / 153 |
| 63rd St to Alcatraz Ave | 109 / 51 | 178 / 108 |
| Median block | 110 / 51 | 168 / 111 |

Before the round the median block carried 32 NB and 99 SB on Colby Street and 57 and 130 on Hillegass Avenue; now 79 and 214, and 51 and 111. Colby Street southbound is 17% to 40% above the count on every block, northbound is 25% to 80% under, and Colby Street northbound at its north end (North Street to Alcatraz Avenue) carries 31 against 164. Hillegass Avenue is under on both directions (0.4 to 0.9). Both streets together are at 0.88 (Colby) and 0.63 (Hillegass) of the counted flow in the corridor ratios. On Colby Street the limit is route choice: in the simulator 172 cars an hour turn from Colby Street southbound onto Claremont Avenue toward the southwest against 84 counted, and none turn toward the northeast (75 counted, a reading marked uncertain; the turn is about 150 degrees and the network does not allow it), and northbound only 5 of 131 counted cars reach Alcatraz Avenue and turn west, because the trips that enter Colby Street leave it for the cross streets toward Telegraph Avenue (the cross streets 57th to 63rd Street carry 1.4 to 1.8 times their count, except 58th Street at 1.0; McAuley Street 2.2, Howell Street 3.7, Hermann Street 2.3, Ayala Avenue 1.8).

### Entries by side, the Claremont turn-in split, Alcatraz exits, full routes (PM, simulator mean)

| Side | Counted (printed total) | Counted (sum of the 18 access points) | Modeled |
| --- | --- | --- | --- |
| Claremont Avenue and Forest Street (5) | 498 | 505 | 495 |
| Alcatraz Avenue at Colby, Hillegass, Dana (3) | 360 | 360 | 298 |
| Telegraph Avenue and the streets west of it (8) | 248 | 264 | 454 |
| College Avenue (2) | 61 | 66 | 66 |
| All 18 | 1,167 (1,175 in the text) | 1,195 | 1,313 |

Telegraph Avenue entries are 72% above their count (the model sends too many cars east from the Telegraph Avenue side; the entry at 57th Street 139 against 73, at 63rd Street 71 against 27), Alcatraz Avenue 17% under. The Claremont Avenue turn-in split, counted (modeled): Colby Street 182 (142), Martin Street 164 (213), Hillegass Avenue 94 (67), Forest Street 58 (59), 60th Street 7 (14); as shares of the side, 36 / 32 / 19 / 11 / 1% counted and 29 / 43 / 14 / 12 / 3% modeled. The Alcatraz Avenue exits of the cars driving north on Colby Street and Hillegass Avenue: counted 64% toward Telegraph Avenue, 32% toward College Avenue and 4% straight across (174, 86, 13 of 273 cars); modeled 29 cars of 273 reach Alcatraz Avenue at all (5 and 16 turn west, 5 and 3 turn east), so the split is 72% and 28% of a tenth of the count. Whole-street counts, counted (modeled, 95% interval): Colby Street NB 102 (23, 20 to 27), SB 39 (114, 104 to 125), Hillegass Avenue NB 48 (34, 30 to 39), SB 79 (72, 62 to 82). The simulator reverses the direction of the through traffic on Colby Street (the count has the northbound excess that the writers could not explain). Turning movement from Claremont Avenue onto Colby Street: 121 counted, 88 modeled; Forest Street onto Colby Street 57 and 64.
The signal: the simulator discharges 189 veh/h (4.2 cars per cycle) from Colby Street southbound at Claremont Avenue with the observed 79 s and 4 s; the count has 3.3 on average and a median of 3.5 to 4.

### Route shares and ramp shares (PM, seed mean with 95% interval; observed in brackets)

Headline: Hillegass Avenue NB from the freeway 64.8 (61.9 to 67.7) (47), Colby Street NB from 76.4 (74.0 to 78.9) (47), Hillegass Avenue SB to 69.7 (66.8 to 72.6) (68), Colby Street SB to 71.5 (69.0 to 73.9) (45). One of four is within 10 points; the mean absolute error is 18.9 points (10.9 in the eleventh round, with two of four within); D5 fails. AM 63.7 / 76.4 / 57.3 / 68.7 and midday 55.8 / 72.1 / 72.4 / 69.3 (observed values are the PM ones). The two Colby Street shares got worse because the count's volumes on Colby Street are carried by the freeway-related trips that exist in the table (86% to 95% of its assigned volume); the shares are the conflicting evidence (see "Where the trips come from") and the fit follows the counts. Ramp via-street shares, PM (observed): onto the freeway via College Avenue 8.5 (16), Hillegass Avenue 11.0 (12), Martin Street 10.6 (10), Colby Street 20.3 (8), Telegraph Avenue north of Alcatraz Avenue 5.6 (8), Benvenue Avenue 2.3 (5); from the freeway via College Avenue 5.0 (10), Martin Street 18.7 (10), Colby Street 8.9 (8), Hillegass Avenue 3.9 (5), Benvenue Avenue 1.7 (3). Colby Street onto the freeway is 12 points over; the others are within 9.
Corridor ratios, PM (simulated over counted flow): Alcatraz Avenue 0.92 (0.90 to 0.93), freeway ramps 0.95, Market Street / 55th Street 0.66, San Pablo Avenue 1.03, Tunnel Road 0.77, Claremont Avenue 0.48 (two Caltrans stations; the station at link 3477 reads 105 against 698 counted, 191 to 199 with the old demand and the old router constants), Colby Street 0.88, Hillegass Avenue 0.63.

### Calibration entry and verdict

Status `uncalibrated`. Stability: AM fails (mean removals 1.00 per hour, the limit), midday holds, PM fails; the PM headline shares fail (1 of 4 within 10 points); the pooled PM station rule is met by the simulator's fitted stations (87% by size bands) only through the interior blocks. `experimentalPeriods` are the AM and PM peaks, `defaultPeriod` midday. The public note says Colby St and Hillegass Ave now carry closer to what residents counted and that the peaks still strand a few cars. The noise file `public/data/rockridge.noise.json` was regenerated from the ten PM, AM and midday seeds. The interior and the cross-validation numbers above, and the counts of the volunteers block by block, are in `rockridge.assessment.md` and `rockridge.assessment-validation.md`.

### What remains

- PM and AM stability: the backlog at the SR-24 mainline gate and the 52nd Street off-ramp (371 s, 559 against 1,278 veh/h), and removals at Market Street and 60th Street. The simulator also sends 1,400 against 972 veh/h to the Claremont Avenue and Clifton Street off-ramp. Needs a geometry check of the ramp terminals and a look at ramp choice.
- Colby Street: northbound is 25% to 80% under and its north end 80% under, southbound 20% to 40% over; trips enter Colby Street and leave it for the cross streets toward Telegraph Avenue; the Claremont Avenue and Colby Street turn toward the northeast (75 counted) is not allowed; the cross streets between Telegraph Avenue and Colby Street carry 1.4 to 3.7 times their count. Needs the origins and destinations of the trips from the Berkeley side and from Telegraph Avenue, and the gates of the cross streets.
- Hillegass Avenue is 0.4 to 0.9 of its count in both directions.
- The freeway-related share of Colby Street traffic is 72% to 76% against 47% (StreetLight) and 45% to 56% (count); a source for local-end and through trips on Colby Street is missing.
- Entries from Telegraph Avenue are 72% over their count.
- A second count day and more hours (`docs/data-needs.md`, item 1).
- Leave-one-corridor-out cross-validation was not run.
- The cost loop with measured delays gridlocks (25.6 removals per hour at its first iteration), as in the ninth round.

## Initial loading: runs start with traffic on the streets (D19, change to the simulator)

User report: at time 0 there was almost nothing on the map. The simulator started empty and filled over several minutes. It now places the agents already en route (Poisson count per flow from rate x free-flow trip time with the expected control delay x 1.3, positions uniform by travel time, queued in lane order with a gap), then settles for 120 s before the clock starts at 0 (`Config::initial_load`, default true; `calibrate --no-initial-load` switches it off and `--warmup` still applies). `INITIAL_CONGESTION` 1.3 and `INITIAL_SETTLE_S` 120 s are ASSUMPTIONS, tuned only on the vehicles on the network at time zero. The calibration reports above were all measured from an empty network and are not affected; a new run of `calibrate` starts loaded unless told otherwise.

Check (`initload` tool, `cargo run --release -p traffic-sim --bin initload -- --period midday --seeds 1,2,3`): with initial loading at time 0 against a cold start stepped for 15 minutes, then the next 3600 s of each. Mean of seeds 1 to 3, demand files as of 2026-11-12, loaded / warmed up.

| | Midday | PM peak |
| --- | --- | --- |
| Vehicles on the network at time 0 | 1350 / 1307 (+3%) | 2091 / 2173 (-4%) |
| Inside the study area | 75 / 79 | 131 / 115 |
| Mean speed (m/s) | 8.9 / 8.9 | 8.2 / 7.9 |
| Standing cars at the 10 busiest signals | 67 / 64 | 135 / 161 |
| Motorway, primary, secondary, tertiary, residential, service links | 173, 173, 338, 396, 264, 6 / 164, 140, 281, 394, 324, 6 | 261, 278, 513, 606, 429, 4 / 265, 237, 487, 607, 569, 8 |
| Completed trips in the hour | 12,478 / 12,441 | 18,886 / 18,859 |
| Cut-through veh-km | 105 / 112 (seed spread 14 / 3) | 179 / 194 (seed spread 12 / 23) |
| Vehicle-km | 45,642 / 45,490 | 70,697 / 71,061 |
| Mean trip delay (s) | 94 / 95 | 165 / 179 |
| Mean trip time (s) | 417 / 426 | 489 / 511 |
| Gridlock removals | 0 / 0 | 0.3 / 2.0 (seeds 0, 1, 0 against 1, 5, 0) |
| Backlog at the end | 0 / 0 | 17 / 9 (seeds 2, 3, 47 against 0, 3, 23) |

Vehicles on the network are within 5% in every seed (+4, +5, 0 midday; -3, -3, -5 PM). Completed trips, vehicle-km, delay and trip time are within seed noise in midday and within 8% in the PM, where the loaded run reads 8% lower on delay: the trips placed at time zero are left out of the means, and they are the long ones. What remains off: the placement uses free-flow routes, so residential streets hold 18 to 25% fewer cars at time zero than after a warm-up, when drivers have moved onto them, and primary and secondary streets 5 to 23% more. The settle interval corrects part of it. The standing queues at the busiest signals are 16% short in the PM.

Time to build one simulation of the Rockridge network: 1.3 to 1.6 s native (release), 1.7 s (midday) and 1.9 s (PM peak) in the browser, against 0.3 to 0.4 s without initial loading. Placement takes about half and the settle interval the other half, so neither was shortened.

## Eleventh round: ten seeds, standard acceptance tests, hold-out, damped loop, implied volumes (task 14)

Decisions of 2026-11-12 (design D16 to D18; source `docs/simulator-audit.md` C1 to C5, C8, I3, R1). All runs: 60 minutes at scale 1.0 unless stated, seeds 1 to 10, current tree. **The runs include the initial loading from the other agent's change (traffic already on the streets, then a short settle) as it stood in the tree on 2026-11-12 (default on; `--no-initial-load` gives the empty start of earlier rounds).** The binary was copied before the runs so every number below comes from one build. Earlier rounds used three seeds and an empty start, so their numbers are not comparable one to one. Reports in `reports/` are the ten-seed summary and seed 1 in full per period; `rockridge.assessment.md` holds every share, station and corridor table.

### What was added

`calibrate --seeds 1-10 --jobs 4` (mean, standard deviation, min, max, 95% interval of the mean for every headline metric; stability verdict by the new rule with the old rule beside it); stability rule D16; GEH, size bands, hold-out selection, seed statistics, successive averages and per-link spread in `tools/lib/acceptance.ts`; `tools/assess.ts` (assessment, station scoring on the simulator's flows, noise file); hold-out stations and implied volumes in the demand fit; `tools/route-consistency.ts`; the cost loop rebuilt. Tests: `tools/acceptance.test.ts` (GEH worked values from [TfL-TMG4] appendix II, bands at their limits, hold-out coverage, seed statistics, successive averages), Rust tests for the seed list and the statistics.

### Stability under the new rule (D16), ten seeds

| Period | Verdict | Removals per hour, mean (min to max) | Backlog under 2% | Backlog growth, second half | Arterial speed m/s | Old rule (zero removals in every seed) |
| --- | --- | --- | --- | --- | --- | --- |
| AM peak | holds | 0.40 (0 to 1) | 10 of 10 | none above 2 points | 9.00 | 6 of 10 seeds |
| Midday | holds | 0.00 | 10 of 10 | none | 9.95 | 10 of 10 |
| PM peak | fails | 3.40 (0 to 8) | 5 of 10 (mean 1.88%) | seed 3 | 7.92 | 1 of 10 |
| PM peak, 120 minutes | fails | 4.15 (1.5 to 15.5) | 3 of 10 (mean 2.31%) | seed 1 | 7.70 | 0 of 10 |
| PM peak, no initial load (sensitivity) | fails | 1.70 (0 to 7) | 9 of 10 | seed 7 | 8.15 | 3 of 10 (7 of 10 pass backlog and speed) |

The new rule does what it was meant to: the AM peak, which the old rule called a failure in 4 of 10 seeds for one vehicle, holds, and the PM peak fails on the mean and on runaway growth, not on a single removal. The initial loading roughly doubles PM removals (1.7 to 3.4 per hour in the same demand), so the other agent's change matters for this verdict. Judged window: the whole 60 minutes (removals, backlog), flow tables after the first 10 minutes; no cool-down.

### Route shares (modeled seed mean with 95% interval, observed in brackets; PM observed values)

PM headline: Hillegass Ave NB from the freeway 65.1 (61.7 to 68.6) (47), Colby St NB from 39 (36 to 42) (47), Hillegass Ave SB to 65 (63 to 68) (68), Colby St SB to 30 (28 to 32) (45). Mean absolute error 10.9 points; two of four within 10 points (Hillegass NB +18, Colby SB -15), so D5 fails on the seed mean. AM 71 / 34 / 58 / 27 and midday 70 / 38 / 60 / 31 (observed values are the PM ones). Ramp via-street shares, PM, seed mean (observed): onto the freeway via College Ave 12.6 (16), Hillegass Ave 13.6 (12), Martin St 14.7 (10), Colby St 7.7 (8), Telegraph Ave north of Alcatraz Ave 12.0 (8), Benvenue Ave 4.6 (5); from the freeway via College Ave 8.5 (10), Martin St 16.5 (10), Colby St 8.9 (8), Hillegass Ave 5.9 (5), Benvenue Ave 3.0 (3). All within 7 points, ten of eleven within 5. The intervals are narrow (about 1 point) for the ramp shares and wide (3 to 4 points) for the select-link shares, so seed ranges of about 10 points in earlier rounds are consistent with this noise.

### Count stations, GEH and size bands ([WebTAG-M3.1], [TfL-TMG4])

Static assignment against the counts, shipped fit (all counts), PM: 48 of 50 stations GEH below 5 (96%), bands 50 of 50. AM 88%, midday 98%.
Held-out stations (16 of 50, 9 corridors), out-of-sample, from the fit without them: PM GEH below 5 at 5 of 16 (31%), bands at 3 of 16, mean GEH 13.3 against 0.8 for the fitted ones; AM 19%, midday 19%. The held-out stations fit much worse than the fitted ones. The causes are visible in the table: flows that touch no count fall to the median factor of their type, which sits near the lower bound, so unconstrained ramps, gates and Caltrans stations come out 30 to 65% low (52nd St off-ramp 0.34, Ashby Ave gate entering 0.35, Tunnel Rd 0.30). Leaving a quarter of the counts out of the shipped fit would have lowered the PM demand by 19%, so the demand that ships uses all counts.
The simulator's own flows (31 link-based stations, mean over seeds; 6 gate stations have no link), PM: GEH below 5 at 15 of 31 fitted (48%), 6 of 13 held-out (46%); bands 45% and 54%. These held-out stations were in the shipped fit, so this row is not out of sample. On the demand of the cross-validation fit (held-out stations excluded; `rockridge.assessment-validation.md`, ten seeds): fitted 17 of 31 (55%), held-out 1 of 13 (8%), mean GEH 5.5 against 14.6. AM: fitted 61%, held-out 46%; midday 68% and 69%. No period meets the 85% rule on the simulator's flows. The largest PM misses are the 52nd St off-ramp (604 against 1,278), Tunnel Rd outward (649 against 1,337), Market St/55th St north leg (321 against 816) and the Claremont/Clifton off-ramp (1,463 against 972); the simulator does not reproduce the fitted split between parallel ramps and arterials (drivers choose by cost; the ninth round found the same at the 52nd St ramp). Corridor ratios, PM (simulated over counted flow, 95% interval): Alcatraz Ave 0.92 (0.91 to 0.94), Claremont Ave 0.90, freeway ramps 1.02, Market St/55th St 0.68, San Pablo Ave 1.02, Tunnel Rd 0.63.

### Volumes implied by the ramp counts and the shares (DERIVED), PM

Arithmetic in `rockridge.fit.md`. Both readings of the ramp share's denominator (all ramp trips; trips from the north side, 87 to 89% of the ramp's offered trips) were computed: Hillegass Ave SB 139 to 156 veh/h (882 on-ramp veh/h x 12% / 68%), Colby St SB 140 to 157 (882 x 8% / 45%), Colby St NB 143 to 165 (972 off-ramp veh/h x 8% / 47%), Hillegass Ave NB 90 to 103 (972 x 5% / 47%). They are lower bounds if ramps other than Claremont feed the streets. Martin St and Benvenue Ave have a ramp share but no freeway share of their own traffic, so nothing is implied for them. The resident's observation (clearly more than about 100 veh/h on Hillegass Ave and Colby St in the PM peak) agrees with these figures. Modeled before the implied volumes entered the fit and after, in the static assignment (target, offered table, final): Hillegass SB 147, 71, 117; Hillegass NB 97, 68, 63; Colby SB 148, 6, 25; Colby NB 154, 14, 75. In the simulator, median mid-block flow (veh/h, PM): Hillegass Ave 57 N and 130 S, Colby St 32 N and 99 S, against 312 N and 397 S on College Ave. The soft constraint (weight 0.5) cannot reach the target on Colby St because almost no offered trip routes over it: the assignment keeps them on the arterials.

### Why Hillegass Ave is used so little against College Ave (route consistency)

`tools/route-consistency.ts`, PM seeds 1 to 3, flow-weighted delay per vehicle (time lost against the speed limit, stop and hump included) against what the router adds:

| Link group | Routing constant (s) | Simulated delay (s) |
| --- | --- | --- |
| local street, ends at a two-way stop (minor approach) | 5 | 19.6 |
| local street, ends at an all-way stop | 6 | 8.9 |
| local street, one hump, no control | 3 | 9.0 (4.2 without a hump) |
| arterial or collector, ends at a signal | 10 | 14.6 |

Travel time between Alcatraz Ave and Claremont Ave (free-flow, routing cost, simulated, s): Hillegass Ave NB 434 m, 39, 71, 82; Hillegass Ave SB 39, 71, 68; College Ave NB 205 m, 23, 33, 35; College Ave SB 23, 33, 45; Colby St NB 680 m, 61, 102, 101. College Ave is shorter between the same cross streets (205 m against 434 m), and the router and the simulator agree on the ratio (routing 71 / 33 = 2.2, simulated 82 / 35 = 2.3 northbound). So routing penalties do not make Hillegass Ave less attractive than the simulator makes it; the inconsistency runs the other way: at two-way stops on local streets the router assumes 5 s and the simulator imposes about 20 s, and at signals 10 s against 15 s. Raising the router constants to match would send even fewer drivers to the local streets, which is opposite to the residents' observation, and the delay depends on the conflicting flow, so a single constant would be a tuning knob and not a consistency fix. Nothing was changed. The simulator has no parking maneuvers, no bus stops (the bus kind was withdrawn) and no side friction on College Ave beyond the signals and crossing pedestrians, so College Ave is probably faster in the model than in life; that is untested. The local-street cost factor (1.25, ASSUMPTION) was swept in the PM peak, seeds 1 to 3, with the demand unchanged:

| Local factor | Hillegass N / S (veh/h) | Colby N / S | Headline shares | Removals per hour |
| --- | --- | --- | --- | --- |
| 1.25 (shipped) | 53 / 136 | 34 / 99 | 64 / 40 / 64 / 30 | 5.7 |
| 1.0 | 77 / 155 | 52 / 226 | 58 / 24 / 57 / 23 | 4.7 |
| 0.8 | 98 / 170 | 109 / 409 | 51 / 25 / 46 / 24 | 2.7 |

Against the implied volumes (97 / 147 and 154 / 148) the volume error is 41% at 1.25, 36% at 1.0 and 56% at 0.8 (Colby St SB overshoots), while the headline share error grows from 10.6 to 16.8 points at 1.0. No factor fits volumes and shares together; the demand fit also assumes 1.25 in its assignment, so a different factor would need a refit. The factor stays at 1.25 (ASSUMPTION). The resident's expectation that many drivers use Hillegass Ave as a bypass is not reproduced: 1.5% (1.3 to 1.8) of northbound and 3.3% (2.9 to 3.6) of southbound corridor trips use it for three or more blocks, and cut-through between the surface gates and the freeway is 2.7% and 2.6% of local vehicle-miles. What would raise it is demand that has those paths in the offered table (the origin-destination pairs of Berkeley trips), which the data do not give.

### Damped cost loop (D18)

`npm run cost-loop`: costs averaged by successive averages (weight 1/n) over seeds 1 to 10 (PM) and 1 to 3 (others), stop on a relative gap under 0.10. PM, ten seeds each (iteration 0 is the shipped demand with free-flow and BPR costs):

| Iteration | PM stable | Removals per hour | Seeds under 2% | Headline shares | Share error (points) | GEH below 5, fitted / held-out | Cost gap | Links within 1% |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | no | 3.40 | 5 | 65 / 39 / 65 / 30 | 10.9 | 48% / 46% | - | - |
| 1 | no | 2.50 | 4 | 64 / 42 / 82 / 58 | 12.2 | 65% / 38% | 0.270 | 76% |
| 2 | no | 3.20 | 10 | 67 / 39 / 74 / 53 | 10.4 | 55% / 46% | 0.150 | 80% |
| 3 | no | 5.70 | 2 | 65 / 46 / 76 / 56 | 9.5 | 65% / 31% | 0.082 | 83% |

The cost vector converged (relative gap 0.27, 0.15, 0.08; 76% to 83% of links within 1%), and the share error stayed between 9.5 and 12.2 points with no swing of the size seen in the ninth round (12.6, 9.9, 15.1), so the averaging damps the oscillation. Iteration 3 is 1.4 points better than iteration 0 on shares, which is under the noise of the share (intervals of 3 to 4 points) and comes with more removals. The loop does not make the PM peak stable: removals stay at 2.5 to 5.7 per hour and iteration 3 has the most. The keep rule (share error at least 0.5 points better, PM stable under D16, GEH shares within 5 points of iteration 0) is met by no iteration, so the demand without measured delays stays and the delays file was removed. A first version of the loop stopped at iteration 1 because it treated "not stable" as a reason to stop even when iteration 0 was not stable; it was fixed and resumed from the stored iterations (`--resume 1`).

### Calibration entry and verdict

Status `uncalibrated`: stability holds in AM and midday and fails in the PM peak; the PM headline shares fail (2 of 4 within 10 points); the simulator's fitted stations meet neither the GEH nor the band rule in any period. `experimentalPeriods` is the PM peak, `defaultPeriod` midday. The public note says that the evening peak still strands a few cars and that Hillegass Ave and Colby St carry fewer cars than residents report. The noise file `public/data/rockridge.noise.json` (36 KB, integers in 0.5 veh/h) is listed as `noise` in `areas.json`.

### What remains

- PM stability (mean removals 3.4 per hour, 5 of 10 seeds under 2% backlog). Part of it comes from the initial loading (1.7 per hour without it); where the removals sit was not traced this round.
- The simulator does not reproduce the fitted counts on the arterials and ramps (GEH below 5 at 48% of fitted stations in the PM peak, 8% to 46% of held-out ones): the split between parallel routes and the Market St/55th St and Tunnel Rd corridors.
- Colby St and Hillegass Ave volumes are 25% to 80% under the implied ones; the offered table has no trips that would use them. Needs an origin-destination source for trips from Berkeley to the freeway.
- Leave-one-corridor-out cross-validation was not run (one fit per corridor).
- Held-out and fitted figures depend on single-day or ADT-derived counts; the intervals show simulator noise only.


## Older rounds

The tenth round and everything before it (ninth to fourth, sixth, fifth, and the third-round history) are in `rockridge.record-archive.md`, moved unchanged.
