# rockridge-midday-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 0.00 (min 0.00, max 0.00) | yes |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 9.61 m/s | yes |

**Verdict: stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 10 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | gridlock removals per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| health | entry backlog | % of spawned | 0.01 | 0.00 | 0.00 | 0.01 | 0.00 to 0.01 |
| health | backlog growth in the second half of the run | points of spawned | -0.00 | 0.01 | -0.01 | 0.01 | -0.01 to 0.00 |
| health | completed trips | trips | 16112.00 | 166.52 | 15837.00 | 16324.00 | 15992.89 to 16231.11 |
| health | arterial mean speed | m/s | 9.61 | 0.07 | 9.47 | 9.70 | 9.56 to 9.66 |
| health | arterial mean speed, last 15 min | m/s | 9.63 | 0.11 | 9.47 | 9.86 | 9.55 to 9.71 |
| junction recovery | courtesy admissions per hour | veh/h | 53.40 | 9.14 | 40.00 | 66.00 | 46.86 to 59.94 |
| junction recovery | yield fallback admissions per hour | veh/h | 11.90 | 5.11 | 7.00 | 21.00 | 8.25 to 15.55 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 22.86 | 3.79 | 18.61 | 30.85 | 20.15 to 25.57 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 8.4 | 1.1 | 6.8 | 10.5 | 7.6 to 9.2 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 21.16 | 3.25 | 17.61 | 28.34 | 18.84 to 23.49 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 7.8 | 1.0 | 6.6 | 9.8 | 7.1 to 8.5 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 31.60 | 8.21 | 18.00 | 43.00 | 25.73 to 37.47 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 889.10 | 35.86 | 807.00 | 947.00 | 863.45 to 914.75 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 38.60 | 3.10 | 32.00 | 43.00 | 36.38 to 40.82 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 937.40 | 34.02 | 897.00 | 1003.00 | 913.06 to 961.74 |
| headline share | Hillegass Avenue NB from freeway | % | 52.0 | 4.3 | 45.7 | 58.5 | 48.9 to 55.0 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 2.7 | 1.1 | 1.4 | 5.0 | 1.9 to 3.4 |
| share | Hillegass Avenue NB to College Avenue | % | 14.8 | 3.3 | 7.3 | 18.2 | 12.4 to 17.1 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 26.0 | 3.2 | 23.3 | 32.8 | 23.8 to 28.3 |
| headline share | Colby Street NB from freeway | % | 35.9 | 1.9 | 33.1 | 38.1 | 34.5 to 37.2 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 51.9 | 3.6 | 46.2 | 57.1 | 49.3 to 54.5 |
| share | Colby Street NB to Telegraph Avenue | % | 38.0 | 5.6 | 26.9 | 48.3 | 34.0 to 42.0 |
| share | Colby Street NB to College Avenue | % | 6.4 | 1.2 | 4.5 | 8.1 | 5.5 to 7.3 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 28.1 | 3.7 | 22.5 | 33.6 | 25.5 to 30.7 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 3.1 | 1.1 | 1.5 | 4.9 | 2.3 to 3.8 |
| share | Hillegass Avenue SB from College Avenue | % | 12.8 | 3.5 | 7.8 | 18.4 | 10.3 to 15.3 |
| headline share | Hillegass Avenue SB to freeway | % | 53.7 | 5.1 | 44.4 | 62.2 | 50.1 to 57.4 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 20.4 | 2.3 | 16.9 | 24.1 | 18.8 to 22.1 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 18.0 | 3.1 | 14.9 | 25.2 | 15.8 to 20.2 |
| share | Colby Street SB from Telegraph Avenue | % | 20.4 | 3.4 | 15.4 | 26.7 | 18.0 to 22.8 |
| headline share | Colby Street SB to freeway | % | 44.3 | 5.0 | 37.1 | 49.2 | 40.7 to 47.8 |
| share | Colby Street SB to Forest Street | % | 13.0 | 4.5 | 8.3 | 20.8 | 9.8 to 16.2 |
| ramp share | onto freeway via College Avenue | % | 17.0 | 2.2 | 14.2 | 20.3 | 15.4 to 18.5 |
| ramp share | onto freeway via Hillegass Avenue | % | 15.4 | 1.9 | 12.8 | 17.8 | 14.0 to 16.8 |
| ramp share | onto freeway via Martin Street | % | 16.3 | 2.5 | 13.5 | 21.5 | 14.5 to 18.2 |
| ramp share | onto freeway via Colby Street | % | 13.3 | 2.4 | 10.3 | 17.6 | 11.5 to 15.0 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 9.1 | 1.0 | 7.7 | 10.8 | 8.4 to 9.8 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.4 | 1.0 | 2.5 | 6.4 | 3.7 to 5.2 |
| ramp share | from freeway via College Avenue | % | 10.7 | 1.8 | 7.8 | 12.9 | 9.4 to 11.9 |
| ramp share | from freeway via Martin Street | % | 11.0 | 1.4 | 8.8 | 13.1 | 10.0 to 12.1 |
| ramp share | from freeway via Colby Street | % | 10.9 | 1.2 | 8.8 | 13.3 | 10.1 to 11.7 |
| ramp share | from freeway via Hillegass Avenue | % | 7.5 | 1.8 | 5.2 | 10.1 | 6.2 to 8.8 |
| ramp share | from freeway via Benvenue Avenue | % | 2.7 | 1.4 | 1.3 | 5.4 | 1.6 to 3.7 |
| corridor flow | Telegraph N median link flow | veh/h | 571.92 | 27.36 | 538.80 | 625.20 | 552.35 to 591.49 |
| corridor flow | Telegraph S median link flow | veh/h | 472.44 | 37.38 | 405.60 | 530.40 | 445.70 to 499.18 |
| corridor flow | College N median link flow | veh/h | 247.92 | 26.07 | 214.80 | 285.60 | 229.27 to 266.57 |
| corridor flow | College S median link flow | veh/h | 429.00 | 28.78 | 369.60 | 474.00 | 408.41 to 449.59 |
| corridor flow | Claremont N median link flow | veh/h | 300.84 | 20.05 | 278.40 | 337.20 | 286.50 to 315.18 |
| corridor flow | Claremont S median link flow | veh/h | 215.28 | 25.14 | 170.40 | 253.20 | 197.30 to 233.26 |
| corridor flow | Alcatraz E median link flow | veh/h | 368.88 | 27.06 | 343.20 | 435.60 | 349.52 to 388.24 |
| corridor flow | Alcatraz W median link flow | veh/h | 231.00 | 22.35 | 206.40 | 262.80 | 215.01 to 246.99 |
| corridor flow | Hillegass N median link flow | veh/h | 79.08 | 11.33 | 61.20 | 92.40 | 70.97 to 87.19 |
| corridor flow | Hillegass S median link flow | veh/h | 85.44 | 12.01 | 68.40 | 98.40 | 76.85 to 94.03 |
| corridor flow | Colby N median link flow | veh/h | 91.80 | 9.30 | 79.20 | 106.80 | 85.15 to 98.45 |
| corridor flow | Colby S median link flow | veh/h | 89.88 | 12.65 | 66.00 | 109.20 | 80.83 to 98.93 |
| corridor flow | Martin E median link flow | veh/h | 103.44 | 14.88 | 87.60 | 138.00 | 92.80 to 114.08 |
| corridor flow | Martin W median link flow | veh/h | 63.12 | 9.33 | 48.00 | 76.80 | 56.44 to 69.80 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 37 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 18 | below |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 4 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 7 | within |
| Intents listed, together | | 101 (71 to 131) | 66 | |
| Other through cars (no intent listed) | | | 4 | |

Model through cars by origin and destination group (largest 12 of 38 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 37.2 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 5.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 5.6 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 4.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 2.5 | Claremont Avenue then College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.5 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 1.6 | SR-24 then Claremont Avenue then College Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | West Berkeley (Sacramento St, MLK Jr Way, Milvia St, Carleton St) | 1.0 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 0.6 | Claremont Avenue |
| West Oakland to the southwest (Adeline St, Market St) | College Ave from the north (Berkeley) | 0.6 | Telegraph Avenue |
| other pairs | | 4.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 54 veh/h; none near the study area 7 veh/h; Claremont Avenue then College Avenue 2 veh/h; Claremont Avenue 2 veh/h; SR-24 then Claremont Avenue then College Avenue 2 veh/h; College Avenue then Alcatraz Avenue 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 11 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 23 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 4 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 14 | within |
| Intents listed, together | | 43 (20 to 68) | 51 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 40 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.8 | SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 7.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 6.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 4.3 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 3.4 | SR-24 then Claremont Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.6 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Alcatraz Ave from the west (Emeryville side) | 2.1 | College Avenue then Alcatraz Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.8 | SR-24 then Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 1.3 | none near the study area |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 1.1 | College Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.0 | Claremont Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Claremont Ave and Tunnel Rd toward the hills | 0.9 | Claremont Avenue |
| other pairs | | 8.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 19 veh/h; SR-24 15 veh/h; SR-24 then Claremont Avenue then College Avenue 4 veh/h; SR-24 then Claremont Avenue 3 veh/h; Claremont Avenue 3 veh/h; College Avenue then Alcatraz Avenue 3 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 25 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 32 | below |
| Intents listed, together | | 87 (78 to 110) | 57 | |
| Other through cars (no intent listed) | | | 16 | |

Model through cars by origin and destination group (largest 12 of 30 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 24.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.8 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 8.9 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.9 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.3 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.4 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 0.7 | Alcatraz Avenue then College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.6 | Alcatraz Avenue then Claremont Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.6 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | 0.5 | SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 0.5 | Claremont Avenue |
| other pairs | | 3.0 | |

By the arterial these cars would otherwise use: Telegraph Avenue 35 veh/h; Claremont Avenue then SR-24 22 veh/h; College Avenue then Claremont Avenue then SR-24 9 veh/h; Claremont Avenue 4 veh/h; College Avenue 2 veh/h; Alcatraz Avenue then Claremont Avenue 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 12 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 8 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 28 | within |
| Intents listed, together | | 46 (39 to 72) | 48 | |
| Other through cars (no intent listed) | | | 37 | |

Model through cars by origin and destination group (largest 12 of 45 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 19.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.5 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.6 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 8.8 | Claremont Avenue then SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.0 | College Avenue then Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 3.0 | none near the study area |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 2.6 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 2.0 | Telegraph Avenue |
| Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) | West Oakland to the southwest (Adeline St, Market St) | 1.7 | Claremont Avenue |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.7 | Claremont Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 1.5 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.3 | SR-24 |
| other pairs | | 13.2 | |

By the arterial these cars would otherwise use: Telegraph Avenue 50 veh/h; Claremont Avenue then SR-24 9 veh/h; Claremont Avenue 7 veh/h; SR-24 6 veh/h; none near the study area 4 veh/h; College Avenue then Claremont Avenue then SR-24 4 veh/h.

### Study area, all residential and service streets

Model: 394 through cars per hour.

Model through cars by origin and destination group (largest 12 of 106 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 50.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 48.3 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 44.3 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 31.0 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 19.3 | Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 18.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.1 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 14.2 | SR-24 |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.8 | College Avenue then Claremont Avenue then SR-24 |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 9.0 | Claremont Avenue then College Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 7.9 | none near the study area |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 7.8 | Claremont Avenue |
| other pairs | | 116.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 239 veh/h; Claremont Avenue 30 veh/h; SR-24 24 veh/h; Claremont Avenue then SR-24 19 veh/h; none near the study area 17 veh/h; Claremont Avenue then College Avenue 13 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 116; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 81; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 43; Telegraph Ave from the north (Berkeley) 38; Claremont Ave and Tunnel Rd toward the hills 22; Telegraph Ave to the south (downtown Oakland) 19; College Ave from the north (Berkeley) 16; Emeryville and West Oakland streets (55th to 67th Streets) 14; West Oakland to the southwest (Adeline St, Market St) 11; Shattuck Ave from the north (Berkeley) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 119; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 69; Telegraph Ave from the north (Berkeley) 64; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 47; Claremont Ave and Tunnel Rd toward the hills 30; College Ave from the north (Berkeley) 13; Ashby Ave from the west (Emeryville and I-80) 11; West Oakland to the southwest (Adeline St, Market St) 7; San Pablo Ave (Emeryville and West Oakland) 6; Berkeley hills to the northeast (Evergreen Ln, Gravatt Dr) 5.


Per-seed detail: `rockridge-midday-s1-seed1.md` (seed 1 in full).
