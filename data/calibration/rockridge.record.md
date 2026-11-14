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

### Owner's scenario check (PM, seeds 1 to 3)

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

D16 (stability): holds in all three periods (PM 0.40, AM 0.00, midday 0.00 per hour). D5 (headline shares within 10 points): holds, mean error 5.4; Hillegass Ave SB is 7 low. The through cars are inside the observed ranges on three blocks and 1 above on Colby St NB. The station rule fails: PM 69% fitted and 62% held out, AM 67% and 70%, midday 77% and 79%, against 85%. So `status` stays `uncalibrated` and `experimentalPeriods` stays `["pm_peak"]`; the assessment suggests none because all periods are stable, and that is the owner's call as in round 21.

### What remains

1. Station fit: 31% of the PM fitted stations fail, 51 of the 80 failures at the 2010 and 2013 intersection counts, low by 15%. The fit's lower bound (median factor 0.10) says the trip table and the count set disagree; a change to the fit (growth from the count year, or the counts' weights) is the next test.
2. The off-ramp split is 899 / 828 against 1,024 / 617; the static fit puts 718 on the Clifton St ramp, and the simulator's loaded costs favor Clifton St by 19 s for south Oakland trips.
3. Claremont Crescent (4 of the 7 removals left) needs the real lane layout of Ashby Ave at Claremont Ave.
4. The Ashby Ave and Claremont Ave slip lane (link 3449) is used by eastbound cars in the model and is missing from the count's leg stations.
5. 63rd St rises 14% in the owner's scenario because the west-side turn-in trips now keep their intent by way of the parallel street. Whether that is wanted is the owner's call.

## Twenty-second round: detour check for assumed flows (change via-detour-fallback)

PM peak, seeds 1 to 10, scale 1.0, 60 minutes. Network c05a22fc9ebe8816 (unchanged). Demand 67f09a8c56c92603 to 8efd5df07ab6557a: volumes identical, each assumed flow now carries `via.maxDetour` and, for 445 of 455 PM flows, one alternative movement. The simulator changed (detour check, alternatives, loop rule). Decisions are in `openspec/changes/archive/*-via-detour-fallback/design.md`.

The owner opened a scenario with modal filters at Martin St and Ayala Ave and at Ayala Ave and Forest St and diverters at 62nd St and Colby St and at 63rd St and Hillegass Ave, and asked why 63rd St got busy. The simulator kept sending assumed-movement trips through their Colby St and Hillegass Ave movements after the diverters cut the way to them, and they looped around 63rd St and Colby St. 63rd St went from 1,073 to 1,556 veh/h (seeds 1 to 3); with every `via` removed from the demand it went up 44. Now a movement is made only while its free-flow route costs at most `maxDetour` (1.3, ASSUMPTION) times the plain route in the current network and adds no loop the plain route does not have; else the driver tries the alternative (the same turn on the parallel street, ASSUMPTION) and then the plain route.

### Baseline

| PM peak, seeds 1 to 10 | Round 21 (same demand file) | After |
| --- | --- | --- |
| Through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB | 111 / 109 / 72 / 149 | 112 / 107 / 73 / 144 |
| Headline shares | 46.8 / 37.0 / 61.7 / 42.6 | 48.0 / 37.9 / 60.7 / 41.9 |
| Study-area through cars | 675 | 671 |
| Removals per hour (PM / AM / midday) | 0.40 / - / - | 1.10 / 0.10 / 0.00 |

The round 21 simulator run on this demand file reproduces the round 21 numbers exactly. The first version of the check used live costs and dropped 24 of the 353 baseline assumed movements per hour (through cars on Colby St NB 136); judging on free-flow costs and ignoring loops that the plain route has too leaves 9 of 353 dropped.

PM removals are 1.10 per hour over seeds 1 to 10 (rule: below 1.0). They sit at hill nodes (Glenwood Glade, Margarido Dr) that assumed trips do not use (4 of about 660 trips per hour through the first node are `via`). Seeds 11 to 20 give 0.40 for the new simulator and 0.60 for the round 21 one; the round 21 simulator at scale 1.001 gives 0.50 on seeds 1 to 10. The ten-seed removal mean moves by this much without any change that touches them, so it is not a measure of the check.

### Owner's scenario, PM peak, seeds 1 to 3

63rd St, all blocks: 1,063 to 1,115 veh/h (was 1,073 to 1,556). Trips of assumed flows with a repeated node, one end inside: 2% to 2% (was 4% to 35%). Through trips on local streets: 574 to 210 per run (was 579 to 363). Displaced traffic goes to Telegraph Ave between 52nd and 58th St (+170 to +250 veh/h in each seed) and, locally, to 61st St, 60th St and McAuley St. The per-block table is in the design.

### What remains

- 10 PM assumed flows (66 veh/h, the southbound turn-ins from the west) have no alternative because their intents name different groups on the two streets.
- A trip with a long route passes the 1.3 tolerance with a detour of several blocks: about 13 trips per run turn onto 63rd St from Telegraph Ave to make the Colby St turn onto Alcatraz Ave. Whether 1.3 of the whole trip is the right tolerance for a block-scale detour is open (ASSUMPTION).
- The PM removal mean of 1.10 on seeds 1 to 10 is noise at remote nodes, but the stability rule reads it as a fail; the owner may want a ruling.

## Twenty-first round: intents of through cars (change through-trip-intents)

Seeds 1 to 10, scale 1.0, 60 minutes. Before: network c05a22fc9ebe8816, demand 259ceb1f64135196 (round 20). After: network c05a22fc9ebe8816 (unchanged), demand 67f09a8c56c92603 (changed). The simulator is unchanged. Decisions are in `openspec/changes/archive/*-through-trip-intents/design.md`.

Owner decision of 2026-11-14. Asked whether to force the five counted Alcatraz Ave turn-ins the way round 20 forced the Colby St northbound left, the owner answered: "Can you try mapping out intent for cut through like Southbound Telegraph cutting through Colby to get to 24 Eastbound. Or Berkeley traffic bypassing College via Hillegass to get to 24, etc." So through cars are explained and shaped by intent: where the driver comes from, where they are going and which arterial they avoid. Part A is a report (the intent map). Part B shapes the demand by intent.

### Result

| PM peak, seeds 1 to 10 | Target | Before (round 20) | After |
| --- | --- | --- | --- |
| Through cars Hillegass Ave SB (observed 79 to 120) | | 24 | 111 |
| Through cars Colby St SB (39 to 117) | | 54 | 109 |
| Through cars Hillegass Ave NB (48 to 95) | | 53 | 72 |
| Through cars Colby St NB (102 to 145) | | 121 | 149 |
| Through cars on all residential and service streets of the study area (no observed counterpart) | | 482 | 675 |
| Whole-street cars Hillegass Ave NB / SB (48 / 79) | | 49 / 14 | 44 / 72 |
| Whole-street cars Colby St NB / SB (102 / 39) | | 82 / 44 | 80 / 48 |
| Headline shares Hillegass Ave NB / Colby St NB from, Hillegass Ave SB / Colby St SB to freeway | 47 / 47 / 68 / 45 | 51.7 / 37.2 / 52.5 / 38.2 | 46.8 / 37.0 / 61.7 / 42.6 |
| Mean headline error, points (D5, within 10) | | 9.2 (3 of 4 within 10) | 4.7 (4 of 4 within 10) |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St (assessment) | 360 | 189 | 259 |
| Counted Alcatraz Ave turns, modeled (counted): Colby St NB left / right | 131 / 32 | 137 / 7 | 138 / 31 |
| Alcatraz Ave onto Colby St SB from the west / east | 76 / 50 | 27 / 20 | 57 / 34 |
| Hillegass Ave NB left / right onto Alcatraz Ave | 43 / 54 | 39 / 13 | 55 / 53 |
| Alcatraz Ave onto Hillegass Ave SB from the west / east | 76 / 98 | 65 / 8 | 79 / 57 |
| 52nd St off-ramp / Clifton St off-ramp, veh/h | 1,024 / 617 | 692 / 990 | 683 / 986 |
| Removals per hour, PM; AM; midday (D16: below 1.0) | below 1 | 0.00; 0.10; 0.00 | 0.40; 0.00; 0.00 |
| Stations below GEH 5, PM fitted (190) / held out (55) | 85% | 67% (128) / 65% (36) | 68% (130) / 62% (34) |
| Stations below GEH 5, AM fitted (153) / held out (47); midday fitted (192) / held out (56) | 85% | 67% / 62%; 77% / 77% | 66% / 64%; 76% / 79% |
| Telegraph Ave NB / SB travel time, s (observed 302 to 420 / 300 to 376) | | 298 / 304 | 299 / 304 |

D5 now holds (all four headline shares within 10 points; Colby St NB from the freeway is 10 points low at 37.0 against 47). The station rule is still not met (68% of the fitted stations below GEH 5 against 85%), so the area stays `uncalibrated`. The three periods hold D16; the PM peak has 4 removals in 10 runs (seeds 2, 5, 9 and 10; two at the Shattuck Ave and 52nd St signal, link 1705, one at Claremont Crescent), against none before. `experimentalPeriods` stays `["pm_peak"]`: the assessment suggests none because all periods are stable, and earlier rounds kept the flag while share and station rules failed. That is a decision for the owner and is not changed here. The AM and midday turn counts were not measured against targets of their own beyond the station fit above.

### Part A: the intent map

`calibrate` (single run and the ten-seed summary) now prints, for the four counted blocks and for all residential and service streets of the study area, the through cars per hour by origin group and destination group, and the arterial each trip would otherwise use: the boundary streets that its shortest free-flow path runs on near the study area when the study area's own residential streets are closed. The groups are data in `approachGroups` of `data/areas/rockridge.json` (20 groups for the 123 gates: Telegraph Ave and College Ave from the north, Alcatraz Ave from the west, SR-24 on-ramps and off-ramps by direction and end, and the other streets of each compass side). Blocks that are not gates take the group of the nearest surface gate, so a group name such as "South-east Oakland" is the name of a gate and its surroundings and not a measured place. The derivation is `tools/lib/approach-groups.ts`, the report is `crates/sim/src/bin/calibrate/intent.rs`.

What the map says about the round 20 state (PM, ten seeds): 482 through veh/h used a residential or service street of the study area, 274 of them on a path that would otherwise be Telegraph Ave, 66 Claremont Ave, 25 Telegraph Ave then Claremont Ave and 24 College Ave then Alcatraz Ave. The largest pairs were SR-24 eastbound off-ramp traffic bound for Berkeley side streets (80), Berkeley side streets bound for the SR-24 westbound on-ramps (45) and for south-east Oakland (40), and the reverse (33). The two counted southbound blocks were short of their observed ranges for a reason the map shows: Hillegass Ave southbound had 24 through cars and almost none of them turned in from Alcatraz Ave (the count has 174 turn-ins and 4 cars coming straight from the north); the model's through cars came down Hillegass Ave from the Berkeley side-street gates.

After shaping by intent: 675 through veh/h on those streets, 386 of them on a path that would otherwise be Telegraph Ave. By destination, 194 veh/h go to the SR-24 westbound on-ramps and 8 to the eastbound on-ramps. That follows the network and the gate totals, not a count: the on-ramp at Hudson St that Colby St and Hillegass Ave reach by way of Claremont Ave is tagged westbound in the network, and the westbound exit gate carries four times the trips of the eastbound one (3,491 and 879 veh/h in the PM demand). No source in the repository splits the freeway-bound cars of these blocks by direction, so "to SR-24 eastbound" is rare in the model and the data neither support nor contradict that.

### What the data say about intent, observed and assumed

Observed (volunteer count of Feb 25, 2025, PM peak; whole streets are the cars that drove from one end to the other):

- Hillegass Ave SB: 178 cars entered at the top (76 turned in from Alcatraz Ave from the west, 98 from the east, 4 came straight from the north), 79 drove the whole street, 40 ended their trip along it, 68% of the block's trips (109 veh/h) were freeway-bound. Via shares: 46% by way of Alcatraz Ave WB, 26% Benvenue Ave, 16% College Ave.
- Colby St SB: 139 entered at the top (76 from the west, 50 from the east, 13 from the north), 39 drove the whole street, 43 ended along it, 45% (72 veh/h) were freeway-bound, 22% came by way of Telegraph Ave.
- Colby St NB: 182 entered at the south end (121 from the southwest of Claremont Ave, 57 from Forest St, 4 from the northeast), 102 drove the whole street, 164 left at Alcatraz Ave (131 left, 32 right, 1 straight), 47% came from a freeway.
- Hillegass Ave NB: 94 entered at the south end, 48 drove the whole street, 109 left at Alcatraz Ave (43 west, 54 east, 12 straight), 47% came from a freeway; 33% went on to Benvenue Ave and 6% to College Ave.

Inferred (ASSUMPTION): the freeway-bound or freeway-origin cars that did not join the street mid-block are the block's freeway trips times entering / (entering + joined mid-block), spread over the turn counts in proportion. That gives 87 veh/h for Hillegass Ave SB (0.50 of the 174 turn-ins), 46 for Colby St SB (0.365 of 126), 65 for Colby St NB (0.40 of the 164 exits) and 40 for Hillegass Ave NB (0.37 of 109). Observed ranges bound them: the low end uses the whole-street share, the high end the unadjusted freeway share. Which approach group the cars belong to within a side of Alcatraz Ave is assumed, except for the 22% of Colby St SB trips that came by way of Telegraph Ave (35 of the 76 turn-ins from the west). No through traffic is placed from the hills onto the northbound streets, because only 4 of the 182 cars entering Colby St at the south end came from the northeast of Claremont Ave.

### The intents, model against implied (PM, ten seeds, veh/h)

One row per intent. "Implied" is the number the counts imply with its range; "before" and "after" are the model's through cars between the same groups on that block (mean of ten seeds). The rows are not independent of the block totals: the through cars of the model that no listed intent covers are the last row of each block.

| Intent | Basis | Implied (range) | Before | After |
| --- | --- | --- | --- | --- |
| Hillegass Avenue SB: through cars 24 before, 111 after | | | | |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED count x ASSUMPTION share | 38 (34 to 48) | 0 | 39 |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED count x ASSUMPTION share | 49 (44 to 62) | 1 | 53 |
| Other through cars, no intent listed | | | 23 | 18 |
| Colby Street SB: through cars 55 before, 109 after | | | | |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED count x ASSUMPTION share | 13 (11 to 20) | 9 | 24 |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED count x ASSUMPTION share | 15 (13 to 23) | 0 | 16 |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED count x ASSUMPTION share | 18 (15 to 29) | 17 | 39 |
| Other through cars, no intent listed | | | 28 | 30 |
| Colby Street NB: through cars 121 before, 149 after | | | | |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED count x ASSUMPTION share | 52 (38 to 62) | 17 | 54 |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION | 29 (19 to 43) | 36 | 51 |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED count x ASSUMPTION share | 13 (9 to 15) | 19 | 18 |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION | 7 (5 to 11) | 13 | 24 |
| Other through cars, no intent listed | | | 36 | 2 |
| Hillegass Avenue NB: through cars 53 before, 72 after | | | | |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED count x ASSUMPTION share | 16 (9 to 20) | 0 | 17 |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED count x ASSUMPTION share | 20 (11 to 25) | 16 | 21 |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION | 3 (0 to 10) | 9 | 8 |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION | 4 (0 to 13) | 22 | 23 |
| Other through cars, no intent listed | | | 6 | 3 |

The southbound intents land inside their ranges where the demand forces them (Hillegass Ave from both sides, Colby St from the west without Telegraph Ave). They are above their range where plain flows between the same groups also use the street: Southbound Telegraph Ave traffic on Colby St is 24 against 13 implied, and College Ave and Berkeley traffic turning onto Colby St is 39 against 18. The northbound south-side intents are above for the same reason (Colby St left 51 against 29, right 24 against 7, Hillegass Ave east 23 against 4). The counted movement volumes are not exceeded by the assumed flows (they are pinned at the stated shares); the modeled turns are above the counts at two movements (Colby St NB left 138 against 131, Hillegass Ave NB left 55 against 43) because plain flows add to the assumed ones.

### Part B: what changed in the demand

- `assumedMovementFlows` movements can carry `intents` (origin group, destination group, share of the count or PM veh/h). Candidates are the seed flows between the two groups whose route through the movement is within 1.3 times their best route and does not loop; the volume is split over them in proportion to their seed volume. Intents of one movement cannot add up to more than its count. Tests: `tools/assumed-movements.test.ts`, `tools/approach-groups.test.ts`, `calibrate/intent.rs`.
- The Colby St northbound left keeps its 131 veh/h and 0.62 through share, now as SR-24 off-ramp traffic 0.40, Telegraph Ave and south-side traffic 0.22 and residents leaving 0.38. Round 20's candidates included Tunnel Rd gates (27 veh/h); the count does not support through traffic from the northeast there, and the intents drop it.
- New movements: Colby St northbound right (32), Hillegass Ave northbound left and right (43, 54), Alcatraz Ave onto Hillegass Ave southbound (76, 98) and onto Colby St southbound (76, 50). PM assumed volume in total: 393 veh/h (260 on the northbound turn-outs with their local shares, 133 freeway-bound turn-ins). Dana St is left out.
- Double counting: the plain flow of each pair that an assumed flow also serves gives up the trips the assumed flow carries before the fit, at most 80% of it (PM 336 veh/h, AM 182, midday 196). The fit rescales plain flows to the counts afterwards, so this is a better starting point. It does not keep a pair's total at its seed value: the south-side intents above show plain flows returning.
- Everything is labeled ASSUMPTION in the config, the fit report (intents table), the demand provenance, `data/demand/README.md` (steps 55 to 58), the targets file and the design.
- D16 held at these volumes, so nothing was backed off.

### Tried and not kept

East side turns by the observed via shares: the Hillegass Ave northbound east turns placed on the Berkeley side-street group (33% of those trips go on to Benvenue Ave, 6% to College Ave) and the Hillegass Ave southbound turn-in from the east split by the 26% and 16% via shares of Benvenue Ave and College Ave. PM, ten seeds: removals 1.3 per hour (13 in total against 4, so D16 fails), headline error 5.6 with 3 of 4 within 10, Hillegass Ave northbound trips reaching College Ave 20.6% (observed 6%) and Benvenue Ave 10.4% (observed 33%), Hillegass Ave southbound from Benvenue Ave 4.8% (observed 26%). The routes to the Berkeley side-street gates use College Ave, so the destination group does not change the observed via shares.

### What did not work, and what remains

1. The via shares of the streets east of Hillegass Ave are not reproduced. Hillegass Ave northbound trips reaching College Ave rose from 6.2% to 16.4% (observed 6%) and those reaching Benvenue Ave stay at 4.1% (observed 33%); Hillegass Ave southbound trips from Benvenue Ave are 4.1% against 26%. The shares that did move toward the data: Hillegass Ave southbound from Alcatraz Ave WB 4.5% to 30.1% (46%), from College Ave 2.0% to 16.4% (16%), Colby St southbound from Alcatraz Ave EB 11.7% to 24.3% (43%) and from WB 8.8% to 15.3% (46%).
2. Where candidates are scarce the intent lands on one pair: the turn-in from the west onto Hillegass Ave has 3 candidate flows and 2 kept, and all 38 veh/h are Telegraph Ave from the north to the SR-24 westbound on-ramps. The intent is honored, the variety of origins is not.
3. Colby St northbound trips from a freeway are 37.0% against 47. The off-ramp intents carry 52 + 13 veh/h through the left and right turns, and plain flows from other origins keep the share down. The Clifton St off-ramp is 986 against 617 and the 52nd St off-ramp 683 against 1,024, unchanged.
4. Colby St northbound through cars are 149 against an upper bound of 145 (the block volume 174 less 29 cars that end along it).
5. The intent map ignores signal delay and turn bans in its alternative path, so it says which arterial is avoided and not what the driver saves. The 400 m and 100 m thresholds of the arterial label are assumptions.
6. Colby St SB and Hillegass Ave NB east-turn intents have no observed origin split beyond the sides of Alcatraz Ave.
7. The proposals file (`data/proposals/rockridge.md`) carries the round 19 demand hash; `explore` has not been rerun.

## Twentieth round: the assumed Colby St left turn, Alcatraz Ave entries, the ramp loop (change calibration-round-20)

Seeds 1 to 10, scale 1.0, 60 minutes. Before: network c05a22fc9ebe8816, demand 9971e748dcad8069. After: network c05a22fc9ebe8816 (unchanged), demand 259ceb1f64135196 (changed). The simulator gained an additive `via` field on demand flows; a demand file without it gives the same results as before (the round 19 demand reproduces 0.30 removals and the shares of that round). Decisions are in `openspec/changes/archive/*-calibration-round-20/design.md`.

### Result

| PM peak, seeds 1 to 10 | Target | Before (round 19) | After |
| --- | --- | --- | --- |
| Colby St NB left onto Alcatraz Ave west / east, veh/h | 131 / 32 | 13 / 7 | 137 / 7 |
| Alcatraz Ave entries at Colby St, Hillegass Ave, Dana St, veh/h | 360 | 136 | 189 |
| 52nd St off-ramp / Clifton St off-ramp, veh/h | 1,024 / 617 | 653 / 1,087 | 692 / 990 |
| Through cars Colby St NB (observed 102 to 145) | | 71 | 121 |
| Through cars Hillegass Ave SB (79 to 120) | | 38 | 24 |
| Through cars Hillegass Ave NB (48 to 95) | | 46 | 53 |
| Through cars Colby St SB (39 to 117) | | 84 | 54 |
| Whole-street cars Colby St NB / SB (102 / 39) | | 72 / 55 | 82 / 44 |
| Whole-street cars Hillegass Ave NB / SB (48 / 79) | | | 49 / 14 |
| Headline shares Hillegass NB / Colby NB from, Hillegass SB / Colby SB to freeway | 47 / 47 / 68 / 45 | 56.8 / 51.8 / 67.3 / 66.4 | 51.7 / 37.2 / 52.5 / 38.2 |
| Mean headline error, points (D5, within 10) | | 9.2 (3 of 4 within 10) | 9.2 (3 of 4 within 10; Hillegass SB is 15.5 low) |
| Removals per hour, PM; AM; midday | below 1 | 0.30; 0.00; 0.00 | 0.00; 0.10; 0.00 |
| Stations below GEH 5, PM fitted (190) / held out (55) | 85% | 65% / 55% | 67% / 65% |
| Telegraph Ave NB / SB travel time, s (observed 302 to 420 / 300 to 376) | | 299 / 299 | 298 / 304 |

D5 still fails (Hillegass Ave SB to the freeway is 15.5 points low) and the station rule is not met, so the area stays `uncalibrated` and `experimentalPeriods` stays `["pm_peak"]`. All three periods hold D16. The AM peak has one removal in seed 4 at 52nd St and Shattuck Ave (link 1662) (the signal approach studied in round 18).

### 1. The Colby St left turn, forced (ASSUMPTION)

Owner decision of 2026-11-14: add an assumed set of trips so the modeled turn matches the 131 counted. The mechanism is `assumedMovementFlows` in the demand config (`tools/lib/assumed-movements.ts`, no street names in code). Candidates are the flows of the seed table whose route through the movement costs at most 1.3 times their best route (the median pair costs 1.20); the 131 veh/h are split over them in proportion to their seed volume, 0.62 over flows with no end in the study area. The share comes from the volunteer count: 102 cars drove the whole of Colby St northbound and 164 left it at Alcatraz Ave, so 62% of the exits are whole-street cars. Result: 52 flows, 81 veh/h through (largest origins the SR-24 gate 602, 32 veh/h, and the two Tunnel Road gates, 14 and 13; largest destinations Ward St, 28, and Ashby Ave, 23) and 50 veh/h local (origins along Colby St and 63rd St at College Ave, mostly bound for the freeway gates and Ward St). The flows carry `via`; the simulator routes the trip to the approach link, through the turn and on, and the fit holds their volume. The modeled turn is 137 against 131; AM 86 against 78, midday 82 against 81. Colby St NB through cars rose from 71 to 121, inside the observed 102 to 145. Labeled an ASSUMPTION in code, config, the fit report, the demand provenance (Sources page), `data/demand/README.md` (steps 51 to 54) and the design.

### 2. Alcatraz Ave entries (136 against 360)

In the fit the three entry links sit at the upper bounds of their flows (Hillegass Ave 43 of 178 after the fit, Colby St 76 of 139, Dana St 10 of 43). The flows that cross them are trips of nodes north of Alcatraz Ave, which since the side rule no longer sit on the boundary corners. The study-area trip-rate factor (4.6 and 6.2, from the volunteer count) applies only to study-area blocks, so those trips are at the unscaled rate; before the side rule the corners were study-area nodes and took the factor by accident, which is where the 325 came from. The count belongs partly to a different set of trips: about 340 of the 360 entries are turns from Alcatraz Ave itself (76 and 50 onto Colby St, 76 and 98 onto Hillegass Ave, about 40 onto Dana St), cars on the arterial that turn in, and about 20 come straight from the streets north. Those turns are counted movements the table cannot reach, the same kind as the Colby St left.

Fix: blocks whose loading node lies outside the study area within 250 m of it take the study-area factor (`local.countCalibration.neighborM`, `neighborScale` 1, ASSUMPTION). Entries 152 to 189 (136 before the round), through cars and whole-street counts on all four blocks moved toward the observed ranges, removals 0.00. Tried (PM, ten seeds; the first row has the assumed left turn only):

| Variant | Entries | PM removals per hour | Headline error, points | Through cars Colby NB / Hillegass SB / Hillegass NB / Colby SB |
| --- | --- | --- | --- | --- |
| No neighbor factor | 152 | 0.20 | 10.2 | 123 / 38 / 48 / 85 |
| 250 m x 1.0 (kept) | 189 | 0.00 | 9.2 | 121 / 24 / 53 / 54 |
| 400 m x 0.5 | 190 | 1.20 | 6.1 | 127 / 42 / 52 / 78 |
| 400 m x 1.0 | 244 | 3.00 | 11.7 | 128 / 29 / 50 / 94 |

The count is not reached. The five Alcatraz Ave turn-ins as assumed movements through the same mechanism (config only, not shipped, needs an owner decision; 337 veh/h of assumed trips): without the neighbor factor entries 365, through cars 130 / 91 / 42 / 101 (Hillegass SB inside 79 to 120), removals 0.20, headline error 9.6 (Hillegass SB 52.4); with it entries 343, through cars 127 / 84 / 42 / 89, removals 1.10, error 10.3. The entries are in the design (D8).

### 3. The ramp split, damped measured-delay loop

`tools/cost-loop.ts` ran with a new objective (`--objective ramp`: keep an iteration only if PM removals stay below 1.0 per hour, the counted off-ramps move toward their counts by at least 25 veh/h and the headline error is within 0.5 points). Results are in `rockridge.cost-loop.md`. Iteration 0 is the baseline (removals 0.00, ramp count error 247 veh/h); iteration 1 (measured delays of iteration 0): removals 7.90, headline error 15.5, ramp count error 352; iteration 2 (successive average, cost gap 0.078, converged): removals 6.90, error 15.1, ramp error 307. The PM peak loses stability in both. In iteration 2, 26 of the 66 removals the seed reports list are at the Ashby Ave and Claremont Ave signal (links 4329 and 3395), the rest at Domingo Ave, Claremont Crescent and the 52nd St approach. Not kept: no delays file ships, and the 52nd St ramp stays at 692 and Clifton St at 990. The loop stops at the first unstable iteration; `--no-stop` (new) let it run the second. Free-flow assignment (BPR alpha 0) and alpha 0.05 give the same split (701 and 1,001 veh/h) and removals of 1.0.

### 4. Colby St SB freeway share, static against simulator

Diagnosed on the round 19 demand plus the assumed turn (static 44.2%, simulator 69.0%, three seeds). The static assignment loads the Colby St SB block with 408 veh/h, of which 216 veh/h are trips between nodes north and far south or west with no freeway end (Regent St to Market St 41, 66th St at Dana St to Lawton Ave 38, Hillegass Ave at Woolsey St to 43rd St 25, and so on) spread over several routes. The simulator's drivers put 46 veh/h of those pairs on the block. The freeway-bound trips are about equal in the two (180 and 129 veh/h). So the static share is lower because its denominator holds long-distance pairs that the simulator sends elsewhere. Probable cause, not tested directly: the volume-delay function of the assignment loads Telegraph Ave and College Ave more than the simulator does (its arterial speed is 9.3 m/s), and the cost loop that would test it destabilizes the PM peak (above). Free-flow costs (alpha 0) did not change the simulator's shares. With the neighbor factor the two agree (static 39.5%, simulator 39.2%; seeds 1 to 3) and the shipped simulator share is 38.2, 6.8 points low. The agreement came from the changed demand, not from a routing fix.

### What remains

1. Hillegass Ave SB: through cars 24 against 79 to 120, whole-street cars 14 against 79, entries 89 against 178, freeway share 52.5 against 68. The counted turn-ins from Alcatraz Ave fix it (D8) with an owner decision; the router sends those cars by Telegraph Ave and Claremont Ave, where the model is too fast (Telegraph Ave NB 298 s against 302 to 420 observed).
2. 52nd St and Clifton St off-ramps 692 and 990 against 1,024 and 617. Measured delays make the PM peak unstable; the share constraints (weight 3) pull freeway trips onto the Colby St and Hillegass Ave side, which the Clifton St ramp serves.
3. Hillegass Ave SB to the freeway 52.5 against 68, Colby St NB from the freeway 37.2 against 47.

## Nineteenth round: through cars on Hillegass Ave and Colby St, the ramp split, the Colby St left turn (change through-cars-and-ramp-split)

Seeds 1 to 10, scale 1.0, 60 minutes. Before: network c05a22fc9ebe8816, demand 7f462d0790a61860. After: network c05a22fc9ebe8816 (unchanged), demand 9971e748dcad8069 (changed). Simulator unchanged. Decisions are in `openspec/changes/archive/*-through-cars-and-ramp-split/design.md`.

### What the data supports

The round 18 "expected through" (block volume times freeway share) is the observed number of freeway-end trips, not a through count: freeway trips that end inside the study area are in the share. The volunteer count gives a better reading. Cars that drove the whole street are through cars (a lower bound); the block volume less the cars whose trip ended along the street is an upper bound. The calibrate report now prints that range.

| PM block | Observed volume | Observed freeway-end trips | Observed through range | Before (round 18), through / freeway-end | After, through / freeway-end |
| --- | --- | --- | --- | --- | --- |
| Hillegass Ave NB | 110 | 52 | 48 to 95 | 42 / 99 | 46 / 99 |
| Colby St NB | 174 | 82 | 102 to 145 | 43 / 170 | 71 / 127 |
| Hillegass Ave SB | 160 | 109 | 79 to 120 | 34 / 104 | 38 / 112 |
| Colby St SB | 160 | 72 | 39 to 117 | 67 / 152 | 84 / 120 |

Are the model's local-end freeway trips plausible? The total of study-area trip ends is: [PBC-TripRates2022] gives 0.94 PM trips per detached dwelling, so the 1,789 ends of the old demand need about 1,900 dwellings, and the study area (0.53 km2) has 1,368 resident workers in LODES. Dwelling counts are not in the data we hold (2020 census block housing units need an API key), so this is a range and not a test. The pairing is not plausible: 72% of destinations and 80% of origins at study-area nodes had a freeway at the other end, above the highest freeway share seen on any counted block (68%). Two causes were found. Census blocks across Alcatraz Ave and Telegraph Ave loaded the boundary corners (study-area nodes) and were scaled up with the study area's blocks, so 100 of 203 veh/h on Colby NB ended at the Colby St and Alcatraz Ave corner and never turned. And the count-implied ends (927 and 940) subtracted only the counted whole streets as through.

### What changed

- Side rule: a block loads only nodes on its own side of the study-area boundary. Offered study-area ends fell from 263 and 216 to 174 and 132.
- Through share of the counted streets (45%, Martin St AM 48%) applied to four uncounted entries (ASSUMPTION): ends 804 and 817. Scale cap 4 to 8.
- Route-share weight 0.5 to 3, whole-street count weight 0.5 to 1.
- Report: observed through range; the old product is called observed freeway-end trips.

| PM peak, seeds 1 to 10 | Target | Before | After |
| --- | --- | --- | --- |
| Headline shares Hillegass NB / Colby NB from, Hillegass SB / Colby SB to freeway | 47 / 47 / 68 / 45 | 52.3 / 74.1 / 56.1 / 64.9 | 56.8 / 51.8 / 67.3 / 66.4 |
| Mean headline error, points (D5, within 10) | | 16.0 | 9.2 (3 of 4 within 10) |
| 52nd St off-ramp / Clifton St off-ramp, veh/h | 1,024 / 617 | 700 / 1,014 | 653 / 1,087 |
| Colby NB left onto Alcatraz west / east, veh/h | 131 / 32 | 11 / 8 | 13 / 7 |
| Colby St whole street NB / SB (observed) | 102 / 39 | | 72 / 55 |
| Alcatraz Ave entries at Colby St and Hillegass Ave | 360 | 325 | 136 |
| Removals per hour (min to max) | below 1 | 0.30 (0 to 1) | 0.30 (0 to 2) |
| Stations below GEH 5, fitted / held out | 85% | 69% / 56% | 65% / 55% |
| AM removals per hour; midday | below 1 | 0.00; 0.00 | 0.00; 0.00 |
| Telegraph Ave NB / SB travel time, s (observed 302 to 420 / 300 to 376) | | 307 / 308 | 299 / 299 |

D5 still fails (Colby St SB to the freeway is 21 points high: the fit's own static share is 44 against the simulator's 66, a routing difference). The station rule is not met. The area stays `uncalibrated`, `experimentalPeriods` stays `["pm_peak"]` (all three periods hold D16 now, but share and station rules fail, so no flag changed).

### The 52nd St and Clifton St ramps

Diagnosed. With the router's free-flow costs the flows from the freeway gates use the 52nd St ramp at 1,014 veh/h and Clifton St at 729 (the static fit: 1,039 and 730). Adding the simulator's measured link delays gives 785 and 951 against 706 and 990 simulated, so the split is the delay on the 52nd St side, and demand is assigned to one mainline gate, not per ramp gate. Fix attempted: measured delays in the fit (one cost-loop step by hand). Ramps 802 and 956 and removals 0.1 with the old weights, but 727 and 1,008 and removals 5.8 per hour with the heavier share weights, so it was not kept. Two or three damped iterations are needed and each rebuild takes 8 minutes; not run.

### The Colby St left turn

Tested and the round 18 conclusion holds, with a reason. The movement costs 19.9 s in the router. Of 6,019 veh/h of freeway-origin flows, 5,466 cost more than 40% above their best route when they use it, and 128 veh/h are within 10% with measured delays. The fit pins 87% of these flows at their bound. Residential cost factor 1.0 in the simulator gave 9 veh/h. Needed: origins and destinations of the 131 left-turners (select-link or plate survey), or travel times on Colby St, to show that drivers see Colby St as cheaper than the router does.

### Tried and not kept

- Cap on the freeway share of study-area ends at 0.5 and 0.7: shares 38 / 35 / 53 / 30 and 39 / 44 / 52 / 31, through cars lower, removals 0.1 and 0.8. Left in the config as `studyEndFreewayCap`, unset.
- Residential cost factor 1.0 or 1.1 in the simulator, old demand: shares 50 / 64 / 52 / 52, removals 1.3 and 1.2.
- Side rule alone (no weights): shares 70 / 75 / 61 / 70, removals 3.4.

### What remains

1. Colby St SB to the freeway 66 against 45 (simulator against the static fit's 44).
2. Alcatraz Ave entries at Colby St and Hillegass Ave: 136 against 360 counted, a regression; the north-side origins now sit beyond the corner and the router prefers other routes. Through on Colby NB 71 against at least 102, Hillegass SB 38 against at least 79.
3. Ramps 653 against 1,024 and 1,087 against 617: damped cost loop.
4. Colby St left turn: data above.

## Eighteenth round: what held the 52nd Street ramp, Colby St left turn (change ramp-discharge-and-through-check)

Seeds 1 to 10, scale 1.0, 60 minutes. Before is the state of the seventeenth round (network c05a22fc9ebe8816, demand 7f462d0790a61860). Network and demand are byte-identical after `npm run data`, so the hashes did not change. Only the simulator changed. Design decisions are in `openspec/changes/archive/*-ramp-discharge-and-through-check/design.md`.

### What limited the ramp

Traces of seed 1 (CAL_TRACE on links 4160, 1749, 1662 and 1652, one-second steps through one signal cycle) show this chain. The ramp (link 4160) had 40 to 56 cars in its left lane and two or three in the right lane. Drivers who sort for the left turn at Shattuck Ave take that lane two links ahead. The cars at the head of the 7 m link behind the signal (1749) waited for room in the marked left lane of the approach (1662), which held six cars, its full length, at the end of every red. The three through lanes of the approach stood empty during their green. The left lane let through about seven cars per 110 s cycle, 231 veh/h, where the count is 342 including U-turns and a protected left in 33.5 s of green can pass 15 or more.

The head of the left lane alternated between rolling up and braking at the line. The room check on the exit lane (link 1652, 32 m, one lane) failed for 3 to 9 s at a time with one or two cars in it. Each vehicle crossing the node held its length plus 2 m on the exit lane until it emerged, and the next vehicle checked the room that was left. Two cars crossing a 12 m left turn hold 13 m of a 32 m link, so the third waited for the first to be 21 m clear. The OSM tags match the network: way 393902217 is `turn:lanes=right|right` (two lanes, both turning right onto 52nd St), way 393902204 is `left|||`, way 307521315 one lane northbound. Signal timing was not the limit (the observed phases of the seventeenth round are in), and gap acceptance was not either: the left turn is protected.

### What changed

With `RESERVE_EXIT_ROOM` false (an ASSUMPTION, `params.rs`) a crossing vehicle no longer reserves exit-lane room. The next vehicle checks the room in front of the lane tail with 2 s of leader motion credited, and a vehicle that finds no physical room on emerging stays in the node. The ramp's mean delay fell from 83 s to 11 s and the left lane no longer stands full.

| PM peak, seeds 1 to 10 | Counted | Before | After |
| --- | --- | --- | --- |
| 52nd St off-ramp, veh/h | 1,024 | 544 | 700 |
| Clifton St off-ramp, veh/h | 617 | 1,216 | 1,014 |
| Eastbound approach at Shattuck Ave, veh/h | 1,427 | 755 | 830 |
| Eastbound left onto Shattuck Ave north, veh/h | 342 | 232 | 211 |
| Colby St, North St to Alcatraz Ave NB, veh/h | 164 | 143 | 139 |
| Colby St NB to Alcatraz Ave west, veh/h | 131 | 10 | 11 |
| Colby St SB to Claremont Ave northeast, veh/h | 75 | 1 | 0 |
| Removals per hour (min to max) | below 1 | 2.30 (1 to 8) | 0.30 (0 to 1) |
| Backlog, seeds under 2% | | 0.19% (10) | 0.06% (10) |
| Arterial speed, m/s | | 7.82 | 9.24 |
| Headline share error, points (D5) | within 10 | 14.0 | 16.0 |
| Stations below GEH 5, fitted (190) | 85% | 115 of 190, 61% | 132 of 190, 69% |
| Stations below GEH 5, held out (55) | 85% | 26 of 55, 47% | 31 of 55, 56% |
| AM peak removals per hour | below 1 | 0.10 | 0.00 |
| Midday removals per hour | below 1 | 0.00 | 0.00 |

The PM peak now holds the stability rule D16 in all ten seeds. The ramp is no longer held by its own signal and approach. The remaining 324 veh/h of the gap and the 397 veh/h excess at Clifton St are a route-choice question: the static assignment of the fit puts about 1,046 on the 52nd St ramp and the simulator's drivers at the freeway gate split differently. The left turn at the signal still passes 211 veh/h against 342 counted. The lane no longer fills, so the count is now set by how many drivers choose the left turn, not by the lane.

Headline shares moved the wrong way: Hillegass Ave NB from the freeway 52.3 (observed 47), Colby St NB from the freeway 74.1 (47), Hillegass Ave SB to the freeway 56.1 (68), Colby St SB to the freeway 64.9 (45). With the ramp open, more freeway traffic uses the Colby St corridor. The PM share rule D5 fails and the station rule is not met, so the status stays `uncalibrated` and PM stays in `experimentalPeriods`. The `calibration.note` in `data/areas/rockridge.json` was updated to the new numbers.

### Tried and not kept

- Crediting a vehicle still crossing with motion at its exit speed once it has emerged, with the room horizon set to the asking vehicle's crossing time: ramp 402 veh/h, removals 4.30 per hour, speed 7.15 m/s.
- The same with a look-ahead of the approach time (at most 4 s) and the tail projection capped at the stop line: ramp 439, removals 5.20.
- Both keep part of the reservation, loaded the network further and did not free the left lane.

### Validation suite and tests

The suite stands at 50 of 59 (49 before). Case c2 (two signals 100 m apart, adaptive plan) now passes at 0.94 of the long-spacing flow and left `KNOWN_DEVIATIONS`. The golden metrics of the two small test networks moved in the third digit and were updated with the reason in `tests.rs`. `npm test` passes.

### Colby St northbound left turn

The turning count at Colby St and Alcatraz Ave (131 veh/h toward west) is already a station in the fit with the volunteer count's route diagram and the StreetLight share (48% of Colby St NB trips leave by Alcatraz Ave west). The fit report shows it at 9 veh/h assigned, 87% of its flows pinned at the upper bound of 10, and the only flows whose path crosses it are two 63rd St entries of 7 to 8 veh/h. A multiplicative fit cannot create flow on a movement that no flow of the table crosses, and the table crosses it with almost nothing because the router prefers other routes. In the seventeenth round the route over Colby St cost 13% more than the one by Telegraph Ave (573 s against 646 s), outside the 8% noise of the assignment and of the drivers. It is not a turn-cost artifact: the left penalty (4 s) applies to the whole route and the node delay constants are the same on every route. After this round the movement is still at 11 veh/h, so the simulator change did not move it.

It cannot be fixed with the data in the repository without making the assignment disagree with the simulator's own router. The data that would fix it: origins and destinations of the trips that turn left from Colby St onto Alcatraz Ave west in the PM peak (a StreetLight select-link or a plate or Bluetooth survey at that movement, with the zones on both ends). With those, flows for the pairs can be added to the trip table and the router's preference for Telegraph Ave tested against them. The count of 75 toward Claremont Ave northeast is a doubtful reading (notes file) and stays at 0.

### Through cars on the counted blocks

The calibrate report has a new section for this, and a `throughCheck` entry in its JSON. A car is through when neither trip end is in the study area (commit 0bea4af). Expected is the observed block volume (median of the volunteer count's blocks, `observedVehPerHour` in the targets file) times the observed freeway share. PM, seed mean over ten seeds:

| Block | Observed volume | Freeway share | Expected through | Modeled through | Modeled trips with a freeway end |
| --- | --- | --- | --- | --- | --- |
| Hillegass Ave NB | 110 | 47% | 52 | 42 | 99 |
| Colby St NB | 174 | 47% | 82 | 43 | 170 |
| Hillegass Ave SB | 160 | 68% | 109 | 34 | 104 |
| Colby St SB | 160 | 45% | 72 | 67 | 152 |

The two kinds of figure differ because most freeway trips on these streets end in the study area and are not through. Colby St NB carries 170 veh/h with a freeway end against an observed 174 x 47% = 82: the corridor carries about twice the freeway traffic that was observed, which matches its headline share of 74 against 47.

### What remains

1. 52nd St off-ramp 700 against 1,024 and Clifton St 1,014 against 617: the split at the freeway gate. Next step is the cost loop on the new baseline (`tools/cost-loop.ts`); it was not run because it rebuilds the demand and the last run (seventeenth round data) did not improve the shares.
2. Headline shares, mean error 16.0 points, Colby St NB and SB to the freeway 27 and 20 points high.
3. Colby St left turn: needs the origin-destination data above.
4. Eastbound left turn at Shattuck Ave and 52nd St: 211 against 342 counted.

## Seventeenth round: published counts, the 52nd Street ramp, Colby St, where local trips load (change ramp-and-colby-calibration)

Decisions D1 to D14 in `openspec/changes/archive/2026-11-13-ramp-and-colby-calibration/design.md`. Seeds 1 to 10, scale 1.0, 60 minutes, initial loading on. Before is the shipped state of the sixteenth round (network fc4e7eac8da330d0, demand a4952df61abc41fd). After: network c05a22fc9ebe8816, demand 7f462d0790a61860 (offered AM 21,567, midday 15,892, PM 24,910 veh/h), and a changed simulator. The validation suite stands at 49 of 59: case b9 (two lanes, 10% left turns) now passes at 818 veh/h per lane against 815 to 1,075, and the new case b12 (a lane of left turns with no opposing traffic) gives 660 veh/h at a green share of 0.5.

### What was found in public documents

| Source | What it holds | Used as |
| --- | --- | --- |
| [CHRCO-EIR2014], Appendix C | Count sheets of 2013-09-19, AM and PM, at 21 intersections around 52nd St; Synchro worksheets with lanes, phases and greens | 9 intersections in the fit; signal timing at Shattuck Ave and 52nd St and at the SR-24 ramps on Martin Luther King Jr Way |
| [SafewayCollege-DEIR2011], appendix | PM demand volumes of 2010-03-16 at 15 intersections around College Ave and Claremont Ave; worksheets | 5 intersections in the fit |
| [ACTC-LOS2014], [ACTC-LOS2018] | Peak-period speeds on Telegraph Ave, Shattuck Ave and College Ave, 2012 to 2018 | travel-time targets in the assessment |
| [TelegraphCS2013] | Bus speeds and computed intersection delays on Telegraph Ave | context only |

The counts corrected three inputs. The 52nd St off-ramp carried 1,024 veh/h in the PM peak hour, where ADT times an assumed K of 0.09 gave 1,278; the Clifton St off-ramp 617 where the ADT gave 972. At Shattuck Ave and 52nd St, 342 of the 1,427 eastbound vehicles turned left or around (24%); the old demand put 44% of that approach on the left turn. Ashby Ave west of Claremont Ave carried a demand volume of 783 eastbound and 649 westbound, where the AADT had given 1,163 and 952.

### Stability, before and after

| Period | Before: removals per hour (min to max) | Before: backlog (seeds under 2%) | Before: arterial speed (m/s) | After: removals per hour (min to max) | After: backlog (seeds under 2%) | After: arterial speed (m/s) | Rule D16 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PM peak | 1.80 (0 to 4) | 0.54% (10 of 10) | 7.60 | 2.30 (1 to 8) | 0.19% (10 of 10) | 7.82 | fails |
| AM peak | 0.10 (0 to 1) | 0.03% (10 of 10) | 9.27 | 0.10 (0 to 1) | 0.03% (10 of 10) | 8.78 | holds |
| Midday | 0.00 | 0.00% (10 of 10) | 9.96 | 0.00 | 0.01% (10 of 10) | 9.85 | holds |

PM fails on removals alone, as before. Per the user's decision of 2026-11-13 no work went into PM stability as such. Completed trips in the PM peak: 24,119 per hour (22,881 before).

### The steps, PM peak, seeds 1 to 10

Each row adds to the one above. Ramp figures are veh/h on the ramp link; the counts are 1,024 (52nd St) and 617 (Clifton St).

| State | Removals per hour | 52nd St off-ramp | Clifton St off-ramp | Eastbound approach at Shattuck Ave (counted 1,427) |
| --- | --- | --- | --- | --- |
| Before | 1.80 | 473 | 1,527 | 590 |
| Counts in the fit, old simulator | 6.10 | 473 | 1,310 | 541 |
| Observed phases at Shattuck Ave and 52nd St (D5) | 5.40 | 400 | 1,358 | 523 |
| Marked left-turn lane holds its link, drivers sort 150 m ahead (D7) | 8.90 | 418 | 1,346 | 534 |
| Turning drivers keep to their side of the road (D7) | 6.00 | 394 | 1,342 | 578 |
| Route costs by turning movement (D8) | 4.20 | 466 | 1,272 | 688 |
| Crosswalk served with the approach beside it (D6) | 4.80 | 551 | 1,201 | 786 |
| Drive-through lanes out of the network, refit (D9) | 5.80 | 563 | 1,237 | 835 |
| Observed phases at the Martin Luther King Jr Way ramps, shared ramp row (D4, D5) | 2.20 | 500 | 1,280 | 682 |
| Local flows may be scaled up to 10 times (D11) | 1.30 | 538 | 1,175 | 736 |
| Local trips start and end along the block (D13), same demand | 2.10 | 588 | 1,126 | 784 |
| Census blocks spread over nearby junctions, refit (D12): after | 2.30 | 544 | 1,216 | 755 |

The second row shows what the counts did to an unchanged simulator: 20 of its 61 removals sat at the Martin Luther King Jr Way ramp signal, where the count puts 1,547 veh/h on a turn across the northbound street that the model ran as a permissive left. The observed timing gives that stream a phase of its own. The removals of the last four rows range over 0 to 8 per seed, so their differences are not significant.

### The 52nd Street off-ramp (A)

| Quantity, PM peak | Counted | Before | After |
| --- | --- | --- | --- |
| 52nd St off-ramp | 1,024 (ADT times K: 1,278) | 473 | 544 |
| Clifton St off-ramp | 617 (ADT times K: 972) | 1,527 | 1,216 |
| Telegraph Ave off-ramp at Aileen St | 621 (ADT times K) | 844 | 908 |
| Martin Luther King Jr Way off-ramp | 1,614 | 1,599 | 1,546 |
| 52nd St on-ramp | 996 | 1,140 | 972 |
| Hudson St on-ramp | 598 | 934 | 794 |
| Eastbound approach at Shattuck Ave | 1,427 | 590 | 755 |
| Eastbound left onto Shattuck Ave north | 302 (and 40 U-turns) | not recorded | 232 |
| Eastbound right onto Shattuck Ave south | 172 | not recorded | 146 |

The static assignment of the fit meets the ramp counts (52nd St 1,046 in the first refit). The simulator does not. The gap at 52nd St fell from 805 to 480 veh/h, 254 of that because the target had been wrong. The gap at Clifton St is 599 against 555 before, measured against the counts. What the traces showed, and what each fix did:

- Left-turners stood at the head of all four lanes of the approach. The link carries a marked left lane, which the simulator treated as a three-car pocket. With D7 the through lanes clear in every green.
- Left-turners waited through the first seconds of their green for pedestrians on the crosswalk they turn over. The crosswalk had been given the phase of the wrong neighbor (D6).
- About 460 veh/h from Shattuck Ave southbound reached 52nd St through a fast-food drive-through lane north of the corner, and cars turning left into it stopped the single northbound lane (D9).
- A link's measured time was one number, so the wait of the left-turn lane made the approach look slow to through drivers (D8).

What is left: the left turn discharges 232 veh/h where 342 were counted. Left-turners fill the marked lane, then the 7 m link behind it and the left lane of the ramp, where the mean delay is 96 s. That delay is measured on the ramp link, which has one movement at its end, so through drivers at the freeway gate still see it and leave by Clifton St and Aileen St. The validation case b12 puts an unopposed left-turn lane at 1,320 veh/h per hour of green, 0.79 of the through lane; at this junction, into a 32 m single-lane block, it reaches about half of that. The next steps are the discharge of a turn into a short exit link, and a route cost that separates the sorted lanes of a link whose queue has spilled back from the link ahead.

### Colby St northbound (B)

| Quantity (PM) | Counted | Before | After |
| --- | --- | --- | --- |
| Colby St, median block NB / SB | 174 / 160 | 155 / 198 | 159 / 206 |
| Hillegass Ave, median block NB / SB | 110 / 168 | 103 / 189 | 99 / 139 |
| Colby St, North St to Alcatraz Ave NB | 164 | 57 | 143 |
| Colby St NB to Alcatraz Ave west | 131 | 5 | 10 |
| Colby St NB to Alcatraz Ave east | 32 | 6 | 14 |
| Colby St SB to Claremont Ave northeast | 75 (doubtful reading) | 0 | 1 |
| Colby St whole street NB / SB | 102 / 39 | 44 / 97 | 120 / 108 |
| Entries from Alcatraz Ave at Colby St and Hillegass Ave | 360 | 313 | 325 |
| Entries from the Telegraph Ave side | 264 | 443 | 440 |
| Cross streets to Telegraph Ave, modeled over counted: 60th / 61st / 62nd / 63rd St | 1 | 1.94 / 1.69 / 1.55 / 1.54 | 2.30 / 1.50 / 1.48 / 1.19 |

The last block now carries 143 against 164, and the whole street northbound 120 against 102. The reason has to be stated plainly: with D12 and D13 trips bound for the corner of Colby St and Alcatraz Ave drive up the block and leave the road along it. The counted cars turned onto Alcatraz Ave, and that left turn is still at 10 against 131. The block is met and the movement is not.

What was tested (D10):

- Observed travel times. Telegraph Ave northbound from 51st St to Russell St took 302 to 420 s in the four monitored years (12.1 to 16.8 mph in the PM peak). The simulator gives 350 s (368 s before). So the model does not run Telegraph Ave faster than it is, and the idea of D39, that drivers find Telegraph Ave slower than the model does, has no support in the data.
- Loaded costs in the router. The simulator routes on measured link times from the first second (the probe run of D27) and updates them every minute; since D8 they are measured per movement. On those times the cheapest route from the freeway to Telegraph Ave north of Alcatraz Ave costs 573 s and the route over Colby St and the left turn 646 s, 13% more (15% more on free-flow times). Loaded times do not bring Colby St closer.
- The router's control constants. They are added on top of measured times that already contain the wait, on every route alike. Without them the route over Colby St is 18% dearer.
- The prior and the bound. The assignment before the fit puts 2 veh/h on the left turn. The fit raises its flows to the bound and reaches 9. With the bound of local flows at 10 (D11) nothing changes for this movement: the trip table holds almost no trip whose near-best route takes the turn.

So the open question is which trips these are. They are not freeway trips kept off Telegraph Ave by congestion. They may be trips to places west along Alcatraz Ave or north of it that the trip table puts elsewhere.

### Arterial travel times, PM peak

| Segment | Free flow (s) | Simulated (s) | Simulated (mph) | Observed (mph), 2012 to 2018 | Observed (s) | Inside the range |
| --- | --- | --- | --- | --- | --- | --- |
| Telegraph Ave NB, 51st St to Russell St | 185 | 350 | 14.5 | 16.8, 14.9, 12.1, 15.1 | 302 to 420 | yes |
| Telegraph Ave SB | 185 | 371 | 13.7 | 16.0, 16.9, 13.5, 16.4 | 300 to 376 | yes |
| Shattuck Ave NB, 51st St to Alcatraz Ave | 127 | 278 | 10.5 | 20.3, 18.2, 16.4, 16.4 | 144 to 178 | no, too slow |
| Shattuck Ave SB | 127 | 246 | 11.8 | 13.2, 18.5, 15.8, 17.3 | 158 to 221 | no, too slow |
| College Ave NB, Miles Ave to Ashby Ave | 135 | 221 | 13.5 | 15.9, 15.5, 10.0, 9.4 | 188 to 318 | yes |
| College Ave SB | 135 | 209 | 14.3 | 11.2, 14.8, 10.2, 11.6 | 202 to 293 | yes |

Shattuck Ave is the new finding: the simulator is 60 to 100 s slower than any monitored year over 1.3 km. In the AM peak Telegraph Ave southbound (331 s against 245 to 285) and Shattuck Ave northbound (180 s against 130 to 160) are too slow as well.

### Where local trips load

The user reported cars that seemed to come out of a modal filter at 63rd St and Hillegass Ave, and decided on 2026-11-13 that local trips load mid-block and that the size of that origin be audited.

| PM peak, interior origins | Before the change | After |
| --- | --- | --- |
| Loading nodes in the model / in the study area | 702 / 37 | 1,101 / 57 |
| Nodes that send out trips in the PM peak | 556 | 882 |
| Largest node (veh/h out) | 519 (Colby St in Berkeley) | 214 (College Ave, Claremont Ave and 62nd St) |
| Share of the ten largest nodes | 28% | 15% |
| 63rd St and Hillegass Ave (veh/h out / in) | 185 / 48 | 97 / 21 |
| Study-area origins, all nodes | 929 | 951 |

The 185 veh/h were a prior of 46 for the four census blocks around the corner (about 236 resident workers and 118 jobs) times 4.1 from the fit. At 0.35 PM departures per detached dwelling [PBC-TripRates2022] they would need about 530 dwellings. It was an artifact of loading each block at one corner (D12). In the simulator a trip with a local end now pulls out from the curb between a quarter and three quarters of the way along a block next to its origin, when the gap rule of gate insertion is met for the vehicle ahead and the one behind, and leaves the road the same way on its last block (D13). It never crossed its origin junction before either; it appeared at the junction's edge. On the same demand the change moved PM removals from 1.30 to 2.10 per hour, the 52nd St ramp from 538 to 588 and the last block of Colby St from 70 to 73, all inside the seed noise except the Colby St block after the refit, as said above.

### Headline shares and count stations, PM

| Share | Observed | Before | After |
| --- | --- | --- | --- |
| Hillegass Ave NB from the freeway | 47 | 71.4 | 51.4 (within 10) |
| Colby St NB from the freeway | 47 | 78.1 | 69.1 |
| Hillegass Ave SB to the freeway | 68 | 73.4 (within 10) | 50.9 |
| Colby St SB to the freeway | 45 | 60.5 | 57.5 |

Mean absolute error 19.1 points before, 14.0 after; one of four within 10 points in both. With the bound change alone (before D12 and D13) the error was 10.7 with two of four within 10.

| Set (GEH below 5, size bands in brackets, mean GEH) | Before | After |
| --- | --- | --- |
| All fitted | 81 (102) of 120, 68% (85%), 4.2 | 115 (137) of 190, 61% (72%), 5.4 |
| All held out | 19 (23) of 31, 61% (74%), 5.8 | 26 (32) of 55, 47% (58%), 5.8 |
| Interior blocks, fitted (89) | 67 (88), 75% (99%), 3.4 | 70 (88), 79% (99%), 3.0 |
| Interior blocks, held out (18) | 14 (18), 78% (100%), 3.1 | 13 (18), 72% (100%), 3.1 |
| Other stations, fitted | 14 (14) of 31, 45%, 6.4 | 45 (49) of 101, 45% (49%), 7.4 |
| Other stations, held out | 5 (5) of 13, 38%, 9.6 | 13 (14) of 37, 35% (38%), 7.2 |

The pooled share fell because the set grew by 70 stations at busy junctions, where the simulator is furthest from the counts: Telegraph Ave at 51st St carries 395 of 1,070 veh/h on its west leg, and the legs between 51st St and 52nd St about half their counts. The interior blocks did not get worse. The cross-validation assessment (demand fitted without the held-out stations) gives 26 of 55 held-out stations below GEH 5 and a mean GEH of 7.2.

### Status under D18

Stability holds in AM and midday and fails in the PM peak on removals; the share rule fails; the station rule is not met. The area stays `uncalibrated`, `experimentalPeriods` is `["pm_peak"]`, midday stays the default. The `calibration.note` reads: "The PM peak still removes about two stuck vehicles per hour, and the 52nd St off-ramp carries 544 veh/h against 1,024 counted."

### Known limits

This list replaces the one of the sixteenth round. Design D14 has the same list with what was newly tried.

1. PM removals (2.30 per hour). Not worked on, by decision. The places of the removals were not traced again in the final state; the observed phasing of Adeline St at Martin Luther King Jr Way and at Alcatraz Ave is not in the two reports read.
2. Permissive left turns enter ahead of queued opposing vehicles (D38 of the earlier change). Unchanged. Case b9 now passes, by lane sorting.
3. The 52nd St off-ramp: 544 against 1,024 counted; Clifton St 1,216 against 617. Narrowed, not closed. Needs the left-turn discharge into a short block and route costs by sorted lane (above).
4. Headline freeway shares: mean error 14.0 points, Colby St NB 22 points high, Hillegass Ave SB 17 low.
5. The left turn from Colby St onto Alcatraz Ave west (10 against 131) and the turn toward Claremont Ave northeast (1 against 75). The last block's volume is met by trips that end on it. 60th St carries 2.3 times its count. Telegraph Ave travel times are ruled out as the cause.
6. Ashby Ave at Claremont Ave: resolved as a data question. The count gives 783 and 649 veh/h; the simulator carries 648 and 681.
7. Claremont Ave north of Ashby Ave: the 2010 count gives the leg (549 entering the junction, 697 leaving); the gate stays a class default.
8. `YIELD_FALLBACK_S` at 90 s. Unchanged.
9. One count day per interior street; the published counts are from 2010 and 2013 with no growth applied.
10. Leave-one-corridor-out cross-validation not run.
11. The U-turn at the gate stub of Dana St at Ward St. Unchanged.
12. New: Shattuck Ave between 51st St and Alcatraz Ave runs 60 to 100 s slow in the PM peak.
13. New: the fit is polarized. Half of the counted flows end at the lower bound and flows that touch no count are scaled to a tenth. Single nodes still rise above their prior (214 veh/h at one corner).
14. New: Telegraph Ave at 51st St and 52nd St carries about half its counted turning volumes in the simulator.

The proposals in `data/proposals` and `public/data/rockridge.proposals.json` belong to the earlier network and demand and are stale by hash; the searches have to be rerun.

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

## Older rounds

The eleventh to fifteenth rounds, the initial-loading note, the tenth round and everything before it (ninth to fourth, sixth, fifth, and the third-round history) are in `rockridge.record-archive.md`, moved unchanged.
