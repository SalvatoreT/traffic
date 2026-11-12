# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 23445 veh/h x scale 1 = 23445 veh/h. Run took 30.5 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 25 | FAIL |
| Backlog / spawned | < 2% | 1.3% (301 of 23233) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.64 m/s (last 15 min 7.20) | pass |

Overall: **NOT STABLE**. Mean trip delay 191 s, mean trip time 488 s, completed 22452, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2867 | 8 | 1882 | 0 | 8.36 |
| 10 | 3000 | 6 | 3690 | 0 | 8.22 |
| 15 | 3033 | 4 | 5582 | 0 | 8.08 |
| 20 | 3072 | 1 | 7492 | 0 | 7.94 |
| 25 | 3152 | 55 | 9451 | 0 | 7.93 |
| 30 | 3250 | 149 | 11238 | 0 | 7.63 |
| 35 | 3360 | 148 | 13101 | 0 | 7.75 |
| 40 | 3309 | 215 | 15018 | 2 | 7.26 |
| 45 | 3417 | 139 | 16865 | 11 | 7.13 |
| 50 | 3429 | 155 | 18799 | 15 | 7.13 |
| 55 | 3540 | 180 | 20604 | 21 | 7.19 |
| 60 | 3560 | 301 | 22452 | 25 | 7.28 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20439 | 0.04 | 4.2% | 1.123 | 1.080 | 10.5% | 0.4% | 1.056 | 5.5% | 0.0% | 6.8% | 2645 | 16.0% |
| gate to gate | 10488 | 0.07 | 6.3% | 1.124 | 1.093 | 9.5% | 0.1% | 1.055 | 5.1% | 0.0% | 11.2% | 1076 | 13.4% |
| with a local end | 9951 | 0.02 | 2.0% | 1.122 | 1.059 | 11.6% | 0.7% | 1.058 | 5.9% | 0.0% | 2.3% | 1569 | 17.9% |
| guided drivers | 9465 | 0.09 | 8.8% | 1.123 | 1.079 | 10.8% | 0.4% | 1.056 | 5.6% | 0.0% | 6.9% | 1255 | 17.1% |
| other drivers | 10974 | 0.00 | 0.3% | 1.123 | 1.081 | 10.3% | 0.4% | 1.056 | 5.3% | 0.0% | 6.7% | 1389 | 15.1% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (449 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1129 | 11.4 | 3% |
| freeway to the surface gates | 1416 | 15.0 | 3% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1152 | 1% | 11% | 88% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 956 | 1% | 20% | 79% | 0.1 |

## Per-mode results

Offered: 23445 car veh/h; 1500 bicycle flows (1154/h); 2000 pedestrian flows (1991/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3560 | 22452 | 488 | |
| Bicycle | 94 | 1160 | 352 | |
| Pedestrian | 274 | 1925 | 491 | mean crossing delay 6.8 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 513, bicycle conflicts 1584, close passes 1271, pedestrian injury-risk index 0.045, bicycle injury-risk index 0.054 (proxy), mean vehicle speed at pedestrian encounters 2.38 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 134 trips (128 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 213 trips (202 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 188 trips (163 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 327 trips (292 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 69% | +22 | 134 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -32 | 134 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 8% | +2 | 134 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 27% | -0 | 134 |  |
| Colby Street NB | from | freeway | 47% | 72% | +25 | 213 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 7% | -41 | 213 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 20% | -5 | 213 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 213 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 10% | -36 | 188 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 3% | -23 | 188 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 5% | -11 | 188 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 82% | +14 | 188 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 9% | -34 | 327 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 35% | -11 | 327 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 15% | -7 | 327 |  |
| Colby Street SB | to | freeway | 45% | 74% | +29 | 327 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 4% | -30 | 327 |  |

Headline shares within tolerance: 0 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 11% | 981 | 11% | 955 |
| onto freeway | Hillegass Avenue | 12% | 12% | 981 | 13% | 955 |
| onto freeway | Martin Street | 10% | 10% | 981 | 10% | 955 |
| onto freeway | Colby Street | 8% | 20% | 981 | 21% | 955 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 981 | 5% | 955 |
| onto freeway | Benvenue Avenue | 5% | 4% | 981 | 4% | 955 |
| from freeway | College Avenue | 10% | 4% | 1580 | 5% | 1179 |
| from freeway | Martin Street | 10% | 13% | 1580 | 17% | 1179 |
| from freeway | Colby Street | 8% | 9% | 1580 | 13% | 1179 |
| from freeway | Hillegass Avenue | 5% | 6% | 1580 | 8% | 1179 |
| from freeway | Benvenue Avenue | 3% | 1% | 1580 | 2% | 1179 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4208 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 108.37 | 2.05 | 2.0 | 2558 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 48.24 | 36.43 | 36.4 | 479 |
| 4165 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 19.08 | 15.03 | 15.0 | 1411 |
| 4174 | Adeline Street | Secondary | 3 | 185 | signal | 16.12 | 9.85 | 9.9 | 764 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 14.56 | 12.70 | 12.7 | 556 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 13.30 | 1.12 | 1.1 | 1416 |
| 4436 | Ashby Avenue | Primary | 2 | 96 | signal | 9.80 | 7.55 | 7.6 | 413 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 9.28 | 6.51 | 6.5 | 479 |
| 1042 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 7.91 | 6.26 | 6.3 | 650 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 7.81 | 6.00 | 6.0 | 842 |
| 2297 | Telegraph Avenue | Secondary | 2 | 62 | uncontrolled | 7.41 | 7.13 | 7.1 | 444 |
| 4198 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 7.09 | 1.42 | 1.4 | 1840 |
| 1133 | Market Street | Tertiary | 2 | 87 | uncontrolled | 6.68 | 5.73 | 5.7 | 378 |
| 4196 | (unnamed) | Motorway | 2 | 690 | uncontrolled | 6.66 | 0.06 | 0.1 | 1268 |
| 1068 | Adeline Street | Secondary | 4 | 50 | signal | 6.32 | 5.51 | 5.5 | 694 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 6.01 | 0.56 | 75 s: 34/31 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 5.27 | 0.19 | 75 s: 46/19 |
| 454 | Market Street / Stanford Avenue | signal |  | 5.25 | 0.14 | 75 s: 50/15 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 5.05 | 0.69 | 75 s: 25/40 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.99 | 0.04 | 75 s: 28/37 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.66 | 0.04 | 75 s: 23/22/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.44 | 0.09 | 75 s: 34/31 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 3.26 | 0.03 | 75 s: 34/31 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.21 | 0.07 | 75 s: 33/32 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.03 | 0.01 | 75 s: 21/24/15 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.89 | 0.02 | 75 s: 45/20 |
| 487 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.87 | 0.05 | 75 s: 17/48 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 2.73 | 0.17 | 75 s: 49/16 |
| 960 | Telegraph Avenue / Webster Street | signal |  | 2.72 | 0.45 | 75 s: 20/45 |
| 621 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.68 | 0.05 | 75 s: 50/15 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 34 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 31 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 339: 46 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 19 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 455: 25 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 40 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 37: 28 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 37 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 2298 | Telegraph Avenue | Telegraph Avenue | uncontrolled | 15 | 37.9 |
| 2300 | Telegraph Avenue | Telegraph Avenue / Webster Street | signal | 6 | 41.0 |
| 2343 | Telegraph Avenue | Ashby Avenue / Telegraph Avenue | signal | 2 | 43.8 |
| 2323 | Telegraph Avenue | Telegraph Avenue | uncontrolled | 1 | 43.9 |
| 1068 | Adeline Street | Adeline Street / Alcatraz Avenue | signal | 1 | 54.6 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 610 | Grove Shafter Freeway | 299 | 4887 |
| 1688 | Warren Freeway | 2 | 1486 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1157 | 1194 |
| Telegraph | S | 10 | 968 | 1009 |
| College | N | 3 | 407 | 407 |
| College | S | 3 | 582 | 587 |
| Claremont | N | 6 | 588 | 953 |
| Claremont | S | 7 | 824 | 1218 |
| Alcatraz | E | 6 | 512 | 538 |
| Alcatraz | W | 6 | 577 | 618 |
| Hillegass | N | 4 | 94 | 106 |
| Hillegass | S | 4 | 120 | 158 |
| Colby | N | 7 | 122 | 164 |
| Colby | S | 7 | 227 | 232 |
| Martin | E | 2 | 119 | 119 |
| Martin | W | 2 | 184 | 184 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4887 |
| 955 | Telegraph Avenue / Ward Street | 2062 |
| 1688 | Warren Freeway | 1486 |
| 266 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 1028 |
| 771 | Telegraph Avenue | 549 |
| 1774 | Claremont Avenue | 519 |
| 986 | Broadway | 450 |
| 104 | San Pablo Avenue | 403 |
| 283 | Market Street | 385 |
