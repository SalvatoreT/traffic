# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 20030 veh/h x scale 1 = 20030 veh/h. Run took 24.6 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (2 of 20146) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.98 m/s (last 15 min 8.72) | pass |

Overall: **STABLE**. Mean trip delay 126 s, mean trip time 423 s, completed 19901, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2278 | 3 | 1733 | 0 | 9.96 |
| 10 | 2273 | 3 | 3401 | 0 | 9.48 |
| 15 | 2379 | 4 | 4964 | 0 | 9.20 |
| 20 | 2387 | 2 | 6624 | 0 | 9.02 |
| 25 | 2466 | 1 | 8267 | 0 | 9.01 |
| 30 | 2424 | 3 | 9878 | 0 | 8.73 |
| 35 | 2533 | 3 | 11500 | 0 | 9.05 |
| 40 | 2524 | 1 | 13189 | 0 | 8.71 |
| 45 | 2513 | 22 | 14849 | 0 | 8.54 |
| 50 | 2558 | 2 | 16562 | 0 | 8.91 |
| 55 | 2496 | 4 | 18296 | 0 | 8.69 |
| 60 | 2592 | 2 | 19901 | 0 | 8.56 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 18241 | 0.04 | 3.4% | 1.106 | 1.066 | 9.0% | 0.1% | 1.041 | 4.2% | 0.0% | 6.1% | 2209 | 18.1% |
| gate to gate | 9273 | 0.05 | 4.9% | 1.108 | 1.080 | 7.5% | 0.0% | 1.041 | 3.2% | 0.0% | 9.2% | 817 | 15.3% |
| with a local end | 8968 | 0.02 | 1.8% | 1.104 | 1.044 | 10.5% | 0.2% | 1.041 | 5.2% | 0.0% | 2.9% | 1392 | 19.8% |
| guided drivers | 8475 | 0.07 | 6.9% | 1.106 | 1.066 | 8.9% | 0.2% | 1.041 | 4.3% | 0.0% | 5.8% | 1012 | 18.2% |
| other drivers | 9766 | 0.00 | 0.3% | 1.106 | 1.066 | 9.0% | 0.1% | 1.041 | 4.1% | 0.0% | 6.3% | 1197 | 18.0% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (403 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1206 | 13.7 | 3% |
| freeway to the surface gates | 1182 | 10.0 | 2% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 897 | 1% | 10% | 90% | 0.0 |
| Hillegass Avenue | College Avenue | 3 | S | 990 | 1% | 14% | 85% | 0.1 |

## Per-mode results

Offered: 20030 car veh/h; 1500 bicycle flows (1061/h); 2000 pedestrian flows (1540/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2592 | 19901 | 423 | |
| Bicycle | 107 | 1075 | 358 | |
| Pedestrian | 202 | 1475 | 481 | mean crossing delay 7.6 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 267, bicycle conflicts 1262, close passes 1258, pedestrian injury-risk index 0.052, bicycle injury-risk index 0.062 (proxy), mean vehicle speed at pedestrian encounters 2.58 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 142 trips (141 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 181 trips (175 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 132 trips (119 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 253 trips (234 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 73% | +26 | 142 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -19 | 142 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 3% | -3 | 142 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 15% | -12 | 142 |  |
| Colby Street NB | from | freeway | 47% | 80% | +33 | 181 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 4% | -44 | 181 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 16% | -9 | 181 |  |
| Colby Street NB | to | College Avenue | 3% | 0% | -3 | 181 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 11% | -35 | 132 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 132 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 5% | -11 | 132 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 70% | +13 | 132 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 13% | -30 | 253 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 253 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 24% | +2 | 253 |  |
| Colby Street SB | to | freeway | 45% | 72% | +27 | 253 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 9% | -25 | 253 |  |

Headline shares within tolerance: 0 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 11% | 828 | 11% | 795 |
| onto freeway | Hillegass Avenue | 12% | 10% | 828 | 10% | 795 |
| onto freeway | Martin Street | 10% | 15% | 828 | 16% | 795 |
| onto freeway | Colby Street | 8% | 19% | 828 | 20% | 795 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 13% | 828 | 8% | 795 |
| onto freeway | Benvenue Avenue | 5% | 4% | 828 | 4% | 795 |
| from freeway | College Avenue | 10% | 5% | 1368 | 6% | 1126 |
| from freeway | Martin Street | 10% | 14% | 1368 | 17% | 1126 |
| from freeway | Colby Street | 8% | 10% | 1368 | 12% | 1126 |
| from freeway | Hillegass Avenue | 5% | 8% | 1368 | 9% | 1126 |
| from freeway | Benvenue Avenue | 3% | 2% | 1368 | 2% | 1126 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4174 | Adeline Street | Secondary | 3 | 185 | signal | 14.02 | 10.00 | 10.0 | 780 |
| 4421 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 13.55 | 5.58 | 5.6 | 967 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 10.41 | 9.01 | 9.0 | 511 |
| 1067 | Adeline Street | Secondary | 3 | 132 | uncontrolled | 10.04 | 8.52 | 8.5 | 467 |
| 1068 | Adeline Street | Secondary | 4 | 50 | signal | 9.98 | 9.06 | 9.1 | 468 |
| 1042 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 7.67 | 6.40 | 6.4 | 518 |
| 2061 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 7.21 | 5.40 | 5.4 | 300 |
| 4181 | Alcatraz Avenue | Tertiary | 1 | 160 | uncontrolled | 7.09 | 4.62 | 4.6 | 398 |
| 1125 | Market Street | Secondary | 4 | 36 | signal | 6.90 | 6.11 | 6.1 | 601 |
| 3776 | (unnamed) | Motorway | 1 | 344 | uncontrolled | 6.88 | 2.11 | 2.1 | 431 |
| 1019 | Adeline Street | Secondary | 3 | 71 | uncontrolled | 6.82 | 5.30 | 5.3 | 617 |
| 2327 | Telegraph Avenue | Secondary | 2 | 104 | signal | 6.70 | 4.07 | 4.1 | 1574 |
| 498 | Sacramento Street | Tertiary | 3 | 55 | signal | 6.15 | 5.00 | 5.0 | 659 |
| 2272 | Telegraph Avenue | Secondary | 2 | 104 | signal | 5.99 | 3.23 | 3.2 | 2009 |
| 1066 | Adeline Street | Secondary | 4 | 43 | signal | 5.91 | 4.89 | 4.9 | 616 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 454 | Market Street / Stanford Avenue | signal |  | 4.86 | 0.13 | 75 s: 50/15 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 4.70 | 0.75 | 75 s: 24/41 |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 4.35 | 0.41 | 75 s: 23/42 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.39 | 0.11 | 75 s: 35/30 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.29 | 0.05 | 75 s: 26/39 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 3.22 | 0.03 | 75 s: 46/19 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.17 | 0.01 | 75 s: 25/20/15 |
| 487 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.72 | 0.09 | 75 s: 39/26 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.54 | 0.08 | 75 s: 50/15 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.53 | 0.03 | 75 s: 50/15 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.51 | 0.11 | 75 s: 17/48 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.50 | 0.04 | 75 s: 45/20 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.44 | 0.01 | 75 s: 24/21/15 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 2.43 | 0.01 | 75 s: 39/26 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.19 | 0.01 | 75 s: 50/15 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 455: 24 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 41 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 688: 23 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 42 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 185: 35 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1179]; 30 s: Sacramento Street 3L [1053], Sacramento Street 3L [1054]
- node 37: 26 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 39 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 403 | 65th Street / Shattuck Avenue | 1 | 16 |
| 536 | Shattuck Avenue / Woolsey Street | 1 | 4 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 904 | 942 |
| Telegraph | S | 10 | 965 | 1020 |
| College | N | 3 | 253 | 254 |
| College | S | 3 | 318 | 319 |
| Claremont | N | 6 | 636 | 1008 |
| Claremont | S | 7 | 446 | 906 |
| Alcatraz | E | 6 | 370 | 388 |
| Alcatraz | W | 6 | 343 | 362 |
| Hillegass | N | 4 | 106 | 125 |
| Hillegass | S | 4 | 82 | 100 |
| Colby | N | 7 | 126 | 156 |
| Colby | S | 7 | 170 | 193 |
| Martin | E | 2 | 154 | 154 |
| Martin | W | 2 | 199 | 199 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4119 |
| 955 | Telegraph Avenue / Ward Street | 2191 |
| 1688 | Warren Freeway | 1460 |
| 266 | Ashby Avenue | 1242 |
| 183 | San Pablo Avenue | 1145 |
| 283 | Market Street | 522 |
| 104 | San Pablo Avenue | 468 |
| 771 | Telegraph Avenue | 467 |
| 1774 | Claremont Avenue | 357 |
| 1735 | Grove Shafter Freeway | 298 |
