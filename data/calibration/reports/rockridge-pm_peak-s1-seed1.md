# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 24912 veh/h x scale 1 = 24912 veh/h. Run took 23.0 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 1 | FAIL |
| Backlog / spawned | < 2% | 0.2% (54 of 24798) | pass |
| Arterial mean speed (run) | > 4 m/s | 7.93 m/s (last 15 min 7.68) | pass |

Overall: **NOT STABLE**. Mean trip delay 170 s, mean trip time 466 s, completed 24247, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3039 | 5 | 2088 | 0 | 8.76 |
| 10 | 3102 | 6 | 4065 | 0 | 8.20 |
| 15 | 3175 | 6 | 6112 | 0 | 8.17 |
| 20 | 3216 | 8 | 8124 | 0 | 8.18 |
| 25 | 3326 | 11 | 10100 | 0 | 7.98 |
| 30 | 3415 | 39 | 12038 | 0 | 7.89 |
| 35 | 3407 | 37 | 14099 | 0 | 7.66 |
| 40 | 3464 | 48 | 16098 | 0 | 7.55 |
| 45 | 3483 | 97 | 18138 | 1 | 7.79 |
| 50 | 3375 | 82 | 20244 | 1 | 7.94 |
| 55 | 3418 | 49 | 22250 | 1 | 7.56 |
| 60 | 3537 | 54 | 24247 | 1 | 7.55 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22112 | 0.06 | 5.3% | 1.110 | 1.069 | 8.4% | 0.1% | 1.049 | 4.4% | 0.1% | 6.2% | 2311 | 11.9% |
| gate to gate | 9097 | 0.10 | 8.5% | 1.119 | 1.085 | 8.4% | 0.1% | 1.054 | 5.2% | 0.1% | 10.2% | 677 | 12.0% |
| with a local end | 13015 | 0.03 | 3.0% | 1.104 | 1.054 | 8.3% | 0.2% | 1.046 | 3.9% | 0.1% | 3.4% | 1634 | 11.8% |
| guided drivers | 10188 | 0.12 | 10.9% | 1.110 | 1.067 | 8.4% | 0.1% | 1.048 | 4.4% | 0.1% | 6.4% | 1056 | 12.5% |
| other drivers | 11924 | 0.00 | 0.5% | 1.110 | 1.070 | 8.4% | 0.1% | 1.049 | 4.5% | 0.0% | 6.1% | 1254 | 11.3% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (513 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1372 | 14.3 | 3% |
| freeway to the surface gates | 862 | 11.9 | 2% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1220 | 2% | 18% | 80% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1376 | 2% | 32% | 67% | 0.1 |

## Per-mode results

Offered: 24912 car veh/h; 582 bicycle flows (750/h); 2000 pedestrian flows (1728/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3537 | 24247 | 466 | |
| Bicycle | 42 | 749 | 261 | |
| Pedestrian | 184 | 1629 | 428 | mean crossing delay 8.3 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 315, bicycle conflicts 501, close passes 491, pedestrian injury-risk index 0.046, bicycle injury-risk index 0.066 (proxy), mean vehicle speed at pedestrian encounters 2.36 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 183 trips (170 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 242 trips (228 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 246 trips (224 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 288 trips (264 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 50% | +3 | 183 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 2% | -31 | 183 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 3% | -3 | 183 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 23% | -4 | 183 |  |
| Colby Street NB | from | freeway | 47% | 70% | +23 | 242 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 11% | -37 | 242 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 23% | -2 | 242 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 242 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 8% | -38 | 246 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 4% | -22 | 246 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 6% | -10 | 246 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 52% | -16 | 246 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 33% | -10 | 288 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 16% | -30 | 288 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 28% | +6 | 288 |  |
| Colby Street SB | to | freeway | 45% | 53% | +8 | 288 | within |
| Colby Street SB | to | Forest Street | 34% | 10% | -24 | 288 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 15% | 733 | 18% | 575 |
| onto freeway | Hillegass Avenue | 12% | 16% | 733 | 20% | 575 |
| onto freeway | Martin Street | 10% | 21% | 733 | 26% | 575 |
| onto freeway | Colby Street | 8% | 17% | 733 | 22% | 575 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 20% | 733 | 13% | 575 |
| onto freeway | Benvenue Avenue | 5% | 2% | 733 | 2% | 575 |
| from freeway | College Avenue | 10% | 4% | 1256 | 6% | 842 |
| from freeway | Martin Street | 10% | 16% | 1256 | 25% | 842 |
| from freeway | Colby Street | 8% | 13% | 1256 | 19% | 842 |
| from freeway | Hillegass Avenue | 5% | 6% | 1256 | 9% | 842 |
| from freeway | Benvenue Avenue | 3% | 1% | 1256 | 2% | 842 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 25.67 | 21.61 | 21.6 | 475 |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 16.73 | 0.83 | 0.8 | 1577 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 13.99 | 11.98 | 12.0 | 913 |
| 1001 | Adeline Street | Secondary | 3 | 121 | two_way_stop | 11.76 | 8.86 | 8.9 | 835 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 11.61 | 7.89 | 7.9 | 334 |
| 2037 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 11.37 | 8.86 | 8.9 | 424 |
| 1002 | Adeline Street | Secondary | 3 | 71 | uncontrolled | 10.35 | 8.11 | 8.1 | 838 |
| 999 | Sacramento Street | Tertiary | 2 | 102 | two_way_stop | 9.46 | 6.75 | 6.8 | 870 |
| 4160 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 9.04 | 6.09 | 6.1 | 470 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 7.76 | 4.80 | 4.8 | 419 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 7.64 | 6.27 | 6.3 | 1358 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 7.61 | 6.25 | 6.2 | 842 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 7.59 | 5.76 | 5.8 | 503 |
| 2921 | Russell Street | Residential | 1 | 260 | uncontrolled | 7.40 | 6.15 | 6.1 | 139 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 7.22 | 5.97 | 6.0 | 326 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.58 | 0.07 | 110 s: 34/28/34 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 5.26 | 0.83 | 75 s: 34/31 |
| 446 | Market Street / Stanford Avenue | signal |  | 5.03 | 0.18 | 85 s: 60/15 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 4.08 | 0.03 | 120 s: 36/74 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.73 | 0.02 | 75 s: 26/19/15 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.35 | 0.06 | 75 s: 15/30/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.34 | 0.25 | 75 s: 38/27 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 3.09 | 0.00 | 75 s: 22/43 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.05 | 0.26 | 75 s: 50/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.94 | 0.00 | 75 s: 36/29 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.79 | 0.01 | 75 s: 38/27 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.79 | 0.05 | 75 s: 50/15 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.71 | 0.00 | 75 s: 46/19 |
| 1373 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.70 | 0.06 | 75 s: 29/36 |
| 331 | 52nd Street / Martin Luther King Junior Way | signal |  | 2.70 | 0.01 | 75 s: 40/25 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 34 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 34 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 31 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 446: 60 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 479: 36 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 74 s: Stanford Avenue 1L [4139]
- node 30: 26 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 19 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 3042 | Pine Avenue | Pine Avenue / Russell Street | two_way_stop | 1 | 44.0 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1756 | Claremont Avenue | 43 | 475 |
| 1372 | Domingo Avenue / Russell Street | 2 | 81 |
| 104 | San Pablo Avenue | 1 | 350 |
| 275 | Market Street | 1 | 367 |
| 417 | 58th Street / Market Street | 1 | 27 |
| 648 | 54th Street / Shattuck Avenue | 1 | 10 |
| 885 | Howe Street / Telegraph Avenue | 1 | 12 |
| 943 | Telegraph Avenue / Ward Street | 1 | 1602 |
| 1114 | Chabot Road / Clover Drive | 1 | 32 |
| 1219 | College Avenue | 1 | 251 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1074 | 1116 |
| Telegraph | S | 10 | 898 | 1044 |
| College | N | 3 | 415 | 418 |
| College | S | 3 | 671 | 672 |
| Claremont | N | 6 | 434 | 857 |
| Claremont | S | 7 | 502 | 751 |
| Alcatraz | E | 6 | 382 | 456 |
| Alcatraz | W | 6 | 300 | 323 |
| Hillegass | N | 4 | 120 | 145 |
| Hillegass | S | 4 | 150 | 179 |
| Colby | N | 7 | 160 | 206 |
| Colby | S | 7 | 176 | 190 |
| Martin | E | 2 | 174 | 174 |
| Martin | W | 2 | 266 | 266 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4156 |
| 943 | Telegraph Avenue / Ward Street | 1602 |
| 1672 | Warren Freeway | 1375 |
| 265 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 1093 |
| 763 | Telegraph Avenue | 707 |
| 974 | Broadway | 701 |
| 276 | Martin Luther King Junior Way | 537 |
| 1756 | Claremont Avenue | 475 |
| 1719 | Grove Shafter Freeway | 448 |
