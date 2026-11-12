# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 20721 veh/h x scale 1 = 20721 veh/h. Run took 21.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (5 of 20701) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.56 m/s (last 15 min 8.34) | pass |

Overall: **STABLE**. Mean trip delay 142 s, mean trip time 436 s, completed 20456, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2483 | 5 | 1679 | 0 | 8.81 |
| 10 | 2579 | 1 | 3308 | 0 | 8.75 |
| 15 | 2588 | 1 | 5011 | 0 | 8.92 |
| 20 | 2564 | 4 | 6769 | 0 | 8.76 |
| 25 | 2495 | 15 | 8549 | 0 | 8.74 |
| 30 | 2508 | 0 | 10259 | 0 | 8.82 |
| 35 | 2565 | 0 | 11954 | 0 | 8.63 |
| 40 | 2554 | 2 | 13637 | 0 | 8.26 |
| 45 | 2752 | 1 | 15204 | 0 | 8.10 |
| 50 | 2691 | 5 | 16961 | 0 | 8.03 |
| 55 | 2613 | 30 | 18735 | 0 | 8.69 |
| 60 | 2672 | 5 | 20456 | 0 | 8.31 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 18729 | 0.02 | 2.3% | 1.110 | 1.071 | 8.1% | 0.3% | 1.037 | 3.4% | 0.0% | 6.9% | 2224 | 13.4% |
| gate to gate | 9480 | 0.03 | 3.2% | 1.112 | 1.088 | 6.7% | 0.1% | 1.035 | 2.8% | 0.0% | 10.9% | 887 | 11.5% |
| with a local end | 9249 | 0.02 | 1.5% | 1.107 | 1.044 | 9.6% | 0.5% | 1.039 | 4.0% | 0.0% | 2.7% | 1338 | 14.7% |
| guided drivers | 8552 | 0.05 | 5.0% | 1.110 | 1.072 | 8.0% | 0.3% | 1.037 | 3.3% | 0.0% | 6.6% | 1045 | 13.1% |
| other drivers | 10177 | 0.00 | 0.1% | 1.110 | 1.071 | 8.3% | 0.2% | 1.037 | 3.5% | 0.0% | 7.0% | 1180 | 13.7% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (377 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1044 | 11.1 | 3% |
| freeway to the surface gates | 1298 | 16.4 | 4% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 946 | 1% | 9% | 90% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 944 | 2% | 13% | 85% | 0.1 |

## Per-mode results

Offered: 20721 car veh/h; 1500 bicycle flows (1061/h); 2000 pedestrian flows (1540/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2672 | 20456 | 436 | |
| Bicycle | 111 | 1068 | 356 | |
| Pedestrian | 203 | 1446 | 483 | mean crossing delay 5.6 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 318, bicycle conflicts 1455, close passes 1372, pedestrian injury-risk index 0.051, bicycle injury-risk index 0.060 (proxy), mean vehicle speed at pedestrian encounters 2.59 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 86 trips (84 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 187 trips (183 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 105 trips (95 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 251 trips (235 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 71% | +24 | 86 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -20 | 86 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 3% | -3 | 86 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 14% | -13 | 86 |  |
| Colby Street NB | from | freeway | 47% | 75% | +28 | 187 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 6% | -42 | 187 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 23% | -2 | 187 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 187 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 18% | -28 | 105 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 105 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 10% | -6 | 105 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 60% | +3 | 105 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 6% | -37 | 251 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 17% | -29 | 251 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 15% | -7 | 251 |  |
| Colby Street SB | to | freeway | 45% | 71% | +26 | 251 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 14% | -20 | 251 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 8% | 771 | 7% | 752 |
| onto freeway | Hillegass Avenue | 12% | 9% | 771 | 9% | 752 |
| onto freeway | Martin Street | 10% | 11% | 771 | 11% | 752 |
| onto freeway | Colby Street | 8% | 19% | 771 | 19% | 752 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 8% | 771 | 7% | 752 |
| onto freeway | Benvenue Avenue | 5% | 2% | 771 | 2% | 752 |
| from freeway | College Avenue | 10% | 5% | 1405 | 5% | 1195 |
| from freeway | Martin Street | 10% | 14% | 1405 | 17% | 1195 |
| from freeway | Colby Street | 8% | 7% | 1405 | 9% | 1195 |
| from freeway | Hillegass Avenue | 5% | 4% | 1405 | 5% | 1195 |
| from freeway | Benvenue Avenue | 3% | 2% | 1405 | 2% | 1195 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4208 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 38.23 | 19.51 | 19.5 | 2141 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 28.99 | 20.36 | 20.4 | 540 |
| 4165 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 15.19 | 11.14 | 11.1 | 1457 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 13.14 | 11.27 | 11.3 | 562 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 10.37 | 0.66 | 0.7 | 1436 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 9.21 | 7.30 | 7.3 | 785 |
| 2061 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 8.69 | 6.85 | 6.8 | 385 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 8.42 | 7.55 | 7.6 | 104 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 8.22 | 5.86 | 5.9 | 454 |
| 341 | San Pablo Avenue | Primary | 2 | 75 | uncontrolled | 8.12 | 6.07 | 6.1 | 792 |
| 1125 | Market Street | Secondary | 4 | 36 | signal | 7.10 | 6.48 | 6.5 | 460 |
| 778 | Martin Luther King Junior Way | Secondary | 4 | 32 | signal | 6.49 | 5.42 | 5.4 | 1457 |
| 2272 | Telegraph Avenue | Secondary | 2 | 104 | signal | 5.79 | 3.07 | 3.1 | 1906 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 5.61 | 3.31 | 3.3 | 1310 |
| 1068 | Adeline Street | Secondary | 4 | 50 | signal | 5.41 | 4.59 | 4.6 | 742 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 454 | Market Street / Stanford Avenue | signal |  | 5.35 | 0.06 | 110 s: 85/15 |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 5.12 | 0.43 | 75 s: 32/33 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.62 | 0.48 | 75 s: 43/22 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 4.47 | 0.16 | 75 s: 23/42 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 4.02 | 0.11 | 75 s: 25/40 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.28 | 0.07 | 75 s: 32/33 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.27 | 0.02 | 75 s: 29/16/15 |
| 487 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.06 | 0.03 | 75 s: 17/48 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.86 | 0.09 | 75 s: 50/15 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.85 | 0.12 | 75 s: 44/21 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.70 | 0.01 | 75 s: 35/30 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.67 | 0.01 | 75 s: 43/22 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.65 | 0.07 | 75 s: 28/37 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.64 | 0.00 | 75 s: 22/23/15 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 2.34 | 0.01 | 75 s: 44/21 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 454: 85 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 688: 32 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 33 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 339: 43 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 22 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 455: 23 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 42 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 37: 25 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 40 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 266 | Ashby Avenue | 4 | 1242 |
| 859 | Fairview Street / Shattuck Avenue | 1 | 2 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 910 | 938 |
| Telegraph | S | 10 | 899 | 958 |
| College | N | 3 | 253 | 254 |
| College | S | 3 | 250 | 252 |
| Claremont | N | 6 | 630 | 1034 |
| Claremont | S | 7 | 534 | 923 |
| Alcatraz | E | 6 | 367 | 379 |
| Alcatraz | W | 6 | 340 | 380 |
| Hillegass | N | 4 | 66 | 79 |
| Hillegass | S | 4 | 73 | 89 |
| Colby | N | 7 | 107 | 150 |
| Colby | S | 7 | 155 | 174 |
| Martin | E | 2 | 113 | 113 |
| Martin | W | 2 | 226 | 226 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4075 |
| 955 | Telegraph Avenue / Ward Street | 2174 |
| 183 | San Pablo Avenue | 1393 |
| 1688 | Warren Freeway | 1374 |
| 266 | Ashby Avenue | 1242 |
| 104 | San Pablo Avenue | 593 |
| 1774 | Claremont Avenue | 520 |
| 283 | Market Street | 510 |
| 771 | Telegraph Avenue | 467 |
| 74 | 43rd Street / San Pablo Avenue | 357 |
