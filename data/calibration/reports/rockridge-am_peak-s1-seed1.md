# Calibration report: rockridge am_peak scale 1 seed 1 (60 min)

Offered demand 21569 veh/h x scale 1 = 21569 veh/h. Run took 20.5 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (2 of 21664) | pass |
| Arterial mean speed (run) | > 4 m/s | 8.87 m/s (last 15 min 8.67) | pass |

Overall: **STABLE**. Mean trip delay 122 s, mean trip time 421 s, completed 21500, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2597 | 4 | 1813 | 0 | 9.35 |
| 10 | 2570 | 3 | 3603 | 0 | 8.85 |
| 15 | 2679 | 8 | 5286 | 0 | 8.52 |
| 20 | 2605 | 5 | 7145 | 0 | 8.83 |
| 25 | 2511 | 6 | 9025 | 0 | 9.19 |
| 30 | 2570 | 10 | 10804 | 0 | 9.28 |
| 35 | 2437 | 2 | 12690 | 0 | 9.20 |
| 40 | 2593 | 5 | 14408 | 0 | 8.84 |
| 45 | 2674 | 3 | 16119 | 0 | 8.49 |
| 50 | 2661 | 3 | 17884 | 0 | 8.50 |
| 55 | 2692 | 7 | 19641 | 0 | 8.66 |
| 60 | 2721 | 2 | 21500 | 0 | 8.85 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 19688 | 0.04 | 3.3% | 1.095 | 1.060 | 5.0% | 0.0% | 1.028 | 2.1% | 0.0% | 6.3% | 1880 | 9.0% |
| gate to gate | 8104 | 0.06 | 5.5% | 1.103 | 1.076 | 4.5% | 0.0% | 1.023 | 1.9% | 0.0% | 8.9% | 460 | 14.6% |
| with a local end | 11584 | 0.02 | 1.8% | 1.089 | 1.046 | 5.4% | 0.0% | 1.031 | 2.2% | 0.0% | 4.5% | 1420 | 7.1% |
| guided drivers | 9096 | 0.08 | 7.1% | 1.094 | 1.061 | 4.7% | 0.0% | 1.029 | 2.0% | 0.0% | 6.1% | 855 | 7.7% |
| other drivers | 10592 | 0.00 | 0.1% | 1.096 | 1.059 | 5.3% | 0.0% | 1.027 | 2.1% | 0.0% | 6.4% | 1025 | 10.0% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (392 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1331 | 15.2 | 4% |
| freeway to the surface gates | 969 | 2.9 | 1% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1007 | 3% | 16% | 81% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 852 | 0% | 36% | 63% | 0.0 |

## Per-mode results

Offered: 21569 car veh/h; 477 bicycle flows (690/h); 2000 pedestrian flows (1338/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 2721 | 21500 | 421 | |
| Bicycle | 43 | 674 | 246 | |
| Pedestrian | 188 | 1250 | 482 | mean crossing delay 6.9 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 226, bicycle conflicts 465, close passes 609, pedestrian injury-risk index 0.046, bicycle injury-risk index 0.066 (proxy), mean vehicle speed at pedestrian encounters 2.36 m/s.


## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 144 trips (137 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 227 trips (211 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 127 trips (120 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 269 trips (248 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 47% | +0 | 144 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 6% | -15 | 144 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 3% | -3 | 144 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 24% | -3 | 144 |  |
| Colby Street NB | from | freeway | 47% | 61% | +14 | 227 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 11% | -37 | 227 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 25% | +0 | 227 |  |
| Colby Street NB | to | College Avenue | 3% | 2% | -1 | 227 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 18% | -28 | 127 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 9% | -17 | 127 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 11% | -5 | 127 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 52% | -5 | 127 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 35% | -8 | 269 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 14% | -32 | 269 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 20% | -2 | 269 |  |
| Colby Street SB | to | freeway | 45% | 74% | +29 | 269 | OUTSIDE |
| Colby Street SB | to | Forest Street | 34% | 3% | -31 | 269 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 15% | 691 | 17% | 590 |
| onto freeway | Hillegass Avenue | 12% | 12% | 691 | 14% | 590 |
| onto freeway | Martin Street | 10% | 14% | 691 | 13% | 590 |
| onto freeway | Colby Street | 8% | 25% | 691 | 30% | 590 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 14% | 691 | 12% | 590 |
| onto freeway | Benvenue Avenue | 5% | 3% | 691 | 3% | 590 |
| from freeway | College Avenue | 10% | 6% | 848 | 8% | 669 |
| from freeway | Martin Street | 10% | 17% | 848 | 21% | 669 |
| from freeway | Colby Street | 8% | 16% | 848 | 20% | 669 |
| from freeway | Hillegass Avenue | 5% | 8% | 848 | 10% | 669 |
| from freeway | Benvenue Avenue | 3% | 2% | 848 | 3% | 669 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 20.40 | 13.96 | 14.0 | 902 |
| 315 | Stanford Avenue | Secondary | 2 | 354 | uncontrolled | 18.56 | 13.35 | 13.3 | 605 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 10.36 | 7.50 | 7.5 | 298 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 7.81 | 6.54 | 6.5 | 1021 |
| 4175 | (unnamed) | Motorway | 2 | 142 | uncontrolled | 7.53 | 0.44 | 0.4 | 1595 |
| 2037 | Alcatraz Avenue | Tertiary | 1 | 202 | uncontrolled | 5.96 | 4.64 | 4.6 | 288 |
| 364 | Alcatraz Avenue | Tertiary | 1 | 161 | two_way_stop | 5.89 | 2.82 | 2.8 | 588 |
| 303 | Baker Street | Residential | 1 | 104 | two_way_stop | 5.77 | 5.32 | 5.3 | 83 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 5.57 | 4.55 | 4.5 | 607 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 5.48 | 3.91 | 3.9 | 1298 |
| 4192 | Ashby Avenue | Primary | 2 | 99 | signal | 5.39 | 4.44 | 4.4 | 188 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 5.36 | 3.25 | 3.3 | 1500 |
| 225 | 61st Street | Residential | 1 | 137 | two_way_stop | 5.19 | 2.20 | 2.2 | 408 |
| 460 | Sacramento Street | Tertiary | 2 | 104 | two_way_stop | 5.07 | 4.15 | 4.2 | 334 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 5.06 | 3.75 | 3.7 | 614 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.17 | 0.06 | 90 s: 22/19/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.77 | 0.16 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.37 | 0.26 | 75 s: 33/32 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.84 | 0.03 | 75 s: 27/17/16 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.50 | 0.02 | 75 s: 24/41 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 3.03 | 0.01 | 75 s: 47/18 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.96 | 0.27 | 75 s: 34/31 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.94 | 0.00 | 75 s: 40/25 |
| 947 | Ashby Avenue / Telegraph Avenue | signal |  | 2.74 | 0.00 | 75 s: 16/49 |
| 242 | Ashby Avenue / Martin Luther King Junior Way | signal |  | 2.69 | 0.00 | 75 s: 42/23 |
| 613 | 52nd Street / Claremont Avenue / Telegraph Avenue | signal |  | 2.51 | 0.08 | 75 s: 38/27 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.46 | 0.01 | 75 s: 15/31/14 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.40 | 0.16 | 75 s: 50/15 |
| 332 | 55th Street / Martin Luther King Junior Way | signal |  | 2.31 | 0.02 | 75 s: 43/22 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.13 | 0.04 | 95 s: 37/48 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 22 s: 52nd Street 4L [1662]; 19 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 33 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 32 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 30: 27 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 17 s: Market Street 2L [755], Market Street 2L [1113]; 16 s: 57th Street 1L [44], 57th Street 1L [1151]
- node 479: 24 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 41 s: Stanford Avenue 1L [4139]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1111 | Broadway / Lawton Avenue / Rockridge Boulevard | 1 | 6 |
| 1398 | Claremont Boulevard | 1 | 228 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 811 | 875 |
| Telegraph | S | 10 | 611 | 702 |
| College | N | 3 | 256 | 257 |
| College | S | 3 | 518 | 520 |
| Claremont | N | 6 | 332 | 664 |
| Claremont | S | 7 | 460 | 756 |
| Alcatraz | E | 6 | 323 | 384 |
| Alcatraz | W | 6 | 320 | 354 |
| Hillegass | N | 4 | 92 | 119 |
| Hillegass | S | 4 | 74 | 78 |
| Colby | N | 7 | 118 | 137 |
| Colby | S | 7 | 188 | 199 |
| Martin | E | 2 | 104 | 104 |
| Martin | W | 2 | 180 | 180 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 3619 |
| 943 | Telegraph Avenue / Ward Street | 2064 |
| 1672 | Warren Freeway | 1359 |
| 265 | Ashby Avenue | 1242 |
| 183 | San Pablo Avenue | 1191 |
| 763 | Telegraph Avenue | 480 |
| 275 | Market Street | 429 |
| 184 | Alcatraz Avenue | 368 |
| 974 | Broadway | 358 |
| 1756 | Claremont Avenue | 298 |
