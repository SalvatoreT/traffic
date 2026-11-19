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

## Forty-fifth round: a shorter Forest St green (change calibration-round-45)

Passes the keep rule, not adopted (user decision, 2026-11-18). The published network 53c823f20d9165ed, demand 9cdebdabf05c4460 and cross-validation demand 2f9ae152b9bbf78e of the baseline assessment of 2026-11-18 (commit b1ff0ef, assessment ff5d667) stand, and so do the area note and caveat. Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9 throughout.

### What was tried

Nothing in the simulator was changed. The area config's existing `signalObservations` entries set one approach's green, and the simulator holds an observed green fixed. Three candidates set the Forest St eastbound green (heading 123) at Claremont Ave / Colby St / Forest St to 25, 18 and 12 s of the 79 s cycle in the AM and PM peaks, each labeled ASSUMPTION. The baseline model gives Forest St about 35.3 s in the PM peak. Only node 1069 differs from the baseline network and every link is identical. The fitted demand periods of each candidate equal the baseline's, because the fit reads no signal timing. The keep rule (design D4) and the screen (D5) were written before any run.

The run was on the project lead's laptop session on 2026-11-18, about 8:05 PM to 9:06 PM Pacific (M3 Pro, 12 jobs), from the change's `runbook.md`. The evidence is in the archived change's `evidence/` folder.

Hashes (SHA-256, first 16 characters): baseline network 53c823f20d9165ed, demand 9cdebdabf05c4460, training 2f9ae152b9bbf78e.

| Candidate | Network | Demand | Training demand |
| --- | --- | --- | --- |
| forest-25 | 176cc2f5263d5faf | b109f88b583a4462 | 4caa790802774b25 |
| forest-18 | 29606b40ec23be91 | d9e3b333f5eb94d6 | c42216f3e257d672 |
| forest-12 | 611804b2c98aa041 | e4ea8ad62e5c0e26 | 6276ffe774338037 |

### Screen: three seeds

Stations within GEH 5 on seeds 1 to 3 (no verdict). No car was cleared from gridlock in the judged zone in any candidate, and all three advanced to ten seeds.

| Run | PM fitted of 92 | PM held out of 24 | AM fitted of 77 | AM held out of 19 |
| --- | --- | --- | --- | --- |
| baseline | 73 | 14 | 70 | 14 |
| forest-25 | 73 | 12 | 69 | 14 |
| forest-18 | 74 | 12 | 71 | 13 |
| forest-12 | 74 | 13 | 70 | 12 |

### Result: ten seeds

Keep rule D4. The line is the b1ff0ef baseline.

| Criterion | Line | forest-25 | forest-18 | forest-12 |
| --- | --- | --- | --- | --- |
| PM fitted, recent, GEH < 5 | 74 of 92 | 74 | 75 | 77 |
| PM held out | 14 of 24 | 14 | 14 | 14 |
| AM fitted | 70 of 77 | 71 | 71 | 69 (fails) |
| AM held out | 14 of 19 | 14 | 13 (fails) | 13 (fails) |
| D5 headline shares within 10 points | 4 of 4 | 4 of 4 (mean error 4.9) | 4 of 4 (4.2) | 3 of 4 (fails; Hillegass Ave SB to freeway, 10.2 points off) |
| Whole-street traversals, GEH < 5 | 8 of 8 | 8 | 8 | 8 |
| D16 in every period | holds | holds | holds | holds |
| Validation | 67 of 74 | 67 | 67 | 67 |
| Verdict | | passes | fails on AM held out | fails on AM fitted, AM held out and D5 |

D5, PM freeway shares in percent (observed / baseline / forest-25 / forest-18 / forest-12):

| Share | Observed | Baseline | forest-25 | forest-18 | forest-12 |
| --- | --- | --- | --- | --- | --- |
| Hillegass Ave NB from freeway | 47 | 48.4 | 48.4 | 47.8 | 47.5 |
| Colby St NB from freeway | 47 | 50.5 | 50.4 | 50.6 | 50.1 |
| Hillegass Ave SB to freeway | 68 | 58.1 | 58.1 | 59.6 | 57.8 |
| Colby St SB to freeway | 45 | 41.4 | 40.1 | 40.9 | 41.3 |

### What moved

A shorter Forest St green moves Forest St eastbound, Ayala Ave northbound and McAuley St eastbound toward their counts. PM, cars per hour (counted / baseline / forest-25 / forest-18 / forest-12):

| Station | Counted | Baseline | forest-25 | forest-18 | forest-12 |
| --- | --- | --- | --- | --- | --- |
| McAuley St EB, Howell St to Canning St (held out) | 12 | 183 | 140 | 139 | 118 |
| 60th St EB, Howell St to Canning St (held out) | 23 | 162 | 156 | 153 | 144 |
| Ayala Ave NB, Martin St to Howell St (held out) | 60 | 212 | 160 | 115 | 101 |
| Forest St EB, Colby St / Claremont Ave to Ayala Ave (fitted) | 66 | 183 | 167 | 125 | 101 |
| 60th St EB at Telegraph Ave | 27 | 83 | 77 | 69 | 72 |
| McAuley St EB at Telegraph Ave | 14 | 48 | 42 | 36 | 35 |
| Howell St SB, 59th St to McAuley St | 17 | 72 | 64 | 62 | 62 |
| Ayala Ave SB, Forest St to McAuley St | 20 | 107 | 99 | 74 | 69 |

AM, cars per hour (counted / baseline / forest-25 / forest-18 / forest-12): McAuley St EB 4 / 84 / 89 / 79 / 74; 60th St EB 6 / 79 / 84 / 76 / 73; Ayala Ave NB 50 / 86 / 88 / 74 / 70; Forest St EB 50 / 85 / 83 / 74 / 61.

Against the baseline, forest-25 flips two stations from fail to pass (Colby St NB, 62nd St to 63rd St, AM; Colby St NB at 63rd St, PM, held out) and one from pass to fail (Canning St SB, 59th St to McAuley St, PM, held out, 21 to 17 against 49 counted). The AM held-out stations (Colby St SB, McAuley St to 60th St) and the Hillegass Ave SB share to the freeway get worse as the green gets shorter. forest-25 passes with three lines exactly on their limits (PM fitted 74, PM held out 14, AM held out 14) and changes no status.

### Verdict

forest-25 passes the keep rule. forest-18 fails on AM held out. forest-12 fails on AM fitted, AM held out and D5.

Decision (user, 2026-11-18): not adopted. The gain is one AM location, the Forest St timing is unobserved, and adopting it would need a new proposal search and a republish with no change in status. The published network stays 53c823f20d9165ed. A field timing of the Forest St green would reopen it.

### Open items

Earlier diagnostics from 2026-11-18, kept short; none has been confirmed in the field. After round 45 no known untested lever remains.
Earlier diagnostics from 2026-11-18, kept short; none has been confirmed in the field.

- Barricade diagnostic: no variant of the Howell St, Forest St and Colby St barricades passes the held-out rule. A closure of Colby St at 61st St contradicts the count: 102 cars an hour counted northbound along the whole street against 0 modeled.
- Trace of McAuley St and 60th St eastbound: 83% of the through cars on them take the diagonal Telegraph Ave, McAuley St or 60th St, Ayala Ave or Howell St, Forest St, Claremont Ave. The green time for Forest St is an unobserved assumption and a strong lever in a two-seed probe: with a 10 s green, Forest St eastbound fell from 448 to 142 and McAuley St eastbound from 158 to 94. Round 45 tested three assumed values for that green (25, 18 and 12 s); the entry below gives the result. The green itself is still unobserved, and a field reading of the Forest St green and queue remains the open check.
- Street-level imagery (undated) shows no median and no turn restriction on Telegraph Ave at 59th St to 63rd St.

## Forty-fourth round: the demand fit reads measured control delay (change calibration-round-44)

Rejected under the keep rule (design D3), written before any run of the candidate. The published network 53c823f20d91, demand 9cdebdabf05c and cross-validation demand 2f9ae152b9bb of the baseline assessment of 2026-11-18 (commit b1ff0ef, assessment ff5d667) stand, and so do the area note and caveat. The mechanism stays in the code and is off unless the demand config names a control delay file (`countFit.assignment.controlDelays`); the shipped config does not. The figures below are those of the trial.

### What was tried

A diagnosis on the PM peak found that the fit's static assignment charges flat control delays per control type (signal 10 s, all-way stop 8 s, minor stop 14 s, `crates/sim/data/node-delays.json`), while the simulator's arterial signal approaches cost 15 to 50 s per car. The fit saw the arterials as faster than the simulator does, and the simulator sent two to seven times more cars through the grid than the fit's final assignment planned on fitted stations (PM, counted, fit's static final, simulated: Forest St eastbound 66, 75, 201; 60th St eastbound at Telegraph Ave 27, 25, 74; Howell St southbound 17, 33, 84).

The trial let the fit read the simulator's measured control delay per approach link and period in place of the constant, with no new knob (design D1). The measured value is the flow-weighted mean delay per car over ten seeds, less the median delay of links that end at no control, floored at zero, for approaches with at least 20 veh/h (ASSUMPTION, the cut of `tools/node-delays.ts`). Two fixed passes, no convergence tuning (D2): pass 0 measured delays on the b1ff0ef demand and refit; pass 1 measured on the pass-0 demand and refit. The pass-1 demand was the candidate. The cross-validation demand was built the same way from delays measured on training-view demand only. The BPR factor, the split, the targets and every other fit setting stayed as they were (D4). Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9, unchanged; validation 67 of 74, unchanged.

The heavy passes (12 jobs: the two measurement passes, the demand builds, the validation suite and the ten-seed assessment) ran on the project lead's laptop session from `openspec/changes/archive/2026-11-19-calibration-round-44/runbook.md`, per design D5. The laptop reproduced the container's baseline exactly: network, demand and cross-validation demand hashes, and the baseline station tallies recomputed from its own runs (PM 74 of 92 and 14 of 24, AM 70 of 77 and 14 of 19).

### Result: ten seeds

Keep rule D3, against the assessment of b1ff0ef. The first column is the published assessment of 2026-11-17 on the previous network, shown as a report and not a condition.

| Criterion | 2026-11-17 published | b1ff0ef baseline (the line) | Round 44 candidate | Result |
| --- | --- | --- | --- | --- |
| PM recent fitted stations, GEH < 5 | 78 of 92 | 74 of 92 | 69 of 92 | worse |
| PM held out | 13 of 24 | 14 of 24 | 14 of 24 | same |
| AM recent fitted stations | 67 of 77 | 70 of 77 | 67 of 77 | worse |
| AM held out | 14 of 19 | 14 of 19 | 14 of 19 | same |
| D5, PM headline shares within 10 points | 4 of 4 (error 3.7) | 4 of 4 (error 4.6) | 2 of 4 (error 12.8) | worse |
| Whole-street traversals, GEH < 5 | 8 of 8 | 8 of 8 | 7 of 8 | worse |
| D16 in every period | holds | holds | holds | same |

Verdict: 4 of 7 criteria are worse than the line, so the candidate is rejected and nothing is adopted. PM fitted falls 74 to 69 of 92, AM fitted 70 to 67 of 77, D5 from 4 of 4 to 2 of 4 (Colby St northbound from the freeway 36.0 against 47, Hillegass Ave southbound to the freeway 45.2 against 68), and the whole-street traversals from 8 to 7 of 8 (Colby St southbound in the PM peak, 81 modeled against 39 counted, GEH 5.4). Both held-out figures are unchanged. Among recent stations 11 flipped in the AM peak (4 to pass, 7 to fail) and 15 in the PM peak (5 to pass, 10 to fail); `evidence/stations.md` lists them. Validation passes 67 of 74 as before. Status stays `uncalibrated`.

### What moved

The measured delays closed most of the gap between what the fit plans and what the simulator does, but the fit closed it by planning more traffic through the grid. On Forest St eastbound (PM, counted 66) the fit's static final went from 61 to 183 and the simulated flow from 183 to 205. On Ayala Ave southbound, Forest St to McAuley St (counted 20), the static final went from 42 to 111, while the simulated flow went from 107 to 92.

The delays had not settled after two passes. From pass 0 to pass 1 the RMS change of an approach's delay in the shipped view was 11.4 s in the AM peak, 6.3 s at midday and 31.7 s in the PM peak (training view 25.8, 5.7 and 25.2 s). The mean measured control delay in the PM peak rose from 17.1 s to 23.6 s. Offered car demand fell slightly (PM 27,612 to 26,555 veh/h) and through trips in the shipped fit went from 3745 to 3746 (AM), 3093 to 3175 (midday) and 5907 to 5701 (PM).

The Howell-area held-out stations moved toward their counts. PM, counted / baseline / candidate on the cross-validation demand: McAuley St eastbound, Howell St to Canning St, 12 / 183 / 81; 60th St eastbound, Howell St to Canning St, 23 / 162 / 117; Ayala Ave northbound, Martin St to Howell St, 60 / 212 / 93, now within GEH 5. The first two stay far above their counts. Other held-out stations went the other way (Hillegass Ave southbound, 62nd St to 61st St, 151 counted, 165 to 89; Canning St southbound, 59th St to McAuley St, 49 counted, 21 to 11), so the held-out totals did not change.

Hashes (SHA-256, first 16 characters): network 53c823f20d9165ed throughout; pass 0 demand a9acd0d97316ab6c, training 615e6673197e309a, delay files 8680288fa205a6b6 and b4dcc391bb0d843f; pass 1 (candidate) demand 19ee7b952638016d, training 5284e73cfa916f74, delay files 10228ecf206db509 and f541623d9549fe34. The four delay files stay in `data/demand/` (each under 30 KB) as evidence, unused by the shipped config. The candidate's fit reports, the station flips, the run logs and the assessment (`rockridge.assessment-r44.md`) are in the change's evidence.

## Forty-third round: stop control at Hillegass Ave / 61st St and Canning St / 62nd St (change calibration-round-43)

Rejected. The two corrections were tried, failed the keep rule (design D11) and were taken out again on the project lead's decision of 2026-11-18 (design D13). The published network f9fa09a5726644d7, demand e4f1993916827e82 and cross-validation demand e480933c18b970f6 stand, and `npm run data` reproduces them after the revert. The assessment files in `data/calibration` are the published ones of 2026-11-17. The figures below are those of the trial.

On 2026-11-18 the project lead compared the stop control of all 36 side-street junctions in the study area with street-level imagery and decided two corrections by card (`openspec/changes/archive/2026-11-18-calibration-round-43/design.md`, D1 to D4). Hillegass Ave at 61st St is an all-way stop (high confidence, DATA); the model stopped 61st St only. At Canning St and 62nd St the eastbound 62nd St approach has no stop (medium confidence, ASSUMPTION pending a field check); the model stopped all four approaches. No other junction differed at medium confidence or better. Nothing was tuned in this round: the network was corrected, the demand rebuilt with `npm run data` on the frozen split, and the result assessed.

### What changed

- Network f9fa09a5726644d7 became 093cbd5469aad29c. Two nodes and three links differ and nothing else: node 53085953 `two_way_stop` to `all_way_stop` with `stopAtEnd` on both Hillegass Ave approaches (links 2673, 2676); node 53088342 `all_way_stop` to `two_way_stop` with `stopAtEnd` cleared on the eastbound 62nd St approach (link 1848). No link id moved, so the frozen split (be72380b485e) and the stations stand.
- The second correction needed a way to free one approach of a junction the map tags on its node: `stopExemptions` in the area config (design D5).
- Demand e4f1993916827e82 became 77ef92449de50092 and cross-validation demand e480933c18b970f6 became 09d3f3d769ead5ec. The fit uses static membership, as the published fit of 2026-11-17 does: since the measurement repair the build rejects the round-42 membership files for lack of matching evidence and says so in `data/demand/rockridge.fit.md`.
- Simulator fingerprint d45a275dd7be0713cec6a64394b7d8a9, unchanged. Validation 67 of 74, unchanged.

### Result: ten seeds

`npm run assess -- --publish --noise`, seeds 1 to 10, 60 minutes. The assessment of 2026-11-17 is in brackets.

| | Target | PM | AM | Midday |
| --- | --- | --- | --- | --- |
| D16: cars cleared from gridlock per hour, judged / far | below 1 | 0.00 / 1.10 (0.00 / 5.20), holds | 0.00 / 0.40 (0.00 / 1.80), holds | 0.00 / 0.00 (0.00 / 0.00), holds |
| Entry backlog, mean %, seeds under 2% | below 2% | 0.20, 10 (0.24, 10) | 0.13, 10 (0.26, 10) | 0.01, 10 (0.01, 10) |
| Headline shares HNB from / CNB from / HSB to / CSB to freeway | PM 47 / 47 / 68 / 45 | 51.2 / 45.0 / 51.3 / 42.9, 3 of 4, error 6.3, D5 fails (51.4 / 48.8 / 66.0 / 38.4, 4 of 4, error 3.7) | 3 of 4, error 7.2, not a rule (4 of 4, error 3.1) | 4 of 4, error 5.8 (4 of 4, error 1.8) |
| Recent stations GEH<5, fitted | above 85% | 72 of 92, 78% (78 of 92, 85%) | 69 of 77, 90% (67 of 77, 87%) | no counts |
| Recent stations GEH<5, held out (out of sample) | above 85% | 12 of 24, 50% (13 of 24, 54%) | 15 of 19, 79% (14 of 19, 74%) | no counts |

Whole-street traversals, cars an hour, simulated against counted (all fitted, so in sample):

| | Counted | PM modeled | Counted | AM modeled |
| --- | --- | --- | --- | --- |
| Hillegass Ave SB | 79 | 56 (81) | 36 | 19 (38) |
| Colby St SB | 39 | 58 (56) | 46 | 27 (24) |
| Hillegass Ave NB | 48 | 40 (65) | 34 | 43 (51) |
| Colby St NB | 102 | 84 (85) | 33 | 59 (54) |

All eight stay within GEH 5 (largest 3.9, Colby St NB in the AM).

The PM held-out misses near Howell St and Canning St, cross-validation demand against counted:

| Station | Counted | Modeled |
| --- | --- | --- |
| McAuley St, Howell St to Canning St, EB | 12 | 163 (161) |
| 60th St, Howell St to Canning St, EB | 23 | 136 (130) |
| Ayala Ave, Martin St to Howell St, NB | 60 | 172 (155) |
| 62nd St, Colby St to Canning St, EB | 11 | 22 (41), now within GEH 5 |

Two PM held-out stations are new misses: 62nd St Colby St to Canning St westbound, 1 against 19 counted, and Ayala Ave Martin St to Howell St southbound, 89 against 44.

### What moved

The two extra stops on Hillegass Ave take through cars off it. Whole-street traversals of Hillegass Ave fall by about a third in the PM peak, the fitted block from 63rd St to 62nd St southbound carries 95 against 168 counted (128 before), and the share of Hillegass Ave southbound cars bound for the freeway falls from 66.0% to 51.3% against 68% observed, which is what fails D5. The freed 62nd St approach draws more cars than the count: 62nd St from Canning St to Telegraph Ave eastbound carries 33 against 9 counted (22 in earlier runs on the previous network, made with an older simulator build). The other PM fitted stations that left GEH 5 are small counts on Dana St, 63rd St and Howell St. The AM peak moves the other way on Colby St southbound, where the blocks from 61st St to 63rd St now carry 141 and 150 against 167 and 171 counted (103 and 91 before).

The large held-out misses on McAuley St, 60th St and Ayala Ave did not move, so stop control at these two junctions does not explain them.

### Verdict

Status `uncalibrated`. By the keep rule written before the assessment (design D6) the result is worse than the assessment of 2026-11-17: recent PM fitted stations fall from 78 to 72 of 92, PM held-out stations from 13 to 12 of 24, and D5 fails in the PM peak, where it passed. Stability holds in every period, the eight whole-street counts stay within GEH 5, and the AM station counts rise. Following the project lead's instruction, the area note and caveat in `data/areas/rockridge.json` were not updated and nothing was tuned. The trial's assessment files were committed on the branch and then restored to the published ones with the revert.

### Refit decision (2026-11-18)

After the result above the project lead chose to keep both corrections on the branch, rerun the membership iteration of rounds 39 to 42 on the corrected network, and adopt the result only if it is no worse than the published assessment (design D11, with the keep rule written before any run). The iteration was not run. The published model no longer uses simulated membership: the measurement repair of 2026-11-17 added an evidence check, the round-42 membership files fail it, and both the published fit and this round's fit report "Using static membership". The through targets that rounds 39 and 40 iterated on were retired in the same repair. So the refit on the corrected network with the published procedure is the build already assessed above, and it fails the keep rule. Bringing simulated membership back for the sixteen round-42 blocks would add something the published model does not have, and its seeds, pooling and stopping point would have to be chosen now; that choice is the project lead's (design D12). The project lead then decided to revert and record the discrepancy (design D13).

### Open for the project lead

- The model differs from the street-level imagery at two junctions: the imagery shows an all-way stop at Hillegass Ave and 61st St and no stop for eastbound 62nd St at Canning St, and the model has neither. Coding them made the PM fit worse (78 to 72 of 92 recent fitted stations), so they are left out pending a field check, and the Rockridge caveat says so. `stopExemptions` stays in the importer for when the check is done.
- The imagery shows "Road closed to thru traffic" barricades on Howell St at Ayala Ave, on Forest St at Ayala Ave and on Colby St at 61st St. It is undated and nobody has confirmed they are still there, so the baseline leaves them out (design D4). Update 2026-11-18: the project lead reports the Forest St and Ayala Ave barricade is gone (see the audit entry at the top). If they stand, they bear directly on the held-out misses near Howell St.
- Lower-confidence items from the survey, unchanged: Dana St at North St (the model stops North St; none seen), Canning St at 63rd St (a possible stop on 63rd St), 63rd St at Dana St.

## Forty-second round: the failing count stations (change calibration-round-42)

On 2026-11-17 the project lead decided that the published model is the round-40 demand (through-target weight 2) and that the site keeps "not yet calibrated" until every rule passes, the count-station rule included. This round looked for the causes of the failing count stations and fixed what the diagnosis supported, with the rule and its ranges unchanged. Guard rails R1 to R4 and the keep rule were frozen in `openspec/changes/calibration-round-42/design.md` (D3, D4) before any changed demand was run; steps S4 and S5 were added there after earlier results and before their own (D9, D11). Simulator fingerprint f0df1aabc323, network f9fa09a5726644d7 and the frozen split are unchanged; `npm run data` reproduced round 40's demand 930a1d90b2d1 and cross-validation demand 738c179defd7 before anything changed. Times Pacific; the round ran on 2026-11-17, 07:59 to 11:19.

### Step 1: diagnosis

Recent stations (count year 2021 or later) failing GEH 5 on round 40's demand. PM: twenty seeds, held-out stations on the cross-validation demand with the same seeds. AM: seeds 1 to 10. Simulated = seed mean (standard error). Fit = the fit's own final assigned flow on the shipped demand. Location: inside the study area, on a bounding street, within the judged zone (200 m along the network) or far. Classes as in design D2: (a) the fit itself misses the count; (b) the fit meets it and the simulator does not, so the two route differently; (c) a queue, signal or stop holds the simulator below a count the fit meets; (d) a doubtful count.

| Period, set | Failing | (a) | (b) | (c) | (d) | Where |
| --- | --- | --- | --- | --- | --- | --- |
| PM fitted | 16 of 92 | 1 | 15 | 0 | 0 | 15 inside, 1 far (Caldecott Lane on-ramp) |
| PM held out | 11 of 24 | 6 | 5 | 0 | 0 | 5 inside, 6 far (the Caltrans stations on San Pablo Ave, Ashby Ave and Tunnel Rd) |
| AM fitted | 10 of 77 | 5 | 5 | 0 | 0 | all inside |
| AM held out | 5 of 19 | 0 | 5 | 0 | 0 | all inside |

No recent station lies on a bounding street. The legs of Telegraph Ave / Alcatraz Ave are counts of 2018 to 2021 with count year 2019, and the other bounding-street junctions are counts of 2010 and 2013, so none of them enters the recent rule. Nearly every PM failure inside the study area is a block of the resident volunteer count west of Colby St with far more simulated cars than counted: Forest St eastbound into Claremont Ave, Ayala Ave, McAuley St, Howell St, and 60th St and 63rd St leaving Telegraph Ave. They form one chain through the grid between Telegraph Ave and Claremont Ave / Colby St / Forest St, and the fit's static routes put close to the counted volume on each of them.

PM:

| Station | Set | Source, year | Location | Counted | Simulated (SE) | GEH | Fit, final (shipped fit) | Class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ayala Avenue Forest Street to McAuley Street, SB, link 2801 | fitted | volunteer-count 2025 | inside | 20 | 110 (3.9) | 11.2 | 22 | b, simulator higher |
| Forest Street Colby Street / Claremont Avenue to Ayala Avenue, EB, link 2697 | fitted | volunteer-count 2025 | inside | 66 | 190 (6.3) | 10.9 | 58 | b, simulator higher |
| on-ramp at node 1711 (Caldecott Lane) | fitted | caltrans-ramp 2024 | far | 61 | 167 (5.9) | 9.9 | 100 | b, simulator higher |
| Howell Street 59th Street to McAuley Street, SB, link 2055 | fitted | volunteer-count 2025 | inside | 17 | 76 (3.1) | 8.7 | 38 | b, simulator higher |
| McAuley Street Ayala Avenue to Howell Street, EB, link 1931 | fitted | volunteer-count 2025 | inside | 15 | 63 (2.4) | 7.7 | 8 | b, simulator higher |
| Dana Street North Street to Alcatraz Avenue, SB, link 1927 | fitted | volunteer-count 2025 | inside | 43 | 6 (0.6) | 7.5 | 4 | a |
| 61st Street Hillegass Avenue to Colby Street, WB, link 2619 | fitted | volunteer-count 2025 | inside | 12 | 53 (1.4) | 7.2 | 24 | b, simulator higher |
| Howell Street McAuley Street to 60th Street, SB, link 2057 | fitted | volunteer-count 2025 | inside | 16 | 59 (2.0) | 7.1 | 23 | b, simulator higher |
| 62nd Street Hillegass Avenue to Colby Street, EB, link 2678 | fitted | volunteer-count 2025 | inside | 16 | 59 (2.3) | 7.0 | 29 | b, simulator higher |
| 63rd Street Canning Street to Telegraph Avenue, EB, link 1860 | fitted | volunteer-count 2025 | inside | 27 | 73 (1.8) | 6.5 | 43 | b, simulator higher |
| 60th Street Canning Street to Telegraph Avenue, EB, link 1870 | fitted | volunteer-count 2025 | inside | 27 | 72 (2.2) | 6.3 | 32 | b, simulator higher |
| McAuley Street Colby Street to Ayala Avenue, WB, link 1928 | fitted | volunteer-count 2025 | inside | 24 | 66 (3.0) | 6.2 | 24 | b, simulator higher |
| 63rd Street Hillegass Avenue to Colby Street, EB, link 2628 | fitted | volunteer-count 2025 | inside | 7 | 36 (1.7) | 6.2 | 18 | b, simulator higher |
| Dana Street 63rd Street to North Street, NB, link 1924 | fitted | volunteer-count 2025 | inside | 11 | 40 (1.7) | 5.7 | 18 | b, simulator higher |
| Ayala Avenue Howell Street to Forest Street, NB, link 2058 | fitted | volunteer-count 2025 | inside | 64 | 117 (2.6) | 5.5 | 64 | b, simulator higher |
| McAuley Street Canning Street to Telegraph Avenue, EB, link 1935 | fitted | volunteer-count 2025 | inside | 14 | 44 (1.9) | 5.5 | 12 | b, simulator higher |
| sanpablo station, link 111 outward (0 m from the station) | held out | caltrans-aadt 2024 | far | 1015 | 306 (4.9) | 27.6 | 1014 | a, cross-validation view (see text) |
| tunnel station, link 3463 inward (5 m from the station) | held out | caltrans-aadt 2024 | far | 1094 | 384 (5.7) | 26.1 | 1000 | a, cross-validation view (see text) |
| ashby station, link 3396 inward (4 m from the station) | held out | caltrans-aadt 2024 | far | 952 | 348 (4.8) | 23.7 | 801 | a, cross-validation view (see text) |
| ashby station, link 3395 outward (4 m from the station) | held out | caltrans-aadt 2024 | far | 1163 | 519 (15.9) | 22.2 | 975 | a, cross-validation view (see text) |
| sanpablo station, link 115 inward (11 m from the station) | held out | caltrans-aadt 2024 | far | 830 | 311 (6.8) | 21.7 | 826 | a, cross-validation view (see text) |
| tunnel station, link 3462 outward (5 m from the station) | held out | caltrans-aadt 2024 | far | 1337 | 859 (10.4) | 14.4 | 1357 | a, cross-validation view (see text) |
| McAuley Street Howell Street to Canning Street, EB, link 1933 | held out | volunteer-count 2025 | inside | 12 | 120 (5.7) | 13.3 | 15 | b, simulator higher |
| Ayala Avenue Martin Street to Howell Street, NB, link 1831 | held out | volunteer-count 2025 | inside | 60 | 167 (5.0) | 10.0 | 73 | b, simulator higher |
| 60th Street Howell Street to Canning Street, EB, link 1868 | held out | volunteer-count 2025 | inside | 23 | 92 (3.8) | 9.1 | 29 | b, simulator higher |
| 60th Street Howell Street to Canning Street, WB, link 1867 | held out | volunteer-count 2025 | inside | 25 | 62 (2.1) | 5.6 | 19 | b, simulator higher |
| 63rd Street Dana Street to Canning Street, WB, link 1857 | held out | volunteer-count 2025 | inside | 64 | 27 (1.5) | 5.5 | 49 | b, simulator lower |

AM:

| Station | Set | Source, year | Location | Counted | Simulated (SE) | GEH | Fit, final (shipped fit) | Class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dana Street 63rd Street to North Street, SB, link 1925 | fitted | volunteer-count 2025 | inside | 62 | 13 (1.4) | 8.0 | 16 | a |
| 60th Street Canning Street to Telegraph Avenue, EB, link 1870 | fitted | volunteer-count 2025 | inside | 8 | 40 (3.4) | 6.5 | 21 | b, simulator higher |
| Dana Street North Street to Alcatraz Avenue, SB, link 1927 | fitted | volunteer-count 2025 | inside | 45 | 12 (1.4) | 6.3 | 14 | a |
| North Street Colby Street to Dana Street, WB, link 1906 | fitted | volunteer-count 2025 | inside | 25 | 2 (0.5) | 6.1 | 1 | a |
| Canning Street 62nd Street to 63rd Street, NB, link 1904 | fitted | volunteer-count 2025 | inside | 34 | 8 (0.9) | 5.7 | 6 | a |
| Martin Street Ayala Avenue to Hermann Street / 58th Street, WB, link 1825 | fitted | volunteer-count 2025 | inside | 150 | 90 (2.7) | 5.5 | 102 | b, simulator lower |
| 58th Street Hermann Street / Martin Street to Canning Street, WB, link 1987 | fitted | volunteer-count 2025 | inside | 150 | 90 (2.7) | 5.5 | 100 | b, simulator lower |
| 63rd Street Canning Street to Telegraph Avenue, EB, link 1860 | fitted | volunteer-count 2025 | inside | 40 | 82 (2.2) | 5.4 | 62 | b, simulator higher |
| Canning Street 61st Street to 62nd Street, NB, link 1902 | fitted | volunteer-count 2025 | inside | 37 | 11 (0.9) | 5.2 | 10 | a |
| Forest Street Colby Street / Claremont Avenue to Ayala Avenue, EB, link 2697 | fitted | volunteer-count 2025 | inside | 50 | 92 (5.3) | 5.0 | 42 | b, simulator higher |
| McAuley Street Howell Street to Canning Street, EB, link 1933 | held out | volunteer-count 2025 | inside | 4 | 84 (6.3) | 12.1 | 10 | b, simulator higher |
| 60th Street Howell Street to Canning Street, EB, link 1868 | held out | volunteer-count 2025 | inside | 6 | 61 (2.2) | 9.5 | 19 | b, simulator higher |
| 58th Street Canning Street to Vicente Street, EB, link 1990 | held out | volunteer-count 2025 | inside | 7 | 50 (2.6) | 8.0 | 13 | b, simulator higher |
| 60th Street Howell Street to Canning Street, WB, link 1867 | held out | volunteer-count 2025 | inside | 19 | 54 (1.7) | 5.8 | 23 | b, simulator higher |
| Ayala Avenue Martin Street to Howell Street, SB, link 1832 | held out | volunteer-count 2025 | inside | 36 | 74 (3.0) | 5.2 | 41 | b, simulator higher |

For held-out stations the fit column is the shipped fit, which saw them; their class rests on it. The six held-out Caltrans stations each carry the only count on a gate at the model's edge (San Pablo Ave, Ashby Ave, Tunnel Rd). The cross-validation demand removes that count, so the gate falls back to its class default and the simulator carries a quarter to two thirds of the count (San Pablo Ave outward 306 against 1,015; the shipped demand puts 1,043 there). That is class (a) in the cross-validation view, and it is set by how the split holds these gates out, not by routing. Nothing in this round changes it.

Classes (c) and (d):
- No failing station is held below a count the fit meets by a queue or signal. One control effect feeds class (b): at Claremont Ave / Colby St / Forest St the simulated PM plan gives Claremont Ave 24.7 s, Colby St the observed 4.0 s and Forest St 35.3 s of the 79 s cycle. OSM has one stop-line signal per approach and no phase tags, and no worksheet in the references covers the junction, so the Forest St green comes from the adaptive split and grows with the cars that cut through to it. A sensitivity test (S-c below) shows it matters.
- At the 18 junctions where every leg is a counted block, inflow and outflow of the volunteer counts agree within GEH 1.8, so no block count is out of balance with its neighbors. No count is listed as doubtful from this check. The doubtful reading named in round 41 (Colby St SB onto Claremont Ave toward the northeast, 75) is a movement station, not part of the rule.

Forest St and 62nd St. Forest St eastbound from Ayala Ave into Claremont Ave / Colby St (count 66, simulated 190, fit 58) is class (b) with the control effect above. Pairs from `calibrate --select-od` (twenty seeds, whole hour, 183 trips an hour): study area to south-east Oakland 37, Berkeley side streets north of Alcatraz Ave to south-east Oakland 33, West Oakland to south-east Oakland 28, Emeryville and West Oakland streets to south-east Oakland 16, Berkeley side streets to the SR-24 westbound on-ramps 16, study area to the SR-24 westbound on-ramps 14, Telegraph Ave from the north to south-east Oakland 10. So the trips cross the grid diagonally from Telegraph Ave and Alcatraz Ave toward Claremont Ave. 62nd St eastbound from Florio St / Claremont Ave to Hillegass Ave (59 counted, 97 simulated) passes GEH 5 (4.3) and is not a failing station; its largest group is Ashby Ave from the west to College Ave north (29 of 96). 62nd St eastbound between Hillegass Ave and Colby St (16 counted, 59 simulated, fit 29) fails and is class (b), fed by the same Ashby Ave group (15) and Emeryville and West Oakland streets to the study area (11). The doubtful Colby St SB turn toward the northeast (75 counted) carries 0.5 in the simulation. The study-area trips to south-east Oakland and the SR-24 westbound on-ramps that use Forest St eastbound (51 an hour) are the trips that would make that turn, so the two are connected: with Colby St held to a 4 s green and Forest St given 35 s, the simulator sends them around through the grid.

AM Telegraph Ave southbound, Russell St to 51st St (300 s against 245 to 285; free flow 185 s, delay 118 s): the delay sits at signals, largest at Telegraph Ave / 52nd St / Claremont Ave (18.6 s) and at 51st St (15.4 s), the closely spaced pair 81 m apart, then Alcatraz Ave 11.8, 59th St 11.1, Aileen St 11.0 and 56th St 9.2. In the PM the same pair costs 11.2 and 4.7 s and the excess sits at the SR-24 interchange pair (Aileen St 12.2, 56th St 15.0). So it is the same kind of closely spaced signals, a different pair. The simulated AM southbound flow into 52nd St is 759 against 931 counted in 2013, so the delay does not come from too many cars. Coordination of such a pair favors its busier direction (`COORD_MAX_M`, ASSUMPTION), and no observed timing exists for either signal, so no sourced change was available and none was made. After S5 the southbound flow into 52nd St rises to 908, the pair costs 9.3 and 3.6 s, and the segment takes 278 s, inside the range. That came from the AM demand change and was not aimed at it.

### Mechanism

`calibrate --select-od` now also writes, for every link station, the pairs of the trips that used its links (a trip counted once per station link it used; report binary only, the engine and fingerprint are unchanged; the runs are identical with and without it). Link stations named in `countFit.throughTargets.measuredStations` take each pair's share from those trips, with the static share as a prior worth 5 trips (ASSUMPTION), as round 41 did for movement stations. The training view takes the pairs from runs of the cross-validation demand (`measuredStationsTraining`), so no run of a demand fitted to held-out counts informs the out-of-sample score.

### Step 2: changes, twenty PM seeds

Kept by D4 only if recent fitted stations rise above 76 of 92 on seeds 1 to 20, neither ten-seed set falls below 75, and R1 to R4 hold. R1: summed through distance at most 12.3 and each figure no more than one standard error further out (Colby St SB at most 120.3). Round 40 on the same seeds in the first row.

| Step | Fitted stations 1-20 (1-10 / 11-20) | Through HNB / CNB / HSB / CSB (48-95 / 102-145 / 79-120 / 39-117), distance | Headline 4 of 4, error 1-10 / 11-20 | Telegraph/Alcatraz legs N / W / S / E, GEH | Result |
| --- | --- | --- | --- | --- | --- |
| Round 40 | 76 (75 / 75) | 92.6 / 150.6 / 122.4 / 111.8, 8.0 | yes, 5.9 / 5.3 | 7.3 / 12.7 / 7.6 / 6.5 | |
| S-c: Forest St green 4 s (ASSUMPTION) | 80 (80 / 78) | 103.8 / 154.5 / 132.0 / 104.3, 30.3 | no (2 of 4), 8.0 / 8.4 | 6.5 / 12.2 / 6.0 / 6.8 | not kept, R1 and R2 |
| S1: bounding-street and Telegraph/Alcatraz stations (24) | 75 (77 / 75) | 95.3 / 150.9 / 123.8 / 111.7, 9.9 | yes, 6.0 / 6.1 | 4.5 / 5.7 / 5.3 / 6.8 | not kept, stations |
| S2: class (b) blocks inside the study area (14) | 81 (77 / 81) | 91.5 / 149.1 / 119.1 / 121.7, 8.8 | yes, 4.1 / 4.3 | 5.3 / 11.7 / 5.6 / 7.8 | not kept, Colby St SB 1.4 over its R1 limit |
| S4: S2 with one more membership iteration (forty runs) | 84 (83 / 84) | 91.8 / 150.4 / 115.8 / 117.5, 5.9 | yes, 4.5 / 4.0 | 6.4 / 12.3 / 6.3 / 8.3 | kept |

S-c gives the Forest St approaches the observed Colby St green. Fitted stations rise to 80, but the cars move onto Hillegass Ave and Colby St: through distance 30.3, and the Hillegass Ave SB and Colby St SB freeway shares fall out of their 10 points. So the Forest St green carries part of the grid traffic, and an observation of it would help; the assumed value was not kept. S1 brings the Telegraph Ave / Alcatraz Ave legs close to their counts (W leg 287 to 423 against 547), but no recent station gains, mean backlog is unchanged and far clearings rise from 1.65 to 4.7 an hour. S2 and S4 thin the pairs that cut through the grid in the simulator. Forest St eastbound falls from 190 to 121 (66 counted), Ayala Ave SB from 110 to 83 (20). S4 recomputes the through targets' membership and the S2 stations' pairs from the round-40 runs and S2's runs together, the round-39/40 procedure, and keeps every rail. S4 was defined after S2's result (design D9); a reader may weigh it accordingly.

S4 in the rails: R1 distance 5.9, every figure inside its limit (Colby St NB 150.4, 5.4 over its range against 5.6 in round 40). R2 4 of 4 on both sets. R3 judged clearings 0.00 on both sets, backlog under 2% in every seed, mean 0.63% and 0.56%. R4 Telegraph Ave PM 340 / 318 s and 340 / 313 s. Not a rail of this round: the held-out east leg of Telegraph Ave / Alcatraz Ave (count 689, year 2019, outside the recent rule) falls from 530 to 487, GEH 6.5 to 8.3, more than round 40's G5 limit of 1.5. Out of sample the recent held-out stations go from 13 to 11 of 24 on twenty seeds: the volunteer-count ones' mean GEH falls from 3.94 to 3.74 and the cut-through blocks among them improve (McAuley St eastbound 120 to 86 against 12, Ayala Ave NB 167 to 122 against 60), but Canning St between 59th St and McAuley St tips over 5 in both directions (4.97 to 5.73 and 3.79 to 5.55).

S5 (design D11) applies the same to five AM class (b) blocks (60th St and 63rd St eastbound to Telegraph Ave, Martin St and 58th St westbound, Forest St eastbound), AM pairs from ten AM runs. AM seeds 1 to 10, round 40 in brackets: recent fitted stations 70 of 77 (67), held out 15 of 19 (14), out of sample; Telegraph Ave 300 / 278 s (296 / 300); D16 holds, no judged clearing. Kept. The PM demand of S5 is that of S4.

### Result

Shipped: S5 (PM demand of S4, AM of S5; midday flows unchanged). Demand 930a1d90b2d1af05 became 36cb33c11df6840f, cross-validation demand 738c179defd714e0 became 74a3d41b5b043b70; the PM through targets' membership and the stations' pairs are in `rockridge.through-membership.json` and, for the training view, `rockridge.station-membership-training.json`. `npm run assess -- --publish --noise` (seeds 1 to 10); PM seeds 11 to 20 run separately on the same flows. Round 40 in brackets.

| | Target | PM 1-10 | PM 11-20 | PM 1-20 (SE) | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- | --- |
| Through cars HSB / CSB / HNB / CNB (fitted) | 79-120 / 39-117 / 48-95 / 102-145 | 116 / 122 / 93 / 150 (119 / 111 / 92 / 150) | 116 / 113 / 91 / 151 (126 / 113 / 93 / 151) | 116 (2.5) / 118 (2.3) / 92 (2.0) / 150 (3.5) (122 / 112 / 93 / 151) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.3 / 49.6 / 61.4 / 41.4, 4 of 4, error 4.5 (5.9) | 54.2 / 47.1 / 63.8 / 40.6, 4 of 4, error 4.0 (5.3) | | 4 of 4, error 4.5 (4.6) | error 5.9 (5.9) |
| Cars cleared from gridlock per hour, judged (D16) / far | below 1 | 0.00 / 1.20 (0.60 / 1.40) | 0.00 / 2.10 (0.00 / 1.90) | | 0.00 / 0.30 (0.00 / 0.10) | 0.00 / 0.00 |
| Entry backlog, mean %, seeds under 2% | below 2% | 0.63, 10 (0.68) | 0.56, 10 (0.67) | | 0.02, 10 (0.03) | 0.01, 10 |
| Arterial speed, m/s | above 4 | 8.26 (8.32) | 8.29 (8.29) | | 9.35 (9.32) | 10.06 |
| Telegraph Ave NB / SB, s | PM 302-420 / 300-376; AM 280-315 / 245-285 | 340 / 318 (342 / 309) | 340 / 313 (348 / 317) | | 300 / 278 (296 / 300) | |
| Telegraph Ave at Alcatraz Ave, N / W / S / E, veh/h (GEH) | 1,064 / 547 / 910 / 689 | 1,280 (6.3) / 304 (11.8) / 1,098 (5.9) / 492 (8.1) (6.7 / 12.5 / 6.7 / 6.3) | 1,287 (6.5) / 285 (12.8) / 1,121 (6.6) / 482 (8.6) (7.9 / 13.0 / 8.4 / 6.6) | | | |
| Recent stations GEH<5, fitted / held out (out of sample) | above 85% | 83 of 92 (90%) / 11 of 24 (46%) (75, 82% / 13, 54%) | 84 of 92 / 11 of 24 (75 / 12) | 84 of 92 (91%) / 11 of 24 (76 / 13) | 70 of 77 (91%) / 15 of 19 (79%) (67, 87% / 14, 74%) | no counts |

Validation: 62 of 74 cases pass, unchanged (engine and suite unchanged; only the revision in `validation.json` moved). `cargo test -p traffic-sim --release`, `npx vitest run` and `npx tsc --noEmit` pass. WASM parity and trace identity hold (`npm run check:wasm`, PM seed 1, 300 s: every field identical).

### Verdict

Status `uncalibrated`, rule by rule, round 40 in brackets; whether to change it is the project lead's decision:
- D16 (stability): passes in every period (passes). Judged clearings in the PM fall to none on both sets.
- D5 (headline shares within 10 points): passes, 4 of 4 on both PM sets (passes).
- Through cars on the four counted blocks, fitted: fail (fail). On twenty seeds Hillegass Ave NB and SB are inside, Colby St SB is 0.5 above (SE 2.3, inside within noise), Colby St NB is 5.4 above (SE 3.5). On seeds 1 to 10 Colby St SB is 122.
- Station rule, recent counts within GEH 5 in more than 85%: PM fitted passes, 84 of 92 on twenty seeds (91%; 83 and 84 on the two sets) (fails, 82%); PM held out fails, 11 of 24 (46%) (fails, 54%); AM fitted passes, 70 of 77 (91%) (passes, 87%); AM held out fails, 15 of 19 (79%) (fails, 74%).
- Telegraph Ave travel times: PM inside (inside); AM inside, southbound 278 s (300 s, outside).
- Primitive validation: p2, p3, b13, l1 and h4 fail with no reviewed exception (same).

### Counts for the project lead

No station count was dropped or down-weighted, and the conservation check found no block count out of balance. Two readings stay open:
- Colby St SB onto Claremont Ave toward the northeast, 75 (movement station, quarter weight since round 41): the exits read 218 against 162 on the feeding block, and the simulator carries 0.2.
- The six held-out Caltrans stations on San Pablo Ave, Ashby Ave and Tunnel Rd are sound counts, but each is the only count on its edge gate, so holding it out leaves the cross-validation demand without anything to place that traffic. They account for six of the thirteen PM held-out failures. Holding out such a station tests the class default of an uncounted gate more than the model's routing; changing that is a change to the split, which is the project lead's decision and was not made.

### What remains off

- PM held-out stations: 11 of 24. Besides the six Caltrans stations, the grid blocks west of Colby St that the fit cannot see (McAuley St, 60th St, Ayala Ave) still carry two to seven times their counts out of sample, and Canning St between 59th St and McAuley St tipped over GEH 5 in both directions.
- The Forest St green at Claremont Ave / Colby St / Forest St is unobserved; the simulator gives it about 37 s of 79. A field reading of that green (and of the Forest St approach queue) would show whether the grid traffic is a signal effect or a demand effect.
- The held-out east leg of Telegraph Ave / Alcatraz Ave fell from 530 to 487 against 689 (GEH +1.9; round 40's G5 limit, not a rail of this round, was 1.5). S1 showed that simulated membership on the Telegraph Ave / Alcatraz Ave legs brings the north, west and south legs near their counts, at a cost in far gridlock and no gain in recent stations.
- Colby St NB through cars (150 against 145) and Telegraph Ave at Alcatraz Ave as before; the SR-24 mainline gate backlog, the far gridlock, l1 and b13. The published proposals need a new search on this demand.

## Forty-first round: Colby St NB and the Forest St turn (change calibration-round-41)

Round 40 traced the remaining Colby St NB excess (150.6 on twenty seeds, SE 3.3, against 102 to 145) to cars that join Colby St partway, mostly from Forest St. This round checked the volunteer count at Claremont Ave / Colby St / Forest St and tried one change. Guard rails G1 to G5 were carried over against the round-40 demand and frozen with the keep rule in `openspec/changes/calibration-round-41/design.md` before any result. Nothing shipped: demand 930a1d90b2d1af05, network f9fa09a5726644d7, split, cross-validation demand and fingerprint f0df1aabc323 are all unchanged. Times Pacific; the round ran on 2026-11-17, 00:45 to 01:45.

### What the count gives at the junction

PM, route diagrams of Colby St NB and SB:
- Claremont Ave from the southwest onto Colby St NB, 121, and Forest St from the southeast onto Colby St NB, 57: fit stations (weight 0.5), not held out.
- Claremont Ave from the northeast onto Colby St NB, 4: below the 25-vehicle minimum for a constraint; unused.
- Colby St SB onto Claremont Ave toward the southwest, 84: fit station, not held out.
- Colby St SB onto Claremont Ave toward the northeast, 75: fit station with a quarter weight for a doubtful reading (the exits read 218 against 162 on the feeding block); not held out.
- Colby St SB straight onto Forest St, 59: not a movement station; the Forest St eastbound block from the junction (66) covers it. It is southbound traffic and not part of the Colby St NB excess, and a new station would change the station list the frozen split was checked against, so it was not added.

No movement there is both counted and unused, so there was nothing new to add. All four movement stations were already in the fit. Their membership came from the fit's static routes, which send fewer cars from Forest St onto Colby St NB than the simulator does.

### Change tried: simulated membership for the four movement stations

`calibrate --select-od` now also writes the pairs of the trips that made each movement or route station, and `countFit.throughTargets.measuredStations` lets named stations take their membership from those simulated trips (all trips, not only through trips; prior 5 trips at the static share, ASSUMPTION; station weights unchanged; PM only). The pairs came from twenty seeds of the round-40 demand; the through targets kept round 40's membership. PM, round 40 in brackets:

| | 1-10 | 11-20 | 1-20 (SE) |
| --- | --- | --- | --- |
| Through HNB / CNB / HSB / CSB | 96 / 152 / 121 / 120 (92 / 150 / 119 / 111) | 96 / 150 / 123 / 116 (93 / 151 / 126 / 113) | 96.0 (2.7) / 151.3 (3.0) / 122.2 (2.5) / 118.0 (2.4) (92.6 / 150.6 / 122.4 / 111.8) |
| Distance outside the ranges | 12.5 (4.9) | 9.2 (12.0) | 10.5 (8.0) |
| Forest St onto Colby St NB (57) | | | 75.9 (2.7) (81.0) |
| Claremont Ave onto Colby St NB (121) | | | 103.1 (2.7) (106.2) |
| Colby St NB whole street (102) | | | 93.7 (2.1) (93.2) |
| Recent fitted stations | 75 of 92 (75) | 77 of 92 (75) | |
| Headline error, within 10 | 5.6, 4 of 4 (5.9) | 5.6, 4 of 4 (5.3) | |
| Mean backlog | 0.63% (0.68%) | 0.58% (0.67%) | |
| Largest leg GEH rise (limit 1.5) | none | W +0.94 | |

The fit itself could bring the Forest St turn only to 77 under simulated membership (its target is 57), because the same pairs carry the block and gate counts. In the simulation the turn fell from 81 to 76 and Colby St NB did not move. The rails held, but the twenty-seed distance rose from 8.0 to 10.5, so by the frozen rule the change was reverted. The option stays in the code, unused by the shipped build.

### 62nd St and Forest St eastbound today

Twenty seeds on the shipped (round-40) demand, nothing changed: 62nd St eastbound from Florio St / Claremont Ave to Hillegass Ave carries 96.9 (SE 3.0) against 59 counted. Forest St eastbound from Colby St / Claremont Ave to Ayala Ave carries 189.5 (SE 6.3) against 66, 2.9 times its count, while Forest St westbound matches (63.6 against 66). Colby St SB onto Claremont Ave toward the northeast carries 0.5 against 75 counted (the doubtful reading). Where the model sends those cars instead, and how much of the Forest St eastbound excess they explain, was not traced in this round.

### Verdict

Unchanged from round 40: status `uncalibrated`; D16 and D5 pass; the through-car check fails on Colby St NB (150.6, SE 3.3, against 145); the station rule fails in the PM peak fitted (82%) and held out (54%) and in the AM held out (74%); AM Telegraph Ave southbound is 300 s against 245 to 285; p2, p3, b13, l1 and h4 fail with no reviewed exception.

### What remains off

- Colby St NB, the Forest St turn onto it, and Forest St eastbound. A count of the Colby St / Claremont Ave / Forest St junction that settles the doubtful 75 (Colby St SB onto Claremont Ave toward College Ave) would show whether the model's straight-through traffic onto Forest St is wrong.
- Weight 8 of round 40 (all four through figures inside, G5 broken on one seed set) awaits the project lead.

## Fortieth round: twenty seeds, target weight, Colby St NB against the count (change calibration-round-40)

Round 39 left Colby St NB and Hillegass Ave SB above their ranges, and its two ten-seed sets disagreed by up to 13 cars an hour. The project lead asked for four steps in order: judge on twenty seeds, raise the through targets' weight, check Colby St NB against data before constraining any route, and test a second membership iteration. A step is kept only if the summed distance outside the ranges falls on seeds 1 to 10 and on 11 to 20 and the guard rails G1 to G5 of round 39 hold, now measured against the round-39 demand. Rails and rules were frozen in `openspec/changes/calibration-round-40/design.md` before any new result. Simulator fingerprint f0df1aabc323, network f9fa09a5726644d7, split and cross-validation flows unchanged; demand 86ec26e0a271a7e3 became 930a1d90b2d1af05. Times Pacific; the round ran on 2026-11-16 and 17, 23:45 to 03:00.

### Step 1: noise

Twenty seeds (1 to 20) on the round-39 demand, mean and standard error of the mean (standard deviation over the seeds divided by the square root of 20): Hillegass Ave NB 95.0 (SE 2.0), Colby St NB 154.4 (3.6), Hillegass Ave SB 127.2 (3.2), Colby St SB 118.0 (2.7). The standard deviation over seeds is 9 to 16 cars an hour, so a ten-seed mean carries 3 to 5 of standard error, and round 39's 148 against 161 on Colby St NB is about two standard errors of their difference: noise. From this round the membership pools twenty seeds per demand, the figures are given on 1 to 10, 11 to 20 and 1 to 20, and the assessment's through table shows the standard error. On twenty seeds, round 39 had Hillegass Ave NB at its upper end and Colby St SB 1.0 above it, both inside within one standard error; Colby St NB (+9.4) and Hillegass Ave SB (+7.2) were not.

### Step 3: Colby St NB against the count

Before anything else was changed, the round-39 runs were checked against the counts on Colby St NB. The cars leaving it at Alcatraz Ave match: 130 turning left (131 counted) and 29 right (32). SR-24 off-ramp traffic heading west or north on it is 64 an hour against 52 implied (38 to 62), but that implied value is the counted left turns times an assumed freeway share, so it does not support a route constraint. Two counted figures disagree: whole-street cars are 92 against 102 counted, and the turn from Forest St onto Colby St NB carries 86 against 57 counted (a movement station of weight 0.5 in the fit). So the excess through cars join Colby St partway, mostly from Forest St, instead of driving it from the ramps. No route constraint was added; the through target and its weight are left to deal with it.

### Steps 2 and 4: membership and weight

Membership: round 39 pooled the ten baseline seeds; step A pools forty runs (seeds 1 to 20 on the round-38 and on the round-39 demand). Weights 2, 4 and 8 use the forty-run membership. W2-i2 is a second iteration at weight 2, pooling sixty runs (the forty plus weight 2's twenty). Every row is twenty seeds; figures are the twenty-seed means; distance is the cars an hour outside the ranges, summed over the four runs.

| Step | Weight | HNB / CNB / HSB / CSB, seeds 1-20 (48-95 / 102-145 / 79-120 / 39-117) | Distance 1-10 / 11-20 / 1-20 | G1 fitted stations 1-10 / 11-20 | G2 within 10, error 1-10 / 11-20 | G5 largest GEH rise 1-10 / 11-20 (limit 1.5) | Fit: blocks within tolerance; static freeway shares HNB / CNB / HSB / CSB (47 / 47 / 68 / 45); ramps within tolerance off / on | Kept |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Round 39 | 1 | 95.0 / 154.4 / 127.2 / 118.0 | 8.5 / 29.2 / 17.6 | 75 / 75 | 4 of 4, 6.2 / 5.7 | | 41 of 107; 35 / 45 / 59 / 43; 6 of 7 / 6 of 9 | shipped |
| A, forty runs | 1 | 93.5 / 152.8 / 125.5 / 122.0 | 7.8 / 28.8 / 18.3 | 74 / 74 | 4 of 4, 6.1 / 6.1 | +0.14 / +0.83 | 41; 35 / 45 / 60 / 44; same | no change within noise |
| Weight 2 | 2 | 92.6 / 150.6 / 122.4 / 111.8 | 4.9 / 12.0 / 8.0 | 75 / 75 | 4 of 4, 5.9 / 5.3 | none / +0.77 | 41; 37 / 46 / 61 / 45; same | yes |
| Weight 4 | 4 | 95.1 / 152.0 / 114.0 / 104.3 | 3.8 / 10.7 / 7.1 | 75 / 77 | 4 of 4, 5.7 / 5.1 | +0.68 / +1.54 (E leg) | 43; 39 / 46 / 63 / 47; same | no, G5 |
| Weight 8 | 8 | 90.5 / 137.8 / 109.6 / 98.3 | 0 / 0 / 0 | 76 / 75 | 4 of 4, 6.0 / 4.5 | +1.21 / +1.67 (E leg) | 44; 44 / 49 / 63 / 50; same | no, G5 |
| W2-i2, sixty runs | 2 | 92.4 / 150.5 / 119.5 / 114.3 | 0 / 17.3 / 5.5 | 75 / 75 | 4 of 4, 6.1 / 5.2 | none / +1.23 | 41; 37 / 46 / 61 / 45; same | no, distance rose on 11-20 |

Step A cut the distance on both ten-seed sets by under 1 car an hour and raised it on twenty seeds, so a second iteration at weight 1 changes nothing beyond noise. So round 39's rise from 8.5 to 13.9 at its second iteration was seed noise in the ten-seed shares: with four times as many runs pooled the prior (5 trips, ASSUMPTION) weighs a quarter as much per pair, and the figures did not move. A higher weight costs little in the fit itself. Ramp counts stay inside their tolerance as before, block counts within tolerance rise from 41 to 44 of 107, and the static freeway shares move toward the observed ones. In the simulation the cost falls on the held-out east leg of Telegraph Ave / Alcatraz Ave (Alcatraz Ave leaving eastward, counted 689): 542 an hour on round 39's seeds 11 to 20, 527 at weight 2, 506 at weight 4, 503 at weight 8. Weight 8 brings all four figures inside their ranges on both seed sets. On seeds 11 to 20 it raises that leg's GEH by 1.67, over the frozen limit of 1.5; on twenty seeds the rise is 1.44. Weight 4 misses the limit by 0.04 on the same set. Weight 2 is the highest weight that holds every rail, and W2-i2 is not kept, so the round stops at weight 2 with the forty-run membership.

### Where the trips went

They were again removed from their pairs, not rerouted; at counted gates the fit restored the totals from other pairs (PM car trips 26,349 to 26,371). Largest changes against round 39: West Berkeley to the SR-24 westbound on-ramps -31, Ashby Ave from the west to College Ave north -15 and to the Berkeley hills -14, and up: study-area trips to the hills east +18, Berkeley side streets to south-east Oakland +14. AM and midday demand are within 4 cars an hour of round 39. `calibrate --od-costs`, PM seeds 1 to 4, completed through trips an hour, round 39 to round 40: Hillegass Ave SB 117 to 107 (Ashby Ave from the west to College Ave north 17 to 12), Colby St SB 103 to 96 (same group 17 to 12; Berkeley side streets to south-east Oakland 10 to 5), Hillegass Ave NB 78 to 77, Colby St NB 127 to 127 (SR-24 off-ramp to Telegraph Ave north 53 to 53).

### Result: ten seeds

`npm run assess -- --publish --noise` (PM seeds 1 to 10, AM, midday); PM seeds 11 to 20 run separately on the same demand. Round 39 in brackets.

| | Target | PM 1-10 | PM 11-20 | PM 1-20 (SE) | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- | --- |
| Through cars HSB / CSB / HNB / CNB (fitted) | 79-120 / 39-117 / 48-95 / 102-145 | 119 / 111 / 92 / 150 (125 / 116 / 94 / 148) | 126 / 113 / 93 / 151 (129 / 120 / 96 / 161) | 122 (2.8) / 112 (3.3) / 93 (2.0) / 151 (3.3) (127 / 118 / 95 / 154) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.8 / 50.1 / 59.8 / 38.6, 4 of 4, error 5.9 (6.2) | 53.6 / 47.3 / 59.8 / 38.7, 4 of 4, error 5.3 (5.7) | | 50.7 / 43.1 / 59.3 / 47.2, error 3.0 (3.2) | 53.0 / 37.8 / 62.9 / 47.3, error 5.9 (5.4) |
| Cars cleared from gridlock per hour, judged (D16) / far | below 1 | 0.60 / 1.40 (0.10 / 1.90) | 0.00 / 1.90 (0.00 / 1.00) | | 0.00 / 0.10 (0.00 / 0.60) | 0.00 / 0.00 |
| Entry backlog, mean %, seeds under 2% | below 2% | 0.68, 10 (0.70) | 0.67, 10 (0.57) | | 0.03, 10 | 0.01, 10 |
| Arterial speed, m/s | above 4 | 8.32 (8.27) | 8.29 (8.34) | | 9.32 | 10.06 |
| Telegraph Ave NB / SB, s | PM 302-420 / 300-376; AM 280-315 / 245-285 | 342 / 309 (338 / 307) | 348 / 317 (345 / 313) | | 296 / 300 (296 / 303) | |
| Telegraph Ave at Alcatraz Ave, N / W / S / E, veh/h (GEH) | 1,064 / 547 / 910 / 689 | 1,294 (6.7) / 291 (12.5) / 1,124 (6.7) / 533 (6.3) (GEH 7.6 / 13.2 / 7.5 / 6.6) | 1,339 (7.9) / 283 (13.0) / 1,183 (8.4) / 527 (6.6) (GEH 8.1 / 13.0 / 7.7 / 5.9) | | | |
| Recent stations GEH<5, fitted / held out (out of sample) | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (same) | 75 of 92 (75) | | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |

The held-out stations are scored on the cross-validation demand, whose flows are still unchanged (the through targets stay out of the training view), so their out-of-sample scores are unchanged by construction; on the shipped demand they are 18 of 24 in sample (18). Validation is unchanged (engine and suite unchanged: 62 of 74). WASM parity and trace identity hold (`npm run check:wasm`).

### Guard rails

- G1: 75 of 92 on both PM sets (75 and 75); AM 67 of 77 (67). Holds.
- G2: 4 of 4 within 10 points on both sets, error 5.9 and 5.3 (6.2 and 5.7). Holds.
- G3: judged clearings 0.60 and 0.00 an hour, backlog under 2% in 10 of 10 seeds on both sets, mean backlog 0.68% and 0.67% (limits 0.85% and 0.72%), arterial speed above 8 m/s. Holds. On seeds 11 to 20 far clearings rose from 1.0 to 1.9 and mean backlog from 0.57% to 0.67%.
- G4: PM inside on both sets; AM northbound 296 s inside, southbound 300 s (303). Holds.
- G5: no leg rises on seeds 1 to 10; on 11 to 20 the S leg rises by 0.77 and the E leg by 0.65 (limit 1.5). Holds.

### Verdict

Status `uncalibrated`, rule by rule, round 39 in brackets; the status is the project lead's decision:
- D16 (stability): passes in every period (passes).
- D5 (headline shares within 10 points): passes in the PM peak, 4 of 4 on both sets (passes).
- Through cars on the four counted blocks, fitted: fail (fail). On twenty seeds Hillegass Ave NB and Colby St SB are inside, Hillegass Ave SB is 2.4 above its range with a standard error of 2.8 (inside within noise), Colby St NB is 5.6 above with a standard error of 3.3. On seeds 1 to 10 three of four are inside (two); on 11 to 20 two of four (none).
- Station rule, recent counts within GEH 5 in at least 85%: PM fails fitted (82%) and held out (54%) (same); AM passes fitted (87%) and fails held out (74%) (same).
- Telegraph Ave travel times: PM inside; AM southbound 300 s against 245 to 285 (303).
- Primitive validation: p2, p3, b13, l1 and h4 fail with no reviewed exception (same).

### What remains off

- Colby St NB stays above its range at weight 2 (150.6 on twenty seeds, SE 3.3), and Hillegass Ave SB is inside within noise (122.4, SE 2.8). Weight 8 brings both inside on both seed sets, but it also lowers Alcatraz Ave eastbound out of the Telegraph Ave junction (a held-out leg) by 1.67 GEH on one seed set, over the limit the rails set. Whether that trade is acceptable is the project lead's decision.
- The excess on Colby St NB enters from Forest St (86 against 57 counted). The fitted movement station there has weight 0.5, and the simulator overshoots it.
- As before: Telegraph Ave at Alcatraz Ave about 22 to 26% over its count, the SR-24 mainline gate backlog, the far gridlock, l1 and b13. The published proposals need a new search on this demand.

## Thirty-ninth round: the four through-car figures become fit targets (change calibration-round-39)

On 2026-11-16 the project lead decided ("Yes, fit to the cut-through counts") that the four counted through-car figures, Hillegass Ave and Colby St in each direction in the PM peak from the resident volunteer count of Feb 25, 2025, become targets of the demand fit. Until now they were only a check. The cost is that they stop being an independent check. The checks that stay independent are the held-out count stations, the headline freeway shares, stability and the arterial travel times. The compact model is shelved: its second round failed the lead's stop rule (`rockridge.extent-comparison.md`). Guard rails and the stopping rule were frozen in `openspec/changes/calibration-round-39/design.md` (D8, D9) before any result of a new demand was seen. Simulator fingerprint f0df1aabc323 and network f9fa09a5726644d7 are unchanged. Demand 1c798217e72fb1ba became 86ec26e0a271a7e3. The cross-validation demand's flows are unchanged (file 9de2bcebd9fb2a34; it differs from a367850a13850985 only in the config hash it records). Frozen split unchanged; no link renumbered. Times Pacific; the round ran on 2026-11-16, 22:00 to 23:59.

### What the four figures are

From the volunteer count (PM, route diagrams and block maps) come the whole-street cars (Hillegass Ave NB 48, Colby St NB 102, Hillegass Ave SB 79, Colby St SB 39), the cars whose trip ended along the street (15, 29, 40, 43) and the block volume, the median of the street's counted blocks (110, 174, 160, 160). Whole-street cars are through cars, so they are a lower bound. The block volume less the cars ending along the street is an upper bound, since it still holds cars that start along the street or end elsewhere in the study area. That gives the ranges 48 to 95, 102 to 145, 79 to 120 and 39 to 117, unchanged since round 19. The count does not say where in the range the true figure lies, so the fit aims at the middle (71.5, 123.5, 99.5, 78; ASSUMPTION) and the range is the tolerance.

The fit already used, from the same count, the block volumes (directed links, every fourth held out), the whole-street route counts (all cars driving the street end to end), the turning movements at the street ends and the assumed movement flows that pin the Alcatraz Ave turn-ins and turn-outs. The pinned flows carry 87 through trips an hour on Hillegass Ave SB, 46 on Colby St SB, 25 on Colby St NB and 7 on Hillegass Ave NB. They stay pinned and count toward the target. No existing station counts through cars on any link of a street run, so nothing is counted twice.

### Mechanism

The target sits inside the count fit and the simulator supplies its membership (design D5, option c). A through flow's proportion on a street run is its pair's share of trips counted on the run over ten seeds (`calibrate --select-od`), less the pinned flows, with the static route share as a prior worth 5 trips (ASSUMPTION). Every other count stays a constraint in the same fit, so gate totals stay with their counts. The simulator's figure counts each car once per run when any link of the run is in its trip and neither trip end is at a study-area node. The fit mirrors that with a new route feature (`any`) on the same links. Pooled over the ten baseline seeds, the select-link files give 97.5, 149.8, 142.5 and 132.1, the report's means exactly.

Two options were not chosen. (a) Static targets only: the fit's own routes already put 80, 135, 104 and 73 on these runs, three of them inside their ranges, against 98, 150, 143 and 132 simulated, so such targets would barely act. (b) A correction outside the fit: scaling flows there moves every count they cross and needs a second balancing step.

AM and midday take the PM range times the period volume factor (0.85, 0.62) as an upper limit only (ASSUMPTION). Their baseline figures are AM 70 / 89 / 70 / 90 and midday 54 / 76 / 70 / 78 (HNB / CNB / HSB / CSB). All are below the limits except midday Colby St SB (78 against 73), and none binds at the end of the fit.

### Iterations

Simulated = mean of PM seeds 1 to 10. Distance = the cars an hour outside the range, summed over the four runs. The fit columns use the simulated membership.

| Iteration | Membership from | Fit HNB / CNB / HSB / CSB | Simulated HNB / CNB / HSB / CSB | Distance |
| --- | --- | --- | --- | --- |
| 0 (shipped) | | 98 / 160 / 143 / 127 (static routes 80 / 135 / 104 / 73) | 97.5 / 149.8 / 142.5 / 132.1 | 44.9 |
| 1 | baseline, 10 runs | 92 / 157 / 125 / 108 | 93.9 / 148.1 / 125.4 / 115.7 | 8.5 |
| 2 | baseline and iteration 1, 20 runs | 93 / 158 / 126 / 111 | 96.4 / 148.6 / 126.9 / 119.0 | 13.9 |

Iteration 2 did not cut the distance, so the loop stopped and iteration 1 is the result (D9). On seeds 11 to 20 it gives 96.1 / 160.8 / 129.0 / 120.3, distance 29.2 against 56.8 for the shipped demand. The fit itself stops about 25% above the middle on Colby St NB and Hillegass Ave SB, because the flows on these runs also carry the ramp counts (weight 2), the freeway shares of the blocks (weight 3), Telegraph Ave and the block counts. On Colby St NB the largest group is SR-24 off-ramp traffic bound for Telegraph Ave north (53 an hour). Only a small part of that pair uses Colby St, so lowering the pair costs counts elsewhere.

### Where the trips taken off these streets went

They were removed from their pairs, not rerouted (D5). PM car trips went from 26,352 to 26,349: at counted gates the fit restored the totals from other pairs. The largest changes by origin and destination group: Ashby Ave from the west to the Berkeley hills -40, West Berkeley to the SR-24 westbound on-ramps -18, College Ave from the north to south-east Oakland -16, Berkeley side streets north of Alcatraz Ave to SR-13 +15. `calibrate --od-costs`, PM seeds 1 to 4, completed through trips an hour before and after: Colby St SB 119 to 103 (Berkeley side streets to south-east Oakland, 13 to 10), Hillegass Ave SB 129 to 117 (same group, 8 to 4), Hillegass Ave NB 86 to 78 (south-east Oakland to the Berkeley side streets, 16 to 11), Colby St NB 125 to 127 (SR-24 off-ramp to Telegraph Ave north, 53 to 53). AM and midday demand moved by at most 6 cars an hour in any group. The limits did not bind there, but the flows they touch no longer take the median factor of untouched flows.

### Result: ten seeds

`npm run assess -- --publish --noise`; PM seeds 11 to 20 run separately on the same demand. Round 38 in brackets.

| | Target | PM 1-10 | PM 11-20 | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- |
| Through cars HSB / CSB / HNB / CNB (now fitted) | 79-120 / 39-117 / 48-95 / 102-145 | 125 / 116 / 94 / 148 (143 / 132 / 98 / 150) | 129 / 120 / 96 / 161 (146 / 140 / 96 / 152) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.9 / 50.7 / 59.2 / 38.5, 4 of 4, error 6.2 (52.9 / 50.5 / 55.1 / 37.4, 3 of 4, 7.5) | 53.9 / 46.4 / 59.4 / 38.2, 4 of 4, error 5.7 (52.8 / 47.9 / 56.6 / 38.9, 3 of 4, 6.0) | 50.9 / 42.7 / 60.0 / 46.8, error 3.2 (3.0) | 53.4 / 37.5 / 62.7 / 45.1, error 5.4 (5.4) |
| Cars cleared from gridlock per hour near the study area, judged (D16) | below 1 | 0.10 (0.60) | 0.00 (0.00) | 0.00 (0.00) | 0.00 (0.00) |
| Far | | 1.90 (0.50) | 1.00 (1.30) | 0.60 (0.30) | 0.00 (0.00) |
| Entry backlog, mean %, seeds under 2% | below 2% | 0.70, 10 (0.71, 10) | 0.57, 10 (0.57, 10) | 0.03, 10 (0.03) | 0.01, 10 (0.01) |
| Arterial speed, m/s | above 4 | 8.27 (8.26) | 8.34 (8.34) | 9.32 | 10.06 |
| Telegraph Ave NB / SB, s | PM 302-420 / 300-376; AM 280-315 / 245-285 | 338 / 307 (345 / 317) | 345 / 313 | 296 / 303 (294 / 299) | |
| Telegraph Ave at Alcatraz Ave, N / W / S / E legs, veh/h (GEH) | 1,064 / 547 / 910 / 689 | 1,327 (7.6) / 279 (13.2) / 1,150 (7.5) / 527 (6.6) (GEH 7.1 / 12.9 / 6.8 / 6.0) | 1,346 (8.1) / 282 (13.0) / 1,157 (7.7) / 542 (5.9) (GEH 8.7 / 12.5 / 8.0 / 5.4) | | |
| Recent stations GEH<5, fitted / held out (out of sample) | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (same) | 75 of 92 | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |
| Held-out stations on the shipped demand (in sample) | | 18 of 24 (same) | 17 of 24 | 17 of 19 | |
| Older counts GEH<5, fitted | | 53 of 95 (48) | 52 of 95 | 25 of 48 | |

The held-out stations are scored out of sample on the cross-validation demand. Its flows did not change, because every street run holds a held-out block and the targets stay out of the training view (design D7), so the out-of-sample scores are round 38's by construction.

Validation: 62 of 74 cases pass, as in round 38; failing a3, e2, e3, j6, j8, j9, j12 (reviewed), l1, p2, p3, b13, h4 (not reviewed). `cargo test -p traffic-sim --release` passes. WASM parity and trace identity hold (`npm run check:wasm`, PM seed 1, 300 s: every field identical).

### Guard rails (design D8)

- G1 station fit: 75 of 92 on both PM sets (75), AM 67 of 77 (67). Holds.
- G2 headline shares: 4 of 4 within 10 points on both sets (3 of 4), error 6.2 and 5.7 (7.5 and 6.0). Holds.
- G3 stability: judged clearings 0.10 and 0.00 an hour, backlog under 2% in 10 of 10 seeds, no runaway growth, arterial speed 8.27 and 8.34 m/s, mean backlog 0.70% and 0.57% (0.71% and 0.57%). Holds. Far clearings rose on seeds 1 to 10 (0.5 to 1.9) and fell on 11 to 20 (1.3 to 1.0).
- G4 Telegraph Ave: PM inside on both sets; AM northbound 296 s inside, southbound 303 s (299, limit 309). Holds.
- G5 Telegraph Ave / Alcatraz Ave legs: the largest GEH rise is 0.64 (S leg, seeds 1 to 10) against the 1.5 allowed. Holds.

### Verdict

Status `uncalibrated`, rule by rule; whether to change it is the project lead's decision:
- D16 (stability): passes in every period.
- D5 (headline shares within 10 points): passes in the PM peak on both seed sets (4 of 4).
- Through cars on the four counted blocks, now fitted and no longer independent: fail. On seeds 1 to 10 Hillegass Ave NB and Colby St SB are inside, Colby St NB (148) and Hillegass Ave SB (125) above; on seeds 11 to 20 none is inside.
- Station rule, recent counts within GEH 5 in at least 85%: PM fails fitted (82%) and held out (54%); AM passes fitted (87%) and fails held out (74%).
- Telegraph Ave travel times: PM inside both ranges; AM southbound 303 s against 245 to 285.
- Primitive validation: p2, p3, b13, l1 and h4 fail with no reviewed exception.

### What remains off

- Colby St NB and Hillegass Ave SB stay above their ranges. The fit holds them about 25% above the middle because the same flows carry ramp counts, the freeway shares and the block counts. A higher weight on the targets, or a route constraint for the SR-24 off-ramp traffic that uses Colby St NB to reach Telegraph Ave, would be the next lever; neither was tried.
- The seed-to-seed spread on these blocks is large (Colby St NB 148 and 161 on the two seed sets), so one seed set can land on either side of a range edge.
- As before: Telegraph Ave at Alcatraz Ave about 25% over its count, the SR-24 mainline gate backlog, the far gridlock, l1 and b13. The published proposals were searched on the round-33 demand and need a new search on this one.

## Thirty-eighth round: Telegraph Ave at Alcatraz Ave, the SR-24 mainline gate (change calibration-round-38)

On 2026-11-16 the project lead kept the current model ("Keep the current model"). The delay-feedback refit is not adopted, because it reached the cut-through ranges partly by sending too little traffic toward the study area (Telegraph Ave at Alcatraz Ave, north leg, 763 veh/h against 1,064 counted) and by leaving 370 to 460 trips waiting at far entries. The entry-backlog check stays network-wide. This round looks at two measured errors of the shipped model: Telegraph Ave carries 1,307 veh/h at the Alcatraz Ave north leg, a fitted station counted at 1,064, and 143 trips per PM seed are still waiting at the SR-24 mainline gate at the end of the hour. Each change is kept only if validation and the network both improve on PM seeds 1 to 10 and 11 to 20. Through-car ranges, headline shares and held-out stations are checks, not targets. Decisions are in `openspec/changes/calibration-round-38/design.md`. Simulator fingerprint f0df1aabc323, network f9fa09a5726644d7, demand 1c798217e72fb1ba and cross-validation demand a367850a13850985, all unchanged. Times Pacific; the round ran on 2026-11-16.

### Reproduction and memory

`npm run data` in a fresh worktree reproduced the network, the demand and the cross-validation demand byte for byte. The container restarted during the round. Run alone with its memory sampled every second, a demand build peaked at 1.8 to 1.9 GB resident (shipped and training views, with and without measured delays) on a 16 GB machine, so the builds do not exhaust memory.

### Step 1: why Telegraph Ave carries too much

Fit = the demand fit's final assigned flow on the shipped demand; simulated = mean of PM seeds 1 to 10 on the shipped demand (seeds 11 to 20 in brackets).

| Station (PM) | Counted | Fit | Simulated |
| --- | --- | --- | --- |
| Telegraph Ave at Alcatraz Ave, N leg entering (fitted) | 1,064 | 1,080 | 1,307 (1,368) |
| Telegraph Ave at Alcatraz Ave, W leg entering (Alcatraz Ave from the west, fitted) | 547 | 569 | 285 (292) |
| Telegraph Ave at Alcatraz Ave, S leg leaving (fitted) | 910 | 891 | 1,128 (1,168) |
| Telegraph Ave at Alcatraz Ave, E leg leaving (held out) | 689 | 605 | 539 (555) |
| SR-24 eastbound on-ramp at Telegraph Ave / 56th St (held out) | 657 | 789 | 979 (992) |
| SR-24 westbound on-ramp at Claremont Ave / Hudson St (held out) | 598 | 727 | 853 (873) |
| Telegraph Ave at 55th St, N leg entering (fitted) | 1,099 | 1,090 | 1,141 (1,162) |
| Telegraph Ave at 52nd St, N leg entering (fitted) | 1,121 | 1,108 | 1,117 (1,187) |

Link by link, Telegraph Ave southbound agrees from the north edge to Ashby Ave (697 assigned, 665 simulated). Past Ashby Ave the fit has 476 and the simulation 628: Ashby Ave westbound brings 466 into the junction against 337 and turns left onto Telegraph Ave. 66th St adds 94 more (131 against 37), and the excess reaches 228 at Alcatraz Ave. Alcatraz Ave eastbound from the west is one lane between Shattuck Ave and Telegraph Ave, with 35, 32 and 33 s of simulated delay per vehicle on the links into Shattuck Ave, Irwin Ct and Telegraph Ave. The excess stays on Telegraph Ave and leaves it at the 56th St on-ramp to SR-24 eastbound. Eastbound on-ramps farther east take less (Broadway, 219 against 359), and Ashby Ave eastbound toward Tunnel Rd carries 474 against 975, with 69 to 76 s of delay at Claremont Ave and at Domingo Ave (round 36's chain).

The candidate causes, measured:
- (a) Same trips, different routes. The shipped PM car flows were assigned again on the fit's own cost model, without a refit, adding the ten-seed simulated delay per vehicle to each link (control delay removed, as in the fit). With the fit's costs the north leg gets 1,082; with all measured delays 1,615; with half of them 1,347; with delays only on links within 200 m or 600 m of the study area, 958 and 1,109. At the W leg the figures are 580, 96, 300, 56 and 58 (simulated 285), and at the 56th St on-ramp 791, 1,266, 935, 753 and 743 (simulated 979). Over all non-freeway links with at least 100 veh/h, the root-mean-square difference from the simulated flows is 169 veh/h for the fit's costs, 171 with all delays, 130 with half and 199 and 203 with the zone-only delays. Half of the measured delay reproduces the simulator's routing best: drivers see delays smoothed per minute, 46% follow live guidance and each draws a perception error once. So the excess is cause (a), and the delays behind it lie mostly outside the judged zone.
- (b) Assumed movements: none is on Telegraph Ave. The volunteer-count movements are about 280 veh/h of turns inside the study area; the large `via` volumes are the SR-24 off-ramp choices.
- (c) Signal coordination: with it off (`--coord-max-m 0`, PM seeds 1 to 3) the north leg carries 1,271 against 1,321, so about 50 of the excess.
- Live guidance: with it off (`--guided-share 0`) the north leg carries 1,350, so en-route switching is not the cause.

### Step 2: the cures

- Delays only in and around the judged zone were not built: at every buffer tried they reproduce the simulation worse than the current costs (step 1).
- Damped feedback, tested. Method of successive averages with step 1/n [PowellSheffi1982]: with the free-flow costs as the first iterate and the simulated delays as the second, the link cost carries half the measured delay, which is also the weight that matched the simulation. `countFit.assignment.measured.weight` (default 1, unused by the shipped build) was added, and a demand built with weight 0.5, BPR alpha 0.15 and the ten-seed delays of the shipped demand in each period.

| PM, seeds 1-10 (11-20) | Shipped | Half-weight delays |
| --- | --- | --- |
| Telegraph Ave at Alcatraz Ave, N leg | 1,307 (1,368) | 1,210 (1,191) |
| Alcatraz Ave W leg / 56th St on-ramp | 285 / 979 (292 / 992) | 352 / 896 (338 / 912) |
| Through cars HSB / CSB / HNB / CNB | 142 / 132 / 97 / 150 (146 / 139 / 96 / 152) | 138 / 134 / 94 / 154 (141 / 150 / 93 / 139) |
| Headline error, shares within 10 points | 7.5, 3 of 4 (6.0, 3 of 4) | 5.5, 4 of 4 (7.0, 3 of 4) |
| Cars cleared from gridlock an hour, all / judged | 1.1 / 0.6 (1.3 / 0.0) | 17.4 / 0.1 (15.2 / 0.2) |
| Arterial speed, m/s | 8.26 (8.34) | 7.27 (7.29) |
| Recent fitted stations GEH<5 | 75 of 92 (75) | 70 of 92 (70) |

The far gridlock is at Avalon Ave / Claremont Blvd, Ashby Ave at Claremont Crescent and Claremont Ave, Martin Luther King Jr Way at 61st and 62nd St, and King St. The step halves the Telegraph Ave excess, but the network gets worse on both seed sets, so it is not kept.

### Step 3: the SR-24 mainline gate

The gate (node 602) has two first links: the four-lane mainline (no delay, all of its demand enters) and a three-lane, 75 m collector. The collector forks into the 52nd St off-ramp and the Martin Luther King Jr Way off-ramp, which drops from two lanes to one. The demand sends 1,630 veh/h to the second ramp and 1,009 to the first. The simulation passes 1,516 and 925 (counted 1,614 and 1,024), with 57 s of delay per vehicle on the two lanes before the drop. Validation case i5 puts the model's lane drop at 0.81 of one lane (1,542 veh/h), below the count on that ramp. That part of the waiting is a capacity limit of the model's lane drop. The backlog grows from minute 25, when the queue reaches the gate. Waiting trips then leave the gate in order per first link, so trips for the 52nd St ramp wait behind trips for the lane drop although they use other lanes. That part is an insertion artifact.

New validation cases (in `validate.rs`, outside the fingerprint): h3, a 3-lane gate link admits 1,922 veh/h per lane (pass); h4, a gate onto a 3-lane fork with one branch queued back to the gate passes 0.43 of the free branch's flow (range 0.90 to 1.10, ASSUMPTION; fail, listed as a deviation, not reviewed). Tested engine fix: a waiting trip waits only behind trips for the same fork branch (fingerprint ba5e76c11ec1). Every other case is unchanged and h4 rises to 0.64. On PM seeds 1 to 10 (11 to 20) the trips waiting at the gate fall from 143 to 84 per seed (68), the backlog from 0.71% to 0.52% (0.57% to 0.44%), and the 52nd St off-ramp carries 990 (996) against 1,024 counted. The study area does not change: Telegraph Ave north leg 1,309 (1,376), through cars 143 / 139 / 97 / 151 (146 / 144 / 97 / 151), recent fitted stations 75 (74) of 92, mean fitted GEH 3.83 (3.78) against 3.73 (3.76). The fix was not landed: the station fit does not improve, the gain lies outside the study area, and a new fingerprint would mark every published proposal out of date. The patch is kept with the round's scratch output (`target/r38/gate-band.patch`).

### Result: ten seeds

The shipped model is unchanged, so `npm run assess -- --publish --noise` reproduced round 37 in every simulated figure, and PM seeds 11 to 20 equal round 37's runs seed for seed. Round 37 in brackets.

| | Target | PM 1-10 | PM 11-20 | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 | 143 / 132 / 98 / 150 (same) | 146 / 140 / 96 / 152 (same) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.9 / 50.5 / 55.1 / 37.4, 3 of 4, error 7.5 (same) | 52.8 / 47.9 / 56.6 / 38.9, 3 of 4 (same) | 50.8 / 43.9 / 59.6 / 47.3 (same) | 52.6 / 37.2 / 62.8 / 45.5 (same) |
| Cars cleared from gridlock per hour near the study area, judged (D16) | below 1 | 0.60 (same) | 0.00 (same) | 0.00 (same) | 0.00 (same) |
| Far, with a chain into the zone | | 0.50, 0 (same) | 1.30, 0 (same) | 0.30, 0 (same) | 0, 0 (same) |
| Entry backlog, mean %; trips waiting at zone origins / all at the end | below 2% | 0.71; 0.9 / 185 (same) | 0.57; 1.5 / 150 (same) | 0.03; 0.4 / 5.6 (same) | 0.01; 0.1 / 0.8 (same) |
| Telegraph Ave NB / SB, s | PM 302-420 / 300-376; AM 280-315 / 245-285 | 345 / 317 (same) | | 294 / 299 (same) | |
| Recent stations GEH<5, fitted / held out | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (same) | | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |

Validation: 62 of 74 cases pass (61 of 72 in round 37, plus h3 passing and h4 failing). Failing: a3, e2, e3, j6, j8, j9, j12 (reviewed), l1, p2, p3, b13, h4 (not reviewed). WASM parity and trace identity: hold (`npm run check:wasm`, PM seed 1, 300 s: every field identical).

### Verdict

Status `uncalibrated`, rule by rule:
- D16 (stability, judged near the study area, backlog network-wide): passes in every period: PM 0.60 and 0.00 judged cars cleared from gridlock an hour on the two seed sets, backlog under 2% in 10 of 10 seeds; AM and midday 0.00.
- D5 (headline shares within 10 points): fails in the PM peak, 3 of 4 on both seed sets (Hillegass Ave SB 55 to 57 against 68).
- Through cars on the four counted blocks: fail, all four above their ranges except Hillegass Ave NB at the top edge (98 and 96 against 48 to 95).
- Station rule, recent counts within GEH 5 in at least 85%: PM fails fitted (82%) and held out (54%); AM passes fitted (87%) and fails held out (74%).
- Telegraph Ave travel times: PM inside both ranges; AM southbound 299 s against 245 to 285.
- Primitive validation: p2, p3, b13, l1 and h4 fail with no reviewed exception.

### What remains off

- Telegraph Ave at Alcatraz Ave stays 23% over its count, because the simulation routes freeway-bound trips around delays on Alcatraz Ave west of Telegraph Ave and on Ashby Ave toward Tunnel Rd that the fit's costs do not see. The half-weight fit halves it but brings far gridlock. Data that would settle it: a PM turning-movement count with queue lengths at Alcatraz Ave / Shattuck Ave and on the west approach of Alcatraz Ave / Telegraph Ave, a current count of the SR-24 eastbound on-ramp at Telegraph Ave / 56th St (the 2012 figure is held out), and the Claremont Ave / Russell St count named in round 36.
- The SR-24 mainline gate keeps about 143 trips waiting per PM seed: the lane drop on the Martin Luther King Jr Way off-ramp (i5) and the gate order (h4). The tested fix is ready if the lead accepts a fingerprint change.
- As before: the far gridlock, the queue-first left-turn model, the second eastbound lane on Ashby Ave, l1 and b13, the field checks of rounds 30 to 32, and stale stored proposal results, text pages and previews.

## Thirty-seventh round: gridlock judged near the Trapezoid (change calibration-round-37)

Round 36 traced the gridlock that keeps the delay-feedback fit rejected to the all-way stop at Claremont Ave / Russell St and the Berkeley hills streets north of Ashby Ave, a kilometer or more from the study area. On 2026-11-16 the project lead relayed a resident's field observation that Claremont Ave / Russell St is an all-way stop (every approach stops), so the network there is right, and chose "Judge gridlock near the Trapezoid": D16's limit of 1 car an hour cleared from gridlock, and the cost loop's acceptance rule, apply to the study area, its bounding streets and the junctions on them. Gridlock farther out is reported apart as a known weakness at the model's edges. Decisions are in `openspec/changes/calibration-round-37/design.md`. Simulator fingerprint f0df1aabc323, network f9fa09a5726644d7, demand 1c798217e72fb1ba and cross-validation demand a367850a13850985, all unchanged; frozen split unchanged; no link renumbered. Times Pacific; the round ran on 2026-11-16.

### Reproduction

`npm run data` in a fresh worktree reproduced round 36's network, demand and cross-validation demand byte for byte (the assumptions table differs only in its generation time). PM seed 1 on them, with this round's reporting, equals round 35's stored assessment run in every field but the manifest.

### Step 1: the field observation

`osmTagOverrides` adds `stop=all` to OSM node 53082604 with the observation as its source (DATA). The importer already read the junction-node stop as all-way, so the network file is unchanged. Round 36's open question, whether the junction is a minor-road stop, is closed.

### Step 2: the judged zone

The zone comes from data: the links and nodes the importer marks as in the study area (bounding streets included), both ends of those links, and every node within `judgedZone.bufferM` of them along the network in either direction (area config; 200 m, ASSUMPTION). A car counts as near when the node where it was held (the end of the link it waited on, or the node it was held in) is in the zone. The first non-freeway link beyond a bounding-street junction is 113 m long at the median, 200 m at the 75th percentile and 301 m at most, so 200 m reaches the next junction on three cross streets in four. A far car counts against the rule too when its blocking chain reaches the zone: at the 5 s snapshot before it was cleared, the links joined by vehicles held at least 60 s by a full exit (ASSUMPTION) include one in the zone. Bounding-street travel times were not used as the guard: only Telegraph Ave has observed segments and they stay in the assessment. The zone has 111 nodes and 329 links.

`calibrate` reads the split from the simulation's existing read-only diagnostics between its 5 s steps and writes `gridlockZone` into each seed's report: near, far, far with a chain into the zone, the judged count at 100, 200 and 400 m, far places, trips waiting at origins in the zone, and the longest standing queue on each bounding street. Nothing in the simulator's module tree changed, so the fingerprint and every run are unchanged (every re-run PM seed below matches its stored run). The ten-seed summary, `tools/assess.ts` and `tools/cost-loop.ts` judge D16 on near plus linked far clearings; everything else in both rules is unchanged.

### Step 3: delay-feedback fit

`tools/cost-loop.ts --no-stop` from the shipped demand, resumed from iteration 2 after two container restarts (`--resume 1 --jobs 3`). The runs carry no near/far split in storage, so the PM seeds were simulated again with the new reporting; every PM run of iterations 0 to 3 equals round 33's stored run (round 35's for iteration 0) in every simulated field, apart from the list of observed approaches that round 35 added to one signal. PM seeds 1 to 10, cars cleared from gridlock per hour:

| Iteration | All | Near (judged) | Far | Far, chain into the zone | Where far (seeds total) | PM stable (D16) | Backlog mean %, seeds under 2% | Headline error | Cost gap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 (free-flow and BPR costs) | 1.10 | 0.60 | 0.50 | 0 | single events | yes | 0.71, 10 | 7.5 | - |
| 1 | 24.70 | 0.10 | 24.60 | 0 | Ashby Ave / Claremont Crescent 34, Avalon Ave / Claremont Blvd 26, Ashby Ave / Claremont Ave 22 | yes | 1.07, 10 | 5.4 | 0.378 |
| 2 | 13.90 | 0.00 | 13.90 | 0 | Ashby Ave / Claremont Ave 23, Avalon Ave / Claremont Blvd 21, Ashby Ave / Claremont Crescent 10 | no | 1.75, 6 | 3.7 | 0.122 |
| 3 | 10.60 | 0.00 | 10.60 | 0 | Ashby Ave / Claremont Ave 21, Avalon Ave / Claremont Blvd 16, Ashby Ave / Claremont Crescent 16 | no | 1.86, 5 | 5.5 | 0.090 |

Converged at iteration 3. The far gridlock sits 1.0 to 1.4 km from the study area and no chain of it reached the zone. With gridlock judged near the Trapezoid the baseline is stable, so the rule needs a stable iteration with no more backlog than the baseline: iteration 1 is stable but leaves 1.07% of trips waiting against 0.71%, and iterations 2 and 3 fail D16 on backlog (6 and 5 seeds under 2%). Every iteration was rejected and the final build reproduced the shipped demand byte for byte.

### Result: ten seeds

Seeds 1 to 10 (PM also 11 to 20), scale 1.0, 60 minutes, `npm run assess -- --publish --noise`; PM seeds 11 to 20 run separately and identical to round 35's stored runs. Round 36 in brackets; only the gridlock rows changed in meaning.

| | Target | PM 1-10 | PM 11-20 | AM 1-10 | Midday 1-10 |
| --- | --- | --- | --- | --- | --- |
| Through cars HSB / CSB / HNB / CNB | 79-120 / 39-117 / 48-95 / 102-145 | 143 / 132 / 98 / 150 (same) | 146 / 140 / 96 / 152 (same) | no counts | no counts |
| Headline shares HNB / CNB / HSB / CSB | 47 / 47 / 68 / 45 | 52.9 / 50.5 / 55.1 / 37.4, 3 of 4, error 7.5 (same) | 52.8 / 47.9 / 56.6 / 38.9, 3 of 4 (same) | 50.8 / 43.9 / 59.6 / 47.3 (same) | 52.6 / 37.2 / 62.8 / 45.5 (same) |
| Cars cleared from gridlock per hour near the study area, judged (D16) | below 1 | 0.60 (1.10, every one counted) | 0.00 (1.30) | 0.00 (0.30) | 0.00 (0.00) |
| Far, with a chain into the zone | | 0.50, 0 | 1.30, 0 | 0.30, 0 | 0, 0 |
| Judged at 100 m / 400 m buffer | | 0.60 / 0.60 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Entry backlog, mean %; trips waiting at zone origins / all at the end | below 2% | 0.71; 0.9 / 185 (0.71) | 0.57; 1.5 / 150 (0.57) | 0.03; 0.4 / 5.6 (0.03) | 0.01; 0.1 / 0.8 (0.01) |
| Longest queue, seed mean m (share of samples with a full link): Telegraph / Alcatraz / College / Claremont / CA 24 | | 74 (2.9%) / 82 (1.6%) / 87 (3.3%) / 56 (0) / 43 (0) | 70 (1.4%) / 77 (1.2%) / 86 (5.4%) / 59 (0) / 42 (0) | see the assessment | see the assessment |
| Telegraph Ave NB / SB, s | PM 302-420 / 300-376; AM 280-315 / 245-285 | 345 / 317 (same) | | 294 / 299 (same) | |
| Recent stations GEH<5, fitted / held out | above 85% | 75 of 92 (82%) / 13 of 24 (54%) (same) | | 67 of 77 (87%) / 14 of 19 (74%) (same) | no counts |

PM near clearings: 6 over ten seeds, all on 55th St approaching its signal at Telegraph Ave by the SR-24 ramps (links 1576 and 1578; 4 of them in seed 6). Far: single events at 61st St / MLK Jr Way, 59th St / Idaho St, Russell St and Pine Ave, and Ashby Ave / Claremont Crescent; on seeds 11 to 20, 7 of 13 on Russell St. `calibrate --od-costs` on PM seeds 1 to 4 gives the same through cars as round 33 (Hillegass Ave SB 128, Colby St SB 118 an hour). Validation: 61 of 72 cases pass, as in round 36; failing a3, e2, e3, j6, j8, j9, j12 (reviewed), l1, p2, p3, b13 (not reviewed). WASM parity and trace identity hold (`npm run check:wasm`).

### Verdict

Status `uncalibrated`. D16 now holds in every period: PM 0.60 and 0.00 judged cars cleared from gridlock an hour on the two seed sets, AM and midday 0.00, at every buffer from 100 to 400 m. The PM peak still fails D5 (3 of 4), the through-car check on all four blocks and the station rule fitted (82%) and held out (54%); the AM peak fails the station rule held out (74%). Primitive validation: p2, p3, b13 and l1 fail with no reviewed exception. Whether to change the status is the project lead's decision.

### What remains off

- Far from the study area the model still clears cars from gridlock: about 1 an hour on the shipped demand and 10 to 25 on the feedback iterations, on Russell St and the hillside streets around Ashby Ave / Claremont Ave. The model has few counts there; the count at Claremont Ave / Russell St named in round 36 would still show what that all-way stop must pass.
- The feedback fit stays rejected, now on entry backlog rather than gridlock near the study area.
- As before: the queue-first left-turn model, the second eastbound lane on Ashby Ave, l1 and b13, the field checks of rounds 30 to 32, and stale stored proposal results, text pages and previews.

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

## Measurement corrections after round 42

The rebuilt Rockridge demand uses 731 vehicles per hour entering at the southern Telegraph Avenue gate and 549 leaving it in the PM peak. The volunteer route diagrams now compare with cars that drove the full length of the counted street. The earlier corridor range, derived from a representative block volume, has been retired. The training build keeps the same 86 held-out stations.

In one 60-minute PM run on seed 1, 75 of 92 recent fitted stations and 13 of 24 recent held-out stations passed GEH < 5. The shipped and training runs passed the assessment's input checks. Over minutes 10–60, the shipped run recorded 124 completed pedestrian crossings at Telegraph and Alcatraz, or 148.8 per hour. The training run recorded 141, or 169.2 per hour. Both demand files assign 150.49 crossings per hour there against 150.5 observed. Rockridge remains uncalibrated pending a multi-seed assessment. The previous round's results belong to its recorded inputs.

The decisions and verification are in [the measurement and assignment change](../../openspec/changes/archive/2026-11-17-repair-traffic-measurement-and-assignment/design.md).

## Older rounds

The thirtieth to thirty-third rounds are in `rockridge.record-archive-3.md`. The seventeenth to twenty-ninth rounds are in `rockridge.record-archive-2.md`. The eleventh to sixteenth rounds, the initial-loading note, the tenth round and everything before it (ninth to fourth, sixth, fifth, and the third-round history) are in `rockridge.record-archive.md`, moved unchanged.
