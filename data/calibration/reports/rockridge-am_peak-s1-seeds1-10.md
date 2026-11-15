# rockridge-am_peak-s1 over 10 seeds (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Seeds are the fixed list above, none chosen; each run is 60 minutes from the same start. Interval = 95% interval of the mean (Student t, n - 1 degrees of freedom). Run-to-run noise only: demand is fixed, so day-to-day variation is not in these intervals.

## Stability rule (design decision D16)

| Check | Rule | Result | Pass |
| --- | --- | --- | --- |
| Removals | mean per hour below 1.00 | 1.80 (min 0.00, max 5.00) | NO |
| Entry backlog | below 2.0% in at least 90% of seeds | 10 of 10 seeds | yes |
| Runaway growth | no seed adds more than 2.0 points of backlog in the second half | none | yes |
| Arterial speed | mean above 4.0 m/s | 8.64 m/s | yes |

**Verdict: not stable.** Old rule (zero removals, backlog under 2%, speed above 4 m/s, every seed): 3 of 10 seeds pass.

## Metrics over seeds

| Group | Metric | Unit | Mean | SD | Min | Max | 95% interval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| health | gridlock removals | vehicles | 1.80 | 1.62 | 0.00 | 5.00 | 0.64 to 2.96 |
| health | gridlock removals per hour | veh/h | 1.80 | 1.62 | 0.00 | 5.00 | 0.64 to 2.96 |
| health | entry backlog | % of spawned | 0.01 | 0.01 | 0.00 | 0.03 | 0.01 to 0.02 |
| health | backlog growth in the second half of the run | points of spawned | -0.01 | 0.02 | -0.06 | 0.01 | -0.02 to 0.01 |
| health | completed trips | trips | 21919.70 | 149.11 | 21727.00 | 22230.00 | 21813.04 to 22026.36 |
| health | arterial mean speed | m/s | 8.64 | 0.15 | 8.43 | 8.94 | 8.53 to 8.74 |
| health | arterial mean speed, last 15 min | m/s | 8.56 | 0.18 | 8.24 | 8.78 | 8.42 to 8.69 |
| junction recovery | courtesy admissions per hour | veh/h | 245.70 | 44.03 | 177.00 | 319.00 | 214.21 to 277.19 |
| junction recovery | yield fallback admissions per hour | veh/h | 117.50 | 17.37 | 95.00 | 157.00 | 105.07 to 129.93 |
| junction recovery | conflict bypass admissions per hour | veh/h | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 to 0.00 |
| junction recovery | vehicles removed while held in a node, per hour | veh/h | 0.20 | 0.42 | 0.00 | 1.00 | -0.10 to 0.50 |
| cut-through | local vehicle-miles, surface gates to the freeway | veh-miles | 23.13 | 2.48 | 19.67 | 26.59 | 21.36 to 24.90 |
| cut-through | share of local vehicle-miles, surface gates to the freeway | % | 6.2 | 0.7 | 5.4 | 7.2 | 5.7 to 6.7 |
| cut-through | local vehicle-miles, freeway to the surface gates | veh-miles | 20.46 | 3.11 | 16.76 | 26.70 | 18.24 to 22.69 |
| cut-through | share of local vehicle-miles, freeway to the surface gates | % | 5.5 | 0.8 | 4.2 | 6.9 | 4.9 to 6.1 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue N | trips | 34.10 | 5.74 | 26.00 | 42.00 | 29.99 to 38.21 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue N | trips | 1078.20 | 31.24 | 1021.00 | 1109.00 | 1055.86 to 1100.54 |
| bypass | corridor trips using the bypass, Hillegass Avenue vs College Avenue S | trips | 35.40 | 7.17 | 24.00 | 45.00 | 30.27 to 40.53 |
| bypass | corridor trips, Hillegass Avenue vs College Avenue S | trips | 1229.30 | 38.19 | 1176.00 | 1279.00 | 1201.98 to 1256.62 |
| headline share | Hillegass Avenue NB from freeway | % | 52.8 | 3.1 | 46.7 | 58.1 | 50.6 to 55.1 |
| share | Hillegass Avenue NB to Benvenue Avenue | % | 9.1 | 2.5 | 6.4 | 15.0 | 7.4 to 10.9 |
| share | Hillegass Avenue NB to College Avenue | % | 13.4 | 2.0 | 11.0 | 17.6 | 11.9 to 14.8 |
| share | Hillegass Avenue NB to Alcatraz Avenue WB | % | 27.2 | 3.1 | 22.2 | 32.8 | 25.0 to 29.5 |
| headline share | Colby Street NB from freeway | % | 45.4 | 3.7 | 41.4 | 55.1 | 42.7 to 48.0 |
| share | Colby Street NB to Alcatraz Avenue WB | % | 45.3 | 3.6 | 39.5 | 50.7 | 42.7 to 47.9 |
| share | Colby Street NB to Telegraph Avenue | % | 42.9 | 4.2 | 37.4 | 50.7 | 39.9 to 45.9 |
| share | Colby Street NB to College Avenue | % | 3.2 | 1.6 | 0.5 | 5.3 | 2.1 to 4.4 |
| share | Hillegass Avenue SB from Alcatraz Avenue WB | % | 20.8 | 4.6 | 13.9 | 27.7 | 17.5 to 24.1 |
| share | Hillegass Avenue SB from Benvenue Avenue | % | 1.9 | 1.2 | 0.0 | 3.8 | 1.0 to 2.7 |
| share | Hillegass Avenue SB from College Avenue | % | 9.9 | 3.8 | 4.3 | 15.3 | 7.2 to 12.7 |
| headline share | Hillegass Avenue SB to freeway | % | 58.4 | 3.9 | 53.7 | 64.6 | 55.6 to 61.2 |
| share | Colby Street SB from Alcatraz Avenue EB | % | 20.6 | 2.5 | 17.8 | 25.4 | 18.8 to 22.4 |
| share | Colby Street SB from Alcatraz Avenue WB | % | 10.3 | 2.2 | 7.5 | 14.5 | 8.7 to 11.8 |
| share | Colby Street SB from Telegraph Avenue | % | 20.4 | 2.9 | 14.7 | 24.6 | 18.3 to 22.5 |
| headline share | Colby Street SB to freeway | % | 49.4 | 2.4 | 46.0 | 53.9 | 47.7 to 51.1 |
| share | Colby Street SB to Forest Street | % | 11.8 | 2.0 | 8.1 | 14.3 | 10.4 to 13.3 |
| ramp share | onto freeway via College Avenue | % | 15.7 | 1.3 | 14.1 | 17.7 | 14.8 to 16.6 |
| ramp share | onto freeway via Hillegass Avenue | % | 13.6 | 1.3 | 11.8 | 16.3 | 12.7 to 14.5 |
| ramp share | onto freeway via Martin Street | % | 16.0 | 2.1 | 11.2 | 18.3 | 14.5 to 17.5 |
| ramp share | onto freeway via Colby Street | % | 16.4 | 1.3 | 14.5 | 18.9 | 15.5 to 17.3 |
| ramp share | onto freeway via Telegraph Avenue north of Alcatraz Avenue | % | 10.4 | 1.1 | 8.6 | 11.8 | 9.6 to 11.2 |
| ramp share | onto freeway via Benvenue Avenue | % | 4.6 | 0.8 | 3.0 | 5.6 | 4.1 to 5.2 |
| ramp share | from freeway via College Avenue | % | 11.7 | 1.6 | 9.7 | 14.3 | 10.6 to 12.9 |
| ramp share | from freeway via Martin Street | % | 12.9 | 1.0 | 11.7 | 14.8 | 12.2 to 13.6 |
| ramp share | from freeway via Colby Street | % | 12.2 | 0.8 | 11.1 | 14.0 | 11.6 to 12.7 |
| ramp share | from freeway via Hillegass Avenue | % | 6.8 | 1.3 | 4.4 | 7.9 | 5.9 to 7.7 |
| ramp share | from freeway via Benvenue Avenue | % | 3.2 | 0.6 | 2.1 | 4.2 | 2.7 to 3.6 |
| corridor flow | Telegraph N median link flow | veh/h | 773.28 | 29.51 | 709.20 | 822.00 | 752.17 to 794.39 |
| corridor flow | Telegraph S median link flow | veh/h | 825.84 | 62.70 | 750.00 | 926.40 | 780.99 to 870.69 |
| corridor flow | College N median link flow | veh/h | 220.08 | 19.44 | 202.80 | 256.80 | 206.17 to 233.99 |
| corridor flow | College S median link flow | veh/h | 421.80 | 25.13 | 387.60 | 470.40 | 403.82 to 439.78 |
| corridor flow | Claremont N median link flow | veh/h | 413.28 | 23.85 | 370.80 | 450.00 | 396.22 to 430.34 |
| corridor flow | Claremont S median link flow | veh/h | 430.80 | 22.09 | 382.80 | 460.80 | 415.00 to 446.60 |
| corridor flow | Alcatraz E median link flow | veh/h | 375.24 | 22.28 | 336.00 | 400.80 | 359.30 to 391.18 |
| corridor flow | Alcatraz W median link flow | veh/h | 304.80 | 27.27 | 259.20 | 333.60 | 285.29 to 324.31 |
| corridor flow | Hillegass N median link flow | veh/h | 99.36 | 9.79 | 87.60 | 121.20 | 92.35 to 106.37 |
| corridor flow | Hillegass S median link flow | veh/h | 82.68 | 10.06 | 66.00 | 97.20 | 75.48 to 89.88 |
| corridor flow | Colby N median link flow | veh/h | 118.20 | 8.55 | 98.40 | 127.20 | 112.09 to 124.31 |
| corridor flow | Colby S median link flow | veh/h | 153.48 | 17.55 | 129.60 | 184.80 | 140.93 to 166.03 |
| corridor flow | Martin E median link flow | veh/h | 131.64 | 17.55 | 104.40 | 156.00 | 119.09 to 144.19 |
| corridor flow | Martin W median link flow | veh/h | 102.00 | 9.10 | 86.40 | 118.80 | 95.49 to 108.51 |

## Intent map: through cars by where they come from and where they are going

Through = neither trip end is in the study area. Groups are the approach groups of the area config (data/areas); a node that is not a gate takes the group of the nearest surface gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where that path runs on a boundary street near the study area.

Model figures are the mean of 10 seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.

### Colby Street NB

Observed (PM): 182 cars entered at the south end, 102 drove the whole street, 164 left it at Alcatraz Ave (131 left, 32 right, 1 straight), and 47% of the block's trips came from a freeway (the headline share). ASSUMPTION: freeway-origin cars that do not end along the street are 65 veh/h (the 82 freeway-origin trips on the block, 47% of 174, times the 182 / (182 + 47) of its cars that entered at the south end rather than joining on the way), spread over the 164 exits in proportion (0.40); the other through cars come from the Telegraph Ave and south-side approaches that feed the street's south end. Ranges: low = 131 (32) x 0.47 x 0.62 (the whole-street share of exits), high = 131 (32) x 0.47.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | OBSERVED turn count x ASSUMPTION share (131 left turns x 0.40) | 52 (38 to 62) | 34 | below |
| Telegraph Ave and south-side traffic using Colby St to reach Alcatraz Ave west, Telegraph Ave north and Ashby Ave | ASSUMPTION: the through left-turners (131 x 0.62 = 81) that are not off-ramp traffic | 29 (19 to 43) | 18 | below |
| SR-24 off-ramp traffic using Colby St to reach College Ave and Berkeley (right at Alcatraz Ave) | OBSERVED turn count x ASSUMPTION share (32 right turns x 0.40) | 13 (9 to 15) | 2 | below |
| Telegraph Ave and south-side traffic using Colby St to reach College Ave and Berkeley | ASSUMPTION: the through right-turners (32 x 0.62 = 20) that are not off-ramp traffic | 7 (5 to 11) | 18 | above |
| Intents listed, together | | 101 (71 to 131) | 73 | |
| Other through cars (no intent listed) | | | 3 | |

Model through cars by origin and destination group (largest 12 of 34 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 34.4 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 16.4 | Claremont Avenue then College Avenue then Alcatraz Avenue |
| Telegraph Ave to the south (downtown Oakland) | Telegraph Ave from the north (Berkeley) | 7.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 3.0 | College Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Telegraph Ave from the north (Berkeley) | 2.9 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Ashby Ave from the west (Emeryville and I-80) | 1.5 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Emeryville and West Oakland streets (55th to 67th Streets) | 1.4 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.0 | College Avenue then Alcatraz Avenue |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 0.8 | Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Telegraph Ave from the north (Berkeley) | 0.8 | College Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | San Pablo Ave (Emeryville and West Oakland) | 0.6 | Claremont Avenue |
| other pairs | | 3.9 | |

By the arterial these cars would otherwise use: Telegraph Avenue 48 veh/h; Claremont Avenue then College Avenue then Alcatraz Avenue 16 veh/h; Claremont Avenue 4 veh/h; College Avenue 4 veh/h; College Avenue then Alcatraz Avenue 1 veh/h; SR-24 1 veh/h.

### Hillegass Avenue NB

Observed (PM): 94 cars entered at the south end, 48 drove the whole street, 109 left it at Alcatraz Ave (43 west, 54 east, 12 straight), and 47% of the block's trips came from a freeway. ASSUMPTION: freeway-origin through cars are 40 veh/h (52 freeway-origin trips times 94 / (94 + 29)), spread over the exits in proportion (0.37); the through share of exits is 48 / 109 = 0.44.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| SR-24 off-ramp traffic using Hillegass Ave to reach Alcatraz Ave west and Telegraph Ave north | OBSERVED turn count x ASSUMPTION share (43 left turns x 0.37) | 16 (9 to 20) | 14 | within |
| SR-24 off-ramp traffic using Hillegass Ave to reach College Ave and Berkeley | OBSERVED turn count x ASSUMPTION share (54 right turns x 0.37) | 20 (11 to 25) | 25 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach Alcatraz Ave west | ASSUMPTION: through exits (43 x 0.44) that are not off-ramp traffic | 3 (0 to 10) | 7 | within |
| Telegraph Ave and south-side traffic using Hillegass Ave to reach College Ave and Berkeley | ASSUMPTION: through exits (54 x 0.44) that are not off-ramp traffic | 4 (0 to 13) | 14 | above |
| Intents listed, together | | 43 (20 to 68) | 60 | |
| Other through cars (no intent listed) | | | 5 | |

Model through cars by origin and destination group (largest 12 of 47 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.3 | SR-24 |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 7.8 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 6.6 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | College Ave from the north (Berkeley) | 5.7 | SR-24 then Claremont Avenue then College Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 5.6 | SR-24 then Claremont Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Shattuck Ave from the north (Berkeley) | 2.6 | College Avenue |
| Telegraph Ave to the south (downtown Oakland) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 2.2 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Telegraph Ave from the north (Berkeley) | 2.1 | none near the study area |
| West Oakland to the southwest (Adeline St, Market St) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 1.7 | Telegraph Avenue |
| SR-24 westbound off-ramps (arriving from the Caldecott Tunnel) | Ashby Ave from the west (Emeryville and I-80) | 1.6 | SR-24 then Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Alcatraz Ave from the west (Emeryville side) | 1.4 | College Avenue then Alcatraz Avenue |
| West Oakland to the southwest (Adeline St, Market St) | Claremont Ave and Tunnel Rd toward the hills | 1.2 | Claremont Avenue |
| other pairs | | 13.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 21 veh/h; SR-24 15 veh/h; SR-24 then Claremont Avenue then College Avenue 6 veh/h; SR-24 then Claremont Avenue 6 veh/h; Claremont Avenue 4 veh/h; none near the study area 4 veh/h.

### Hillegass Avenue SB

Observed (PM): 178 cars entered at the top (76 turned in from Alcatraz Ave west, 98 from the east, 4 came straight from the north), 79 drove the whole street, and 68% of the block's trips (109 veh/h) went to a freeway. ASSUMPTION: freeway-bound cars that did not join mid-street are 87 veh/h (109 x 178 / (178 + 44)), half of the 174 turn-ins; low = the whole-street share of the turn-ins (0.45), high = the freeway-bound share without the mid-street correction (0.63).

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Telegraph Ave, Alcatraz Ave west and West Berkeley traffic turning off Alcatraz Ave onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (76 turn-ins x 0.50) | 38 (34 to 48) | 16 | below |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Hillegass Ave to reach SR-24 | OBSERVED turn count x ASSUMPTION share (98 turn-ins x 0.50) | 49 (44 to 62) | 24 | below |
| Intents listed, together | | 87 (78 to 110) | 39 | |
| Other through cars (no intent listed) | | | 41 | |

Model through cars by origin and destination group (largest 12 of 34 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 24.1 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 14.9 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.7 | Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 6.1 | Telegraph Avenue |
| College Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 5.2 | College Avenue then Claremont Avenue then SR-24 |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 4.5 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 4.5 | Claremont Avenue then SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 1.7 | Telegraph Avenue |
| College Ave from the north (Berkeley) | Telegraph Ave to the south (downtown Oakland) | 0.7 | College Avenue then Claremont Avenue |
| Shattuck Ave from the north (Berkeley) | Oakland hills to the east (Broadway Terrace, Mountain Blvd, Moraga Ave) | 0.5 | SR-24 |
| Emeryville and West Oakland streets (55th to 67th Streets) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 0.5 | Alcatraz Avenue then College Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 0.4 | none near the study area |
| other pairs | | 3.3 | |

By the arterial these cars would otherwise use: Telegraph Avenue 51 veh/h; Claremont Avenue then SR-24 18 veh/h; College Avenue then Claremont Avenue then SR-24 5 veh/h; Claremont Avenue 2 veh/h; College Avenue then Claremont Avenue 1 veh/h; SR-24 1 veh/h.

### Colby Street SB

Observed (PM): 139 cars entered at the top (76 from Alcatraz Ave west, 50 from the east, 13 from the north), 39 drove the whole street, 45% of the block's trips (72 veh/h) went to a freeway and 22% came by way of Telegraph Ave. ASSUMPTION: freeway-bound cars that did not join mid-street are 46 veh/h (72 x 139 / (139 + 79)), 0.365 of the 126 turn-ins; low = the whole-street share (0.31), high = the unadjusted freeway share (0.57). The Telegraph Ave cars are the 22% x 160 = 35 of the 76 west turn-ins.

| Intent | Basis | Implied veh/h | Model veh/h | Position |
| --- | --- | --- | --- | --- |
| Southbound Telegraph Ave traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (35 Telegraph Ave cars x 0.365) | 13 (11 to 20) | 13 | within |
| Alcatraz Ave west, Ashby Ave and West Berkeley traffic using Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (41 other west turn-ins x 0.365) | 15 (13 to 23) | 21 | within |
| College Ave and Berkeley traffic turning off Alcatraz Ave (from the east) onto Colby St to reach SR-24 | OBSERVED turn count x ASSUMPTION share (50 east turn-ins x 0.365) | 18 (15 to 29) | 28 | within |
| Intents listed, together | | 46 (39 to 72) | 62 | |
| Other through cars (no intent listed) | | | 61 | |

Model through cars by origin and destination group (largest 12 of 54 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 27.8 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.7 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 11.7 | Telegraph Avenue |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 10.7 | none near the study area |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 8.6 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | Telegraph Ave to the south (downtown Oakland) | 6.7 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 4.5 | Telegraph Avenue |
| Ashby Ave from the west (Emeryville and I-80) | SR-13 Warren Freeway (via SR-24 east) | 3.0 | SR-24 |
| Ashby Ave from the west (Emeryville and I-80) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 2.4 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-13 Warren Freeway (via SR-24 east) | 2.0 | SR-24 |
| Alcatraz Ave from the west (Emeryville side) | SR-24 eastbound on-ramps (toward the Caldecott Tunnel) | 1.8 | SR-24 |
| Claremont Ave and Tunnel Rd toward the hills | Emeryville and West Oakland streets (55th to 67th Streets) | 1.5 | Claremont Avenue |
| other pairs | | 16.6 | |

By the arterial these cars would otherwise use: Telegraph Avenue 85 veh/h; none near the study area 15 veh/h; SR-24 10 veh/h; Claremont Avenue 6 veh/h; Alcatraz Avenue then College Avenue 2 veh/h; College Avenue then Claremont Avenue 1 veh/h.

### Study area, all residential and service streets

Model: 527 through cars per hour.

Model through cars by origin and destination group (largest 12 of 125 pairs):

| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |
| --- | --- | --- | --- |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 68.7 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | SR-24 westbound on-ramps (toward Oakland and I-980) | 64.7 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Telegraph Ave from the north (Berkeley) | 43.7 | Telegraph Avenue |
| South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 31.6 | Telegraph Avenue |
| Telegraph Ave to the south (downtown Oakland) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.6 | Telegraph Avenue |
| Telegraph Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 25.4 | Telegraph Avenue |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | 20.3 | Telegraph Avenue |
| Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) | West Oakland to the southwest (Adeline St, Market St) | 14.7 | Telegraph Avenue |
| Claremont Ave and Tunnel Rd toward the hills | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.7 | Claremont Avenue then SR-24 |
| Shattuck Ave from the north (Berkeley) | SR-24 westbound on-ramps (toward Oakland and I-980) | 13.3 | none near the study area |
| SR-24 eastbound off-ramps (arriving from Oakland and I-980) | Claremont Ave and Tunnel Rd toward the hills | 13.3 | SR-24 |
| Telegraph Ave from the north (Berkeley) | South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) | 12.2 | Telegraph Avenue |
| other pairs | | 180.1 | |

By the arterial these cars would otherwise use: Telegraph Avenue 344 veh/h; SR-24 35 veh/h; Claremont Avenue 32 veh/h; none near the study area 30 veh/h; College Avenue 16 veh/h; Claremont Avenue then SR-24 14 veh/h.

By origin group: Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 174; SR-24 eastbound off-ramps (arriving from Oakland and I-980) 84; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 68; Telegraph Ave to the south (downtown Oakland) 44; Telegraph Ave from the north (Berkeley) 40; Claremont Ave and Tunnel Rd toward the hills 25; West Oakland to the southwest (Adeline St, Market St) 24; Shattuck Ave from the north (Berkeley) 16; College Ave from the north (Berkeley) 11; Emeryville and West Oakland streets (55th to 67th Streets) 10.

By destination group: SR-24 westbound on-ramps (toward Oakland and I-980) 152; South-east Oakland (Broadway, Pleasant Valley Ave, Piedmont) 103; Telegraph Ave from the north (Berkeley) 62; Berkeley side streets north of Alcatraz Ave (Dana, Regent, Hillegass, Benvenue) 61; Claremont Ave and Tunnel Rd toward the hills 26; West Oakland to the southwest (Adeline St, Market St) 18; College Ave from the north (Berkeley) 18; Telegraph Ave to the south (downtown Oakland) 15; Emeryville and West Oakland streets (55th to 67th Streets) 15; Shattuck Ave from the north (Berkeley) 12.


Per-seed detail: `rockridge-am_peak-s1-seed1.md` (seed 1 in full).
