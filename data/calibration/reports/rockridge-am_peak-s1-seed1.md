# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 20110 veh/h x scale 1 = 20110 veh/h. Run took 22.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.1% (14 of 20309) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.82 m/s (last 15 min 8.65) | pass |

Overall: **STABLE**. Mean trip delay 133 s, mean trip time 433 s, completed 20010, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2309 | 0 | 1734 | 0 | 9.53 |
| 10 | 2386 | 0 | 3351 | 0 | 9.36 |
| 15 | 2464 | 4 | 4968 | 0 | 9.02 |
| 20 | 2538 | 7 | 6597 | 0 | 8.53 |
| 25 | 2555 | 7 | 8284 | 0 | 8.70 |
| 30 | 2606 | 6 | 9970 | 0 | 8.87 |
| 35 | 2625 | 3 | 11635 | 0 | 8.74 |
| 40 | 2592 | 1 | 13335 | 0 | 8.58 |
| 45 | 2562 | 1 | 15077 | 0 | 8.69 |
| 50 | 2471 | 1 | 16821 | 0 | 9.11 |
| 55 | 2521 | 2 | 18454 | 0 | 8.61 |
| 60 | 2706 | 14 | 20010 | 0 | 8.22 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 18251 | 0.03 | 2.8% | 1.111 | 1.070 | 9.0% | 0.3% | 1.043 | 4.3% | 0.0% | 6.8% | 2369 | 17.3% |
| gate to gate | 9162 | 0.04 | 4.2% | 1.114 | 1.086 | 7.7% | 0.1% | 1.043 | 3.5% | 0.0% | 10.8% | 862 | 16.0% |
| with a local end | 9089 | 0.01 | 1.3% | 1.107 | 1.044 | 10.3% | 0.5% | 1.043 | 5.2% | 0.0% | 2.7% | 1507 | 18.1% |
| guided drivers | 8419 | 0.06 | 5.7% | 1.112 | 1.073 | 9.2% | 0.3% | 1.044 | 4.4% | 0.0% | 6.9% | 1112 | 17.5% |
| other drivers | 9832 | 0.00 | 0.2% | 1.110 | 1.069 | 8.8% | 0.3% | 1.042 | 4.2% | 0.0% | 6.7% | 1257 | 17.2% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (404 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1105 | 16.8 | 4% |
| freeway to the surface gates | 1063 | 6.4 | 2% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 939 | 0% | 9% | 91% | 0.0 |
| Hillegass Avenue | College Avenue | 3 | S | 1046 | 1% | 16% | 83% | 0.0 |

## Per-mode results

Offered: 20110 car veh/h; 1500 bicycle flows (1061/h); 2000 pedestrian flows (1540/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2706 | 20010 | 433 | |
| Bicycle | 105 | 1064 | 358 | |
| Pedestrian | 197 | 1479 | 486 | mean crossing delay 5.6 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 367, bicycle conflicts 1188, close passes 1126, pedestrian injury-risk index 0.054, bicycle injury-risk index 0.059 (proxy), mean vehicle speed at pedestrian encounters 2.69 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 90 trips (87 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 192 trips (184 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 164 trips (147 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 294 trips (265 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 78% | +31 | 90 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -19 | 90 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 9% | +3 | 90 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 17% | -10 | 90 |  |
| Colby Street NB | from | freeway | 47% | 71% | +24 | 192 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 6% | -42 | 192 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 20% | -5 | 192 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 192 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 12% | -34 | 164 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 3% | -23 | 164 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 4% | -12 | 164 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 71% | +14 | 164 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 17% | -26 | 294 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 14% | -32 | 294 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 26% | +4 | 294 |  |
| Colby Street SB | to | freeway | 45% | 74% | +29 | 294 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 5% | -29 | 294 |  |

Headline shares within tolerance: 0 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 883 | 13% | 863 |
| onto freeway | Hillegass Avenue | 12% | 13% | 883 | 13% | 863 |
| onto freeway | Martin Street | 10% | 13% | 883 | 13% | 863 |
| onto freeway | Colby Street | 8% | 20% | 883 | 21% | 863 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 15% | 883 | 12% | 863 |
| onto freeway | Benvenue Avenue | 5% | 4% | 883 | 4% | 863 |
| from freeway | College Avenue | 10% | 8% | 1343 | 10% | 1102 |
| from freeway | Martin Street | 10% | 13% | 1343 | 16% | 1102 |
| from freeway | Colby Street | 8% | 10% | 1343 | 12% | 1102 |
| from freeway | Hillegass Avenue | 5% | 5% | 1343 | 6% | 1102 |
| from freeway | Benvenue Avenue | 3% | 2% | 1343 | 2% | 1102 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4174 | Adeline Street | Secondary | 3 | 185 | signal | 12.26 | 8.28 | 8.3 | 848 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 10.58 | 9.02 | 9.0 | 653 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 9.50 | 6.71 | 6.7 | 512 |
| 1068 | Adeline Street | Secondary | 4 | 50 | signal | 8.53 | 7.38 | 7.4 | 678 |
| 1042 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 8.10 | 6.68 | 6.7 | 611 |
| 4366 | Claremont Avenue | Secondary | 2 | 113 | signal | 7.89 | 6.13 | 6.1 | 451 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 7.21 | 5.15 | 5.1 | 335 |
| 1125 | Market Street | Secondary | 4 | 36 | signal | 6.70 | 5.98 | 6.0 | 582 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 6.06 | 4.71 | 4.7 | 845 |
| 2061 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 6.05 | 4.40 | 4.4 | 410 |
| 2272 | Telegraph Avenue | Secondary | 2 | 104 | signal | 5.77 | 3.04 | 3.0 | 1963 |
| 3426 | Ashby Avenue | Primary | 1 | 129 | signal | 5.65 | 3.74 | 3.7 | 571 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 5.54 | 4.74 | 4.7 | 104 |
| 1067 | Adeline Street | Secondary | 3 | 132 | uncontrolled | 5.52 | 3.77 | 3.8 | 679 |
| 498 | Sacramento Street | Tertiary | 3 | 55 | signal | 5.48 | 4.38 | 4.4 | 677 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 454 | Market Street / Stanford Avenue | signal |  | 5.13 | 0.16 | 75 s: 50/15 |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 4.76 | 0.32 | 75 s: 27/38 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 4.57 | 0.56 | 75 s: 22/43 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.90 | 0.18 | 75 s: 35/30 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.39 | 0.06 | 75 s: 30/35 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.38 | 0.13 | 75 s: 31/34 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.17 | 0.02 | 75 s: 20/22/18 |
| 487 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.09 | 0.06 | 75 s: 30/35 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.88 | 0.05 | 75 s: 43/22 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.87 | 0.34 | 75 s: 43/22 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.82 | 0.01 | 75 s: 24/21/15 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.77 | 0.02 | 75 s: 47/18 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.50 | 0.02 | 75 s: 34/31 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.46 | 0.10 | 75 s: 24/41 |
| 592 | Adeline Street / Ashby Avenue | signal |  | 2.39 | 0.00 | 75 s: 47/18 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 688: 27 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 38 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 455: 22 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 43 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 339: 35 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 30 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 37: 30 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 35 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 955 | Telegraph Avenue / Ward Street | 11 | 2170 |
| 403 | 65th Street / Shattuck Avenue | 2 | 12 |
| 610 | Grove Shafter Freeway | 1 | 4100 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 928 | 953 |
| Telegraph | S | 10 | 1111 | 1174 |
| College | N | 3 | 290 | 290 |
| College | S | 3 | 388 | 391 |
| Claremont | N | 6 | 600 | 1002 |
| Claremont | S | 7 | 583 | 1056 |
| Alcatraz | E | 6 | 460 | 475 |
| Alcatraz | W | 6 | 373 | 421 |
| Hillegass | N | 4 | 70 | 72 |
| Hillegass | S | 4 | 109 | 121 |
| Colby | N | 7 | 112 | 148 |
| Colby | S | 7 | 182 | 200 |
| Martin | E | 2 | 144 | 144 |
| Martin | W | 2 | 192 | 192 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4100 |
| 955 | Telegraph Avenue / Ward Street | 2170 |
| 1688 | Warren Freeway | 1448 |
| 266 | Ashby Avenue | 1242 |
| 183 | San Pablo Avenue | 1124 |
| 1774 | Claremont Avenue | 520 |
| 104 | San Pablo Avenue | 479 |
| 771 | Telegraph Avenue | 468 |
| 283 | Market Street | 453 |
| 74 | 43rd Street / San Pablo Avenue | 361 |
