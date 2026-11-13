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

## Tenth round: drivers commit to a route (task 13)

User report: cars wander through the neighborhood instead of heading for an endpoint, Berkeley traffic cuts through the Trapezoid to SR-24, and College Ave traffic bypasses on Hillegass Ave. Every trip already had an origin and destination. In the code, every 60 s epoch 80% of en-route cars re-planned from the current link and took the result whatever the gain (the share was raised from 30% to 80% in steps I, N and U as a stabilizer for gridlock that later fixes removed). Runs: 60 minutes at scale 1.0, mean of seeds 1 to 3, same code with `--legacy-reroute` for "before" (the new binary with the old route choice), so the comparison is like for like and includes the signal phase fix. Reports in `reports/` are seed 1 of the new state. `public/data/*` is unchanged (no demand change).

### Measured first (step AZ, before any change)

Completed car trips, PM peak, mean of seeds 1 to 3: 1.05 route changes per trip, 43.8% of trips changed route at least once (gate-to-gate trips 1.5 per trip, 60%), mean detour ratio 1.117 against the shortest network distance, 9.8% of trips above 1.3, 0.3% above 2, 0.09% loops (same link twice or a node three times), 6.7% reversals (a link followed by its reverse within 200 m), 17.8% of study-area vehicle-miles driven by trips with a detour above 1.3. Midday: 0.76 changes per trip, detour 1.098, 7.1% above 1.3, 0.05% above 2, 0.07% loops, 7.2% reversals, 17.6%. AM: 0.83, 1.104, 7.9%, 0.15%, 0.08%, 6.3%, 16.6%.

What the metrics show: the switching was real (about one change per trip) but the detours were not caused by it. Detours above 1.3 are mostly trips to and from the freeway gates that take a faster, longer road than the shortest distance, and departure-time choices that avoid congestion (against the free-flow time-shortest route the mean detour is 1.05 in the PM, 1.03 midday, and 6.0% / 3.0% of trips are above 1.3). Most "reversals" are out-and-back moves over a short dead-end spur (for example 46th St at MLK Jr Way before the SR-24 on-ramp) that the shortest path itself uses, with a detour ratio of 1.0: a banned movement at the ramp junction, not a driver choice.

### Changes (step BA)

| Rule | Value | Source |
| --- | --- | --- |
| Guidance class: re-evaluates its route every 60 s epoch | 46% of drivers (`GUIDED_SHARE`, config `guidedShare`); the old flat 80% is gone | [Guin2021]: 46% used navigation apps on regular commute trips (74 to 78% on infrequent and first-time trips); transfer to local trips is an ASSUMPTION |
| Other drivers keep the departure route unless blocked | 54% | same |
| Indifference band: switch only if the alternative remaining route is cheaper by more than a relative fraction and an absolute floor | 20% and 30 s (`SWITCH_BAND`, `SWITCH_MIN_GAIN_S`, config `switchBand`) | mechanism [Mahmassani1987], [Srinivasan2000], [Di2016]; no value for neighborhood trips found ([Guin2021]: 3 to 5 min on commute trips), so ASSUMPTION |
| Same-footing comparison | both remaining routes costed link by link on current times with the driver's own noise (fixed per trip, `noise(seed, link)`) | design |
| No backtracking | no node of the alternative already on the trip (covers reversing onto the link just left and U-turns); lifted when the route is blocked | design |
| Switch cap and gap | 2 voluntary changes per trip, 120 s apart (`MAX_SWITCHES`, `MIN_SWITCH_GAP_S`) | ASSUMPTION |
| Blocked route | a closed link or banned movement on the remaining route (intervention), or a next link without room for 60 s (`BLOCKED_REROUTE_S`): re-plan at once whatever the class; in the second case the car takes the best route that starts with another link and does not return to the blocked junction | ASSUMPTION for the 60 s |
| Departure routing | unchanged: current measured link times | |

Local trip ends are nodes (the nearest residential node to the census block, `tools/build-demand.ts`) and a trip ends on first arrival at its destination node, so it cannot circle; the metrics show 0.0% loops for trips with a local end and detour ratios like those of gate-to-gate trips. No change was needed to the placement or the arrival rule.

### Before and after (mean of seeds 1 to 3; before = `--legacy-reroute`)

| Period | Switches per trip | Detour (mean) | > 1.3 | > 2 | Loops | Reversals | Study veh-miles by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PM before | 1.05 | 1.117 | 9.8% | 0.32% | 0.09% | 6.7% | 17.8% |
| PM after | 0.05 | 1.114 | 9.6% | 0.28% | 0.03% | 6.2% | 18.0% |
| AM before | 0.83 | 1.104 | 7.9% | 0.15% | 0.08% | 6.3% | 16.6% |
| AM after | 0.02 | 1.102 | 7.9% | 0.15% | 0.02% | 5.8% | 16.7% |
| Midday before | 0.76 | 1.098 | 7.1% | 0.05% | 0.07% | 7.2% | 17.6% |
| Midday after | 0.00 | 1.096 | 7.0% | 0.03% | 0.00% | 6.8% | 17.0% |

Route changes fell by 95% or more and loops by about 80%, but detour ratios did not move: the route a driver picks at departure, not the changes after it, sets the detour. If the user's cars still look aimless on the map, the remaining candidates are the departure choice with noise of 8% per link, the street-hierarchy factor 1.25 and congestion-driven choices.

### Stability (criterion D4) and speed

| Period | Completed trips (before / after) | Removals by seed (before; after) | Backlog by seed % (after) | Arterial speed m/s (before / after) |
| --- | --- | --- | --- | --- |
| PM | 20,039 / 19,745 | 2 / 3 / 0; 2 / 2 / 1 | 0.6 / 1.9 / 2.2 | 8.51 / 8.12 |
| AM | 17,785 / 17,634 | 0 / 0 / 0; 0 / 0 / 1 | 0.9 / 1.2 / 0.5 | 9.54 / 9.34 |
| Midday | 13,174 / 13,166 | 0 / 0 / 1; 0 / 0 / 0 | 0.0 | 10.17 / 10.06 |

120-minute PM run, seed 1 (before / after): removals 20 / 4, backlog 2.0% / 1.9%, speed 8.19 / 7.87 m/s, 42,992 / 42,908 completed. Fewer re-routing drivers cost about 1.5% of completed trips and 5% of arterial speed in the 60-minute PM runs. The first version of the blocked rule (re-plan from the current link) gave AM removals of 1 / 2 / 1; the removals sat on single links behind small junctions (Idaho St at 59th St, San Pablo Ave at 62nd St), where the stuck car re-planned to the same blocked next link. Taking the best route that starts with another link, and not one that returns to the blocked junction (a test with a dead-end gate showed that a car which left and came back only circled), changed that to 0 / 0 / 1 (PM 2 / 2 / 1 against 2 / 0 / 1). The re-route share was not raised and no demand scaling was added. Six PM seeds (1 to 6), measured with the first version of the blocked rule, before / after: mean backlog 1.3% / 1.45%, completed 20,122 / 19,816 (-1.5%), speed 8.55 / 8.18 m/s.

D4 per period (zero removals, backlog under 2%, speed above 4 m/s, all three seeds): PM fails in 3 of 3 seeds (removals, and backlog above 2% in seed 3), AM in 1 of 3, midday holds. Sim speed, PM peak seed 1 alone on one core: 27.2 s after, 29.7 s with the legacy rule, 28.6 s for the binary of the start of the round.

### Shares (PM, mean of seeds 1 to 3, before -> after; observed in brackets)

Headline: Hillegass Ave NB from the freeway 51 -> 57 (47), Colby St NB from 36 -> 44 (47), Hillegass Ave SB to 64 -> 65 (68), Colby St SB to 30 -> 37 (45). All four are within 10 points after (Hillegass NB at exactly +10); before, Colby St SB was 15 under. The seed range of one share is about 10 points, so these moves are near the noise. AM after 58 / 41 / 57 / 28 and midday 62 / 36 / 55 / 35 (observed values are the PM ones).
Ramp via-street shares, side-resolved, PM, before -> after (observed): onto the freeway via College Ave 12 -> 13 (16), Hillegass Ave 12 -> 13 (12), Martin St 15 -> 16 (10), Colby St 8 -> 8 (8), Telegraph Ave north of Alcatraz Ave 12 -> 11 (8), Benvenue Ave 5 -> 5 (5); from the freeway via College Ave 8 -> 10 (10), Martin St 16 -> 16 (10), Colby St 6 -> 7 (8), Hillegass Ave 4 -> 5 (5), Benvenue Ave 3 -> 3 (3).
Mid-block flows, PM, veh/h per direction, before -> after: Telegraph Ave N 1,012 -> 942, S 959 -> 986; College Ave N 259 -> 287, S 357 -> 376; Claremont Ave N 600 -> 616, S 506 -> 550; Alcatraz Ave E 498 -> 450, W 463 -> 482; Hillegass Ave N 36 -> 45, S 88 -> 106. Station fit and corridor ratios moved by less than the seed spread.

### The two reported patterns (diagnostics; no observed counterpart for either)

(a) Trips between the surface gates north of the ramps and the freeway mainline gates, local-street vehicle-miles: PM 3.9% of all local-street vehicle-miles to the freeway (1,116 trips) and 3.5% from it (1,328); AM 4.9% and 2.1%; midday 5.8% and 3.6%. Before: PM 3.5% and 3.0%. So Berkeley-to-freeway cut-through exists in the model and is a few percent of the miles on residential and service streets in the study area.
(b) Corridor trips (from beyond one end of the study-area extent of Hillegass Ave and College Ave to beyond the other, within 1.2 km), share using Hillegass Ave for at least 3 blocks / College Ave only: PM northbound 1.4% / 12.3% (1,015 trips), southbound 3.4% / 17.6% (1,086); before 0.7% / 11.2% and 2.5% / 16.4%. The rest (about 86% and 79%) use other streets or the freeway. Hillegass Ave carries 45 veh/h northbound and 106 southbound at mid-block, against 287 and 376 on College Ave. The StreetLight notes give related shares that the select-link table reports (NB Hillegass traffic ends on College Ave in 6% of trips observed; 21 to 33% jogs to Benvenue Ave; southbound freeway-bound drivers on College Ave arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave), but not the share of corridor trips that choose the bypass, so (b) has no observed value. The model shows little Hillegass Ave bypassing of College Ave; whether the real share is higher cannot be told from the figures available.

### What remains

- D4 still fails in the PM peak (all 3 seeds) and in one AM seed; D5 holds for the PM headline shares on the seed mean but not in every seed, and the status stays uncalibrated.
- Detour ratios did not change: reducing wandering after departure did not reduce detours. Route choice at departure (noise, hierarchy factor, congestion response) is untested for realism against GPS traces.
- The band (20%, 30 s), the cap, the gap and the 60 s blocked rule are assumptions; [Di2017] estimated bands could replace them once the paper's values are obtained.
- 6.2% reversal trips come from turnaround spurs at ramp junctions (banned movements); the importer or turn-ban data should be checked there.


## Ninth round: freeway-edge stubs, one count once, right turn on red, simulator-measured costs (task 12)

PM peak, scale 1.0, 60 min, mean of seeds 1 to 3 unless a row says otherwise. Steps AT to AY. Method: `data/demand/README.md` steps 22 to 25; generated fit report: `data/demand/rockridge.fit.md`; reports of seed 1 in `reports/`.

### The freeway edge (step AT)

What was wrong. The model box cuts SR-24 at its south and east ends where the carriageways fork or merge just outside it. At the west end the importer made three eastbound entry stubs (two 2-lane stubs 8 m apart that join one 4-lane link, and a 3-lane stub 33 m away that serves only the 52nd St and Martin Luther King Jr Way ramps), and three westbound exit gates: the 2-lane stub of the Claremont/Hudson and Miles Ave side (with a fork node 68 m up that was a gate only because the other branch of the fork was clipped), and the 3-lane stub of the 52nd St and MLK Jr Way side, 29 m from it. A trip to one exit stub could reach only the ramps on its branch, so the Claremont/Hudson on-ramp was the only way to the 689-side gate from the west side, and all 4,854 veh/h of the eastbound entries had no choice of ramps. The east end had the same pattern (two entry stubs, two exit stubs).

Fix (importer, general). Mainline gates of one direction whose links are all freeway class, with similar bearings and stub ends within `freewayGateMergeM` (80 m, single linkage), become one gate at their centroid; parallel stub links between the same two nodes become one link with the lanes added; a fork node that is a gate only because its other branch was clipped stops being one. Four merges on Rockridge (west entry 3 stubs to 1, west exit 2 to 1, east entry 2 to 1, east exit 2 to 1): 1,795 nodes and 4,478 links (1,800 and 4,480 before), 125 gates. The importer lists each merge and checks that every on-ramp reaches a mainline exit gate and every off-ramp is reachable from a mainline entry gate. The list is empty on Rockridge; a freeway-class link between two surface nodes (Glenwood Glade to Broadway Terrace) is a connector and not a ramp. Tests: `tools/import-osm.test.ts`, a synthetic fork (two exit stubs 26 m apart, one on-ramp onto each branch) and the Rockridge ramps.

Demand workaround. Kept, with a different reason. The per-ramp pools and the 300 s access decay were made because two stubs split the ramps. With one gate the merged west-end gates reach 9 (exit) and 10 (entry) ramps up to 4.5 km apart, so a gate pool would again mix distant ramps. A/B on the merged network (PM seeds 1 to 3, same fit otherwise): per-ramp pools removals 0 / 0 / 0, backlog 1.3 / 0.9 / 1.0%; per-gate pools 1 / 2 / 0 and 1.5 / 1.0 / 0.5%; the headline shares differ by 1 to 3 points. The decay (ASSUMPTION) was not re-tested.

### One count once (step AU)

The Caltrans AADT of Tunnel Road was both the count of the two Tunnel Road gates and an in-area station on links 3521 to 3523 (4 m from the station). The same held for San Pablo Ave (station at Stanford Ave, which also fed the 43rd St and San Pablo Ave gate pairs) and Claremont Ave, and for the turning-movement counts: the Alcatraz Ave W, Ward St N and Market St S gates took the leg volumes of the two in-model counted intersections, which are also stations. Every station now carries its source records (record and direction, with the share it takes); when a gate station and a link station carry the same record in the same direction, the link station stays (it measures every trip at that place) and the gate station goes, with a note in the fit report; the build stops if the shares of one record add to more than one. Unit test: `tools/station-records.test.ts`. 16 gate stations were dropped, leaving 50 stations in each period (66 before); the gates keep the record as their offered volume. PM: 46 of 50 stations within 15% (63 of 66 before). The Caldecott Lane on-ramp (+80%) is still pinned at the lower bound; the Tunnel Road gate pair is no longer a station, and the Tunnel Road link station ends at 0.94 of its count.

### Right turn on red (step AV)

The simulator did not model it: at a red a car could not move at all (`permission`, signal branch). It is now allowed for a car that has stood at the line for the stop dwell (1 s, ASSUMPTION), whose next movement is a right turn, when no conflicting vehicle is in the node and no vehicle on a green approach would reach the conflict point within the minor-right critical gap (6.2 s, [Brilon1999] as in the stop-controlled cases e1 to e3); it yields to every conflicting movement. California allows the turn; the legal text (Vehicle Code 21453) could not be read here (the host is outside the session's allowed network), so the permission is an ASSUMPTION, at every signal, and no sign prohibitions are known. Note, 2026-11-13: the section was later read and verified in part (see [CVC21453]); the 2010 enrolled text allows the turn after a stop, but the current wording is unread. `calibrate --no-rtor` and `Config::no_right_turn_on_red` turn it off. Validation cases b10 (light cross traffic: discharge 1.15 times the no-turn-on-red discharge, range 1.09 to 1.24 from the red share and 3600 / tf with tf 3.3 s) and b11 (saturated cross street: 1.14, range 0.95 to 1.15, the turn gets no gap) pass; b7 and b8 (right-turners with a saturated cross street) are unchanged. The golden metrics of the signalized cross (right-turning flow) moved: mean delay 13.4 to 13.1 s.

PM, old network and demand of the eighth round, seeds 1 to 3: with the rule removals 1 / 1 / 4 against 5 / 5 / 4, backlog 1.2 / 1.5 / 2.2% against 2.8%, arterial speed 8.0 against 7.45 m/s. On the new network and demand: with the rule 1 / 0 / 1 removals, backlog 1.5 / 0.9 / 1.5%, speed 8.73; without it 3 / 14 / 1, 1.6 / 1.9 / 1.4%, speed 8.09. The merge alone (no rule) changes backlog from 2.8% to 1.6% and does not change removals beyond the seed spread.

### The 52nd St/Shattuck Ave queue (step AW)

Where the queue is. After the merge and the rule the entry backlog is 144 trips at the merged west-end entry gate (615, offered 4,854 veh/h) and 174 at the San Pablo Ave west gate; the freeway stubs pass 4,605 veh/h. The 52nd St off-ramp (link 4219, 2 lanes, 513 m) still carries 554 to 609 veh/h against its count of 1,278, while the MLK Jr Way ramp carries 1,592 to 1,606 of 1,656: trips from the merged gate now choose the cheaper ramp, so the ramp split in the simulator differs from the one the static assignment fitted. The router makes that choice; no queue on the ramp explains it. The queue at the junction behind the ramp: the ramp (3 lanes after the 7 m link at node 740, where it merges with 52nd St from the west) feeds the 52nd St approach of the signal 52nd St/Shattuck Ave (node 693, 4 lanes, 53 m, 1 left lane), which holds 9.7 stopped vehicles and passes 740 veh/h. Geometry from OSM: that approach has 4 lanes, 3 on the exit; Shattuck Ave has 2 lanes on each approach and 1 lane out to the north.

Signal plan. Phases (from `signal_plans()` and the new phase listing in the report): 52nd St both approaches 23 s, Shattuck Ave both approaches 42 s, cycle 75 s. The adaptive plan sizes a phase from the flow measured at the stop line plus the growth of the standing queue, and followed the queue upstream only along a single feeding link. Here the feeder of the approach is the 7 m link from the ramp merge, which has two feeders, so the ramp's standing vehicles were not demand for the signal. `standing_queue` now counts the standing vehicles of every link feeding an unsignalized merge that the queue has reached (up to 3 links upstream). The plan becomes 35 s for 52nd St and 30 s for Shattuck Ave, the approach passes 766 veh/h and the 52nd St ramp 609. PM seeds 1 to 3 with the change: removals 0 / 0 / 0, backlog 1.3 / 0.9 / 1.0%, against 1 / 0 / 1 and 1.5 / 0.9 / 1.5% without it; this is inside the seed spread and the change is kept because the plan is now sized from the demand that is waiting. The one removal that remained without it was at 60th St/Herzog St (all-way stop, far west, local streets), seeds 1 and 3, at 49 and 56 minutes.

Counted ramp volume against the surface. The 52nd St ramp count (1,278 veh/h) plus the MLK Jr Way ramp (1,656) is 2,934 veh/h, and the two ramps together carry 2,200 to 2,215 in the simulator, 75% of it. The counted surface volumes at the corridor (Telegraph Ave 0.90 N and 1.16 S of its expected peak flow) do not show a shortfall at the junction. Where the other 25% leave the freeway was not traced.

### Select-link volumes: assignment against simulator (step AX)

Seed 1, PM, current demand; select-link records of the simulator (`calibrate --select-od`) against the static assignment's volumes on the same blocks (`ASSIGN_DUMP` and `ASSIGN_LINKS` in `build-demand.ts`). Trips counted by the simulator over the run, volumes in veh/h for the assignment.

| Block | Simulator trips | Assignment veh/h | Ratio | Freeway-end share, simulator / assignment | OD pairs in common (volume) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Ave NB | 91 | 63 | 1.4 | 58% / 47% | 47% |
| Colby St NB | 82 | 51 | 1.6 | 37% / 55% | 38% |
| Hillegass Ave SB | 141 | 85 | 1.7 | 69% / 77% | 58% |
| Colby St SB | 158 | 46 | 3.4 | 22% / 61% | 35% |

Before (eighth round): the assignment put 2 to 11 times less on these blocks. The gap closed before the loop below ran: with right turn on red and the merged gate the arterials flow, so fewer drivers leave them for local streets, and the offered table changed with the dedupe. What is left: the simulator's trips on Colby St SB are mostly interior (22% freeway end against 61% in the assignment): drivers from the Telegraph Ave/Ward St side (node 964, 14% of the block's trips) and from the Claremont Ave gate use it, which the assignment gives to the arterials; cost differences of a few seconds decide it in the simulator and the 8% per-driver noise does not reproduce it. Martin St from the freeway: 12% modeled against 10% observed (22 before).

### Cost loop (step AY)

`tools/cost-loop.ts`: simulate (fixed seed 1, all periods, in parallel) -> mean delay per vehicle on every link after the warm-up (`linkMeanDelayS`) -> `data/demand/rockridge.linkdelays.json` (50 KB) -> rebuild demand (the assignment adds the delay, less the control delay the router already adds at the link end, to the free-flow cost; BPR off) -> simulate. `--evaluate` scores PM seeds 1 to 3 after each iteration and stops when the headline-share error stops improving by 0.5 points. Without the binary it skips with a message.

| Iteration | Headline share error (mean abs, points) | PM removals | Backlog |
| --- | --- | --- | --- |
| 0, free-flow and BPR costs | 12.6 | 0.0 | 1.1% |
| 1, measured delays | 9.9 | 4.7 | 0.6% |
| 2, measured delays again | 15.1 | 4.7 | 1.6% |

The loop does not converge (error 12.6, 9.9, 15.1) and iteration 1 gives back stability (removals 0 to 4.7 an hour), so the shipped demand is iteration 0 and the delays file is not kept. The mechanism stays in the build for the next round: it is off when the file is absent. The cause of the lost stability was not traced (the table moves trips toward links that were fast in the previous run, which the next run then loads).

### Staggered T-junctions (step AZ)

Done last, on the lead's instruction, and every number in this section and below is on the resulting network. Two T-junctions on an undivided street are one node when the side-street legs carry the same name, leave on opposite sides and the junction points are within `staggeredJoinRadius` (35 m) along the street. Colby St/62nd St (nodes 804 and 1095, 29 m) is now one node with two Colby St and two 62nd St legs. 14 pairs join across the model: the five at or next to the study area are Alcatraz Ave/Colby St, 62nd St/Colby St, Ayala Ave/Martin St, 60th St/Howell St and Howell St/McAuley St; the others are 411 m or more away (62nd St/Shattuck Ave, Chabot Rd/Ross St, 61st St/Dover St, Piedmont Ave/Stuart St, Harper St/Woolsey St, Margarido Dr/Ocean View Dr, Russell St/Stanton St, Ashby Ave/Stanton St, Ashby Ave/Dohr St). Network: 1,781 nodes and 4,450 links (1,795 and 4,478 before), study area 69 nodes and 197 links (74 and 207). Tests in `tools/import-osm.test.ts`: Colby St/62nd St has four legs; the same offset with different side-street names, and the same name at 60 m, are not joined.

The step moved the PM peak back: the numbers of the steps above (written on the network before it) are in the sections they belong to; the table below is the final state.

### Final state, scale 1.0, mean of seeds 1 to 3 (seed 1 reports in `reports/`)

| Period | Offered veh/h | Completed (eighth round) | Removals (eighth round; seeds) | Backlog (eighth round) | Arterial speed m/s (eighth round) | D4 |
| --- | --- | --- | --- | --- | --- | --- |
| PM peak | 23,667 | 20,117 (19,098) | 0.3 (4.7; 1 / 0 / 0) | 1.5% (2.8%) | 8.76 (7.45) | fails in 2 of 3 seeds (a removal in seed 1, backlog 2.0% in seed 3) |
| AM peak | 20,315 | 17,863 (17,459) | 0.3 (0.7; 0 / 0 / 1) | 0.2% (0.6%) | 9.73 (8.38) | fails in 1 of 3 seeds (one removal) |
| Midday | 14,884 | 13,209 (13,361) | 0 (0; 0 / 0 / 0) | 0.0% (0.0%) | 10.38 (9.40) | holds in 3 of 3 |

Before the staggered join (same code otherwise) D4 held in 3 of 3 seeds in every period (PM removals 0 / 0 / 0, backlog 1.1%; AM and midday 0). The join removes 14 nodes and moved the PM demand fit (23,666 offered after the guard, 46 stations within 15% in the PM peak instead of 46 before; 42 and 44 in the other periods); the PM removal in seed 1 is at 52nd St/Shattuck Ave (link 1722), and the backlog at the merged west-end gate is 231 to 240 trips and at the San Pablo Ave west gate 116 to 195. The change is requested, so it is kept; the difference to the previous state is inside the spread this regime shows (one removal, or 0.2 points of backlog, decides D4), and it was not tuned away.

120-minute PM run (seed 1): vehicles in the network 3,171 at 60 min and 3,197 at 120, arterial speed 8.71 then 8.54 m/s, 1 removal in each hour, entry backlog 389 then 1,192 trips (2.6% of 46,205 spawned): 648 at the merged west-end entry gate (offered 4,842 veh/h) and 466 at the San Pablo Ave west gate (1,376 veh/h). Before the eighth round's fixes: 4,319 and 5,261 vehicles, 31 removals, 1,890 waiting.

Headline freeway shares, PM, modeled (observed; eighth round): Hillegass Ave NB from the freeway 57 (47; 59), Colby St NB from 42 (47; 33), Hillegass Ave SB to 65 (68; 59), Colby St SB to 27 (45; 27). Three of four within 10 points (Hillegass Ave NB is +10); mean absolute error 9 points (13 before). AM 65 / 38 / 56 / 23 and midday 62 / 32 / 54 / 25 (observed values are the PM ones). Ramp via-street shares, PM, north-side trips, modeled / observed: onto the freeway via College Ave 16 / 16, Hillegass Ave 13 / 12, Martin St 7 / 10, Colby St 6 / 8, Telegraph Ave north of Alcatraz Ave 11 / 8, Benvenue Ave 4 / 5; from the freeway via College Ave 7 / 10, Martin St 10 / 10, Colby St 4 / 8, Hillegass Ave 4 / 5, Benvenue Ave 2 / 3. All within 5 points. D5 (all four headline shares within 10 points) fails on Colby St SB (-18), so the status stays `uncalibrated`. `experimentalPeriods` is the PM peak (D4 fails in 2 of 3 seeds); `defaultPeriod` is midday.

Corridor flows, PM, per direction, mean of seeds 1 to 3 over the expected peak flow: Telegraph Ave N 1,012 / 1,093 = 0.93, S 936 / 910 = 1.03; Alcatraz Ave E 490 / 618 = 0.79, W 459 / 521 = 0.88; Claremont Ave N 623 / 635 = 0.98, S 614 / 635 = 0.97; College Ave N 241 / 540 = 0.45, S 376 / 540 = 0.70. Station fit (static assignment): 46 of 50 PM stations within 15%.

Validation suite: 45 of 58 cases pass; the 13 outside their ranges are the known deviations (a3, b9, c2, e2, e3, e6, e9, f2, f3, j6, j8, j9, j12), none new. b10 and b11 are new.

### What remains off (ninth round)

- D4: the PM peak fails in 2 of 3 seeds by one removal or by 0.04 points of backlog; AM has one removal in one seed.
- D5: Colby St SB to the freeway is 27% against 45% (-18). The simulator uses Colby St SB for interior trips that the static assignment keeps on the arterials; the measured-delay loop did not fix this.
- Entry backlog at two gates in a long peak: the merged SR-24 west-end gate (4,854 veh/h offered) and the San Pablo Ave west gate (1,417 veh/h), about 400 trips an hour in the second hour of a 120-minute run.
- The 52nd St ramp carries 0.43 to 0.48 of its count in the simulator, the MLK Jr Way ramp 0.97: both ramps are reachable from the one gate now and drivers choose by cost.
- Right turn on red is an ASSUMPTION at every signal; the legal basis and sign prohibitions (OSM has none read here) were not checked. The merge threshold (80 m), the stop dwell (1 s), the merge rule's 0.85 and the access decay of 300 s are ASSUMPTION values.
- College Ave north is at 0.41 of its expected flow (0.27 to 0.51 in the other periods).

## Eighth round: fit convergence, route shares, restrained assignment, ramp pools (task 11)

The seventh round made the baseline far more stable (PM removals 88 to 8.7 an hour) but the observed route shares fit worse, the fit never converged and a few stations stayed off. This round fixes the fit, adds the shares to it, makes the static assignment resemble the simulator, and traces the two network mechanisms. Method and settings: `data/demand/README.md` steps 17 to 21; the generated fit report is `data/demand/rockridge.fit.md`; the resolved shares come from `data/calibration/rockridge.targets.json`.

### Fit defects (step AN)

Why 400 iterations were not enough. The stopping test needed every station within 1%, and three PM stations cannot be met together: the Caldecott Lane on-ramp (node 1745, 61 veh/h counted, 132 assigned) and the two Tunnel Road gates (1,094 counted, 807 assigned). The flows from the Tunnel Road gates to the west take Tunnel Road, Caldecott Lane, that on-ramp and SR-24 to the Telegraph Ave off-ramp as their cheapest route; 59 of the 75 flows from gate 1751 sit at the lower bound because the ramp count leaves no room for them. With the capacity guard on, the loop also had no tolerance exit at all. Once those stations are set aside the worst error falls under 10% in about 50 iterations and then creeps: pairs such as Alcatraz Ave north leg entering (1,064) and south leg leaving (910) share 95% of their flow while their targets differ by 16%, so both end about 7% off however long the loop runs (it stops moving at 970 iterations with 7.0%). Damping 2 reaches the iteration limit with the worst error still falling, damping 3 oscillates without converging (log error 2.9 throughout) and damping 0.7 only slows it, so the update keeps damping 1.

Rule now (`tools/lib/fit-counts.ts`): the loop stops when every count station that can still move is within 1% and the volume-weighted step of the flows is under 0.1%, or when the worst error of those stations improves by less than 0.2 points in 25 iterations, or when nothing moves. A station is set aside when the flows it would need to move sit on the bound (80% of its volume), or when the stations that pull its flows the other way, with the guard, account for at least half of its shortfall. Each such station is listed with those stations. Result: 114 (PM), 117 (AM) and 96 (midday) iterations, every period stopped by tolerance, worst error of the remaining stations 1.0%, 0.7% and 0.8%. Stations within 15%: 63 of 66 in the PM peak (26 before the fit). The three left are the Caldecott Lane on-ramp (+117%), the Tunnel Road gate pair (-26%) and Market St/55th St west leg entering (+24%, against its east leg leaving). The PM table of stations that cannot be met is in `rockridge.fit.md`.

The gates. The premise that each Tunnel Road gate took the whole station count does not hold in the data: the build already gives each gate half (547 of 1,094 entering; `streetGroupSize`), and the two halves equal the Caltrans station target on link 3523. What is counted twice is the Caltrans AADT itself, as a gate target and as an in-area station, for Tunnel Road, San Pablo Ave and Claremont Ave. Gates that split one count are now one station on the group's trips (`gate group 1580`, `gate group 179`, `gate group 74`), so the fit may move volume between them. The 0.69 comes from the Caldecott Lane on-ramp conflict above, and the pair now ends at 0.74 (PM). The double use of the AADT is not resolved: it shows up as the San Pablo Ave station (-13%) against its gates (+5%).

Flows at the lower bound. 2,742 of the PM flows (35%) end at 0.1, 7,959 of the 24,230 veh/h offered on counted flows: ramp flows 26% of their volume, through 38%, local 34%. Their mean size is 2.9 veh/h and 69% are under 2 veh/h, so they are the thin tail of the OD table on corridors where the counts leave no room.

### Observed route shares as constraints (step AO)

Each headline select-link share and each Claremont ramp via-street share is a ratio constraint over assigned flows (`tools/lib/share-targets.ts`), weight 0.5 against 1 to 2 for the counts. Flows in the numerator get the factor (target / modeled)^w and the rest of the denominator ((1 - target) / (1 - modeled))^w in the same geometric-mean update as the counts. In the static assignment all 15 shares end within 5 points of their targets in every period (most within 2), and 63 of 66 PM stations stay within 15%.

Definitions. The ramp shares in the targets file are for trips from (to) the north of the ramps, and "Telegraph Avenue north of Alcatraz Avenue" names part of Telegraph Ave. The report counted every trip on the ramps and any visit to any Telegraph link, which is why 56% looked so far off. `freewayRamp.side` in the targets file and the qualifier now drive both the report (`modelledSide`) and the constraints. On the same simulator run the Telegraph figure goes from 54% (all trips, any Telegraph) to 39% (north-side trips, north of Alcatraz Ave only).

With and without the shares (PM, seeds 1 to 3, same demand otherwise, simulator): removals 5 / 5 / 4 against 8 / 2 / 6, backlog 2.8% against 2.4%, completed 19,098 against 19,258. Headline shares 59 / 33 / 59 / 27 with them against 67 / 29 / 61 / 24 without. Ramp via-street shares on the north-side trips, with and without (observed): onto the freeway via College Ave 15 / 15 (16), Hillegass Ave 15 / 23 (12), Martin St 5 / 22 (10), Colby St 9 / 23 (8), Telegraph Ave north of Alcatraz Ave 5 / 54 (8), Benvenue Ave 6 / 3 (5). The shares do not cost stability beyond the seed spread.

### Assignment against the simulator (step AQ)

The simulator's drivers choose at every node the movement with the least (movement cost + cost-to-go) x a fixed per-driver factor of 1 +/- 8% on the candidate link, and re-route on live costs. The old static assignment perturbed every link cost by 8%, which averages out along a path, and used free-flow costs. `assignMsa` (`tools/lib/assign.ts`) now loads each flow with driver walks of the same rule (cost-to-go per destination, factor per candidate link, a looping walk falls back to the shortest path) and averages 10 passes over link costs times the BPR function of volume over capacity, with the validation suite's capacities (method of successive averages [PowellSheffi1982]; BPR form [Spiess1990]; alpha 0.15 and beta 4 are ASSUMPTION). Twice, the table is refitted and reassigned at its own volumes. The average link-volume change of the last pass is 1.2%.

Agreement with the PM seed 1 run of the same demand (links the simulator loads with at least 300 veh/h, 838 of them, volumes scaled to the same total): correlation 0.65 before and 0.70 after, mean absolute difference 0.34 and 0.27 of the simulated volume, rms of the log ratio 0.80 and 0.43. Over the 15 route shares the mean distance between assignment and simulator is 15.7 points before and 6.7 after. Median volume per link on four corridors, assigned / simulated, before: Telegraph Ave N 424 / 520, S 1,122 / 599, Ashby Ave E 759 / 554, Claremont Ave N 688 / 439; after: 808 / 496, 735 / 668, 568 / 554, 689 / 439 (the link sets differ between the two assignments). The assignment still puts far less on the select-link blocks than the simulator carries: Hillegass Ave NB 21 and 31 veh/h per link against 55, Colby St NB 8 and 15 against 40, Hillegass Ave SB 30 and 43 against 180, Colby St SB 9 and 13 against 143. The simulator's drivers find these residential blocks as the arterials fill up, which a link-cost assignment at a fixed table does not do; the shares are constrained, the volumes are not.

Settings tried on the demand of the previous round (seed 1): walk noise of 15% and 25% made both agreements worse; a BPR alpha of 0.5 or 1.0 moved them by less than 0.03. 10 passes of 2 walks at alpha 0.15 and 8% noise were kept.

### Telegraph Ave on the Claremont on-ramp, and the ramp pools (step AP)

Mechanism, from the importer's freeway graph. The west end of SR-24 westbound is cut at the extract edge into two stubs 51 m apart: the Claremont/Hudson on-ramp, the Miles Ave on-ramp and the Broadway Terrace and Caldecott ramps reach the mainline gate at node 689 (link 4225, 4 lanes, to 688 then 689), and the 52nd St and MLK Jr Way on-ramps reach the gate at node 699 (link 4226 to 698, then 699). OSM carries them as separate ways (10712862 and 25007063 on the 52nd St side), 51 m apart at the box edge. A trip to gate 689 can therefore use only the Claremont/Hudson ramp (or Miles and the east ramps), never the 52nd St or MLK ramps that are next to the Telegraph Ave corridor. Gate 689 takes 1,147 veh/h in the PM peak; 59% of those trips start west of Telegraph Ave and 52nd St and 50% at surface gates, and they cross the area to reach Claremont Ave (routes such as Alcatraz Ave, Telegraph Ave, McAuley St, Howell St, Ayala Ave, Martin St, Claremont Ave). The builder made this worse: ramp trips were drawn once per mainline gate with a direction term averaged over every ramp the gate reaches and no distance term, so ramps 3 km apart shared one pool.

What was changed. Ramp trips are drawn per ramp, with that ramp's DATA volume and bearing and an access decay exp(-t / 300 s) of the router's generalized cost from the surface end to the ramp (`ramps.destination.pooling` and `accessTauS`; 150 and 600 s were tried with the same assignment, seeds 1 and 2: removals 2 and 1 at 150 s, 2 and 11 at 600 s, backlog 3.2 and 4.2% at 150 s, 2.7 and 3.0% at 600 s, against 3 and 1 removals and 1.9 and 2.5% at 300 s). This alone did not move the Telegraph share (54% of north-side trips with the pools and no share constraint). The constraints do (5% against 8% observed), by cutting the thin flows from the Telegraph corridor to gate 689. What is left is the split west end: merging the two stubs in the importer (nodes within 100 m on the same carriageway) would let those trips use the 52nd St ramp that is next to them, and is the fix that removes the cause. It is not done here: it renumbers nodes and links of the published network.

### The 52nd St off-ramp, the SR-24 west-end stub and the merge rule (step AR)

Lane counts checked against OSM (`data/osm/rockridge.overpass.json`): the stub (way 76790391, 3 lanes, `turn:lanes` slight_left | slight_left;slight_right | slight_right), the 52nd St branch (1338274818, 2 lanes), the MLK Jr Way branch (76790416, 2 lanes, then 393902218, 1 lane), the west-bound ramps (10712862, 2 lanes; 10714305, 1 lane; 292336809, 2 lanes) all match the network. Trips for different branches do share the stub's lanes (the simulator picks the lane with most room when both branches are through-class), so a queue on one could hold the other. A lane choice by branch, tried and reverted, changed nothing measurable (stub 2,213 to 2,279 veh/h, 52nd St ramp 709 to 682). Run alone, the 2,934 veh/h of gate 1769 pass the stub without backlog (2,970 veh/h) and the 52nd St ramp carries 1,474 against its count of 1,278 and the MLK Jr Way ramp 1,525 against 1,656. So the primitives are not the limit; the surface demand sharing the junctions behind the ramps is.

Where the 52nd St ramp loses its volume. The ramp (link 4221, 513 m) holds 31 to 44 stopped vehicles on average. At its end node 742 it merges with 52nd St from the west (link 1697) onto the three-lane 52nd St link, and the simulator let the two streams cross one vehicle at a time (a merge onto the same exit blocked until the node was empty): 863 veh/h through the node in the PM run, which is the ramp's 709 plus 154 from the west. Merges onto a multilane exit now keep a time gap only (fraction 0.85 of the path, ASSUMPTION; single-lane exits keep the full block). Two saturated single-lane approaches onto a 2-lane exit pass 1,680 veh/h against 1,254 (validation case i4, unit test `merge_onto_a_multilane_exit_passes_more_than_onto_a_single_lane`). On the demand of step AQ, PM seeds 1 to 3: removals 9 / 2 / 6 to 3 / 1 / 3, backlog 3.3 / 3.8 / 4.6% to 1.9 / 2.5 / 1.9%, completed 18,624 to 19,160, ramp 4221 625 to 797 veh/h, MLK Jr Way branch 1,230 to 1,523.

On the final demand the 52nd St ramp discharges 521 of 1,278 (0.41) in seed 1 and the MLK Jr Way ramp 1,576 of 1,656 (0.95). The queue is behind the 52nd St/Shattuck Ave signal (node 694, 75 s cycle, 34 s and 31 s phases): the 52nd St approach (link 1690) discharges 714 veh/h against 1,704 assigned and holds 12 stopped vehicles, and the queue reaches the merge. 55th St/MLK Jr Way (node 343, 3.0 blocked lane-hours) is the next signal of the cluster. Gate 1769 offers 2,934 veh/h, the stub passes 2,098 and 611 trips are waiting at the end of the hour.

### Final state, scale 1.0, mean of seeds 1 to 3 (seed 1 reports in `reports/`)

| Period | Offered veh/h | Completed (before) | Removals (before; seeds) | Backlog (before) | Arterial speed m/s (before) | D4 |
| --- | --- | --- | --- | --- | --- | --- |
| PM peak | 24,079 | 19,098 (18,245) | 4.7 (8.7; 5 / 5 / 4) | 2.8% (3.3%) | 7.45 (7.28) | fails in 3 of 3 seeds |
| AM peak | 20,594 | 17,459 (16,533) | 0.7 (3.3; 0 / 1 / 1) | 0.6% (1.4%) | 8.38 (7.81) | fails in 2 of 3 seeds (one removal each) |
| Midday | 15,301 | 13,361 (13,237) | 0 (0.3; 0 / 0 / 0) | 0.0% (0.0%) | 9.40 (9.00) | holds in 3 of 3 |

The intermediate configuration of step AR (loops in the walks dropped, the earlier stopping rule) had PM removals 3 / 1 / 3 and backlog 2.1% against 5 / 5 / 4 and 2.8% here. That difference is about the seed spread of this regime (one seed ranges over 2 to 13), and the final configuration is the one with the principled fixes, so it is kept.

120-minute PM run (scale 1.0, seed 1): vehicles in the network 4,319 at 60 min and 5,261 at 120, arterial speed 7.05 then 6.34 m/s (6.14 over the last 15 minutes), removals 5 in the first hour and 26 in the second (31 in all), entry backlog 699 then 1,890 trips, 1,725 of them (91%) at gate 1769. Before: 657 then 1,966 and 37 removals. The unserved demand at the west-end gate grows by about 1,200 trips an hour as before.

Headline freeway shares, PM, modeled (observed; before in brackets): Hillegass Ave NB from the freeway 59 (47; 75), Colby St NB from 33 (47; 42), Hillegass Ave SB to 59 (68; 53), Colby St SB to 27 (45; 21). One of four within 10 points (Hillegass Ave SB, -9), as before; the mean absolute error is 13 points (18 before). AM 63 / 42 / 49 / 18 and midday 54 / 37 / 41 / 14 (observed values are the PM ones). Ramp via-street shares, PM, north-side trips, modeled / observed: onto the freeway via College Ave 15 / 16, Hillegass Ave 15 / 12, Martin St 5 / 10, Colby St 9 / 8, Telegraph Ave north of Alcatraz Ave 5 / 8, Benvenue Ave 6 / 5; from the freeway via College Ave 9 / 10, Martin St 22 / 10, Colby St 9 / 8, Hillegass Ave 8 / 5, Benvenue Ave 4 / 3. On the old definition (all trips on the ramps, any Telegraph link) Telegraph Ave is 29% (56% before). D5 does not hold, so the status stays `uncalibrated`.

Corridor flows, PM, per direction, mean of seeds 1 to 3 over the expected peak flow (before in brackets): Telegraph Ave N 912 / 1,093 = 0.83 (0.86), S 858 / 910 = 0.94 (0.83); Alcatraz Ave E 523 / 618 = 0.85 (0.68), W 392 / 521 = 0.75 (0.80); Claremont Ave N 484 / 635 = 0.76 (0.66), S 615 / 635 = 0.97 (1.11); College Ave N 292 / 540 = 0.54 (0.71), S 371 / 540 = 0.69 (1.00).

### What remains off (eighth round)

- D4: PM 4.7 removals and 2.8% backlog; AM one removal in two of three seeds; midday holds. The PM shortfall is at the SR-24 west end: 611 to 700 trips are waiting at gate 1769 after an hour, and the 52nd St ramp discharges 0.4 to 0.6 of its count because of the 52nd St/Shattuck Ave signal behind it.
- D5: one of four headline shares within 10 points. Colby St NB (-14) and SB (-18) and Hillegass Ave NB (+12) stay off although the static assignment meets all of them, because the simulator's drivers use the blocks differently from the assignment (volumes 2 to 11 times higher on the blocks).
- The two west-end stubs of SR-24 westbound (nodes 689 and 699) are one carriageway in reality. Merging them in the importer would let trips from the Telegraph Ave corridor use the 52nd St ramp.
- The Caltrans AADT of Tunnel Road, San Pablo Ave and Claremont Ave is a target twice (gates and in-area stations). The Caldecott Lane on-ramp (+117%) and the Tunnel Road gate pair (-26%) stay in conflict.
- The merge rule's 0.85 and the access decay of 300 s are ASSUMPTION values.

## Seventh round: count-constrained demand (task 10)

Step AM. The sixth round left the capacities in published ranges but 40% of the PM trips unable to complete (13,885 of 24,500 offered, mean of seeds 1 to 3, 88 removals, 5.1% backlog). The counted corridors already carried roughly their counts in the simulator (0.54 to 1.32), so the extra travel sat on links with no count, or in ramp trips aimed at a few ramps. The builder had fitted volumes at the gates only. It now assigns every car flow to its free-flow shortest path with the router's cost, expresses each count as a target on directed links or on a gate's generated and absorbed trips, and scales flows by multiplicative proportional updating ([VanZuylen1980], [Willumsen1981]; update rule ours). Method, parameters and the DATA or ASSUMPTION status of each step: `data/demand/README.md`, steps 12 to 16. The generated fit report is `data/demand/rockridge.fit.md`.

### Demand before and after (car trips, veh/h)

| Period | Offered before | After count fit | Final (after guard) | Through | Local | Ramp |
| --- | --- | --- | --- | --- | --- | --- |
| PM peak | 25,462 | 24,891 | 23,524 | 10,113 to 8,289 | 2,282 to 2,096 | 13,068 to 13,140 |
| AM peak | 20,602 | 20,859 | 20,341 | 7,155 to 6,651 | 2,340 to 2,334 | 11,108 to 11,357 |
| Midday | 16,010 | 15,499 | 15,282 | 6,390 to 5,640 | 1,517 to 1,554 | 8,102 to 8,088 |

The count fit alone changes the total by -2% (PM), +1% (AM) and -3% (midday), because the ramp counts fix 13,000 of the PM trips and the fit moves ramp trips between destinations rather than removing them. Most of the removal in the PM peak is through trips (-18%) and comes from the capacity guard (1,367 of the 1,938 veh/h removed; 233 of them from flows that touch no count). Pedestrian and bicycle flows are unchanged.

Station fit (69 stations per period, targets from DATA, AM and midday targets are the PM counts times the period factors, ASSUMPTION): within 15% of the target before the fit 28, after it 66 in each period. By family, PM peak, final volume over target: Caltrans stations 0.99, gates entering 0.94 and leaving 0.99, ramps off 1.00 and on 1.01 (aggregate; 10 of 10 off-ramps and 10 of 12 on-ramps within 5%), turning-movement legs 0.99. Outside their own tolerance in the PM peak: the two Tunnel Road gates entering (0.69 and 0.68), the on-ramp at node 1588 (Broadway Terrace, 0.94 of 218) and the on-ramp at node 1745 (Caldecott Lane, 2.2 times 61 veh/h). The Tunnel Road gates give way because the build gives each of the two the whole Caltrans station ADT (27,000 at Domingo Ave, inside the model area), which counts the street twice; the station keeps its count. Flows at the bounds (PM): 2,238 of 6,642 counted flows at the lower bound 0.1 and 461 at the upper bound (3 for through and local, 10 for ramp); 1,287 flows touch no count and take the volume-weighted median factor of their type (PM: through 0.42, local 0.71, ramp 0.41). The fit stops at the iteration limit of 400 in every period because the counts conflict wherever the router sends many ramp trips to one ramp. The guard bound 27 links in the PM (all-way stops on Adeline St, Arlington Ave, Market St and Claremont Ave; signals on Shattuck Ave and Alcatraz Ave; the 43rd St circle); 19 uncounted links stay above their limit after the fit because counted flows use them.

Static against simulated link volumes (PM, seed 1, links with at least 300 veh/h assigned, no motorways): correlation 0.63, median simulated over assigned 0.77 (AM 0.57 and 0.76, midday 0.63 and 0.78). The assignment is free-flow and all trips are counted in it, while the simulator measures exits per hour of a run that still has vehicles in the network, so the ratio is below 1; the correlation says the assignment orders the links roughly right and no more.

### Simulator, scale 1.0, mean of seeds 1 to 3 (seed 1 reports in `reports/`)

| Period | Offered veh/h (before to after) | Completed trips (before to after) | Removals per seed (before to after) | Backlog (before to after) | Arterial speed m/s (before to after) | Stable (D4) |
| --- | --- | --- | --- | --- | --- | --- |
| PM peak | 25,462 to 23,524 | 13,885 to 18,245 | 99 / 77 / 87 to 10 / 7 / 9 | 5.1% to 3.3% | 4.82 to 7.28 | no (removals, backlog) |
| AM peak | 20,602 to 20,341 | 14,198 to 16,533 | 17 / 37 / 41 to 5 / 0 / 5 | 1.2% to 1.4% | 6.19 to 7.81 | no (removals in two of three seeds) |
| Midday | 16,010 to 15,282 | 12,670 to 13,237 | 8 / 8 / 8 to 0 / 0 / 1 | 0.0% to 0.0% | 7.83 to 9.00 | no (one removal in seed 3; seeds 4 to 6: 0 / 0 / 1) |

The PM peak completes 31% more trips with 90% fewer removals. Period status used for the area manifest: a period is experimental when D4 fails in at least half the seeds run, so the PM and AM peaks are experimental and midday (D4 fails in 2 of 6 seeds, each time by one removal) is the default period. The area stays `uncalibrated`.

Demand scale at which D4 holds (zero removals in all three seeds, backlog under 2%, speed above 4 m/s): PM 0.6 (14,115 veh/h offered; 0.7 has one removal in seed 3, 0.8 two in seed 2, 0.9 three, one and none with 1.7% backlog), AM 0.8 (16,274 veh/h; 0.9 has two and one removals in seeds 2 and 3). The earlier state met it at PM 0.4 and AM 0.35.

120-minute PM run (scale 1.0, seed 1, the live app's regime of a rate that keeps being injected): vehicles in the network 4,608 at 60 min and 5,252 at 120 (the count rises by 14% in the second hour and its growth slows), arterial speed 6.3 then 6.0 m/s, removals 10 in the first hour and 27 in the second (37 total), and the entry backlog grows from 657 to 1,966 trips, 98% of it (1,921) at the single SR-24 west-end mainline gate (node 1769, 2,934 veh/h offered), at about 1,300 trips an hour. So queues no longer fill the area, and the unserved demand piles up outside it at that gate.

Headline freeway shares, PM, modeled (observed; before the fit in brackets): Hillegass Ave NB from the freeway 75 (47, +28; 62), Colby St NB from 42 (47, -5; 47), Hillegass Ave SB to 53 (68, -15; 62), Colby St SB to 21 (45, -24; 40): one of four within 10 points (three before). AM 71 / 31 / 42 / 11 and midday 68 / 33 / 47 / 12 (observed values are the PM ones). Ramp via-street shares, PM, modeled / observed: onto the freeway via College Ave 11 / 16, Hillegass Ave 10 / 12, Martin St 23 / 10, Colby St 11 / 8, Telegraph Ave north of Alcatraz Ave 56 / 8, Benvenue Ave 2 / 5; from the freeway via College Ave 9 / 10, Martin St 34 / 10, Colby St 16 / 8, Hillegass Ave 10 / 5, Benvenue Ave 2 / 3. The fit keeps every ramp volume and cuts local and through volume, so freeway trips take a larger share of the local streets; Telegraph Ave north of Alcatraz Ave stays at 56% (the same 8% observed) because the destination choice of ramp trips is unchanged.

PM mid-block flows, veh/h per direction, mean of seeds 1 to 3, against the expected peak flow, ratio (before in brackets): Telegraph Ave N 944 / 1,093 = 0.86 (0.54), S 756 / 910 = 0.83 (0.70); Alcatraz Ave E 418 / 618 = 0.68 (0.84), W 418 / 521 = 0.80 (1.32); Claremont Ave N 421 / 635 = 0.66 (0.87), S 706 / 635 = 1.11 (1.24); College Ave N 381 / 540 = 0.71 (0.78), S 541 / 540 = 1.00 (1.19), a corridor with no count; Ashby Ave E 620 / 1,260 = 0.49 and W 613 / 1,260 = 0.49 (median over all model-area links of the street; the Ashby gate itself meets its count). Telegraph Ave, whose corridor was the lowest, rises to 0.83 to 0.86; the corridors that were above their expected flow come down.

### Remaining bottlenecks and mechanisms (PM, scale 1.0, mean of seeds 1 to 3, blocked lane-hours)

52nd St/Shattuck Ave 5.4, Market St/Stanford Ave 4.7, Adeline St/Alcatraz Ave 4.6, San Pablo Ave/Stanford Ave 3.7, 55th St/MLK Jr Way 3.6, Alcatraz Ave/Sacramento St 3.4, Alcatraz Ave/Telegraph Ave 3.3, Ashby Ave/Domingo Ave/Tunnel Rd 3.2, 62nd St/Claremont Ave/College Ave 3.0.

- SR-24 west end (mechanism of the D4 failure in the PM peak). The mainline gate at node 1769 offers 2,934 veh/h (the off-ramps' 32,600 ADT x K, DATA). In the simulator the off-ramps it feeds discharge less than their counts: the 52nd St off-ramp (node 742) carries 606 veh/h against 1,278 counted (0.47) and the MLK Jr Way off-ramp (node 734) 1,415 against 1,656 (0.85), while the larger on-ramps are at 0.46 to 1.16 of theirs. The 52nd St off-ramp merges at an uncontrolled node (742) with 52nd St, and 60 m further the merged flow reaches the 52nd St/Shattuck Ave signal (node 694), the worst junction of the run, whose plan runs at the 75 s cycle floor with 15 s minimum greens. This is where the backlog (98% of it at gate 1769) and most of the 7 to 10 removals (MLK Jr Way/45th St, Aileen St/Telegraph Ave, Tunnel Rd/Hiller Dr) come from.
- Alcatraz Ave/Adeline St, Market St/Stanford Ave and San Pablo Ave/Stanford Ave sit behind counted gates that take TMC proxies from intersections up to 1 km away.
- Ramp-count conflicts: several ramps carry 1.5 to 2.8 times their ADT in the simulator (Miles Ave off 1.71, Glenwood Glade on 1.96, Caldecott Lane 1.85 to 2.79) because trips that the free-flow router sends to them are re-routed under congestion, which the static assignment cannot see.

### What remains off (seventh round)

- D4: PM 7 to 10 removals and 2.9% to 3.7% backlog; AM 0 to 5 removals; midday 0 to 1. Scales that meet it: PM 0.6, AM 0.8.
- D5: one of four PM headline shares within 10 points (it was three of four).
- The ramp destination choice (ASSUMPTION) still sends 56% of trips onto the freeway via Telegraph Ave north of Alcatraz Ave against 8% observed.
- The Tunnel Road gates double count the station ADT (the fit lets them give way).
- The capacity guard works on links; junction conflicts (turn pockets, phases) are not in it, so some junctions run above the link limit.
- No further scaling knob was added in this round: the fit and the guard take their numbers from counts and from the validation suite.

## Fourth round: wider network, task 7.3

### Demand accounting (step 1)

Offered PM demand at the start was 28,758 veh/h: through (gate to gate) 9,827, local 1,944 (gate to block and block to block, before the fix; 7,073 after), ramp 16,988. The checks:

- (a) Surface gate to freeway trips exist once. Mainline gates are not part of the gate-to-gate (Furness) step, ramp trips with a surface-gate end use at most 40% of that gate's target and are subtracted from the gate's through residual, and ramp trips with a local end replace part of that block's external trips. No double counting was found there.
- (b) Gate inflow against target at the 18 counted gates (TMC and Caltrans AADT): 1.01 to 1.33 before step P (Ashby Ave 1.26, Telegraph Ave north 1.33), 1.01 to 1.03 after. Outflow is 0.80 to 0.84 of the count at all 18 after step P (0.77 to 0.82 with the thinning alone). The cause is the balancing step: the outflow targets (13,609 veh/h at scale 1.0, 11,530 at 0.5) exceed the inflow supply (8,617 and 8,572), and the outflow side is scaled to the supply for every gate, counted or not. Not changed.
- (c) Class defaults: 125 gates (85 residential at 800 ADT, 15 tertiary at 5,000, 12 secondary at 9,000, 2 primary at 14,000, 11 service at 150) carry 7,712 veh/h in and 11,955 out at scale 1.0, 45% of all gate flow. Many residential gates are dead ends near the extract edge, where 800 ADT is a high value. The defaults stay at their documented values and the single factor of step T applies to them.
- (d) The 14 ramps without a count use 500 ADT, 630 veh/h in total (4.8% of the ramp trips). Their ramp links carry 4 to 12 times ADT x K in the model (the PM seed-1 run: for example the CA 13 and Broadway ramps at the east end 180 to 470 veh/h against 45), because freeway trips from the SR-13 and east-end gates take the nearest exit. No count exists to replace the 500.
- (e) Ramp volume in the demand file after step P: 6,703 veh/h leave the freeway (off-ramps, sum of ADT x K 6,786) and 6,365 enter it (on-ramps, 6,282). Before, 8,253 and 8,734 against 6,786 and 6,984.
- Modeled ramp flows against ADT x K, PM seed 1, are far from the counts at the biggest ramps: MLK Jr Way off-ramp 0.34, 52nd St off-ramp 0.42, MLK Jr Way on-ramps 0.10 and 0.48, 52nd St on-ramp 0.82, Claremont/Clifton off-ramp 0.87, Claremont/Hudson on-ramp 0.79, Aileen St off-ramp 1.44 and 56th St on-ramp 1.45. The queue of the SR-24 west end (mainline gates 2123 and 2124) fills the origin backlog (about 1,500 trips, 5.9% of spawned trips).

### Gate scale check (PM, step S model, scale 1.0)

| `assumedGateScale` | Offered veh/h | Removals | Backlog | Arterial speed (m/s) | Seeds |
| --- | --- | --- | --- | --- | --- |
| 1.0 | 28,758 | 428 | 12.1% | 3.66 | 3 |
| 0.5 | 24,902 | 146 | 11.0% | 4.37 | 3 |
| 0.3 | 23,360 | 106 | 11.3% | 4.88 | 2 |
| 0 | 21,045 | 54 | 12.0% | 5.50 | 2 |
| 1.0, ramp K 0.045 (half the ramp trips) | 25,366 | 478 | 7.6% | 3.80 | 2 |
| 0, ramp K 0.045 | 17,270 | 59 | 4.2% | 5.59 | 2 |

D4 fails at every row. With the assumption gates at zero and half the ramp volume, 17k veh/h still gives about 60 removals and 4% backlog, so the limit is not the factor.

### Stability (step 3), bottlenecks by classification

Top nodes by blocked lane-hours, PM final state, mean of seeds 1 to 3, with the classification:

| Node | Blocked (lane-h) | Class | Note |
| --- | --- | --- | --- |
| 52nd St/Shattuck Ave | 6.5 | model, data | Two-lane arterials at a 75 s signal fed by the SR-24 west-end ramps (MLK Jr Way and 52nd St off-ramps, 32,600 ADT from 2012 and 2017 ramp counts) |
| 40th St/San Pablo Ave | 6.1 | data, importer | Counted gates (TMC legs at West St/40th St used up to 1.2 km away, Caltrans AADT on San Pablo Ave) on the south edge |
| 40th St/West St | 5.9 | importer, data | The junction lies 6 to 17 m inside the extract edge, so its gates have no storage; 7 to 8 of about 170 removals per run are on its approaches (20 of about 430 before step T) |
| 55th St/MLK Jr Way | 5.1 | model, data | Next to the SR-24 west-end ramps |
| 40th St/Market St | 4.8 | data | Leg volumes from the 55th St/Market St count, 1 km away |
| 52nd St/Claremont Ave/Telegraph Ave | 4.6 | importer, model | Five approaches, three phases (unchanged from the third round) |
| 40th St/Adeline St | 4.5 | data, importer | South-edge corner |
| Adeline St/Alcatraz Ave | 4.4 | model | Signal at a default-ADT gate street |
| 62nd St/Claremont Ave/College Ave | 4.3 | model | Three phases at a 75 s cycle (unchanged) |
| Market St/Stanford Ave | 4.3 | model | Two-phase signal with an uneven split (50 and 15 s in a sample run) |

What the round fixed in the model and the importer is in steps P to S and W. After them the removals no longer concentrate in one place: the three largest links hold about 18 of 172 removals per run. The origin backlog ends in three places, which add up to 11% of spawned trips: the two SR-24 west-end mainline gates (1,505 trips, 5.9%), the south-edge gates on 40th St, West St and Telegraph Ave (about 725, 2.8%) and the Claremont and Market St gates (about 175). Without the first two, the backlog would still be above 2%.

D4 is not met in any period. The limit is volume against capacity: at 17k veh/h with half the ramp trips and no assumption gates the baseline still loses about 60 trips to gridlock, and every gate scale at or above 0 fails. The factor of step T is a stability workaround, not an estimate.

### Fit (step 4)

PM headline shares, modeled / observed, mean of three seeds (six seeds for step W: 51 / 35 / 64 / 43):

| Headline share | Start (seed 1) | After step X | Within +/-10 pp |
| --- | --- | --- | --- |
| Hillegass NB from freeway | 45 / 47 | 48 / 47 | yes (+1) |
| Colby NB from freeway | 48 / 47 | 34 / 47 | no (-13) |
| Hillegass SB to freeway (PM 68) | 62 / 68 | 62 / 68 | yes (-6) |
| Colby SB to freeway | 59 / 45 | 46 / 45 | yes (+1) |

Single-seed values move by about 10 points (Colby NB: 33, 34, 35 and 42 in different states), so the one miss is within the noise of the measurement. AM modeled 49 / 33 / 57 / 34 and midday 68 / 47 / 66 / 34 (observed values are the PM ones; Hillegass SB is 57 outside the PM peak).

Ramp via-street shares of the Claremont ramps, PM, modeled / observed (observed covers traffic from or to the north only, modeled covers all ramp trips): onto the freeway via College Ave 22 / 16, Hillegass Ave 13 / 12, Martin St 13 / 10, Colby St 16 / 8, Telegraph Ave north of Alcatraz Ave 52 / 8, Benvenue Ave 2 / 5; from the freeway via College Ave 6 / 10, Martin St 16 / 10, Colby St 8 / 8, Hillegass Ave 8 / 5, Benvenue Ave 1 / 3. At the start (seed 1): onto the freeway via Colby St 34 / 8 and Telegraph Ave north 59 / 8; from the freeway via Martin St 19 / 10, Colby St 14 / 8, Hillegass Ave 12 / 5.

Network data checked first, as asked. The study-area streets match OSM: one signal each at Claremont/Colby/Forest, Claremont/Hudson and Claremont/Clifton, and humps on Colby St and Hillegass Ave as tagged. The importer read no turn restrictions before this round. Now it reads 199 relations; near the study area only these apply: Clifton St to Claremont Ave (always), Ashby Ave to Hillegass Ave and to College Ave (peak periods), Telegraph Ave to 57th St (AM) and Racine St to Telegraph Ave. None of them sits on the obvious route between Telegraph Ave north of Alcatraz Ave and the Hudson ramp, so network data does not explain the over-use of Telegraph Ave. The likely source is demand: the north gates (Telegraph Ave and Ashby Ave, up to 40% of their volume can be ramp trips) are the nearest large origins for the Hudson on-ramp. That is a reading of the demand tables, not a measured cause. Parameters used: `ramps.localShare` (step V: College Ave 8 -> 19 against 16 observed, Colby St 9 -> 15 against 8) and, without effect beyond the noise, the local-street cost factor (1.0 and 1.6 against 1.25: headline 60 / 45 / 48 / 32 and 58 / 43 / 52 / 33, at localShare 0.3) and the per-gate ramp cap (0.2 against 0.4: 59 / 42 / 56 / 39 at localShare 0.6). A distance decay on ramp destination weights moved the local share of freeway-origin trips from 21% to 27% in the demand file and was not run in the simulator or kept. The Telegraph Ave north share is still 52 against 8: the comparison bases differ (see above) and the lever that would fix it is the origin mix of the north gates, which has no data.

### Mid-block flows (step 5)

PM, veh/h per direction of travel, median of mid-block links, mean of seeds 1 to 3 against the expected peak flow (the ratio in brackets):

| Street | Direction | Modeled | Expected | Source of the expected value |
| --- | --- | --- | --- | --- |
| Telegraph Ave (study area) | N / S | 558 / 525 | 1,093 / 910 | TMC legs south of Alcatraz Ave (0.51 / 0.58) |
| Alcatraz Ave | E / W | 334 / 322 | 618 / 521 | TMC legs, mean of the two sides (0.54 / 0.62) |
| Claremont Ave | N / S | 239 / 640 | 635 | Caltrans AADT 23,500 x 0.6 x 0.09 / 2 (0.38 / 1.01) |
| College Ave | N / S | 210 / 564 | about 540 | no count; ADT about 12,000 is an estimate (0.39 / 1.04) |
| Ashby Ave | E / W | 664 / 546 | 1,260 | Caltrans AADT 28,000 x 0.09 / 2 (0.53 / 0.43) |
| Shattuck Ave | N / S | 224 / 384 | 203 | class-default ADT 9,000 x 0.09 / 2 x 0.5 (1.1 / 1.9) |
| Adeline St | N / S | 288 / 209 | 203 | same (1.4 / 1.0) |
| 51st St | E / W | 328 / 756 | 203 | same (1.6 / 3.7) |

Counted corridors carry about half their expected flow. Northbound Claremont Ave and College Ave are the weakest (0.38 and 0.39). 51st St westbound carries the traffic of the 52nd St and Telegraph Ave ramps and is far above the class default.

### Walking and cycling (step 6)

PM peak, seed 1 (AM and midday in the reports): cyclists 1,335 trips completed, 254 in the network, mean trip 466 s; pedestrians 2,460 trips completed, 428 in the network, mean trip 497 s, mean crossing delay 8.1 s (9.2 s AM, 5.7 s midday); 471 pedestrian conflicts, 598 bicycle conflicts and 1,055 close passes; mean vehicle speed at pedestrian encounters 1.9 m/s. Checks: the numbers in the network are close to offered volume times trip time (pedestrians 3,066/h x 497 s = 423 against 428, cyclists 1,605/h x 466 s = 208 against 254), so nobody is stuck; crossing delays are seconds, not minutes; conflicts and close passes are not zero. Things to read with care: the bicycle count scaling sits at its lower clamp (factor 0.2; the prior is 776 cyclists at Telegraph Ave/Alcatraz Ave against 82 counted), so cyclists there stay about twice the count; the pedestrian count is one intersection; vehicle speeds at crossings reflect the congestion above; the conflict and injury figures are surrogates with no observed counterpart.

### Final state, wider network, scale 1.0, mean of seeds 1 to 3

| Period | Offered veh/h | Completed trips | Gridlock removals (seeds 1 / 2 / 3) | Backlog | Arterial speed (m/s) | Stable (D4) |
| --- | --- | --- | --- | --- | --- | --- |
| PM peak | 24,924 | 11,021 | 211 / 146 / 160 (mean 172) | 11.4% | 4.14 (9.3 mph) | no (removals, backlog) |
| AM peak | 23,720 | 10,956 | 152 / 122 / 120 (mean 131) | 9.6% | 4.33 (9.7 mph) | no (removals, backlog) |
| Midday | 16,182 | 10,944 | 14 / 28 / 22 (mean 21) | 3.0% | 6.26 (14.0 mph) | no (removals, backlog) |

Offered PM demand by type, veh/h: gate to gate 8,572, with a local end 3,285 (gate to block and block to block), freeway ramp trips 13,068 (7,713 of them end at a block). Plus 1,605 cyclists and 3,066 pedestrians per hour (persons). Settings: `assumedGateScale` 0.5, re-route share 80%, `ramps.localShare` 0.60, local-street cost factor 1.25. D5 holds for three of four headline shares in the PM peak; the status stays uncalibrated. The reports in `reports/` are seed 1.

### What remains off (fourth round)

- D4 is not met in any period; the limits are listed above.
- Modeled ramp volumes do not follow the ramp counts: the busiest SR-24 west-end ramps deliver 10 to 50% of ADT x K while hillside connectors without a count carry several times their assumed volume.
- Counted corridors carry about half their expected flow (Telegraph Ave, Alcatraz Ave, Ashby Ave).
- The south-edge corner (40th St, West St, San Pablo Ave, Telegraph Ave) is cut by the extract edge; moving the south edge a few hundred meters south would give the gates room, at the price of a new extract.
- Ramp via-street share onto the freeway via Telegraph Ave north of Alcatraz Ave is 52% against 8%.
- Signal control is still an approximation (see the third round), and the 14 ramps without a count use an assumed 500 ADT.

## Sixth round: demand audit, perimeter treatment, gate placement (task 9)

After the validation round the PM peak offered 28.8k veh/h and completed 13.1k. The reading to test: much of the excess sits at the model's edges, far from the study area. All values below are PM peak, scale 1.0, mean of seeds 1 to 3 unless said otherwise. Steps AE to AL in the table above.

### Demand audit (step 1, AE)

`tools/build-demand.ts` now writes `data/demand/rockridge.audit.md` (gate table, relevance table, cordon table; method in `data/demand/README.md`). A trip is relevant in class (i) when its free-flow route uses a link of the study area or of a bounding street, in class (ii) when it passes within 400 m of the study-area polygon, and peripheral (iii) when it never does.

| Offered PM veh/h | Touches (i) | Near (ii) | Peripheral (iii) | Total | Peripheral share |
| --- | --- | --- | --- | --- | --- |
| Before (fourth-round area, state AD) | 9,545 | 5,773 | 13,463 | 28,781 | 47% |
| of which through (gate to gate) | 3,243 | 1,876 | 7,309 | 12,428 | 59% |
| of which local | 576 | 342 | 2,367 | 3,285 | 72% |
| of which ramp | 5,726 | 3,555 | 3,787 | 13,068 | 29% |
| After (current area and rules, state AK) | 10,418 | 6,165 | 10,810 | 27,393 | 39% |
| of which through | 3,932 | 2,298 | 5,814 | 12,044 | 48% |
| of which local | 516 | 281 | 1,485 | 2,282 | 65% |
| of which ramp | 5,971 | 3,586 | 3,512 | 13,068 | 27% |

AM and midday are in the audit file (peripheral share before 49% and 48%, after 40% and 40%). Per gate, the share of a gate's trips that come within 400 m of the study area is 50% for the 18 counted gates and 40% for the 125 default-ADT gates before; after, 56% (15 counted gates) and 52% (104 default gates). The peripheral volume is mostly DATA: ramp trips (the ramp counts) are 27 to 29% peripheral and the counted gates carry half the surface gate volume.

Cordon check, PM modeled flow against lanes x 837 veh/h per lane (the suite's measured signalized capacity at green share 0.5, cases b1 and b2; 2,184 per freeway lane, case i1). Before: north in 4,193 / capacity 41,013, out 3,602 / 40,176; east 1,765 / 16,740 and 1,621 / 15,903; south 7,068 / 45,198 and 7,779 / 45,198; west 3,221 / 42,687 and 3,320 / 43,524. After: north 5,026 / 43,524 and 5,099 / 42,687; east 1,933 / 13,392 and 2,023 / 12,555; south 4,576 / 39,339 and 4,249 / 37,665; west 3,721 / 30,132 and 4,038 / 28,458. Freeway mainline gates after: east 1,957 in and 2,003 out of 19,656; south 4,799 and 4,309 of 19,656. The side totals are 8 to 17% of capacity because many gates are residential streets with spare lanes, so the audit also counts gate directions above their own lane capacity: none, before or after. The busiest are the counted Telegraph Ave south gate (716 out of 837, 0.86), Claremont Ave north (698 of 837, 0.83), Ashby Ave west (1,379 of 1,674, 0.82) and Tunnel Road east (669 of 837, 0.80). No cordon inflow is above cordon capacity, so no demand error exists at the cordon by this test. The limit is inside the model: the capacity at the interior signals behind the gates (see the bottlenecks below), not the gate links.

### Perimeter treatment (step 2, AF and AG)

Config `peripheral` (ASSUMPTION). Peripheral trips stay as background load, with two rules.

- P1, corner clipping. Through pairs whose gates are less than 600 m apart along the model perimeter, or whose free-flow route stays within 300 m of the model edge, are dropped. They held 1,642 veh/h (13% of through, 5.7% of offered) on the fourth-round area, of which 136 by the perimeter gap and 1,637 by the edge band (131 in both), and 606 veh/h on the current area (96 and 589; AM 505, midday 390). They are all peripheral.
- P2, cap. A gate's modeled volume (through, local and ramp) may not exceed min(target, lane capacity x 837); the excess is taken from that gate's peripheral through trips only. It removed 0 veh/h in every period, because no gate direction is above its lane capacity or its target. An early AM run (before the symmetric balancing of step AH) showed cuts of 1.7k veh/h, because the balancing then scaled AM outflows above their targets; that is gone.
- Counted volumes and ramp volumes are not scaled. P1 does take its pairs out of the counted gates' totals: the modeled inflow and outflow at counted gates are now 0.89 to 1.01 of the target (lowest: the Market St, San Pablo Ave and West St gates). The demand-model spec says within 12%.

The first version of P1 refit the gate totals without those pairs (AF). That kept the counts but moved the volume to longer pairs: 12,130 trips completed against 13,056 and 266 removals against 242. Dropping them (AG) gave 14,510 completed, 61 removals, 6.5% backlog and 4.95 m/s, the largest gain of the round. The corner clippers were the edge signals' load.

### Through-trip totals at counted gates (step 3, AH)

Checked: no double counting. A counted gate's modeled inflow summed over through, local and ramp trips was 1.01 to 1.03 of its target before, and the through step subtracts the local and ramp volume of a gate from its residual. The shortfall was on the outflow side. The residual outflow demand (17.5k veh/h) exceeded the residual inflow supply (12.4k), because the assumed gates use an inbound share of 0.45 in the PM peak (net exporters); the single scaling put every gate, counted or not, at 0.77 of its outflow target. Now the counted gates keep both directions and the assumed gates take the whole scaling (in the AM peak, where the supply is larger, the assumed gates' inflow is scaled instead). Counted outflow rose from 0.77 to 1.00 of the count; offered volume changed by +230 veh/h only (the assumed gates lost 1,856 veh/h of outflow). Removals doubled (61 to 121) because the counted corridors, which carry the demand the network struggles with, now get their full outflow. That is the DATA, so it stays.

### Class defaults (step 4, AI)

Counted streets and their ADT (old area): primary 2 (San Pablo Ave 21,100, Ashby Ave 28,000), secondary 3 (40th St 15,401, Telegraph Ave 18,018, Claremont Ave 14,100), tertiary 3 (West St 6,869, Market St 11,497, Tunnel Road 27,000), residential 1 (55th St 3,767), service 0. Median of the three classes with three streets: secondary 15,400 against 9,000 documented, tertiary 11,500 against 5,000. The counted streets are the busiest of their class, so the median is not a neutral estimate for uncounted gates, but the instruction was to use it, and it is applied. On the old area it raised PM offered volume from 27.4k to 31.3k and made the baseline worse (12,271 completed, 253 removals, speed 3.74 m/s). On the current area only tertiary qualifies (Alcatraz Ave 12,992, Market St 11,497, West St 5,289, Tunnel Road 27,000; median 12,200), because the cut removed 40th St from the counted secondary streets (Telegraph Ave and Claremont Ave remain, two streets, so 9,000 stays). Offered 27,393 with the median and 25,462 with the documented 5,000 (state AKb: 13,885 completed, 88 removals, 5.0% backlog, 4.82 m/s). `assumedGateScale` is removed. Switching the rule off is one line: delete `classDefaultFromCounts` from the demand config.

### Signals (step 5, AJ)

The adaptive plan gives a saturated arterial 22% less green than the start-up plan (50 against 64 s of a 90 s cycle at the case c5 junction). The mechanism is not a queue undercount. A debug trace of the measured approach flows shows arterial flows of 2,300 to 3,500 veh/h per approach (above the lane capacity, standing queue included) and cross-street flows of 420 to 900 veh/h, which size the cross phase at 17 to 32 s (27 to 32 s at the first signal). The start-up plan is sized from the uncapped free-flow assignment of the offered demand (4,000 veh/h per direction on a 2-lane approach, flow ratio 1.11 against 0.28 for the cross street), so it gives the cross street 16 s. A 500 veh/h cross street needs about 26 s plus start-up (12.5 vehicles a cycle at 2.1 s). The fixed plan serves 588 of the 1,000 veh/h the cross street offers; the adaptive plan serves 1,038. The arterial through flow past the second signal falls from 2,358 to 1,971 veh/h as a consequence. So the adaptive plan is right and the case measured the wrong quantity: it counted only the arterial and rewarded starving the cross street. Case c5 now compares vehicles served on all four approaches of the first signal (4,827 against 5,301, ratio 0.91, range 0.90 to 1.10, ASSUMPTION), and the new case c6 checks that the cross street gets at least 90% of its demand (1.04). Both pass. No plan code changed. Case c2 (two signals 100 m apart, adaptive: 0.73 against 0.75 low end) stays on the list for the same cause plus storage; it was not re-measured with the new metric.

Two-lane pocket overflow (b9, 790 against 815 at the low end): the mechanism is clear, the saturated through queue of the case is longer than the 3-vehicle pocket, which blocks pocket entry (a standing rule), and left-turners wait in the inner through lane. Changing `POCKET_VEH` would move an assumption to pass a case, so b9 stays listed. Circle entry (f2, f3): the single-node circle has no gap check for vehicles still approaching and blocks the entry for 68% of each circulating vehicle's arc; a fix is a redesign of the circle node (a per-arc occupancy model), not a parameter, and circles exist only as an intervention. Both stay listed. Suite after the round: 42 of 55 cases pass (c5 and c6 pass; a3, b9, c2, e2, e3, e6, e9, f2, f3, j6, j8, j9, j12 fail).

### South edge and gate placement (step 6, AK)

The old south edge (37.830) cut 40th St through its signals at West St, San Pablo Ave, Adeline St and Market St, and the importer put gates 14 to 41 m from them: those corners were the top bottlenecks of the previous round. Extending the edge south would pull in the MacArthur Maze (I-980, I-580 and the SR-24 start at 37.8257 to 37.833) and freeway ramps with no ramp counts (`rampRoutes` has only SR-24 and SR-13), and would need a new extract. The edge moved north instead, which needs no refetch (the extract is larger). The importer now warns about every gate within 60 m (`gateSignalWarnM`) of a signalized junction. Candidate edges were compared by the number of gates within 60 m of a signal: south 37.830 gave 9, 37.8325 gave 1, 37.833 gave 5, 37.834 gave 4, 37.836 gave 4, 37.839 gave 2; west -122.286 gave 8, -122.2845 gave 1, -122.284 gave 2. North and east edges had none, so they stay. The new box `[-122.2845, 37.8325, -122.22, 37.8605]` has 2 flagged gates of 132 (Ashby Ave west 22 m from its signal, Broadway south 11 m), both on counted corridors. The study area is unchanged (74 nodes, 207 links). The network is 1,800 nodes and 4,480 links (was 2,162 and 5,401), with 94 signals (was 112). Counted gates for the south edge now come from the north legs of the 40th St counts (Telegraph Ave, West St), and the West St/40th St and Telegraph Ave/40th St counts' east and west legs are not used. LODES blocks outside the new box are dropped in the builder. San Pablo Ave gates remain (a diagonal street that still crosses the south and west edges). Measured with the other changes: step AK.

### Walking and biking (step 7, AL)

The bicycle factor was clamped at 0.2 (prior 797 per hour at Telegraph Ave/Alcatraz Ave against 82 counted), so modeled cyclists stayed about twice the count. The clamp is gone and the factor is fitted on the final flow list, after the flow cap (the 1,500-flow cap drops small flows that pass the node, so the factor that matches the count is 0.161 and not 82 / 819 = 0.100). Result: pedestrians 150 against 151 counted (factor 0.355, prior 310), bicycles 82 against 82 (factor 0.161, prior 819). PM persons per hour fall from 3,066 to 1,991 (pedestrians) and from 1,605 to 1,148 (bicycles). The bicycle prior is ten times the count, so the assumed 4% mode share and trip rates are too high for this neighborhood; the scaling corrects the level at one intersection and nothing else is validated. The count is one intersection and the path model is shortest paths, not the simulator's routes; the simulator's own volume at that node was not measured. A test (`tools/demand-active.test.ts`) checks the 2% match.

### Final state: validation suite, then the real network (step 8)

Validation suite: 42 of 55 cases pass (40 of 54 before this round; c5 reframed and passing, c6 added).

Real network, current area, scale 1.0, mean of seeds 1 to 3 (seed 1 reports in `reports/`):

| Period | Offered veh/h | Completed trips | Gridlock removals (seeds 1 / 2 / 3) | Backlog | Arterial speed (m/s) | Stable (D4) |
| --- | --- | --- | --- | --- | --- | --- |
| PM peak | 27,393 | 13,239 | 212 / 130 / 109 (mean 150) | 5.9% | 4.32 | no (removals, backlog) |
| AM peak | 22,121 | 14,370 | 49 / 48 / 30 (mean 42) | 1.9% | 5.80 | no (removals) |
| Midday | 17,333 | 13,107 | 13 / 12 / 8 (mean 11) | 0.0% | 7.24 | no (removals) |

Against the start of the round (PM 242 removals, 9.8% backlog, 13,056 completed, AM 253 and 7.8%, midday 27 and 2.5%) every period improved, the PM peak by 38% in removals and 4 points in backlog. D4 still fails in all three periods at scale 1.0. Demand scale at which each period meets D4 (zero removals in all three seeds, backlog under 2%, speed above 4 m/s): PM 0.4 (offered 10,957 veh/h; 0.45 has one removal in seed 2, 0.5 has 4), AM 0.35 (7,742; 0.4 has one removal in seed 2, 0.5 one in seed 3), midday 0.6 (10,400; 0.7 has one removal in seed 3). Removals at the other scales (mean of three seeds): PM 0.6 11, 0.7 19; AM 0.9 15, 0.8 17, 0.7 4, 0.6 10, 0.5 0.3, 0.45 0.7, 0.4 0.3; midday 0.7 1, 0.8 4, 0.9 16. These are the same demand scales as before the round (PM 0.4), so the edge fixes cut the removals at full demand but not the load the interior can serve without queues.

PM mid-block flows, veh/h per direction, mean of seeds 1 to 3, against the expected peak flow, ratio (previous state in brackets): Telegraph Ave N 628 / 1,093 = 0.57 (0.60), S 592 / 910 = 0.65 (0.60); Alcatraz Ave E 534 / 618 = 0.86 (0.74), W 674 / 521 = 1.29 (1.04); Claremont Ave N 652 / 635 = 1.03 (0.65), S 784 / 635 = 1.23 (1.31); College Ave N 433 / 540 = 0.80 (0.76), S 431 / 540 = 0.80 (1.29); Ashby Ave E 1,025 / 1,260 = 0.81 (0.67), W 753 / 1,260 = 0.60 (0.49; median over all model-area links of the street). The Telegraph Ave corridor still carries 0.6 of its count; the Alcatraz Ave westbound and Claremont Ave southbound flows are above their expected values.

Headline freeway shares, PM, modeled (observed): Hillegass Ave NB from the freeway 61 (47, +14), Colby St NB from 46 (47, -1), Hillegass Ave SB to 58 (68, -10), Colby St SB to 39 (45, -6); two of four within 10 points (it was three, with Colby St SB 12 under; the seed range of one share is about 10 points). AM 67 / 49 / 65 / 38 and midday 69 / 47 / 63 / 31 (observed values are the PM ones). Ramp via-street shares, PM, modeled / observed: onto the freeway via College Ave 14 / 16, Hillegass Ave 19 / 12, Martin St 15 / 10, Colby St 13 / 8, Telegraph Ave north of Alcatraz Ave 56 / 8, Benvenue Ave 3 / 5; from the freeway via College Ave 11 / 10, Martin St 21 / 10, Colby St 17 / 8, Hillegass Ave 17 / 5, Benvenue Ave 3 / 3. D5 does not hold, so the status stays uncalibrated.

### Remaining bottlenecks, PM at scale 1.0 (blocked lane-hours, mean of seeds 1 to 3)

52nd St/Shattuck Ave 6.2, 55th St/MLK Jr Way 5.4, Adeline St/Alcatraz Ave 5.3, Market St/Stanford Ave 5.1, 62nd St/Claremont Ave/College Ave 4.9, Alcatraz Ave/Telegraph Ave 4.4, 52nd St/MLK Jr Way 4.2, 55th St/Telegraph Ave 4.0. The south-edge signals of the last round are gone from the list.

- The SR-24 west-end cluster (52nd St/Shattuck Ave, 52nd St/MLK Jr Way, 55th St/MLK Jr Way, 45th St/MLK Jr Way) carries the off-ramp trips of 32,600 ADT, 2,934 veh/h at K 0.09 (DATA), through one mainline gate whose origin backlog is 1,251 of 2,921 offered trips at the end of the run (seed 1; 71% of the run's backlog of 1,752 trips). The off-ramp discharge, the 75 s signals with 15 s minimum greens and two-lane arterials behind them cannot carry it; 52nd St/MLK Jr Way has 2.65 of 4.25 lane-hours blocked for no downstream space, so the queue comes from 52nd St/Shattuck Ave. Most gridlock removals sit on MLK Jr Way and on Telegraph Ave at Aileen St (16 of 212 in seed 1).
- Alcatraz Ave/Adeline St, Alcatraz Ave/Telegraph Ave and Market St/Stanford Ave sit behind counted gates (Alcatraz Ave west 547 in and 623 out per hour, Market St 607 and 428, both TMC proxies from intersections up to 1 km away) and the tertiary class default of 12,200 ADT; Alcatraz Ave westbound runs at 1.29 of its expected flow. The Market St/Stanford Ave plan at the end of the run is 50 and 15 s (a 15 s minimum green on the cross street).
- 62nd St/Claremont Ave/College Ave has three phases in a 90 s cycle; each street gets 15 to 32 s.
- Signal control is still an approximation (no coordination, fixed minimum greens, left turns by gaps and sneakers).

### What remains off (sixth round)

- D4 is not met at scale 1.0 in any period (PM 150 removals, 5.9% backlog; AM 42 removals; midday 11 removals). Demand scales that meet it: PM 0.4, AM 0.35, midday 0.6.
- D5: two of four headline shares within 10 points; Telegraph Ave north of Alcatraz Ave is 56% of trips onto the freeway against 8%.
- Counted corridors carry 0.57 to 1.29 of their expected flow; Telegraph Ave is 0.57 and 0.65.
- The class-default rule (median of counted streets) raises tertiary gates 2.4 times and is a high estimate; the documented defaults give 13,885 completed and 88 removals. This is a decision for the lead.
- Cases a3, b9, c2, e2, e3, e6, e9, f2, f3, j6, j8, j9 and j12 stay outside their ranges (`validation.md`).
- The two flagged gates (Ashby Ave west, Broadway south) sit near signals.

## Fifth round: validation of the simulator's primitives (task 8)

Four tuning rounds adjusted demand and a few behaviors, yet the wider network still oversaturated (PM about 170 removals an hour, backlog 11%) while the counted corridors carried about half their expected flow. A network that jams while carrying half the real volume points at capacities below real values, so demand tuning stopped and the primitives were measured on their own. The suite is `cargo run --release -p traffic-sim --bin validate` (crate `traffic_sim::validate`, regression test `crates/sim/tests/validate.rs`); every case, its source and its result are in `validation.md`, and the method is in the README of this folder. Sources added to `docs/references.md` for it: [FHWA-SIG2004], [FHWA-STM2008], [Treiber2014], [TxDOT-TSAP] and [NCHRP08-135] (HCM 7 all-way stop headways). Ranges without a verified source are labeled ASSUMPTION in the table.

### Mechanisms found and fixed (steps Y to AC)

| Step | Mechanism in the code | Case before / after (expected) |
| --- | --- | --- |
| Y | `compute_accels` kept a kinematic limit `a_req = -(v^2 - vt^2) / (2 d)` for the turn speed `vt` at any distance. Once a head vehicle exceeded `vt` by a little, the limit was slightly negative for the whole link, so the first vehicle of every lane with a left or right turn ahead drove at 5 or 4 m/s along the link and held its platoon. The limit now applies once the braking needed is more than half the comfortable deceleration. Same rule for humps | k2 left 12.5 s / 4.6 s, k3 right 15.8 s / 4.6 s (2.5 to 6 and 3 to 7 s) |
| Z | The plain IDM follows at a gap larger than s0 + v T, which lowers queue discharge. IIDM ([Treiber2014] eq. 1 to 3) has the steady-state gap s0 + v T; the means of T (1.2 s) and a (1.5 m/s2) are the signal-discharge calibration of the same paper, replacing uncited priors (1.3 s, 1.4 m/s2) | a1 headway 2.38 s / 2.14 s, a2 1,510 / 1,682 veh/h/lane (observed 1,500 to 2,000, ideal 1,900), i1 motorway 1,605 / 2,184 (2,350 at 65 mph), i3 ramp 1,584 / 2,052 (2,100) |
| AA | A gate inserted vehicles at a fixed 4 m/s with 4 m of room, and each slow entry delayed the next (each insertion waited for the leader to cover 8.7 m from 4 m/s). Entry speed is now the highest speed up to the desired speed whose IDM gap fits the room, and a vehicle waits until it can enter at least as fast as its leader | h1 1,476 / 1,734 veh/h per lane on a 25 mph link (link capacity 1,790), g1 1,386 / 1,656 |
| AB | A vehicle crossing a node blocked every conflicting movement until it left the node (4 s from a standing start), and the lag to an opposing vehicle was measured to the stop line, 6 m short of the conflict point. Crossing conflicts now end when the vehicle's tail passes the conflict point; the entering vehicle may start when the other will have cleared it on arrival (0.5 s to spare); merges onto the same exit still block until the node is empty | d1 all-way stop 334 / 473 veh/h per approach (400 to 550), b4 20% left with a pocket 588 / 936 (921 to 1,216), left-only permissive capacity with 500 opposing 416 / 1,038 per green hour (Harders formula 1,074) |
| AC | Each queued minor-street driver stopped again at the line (a crawl at 1.4 m/s over 8.7 m, then 1 s of dwell): 6.5 s per vehicle with nothing to yield to, where the HCM follow-up time is 3.3 to 4.0 s. A driver who slowed below 2 m/s behind another vehicle now rolls up without a second full stop | e1 minor right with 200 on the major street 412 / 694 veh/h (635 to 1,058); no conflicting flow 550 / 1,030 |

The golden-metrics test (`car_only_metrics_match_pre_multimodal_golden`) changed with these steps and its two golden strings were replaced in the same change. The invariant helper `assert_no_conflicting_transit` now allows two crossing vehicles in a node when neither is on the shared conflict point. Two stop-sign tests and the saturated two-lane approach test changed their bounds for the new rules.

Checked and cleared. The anti-spillback room check before a node crossing (step C0) does not limit arterial throughput: with `ROOM_MIN` at 4, 2 and 0.5 m, two signals 100 m apart carried 1,818, 1,824 and 1,830 veh/h. The 23% shortfall of two signals 100 m apart against 1,000 m (case c1) is storage and uncoordinated offsets: the 100 m link holds about 28 vehicles on two lanes and the next green can arrive after the downstream signal has turned red.

### Validation table, before and after (selected cases; every case is in `validation.md`)

Ratio is the simulated value over the midpoint of the expected range. "Before" is the simulator at the start of this task, same cases and ranges.

| Case | Quantity | Before | After | Expected | Source |
| --- | --- | --- | --- | --- | --- |
| a1 | Saturation headway, 1 lane, 25 mph (s) | 2.38 (1.14) | 2.14 (1.02) | 1.80 to 2.40 | [FHWA-SIG2004] |
| a2 | Saturation flow (veh/h/lane) | 1,510 (0.86) | 1,682 (0.96) | 1,500 to 2,000 | [FHWA-SIG2004] |
| a3 | Start-up lost time (s) | -0.36 | 0.37 | 1 to 3 | [FHWA-STM2008] |
| b1 | Signal capacity, 1 lane, green share 0.5 (veh/h/lane) | 738 (0.86) | 837 (0.95) | 755 to 1,007 | [FHWA-SIG2004] |
| b4 | 20% left, pocket, 500 opposing | 588 (0.59) | 936 (0.88) | 921 to 1,216 | [Brilon1999] |
| b9 | 2 lanes, 10% left, pocket | 652 (0.71) | 790 (0.84) | 815 to 1,075 | [Brilon1999] |
| c2 | Two signals 100 m apart, adaptive, over 1,000 m apart | 0.78 | 0.73 | 0.75 to 1.15 | ASSUMPTION |
| d1 | All-way stop per approach (veh/h) | 334 (0.70) | 473 (1.00) | 400 to 550 | ASSUMPTION |
| d2 | All-way stop departure headway (s) | 10.8 (1.59) | 7.6 (1.13) | 3.9 to 9.6 | [HCM7] via [NCHRP08-135] |
| e1 | Minor right, major 200 per direction (veh/h) | 412 (0.49) | 694 (0.82) | 635 to 1,058 | [Brilon1999] |
| e4 | Minor through, major 200 | 309 (0.57) | 574 (1.06) | 406 to 677 | [Brilon1999] |
| e7 | Minor left, major 200 | 291 (0.52) | 516 (0.91) | 423 to 705 | [Brilon1999] |
| f2 | Circle entry, 600 circulating (veh/h) | 262 (0.42) | 312 (0.50) | 496 to 744 | [Rodegerdts2007] |
| g1 | Single lane at 25 mph, gate-fed (veh/h/lane) | 1,386 (0.97) | 1,656 (0.92) | 1,603 to 1,980 | [Treiber2014] |
| i1 | Motorway lane, 65 mph (veh/h/lane) | 1,605 (0.70) | 2,184 (0.95) | 2,115 to 2,468 | [TxDOT-TSAP] |
| i2 | Off-ramp, 1 lane flaring to 2 at a signal (veh/h/lane) | 444 (0.86) | 500 (0.97) | 443 to 591 | [FHWA-SIG2004] |
| k2 | Free-flow left turn, extra time (s) | 12.5 (2.93) | 4.6 (1.07) | 2.5 to 6 | ASSUMPTION (kinematic) |
| k3 | Free-flow right turn, extra time (s) | 15.8 (3.16) | 4.6 (0.92) | 3 to 7 | ASSUMPTION (kinematic) |

Before, 28 of 54 cases passed; after, 40. Several "before" values pass the saturation-flow range only because it is the wide observed range of [FHWA-SIG2004] (1,500 to 2,000); against the ideal 1,900 the 25 mph approach went from 0.79 to 0.89.

### Cases still outside their range (not fixed; mechanism)

- a3 start-up lost time 0.4 s against about 2 s: vehicles have no response delay when the green starts, so the first vehicle leaves at once. This helps capacity; adding the delay would cost about 3%.
- b9 two lanes, 10% left, pocket: 790 against 815 at the low end. Left-turners overflow the 3-vehicle pocket (`POCKET_VEH`, an ASSUMPTION) into the inner lane.
- c5 and c2: with saturated demand the adaptive plan gives the arterial 16% less than the fixed start-up plan, because splits follow measured exits plus the standing queue, and exits are capped by the green the arterial already had. On the real network adaptation is still better than none (PM completed trips 13,004 against 11,778 with `--adapt-min 0`, seed 1).
- e2, e3 (minor right with 600 and 1,000 on each major direction) are 27% and 38% below the formula, which uses only the near-side stream, while the simulator also yields to the far-side stream; e6 and e9 (through and left at 1,000 per direction) are above it.
- f2, f3 circle entry at 600 and 1,000 circulating veh/h: 312 and 84 against 620 and 416. The single-node circle blocks the entry while a circulating vehicle is on the first 68% of its arc (arc 26 m at 5 m/s, 3.5 s per vehicle) and has no gap check on vehicles still approaching. Circles exist only as an intervention.
- j6, j8, j9, j12 (other modes): 300 cyclists an hour sharing a signalized lane cost 39% of capacity (50 an hour cost 13%) because a cyclist at 5 m/s is a moving bottleneck for cars at 11 m/s; 600 pedestrians an hour on each crosswalk of an all-way stop leave 23% of its capacity. No verified HCM pedestrian or bicycle adjustment factor was found, so the floors in the table (0.6 and 0.7 of capacity) are guesses and these rows are information, not a pass test. Pedestrians at a signal only affect turning movements, as designed (the through approach is unchanged).

### Real network after the fixes, `assumedGateScale` 1.0, mean of seeds 1 to 3

| Period | Offered veh/h | Completed trips | Gridlock removals (seeds 1 / 2 / 3) | Backlog | Arterial speed (m/s) | Stable (D4) |
| --- | --- | --- | --- | --- | --- | --- |
| PM peak | 28,781 | 13,056 | 287 / 212 / 228 (mean 242) | 9.8% | 4.41 | no (removals, backlog) |
| AM peak | 27,831 | 12,276 | 301 / 245 / 214 (mean 253) | 7.8% | 4.36 | no (removals, backlog) |
| Midday | 18,806 | 12,982 | 30 / 24 / 27 (mean 27) | 2.5% | 6.65 | no (removals, backlog) |

At the start of this task the same network at `assumedGateScale` 0.5 (24,924 offered in the PM) completed 11,021 trips with 172 removals; at scale 1.0 and before any fix, 9,124 with 450. The fixes raise PM completed trips by 19% at the same offered demand, and at full demand the removals fell from 450 to 242.

PM mid-block flows, veh/h per direction, mean of seeds 1 to 3, against the expected peak flow (ratio; before in brackets): Telegraph Ave N 658 / 1,093 = 0.60 (0.51), S 548 / 910 = 0.60 (0.58); Alcatraz Ave E 458 / 618 = 0.74 (0.54), W 540 / 521 = 1.04 (0.62); Claremont Ave N 413 / 635 = 0.65 (0.38), S 834 / 635 = 1.31 (1.01); College Ave N 413 / 540 = 0.76 (0.39), S 699 / 540 = 1.29 (1.04); Ashby Ave E 846 / 1,260 = 0.67 (0.53), W 615 / 1,260 = 0.49 (0.43; median over all model-area links of the street).

Headline freeway shares, PM, modeled / observed: Hillegass NB from freeway 52 / 47, Colby NB from 38 / 47, Hillegass SB to 61 / 68, Colby SB to 33 / 45; three of four within 10 points (Colby SB is 12 under). AM 44 / 26 / 46 / 29 and midday 56 / 32 / 52 / 21 (observed values are the PM ones). Ramp via-street shares, PM, modeled / observed: onto the freeway via College Ave 16 / 16, Hillegass Ave 21 / 12, Martin St 12 / 10, Colby St 15 / 8, Telegraph Ave north of Alcatraz Ave 53 / 8, Benvenue Ave 3 / 5; from the freeway via College Ave 8 / 10, Martin St 24 / 10, Colby St 11 / 8, Hillegass Ave 14 / 5, Benvenue Ave 2 / 3.

### What remains, and the demand that would meet D4

Not all primitives pass (list above), but none of the open ones explains a half-capacity network, and D4 still fails at full demand. The PM peak meets D4 (zero removals, backlog under 2%, arterial speed above 4 m/s) at demand scale 0.4 (seeds 1 to 3: 0 / 0 / 0 removals, backlog 0.0%, 9.1 to 9.5 m/s); at 0.45 it has 0 / 1 / 1 removals, at 0.5 1 / 1 / 3 and at 0.55 6 (seed 1). That is about 11,500 veh/h offered. At full demand the network completes about 13,000 trips an hour but only with queues, removals and a backlog, so the demand tables carry about 2.5 times the load at which the junctions run without a queue. No demand factor was applied in this task. Top bottlenecks at full demand (PM seed 1, blocked lane-hours): 40th St/San Pablo Ave (6.9), 52nd St/Shattuck Ave (6.8), 40th St/West St (5.7), 55th St/MLK Jr Way (5.1), 40th St/Adeline St (5.0), 62nd St/Claremont Ave/College Ave (4.9), and the removals sit on 40th St, MLK Jr Way at 42nd and 45th St, and Hollis St. Mechanisms:

- Signals at the south edge of the model area (40th St, West St, Adeline St, San Pablo Ave) serve gates with 475 to 850 veh/h each and cycle at the 75 s floor with 15 s minimum greens; the area is cut by the extract edge, so the gates push demand straight into them (data and importer, as in the fourth round).
- The SR-24 west-end freeway stubs queue (mean 126 stopped vehicles on the 4-lane mainline link 5121, about 700 trips waiting at each of the two mainline gates). The signal at the end of the ramp link 2371 passes 858 veh/h, and the off-ramp demand there comes from 32,600 ADT (design D9).
- Signal control is still an approximation: no coordination, a 75 s floor on the cycle, and left turns only by gaps and sneakers.
- Demand itself: Telegraph Ave carries 0.6 of the counted flow because its southern gate (559 veh/h offered) has about 300 trips waiting at the end of the run, queued behind the south-edge signals; the share of Telegraph Ave north of Alcatraz Ave among trips onto the Claremont ramps stays at 53% against 8%.

## Third-round state on the narrow network (history)

### Final state, scale 1.0, mean of seeds 1 to 3

| Period | Offered veh/h | Completed trips | Gridlock removals (seeds 1 / 2 / 3) | Backlog | Arterial speed (m/s) | Stable (D4) |
| --- | --- | --- | --- | --- | --- | --- |
| PM peak | 7523 | 5906 | 6 / 12 / 2 (mean 6.7) | 0.7% | 4.45 (10.0 mph) | no (removals) |
| AM peak | 7183 | 5725 | 7 / 2 / 9 (mean 6.0) | 1.4% | 4.62 (10.3 mph) | no (removals) |
| Midday | 4888 | 4424 | 0 / 0 / 0 | 0.0% | 6.98 (15.6 mph) | yes |

Over six seeds the means are 7.5 removals (PM) and 3.3 (AM), so the AM figure above is mostly seed 3. Compared with the start of the third round (PM 9.3, AM 3.3) the removals did not change beyond the seed spread. The reports in `reports/` are seed 1 (PM 5816 completed, 6 removals, 0.8% backlog, 4.26 m/s).

| Headline share | PM modeled | PM observed | AM modeled | Midday modeled | Within +/-10 pp (PM) |
| --- | --- | --- | --- | --- | --- |
| Hillegass NB from freeway | 39 | 47 | 32 | 45 | yes (-8) |
| Colby NB from freeway | 42 | 47 | 32 | 39 | yes (-5) |
| Hillegass SB to freeway | 51 | 68 | 44 | 48 | no (-17) |
| Colby SB to freeway | 50 | 45 | 43 | 53 | yes (+5) |

Mid-block flows (median per direction of travel, veh/h, PM, mean of seeds 1 to 3) against expected peak flows (ADT x 0.09 / 2, or the TMC leg volume), with the ratio in brackets:
Telegraph 1302 N (1.30) / 630 S (0.63) vs about 1000 (TMC legs 1064/1093); College 272 N (0.50) / 450 S (0.83) vs 540 (ADT about 12k, not in the data); Claremont 429 N (0.68) / 801 S (1.26) vs 635 (14.1k ADT used in the demand); Alcatraz 612 E (1.05) / 314 W (0.54) vs about 585 (TMC).
Before the third round: Telegraph 1201 / 628, College 267 / 659, Claremont 345 / 602, Alcatraz 653 / 319.

The via-street shares of freeway traffic that are not gated are further off than the headline shares. In the PM peak (seed 1) 56% of trips onto the freeway reach it via Telegraph north of Alcatraz (observed 8%) and 30% via Colby (observed 8%); from the freeway 18% leave via Martin (observed 10%).

Hillegass SB to freeway (modeled 51, observed 68): the observed value is PM specific. The model's PM demand toward the on-ramps is symmetric between on- and off-ramps (the ramp ADT has no peak-hour direction), the residential gates on the north side offer under about 10 veh/h each (default residential ADT 300 x K 0.09 x scale 0.35), and the on-ramp trips in the model come from the Telegraph gate (533 veh/h), local nodes (484), the Alcatraz gate (226) and the Claremont gate (161). So Hillegass SB carries local trips from the blocks along it, and the share of those that end at an on-ramp is the one set by `ramps.localShare` (0.3), the LODES sector split and the route costs. A direction split by period moved the share by 1 point at the cost of 9 on the northbound share (see above), and `localShare` 0.45 and 0.6 moved it less than the seed spread. No general, documented demand parameter was changed.

### What remains off (third round)

- D4 is not met: PM has 6.7 and AM 6.0 gridlock removals per run (three seeds; 7.5 and 3.3 over six), midday has none. Backlog and arterial speed pass in all three periods. `assumedGateScale` stays at 0.35. The target of 0.7 is out of reach: at 0.5 the PM and AM peaks have about 22 and 25 removals, at 0.7 about 100, and with the non-count gates at zero the PM peak still has 1.8 removals. The load that remains comes from the count-based gates and the ramps.
- The removals concentrate on Telegraph between 55th and 59th, over six seeds in the PM peak: 13 on the southbound link ahead of the Aileen signal, 9 at Aileen/Telegraph, 4 at the 57th stop. Telegraph southbound is the underloaded direction (630 against 1302 northbound). In a queue snapshot at the time of a removal (seed 2) about half of the vehicles on the southbound approach to 56th Street want the left turn onto the EB on-ramp, which crosses a northbound through flow of about 950 veh/h as a permissive left, and the left-turners queue in the through lanes. A protected left phase cut removals at the cost of more lost time elsewhere (see "Tried and not kept") and was not kept.
- D5 is met for three of four headline shares. Hillegass SB to freeway is 17 points below observed.
- Top bottleneck nodes in the PM peak (blocked lane-hours per run, mean of seeds 1 to 3) and what limits each:
  1. Alcatraz/Telegraph (5.5): data. TMC leg volumes of about 1,060 veh/h per leg on 2-lane legs.
  2. 52nd/Claremont/Telegraph (4.7): importer and model. Five approaches, three phases, joined from two nodes.
  3. College/Claremont/62nd (4.6): model. Three phases at a 75 s cycle; each street gets about a fifth of the cycle.
  4. 51st/Telegraph (3.6): model and data. Cross street fed by the SR-24 ramp demand.
  5. Claremont/Colby/Forest (3.4): model. Forest and Colby share one phase.
  6. 56th/Telegraph (3.2): data and model. EB on-ramp left turn against the northbound through flow.
  7. Aileen/Telegraph (3.1): data and model. WB off-ramp demand from 2012 ramp counts, with 61 m of storage on the southbound approach.
  8. Claremont/Hudson (2.7): model and data. On-ramp demand joins the Claremont through flow.
  9. College/Hudson/Manila (2.7): model. Three phases at a minor junction.
  10. Claremont/Clifton (2.6): data and model. Off-ramp, about 1,025 veh/h on a single-lane ramp that widens at the signal.
- Signal control is still an approximation: Webster splits recomputed every 5 min from measured flows, no left-turn phases, no coordination between neighboring signals, and a 15 s minimum green on every phase.
