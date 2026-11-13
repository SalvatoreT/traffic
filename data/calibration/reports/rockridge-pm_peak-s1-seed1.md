# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 24167 veh/h x scale 1 = 24167 veh/h. Run took 45.0 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 3 | FAIL |
| Backlog / spawned | < 2% | 2.7% (627 of 23542) | FAIL |
| Arterial mean speed (run) | > 4 m/s | 6.67 m/s (last 15 min 5.93) | pass |

Overall: **NOT STABLE**. Mean trip delay 253 s, mean trip time 564 s, completed 22175, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3274 | 4 | 1771 | 0 | 7.94 |
| 10 | 3471 | 9 | 3590 | 0 | 7.36 |
| 15 | 3660 | 1 | 5435 | 1 | 6.92 |
| 20 | 3875 | 45 | 7252 | 2 | 6.90 |
| 25 | 3844 | 105 | 9252 | 2 | 7.14 |
| 30 | 3796 | 137 | 11263 | 2 | 6.98 |
| 35 | 3913 | 171 | 13170 | 2 | 6.86 |
| 40 | 3931 | 193 | 15063 | 2 | 6.58 |
| 45 | 4092 | 206 | 16878 | 2 | 6.20 |
| 50 | 4108 | 338 | 18718 | 3 | 6.08 |
| 55 | 4205 | 611 | 20405 | 3 | 5.76 |
| 60 | 4339 | 627 | 22175 | 3 | 5.95 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 19980 | 0.11 | 9.1% | 1.139 | 1.093 | 13.3% | 0.6% | 1.074 | 7.9% | 0.1% | 7.6% | 2658 | 24.8% |
| gate to gate | 10354 | 0.16 | 13.2% | 1.143 | 1.106 | 13.4% | 0.4% | 1.077 | 7.9% | 0.1% | 11.7% | 1074 | 26.8% |
| with a local end | 9626 | 0.05 | 4.8% | 1.135 | 1.075 | 13.2% | 0.8% | 1.071 | 7.9% | 0.0% | 3.3% | 1584 | 23.4% |
| guided drivers | 9248 | 0.22 | 18.7% | 1.140 | 1.092 | 13.5% | 0.6% | 1.076 | 8.2% | 0.0% | 7.5% | 1237 | 25.8% |
| other drivers | 10732 | 0.01 | 0.8% | 1.139 | 1.093 | 13.1% | 0.6% | 1.073 | 7.6% | 0.1% | 7.7% | 1422 | 24.0% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (566 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 951 | 25.4 | 4% |
| freeway to the surface gates | 1303 | 15.7 | 3% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1109 | 1% | 11% | 88% | 0.0 |
| Hillegass Avenue | College Avenue | 3 | S | 987 | 4% | 17% | 79% | 0.2 |

## Per-mode results

Offered: 24167 car veh/h; 1500 bicycle flows (1154/h); 2000 pedestrian flows (1991/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 4339 | 22175 | 564 | |
| Bicycle | 105 | 1170 | 369 | |
| Pedestrian | 250 | 1930 | 493 | mean crossing delay 6.8 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 477, bicycle conflicts 1408, close passes 1158, pedestrian injury-risk index 0.044, bicycle injury-risk index 0.051 (proxy), mean vehicle speed at pedestrian encounters 2.32 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 167 trips (155 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 235 trips (209 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 284 trips (246 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 347 trips (286 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 60% | +13 | 167 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -31 | 167 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 13% | +7 | 167 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 31% | +4 | 167 |  |
| Colby Street NB | from | freeway | 47% | 72% | +25 | 235 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 12% | -36 | 235 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 27% | +2 | 235 |  |
| Colby Street NB | to | College Avenue | 3% | 3% | -0 | 235 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 7% | -39 | 284 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 284 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 5% | -11 | 284 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 73% | +5 | 284 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 19% | -24 | 347 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 23% | -23 | 347 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 33% | +11 | 347 |  |
| Colby Street SB | to | freeway | 45% | 64% | +19 | 347 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 15% | -19 | 347 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 11% | 1072 | 10% | 1030 |
| onto freeway | Hillegass Avenue | 12% | 16% | 1072 | 17% | 1030 |
| onto freeway | Martin Street | 10% | 11% | 1072 | 10% | 1030 |
| onto freeway | Colby Street | 8% | 16% | 1072 | 17% | 1030 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 20% | 1072 | 11% | 1030 |
| onto freeway | Benvenue Avenue | 5% | 3% | 1072 | 3% | 1030 |
| from freeway | College Avenue | 10% | 6% | 1543 | 8% | 1181 |
| from freeway | Martin Street | 10% | 18% | 1543 | 24% | 1181 |
| from freeway | Colby Street | 8% | 10% | 1543 | 13% | 1181 |
| from freeway | Hillegass Avenue | 5% | 4% | 1543 | 6% | 1181 |
| from freeway | Benvenue Avenue | 3% | 2% | 1543 | 2% | 1181 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4208 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 121.88 | 10.36 | 10.4 | 2474 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 55.45 | 44.75 | 44.8 | 485 |
| 4165 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 30.66 | 26.63 | 26.6 | 1063 |
| 4174 | Adeline Street | Secondary | 3 | 185 | signal | 26.58 | 22.36 | 22.4 | 503 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 16.19 | 6.14 | 6.1 | 1061 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 15.98 | 14.31 | 14.3 | 502 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 14.68 | 9.81 | 9.8 | 614 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 13.16 | 10.02 | 10.0 | 272 |
| 3401 | The Uplands | Tertiary | 1 | 311 | uncontrolled | 12.92 | 10.99 | 11.0 | 204 |
| 4421 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 12.39 | 4.42 | 4.4 | 1034 |
| 1042 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 11.57 | 9.83 | 9.8 | 624 |
| 2952 | Russell Street | Residential | 1 | 260 | uncontrolled | 11.18 | 9.35 | 9.4 | 172 |
| 467 | Ashby Avenue | Primary | 2 | 193 | signal | 10.82 | 7.60 | 7.6 | 925 |
| 3426 | Ashby Avenue | Primary | 1 | 129 | signal | 10.25 | 7.99 | 8.0 | 528 |
| 2272 | Telegraph Avenue | Secondary | 2 | 104 | signal | 10.16 | 6.10 | 6.1 | 1704 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 5.93 | 1.15 | 75 s: 33/32 |
| 454 | Market Street / Stanford Avenue | signal |  | 5.53 | 0.31 | 75 s: 50/15 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 5.16 | 0.11 | 75 s: 26/39 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 4.56 | 0.80 | 75 s: 32/33 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 4.19 | 0.04 | 80 s: 24/20/21 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 4.06 | 0.05 | 75 s: 49/16 |
| 487 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.93 | 0.03 | 75 s: 17/48 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 3.80 | 0.28 | 75 s: 25/40 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.64 | 0.32 | 75 s: 31/34 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.48 | 0.09 | 75 s: 40/25 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.26 | 0.03 | 75 s: 32/33 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.24 | 0.06 | 75 s: 15/30/15 |
| 960 | Telegraph Avenue / Webster Street | signal |  | 3.00 | 0.03 | 75 s: 23/42 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 2.96 | 0.16 | 75 s: 46/19 |
| 592 | Adeline Street / Ashby Avenue | signal |  | 2.82 | 0.00 | 75 s: 30/35 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 33 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 32 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 339: 26 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 39 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 455: 32 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 33 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 30: 24 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 20 s: Market Street 2L [772], Market Street 2L [1130]; 21 s: 57th Street 1L [44], 57th Street 1L [1168]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 3478 | Claremont Avenue | Ashby Avenue / Claremont Avenue | signal | 1 | 11.6 |
| 1766 | 52nd Street | 52nd Street | uncontrolled | 1 | 15.3 |
| 3072 | Pine Avenue | Ashby Avenue / Pine Avenue | two_way_stop | 1 | 46.9 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 610 | Grove Shafter Freeway | 550 | 4881 |
| 1774 | Claremont Avenue | 73 | 477 |
| 187 | Harmon Street / Sacramento Street | 1 | 4 |
| 810 | 60th Street / Claremont Avenue / Hillegass Avenue | 1 | 244 |
| 955 | Telegraph Avenue / Ward Street | 1 | 2112 |
| 1389 | Ashby Avenue / Domingo Avenue / Tunnel Road | 1 | 202 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1103 | 1164 |
| Telegraph | S | 10 | 1152 | 1190 |
| College | N | 3 | 401 | 402 |
| College | S | 3 | 742 | 746 |
| Claremont | N | 6 | 436 | 938 |
| Claremont | S | 7 | 816 | 1310 |
| Alcatraz | E | 6 | 510 | 532 |
| Alcatraz | W | 6 | 468 | 509 |
| Hillegass | N | 4 | 92 | 109 |
| Hillegass | S | 4 | 202 | 228 |
| Colby | N | 7 | 118 | 188 |
| Colby | S | 7 | 220 | 236 |
| Martin | E | 2 | 116 | 116 |
| Martin | W | 2 | 317 | 317 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4881 |
| 955 | Telegraph Avenue / Ward Street | 2112 |
| 1688 | Warren Freeway | 1467 |
| 266 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 1081 |
| 771 | Telegraph Avenue | 552 |
| 283 | Market Street | 537 |
| 284 | Martin Luther King Junior Way | 516 |
| 986 | Broadway | 515 |
| 1774 | Claremont Avenue | 477 |
