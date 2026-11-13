# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 23445 veh/h x scale 1 = 23445 veh/h. Run took 26.2 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.2% (40 of 23497) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.13 m/s (last 15 min 7.54) | pass |

Overall: **STABLE**. Mean trip delay 164 s, mean trip time 463 s, completed 22912, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2788 | 1 | 2003 | 0 | 9.23 |
| 10 | 2851 | 9 | 3871 | 0 | 8.61 |
| 15 | 2890 | 3 | 5761 | 0 | 8.70 |
| 20 | 2935 | 4 | 7661 | 0 | 8.50 |
| 25 | 3122 | 2 | 9569 | 0 | 8.37 |
| 30 | 3257 | 1 | 11414 | 0 | 7.96 |
| 35 | 3326 | 37 | 13281 | 0 | 7.90 |
| 40 | 3264 | 64 | 15251 | 0 | 8.06 |
| 45 | 3200 | 21 | 17246 | 0 | 8.00 |
| 50 | 3260 | 3 | 19170 | 0 | 7.87 |
| 55 | 3364 | 0 | 21016 | 0 | 7.53 |
| 60 | 3421 | 40 | 22912 | 0 | 7.21 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20863 | 0.04 | 4.0% | 1.113 | 1.076 | 9.0% | 0.3% | 1.047 | 4.1% | 0.0% | 6.8% | 2723 | 14.8% |
| gate to gate | 10803 | 0.06 | 6.0% | 1.115 | 1.087 | 8.1% | 0.1% | 1.045 | 3.5% | 0.0% | 10.9% | 1160 | 11.6% |
| with a local end | 10060 | 0.02 | 1.8% | 1.112 | 1.052 | 10.0% | 0.6% | 1.049 | 4.6% | 0.0% | 2.3% | 1563 | 17.2% |
| guided drivers | 9643 | 0.09 | 8.2% | 1.114 | 1.076 | 9.2% | 0.3% | 1.048 | 4.3% | 0.0% | 6.6% | 1280 | 15.2% |
| other drivers | 11220 | 0.00 | 0.3% | 1.113 | 1.076 | 8.8% | 0.3% | 1.046 | 3.8% | 0.0% | 6.9% | 1444 | 14.5% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (460 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1164 | 8.0 | 2% |
| freeway to the surface gates | 1492 | 19.8 | 4% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1246 | 1% | 9% | 91% | 0.0 |
| Hillegass Avenue | College Avenue | 3 | S | 977 | 2% | 20% | 79% | 0.1 |

## Per-mode results

Offered: 23445 car veh/h; 1500 bicycle flows (1154/h); 2000 pedestrian flows (1991/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3421 | 22912 | 463 | |
| Bicycle | 97 | 1156 | 351 | |
| Pedestrian | 264 | 1944 | 491 | mean crossing delay 6.2 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 492, bicycle conflicts 1448, close passes 1225, pedestrian injury-risk index 0.049, bicycle injury-risk index 0.055 (proxy), mean vehicle speed at pedestrian encounters 2.53 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 136 trips (130 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 233 trips (223 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 223 trips (193 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 281 trips (260 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 68% | +21 | 136 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -32 | 136 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 10% | +4 | 136 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 26% | -1 | 136 |  |
| Colby Street NB | from | freeway | 47% | 76% | +29 | 233 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 7% | -41 | 233 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 18% | -7 | 233 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 233 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 11% | -35 | 223 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 223 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 7% | -9 | 223 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 78% | +10 | 223 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 11% | -32 | 281 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 28% | -18 | 281 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 20% | -2 | 281 |  |
| Colby Street SB | to | freeway | 45% | 75% | +30 | 281 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 8% | -26 | 281 |  |

Headline shares within tolerance: 0 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 11% | 947 | 10% | 922 |
| onto freeway | Hillegass Avenue | 12% | 15% | 947 | 15% | 922 |
| onto freeway | Martin Street | 10% | 8% | 947 | 8% | 922 |
| onto freeway | Colby Street | 8% | 19% | 947 | 20% | 922 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 947 | 6% | 922 |
| onto freeway | Benvenue Avenue | 5% | 4% | 947 | 4% | 922 |
| from freeway | College Avenue | 10% | 3% | 1468 | 4% | 1169 |
| from freeway | Martin Street | 10% | 13% | 1468 | 16% | 1169 |
| from freeway | Colby Street | 8% | 11% | 1468 | 14% | 1169 |
| from freeway | Hillegass Avenue | 5% | 5% | 1468 | 7% | 1169 |
| from freeway | Benvenue Avenue | 3% | 1% | 1468 | 1% | 1169 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4208 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 50.16 | 1.36 | 1.4 | 2473 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 23.16 | 14.36 | 14.4 | 713 |
| 1042 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 11.84 | 10.34 | 10.3 | 440 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 10.86 | 9.01 | 9.0 | 811 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 10.68 | 0.60 | 0.6 | 1457 |
| 4165 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 10.45 | 7.89 | 7.9 | 1492 |
| 4421 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 10.14 | 3.45 | 3.4 | 1160 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 9.63 | 6.53 | 6.5 | 510 |
| 4436 | Ashby Avenue | Primary | 2 | 96 | signal | 9.23 | 7.00 | 7.0 | 450 |
| 4174 | Adeline Street | Secondary | 3 | 185 | signal | 8.74 | 6.99 | 7.0 | 325 |
| 467 | Ashby Avenue | Primary | 2 | 193 | signal | 8.28 | 6.00 | 6.0 | 862 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 7.73 | 6.17 | 6.2 | 271 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 7.43 | 5.88 | 5.9 | 808 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 7.08 | 5.94 | 5.9 | 128 |
| 1019 | Adeline Street | Secondary | 3 | 71 | uncontrolled | 7.01 | 5.90 | 5.9 | 430 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 454 | Market Street / Stanford Avenue | signal |  | 5.41 | 0.18 | 75 s: 50/15 |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 5.16 | 0.47 | 75 s: 28/37 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 4.69 | 0.19 | 75 s: 41/24 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 4.61 | 0.71 | 75 s: 26/39 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.77 | 0.03 | 75 s: 24/21/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.60 | 0.06 | 75 s: 33/32 |
| 487 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.45 | 0.02 | 75 s: 15/50 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 3.37 | 0.04 | 75 s: 48/17 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.19 | 0.20 | 75 s: 35/30 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.09 | 0.01 | 75 s: 21/24/15 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.08 | 0.06 | 75 s: 40/25 |
| 960 | Telegraph Avenue / Webster Street | signal |  | 2.86 | 0.05 | 75 s: 34/31 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 2.80 | 0.01 | 75 s: 22/43 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.75 | 0.04 | 75 s: 35/30 |
| 621 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.70 | 0.05 | 75 s: 50/15 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 688: 28 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 37 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 339: 41 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 24 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 455: 26 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 39 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 30: 24 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 21 s: Market Street 2L [772], Market Street 2L [1130]; 15 s: 57th Street 1L [44], 57th Street 1L [1168]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 610 | Grove Shafter Freeway | 38 | 4887 |
| 1688 | Warren Freeway | 2 | 1486 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1204 | 1236 |
| Telegraph | S | 10 | 1092 | 1162 |
| College | N | 3 | 378 | 379 |
| College | S | 3 | 557 | 558 |
| Claremont | N | 6 | 618 | 1048 |
| Claremont | S | 7 | 853 | 1222 |
| Alcatraz | E | 6 | 467 | 476 |
| Alcatraz | W | 6 | 503 | 548 |
| Hillegass | N | 4 | 91 | 102 |
| Hillegass | S | 4 | 144 | 185 |
| Colby | N | 7 | 133 | 194 |
| Colby | S | 7 | 194 | 202 |
| Martin | E | 2 | 98 | 98 |
| Martin | W | 2 | 198 | 198 |

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
