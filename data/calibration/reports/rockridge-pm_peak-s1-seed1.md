# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 23535 veh/h x scale 1 = 23535 veh/h. Run took 29.0 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 7 | FAIL |
| Backlog / spawned | < 2% | 2.1% (488 of 23074) | FAIL |
| Arterial mean speed (run) | > 4 m/s | 7.87 m/s (last 15 min 7.37) | pass |

Overall: **NOT STABLE**. Mean trip delay 218 s, mean trip time 525 s, completed 22202, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2998 | 10 | 1716 | 2 | 8.45 |
| 10 | 3216 | 38 | 3466 | 2 | 8.44 |
| 15 | 3258 | 41 | 5405 | 2 | 8.64 |
| 20 | 3244 | 74 | 7343 | 2 | 8.26 |
| 25 | 3095 | 264 | 9286 | 3 | 8.26 |
| 30 | 3184 | 262 | 11138 | 4 | 8.12 |
| 35 | 3312 | 235 | 12897 | 5 | 7.66 |
| 40 | 3568 | 300 | 14582 | 5 | 7.32 |
| 45 | 3547 | 473 | 16414 | 5 | 7.50 |
| 50 | 3607 | 384 | 18364 | 7 | 7.74 |
| 55 | 3714 | 258 | 20312 | 7 | 7.32 |
| 60 | 3582 | 488 | 22202 | 7 | 7.06 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20279 | 0.06 | 5.1% | 1.122 | 1.077 | 10.6% | 0.5% | 1.058 | 7.3% | 0.0% | 6.7% | 2317 | 19.5% |
| gate to gate | 10919 | 0.08 | 7.7% | 1.126 | 1.091 | 9.8% | 0.3% | 1.062 | 7.3% | 0.1% | 9.7% | 1061 | 16.2% |
| with a local end | 9360 | 0.02 | 2.0% | 1.116 | 1.043 | 11.5% | 0.7% | 1.054 | 7.4% | 0.0% | 3.2% | 1256 | 22.3% |
| guided drivers | 9390 | 0.11 | 10.6% | 1.122 | 1.078 | 10.6% | 0.5% | 1.058 | 7.1% | 0.0% | 6.8% | 1057 | 19.0% |
| other drivers | 10889 | 0.00 | 0.4% | 1.121 | 1.077 | 10.5% | 0.4% | 1.058 | 7.6% | 0.0% | 6.7% | 1260 | 20.0% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (342 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 984 | 8.5 | 3% |
| freeway to the surface gates | 1392 | 9.9 | 3% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1052 | 2% | 13% | 85% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1160 | 4% | 20% | 77% | 0.1 |

## Per-mode results

Offered: 23535 car veh/h; 1500 bicycle flows (1154/h); 2000 pedestrian flows (1991/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3582 | 22202 | 525 | |
| Bicycle | 124 | 1140 | 362 | |
| Pedestrian | 241 | 1930 | 489 | mean crossing delay 6.4 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 425, bicycle conflicts 1544, close passes 947, pedestrian injury-risk index 0.038, bicycle injury-risk index 0.044 (proxy), mean vehicle speed at pedestrian encounters 2.18 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 91 trips (89 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 113 trips (104 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 164 trips (146 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 172 trips (141 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 68% | +21 | 91 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -31 | 91 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 5% | -1 | 91 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 29% | +2 | 91 |  |
| Colby Street NB | from | freeway | 47% | 40% | -7 | 113 | within |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 10% | -38 | 113 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 35% | +10 | 113 |  |
| Colby Street NB | to | College Avenue | 3% | 16% | +13 | 113 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 23% | -23 | 164 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 13% | -13 | 164 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 18% | +2 | 164 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 60% | -8 | 164 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 12% | -31 | 172 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 33% | -13 | 172 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 34% | +12 | 172 |  |
| Colby Street SB | to | freeway | 45% | 28% | -17 | 172 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 52% | +18 | 172 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 12% | 911 | 13% | 802 |
| onto freeway | Hillegass Avenue | 12% | 12% | 911 | 13% | 802 |
| onto freeway | Martin Street | 10% | 15% | 911 | 16% | 802 |
| onto freeway | Colby Street | 8% | 6% | 911 | 7% | 802 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 15% | 911 | 11% | 802 |
| onto freeway | Benvenue Avenue | 5% | 4% | 911 | 4% | 802 |
| from freeway | College Avenue | 10% | 7% | 1432 | 10% | 935 |
| from freeway | Martin Street | 10% | 12% | 1432 | 18% | 935 |
| from freeway | Colby Street | 8% | 6% | 1432 | 9% | 935 |
| from freeway | Hillegass Avenue | 5% | 5% | 1432 | 7% | 935 |
| from freeway | Benvenue Avenue | 3% | 2% | 1432 | 3% | 935 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4208 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 38.93 | 18.61 | 18.6 | 2315 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 25.18 | 18.10 | 18.1 | 526 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 19.43 | 1.08 | 1.1 | 1606 |
| 315 | Stanford Avenue | Secondary | 2 | 354 | uncontrolled | 16.48 | 8.85 | 8.8 | 1220 |
| 4436 | Ashby Avenue | Primary | 2 | 96 | signal | 16.13 | 14.45 | 14.5 | 286 |
| 4198 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 13.14 | 4.46 | 4.5 | 2154 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 11.97 | 8.88 | 8.9 | 556 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 11.57 | 9.64 | 9.6 | 654 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 11.17 | 10.70 | 10.7 | 58 |
| 225 | 61st Street | Residential | 1 | 137 | two_way_stop | 10.37 | 9.24 | 9.2 | 113 |
| 4190 | 45th Street | Residential | 1 | 363 | uncontrolled | 9.35 | 6.98 | 7.0 | 205 |
| 268 | 59th Street | Residential | 1 | 118 | two_way_stop | 8.86 | 8.03 | 8.0 | 114 |
| 4366 | Claremont Avenue | Secondary | 2 | 113 | signal | 8.83 | 7.72 | 7.7 | 292 |
| 933 | 61st Street | Residential | 1 | 286 | uncontrolled | 8.65 | 6.85 | 6.9 | 190 |
| 3401 | The Uplands | Tertiary | 1 | 311 | uncontrolled | 8.40 | 6.80 | 6.8 | 142 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 5.18 | 0.36 | 75 s: 42/23 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 4.24 | 0.01 | 105 s: 19/15/36/15 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 4.00 | 0.26 | 75 s: 25/40 |
| 454 | Market Street / Stanford Avenue | signal |  | 3.85 | 0.20 | 75 s: 50/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.77 | 0.08 | 75 s: 25/40 |
| 131 | 61st Street / San Pablo Avenue | two_way_stop |  | 3.42 | 0.75 |  |
| 1389 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 3.25 | 0.31 | 75 s: 27/18/16 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 3.21 | 0.31 | 75 s: 50/15 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.16 | 0.04 | 75 s: 41/24 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.15 | 0.07 | 75 s: 30/35 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 2.96 | 0.05 | 75 s: 33/32 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.92 | 0.28 | 75 s: 26/39 |
| 509 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.63 | 0.05 | 75 s: 27/38 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.46 | 0.03 | 75 s: 39/26 |
| 960 | Telegraph Avenue / Webster Street | signal |  | 2.45 | 0.05 | 75 s: 15/17/28 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 42 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 23 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 30: 19 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 15 s: Market Street 2L [772], Market Street 2L [1130]; 36 s: 57th Street 1L [44]; 15 s: 57th Street 1L [1168]
- node 455: 25 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 40 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 37: 25 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 40 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 3478 | Claremont Avenue | Ashby Avenue / Claremont Avenue | signal | 3 | 2.9 |
| 218 | Idaho Street | 59th Street / Idaho Street | two_way_stop | 1 | 4.9 |
| 109 | Stanford Avenue | Marshall Street / Stanford Avenue | uncontrolled | 1 | 24.2 |
| 174 | Marshall Street | Marshall Street / Stanford Avenue | uncontrolled | 1 | 49.5 |
| 0 | Marshall Street | Marshall Street | uncontrolled | 1 | 49.5 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 183 | San Pablo Avenue | 218 | 1358 |
| 610 | Grove Shafter Freeway | 155 | 4835 |
| 955 | Telegraph Avenue / Ward Street | 83 | 1959 |
| 132 | 62nd Street / San Pablo Avenue | 27 | 91 |
| 930 | Dana Street | 2 | 59 |
| 133 | 62nd Street | 1 | 49 |
| 720 | 49th Street / Telegraph Avenue | 1 | 109 |
| 859 | Fairview Street / Shattuck Avenue | 1 | 3 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1080 | 1135 |
| Telegraph | S | 10 | 998 | 1063 |
| College | N | 3 | 264 | 274 |
| College | S | 3 | 431 | 433 |
| Claremont | N | 6 | 577 | 828 |
| Claremont | S | 7 | 661 | 919 |
| Alcatraz | E | 6 | 480 | 520 |
| Alcatraz | W | 6 | 473 | 545 |
| Hillegass | N | 4 | 52 | 71 |
| Hillegass | S | 4 | 140 | 143 |
| Colby | N | 7 | 31 | 47 |
| Colby | S | 7 | 97 | 116 |
| Martin | E | 2 | 158 | 158 |
| Martin | W | 2 | 187 | 187 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4835 |
| 955 | Telegraph Avenue / Ward Street | 1959 |
| 1688 | Warren Freeway | 1490 |
| 183 | San Pablo Avenue | 1358 |
| 266 | Ashby Avenue | 1134 |
| 986 | Broadway | 561 |
| 771 | Telegraph Avenue | 549 |
| 104 | San Pablo Avenue | 434 |
| 1774 | Claremont Avenue | 413 |
| 882 | Colby Street | 367 |
