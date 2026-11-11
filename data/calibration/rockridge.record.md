# Rockridge baseline calibration record

Run: `cargo run --release -p traffic-sim --bin calibrate -- --area rockridge --period pm_peak --minutes 60 --scale 1.0 --seed 1` (about 5 s).
Reports for the final state are in `reports/` (all three periods). Every value below is an ASSUMPTION unless marked DATA.
Run-to-run noise from the chaotic congested regime is roughly +/-5% on completed trips, so single steps of that size are not significant.
Steps C0 to C3 were measured on the step B2 demand (before F); D, E, F on the later demand. PM peak, scale 1.0, 60 min, seed 1.
Shares are the four headline freeway shares, modeled (PM observed): Hillegass NB from freeway (47), Colby NB from (47), Hillegass SB to (68), Colby SB to (45).

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

Other measurements (final state, PM): the model saturates at about 6.3-6.8k veh/h offered. With non-count gates at zero (6.2k veh/h) the PM peak has 12 removals, 1.3% backlog and 6.4 m/s, so the floor is the unscaled count-based and ramp demand (ramps 3.3k veh/h) plus the junction bottlenecks listed below, not the assumed volumes.

## Final state, scale 1.0, seed 1

| Period | Offered veh/h | Completed trips | Gridlock removals | Backlog | Arterial speed (m/s) | Stable (D4) |
| --- | --- | --- | --- | --- | --- | --- |
| PM peak | 7331 | 5246 | 69 | 5.0% | 3.68 | no |
| AM peak | 6992 | 5867 | 14 | 1.6% | 5.13 | no (removals) |
| Midday | 4761 | 4454 | 4 | 0.0% | 7.66 | no (removals) |

| Headline share | PM modeled | PM observed | AM modeled | Midday modeled | Within +/-10 pp (PM) |
| --- | --- | --- | --- | --- | --- |
| Hillegass NB from freeway | 26 | 47 | 30 | 52 | no |
| Colby NB from freeway | 36 | 47 | 47 | 65 | yes |
| Hillegass SB to freeway | 45 | 68 | 36 | 44 | no |
| Colby SB to freeway | 61 | 45 | 70 | 61 | no (+16) |

Mid-block flows (median per direction, veh/h) against expected peak flows (ADT x 0.09 / 2, or the TMC leg volume), PM:
Telegraph 1039 N / 919 S vs about 1000 (TMC legs 1064/1093): ratio 1.0; College 725 / 569 vs 540 (ADT about 12k, not in the data): 1.3 / 1.05;
Claremont 208 / 400 vs 635 (14.1k ADT used in the demand): 0.33 / 0.63; Alcatraz 498 / 358 vs about 585 (TMC): 0.85 / 0.61.

## What remains off

- D4 is not met: PM has 69 gridlock removals, 5% backlog and 3.7 m/s. The recurring sites are short two-node signal pairs (56th St/Telegraph, Aileen/Telegraph) and the SR-24 ramp approaches, where an 11 m link between two independently timed signals holds one vehicle.
- Lowering non-count volumes does not fix it; the remaining demand is DATA (ramps, Telegraph, Alcatraz, Claremont).
- Hillegass shares stay 20 points below observed, Colby SB 16 points above; the Claremont approach is under-loaded relative to its count-based ADT.
- The non-count gate volumes (`assumedGateScale` 0.3) are low enough that residential gates carry about 90 ADT; this is a stability workaround, not an estimate.
