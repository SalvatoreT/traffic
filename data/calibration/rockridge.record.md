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

## Thirty-sixth round: what limits Ashby Ave / Claremont Ave (change calibration-round-36)

Rounds 33 to 35 changed the phasing, the timing and the eastbound lanes at Ashby Ave / Claremont Ave and none of them reduced the cars cleared from gridlock there. The lead's reading: two northbound lanes with even 17 s of green in 100 s discharge about 600 an hour, yet the model passes 260 to 370, so something else limits the junction. This round looks for that constraint before touching the signal again, checks the data along it, and tries fixes at the source under the step rule. Decisions are in `openspec/changes/calibration-round-36/design.md`. Simulator fingerprint f0df1aabc323, network f9fa09a5726644d7 and demand 1c798217e72fb1ba, all unchanged; frozen split unchanged. Times Pacific; the round ran on 2026-11-16.

### Reproduction

`npm run data` in a fresh worktree reproduced round 35's network and demand byte for byte. PM seed 1 on them matches round 35's stored run in every simulated field.

### Step 1: diagnosis

A read-only probe in `calibrate` wrote, every 0.25 s after the warm-up, the state of each lane on 26 links around the junction: signal state, queue, and the head vehicle's next link, turn, distance to the line, speed, permission and what held it (a full downstream link, a vehicle crossing the junction, a pedestrian, or a priority rule). A probed run equals an unprobed one. The probe was not committed: it sits in the simulator's module tree, and landing it would change the fingerprint on which the published proposals were searched and confirmed. Round 33's iteration-2 demand, PM seeds 1 to 4 (12.3 cars cleared from gridlock an hour); the shipped demand in brackets (1.0). Saturation flow 1,500 to 2,000 vehicles an hour per lane is 0.42 to 0.56 a second [FHWA-SIG2004].

| Link (role) | Green, s/h | Queued at the line on green, s/h per lane | Discharge on queued green, veh/s per lane | Head held by a full downstream link, % of that time | Flow, veh/h |
| --- | --- | --- | --- | --- | --- |
| 4329 Claremont Ave northbound approach (through lane, right lane) | 814 (720) | 445, 656 (239, 393) | 0.17, 0.14 (0.42, 0.28) | 70 by 3446, 75 by 3425 (32, 52) | 317 (363) |
| 3395 Ashby Ave eastbound approach | 1,393 (1,582) | 1,154 (850) | 0.16 (0.47) | 63, by 3425 and 3446 (21) | 301 (506) |
| 3446 Claremont Ave north of the signal (43 m, two lanes) | uncontrolled | 2,728, 2,478 (1,717, 1,530) | 0.06, 0.03 (0.10, 0.07) | 50, 61 by 3431 (51, 61) | 241 (264) |
| 3425 Ashby Ave east of the signal, inner lane (37 m) | uncontrolled | 2,949 (2,141) | 0.09 (0.15) | 63 by the slip lane 3449 (42, half of it by 4397) | 277, 253 of them turning left into the slip lane (317, 176) |
| 3449 westbound right-turn slip lane (45 m) | uncontrolled | 2,305 (1,005) | 0.24 (0.23) | 52, mostly by 3431 (55) | 548 (232) |
| 3431 Claremont Ave north of Claremont Blvd (one lane, 82 m) into the all-way stop at Russell St | all-way stop | 3,387 (3,084) | 0.10 (0.11) | 21; a vehicle in the junction 51 (14; 55) | 338 (345) |
| 4397 Ashby Ave eastbound into Domingo Ave / Tunnel Rd (two lanes into one) | 1,352 (1,410) | 492, 500 (995, 999) | 0.22, 0.16 (0.23, 0.19) | 23, 24; a vehicle in the junction 51, 49 (32, 33; 34, 32) | 203 (449) |
| 3344 Domingo Ave southbound into the same signal | 1,769 (1,714) | 1,096 (930) | 0.40 (0.54) | 14 (4) | 497, 411 of them left onto Tunnel Rd (563, 497) |

The other approaches of the Russell St stop are queued 3,556 (Claremont Ave southbound), 3,369 (Russell St eastbound) and 3,136 s an hour (westbound) (3,523, 3,382, 1,808); the stop passes about 1,370 cars an hour over its four approaches. Claremont Ave southbound into Ashby Ave discharges near saturation flow while green and queued (0.54, 0.50, 0.39 a second) and is short of traffic, not of green.

Routes through the probed links (iteration 2, an hour): of the 411 left turns from Domingo Ave onto Tunnel Rd, about 220 come down Claremont Ave from the north edge and turn left at the Russell St stop and about 90 come along Russell St from Claremont Blvd. The slip lane's eastbound entries are Claremont Ave northbound through traffic that turns right on red onto Ashby Ave and then left across the westbound lanes (a 134 degree turn), and Ashby Ave eastbound left-turners; together about 250.

The chain: Claremont Ave northbound does not reach saturation flow because its head waits for room on Claremont Ave beyond the junction most of the green. That stretch is one lane for 82 m and ends at an all-way stop at Russell St that runs at capacity. Part of that stop's load is a route from the north hills to Tunnel Rd through Russell St and Domingo Ave, which also takes more green at Ashby Ave / Domingo Ave / Tunnel Rd than Ashby Ave gets; the Ashby Ave eastbound queue there reaches back to the slip-lane junction, where cars waiting to turn left into the slip lane hold the inner lane. Ashby Ave eastbound into Claremont Ave then waits for room, and its queue reaches back over Claremont Crescent, where the hillside gridlock starts. On the shipped demand the same chain is present with shorter queues. Signal timing at Ashby Ave / Claremont Ave was not the constraint on the northbound or eastbound approach.

### Step 2: the data along the chain

- Claremont Ave north of Claremont Blvd: OSM ways 201989355 and 201989356 are `lanes=2`, one lane each way, as in the network.
- Claremont Ave / Russell St: OSM node 53082604 is `highway=stop` on the junction node with no `stop` value and no direction. [OSMStop] maps minor-road stops on the approaches and all-way stops on the node with `stop=all`, so the tag does not say which approaches stop; the importer reads it as an all-way stop. The extract has 172 junction-node stops tagged the same way, so the general reading stays. The City of Berkeley's 2026 quick-build slides [BerkeleyClaremontQB2026] list, at Claremont Ave and Russell St, advance yield markings and "Yield to Ped" signs, which are used where approaching traffic is not stopped; they do not state the control. The City's 2025 slides [BerkeleyClaremontQB2025] give Claremont Ave peak-hour volumes of about 600 northbound (15:30 to 16:30) and 400 southbound (17:15 to 18:15), counted on 2025-09-23 along the corridor from Russell St to the southern city limit. The model's all-way stop passes about 340 northbound.
- [SafewayCollege-DEIR2011] does not study Russell St or Ashby Ave / Domingo Ave / Tunnel Rd. At Ashby Ave / Claremont Ave it records eastbound queues that did not clear in the 2010 PM peak and 697 vehicles an hour leaving northward (359 northbound through, 99 eastbound left, 239 westbound right).
- Ashby Ave / Domingo Ave / Tunnel Rd: Tunnel Rd eastbound is one lane (OSM way 517583960, `lanes:forward=1`); Caltrans counts 1,337 an hour there (2024, held out) against about 690 modeled on the iteration-2 demand. Ashby Ave eastbound into the signal is tagged `turn:lanes:forward=none|right`; the importer reads only left-turn lanes, so the model lets through traffic use the right lane. OSM restriction 14485297 (no left from Tunnel Rd westbound onto Domingo Ave, weekdays 16:00 to 18:00) does not reach the network: its `to` way is absorbed by junction joining. Both are importer gaps; neither is on the binding part of the chain.
- The slip lane: [CaltransD4BikeNeeds2025] (item Ala-13-NX04) names a slip lane at Claremont Ave. No source says whether eastbound traffic can enter it.
- Ashby Ave between College Ave and Tunnel Rd: no Caltrans or City of Berkeley source found in this round gives peak-hour tow-away lanes or lane counts.

### Step 3: fixes at the source (scratch networks, not kept)

PM, cars cleared from gridlock per hour, seeds 1 to 4:

| Network | Iteration-2 demand | Shipped demand | Claremont Ave north of the junction, veh/h (iteration 2 / shipped) | Where the gridlock is |
| --- | --- | --- | --- | --- |
| Round 35 | 12.3 | 1.0 | 338 / 345 | hillside streets, the junction |
| A: Claremont Ave / Russell St as a minor-road stop (Russell St stops) | 39.8 | 9.3 | 786 / 834 | Avalon Ave at Claremont Blvd, Russell St, Oak Knoll Ter |
| B: no eastbound left into the slip lane, no U-turn from it onto Claremont Ave southbound | 13.0 | 1.5 | 361 / 369 | as round 35 |
| A and B | 16.0 | 16.3 | 871 / 856 | hillside streets |

Without the all-way stop, Claremont Ave north of the junction carries more than twice as much and the gridlock moves onto the stop-controlled hillside streets that have to enter the heavier Claremont Ave and Claremont Blvd streams. Both changes fail the step rule on seeds 1 to 4, so neither was run on the other seed sets or demands.

### Result

The constraint is the all-way stop at Claremont Ave / Russell St and the traffic that reaches it, and whether the real junction is that limited cannot be settled from the sources: the map data shows an all-way stop, the City's documents point to uncontrolled Claremont Ave approaches without saying so, and nothing counts the route through Russell St and Domingo Ave. Following the lead's instruction, the round stops here. The network, the demand and every published file are round 35's; round 35's fit replay (every iteration rejected) and its assessment stand, as does the verdict: status `uncalibrated`, PM D16 fails (1.10 and 1.30 cars cleared from gridlock an hour), D5 fails (3 of 4), the through-car check fails on all four blocks, the station rule fails fitted (82%) and held out (54%); AM D16 passes, stations pass fitted (87%) and fail held out (74%); midday D16 passes; p2, p3, b13 and l1 fail with no reviewed exception.

### What would settle it

- A weekday PM peak-hour turning-movement count at Claremont Ave / Russell St, noting which approaches have stop signs. It gives the control, the northbound volume the junction must pass, and the southbound left turns onto Russell St that feed the route to Tunnel Rd.
- Second: a PM count of Domingo Ave southbound left turns onto Tunnel Rd at Ashby Ave.
- Then, as before, a current timing sheet for Ashby Ave / Claremont Ave and Ashby Ave / Domingo Ave / Tunnel Rd.

## Thirty-fifth round: field observations at Ashby Ave / Claremont Ave (change calibration-round-35)

On 2026-11-16 the project lead relayed two resident-provided field observations at Ashby Ave / Claremont Ave: (a) Ashby Ave eastbound has two travel lanes in the PM peak; (b) Claremont Ave southbound has a green left arrow, as northbound does (observed 2026-11-15). With the 2010 worksheet in [SafewayCollege-DEIR2011], (b) means both Claremont Ave approaches run as split phases. This round models the junction from them, retests the queue-first left-turn model and redoes the fit, keeping each step only if the validation suite and the network both improve or stay equal. Decisions are in `openspec/changes/calibration-round-35/design.md`. Simulator fingerprint f0df1aabc323 throughout (no simulator change). Network 6a8285d5076f9ddc to f9fa09a5726644d7 (one observed approach added to one signal; no link renumbered, no link changed); demand bef51b684a8c079c to 1c798217e72fb1ba with the same flows (D1 of the design: a provenance URL and the network hash it records). Frozen split unchanged. Times Pacific; the round ran on 2026-11-16.

### Reproduction

`npm run data` in a fresh worktree reproduced the network. The demand differed from bef51b684a8c079c in one field: the provenance URL of the Oakland multimodal counts, which commit debeb6c (bibliography deep links) changed in `build-demand.ts` after round 34 built its data; flows and every other field are identical. PM seed 1 on the published files matches round 34's stored report in every field except the manifest.

### Step 1: the junction from the observations (lanes reverted, phasing kept)

Phasing. Southbound Claremont Ave enters `signalObservations` as an own phase (all periods; DATA for the phasing). The engine already ran it alone: with northbound marked `ownPhase`, the southbound approach was the only one left in the Claremont Ave phase. PM seed 1 is identical apart from the list of observed approaches in the report. Cycle and greens follow the flows (Webster) on the three phases, ASSUMPTION pending a timing sheet; Ashby Ave keeps one phase with permitted lefts, as in the worksheet.

Lanes. The worksheet (PDF page 482) codes Ashby Ave eastbound as one lane group of two lanes (lane utilization 0.95, saturated flow 3,490 veh/h) with its 99 left turns inside it, so no left-turn lane. OSM way 34361024 (checked 2024-03-15) is `lanes=2`, one each way; the network had one eastbound lane on link 3395 (129 m from Claremont Crescent to the signal) plus the class-rule pocket. An `osmTagOverrides` entry (`lanes=3`, `lanes:forward=2`, `lanes:backward=1`) gave the link two eastbound lanes over its whole length, the shortest extent the network holds without splitting a link, in all periods (the network has no lanes by period); both are ASSUMPTIONS. A lane-coding observation removed the pocket; the importer now accepts `noLeftTurnLane` without a timing. The importer's network matched the measured scratch network link for link (4,411 links, only link 3395 changed). Ashby Ave westbound: the worksheet codes two lanes in one shared group (lane utilization 0.95, saturated flow 3,357 veh/h); OSM way 165864174 is `lanes=4` with no direction split and no `turn:lanes`, and the network has two westbound lanes (link 3426, 37 m, too short for a pocket). They agree, so nothing changed.

PM, seeds 1 to 10 / 11 to 20 (round 34, then two eastbound lanes with the worksheet lane coding; the iteration demands are round 33's, as rebuilt in round 34):

| | Shipped demand | Iteration-2 demand | Iteration-3 demand |
| --- | --- | --- | --- |
| Cars cleared from gridlock per hour, round 34 | 1.1 / 1.3 | 13.9 / 13.6 | 10.6 / 16.0 |
| Two eastbound lanes, no pocket | 2.4 / 1.7 | 12.6 / 13.6 | 14.5 / 11.2 |
| Two eastbound lanes with the pocket (diagnostic) | 3.6 / 3.1 | 11.8 / 14.9 | 13.1 / 15.8 |
| Cleared at the junction, total over ten seeds (Ashby Ave eastbound, Claremont Ave northbound), round 34 / two lanes | 0 (0, 0) / 4 (4, 0) | 22 (5, 15) / 26 (18, 7) | 21 (4, 17) / 29 (23, 5) |
| Cleared on the hillside streets (Avalon Ave, Oak Knoll Ter, Claremont Crescent, Ashby Ave west of the junction), round 34 / two lanes | 1 / 2 | 43 / 33 | 48 / 46 |
| Claremont Ave northbound, veh/h (577 counted in 2010) | 373 / 369 | 307 / 321 | 257 / 291 |
| Claremont Ave southbound, veh/h (549 in 2010, 272 of them left) | 437 / 561 | 487 / 556 | 513 / 506 |
| Ashby Ave eastbound, veh/h (1,163 Caltrans 2024) | 474 / 480 | 303 / 325 | 314 / 329 |
| Ashby Ave westbound, veh/h | 608 / 435 | 395 / 318 | 367 / 296 |
| Through cars HSB / CSB / HNB / CNB | 142 / 132 / 98 / 150 to 141 / 135 / 95 / 153 | 129 / 107 / 86 / 124 to 133 / 110 / 83 / 123 | 105 / 93 / 92 / 140 to 103 / 93 / 95 / 141 |
| Headline shares within 10 points, error | 3 of 4, 7.5 to 3 of 4, 7.3 | 4 of 4, 3.7 to 4 of 4, 4.3 | 4 of 4, 5.5 to 4 of 4, 5.4 |

Rows below the first three are seeds 1 to 10; the gridlock counts come from each seed's top-ten table. With two lanes the eastbound flow ratio per lane halves, so Webster gives the Ashby Ave phase less green (29.6 s of a 76.5 s cycle before, 23.7 s of 75 s after; shipped demand, means of the reported plans). Westbound then carries less, southbound more, eastbound about the same, and the gridlock at the junction moves onto the eastbound approach. On the shipped demand the other cars cleared are single events spread over the network (Russell St, 55th St, Pine Ave). The network got worse on the shipped demand on both seed sets, so the lane override and the lane coding were taken out of the area config; validation is unchanged (no case uses the junction). The southbound phase stays (no run changes); so does the importer's lane-coding-only observation, which changes nothing without the field.

### Step 2: queue-first left turns

`--queue-first-left` on the kept network, PM, cars cleared from gridlock per hour, seeds 1 to 10 / 11 to 20: shipped 1.6 / 2.6 against 1.1 / 1.3; iteration 2 16.1 / 17.1 against 13.9 / 13.6; iteration 3 13.8 / 20.2 against 10.6 / 16.0. Worse on every demand and seed set, so it stays off. On the two-lane network (diagnostic): 2.2 / 2.2, 13.3 / 20.4, 14.5 / 14.9.

### Step 3: delay-feedback fit

With step 1's lanes reverted and queue-first off, every run equals round 34's, so `tools/cost-loop.ts --no-stop --resume 3` replayed the stored iterations under the unchanged acceptance rule: removals 1.1, 24.7, 13.9 and 10.6 an hour at iterations 0 to 3, converged at iteration 3 (gap 0.090), every iteration rejected. The final build gave the shipped flows again. The demand keeps its free-flow and BPR costs.

### Result: ten seeds

Seeds 1 to 10 (PM also 11 to 20), scale 1.0, 60 minutes, fingerprint f0df1aabc323, `npm run assess -- --publish --noise`; PM seeds 11 to 20 run separately and identical to round 34's seed for seed. Round 34 in brackets; every figure is unchanged.

| | Target | PM 1-10 | PM 11-20 | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- |
| Through cars, all study-area local streets | | 822 (822) | | 466 (466) | 358 (358) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 | 142 / 132 / 98 / 150 (same) | 146 / 140 / 96 / 152 (same) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.9 / 50.5 / 55.1 / 37.4, 3 of 4, error 7.5 (same) | 52.8 / 47.9 / 56.6 / 38.9, 3 of 4, error 6.0 (same) | 50.8 / 43.9 / 59.6 / 47.3 (same) | 52.6 / 37.2 / 62.8 / 45.5 (same) |
| Cars cleared from gridlock per hour (D16) | below 1 | 1.10 (1.10) | 1.30 (1.30) | 0.30 (0.30) | 0.00 (0.00) |
| Entry backlog, mean % | below 2% | 0.71 (0.71) | 0.57 (0.57) | 0.03 (0.03) | 0.01 (0.01) |
| Completed trips | | 25,857 (25,857) | 25,965 (25,965) | 22,628 (22,628) | 16,705 (16,705) |
| Recent stations GEH<5, fitted / held out | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (same) | | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |
| Claremont Ave northbound / southbound at Ashby Ave, veh/h | 577 / 549 (2010) | 373 / 437 (same) | 411 / 432 (same) | | |
| Ashby Ave eastbound / westbound at Claremont Ave, veh/h | 1,163 eastbound (Caltrans 2024) | 474 / 608 (same) | 428 / 598 (same) | | |

Validation: 61 of 72 cases pass, as in round 34. Failing: a3, e2, e3, j6, j8, j9, j12 (reviewed), l1, p2, p3, b13 (not reviewed).

### Verdict

Status `uncalibrated`. PM peak: D16 fails (1.10 and 1.30 cars cleared from gridlock an hour); D5 fails (3 of 4); the through-car check fails on all four blocks; the station rule fails fitted (82%) and held out (54%). AM peak: D16 passes (0.30); stations pass fitted (87%) and fail held out (74%). Midday: D16 passes; no counts. Primitive validation: p2, p3, b13 and l1 fail with no reviewed exception.

### What remains off

- Ashby Ave / Claremont Ave: the observed second eastbound lane is not in the model, because with flow-based greens it takes green from Ashby Ave and the network got worse. The worksheet gives Ashby Ave 50.5 s of 100 s; the model's Webster plan gives it 24 to 30 s of 75 s. A current timing sheet (cycle, greens, minimum greens, whether the arrows are protected-only) would settle whether the two lanes and the plan belong together. Neither plan brings Claremont Ave northbound near the 577 counted in 2010 or Ashby Ave eastbound near the 1,163 Caltrans counted in 2024.
- The queue-first left-turn model fixes p2 and p3 and still makes the network worse.
- As in round 34: l1's range disagrees with the cited method; b13 sits 2 veh/h under its band; field checks of rounds 30 to 32 are open; stored proposal results, text pages and previews are stale.

## Thirty-fourth round: the 2010 worksheet plan at Ashby Ave / Claremont Ave (change calibration-round-34)

The lead's reading after round 33: the resident field observation (a left-turn arrow for northbound Claremont Ave) and the 2010 PM worksheet in [SafewayCollege-DEIR2011] describe the same plan. The worksheet runs the two Claremont Ave approaches as split phases, and under split phasing every movement of an approach, the left included, runs on a green arrow with no opposing traffic. Round 33 had tried that timing only together with the queue-first left-turn model. This round enters it on the default engine, checks the queue-first model again and redoes the fit, keeping each step only if the validation suite and the network both improve or stay equal. Decisions are in `openspec/changes/calibration-round-34/design.md`. Simulator fingerprint cef9506de520 at the start, f0df1aabc323 at the end; on the round 33 network and demand every run is identical to round 33 (seed 1 of each period and PM seeds 11 to 20 checked bit for bit). Network 6a8285d5076f9ddc and demand bef51b684a8c079c unchanged; frozen split unchanged; no link renumbered. Times Pacific; the round ran on 2026-11-16.

### Step 1: the worksheet plan on the default engine (reverted)

The worksheet (PDF page 482, re-read from the stored copy): actuated cycle 100 s; Claremont Ave northbound and southbound as split phases (turn type Split, protected phases 8 and 7), greens 17.0 s and 17.5 s, clearance 4.5 s each; Ashby Ave eastbound and westbound in one phase (phases 2 and 6, permitted lefts), green 50.5 s, clearance 6.0 s; 17.0 + 17.5 + 50.5 + 4.5 + 4.5 + 6.0 = 100 s. Lane coding: northbound one shared lane group of two lanes with no left-turn lane; southbound a left-turn lane beside a shared left-through and through-right group, as in the OSM turn lanes; Ashby Ave eastbound coded as two lanes, where OSM (way 34361024, checked 2024) has one.

The engine took one clearance per plan, so the worksheet's 6.0 s after the Ashby Ave phase and 4.5 s after the Claremont Ave phases could not both hold. An observed approach may now carry its own clearance (`clearanceSeconds` that differs between the observations of one timing; `ApproachGreen::clearance_s`), and the plan check still requires greens plus clearances to equal the cycle (a unit test covers 100 s and the 101 s that 7.0 s would need). An observation may also set `noLeftTurnLane`, which marks the approach `noPocket` so the class-rule pocket is not added. Provenance as entered: phasing, greens, clearances and lane coding DATA (2010 PM), consistent with the field observation; AM and midday ASSUMPTION, the PM plan reused, as the area config already does for the other observed plans without a worksheet for the period (52nd St at Shattuck Ave midday, Colby St at Claremont Ave PM). Ashby Ave keeps its OSM lane count.

PM, cars cleared from gridlock per hour, seeds 1 to 10 / 11 to 20 (round 33's plan, then the worksheet plan). Round 33's iteration-2 and iteration-3 demands were rebuilt from its stored runs (seed 1 of iteration 2 reproduces round 33's stored run bit for bit).

| | Shipped demand | Iteration-2 demand | Iteration-3 demand |
| --- | --- | --- | --- |
| Cleared from gridlock, round 33 plan | 1.1 / 1.3 | 13.9 / 13.6 | 10.6 / 16.0 |
| Worksheet plan | 1.7 / 2.1 | 11.3 / 14.0 | 16.1 / 18.3 |
| At Claremont Ave northbound into Ashby Ave (seeds 1-10, total), round 33 plan / worksheet | 0 / 4 | 15 / 22 | 17 / 32 |
| Claremont Ave northbound, veh/h (577 counted in 2010) | 373 / 333 | 307 / 259 | 257 / 217 |
| Claremont Ave southbound, veh/h (549 counted in 2010, 272 of them left) | 437 / 362 | 487 / 435 | 513 / 420 |
| Ashby Ave eastbound, veh/h (1,163 Caltrans 2024) | 474 / 528 | 303 / 386 | 314 / 318 |
| Ashby Ave westbound, veh/h | 608 / 682 | 395 / 412 | 367 / 402 |
| Through cars HSB / CSB / HNB / CNB, seeds 1-10 | 142 / 132 / 98 / 150 to 133 / 125 / 95 / 150 | 129 / 107 / 86 / 124 to 112 / 103 / 88 / 123 | 105 / 93 / 92 / 140 to 104 / 90 / 90 / 143 |
| Headline error, seeds 1-10 | 7.5 to 6.8 | 3.7 to 3.7 | 5.5 to 5.8 |

Flows are seeds 1 to 10. The rest of the gridlock sits where it did: Avalon Ave at Claremont Blvd, Oak Knoll Ter, Claremont Crescent and Ashby Ave east of the junction, and on the shipped demand scattered single events (Stanford Ave, 63rd St, Russell St). The worksheet gives northbound 17 s, less than the flow-based split gave it, so the approach carries less and its queue reaches back into the hillside streets; Ashby Ave gains a little. A diagnostic with the class-rule pocket kept on northbound (seeds 1 to 10) gave 1.3 on the shipped demand and 13.3 on the iteration-2 demand, so the lane coding is not the main cost. Validation is unchanged (no case uses the plan). The network got worse on the shipped demand on both seed sets and on the iteration-3 demand, so the plan was reverted: the area config keeps round 33's observation and the network file is round 33's again. The engine and importer support for per-approach clearance and the lane coding stays; it changes no run without those fields.

### Step 2: queue-first left turns

Rerun with `--queue-first-left` on the worksheet network (step 1 in place), PM, cleared from gridlock per hour, seeds 1 to 10 / 11 to 20, against the same network without it: shipped 1.3 / 1.5 against 1.7 / 2.1; iteration 2 16.3 / 21.3 against 11.3 / 14.0; iteration 3 16.0 / 19.7 against 16.1 / 18.3. Claremont Ave northbound fell further (iteration 2: 225 and 222 veh/h). Worse on the iteration demands, so it stays off. On round 33's plan round 33 already measured it worse.

### Step 3: delay-feedback fit

With step 1 reverted, the network, the demand and every run are round 33's. `tools/cost-loop.ts --no-stop --resume 3` replayed round 33's stored iterations under the unchanged acceptance rule: same table (removals 1.1, 24.7, 13.9, 10.6 an hour; cost gap 0.090 at iteration 3, converged), every iteration rejected, and the final `build-demand` reproduced the shipped demand byte for byte. The demand keeps its free-flow and BPR costs.

### serde_json float round trip

`float_roundtrip` is on in `crates/sim/Cargo.toml`. Before it, a report rewritten by `calibrate --seeds` differed from a solo run in the last digit of 24 floats (for example backlogPct 0.9312402599870767 against 0.9312402599870768); now the solo seed-1 report and the `--seeds` copy are byte-identical (same revision). Simulation numbers are unchanged (PM seed 1 report identical before and after). Two golden strings in `tests.rs` that pass the metrics through a JSON parse moved in their last digit.

### Result: ten seeds

Seeds 1 to 10 (PM also 11 to 20), scale 1.0, 60 minutes, fingerprint f0df1aabc323, `npm run assess -- --publish --noise`. Every figure equals round 33's (in brackets).

| | Target | PM 1-10 | PM 11-20 | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- |
| Through cars, all study-area local streets | | 822 (822) | | 466 (466) | 358 (358) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 | 142 / 132 / 98 / 150 (same) | 146 / 140 / 96 / 152 (same) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.9 / 50.5 / 55.1 / 37.4, 3 of 4, error 7.5 (same) | 52.8 / 47.9 / 56.6 / 38.9, 3 of 4, error 6.0 (same) | 50.8 / 43.9 / 59.6 / 47.3 (same) | 52.6 / 37.2 / 62.8 / 45.5 (same) |
| Cars cleared from gridlock per hour (D16) | below 1 | 1.10 (1.10) | 1.30 (1.30) | 0.30 (0.30) | 0.00 (0.00) |
| Entry backlog, mean % | below 2% | 0.71 (0.71) | 0.57 (0.57) | 0.03 (0.03) | 0.01 (0.01) |
| Completed trips | | 25,857 (25,857) | 25,965 (25,965) | 22,628 (22,628) | 16,705 (16,705) |
| Recent stations GEH<5, fitted / held out | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (same) | | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |
| Claremont Ave northbound at Ashby Ave, veh/h | 577 (2010) | 373 (373) | 411 (411) | | |

Validation: 61 of 72 cases pass, as in round 33. Failing: a3, e2, e3, j6, j8, j9, j12 (reviewed), l1, p2, p3, b13 (not reviewed).

### Verdict

Status `uncalibrated`. PM peak: D16 fails (1.10 and 1.30 cars cleared from gridlock an hour); D5 fails (3 of 4); the through-car check fails on all four blocks; the station rule fails fitted (82%) and held out (54%). AM peak: D16 passes (0.30); stations pass fitted (87%) and fail held out (74%). Midday: D16 passes; no counts. Primitive validation: p2, p3, b13 and l1 fail with no reviewed exception.

### What remains off

- Ashby Ave / Claremont Ave: the 2010 worksheet plan serves northbound Claremont Ave less than round 33's flow-based plan, and neither comes near the 577 counted in 2010. The worksheet codes Ashby Ave eastbound with two lanes where OSM has one; with one lane and about half the cycle the approach cannot carry the 1,163 an hour Caltrans counted in 2024. Whether Ashby Ave has a second eastbound lane in the PM peak (a peak-hour parking restriction, for example) needs a field check. A current timing sheet would settle the phasing.
- The queue-first left-turn model fixes p2 and p3 and still makes the network worse.
- As in round 33: l1's range disagrees with the cited method; b13 sits 2 veh/h under its band; field checks of rounds 30 to 32 are open; stored proposal results, text pages and previews are stale.

## Thirty-third round: left turns at signals, Ashby Ave / Claremont Ave (change calibration-round-33)

Round 32 left one junction type between the model and an accepted delay-feedback fit: Ashby Ave / Claremont Ave, where the removals of the iteration-2 demand sat, and validation case l1 failed. This round checks left turns at signals as primitives, then the phasing there, then redoes the fit. Decisions are in `openspec/changes/calibration-round-33/design.md`. Simulator fingerprint 6741b48b6d17 at the start, cef9506de520 at the end. Network 69f62ad981d0b8fa to 6a8285d5076f9ddc (one signal gains an observed phase; no link renumbered). Demand flows unchanged; its file changes only in the network hash it records (edaae9760f406e08 to bef51b684a8c079c). Frozen split unchanged. Rounds 22 to 24 moved to `rockridge.record-archive-2.md`. Times Pacific; the round ran on 2026-11-15 and 2026-11-16.

### Step 1: left turns at signals as primitives

Source. No verified entry covered permissive left capacity. [Fambro1991] (TTI Research Report 0989-1F, read in full) gives the method: left turns use gaps only once the opposing queue has cleared, at the rate of Drew's gap model (the Harders form) with critical gap 4.5 s and turning headway 2.5 s, plus sneakers in the change interval (the 1985 HCM's two a cycle; 0.88 measured at protected-permitted sites, critical gap 5.1 s, turning headways 2.24 to 2.57 s). [FHWA-STM2008] 4.8.4 ("one or two vehicles can be served at the end of the conflicting through phase") was re-read. `SNEAKERS` now cites both.

New cases p1 to p3, a left-only lane against 200, 400 and 600 veh/h opposing, band from the measured to the recommended values:

| Case | Simulator | Band [Fambro1991] | Queue-first model |
| --- | --- | --- | --- |
| p1, opposing 200 | 444 | 351 to 483, pass | 411 |
| p2, opposing 400 | 402 | 157 to 303, FAIL | 246 |
| p3, opposing 600 | 369 | 32 to 167, FAIL | 120 |

Why the simulator is fast: the gap check takes a starting opposing car's arrival as distance over max(speed, 2 m/s), so a car at the green line counts as 4 to 6 s away; and the courtesy wait (45 s) and yield fallback (90 s) count the red, so a left-turner that waited through the red goes ahead of the standing opposing queue, which is then held by the left-turner in the node. In a test with 500 veh/h offered opposing, the opposing approach carried 306. Left-turners wait at the stop line, not inside the junction, and up to two a cycle clear on the yellow and all-red; that matches the method's count per cycle and was left as it is.

The queue-first model (`Config::queue_first_left`, `calibrate --queue-first-left`): a conflicting car below its desired speed arrives by speeding up at its own acceleration, the critical gap at signals is 4.5 s, and permissive left-turners get no courtesy or fallback. Signals only: elsewhere the same estimate pushed case i4 below its range. It brings p1 to p3 into their bands and the test's opposing approach to its 500 veh/h, drops b4 to 837 (range from 918) and l1 to 658. On the network (old network, PM, removals per hour): shipped demand seeds 1 to 10 1.1 against 0.8; round 32's iteration-2 demand 10.9 and 7.2 on seeds 1 to 10 and 11 to 20 against 3.3 and 4.2. Undoing one part at a time gave 6.3 (courtesy kept), 7.4 (old arrival estimate), 6.4 (critical gap 4.1). The network got worse, so the model stays off by default; runs without it are identical to round 32 (seed 1 checked bit for bit). p2 and p3 are listed in `validation.deviations.json` as not reviewed.

l1. Its range applies the unsignalized major-left gap formula (tc 4.1 s, tf 2.2 s) to the hourly opposing flow over the whole cycle. The [Fambro1991] method puts the left-limited approach at 385 to 706 per lane; the simulator gives 792, above the method (658 with the queue-first model). No correct behavior raises it into its range. Range unchanged; still not reviewed, with this comparison in its reason. In the shared lane, a left-turner that does not fit in the full pocket drives to the stop line of the inner lane and turns from there beside the pocket, and through drivers behind it change lanes; physically it would wait at the pocket entrance, which would lower capacity further. Not built.

### Step 1c: phasing at Ashby Ave / Claremont Ave

OSM: northbound Claremont Ave (ways 24501620, 1503817466) is `lanes=4` with no direction split and no `turn:lanes`; southbound (way 435129985) has `turn:lanes:backward=left|left;through|through;right`. The network has northbound two lanes with the class-rule 3-vehicle pocket and southbound three lanes with a marked left lane. The importer decides no left-turn phasing: every left is permissive unless an observed timing gives an approach a phase of its own. The 2010 PM worksheet [SafewayCollege-DEIR2011] (re-read) counts northbound 53 left, 359 through, 165 right (577) and southbound 272 left, 234 through, 43 right, and runs the two Claremont Ave approaches as split phases (17.0 and 17.5 s of 100 s; Ashby Ave 50.5 s), northbound coded with no left-turn lane. The heavy left turns are southbound.

The project lead relayed a resident-provided field observation (2026-11-15): northbound Claremont Ave has a left-turn arrow. It is in `signalObservations` as DATA for the phasing; protected-only, all periods, cycle and greens by flow, pocket length and the other approaches' phasing are ASSUMPTIONS pending a timing sheet. The engine and importer now take an observation of the phasing without timing (cycle and greens 0; the plan keeps the structure with Webster's cycle and splits). New case b13 (one lane, all left, own phase, 500 opposing): 450 against 452 to 602 veh/h [FHWA-SIG2004], 2 veh/h short on seed 1 (456 to 486 on seeds 2 to 5), listed as not reviewed.

The 2010 worksheet timing itself (both Claremont approaches split, fixed greens) was tried on a scratch network with the queue-first model on: shipped demand 1.7 removals an hour, iteration-2 demand 4.5. Not kept.

### Step 2: Ashby Ave / Claremont Ave on round 32's iteration-2 demand

Rebuilt from round 32's stored iteration 0 and 1 runs (seed 1 reproduces round 32's stored run exactly). Default engine, PM:

| Iteration-2 demand | Without the protected left, seeds 1-10 / 11-20 | With it |
| --- | --- | --- |
| Removals per hour | 3.3 / 4.2 | 4.6 / 4.7 |
| Claremont Ave northbound at Ashby Ave, veh/h (577 counted) | 379 / 411 | 437 / 456 |
| Ashby Ave eastbound / westbound into the junction | 499, 529 / 516, 479 | 401, 449 / 406, 443 |
| Through cars HSB / CSB / HNB / CNB, seeds 1-10 | 110 / 94 / 92 / 142 | 111 / 94 / 91 / 142 |
| Headline error, seeds 1-10 | 2.4 | 2.6 |
| Where the removals are (seeds 1-10, total) | Avalon Ave at Claremont Blvd 10, Russell St 2, Claremont Ave northbound at Ashby Ave 2, Claremont Crescent 2 | Avalon Ave at Claremont Blvd 9, Ashby Ave at Claremont Crescent 4, 62nd St at MLK Jr Way 3, Claremont Crescent 2, Ashby Ave eastbound at Claremont Ave 2 |

The protected phase lets more northbound traffic through and takes green from Ashby Ave; the hillside queue moves from Claremont Ave to Ashby Ave and stays. Shipped demand: 1.1 and 1.3 removals an hour on seeds 1 to 10 and 11 to 20 against 0.8 and 1.4. Under the step rule this would be reverted. It is kept because it is an observation of the street, which the lead asked to model; its effect is recorded here.

### Step 3: delay-feedback fit

`npm run data` rebuilt the network (6a8285d5076f9ddc) and the same demand flows. `tools/cost-loop.ts --no-stop` (resumed once after a session fault, from iteration 1), PM seeds 1 to 10 scored:

| Iteration | Removals/h | Headline shares (47 / 47 / 68 / 45), error | Through cars HSB / CSB / HNB / CNB | GEH<5 fitted / held out, all stations | Cost gap |
| --- | --- | --- | --- | --- | --- |
| 0 (free-flow and BPR costs) | 1.1 | 53 / 51 / 55 / 37, 7.5 | 142 / 132 / 98 / 150 | 66% / 57% | - |
| 1 | 24.7 | 53 / 48 / 56 / 43, 5.4 | 134 / 149 / 85 / 130 | 70% / 50% | 0.378 |
| 2 | 13.9 | 53 / 45 / 63 / 47, 3.7 | 129 / 107 / 86 / 124 | 75% / 62% | 0.122 |
| 3 | 10.6 | 55 / 47 / 77 / 50, 5.5 | 105 / 93 / 92 / 140 | 70% / 60% | 0.090 |

Converged at iteration 3 (gap under 0.10). The unchanged acceptance rule rejected every iteration, so the demand keeps its free-flow and BPR costs. At iterations 1 and 2 the removals sit at Ashby Ave / Claremont Ave (Claremont Ave northbound 15 over ten seeds at iteration 2, Ashby Ave eastbound 5 to 16) and the hillside streets behind it (Avalon Ave at Claremont Blvd, Oak Knoll Ter, Claremont Crescent), with Claremont Ave northbound at 307 veh/h and Ashby Ave eastbound at 303: with the third phase and flow-based splits the junction serves less than round 32's two-phase plan under the heavier arterial loads of the fit.

### Result: ten seeds

Seeds 1 to 10 (PM also 11 to 20), scale 1.0, 60 minutes, fingerprint cef9506de520, `npm run assess -- --publish --noise`. Round 32 in brackets.

| | Target | PM 1-10 | PM 11-20 | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- |
| Through cars, all study-area local streets | | 822 (793) | | 466 (462) | 358 (361) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 | 142 / 132 / 98 / 150 (137 / 128 / 95 / 148) | 146 / 140 / 96 / 152 (142 / 142 / - / -) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.9 / 50.5 / 55.1 / 37.4, 3 of 4, error 7.5 (53.2 / 50.9 / 56.8 / 38.0, 3 of 4, 7.1) | 52.8 / 47.9 / 56.6 / 38.9, 3 of 4, error 6.0 (error 5.7) | 50.8 / 43.9 / 59.6 / 47.3 (50.5 / 43.3 / 59.0 / 47.4) | 52.6 / 37.2 / 62.8 / 45.5 (53.4 / 37.6 / 62.9 / 45.6) |
| Removals per hour (D16) | below 1 | 1.10, 0 to 5 per seed (0.80) | 1.30 (1.4) | 0.30 (0.00) | 0.00 (0.00) |
| Entry backlog, mean % | below 2% | 0.71 (0.71) | 0.57 | 0.03 (0.01) | 0.01 (0.01) |
| Completed trips | | 25,857 (25,837) | 25,965 | 22,628 (22,663) | 16,705 (16,709) |
| Recent stations GEH<5, fitted / held out | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (83% / 54%) | | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |
| 62nd St / Forest St eastbound | 59 / 66 counted | 118 / 208 (103 / 192) | 123 / 201 (115 / 208) | 51 / 98 (50 / 107) | |
| Telegraph Ave NB / SB, s | PM 302-420 / 300-376; AM 280-315 / 245-285 | 345 / 317 (340 / 311) | | 294 / 299 (293 / 299) | |
| Claremont Ave northbound at Ashby Ave, veh/h | 577 (2010) | 373 (367) | 411 | | |

The 2024 Caltrans station on Ashby Ave eastbound into Claremont Ave (link 3395, held out) counts 1,163 an hour; the shipped demand gives 474 there.

Validation: 61 of 72 cases pass. Failing: a3, e2, e3, j6, j8, j9, j12 (reviewed, as before), l1 (not reviewed, as before), and the new p2, p3, b13 (not reviewed).

### Who the through cars are now

`calibrate --od-costs`, PM seeds 1 to 4, classes as in rounds 30 to 32 (round 32 in brackets).

| Through cars an hour | Hillegass Ave SB | Colby St SB | 62nd St EB | Forest St EB |
| --- | --- | --- | --- | --- |
| All | 128 (117) | 118 (104) | 78 (57) | 128 (127) |
| Making an assumed movement | 81 (82) | 31 (29) | 7 (6) | 8 (8) |
| On the router's best route | 4 (1) | 5 (3) | 6 (1) | 20 (21) |
| On a route ranked costlier (median excess) | 43 (34; 48 s, 8%) | 82 (72; 56 s, 10%) | 66 (50; 48 s, 7%) | 100 (98; 36 s, 7%) |

### Verdict

Status `uncalibrated`, as the rules prescribe. PM peak: D16 fails (1.10 removals an hour on seeds 1 to 10, 1.30 on 11 to 20); D5 fails (3 of 4; Hillegass Ave SB to the freeway 55 against 68); the through-car check fails on all four blocks; the station rule fails fitted (82%) and held out (54%). AM peak: D16 passes (0.30), the station rule passes fitted (87%) and fails held out (74%); no share or through-car targets. Midday: D16 passes; no counts. Primitive validation: p2, p3, b13 and l1 fail with no reviewed exception.

### What remains off

- Permissive left turns against heavy oncoming traffic are served up to twice as fast as [Fambro1991] allows, and the oncoming traffic is held back. The queue-first model fixes the primitive and destabilizes the network; switching it on probably needs the protected phases the field has (left-turn arrows) entered first, which needs field checks or timing sheets for the signals with heavy left turns.
- Ashby Ave / Claremont Ave: the protected northbound left is observed; whether it is protected-only, its timing, the southbound phasing, the pocket and the northbound lane use need a timing sheet. The model serves Ashby Ave eastbound far below the 2024 Caltrans count.
- l1's range disagrees with the cited method; b13 sits 2 veh/h under its band (single-lane left turns at the 5 m/s turn speed, ASSUMPTION).
- Field checks of rounds 30 to 32 still open. Stored proposal results, text pages and previews were made on an older engine and are stale.

## Thirty-second round: lane use, closely spaced signals, the arterial deficit (change calibration-round-32)

The lead's reading after round 31 was an arterial capacity deficit: the real arterials carry their counted PM volumes without gridlock, and the model's cannot carry what the delay-feedback fit assigns to them. This round locates the deficit first, then tries each candidate named in rounds 29 and 30 as its own measured step, kept only when the validation suite and the network both improve. Decisions are in `openspec/changes/calibration-round-32/design.md`. Simulator fingerprint 60df28cd94a0 at the start, 6741b48b6d17 at the end. Network 69f62ad981d0b8fa and demand edaae9760f406e08 unchanged (`npm run data` reproduces both), frozen split unchanged, no link renumbered.

### Step 1: where the deficit is

The delay-feedback demand of round 31 at iteration 2 was rebuilt from the stored iteration 0 and 1 runs into a scratch directory (its PM seed 1 reproduces the stored run exactly) and run on PM seeds 1 to 4 with `calibrate --node-report` (new: per-link exits, standing vehicles and time near jam density, mean signal plans, removals) and `--od-costs`. Capacity is lanes x s x the model's mean green share, s from 1,500 to 2,000 veh/h per lane [FHWA-SIG2004]. "Diverted" counts the through cars an hour on the counted Hillegass Ave, Colby St, 62nd St and Forest St blocks whose arterial alternative this location alone slows by more than the margin by which the side street won (a trip can count at several locations). Removals per hour are over ten seeds of the same demand.

| Location (signal unless noted) | Diverted/h | Removals/h | Busiest approach: flow / count / capacity, veh/h | Standing veh, time near jam |
| --- | --- | --- | --- | --- |
| College Ave / Claremont Ave / 62nd St | 174 | 0 | College Ave SB 381 / - / 751-1,001 (51 m link); 62nd St EB 50 / 59 / 299-399 | 3.0, 1% |
| Alcatraz Ave / Telegraph Ave | 159 | 0 | Telegraph Ave SB 794 / 1,064 / 2,174-2,898; NB 922 / 1,093 | 3.0, 0% |
| 56th St / Telegraph Ave (SR-24 ramps) | 146 | 0 | Telegraph Ave SB 1,194 / - / 1,828-2,438 (94 m link) | 3.5, 2% |
| Aileen St / Telegraph Ave (SR-24 ramps) | 142 | 0 | Telegraph Ave SB 792 / - / 1,323-1,764 | 2.4, 2% |
| Claremont Ave / Colby St / Forest St | 141 | 0 | Claremont Ave 668 / - / 1,063-1,418; Colby St SB 131 / 162 / 76-101 (4 s observed green) | 3.2, 0% |
| Alcatraz Ave / College Ave | 136 | 0 | Alcatraz Ave EB 475 / 510 / 650-866; College Ave NB 420 / 423 | 2.2, 2% |
| 55th St / Telegraph Ave | 127 | 0 | Telegraph Ave SB 870 / 1,099 / 1,808-2,410; NB 944 / 1,070 / 2,711-3,615 | 2.2, 0% |
| 52nd St / Claremont Ave / Telegraph Ave | 68 | 0.3 | Telegraph Ave SB 939 / 1,121 / 1,886-2,515 | 4.2, 0% |
| Ashby Ave / Claremont Ave | 43 | 0.3 | Claremont Ave NB 314 / 577 / 723-965 (two lanes, heavy left turns) | 9.0, 10% |
| Claremont Blvd at Avalon Ave and Claremont Crescent at Ashby Ave (east hills, upstream of the row above) | under 36 | 1.0, 0.2 | Claremont Ave at Russell St (all-way stop) 400 veh/h | 6.3, 17% |
| Harmon St circles, Martin Luther King Jr Way at 47th St | 0 | 0.3, 0.3 | west of the study area | |

What it says, plainly. No arterial approach on the through cars' alternatives reaches its saturation-flow capacity: the Telegraph Ave approaches run at 0.3 to 0.65 of it and College Ave southbound at about 0.4 to 0.5, and their throughput is below the counts because less demand reaches them, not because they cap it. What they impose is delay: four uncoordinated signals within 300 m of Telegraph Ave, each with 2 to 4 vehicles standing per approach, and lanes blocked by left-turners. The removals sit at the Ashby Ave / Claremont Ave signal (Claremont Ave northbound carries 314 of the 577 counted, with 9 vehicles standing on a two-lane approach where left-turners wait) and on the hillside streets queued behind it, plus a few west of Telegraph Ave. So the deficit found is delay at closely spaced signals and lane blocking, which steps 2 and 3 address; a shortfall of signal capacity on the arterials was not found.

### Step 2: lane changes along a link (kept)

Cars now move to an adjacent lane by MOBIL [Kesting2007]: the new follower may not have to brake harder than 4 m/s^2, and a discretionary change needs an acceleration gain, including politeness times the followers' gains, above 0.2 m/s^2 (both values from the source; the equations re-read in Kesting, Treiber and Helbing, arXiv 1012.4913, and on Treiber's MOBIL page). A driver whose lane cannot serve its next movement, or a left-turner at a pocket with room, changes whenever it is safe. ASSUMPTIONS: politeness 0.2 (the source gives 0 to 0.5), 3 s between a driver's changes, one check a second, 1 m minimum gap, a missing leader taken as a standing vehicle at the stop line, discretionary changes kept to the side of the road the driver sorts for.

| | Without (round 31 engine) | With |
| --- | --- | --- |
| b9: 2 lanes, 10% left, pocket (815 to 1,075 veh/h per lane) | 814 | 870 |
| l1 (new): 2 lanes, 20% left, pocket overflowing every cycle (851 to 1,064) | 699 | 792, FAIL |
| l2 (new): left lane blocked, 1,200 veh/h offered, flow past it over offered (0.9 to 1.1) | 1.04, 59 vehicles stranded | 1.04, 4 stranded, pass |
| PM shipped demand, seeds 1-10 / 11-20: removals per hour | 1.2 / 1.9 | 1.4 / 2.0 |
| headline error, points | 8.9 / 7.7 | 8.7 / 7.0 |
| through cars HSB / CSB, seeds 1-10 | 155 / 160 | 153 / 148 |
| Forest St eastbound, seeds 1-10 / 11-20 | 275 / 290 | 237 / 247 |
| Telegraph Ave SB, s, seeds 1-10 / 11-20 | 357 / 360 | 334 / 341 |
| PM delay-feedback demand (iteration 2), seeds 1-10: removals, Telegraph Ave SB | 5.4, 361 s | 4.9, 337 s |

l1 still fails because a left-turner that does not fit the 3-vehicle pocket (ASSUMPTION) holds the inner lane at the stop line until it can turn. It is listed in `validation.deviations.json` as not reviewed; the review is the lead's. The removals moved within the spread of ten-seed sets; the rest improved, so the step is kept.

### Step 3: closely spaced signals (kept)

Two signals joined by at most 120 m of road (ASSUMPTION; one link, or links that go straight on through uncontrolled nodes) run the longer of their own cycles, and the downstream green for that road starts one free-flow travel time after the upstream green that feeds it, in the direction with the larger measured approach flow [FHWA-STM2008] 6.3.1, 6.6.2, 6.6.4. At each 5-minute adaptation the new plans keep the common cycle and the offsets. In Rockridge this joins Aileen St, 56th St and 55th St on Telegraph Ave, 52nd St and 51st St, and pairs on Broadway, Shattuck Ave at Adeline St, Martin Luther King Jr Way, Domingo Ave and Tunnel Rd.

Why round 29's version made things worse, as far as can be told without its code: it grouped signals up to 800 m (then 150 m) apart on the longest member cycle, which lengthens queues on 81 to 94 m links, and it used simultaneous offsets, which the manual suggests for oversaturated arterials (6.4.3), while step 1 shows these approaches undersaturated. The first version here joined only single links; that left 55th St out of the interchange group (an uncontrolled node lies between it and 56th St) and gave 10 removals on 55th St westbound over seeds 11 to 20. The version through uncontrolled nodes has none there. Queue-aware gating of the upstream green was not built.

| PM shipped demand | Lane changes only, seeds 1-10 / 11-20 | With coordination |
| --- | --- | --- |
| c1 / c2: two signals 100 m apart over 1,000 m apart (0.75 to 1.15) | 0.78 / 0.76 | 1.03 / 1.03 |
| removals per hour | 1.4 / 2.0 | 0.8 / 1.4 |
| headline error, points | 8.7 / 7.0 | 7.1 / 5.7 |
| through cars HSB / CSB | 153 / 148, 151 / 155 | 137 / 128, 142 / 142 |
| 62nd St / Forest St eastbound | 122 / 237, 127 / 247 | 103 / 192, 115 / 208 |
| Telegraph Ave SB, s | 334 / 341 | 311 / 320 |

### Step 4: College Ave / Claremont Ave / 62nd St observed plan (not kept)

The four 2010 PM observations of round 29 [SafewayCollege-DEIR2011] (110 s, 62nd St 15 s, College Ave 41 s, Claremont Ave 19 s and 19 s as split phases) on a scratch network, with steps 2 and 3, PM seeds 1-10 / 11-20: removals 1.4 / 1.8 an hour against 0.8 / 1.4 without, 8 of them at Ashby Ave / Claremont Ave; headline error 6.0 / 4.9 with all four shares within 10 points; through cars Hillegass Ave SB 134 / 139, Colby St SB 125 / 131, but Hillegass Ave NB 111 / 108 and Colby St NB 161 / 157, above their ranges; 62nd St eastbound 94 / 102. Stability got worse, so the plan stays out of the area config, as in round 29.

### Step 5: delay-feedback fit

`npm run data` reproduced network and demand. The loop on the new engine, PM seeds 1 to 10 scored:

| Iteration | Removals/h | Headline shares (47 / 47 / 68 / 45), error | Through cars HSB / CSB / HNB / CNB | 62nd St / Forest St EB | Telegraph Ave SB, s | GEH<5 fitted / held out, all stations | Cost gap |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 (free-flow and BPR costs) | 0.8 | 53 / 51 / 57 / 38, 7.1 | 137 / 128 / 95 / 148 | 103 / 192 | 311 | 67% / 59% | - |
| 1 | 12.6 | 54 / 47 / 61 / 53, 5.3 | 116 / 122 / 93 / 127 | 75 / 124 | 351 | 71% / 59% | 0.351 |
| 2 | 3.3 | 53 / 47 / 68 / 49, 2.4 | 110 / 94 / 92 / 142 | 53 / 121 | 303 | 70% / 53% | 0.115 |
| 3 | 5.2 | 57 / 46 / 70 / 45, 3.5 | 108 / 91 / 99 / 157 | 52 / 149 | 319 | 70% / 60% | 0.082 |

The PM peak is now stable on the free-flow costs, so the loop's own rule stopped at iteration 1 (unstable) and restored the demand; it was rerun with `--no-stop` to convergence (gap 0.082 at iteration 3) and its acceptance rule rejected every iteration, so the demand stays edaae9760f406e08. At iteration 2 all four through-car blocks are inside their ranges and all four headline shares within 10 points, at 3.3 removals an hour. About half of those, and most of the 12.6 at iteration 1, are at the Ashby Ave / Claremont Ave signal and on the hillside streets queued behind it (Claremont Blvd at Avalon Ave 1.0 to 2.1 an hour, Avalon Ave at Oak Knoll Ter, Claremont Crescent); the rest are spread west of Telegraph Ave.

### Result: ten seeds

PM, AM and midday, seeds 1 to 10, scale 1.0, 60 minutes, fingerprint 6741b48b6d17, `npm run assess -- --publish --noise`. Round 31 values in brackets.

| Seeds 1 to 10 | Target | PM peak | AM peak | Midday |
| --- | --- | --- | --- | --- |
| Through cars, all study-area local streets (intent tally) | | 793 (931) | 462 (505) | 361 (405) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 (PM) | 137 / 128 / 95 / 148 (155 / 160 / 96 / 147) | no whole-street counts | no whole-street counts |
| Headline shares HNB from / CNB from / HSB to / CSB to | 47 / 47 / 68 / 45 (PM) | 53.2 / 50.9 / 56.8 / 38.0, 3 of 4, error 7.1 (52.9 / 50.7 / 52.8 / 34.1, 2 of 4, error 8.9) | 50.5 / 43.3 / 59.0 / 47.4 (51.4 / 42.3 / 57.6 / 44.6) | 53.4 / 37.6 / 62.9 / 45.6 (53.4 / 37.3 / 60.7 / 43.7) |
| Removals per hour (D16) | below 1 | 0.80, 0 to 2 per seed (1.20) | 0.00 (0.00) | 0.00 (0.00) |
| Entry backlog, mean % of spawned | below 2% | 0.71 (0.67) | 0.01 (0.03) | 0.01 (0.01) |
| Completed trips | | 25,837 (25,788) | 22,663 (22,623) | 16,709 (16,694) |
| Recent stations below GEH 5, fitted / held out | above 85% | 76 of 92 (83%) / 13 of 24 (54%) (71 of 92, 77% / 13 of 24, 54%) | 67 of 77 (87%) / 14 of 19 (74%) (65 of 77, 84% / 14 of 19, 74%) | no counts |
| 62nd St / Forest St eastbound, veh/h | 59 / 66 counted | 103 / 192 (130 / 275) | 50 / 107 (50 / 113) | |
| Telegraph Ave NB / SB, s | 302-420 / 300-376 (PM); 280-315 / 245-285 (AM) | 340 / 311 (345 / 357) | 293 / 299 (305 / 316) | |

Over seeds 11 to 20 the same engine gave 1.4 removals an hour, so the PM D16 pass on seeds 1 to 10 sits close to the limit.

### Who the through cars are now

`calibrate --od-costs`, PM seeds 1 to 4, classes as in rounds 30 and 31 (round 31 engine in brackets, rerun here with `--no-lane-changes --coord-max-m 0`, which reproduces the round 31 table).

| Through cars an hour | Hillegass Ave SB | Colby St SB | 62nd St EB | Forest St EB |
| --- | --- | --- | --- | --- |
| All | 117 (132) | 104 (141) | 57 (74) | 127 (187) |
| Making an assumed movement | 82 (81) | 29 (29) | 6 (7) | 8 (11) |
| On the router's best route | 1 (5) | 3 (5) | 1 (5) | 21 (23) |
| On a route ranked costlier (median excess) | 34 (46; 46 s, 8%) | 72 (107; 61 s, 12%) | 50 (63; 51 s, 8%) | 98 (154; 34 s, 7%) |

The costlier group shrank by 12 to 56 cars an hour on every block: faster arterials widen the gap a driver's misperception has to cross.

### Verdict

Status `uncalibrated`. D16 now holds in all three periods on seeds 1 to 10 (PM 0.80 an hour; 1.4 on seeds 11 to 20). D5 fails: 3 of 4 headline shares within 10 points; Hillegass Ave SB to the freeway is 57 against 68 (mean error 7.1 points against 8.9). The through-car check fails on three PM blocks: Hillegass Ave SB 137 against 79 to 120, Colby St SB 128 against 39 to 117, Colby St NB 148 against 102 to 145; Hillegass Ave NB 95 is at the top of its range. The station rule fails in the PM peak (83% fitted, 54% held out) and, out of sample, in the AM peak (87% fitted passes, 74% held out fails). Validation case l1 fails with no reviewed exception. The PM peak does not pass shares and the through-car check, so the case the lead named (only model-edge stations failing) does not arise.

### What remains off

- With delays fed back (iteration 2) every through-car block and headline share is in range, at 3.3 removals an hour. The removals that stop it sit at Ashby Ave / Claremont Ave and the hillside streets that queue behind its Claremont Ave northbound approach: two lanes with heavy permissive left turns, carrying 314 of 577 counted vehicles an hour. That approach is the l1 case in the field; its pocket length, left-turn phasing and the lanes of Claremont Ave there need a field check or a timing sheet.
- l1: a left-turner that does not fit the 3-vehicle pocket (ASSUMPTION) still blocks the inner lane. Pocket lengths are not in the map data.
- 120 m for closely spaced signals, the politeness and the other lane-change values are ASSUMPTIONS. Queue-aware gating was not built.
- The College Ave / Claremont Ave / 62nd St observed plan improves shares and the southbound blocks but raises removals at Ashby Ave / Claremont Ave and the northbound blocks.
- Telegraph Ave southbound in the AM peak (299 s against 245 to 285) and Shattuck Ave in both peaks stay slower than observed.
- Field checks of rounds 30 and 31 still open. Stored proposal results, text pages and previews were made on an older engine and are stale.

## Thirty-first round: route choice without a junction-count bias (change calibration-round-31)

Round 30 found that most of the excess through cars drive a route the router itself ranked costlier at departure, because the walk scaled each candidate's whole remaining cost by a fresh factor of 1 +/- 8% (`ROUTE_NOISE`, unsourced) at every node. This round replaces that rule with probit route choice from the literature, picks the dispersion by a sweep on fitted evidence, refits the demand and evaluates. Decisions are in `openspec/changes/calibration-round-31/design.md`. Simulator fingerprint 09963f723083 at the start, 60df28cd94a0 at the end. Network 69f62ad981d0b8fa (unchanged, no link renumbered), demand c4420aa7aeecc473 to edaae9760f406e08, frozen split unchanged. Rounds 18 to 21 moved to `rockridge.record-archive-2.md`.

### The model

Probit route choice [DaganzoSheffi1977], [Sheffi1985] ch. 11.2: a driver perceives each arc (a trip's first link, or a movement with the link it enters) as normal with mean its current cost and variance β x that cost, truncated at zero. The standard normal deviate of each arc is fixed for the trip, from a hash of the driver's seed and the arc, so paired scenarios and native and WASM runs agree. The driver takes the exact shortest path on its perceived costs and re-plans on the same perception. A route's perceived variance is β times its cost however many junctions it has (eq. 11.14b). Departure, guided and blocked re-planning, the legs of assumed movements and of cut-turn bypasses and the initial loading all use it; the choice of which assumed movement or bypass a flow keeps stays on mean costs. A waiting trip keeps its route until the costs change. A PM run takes about 39 s instead of 30 s. The demand fit's static assignment loads by the same model (one draw of perceived link and movement costs per pass and draw).

### Validation cases

| Case | Old rule (+/-8% per node) | Probit, β = 2 s | Expected |
| --- | --- | --- | --- |
| r1: equal routes, 1 side link onto the other (+314 s), share staying | 0.418 | 0.496 | 0.45 to 0.55 |
| r2: the same with 20 side links | 0.020 | 0.499 | 0.45 to 0.55 |
| r3: route 15 s (2%) costlier, share on it | 0.369 | 0.382 | 0.381 +/- 0.03 |
| r4: 30 s (5%) | 0.244 | 0.270 | 0.273 +/- 0.03 |
| r5: 60 s (10%) | 0.081 | 0.108 | 0.116 +/- 0.03 |
| r6: 120 s (20%) | 0.000 | 0.012 | 0.010 +/- 0.03 |

r2 is the defect of round 30 in a test: with twenty chances to leave, the old rule kept 2% of drivers on a route as good as the other. The suite now passes 59 of 66 cases (the seven failures are the reviewed ones of earlier rounds).

### Dispersion sweep

No source gives β for urban street networks (Sheffi's examples use 1 time unit for illustration), so β is an ASSUMPTION chosen on fitted evidence only: removals (D16), headline shares (D5), fitted station GEH (all stations) and the six arterial travel times against the ACTC ranges. Each value had its own demand build. Seeds 1 to 4, before the delay-feedback fit. Through cars, held-out stations and 62nd St / Forest St are reported and were not used.

| β (s) | PM removals/h | PM headline error, within 10 | PM GEH<5 fitted | PM travel times in range | AM removals/h | AM headline error | AM GEH<5 fitted | AM travel times in range | Through cars HSB / CSB / HNB / CNB (check) | 62nd / Forest EB | GEH held out PM / AM |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| old rule, round 30 demand | 1.00 | 13.4, 2 | 58% | 4 of 6 | | | | | 203 / 222 / 92 / 159 | 216 / 256 | 60% / - |
| 0.5 | 0.75 | 13.0, 2 | 63% | 3 of 6 | 0 | 1.5 | 67% | 3 of 6 | 173 / 169 / 76 / 147 | 180 / 296 | 57% / 77% |
| 1 | 0.25 | 9.9, 2 | 66% | 4 of 6 | 0 | 4.4 | 70% | 3 of 6 | 143 / 145 / 77 / 134 | 125 / 292 | 55% / 81% |
| 2 | 0.25 | 8.0, 2 | 64% | 4 of 6 | 0 | 2.8 | 69% | 3 of 6 | 152 / 163 / 96 / 147 | 118 / 296 | 55% / 73% |
| 3 | 25.0 | 5.4, 3 | 63% | 4 of 6 | 0 | 1.4 | 73% | 2 of 6 | 166 / 196 / 112 / 177 | 119 / 324 | 60% / 73% |
| 4 | 1.75 | 5.5, 4 | 66% | 4 of 6 | 0 | 2.8 | 74% | 2 of 6 | 152 / 176 / 118 / 170 | 91 / 221 | 64% / 71% |

Chosen: β = 2 s. Stability comes first: 3 and 4 fail D16 in the PM peak (at 3 one seed jams Shattuck Ave). Of the stable values, 2 has the lowest PM headline error; 1 is close (fitted GEH two points higher, headline error two points worse) and is the runner-up. On the through-car check, 1 is the best of the sweep; the choice did not use it.

### Demand

`npm run data` rebuilt the shipped and cross-validation demand on the new assignment (network and split unchanged). The delay-feedback loop ran to its stop rule. PM seeds 1 to 10:

| Iteration | Removals/h | Headline shares (47 / 47 / 68 / 45), error | Through cars HSB / CSB / HNB / CNB | 62nd St / Forest St EB | Telegraph Ave SB, s | GEH<5 fitted / held out, all stations | Cost gap |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 (free-flow and BPR costs) | 1.2 | 53 / 51 / 53 / 34, 8.9 | 155 / 160 / 96 / 147 | 130 / 275 | 357 | 63% / 57% | - |
| 1 | 6.2 | 56 / 46 / 58 / 44, 5.3 | 123 / 131 / 93 / 141 | 82 / 145 | 370 | 70% / 59% | 0.321 |
| 2 | 5.4 | 57 / 46 / 72 / 46, 4.1 | 110 / 115 / 96 / 152 | 53 / 153 | 361 | 67% / 57% | 0.109 |
| 3 | 8.0 | 56 / 42 / 71 / 39, 5.8 | 114 / 121 / 89 / 144 | 62 / 190 | 372 | 65% / 55% | 0.077 |

Converged at iteration 3. Every iteration has four to seven times the removals of the free-flow costs, so the rule restored the demand (edaae9760f406e08). As in rounds 28 and 30, the measured delays move traffic toward the counts (at iteration 2 the southbound through cars are inside their ranges and three headline shares are within 4 points) by loading the arterials until the PM peak is no longer stable.

### Result: ten seeds

PM, AM and midday, seeds 1 to 10, scale 1.0, 60 minutes, fingerprint 60df28cd94a0, `npm run assess -- --publish --noise`. Round 30 values in brackets.

| Seeds 1 to 10 | Target | PM peak | AM peak | Midday |
| --- | --- | --- | --- | --- |
| Through cars, all study-area local streets (intent tally) | | 931 (1,033) | 505 (502) | 405 (385) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 (PM) | 155 / 160 / 96 / 147 (193 / 213 / 87 / 154) | no whole-street counts | no whole-street counts |
| Headline shares HNB from / CNB from / HSB to / CSB to | 47 / 47 / 68 / 45 (PM) | 52.9 / 50.7 / 52.8 / 34.1, 2 of 4, error 8.9 (52.4 / 38.4 / 46.1 / 30.3, error 12.7) | 51.4 / 42.3 / 57.6 / 44.6 (53.7 / 45.8 / 60.8 / 47.6) | 53.4 / 37.3 / 60.7 / 43.7 (51.6 / 36.0 / 55.0 / 42.6) |
| Removals per hour (D16) | below 1 | 1.20, 0 to 3 per seed (1.60) | 0.00 (0.10) | 0.00 (0.00) |
| Entry backlog, mean % of spawned | below 2% | 0.67 (0.22) | 0.03 (0.02) | 0.01 (0.01) |
| Completed trips | | 25,788 (24,919) | 22,623 (22,200) | 16,694 (16,144) |
| Recent stations below GEH 5, fitted / held out | above 85% | 71 of 92 (77%) / 13 of 24 (54%) (66 of 92, 72% / 11 of 24, 46%) | 65 of 77 (84%) / 14 of 19 (74%) (71 of 77, 92% / 14 of 19, 74%) | no counts |
| 62nd St / Forest St eastbound, veh/h | 59 / 66 counted | 130 / 275 (206 / 241) | 50 / 113 | |
| Telegraph Ave NB / SB, s | 302-420 / 300-376 | 345 / 357 (349 / 378) | 305 / 316 | |

### Who the through cars are now

`calibrate --od-costs` as in round 30, PM seeds 1 to 4, completed through trips, on this round's engine and demand (round 30 in brackets, its own engine and round 29 demand). Classes as in round 30: an assumed movement (more than half of the trip's origin-destination flow carries one), the router's best route on mean costs, or a route the router ranked costlier on mean costs at departure.

| Through cars an hour | Hillegass Ave SB | Colby St SB | 62nd St EB | Forest St EB |
| --- | --- | --- | --- | --- |
| All | 132 (177) | 141 (167) | 74 (96) | 187 (181) |
| Making an assumed movement | 81 (83) | 28 (26) | 7 (7) | 10 (6) |
| On the router's best route | 4 (13) | 5 (8) | 4 (12) | 23 (42) |
| On a route ranked costlier (median excess) | 46 (82; 47 s, 8%) | 107 (134; 53 s, 10%) | 63 (77; 44 s, 7%) | 154 (133; 44 s, 8%) |

The costlier group fell by 36, 27 and 14 cars an hour on Hillegass Ave SB, Colby St SB and 62nd St and rose by 21 on Forest St. Under the new model a driver on a route 8% to 10% costlier on mean costs is an expected outcome: on a 500 s trip at β = 2 the perceived difference of two routes has a standard deviation of about 45 s. What remains is the size of that group on the side streets compared with the arterials, that is, how close the measured costs of the two are. Round 30 found the College Ave southbound approach to College Ave / Claremont Ave / 62nd St to be the largest delay on the arterial alternatives; the fit above shows that loading the arterials with their measured delays brings the southbound through cars into range only at the cost of stability.

### Verdict

Status `uncalibrated`. D16 fails in the PM peak (1.2 an hour against below 1) and holds in the AM peak and midday. D5 fails (2 of 4 headline shares within 10 points; error 8.9 points against 12.7). The through-car check fails on all four PM blocks, but less: Hillegass Ave SB 155 against 79 to 120 (193 before), Colby St SB 160 against 39 to 117 (213), Hillegass Ave NB 96 against 48 to 95, Colby St NB 147 against 102 to 145. The station rule fails in both peaks; the PM fitted share rose from 72% to 77% and the AM share fell from 92% to 84%.

### What remains off

- Southbound through cars on Hillegass Ave and Colby St stay about 1.3 to 1.4 times the top of their ranges, and Forest St eastbound is four times its count. The remaining cause is the measured cost of the arterial alternatives against the side streets: with their measured delays fed back, the fit brings the southbound blocks into range and jams the PM peak. The College Ave / Claremont Ave / 62nd St signal (southbound College Ave) was not attempted in this round.
- β = 2 s is an ASSUMPTION fitted to this area; β = 1 s is close on the fitted evidence.
- Telegraph Ave southbound (316 s) and College Ave northbound are slower than the observed AM range; Shattuck Ave is slower than observed in both peaks.
- Field checks of round 30 still open. Stored proposal results, text pages and previews were made on an older engine and are stale.

## Thirtieth round: who the excess through cars are (change calibration-round-30)

The question of this round: which trips make up the excess through cars on Hillegass Ave and Colby St southbound, 62nd St eastbound and Forest St eastbound, and which arterial movement or cost term makes the side street win for them? Diagnosis first, on the round 29 engine, network and demand; then the junctions that produce removals, checked against OSM and repaired at the source; then the delay-feedback fit on the repaired engine; then the ten-seed evaluation. Decisions are in `openspec/changes/calibration-round-30/design.md`. Simulator fingerprint 447ddb0b99a9 at the start; 7b94e620c9d8 after this round's engine edits (a diagnostic view and a reset repair, no change to any run); 169f9cf71eef after the trip-tracing change (explain-traffic-redistribution) merged into main during the round, whose uid repair changes every run; 09963f723083 after a last merge at the end of the round, which leaves the baseline unchanged (PM seed 1 identical to the link). Network a64c2a63399e5423 to 69f62ad981d0b8fa, demand 83bdd362657a2305 to c4420aa7aeecc473, frozen split unchanged.

### Diagnosis: who the excess through cars are

`calibrate --od-costs` (new) keeps the router's link and movement costs once a minute and, for each through trip on the counted blocks and on links 2622 and 2697 (the counted 62nd St and Forest St eastbound blocks), costs the surface part of the route the trip drove and the cheapest route with the study area's residential and service streets closed, on the costs in force when the trip asked to depart. Each cost splits into the router's terms: measured link and movement time, movement traversal time, turn penalty, control constant and local-street weight. The tool also finds the router's cheapest unrestricted route, so each trip falls in one of three classes: it makes an assumed movement (more than half of its origin-destination flow carries one: the Alcatraz Ave turn-ins and on-ramp choices of the volunteer count), it drives the router's best route, or it drives a route the router ranked costlier at departure. With the route noise off, a copy of the router reproduces the driven route of about 90% of the trips that make no assumed movement, which checks the method. Round 29 network and demand, PM seeds 1 to 4, completed trips.

The first pass gave nonsense (trips crossing 2 km in 4 s). The settle interval cleared the trip records but not the trip timings, so the two lists were out of step. Repaired (both are cleared at time zero; the tool matches by trip id; a test covers it). No run result depends on the timings.

| PM, seeds 1 to 4, through cars an hour (repaired / historical engine) | Hillegass Ave SB | Colby St SB | 62nd St EB | Forest St EB |
| --- | --- | --- | --- | --- |
| All through cars | 177 / 96 | 167 / 85 | 96 / 26 | 181 / 87 |
| Making an assumed movement | 83 / 77 | 26 / 30 | 7 / 4 | 6 / 2 |
| On the router's best route | 13 / 1 | 8 / 4 | 12 / 0 | 42 / 26 |
| On a route the router ranked costlier (median excess) | 82 / 18 (62 s, 10%) | 134 / 51 (74 s, 12%) | 77 / 22 (63 s, 10%) | 133 / 60 (40 s, 8%) |

By origin and destination group (repaired / historical, cars an hour; costs on the repaired engine, side street against arterial, s):

| Group | Hillegass Ave SB | Colby St SB | 62nd St EB | Forest St EB | Router cost at departure | Simulated time along the route |
| --- | --- | --- | --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave to south-east Oakland | 30 / 9 | 55 / 15 | 18 / 5 | 58 / 12 | 653 against 601 (Hillegass Ave), 657 against 597 (Colby St) | 477 against 472, 477 against 470 |
| Telegraph Ave from the north to the SR-24 westbound on-ramps | 33 / 32 | 10 / 12 | 2 / 1 | 2 / 0 | assumed movements (on-ramp choice) | |
| Berkeley side streets to the SR-24 westbound on-ramps | 24 / 21 | 20 / 20 | 0 / 0 | 24 / 10 | 416 against 437 (Colby St), 364 against 442 (Forest St) | 293 against 345, 255 against 355 |
| Ashby Ave from the west to College Ave north, by way of 62nd St | 23 / 2 | 11 / 1 | 34 / 3 | 0 / 0 | 710 against 677 (62nd St) | 561 against 565 |
| West Oakland to south-east Oakland | 0 / 0 | 0 / 0 | 0 / 0 | 34 / 34 | 369 against 432 | 254 against 336 |

What the counts imply: on Hillegass Ave southbound the volunteer count's turn-ins imply 87 (78 to 110) freeway-bound through cars an hour, and the model's assumed movements carry 83; the count's range for all through cars (79 to 120) leaves 0 to 33 for the rest, where the model has 94. On Colby St southbound the turn-ins imply 46 (39 to 72), the assumed movements carry 26, and the rest is 141.

What makes the side street win, plainly:

1. Most of the excess is trips that the router's own costs did not send there. On Colby St southbound 134 of 167 through cars an hour, on Hillegass Ave southbound 82 of 177 and on Forest St eastbound 133 of 181 drove a route that cost 8% to 12% (40 to 75 s) more at departure than the router's best route. The term that sends them is the perceived-cost noise of the route walk: at every node the walk multiplies the whole remaining cost of each candidate by a per-driver factor between 0.92 and 1.08 (`ROUTE_NOISE` 0.08, ASSUMPTION, no source). A long trip meets one such draw per intersection, the side-street grid offers one at every block, and on simulated times the two routes of the largest group are within 10 s of each other. The en-route switch rule perturbs each link's own cost instead, so the two rules disagree on the size of the error.
2. The trips that do take the best route through the side streets win on measured time: their arterial alternatives take 41 to 117 s longer, mostly at the College Ave southbound approach to College Ave / Claremont Ave / 62nd St (20 to 29 s per trip), Claremont Ave at Colby St / Forest St (7 to 10 s), Telegraph Ave southbound at 52nd St, 56th St and Aileen St (5 to 12 s each) and Alcatraz Ave eastbound at College Ave (4 to 10 s). The local-street weight adds 18 to 37 s to the side-street route and the control constants are about even, so neither offsets the measured time.
3. The growth from the historical to the repaired engine is in two groups: Berkeley side streets north of Alcatraz Ave to south-east Oakland (the arterial alternative is Telegraph Ave through the SR-24 interchange to 51st St and Broadway, or Alcatraz Ave and College Ave to Broadway) and Ashby Ave from the west to College Ave north, which loops by way of 62nd St instead of turning left from Alcatraz Ave onto College Ave.

Route-noise sensitivity (PM seeds 1 to 4; Hillegass Ave SB / Colby St SB through cars, 62nd St / Forest St eastbound veh/h, removals per hour, Telegraph Ave SB s): noise 0: 213 / 179, 246 / 324, 9.8, 450; 0.04: 186 / 170, 181 / 296, 4.5, 423; 0.08 (shipped): 204 / 193, 203 / 259, 4.3, 378; 0.16: 264 / 308, 276 / 279, 23.8, 380. Without noise all drivers take the same route, Telegraph Ave southbound slows and the side streets become the best route outright, so the size of the noise is not the lever; its form is. Not changed: a dispersion model drawn once per driver over link costs (as in probit route choice) needs a verified source and its own change.

### Removal hot spots

Removals by the node at the end of the link where the vehicle was removed, round 29 state, seeds 1 to 10 (per hour): PM 62nd St / Martin Luther King Jr Way 0.9, Adeline St / Alcatraz Ave 0.5, 60th St / Market St 0.4, 63rd St / King St 0.4, Ellis St / Harmon St circle 0.4, 62nd St / California St circle 0.3, and 0.1 to 0.3 at nine more nodes; AM Harmon St / King St circle 0.4, Adeline St / Alcatraz Ave 0.4, 62nd St / Martin Luther King Jr Way 0.3, and 0.1 at nine more. All lie west of Telegraph Ave. Each was checked against the OSM tags of its ways and nodes and against the queues in the seed reports.

| Junction | What the seed reports show | OSM check | Class | Action |
| --- | --- | --- | --- | --- |
| Market St / Stanford Ave (signal) and Adeline St / Martin Luther King Jr Way / Stanford Ave (signal) | The adaptive plan gave the Stanford Ave approach 42 to 94 s of green against 15 to 33 s for Martin Luther King Jr Way and Adeline St; Stanford Ave carried about 990 veh/h on one lane | Ways 24606482 (`turn:lanes=left||`) and 198550073 + 416112079 (`||right` on the last) have no `lanes` tag; the importer took the class default of one lane | import | Lane count from `turn:lanes` when `lanes` is missing, one-way chains, after chain merging [OSMTurnLanes]; Stanford Ave 941 and 4139 and 51st St 1699 become 3 lanes; no link id changes |
| 62nd St / Martin Luther King Jr Way, 61st St and 63rd St on the frontage road | Queue on the residential frontage road waiting to join the main northbound carriageway at a stop (node 478), whose own queue backed up from the Stanford Ave signal | Frontage road and stop tagged as modeled (`stop=minor`, way 653922774) | spill-back from the row above | None; gone after the repair (PM 0.9 to 0.1 an hour) |
| 60th St / Market St (two-way stop) | 60th St (11 veh/h) waited for room on the 31 m Market St link into the Market St / Stanford Ave signal | Tags as modeled | spill-back from the first row | None; gone after the repair |
| Adeline St / Alcatraz Ave (signal; two signals of a divided street joined) | Adeline St northbound (about 1,300 veh/h on 3 through lanes, short 50 m approach) queued at the signal; the cause was not isolated | Lanes and turn lanes as tagged | not settled: demand on a model-edge corridor, or the joined signal's plan | None; no removals there after the repair and refit (the change in demand may account for it) |
| 63rd St / King St (two-way stop) | King St (about 285 veh/h) waiting at the stop to cross or join 63rd St | Tags as modeled | demand near the model's west edge | None; no removals there after the repair and refit |
| Harmon St circles (Ellis St, King St, California St) | Entries blocked by circulating traffic | Mini-roundabouts as tagged | primitive (repaired in round 29) and demand | None; 0.1 an hour or less after the repair |
| Idaho St at 59th St and 61st St (two-way stops), 61st St / San Pablo Ave | Minor approaches crossing heavy streets near the model's west edge | Tags as modeled | real over-demand at a model-edge gate | None; 0.5 an hour together after the repair |
| Telegraph Ave north of 55th St, northbound (requested check) | One lane for 30 m after the 55th St signal | Way 416105064: `lanes=3`, `lanes:forward=2` (`left|`), `lanes:backward=1`; the northbound approach south of the signal has two through lanes (`left||`) and the way north has 4 lanes | data (tagging artifact) | `osmTagOverrides` sets 4 lanes, 2 northbound, ASSUMPTION pending a field check; Telegraph Ave northbound 364 to 355 s on PM seeds 1 to 4, the rest within the seed spread |

The first version of the lane repair changed the lane count before chain merging and renumbered 3,123 links. The frozen split names stations by link id, so renumbering would have moved stations between the fitted and held-out sets; the rule now runs on the finished links. No node was exempted from removal and the 180 s hold limit is unchanged.

After both repairs and `npm run data` (network 69f62ad981d0b8fa, demand c4420aa7aeecc473, frozen split unchanged), PM seeds 1 to 10: removals 1.00 an hour (0 to 3 per seed) against 4.50; the nodes left are Idaho St at 59th St (0.3) and 61st St (0.2) and five nodes at 0.1. AM seeds 1 to 3 of the cost loop's first iteration: none.

### Demand on the repaired engine

The network changed, so `npm run data` rebuilt the shipped and the cross-validation demand from the unchanged frozen split. Then the delay-feedback loop (`tools/cost-loop.ts` [PowellSheffi1982]) ran to its own stop rule. Its acceptance rule used to read the held-out GEH shares as a guard; it now decides on removals, backlog, the headline-share error and the fitted GEH shares only, and reports the held-out shares. The through-car ranges are not targets in `rockridge.targets.json` (the calibrate report checks through cars against them beside the headline shares) and played no part.

| Iteration (merged engine 169f9cf71eef, PM seeds 1 to 10) | Removals/h | Headline shares (47 / 47 / 68 / 45), error | Through cars HSB / CSB / HNB / CNB | 62nd St / Forest St EB | Telegraph Ave SB, s (link times summed, not scaled) | GEH<5 fitted / held out, all stations | Cost gap |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 (free-flow and BPR costs) | 1.6 | 52 / 38 / 46 / 30, 12.7 | 193 / 213 / 87 / 154 | 206 / 241 | 381 | 60% / 60% | - |
| 1 | 7.0 | 49 / 36 / 61 / 41, 6.1 | 155 / 186 / 85 / 165 | 119 / 167 | 406 | 67% / 60% | 0.233 |
| 2 | 14.4 | 57 / 41 / 67 / 37, 6.1 | 151 / 200 / 74 / 143 | 80 / 322 | 477 | 65% / 62% | 0.134 |
| 3 | 5.2 | 55 / 41 / 68 / 45, 3.6 | 134 / 174 / 77 / 131 | 71 / 150 | 394 | 72% / 57% | 0.068 |

The cost gap fell below 0.10 at iteration 3, so the loop stopped converged. Every iteration had three to nine times the removals of the free-flow and BPR costs, so the rule rejected all of them and restored the demand (c4420aa7aeecc473, `rockridge.cost-loop.md`). At iteration 3 all four headline shares are within 10 points, Hillegass Ave and Colby St northbound through cars are inside their ranges and 62nd St eastbound is 71 against 59 counted, but the southbound blocks stay above their ranges (134 and 174) and Telegraph Ave slows. As in round 28, feeding the simulated delays back moves through traffic toward the observed shares by loading Telegraph Ave and the streets west of it until they jam. The same loop run on the round's engine before the trip-tracing change merged (7b94e620c9d8) gave the same verdict: removals 1.0, 8.2, 11.3 and 8.1 an hour, converged at iteration 3 (gap 0.076) with through cars 126 / 164 / 79 / 138.

### Result: ten seeds

PM, AM and midday, seeds 1 to 10, scale 1.0, 60 minutes, merged engine 169f9cf71eef, `npm run assess -- --publish --noise` (reports in `reports/`, `rockridge.assessment.md`). Round 29 values in brackets.

| Seeds 1 to 10 | Target | PM peak | AM peak | Midday |
| --- | --- | --- | --- | --- |
| Through cars, all study-area local streets | | 1,033 (1,081) | 502 (537) | 385 (396) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 (PM) | 193 / 213 / 87 / 154 (192 / 210 / 91 / 159) | no whole-street counts | no whole-street counts |
| Headline shares HNB from / CNB from / HSB to / CSB to | 47 / 47 / 68 / 45 (PM) | 52.4 / 38.4 / 46.1 / 30.3, 2 of 4 (52.9 / 37.6 / 46.1 / 31.6) | 53.7 / 45.8 / 60.8 / 47.6 (52.7 / 45.4 / 58.2 / 48.5) | 51.6 / 36.0 / 55.0 / 42.6 (52.0 / 35.9 / 53.7 / 44.3) |
| Removals per hour (D16) | below 1 | 1.60, 0 to 3 per seed (4.50) | 0.10 (2.00) | 0.00 (0.00) |
| Entry backlog, mean % of spawned | below 2% | 0.22 (0.17) | 0.02 (0.01) | 0.01 (0.01) |
| Completed trips | | 24,919 | 22,200 | 16,144 |
| Recent stations below GEH 5, fitted / held out | above 85% | 66 of 92 (72%) / 11 of 24 (46%) (65 of 92, 71% / 11 of 24, 46%) | 71 of 77 (92%) / 14 of 19 (74%) (70 of 77, 91% / 14 of 19, 74%) | no counts |
| 62nd St / Forest St eastbound, veh/h | 59 / 66 counted | 206 / 241 (196 / 264) | | |
| Telegraph Ave NB / SB, s | 302-420 / 300-376 | 349 / 378 (372 / 375) | | |

The PM removals left are spread over Idaho St at 59th St and 60th St, the Harmon St circles, 62nd St / California St and 63rd St / King St (0.1 to 0.2 an hour each). The AM peak now meets D16. Through cars, headline shares and stations moved by less than the spread between ten-seed sets.

### Verdict

Status `uncalibrated` (no experimental period, as in rounds 28 and 29). D16 holds in the AM peak and midday and fails in the PM peak (1.6 an hour). D5 and the through-car check fail in the PM peak, and the station rule fails in the PM peak and, out of sample, in the AM peak. Hillegass Ave and Colby St southbound through cars stay at about 1.6 and 1.8 times the top of their ranges.

### What remains off

- Route choice. Most of the excess southbound through cars drive a route the router itself ranks costlier at departure. The walk applies the per-driver noise to the whole remaining cost at every node; a dispersion model drawn once per driver over link costs, with a verified source, is the next candidate. It changes model behavior and run time, so it needs its own change.
- The College Ave southbound approach to College Ave / Claremont Ave / 62nd St is the largest single delay on the arterial alternatives (20 to 29 s per diverted trip); 62nd St eastbound enters the same signal on its own phase. Round 29 found that the observed 2010 timing costs stability.
- Telegraph Ave southbound through the SR-24 interchange stays just above the slowest observed year (378 s against 300 to 376). Lane changes along a link (case b9) and offsets at the interchange were not attempted: neither has a verified source yet, and the diagnosis points first at route choice.
- Field checks: Telegraph Ave north of 55th St (lanes in each direction; the override is an ASSUMPTION), Stanford Ave between Market St and Martin Luther King Jr Way and 51st St east of Telegraph Ave (lane counts read from `turn:lanes`).
- Station ids are link ids, so an import repair that renumbers links would break the frozen split; the lane repair of this round avoids that by acting on finished links.
- Stored proposal results, text pages and previews were made on an older engine and are stale.

## Twenty-ninth round: are the arterials too slow? (change calibration-round-29)

The question of this round: does the repaired engine make the arterials around the Trapezoid slower than they are, so that the model diverts too many through cars onto Hillegass Ave and Colby St? Measured first, then primitives, signals and route choice, in the record's order. Network a64c2a63399e5423 and demand 83bdd362657a2305, both unchanged (`npm run data` reproduces them). Simulator fingerprint 7d07b9a9fd07 at the start, 447ddb0b99a9 at the end. Decisions are in `openspec/changes/calibration-round-29/design.md`.

### Measurement: the repaired engine against the historical one

`calibrate` now takes `--junction-recovery`. PM peak, seeds 1 to 4, same demand. Times are free-flow time plus the mean link delay along the street, scaled to the published segment length; observed are the four Alameda CTC years [ACTC-LOS2014] [ACTC-LOS2018].

| PM, seeds 1 to 4 | Physical (production) | Historical | Observed |
| --- | --- | --- | --- |
| Through cars HSB / CSB / HNB / CNB | 206 / 210 / 84 / 154 | 112 / 98 / 81 / 138 | 79-120 / 39-117 / 48-95 / 102-145 |
| Through cars, all study-area local streets | 1,060 | 633 | |
| 62nd St / Forest St eastbound, veh/h | 213 / 258 | 82 / 110 | 59 / 66 |
| Telegraph Ave NB / SB, 51st St to Russell St, s | 371 / 399 | 299 / 303 | 302-420 / 300-376 |
| College Ave NB / SB, Miles Ave to Ashby Ave, s | 223 / 247 | 211 / 203 | 188-318 / 202-293 |
| Arterial mean speed, m/s; removals per hour | 7.93; 4.0 | 9.35; 0 | |

Telegraph Ave between Alcatraz Ave and 51st St takes 281 s southbound on the repaired engine against 193 s on the historical one, and 254 s against 191 s northbound. College Ave southbound from Alcatraz Ave to Claremont Ave takes 86 s against 44 s. Where the time goes, southbound on Telegraph Ave (mean delay per vehicle, physical against historical, s): Aileen St signal 22 against 9, 56th St signal 24 against 11, 52nd St signal 22 against 7, and 8 to 12 s at each of the unsignalized nodes between 57th St and 55th St against 0 to 1. The unsignalized nodes add delay only because queues from the interchange signals reach back over them: in a test chain (two lanes, signal at a 100 s cycle) three or six unsignalized nodes upstream or downstream of the signal did not lower its discharge (820 to 872 veh/h per lane against 838 without). The signals at Aileen St, 56th St and 55th St are 88 to 94 m apart, and 52nd St and 51st St 81 m; the historical engine stored the overflow inside its nodes. On College Ave southbound the signal at Claremont Ave and 62nd St has 40 s of delay against 18 s, and its queue reaches back over the two-way stop at 63rd St.

What the evidence says, plainly. Observed: peak-period speeds on Telegraph Ave (51st St to Russell St) and College Ave (Miles Ave to Ashby Ave), both directions. Computed, not measured: the 2010 Synchro delays at College Ave / Claremont Ave / 62nd St (61.5 s, LOS E) and nearby signals [SafewayCollege-DEIR2011] and the 2013 HCM delays on Telegraph Ave [TelegraphCS2013]. Not available: travel times on Claremont Ave and Alcatraz Ave, measured approach delays, and saturation headways or start-up lost times at any Rockridge signal. The hypothesis holds in part. Telegraph Ave southbound sits at or above the slowest observed year (375 to 399 s over the seed sets of this round and round 28, against 300 to 376 s); Telegraph Ave northbound and College Ave in both directions are inside their observed ranges. The capacity primitives are not at a floor through an engine artifact: saturation flow is 1,681 veh/h per lane (a2, observed 1,500 to 2,000), b2 is 0.95 of its range midpoint, and the start-up lost time is too short (a3), which makes signals faster. b9 (two lanes, permissive left with a pocket) sits at its floor because left-turners that overflow the pocket block the inner lane and the simulator has no lane changes along a link. c2 at its floor is the closely spaced signal case above.

### Changes

| Change | Source | Kept | PM effect (seeds 1 to 10 unless stated) |
| --- | --- | --- | --- |
| Circle entry: each circulating vehicle blocks the entry for t_c - t_f / 2 = 3.6 s, ending when its tail has passed it (t_f 3.19 s, t_c 5.19 s); before, every circulating vehicle in the node blocked it until it had passed | [Rodegerdts2007] single-lane model in the Siegloch form | yes | f1 / f2 / f3 1,089 / 687 / 348 veh/h against 740-1,110 / 496-744 / 333-499 (were 963 / 405 / 138); removals 4.5 against 3.6 (seeds 11 to 20: 4.9 against 4.8); through cars 192 / 210 / 91 / 159 against 193 / 218 / 84 / 159 |
| Signals along one street within 800 m (then 150 m) coordinated: longest member cycle, simultaneous offsets | [FHWA-STM2008] ch. 6 (MUTCD 800 m guidance, one cycle per coordinated group) | no | Seeds 1 to 4: c1 / c2 0.79 / 0.75 to 1.03 / 1.00, but Telegraph Ave SB 445 s (800 m) and 422 s (150 m) against 399 s, removals 7.25 against 4.0, Hillegass Ave SB 171 and 234 against 206 |
| College Ave / Claremont Ave / 62nd St on its observed 2010 PM plan: 110 s, 62nd St 15 s, College Ave 41 s, Claremont Ave 19 s and 19 s split | [SafewayCollege-DEIR2011] Synchro worksheet | no | 62nd St EB 198 to 150 veh/h, Hillegass Ave SB 193 to 186, Forest St EB 257 to 277; removals 3.6 to 5.7 (seeds 1 to 10) without the circle repair, and over seeds 1 to 20 4.7 to 6.5 with it |

The validation suite passes 53 of 60 cases (51 before); f2 and f3 leave `validation.deviations.json`. The f cases now send the circulating vehicles on to a later exit; when both streams leave by the entering vehicles' exit lane the entry passes 957 / 478 / 158 veh/h, which the case note reports.

### Route choice

Drivers pick a route at departure on the current costs; 46% re-plan en route [Guin2021] inside an indifference band [Srinivasan2000]. Sensitivity on the round's engine, PM seeds 1 to 4 (HSB / CSB / HNB / CNB, removals per hour): as shipped 204 / 193 / 90 / 157, 4.3; guided share 0: 196 / 213 / 87 / 161, 20.5; guided share 1: 206 / 236 / 88 / 159, 2.5; switch band 0.4: 204 / 216 / 90 / 160, 11.5; local cost factor 1.0: 264 / 318 / 120 / 222, 2.5; 1.5: 202 / 217 / 81 / 110, 10.3. En-route re-planning does not set the southbound excess: the trips choose the side streets at departure because the simulated Telegraph Ave and College Ave costs make them cheaper. Only the local cost factor (an ASSUMPTION) moves the through cars much, and at 1.5 the southbound blocks stay near 200 while removals and Telegraph Ave times rise. No route-choice parameter was changed.

### Result: ten seeds

PM, AM and midday, seeds 1 to 10, scale 1.0, 60 minutes (`calibrate --seeds 1-10`, reports in `reports/`). Station figures from `npm run assess -- --periods pm_peak,am_peak --suffix round29` (not published: the state is not materially better than round 28).

| Seeds 1 to 10 | Target | PM peak | AM peak | Midday |
| --- | --- | --- | --- | --- |
| Through cars, all study-area local streets | | 1,081 (1,070) | 537 (527) | 396 (392) |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 (PM) | 192 / 210 / 91 / 159 (193 / 218 / 84 / 159) | no whole-street counts | no whole-street counts |
| Headline shares HNB from / CNB from / HSB to / CSB to | 47 / 47 / 68 / 45 (PM) | 52.9 / 37.6 / 46.1 / 31.6 (2 of 4) | 52.7 / 45.4 / 58.2 / 48.5 | 52.0 / 35.9 / 53.7 / 44.3 |
| Removals per hour (D16) | below 1 | 4.50 (3.60) | 2.00 (1.80) | 0.00 |
| Entry backlog, mean % of spawned | below 2% | 0.17 | 0.01 | 0.01 |
| Recent stations below GEH 5, fitted / held out | above 85% | 65 of 92 (71%) / 11 of 24 (46%) | 70 of 77 (91%) / 14 of 19 (74%) | no counts |
| 62nd St / Forest St eastbound, veh/h | 59 / 66 counted | 196 / 264 (198 / 257) | | |
| Telegraph Ave NB / SB, s | 302-420 / 300-376 | 372 / 375 | | |

Round 28 values in brackets. The differences in through cars, removals and stations are inside the spread of ten-seed sets: the same state gave 3.6 removals an hour on seeds 1 to 10 and 4.8 on seeds 11 to 20.

### Verdict

Status `uncalibrated`. D16 fails in the AM and PM peaks, D5 and the through-car check fail in the PM peak, and the station rule fails in the PM peak and, out of sample, in the AM peak. Hillegass Ave southbound and Colby St southbound through cars stay at about 1.6 and 1.8 times the top of their ranges.

### What remains off

- Telegraph Ave southbound through the SR-24 interchange: queues at the Aileen St, 56th St and 55th St signals and at 52nd St and 51st St reach back over links of 81 to 94 m. The model's times sit at the slow end of the observed range on this round's seeds and above it on others; the historical engine, which hid these queues, gave 303 s and through cars inside every range. Coordination on a common cycle did not help. Candidates for a later change, each needing a source: offsets set by direction and spacing at the interchange, and lane changes along a link so through drivers pass a left-turn queue that overflows its pocket (b9).
- College Ave / Claremont Ave / 62nd St: the observed plan cuts the 62nd St detour but costs stability; the adaptive plan stays.
- OSM tags Telegraph Ave northbound as one lane for 30 m between 55th St and the SR-24 underpass (way 416105064, 3 lanes north of it are 2 + 1 turn lane); not checked against the street.
- Removals west of Telegraph Ave (60th St / Market St, 62nd St / Martin Luther King Jr Way, Adeline St / Alcatraz Ave, the Harmon St circles).
- Stored proposal results, text pages and previews were made on an older engine and are stale.

## Twenty-eighth round: primitives and demand on the repaired engine (change calibration-round-28)

The first round on the engine of expose-junction-fallback-validity, repair-local-trip-measurement-integrity and repair-signal-timing-contracts. Under that engine vehicles waiting at a junction exit stay on the road; the old one held 677 to 791 of them inside junction nodes at the end of a PM hour, uncounted. Simulator fingerprint fcf19cdc05eb (start of the round) to 7d07b9a9fd07. Network a64c2a63399e5423 and demand 83bdd362657a2305 (built by the user from the frozen split; unchanged in this round). Cross-validation demand 1e0b2175a1b8079c. Decisions are in `openspec/changes/calibration-round-28/design.md`; the engine repairs are D11 to D13 of `openspec/changes/expose-junction-fallback-validity/design.md`.

### Primitives first

The validation suite was rerun before any demand change. Each failing case was traced by switching the parts of the new junction policy back to their old form one at a time, and over seeds 1 to 5.

| Case | Range | Old engine | Start of round | End of round | Outcome |
| --- | --- | --- | --- | --- | --- |
| b2 two lanes through | 752 to 1,003 | 837 | 753 | 837 | fixed (side-by-side starts, D11) |
| b9 two lanes, 10% left | 812 to 1,072 | 814 | 772 | 814 | fixed (D11); at its lower bound on seed 1 |
| e6 two-way stop, minor through at 1,000 | 45.5 to 75.8 | 72.0 | 76.5 | 72.0 | passes; 64 to 83 over seeds under every policy (noise) |
| g1 gate-fed link, 25 mph | 1,603 to 1,980 | 1,644 | 1,590 | 1,668 | fixed (moving-leader entry, D12) |
| i5 lane drop, new (ratio) | 0.75 to 1.0 | not run | 0.64 | 0.81 | fixed (D11, D12); new case D13 |
| c2 signals 100 m apart, adaptive (ratio) | 0.75 to 1.15 | 0.94 | 0.82 | 0.75 | passes at its bound; the 1,000 m reference recovered, the 100 m flow did not change |
| f2 / f3 circle entry | 496 to 744 / 333 to 499 | 489 / 172 | 432 / 110 | 405 / 138 | reviewed deviation |
| a3, e2, e3, j6, j8, j9, j12 | | fail | fail | fail | reviewed deviations, unchanged |

51 of 60 cases pass. Every remaining failure has a reviewed relevance and follow-up in `validation.deviations.json`. The circle entry deviation matters for stability: the Harmon St circles in South Berkeley account for 8 of the 36 PM removals and 7 of the 18 AM removals in the ten-seed runs.

The lane drop was the cause of the large backlog at the Grove Shafter Freeway gate. The SR-24 eastbound off-ramp toward Martin Luther King Jr Way drops from two lanes to one at a node, which passed about 1,212 veh/h; the queue filled the three-lane off-ramp and held the gate. PM seeds 1 to 4 on the same demand, start of round against end: removals 10.5 to 4.0 an hour, backlog 1.73% to 0.18% of spawned trips, 403 waiting trips at the gate (seed 1) to none, through cars on all study-area local streets 1,182 to 1,055 an hour. The counted blocks moved less: Hillegass Ave SB 245 to 206, Colby St SB 234 to 210, Colby St NB 161 to 154, Hillegass Ave NB 91 to 84. The southbound excess is not mainly a junction-capacity effect.

Calibration reports and the assessment now give the junction recovery policy and its admissions per hour (expose-junction-fallback-validity task 3.3).

Observed signal timings (repair-signal-timing-contracts task 3.3), seed-1 reports of all three periods: the signals at Martin Luther King Jr Way (45 s AM, 50 s midday and PM), 52nd St / Shattuck Ave (90 s AM, 110 s midday and PM) and Claremont Ave / Colby St / Forest St (79 s AM and PM, 147 s midday) run their observed cycles, and the observed greens are met except as follows. The 52nd St eastbound approach shows 18.3 s (AM) and 29.6 s (PM) of green of its own against 37.7 s and 57.2 s observed because the rest of its observed green runs in the shared phase, as the lead-lag ASSUMPTION of the area config describes. No demand was changed to compensate.

### Demand: what was tried

Judged on PM seeds 1 to 4 on fitted stations, headline shares, through cars and removals; the held-out stations were not consulted. Recent fitted stations are the PM count stations of the last five years in the fit.

| Variant | Removals/h | Headline shares (47 / 47 / 68 / 45) | Through cars HSB / CSB / HNB / CNB | Recent fitted GEH < 5 |
| --- | --- | --- | --- | --- |
| Shipped demand (free-flow and BPR costs) | 4.0 | 52 / 38 / 46 / 30 | 206 / 210 / 84 / 154 | 65 of 92 |
| Measured simulator delays fed back into the fit, iteration 1 (`tools/cost-loop.ts`) | 10.3 | 55 / 41 / 69 / 50 | 150 / 168 / 77 / 139 | 67% of all fitted |
| Same, iteration 2 | 7.3 | 54 / 36 / 63 / 52 | 135 / 138 / 76 / 140 | 71% of all fitted |
| Neighbor blocks across Alcatraz Ave at 0.5 of the study area's trip-rate factor (`neighborScale` 1 to 0.5) | 7.8 (3 to 19) | 53 / 46 / 56 / 50 | 178 / 204 / 72 / 126 | 71 of 92 |
| Same at 0 | 15.0 | 53 / 42 / 62 / 52 | 177 / 204 / 71 / 120 | 74 of 92 |

The cost loop rejected both iterations under its own rule (more removals than the free-flow costs) and restored the demand; `rockridge.cost-loop.md` has its table. Only the delay feedback moves the southbound through cars much, and after two iterations they stay above their ranges (135 and 138 against 120 and 117) while removals rise and the Colby St northbound share drops out of the 10-point band. The neighbor-block factor fixes Colby St northbound and the headline shares but leaves the southbound blocks at about 177 and 204. Most southbound through cars come from the Berkeley blocks north of Alcatraz Ave and from Telegraph Ave north, bound for south-east Oakland and the SR-24 westbound on-ramps; in the simulator they leave Telegraph Ave and College Ave for Hillegass Ave, Colby St, 62nd St and Forest St, which the static assignment of the fit does not foresee (in the ten-seed PM runs, 62nd St eastbound between Hillegass Ave and College Ave carries 198 veh/h against 59 counted, Forest St eastbound 257 against 66). That is the trade-off: the side-street through cars respond to the simulator's congestion, not to the trip table, so no demand lever tested meets the ranges without breaking stability. The demand was left as built.

### Result: ten seeds on the shipped demand

PM, AM and midday, seeds 1 to 10, scale 1.0, 60 minutes, `npm run assess -- --publish --noise`.

| Seeds 1 to 10 | Target | PM peak | AM peak | Midday |
| --- | --- | --- | --- | --- |
| Through cars, all study-area local streets | | 1,070 | 527 | 392 |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 79-120 / 39-117 / 48-95 / 102-145 (PM) | 193 / 218 / 84 / 159 | no whole-street counts | no whole-street counts |
| Headline shares Hillegass Ave NB from / Colby St NB from / Hillegass Ave SB to / Colby St SB to | 47 / 47 / 68 / 45 (PM) | 52.8 / 37.8 / 47.1 / 31.1 (2 of 4) | 52.8 / 45.4 / 58.4 / 49.4 | 52.2 / 36.0 / 54.3 / 43.4 |
| Removals per hour (D16: below 1.0) | below 1 | 3.60 (1 to 6) | 1.80 (0 to 5) | 0.00 |
| Entry backlog, mean % of spawned | below 2% | 0.18 | 0.01 | 0.00 |
| Completed trips | | 24,570 | 21,920 | 16,121 |
| Courtesy / yield-fallback admissions per hour, conflict bypass | | 416 / 192, 0 | 246 / 118, 0 | 51 / 13, 0 |
| Recent stations below GEH 5, fitted / held out (out of sample) | above 85% | 62 of 92 (67%) / 10 of 24 (42%) | 70 of 77 (91%) / 13 of 19 (68%) | no counts |
| Older stations below GEH 5, fitted / held out | reported | 46 of 95 (48%) / 8 of 34 (24%) | 18 of 48 (38%) / 9 of 16 (56%) | no counts |

The AM and midday headline shares are reported against the PM observations and are not gated. The held-out population is 24 PM and 19 AM stations under the frozen split (round 27 had 22 and 19). The Oakland turning-count legs (16 stations, 2013 to 2019, PM only) are now `derived` for the AM and midday, as the other scaled kinds are; none of them is recent, so the recent pass rates do not change.

### Verdict

| Period | D16 | D5 | Station rule, recent, fitted | Station rule, recent, held out | Through cars |
| --- | --- | --- | --- | --- | --- |
| AM peak | fails (1.80) | not gated | 91%, pass | 68%, fail | no target |
| Midday | holds | not gated | no counts | no counts | no target |
| PM peak | fails (3.60) | fails (2 of 4) | 67%, fail | 42%, fail | fails (3 of 4 outside) |

Status `uncalibrated`, no experimental period. The primitive deviations are reviewed. The area's `calibration` note and caveat carry these numbers.

### What remains off

- Southbound through cars on Hillegass Ave and Colby St, about 1.6 and 1.9 times the top of their ranges, and Colby St northbound slightly above. The cause is diversion off Telegraph Ave and the College Ave / Claremont Ave / 62nd St signal in the simulator. The adaptive signal there sizes the 62nd St phase (one lane, 59 veh/h counted) from the diverted traffic it carries: 18 to 25 s of green in the seed-1 reports against 17 to 21 s for College Ave and Claremont Ave, which keeps the detour attractive. Not changed in this round.
- Removals: 60th St / Market St, 62nd St / Martin Luther King Jr Way, the Harmon St circles and Adeline St / Alcatraz Ave, all west of Telegraph Ave. The circle entry rule ignores approaching circulating vehicles (deviation f2, f3).
- Held-out PM stations fail out of sample at the model edge (San Pablo Ave, Tunnel Rd, Ashby Ave Caltrans stations) and on the local streets south of the study area (McAuley St, 60th St, Ayala Ave, Canning St), which carry diverted through traffic.
- Stored proposal results, text pages and previews were made on the old engine and are stale.

## Twenty-seventh round: the final tree, held-out failures, Colby St NB through cars (change calibration-round-27)

PM, AM and midday, seeds 1 to 10, scale 1.0, 60 minutes, on the final tree: libm parity, start-up agents honor `via`, the stale-via fix, per-intent tally by ramp and two-stage `via` for the assumed flows from the mainline gates. Network 5fe8241a6ba1e306 (unchanged). Demand 8ef2c6578dfbb9fc (rebuilt by the lead on the final tree; this round did not change it); round 26 was 6f2e5661ad6e3ba9. Cross-validation demand rebuilt with it. No model or demand change was made in this round: it measures the final tree and looks for causes.

### Result

| PM peak, seeds 1 to 10 | Target | Round 26 | Final tree |
| --- | --- | --- | --- |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 79-120 / 39-117 / 48-95 / 102-145 | 109 / 110 / 70 / 151 | 111 / 105 / 73 / 141 |
| Whole-street cars, same four blocks | 79 / 39 / 48 / 102 | 69 / 54 / 44 / 98 | 69 / 49 / 51 / 88 |
| Headline shares Hillegass Ave NB from / Colby St NB from / Hillegass Ave SB to / Colby St SB to | 47 / 47 / 68 / 45 | 53.9 / 41.9 / 65.1 / 43.2 | 55.5 / 39.8 / 63.9 / 44.0 |
| Mean headline error, points (D5) | within 10 | 4.1 (4 of 4) | 5.2 (4 of 4) |
| Removals per hour PM / AM / midday (D16: below 1.0) | below 1 | 0.00 / 0.00 / 0.00 | 0.10 / 0.00 / 0.00 |
| 52nd St / Clifton St off-ramp, PM (counted 1,024 / 617) | | 1,043 / 726 | 1,047 / 725 |
| Same, AM (898 / 524) and midday (635 / 383) | | 881 / 638 and 650 / 466 | 890 / 637 and 657 / 463 |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St, PM (counted 360) | | 233 | 230 |
| Hillegass Ave NB left turn, PM / AM / midday (counted 43 / 42 / 27) | | 48 / 47 / 34 | 47 / 46 / 35 |
| Colby St NB left turn, PM / AM / midday (counted 131 / 78 / 81) | | 132 / 80 / 84 | 131 / 79 / 83 |
| Colby St NB right turn, PM (counted 32) | | 31 | 22 |
| Alcatraz Ave turn-ins onto Colby St SB from west / east, PM (counted 76 / 50) | | 45 / 31 | 45 / 29 |
| Alcatraz Ave turn-ins onto Hillegass Ave SB from west / east, PM (counted 76 / 98) | | 75 / 54 | 76 / 54 |
| Recent counts below GEH 5, PM fitted / held out in the shipped fit / held out out of sample | above 85% | 85 of 94 (90%) / 20 of 22 (91%) / 17 of 22 (77%) | 84 of 94 (89%) / 20 of 22 (91%) / 17 of 22 (77%) |
| Same, AM | | 71 of 77 (92%) / 19 of 19 / 17 of 19 (89%) | 71 of 77 (92%) / 19 of 19 / 17 of 19 (89%) |
| Midday | | no midday counts | no midday counts; stability only |
| Older counts below GEH 5, PM fitted / held out out of sample | reported | 50 of 96 (52%) / 14 of 33 (42%) | 51 of 96 (53%) / 12 of 33 (36%) |
| Same, AM | | 28 of 60 (47%) / 7 of 20 (35%) | 25 of 60 (42%) / 7 of 20 (35%) |

Status by the rules: `uncalibrated`, no experimental period. Stability holds in all three periods and D5 holds. The through-car check now passes (all four blocks inside). One rule fails: the PM held-out stations pass 17 of 22 (77%) out of sample. The simulator's PM backlog and removals are within D16 (PM 0.10 removals an hour).

### Colby St NB through cars, 151 to 141

The intent rows of the ten PM seeds (cars of the block by origin group and destination group) say where the 11 cars went. Round 25 state 139, round 26 state 152, final tree 140 on the block tally (the select-link through figure is 141). By origin group, round 26 to final: SR-24 off-ramps 80 to 70, south Oakland 55 to 53, southwest Oakland 7 to 6, Telegraph Ave south 8 to 8. By pair, the drop is the off-ramp to the hills pair (7.5 to 0.2 veh/h), then off-ramp to Telegraph Ave north (63.5 to 61.4) and to Berkeley (6.6 to 5.6). Those are the freeway-origin cars; the two-stage `via` now fixes their ramp and then their turn, where before the simulator chose the ramp and some of them drove Colby St on the way to Claremont Ave. The AM fill does not touch the PM, and the natural-flow cut acts on plain flows only, so neither moved this figure. The change cannot be isolated from the other simulator fixes that landed together (the round 26 binary is gone), so this is the mechanism the tally supports, not a controlled test. The assumed volumes were not touched and do not exceed the counted movements. Whole-street cars are 88 against 102 (98 in round 26): the through figure is inside the range with fewer whole-street cars, so the extra through cars join mid-street.

### The PM held-out failures (17 of 22)

Out-of-sample failures, recent PM stations (counted, cross-validation demand, shipped demand):

| Station | Counted | Cross-validation | Shipped |
| --- | --- | --- | --- |
| San Pablo Ave station, link 115 inward (Caltrans AADT 2024) | 830 | 155 (GEH 30.4) | 779 (1.8) |
| Tunnel Rd station, link 3463 inward (Caltrans AADT 2024) | 1,094 | 554 (18.8) | 958 (4.3) |
| Ashby Ave station, link 3396 inward (Caltrans AADT 2024) | 952 | 613 (12.1) | 698 (8.8) |
| Caldecott Ln off-ramp, node 1695 (Caltrans ramp 2024) | 113 | 25 (10.5) | 53 (6.6) |
| Canning St, 59th St to McAuley St, SB (volunteer count 2025) | 49 | 14 (6.2) | 27 (3.7) |

Four of the five are Caltrans counts at the edge of the model (three AADT link stations at gates, one ramp), none is an Alcatraz Ave entry, a turn-in or Dana St. They share a cause with the validation design: the link station is held out of the fit that scores it, and nothing else in that fit says how much of the gate's volume uses that link. San Pablo Ave drops from 779 to 155. The fifth is one local block (Canning St southbound) that the fit without it puts at 14 against 49 counted. Holding out the only observation of a gate's entry link tests what the fit would do without data for it, not the demand model. A change to the hold-out (keep gate-side Caltrans stations in the fit) would raise the pass rate by construction and is the kind of change this rule is meant to prevent; none was made. The same five on the shipped demand: three below GEH 5 (San Pablo 1.8, Tunnel 4.3, Canning 3.7), Ashby 8.8 and Caldecott 6.6 above. Alcatraz Ave entries (230 against 360) and the turn-ins onto Colby St southbound (45 and 29 against 76 and 50) and Hillegass Ave southbound from the east (54 against 98) stay low; they are fitted stations, not held out, and are not among the failures.

### Scenario regression

63rd St scenario and six-filter scenario (proposal p5), PM, seeds 1 to 3: no unroutable trips, no invalid interventions, gridlock removals 0 except 2 in one 63rd St seed. Of the assumed-flow trips that make their movement, 0.8% revisit a node in the baseline, 1.0% (63rd St) and 0.0% (six filters, 10 trips) in the scenario. Trips that do not make it revisit a node at 10.3% in the baseline and 10.3% and 10.5% in the scenarios, so the revisits are not made by `via` trips. Trips with the movement fall from 726 to 300 (63rd St) and 10 (six filters). Two-stage `via` flows in the final demand (mainline-gate assumed flows): PM 16 flows, 110.0 veh/h; AM 11, 69.2; midday 14, 67.7.

## Twenty-sixth round: review fixes to the demand and the verdict (change calibration-round-26)

PM peak, AM and midday, seeds 1 to 10, scale 1.0, 60 minutes, `calibrate` built from commit 068e927 (the libm commit of the simulator fixes; interim results on the earlier binary agreed within seed spread). Before: network 5fe8241a6ba1e306, demand 8695ddc28b152c35 (round 25). After: network 5fe8241a6ba1e306 (unchanged), demand 6f2e5661ad6e3ba9 (rebuilt twice: same hash). Cross-validation demand f9c66e8df7b39d1d. Decisions are in `openspec/changes/archive/*-calibration-round-26/design.md`. No parameter was tuned toward a verdict: the checks were corrected and the status is what they say, `uncalibrated` (the area was `calibrated` before).

### What was wrong, reproduced

1. The held-out rule was in sample. The shipped demand is fitted with every station, so the PM validation stations scored 19 of 22 there. The assessment now runs the same ten seeds on the cross-validation demand (the fit without them, with the same ramp split and intent annotation as the shipped file) and scores them there.
2. Midday has no counts. Every midday target is the PM count times 0.62 (so is the AM or midday target of an ADT-based station and of a ramp with no AM count). The stations carry `derived` and the rule skips them: midday has no judged stations (232 of its 248 scored stations are derived; the other 16 have no recent count), and the verdict says "midday is checked for stability only". The caveat quotes no midday rates.
3. The AM trip ends counted five Telegraph Ave entries (60th, McAuley, 59th, 58th, 57th St; 199 veh/h together in the PM) as zero. They now take the PM count times 0.74 (entering) and the exits of 58th and 57th St the PM count times 0.78 (ASSUMPTION).
4. Plain flows of other pairs that make a counted turn kept at least 0.1 of their volume on top of the pinned flows. They now give up volume to the count (ASSUMPTION, `naturalDetour` 1.05): 375 veh/h PM from 137 flows (AM 318, midday 224).
5. Chained freeway links (3981 to 3984 to 3979; 4057 to 4081 to 4083 to 4077) divided flows into parts of one physical route. PM off-ramp flows divided: 353 of 1,344 (before 411 of 1,432).
6. Local intent flows had the other street's turn as an alternative; only through flows have alternatives now.

### Result

| PM peak, seeds 1 to 10 | Target | Before | After |
| --- | --- | --- | --- |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 79-120 / 39-117 / 48-95 / 102-145 | 104 / 100 / 73 / 138 | 109 / 110 / 70 / 151 (Colby St NB outside) |
| Whole-street cars, same four blocks | 79 / 39 / 48 / 102 | 70 / 46 / 46 / 95 | 69 / 54 / 44 / 98 |
| Headline shares Hillegass Ave NB from / Colby St NB from / Hillegass Ave SB to / Colby St SB to | 47 / 47 / 68 / 45 | 54.6 / 42.7 / 63.2 / 40.8 | 53.9 / 41.9 / 65.1 / 43.2 |
| Mean headline error, points (D5) | within 10 | 5.2 (4 of 4) | 4.1 (4 of 4) |
| Removals per hour PM / AM / midday (D16: below 1.0) | below 1 | 0.00 / 0.00 / 0.00 | 0.00 / 0.00 / 0.00 |
| 52nd St off-ramp / Clifton St off-ramp, PM (counted 1,024 / 617) | | 1,001 / 733 | 1,043 / 726 |
| Same, AM (898 / 524) and midday (635 / 383) | | 892 / 626 and 670 / 480 | 881 / 638 and 650 / 466 |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St, PM | 360 | 242 | 233 |
| Hillegass Ave NB left turn onto Alcatraz Ave, PM / AM / midday (counted 43 / 42 / 27) | | 56 (PM only) | 48 / 47 / 34 |
| Colby St NB left turn onto Alcatraz Ave, PM / AM / midday (counted 131 / 78 / 81) | | 134 (PM only) | 132 / 80 / 84 |
| AM local trip ends implied by the count, destinations / origins (veh/h) | | 479 / 584 | 627 / 686 |
| AM trips in the demand after the fit, local / through (veh/h) | | 6,741 / 4,667 | 7,815 / 4,124 |
| Recent counts below GEH 5, PM fitted / held out in sample / held out out of sample | above 85% | 84 of 94 (89%) / 19 of 22 (86%) / not measured | 85 of 94 (90%) / 20 of 22 (91%) / 17 of 22 (77%) |
| Same, AM | | 73 of 82 (89%) / 22 of 23 (96%) / not measured | 71 of 77 (92%) / 19 of 19 (100%) / 17 of 19 (89%) |
| Midday | | 90 of 96 (94%) / 22 of 23 (96%) | no midday counts; stability only |
| Older counts below GEH 5, PM fitted / held out out of sample | reported | 52 of 96 (54%) / not measured | 50 of 96 (52%) / 14 of 33 (42%) |
| Same, AM | | 29 of 71 (41%) / not measured | 28 of 60 (47%) / 7 of 20 (35%) |

The AM sim reports no through-car check (the targets file has only PM whole-street counts), so AM through cars are known from the demand only: 5,826 to 5,587 veh/h offered and 4,667 to 4,124 after the fit. The ten-seed interval is about 4 veh/h on the through cars and 2 points on the shares.

### Verdict under the corrected rules

| Period | D16 | D5 | Station rule, recent, fitted | Station rule, recent, held out (out of sample) | Through cars |
| --- | --- | --- | --- | --- | --- |
| AM peak | holds | not gated | 71 of 77, pass | 17 of 19 (89%), pass | no target |
| Midday | holds | not gated | no counts | no counts | no target |
| PM peak | holds | holds | 85 of 94, pass | 17 of 22 (77%), fail | fail: Colby St NB 151 against 102 to 145 |

Status `uncalibrated`, no experimental period. Two checks fail in the PM peak. The held-out stations pass 77% on a fit that did not see them, against 91% on the fit that did, which is the over-fit the in-sample figure hid. Colby St northbound has 151 through cars against an upper bound of 145; it was 138 before. The cause was not investigated: the whole-street cars (98 against 102) and the freeway share (41.9% against 47) are close to their counts, so the extra cars end along the street or join it, which the changed local trip rates and the natural-flow cut both touch. The minimum for judging the held-out rule is 10 recent stations (ASSUMPTION): AM has 19 and PM 22.

### Assumed flows from the SR-24 off-ramps: not fixed

18 assumed flows from the mainline gates (PM 113 veh/h, AM 72, midday 70, 2% of the 5,734 PM off-ramp veh/h) carry the Colby St or Hillegass Ave movement as `via`, so the ramp split skips them and the simulator chooses their ramp. A two-stage `via` needs a change in `crates/sim`.

### Scenario regression, no via loops

63rd St scenario (two filters, two diverters) and the six-filter scenario (proposal p5), PM peak, seeds 1 to 3, no gridlock removals, no unroutable trips, no invalid interventions. Share of assumed-flow trips that visit a node twice, baseline / scenario: 7.9% / 8.4% (63rd St) and 7.9% / 9.2% (six filters), round 25 7.6% / 8.1% and 7.6% / 8.5%; the share that still makes the blocked movement falls from 23% to 7% and 0%. Ramp flows: 1.4% / 1.6% and 1.4% / 1.5% revisits.

### What remains

The Alcatraz Ave entries (233 against 360), the Alcatraz Ave turn-ins onto Colby St and Hillegass Ave southbound (45 and 31 against 76 and 50, 54 against 98) and the 52nd St and Martin Luther King Jr Way movements stay low; the natural-flow cut removes trips that the turn-ins also used. Older counts pass 52% (PM) and 47% (AM) fitted and 42% and 35% held out. Colby St northbound through cars are above their range.

## Twenty-fifth round: Colby St NB whole-street cars, the off-ramp split, older counts (change calibration-round-25)

PM peak, seeds 1 to 10 (AM and midday also 1 to 10), scale 1.0, 60 minutes. Before: network 5fe8241a6ba1e306, demand 74a9882dd4286e12 (rebuilt at the start of the round with the cross-validation fit skipped, `SKIP_CV=1`: the same flows). After: network 5fe8241a6ba1e306 (unchanged), demand 8695ddc28b152c35. The simulator did not change; `calibrate` gained a debug dump of the trails of trips that use given links. The "before" column was measured again on the round 24 files and matches round 24. Decisions are in `openspec/changes/archive/*-calibration-round-25/design.md`.

Three changes are kept, all in the demand builder: ramp choice made upstream (`ramps.choice`), full weight for ramp counts (`countFit.recency.exemptRamps`) and whole-street intents for Colby St northbound (`wholeStreet`, with the through intents at 0.47 and 0.15 of the exits). Each is an ASSUMPTION and is labeled so in the config. The other tests of the round (lower bound 0.05, lower local trip rates, the two changes taken apart) are under "Tried and not kept".

### Result

| PM peak, seeds 1 to 10 | Target | Before | After |
| --- | --- | --- | --- |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 79-120 / 39-117 / 48-95 / 102-145 | 110 / 97 / 66 / 139 | 104 / 100 / 73 / 138 |
| Whole-street cars, same four blocks | 79 / 39 / 48 / 102 | 75 / 47 / 41 / 80 | 70 / 46 / 46 / 95 |
| Headline shares Hillegass Ave NB from / Colby St NB from / Hillegass Ave SB to / Colby St SB to | 47 / 47 / 68 / 45 | 50.1 / 37.7 / 64.6 / 41.9 | 54.6 / 42.7 / 63.2 / 40.8 |
| Mean headline error, points (D5, within 10) | | 4.7 (4 of 4) | 5.2 (4 of 4; Hillegass Ave NB is 7.6 high) |
| Removals per hour PM / AM / midday (D16: below 1.0) | below 1 | 0.10 / 0.00 / 0.00 | 0.00 / 0.00 / 0.00 |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St | 360 | 255 | 242 |
| Colby St entries at Claremont Ave / Forest St (counted 182 / 58) | | 157 / 48 | 187 / 56 |
| 52nd St off-ramp / Clifton St off-ramp, PM (counted 1,024 / 617) | | 900 / 883 | 1,001 / 733 |
| Same, AM (898 / 524) and midday (635 / 383) | | 834 / 763 and 737 / 505 | 892 / 626 and 670 / 480 |
| Telegraph Ave NB / SB travel time, s (observed 302-420 / 300-376) | | 300 / 307 | 298 / 306 |
| Completed trips per hour, arterial speed (m/s) | | 24,468, 9.41 | 24,485, 9.37 |
| Recent counts below GEH 5, PM fitted / held out | above 85% | 82 of 94 (87%) / 19 of 22 (86%) | 84 of 94 (89%) / 19 of 22 (86%) |
| Same, AM | | 73 of 82 (89%) / 21 of 23 (91%) | 73 of 82 (89%) / 22 of 23 (96%) |
| Same, midday | | 92 of 96 (96%) / 22 of 23 (96%) | 90 of 96 (94%) / 22 of 23 (96%) |
| Older counts below GEH 5, PM fitted / held out | reported | 48 of 96 (50%) / 16 of 33 (48%) | 52 of 96 (54%) / 18 of 33 (55%) |
| Same, AM | | 31 of 71 (44%) / 10 of 24 (42%) | 29 of 71 (41%) / 13 of 24 (54%) |
| Same, midday | | 57 of 96 (59%) / 17 of 33 (52%) | 54 of 96 (56%) / 21 of 33 (64%) |
| All counts below GEH 5, PM fitted / held out | | 130 of 190 (68%) / 35 of 55 (64%) | 136 of 190 (72%) / 37 of 55 (67%) |

The interval of a ten-seed mean is about 4 veh/h on the through cars and 2 points on the shares, so the through-car changes and the Alcatraz Ave entries (255 to 242) are inside the seed spread except Colby St entries and whole-street cars, which move by more. The older counts together (fitted and held out) go from 64 to 70 of 129 in the PM, 41 to 42 of 95 in the AM and 74 to 75 of 129 at midday: only the PM gain is outside the noise (the AM and midday fitted figures fall by 2 and 3 stations).

### 1. Colby St northbound: where the whole-street cars were lost

The count has 182 cars entering at the south end (121 from Claremont Ave, 57 from Forest St, 4 other), 102 driving the whole street, 51 turning off and 29 ending along it; 47 turn on from side streets and about 15 start on the street. The model had 80 whole-street cars, 157 and 48 entries at Claremont Ave and Forest St (counted 182 and 58) and 187 cars on the last block against 164 counted.

The trails of Colby St northbound (`CAL_DUMP_PATH_TRIPS`, seeds 1 and 2 of the round 24 state, per 60-minute run) say where it goes wrong:

| Cars | Per run | Whole street |
| --- | --- | --- |
| Entered at the south end, SR-24 off-ramp origin, through | 40.5 | 38.5 |
| Entered at the south end, Telegraph Ave and south side, through | 42.0 | 24.0 |
| Entered at the south end, with a local end (SR-24 36.0, south side 21.0) | 57.0 | 8.5 |
| Joined from a side street, local end | 77.0 | |
| Joined from a side street, through | 29.5 | |

1. The entries at the south end are short by 14% (both movements 0.86 of the count) and the model has 106 cars joining from side streets where the count has about 62. The through cars (neither end in the study area) that join are the assumed through intents: they must make the left or right turn at Alcatraz Ave, and the cheapest way to that turn for a car from Telegraph Ave or the ramps is often 63rd St, which reaches the north end of Colby St. 29.5 through cars per run joined that way, mostly by 63rd St, and 18 of the 42 south-side through cars left Colby St early to Telegraph Ave. The intents assume 101 veh/h through cars; 62 per run (70 per hour) drove the whole street.
2. Mid-block loss to side streets exists but is not the main loss. Of the cars that entered at the south end, 49% left before Alcatraz Ave (count: 44%), which the turn-off counts allow (51 and 29).
3. The assumed volumes are not too large. The through intents add up to 101 veh/h against 102 whole-street cars counted, and the exits at Alcatraz Ave were right (166 against 163 counted). The shortfall is in the route taken to the turn, not in the volume.

The fix. An assumed movement can name the volunteer count's whole-street route (`wholeStreet`), and its through intents take only seed flows whose route to the turn enters Colby St at its first link. The candidates of the off-ramp intent fall from 34 to 3 flows and those of the south-side intent from 96 to 82 (PM). On the old demand this alone (C in the table below) gave 103 whole-street cars and the entries 178 and 49, with the freeway share at 37.2% (0.2 inside the limit), so the freeway cars were the next gap: the street's freeway share is 0.47 of its trips and the intents had put 65 of the 102 whole-street cars on the ramps. Taking every freeway-origin trip of the street to be a whole-street car (the upper end of the round 21 range, 77 of 163 exits) gives 0.47 and 0.15 for the two through intents; the 0.38 local share is unchanged, so the intents still add up to the counted exits. With the ramp choice (part 2) the freeway share is 42.7% (4.3 below observed, was 9.3), whole-street cars 95 (observed 102) and the entry at Claremont Ave 187 (182).

What did not work or remains: 95 against 102 is inside the ten-seed interval of the model but not at the count; Hillegass Ave NB's freeway share went up (50.1 to 54.6, 7.6 above observed) with the ramp choice and is the largest headline error; the Alcatraz Ave entries fell 13 (255 to 242). The Colby St SB left turn onto Claremont Ave toward College Ave (75 counted, 1 modeled) is unchanged.

### 2. The off-ramp split

(a) Delays. Model delay per approach (PM, seed mean of the link delay, the round 24 state) against the Existing PM worksheets of [SafewayCollege-DEIR2011] and [CHRCO-EIR2014] (HCM approach delay, s; read in the PDFs on 2026-11-15):

| Approach | Model | Worksheet |
| --- | --- | --- |
| Clifton St ramp (EB) / Clifton St (WB) at Claremont Ave | 10.7 / 8.3 | 7.2 / 5.4 |
| Claremont Ave NB / SB at Clifton St | 22.3 / 16.8 | 27.7 / 23.7 |
| Claremont Ave NB / SB at Hudson St | 7.2 / 4.9 | 12.7 / 20.9 |
| Hudson St (WB) at Claremont Ave | 25.4 | 22.5 |
| Claremont Ave NB / SB at Ashby Ave | 36.1 / 36.1 | 70.3 / 45.5 |
| Telegraph Ave EB / WB / NB / SB at 51st St | 16.9 / 18.1 / 13.0 / 25.0 | 37.2 / 47.2 / 35.7 / 63.0 |
| 52nd St EB / WB / NB / SB at Shattuck Ave | 15.3 / 21.3 / 27.9 / 10.0 | 21.8 / 42.7 / 33.6 / 59.2 |
| Telegraph Ave NB / SB at 52nd St and Claremont Ave | 15.8 / 7.1 | 11.6 / 13.3 |

Most approaches are faster in the model than in their worksheets, and the shortfall is largest on the 52nd St path. At Telegraph Ave and 51st St it is 20 to 38 s on all four approaches (the 37 s and 47 s of round 23 are the eastbound and westbound approaches), at Shattuck Ave and 52nd St 6.5 s on the eastbound approach the ramp trips use and 21 s westbound, and at Telegraph Ave, 52nd St and Claremont Ave the eastbound 52nd St approach has 87 s in the worksheet against 15.8 s. On the Clifton St path the shortfall is 5 to 7 s on Claremont Ave at Clifton St (the ramp approach is 3.5 s too slow, 10.7 against 7.2), 5 to 16 s at Hudson St and 9 to 34 s at Ashby Ave. The 52nd St ramp approach has 12.9 s in the model; the worksheet of the ramp and 52nd St (unsignalized) gives an average delay of 7.5 s. Correcting the delays would make the 52nd St path dearer relative to the Clifton St path, the opposite of what the counts need (1,024 on 52nd St, 617 on Clifton St). The costs do not explain the split. The Claremont Crescent merge has no worksheet and was not changed.

(b) Destination mix. Clifton St ramp trips by destination group (per 60-minute run, round 24 state): south Oakland 403, Berkeley north 164, study area 131, Telegraph Ave north 50, Claremont hills 33, College Ave north 25; the 52nd St ramp: south Oakland 434, Telegraph Ave south 204, Berkeley north 121, Berkeley northwest 61. South Oakland is split 52 to 48 between the ramps, which is what two paths within 1.4 s give. The count at the Clifton St terminal (SafewayCollege 2010) says otherwise: of 617 cars, 442 turn north on Claremont Ave, 67 south and the rest go straight on to Clifton St. The model sent 193 south (2.9 times the count) and 484 north. The 2010 count and the 2013 count at 52nd St therefore put the south Oakland trips on the 52nd St ramp; the model put half of them on the Clifton St ramp because that is where its router sent them.

The static fit already agreed with the counts: its assignment has 63 south and 504 north at the Clifton St terminal, 1,045 on the 52nd St ramp and 752 on the Clifton St ramp (22% over; weight 0.5 for counts of 2010 and 2013). The simulator did not follow it because the ramp is chosen by the simulator's costs, not the fit's. Two changes:

- Ramp counts keep full weight (`exemptRamps`). The Claremont Ave and Telegraph Ave ramp counts are all older than 10 years: the 52nd St count is of 2013, the Clifton St count of 2010 and the Caltrans rows of 2012. They are the only ramp evidence, so down-weighting them removes the anchor of the split. The static fit now has 1,015 on the 52nd St ramp and 631 on the Clifton St ramp (counted 1,024 and 617). Should the ramp counts be exempt? Yes: they are the only ramp evidence. What the exemption does in the simulator on its own is in the table of variants.
- Ramp choice made upstream (`ramps.choice`). Each off-ramp flow is divided over the ramps its final static assignment uses and carries the ramp as its `via` (1,432 PM flows, 411 of them divided over two ramps or more). The simulator keeps the ramp while it costs at most 1.3 times the plain route. In the simulator the Clifton St terminal now has 63 south (67 counted), 472 north (442) and 733 on the ramp (617), the 52nd St ramp 1,001 (1,024) and the Telegraph Ave and Aileen St off-ramp 670 (Caltrans 621). In AM the ramps carry 892 / 626 against 898 / 524 counted (834 / 763 before) and at midday 670 / 480 against 635 / 383 (737 / 505).

The Clifton St ramp is still 116 over its count in the PM (the static assignment has 631). A destination mix that sends the south Oakland trips to the 52nd St ramp is now an assumption of the fit and not a result of the router: a scenario that makes the Clifton St path much cheaper does not move these trips until the detour test (1.3) fails.

### 3. Older counts: is the trip table too large?

The hypothesis. The median factor of the counted flows sits at the lower bound 0.10, so the seed table is larger than the counts support. Measured on the seed flows (`FIT_DUMP`) and the final demand (PM):

| Flows | Seed veh/h | Final veh/h | Flows at the lower bound | Seed volume at the bound |
| --- | --- | --- | --- | --- |
| Through | 8,459 | 4,542 | 1,191 of 1,814 (66%) | 5,822 (69%) |
| Local | 6,175 | 8,588 | 1,888 of 3,431 (55%) | 3,742 (61%) |
| Ramp | 13,068 | 11,674 | 1,215 of 2,659 (46%) | 6,033 (46%) |

(AM: through 49% of flows at the bound, local 26%, ramp 34%.) The through seed is cut to 54%, almost all of it on pairs to and from the hills: San Pablo Ave to Claremont hills 422 to 110 veh/h (91% of its seed at the bound), southwest Oakland to Claremont hills 250 to 77, West Berkeley to Claremont hills 250 to 63, Claremont hills to San Pablo Ave 249 to 25, to southwest Oakland 184 to 18. Southwest Oakland to Ashby Ave west goes up (176 to 208). The local seed is too small, not too large: it is raised by 40%.

What the failing older stations show:

1. The static assignment meets the older counts. In the PM it has 170 of 206 older stations below GEH 5 (83%) and carries 0.98 of the 2013 counts and 1.04 of the 2010 counts, while the simulator passes 54% and carries 0.84 and 0.94 of them. Per source, simulator over static: 0.86 for the 2013 counts, 0.91 for the 2010 counts, 0.90 for the city counts, 1.00 for the ramps. The shortfall is between the static assignment and the simulator, not in the size of the table.
2. It sits on the west side. Simulator over count by corridor (PM, after this round): Telegraph Ave and 51st St 0.72, Market St and 55th St 0.80, MLK Way and 55th St 0.79, SR-24 ramps and 52nd St 0.83, MLK Way and 52nd St 0.83, Telegraph Ave, 52nd St and Claremont Ave 0.82, Shattuck Ave and 52nd St 0.87; the corridors north and east are at 0.95 to 1.03. Telegraph Ave northbound at 52nd St has 614 against 1,124 counted, at 51st St 434 against 739; the static fit itself reaches 846 and 496 there (it cannot meet those counts against the gate counts of 2018 and 2019). The ramp choice gives back some of it: the older counts pass 64 of 129 before and 70 after (PM), the 52nd St corridor stations 1 to 2 each.
3. Turns and approach totals fail alike. PM older leg totals (entering and leaving volumes by leg and ramps): 61 of 116 below GEH 5 (53%), model at 0.87 of the counts; older turning movements: 39 of 73 (53%), 0.84, with 13 of 17 passing under 50 veh/h and 26 of 56 above. So it is not the 2010 and 2013 turn splits: the approach totals fail as often. The counts of 2013 fail most (47% of legs and 52% of movements).
4. The seed is not the cause. Lower bound 0.05 (ramp and local 0.05 as well) leaves the older counts where they were (63 of 129 against 64); local trip rates cut to 60% lower them (55 of 129) and break the guards (table of variants). Raising through flows is not supported: the through table is already cut to 54%, and the fit raises the pairs the older counts need.

What is left, and why it stays: the older counts are 2010 and 2013 counts of an area where the gates' 2018 to 2021 counts are lower, the median change of the published ramp series is -0.8% a year, and the simulator delivers 0.84 of the static volumes on the west side. A growth rate would make the older counts agree better (a rate of -0.8% a year takes 13 years to 0.90), but round 24 found no verified rate for the arterials and this round did not add one. The delivery gap of the simulator on the west corridors (a feedback loop on volumes, like the cost loop of round 20) is the next test.

### Tried and not kept

PM, ten seeds; through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB, shares as above, removals, ramps, whole-street cars on Colby St NB, recent counts fitted / held out, older counts fitted:

| Variant | Through cars | Shares | Removals | Ramps | Colby NB whole | Recent | Older |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Round 24 state | 110 / 97 / 66 / 139 | 50.1 / 37.7 / 64.6 / 41.9 | 0.10 | 900 / 883 | 80 | 82 / 94, 19 / 22 | 48 of 96 |
| Ramp counts at full weight only | 108 / 104 / 65 / 140 | 50.4 / 37.3 / 63.4 / 41.8 | 0.10 | 878 / 849 | 80 | 80 / 94, 20 / 22 | 47 of 96 |
| Ramp choice only (ramp counts at weight 0.5) | 105 / 103 / 71 / 136 | 54.5 / 41.1 / 61.5 / 42.6 | 0.40 | 1,019 / 754 | 83 | 82 / 94, 19 / 22 | 52 of 96 |
| Ramp counts at full weight and ramp choice | 99 / 98 / 70 / 136 | 53.9 / 39.3 / 61.5 / 42.4 | 0.30 | 1,007 / 708 | 81 | 82 / 94, 19 / 22 | 52 of 96 |
| Whole-street intents only (0.40 and 0.22) | 104 / 99 / 65 / 143 | 50.8 / 37.2 / 63.0 / 42.0 | 0.00 | 905 / 904 | 103 | 85 / 94, 19 / 22 | 47 of 96 |
| Both, intents at 0.40 and 0.22 | 113 / 104 / 70 / 132 | 54.6 / 38.7 / 60.6 / 40.5 | 0.10 | 1,012 / 719 | 89 | 84 / 94, 19 / 22 | 55 of 96 |
| Both, intents at 0.47 and 0.15 (kept) | 104 / 100 / 73 / 138 | 54.6 / 42.7 / 63.2 / 40.8 | 0.00 | 1,001 / 733 | 95 | 84 / 94, 19 / 22 | 52 of 96 |
| Lower bound 0.05 (round 24 state) | 104 / 89 / 69 / 132 | 50.4 / 38.0 / 61.6 / 40.5 | 0.00 | 910 / 872 | 79 | 85 / 94, 20 / 22 | 48 of 96 |
| Kept state with local trip rates at 60% | 103 / 118 / 65 / 129 | 47.5 / 51.5 / 83.3 / 68.6 | 0.10 | 1,023 / 778 | 94 | 78 / 94, 16 / 22 | 45 of 96 |

The ramp choice does the work on the ramps (1,019 / 754 alone). Full ramp weights alone change the static fit (1,015 / 631) and leave the simulator where it was (878 / 849); with the choice they take the Clifton St ramp from 754 to 708 and the PM removals from 0.40 to 0.30 (733 and 0.00 in the kept state, which also has the whole-street intents). The ramp choice alone raises the Hillegass Ave NB freeway share by 4.4 points (50.1 to 54.5), and that stays. The whole-street intents alone make the Colby St NB freeway share worse (37.2%, 0.2 inside the limit); with the 0.47 and 0.15 intents the shares and the whole-street cars are the best of the set. The older-count passes are 52 to 55 of 96 in every variant with the ramp choice, so the choice among them rests on the Colby St figures and the shares. The lower bound 0.05 does not raise the older counts and is not kept. Local trip rates at 60% break D5 (Hillegass Ave SB to the freeway 83%, Colby St SB 69%), the through-car check (Colby St SB 118 against 39 to 117) and the recent station rule (16 of 22 held out), which is what the fit's raising of the local table by 40% says.

Not tried: growth from the count year (round 24), a feedback loop on volumes (above), Hillegass Ave NB whole-street intents (its whole-street cars, 46 against 48, are right).

### Project lead's scenario checks (PM, seeds 1 to 3)

Run with `diag63` (the 63rd St scenario of round 22: filters at Martin St and Ayala Ave and at Ayala Ave and Forest St, diagonal diverters at 62nd St and Colby St and at 63rd St and Hillegass Ave) and `mf` (six filters), each on the round 24 demand and on this round's:

| Scenario | Round 24 demand | Round 25 demand |
| --- | --- | --- |
| 63rd St, all blocks, veh/h | 1,072 to 1,181 (+10%) | 993 to 1,056 (+6%) |
| 63rd St, Telegraph Ave to Canning St (EB), through cars | 41 to 64 | 18 to 33 |
| Assumed-flow trips with a node visited twice, base to scenario | 8.2% to 8.7% | 7.6% to 8.1% |
| Ramp-flow trips with a node visited twice | | 1.4% to 1.6% (every trip makes its ramp movement) |
| Six filters: local street flow, veh-km/h | 803 to 321 | 748 to 308 |
| Six filters: assumed-flow trips with a node visited twice | 8.2% to 9.4% | 7.6% to 8.5% |

No via-trip loops: the repeated-node share rises by about 0.5 points in the 63rd St scenario and 0.9 in the six-filter scenario on both demands. The base flow on the east blocks of 63rd St falls (65 to 48 on the Telegraph Ave to Canning St block) because the whole-street intents no longer send the through cars up Colby St from 63rd St, and the rise in the scenario is smaller (+63 veh/h against +109).

### Rules and status

D16 holds in all three periods (PM, AM and midday 0.00 removals per hour). D5 holds (4 of 4, mean error 5.2; Hillegass Ave NB 7.6 high). The through cars are inside the observed ranges on all four blocks (Colby St NB 138 of 102 to 145). The station rule on counts from the last five years holds in all three periods, fitted and held out (PM 89% and 86%, AM 89% and 96%, midday 94% and 96%); the PM held-out margin is the same thin 19 of 22. The assessment prescribes `calibrated` with no experimental period, and `status` stays `calibrated`. The calibration note and caveat carry the new numbers. Older counts pass 54% in the PM (AM 41%, midday 56%), the recent set is still mostly one hour of one day (107 of the 116 PM stations), and the caveat lists the remaining mismatches.

### What remains

1. Older counts: the simulator carries 0.84 of what the static assignment gives on the west corridors (Telegraph Ave and 51st St 0.72 of the count), and the static fit does not meet Telegraph Ave northbound at 52nd and 51st either. A feedback loop on volumes, or a growth rate for the older counts if the project lead supplies a source, are the next tests.
2. The Clifton St off-ramp is 733 against 617 in the PM and 626 against 524 in the AM; the 52nd St ramp is within 3% in the PM and the AM.
3. Hillegass Ave NB freeway share 54.6 against 47 and the Alcatraz Ave entries (242 against 360, Dana St 5 against 43).
4. The delays at Telegraph Ave and 51st St (17 to 25 s against 37 to 63 s) and at Claremont Ave and Ashby Ave are below their worksheets; no change was made because the split does not depend on them.
5. Claremont Crescent needs the real lane layout of Ashby Ave at Claremont Ave; the sharp turn from Ashby Ave eastbound onto the slip link is not verified.

## Older rounds

The seventeenth to twenty-fourth rounds are in `rockridge.record-archive-2.md`. The eleventh to sixteenth rounds, the initial-loading note, the tenth round and everything before it (ninth to fourth, sixth, fifth, and the third-round history) are in `rockridge.record-archive.md`, moved unchanged.
