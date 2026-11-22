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

## Derived targets reported separately (2026-11-21)

Change `derived-targets-not-judged`. No round of demand fitting: the shipped model, its traffic figures and its proposals are unchanged. What changes is which stations the station rule judges, and the cross-validation demand that scores the held-out ones.

### Decisions (project lead, 2026-11-21)

- Targets that come from a daily total (a Caltrans AADT or a ramp ADT times assumed peak-hour and direction factors) are reported separately and are not judged. They stay in the fit as inputs.
- The same rule applies to every station of that kind: the 8 AADT stations (6 link stations, 2 gates) and the 16 ramp ADT stations make 24 targets. Of the 86 stations the frozen draw holds out, 13 are derived targets. They are never held out: they are in the fit in both views. The frozen split is not touched (its hash stays `be72380b485ec5fc`), so the rule is applied by the readers.
- The station rule keeps its thresholds (GEH below 5 at more than 85% of hourly counts, 10 or more recent held-out stations to judge). Only the scope changes.
- Publishing is authorized by the standing goal of 2026-11-21, because the shipped model's traffic figures are unchanged.

### Method

Candidate outputs came from the laptop on branch head `e644ed9` (simulator `6b886c8f52ee07397773ddd0ebbcb447`, 4:35 PM to 6:01 PM Pacific): step A checks, the membership loop (3,790 s against 3,777 s in round 52), the shipped and the training demand builds, `validate`, and two ten-seed assessments, seeds 1 to 10 and fresh seeds 11 to 20, as variant output sets. The archive (65 files, 10 gzip parts, 1,764,161 bytes) is on the development branch `salvatoret/peaceful-fermi-dlwt0u` at `f7ed0fe`, under `openspec/changes/derived-targets-not-judged/evidence/laptop-run/`; the cloud session verified every part and every file against `SHA256SUMS` and `FILES.txt`. Its summary tables are in the archived change's `evidence/laptop-run/`.

The seeds 1 to 10 set became the published assessment (`rockridge.assessment.md` and `reports/`). The fresh set is kept as `rockridge.assessment-derived-fresh.md`. The validation suite passes 67 of 74 cases and `validation.json` is the committed one apart from the revision.

### Identity checks

| Item | Published before | Now |
| --- | --- | --- |
| Network | `53c823f20d9165ed` | same |
| Shipped demand | `2d16d8f8eb0950ca` | same, byte for byte |
| Config, split, stations | `2405ff02c92b2837`, `be72380b485ec5fc`, `c9db41c930acf37d` | same |
| Proposals | `c5cbe25f39e61414` | same |
| Shipped membership | `56e688e7e5749d23` | same (see the folder-name note) |
| Cross-validation demand | `1c3b1666f24156f1` | `e1a9d4bd50539355` (the 6 AADT link stations, the 2 AADT gates and 5 held ramps join the training view; its `build` gains `withheld`) |
| Training membership | `cf32e3e0d9e6f23e` | `969794a26ac14f84` (evidence gains `withheld`; the 11 newly fitted stations have pairs) |
| Shipped-demand sections of the assessment (D16, route shares, whole-street traversals) | published | 0 diff lines |

The shipped fit report differs only in the held-out rule notes, plus the station rule lines of the three `rockridge.fit.stations-*.md` files (new scope, derived-target tally, old-scope line). The local copy of the cross-validation demand in the main checkout was the pre-round-52 file (`2f9ae152b9bbf78e`, dated 2026-11-19), so it was replaced from the archive; the published `1c3b1666f24156f1` was never in the checkout.

Folder-name note: the shipped membership file the laptop produced hashes `47036a6dd85eb760` only because six `source` strings name the worktree folder (`traffic-derived`) instead of `batch`. With the folder name set back it is byte-identical to the published `56e688e7e5749d23`, so the published file stays in place. The training membership file was kept as produced, so its `source` strings name `traffic-derived`, and `969794a26ac14f84` is the hash of that file. The build checks the evidence fields, not the `source` strings.

### Results: the station rule on both scopes

New scope: derived targets are set apart. Old scope: derived targets counted, on the side the frozen draw gives them. On the new cross-validation demand the derived targets are fitted, so their old-scope held-out figures are no longer out of sample; only the new scope is a verdict. Published = the round 52 assessment of 2026-11-21 on the previous cross-validation demand.

Seeds 1 to 10:

| Period | Published fitted | New scope fitted | Old scope fitted | Published held out | New scope held out | Old scope held out |
| --- | --- | --- | --- | --- | --- | --- |
| PM peak | 81 of 92 | 79 of 89 (89%), pass | 81 of 92 | 14 of 24 | 15 of 18 (83%), fails | 17 of 24 (71%) |
| AM peak | 72 of 77 | 72 of 77 (94%), pass | 72 of 77 | 15 of 19 | 15 of 19 (79%), fails | 15 of 19 (79%) |

Fresh seeds 11 to 20:

| Period | New scope fitted | Old scope fitted | New scope held out | Old scope held out |
| --- | --- | --- | --- | --- |
| PM peak | 80 of 89 (90%), pass | 82 of 92 | 15 of 18 (83%), fails | 17 of 24 (71%) |
| AM peak | 74 of 77 (96%), pass | 74 of 77 | 15 of 19 (79%), fails | 15 of 19 (79%) |

The held-out rule (over 85%) fails in both periods on both seed sets, so the status stays "Not calibrated". D16 holds. D5 holds on 4 of 4 shares within 10 points, mean error 3.8 points. Whole-street traversals pass 8 of 8. The validation suite passes 67 of 74.

Derived targets (not judged), GEH below 5 on the 22 link targets of each period, shipped demand and cross-validation demand: PM 16 and 14 of 22 on seeds 1 to 10, 15 and 14 of 22 on seeds 11 to 20; AM 13 and 15 of 22 on both sets; midday 18 of 22 on the shipped demand (no counts, so no cross-validation figure).

### Judged held-out misses (new scope, seeds 1 to 10; counted against cross-validation)

| Period | Station | Counted | Cross-validation |
| --- | --- | --- | --- |
| PM | McAuley St EB, Howell St to Canning St | 12 | 60 |
| PM | Canning St SB, 59th St to McAuley St | 49 | 13 |
| PM | 60th St EB, Howell St to Canning St | 23 | 57 |
| AM | McAuley St EB | 4 | 64 |
| AM | 60th St EB | 6 | 54 |
| AM | 58th St EB, Canning St to Vicente St | 7 | 42 |
| AM | 63rd St EB, Dana St to Canning St | 60 | 23 |

The six state counts on San Pablo Ave, Ashby Ave and Tunnel Rd that were PM held-out misses are derived targets now and are reported in their own table.

### Open item: MLK Jr Way on-ramp

The on-ramp at node 280 (Martin Luther King Jr Way) is a derived target and is not judged, but it moves a long way on the new cross-validation demand: PM 652 cars an hour against a target of 190 (shipped demand 258), AM 648 against 59 (shipped 306). Seeds 11 to 20 agree (PM 687, AM 633). The shipped model is already above target there (GEH 4.5 PM and 18.3 AM on seeds 1 to 10). Nothing is changed for it here; it needs a look at what the training view does at that ramp.

### Site text

`data/areas/rockridge.json` note and caveat are rewritten from the new assessment. The note (one sentence, at most 160 characters) reads: "Not calibrated: held-out hourly counts pass 15 of 18 in the PM and 15 of 19 in the AM (rule: over 85%); 24 daily-total targets are reported apart, not judged." The caveat gives PM fitted 79 of 89, AM fitted 72 of 77, the 24 derived targets and the judged misses. The Assumptions tab gains "Targets derived from daily totals" (24 rows). The `rockridge.assumptions.json` rebuilt here equals the laptop's apart from `generated`. The published proposals are not marked out of date (the shipped demand, network and simulator are the published ones).

## Fifty-third round: end-along targets and seeded pairs (fails the keep rule on the headline shares, not adopted) (2026-11-21)

Fails the keep rule on one line, the D5 headline shares (3 of 4 within 10 points, mean error 6.2 against 3.8), and the improvement test. Not adopted. The published model stays round 52: network 53c823f20d9165ed, demand 2d16d8f8eb0950ca, cross-validation demand 1c3b1666f24156f1, config 2405ff02c92b2837. Simulator fingerprint 6b886c8f52ee07397773ddd0ebbcb447 throughout. No user decision was involved. The change is archived with its evidence in `openspec/changes/archive/2026-11-21-calibration-round-53/` (laptop evidence commit 93899cf, run at 2fdd5f7). The numbers below come from the laptop's report and were checked against the evidence files.

### What was tried

PM Colby Street SB is the weakest line of the published model: about 75 cars an hour drive the whole street against 39 counted. The volunteer count says 43 of the 139 cars that enter at the top ended their trip along the street. Nothing in the fit used that figure. The change adds two switches, both off in the committed config. `simulatedMembership.endAlong` (weight `countFit.endAlong.weight` 2, an assumption) makes the cars that ended along each of the four runs (Hillegass Avenue and Colby Street, both directions) a fit target in PM and AM, from the same simulated block pairs as the shares. `countFit.endAlong.seedPairs` (design D8) seeds the missing pairs first.

The first design (constraint only) was checked in the container before any laptop run and could not bind southbound. In PM the pairs that use Colby Street SB and end at an interior node carried 0.3 cars an hour against 43 counted (Hillegass Avenue SB 1.7 against 40), because the fit scales pairs that exist and the seed table had none from the Alcatraz Avenue side. The lead chose seeding on the same change. The training view leaves out all four runs, because each has a held-out block on it, so the held-out rows of the keep rule could not move by design (candidate cross-validation demand periods equal the published ones).

### Hashes

- Baseline: network 53c823f20d9165ed, demand 2d16d8f8eb0950ca, cross-validation demand 1c3b1666f24156f1, config 2405ff02c92b2837, membership 56e688e7e5749d23 and cf32e3e0d9e6f23e.
- Candidate: config 19b6d2c3957f4f56 (`apply-candidate.py end-along`), network 53c823f20d9165ed (identical), demand a009d7bb4722a7c9, cross-validation demand afbe8635af49dc7f, membership shipped 87b61668bfa7781d and training 196188c75964afa8.
- Restore verified at 3:11 PM: demand 2d16d8f8eb0950ca, cross-validation demand 1c3b1666f24156f1, config 2405ff02c92b2837, membership files back.
- The committed `data/demand/rockridge.config.json` has no `endAlong` or `seedPairs` key; the candidate lives in the change folder only.

### Run

Laptop, 1:24 to 3:11 PM Pacific. The gate rebuild (`npm run data`, 1,024 s) reproduced the baseline hashes. The loop took 3,969 s and exited 0 after passes 0, 1 and 2 and the final build (`loop.txt` numbers the builds 0 to 3), with the abort and the early stop silent. The report-only warning fired once: offered car demand in the final shipped PM build is 89.9% of the static fit (10.1% below). Offered share of the static fit, shipped PM / AM: pass 1 89.2 / 93.1, pass 2 90.2 / 92.6, final 89.9 / 92.6; training PM / AM final 90.5 / 92.9. All four end-along lines read `simulated` in both periods from pass 1.

Seeding added, cars an hour (before, added, after, pairs from origins): PM Hillegass Avenue SB 4.7, 38.8, 40.0, 36 from 13; PM Colby Street SB 3.2, 46.0, 43.0, 99 from 25; AM Hillegass Avenue SB 3.1, 6.4, 9.0, 56 from 20; AM Colby Street SB 2.7, 14.9, 15.0, 622 from 130. The northbound runs were already above their figures and got no pairs.

### Screen, three seeds

Baseline to candidate: PM fitted 82 to 81 of 92, PM held out 12 to 12 of 24, AM fitted 72 to 72 of 77, AM held out 14 to 14 of 19. No car cleared from gridlock in the judged zone. Backlog under 2% in 3 of 3 seeds in both periods (AM mean 0.43% to 0.30%, PM 1.13% to 1.22%). Passed.

### Keep rule, ten seeds

| Line | Line to meet | Baseline | Candidate | Result |
| --- | --- | --- | --- | --- |
| PM fitted | 81 | 81 of 92 | 81 of 92 | pass |
| PM held out | 14 | 14 of 24 | 14 of 24 | pass |
| AM fitted | 72 | 72 of 77 | 72 of 77 | pass |
| AM held out | 15 | 15 of 19 | 15 of 19 | pass |
| D5 headline shares | 4 of 4 | 4 (mean error 3.8) | 3 of 4 (mean error 6.2) | fail |
| Whole-street traversals | 8 of 8 | 8 | 8 of 8 | pass |
| D16 stability | holds | holds | holds in all three periods | pass |
| Validation suite | 67 of 74 | 67 | 67 of 74 | pass |

D5 detail, PM, observed against modeled, baseline to candidate: Hillegass Avenue NB from the freeway 47, 51.2 to 44.6; Colby Street NB from the freeway 47, 48.0 to 46.3; Hillegass Avenue SB to the freeway 68, 60.0 to 53.5 (-14.5, fails); Colby Street SB to the freeway 45, 42.8 to 37.7 (-7.3, holds).

Whole street, cars an hour, observed, baseline, candidate: PM Hillegass Avenue NB 48, 56, 57; PM Colby Street NB 102, 86, 81; PM Hillegass Avenue SB 79, 78, 74; PM Colby Street SB 39, 75, 63 (GEH 3.3); AM Hillegass Avenue NB 34, 39, 38; AM Colby Street NB 33, 42, 43; AM Hillegass Avenue SB 36, 30, 35; AM Colby Street SB 46, 39, 32. All eight are inside GEH 5 for the candidate.

### Improvement test, seeds 1 to 10

PM Colby Street SB whole-street traversals fell from 74.5 to 62.6 cars an hour, a fall of 11.9 against the 15 required (counted 39). The fresh-seed confirmation (seeds 11 to 20) and the proposal search did not run, as the runbook says when the keep rule fails.

### End-along figures, simulated

Trips that ended along the street, ten-seed mean, cars an hour, baseline to candidate (target): PM Hillegass Avenue NB 40.2 to 18.6 (15); PM Colby Street NB 46.3 to 34.5 (29); PM Hillegass Avenue SB 3.3 to 41.4 (40); PM Colby Street SB 0.0 to 56.7 (43); AM Hillegass Avenue NB 20.2 to 11.6 (9); AM Colby Street NB 55.7 to 20.9 (14); AM Hillegass Avenue SB 7.1 to 9.7 (9); AM Colby Street SB 2.2 to 13.1 (15). All eight moved to or near their targets, and the southbound ones from zero. The seeded trips end along the street, so none of them reaches the freeway.

### Shares in the simulator

PM, ten-seed means, cars an hour on the southbound runs, baseline to candidate:

| Block | All trips on the run | To the freeway | Not to the freeway | Share to the freeway |
| --- | --- | --- | --- | --- |
| Hillegass Avenue SB | 197.1 to 219.9 | 118.0 to 118.1 | 79.1 to 101.8 | 60.0% to 53.5% |
| Colby Street SB | 220.5 to 260.6 | 94.0 to 97.8 | 126.5 to 162.8 | 42.8% to 37.7% |

### Reported lists

Baseline to candidate, shipped view, ten seeds. These are reported, not conditions; the full tables are in `evidence/reported/`.

- Offered car demand, veh/h: PM 24,760 to 24,874; AM 21,511 to 21,508. The training demand is unchanged.
- Diagonal stations, PM, counted 178: simulated sum 349 to 384 (Forest St EB 102 to 113, McAuley St EB 60 to 73, 60th St EB 61 to 66, Ayala Ave NB 64 to 68, Howell St SB 63 to 64). AM, counted 110: 167 to 184.
- Colby St NB blocks, simulated over counted: PM 0.82 to 0.78; AM 0.76 to 0.71.
- Through cars in the study area, per hour: PM 786 to 774; AM 394 to 402.
- Flips among recent stations: PM McAuley St EB (link 1935) pass to fail, PM Howell St NB (link 2056) fail to pass; AM Colby St SB (link 2592) pass to fail, AM Canning St SB (link 1903) fail to pass.
- SR-24 mainline, PM: node 602 entry offered 3,942 to 3,938, flow 3,751 to 3,733, trips waiting 170 to 177; node 675 exit flow 3,729 to 3,693; node 1726 exit 682 to 686. AM: node 602 waiting 3 to 7; node 675 3,079 to 3,115.
- SR-24 ramps: no ramp moved by more than 53 veh/h in either period (PM largest: MLK Jr Way on-ramp 1,440 to 1,396 and the node 702 off-ramp 727 to 691; AM largest: node 280 on-ramp 306 to 253 and MLK Jr Way on-ramp 922 to 969). The lists are in `evidence/reported/compare.md`.
- Travel times inside the observed range: 6 of 12 to 5 of 12 (AM Shattuck Ave SB 191 to 224 s, now too slow).
- Trips waiting, all origins: PM 262 to 270; AM 62 to 50.

### Deviations on the laptop

None changed code or scripts (`git diff 88965b2 93899cf` over `tools`, the change's `scripts` and `runbook.md` is empty).

- The morning's restamp loop folder was moved to `target/restamp52-loop`, because `target/r52-loop` already holds round 52's loop.
- `pass0-check.txt` reads `false` for pass 0 against `demand.base*.json`. The runbook's comparison dates from round 52, when the baseline was a static build; now the baseline is the published simulated-membership model, so pass 0 cannot equal it. Pass 0 equals the restamp's pass 0 (the static build of the committed config) in both views, and the final training demand's periods equal the published cross-validation demand's. Only the `build` stamp differs, which carries the config hash.
- The baseline per-seed directories are `target/assess-seeds/60` and `60-cv`, from the restamp's `assess --publish`.

The evidence README lists a `build-logs/` folder that is not in the commit; the figures it would hold are in `loop.txt`, `seeding.md` and `fit/`.

### Verdict

Fails the keep rule on D5 (3 of 4) and the improvement test (fall of 11.9 against 15). Not adopted. The code stays on main with both switches off, and the committed config has neither key. The published data are unchanged.

### Lead for round 54

Question: why did the Hillegass Avenue SB to-freeway share fall from 60.0% to 53.5% when the fit was asked to hold it at 68? Everything below is from the evidence files of this round; the committed baseline fit report is `data/demand/rockridge.fit.stations-pm_peak.md`.

(a) Block volume, PM. The share table's denominator is the number of trips on any link of the run (Hillegass Avenue SB 197.1 to 219.9, Colby Street SB 220.5 to 260.6), which no count measures. The counts are per link, so the comparison is per link, mean over the run's links:

| Run (links) | Counted | Fit, final, baseline to candidate | Simulated, ten seeds, baseline to candidate |
| --- | --- | --- | --- |
| Hillegass Avenue SB (2669, 2671, 2673, 2675) | 178, 168, 151, 152; mean 162.3 | 145, 133, 120, 112 (127.5) to 160, 132, 132, 106 (132.5) | 157.6, 141.9, 127.1, 116.9 (135.9) to 172.8, 144.1, 143.6, 113.5 (143.5) |
| Colby Street SB (2606, 2602, 2600, 2598, 2596, 2594, 2592) | 139, 156, 162, 160, 159, 170, 162; mean 158.3 | 102, 121, 119, 98, 120, 138, 126 (117.7) to 135, 142, 141, 122, 148, 143, 108 (134.1) | 120.2, 135.7, 138.3, 112.9, 142.8, 159.3, 151.1 (137.2) to 156.2, 157.4, 163.1, 138.8, 174.8, 172.2, 137.2 (157.1) |

The fit did not hold the block count. In the baseline fit the blocks sit 21% (Hillegass Avenue SB) and 26% (Colby Street SB) under their counts; the candidate's sit 18% and 15% under, so the fit raised them (Hillegass Avenue SB +5.0 on the mean, Colby Street SB +16.4). The simulator then sits above the fit by about the same margin in both models (Hillegass Avenue SB +8.4 baseline, +11.0 candidate; Colby Street SB +19.5, +23.0). On Hillegass Avenue SB the simulated blocks stay 19 below their counts on average, so the block is not over its count. On Colby Street SB the simulated mean (157.1) is at the count (158.3), with blocks 2606 (+17) and 2596 (+16) above theirs. What grew is the trips on the run, not the freeway trips: Hillegass Avenue SB trips ending along the street rose 38.1 (3.3 to 41.4), the run's trips rose 22.8, and the non-freeway trips rose 22.7, so the other non-freeway trips fell by about 15 while the to-freeway trips stayed at 118. The margin D5 allowed was small: with 118.1 to-freeway trips the share stays at or above 58% only while the run carries at most 203.6 trips, 6.5 above the baseline's 197.1. Seeding added 22.8. A matching cut of the non-freeway trips back to 197.1 would restore 59.9%, the baseline; reaching 68% would need the run to carry 173.7 (a cut of 46).

(b) The share constraint in the fit, PM (target 68 and 45; fit value on simulated membership, static routes in brackets; offered before the fit; flows):

| Pass | Hillegass Avenue SB to the freeway | Colby Street SB to the freeway |
| --- | --- | --- |
| 1 | 64 (59), offered 72, 287 flows | 43 (50), offered 73, 663 flows |
| 2 | 62 (60), offered 71, 370 flows | 42 (53), offered 71, 812 flows |
| Final | 61 (62), offered 71, 418 flows | 42 (52), offered 70, 878 flows |
| Baseline fit (round 52) | 64 (68), offered 81, 343 flows | 47 (61), offered 78, 779 flows |

The fit did not think it met the share. Its own final value is 61% against 68 (7 under) and 42% against 45 (3 under). Hillegass Avenue SB started the fit near target (offered 71) and the other terms pulled it to 61; the evidence does not say which terms. The simulator then fell 7.5 points below the fit (53.5 against 61) where the baseline fell 4.0 below (60.0 against 64). On Colby Street SB the gap is 4.3 (37.7 against 42) and was 4.2 in the baseline (42.8 against 47). Against the baseline, the fit's Hillegass Avenue SB value fell 3 points (64 to 61) and the simulated share fell 6.5 (60.0 to 53.5).

(c) Movement between passes. Yes, the figures still moved, in the wrong direction for the share. The Hillegass Avenue SB share fell 64, 62, 61 as its simulated pairs grew from 287 to 418, the Colby Street SB share held at 43, 42, 42. The fit's end-along figure for Hillegass Avenue SB (target 40) read 38.3, 37.5, 36.2 and for Colby Street SB (target 43) 49.9, 52.5, 51.9. The Colby Street SB whole-street fit value (target 39) rose 44, 47, 49 and the Hillegass Avenue SB one (target 79) read 89, 71, 68. Seeded pairs are simulated only from pass 1, so the membership had two passes of feedback. The evidence shows no sign of the share stabilizing at 68 or the whole-street value moving toward 39 by pass 3; it does not show where they would settle, because no fourth pass ran.

Candidate next steps, to be judged against the above and not built here:

- More loop passes with seeding. The share fell 2 points, then 1, and the fit's whole-street value for Colby Street SB rose each pass. Nothing in this run says a fourth or fifth pass turns either. The loop took 3,969 s for passes 0 to 2 and the final builds.
- A higher share weight (now 3). The fit's own value missed by 7, and the simulator then fell a further 7.5 below it, so reaching 68 in the simulator would need the fit well above 68 if the 7.5 gap holds. The block volumes in the fit are already 18% under their counts, and the shares can only be raised there by removing the non-freeway trips, so the block-count GEH would be the cost. Not tested.
- Seeding with a matching reduction of the non-freeway whole-street pairs. By the arithmetic in (a), cutting the Hillegass Avenue SB run back to the baseline's 197.1 trips restores 59.9%, which passes D5 (58% or more), and 68% would need the run at 173.7 trips. The end-along trips are non-freeway by construction and the other non-freeway trips on the run already fell by about 15 in this round. The evidence does not say whether a further cut could be made without taking the end-along figures or the whole-street figure of Colby Street SB the wrong way; the whole-street fall was 11.9 against the 15 required.

## Audit of the missed count locations and imagery survey (2026-11-18/19)

Read-only: no code, data or network was changed, and the published network 53c823f20d9165ed, demand 9cdebdabf05c4460 and cross-validation demand 2f9ae152b9bbf78e stand.

### Method limit

Ten-seed values per station are not stored for the published build, so the audit used one seed (seed 1, 60 min, shipped demand for fitted stations, cross-validation demand for held-out ones). One seed gives PM fitted 70/92, PM held out 14/24, AM fitted 66/77 and AM held out 14/19, against the ten-seed 74/92, 14/24, 70/77 and 14/19. Counts are therefore good to about 3 stations, and a station at single-seed GEH 5.0 to 6.5 is borderline. About 4 of the 22 single-seed PM fitted misses pass on the ten-seed mean. Rebuilding the network from `data/osm` and `data/areas/rockridge.json` reproduces the published hash.

### Where the misses cluster

- The diagonal Telegraph Ave, McAuley St or 60th St, Ayala Ave or Howell St, Forest St, Claremont Ave. The demand fit matches the counts there, but the simulation carries 2 to 5 times the count.
- Links no trip uses: Dana St southbound and Canning St northbound.
- 62nd St and 63rd St eastbound between Hillegass Ave and Colby St.
- The Caldecott Lane on-ramp.

### Coding issue found

One Caltrans on-ramp row at Caldecott Lane is split 50/50 over two ramps, although a turn ban sends the flow to one of them. Correcting it could flip at most one station. Not changed.

### Held-out gate targets

Six of the ten PM held-out misses are gate targets derived from annual average daily traffic (San Pablo Ave, Tunnel Rd, Ashby Ave), not hourly counts. No correction to the network can fix those.

### Checked and clean

- Direction labels of all 136 volunteer block stations agree with the bearing of the mapped link (largest error under 50 degrees; none flipped).
- Count transcription: in versus out at fully counted junctions agrees within 16 veh/h at all but one PM node (Canning St at 59th St, 46, a known missing southbound label) and one AM node (25). No swapped or mistyped digits at the failing stations. The Dana St labels are right: swapping them would raise the imbalance at 63rd St and Dana St from 14 to 46.
- OSM tags against the network: speed limit, lanes, one-way and class match for every way in the study area. Seven OSM stop nodes are not attributed, all far west of the area. Of 37 restriction relations that do not resolve, the only one inside the area is Telegraph Ave to 58th St, no left turn 7 to 9 AM.
- No barrier, access or motor_vehicle=no tag on any node or way in the area. The barricades seen in imagery are not in OSM.

### Imagery survey

Street-level imagery, undated; traffic-control facts only.

- No stop sign at Howell St and McAuley St, Ayala Ave and McAuley St, Ayala Ave and Howell St, Howell St and 59th St, 60th St and Howell St, or Martin St, Hermann St and 58th St. None is missing from the model at these seven junctions. Ayala Ave and Martin St is unresolved: no sign legible in the one frame, and the model stops Martin St.
- Telegraph Ave and McAuley St: stop sign on McAuley St; no median and no turn restriction on Telegraph Ave. Telegraph Ave and 60th St: stop bars on both 60th St approaches; no median. Both match the model.
- No hump signs or markings on Howell St, McAuley St, 60th St, Forest St or Ayala Ave between Martin St and McAuley St. Confidence is low to medium (40 m sampling gap, shadows, some washed-out frames).
- Forest St and Claremont Ave: signal heads on all four legs; temporary utility work and a temporary no-left-turn sign on Claremont Ave. Confidence on turn rules is low.
- A "road closed to thru traffic" barricade across Forest St at Ayala Ave in one undated frame. A similar object near the Howell St and Ayala Ave corner is low confidence.

The project lead stated on 2026-11-18 that the Forest St and Ayala Ave barricade is gone. It is not coded.

### Verdict

The remaining misses point to route choice in the simulation disagreeing with the fit's static assignment, not to data errors. Reaching 79 of 92 PM fitted stations is not attainable from the data corrections found so far.

### Open items

- Resolved: the Forest St and Ayala Ave barricade is gone; removed from the field-check list.
- Field checks still open: the Howell St and Ayala Ave barricade (low confidence), the Forest St signal timing, and the stop signs at Hillegass Ave and 61st St and at Canning St and 62nd St.
- To decide: the Caldecott Lane on-ramp pairing, and the held-out gate targets derived from annual average daily traffic.

## Development-branch commit hashes after re-signing (2026-11-20)

The laptop evidence commits of rounds 48 to 52 on the development branch were made unsigned while commit signing was unavailable. On 2026-11-20 they were re-signed at the project lead's request: 19 commits were rebuilt with the same trees, messages, authors and dates, so only their hashes changed (branch head be03fbb became 3ddf1b4). The hashes cited in this record and in the archived designs and evidence READMEs of those rounds now name the re-signed commits. As-run outputs keep the hash they ran at: evidence logs, assessment reports, the proposals report, and the simulator revision in `validation.json` (ad48d3e9, now dd87d88, the same tree). Nothing on `main` or in the published data changed. The four laptop commits of 2026-11-21 on the development branch (dd0be1e, 16d66ef, 8f5ee49, 170d280) are unsigned because signing timed out; they are not re-signed, and their parts live on that branch, not on `main`.

## Published set regenerated on the faster simulator (2026-11-21)

Commit `1e6b825` (`perf(sim): speed up routing and fixed-step traffic updates`) changed the simulator fingerprint from `d45a275dd7be0713cec6a64394b7d8a9` to `6b886c8f52ee07397773ddd0ebbcb447`. Its equivalence evidence covered PM-hour runs (native seeds 1 to 5, WASM seeds 1 to 3) and fixtures. The deployed app ran the new WASM while the files published on 2026-11-20 carried the old fingerprint, so the site marked proposals out of date, showed the Assumptions cards without maps or counts, and ignored stored results and redistribution. A local `npm run data` would have used static membership without saying so, since the membership evidence includes the fingerprint and the only trace was a line in the fit report. Change `restamp-round-52` (`openspec/changes/archive/2026-11-21-restamp-round-52/`, evidence in its `evidence/`) records the decision. The model is the one of the Fifty-second round, so the rule set by the project lead was that every number must come out identical; only the fingerprint, revision and dates may differ.

The laptop reran the chain on the new simulator on 2026-11-21:

- Membership loop: the intermediate demands are byte-identical to round 52's. The membership files differ only in `evidence.simulator` (shipped `56e688e7e5749d23`, was `3d639670c1feb38f`; training `cf32e3e0d9e6f23e`, was `c1cd4ce96fb28791`).
- `npm run data`: network `53c823f20d9165ed`, demand `2d16d8f8eb0950ca` and cross-validation demand `1c3b1666f24156f1`, all unchanged.
- `validate`: 67 of 74 cases pass. `assess --publish --noise`: identical apart from stamps; the noise file `4d6850cccc2f43e8` is byte-identical.
- Proposal search with round 52's flags and seeding: the same options and figures. The proposals file is `c5cbe25f39e61414` (was `197a99cdafc026f8`); only `computed.date`, `computed.simulator` and `computed.sourceRevision` differ. The seeds file stays as committed (`e464cc90ca3e1472`); the rerun's copy differed only in dates.
- Redistribution, results, assumptions, text pages and preview cards were regenerated.

| Comparison with the 69 published files | Files |
| --- | --- |
| Byte-identical | 22 |
| Differ only in stamps (fingerprint, revision, dates) | 44 |
| Differ in content, no figure changed | 3 |

The three: `redistribution/rockridge/unconstrained.p1.json` and `unconstrained.p3.json` (9 drawn sample paths; counts, per-hour figures, shares and labels are identical; the tool kept the sample of whichever seed finished first, fixed afterwards in `aef1f46`, change `deterministic-redistribution-sample`) and `areas.json` (gains the `noise` pointer that `tools/import-osm.ts` writes when the noise file exists; no app code reads it). The laptop stopped on these three, as the rule required, and the project lead accepted them because no figure differs.

| Step | Seconds on the faster simulator (round 52) |
| --- | --- |
| Membership loop (mostly demand builds, which did not change) | 3,777 (3,992) |
| `npm run data` | 1,017 |
| `validate` | 18 |
| `assess --publish --noise` | 70 (148) |
| Proposal search | 2,736 (5,606) |
| Redistribution | 266 (567) |
| Results | 66 (140) |
| One single-seed `calibrate` run, PM peak / AM peak / midday | 15.4 (30.3) / 11.1 (22.2) / 7.2 (15.0) |

The cloud session published on 2026-11-21 at about 10:55 AM Pacific: checksums verified, 1,106 TypeScript tests passed, `data:push`, and the live site read back proposals `c5cbe25f39e61414` and no longer shows "out of date" on the Proposals or Assumptions tabs. Main carries `e762a47` (republish) and `aef1f46` (sample fix).

Left as is: `data/demand/rockridge.control-delays*.json` (round 44) still carry the old fingerprint. The config has no `controlDelays` entry, so the build never reads them.

Follow-up: the demand build now exits with the differing evidence fields when a membership file exists and does not match, instead of falling back to static membership. `data/README.md`, "When the simulator fingerprint changes", lists the rerun order.

## Fifty-second round: whole-street counts weighted by the blocks they span, ceilings outside the study area only (passes the keep rule and the fresh-seed confirmation; adopted and published 2026-11-20)

Passes the screen and every line of the keep rule on seeds 1 to 10, and the fresh-seed confirmation on seeds 11 to 20 (the candidate is no worse than the baseline on every line). At the time of the verdict, adoption was pending the project lead's review, and the published network 53c823f20d9165ed, demand 9cdebdabf05c4460 and cross-validation demand 2f9ae152b9bbf78e stood. The model status stays "Not calibrated". Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9 throughout. Nothing under `data/` or `public/data/` changed at the verdict apart from this record. The evidence is in `openspec/changes/archive/2026-11-20-calibration-round-52/evidence/` (laptop commit 39d92df on the development branch, unsigned; the merge commit 8e1dcdd is also unsigned). The numbers below come from the laptop's final report, its pass-1 note and its read-only breakdown of round 51's Colby St SB blocks. The candidate's two membership files were sent as gzip parts on the development branch only (39d92df) and are not on main. A proposal search on the candidate then ran on the laptop (below).

Adopted and published on 2026-11-20 after the project lead's decision. The sections at the end of this entry record the staged proposal search, the decision and the publish; the verdict is as of 2026-11-19, before that decision.

### Why

Round 51 failed its fresh-seed confirmation on one line: PM Colby St southbound whole-street, 78 cars an hour modeled against 39 counted (GEH 5.0). The whole-street counts were already fit targets in that round. The fit ended at 67 against 39 for that route, and the seven Colby St SB blocks ended 20 to 34% under their counts (111, 126, 128, 106, 126, 132 and 120 against 139 to 170). So the fit was not satisfying both, and the blocks won.

The laptop's read-only breakdown of round 51's saved candidate (30 pooled runs, shipped PM, Colby St SB) shows why:

- About 64 of each block's 101 to 126 cars an hour (flow times simulated membership) are trips that drive the whole street. Pairs with no whole-street trip carry only 16 to 35 cars an hour on a block.
- 488 origin-destination pairs have a hit on the route or on a block. 162 of them have a whole-street hit, and together they carry 3,512 cars an hour of final demand.
- Pinned via-flows, which the fit cannot change, carry 15.0 of the route's 63.7 cars an hour.
- Round 51's node ceilings (scope `allNodes`) had stopped the fit from adding trip ends inside the study area: non-gate origins inside went from 951 to 727 and destinations from 734 to 451 in the shipped PM view. Partial-street trips could only come from re-weighting pairs that already exist.

| Block (PM, SB) | Round 51 final fit | Flow times membership | Whole-street trips | Pairs with no whole-street hit |
| --- | --- | --- | --- | --- |
| 2606 | 111 | 107.1 | 63.7 | 16.5 |
| 2602 | 126 | 118.9 | 63.7 | 26.5 |
| 2600 | 128 | 124.8 | 63.7 | 34.9 |
| 2598 | 106 | 101.5 | 63.7 | 16.3 |
| 2596 | 126 | 123.6 | 63.7 | 29.4 |
| 2594 | 132 | 126.1 | 63.7 | 34.3 |
| 2592 | 120 | 111.3 | 63.7 | 28.8 |

Flow times membership reproduces the fit report's final volumes to within 3 to 9 cars an hour on every block (route 63.7 against 67 in the report). One question the breakdown could not answer: how many flows sit at the fit's lower or upper factor bound, which needs the pre-fit table (the fit report gives only aggregates, PM 4,559 at the lower bound and 475 at the upper of 8,287).

### What was tried

The candidate changes two things from round 51 and keeps the rest.

- Route weight per block (`routeWeightPerBlock`, new sub-switch under `simulatedMembership`): where a whole-street route's membership is simulated, its station weight is `routeWeight` times the number of blocks it spans. In every build from pass 1, in both peaks, that was 7 on the two Colby St routes and 4 on the two Hillegass Ave routes. Pass 0 and midday stay at weight 1. The weight is an assumption with no reference: it makes one traversal count as much as the blocks it spans.
- Ceiling scope `outsideStudyArea`: the node ceilings (`gatePriorTotals`, static-fit anchor, tolerance 0, weight 10, hard projection) apply to gates and to non-gate nodes outside the study area only. Nodes inside the study area are free to grow. That left 1,878 ceiling stations in the shipped PM build against round 51's roughly 2,000.
- Unchanged from round 51: simulated membership for the station counts, the select-link shares (`shares`) and the through targets (`throughTargets`, which still has no through-car target in the shipped config), the 5-trip prior, and the loop.

All sub-switches are off by default and the shipped config has neither `gatePriorTotals` nor `simulatedMembership`. The candidate config adds one entry (sha256 2405ff02c92b2837, 17 inserted lines in 2 blocks) with `scope` `outsideStudyArea` and `throughTargets`, `shares` and `routeWeightPerBlock` true.

Rules written before the run:

- The keep rule and the screen are unchanged from round 50 and 51.
- The low-demand figure (a final build offering more than 10% fewer car veh/h than the static fit) is reported only. It is not a stop in this round. Round 51's stop showed that it asks for a decision and does not fail a candidate. The loop's 3% abort above the static fit stays.
- The fresh-seed confirmation runs automatically if the keep rule passes: on seeds 11 to 20 the candidate must be no worse than the baseline on every keep-rule line computed on the same seeds. It confirms on independent seeds and does not replace the keep rule.

The run on the project lead's laptop session went from 9:59 PM to 11:43 PM PST: the loop 10:09 to 11:16 PM (3,992 s), the keep decision 11:20 PM, the confirmation 11:29 to 11:43 PM. Every step exited 0.

### Hashes

- Baseline: network 53c823f20d9165ed, shipped demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e. Fingerprint d45a275dd7be0713cec6a64394b7d8a9. Nothing under `data/` changed at the gate. Vitest 80 of 80.
- Candidate: config 2405ff02c92b2837. Network 53c823f20d9165ed (identical), shipped demand 2d16d8f8eb0950ca, cross-validation demand 1c3b1666f24156f1; membership files shipped 3d639670c1feb38f and training c1cd4ce96fb28791. The stations file is identical.
- Pass 0 periods equal the baseline in both views.
- Dry run as expected. Shipped: PM 337 stations with pairs (245 link, 92 movement or route), AM 272 (200, 72), 6 static. Training: PM 256 (187, 69) with 87 withheld, AM 201 (148, 53) with 77 withheld. The split withholds 91.
- After each run the baseline was restored and checked: 53c823f20d9165ed, 9cdebdabf05c4460 and 2f9ae152b9bbf78e, config 505dd0f032fc7ae8, clean status. Round 51's loop folders were moved aside, not deleted.

### Loop behavior

Offered car demand in veh/h, with its share of the static fit. Below the pass figure, the change in flow and in membership per station as a ratio to its seed standard error (flow / membership).

| Pass | Shipped PM | Shipped AM | Training PM | Training AM |
| --- | --- | --- | --- | --- |
| 0 | 27612 | 23204 | 25044 | 20584 |
| 1 | 24637 (89.2%); 3.65 / 3.33 | 21575 (93.0%); 3.92 / 2.57 | 22912 (91.5%); 3.57 / 3.01 | 19194 (93.3%); 3.40 / 2.69 |
| 2 | 24888 (90.1%); 1.46 / 1.84 | 21536 (92.8%); 1.40 / 1.43 | 22760 (90.9%); 1.56 / 1.56 | 19085 (92.7%); 2.51 / 1.71 |
| Final | 24759 (89.7%) | 21510 (92.7%) | 22659 (90.5%) | 19123 (92.9%) |

The loop ran passes 0, 1 and 2 and the final build. No abort: the highest offered figure was 93.3% of the static fit. The early stop did not fire, since the pass-2 ratios were 1.40 to 2.51. Stations with pairs were the same in every pass: shipped PM 335 of 337, AM 271 of 272, training 256 of 256 and 201 of 201, and no exported station was left out. Zero-hit stations in the shipped view: PM sr24-clifton-claremont (1600 against a flow of 1771) and telegraph-51st (1629 against 1764); AM telegraph-51st.

Low-demand figure, reported only: the final shipped PM build offers 10.3% below the static fit (24,759 of 27,609 veh/h). Every other view and period is within 10%.

### Ceiling lines per build

Ceiling stations (gate plus non-gate) were 1,878 in shipped PM, 1,923 in shipped AM, 1,846 in training PM and 1,909 in training AM. Above ceiling after the projection, final builds:

| Build (final) | Gate / non-gate stations | Above ceiling | Cut by projection (gate / non-gate) | Within tolerance |
| --- | --- | --- | --- | --- |
| Shipped PM | 216 / 1662 | 0 | 172 (117 / 56) | 175 to 169 of 343 |
| Shipped AM | 217 / 1706 | 1 (excess 2) | 97 (58 / 38) | 149 to 147 of 278 |
| Training PM | 222 / 1624 | 1 (excess 1) | 240 (199 / 41) | 139 to 132 of 260 |
| Training AM | 223 / 1686 | 1 (excess 3) | 62 (42 / 20) | 111 to 111 of 205 |

The above-ceiling rows are gate 602 origin in AM (3658.4 shipped and 3657.2 training against a ceiling of 3655.7) and node 1674 destination in PM training (903.4 against 902.9). All are inside the projection's 0.1% tolerance. Pass 1 had none above in any build.

Offered car veh/h, static fit to final, by flow type:

| Build (final) | Through | Local | Ramp |
| --- | --- | --- | --- |
| Shipped PM | 5907 to 4996 | 10360 to 8454 | 11342 to 11310 |
| Shipped AM | 3745 to 3517 | 9586 to 8226 | 9871 to 9767 |
| Training PM | 2785 to 2744 | 10873 to 8540 | 11384 to 11375 |
| Training AM | 2455 to 2356 | 8314 to 6966 | 9813 to 9801 |

#### Non-gate trip ends

Final builds, veh/h, static fit to final, split by the network's study-area flag.

| View, period | Origins inside | Origins outside | Destinations inside | Destinations outside |
| --- | --- | --- | --- | --- |
| Shipped PM | 951 to 794 | 9523 to 8040 | 734 to 614 | 7901 to 6256 |
| Shipped AM | 612 to 752 | 7488 to 6286 | 528 to 489 | 8211 to 6953 |
| Training PM | 1387 to 1173 | 8768 to 7372 | 881 to 763 | 6740 to 5138 |
| Training AM | 1040 to 1213 | 7095 to 5882 | 735 to 765 | 5907 to 4773 |

Inside nodes that grew, origins / destinations: shipped PM 12 of 57 / 14 of 56, shipped AM 19 of 56 / 14 of 55, training PM 12 of 57 / 17 of 56, training AM 23 of 57 / 17 of 56. Outside the study area, no group rose in any build, and the all-gate totals fell (PM origins 17915 to 16704 and destinations 20171 to 19086; AM 16254 to 15622 and 15229 to 14832). The only rises are at the 2 gates counted in one direction, which have no ceiling on the counted side (PM +50 and +22, AM +60 and +14). Inside the study area the freed nodes did not take much: PM trip ends inside fell in both views, and in AM only the origins rose in both views (shipped 612 to 752, training 1040 to 1213) and the training destinations (735 to 765). The worst-cut nodes were gate 602 inward in PM (31 shipped, 71 training), 1756 outward (14), 1398 inward (10) and 1219 College Ave (7), and in AM 1672 Warren Fwy inward (11). The lists are in `evidence/nodes-*.md`.

### Route fit by pass

The fit's own values for the four whole-street routes in each peak. Each cell is after the count-only fit / final, as the fit report prints them, in cars per hour, against the observed target.

| Route | Target | Pass 0 | Pass 1 | Pass 2 | Final |
| --- | --- | --- | --- | --- | --- |
| PM Colby St SB | 39 | 67 / 45 | 45 / 53 | 47 / 55 | 49 / 56 |
| PM Colby St NB | 102 | 100 / 101 | 101 / 101 | 102 / 101 | 100 / 100 |
| PM Hillegass Ave SB | 79 | 76 / 54 | 78 / 92 | 75 / 71 | 71 / 67 |
| PM Hillegass Ave NB | 48 | 33 / 32 | 46 / 48 | 52 / 51 | 52 / 52 |
| AM Colby St SB | 46 | 53 / 52 | 47 / 45 | 45 / 43 | 44 / 42 |
| AM Colby St NB | 33 | 46 / 55 | 44 / 45 | 45 / 47 | 45 / 47 |
| AM Hillegass Ave SB | 36 | 39 / 36 | 35 / 38 | 36 / 35 | 37 / 36 |
| AM Hillegass Ave NB | 34 | 39 / 43 | 42 / 44 | 42 / 43 | 42 / 44 |

The cells are read from the pass-1 note and the final report. The final PM Colby St SB is 56 in the fit against a target of 39, so the weight cut the after-count-fit value from 67 (round 51) to 49, not all the way to the target. PM Colby St SB blocks, final fit, against the counts (cars an hour):

| Block | 2606 | 2602 | 2600 | 2598 | 2596 | 2594 | 2592 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Count | 139 | 156 | 162 | 160 | 159 | 170 | 162 |
| Round 51 final fit | 111 | 126 | 128 | 106 | 126 | 132 | 120 |
| Final fit | 102 | 121 | 119 | 98 | 120 | 138 | 126 |
| Ten-seed simulation | 120 | 136 | 138 | 113 | 143 | 159 | 151 |

The fit's blocks end 19 to 39% under their counts (round 51: 20 to 34%), and the simulator lands closer to the counts than the fit does (all seven within GEH 5; the worst is 61st St to 62nd St at GEH 4.0). Full tables are in `evidence/route-fit-*.md`.

### Screen, three seeds

Baseline to candidate. PM fitted 73 to 82 of 92, PM held out 14 to 12 of 24 (within the 3-below limit), AM fitted 70 to 72 of 77, AM held out 14 to 14 of 19. Cars cleared from gridlock in the judged zone: 0 to 0. Backlog was under 2% in 3 of 3 seeds in both peaks: PM mean 0.30% to 1.13% (max 1.37%), AM mean 0.13% to 0.43% (max 0.64%). The screen passed.

### Keep rule, ten seeds

"Fitted" stations are in the demand fit. "Held out" stations are withheld by the frozen split and scored on the cross-validation demand. Each count is the number of stations that pass GEH < 5 on the ten-seed mean. D5 is the four headline freeway shares for Hillegass Ave and Colby St (within 10 points). Whole-street traversals are the eight street runs checked end to end (within GEH 5). D16 is the stability check: backlog under 2% of trips, no backlog growth, and cars cleared from gridlock in the judged zone within the limit. The candidate is the ten-seed assessment r52 (`evidence/rockridge.assessment-r52.md`).

| Line | Line to meet | Baseline | Round 51 | Candidate | Result |
| --- | --- | --- | --- | --- | --- |
| PM fitted | 74 | 74 of 92 | 82 | 81 of 92 | pass |
| PM held out | 14 | 14 of 24 | 14 | 14 of 24 | pass |
| AM fitted | 70 | 70 of 77 | 74 | 72 of 77 | pass |
| AM held out | 14 | 14 of 19 | 15 | 15 of 19 | pass |
| D5 headline shares | 4 of 4 | 4 (mean error 4.6) | 4 (4.1) | 4 of 4 (mean error 3.8) | pass |
| Whole-street traversals | 8 of 8 | 8 | 8 | 8 of 8 | pass |
| D16 stability | holds | holds | holds | holds in every period | pass |
| Validation suite | 67 of 74 | 67 | 67 | 67 of 74 | pass |

Every line passes. The close ones:

- PM held out is exactly at its line (14 of 24), and AM held out is one above (15 against 14).
- PM Colby St southbound whole-street: 74.5 modeled against 39 observed, GEH 4.7, under the limit of 5 (round 51 was 75, GEH 4.8, on the same seeds).
- PM Hillegass Ave southbound to the freeway: 60.0% modeled against 68 observed, 8 points low, inside the 10-point band.
- The assessment's own 85% station rule still fails for held-out stations: PM 14 of 24 (58%), AM 15 of 19 (79%). The keep rule's lines are the baseline's counts, not that rule.

D5 and the whole-street line are fitted quantities in the shipped view: the shares (weight 3) and the whole-street counts (now weight 7 or 4 per route) are both fit targets. Passing them shows the simulator can reach what the fit asks of it. The held-out station counts are the independent check, and they sit at the line.

Whole-street traversals, ten-seed simulation against the count, cars an hour (GEH in brackets):

| Street | AM | PM |
| --- | --- | --- |
| Hillegass Ave NB | 39 against 34 (0.8) | 56 against 48 (1.1) |
| Colby St NB | 42 against 33 (1.5) | 86 against 102 (1.7) |
| Hillegass Ave SB | 30 against 36 (1.0) | 78 against 79 (0.2) |
| Colby St SB | 39 against 46 (1.1) | 75 against 39 (4.7) |

Baseline to candidate, ten-seed simulated route values: PM Colby St NB 72.7 to 85.6, Colby St SB 56.5 to 74.5, Hillegass Ave NB 53.4 to 55.6, Hillegass Ave SB 91.4 to 77.6; AM Colby St NB 46.4 to 42.4, Colby St SB 26.4 to 38.9 (GEH 3.3 to 1.1), Hillegass Ave NB 41.5 to 38.6, Hillegass Ave SB 35.6 to 30.4. Southbound blocks within GEH 5: PM Colby St 7 of 7 to 7 of 7, Hillegass Ave 4 of 4 to 4 of 4; AM Colby St 6 of 7 to 7 of 7, Hillegass Ave 4 of 4 to 4 of 4.

### Fresh-seed confirmation, seeds 11 to 20

Mode: `scripts/confirm.zsh` in the change, as written in its runbook, which runs `tools/assess.ts` in verdict mode for a non-published set (`--suffix`, no `--diagnostic`, `--publish` or `--noise`) on the baseline and the candidate, then compares. The hash checks passed, the baseline was restored, and it wrote `evidence/confirm/confirm.md`. Station sets were identical in every column.

| Line | Line to meet | Baseline, seeds 1-10 | Candidate, seeds 1-10 | Baseline, seeds 11-20 | Candidate, seeds 11-20 | No worse on seeds 11-20? |
| --- | --- | --- | --- | --- | --- | --- |
| PM fitted | 74 | 74 of 92 | 81 of 92 | 75 of 92 | 82 of 92 | yes |
| PM held out | 14 | 14 of 24 | 14 of 24 | 13 of 24 | 14 of 24 | yes |
| AM fitted | 70 | 70 of 77 | 72 of 77 | 71 of 77 | 74 of 77 | yes |
| AM held out | 14 | 14 of 19 | 15 of 19 | 13 of 19 | 16 of 19 | yes |
| D5 PM headline shares | 4 of 4 | 4 of 4 (mean error 4.6) | 4 of 4 (3.8) | 4 of 4 (5.2) | 4 of 4 (3.2) | yes |
| Whole-street traversals | 8 of 8 | 8 of 8 | 8 of 8 | 8 of 8 | 8 of 8 | yes |
| D16, AM / midday / PM | holds | holds | holds | holds | holds | yes |

Result: the confirmation holds. Round 51's confirmation for comparison failed on PM Colby St SB at 78 (GEH 5.0, 7 of 8); round 52 is 67 (standard error 3.5, GEH 3.9) on the same seeds, against the baseline's 58 (standard error 3.5, GEH 2.8). The baseline is below the keep-rule line on these seeds for PM held out (13 against 14) and AM held out (13 against 14).

Watched lines, baseline against candidate on seeds 11 to 20:

- PM Colby St SB whole street: 58 against 67 (seeds 1 to 10: 57 against 75), target 39.
- PM Hillegass Ave SB to the freeway share (target 68): 58.5 against 60.3.
- AM Hillegass Ave SB to the freeway share (target 57): 58.7 against 53.5.
- Backlog under 2% in 10 of 10 seeds in every period. PM mean 0.25% against 1.03% (max 1.42%), AM mean 0.18% against 0.36%.
- Cars cleared from gridlock near the area: 0 in every period for both.

### Shares in the simulator

PM, ten-seed means, cars per hour, baseline to candidate [training view].

| Block | To the freeway | Not to the freeway | Share to the freeway | Target |
| --- | --- | --- | --- | --- |
| Hillegass Ave SB | 121.4 to 118.0 | 87.6 to 79.1 | 58.1% to 60.0% [53.4% to 64.7%] | 68% |
| Colby St SB | 106.1 to 94.0 | 151.5 to 126.5 | 41.4% to 42.8% [28.0% to 40.0%] | 45% |

The Colby St SB share to Forest St fell from 18.9% to 8.7% (target 34%). Colby St SB through trips on any link rose from 126.7 to 154.6 cars an hour, while the freeway trips fell from 112.2 to 94.0. So the whole-street excess on Colby St SB is non-freeway traffic that runs the full length of the street. The weight moved the fit's whole-street value toward its count, and the simulator's value did not follow.

### Reported lists

Baseline to candidate, shipped view (training view after a slash where given). These are reported, not conditions.

- Offered car demand totals, veh/h, pass 0 to final: PM 27612 to 24759 (training 25044 to 22659); AM 23204 to 21510 (20584 to 19123).
- Five diagonal stations, PM, counted 178: simulated sum 495 to 349 (training 1234 to 453; simulated over counted 1.96 shipped and 2.54 training). AM, 4 stations, counted 110: 206 to 167 (training 428 to 331). Round 51 was 354 in the PM shipped view.
- Colby St northbound, simulated over counted, 7 blocks: PM 0.75 to 0.82 (training 0.77 to 0.94); AM 0.73 to 0.76 (0.87 to 0.82).
- Through cars in the study area, per hour: PM 729 (652 to 777) to 786 (709 to 887) shipped, training 1019 to 875; AM 447 to 394 shipped, training 549 to 504.
- SR-24 ramps, PM, against the target: Claremont on (598) 773 to 708; Clifton off (617) 697 to 718; 52nd on (996) 968 to 926, off (1024) 1029 to 994; MLK on (1547) 1266 to 1440, off (1614) 1512 to 1524; node 280 (190) 282 to 258; Telegraph on (657) 906 to 959; Aileen off (621) 724 to 727. AM: Claremont on (508) 570 to 567; Clifton off (524) 601 to 639; 52nd on (1076) 1097 to 986, off (898) 881 to 893; MLK on (1417) 883 to 922, off (1501) 1506 to 1519; node 280 (59) 255 to 306; Telegraph on (558) 710 to 702; Aileen off (528) 676 to 564.
- SR-24 mainline gate 602, PM: offered 3945 to 3942, simulated 3896 to 3751. Trips waiting at the end: 46 to 170 shipped, 48 to 210 training. AM: 4 to 3.
- Trips waiting by gate, seed mean, baseline to candidate: PM all origins 78 to 262 (602 46 to 170; 1756 Claremont about 0 to 56; 1398 about 0 to 7; 183 14 to outside the top 10); AM all origins 27 to 62 (1756 18 to 52).
- Travel times inside the observed range: 7 of 12 to 6 of 12. PM Telegraph Ave southbound 335 to 400 s, now too slow (range 300 to 376); PM Shattuck Ave southbound 272 to 300 s and AM Shattuck Ave southbound 176 to 191 s (the latter still in range).
- Inside nodes that gained the most, shipped PM: 1128 Alcatraz Ave/Benvenue 8 to 41 and 853 Alcatraz Ave/Colby St 12 to 24.
- The 20 gates: the large changes are PM shipped 577 MLK destination 417 to 131, 973 destination 1126 to 1002, 974 origin 924 to 835 and 288 origin 174 to 86; training PM 974 origin 1071 to 866 and 577 origin 422 to 236 (`evidence/gate-totals.txt`).

### What to look at

1. PM Colby St SB whole street is still the weakest line: 74.5 (GEH 4.7) on seeds 1 to 10 and 67 (GEH 3.9) on seeds 11 to 20, against 39 counted. The weight cut the fit's after-count-fit value from 67 (round 51) to 49 and its final to 56, yet the simulator still carries about 75 on seeds 1 to 10. The excess is non-freeway traffic running the full length of the street.
2. The cost shows up in congestion, not in the counts. PM backlog is roughly fourfold (mean 0.28% to 1.07% of trips on seeds 1 to 10) but under 2% in every seed. Gate 602 waiting rises from 46 to 170. One more travel time (PM Telegraph Ave southbound) is now out of range.
3. The shipped PM build offers 10.3% less demand than the static fit. This round only reports it.

### Reading

On the counts the fit sees, the two changes did what the breakdown predicted. The fit's PM Colby St SB route value after the count-only fit fell from round 51's 67 to 49, D5 and the shares hold, and the held-out counts stay at the baseline's line. On fresh seeds PM Colby St SB improved from round 51's 78 to 67 and every confirmation line holds. That is a keep-rule pass and a confirmation pass, and no more. D5 and the whole-street line are fitted quantities in the shipped view, the held-out station counts are the independent check, and the assessment's 85% station rule still fails for held-out stations (PM 14 of 24, AM 15 of 19). The model status stays "Not calibrated".

### Verdict

Passes the screen and every line of the keep rule on seeds 1 to 10 (81, 14, 72, 15, D5 4 of 4, whole-street 8 of 8, D16 holds, validation 67 of 74) and the fresh-seed confirmation on seeds 11 to 20 (no line worse than the baseline), with the low-demand figure reported (10.3% below the static fit in the shipped PM build). Adoption was pending the project lead's review. Their decisions of 2026-11-19 were about round 51 and did not cover this candidate. At that point the code stayed on main with the switches off, the shipped config had neither `gatePriorTotals` nor `simulatedMembership`, and the published data (network 53c823f20d9165ed, demand 9cdebdabf05c4460) were unchanged. The model status stays "Not calibrated". The change stayed open until the adoption below.

### Staged proposal search

The search ran on the laptop from 11:49 PM on 2026-11-19 to 1:22 AM on 2026-11-20 (Pacific), 5606 s, with the same flags as search-c5. It started from search-c5's output and the committed seeds file, and it wrote staged files only. Details are in `openspec/changes/archive/2026-11-20-calibration-round-52/evidence/search/` (`report.md`, `compare.md`, `README.md`).

Baseline through cars an hour on the side streets, confirmation seeds 101 to 110:

| Search | PM | AM | Midday | Mean |
| --- | --- | --- | --- | --- |
| Round 52 | 793.7 | 387.0 | 386.8 | 522.5 |
| Published search-c5 | 709.2 | 429.1 | 386.8 | 508.4 |
| Round 51 candidate | 806.9 | 414.0 | 386.8 | 535.9 |

The search found six options, p1 to p6. Mean through cars an hour over the three periods, baseline to option (seeds 101 to 110):

| Option | Goal | Through cars an hour |
| --- | --- | --- |
| p1 | most through cars cut | 522.5 to 135.7 (-74.0%) |
| p2 | none | 522.5 to 197.3 (-62.2%) |
| p3 | none | 522.5 to 225.9 (-56.8%) |
| p4 | no closures | 522.5 to 313.9 (-39.9%) |
| p5 | least detour | 522.5 to 337.3 (-35.5%) |
| p6 | fewest changes | 522.5 to 352.3 (-32.6%) |

The displacement rule dropped no option. The two reference packages were measured too: the earlier 62nd St diverters, 522.5 to 444.7 (-14.9%), and the Colby St and Hillegass Ave slow streets, 522.5 to 429.8 (-17.7%).

### Decision of the project lead (2026-11-20)

Earlier in the same session the project lead had approved publishing round 51 only if a fresh-seed check held. It failed, and they chose not to adopt round 51.

At about 1:35 AM Pacific on 2026-11-20, in a question card, they decided to publish round 52 as the model with its assumptions, maps and the staged proposals. They were shown:

- The keep rule passed on seeds 1 to 10 and held on the fresh seeds 11 to 20.
- The costs: PM Colby St southbound whole-street goes from 67 to 75 cars an hour against 39 counted; PM backlog is about fourfold and stays under 2%; PM Telegraph Ave southbound travel time is out of range; the PM demand is 10.3% below the static fit.
- The staged proposals: baseline 522.5 through cars an hour against 508.4 for the published set, with the top option unchanged at -74.0%.

The status stays "Not calibrated".

### Adoption and publish (2026-11-20)

Reproducibility check in the cloud, before publishing: the cloud rebuilt both demand views byte-identically from the laptop's membership files. Hashes: shipped demand 2d16d8f8eb0950ca, cross-validation demand 1c3b1666f24156f1, config 2405ff02c92b2837, membership 3d639670c1feb38f (shipped) and c1cd4ce96fb28791 (training).

The branch `adopt-round-52` (fd8c0fe) merged to main as 37bb0fb. It carries the config, the fit reports and audit, the R2 mapping for `target/membership` (`tools/lib/r2-map.ts`, prefix `demand/membership/`, not served at `/data`), the status note and caveat, and the proposals report and seeds.

The laptop ran the heavy steps from 8:06 to 8:38 AM Pacific on 2026-11-20. The commits on the development branch are dd87d88 (merge), d21a60b (assessment) and 3ddf1b4 (parts), all unsigned there, as the project lead allows on that branch.

- WASM build; the native/WASM parity check passed.
- `npm run data`: network 53c823f20d9165ed, demand 2d16d8f8eb0950ca, cross-validation demand 1c3b1666f24156f1. The fit reports and audit came out identical to the committed ones.
- `validate`: 67 of 74 cases pass. `validation.json` changed only in its revision field.
- `assess --publish --noise` on seeds 1 to 10 gave the same ten-seed result as the round 52 candidate: PM fitted 81 of 92, PM held out 14 of 24, AM fitted 72 of 77, AM held out 15 of 19, D5 4 of 4 with mean error 3.8, whole-street 8 of 8 (PM Colby St SB 75 against 39 at GEH 4.7), D16 holds in every period. The suggested status is uncalibrated. Noise file 4d6850cccc2f43e8.
- `data:redistribution` (567 s) stored where the through cars that used each closure go. Items per option: p1 6, p2 4, p3 5, p4 5, p5 2, p6 1, earlier 62nd St diverters 2, Colby St and Hillegass Ave slow streets 0.
- `data:results` (24 files plus `baseline-intents` and the index), `data:assumptions`, `data:llms` (11 pages) and `data:previews` (14 cards plus the index).

The 65 changed `public/data` files (11,571,323 bytes) came to the cloud as 22 gzip parts on the development branch, with checksums. The small evidence files are in `openspec/changes/archive/2026-11-20-calibration-round-52/evidence/publish/`; the parts are not on main.

The cloud published at about 8:40 AM Pacific. All checksums verified, and the laptop's demand file is byte-identical to the cloud's own rebuild. Tools and worker tests passed (580 of 580). `data:push` uploaded the files and the two membership files. The live site was then read back: demand 2d16d8f8eb0950ca, proposals 197a99cdafc026f8, network 53c823f20d9165ed, noise 4d6850cccc2f43e8 and `areas.json` match the local files. The status note on the site reads "Not calibrated: PM count locations held out of the fit pass 14 of 24 (rule: over 85%), and PM fitted locations pass 81 of 92." Main is at 0b25a0d (`feat(data): publish the round 52 model, assessment and proposals`).

Published now: network 53c823f20d9165ed, demand 2d16d8f8eb0950ca, cross-validation demand 1c3b1666f24156f1, proposals 197a99cdafc026f8 (the staged search above), assessment from the laptop run d21a60b. The change `calibration-round-52` is archived.

## Fifty-first round: route shares on simulated membership, with node ceilings (passes the keep rule on seeds 1 to 10, fails the fresh-seed confirmation, not adopted) (2026-11-19)

Passed the screen and every line of the keep rule on seeds 1 to 10. It then failed the fresh-seed confirmation on one line, the whole-street traversals (7 of 8 against the baseline's 8 of 8 on seeds 11 to 20), and the project lead decided not to adopt it (change calibration-round-51, archived). The published network 53c823f20d9165ed, demand 9cdebdabf05c4460 and cross-validation demand 2f9ae152b9bbf78e stand, and the model status stays "Not calibrated". Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9 throughout. Nothing under `data/` or `public/data/` changed apart from this record. The evidence is in `openspec/changes/archive/2026-11-20-calibration-round-51/evidence/` (laptop commits d28897d, d4b2095, 2557fc9 and 6c5ff1b, all unsigned). The numbers in the first sections come from the laptop's stop report, its pass-1 note and its final report; the search and confirmation sections come from its search and confirmation reports. The two membership files were sent as 7 gzip parts on the development branch only (6c5ff1b) and are not on main.

### What was tried

In rounds 48 to 50 the station counts took the simulator's own routes, but the observed route shares (`countFit.shares`, weight 3, the four freeway shares and the ramp via-street shares) were balanced on the static assignment's sampled routes (`tools/lib/share-targets.ts`, `routeShareTally`). The lead's hypothesis was that this mismatch is why the two southbound to-freeway shares fell in rounds 48, 49 and 50. Round 51 tests it. The select-link share constraints take simulated membership from the same `--select-od` block export as the stations: a pair's denominator is its simulated share of trips on the block, shrunk toward the static fraction with the same prior of 5 trips (an assumption, as for stations), and the numerator counts pairs whose origin ("from") or destination ("to") is a freeway node, the quantity the calibrate report scores. Ramp via-street shares stay on static routes, since nothing exports them per pair. The node ceilings are exactly round 50's (`gatePriorTotals`, scope `allNodes`, static-fit anchor, tolerance 0, weight 10, hard projection).

The change adds two sub-switches under `simulatedMembership`: `shares` and `throughTargets`. Both are off by default and the shipped config has no `gatePriorTotals` or `simulatedMembership` entry. The `throughTargets` sub-switch does nothing on the shipped data. Commit c503d84 (2026-11-17) removed `fitThrough` and `observedCorridorThroughVehPerHour` from the targets file, so the shipped config has no through-car target, and every pool reported "share blocks without a simulated trip: none; through blocks without a counted through trip: none" with no through target named. The candidate therefore tests the shares only.

The keep rule, the screen and the loop abort were unchanged from round 50 and written before any run. The warning from round 50 also stayed: stop and report if a final build offers more than 10% fewer car veh/h than the static fit (a line chosen as an assumption).

### The low-demand stop and the lead's decision (2026-11-19)

The run on the project lead's laptop session went from 4:13 to 5:40 PM PST. The loop took 3,986 s, exited 0, and ran three passes (0, 1, 2) plus the final builds. The stop rule did not fire and there was no abort. The final shipped PM build offered 24,688 car veh/h, 10.6% below the static fit's 27,609 (the line is 10%, an assumption), and the driver stopped with its warning before the screen, the validation or the ten seeds. The other three final builds were inside the line: shipped AM 92.4%, training PM 90.1%, training AM 91.5%.

The lead decided the same day to continue with the screen and the ten seeds on the saved candidate. The reasons:

- The 10% line is a stop-and-report point, not a keep-rule line. It asks for a decision and does not fail a candidate.
- Round 50 ran in full at 9.98% below the static fit (training PM 22,543 of 25,042 veh/h), so the two candidates carry practically the same volume. The comparison between them needs the same measurements, and without the ten seeds round 51 would have none.
- The keep rule and the screen are unchanged, so the shortfall cannot loosen anything.
- The shortfall is reported with the result, and adoption is the project lead's decision.

The loop was not rerun. Steps E and F (screen, validation, ten seeds) ran from 6:33 to 6:46 PM PST on the saved candidate, after the config, the fit reports from the final builds and the saved demand files were put back and their hashes checked.

### Hashes

- Baseline: network 53c823f20d9165ed, shipped demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e. Fingerprint d45a275dd7be0713cec6a64394b7d8a9; vitest (gate-prior, node-prior, block-membership, membership-loop) 68 of 68.
- Config with the candidate entry: sha256 1080597767aac58c. `apply-candidate.py` added 2 blocks, 16 inserted lines (the runbook expected 18). The entry has `"throughTargets": true` and `"shares": true`, and `gatePriorTotals` has scope `allNodes`. The dry run was as expected.
- Candidate: network 53c823f20d9165ed (identical); shipped demand 5d6be8a70618e905; cross-validation demand 7164fa2ab08f612a; membership files shipped 74a88c864d406903 and training 7d0fdb063236304d. The stations file is identical. The membership files were left untouched from the loop through the screen.
- Pass 0 matched the baseline in both views, at mid-run and at the end.
- After the run the baseline was restored and checked: 53c823f20d9165ed, 9cdebdabf05c4460 and 2f9ae152b9bbf78e, status showing only the evidence, lock released. `validation.json` and `validation.md` were checked out again after the validation suite.

### Loop behavior

Offered car demand in veh/h, with its share of the static fit; from pass 2, the change in flow and in membership per station as a ratio to its seed standard error (flow / membership).

| Pass | Shipped PM | Shipped AM | Training PM | Training AM |
| --- | --- | --- | --- | --- |
| 0 | 27612 | 23204 | 25044 | 20584 |
| 1 | 24521 (88.8%) | 21519 (92.7%) | 22741 (90.8%) | 18984 (92.2%) |
| 2 | 24767 (89.7%); 1.78 / 1.72 | 21394 (92.2%); 1.55 / 1.41 | 22712 (90.7%); 1.67 / 1.66 | 18892 (91.8%); 1.33 / 1.60 |
| Final | 24688 (89.4%) warning | 21440 (92.4%) | 22569 (90.1%) | 18834 (91.5%) |

Every build from pass 1 carries the shares note "select-link shares take simulated membership (10 runs / 20 runs; 4 of 4 share constraints ...)". The shipped PM pass-1 figure is below the 10% line, but the warning applies only to final builds.

### Ceiling lines per build

Ceiling stations at pass 1, gate plus non-gate: shipped PM 1,991, shipped AM 2,034, training PM 1,959, training AM 2,022. Above ceiling after the projection: 0 in every build except the final shipped PM (1 gate, excess 1 veh/h), the final training PM (1 gate, excess 1) and the pass-1 training PM (1 gate, excess 1).

Offered car veh/h, static fit to final, by flow type; the volume the projection cut (gate / non-gate, veh/h); fitted stations within tolerance, before to after the projection.

| Build (final) | Through | Local | Ramp | Cut by projection | Within tolerance |
| --- | --- | --- | --- | --- | --- |
| Shipped PM | 5907 to 5021 | 10360 to 8355 | 11342 to 11313 | 173 (112 / 61) | 169 to 160 of 343 |
| Shipped AM | 3745 to 3506 | 9586 to 8172 | 9871 to 9762 | 106 (60 / 46) | 144 to 145 of 278 |
| Training PM | 2785 to 2717 | 10873 to 8479 | 11384 to 11372 | 264 (211 / 53) | 126 to 125 of 260 |
| Training AM | 2455 to 2459 | 8314 to 6585 | 9813 to 9789 | 77 (48 / 29) | 109 to 112 of 205 |

#### Non-gate trip ends

Final builds, veh/h, static fit to final. These count non-gate nodes only, split by the network's study-area flag.

| View, period | Origins inside | Origins outside | Destinations inside | Destinations outside |
| --- | --- | --- | --- | --- |
| Shipped PM | 951 to 727 | 9523 to 8040 | 734 to 451 | 7901 to 6349 |
| Shipped AM | 612 to 528 | 7488 to 6448 | 528 to 441 | 8211 to 6933 |
| Training PM | 1387 to 975 | 8768 to 7445 | 881 to 567 | 6740 to 5210 |
| Training AM | 1040 to 865 | 7095 to 5976 | 735 to 556 | 5907 to 4767 |

Every trip-end group fell in every build and none rose.

### Select-link shares by build

Percent, for the four headline freeway shares. Each cell is the fit's share on simulated membership / the fit's share on static routes, for pass 1, pass 2 and the final build, against the target. The fit balances the first number. The second is what the same flows read on the static routes that rounds 48 to 50 balanced on.

| View, period | Share | Target | Pass 1 | Pass 2 | Final |
| --- | --- | --- | --- | --- | --- |
| Shipped PM | Hillegass NB from freeway | 47 | 47 / 46 | 46 / 49 | 47 / 47 |
| Shipped PM | Colby NB from freeway | 47 | 46 / 48 | 45 / 47 | 46 / 47 |
| Shipped PM | Hillegass SB to freeway | 68 | 65 / 66 | 64 / 71 | 63 / 71 |
| Shipped PM | Colby SB to freeway | 45 | 49 / 59 | 46 / 65 | 46 / 66 |
| Shipped AM | Hillegass NB from freeway | 47 | 44 / 47 | 43 / 47 | 44 / 46 |
| Shipped AM | Colby NB from freeway | 47 | 46 / 48 | 45 / 47 | 45 / 46 |
| Shipped AM | Hillegass SB to freeway | 57 | 57 / 55 | 56 / 56 | 57 / 56 |
| Shipped AM | Colby SB to freeway | 45 | 41 / 38 | 39 / 40 | 39 / 41 |
| Training PM | Hillegass NB from freeway | 47 | 45 / 43 | 44 / 44 | 44 / 45 |
| Training PM | Colby NB from freeway | 47 | 42 / 44 | 42 / 46 | 42 / 48 |
| Training PM | Hillegass SB to freeway | 68 | 66 / 75 | 66 / 74 | 65 / 74 |
| Training PM | Colby SB to freeway | 45 | 43 / 57 | 43 / 59 | 44 / 58 |
| Training AM | Hillegass NB from freeway | 47 | 45 / 42 | 45 / 40 | 45 / 39 |
| Training AM | Colby NB from freeway | 47 | 44 / 43 | 44 / 44 | 44 / 43 |
| Training AM | Hillegass SB to freeway | 57 | 57 / 56 | 57 / 56 | 57 / 56 |
| Training AM | Colby SB to freeway | 45 | 41 / 49 | 42 / 47 | 41 / 49 |

On its own simulated membership the fit holds all four headline shares within 0 to 6 points of target in every build. On static routes the PM southbound shares read far above: Colby SB 66 against 45 and Hillegass SB 71 to 74 against 68 in the final builds. So the mismatch the lead suspected exists, and it is largest on the PM southbound shares. Whether correcting it makes the simulator deliver the target shares is what the ten seeds test (next sections).

Ramp via-street shares: 11 per period (6 onto the freeway, 5 from it), all static. The final shipped route-shares table (observed / offered / count-only fit / final), PM: College onto 16 / 32 / 24 / 18; Hillegass onto 12 / 11 / 28 / 15; Martin onto 10 / 23 / 15 / 10; Colby onto 8 / 15 / 25 / 12; Telegraph onto 8 / 14 / 12 / 9. AM: Colby onto 8 / 17 / 28 / 12; Martin from 10 / 18 / 31 / 14; College from 10 / 34 / 23 / 12. All lines are in `laptop/ceilings-and-shares-per-build.md` and `fit/rockridge.fit*.md`.

### Screen, three seeds

Baseline to candidate. PM fitted 73 to 81, PM held out 14 to 15, AM fitted 70 to 73, AM held out 14 to 15. Gridlock in the judged zone was 0. Backlog was under 2% in 3 of 3 seeds in both periods (mean and max): AM 0.53% and 0.88%; PM 1.19% and 1.51%. The screen passed.

### Keep rule, ten seeds

"Fitted" stations are in the demand fit. "Held out" stations are withheld by the frozen split and scored on the cross-validation demand. Each count is the number of stations that pass GEH on the ten-seed mean (the assessment's own Verdict table, matched by `laptop/compare51.ts`: 82, 14, 74, 15). D5 is the four headline freeway shares for Hillegass St and Colby St (within 10 points). Whole-street traversals are the eight street runs checked end to end (within GEH 5). D16 is the stability check: backlog under 2% of trips, no backlog growth, and cars cleared from gridlock in the judged zone within the limit. The baseline is the ten-seed set 60r47-base.

| Line | Line to meet | Baseline | Round 48 | Round 49 | Round 50 | Candidate | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PM fitted | 74 | 74 of 92 | 78 | 81 | 80 | 82 of 92 | pass |
| PM held out | 14 | 14 of 24 | 13 | 13 | 13 | 14 of 24 | pass |
| AM fitted | 70 | 70 of 77 | 72 | 74 | 72 | 74 of 77 | pass |
| AM held out | 14 | 14 of 19 | 15 | 14 | 15 | 15 of 19 | pass |
| D5 headline shares | 4 of 4 | 4 (mean error 4.6) | 2 (12.5) | 2 (10.6) | 2 (7.8) | 4 of 4 (mean error 4.1) | pass |
| Whole-street traversals | 8 of 8 | 8 | 8 | 7 | 8 | 8 of 8 | pass |
| D16 stability | holds | holds | fails | holds | holds | holds in every period | pass |
| Validation suite | 67 of 74 | 67 | 67 | 67 | 67 | 67 of 74 | pass |

Every line passes. Several are close:

- PM held out is exactly at its line (14 of 24).
- PM Colby St southbound whole-street: 75 modeled against 39 observed, GEH 4.8, just under the limit of 5.
- PM Hillegass Ave southbound to the freeway: 58.9 modeled against 68 observed, 9.1 points low, inside the 10-point band (95% interval 54.7 to 63.2).
- The assessment's own 85% station rule still fails for held-out stations: PM 14 of 24 (58%), AM 15 of 19 (79%). The keep rule's lines are the baseline's counts, not that rule.

D5 detail, PM headline shares, observed against modeled (candidate): Hillegass Ave northbound from the freeway 47 against 50.6 (95% interval 48.2 to 53.1); Colby St northbound from the freeway 47 against 46.5; Hillegass Ave southbound to the freeway 68 against 58.9; Colby St southbound to the freeway 45 against 42.0 (39.0 to 45.0). AM shares are 4 of 4 (mean error 4.1) and midday 4 of 4 (4.5).

D5 is not independent evidence. The shares are fit targets (weight 3), so D5 passing shows that the fit can now reach its own share targets in the simulator, which rounds 48 to 50 did not. The held-out station counts are the independent check, and they sit exactly at the line in the PM.

D16 detail. PM: backlog under 2% in 10 of 10 seeds (mean 1.11%, max 1.51%); cars cleared from gridlock in the judged zone 0.30 per hour (max 2.00 in one seed; the rule is a mean below 1). AM: 10 of 10 (mean 0.32%, max 0.88%); gridlock 0. Midday holds. Validation: 67 of 74 at fingerprint d45a275dd7be0713cec6a64394b7d8a9.

### Shares in the simulator

From `scripts/shares.cjs` run as written, PM, ten-seed means, cars per hour, baseline to candidate [training view].

| Block | All southbound trips | To the freeway | Not to the freeway | Share to the freeway |
| --- | --- | --- | --- | --- |
| Hillegass Ave SB | 209.0 to 198.0 [278.9 to 215.5] | 121.4 to 116.7 [148.8 to 140.3] | 87.6 to 81.3 [130.1 to 75.2] | 58.1% to 58.9% [53.4% to 65.2%] |
| Colby St SB | 257.6 to 200.1 [366.4 to 240.8] | 106.1 to 84.0 [102.6 to 95.5] | 151.5 to 116.1 [263.8 to 145.3] | 41.4% to 42.0% [28.0% to 39.6%] |

Colby St SB whole-street: 56.5 to 75.2 [50.2 to 84.1]; through trips on any link 126.7 to 155.0; freeway trips 112.2 to 84.3. Round 50 was 69.6.

The shares reach their targets mainly because the cars not headed to the freeway fell. The denominators shrank: all Colby St SB trips went from 257.6 to 200.1 cars per hour (57 fewer), the cars not headed to the freeway from 151.5 to 116.1, and the to-freeway cars from 106.1 to 84.0. The share rose from 41.4% to 42.0% because the cars not headed to the freeway fell by more than the to-freeway cars did.

### Reported lists

Baseline to candidate, shipped view (training view in brackets). These are reported, not conditions.

- Offered car demand totals, veh/h: PM 27612 to 24689 [25044 to 22570]; AM 23204 to 21440 [20584 to 18834].
- Five diagonal stations, PM, counted 178: simulated sum 495 to 354 [1234 to 465]; simulated over counted 2.78 to 1.99. By station, with the count: Forest St EB 183 to 107 [516 to 161] (66); McAuley St EB 83 to 65 (12); 60th St EB 76 to 64 (23); Ayala Ave NB 81 to 52 (60); Howell St SB 72 to 67 (17). AM, 4 stations, counted 110: 206 to 154 [428 to 365].
- Colby St northbound, simulated over counted: PM 0.75 to 0.81 [0.77 to 0.90]; AM 0.73 to 0.77 [0.87 to 0.78].
- Through cars in the study area, per hour: PM 729 to 800 [1019 to 931]; AM 447 to 427 [549 to 566].
- SR-24 mainline, PM: node 602 entry offered 3945 to 3940, flow 3896 to 3727, trips waiting 46 to 193 [48 to 220]; node 675 exit flow 3770 to 3736; node 1726 exit flow 710 to 679. AM: node 602 waiting 4 to 22; node 675 exit flow 3152 to 3065; node 1726 exit flow 823 to 790.
- SR-24 ramps, PM, against the target, shipped [training]: Claremont on (598) 773 to 728 [975 to 880]; Clifton off (617) 697 to 714 [943 to 887]; 52nd on (996) 968 to 937 [1054 to 1060]; 52nd off (1024) 1029 to 985; MLK on (1547) 1266 to 1428 [1014 to 1100]; MLK off (1614) 1512 to 1525; node 280 (190) 282 to 251 [532 to 667]; Telegraph on, node 701 (657) 906 to 952 [1272 to 1291]; Aileen off, node 702 (621) 724 to 731 [646 to 725]. The AM rows are in `laptop/compare.md`. The Claremont Ave on-ramp was 693 in round 50 and is 728 here, 35 cars per hour further from its count of 598. The runbook expected shares fitted on simulated membership to move it away from the count, and it did.
- Travel times inside the observed range: 7 of 12 to 6 of 12. PM Telegraph Ave southbound 335 to 397 s (range 300 to 376, too slow); PM Shattuck Ave southbound 309 s (too slow, as in the baseline at 272); AM Shattuck Ave southbound 196 s, back inside (round 50 was 218); PM College Ave northbound 269 s and southbound 228 s, inside. All rows are in `laptop/travel-times.md`.
- The 20 gates: none grew by more than 1 veh/h in any view or period. Cuts of 20 or more, offered veh/h (origin/destination where both moved): shipped PM, 184 destination 771 to 716; 288 174/150 to 83/114; 577 178/417 to 118/153; 952 171 to 143; 973 destination 1126 to 1000; 974 924 to 827. Shipped AM: 288 266 to 132; 675 destination 3159 to 3086; 943 970/455 to 927/452; 952 101 to 79; 973 destination 816 to 749; 1726 destination 818 to 789. Training PM: 577 422/356 to 283/250; 952 340 to 247; 973 destination 932 to 846; 974 1071 to 879. Training AM: 577 306 to 212; 952 146 to 97; 1398 destination 139 to 69; 1756 destination 145 to 125. Full tables are in `laptop/gates20.txt`, `laptop/gates-pm.md` and `laptop/gates-am.md`.

### Node breakdown

From `scripts/nodes.cjs` (the archived round 50 script, run as written on the saved final demand files). Change from the baseline, veh/h: local flow type shipped PM -2006 and shipped AM -1415. Non-gate origins: shipped PM inside -225, outside -1484; shipped AM inside -84, outside -1041. Non-gate destinations: shipped PM inside -283, outside -1553; shipped AM inside -87, outside -1279. The training view is in `nodes-training.md`. Non-gate trip ends fell inside and outside the study area.

### Trips waiting by gate

Trips still waiting at the end of the run, seed mean, baseline to candidate. All origins: PM 78 to 272, AM 27 to 70.

| Gate | PM baseline | PM candidate | AM baseline | AM candidate |
| --- | --- | --- | --- | --- |
| 602 | 46 | 193 | 4 | 22 |
| 183 | 14 | 0 to 1.1 | 0 to 0.2 | 0.1 |
| 1756 | 0 to 1 | 44 | 18 | 41 |
| 1398 | 0 to 1 | 5.4 to 6.0 | 0 to 0.1 | 0 |

At node 602 (the SR-24 eastbound entry) the offered volume is unchanged (3945 to 3940 in the PM) and the trips waiting still rise from 46 to 193. A gate missing from a seed's top-10 backlog table is given as a range, 0 at the low end and the tenth row at the high end (`laptop/backlog-gates.md`). No seed was rerun for these; a run is deterministic per seed.

### Reading

The shares on simulated membership did what the hypothesis said. Fitted on the simulator's own routes, the four PM headline shares reach their targets in the simulator, D5 goes from 2 of 4 to 4 of 4, and PM held out returns to 14 of 24, the baseline's count. Round 51 is the first of rounds 48 to 51 to pass every line.

The pass is a keep-rule pass and nothing stronger. The shares are fit targets, so D5 is not independent, and the held-out counts are at the line with the 85% station rule still failing. The shipped PM final build offers 89.4% of the static fit and the shipped AM 92.4% (round 50: 90.4% and 92.4%), and every non-gate trip-end group falls in every build. The southbound shares reach target through a smaller denominator. Trips waiting at the SR-24 eastbound entry gate rise as in rounds 48 to 50, travel times inside the observed range go from 7 of 12 to 6 of 12, and the Claremont Ave on-ramp ends at 728 against 598 counted.

### Staged proposal search

The lead asked on 2026-11-19 for the proposal search to run on the candidate, in the same shape as the published search-c5, with the outputs staged. Nothing was published: no `data:redistribution`, `data:results`, `data:llms`, `data:previews` or `data:push` ran, and nothing was written to `data/proposals` or `public/data/rockridge.proposals.json` (388c91f025dafd55 before and after). The evidence is in `evidence/search/` (laptop commit 2557fc9).

Run: config 1080597767aac58c; hashes 53c823f20d9165ed, 5d6be8a70618e905, 7164fa2ab08f612a, 74a88c864d406903, 7d0fdb063236304d; fingerprint d45a275dd7be0713cec6a64394b7d8a9; stations identical; code d4b2095. The flags were search-c5's. `--out` was seeded with the search-c5 output (3822705a26ca879d) and `--known` was a copy of `data/proposals/rockridge.seeds.json` (fbcf6d37a7e8cad3). Explore took 4903 s (search-c5 took 5384 s) and exited 0. The restore (`npm run data`) gave back 53c823f20d9165ed, 9cdebdabf05c4460 and 2f9ae152b9bbf78e with a clean status.

Baseline through cars per hour, mean over confirmation seeds 101 to 110, candidate against the published search-c5 set:

| Period | Candidate | search-c5 |
| --- | --- | --- |
| PM peak | 806.9 | 709.2 |
| AM peak | 414.0 | 429.1 |
| Midday | 386.8 | 386.8 |
| Mean | 535.9 | 508.4 |

Midday demand is byte-identical to the baseline's, so packages with the same changes match search-c5 exactly at midday. The candidate's gate-to-gate (through-type) demand is lower than the static fit's (PM 5021 against 5908 cars an hour, AM 3506 against 3745), yet the simulated PM through count on side streets rose by 98 cars an hour.

The six options. Format: change in through cars per hour on the confirmation seeds, mean [95% interval] (range over the ten seeds), for PM peak, AM peak and midday, then the overall change. MF is a modal filter, DD a diagonal diverter.

- p1 (no goal; seed 2026-11-18; same as search-c5 p1): MF 63rd St at Colby St, MF 63rd St at Hillegass Ave, MF Colby St at McAuley St, DD 62nd St at Hillegass Ave, MF Ayala Ave at Martin St, MF Forest St at Ayala Ave. PM -583.1 [-605.6, -560.6] (-628 to -528); AM -324.3 [-339.9, -308.7] (-358 to -286); midday -293.2 [-308.1, -278.3] (-319 to -255). Overall -400.2 [-409.0, -391.4], -74.7%.
- p2 (most removed; new, found by this search): MF 63rd St at Colby St, MF North St at Colby St, DD 63rd St at Hillegass Ave, one-way southbound Colby St from Claremont Ave/Forest St to McAuley St, MF Ayala Ave at Martin St, MF Forest St at Ayala Ave. PM -484.1 [-504.0, -464.2] (-555 to -456); AM -300.2 [-314.1, -286.3] (-325 to -269); midday -277.4 [-291.3, -263.5] (-308 to -239). Overall -353.9 [-361.2, -346.6], -66.0%.
- p3 (no goal; seed; same as search-c5 p3): MF 63rd St at Colby St, MF 63rd St at Hillegass Ave, DD 62nd St at Hillegass Ave, MF Ayala Ave at Martin St, one-way westbound Forest St. PM -435.8 [-465.9, -405.7] (-520 to -388); AM -257.4 [-271.3, -243.5] (-284 to -214); midday -256.2 [-266.7, -245.7] (-279 to -235). Overall -316.5 [-327.5, -305.5], -59.1%.
- p4 (least detour; seed 2026-11-18, new to the published set): MF 63rd St at Colby St, MF on 63rd St at Hillegass Ave, MF 62nd St at Hillegass Ave, DD Canning St at McAuley St, all-way stops at 60th St/Howell St and 58th St/Hermann St. PM -346.0 [-372.2, -319.8] (-385 to -285); AM -214.6 [-228.6, -200.6] (-234 to -170); midday -217.5 [-230.3, -204.7] (-243 to -193). Overall -259.4 [-269.3, -249.5], -48.4%. Detour 3.0 s per trip.
- p5 (no closures; same as search-c5 p4): five one-way streets plus the Colby Slow Street. PM -295.3 [-329.8, -260.8] (-353 to -207); AM -157.9 [-166.3, -149.5] (-176 to -139); midday -182.3 [-193.5, -171.1] (-210 to -163). Overall -211.8 [-224.1, -199.6], -39.5%.
- p6 (fewest changes; new): MF 63rd St at Colby St, DD 63rd St at Hillegass Ave. PM -243.2 [-274.7, -211.7] (-289 to -142); AM -165.0 [-171.9, -158.0] (-177 to -148); midday -168.6 [-182.1, -155.1] (-200 to -134). Overall -192.3 [-203.6, -181.0], -35.9%.

References: earlier-62nd-diverters, overall -63.2 [-75.3, -51.1], -11.8%; colby-hillegass-slow-streets, overall -93.1 [-107.0, -79.1], -17.4%.

Displacement. The rule dropped no option, here or in search-c5. The largest all-car rise on one block, PM / AM / midday, cars an hour: p1 +200.7 / +116.1 / +78.0, all on 60th St between Claremont Ave/Hillegass Ave and Colby St (search-c5 p1: +207.5 / +124.9 / +78.0); p2 +113.9 / +52.9 / +58.0 on the same block; p3 +78.2 / +62.5 / +52.0; p4 +70.9 / +53.0 / +47.7; p5 +62.0 / +28.6 / +21.5; p6 +71.7 / +50.3 / +43.7. Through-car blocks with a resolved rise: p1 15, p2 11, p3 18, p4 26, p5 8, p6 36. The finalist screens rejected 8 packages: 7 for unroutable trips and 1 for cars cleared from gridlock (18 against 6). Search-c5 rejected 8, all for unroutable trips.

Compared with search-c5. Unchanged: p1, p3, the no-closures option (search-c5 p4, now p5) and both references. The winners changed for the most-removed, least-detour and fewest-changes goals. The most-removed winner is the new p2, and search-c5 p2 is now a same-picture variant on p2 (distance 0.09). The fewest-changes winner is the new p6, which uses a DD at 63rd St/Hillegass Ave where search-c5 p6 used an MF; search-c5 p6 is listed on p6 as a same-places variant. The least-detour winner is p4, which replaces search-c5 p5; in search-c5, p4 was finalist 21 and was dominated. Dropped: search-c5 p5 (DD 63rd St/Hillegass Ave, MF 63rd St/Colby St, Colby Slow Street).

On the least-detour change, search-c5 p5 is finalist 26 in this run. On the discovery seeds it added 1.7 s per trip at -40.3%, against p4's 3.5 s. It was folded into finalist 10 (three MFs, 4.3 s per trip, same picture), and finalist 10 was not chosen. So the fold step, not the detour comparison, removed it. That may be expected under the rules, since with 3 seeds there is no interval. It is noted in case the fold should keep the lower-detour member for this goal.

### Fresh-seed confirmation

The rule was written by the lead on 2026-11-19, before the run: on seeds 11 to 20 the candidate must be no worse than the baseline on every keep-rule line computed on the same seeds. It confirms on independent seeds and leaves the keep rule in place. The evidence is in `evidence/confirm/` (laptop commit 6c5ff1b).

Mode: `tools/assess.ts` in verdict mode for a non-published set (`--suffix`, no `--diagnostic`, `--publish` or `--noise`), seeds 11 to 20, all three periods, `--jobs 12`. Baseline: suffix r51-confirm-base, config 505dd0f032fc7ae8, hashes 53c823f20d9165ed, 9cdebdabf05c4460, 2f9ae152b9bbf78e, 155 s. Candidate: suffix r51-confirm, config 1080597767aac58c, hashes 53c823f20d9165ed, 5d6be8a70618e905, 7164fa2ab08f612a, membership 74a88c864d406903 and 7d0fdb063236304d, stations identical, 148 s. Both exited 0 on fingerprint d45a275dd7be0713cec6a64394b7d8a9. The baseline was restored afterwards and its three hashes checked. Station sets were identical in every column (92 fitted and 24 held out in the PM peak, 77 and 19 in the AM peak).

| Line | Line to meet | Baseline, seeds 1-10 | Candidate, seeds 1-10 | Baseline, seeds 11-20 | Candidate, seeds 11-20 | Candidate no worse on seeds 11-20? |
| --- | --- | --- | --- | --- | --- | --- |
| PM fitted | 74 | 74 of 92 | 82 of 92 | 75 of 92 | 82 of 92 | yes |
| PM held out | 14 | 14 of 24 | 14 of 24 | 13 of 24 | 14 of 24 | yes |
| AM fitted | 70 | 70 of 77 | 74 of 77 | 71 of 77 | 74 of 77 | yes |
| AM held out | 14 | 14 of 19 | 15 of 19 | 13 of 19 | 16 of 19 | yes |
| D5 PM headline shares, within 10 points | 4 of 4 | 4 of 4 (mean error 4.6) | 4 of 4 (4.1) | 4 of 4 (5.2) | 4 of 4 (3.9) | yes |
| Whole-street traversals (GEH < 5) | 8 of 8 | 8 of 8 | 8 of 8 | 8 of 8 | 7 of 8 | NO |
| D16, AM / midday / PM | holds | holds | holds | holds | holds | yes |

Result: the confirmation does not hold, on one line. The whole-street traversals are 7 of 8 for the candidate against 8 of 8 for the baseline. The failing traversal is PM Colby St southbound: 78 cars an hour modeled (standard error 4.4) against 39 counted, GEH 5.0. The baseline on the same seeds is 58 (standard error 3.5), GEH 2.8. On seeds 1 to 10 the candidate was 75 (GEH 4.8) against the baseline's 57 (GEH 2.5), so the line was already close in round 51's own pass. In the select-link table the candidate's seeds 11 to 20 figure is 78 with a 95% interval of 68 to 88. Every other line holds or improves. The other whole-street rows on the candidate's seeds 11 to 20 have GEH 1.4 (AM Hillegass Ave NB), 2.6 (AM Colby St NB), 0.2 (AM Hillegass Ave SB), 2.5 (AM Colby St SB), 1.6 (PM Hillegass Ave NB), 2.0 (PM Colby St NB) and 0.4 (PM Hillegass Ave SB).

The baseline itself is below the keep-rule line on these seeds for PM held out (13 against a line of 14) and AM held out (13 against 14).

Watched lines, baseline against candidate on seeds 11 to 20:

- PM Hillegass Ave southbound to the freeway share (target 68): 58.5 [55.7, 61.3], 9.5 points low, against 58.1 [55.5, 60.6], 9.9 points low (seeds 1 to 10: 58.1 against 58.9). Both are inside the 10-point band.
- AM Hillegass Ave southbound to the freeway share (target 57): +1.7 points against -1.9 points (seeds 1 to 10: +0.5 against -4.6).
- PM backlog (under 2% in every seed, mean / max): 0.25% / 0.75% against 0.99% / 1.47% (seeds 1 to 10: 0.28% / 0.49% against 1.11% / 1.51%). AM: 0.18% / 0.37% against 0.39% / 0.81%.
- Cars cleared from gridlock near the area, mean per hour (max): PM 0 (0) against 0.1 (1); AM 0 (0) against 0.1 (1). Midday 0 in both.

The two membership files that rebuild the candidate demand were sent as 7 gzip parts, each at most 190,000 bytes, with a SHA256SUMS list, in the same laptop commit 6c5ff1b on the development branch. They are not on main. Both reassembled to the recorded hashes (74a88c864d406903 and 7d0fdb063236304d) when checked.

### Decisions of the project lead (2026-11-19)

- Before the confirmation: publish round 51 only if the fresh-seed check holds. Otherwise record it and come back to it.
- After the check failed: do not adopt it, and keep the published model. The next step is to fit the counted whole-street traversals on the simulator's routes, on top of round 51. They then stop being an independent check, as the route shares did in round 51. The held-out station counts stay independent.

Correction (2026-11-20, added by the lead; the decision above stands as the project lead made it): the question card said the whole-street counts would be added as fit targets and would stop being an independent check. That premise was wrong, and the lead told the project lead so in the same conversation. The four whole-street route stations (`count route 2591>2605`, `2606>2592`, `2676>2670`, `2669>2675`) are already fit targets, with weight `routeWeight` 1.0, in the shipped view and so in the published model, and in rounds 48 to 51 they took simulated membership. The frozen split withholds them from the training view only. Round 51's fit ends at 67 cars an hour for PM Colby Street SB against 39 counted, while the seven counted blocks want 139 to 170 and end at 106 to 132, so the counts conflict inside the fit and the blocks win. Round 52 starts from that reading.

### Verdict

Passed the screen and every line of the keep rule on seeds 1 to 10 (82, 14, 74, 15, D5 4 of 4, whole-street 8 of 8, D16 holds, validation 67 of 74), with the low-demand shortfall reported. It failed the fresh-seed confirmation on seeds 11 to 20 on one line, the whole-street traversals (7 of 8 against the baseline's 8 of 8; PM Colby St southbound 78 against 39 counted, GEH 5.0). Not adopted, by the project lead's decision. The code stays on main with the switches off, the shipped config has neither `gatePriorTotals` nor `simulatedMembership`, and the published data (network 53c823f20d9165ed, demand 9cdebdabf05c4460) are unchanged. The model status stays "Not calibrated". The change is archived.

### Next lead

Fit the counted whole-street traversals on the simulator's routes, on top of round 51. They stop being an independent check, as the route shares did. The held-out station counts stay independent.


## Fiftieth round: simulated membership with ceilings on every origin and destination node (not adopted) (2026-11-19)

Fails the keep rule, not adopted (change calibration-round-50, archived). The published network 53c823f20d9165ed, demand 9cdebdabf05c4460 and cross-validation demand 2f9ae152b9bbf78e stand. Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9 throughout. Nothing under `data/` or `public/data/` changed apart from this record. The evidence is in `openspec/changes/archive/2026-11-19-calibration-round-50/evidence/` (laptop commit b3f4dd0), and the numbers below come from the laptop's final report and its pass-1 note.

### What was tried

Round 49 put ceilings on uncounted gate totals. Those ceilings held: no gate grew and D16 held. The fit then turned 20 to 26% of through demand into local demand, and the laptop's breakdown put none of that growth at a study-area node. It sat at non-gate nodes outside the study area. Round 50 extends the same mechanism with a scope option, `countFit.gatePriorTotals.scope: "allNodes"`, so that every node that is an origin or a destination of any car flow gets a ceiling per direction, not only gates. The settings are the static-fit anchor, tolerance 0, weight 10 (an assumption) and the hard projection. With simulated membership in use, the fit may move trips among pairs but may not add trip ends at any node. The ceilings apply only when simulated membership is in use, so pass 0 reproduces the baseline. The code is in `tools/lib/demand-fit.ts` and `tools/build-demand.ts`, with tests in `tools/node-prior.test.ts`. It is off by default: a missing scope means `gates` (round 49), and the shipped config has no `gatePriorTotals` or `simulatedMembership` entry.

The keep rule, the screen and the loop abort were unchanged from round 49 and written before any run. One line was added: the runbook says to stop and report if, after a final build, offered car demand in any view and period is more than 10% below the static fit (an assumption; with every node capped the fit can only cut, and a large cut would mean it is trading volume for fit). The warning did not fire. The lowest final build was training PM at 90.0% (22,543 of 25,042 veh/h, 9.98% below), just inside the line.

The run was on the project lead's laptop session on 2026-11-19, from 1:58 to 3:29 PM Pacific. The loop took 3,990 s, exited 0, and ran three passes (0, 1, 2) plus the final builds. The stop rule did not fire and the abort did not fire. The config was restored afterward and gave the baseline hashes again.

### Hashes

- Baseline: network 53c823f20d9165ed, shipped demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e. Fingerprint d45a275dd7be0713cec6a64394b7d8a9; vitest 36 of 36.
- Config with the two entries: 7b25783c0235de10 (`apply-candidate.py` added 2 blocks, 14 lines). Dry run as expected: 337, 272, 256 and 201 stations selected (shipped PM and AM, training PM and AM), with 91, 87 and 77 stations withheld by the split (shipped, training PM, training AM).
- Candidate: network 53c823f20d9165ed (identical); shipped demand 0a589118e2ef6719; training demand 26f4b0bd65c74a3c; membership files shipped 994662b2f7280647, training 2854ebafc745f58d. The stations file is identical.
- Pass 0 matched the baseline in both views, at mid-run and at the end (both pass-0 fit reports say "No simulated membership file").
- After the run the restore build gave 53c823f20d9165ed, 9cdebdabf05c4460 and 2f9ae152b9bbf78e, with a clean status.

### Loop behavior

Stations with pairs: shipped PM 335 (passes 0 and 1) and 336 (pass 2), shipped AM 271 of 272, training all. Zero hits: shipped PM sr24-clifton-claremont (passes 0 and 1) and telegraph-51st; shipped AM telegraph-51st. No station lacked an export.

Per pass: offered car demand in veh/h, with its share of the static fit; from pass 1, the change in flow and in membership per station as a ratio to its seed standard error (flow / membership).

| Pass | Shipped PM | Shipped AM | Training PM | Training AM |
| --- | --- | --- | --- | --- |
| 0 | 27612 | 23204 | 25044 | 20584 |
| 1 | 24551 (88.9%); 3.69 / 3.28 | 21528 (92.8%); 4.40 / 2.48 | 22798 (91.0%); 3.88 / 3.01 | 18989 (92.3%); 3.79 / 2.69 |
| 2 | 25018 (90.6%); 1.83 / 1.94 | 21450 (92.4%); 3.08 / 1.35 | 22719 (90.7%); 1.58 / 1.67 | 18874 (91.7%); 1.92 / 1.62 |
| Final | 24953 (90.4%) | 21428 (92.4%) | 22543 (90.0%) | 18895 (91.8%) |

The shipped PM pass-1 figure is below the 10% line, but the warning applies only to final builds.

### Ceiling lines per build

Ceiling stations, gate plus non-gate: shipped PM 1,991 (216 + 1,775), shipped AM 2,034 (217 + 1,817), training PM 1,959 (222 + 1,737), training AM 2,022 (223 + 1,799). Above ceiling after the projection, and the excess, were 0 in every build except the final training PM: 1 gate above, excess 1 veh/h.

Offered car veh/h, static fit to final, by flow type (through, local, ramp); the volume the projection cut (gate / non-gate, veh/h); fitted stations within tolerance, before to after the projection.

Shipped:

| Build | Through | Local | Ramp | Cut by projection | Within tolerance |
| --- | --- | --- | --- | --- | --- |
| PM pass 1 | 5907 to 4943 | 10360 to 8283 | 11342 to 11324 | 66 / 40 | 186 to 187 of 343 |
| PM pass 2 | 5907 to 5209 | 10360 to 8495 | 11342 to 11312 | 105 / 66 | 165 to 159 |
| PM final | 5907 to 5049 | 10360 to 8596 | 11342 to 11309 | 112 / 69 | 172 to 167 |
| AM pass 1 | 3745 to 3558 | 9586 to 8208 | 9871 to 9761 | 44 / 34 | 154 to 150 of 278 |
| AM pass 2 | 3745 to 3546 | 9586 to 8154 | 9871 to 9749 | 54 / 47 | 144 to 144 |
| AM final | 3745 to 3482 | 9586 to 8215 | 9871 to 9731 | 61 / 50 | 143 to 143 |

Training:

| Build | Through | Local | Ramp | Cut by projection | Within tolerance |
| --- | --- | --- | --- | --- | --- |
| PM pass 1 | 2785 to 2809 | 10873 to 8612 | 11384 to 11375 | 141 / 37 | 146 to 146 of 260 |
| PM pass 2 | 2785 to 2851 | 10873 to 8493 | 11384 to 11374 | 190 / 45 | 133 to 132 |
| PM final | 2785 to 2744 | 10873 to 8425 | 11384 to 11373 | 209 / 47 | 132 to 126 |
| AM pass 1 | 2455 to 2526 | 8314 to 6673 | 9813 to 9789 | 69 / 27 | 124 to 126 of 205 |
| AM pass 2 | 2455 to 2441 | 8314 to 6631 | 9813 to 9800 | 53 / 30 | 113 to 113 |
| AM final | 2455 to 2436 | 8314 to 6666 | 9813 to 9793 | 62 / 30 | 114 to 113 |

For comparison, round 49's shipped PM pass 1 was 200 to 198 of 343 within tolerance. The training through type rose in passes 1 and 2 (PM up to 2,851, AM up to 2,526) and ended below the static fit. The worst five nodes per build are in `laptop/ceilings-per-build.md`; node 602 entering (the SR-24 eastbound entry) is first in most PM builds, with 112 veh/h cut from gates in the shipped final. Nodes 577 and 974 also lose large totals.

#### Non-gate trip ends

Final builds, veh/h, static fit to final. These count non-gate nodes only, split by the network's study-area flag.

| View, period | Origins inside | Origins outside | Destinations inside | Destinations outside |
| --- | --- | --- | --- | --- |
| Shipped PM | 951 to 743 | 9523 to 8202 | 734 to 445 | 7901 to 6434 |
| Shipped AM | 612 to 529 | 7488 to 6455 | 528 to 439 | 8211 to 6963 |
| Training PM | 1387 to 1005 | 8768 to 7388 | 881 to 565 | 6740 to 5222 |
| Training AM | 1040 to 866 | 7095 to 6051 | 735 to 561 | 5907 to 4799 |

Every trip-end group fell in every build and none rose.

### Screen, three seeds

Baseline to candidate. PM fitted 73 to 80 of 92, PM held out 14 to 13 of 24, AM fitted 70 to 70 of 77, AM held out 14 to 15 of 19. Gridlock in the judged zone was 0. Backlog was under 2% in 3 of 3 seeds in both periods (mean and max): AM 0.42% and 0.73%; PM 1.08% and 1.28%. The screen passed.

### Keep rule, ten seeds

"Fitted" stations are in the demand fit. "Held out" stations are withheld by the frozen split and scored on the cross-validation demand. Each count is the number of stations that pass GEH on the ten-seed mean. D5 is the four headline freeway shares for Hillegass St and Colby St (within 10 points). Whole-street traversals are the eight street runs checked end to end (within GEH 5). D16 is the stability check: backlog under 2% of trips, no backlog growth, and cars cleared from gridlock in the judged zone within the limit. The baseline is the ten-seed set 60r47-base.

| Line | Line to meet | Baseline | Round 48 | Round 49 | Candidate | Result |
| --- | --- | --- | --- | --- | --- | --- |
| PM fitted | 74 | 74 of 92 | 78 | 81 | 80 of 92 | pass |
| PM held out | 14 | 14 of 24 | 13 | 13 | 13 of 24 | fail |
| AM fitted | 70 | 70 of 77 | 72 | 74 | 72 of 77 | pass |
| AM held out | 14 | 14 of 19 | 15 | 14 | 15 of 19 | pass |
| D5 headline shares | 4 of 4 | 4 (mean error 4.6) | 2 (12.5) | 2 (10.6) | 2 of 4 (mean error 7.8) | fail |
| Whole-street traversals | 8 of 8 | 8 | 8 | 7 | 8 of 8 | pass |
| D16 stability | holds | holds | fails | holds | holds | pass |
| Validation suite | 67 of 74 | 67 | 67 | 67 | 67 of 74 | pass |

D5 detail, PM headline shares, observed against modeled (candidate): Hillegass St northbound from the freeway 47 against 50.6 (ok); Colby St northbound from the freeway 47 against 46.3 (ok); Hillegass St southbound to the freeway 68 against 51.3 (-16.7, fails); Colby St southbound to the freeway 45 against 34.7 (-10.3, just outside the 10-point band, fails).

Whole-street: PM Colby St southbound, modeled 70 veh/h against 39 observed, GEH 4.2, inside the line (round 49 was 81, GEH 5.5).

D16 detail. PM: backlog under 2% in 10 of 10 seeds (mean 1.11%, max 1.38%); cars cleared from gridlock in the judged zone 0.00 per hour. AM: 10 of 10 (mean 0.37%, max 0.73%). Midday holds.

### Reported lists

Baseline to candidate, shipped view (training view in brackets). These are reported, not conditions.

- Offered car demand totals, veh/h: PM 27612 to 24954 [25044 to 22543]; AM 23204 to 21428 [20584 to 18896].
- Five diagonal stations, PM, counted 178: simulated sum 495 to 357 [1234 to 464]; simulated over counted 2.78 to 2.01 [6.93 to 2.61]. By station, with the count: Forest St EB 183 to 115 (66); McAuley St EB 83 to 62 (12); 60th St EB 76 to 62 (23); Ayala Ave NB 81 to 52 (60); Howell St SB 72 to 68 (17). AM, counted 110: 206 to 171 [428 to 365].
- Colby St northbound, simulated over counted: PM 0.75 to 0.81 [0.77 to 0.92]; AM 0.73 to 0.77 [0.87 to 0.82].
- Through cars in the study area, per hour: PM 729 to 796 [1019 to 905]; AM 447 to 447 [549 to 559].
- SR-24 mainline, PM: node 602 entry offered 3945 to 3940, flow 3896 to 3742, trips waiting 46 to 192 [48 to 208]; node 1719 unchanged; node 675 exit flow 3770 to 3730; node 1726 exit flow 710 to 681. AM: node 602 waiting 4 to 24; node 675 exit flow 3152 to 3088; node 1726 exit flow 823 to 753.
- SR-24 ramps, PM, against the target, shipped [training]: Claremont on (598) 773 to 693 [975 to 873]; Clifton off (617) 697 to 715 [943 to 881]; 52nd on (996) 968 to 906 [1054 to 1040]; 52nd off (1024) 1029 to 1001; MLK on (1547) 1266 to 1470 [1014 to 1152]; MLK off (1614) 1512 to 1527; node 280 (190) 282 to 249 [532 to 639]; Telegraph on, node 701 (657) 906 to 983 [1272 to 1307]; Aileen off, node 702 (621) 724 to 730 [646 to 766]. The AM rows are in `laptop/compare.md`.
- Travel times inside the observed range: 7 of 12 to 5 of 12. PM Telegraph Ave southbound 335 to 411 s (range 300 to 376, now too slow); AM Shattuck Ave southbound 176 to 218 s (range 147 to 201, now too slow); PM College Ave northbound 282 s and southbound 220 s, still inside. All rows are in `laptop/travel-times.md`.
- The 20 gates: none grew by more than 1 veh/h in any view or period. The largest cuts, offered veh/h (origin/destination where both moved): shipped PM, 288 174/150 to 82/127; 577 178/417 to 152/147; 974 924 to 836; 973 destination 1126 to 1051; 943 1194/990 to 1175/942; 184 destination 771 to 744. Shipped AM: 288 266 to 163; 952 101 to 69; 1726 destination 818 to 750; 675 destination 3159 to 3092; 973 destination 816 to 773. Training PM: 577 422/356 to 229/229; 974 1071 to 874. Training AM: 577 306 to 197; 1398 destination 139 to 89. Full tables are in `laptop/gates20.txt`, `laptop/gates-pm.md` and `laptop/gates-am.md`.

### Node breakdown

From `scripts/nodes.cjs`, run as written on the saved copies of the final demand files (`target/r50/demand.cand*.json`), since the restore had already run. Change from the baseline, veh/h:

- Local flow type: shipped PM -1765, shipped AM -1372, training PM -2448, training AM -1648.
- Non-gate origins: shipped PM inside -208, outside -1321; shipped AM inside -83, outside -1033.
- Non-gate destinations: shipped PM inside -289, outside -1468; shipped AM inside -89, outside -1249.
- No non-gate node gained: the top-15 gain lists are all +0.
- Local flows by their ends, shipped PM: gate to outside -834; outside to gate -617; outside to outside -216; inside to outside -48; gate to inside -37; outside to inside -36; inside to inside -1; inside to gate +24, the only group that rose.
- Local flows by their ends, shipped AM, all groups fell: outside to gate -567; gate to outside -422; outside to outside -278; inside to gate -35; inside to outside -29; outside to inside -23; gate to inside -17; inside to inside 0.

### Shares

From `scripts/shares.cjs`, PM, ten-seed means, cars per hour, baseline to candidate [training].

| Block | All southbound trips | To the freeway | Not to the freeway | Share to the freeway |
| --- | --- | --- | --- | --- |
| Hillegass St SB | 209.0 to 204.6 [278.9 to 206.0] | 121.4 to 105.3 [148.8 to 119.1] | 87.6 to 99.3 | 58.1% to 51.3% |
| Colby St SB | 257.6 to 222.2 [366.4 to 236.5] | 106.1 to 77.1 [102.6 to 83.3] | 151.5 to 145.1 | 41.4% to 34.7% |

Colby St SB whole-street: 56.5 to 69.6 [50.2 to 62.5]; through trips on any link 126.7 to 152.2; freeway trips 112.2 to 77.3. On Colby St SB the to-freeway cars fell further than in round 49 (83.1 there), while the cars not headed to the freeway stayed level.

### Trips waiting by gate

Trips still waiting at the end of the run, seed mean, baseline to candidate. All origins: PM 78 to 276, AM 27 to 79.

| Gate | PM baseline | PM candidate | AM baseline | AM candidate |
| --- | --- | --- | --- | --- |
| 602 | 46 | 192 | 4 | 24 |
| 183 | 14 | 0 to 1.4 | 0 to 0.2 | 0 |
| 1756 | 0 to 1 | 48 | 18 | 50 |
| 1398 | 0 to 1 | 5.5 to 6.2 | 0 to 0.1 | 0.1 |

A gate missing from a seed's top-10 backlog table is given as a range, 0 at the low end and the tenth row at the high end (`laptop/backlog-gates.md`). No seed was rerun for these; a run is deterministic per seed.

### Reading (the lead's reading, 2026-11-19)

The node ceilings did what they were for. No trip end grew anywhere. Colby St southbound whole-street is back inside the line at 70 against 39 observed, the diagonal fell from 495 to 357 against 178 counted, and D16 holds. The cost is 8 to 10% of offered car demand.

Three rounds in a row (48, 49 and 50) end with PM held out at 13 of 24 and D5 at 2 of 4, with the two southbound to-freeway shares low, whatever is done to totals. In all three, the to-freeway cars on Colby St southbound fall (106.1 to 77.1 here), the Claremont Ave on-ramp moves toward its count (773 to 693, counted 598), and trips waiting at the SR-24 eastbound entry gate rise with unchanged offered volume (46 to 192).

The observed route shares are themselves fit targets (`countFit.shares`, and the through-car targets of round 39). In the round 48 to 50 candidates the observed route shares were balanced on the static assignment's sampled routes (`tools/lib/share-targets.ts`, `routeShareTally`; it never reads the simulated membership), and the through-car targets kept static membership because the loop writes no hits for them (round 48 design D12). The stations that `calibrate --select-od` exports took simulated membership; gate totals, the four training-only ramp stand-ins, stations with zero simulated hits, midday and pass 0 stayed static. So the fit balanced the shares on routes the simulator does not use. That this mismatch is why the two southbound to-freeway shares fall is the lead's hypothesis, not a finding. Nothing in this run tests it.

### Verdict

Fails the keep rule on two lines: PM held out 13 of 24 (line 14) and D5 headline shares 2 of 4 (line 4 of 4). Whole-street traversals are 8 of 8 and D16 holds. Not adopted. The code stays on main with the switch off, and the shipped config has no `gatePriorTotals` or `simulatedMembership` entry. The published data are unchanged. The change is archived with its evidence.

### Next lead

Give the select-link share constraints and the through-car targets simulated membership from the same `--select-od` block export, inside the loop with the node ceilings. Ramp via-street shares stay static: nothing exports them per pair.

## Forty-ninth round: simulated membership with ceilings on uncounted gate totals (not adopted) (2026-11-19)

Fails the keep rule, not adopted (change calibration-round-49, archived). The published network 53c823f20d9165ed, demand 9cdebdabf05c4460 and cross-validation demand 2f9ae152b9bbf78e stand. Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9 throughout. Nothing under `data/` or `public/data/` changed apart from this record. The evidence is in `openspec/changes/archive/2026-11-19-calibration-round-49/evidence/` (laptop commits ed7cb9e and ce4139e), and the numbers below come from the laptop's report and its two notes during the run.

### What was tried

Round 48 ran the simulated-membership loop, and its fit added 1,200 to 2,100 veh/h of car demand at gates with no count. That demand queued at the SR-24 eastbound entry and the Claremont gates and failed D16. Round 49 ran the same loop with a ceiling on each uncounted gate direction. The switch is `countFit.gatePriorTotals` (`tools/lib/demand-fit.ts`, `tools/lib/fit-counts.ts`, `tools/build-demand.ts`). It is absent from the shipped config, so it is off by default, as is `simulatedMembership`. The keep rule, the screen and the loop abort were written before any run.

- First design: the ceiling was each gate's own total before the fit, plus 10%. Container builds showed that anchor sits above what the static fit gives (SR-24 eastbound entry, node 602, PM: 3,945 final in the baseline against a ceiling of 5,139, where round 48 had reached 4,114). The ceiling stations also made the flows at uncovered gates count as touching a count, so those flows escaped the median rule and regrew (the training view rose 5.2% in the PM). The project lead moved the anchor to the static fit.
- Final design: with simulated membership in use, the fit first runs as the baseline does and takes each uncovered gate direction's car total from that result. It then runs again with simulated membership and a ceiling station per direction at that total (tolerance 0). The ceiling's weight is 10 (five times the ramp weight), an assumption. With no membership file in use (pass 0, midday) no ceilings apply, so pass 0 reproduces the baseline.
- Hard projection: in a check with made-up membership, the soft ceiling at weight 10 left node 602 at 4,165 against a ceiling of 3,944 (+5.6%). After the fit converges, the fit now scales down any ceiling gate direction still more than 0.1% over its ceiling, alternating over origin and destination sides, so each ends at its ceiling.
- Loop abort: after each build from pass 1, the driver stops if offered car demand in any view and period exceeds the static fit's by more than 3% (an assumption; round 48 failed at +4.4% to +9.0%).
- Screen addition: the screen also fails if the end-of-run backlog is 2% or more in any of the three seeds, AM or PM. Round 48's screen passed while ten seeds failed on backlog.

The run was on the project lead's laptop session on 2026-11-19. Steps A to C ran 11:39 to 11:50 AM Pacific. The loop took 3,948 s and ended with exit 0, and the whole run ended at 1:11 PM. The config was restored afterward and gave the baseline hashes again.

#### The restart

The first loop start was stopped about one minute in, before any seed ran, because round 48's loop files were still on disk (`target/membership-loop/` and `target/membership/*.json`). Without `--resume` the driver started a fresh state file but did not clear the folder. Passes 1 and 2 would have run their seeds on round 48's demand, and the pass-0 build would have read round 48's membership files. The laptop moved both folders to `target/r48-loop/` and restarted at 11:51 AM with the same config hash. Its first pass-0 check had compared round 48's leftover files and proved nothing, so it was redone on the new builds (true for both views, at mid-run and at the end). The driver now refuses to start without `--resume` when either exists (commit 1f9409d); it deletes nothing.

### Hashes

- Baseline: network 53c823f20d9165ed, shipped demand 9cdebdabf05c4460, training demand 2f9ae152b9bbf78e. Ten-seed baseline set 60r47-base, same inputs.
- Gate checks: fingerprint d45a275dd7be0713cec6a64394b7d8a9; `npx vitest run` on the gate-prior and membership-loop tests 32 of 32; nothing changed under `data/`.
- Config with the two entries: 99f6e16a372c7df3 (`apply-candidate.py` added 2 blocks, 13 lines).
- Candidate: network 53c823f20d9165ed (identical); shipped demand 93b8cef7ecaa5df5; training demand 0dc1dbdeefa03203; membership files shipped b625cdb060d12258, training a6bc6aff8bdbaeed. The stations file is identical.
- After the run the config was restored; the restore build gave 53c823f20d9165ed, 9cdebdabf05c4460 and 2f9ae152b9bbf78e.

### Loop behavior

The dry run matched the runbook. The split withholds 91 stations. Shipped view: PM 337 stations selected (245 link, 92 movement or route), AM 272 (200, 72), six gate stations static in each. Training view: PM 256 (187, 69) with 87 withheld, AM 201 (148, 53) with 77 withheld.

Three passes ran (0, 1, 2) plus the final builds. The stop rule did not fire: the flow and membership changes are still 1.72 to 2.32 standard errors in pass 2 for the PM and 1.79 to 2.62 for the AM, above the threshold of 1. The abort did not fire either: no build went above its static fit. Stations with pairs: shipped PM 335 of 337 in passes 0 and 1 and 336 in pass 2, shipped AM 271 of 272, training all. Zero hits: shipped PM sr24-clifton-claremont 1600>1771 (passes 0 and 1) and telegraph-51st 1629>1764; shipped AM telegraph-51st; training none. No station lacked an export.

Per pass: offered car demand in veh/h; from pass 1, the change in flow and in membership per station as a ratio to its seed standard error (flow / membership).

| Pass | Shipped PM | Shipped AM | Training PM | Training AM |
| --- | --- | --- | --- | --- |
| 0 | 27612 | 23204 | 25044 | 20584 |
| 1 | 26349; 4.24 / 3.55 | 22926; 4.23 / 3.45 | 24623; 3.87 / 3.40 | 20026; 3.32 / 3.25 |
| 2 | 26917; 1.91 / 2.32 | 23130; 2.62 / 1.97 | 24903; 1.72 / 2.05 | 19999; 1.79 / 1.95 |
| Final demand file | 26990 | 23187 | 24952 | 20328 |

### Ceiling lines per build

Offered car veh/h, static fit to final; then by flow type (through, local, ramp) static fit to final; the volume the projection removed (veh/h); and fitted stations within tolerance, before to after the projection. Ceiling stations: shipped 216 PM and 217 AM, training 222 PM and 223 AM. Above ceiling after the projection: 1 station by 1 veh/h in pass 1 of the shipped AM, 1 by 1 in the final training PM, none elsewhere.

| Build | Total | Through | Local | Ramp | Removed | Within tolerance |
| --- | --- | --- | --- | --- | --- | --- |
| Shipped PM, pass 1 | 27609 to 26347 | 5907 to 4429 | 10360 to 10581 | 11342 to 11338 | 49 | 200 to 198 of 343 |
| Shipped PM, pass 2 | 27609 to 26916 | 5907 to 4483 | 10360 to 11094 | 11342 to 11339 | 70 | 182 to 184 |
| Shipped PM, final | 27609 to 26988 | 5907 to 4460 | 10360 to 11189 | 11342 to 11339 | 77 | 175 to 175 |
| Shipped AM, pass 1 | 23202 to 22925 | 3745 to 3216 | 9586 to 9863 | 9871 to 9846 | 27 | 175 to 174 of 278 |
| Shipped AM, pass 2 | 23202 to 23128 | 3745 to 3056 | 9586 to 10226 | 9871 to 9846 | 46 | 164 to 163 |
| Shipped AM, final | 23202 to 23186 | 3745 to 3048 | 9586 to 10290 | 9871 to 9849 | 41 | 162 to 162 |
| Training PM, pass 1 | 25042 to 24621 | 2785 to 2062 | 10873 to 11200 | 11384 to 11360 | 73 | 156 to 156 of 260 |
| Training PM, pass 2 | 25042 to 24901 | 2785 to 2236 | 10873 to 11314 | 11384 to 11351 | 151 | 150 to 151 |
| Training PM, final | 25042 to 24951 | 2785 to 2116 | 10873 to 11475 | 11384 to 11360 | 154 | 150 to 150 |
| Training AM, pass 1 | 20582 to 20024 | 2455 to 1943 | 8314 to 8340 | 9813 to 9741 | 9 | 132 to 132 of 205 |
| Training AM, pass 2 | 20582 to 19997 | 2455 to 1897 | 8314 to 8315 | 9813 to 9785 | 18 | 120 to 119 |
| Training AM, final | 20582 to 20327 | 2455 to 2176 | 8314 to 8356 | 9813 to 9795 | 117 | 108 to 110 |

Each static-fit total here is 2 to 3 veh/h below the pass-0 offered figure in the demand file (for example 27609 against 27612). The laptop did not trace the difference.

Total offered demand stays below the static fit in every build. Through demand falls 20 to 26% in the shipped view. Local demand rises: +829 veh/h in the shipped PM, +704 in the shipped AM, +602 in the training PM, +42 in the training AM. Fitted stations within tolerance fall over the passes in every view, for example 200 to 175 of 343 in the shipped PM. The worst five gates per build and the final per-gate dumps are in the evidence (`laptop/ceilings-per-build.md`, `gate-prior/`).

### Screen, three seeds

Baseline to candidate. PM fitted 73 to 85 of 92, PM held out 14 to 12 of 24, AM fitted 70 to 71 of 77, AM held out 14 to 16 of 19. Gridlock in the judged zone was 0 in both periods. Backlog was under 2% in 3 of 3 seeds in both periods (mean and max): AM 0.13% and 0.21% to 0.54% and 0.78%; PM 0.30% and 0.49% to 1.56% and 1.96%. The PM maximum sits just under the line. The screen passed.

### Keep rule, ten seeds

"Fitted" stations are in the demand fit. "Held out" stations are withheld by the frozen split and scored on the cross-validation demand. Each count is the number of stations that pass GEH on the ten-seed mean. D5 is the four headline freeway shares for Hillegass St and Colby St (within 10 points). Whole-street traversals are the eight street runs checked end to end (within GEH 5). D16 is the stability check: backlog under 2% of trips, no backlog growth, and cars cleared from gridlock in the judged zone within the limit. The baseline is the ten-seed set 60r47-base.

| Line | Line to meet | Baseline | Round 48 | Candidate | Result |
| --- | --- | --- | --- | --- | --- |
| PM fitted | 74 | 74 of 92 | 78 | 81 of 92 | pass |
| PM held out | 14 | 14 of 24 | 13 | 13 of 24 | fail |
| AM fitted | 70 | 70 of 77 | 72 | 74 of 77 | pass |
| AM held out | 14 | 14 of 19 | 15 | 14 of 19 | pass |
| D5 headline shares | 4 of 4 | 4 of 4 (mean error 4.6) | 2 (12.5) | 2 of 4 (mean error 10.6) | fail |
| Whole-street traversals | 8 of 8 | 8 of 8 | 8 of 8 | 7 of 8 | fail |
| D16 stability | holds | holds | fails AM and PM | holds in every period | pass |
| Validation suite | 67 of 74 | 67 of 74 | 67 | 67 of 74 | pass |

D5 detail, PM headline shares, observed against modeled (candidate): Hillegass St northbound from the freeway 47 against 52.6 (ok); Colby St northbound from the freeway 47 against 50.4 (ok); Hillegass St southbound to the freeway 68 against 48.6 (-19.4, fails); Colby St southbound to the freeway 45 against 31.0 (-14.0, fails).

Whole-street failure: PM Colby St southbound, modeled 81 veh/h against 39 observed, GEH 5.5. The baseline modeled 57, GEH 2.5.

D16 detail. PM: backlog under 2% in 10 of 10 seeds (mean 1.33%, max 1.96%); cars cleared from gridlock in the judged zone 0.20 per hour (max 2.00 in one seed). AM: 10 of 10 (mean 0.43%, max 0.78%). Midday: 10 of 10.

### Reported lists

Baseline to candidate, shipped view (training view in brackets). These are reported, not conditions.

- Five diagonal stations, PM, counted 178: simulated sum 495 to 355 [1234 to 492]; simulated over counted 2.78 to 2.00 [6.93 to 2.77]. By station, with the count: Forest St EB 183 to 113 [516 to 170] (66); McAuley St EB 83 to 60 (12); 60th St EB 76 to 62 (23); Ayala Ave NB 81 to 61 (60); Howell St SB 72 to 60 (17). AM, four stations, counted 110: 206 to 175 [428 to 293].
- Colby St northbound, simulated over counted on the seven blocks with counts: PM 0.75 to 0.77 [0.77 to 1.01]; AM 0.73 to 0.77 [0.87 to 0.86].
- SR-24 mainline, PM: node 602 entry offered 3945 to 3943, flow 3896 to 3707, trips waiting 46 to 168 in 10 of 10 seeds [training 48 to 153]; node 1719 entry 947 to 947, flow 948 to 949, waiting 0; node 675 exit flow 3770 to 3683; node 1726 exit flow 710 to 670. AM: node 602 waiting 4 to 16; node 675 exit flow 3152 to 3156; node 1726 exit flow 823 to 800.
- Through cars in the study area, per hour: PM 729 to 852 [1019 to 986]; AM 447 to 425 [549 to 512].
- SR-24 ramps, PM, against the target, shipped [training]: Claremont on (598) 773 to 692 [975 to 844]; Clifton off (617) 697 to 723 [943 to 882]; 52nd on (996) 968 to 916 [1054 to 955]; 52nd off (1024) 1029 to 995; MLK on (1547) 1266 to 1438 [1014 to 1082]; MLK off (1614) 1512 to 1522; node 280 (190) 282 to 265 [532 to 705]; Telegraph on, node 701 (657) 906 to 1021 [1272 to 1300]; Aileen off, node 702 (621) 724 to 731. The AM and the other ramps are in `laptop/compare.md`.
- Travel times inside the observed range: 7 of 12 to 6 of 12. PM Telegraph Ave southbound 335 to 475 s (range 300 to 376, now too slow); PM College Ave northbound 236 to 305 s and southbound 216 to 283 s, both still inside. AM inside: Telegraph Ave northbound, Shattuck Ave southbound, College Ave southbound. All rows are in `laptop/travel-times.md`.
- The 20 gates that grew most in round 48, offered veh/h, shipped PM, only those that changed (origin/destination where both moved): 577 178/417 to 116/142; 974 924 to 778; 952 171 to 159; 288 174/150 to 116/143; 8 destination 253 to 234; 973 destination 1126 to 1003; 184 destination 771 to 664; 943 1194/990 to 1069/857; 1672 660 to 659; 183 1023 to 1021; 602 3945 to 3943; 675 3778 to 3776; 1674 destination 1305 to 1306. Nodes 1398, 1756, 276, 1719, 1219, 1726 and 275 are unchanged. None of the 20 grew by more than 1 veh/h in any view or period (`laptop/gates20.txt`; all 123 gates in `laptop/gates-pm.md` and `laptop/gates-am.md`).

### Trips waiting by gate

Trips still waiting at the end of the run, seed mean, baseline to candidate. All origins: PM 78 to 355, AM 27 to 99.

| Gate | PM baseline | PM candidate | AM baseline | AM candidate |
| --- | --- | --- | --- | --- |
| 602 | 46 | 168 | 4 | 16 |
| 183 | 14 | 0 to 4 | 0 to 0.2 | 0 to 0.1 |
| 1756 | 0 to 1 | 81 | 18 | 69 |
| 1398 | 0 to 1 | 12 to 14 | about 0 | about 0 |

A gate missing from a seed's top-10 backlog table is given as a range, 0 at the low end and the tenth row at the high end (`laptop/backlog-gates.md`). No seed was rerun for these.

### Reading (the lead's reading, 2026-11-19)

The ceilings did their job. No gate grew (none of the 20 by more than 1 veh/h), D16 holds in every period, the diagonal fell from 495 to 355 against 178 counted, PM fitted rose to 81 and AM fitted to 74.

The fit, though, turned 20 to 26% of through demand into local demand (+829 veh/h shipped PM, +704 shipped AM). Fitted stations within tolerance inside the fit fell over the passes (shipped PM 200 to 175 of 343), and the stop rule did not fire, so the loop has not converged.

The laptop's breakdown of the growth (`laptop/nodes50-shipped.md`, `nodes50-training.md`, `shares50-pm.md`) shows where it sits. All of it is at non-gate nodes outside the study area: in the shipped PM, flows from outside nodes to gates rose by 480 veh/h, flows between two outside nodes by 339 and flows from gates to outside nodes by 102, while flows touching a study-area node fell by 93. Many of those nodes grew from almost nothing (node 1210, Hillegass Ave and Woolsey St, as an origin: 1 to 92 veh/h). On Colby St southbound, cars not headed to the freeway rose from 151.5 to 187.2 per hour and cars headed to it fell from 106.1 to 83.1, and the extra whole-street cars mostly turned in from Alcatraz Ave. The link from the added trip ends to the Colby St southbound overshoot is an inference from these tables; no trip was traced from its origin to the block.

Trips waiting at Claremont Ave (node 1756) rose from about 0 to 81 in the PM and from 18 to 69 in the AM with an unchanged gate total (412 and 567 in the PM, 487 and 428 in the AM). The ceilings hold the totals but not the queue, so the queue there comes from routing inside the network, not from offered volume.

### Verdict

Fails the keep rule on three lines: PM held out 13 of 24 (line 14), D5 2 of 4 (line 4), and whole-street traversals 7 of 8 (line 8 of 8, PM Colby St southbound). Not adopted. The code stays on main with the switch off, and the shipped config has no `gatePriorTotals` or `simulatedMembership` entry. The published data are unchanged. The change is archived with its evidence.

### Next lead

Run the same loop with ceilings on every origin and destination node total, not only gates, anchored on the static fit. The fit can then move trips among pairs but cannot convert through demand into local demand.

## Forty-eighth round: simulated membership for every exported station (not adopted) (2026-11-19)

Fails the keep rule, not adopted (change calibration-round-48, archived). The published network 53c823f20d9165ed, demand 9cdebdabf05c4460 and cross-validation demand 2f9ae152b9bbf78e stand. Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9 throughout. Nothing under `data/` or `public/data/` changed apart from this record. The evidence is in `openspec/changes/archive/2026-11-19-calibration-round-48/evidence/` (laptop commits 534e31d and 71ce359), and the numbers below come from the laptop's report.

### What was tried

The demand fit decides which origin-destination pairs count toward each station from a static route assignment. This round used the simulator's own route choice instead. A loop runs the simulator for ten seeds, records which pairs actually pass each exported station, and refits demand with those pairs as the membership. The switch is `countFit.throughTargets.simulatedMembership` (`tools/membership-loop.ts`, `tools/lib/membership-loop.ts`). It is absent from the shipped config, so it is off by default. The through-car targets and the hand-picked `measuredStations` list stay as they are while the entry is present (design D12). The keep rule (D7), the screen and the stop rule (D11) were written before any run.

The run was on the project lead's laptop session on 2026-11-19, runbook steps A to G, 8:29 to 9:43 AM Pacific, starting at 816c7b5. Step H (the loop again with the prior worth 20 trips) was not run. During the run HEAD moved to 5cebe93 through round 47 evidence commits and a re-sign; no code changed.

### Hashes

- Baseline (the round 47 ten-seed set 60r47-base, inputs identical to this round's baseline): network 53c823f20d91, demands 9cdebdabf05c and 2f9ae152b9bb, stations c9db41c930ac, split be72380b485e, targets 9d1d593d3d35, simulator d45a275dd7be. It reproduces 74 of 92, 14 of 24, 70 of 77 and 14 of 19, and D5 at 4 of 4 (mean error 4.6).
- Gate checks: fingerprint d45a275dd7be0713cec6a64394b7d8a9; `npx vitest run tools/membership-loop.test.ts` 20 of 20; baseline hashes 53c823f20d9165ed, 9cdebdabf05c4460 and 2f9ae152b9bbf78e; nothing changed under `data/`.
- Config with the entry: b74e86f898dd3a8f.
- Candidate: network 53c823f20d9165ed (identical); shipped demand 1771a9c4a51968c6; training demand 83396aeb2a4b1b63; membership files shipped 8f11b43838d3134d, training b99c26686c4c0cfc. After the run both views were rebuilt from the saved membership files with the same config hash and gave 1771a9c4a51968c6 and 83396aeb2a4b1b63 again.

### Loop behavior

The dry run matched the runbook. The split withholds 91 of 357 stations. Shipped view: PM 337 stations (245 link, 92 movement or route), AM 272 (200, 72), with the six gate stations static in each. Training view: PM 256 (187, 69), AM 201 (148, 53), none static.

Three passes ran (0, 1, 2). The stop rule did not fire: after pass 2 the ratios of change to standard error are still 1.74 to 2.87 in every view and period, against a threshold of 1. Every build after pass 0 printed the simulated-membership note, and no station lacked an export in any pass. The final fit reports say "30 runs": shipped PM 336 of 343 stations, shipped AM 271 of 278, training PM 256 of 260, training AM 201 of 205. Those counts are what is left after the zero-hit stations are removed. Pass 0 reproduced the baseline demand periods in both views.

Per pass: offered car demand in veh/h; stations with pairs; stations with zero hits; then, from pass 1, the change in flow and in membership per station as a ratio to its standard error (flow / membership).

| View, period | Pass 0 | Pass 1 | Pass 2 |
| --- | --- | --- | --- |
| Shipped PM | 27612; 335 of 337; zero hits: sr24-clifton-claremont move 1600>1771, telegraph-51st move 1629>1764 | 28169; 335 of 337; same two; 3.84 / 3.79 | 29107; 336 of 337; telegraph-51st; 2.17 / 2.80 |
| Shipped AM | 23204; 271 of 272; telegraph-51st | 24819; 271 of 272; telegraph-51st; 4.44 / 3.68 | 24861; 271 of 272; telegraph-51st; 2.25 / 2.22 |
| Training PM | 25044; 256 of 256; none | 25428; 256 of 256; none; 3.74 / 3.82 | 26455; 256 of 256; none; 1.86 / 2.87 |
| Training AM | 20584; 201 of 201; none | 21407; 201 of 201; none; 2.77 / 3.45 | 21755; 201 of 201; none; 1.74 / 2.60 |

### Keep rule, ten seeds

"Fitted" stations are in the demand fit. "Held out" stations are withheld by the frozen split and scored on the cross-validation demand. Each count is the number of stations that pass GEH on the ten-seed mean. D5 is the four headline freeway shares for Hillegass St and Colby St. Whole-street traversals are the eight street runs checked end to end. D16 is the stability check: backlog under 2% of trips, no backlog growth, and cars cleared from gridlock in the judged zone within the limit.

| Line | Baseline | Candidate | Line to meet | Result |
| --- | --- | --- | --- | --- |
| PM fitted | 74 of 92 | 78 of 92 | 74 | pass |
| PM held out | 14 of 24 | 13 of 24 | 14 | fail |
| AM fitted | 70 of 77 | 72 of 77 | 70 | pass |
| AM held out | 14 of 19 | 15 of 19 | 14 | pass |
| D5 headline shares | 4 of 4, mean error 4.6 | 2 of 4, mean error 12.5 | 4 of 4 | fail |
| Whole-street traversals | 8 of 8 | 8 of 8 | 8 of 8 | pass |
| D16 stability, every period | holds | fails in AM and PM (midday holds) | holds | fail |
| Validation suite | 67 of 74 | 67 of 74 | 67 | pass |

D5 detail, observed / baseline / candidate: Hillegass St southbound to the freeway 68 / 58.1 / 43.8 (fails); Colby St southbound to the freeway 45 / 41.4 / 29.0 (fails); Hillegass St northbound from the freeway 47 / 48.4 / 52.7; Colby St northbound from the freeway 47 / 50.5 / 51.3.

D16 detail. The failure is backlog, not gridlock.

- PM: backlog under 2% in 0 of 10 seeds (mean 2.97%, max 3.36%), baseline 10 of 10 (mean 0.28%, max 0.49%). Backlog growth fails in seeds 3 and 9. Cars cleared from gridlock in the judged zone: 0.50 per hour (max 3), under the limit; in all zones 29.0 per hour against 4.8. Arterial speed 6.71 against 7.94 m/s.
- AM: backlog under 2% in 7 of 10 seeds (mean 1.87%, max 2.35%), baseline 10 of 10 (mean 0.11%). Arterial speed 7.72 against 8.97 m/s.

Trips still waiting at the end of the run, seed mean, baseline to candidate:

| Period | Where | Baseline | Candidate |
| --- | --- | --- | --- |
| PM | all | 78 | 830 |
| PM | SR-24 eastbound entry (node 602) | 46 | 270 |
| PM | San Pablo Ave (node 183) | 14 | 229 |
| PM | Claremont Ave (node 1756) | about 0 | 142 |
| PM | Claremont Blvd (node 1398) | about 0 | 55 |
| AM | all | 27 | 464 |
| AM | Claremont Blvd (node 1398) | about 0 | 219 |
| AM | Claremont Ave (node 1756) | 18 | 178 |

Screen, three seeds: baseline PM 73 of 92 and 14 of 24, AM 70 of 77 and 14 of 19, judged gridlock 0 and 0; candidate PM 80 of 92 and 12 of 24, AM 73 of 77 and 15 of 19, judged gridlock 0 and 0. The screen passed (PM held out down 2, within the allowed 3). It does not measure backlog, so it could not show the failure the ten-seed run found.

### Why it failed

The loop added 1,200 to 2,100 veh/h of car demand at gates that have no count. Offered demand in the demand files, car veh/h, baseline to final candidate:

| Period, view | Total | SR-24 EB entry (602), origin | SR-24 WB entry (1719), origin | SR-24 WB exit (675), destination | SR-24 EB exit (1726), destination | Surface gates, origin | Surface gates, destination |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PM shipped | 27612 to 28816 (+4.4%) | 3945 to 4114 | 947 to 1232 | 3778 to 3949 | 709 to 854 | 11585 to 12174 | 13184 to 13819 |
| PM training | 25044 to 26891 (+7.4%) | 4112 to 4368 | 753 to 700 | 4156 to 4331 | 891 to 1119 | 9453 to 10210 | 11473 to 12390 |
| AM shipped | 23204 to 25301 (+9.0%) | 3656 to 3676 | 337 to 844 | 3159 to 3366 | 818 to 831 | 10289 to 11362 | 9406 to 10846 |
| AM training | 20584 to 21936 (+6.6%) | 3696 to 3730 | 376 to 746 | 3859 to 4147 | 765 to 834 | 7930 to 9132 | 8644 to 9411 |

The fit report's counted gate families stay on target: in the PM, gate entering is 2214 to 2213 against a target of 2200, and gate leaving is 2111 to 2121 against 2076. The extra demand sits at gates with no count: the SR-24 mainline entries and exits, San Pablo Ave, and Claremont Ave and Blvd.

The SR-24 eastbound entry (node 602) cannot carry it. Its simulated PM flow went from 3896 to 3819 veh/h (shipped) and from 4050 to 3994 (training), while trips waiting there rose from 46 to 270 and from 48 to 338. The mainline takes no more than about 3,900 veh/h, so the extra offered demand queues. In the AM the flow there was 3670 to 3680 and the wait 4 to 12. The Claremont gates queue the same way. The backlog fails D16 in both peaks, slows Telegraph Ave southbound (PM 335 to 510 s, observed 300 to 376) and College Ave southbound (PM 216 to 323 s, observed 202 to 293), and moves the two southbound freeway shares out of D5.

Mean through cars per hour on the study area's residential and service streets (per-seed calibrate report): PM shipped 729 to 944, training 1019 to 1080; AM shipped 447 to 466, training 549 to 532.

### What improved

- Fitted counts: PM 74 to 78 of 92, AM 70 to 72 of 77. Older counts, which are not conditions: AM fitted 35 to 40 of 48, AM held out 8 to 14 of 16, PM fitted 55 to 65 of 95, PM held out 16 to 12 of 34.
- The diagonal. Five diagonal stations, PM, counted 178 (Forest St EB 66, McAuley St EB 12, 60th St EB 23, Ayala Ave NB 60, Howell St SB 17). The simulated sum went from 495 to 462 in the shipped view and from 1234 to 651 in the training view. Per station, baseline shipped and training, then candidate shipped and training: Forest St 183, 516 then 151, 260; McAuley St 83, 183 then 78, 99; 60th St 76, 162 then 80, 83; Ayala Ave 81, 212 then 73, 129; Howell St 72, 162 then 80, 80. AM, four stations, counted 110: 206 and 428 (baseline shipped, training) to 165 and 341.
- Colby St northbound, simulated over counted, on the seven northbound blocks with counts (2591, 2593, 2595, 2597, 2599, 2601, 2605; the runbook said six): PM shipped 0.75 to 0.81, training 0.77 to 0.87; AM shipped 0.73 to 0.79, training 0.87 to 0.88. Whole-street PM Colby St northbound: 73 to 83, observed 102.
- SR-24 ramps, PM, target; baseline shipped, training; candidate shipped, training: Claremont on (833) 598; 773, 975; 690, 850. Clifton off (683) 617; 697, 943; 750, 905. 52nd on (725) 996; 968, 1054; 923, 975. 52nd off (727) 1024; 1029, 1013; 1054, 1040. MLK on (679) 1547; 1266, 1014; 1513, 1175. MLK off (719) 1614; 1512, 1519; 1526, 1481. MLK Grove St on (280) 190; 282, 532; 240, 633. Telegraph on (701) 657; 906, 1272; 1068, 1305. Aileen off (702) 621; 724, 646; 733, 721. The other 13 ramps and the AM table are in the archived evidence.

### Also reported

- Travel times inside the observed range: 7 of 12 to 4 of 12. PM College Ave NB 236 to 295 s and Telegraph Ave NB 321 to 338 s stay inside the range; Shattuck Ave NB 266 to 279 s and SB 272 to 280 s were too slow before and after. AM: College Ave NB 275 to 312 s and SB 181 to 209 s are now too slow; Telegraph Ave SB 287 to 315 s; Shattuck Ave NB 205 to 230 s.
- Flips: PM 8 fail to pass and 5 pass to fail; AM 4 and 1. The PM held-out net of minus 1 comes from three flips: 2601 Colby St 63rd to 63rd NB (fail to pass); 1897 Canning St 59th to McAuley St SB, 21 to 10 against 49 counted (pass to fail); 1867 60th St Howell to Canning WB, 55 to 64 against 25 counted (pass to fail).

### Verdict

Fails the keep rule on three lines: PM held out 13 of 24 (line 14), D5 2 of 4 (line 4), and D16 in the AM and PM. Not adopted. The code stays on main with the switch off, and the shipped config has no `simulatedMembership` entry. The published data are unchanged. Step H was not run. The change is archived with its evidence.

### Next lead

Run the same loop with the totals of the uncounted gates held fixed, so that offered demand cannot grow at gates with no count. The loop then keeps what helped (fitted counts and the diagonal) without the added load on the SR-24 eastbound entry and the Claremont gates. The screen should also add a backlog line, since it passed this candidate.

## Forty-seventh round: one station over the Caldecott Lane on-ramp pair (change calibration-round-47)

Passes the keep rule narrowly, changes no status, not adopted (2026-11-19). The published network 53c823f20d9165ed, demand 9cdebdabf05c4460 and cross-validation demand 2f9ae152b9bbf78e stand. Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9 throughout.

### What was tried

One Caltrans ramp row (WB ON FR CALDECOTT LANE, 1,350 ADT in 2024) is shared by the on-ramps at nodes 1695 and 1711, and the build split it into two stations of 61 veh/h each in the PM peak. A turn ban sends the flow to one ramp, so one target was unmeetable and the other too low. The candidate `caldecott-pair-sum` (`countFit.linkGroups`, `tools/lib/link-groups.ts`) replaces the two stations by one whose target is the row total, 122 veh/h in the PM. Shipped demand a97b0d3fdd118cc8, training demand b9464e7b65bdd542, network unchanged. The station file has 356 stations against 357; no other target changed. The split was not re-frozen. The keep rule (design D8) and the screen (D9) were written before any run.

The run was on the project lead's laptop session on 2026-11-19, 7:51 to 8:27 AM Pacific, ten seeds. The gate reproduced the baseline hashes. The ten-seed baseline reproduced 74 of 92, 14 of 24, 70 of 77 and 14 of 19, and gave b = 1: ramp on 1695 passes (91 against 61, GEH 3.5) and ramp on 1711 fails (150 against 61, GEH 8.6). The three-seed screen passed.

### Keep rule, ten seeds

| Line | Baseline | Candidate | Line to meet | Result |
| --- | --- | --- | --- | --- |
| PM fitted, common stations | 73 of 90 | 74 of 90 | 73 | pass |
| PM fitted, every station | 74 of 92 | 74 of 91 | 74 | pass, exactly on it |
| PM held out | 14 of 24 | 14 of 24 | 14 | pass |
| AM fitted | 70 of 77 | 72 of 77 | 70 | pass |
| AM held out | 14 of 19 | 14 of 19 | 14 | pass |
| D5 headline shares | 4 of 4, mean error 4.6 | 4 of 4, mean error 4.7 | 4 of 4 | pass |
| Whole-street traversals | 8 of 8 | 8 of 8 | 8 of 8 | pass |
| D16 stability | holds | holds | holds | pass |
| Validation suite | 67 of 74 | 67 of 74 | 67 | pass |

### Reported

- The merged station still fails. PM simulated 219 against 122 counted, GEH 7.4; the baseline pair summed to 241. AM 225 against 103, GEH 9.5.
- The fit moved flow between the two ramp links more than it cut the total. PM link 4080 fell from 91 to 31 and link 4058 rose from 150 to 187.
- Five diagonal stations, PM (counted 178): shipped view 495 to 539, training view 1234 to 1253.
- Flips: three fail to pass (Canning St 62nd to 63rd NB in the PM; Colby St 62nd to 63rd NB and 60th St Canning to Telegraph EB in the AM, the last borderline). None pass to fail apart from the member's pass lost to the merge.
- Shattuck Ave NB, PM: 266 to 297 s.

### Verdict

Decision by the project lead, 2026-11-19: it passes narrowly and changes no status, so it is not adopted. The code stays on main, off by default, and may be combined with a later round.

## Forty-sixth round: a count-derived ramp peak-hour factor (change calibration-round-46)

Fails the screen, not adopted (2026-11-19). The published network 53c823f20d9165ed, demand 9cdebdabf05c4460 and cross-validation demand 2f9ae152b9bbf78e stand. Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9 throughout. No ten-seed assessment ran.

### What was tried

The ramp peak-hour factor K (`ramps.kFactor` 0.09, an unsourced ASSUMPTION) was replaced by a pooled ratio of counted PM ramp hours to ramp ADT (`countFit.rampK`, `tools/lib/ramp-k.ts`). The shipped view gives K 0.0734 from 5 counted ramps. The training view sees only 2 ramps because the split withholds three. `ramp-k-counted` requires 3 and falls back to 0.09 there; `ramp-k-counted-min2` accepts 2 and gets 0.0809. The 15 ADT x K stations (10 fitted, 5 held out) change in the shipped view. The keep rule (design D4) and the screen (D6) were written before any run.

The run was on the project lead's laptop session on 2026-11-19, 7:03 to 7:44 AM Pacific (12 jobs, seeds 1 to 3, PM and AM). The gate reproduced the baseline hashes 53c823f20d9165ed, 9cdebdabf05c4460 and 2f9ae152b9bbf78e at the same fingerprint.

| Candidate | Shipped demand | Training demand |
| --- | --- | --- |
| ramp-k-counted | 8a28540b43bc3a75 | 650b9f0e12d6f563 (periods equal to baseline) |
| ramp-k-counted-min2 | 583834696da85cfd | 514c17c9f88af777 |

### Screen: three seeds

Stations within GEH 5 on seeds 1 to 3.

| Run | PM fitted of 92 | PM held out of 24 | AM fitted of 77 | AM held out of 19 | PM gridlock in judged zone |
| --- | --- | --- | --- | --- | --- |
| baseline | 73 | 14 | 70 | 14 | none |
| ramp-k-counted | 73 | 14 | 70 | 14 | 0.33 cars/h |
| ramp-k-counted-min2 | 73 | 12 | 70 | 12 | 0.33 cars/h |

Without the 15 changed stations, ramp-k-counted has PM fitted 71 of 89, the same as the baseline. The min2 held-out counts are 2 lower in each period, inside the screen's tolerance of 3.

### Why both fail

Screen D6 allows no car cleared from gridlock in the judged zone. In both candidates one car in one of three seeds was cleared at Alcatraz Ave / Racine St. That is 212 m from the study area, outside the 200 m judged zone. It counts because its blocked chain reached the zone. The buffer sensitivity is 0.00 at 100 m and 0.33 at 400 m. The rule was written before the run, so it was applied as written.

### Beyond the screen (lead's judgment)

The candidates show no improvement to pursue. PM, three-seed sum over the five diagonal stations (counted 178): shipped view baseline 520, both candidates 540; training view baseline 1253, ramp-k-counted 1253, min2 1228. Claremont Ave on-ramp (counted 598): shipped 794 to 783; min2 training 997 to 1054, although its stand-in target fell from 882 to 793. Telegraph Ave on-ramp, shipped: 913 to 774 (target 657 to 536). The shipped PM fitted flips cancel. Gains: Colby St 60th to 61st NB, Colby St Forest to McAuley NB, 62nd St Hillegass to Colby EB. Losses: 61st St Canning to Telegraph EB, McAuley St Colby to Ayala WB, Ayala Ave Hermann to Martin NB. The travel-time pass and fail pattern is unchanged.

### Verdict

Not adopted. The code is on main and off by default; `ramps.kFactor` 0.09 remains an unsourced ASSUMPTION. Next leads: round 47 (Caldecott Lane link-group station) and round 48 (simulated membership), both to run on the laptop.

## Router diagnosis for the diagonal (diagnostic, nothing adopted) (2026-11-19)

Nothing shipped changed. Published network 53c823f2, demand 9cdebdab. Every run was a single seed (seed 1, PM peak, 60 min) in the cloud container, so every figure below is a diagnostic, not an assessment result. One seed moves the fitted-station pass count by about 3 and the diagonal sum by 10 to 15% between neighboring settings. The runs used the throwaway branch `router-diagnosis` (6bf5f6a), which adds environment switches to `eff.rs` and `sim.rs` plus scoring scripts under `tools/diag/`. It changes the simulator fingerprint source and is not for merge. The Shattuck tests changed network data only and ran on the original binary (fingerprint d45a275dd7be0713cec6a64394b7d8a9).

Metrics. DIAG5 is the sum of the simulated flow at the five diagonal stations, in cars per hour, against the counted 178 (Forest St EB 66, McAuley St EB 12, 60th St EB 23, Ayala Ave NB 60, Howell St SB 17). The pass counts are stations within GEH 5, as fitted/held out (base 70 of 92 and 14 of 24 PM). Colby St NB is the sim/count ratio of six block stations (base 742/1046 = 0.71). Travel times are seconds.

### What was asked

The audit above found the simulation carrying 2 to 5 times the count on the diagonal Telegraph Ave, McAuley St or 60th St, Ayala Ave or Howell St, Forest St, Claremont Ave, while the demand fit matches the counts. This diagnosis asked whether the router's cost model sends those trips there, and whether a router change would fix it.

### How route cost is built

A route costs the sum over its arcs of link cost times a class weight, plus a movement cost, each arc perceived with a per-driver normal error.

- Link cost is the larger of free-flow time (length over speed limit, plus 3 s per hump, HUMP_FF_PENALTY, ASSUMPTION) and a moving average of measured link times (alpha 0.3, refreshed every 60 s). The measured time includes queue and signal wait.
- Movement cost is static (turn penalty, control constant, crossing time at the turn speed) plus the measured movement time minus the measured link time.
- Class weight LOCAL_COST_FACTOR is 1.25 on residential and service links (ASSUMPTION, no source) and 1.0 elsewhere.
- Turn penalties: right 1 s, left 4 s, U-turn 25 s (ASSUMPTION). Turn speeds: right 4, left 5, U-turn 3 m/s, through 1.4 times the limit, circle 5 m/s (ASSUMPTION).
- Control constants from `crates/sim/data/node-delays.json`: signal 10 s, all-way stop 8 s, minor stop 14 s, circle 4 s, uncontrolled 0 (round 12).
- Perception is probit [DaganzoSheffi1977][Sheffi1985 eq 11.12] with variance ROUTE_DISPERSION_S = 2.0 (ASSUMPTION, chosen by sweep in round 31) times the arc cost, drawn once per driver and arc.
- GUIDED_SHARE 0.46 [Guin2021] (transfer ASSUMPTION) re-plans each epoch. Others keep the departure route unless blocked. SWITCH_BAND 0.2, SWITCH_MIN_GAIN_S 30, MAX_SWITCHES 2, MIN_SWITCH_GAP_S 120, BLOCKED_REROUTE_S 60 (ASSUMPTION) [Mahmassani1987][Srinivasan2000][Di2016]. INITIAL_CONGESTION 1.3 (ASSUMPTION).

The demand fit's static assignment uses the same local factor, turn penalties, constants and dispersion, but link time is free flow plus BPR (alpha 0.15, beta 4) with control delay subtracted, and it has no measured movement times and no live queues.

### The diagonal is the router's own cheapest path

Of 198 through trips that used a diagonal link, 80 went to south Oakland, 61 to the SR-24 westbound on-ramps, 22 to the hills via Claremont Ave, 11 to Telegraph Ave south and 24 elsewhere. With dispersion 0 (137 trips, 115 of which drive the router's best route), the diagonal beats the arterial alternative (all study-area locals closed) by 49 s mean and 24 s median of perceived cost (583 against 631 s). Measured link plus movement time is 373 against 442 s, and the route is 3,184 against 3,408 m.

For the ramp-bound trips (Berkeley north and west streets to the Claremont Ave/Hudson St ramp), the diagonal is 1,498 m with perceived cost 282 s. The arterial route (Telegraph Ave, Alcatraz Ave, College Ave, Claremont Ave) is 2,159 m at 397 s: 660 m (30%) longer, with 15 to 34 s of delay on each of four approaches. The fit's static assignment sends the same pairs to the 52nd St ramps and puts only 13 of the 198 trips on the diagonal. In the simulator the Telegraph Ave approaches to those ramps carry 20 to 40 s per signal, so drivers pick the Claremont ramp. The diagonal has almost no control (uncontrolled junctions at Ayala/McAuley, Ayala/Howell, Howell/59th/60th, per the imagery survey) and the simulation drives it near the 25 mph limit.

### Variants tried (PM seed 1; DIAG5 base 901 against 178)

- Local factor (all drivers): 1.6 gives 866, 2.0 gives 953, 3.0 gives 812; Colby St NB falls to 0.48, 0.42, 0.15 and fitted passes to 67, 62, 57. At 3.0 the arterial alternative saturates (measured 380 to 560 s) and the perceived costs equalize (752 against 760 s). Unguided drivers at 2.0: 671, Colby NB 0.63.
- Arterial weight 0.8 gives 679 and 0.6 gives 659 (Colby NB 0.55 and 0.43). Dispersion 0 gives 885 and 8 gives 935. Guided share 0 gives 993 and 1 gives 845.
- Turn penalties (left/right, seconds): 7/3 gives 771; 10/5 gives 609 (fitted 75, held 12, Colby NB 0.72); 15/8 gives 850; 20/10 gives 594 (Colby NB 0.58). Left 10 alone gives 742 and right 8 alone gives 815. The results are not monotone (609, 850, 594), so no trend is claimed.
- Extra seconds per local-to-local movement at uncontrolled or two-way-stop nodes: 10 s gives 645, 30 s gives 456, but Colby NB falls to 0.30 and 0.08 and fitted passes to 58 and 47. This is the lowest diagonal flow reached, and it costs counted flow elsewhere.
- Double-charged control delay (below): drop the constant once the link is measured gives 863; link cost as the larger of free flow plus constant and measurement, with the constant dropped from the movement cost, gives 767 (Colby NB 0.74, fitted 72).
- Residential speed limit scaled 0.85, 0.75, 0.65 (physics and routing): 782, 946, 994, with Colby NB 0.60, 0.48, 0.43. A scale below 1 is not supported by the speed literature records seen (search records only, no values read).
- Combinations: turn 10/5 with unguided local factor 2.0 gives 633; 10 s crossing with arterial weight 0.85 and unguided factor 1.6 gives 602 (Colby NB 0.29, fitted 58); control fix with 0.85 speed gives 644; with turn 7/3 added, 741; control fix with turn 7/3, 702. AM (four stations, counted 110) ranged 173 to 332 across five variants, against a baseline of 291.
- Shattuck Ave capacity (data-only): a lane added on the Shattuck approaches at 55th St and Alcatraz Ave gives 844; the signals at 55th St and Alcatraz Ave removed gives 1,202; the lane plus the 55th St approaches gives 794.

No variant brought DIAG5 near 178. The ones that cut it by half or more also cut flow at Colby St NB, a station group that was close to its count. Its through cars are mostly SR-24 off-ramp traffic to Telegraph Ave north (45 of 97).

### Confirmed double charge of control delay

The link cost already contains queue and signal wait from the measured times, and `eff.rs` adds the 10, 14 and 8 s constants to the movement cost on top, so control delay is counted twice at signals and stops. The constants were written in round 12 from simulated time lost against the limit (flow-weighted median), and they were the free-flow prior of the static router. No decision to charge both is recorded, and the demand fit (round 44) subtracts control delay so queues count once. Removing it is principled and matches the fit, but it moved DIAG5 only from 901 to 767 or 863, and it changes the route cost code and so the simulator fingerprint.

### Shattuck Ave travel time

Shattuck Ave is the one arterial that fails against observed travel times: NB 268 s against 144 to 178 s, SB 316 s against 158 to 221 s. Telegraph Ave (314 and 351 s against 302 to 420 and 300 to 376 s) and College Ave (223 and 206 s against 188 to 318 and 202 to 293 s) are inside the range. The cause is the signals: NB loses 116 s at 52nd St, 55th St and Alcatraz Ave, and SB queues 600 m behind 55th St (cycle 79 s, 31 s green for Shattuck Ave). The 2013 EIR PM entering counts at Shattuck Ave/55th St show the simulation carrying about 260 veh/h too many on the cross street and about 30% too few on Shattuck Ave. This matters only to the trips that use Shattuck Ave as their alternative. No observed time exists for Alcatraz Ave or Claremont Ave.

### Conclusion

The diagonal is the cheapest path under the router as built, and no single parameter family removes it without damaging stations that now pass. No router change was sent on for a ten-seed assessment.

### Open leads

- The ramp peak-hour factor. Config `ramps.kFactor` 0.09 is an unsourced ASSUMPTION. Counted ramps give 0.0571 to 0.0877 (pooled 0.0734); this is round 46 (`calibration-round-46`). The simulated Claremont Ave ramp carries 740 to 898 veh/h against a count of 598, and ramp-bound trips are 61 of the 198 diagonal trips. Not tested here.
- The Caldecott Lane pair-sum fit (design D9 of round 46): one Caltrans row split 50/50 over two ramps. Its own round.
- Fitting demand to simulated routes, so that the fit's static assignment and the simulator's router agree on which ramp and which street these trips use.

## Measurement corrections after round 42

The rebuilt Rockridge demand uses 731 vehicles per hour entering at the southern Telegraph Avenue gate and 549 leaving it in the PM peak. The volunteer route diagrams now compare with cars that drove the full length of the counted street. The earlier corridor range, derived from a representative block volume, has been retired. The training build keeps the same 86 held-out stations.

In one 60-minute PM run on seed 1, 75 of 92 recent fitted stations and 13 of 24 recent held-out stations passed GEH < 5. The shipped and training runs passed the assessment's input checks. Over minutes 10–60, the shipped run recorded 124 completed pedestrian crossings at Telegraph and Alcatraz, or 148.8 per hour. The training run recorded 141, or 169.2 per hour. Both demand files assign 150.49 crossings per hour there against 150.5 observed. Rockridge remains uncalibrated pending a multi-seed assessment. The previous round's results belong to its recorded inputs.

The decisions and verification are in [the measurement and assignment change](../../openspec/changes/archive/2026-11-17-repair-traffic-measurement-and-assignment/design.md).

## Older rounds

The thirtieth to forty-fifth rounds are in `rockridge.record-archive-3.md`. The seventeenth to twenty-ninth rounds are in `rockridge.record-archive-2.md`. The eleventh to sixteenth rounds, the initial-loading note, the tenth round and everything before it (ninth to fourth, sixth, fifth, and the third-round history) are in `rockridge.record-archive.md`, moved unchanged.
