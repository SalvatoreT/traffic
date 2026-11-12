# Rockridge baseline calibration record

Run: `cargo run --release -p traffic-sim --bin calibrate -- --area rockridge --period pm_peak --minutes 60 --scale 1.0 --seed 1` (about 5 s on the original small network, about 1 min on the wider network of the fourth round).
Reports for the final state (seed 1) are in `reports/` (all three periods; the wider network of the fourth round). Every value below is an ASSUMPTION unless marked DATA.
Run-to-run noise from the chaotic congested regime is roughly +/-5% on completed trips, so single steps of that size are not significant.
Steps C0 to C3 were measured on the step B2 demand (before F); D, E, F on the later demand. PM peak, scale 1.0, 60 min, seed 1.
Headline shares are the four freeway shares, modeled (PM observed): Hillegass NB from freeway (47), Colby NB from (47), Hillegass SB to (68), Colby SB to (45).
Speeds are in m/s; multiply by 2.237 for mph.
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

PM peak, seed 1 (AM and midday in the reports): cyclists 1,335 trips completed, 254 in the network, mean trip 466 s; pedestrians 2,460 trips completed, 428 in the network, mean trip 497 s, mean crossing delay 8.1 s (9.2 s AM, 5.7 s midday); 471 pedestrian conflicts, 598 bicycle conflicts and 1,055 close passes; mean vehicle speed at pedestrian encounters 1.9 m/s. There are no buses (no transit file). Checks: the numbers in the network are close to offered volume times trip time (pedestrians 3,066/h x 497 s = 423 against 428, cyclists 1,605/h x 466 s = 208 against 254), so nobody is stuck; crossing delays are seconds, not minutes; conflicts and close passes are not zero. Things to read with care: the bicycle count scaling sits at its lower clamp (factor 0.2; the prior is 776 cyclists at Telegraph Ave/Alcatraz Ave against 82 counted), so cyclists there stay about twice the count; the pedestrian count is one intersection; vehicle speeds at crossings reflect the congestion above; the conflict and injury figures are surrogates with no observed counterpart.

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
