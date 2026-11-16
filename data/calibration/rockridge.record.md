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

## Twenty-fourth round: count recency, the Ashby Ave slip link (change count-recency-weights)

PM peak, seeds 1 to 10 (AM and midday also 1 to 10), scale 1.0, 60 minutes. Before: network 5fe8241a6ba1e306, demand 222fb062e8e5dc1c (rebuilt at the start of the round: same hash). After: network 5fe8241a6ba1e306 (unchanged), demand 74a9882dd4286e12. The simulator did not change. Decisions are in `openspec/changes/archive/*-count-recency-weights/design.md`.

The project lead's decision: "Let's make sure the newer data is more important than the 2010/2013 data". Every count station now carries its source and count year, and the fit multiplies the weight of a station by a band weight of its age (`countFit.recency` in the area config, reference year 2026, one band edge at 10 years, ASSUMPTION).

### Count years

| Source | Count year | Where it comes from | Age (years) | PM stations in the fit |
| --- | --- | --- | --- | --- |
| Resident volunteer count | 2025 | Count date, 2025-02-25 | 1 | 126 |
| Caltrans AADT (SR-13, SR-123) | 2024 | Count year 2023-24 of the service, set as 2024 in the config | 2 | 8 |
| Caltrans ramp ADT, latest row | 2024 (3 stations), 2012 (13) | Latest year of the published row; the Claremont and Telegraph rows only have 2012 | 2 and 14 | 3 and 13 |
| OakDOT turning-movement counts | 2019 (mean of 2018, 2018, 2019, 2021) | Year prefix of the file names | 7 | 20 |
| Children's Hospital EIR counts | 2013 | Count date, 2013-09-19 | 13 | 112 |
| Safeway EIR counts | 2010 | Count date, 2010-03-16 | 16 | 61 |

No source lacks a date. A station whose year is null would take the last band (treated as old).

### Settings tested

The weight multiplies the station weight of every station older than 10 years (the 2010 and 2013 intersection counts and the 2012 ramp rows). PM peak, seeds 1 to 10:

| Old counts at | Removals per hour | Through cars HSB / CSB / HNB / CNB | Headline shares | Error | 52nd St / Clifton St off-ramps | Fitted / held out below GEH 5 | Recent sources fitted | Volunteer count fitted |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Round 23 state | 0.40 | 111 / 103 / 74 / 146 | 47.8 / 37.7 / 61.0 / 40.5 | 5.4 | 899 / 828 | 131 / 34 | not reported | not reported |
| 1.0 (slip link only) | 0.20 | 112 / 109 / 68 / 142 | 49.9 / 38.6 / 62.4 / 40.7 | 5.3 | 881 / 882 | 133 / 35 | 82 of 94 | 80 of 89 |
| 0.5 (kept) | 0.10 | 110 / 97 / 66 / 139 | 50.1 / 37.7 / 64.6 / 41.9 | 4.7 | 900 / 883 | 130 / 35 | 82 of 94 | 80 of 89 |
| 0.25 | 0.20 | 111 / 96 / 65 / 138 | 50.3 / 39.0 / 64.8 / 42.9 | 4.2 | 903 / 937 | 129 / 33 | 82 of 94 | 79 of 89 |
| 0 (held out only) | 4.70 | 141 / 153 / 75 / 149 | 50.3 / 43.0 / 60.2 / 41.5 | 4.7 | 624 / 1,150 | 80 of 106 / 48 of 139 | 71 of 94 | 68 of 89 |

Observed through cars 79-120 / 39-117 / 48-95 / 102-145. D5 and D16 hold at 1.0, 0.5 and 0.25. Held out only fails D16 (4.70 removals per hour), puts Hillegass Ave SB and Colby St SB above their ranges and takes the Telegraph Ave travel times to 393 / 408 s: the old counts include the 2012 Claremont and Telegraph ramp rows and the ramp legs of the 52nd St, Martin Luther King Jr Way and Clifton St counts, and the ramp flows lose their anchor. It is rejected.

In the static fit (fit report, PM) the weights do what they should where counts disagree: the volunteer count's assigned volume over its counts is 0.885 at 1.0, 0.900 at 0.5, 0.915 at 0.25 and 0.959 with the old counts held out, while the 2010 Safeway counts go from 1.013 to 1.035, 1.065 and unscored. The fit meets nearly every count either way (the weights decide only in tension), so the change in pass rates is small. In the simulator the recent sources are at the same pass count at 1.0 and 0.5 (82 of 94), and the Safeway counts lose 3 of 26 passes (14, 11, 10 at 1.0, 0.5, 0.25). Down-weighting old counts does not raise the pass rate of any group in the simulator; its measurable cost is those 3 stations, and its measurable gain is a lower headline error (5.3, 4.7, 4.2) and removals (0.20, 0.10, 0.20, inside the seed spread).

Kept: 0.5. It follows the project lead's decision with a middle value, holds D5 and D16, keeps the four through blocks inside their ranges (Colby St NB 139: 3 under the 1.0 value, and 7 under the round 23 value, which was 1 above its range), and costs 3 stations of 190 against 1.0. 1.0 is not kept because it ignores the decision; 0.25 is not kept because the Clifton St ramp moves to 937 against 617 counted for no station gain.

### Growth from the count year

Not applied. A published trend would have to show that traffic grew since 2010 or 2013. The sources held do not. The Caltrans ramp ADT workbooks [CaltransRampADT] give eight SR-24 and SR-13 rows with two counts at least three years apart: changes of -2.1 to +1.0% a year, median -0.8%, no consistent sign (the Grove-52nd St ramps, the nearest to the study area, fell 4.4% and 5.7% from 2012 to 2019). The OakDOT counts [OaklandTMC] at Telegraph Ave and Alcatraz Ave fall from 3,263 (mean of the two 2018 counts) to 3,130 (2019) and 2,827 vehicles entering (2021, a pandemic year); at Market St and 55th St from 1,970 to 1,846 and 1,765. The Alameda CTC monitoring reports [ACTC-LOS2018] are speeds, not volumes. No source gives a rate for the arterials, and a positive rate would run against the counts above, so none was invented. The config has `growthPerYear` by source id (empty); a unit test covers the rule.

### Ashby Ave and Claremont Ave: the slip link

Link 3449 (OSM way 435129990, a one-way `primary_link`) leaves Ashby Ave 37 m east of the signal and joins Claremont Ave 43 m north-east of it. The Synchro worksheet of the Safeway study [SafewayCollege-DEIR2011] (PDF page 482) counts the westbound right turn (239 vph) in the signalized westbound lane group, with no separate right-turn lane, so the count is of vehicles that turn right by either path. The station mapping used only the signal's own links: the north leg leaving was link 3446 (198 modeled against 697 counted) and the east leg entering link 3426 alone, so the vehicles on the slip were missing from both. An unnamed one-way link that leaves the leg's street where the approach link starts, or joins it where the exit link ends, with its other end within the node radius, is now part of the leg (`mapLeg`; no street name in code). The north leg leaving is [3446, 3449] (697) and the east leg entering [3426, 3449] (881). The westbound approach to the north leg (239) can use the slip and has no movement station now (the fit report lists it); the other movement stations keep their single links. The Ashby Ave and Claremont Ave corridor ratio on the simulator's flows goes from 0.88 to 1.01. The round 23 note that the eastbound approach could turn onto the slip stands: the router has a sharp turn from link 3425 onto 3449, not verified on the street and left as it was.

### Result

| PM peak, seeds 1 to 10 | Target | Before | After |
| --- | --- | --- | --- |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 79-120 / 39-117 / 48-95 / 102-145 | 111 / 103 / 74 / 146 | 110 / 97 / 66 / 139 |
| Headline shares Hillegass Ave NB from / Colby St NB from / Hillegass Ave SB to / Colby St SB to | 47 / 47 / 68 / 45 | 47.8 / 37.7 / 61.0 / 40.5 | 50.1 / 37.7 / 64.6 / 41.9 |
| Mean headline error, points (D5, within 10) | | 5.4 (4 of 4) | 4.7 (4 of 4) |
| Removals per hour PM / AM / midday (D16: below 1.0) | below 1 | 0.40 / 0.00 / 0.00 | 0.10 / 0.00 / 0.00 |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St | 360 | 251 | 255 |
| 52nd St off-ramp / Clifton St off-ramp, veh/h | 1,024 / 617 | 899 / 828 | 900 / 883 |
| Telegraph Ave NB / SB travel time, s (observed 302-420 / 300-376) | | 298 / 306 | 300 / 307 |
| Completed trips per hour, arterial speed (m/s) | | 24,558, 9.31 | 24,468, 9.41 |
| Stations below GEH 5, PM fitted (190) / held out (55) | 85% | 131 (69%) / 34 (62%) | 130 (68%) / 35 (64%) |
| Stations below GEH 5, AM fitted (153) / held out (47) | 85% | 103 (67%) / 33 (70%) | 104 (68%) / 31 (66%) |
| Stations below GEH 5, midday fitted (192) / held out (56) | 85% | 148 (77%) / 44 (79%) | 149 (78%) / 39 (70%) |
| Off-ramps AM and midday, 52nd St / Clifton St (counted 898 / 524 and 635 / 383) | | 807 / 696 and 750 / 477 | 834 / 763 and 737 / 505 |

The through-car and share changes are inside the seed spread (the interval of a ten-seed mean is about 4 veh/h and 2 points). The held-out column of the assessment labels the stations; they are in the shipped fit, so it is not out of sample (the fit report's held-out figures are).

### Stations by source and count year

Simulator flows, mean over seeds 1 to 10 (kept setting; below GEH 5, fitted / held out). Ages are from the reference year 2026.

| Source | Count year | PM | AM | Midday |
| --- | --- | --- | --- | --- |
| Volunteer count | 2025 | 80 of 89 / 16 of 18 | 69 of 77 / 17 of 19 | 88 of 91 / 19 of 19 |
| Caltrans AADT | 2024 | 1 of 3 / 2 of 3 | 3 of 3 / 3 of 3 | 3 of 3 / 2 of 3 |
| Caltrans ramp ADT | 2024 | 1 of 2 / 1 of 1 | 1 of 2 / 1 of 1 | 1 of 2 / 1 of 1 |
| OakDOT counts | 2019 | 9 of 12 / 2 of 4 | 9 of 12 / 1 of 4 | 10 of 12 / 3 of 4 |
| Children's Hospital EIR | 2013 | 22 of 48 / 8 of 16 | 16 of 48 / 8 of 16 | 20 of 48 / 5 of 16 |
| Caltrans ramp ADT | 2012 | 6 of 10 / 0 of 3 | 6 of 10 / 1 of 3 | 8 of 10 / 1 of 3 |
| Safeway EIR | 2010 | 11 of 26 / 6 of 10 | 0 of 1 / 0 of 1 | 19 of 26 / 8 of 10 |

The fit report (`data/demand/rockridge.fit.md` and the station files) has the same table for the static assignment, fitted and held out, per period.

### Rules and status

The station rule (more than 85% of stations below GEH 5) is reported as written, for all sources and for sources counted in the last five years (age 5 or less, which here is the volunteer count, the Caltrans AADT and the 2024 ramp rows):

| Period | All sources fitted | All sources held out | Recent sources fitted | Recent sources held out |
| --- | --- | --- | --- | --- |
| PM | 130 of 190 (68%), not met | 35 of 55 (64%), not met | 82 of 94 (87%), met | 19 of 22 (86%), met |
| AM | 104 of 153 (68%), not met | 31 of 47 (66%), not met | 73 of 82 (89%), met | 21 of 23 (91%), met |
| Midday | 149 of 192 (78%), not met | 39 of 56 (70%), not met | 92 of 96 (96%), met | 22 of 23 (96%), met |

An honest reading: the rule is not met overall, and it is met on the recent sources in all three periods, with or without the weights (PM recent sources are 82 of 94 at weight 1.0 as well). The recent set is dominated by one hour of one day of resident counting (89 of the 94 PM stations, 90% pass); the other recent sources are 3 Caltrans AADT stations and 2 ramp stations, 1 of 3 and 1 of 2 below GEH 5. The older sources (age 7 and more) pass 48 of 96 in the PM (50%) and are the failures of the rule. The weights do not close that gap: the counts of 2010 and 2013 are 20 to 45% above what the fit reaches, and the median factor of the counted flows is still at its lower bound (see the fit report). Whether the rule should apply to recent sources only is the project lead's call: that is a change of the published rule [WebTAG-M3.1], it would also discard the 2018 to 2021 counts of the city (age 7), and it rests on one day. It was not made. D16 and D5 hold. (Superseded by the project lead decisions below: the status is now `calibrated`.)

### Project lead decisions after the round (change station-rule-recent-counts)

On 2026-11-14 the project lead decided that the station rule is judged on counts from the last five years ("Recent only, with caveat"), with the pass rate of older counts reported beside it and the one-day basis of the recent set stated, and that PM peak is no longer experimental. The assessment then decides the status. The window is `countFit.recency` (`referenceYear` 2026, `recentYears` 5).

| Period | D16 | D5 | Recent counts, fitted | Recent counts, held out | Through cars | Older counts, fitted / held out |
| --- | --- | --- | --- | --- | --- | --- |
| AM | pass (0.00) | not gated | 73 of 82 (89%), pass | 21 of 23 (91%), pass | no target | 31 of 71 (44%) / 10 of 24 (42%) |
| Midday | pass (0.00) | not gated | 92 of 96 (96%), pass | 22 of 23 (96%), pass | no target | 57 of 96 (59%) / 17 of 33 (52%) |
| PM | pass (0.10) | pass (4 of 4, error 4.7) | 82 of 94 (87%), pass | 19 of 22 (86%), pass | pass (66 / 139 / 110 / 97 inside 48-95 / 102-145 / 79-120 / 39-117) | 48 of 96 (50%) / 16 of 33 (48%) |

Every rule passes, so the assessment prescribes `calibrated` with no experimental period, and `status` is `calibrated`. What still does not match, and is disclosed in the calibration note, the caveat on the Sources page and the banner: the recent set is mostly one hour of one day of resident counting (89 of the 94 PM fitted stations; 107 of 116 with the held-out ones); older counts pass 50% in the PM; Colby St NB through cars are 139 against 102 to 145 and its whole-street cars 80 against 102 (ratio 0.78); the Colby St NB freeway share is 37.7% against 47% (9.3 points, 0.7 inside the limit); the 52nd St and Clifton St off-ramps carry 900 and 883 against 1,024 and 617. The recent held-out margin is thin (19 of 22: 3 more failures would break it) and AM and midday have no through-car targets. The held-out column of the assessment is a label (those stations are in the shipped fit).

### What remains

1. The station rule: 60 of 190 PM stations fail, 48 of them at sources aged 7 years or more. The trip table is larger than the counts support (lower bound median factor); a fit that scales the whole table down, or a seed table with a smaller local share, is the next test.
2. The Clifton St off-ramp is 883 against 617 counted; the 52nd St off-ramp is 900 against 1,024 (unchanged by this round).
3. Claremont Crescent needs the real lane layout of Ashby Ave at Claremont Ave; the sharp turn from Ashby Ave eastbound onto the slip link is not verified on the street.
4. Whether the rule should apply to recent sources only (project lead).

## Twenty-third round: lead-lag at 52nd St and Shattuck Ave, alternatives by pair, ramp split, stations (change calibration-round-23)

PM peak, seeds 1 to 10 (removals also 11 to 20), scale 1.0, 60 minutes. Before: network c05a22fc9ebe8816, demand 8efd5df07ab6557a. After: network 5fe8241a6ba1e306 (changed: the signal observations at 52nd St and Shattuck Ave), demand 222fb062e8e5dc1c (changed: `via.alternatives` of 10 more PM flows, volumes identical). The simulator changed (an approach can be in two phases). Decisions are in `openspec/changes/archive/*-calibration-round-23/design.md`. The "before" column was measured again on the round 22 files at the start of this round and matches round 22.

### Result

| PM peak, seeds 1 to 10 | Target | Before | After |
| --- | --- | --- | --- |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 79-120 / 39-117 / 48-95 / 102-145 | 112 / 107 / 73 / 144 | 111 / 103 / 74 / 146 |
| Whole-street cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 79 / 39 / 48 / 102 | 71 / 49 / 44 / 78 | 73 / 49 / 44 / 81 |
| Headline shares Hillegass Ave NB from / Colby St NB from / Hillegass Ave SB to / Colby St SB to | 47 / 47 / 68 / 45 | 48.0 / 37.9 / 60.7 / 41.9 | 47.8 / 37.7 / 61.0 / 40.5 |
| Mean headline error, points (D5, within 10) | | 5.1 (4 of 4) | 5.4 (4 of 4) |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St | 360 | 259 | 251 |
| 52nd St off-ramp / Clifton St off-ramp, veh/h | 1,024 / 617 | 682 / 982 | 899 / 828 |
| Eastbound approach at Shattuck Ave and 52nd St, veh/h | 1,427 | 833 | 1,110 |
| Removals per hour, PM seeds 1-10 / 11-20 / all 20 (D16: below 1.0) | below 1 | 1.10 / 0.40 / 0.75 | 0.40 / 0.30 / 0.35 |
| Removals per hour, AM / midday | below 1 | 0.10 / 0.00 | 0.00 / 0.00 |
| Stations below GEH 5, PM fitted (190) / held out (55) | 85% | 127 (67%) / 34 (62%) | 131 (69%) / 34 (62%) |
| Stations below GEH 5, AM fitted (153) / held out (47) | 85% | 102 (67%) / 30 (64%) | 103 (67%) / 33 (70%) |
| Stations below GEH 5, midday fitted (192) / held out (56) | 85% | 146 (76%) / 44 (79%) | 148 (77%) / 44 (79%) |
| Off-ramps AM (counted 898 / 524) and midday (635 / 383), 52nd St / Clifton St | | 631 / 807 and 570 / 574 | 807 / 696 and 750 / 477 |
| Telegraph Ave NB / SB travel time, s (observed 302-420 / 300-376) | | 299 / 306 | 298 / 306 |
| Completed trips per hour, arterial speed (m/s) | | 24,523, 9.33 | 24,558, 9.31 |

The through-car and share changes are inside the seed spread (the interval of a ten-seed mean is about 4 veh/h on the through cars and 2 points on the shares); Colby St NB is 1 above its observed upper bound of 145 where it was 1 below. The through cars on AM and midday are not measured: the through check has no AM or midday targets.

### 1. Where the removals were, and the cause

Seeds 1 to 20 of the round 22 state had 15 removals (1.10 per hour on seeds 1 to 10, 0.40 on 11 to 20). The seed reports list them (the round 22 note naming Glenwood Glade and Margarido Dr does not match the lists):

| Site | Removals (seeds) | Cause |
| --- | --- | --- |
| 52nd St eastbound approach at Shattuck Ave: links 1669, 1749 and 1662 (the ramp merge and the approach) and link 1705 (Shattuck Ave northbound) | 10 (2, 6, 9, 14, 16) | The signal plan. The worksheet gives eastbound left 33.5 s, eastbound through 57.2 s, westbound through 27.6 s, northbound 34.9 s and southbound 25.4 s in a 110 s cycle [CHRCO-EIR2014]. Round 17 put the eastbound approach in a phase of its own with the 33.5 s of the left and the westbound approach in one with its 27.6 s, so the eastbound through had 33.5 s against 57.2 s. The approach carries the 52nd St off-ramp (1,024 veh/h counted) and the ramp's queue stood on the merge. |
| Alcatraz Ave at Shattuck Ave, link 2081 | 1 (8) | Not investigated; no repeat |
| Claremont Crescent, link 3376 | 3 (3, 15) | The Crescent leaves Claremont Ave and joins Ashby Ave by a 9.6 m one-way link behind an OSM stop sign; its last car waits to merge into the Ashby Ave eastbound lane, which holds the Claremont Ave signal queue. The Ashby Ave approach has one lane in the network (OSM `lanes=2` for both directions) while the Synchro worksheet of the Safeway study gives it a saturation flow of 3,490 (two lane groups); whether a short second lane exists is not in the extract. Not changed |
| Service link 3418 near the Ashby Ave and Tunnel Rd gate | 1 (2) | Not investigated; no repeat |

After the change the same 20 seeds have 7 removals: Claremont Crescent 4 (seeds 3 and 4), Shattuck Ave northbound (link 1705) 1, Avalon Ave 1 and an unnamed link 1. The 20-seed mean is 0.35 (0.40 and 0.30). The three periods hold D16.

The fix is `runsWithHeading` in the signal observations: the eastbound approach has green alone for 57.2 less 27.6 s and then together with the westbound approach for 27.6 s, and the northbound and southbound approaches take the rest (37.8 s against 34.9 observed). AM uses 37.7 s and 19.4 s of its worksheet, midday the PM plan (ASSUMPTION as before). The eastbound through now has the 57.2 s of its worksheet; the left turn keeps 29.6 s alone and the permissive green of the shared phase (ASSUMPTION: the worksheet's left phase is 33.5 s).

### 2. The west-side turn-ins have alternatives

`withAlternatives` matched an intent of one street with an intent of another by exact group names (`west-side` against `telegraph-north` and `west-side-other`), which left 10 PM flows (66 veh/h) without an alternative. It now matches on the pair: a movement is an alternative when one of its intents has an origin set and a destination set that contain the origin group and the destination group of the flow's pair. All 455 PM flows (393 veh/h; AM 260, midday 386) now have one. Volumes did not change (no flow differs in origin, destination or volume). The baseline run is identical flow by flow in the through cars, shares and link flows, because nothing in it is blocked.

### 3. The off-ramp split

Origin-destination groups (`CAL_DUMP_RAMP_TRIPS`, new; PM, seeds 1 to 3, round 22 demand, after the signal change): every ramp trip starts at the SR-24 eastbound mainline gate (node 602). By destination group, veh/h on the 52nd St ramp / the Clifton St ramp: south Oakland 413 / 393, Berkeley side streets north of Alcatraz Ave 130 / 174, Telegraph Ave south 201 / 4, the study area 5 / 105, West Berkeley 71 / 2, Telegraph Ave north 4 / 46, the hills 0 / 38, College Ave north 0 / 27. The groups that tip the split are south Oakland (1,151 veh/h from that gate in total) and the Berkeley side streets, whose two paths cost the same to within seconds.

Path cost (router, PM, free-flow and loaded with the simulator's mean link delays): for south Oakland the Clifton St path costs 1.4 s more than the 52nd St path free-flow, and 32.5 s less loaded before the signal change, 19.1 s less after it. For the Berkeley side streets 1.4 s more free-flow, 25.7 s less before and 8.3 s less after. The loaded difference was the queue at Shattuck Ave: for one large destination the 52nd St path had 20 s of delay on the ramp link, 31 s on the approach and 20 s at Telegraph Ave and 51st St before the signal change, and 16 s, 16 s and 18 s after; the Clifton St path had 11 s at the ramp signal.

What in the network could make Clifton St cheaper, checked: the Clifton St ramp approach has 7.2 s of delay in the Safeway worksheet [SafewayCollege-DEIR2011] and 9 to 12 s in the model, so the ramp signal is not too kind (the worksheet gives the ramp 52.0 s of 80, Claremont Ave 21.0 s; the round 17 plan lets Claremont Ave have 30 to 40%). Signals exist at Clifton St, Hudson St, Colby St and Forest St, College Ave, Ashby Ave and 52nd St on Claremont Ave; lanes, speed (25 mph) and the 77 turn bans were checked against OSM in rounds 12 and 17 and no ban touches the ramps. The Telegraph Ave and 51st St signal (the 52nd St path) has 18 to 22 s of delay in the model against 37 s (eastbound) and 47 s (westbound) in its worksheet [CHRCO-EIR2014], so the 52nd St path is too cheap there, not too dear. No defect was found at Clifton St. The split moved by the signal fix (1,024 / 617 counted; 682 / 982 before, 899 / 828 after, AM 807 / 696 against 898 / 524, midday 750 / 477 against 635 / 383).

What remains is a loaded-cost gap of the static fit. Its own assignment has 1,045 on the 52nd St ramp and 718 on the Clifton St ramp (the Clifton St ramp is a held-out station, 16% above its count), against 899 and 828 in the simulator.

### 4. Stations

Failing stations, PM (GEH 5 or more; model low / high): 84 of 245 before (64 / 20), 80 after (58 / 22). 56 of the 84 are turning-movement count stations of the two environmental reviews (100 stations, 44 pass, model 0.82 of the counts in total), against 13 of 107 volunteer-count stations (94 pass, ratio 1.02) and 15 of 38 others (ramps, Caltrans, OakDOT; 23 pass, ratio 0.92).

| Corridor | Stations | Fail before (low / high) | Fail after (low / high) |
| --- | --- | --- | --- |
| SR-24 ramps (Caltrans ADT) | 16 | 6 (2 / 4) | 6 (2 / 4) |
| MLK Way and 55th St | 8 | 6 (6 / 0) | 6 (6 / 0) |
| Telegraph Ave and 51st St | 8 | 7 (7 / 0) | 6 (6 / 0) |
| Market St and 55th St (OakDOT) | 8 | 5 (5 / 0) | 5 (5 / 0) |
| MLK Way and 52nd St | 8 | 7 (7 / 0) | 5 (5 / 0) |
| Shattuck Ave and 52nd St | 8 | 6 (5 / 1) | 5 (4 / 1) |
| Alcatraz Ave and Claremont Ave | 6 | 5 (4 / 1) | 5 (4 / 1) |
| Ayala Ave (volunteer count) | 8 | 4 (0 / 4) | 4 (0 / 4) |
| SR-24 ramps and 52nd St | 6 | 5 (5 / 0) | 4 (4 / 0) |
| Telegraph Ave, 52nd St and Claremont Ave | 8 | 3 (3 / 0) | 4 (3 / 1) |
| Ashby Ave and Claremont Ave | 8 | 3 (3 / 0) | 3 (3 / 0) |

Causes:

1. The eastbound phasing at 52nd St and Shattuck Ave (fixed above): the stations on the 52nd St corridor from the ramp to Telegraph Ave gained 1 to 2 passes each at MLK Way and 52nd St, Shattuck Ave and 52nd St and the ramp intersection. Fitted stations 127 to 131 of 190; held out unchanged at 34 of 55.
2. A deficit of the demand fit. The turning-movement stations are low by 15% in total and almost all of the failures are low (58 of 80), at counts of 2010 and 2013 that are 20 to 45% above what the fit reaches: the fit's own static assignment is 865 against 1,152 at Telegraph Ave and 51st St (northbound leg). In the fit report the median factor of the counted flows is 0.10, the lower bound, in all three periods (3,490 of 8,165 AM flows sit on it), so the trip table is far larger than the counts support and the counts disagree with each other. The counts are used with no growth from the count year (ASSUMPTION in the config). The cause is the seed table and the count set, and the fix is a change to the fit, not to stations, so none was made.
3. A channelized right turn at Ashby Ave and Claremont Ave: link 3449 (an unnamed one-way link from the Ashby Ave node 37 m east of the signal to the Claremont Ave node 43 m north-east of it) carries 491 veh/h in the model, but the count's north leg and the station mapping use link 3446 alone (198 against 697). The two together give 689. The movement from Ashby Ave eastbound (link 3425) to link 3449 also exists in the router at 5.5 s, a sharp left turn across the westbound lanes onto a one-way slip, and the model uses it; whether it exists on the street was not verified. Not changed.

### Tried and not kept

Observed plans for 14 more signals from the two traffic studies (17 observations, PM peak only, greens of the cross street or of the split phases; the worksheets are listed in `docs/references.md`). PM, ten seeds (through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB, headline error, removals per hour, stations fitted / held out, Telegraph Ave NB / SB s), each group on top of the kept state (`signalObservations` at 52nd St and Shattuck Ave):

| Variant | Through cars | Error | Removals | Stations | Telegraph |
| --- | --- | --- | --- | --- | --- |
| Kept state | 111 / 103 / 74 / 146 | 5.4 | 0.40 | 131 / 34 | 298 / 306 |
| Claremont Ave: Ashby Ave, Clifton St, Hudson St, College Ave (4 signals) | 117 / 101 / 70 / 148 | 5.9 | 0.20 | 131 / 36 | 300 / 306 |
| College Ave: Ashby Ave, Alcatraz Ave, Miles Ave, Shafter Ave, Manila Ave (5) | 119 / 113 / 65 / 143 | 6.6 | 0.30 | 129 / 32 | 299 / 305 |
| Telegraph Ave and west: Alcatraz Ave, 55th St twice, MLK Way and 52nd St, 52nd St and Claremont Ave (5) | 110 / 104 / 73 / 152 | 4.6 | 0.20 | 133 / 33 | 295 / 286 |
| All 14 | 123 / 114 / 66 / 150 | 6.6 | 0.00 | 133 / 32 | 295 / 289 |

None is kept. The College Ave group moves Hillegass Ave SB and Colby St SB to the top of their ranges and the Hillegass Ave SB share to 58.3 for no station gain; the Telegraph Ave group gives Telegraph Ave more green than the Webster plan did and takes Telegraph Ave SB out of the observed range (290 s against 300 to 376), which answers the question on Telegraph Ave: the plans of the sources speed it up, so the gap of 299 s against 302 s does not come from the signals that have worksheets (4 of about 11 on the segment). The Claremont Ave group lowers removals from 0.40 to 0.20 (a difference of 2 in ten runs) and moves the through cars of Hillegass Ave SB up by 6.

Two more changes were left out: an extra Ashby Ave approach lane at Claremont Ave (no source for where a second lane starts) and a ban on the sharp left turn onto link 3449 (not verified on the street).

### Project lead's scenario check (PM, seeds 1 to 3)

Filters at Martin St and Ayala Ave and at Ayala Ave and Forest St, diagonal diverters at 62nd St and Colby St and at 63rd St and Hillegass Ave (bearing 41), as in round 22:

| Block (63rd St) | Round 22: veh/h | Round 22: through | Round 23: veh/h | Round 23: through |
| --- | --- | --- | --- | --- |
| Telegraph to Canning (EB) | 65 to 109 | 42 to 74 | 68 to 102 | 43 to 67 |
| Canning to Dana (EB) | 58 to 97 | 36 to 64 | 59 to 94 | 37 to 60 |
| Dana to Colby (EB) | 41 to 66 | 20 to 42 | 44 to 66 | 22 to 41 |
| Colby to Hillegass (EB) | 29 to 19 | 3 to 10 | 24 to 28 | 6 to 20 |
| Hillegass to Colby (WB) | 42 to 43 | 8 to 2 | 41 to 43 | 8 to 2 |
| Colby to Dana (WB) | 37 to 51 | 10 to 7 | 37 to 71 | 10 to 30 |
| Dana to Canning (WB) | 49 to 70 | 11 to 12 | 46 to 90 | 10 to 35 |
| Canning to Telegraph (WB) | 39 to 46 | 8 to 6 | 36 to 44 | 7 to 6 |
| College to Hillegass (WB) | 69 to 17 | 18 to 1 | 70 to 16 | 20 to 1 |
| Hillegass to College (EB) | 38 to 17 | 12 to 2 | 34 to 18 | 15 to 1 |
| 63rd St, all blocks | 1,063 to 1,115 | | 1,021 to 1,165 | |

63rd St rises 14% (+144 veh/h) where round 22 had +5% (+52); the original fault was +483. It is a rise and no surge. Run with the round 22 demand file on the new network, the rise is +102 (1,021 to 1,123): about 40 veh/h of it comes from the new alternatives and the rest is the new network and the spread of three seeds (the difference of two three-seed means is about 40 veh/h). The 40 veh/h are the west-side turn-in trips that now fall back on the parallel street's turn-in: they turn in on Colby St, turn west at the diverter on 62nd St or 63rd St and reach Telegraph Ave, on the two westbound blocks west of Colby St (through cars 10 to 30 and 10 to 35). They do not loop: the share of assumed-flow trips with a node visited twice is 3 to 4% (one end inside) and 8.5% (through) in the scenario against 2% and 8.6% in round 22 and 1.6% and 8.4% in the baseline. Trips of assumed-flow pairs that make an assumed movement: 347 to 149 per run (round 22: 344 to 116). Through trips on local streets: 562 to 234 per run (579 to 210). Local street flow in the study area: 797 to 534 veh-km/h; the gains are on 61st St (+29), 60th St (+17), 63rd St (+10), McAuley St (+9), 62nd St (+7) and Canning St (+6), the losses on Colby St (-99), Hillegass Ave (-68), Ayala Ave (-62), Martin St (-41) and 57th and 58th St (-24, -20).

### Rules and status

D16 (stability): holds in all three periods (PM 0.40, AM 0.00, midday 0.00 per hour). D5 (headline shares within 10 points): holds, mean error 5.4; Hillegass Ave SB is 7 low. The through cars are inside the observed ranges on three blocks and 1 above on Colby St NB. The station rule fails: PM 69% fitted and 62% held out, AM 67% and 70%, midday 77% and 79%, against 85%. So `status` stays `uncalibrated` and `experimentalPeriods` stays `["pm_peak"]`; the assessment suggests none because all periods are stable, and that is the project lead's call as in round 21.

### What remains

1. Station fit: 31% of the PM fitted stations fail, 51 of the 80 failures at the 2010 and 2013 intersection counts, low by 15%. The fit's lower bound (median factor 0.10) says the trip table and the count set disagree; a change to the fit (growth from the count year, or the counts' weights) is the next test.
2. The off-ramp split is 899 / 828 against 1,024 / 617; the static fit puts 718 on the Clifton St ramp, and the simulator's loaded costs favor Clifton St by 19 s for south Oakland trips.
3. Claremont Crescent (4 of the 7 removals left) needs the real lane layout of Ashby Ave at Claremont Ave.
4. The Ashby Ave and Claremont Ave slip lane (link 3449) is used by eastbound cars in the model and is missing from the count's leg stations.
5. 63rd St rises 14% in the project lead's scenario because the west-side turn-in trips now keep their intent by way of the parallel street. Whether that is wanted is the project lead's call.

## Twenty-second round: detour check for assumed flows (change via-detour-fallback)

PM peak, seeds 1 to 10, scale 1.0, 60 minutes. Network c05a22fc9ebe8816 (unchanged). Demand 67f09a8c56c92603 to 8efd5df07ab6557a: volumes identical, each assumed flow now carries `via.maxDetour` and, for 445 of 455 PM flows, one alternative movement. The simulator changed (detour check, alternatives, loop rule). Decisions are in `openspec/changes/archive/*-via-detour-fallback/design.md`.

The project lead opened a scenario with modal filters at Martin St and Ayala Ave and at Ayala Ave and Forest St and diverters at 62nd St and Colby St and at 63rd St and Hillegass Ave, and asked why 63rd St got busy. The simulator kept sending assumed-movement trips through their Colby St and Hillegass Ave movements after the diverters cut the way to them, and they looped around 63rd St and Colby St. 63rd St went from 1,073 to 1,556 veh/h (seeds 1 to 3); with every `via` removed from the demand it went up 44. Now a movement is made only while its free-flow route costs at most `maxDetour` (1.3, ASSUMPTION) times the plain route in the current network and adds no loop the plain route does not have; else the driver tries the alternative (the same turn on the parallel street, ASSUMPTION) and then the plain route.

### Baseline

| PM peak, seeds 1 to 10 | Round 21 (same demand file) | After |
| --- | --- | --- |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 111 / 109 / 72 / 149 | 112 / 107 / 73 / 144 |
| Headline shares | 46.8 / 37.0 / 61.7 / 42.6 | 48.0 / 37.9 / 60.7 / 41.9 |
| Study-area through cars | 675 | 671 |
| Removals per hour (PM / AM / midday) | 0.40 / - / - | 1.10 / 0.10 / 0.00 |

The round 21 simulator run on this demand file reproduces the round 21 numbers exactly. The first version of the check used live costs and dropped 24 of the 353 baseline assumed movements per hour (through cars on Colby St NB 136); judging on free-flow costs and ignoring loops that the plain route has too leaves 9 of 353 dropped.

PM removals are 1.10 per hour over seeds 1 to 10 (rule: below 1.0). They sit at hill nodes (Glenwood Glade, Margarido Dr) that assumed trips do not use (4 of about 660 trips per hour through the first node are `via`). Seeds 11 to 20 give 0.40 for the new simulator and 0.60 for the round 21 one; the round 21 simulator at scale 1.001 gives 0.50 on seeds 1 to 10. The ten-seed removal mean moves by this much without any change that touches them, so it is not a measure of the check.

### Project lead's scenario, PM peak, seeds 1 to 3

63rd St, all blocks: 1,063 to 1,115 veh/h (was 1,073 to 1,556). Trips of assumed flows with a repeated node, one end inside: 2% to 2% (was 4% to 35%). Through trips on local streets: 574 to 210 per run (was 579 to 363). Displaced traffic goes to Telegraph Ave between 52nd and 58th St (+170 to +250 veh/h in each seed) and, locally, to 61st St, 60th St and McAuley St. The per-block table is in the design.

### What remains

- 10 PM assumed flows (66 veh/h, the southbound turn-ins from the west) have no alternative because their intents name different groups on the two streets.
- A trip with a long route passes the 1.3 tolerance with a detour of several blocks: about 13 trips per run turn onto 63rd St from Telegraph Ave to make the Colby St turn onto Alcatraz Ave. Whether 1.3 of the whole trip is the right tolerance for a block-scale detour is open (ASSUMPTION).
- The PM removal mean of 1.10 on seeds 1 to 10 is noise at remote nodes, but the stability rule reads it as a fail; the project lead may want a ruling.

## Older rounds

The seventeenth to twenty-first rounds are in `rockridge.record-archive-2.md`. The eleventh to sixteenth rounds, the initial-loading note, the tenth round and everything before it (ninth to fourth, sixth, fifth, and the third-round history) are in `rockridge.record-archive.md`, moved unchanged.
