# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 23460 veh/h x scale 1 = 23460 veh/h. Run took 24.6 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 2 | FAIL |
| Backlog / spawned | < 2% | 3.9% (865 of 22280) | FAIL |
| Arterial mean speed (run) | > 4 m/s | 7.53 m/s (last 15 min 7.02) | pass |

Overall: **NOT STABLE**. Mean trip delay 205 s, mean trip time 504 s, completed 22070, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2936 | 3 | 1873 | 0 | 8.21 |
| 10 | 3088 | 1 | 3675 | 2 | 7.97 |
| 15 | 3108 | 8 | 5614 | 2 | 7.87 |
| 20 | 3257 | 2 | 7441 | 2 | 7.64 |
| 25 | 3052 | 235 | 9303 | 2 | 7.30 |
| 30 | 2962 | 407 | 11168 | 2 | 7.79 |
| 35 | 3097 | 475 | 12881 | 2 | 7.77 |
| 40 | 3364 | 206 | 14754 | 2 | 7.68 |
| 45 | 3250 | 289 | 16699 | 2 | 7.23 |
| 50 | 3312 | 352 | 18537 | 2 | 6.85 |
| 55 | 3208 | 651 | 20258 | 2 | 6.62 |
| 60 | 3004 | 865 | 22070 | 2 | 7.60 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 20086 | 0.03 | 3.1% | 1.123 | 1.079 | 10.1% | 0.6% | 1.056 | 5.0% | 0.0% | 6.9% | 2457 | 15.2% |
| gate to gate | 10277 | 0.05 | 4.7% | 1.128 | 1.098 | 9.7% | 0.3% | 1.056 | 5.1% | 0.0% | 10.9% | 958 | 13.5% |
| with a local end | 9809 | 0.01 | 1.5% | 1.117 | 1.049 | 10.5% | 0.9% | 1.055 | 5.0% | 0.0% | 2.6% | 1498 | 16.3% |
| guided drivers | 9232 | 0.07 | 6.6% | 1.122 | 1.079 | 10.1% | 0.5% | 1.055 | 4.9% | 0.0% | 6.8% | 1150 | 14.8% |
| other drivers | 10854 | 0.00 | 0.2% | 1.124 | 1.079 | 10.0% | 0.6% | 1.056 | 5.1% | 0.0% | 6.9% | 1306 | 15.5% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (473 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1084 | 11.9 | 3% |
| freeway to the surface gates | 1268 | 18.5 | 4% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1181 | 2% | 8% | 90% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1072 | 5% | 17% | 78% | 0.2 |

## Per-mode results

Offered: 23460 car veh/h; 1500 bicycle flows (1154/h); 2000 pedestrian flows (1991/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3004 | 22070 | 504 | |
| Bicycle | 129 | 1144 | 376 | |
| Pedestrian | 293 | 1883 | 483 | mean crossing delay 6.3 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 546, bicycle conflicts 1508, close passes 1283, pedestrian injury-risk index 0.045, bicycle injury-risk index 0.054 (proxy), mean vehicle speed at pedestrian encounters 2.39 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 72 trips (69 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 200 trips (190 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 172 trips (158 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 346 trips (321 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 65% | +18 | 72 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 1% | -32 | 72 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 4% | -2 | 72 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 24% | -3 | 72 |  |
| Colby Street NB | from | freeway | 47% | 81% | +34 | 200 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 2% | -46 | 200 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 21% | -4 | 200 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -2 | 200 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 15% | -31 | 172 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 5% | -21 | 172 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 13% | -3 | 172 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 70% | +2 | 172 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 9% | -34 | 346 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 38% | -8 | 346 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 22% | -0 | 346 |  |
| Colby Street SB | to | freeway | 45% | 70% | +25 | 346 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 10% | -24 | 346 |  |

Headline shares within tolerance: 1 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 7% | 966 | 6% | 944 |
| onto freeway | Hillegass Avenue | 12% | 10% | 966 | 10% | 944 |
| onto freeway | Martin Street | 10% | 11% | 966 | 11% | 944 |
| onto freeway | Colby Street | 8% | 21% | 966 | 22% | 944 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 10% | 966 | 6% | 944 |
| onto freeway | Benvenue Avenue | 5% | 2% | 966 | 2% | 944 |
| from freeway | College Avenue | 10% | 4% | 1396 | 5% | 1054 |
| from freeway | Martin Street | 10% | 14% | 1396 | 19% | 1054 |
| from freeway | Colby Street | 8% | 7% | 1396 | 9% | 1054 |
| from freeway | Hillegass Avenue | 5% | 3% | 1396 | 3% | 1054 |
| from freeway | Benvenue Avenue | 3% | 1% | 1396 | 2% | 1054 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4208 | Grove Shafter Freeway | Motorway | 4 | 834 | uncontrolled | 154.15 | 78.81 | 78.8 | 2000 |
| 4191 | (unnamed) | Motorway | 2 | 513 | uncontrolled | 57.60 | 42.91 | 42.9 | 600 |
| 4165 | Martin Luther King Junior Way | Secondary | 3 | 147 | uncontrolled | 24.35 | 19.07 | 19.1 | 1189 |
| 1679 | 52nd Street | Secondary | 4 | 53 | signal | 15.32 | 13.40 | 13.4 | 629 |
| 4206 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 13.61 | 2.17 | 2.2 | 1182 |
| 4198 | (unnamed) | Motorway | 3 | 75 | uncontrolled | 12.60 | 6.86 | 6.9 | 1822 |
| 265 | 59th Street | Residential | 1 | 150 | two_way_stop | 9.01 | 7.70 | 7.7 | 128 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 8.45 | 6.49 | 6.5 | 874 |
| 1139 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 8.25 | 6.28 | 6.3 | 246 |
| 2061 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 7.56 | 5.68 | 5.7 | 494 |
| 2327 | Telegraph Avenue | Secondary | 2 | 104 | signal | 7.50 | 4.83 | 4.8 | 1408 |
| 728 | 55th Street | Tertiary | 1 | 238 | signal | 7.12 | 4.87 | 4.9 | 566 |
| 4366 | Claremont Avenue | Secondary | 2 | 113 | signal | 7.07 | 5.82 | 5.8 | 354 |
| 248 | 60th Street | Residential | 1 | 318 | two_way_stop | 6.77 | 5.88 | 5.9 | 94 |
| 4223 | Ashby Avenue | Primary | 2 | 99 | signal | 6.74 | 5.58 | 5.6 | 188 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 688 | 52nd Street / Shattuck Avenue | signal |  | 6.12 | 0.73 | 75 s: 42/23 |
| 339 | 52nd Street / Martin Luther King Junior Way | signal |  | 5.46 | 0.19 | 75 s: 38/27 |
| 454 | Market Street / Stanford Avenue | signal |  | 5.18 | 0.14 | 75 s: 50/15 |
| 455 | Adeline Street / Alcatraz Avenue | signal |  | 4.50 | 0.10 | 75 s: 25/40 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 4.04 | 0.03 | 75 s: 31/34 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.35 | 0.05 | 75 s: 45/20 |
| 863 | Alcatraz Avenue / Telegraph Avenue | signal |  | 3.10 | 0.22 | 75 s: 39/26 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.02 | 0.02 | 75 s: 20/22/17 |
| 1422 | Ashby Avenue / Claremont Avenue | signal |  | 2.98 | 0.34 | 75 s: 50/15 |
| 340 | 55th Street / Martin Luther King Junior Way | signal |  | 2.94 | 0.01 | 75 s: 23/42 |
| 959 | Ashby Avenue / Telegraph Avenue | signal |  | 2.90 | 0.00 | 75 s: 18/47 |
| 1095 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.89 | 0.01 | 75 s: 17/28/15 |
| 487 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.73 | 0.02 | 75 s: 25/40 |
| 621 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.71 | 0.05 | 75 s: 50/15 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.55 | 0.01 | 75 s: 40/25 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 688: 42 s: 52nd Street 4L [1679], 52nd Street 4L [1683]; 23 s: Shattuck Avenue 2L [1670], Shattuck Avenue 2L [1722]
- node 339: 38 s: Martin Luther King Junior Way 4L [721], Martin Luther King Junior Way 4L [778]; 27 s: 52nd Street 2L [775], 52nd Street 1L [777]
- node 454: 50 s: Stanford Avenue 1L [958], Stanford Avenue 3L [1072]; 15 s: Market Street 4L [1125], Market Street 3L [1128]
- node 455: 25 s: Adeline Street 4L [1066], Adeline Street 4L [1068]; 40 s: Alcatraz Avenue 2L [1065], Alcatraz Avenue 2L [1150]
- node 37: 31 s: San Pablo Avenue 3L [114], San Pablo Avenue 3L [115]; 34 s: Stanford Avenue 3L [108], Stanford Avenue 2L [4140]

## Gridlock removals by link (top 10)

| Link | Street | End node | Control | Removals | First at (min) |
| --- | --- | --- | --- | --- | --- |
| 1127 | Market Street | 60th Street / Market Street | two_way_stop | 2 | 6.9 |

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 610 | Grove Shafter Freeway | 865 | 4810 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1120 | 1188 |
| Telegraph | S | 10 | 949 | 992 |
| College | N | 3 | 324 | 325 |
| College | S | 3 | 475 | 482 |
| Claremont | N | 6 | 434 | 785 |
| Claremont | S | 7 | 768 | 1170 |
| Alcatraz | E | 6 | 462 | 474 |
| Alcatraz | W | 6 | 437 | 493 |
| Hillegass | N | 4 | 42 | 52 |
| Hillegass | S | 4 | 114 | 149 |
| Colby | N | 7 | 74 | 132 |
| Colby | S | 7 | 203 | 222 |
| Martin | E | 2 | 151 | 151 |
| Martin | W | 2 | 200 | 200 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 610 | Grove Shafter Freeway | 4810 |
| 955 | Telegraph Avenue / Ward Street | 2065 |
| 1688 | Warren Freeway | 1408 |
| 183 | San Pablo Avenue | 1329 |
| 266 | Ashby Avenue | 1134 |
| 771 | Telegraph Avenue | 549 |
| 1774 | Claremont Avenue | 504 |
| 986 | Broadway | 441 |
| 283 | Market Street | 412 |
| 284 | Martin Luther King Junior Way | 364 |
