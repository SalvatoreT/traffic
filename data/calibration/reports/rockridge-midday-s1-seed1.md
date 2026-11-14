# Calibration report: rockridge midday scale 1 seed 1 (60 min)

Offered demand 15873 veh/h x scale 1 = 15873 veh/h. Run took 16.9 s wall clock. Flow tables use the window after a 10 min warm-up; select-link and health figures cover the whole run from an empty network.

## Stability (design D4)

| Criterion | Threshold | Value | Result |
| --- | --- | --- | --- |
| Gridlock removals | 0 | 0 | pass |
| Backlog / spawned | < 2% | 0.0% (0 of 16039) | pass |
| Arterial mean speed (run) | > 4 m/s | 10.16 m/s (last 15 min 10.20) | pass |

Overall: **STABLE**. Mean trip delay 71 s, mean trip time 364 s, completed 16178, unroutable 0.

| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |
| --- | --- | --- | --- | --- | --- |
| 5 | 1731 | 0 | 1427 | 0 | 10.20 |
| 10 | 1658 | 0 | 2838 | 0 | 10.14 |
| 15 | 1605 | 2 | 4210 | 0 | 10.02 |
| 20 | 1620 | 0 | 5509 | 0 | 10.09 |
| 25 | 1644 | 4 | 6827 | 0 | 10.19 |
| 30 | 1660 | 4 | 8120 | 0 | 10.15 |
| 35 | 1665 | 0 | 9455 | 0 | 10.18 |
| 40 | 1676 | 1 | 10789 | 0 | 10.13 |
| 45 | 1707 | 0 | 12136 | 0 | 10.22 |
| 50 | 1711 | 0 | 13504 | 0 | 10.19 |
| 55 | 1687 | 0 | 14887 | 0 | 10.36 |
| 60 | 1709 | 0 | 16178 | 0 | 10.04 |
## Wandering (completed car trips)

Detour ratio = distance driven (link and movement lengths) over the shortest network distance from the trip's origin to its destination. Detour against the free-flow route uses the time-shortest route with no congestion and no noise, which is what a purposeful driver without live information would follow (it differs from the shortest distance when a faster, longer road exists). A switch is a change of the remaining route while en route. Loops: the same link twice or the same node three or more times. Reversals: a link followed by its reverse within 200 m. 'Study-area vehicle-miles' are miles driven on links inside the study area; the last column is the share of them driven by trips with a detour ratio above 1.3. Guided drivers re-evaluate their route every epoch; the others keep their departure route unless it is blocked.

| Trips | n | Switches per trip | With a switch | Mean detour | Median detour | Detour > 1.3 | Detour > 2 | Mean detour vs free-flow route | Vs free-flow route > 1.3 | Loops | Reversals | Study veh-miles | Of them by detour > 1.3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| all trips | 14884 | 0.00 | 0.1% | 1.089 | 1.052 | 4.3% | 0.0% | 1.027 | 1.6% | 0.0% | 5.0% | 1343 | 8.0% |
| gate to gate | 6090 | 0.00 | 0.1% | 1.093 | 1.068 | 2.9% | 0.0% | 1.023 | 1.3% | 0.0% | 8.0% | 402 | 5.3% |
| with a local end | 8794 | 0.00 | 0.0% | 1.086 | 1.044 | 5.3% | 0.0% | 1.030 | 1.7% | 0.0% | 3.0% | 941 | 9.2% |
| guided drivers | 6761 | 0.00 | 0.2% | 1.091 | 1.055 | 4.5% | 0.0% | 1.030 | 1.8% | 0.0% | 5.1% | 625 | 8.4% |
| other drivers | 8123 | 0.00 | 0.0% | 1.087 | 1.051 | 4.1% | 0.0% | 1.025 | 1.3% | 0.0% | 5.0% | 718 | 7.7% |

## Reported patterns (diagnostics; configured in the targets file under `patterns`)

(a) Trips between the surface gates on the north side of the ramps and the freeway mainline gates, and the local-street (residential and service links in the study area) vehicle-miles they drive. Share = of all completed trips' local-street vehicle-miles (246 miles). No observed counterpart exists for this quantity (the targets file has only the select-link shares above).

| Trips | n trips | Local-street veh-miles | Share of all local-street veh-miles |
| --- | --- | --- | --- |
| surface gates to the freeway | 977 | 4.3 | 2% |
| freeway to the surface gates | 524 | 3.4 | 1% |

(b) Corridor trips: completed trips from beyond one end of the corridor's study-area extent (the bypass street and its arterial together) to beyond the other end, within a lateral limit of the corridor, by direction. 'Bypass' = at least N blocks (links) on the bypass street; 'arterial' = fewer bypass blocks and at least N on the arterial; 'other' = neither (another street, the freeway or a short use); blocks are counted on the corridor's study-area links. No observed counterpart exists for these shares. The related observed values are in the select-link table above: northbound Hillegass Ave traffic rarely ends on College Ave (6%), 21 to 33% jogs to Benvenue Ave, and southbound freeway-bound drivers on College Ave commonly arrive via Ashby Ave and Benvenue Ave and jog to Hillegass Ave.

| Bypass | Arterial | N | Direction | Corridor trips | Bypass | Arterial | Other | Mean bypass blocks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue | College Avenue | 3 | N | 800 | 2% | 15% | 82% | 0.1 |
| Hillegass Avenue | College Avenue | 3 | S | 955 | 1% | 23% | 76% | 0.0 |

## Per-mode results

Offered: 15873 car veh/h; 105 bicycle flows (386/h); 2000 pedestrian flows (1582/h). Bicycle and pedestrian volumes are assumptions, not counts.

| Mode | In network | Completed | Mean time (s) | Other |
| --- | --- | --- | --- | --- |
| Car | 1709 | 16178 | 364 | |
| Bicycle | 24 | 377 | 171 | |
| Pedestrian | 202 | 1481 | 455 | mean crossing delay 7.1 s |

Vulnerable road users (surrogate indicators): pedestrian conflicts 242, bicycle conflicts 131, close passes 206, pedestrian injury-risk index 0.050, bicycle injury-risk index 0.073 (proxy), mean vehicle speed at pedestrian encounters 2.54 m/s.


## Through cars on the counted blocks (a car is through when neither trip end is in the study area)

Observed through range = from the cars that drove the whole street (volunteer count, a lower bound) to the block volume less the cars whose trip ends along the street (an upper bound). Observed freeway-end trips = observed block volume times the observed freeway share of the street (the headline share of the targets file); these include freeway trips that end inside the study area, so they are not an expected through count. Modeled through = select-link trips with no end in the study area, per hour. Modeled freeway = select-link trips from or to a freeway node, per hour.

| Block | Observed volume (veh/h) | Observed freeway share | Observed freeway-end trips (veh/h) | Observed through range (veh/h) | Modeled through (veh/h) | In range | Modeled freeway trips (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)

- Hillegass Avenue NB: 4 links (path Claremont Avenue -> Alcatraz Avenue (434 m)), 97 trips (95 completed)
- Colby Street NB: 8 links (path Claremont Avenue -> Alcatraz Avenue (680 m)), 128 trips (125 completed)
- Hillegass Avenue SB: 4 links (path Alcatraz Avenue -> Claremont Avenue (433 m)), 98 trips (88 completed)
- Colby Street SB: 8 links (path Alcatraz Avenue -> Claremont Avenue (680 m)), 136 trips (133 completed)

| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hillegass Avenue NB | from | freeway | 47% | 59% | +12 | 97 | OUTSIDE |
| Hillegass Avenue NB | to | Benvenue Avenue | 21% (PM 33%) | 0% | -21 | 97 |  |
| Hillegass Avenue NB | to | College Avenue | 6% | 0% | -6 | 97 |  |
| Hillegass Avenue NB | to | Alcatraz Avenue WB | 27% | 24% | -3 | 97 |  |
| Colby Street NB | from | freeway | 47% | 58% | +11 | 128 | OUTSIDE |
| Colby Street NB | to | Alcatraz Avenue WB | 48% | 16% | -32 | 128 |  |
| Colby Street NB | to | Telegraph Avenue | 25% | 16% | -9 | 128 |  |
| Colby Street NB | to | College Avenue | 3% | 1% | -2 | 128 |  |
| Hillegass Avenue SB | from | Alcatraz Avenue WB | 46% | 13% | -33 | 98 |  |
| Hillegass Avenue SB | from | Benvenue Avenue | 26% | 8% | -18 | 98 |  |
| Hillegass Avenue SB | from | College Avenue | 16% | 7% | -9 | 98 |  |
| Hillegass Avenue SB | to | freeway | 57% (PM 68%) | 51% | -6 | 98 | within |
| Colby Street SB | from | Alcatraz Avenue EB | 43% | 20% | -23 | 136 |  |
| Colby Street SB | from | Alcatraz Avenue WB | 46% | 16% | -30 | 136 |  |
| Colby Street SB | from | Telegraph Avenue | 22% | 22% | +0 | 136 |  |
| Colby Street SB | to | freeway | 45% | 54% | +9 | 136 | within |
| Colby Street SB | to | Forest Street | 34% | 24% | -10 | 136 |  |

Headline shares within tolerance: 2 of 4. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.

## Claremont ramps: streets used before the on-ramp / after the off-ramp

Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier ("north of X") only its links on that side of X.

| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |
| --- | --- | --- | --- | --- | --- | --- |
| onto freeway | College Avenue | 16% | 14% | 446 | 17% | 359 |
| onto freeway | Hillegass Avenue | 12% | 11% | 446 | 14% | 359 |
| onto freeway | Martin Street | 10% | 16% | 446 | 18% | 359 |
| onto freeway | Colby Street | 8% | 10% | 446 | 13% | 359 |
| onto freeway | Telegraph Avenue north of Alcatraz Avenue | 8% | 9% | 446 | 8% | 359 |
| onto freeway | Benvenue Avenue | 5% | 4% | 446 | 5% | 359 |
| from freeway | College Avenue | 10% | 5% | 619 | 6% | 508 |
| from freeway | Martin Street | 10% | 13% | 619 | 16% | 508 |
| from freeway | Colby Street | 8% | 11% | 619 | 13% | 508 |
| from freeway | Hillegass Avenue | 5% | 6% | 619 | 7% | 508 |
| from freeway | Benvenue Avenue | 3% | 1% | 619 | 2% | 508 |

## Top 15 links by delay

| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1662 | 52nd Street | Secondary | 4 | 53 | signal | 4.52 | 3.76 | 3.8 | 598 |
| 4143 | Adeline Street | Secondary | 3 | 185 | signal | 4.19 | 1.76 | 1.8 | 948 |
| 1037 | Sacramento Street | Tertiary | 3 | 40 | signal | 3.56 | 2.89 | 2.9 | 961 |
| 3463 | Tunnel Road | Primary | 2 | 52 | signal | 3.39 | 2.84 | 2.8 | 815 |
| 769 | Martin Luther King Junior Way | Secondary | 3 | 112 | signal | 3.35 | 2.14 | 2.1 | 974 |
| 108 | Stanford Avenue | Secondary | 3 | 61 | signal | 3.26 | 1.92 | 1.9 | 1190 |
| 1049 | Adeline Street | Secondary | 4 | 43 | signal | 3.09 | 2.62 | 2.6 | 478 |
| 1122 | Alcatraz Avenue | Tertiary | 1 | 299 | signal | 2.99 | 1.85 | 1.8 | 488 |
| 2005 | Shattuck Avenue | Tertiary | 1 | 92 | signal | 2.99 | 2.20 | 2.2 | 479 |
| 1111 | Market Street | Tertiary | 3 | 31 | signal | 2.99 | 2.53 | 2.5 | 845 |
| 115 | San Pablo Avenue | Primary | 3 | 54 | signal | 2.67 | 2.17 | 2.2 | 444 |
| 1036 | Sacramento Street | Tertiary | 3 | 43 | signal | 2.59 | 2.07 | 2.1 | 853 |
| 2008 | Shattuck Avenue | Tertiary | 1 | 93 | signal | 2.55 | 1.73 | 1.7 | 457 |
| 114 | San Pablo Avenue | Primary | 3 | 46 | signal | 2.53 | 1.65 | 1.6 | 665 |
| 535 | Ashby Avenue | Primary | 2 | 210 | signal | 2.49 | 1.30 | 1.3 | 764 |

## Top 15 nodes by blocked time

Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).

| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |
| --- | --- | --- | --- | --- | --- | --- |
| 680 | 52nd Street / Shattuck Avenue | signal |  | 5.04 | 0.01 | 110 s: 34/28/34 |
| 446 | Market Street / Stanford Avenue | signal |  | 4.31 | 0.05 | 75 s: 50/15 |
| 447 | Adeline Street / Alcatraz Avenue | signal |  | 3.38 | 0.01 | 75 s: 15/50 |
| 185 | Alcatraz Avenue / Sacramento Street | signal |  | 2.99 | 0.01 | 75 s: 35/30 |
| 30 | 57th Street / Adeline Street / Market Street | signal |  | 2.79 | 0.01 | 75 s: 18/27/15 |
| 37 | San Pablo Avenue / Stanford Avenue | signal |  | 2.68 | 0.00 | 75 s: 25/40 |
| 944 | Ashby Avenue / Shattuck Avenue | signal |  | 2.42 | 0.00 | 75 s: 29/36 |
| 501 | Alcatraz Avenue / Shattuck Avenue | signal |  | 2.29 | 0.02 | 75 s: 32/33 |
| 851 | Alcatraz Avenue / Telegraph Avenue | signal |  | 2.27 | 0.03 | 75 s: 42/23 |
| 1080 | 62nd Street / Claremont Avenue / College Avenue | signal |  | 2.09 | 0.00 | 75 s: 21/24/15 |
| 713 | 51st Street / Telegraph Avenue | signal |  | 2.03 | 0.00 | 75 s: 27/38 |
| 1406 | Ashby Avenue / Claremont Avenue | signal |  | 2.01 | 0.03 | 75 s: 45/20 |
| 1069 | Claremont Avenue / Colby Street / Forest Street | signal |  | 2.01 | 0.00 | 147 s: 87/10/35 |
| 479 | Adeline Street / Martin Luther King Junior Way / Stanford Avenue | signal |  | 2.00 | 0.00 | 75 s: 27/38 |
| 702 | Aileen Street / Telegraph Avenue | signal |  | 1.81 | 0.00 | 75 s: 35/30 |

Phases of the five most blocked signals (green s: approach links with their lanes, link ids in brackets):

- node 680: 34 s: 52nd Street 4L [1662]; 28 s: 52nd Street 4L [1666]; 34 s: Shattuck Avenue 2L [1653], Shattuck Avenue 2L [1705]
- node 446: 50 s: Stanford Avenue 1L [941], Stanford Avenue 3L [1055]; 15 s: Market Street 4L [1108], Market Street 3L [1111]
- node 447: 15 s: Adeline Street 4L [1049], Adeline Street 4L [1051]; 50 s: Alcatraz Avenue 2L [1048], Alcatraz Avenue 2L [1133]
- node 185: 35 s: Alcatraz Avenue 1L [363], Alcatraz Avenue 1L [1162]; 30 s: Sacramento Street 3L [1036], Sacramento Street 3L [1037]
- node 30: 18 s: Adeline Street 1L [747], Adeline Street 1L [1030]; 27 s: Market Street 2L [755], Market Street 2L [1113]; 15 s: 57th Street 1L [44], 57th Street 1L [1151]

## Flow on key streets (veh/h per direction, study-area links of 40 m or more)

| Street | Direction of travel | Links | Median flow | Max flow |
| --- | --- | --- | --- | --- |
| Telegraph | N | 12 | 527 | 542 |
| Telegraph | S | 10 | 377 | 383 |
| College | N | 3 | 217 | 218 |
| College | S | 3 | 373 | 373 |
| Claremont | N | 6 | 300 | 428 |
| Claremont | S | 7 | 223 | 373 |
| Alcatraz | E | 6 | 389 | 404 |
| Alcatraz | W | 6 | 384 | 398 |
| Hillegass | N | 4 | 52 | 70 |
| Hillegass | S | 4 | 56 | 62 |
| Colby | N | 7 | 66 | 89 |
| Colby | S | 7 | 72 | 86 |
| Martin | E | 2 | 94 | 94 |
| Martin | W | 2 | 86 | 86 |

## Largest demand origins (offered, before scale)

| Node | Streets | Veh/h |
| --- | --- | --- |
| 602 | Grove Shafter Freeway | 2627 |
| 943 | Telegraph Avenue / Ward Street | 1012 |
| 1672 | Warren Freeway | 922 |
| 265 | Ashby Avenue | 781 |
| 183 | San Pablo Avenue | 608 |
| 763 | Telegraph Avenue | 385 |
| 104 | San Pablo Avenue | 338 |
| 276 | Martin Luther King Junior Way | 320 |
| 275 | Market Street | 313 |
| 974 | Broadway | 299 |
