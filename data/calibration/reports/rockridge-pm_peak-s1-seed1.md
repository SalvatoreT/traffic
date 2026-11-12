# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 23667 veh/h x scale 1 = 23667 veh/h. Run took 29.1 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 2 | FAIL |
| Backlog / spawned | < 2% | 0.6% (144 of 23401) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.29 m/s (last 15 min 7.70) | pass |

Overall: **NOT STABLE**. Mean trip delay 182 s, mean trip time 485 s, completed 19895, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1752 | 1 | 250 | 0 | 10.89 |
| 10 | 2614 | 1 | 1347 | 0 | 9.47 |
| 15 | 2947 | 7 | 2986 | 0 | 8.92 |
| 20 | 3119 | 36 | 4785 | 0 | 8.86 |
| 25 | 3190 | 87 | 6670 | 0 | 8.69 |
| 30 | 3242 | 119 | 8612 | 0 | 8.17 |
| 35 | 3242 | 71 | 10527 | 0 | 7.86 |
| 40 | 3265 | 135 | 12344 | 0 | 7.79 |
| 45 | 3425 | 71 | 14187 | 0 | 8.23 |
| 50 | 3446 | 115 | 16092 | 1 | 7.94 |
| 55 | 3402 | 141 | 18030 | 1 | 7.69 |
| 60 | 3504 | 144 | 19895 | 2 | 7.48 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 19895 | 0.04 | 3.5% | 1.110 | 1.068 | 9.0% | 0.1% | 1.045 | 5.6% | 0.0% | 6.2% | 2116 | 17.0% |
| gate to gate | 10828 | 0.06 | 5.3% | 1.114 | 1.081 | 8.2% | 0.1% | 1.048 | 5.5% | 0.0% | 9.2% | 1098 | 14.0% |
| with a local end | 9067 | 0.01 | 1.4% | 1.105 | 1.040 | 10.1% | 0.2% | 1.041 | 5.7% | 0.0% | 2.5% | 1019 | 20.3% |
| guided drivers | 9164 | 0.08 | 7.4% | 1.109 | 1.067 | 9.1% | 0.2% | 1.045 | 5.6% | 0.0% | 6.1% | 982 | 17.0% |
| other drivers | 10731 | 0.00 | 0.2% | 1.110 | 1.069 | 9.0% | 0.1% | 1.045 | 5.6% | 0.0% | 6.3% | 1134 | 17.0% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (253 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1099 | 6.1 | 2% |
| freeway to the surface gates | 1378 | 10.6 | 4% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1032 | 1% | 12% | 87% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1110 | 2% | 16% | 82% | 0.1 |

## Per-mode results

Offered: 23667 car veh/h; 1500 bicycle flows (1154/h); 2000 pedestrian flows (1991/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3504 | 19895 | 485 | |
| Bicycle | 117 | 1029 | 363 | |
| Pedestrian | 269 | 1616 | 478 | mean crossing delay 6.7 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 398, bicycle conflicts 1517, close passes 799, pedestrian injury-risk index 0.040, bicycle injury-risk index 0.045 (proxy), mean vehicle speed at pedestrian encounters 2.22 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 70 trips (66 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 64 trips (62 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 118 trips (105 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 120 trips (107 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 54% | +7 | 70 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 4% | -29 | 70 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 3% | -3 | 70 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 34% | +7 | 70 |  |
| Colby Street NB | from | freeway | 47% | 36% | -11 | 64 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 19% | -29 | 64 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 28% | +3 | 64 |  |
| Colby Street NB | to | College Avenue | 3% | 9% | +6 | 64 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 26% | -20 | 118 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 19% | -7 | 118 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 19% | +3 | 118 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 64% | -4 | 118 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 13% | -30 | 120 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 18% | -28 | 120 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 34% | +12 | 120 |  |
| Colby Street SB | to | freeway | 45% | 32% | -12 | 120 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 47% | +13 | 120 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 13% | 809 | 13% | 691 |
| onto freeway | Hillegass Avenue | 12% | 10% | 809 | 12% | 691 |
| onto freeway | Martin Street | 10% | 14% | 809 | 15% | 691 |
| onto freeway | Colby Street | 8% | 6% | 809 | 7% | 691 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 13% | 809 | 12% | 691 |
| onto freeway | Benvenue Avenue | 5% | 4% | 809 | 5% | 691 |
| from freeway | College Avenue | 10% | 7% | 1400 | 8% | 998 |
| from freeway | Martin Street | 10% | 12% | 1400 | 17% | 998 |
| from freeway | Colby Street | 8% | 5% | 1400 | 7% | 998 |
| from freeway | Hillegass Avenue | 5% | 3% | 1400 | 5% | 998 |
| from freeway | Benvenue Avenue | 3% | 2% | 1400 | 3% | 998 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4208 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 29.14 | 12.08 | 12.1 | 2399 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 18.07 | 1.04 | 1.0 | 1612 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 15.18 | 8.69 | 8.7 | 751 |
| 315 | Stanford Avenue | Secondary | 2 | 354 | uncontrolled | 15.10 | 8.19 | 8.2 | 1321 |
| 4436 | Ashby Avenue | Primary | 2 | 96 | signal | 14.70 | 13.00 | 13.0 | 329 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 11.92 | 11.16 | 11.2 | 71 |
| 4198 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 10.63 | 2.80 | 2.8 | 2502 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 9.64 | 7.54 | 7.5 | 845 |
| 738 | 56th Street | Residential | 1 | 243 | two_way_stop | 9.02 | 8.43 | 8.4 | 76 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 8.03 | 5.62 | 5.6 | 524 |
| 3401 | The Uplands | Tertiary | 1 | 311 | uncontrolled | 7.89 | 6.68 | 6.7 | 167 |
| 1092 | Aileen Street | Residential | 1 | 248 | two_way_stop | 7.03 | 6.09 | 6.1 | 91 |
| 225 | 61st Street | Residential | 1 | 137 | two_way_stop | 6.91 | 5.99 | 6.0 | 127 |
| 4140 | Stanford Avenue | Secondary | 2 | 90 | signal | 6.90 | 5.04 | 5.0 | 420 |
| 338 | San Pablo Avenue | Primary | 3 | 37 | two_way_stop | 6.85 | 4.89 | 4.9 | 1284 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 4.77 | 0.26 | 75 s: 28/37 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 4.06 | 0.31 | 75 s: 26/39 |
| 454 | Market Street / Stanford Avenue | signal |  | 3.71 | 0.22 | 75 s: 49/16 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.67 | 0.01 | 75 s: 13/14/13/14 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.66 | 0.09 | 75 s: 25/40 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 3.17 | 0.05 | 75 s: 37/28 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 3.12 | 0.17 | 75 s: 37/28 |
| 1389 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.94 | 0.28 | 75 s: 30/15/15 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.86 | 0.09 | 75 s: 28/37 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.75 | 0.04 | 75 s: 40/25 |
| 131 | 61st Street / San Pablo Avenue | two_way_stop |  | 2.66 | 0.65 |  |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 2.51 | 0.04 | 75 s: 32/33 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.41 | 0.03 | 75 s: 44/21 |
| 956 | Ashby Avenue / Shattuck Avenue | signal |  | 2.35 | 0.07 | 75 s: 44/21 |
| 960 | Telegraph Avenue / Webster Street | signal |  | 2.31 | 0.12 | 75 s: 15/22/23 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 28 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 37 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 455: 26 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 39 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 454: 49 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 16 s: Market Street 4L [1125], Market Street 3L [1128]
- node 30: 13 s: Adeline Street 1L [764], Adeline Street 1L [1047]; 14 s: Market Street 2L [772], Market Street 2L [1130]; 13 s: 57th Street 1L [44]; 14 s: 57th Street 1L [1168]
- node 37: 25 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 40 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 2341 | Telegraph Avenue | Telegraph Avenue | uncontrolled | 1 | 47.0 |
| 218 | Idaho Street | 59th Street / Idaho Street | two_way_stop | 1 | 56.7 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 183 | San Pablo Avenue | 122 | 1376 |
| 132 | 62nd Street / San Pablo Avenue | 16 | 91 |
| 1389 | Ashby Avenue / Domingo Avenue / Tunnel Road | 2 | 224 |
| 133 | 62nd Street | 1 | 53 |
| 157 | 59th Street | 1 | 66 |
| 182 | 61st Street | 1 | 65 |
| 283 | Market Street | 1 | 342 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1062 | 1096 |
| Telegraph | S | 10 | 968 | 1020 |
| College | N | 3 | 250 | 253 |
| College | S | 3 | 320 | 324 |
| Claremont | N | 6 | 594 | 850 |
| Claremont | S | 7 | 485 | 762 |
| Alcatraz | E | 6 | 494 | 508 |
| Alcatraz | W | 6 | 498 | 536 |
| Hillegass | N | 4 | 46 | 53 |
| Hillegass | S | 4 | 85 | 96 |
| Colby | N | 7 | 29 | 34 |
| Colby | S | 7 | 62 | 80 |
| Martin | E | 2 | 144 | 144 |
| Martin | W | 2 | 191 | 191 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4842 |
| 955 | Telegraph Avenue / Ward Street | 2026 |
| 1688 | Warren Freeway | 1434 |
| 183 | San Pablo Avenue | 1376 |
| 266 | Ashby Avenue | 1133 |
| 771 | Telegraph Avenue | 549 |
| 986 | Broadway | 523 |
| 104 | San Pablo Avenue | 462 |
| 1774 | Claremont Avenue | 438 |
| 1735 | Grove Shafter Freeway | 374 |
