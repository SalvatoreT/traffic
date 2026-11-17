# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Cars cleared from gridlock near the study area (judged zone) | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.93 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 7 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.90 | 1.66 | 0.00 | 4.00 | -0.29 to 2.09 |
| health | gridlock removals per hour | veh/h | 0.90 | 1.66 | 0.00 | 4.00 | -0.29 to 2.09 |
| health | entry backlog | % of spawned | 0.21 | 0.22 | 0.03 | 0.74 | 0.05 to 0.36 |
| health | backlog growth in the second half of the run | points of spawned | 0.11 | 0.17 | -0.11 | 0.46 | -0.02 to 0.23 |
| health | completed trips | trips | 23621.30 | 143.64 | 23393.00 | 23793.00 | 23518.56 to 23724.04 |
| health | arterial mean speed | m/s | 8.93 | 0.10 | 8.83 | 9.08 | 8.86 to 9.00 |
| health | arterial mean speed, last 15 min | m/s | 8.95 | 0.15 | 8.67 | 9.11 | 8.85 to 9.06 |
| junction recovery | courtesy admissions per hour | veh/h | 195.00 | 16.55 | 166.00 | 226.00 | 183.16 to 206.84 |
| junction recovery | yield fallback admissions per hour | veh/h | 48.30 | 10.89 | 34.00 | 63.00 | 40.51 to 56.09 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.10 | 0.32 | 0.00 | 1.00 | -0.13 to 0.33 |
| gridlock by place | cars cleared from gridlock per hour, judged (near the study area, and far ones whose chain reaches it) | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, near the study area | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | cars cleared from gridlock per hour, farther out | veh/h | 0.90 | 1.66 | 0.00 | 4.00 | -0.29 to 2.09 |
| gridlock by place | cars cleared from gridlock per hour, farther out with a chain into the judged zone | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| gridlock by place | trips waiting at origins in the judged zone at the end | trips | 1.00 | 0.82 | 0.00 | 2.00 | 0.42 to 1.58 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 20.05 | 3.08 | 15.62 | 26.81 | 17.85 to 22.26 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 6.2 | 0.9 | 5.2 | 8.4 | 5.5 to 6.8 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 22.52 | 2.10 | 17.89 | 25.43 | 21.01 to 24.02 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 6.9 | 0.7 | 5.2 | 7.8 | 6.4 to 7.5 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 37.00 | 3.68 | 30.00 | 42.00 | 34.37 to 39.63 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1134.40 | 38.02 | 1053.00 | 1179.00 | 1107.20 to 1161.60 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 35.10 | 3.14 | 29.00 | 40.00 | 32.85 to 37.35 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1187.00 | 35.09 | 1141.00 | 1259.00 | 1161.90 to 1212.10 |
| headline share | Hillegass Avenue NB from freeway | % | 48.6 | 1.4 | 46.7 | 51.6 | 47.6 to 49.6 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 9.0 | 2.2 | 6.5 | 12.4 | 7.5 to 10.6 |
| share | Hillegass Avenue NB to College Avenue | % | 17.1 | 3.5 | 12.2 | 21.7 | 14.7 to 19.6 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 33.7 | 3.8 | 27.9 | 40.9 | 31.0 to 36.4 |
| headline share | Colby Street NB from freeway | % | 45.5 | 2.3 | 42.1 | 49.5 | 43.9 to 47.2 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 46.6 | 5.1 | 38.5 | 52.5 | 43.0 to 50.2 |
| share | Colby Street NB to Telegraph Avenue | % | 40.0 | 4.6 | 34.9 | 50.9 | 36.7 to 43.2 |
| share | Colby Street NB to College Avenue | % | 1.4 | 0.8 | 0.6 | 3.4 | 0.9 to 2.0 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 27.9 | 4.6 | 20.9 | 33.8 | 24.7 to 31.2 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.3 | 1.7 | 0.7 | 5.6 | 2.1 to 4.5 |
| share | Hillegass Avenue SB from College Avenue | % | 14.6 | 3.4 | 9.9 | 19.4 | 12.2 to 17.1 |
| headline share | Hillegass Avenue SB to freeway | % | 54.5 | 4.5 | 48.4 | 61.1 | 51.3 to 57.7 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 24.1 | 3.0 | 17.3 | 27.4 | 22.0 to 26.2 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 9.3 | 1.4 | 7.1 | 11.2 | 8.3 to 10.3 |
| share | Colby Street SB from Telegraph Avenue | % | 19.4 | 3.5 | 13.6 | 25.6 | 16.8 to 21.9 |
| headline share | Colby Street SB to freeway | % | 42.3 | 3.6 | 36.2 | 48.6 | 39.7 to 44.8 |
| share | Colby Street SB to Forest Street | % | 22.8 | 3.1 | 19.3 | 28.2 | 20.5 to 25.0 |
| ramp share | onto freeway via College Avenue | % | 22.0 | 2.4 | 17.4 | 25.6 | 20.2 to 23.7 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.8 | 1.9 | 13.7 | 19.3 | 14.4 to 17.2 |
| ramp share | onto freeway via Martin Street | % | 13.5 | 1.6 | 11.0 | 15.7 | 12.3 to 14.6 |
| ramp share | onto freeway via Colby Street | % | 15.0 | 2.0 | 11.0 | 17.7 | 13.6 to 16.5 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.9 | 1.7 | 7.8 | 13.3 | 8.7 to 11.1 |
| ramp share | onto freeway via Benvenue Avenue | % | 6.7 | 1.1 | 4.7 | 8.5 | 5.9 to 7.5 |
| ramp share | from freeway via College Avenue | % | 10.8 | 1.3 | 8.6 | 13.2 | 9.9 to 11.7 |
| ramp share | from freeway via Martin Street | % | 11.1 | 0.7 | 9.9 | 12.0 | 10.6 to 11.5 |
| ramp share | from freeway via Colby Street | % | 12.1 | 1.4 | 10.7 | 15.2 | 11.1 to 13.2 |
| ramp share | from freeway via Hillegass Avenue | % | 8.5 | 0.8 | 7.0 | 9.5 | 8.0 to 9.1 |
| ramp share | from freeway via Benvenue Avenue | % | 2.2 | 0.6 | 1.1 | 3.1 | 1.7 to 2.6 |
| corridor flow | Telegraph N median link flow | veh/h | 961.80 | 40.10 | 896.40 | 1039.20 | 933.12 to 990.48 |
| corridor flow | Telegraph S median link flow | veh/h | 948.00 | 30.76 | 906.00 | 990.00 | 926.00 to 970.00 |
| corridor flow | College N median link flow | veh/h | 316.92 | 26.77 | 267.60 | 364.80 | 297.77 to 336.07 |
| corridor flow | College S median link flow | veh/h | 406.44 | 24.70 | 363.60 | 435.60 | 388.77 to 424.11 |
| corridor flow | Claremont N median link flow | veh/h | 388.92 | 27.06 | 349.20 | 426.00 | 369.56 to 408.28 |
| corridor flow | Claremont S median link flow | veh/h | 424.08 | 13.27 | 404.40 | 447.60 | 414.59 to 433.57 |
| corridor flow | Alcatraz E median link flow | veh/h | 399.84 | 18.94 | 368.40 | 432.00 | 386.29 to 413.39 |
| corridor flow | Alcatraz W median link flow | veh/h | 409.92 | 21.11 | 380.40 | 438.00 | 394.82 to 425.02 |
| corridor flow | Hillegass N median link flow | veh/h | 92.28 | 5.04 | 84.00 | 99.60 | 88.67 to 95.89 |
| corridor flow | Hillegass S median link flow | veh/h | 82.08 | 6.28 | 69.60 | 92.40 | 77.59 to 86.57 |
| corridor flow | Colby N median link flow | veh/h | 101.76 | 11.25 | 87.60 | 122.40 | 93.71 to 109.81 |
| corridor flow | Colby S median link flow | veh/h | 100.68 | 15.56 | 66.00 | 121.20 | 89.55 to 111.81 |
| corridor flow | Martin E median link flow | veh/h | 97.80 | 13.21 | 80.40 | 118.80 | 88.35 to 107.25 |
| corridor flow | Martin W median link flow | veh/h | 121.56 | 10.58 | 108.00 | 136.80 | 113.99 to 129.13 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 39 | within |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 25 | within |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 5 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 18 | above |
| Intents listed, together | | 101 (71 to 131) | 88 | |
| Other through cars (no intent listed) | | | 2 | |

Model through cars by origin and destination group (largest 12 of 23 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 38.9 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 12.3 | Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 4.8 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 4.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.9 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.3 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 0.8 | none near the study area |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 0.7 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 0.7 | Claremont Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 0.7 | SR-24 |
| other pairs | | 2.8 | |

By the arterial these cars would otherwise use: Telegraph Avenue 69 veh/h; Claremont Avenue then College Avenue 12 veh/h; none near the study area 3 veh/h; SR-24 3 veh/h; Claremont Avenue 1 veh/h; SR-24 then Telegraph Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 21 | above |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 30 | above |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 5 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 15 | above |
| Intents listed, together | | 43 (20 to 68) | 70 | |
| Other through cars (no intent listed) | | | 6 | |

Model through cars by origin and destination group (largest 12 of 33 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 14.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.4 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 8.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 6.9 | SR-24 then Claremont Avenue then College Avenue |
| SR-13 Warren Freeway (via SR-24 east) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | Claremont Avenue then Alcatraz Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.0 | SR-24 then Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.0 | Claremont Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.5 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.6 | Claremont Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.6 | SR-24 then Telegraph Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 1.3 | Telegraph Avenue |
| other pairs | | 9.4 | |

By the arterial these cars would otherwise use: Telegraph Avenue 30 veh/h; SR-24 14 veh/h; Claremont Avenue then Alcatraz Avenue 9 veh/h; SR-24 then Claremont Avenue then College Avenue 7 veh/h; SR-24 then Claremont Avenue 5 veh/h; Claremont Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 15 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 25 | below |
| Intents listed, together | | 87 (78 to 110) | 40 | |
| Other through cars (no intent listed) | | | 27 | |

Model through cars by origin and destination group (largest 12 of 28 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 22.9 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.3 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.7 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 7.1 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.7 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 0.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 0.4 | Alcatraz Avenue then College Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.4 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Claremont Ave and Tunnel Rd toward the hills | 0.3 | Alcatraz Avenue then Claremont Avenue |
| West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | College Ave from the north (Berkeley) | 0.3 | Alcatraz Avenue then College Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 0.3 | College Avenue then Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 0.3 | none near the study area |
| other pairs | | 2.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 38 veh/h; Claremont Avenue then SR-24 19 veh/h; College Avenue then Claremont Avenue then SR-24 6 veh/h; Alcatraz Avenue then College Avenue 1 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h; College Avenue 0 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 19 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 11 | below |
| Intents listed, together | | 46 (39 to 72) | 43 | |
| Other through cars (no intent listed) | | | 23 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 9.4 | Alcatraz Avenue then College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.4 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 6.8 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 3.6 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.3 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.9 | Telegraph Avenue |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.3 | SR-24 |
| Telegraph Ave from the north (Berkeley) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.3 | none near the study area |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 1.9 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 1.3 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 1.1 | Claremont Avenue then SR-24 |
| other pairs | | 12.7 | |

By the arterial these cars would otherwise use: Telegraph Avenue 25 veh/h; SR-24 11 veh/h; none near the study area 11 veh/h; Alcatraz Avenue then College Avenue then Claremont Avenue then SR-24 9 veh/h; Claremont Avenue 3 veh/h; Alcatraz Avenue then Claremont Avenue 2 veh/h.

### Study area, all residential and service streets

Model: 439 through cars per hour.

Model through cars by origin and destination group (largest 12 of 93 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 50.3 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 42.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 37.0 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 35.5 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 28.4 | College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | San Pablo Ave (Emeryville and West Oakland) | 26.7 | Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.2 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.6 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Emeryville and West Oakland streets (55th to 67th Streets) | 12.5 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 12.0 | Claremont Avenue then SR-24 |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 11.3 | SR-24 |
| other pairs | | 128.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 241 veh/h; SR-24 50 veh/h; Claremont Avenue 36 veh/h; College Avenue 30 veh/h; none near the study area 27 veh/h; Claremont Avenue then SR-24 12 veh/h.

By origin group: South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 107; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 91; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 89; Telegraph Ave from the north (Berkeley) 35; West Oakland to the southwest (Adeline St, Market St) 20; Claremont Ave and Tunnel Rd toward the hills 16; Telegraph Ave to the south (downtown Oakland) 14; SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) 11; Shattuck Ave from the north (Berkeley) 10; College Ave from the north (Berkeley) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 99; Telegraph Ave from the north (Berkeley) 91; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 74; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 47; Claremont Ave and Tunnel Rd toward the hills 33; San Pablo Ave (Emeryville and West Oakland) 30; Emeryville and West Oakland streets (55th to 67th Streets) 16; College Ave from the north (Berkeley) 11; SR-24 eastbound on-ramps (toward the Caldecott Tunnel) 9; West Oakland to the southwest (Adeline St, Market St) 6.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
