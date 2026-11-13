# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 24912 veh/h x scale 1 = 24912 veh/h. Run took 46.8 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.2% (56 of 24797) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.21 m/s (last 15 min 9.02) | pass |

Overall: **STABLE**. Mean trip delay 145 s, mean trip time 435 s, completed 23830, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 3048 | 4 | 2049 | 0 | 9.53 |
| 10 | 3048 | 5 | 4089 | 0 | 9.06 |
| 15 | 3099 | 12 | 6151 | 0 | 9.28 |
| 20 | 3231 | 8 | 8078 | 0 | 9.24 |
| 25 | 3334 | 8 | 10064 | 0 | 9.31 |
| 30 | 3382 | 13 | 12066 | 0 | 9.19 |
| 35 | 3248 | 6 | 14258 | 0 | 9.25 |
| 40 | 3400 | 8 | 16171 | 0 | 9.24 |
| 45 | 3537 | 16 | 18135 | 0 | 9.34 |
| 50 | 3629 | 23 | 20019 | 0 | 9.23 |
| 55 | 3831 | 27 | 21829 | 0 | 9.12 |
| 60 | 3922 | 56 | 23830 | 0 | 8.72 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 21734 | 0.01 | 1.2% | 1.091 | 1.049 | 5.5% | 0.0% | 1.030 | 2.3% | 0.0% | 5.3% | 2196 | 8.6% |
| gate to gate | 8778 | 0.02 | 2.0% | 1.091 | 1.058 | 4.1% | 0.0% | 1.027 | 2.3% | 0.0% | 8.8% | 650 | 6.5% |
| with a local end | 12956 | 0.01 | 0.7% | 1.090 | 1.046 | 6.4% | 0.0% | 1.033 | 2.3% | 0.0% | 3.0% | 1545 | 9.5% |
| guided drivers | 10016 | 0.03 | 2.6% | 1.089 | 1.049 | 5.4% | 0.0% | 1.029 | 2.2% | 0.0% | 5.3% | 1010 | 8.8% |
| other drivers | 11718 | 0.00 | 0.1% | 1.091 | 1.050 | 5.6% | 0.0% | 1.031 | 2.4% | 0.0% | 5.3% | 1185 | 8.5% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (424 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1312 | 9.0 | 2% |
| freeway to the surface gates | 787 | 7.1 | 2% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1238 | 1% | 16% | 83% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1401 | 1% | 28% | 71% | 0.0 |

## Per-mode results

Offered: 24912 car veh/h; 582 bicycle flows (750/h); 2000 pedestrian flows (1728/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3922 | 23830 | 435 | |
| Bicycle | 44 | 747 | 260 | |
| Pedestrian | 189 | 1625 | 428 | mean crossing delay 8.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 290, bicycle conflicts 443, close passes 497, pedestrian injury-risk index 0.047, bicycle injury-risk index 0.068 (proxy), mean vehicle speed at pedestrian encounters 2.43 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Expected = observed block volume times the observed freeway share of the street (the headline share of the targets file). Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Expected through (veh/h) | Modeled through (veh/h) | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 41 | 106 |
| Colby Street NB | 174 | 47.0% | 82 | 31 | 166 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 37 | 107 |
| Colby Street SB | 160 | 45.0% | 72 | 87 | 151 |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 172 trips (167 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 203 trips (196 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 199 trips (185 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 224 trips (216 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 57% | +10 | 172 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 0% | -33 | 172 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 2% | -4 | 172 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 26% | -1 | 172 |  |
| Colby Street NB | from | freeway | 47% | 75% | +28 | 203 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 10% | -38 | 203 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 15% | -10 | 203 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 203 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 4% | -42 | 199 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 2% | -24 | 199 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 5% | -11 | 199 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 54% | -14 | 199 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 32% | -11 | 224 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 17% | -29 | 224 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 16% | -6 | 224 |  |
| Colby Street SB | to | freeway | 45% | 67% | +22 | 224 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 11% | -23 | 224 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 16% | 698 | 20% | 530 |
| onto freeway | Hillegass Avenue | 12% | 14% | 698 | 18% | 530 |
| onto freeway | Martin Street | 10% | 18% | 698 | 23% | 530 |
| onto freeway | Colby Street | 8% | 18% | 698 | 24% | 530 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 15% | 698 | 8% | 530 |
| onto freeway | Benvenue Avenue | 5% | 2% | 698 | 2% | 530 |
| from freeway | College Avenue | 10% | 5% | 1036 | 6% | 791 |
| from freeway | Martin Street | 10% | 14% | 1036 | 19% | 791 |
| from freeway | Colby Street | 8% | 14% | 1036 | 18% | 791 |
| from freeway | Hillegass Avenue | 5% | 6% | 1036 | 8% | 791 |
| from freeway | Benvenue Avenue | 3% | 1% | 1036 | 1% | 791 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 19.59 | 14.42 | 14.4 | 619 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 8.87 | 7.67 | 7.7 | 556 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 8.19 | 5.27 | 5.3 | 396 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 7.63 | 4.78 | 4.8 | 391 |
| 4150 | Alcatraz Avenue | Tertiary | 1 | 160 | uncontrolled | 7.44 | 4.57 | 4.6 | 379 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 6.87 | 5.64 | 5.6 | 876 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 6.40 | 4.11 | 4.1 | 804 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 6.35 | 5.57 | 5.6 | 1350 |
| 3431 | Claremont Avenue | Secondary | 1 | 82 | all_way_stop | 6.15 | 4.10 | 4.1 | 344 |
| 4329 | Claremont Avenue | Secondary | 2 | 113 | signal | 5.87 | 4.85 | 4.8 | 305 |
| 1092 | (unnamed) | Service | 1 | 110 | uncontrolled | 5.80 | 4.99 | 5.0 | 126 |
| 1051 | Adeline Street | Secondary | 4 | 50 | signal | 5.58 | 4.47 | 4.5 | 1154 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.52 | 3.33 | 3.3 | 1388 |
| 3344 | Domingo Avenue | Residential | 1 | 110 | signal | 5.52 | 3.88 | 3.9 | 588 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 5.41 | 3.87 | 3.9 | 702 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 446 | Market Street / Stanford Avenue | signal |  | 6.17 | 0.12 | 120 s: 86/24 |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.85 | 0.05 | 110 s: 34/28/34 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.22 | 0.09 | 75 s: 32/33 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.63 | 0.04 | 75 s: 21/24/15 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.43 | 0.02 | 75 s: 36/29 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.38 | 0.00 | 75 s: 15/50 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 3.35 | 0.00 | 75 s: 21/44 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.24 | 0.28 | 75 s: 50/15 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.05 | 0.01 | 75 s: 15/30/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.03 | 0.00 | 75 s: 31/34 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.94 | 0.01 | 75 s: 44/21 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.82 | 0.00 | 75 s: 43/22 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.72 | 0.03 | 75 s: 44/21 |
| 1373 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.53 | 0.05 | 75 s: 30/35 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.43 | 0.00 | 75 s: 42/23 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 446: 86 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 24 s: Market Street 4L [1108], Market Street 3L [1111]
- node 680: 34 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 447: 32 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 33 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 30: 21 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 24 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]
- node 185: 36 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 29 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1756 | Claremont Avenue | 37 | 475 |
| 1230 | Avalon Avenue / Claremont Boulevard | 10 | 38 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | 2 | 214 |
| 1373 | Ashby Avenue / Domingo Avenue / Tunnel Road | 2 | 79 |
| 238 | Ashby Avenue / California Street | 1 | 2 |
| 417 | 58th Street / Market Street | 1 | 27 |
| 943 | Telegraph Avenue / Ward Street | 1 | 1602 |
| 1109 | College Avenue / Oak Grove Avenue | 1 | 38 |
| 1219 | College Avenue | 1 | 251 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1147 | 1180 |
| Telegraph | S | 10 | 713 | 750 |
| College | N | 3 | 346 | 346 |
| College | S | 3 | 644 | 644 |
| Claremont | N | 6 | 368 | 671 |
| Claremont | S | 7 | 408 | 640 |
| Alcatraz | E | 6 | 479 | 548 |
| Alcatraz | W | 6 | 392 | 418 |
| Hillegass | N | 4 | 107 | 137 |
| Hillegass | S | 4 | 119 | 139 |
| Colby | N | 7 | 145 | 179 |
| Colby | S | 7 | 156 | 169 |
| Martin | E | 2 | 139 | 139 |
| Martin | W | 2 | 173 | 173 |

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
