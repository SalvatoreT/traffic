# Calibration report: rockridge pm_peak scale 1 seed 1 (60 min)

Offered demand 25392 veh/h x scale 1 = 25392 veh/h. Run took 22.9 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.1% (17 of 25323) | pass |
| Arterial mean speed (run) | > 4 m/s | 9.29 m/s (last 15 min 9.12) | pass |

Overall: **STABLE**. Mean trip delay 136 s, mean trip time 425 s, completed 24565, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 2851 | 4 | 2149 | 0 | 9.44 |
| 10 | 2986 | 3 | 4221 | 0 | 9.48 |
| 15 | 3010 | 1 | 6270 | 0 | 9.23 |
| 20 | 3145 | 4 | 8247 | 0 | 9.25 |
| 25 | 3200 | 5 | 10341 | 0 | 9.41 |
| 30 | 3123 | 5 | 12504 | 0 | 9.39 |
| 35 | 3276 | 3 | 14479 | 0 | 9.31 |
| 40 | 3396 | 5 | 16500 | 0 | 9.25 |
| 45 | 3479 | 8 | 18498 | 0 | 9.40 |
| 50 | 3614 | 13 | 20446 | 0 | 9.24 |
| 55 | 3582 | 10 | 22564 | 0 | 9.02 |
| 60 | 3685 | 17 | 24565 | 0 | 9.10 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 22512 | 0.01 | 0.7% | 1.088 | 1.050 | 5.1% | 0.0% | 1.028 | 1.9% | 0.0% | 5.2% | 2358 | 9.0% |
| gate to gate | 7987 | 0.01 | 0.9% | 1.086 | 1.049 | 4.0% | 0.0% | 1.024 | 1.8% | 0.0% | 7.6% | 476 | 10.4% |
| with a local end | 14525 | 0.01 | 0.6% | 1.090 | 1.051 | 5.7% | 0.0% | 1.030 | 2.0% | 0.0% | 3.9% | 1882 | 8.7% |
| guided drivers | 10325 | 0.01 | 1.4% | 1.089 | 1.050 | 5.4% | 0.0% | 1.028 | 2.0% | 0.0% | 5.3% | 1083 | 9.6% |
| other drivers | 12187 | 0.00 | 0.0% | 1.088 | 1.050 | 4.9% | 0.0% | 1.028 | 1.9% | 0.0% | 5.1% | 1275 | 8.6% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (448 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 1701 | 8.9 | 2% |
| freeway to the surface gates | 912 | 12.6 | 3% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 1509 | 2% | 15% | 83% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 1349 | 0% | 27% | 73% | 0.0 |

## Per-mode results

Offered: 25392 car veh/h; 626 bicycle flows (764/h); 2000 pedestrian flows (1731/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 3685 | 24565 | 425 | |
| Bicycle | 58 | 767 | 256 | |
| Pedestrian | 217 | 1654 | 431 | mean crossing delay 8.2 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 319, bicycle conflicts 491, close passes 426, pedestrian injury-risk index 0.050, bicycle injury-risk index 0.066 (proxy), mean vehicle speed at pedestrian encounters 2.55 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | 110 | 47.0% | 52 | 48 to 95 | 45 | below | 113 |
| Colby Street NB | 174 | 47.0% | 82 | 102 to 145 | 116 | yes | 141 |
| Hillegass Avenue SB | 160 | 68.0% | 109 | 79 to 120 | 25 | below | 103 |
| Colby Street SB | 160 | 45.0% | 72 | 39 to 117 | 60 | yes | 106 |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 190 trips (181 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 305 trips (280 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 196 trips (176 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 259 trips (246 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 55% | +8 | 190 | within |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 3% | -30 | 190 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 8% | +2 | 190 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 18% | -9 | 190 |  |
| Colby Street NB | from | freeway | 47% | 32% | -15 | 305 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 58% | +10 | 305 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 39% | +14 | 305 |  |
| Colby Street NB | to | College Avenue | 3% | 4% | +1 | 305 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 5% | -41 | 196 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 1% | -25 | 196 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 2% | -14 | 196 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 53% | -15 | 196 | OUTSIDE |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 10% | -33 | 259 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 8% | -38 | 259 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 17% | -5 | 259 |  |
| Colby Street SB | to | freeway | 45% | 41% | -4 | 259 | within |
| Colby Street SB | to | Forest Street | 34% | 18% | -16 | 259 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 786 | 15% | 674 |
| onto freeway | Hillegass Avenue | 12% | 13% | 786 | 16% | 674 |
| onto freeway | Martin Street | 10% | 13% | 786 | 14% | 674 |
| onto freeway | Colby Street | 8% | 10% | 786 | 12% | 674 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 11% | 786 | 7% | 674 |
| onto freeway | Benvenue Avenue | 5% | 3% | 786 | 4% | 674 |
| from freeway | College Avenue | 10% | 6% | 927 | 8% | 730 |
| from freeway | Martin Street | 10% | 10% | 927 | 13% | 730 |
| from freeway | Colby Street | 8% | 9% | 927 | 11% | 730 |
| from freeway | Hillegass Avenue | 5% | 6% | 927 | 8% | 730 |
| from freeway | Benvenue Avenue | 3% | 3% | 927 | 4% | 730 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 12.40 | 7.67 | 7.7 | 709 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 8.92 | 6.14 | 6.1 | 391 |
| 1025 | Martin Luther King Junior Way | Secondary | 3 | 79 | signal | 8.28 | 7.14 | 7.1 | 648 |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 8.10 | 6.79 | 6.8 | 898 |
| 4382 | Warren Freeway | Motorway | 2 | 744 | uncontrolled | 6.67 | 1.11 | 1.1 | 1090 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 6.33 | 3.81 | 3.8 | 1464 |
| 3344 | Domingo Avenue | Residential | 1 | 110 | signal | 6.02 | 4.64 | 4.6 | 376 |
| 3434 | Claremont Avenue | Secondary | 1 | 93 | all_way_stop | 5.29 | 3.11 | 3.1 | 430 |
| 3395 | Ashby Avenue | Primary | 1 | 129 | signal | 5.24 | 2.82 | 2.8 | 911 |
| 4397 | Ashby Avenue | Primary | 2 | 96 | signal | 5.18 | 3.60 | 3.6 | 780 |
| 498 | Sacramento Street | Tertiary | 3 | 48 | signal | 5.02 | 4.02 | 4.0 | 755 |
| 1092 | (unnamed) | Service | 1 | 110 | uncontrolled | 5.00 | 4.14 | 4.1 | 131 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 4.90 | 3.85 | 3.9 | 1201 |
| 1108 | Market Street | Secondary | 4 | 36 | signal | 4.89 | 4.20 | 4.2 | 1168 |
| 4150 | Alcatraz Avenue | Tertiary | 1 | 160 | uncontrolled | 4.84 | 2.70 | 2.7 | 400 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 6.08 | 0.08 | 110 s: 34/28/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 5.87 | 0.09 | 75 s: 47/18 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 4.01 | 0.08 | 75 s: 26/39 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 3.59 | 0.00 | 95 s: 30/55 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 3.55 | 0.02 | 75 s: 42/23 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 3.35 | 0.02 | 75 s: 15/25/20 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 3.27 | 0.00 | 75 s: 25/40 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 3.18 | 0.04 | 75 s: 15/30/15 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 3.10 | 0.06 | 75 s: 50/15 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.98 | 0.03 | 75 s: 43/22 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.81 | 0.00 | 75 s: 41/24 |
| 237 | Ashby Avenue / Sacramento Street | signal |  | 2.72 | 0.00 | 75 s: 45/20 |
| 1373 | Ashby Avenue / Domingo Avenue / Tunnel Road | signal |  | 2.62 | 0.07 | 75 s: 37/28 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.61 | 0.00 | 75 s: 31/34 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.52 | 0.00 | 79 s: 25/4/35 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 34 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 47 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 18 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 26 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 39 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 479: 30 s: Martin Luther King Junior Way 3L [1025], Adeline Street 3L [4143]; 55 s: Stanford Avenue 1L [4139]
- node 185: 42 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 23 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]

## Entry backlog by origin node at end of run (top 10)

| Node | Streets | Trips waiting | Offered veh/h (before scale) |
| --- | --- | --- | --- |
| 1408 | Avalon Avenue / Claremont Avenue | 7 | 16 |
| 1093 | College Avenue / Harwood Avenue | 6 | 262 |
| 1232 | Ashby Avenue / Claremont Crescent | 2 | 31 |
| 395 | 65th Street / Shattuck Avenue | 1 | 10 |
| 943 | Telegraph Avenue / Ward Street | 1 | 998 |

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 1133 | 1175 |
| Telegraph | S | 10 | 793 | 835 |
| College | N | 3 | 364 | 365 |
| College | S | 3 | 685 | 686 |
| Claremont | N | 6 | 391 | 584 |
| Claremont | S | 7 | 290 | 718 |
| Alcatraz | E | 6 | 558 | 566 |
| Alcatraz | W | 6 | 312 | 452 |
| Hillegass | N | 4 | 110 | 113 |
| Hillegass | S | 4 | 95 | 158 |
| Colby | N | 7 | 157 | 208 |
| Colby | S | 7 | 157 | 180 |
| Martin | E | 2 | 132 | 132 |
| Martin | W | 2 | 110 | 110 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 4100 |
| 1672 | Warren Freeway | 1255 |
| 265 | Ashby Avenue | 1134 |
| 183 | San Pablo Avenue | 1108 |
| 943 | Telegraph Avenue / Ward Street | 998 |
| 974 | Broadway | 781 |
| 763 | Telegraph Avenue | 732 |
| 184 | Alcatraz Avenue | 512 |
| 1756 | Claremont Avenue | 476 |
| 276 | Martin Luther King Junior Way | 441 |
