# Rockridge: current model against a compact model

OpenSpec change `compact-model-extent`. Decision by the project lead, 2026-11-16: build a compact model next to the current one, leave what is published alone, and report both side by side. Nothing in the compact model was tuned toward the four through-car ranges or the held-out stations; its settings are the shipped ones (design D3, D4). All runs are 60 minutes at scale 1 on simulator fingerprint `f0df1aabc323` (unchanged; the engine was not touched). "Current" is the published `rockridge` model: its figures come from `data/calibration/rockridge.assessment.md` and the calibration record, and PM seeds 1 to 10 were rerun here and matched the published ten-seed summary in all 66 metrics. "Compact" is `rockridge-compact` (`data/areas/rockridge-compact.json`), assessed to its own output set (`data/calibration/rockridge-compact.assessment-compact.md`).

## The compact extent

The study area, its counts and targets are those of `rockridge`. Only the simulated network around it changes: a polygon in the area config (`extent.polygon`), drawn edge by edge by the rule in design D2. Where a street leaves the polygon, the importer cuts it on the polygon edge and puts a gate there.

- North: Ashby Ave and its junctions, from west of Telegraph Ave to Domingo Ave, are in. The north-south streets are cut 80 to 110 m north of Ashby Ave. Claremont Ave and Claremont Blvd are cut south of Russell St, so the Russell St all-way stop and Avalon Ave are out. Tunnel Rd is cut about 100 m east of the Domingo Ave signal, at the Caltrans SR-13 station.
- West: the east-west streets are cut halfway between Telegraph Ave and Shattuck Ave (Racine St in, Shattuck Ave out).
- Southwest: a pocket keeps Telegraph Ave at 51st St and 52nd St, Claremont Ave / Telegraph Ave, Shattuck Ave / 52nd St and the SR-24 ramps at 52nd St. SR-24 is cut at Shattuck Ave; the Martin Luther King Jr Way ramps are out.
- South: Telegraph Ave is cut between 48th St and 49th St; the edge runs northeast one block southeast of Claremont Ave to College Ave south of Forest St.
- East: Broadway and the SR-24 ramps at Broadway, Keith Ave and Miles Ave are in; side streets are cut one block beyond Broadway; SR-24 is cut east of the Broadway ramps, so the SR-13 interchange is out. North of SR-24 the edge runs straight to Tunnel Rd and takes in the hill streets between Claremont Ave and Broadway.

The model ends at Ashby Ave in the north because the counts support it: the Caltrans SR-13 stations at Claremont Ave and Domingo Ave give the two Ashby Ave / Tunnel Rd gates their volumes, and the 2010 worksheet count at Ashby Ave / Claremont Ave stays inside as a station.

Gates nearest the study area are on 56th St, Aileen St and 57th St west of Telegraph Ave, 176 to 188 m from the study-area polygon (straight line). That is twice the longest bounding-street queue measured in round 37 (90 m) but inside the 200 m judged-zone buffer. 66 of the 72 surface gates take a class-default volume (ASSUMPTION), against six counted ones (two Caltrans AADT stations and four Oakland turning-movement legs). The Telegraph Ave gates use the Alcatraz Ave count (north leg, 808 m away) and the 40th St count (north leg, 699 m away); the 55th St gate uses the Market St / 55th St count, 914 m away, because the gate rule only reads the Oakland turning-movement counts, not the 2010 worksheets.

Cut roads and gates (distances are straight-line distances from the study-area polygon; PM target before the count fit):

| Edge | Cut road | Class | Gate node | Lat, lon | From the study area (m) | PM target in / out (veh/h) | What sets the volume |
| --- | --- | --- | --- | --- | --- | --- | --- |
| N | Ashby Avenue | primary | 239 | 37.85576, -122.26335 | 663 | 952 / 1163 | DATA: Caltrans AADT, SR-13 (Ashby Ave) west of Claremont Ave, 23,500 (2023-24 count year) |
| N | Tunnel Road | primary | 492 | 37.85653, -122.24088 | 1175 | 1094 / 1337 | DATA: Caltrans AADT, SR-13 (Tunnel Rd) at Domingo Ave, 27,000 (east side, 2023-24) |
| N | Ellsworth Street | residential | 237 | 37.85725, -122.26148 | 783 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| N | Telegraph Avenue | secondary | 251 | 37.85746, -122.25952 | 777 | 1064 / 900 | DATA: Oakland TMC AlcatrazAve, N leg (mean of 4 PM counts), 808 m away |
| N | Florence Street | residential | 220 | 37.85757, -122.25847 | 775 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| N | Regent Street | residential | 376 | 37.85773, -122.25703 | 771 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| N | Hillegass Avenue | residential | 389 | 37.85786, -122.25574 | 767 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| N | Benvenue Avenue | residential | 427 | 37.85802, -122.25439 | 764 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| N | College Avenue | tertiary | 421 | 37.85815, -122.25317 | 763 | 203 / 248 | ASSUMPTION: class default (tertiary) ADT 5000 |
| N | Piedmont Avenue | residential | 370 | 37.85839, -122.25078 | 802 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| N | (unnamed service) | service | 511 | 37.85855, -122.24139 | 1265 | 6 / 7 | ASSUMPTION: class default (service) ADT 150 |
| N | Pine Avenue | residential | 429 | 37.85862, -122.24852 | 885 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| N | Claremont Boulevard | tertiary | 517 | 37.85887, -122.24527 | 1053 | 203 / 248 | ASSUMPTION: class default (tertiary) ADT 5000 |
| N | Claremont Avenue | secondary | 516 | 37.85890, -122.24472 | 1086 | 365 / 446 | ASSUMPTION: class default (secondary) ADT 9000 |
| N | Domingo Avenue | residential | 483 | 37.85894, -122.24397 | 1132 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| N | (unnamed service) | service | 509 | 37.85900, -122.24277 | 1209 | 6 / 7 | ASSUMPTION: class default (service) ADT 150 |
| E | Manila Avenue | residential | 475 | 37.84252, -122.24524 | 935 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| E | Taft Avenue | residential | 462 | 37.84297, -122.24492 | 931 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| E | Lawton Avenue | residential | 436 | 37.84373, -122.24440 | 925 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| E | Mendocino Avenue | residential | 445 | 37.84424, -122.24404 | 921 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| E | South Rockridge Boulevard | residential | 481 | 37.84523, -122.24307 | 935 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| E | Rockridge Place | residential | 443 | 37.84539, -122.24292 | 938 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| E | Margarido Drive | residential | 432 | 37.84655, -122.24177 | 979 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| E | Ocean View Drive | residential | 450 | 37.84734, -122.24098 | 1022 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| E | Brookside Avenue | residential | 447 | 37.84808, -122.24043 | 1054 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| E | (unnamed service) | service | 461 | 37.84837, -122.24034 | 1058 | 6 / 7 | ASSUMPTION: class default (service) ADT 150 |
| E | Broadway | tertiary | 548 | 37.84948, -122.23999 | 1081 | 203 / 248 | ASSUMPTION: class default (tertiary) ADT 5000 |
| E | Golden Gate Avenue | tertiary | 552 | 37.84953, -122.23998 | 1083 | 203 / 248 | ASSUMPTION: class default (tertiary) ADT 5000 |
| E | SR-24 eastbound, east of the Broadway ramps | motorway | 466 | 37.84982, -122.23989 | 1092 | - | DATA: Caltrans ramp ADT of the ramps it feeds or takes, times K (ASSUMPTION) |
| E | SR-24 westbound, east of the Broadway ramps | motorway | 549 | 37.85017, -122.23978 | 1103 | - | DATA: Caltrans ramp ADT of the ramps it feeds or takes, times K (ASSUMPTION) |
| E | Chabot Road | residential | 528 | 37.85121, -122.23956 | 1132 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| E | (unnamed service) | service | 503 | 37.85185, -122.23972 | 1124 | 6 / 7 | ASSUMPTION: class default (service) ADT 150 |
| E | (unnamed service) | service | 527 | 37.85202, -122.23976 | 1122 | 6 / 7 | ASSUMPTION: class default (service) ADT 150 |
| E | The Uplands | tertiary | 496 | 37.85344, -122.24011 | 1115 | 203 / 248 | ASSUMPTION: class default (tertiary) ADT 5000 |
| E | Oak Ridge Road | residential | 551 | 37.85522, -122.24056 | 1137 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| S | Clifton Street | residential | 275 | 37.83958, -122.25623 | 364 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| S | Carlton Street | residential | 263 | 37.84029, -122.24696 | 941 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| S | Thomas Avenue | residential | 265 | 37.84041, -122.24759 | 887 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| S | Shafter Avenue | residential | 269 | 37.84050, -122.25520 | 323 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| S | Broadway | primary | 536 | 37.84058, -122.24856 | 805 | 567 / 693 | ASSUMPTION: class default (primary) ADT 14000 |
| S | Monroe Avenue | residential | 535 | 37.84075, -122.24647 | 949 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| S | Bryant Avenue | residential | 267 | 37.84076, -122.24956 | 720 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| S | Manila Avenue | residential | 271 | 37.84078, -122.24964 | 713 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| S | Kales Avenue | residential | 260 | 37.84104, -122.25108 | 591 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| S | College Avenue | tertiary | 274 | 37.84111, -122.25146 | 557 | 203 / 248 | ASSUMPTION: class default (tertiary) ADT 5000 |
| S | Lawton Avenue | residential | 276 | 37.84130, -122.25249 | 466 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| S | Hudson Street | residential | 278 | 37.84139, -122.25420 | 332 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| S | Boyd Avenue | residential | 258 | 37.84146, -122.25339 | 388 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| SW | Clarke Street | residential | 115 | 37.83533, -122.26133 | 672 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| SW | Telegraph Avenue | secondary | 86 | 37.83533, -122.26278 | 678 | 549 / 731 | DATA: Oakland TMC TelegraphAve_40thSt, N leg (mean of 4 PM counts), 699 m away |
| SW | Shattuck Avenue | tertiary | 113 | 37.83533, -122.26386 | 698 | 203 / 248 | ASSUMPTION: class default (tertiary) ADT 5000 |
| SW | 49th Street | residential | 64 | 37.83552, -122.26031 | 662 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| SW | SR-24 ramp to 52nd St (from I-580 and SR-24 west) | motorway | 530 | 37.83582, -122.26537 | 697 | - | DATA: Caltrans ramp ADT of the ramps it feeds or takes, times K (ASSUMPTION) |
| SW | SR-24 ramp from 52nd St (to SR-24 west and I-580) | motorway | 529 | 37.83605, -122.26603 | 705 | - | DATA: Caltrans ramp ADT of the ramps it feeds or takes, times K (ASSUMPTION) |
| SW | 50th Street | residential | 30 | 37.83614, -122.25972 | 607 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| SW | Webster Street | residential | 49 | 37.83623, -122.25963 | 600 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| SW | 51st Street | secondary | 90 | 37.83670, -122.25917 | 565 | 0 / 446 | ASSUMPTION: class default (secondary) ADT 9000 |
| SW | 51st Street | secondary | 87 | 37.83680, -122.25908 | 558 | 365 / 0 | ASSUMPTION: class default (secondary) ADT 9000 |
| SW | (unnamed service) | service | 106 | 37.83707, -122.25883 | 539 | 6 / 7 | ASSUMPTION: class default (service) ADT 150 |
| SW | Avon Street | residential | 10 | 37.83744, -122.25847 | 512 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| SW | 52nd Street | tertiary | 56 | 37.83745, -122.26623 | 593 | 203 / 248 | ASSUMPTION: class default (tertiary) ADT 5000 |
| SW | Cavour Street | residential | 71 | 37.83812, -122.25781 | 463 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| SW | Shattuck Avenue | tertiary | 74 | 37.83918, -122.26437 | 341 | 203 / 248 | ASSUMPTION: class default (tertiary) ADT 5000 |
| W | SR-24 eastbound, at Shattuck Ave | motorway | 533 | 37.83997, -122.26361 | 232 | - | DATA: Caltrans ramp ADT of the ramps it feeds or takes, times K (ASSUMPTION) |
| W | 55th Street | tertiary | 48 | 37.84035, -122.26362 | 206 | 402 / 505 | DATA: Oakland TMC MarketSt_55thSt, E leg (mean of 4 PM counts), 914 m away |
| W | SR-24 westbound, at Shattuck Ave | motorway | 531 | 37.84040, -122.26362 | 204 | - | DATA: Caltrans ramp ADT of the ramps it feeds or takes, times K (ASSUMPTION) |
| W | 56th Street | residential | 114 | 37.84114, -122.26365 | 176 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| W | Aileen Street | residential | 204 | 37.84195, -122.26368 | 181 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| W | 57th Street | residential | 167 | 37.84284, -122.26371 | 188 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| W | 58th Street | residential | 149 | 37.84362, -122.26374 | 200 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| W | 59th Street | residential | 157 | 37.84471, -122.26378 | 217 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| W | 61st Street | residential | 127 | 37.84727, -122.26387 | 256 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| W | 62nd Street | residential | 174 | 37.84801, -122.26390 | 268 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| W | 63rd Street | residential | 135 | 37.84882, -122.26393 | 280 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| W | Alcatraz Avenue | tertiary | 195 | 37.84976, -122.26396 | 295 | 547 / 623 | DATA: Oakland TMC AlcatrazAve, W leg (mean of 4 PM counts), 307 m away |
| W | 66th Street | residential | 225 | 37.85180, -122.26383 | 341 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| W | Prince Street | residential | 0 | 37.85347, -122.26363 | 453 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |
| W | Fulton Street | residential | 233 | 37.85520, -122.26341 | 609 | 32 / 40 | ASSUMPTION: class default (residential) ADT 800 |

## Size and run time

| | Current | Compact |
| --- | --- | --- |
| Nodes / links | 1,762 / 4,411 | 553 / 1,305 |
| Link length (km, both directions) | 494 | 133 |
| Gates: surface / freeway | 117 / 6 | 72 / 6 |
| Signals / all-way stops | 94 / 85 | 37 / 24 |
| Freeway ramp connections | 36 | 12 |
| Car trips an hour offered, AM / midday / PM | 22,424 / 16,569 / 26,352 | 12,085 / 9,197 / 14,308 |
| of which PM gate to gate / with a freeway end / local | 4,755 / 11,951 / 9,646 | 4,490 / 5,661 / 4,157 |
| PM trips completed in the hour (seed mean) | 25,857 | 13,988 |
| CPU time per simulated PM hour | 40 s | 9 s |
| Ten PM seeds, 3 parallel jobs, wall clock | 161 s | 35 s |
| Demand build (shipped view): wall clock, peak memory | 454 s, 1.83 GB | 78 s, 0.57 GB |
| Largest simulator process, peak memory | 95 MB | 45 MB |
| Network / demand file | 1,801 KB / 2,229 KB | 514 KB / 1,935 KB |

## Through cars on the four counted blocks, PM

Through means neither trip end is in the study area. Seed means; the ranges are from the resident volunteer count.

| Block | Counted range | Current, seeds 1-10 | Compact, seeds 1-10 | Current, seeds 11-20 | Compact, seeds 11-20 |
| --- | --- | --- | --- | --- | --- |
| Hillegass Ave SB | 79-120 | 143 | 221 | 146 | 195 |
| Colby St SB | 39-117 | 132 | 235 | 140 | 205 |
| Hillegass Ave NB | 48-95 | 98 | 75 | 96 | 84 |
| Colby St NB | 102-145 | 150 | 138 | 152 | 142 |
| Inside the range | | 0 of 4 | 2 of 4 | 0 of 4 | 2 of 4 |
| All side streets of the study area | | 822 | 918 | | 872 |

In the compact model the northbound blocks fall inside their ranges and the southbound blocks move far above them. The calibrate report's origin and destination table puts most of the southbound excess on trips from the west (the approach groups the area config calls West Berkeley and Ashby Ave from the west, which in the compact model are the streets cut just west of Telegraph Ave and the Ashby Ave gate) to the north-east (Claremont Ave, Tunnel Rd and the hill streets). The demand build's gravity seed favors gates on opposite sides of the study area, and these trips shortcut the Alcatraz Ave, College Ave and Claremont Ave corner by turning from Alcatraz Ave into Colby St and Hillegass Ave. Those turns carry 440 cars an hour in the compact model against 360 counted and 259 in the current model. Entries from Telegraph Ave are too high in both models (460 and 465 against 264 counted).

## Headline freeway shares

Hillegass Ave NB from the freeway / Colby St NB from the freeway / Hillegass Ave SB to the freeway / Colby St SB to the freeway, in percent. Observed (PM): 47 / 47 / 68 / 45. Only the PM peak is gated (D5: all four within 10 points).

| Period | Current | Compact |
| --- | --- | --- |
| PM, seeds 1-10 | 52.9 / 50.5 / 55.1 / 37.4; error 7.5; 3 of 4 | 47.0 / 38.6 / 51.8 / 36.3; error 8.4; 3 of 4 |
| PM, seeds 11-20 | 52.8 / 47.9 / 56.6 / 38.9; 3 of 4 | 46.9 / 39.9 / 53.1 / 37.6; error 7.4; 3 of 4 |
| AM, seeds 1-10 | 50.8 / 43.9 / 59.6 / 47.3; error 3.0; 4 of 4 | 47.6 / 38.4 / 52.4 / 41.6; error 4.3; 4 of 4 |
| Midday, seeds 1-10 | 52.6 / 37.2 / 62.8 / 45.5; error 5.4; 4 of 4 | 45.6 / 41.0 / 64.9 / 47.2; error 4.3; 4 of 4 |

Hillegass Ave SB to the freeway is the share that fails in both models (current 55.1, compact 51.8, observed 68).

## Gridlock and entry backlog

Cars cleared from gridlock an hour, seed mean. Judged = in the judged zone (study area, bounding streets, the junctions on them and 200 m beyond) plus far ones whose chain reaches it; the stability rule (D16) allows under 1. Backlog = trips waiting to enter at the end, percent of trips spawned (rule: under 2% in 9 of 10 seeds).

| Period | Current: judged / far | Compact: judged / far | Current: backlog mean, seeds under 2% | Compact: backlog mean, seeds under 2% | D16, current / compact |
| --- | --- | --- | --- | --- | --- |
| PM, seeds 1-10 | 0.60 / 0.50 | 0.20 / 4.20 | 0.71%, 10 | 0.32%, 10 | holds / holds |
| PM, seeds 11-20 | 0.00 / 1.30 | 0.20 / 5.70 | 0.57%, 10 | 0.37%, 10 | holds / holds |
| AM, seeds 1-10 | 0.00 / 0.30 | 0.00 / 2.10 | 0.03%, 10 | 0.95%, 10 (max 1.86%) | holds / holds |
| Midday, seeds 1-10 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00%, 10 | 0.01%, 10 | holds / holds |

The far clearings move with the edge. In the current model they sit on Russell St and the hillside streets around Ashby Ave / Claremont Ave, 1.0 to 1.4 km out. In the compact model, over PM seeds 1 to 10, they sit at Ashby Ave / Domingo Ave / Tunnel Rd (14 cars), Broadway at Patton St, Keith Ave and the off-ramp (22) and along Ashby Ave (6), all within a few hundred meters of a compact gate; none had a chain into the judged zone. Arterial mean speed, PM: current 8.26 m/s, compact 6.27 m/s (each over its own arterial links).

Longest standing queue on a bounding street, PM seeds 1-10, seed mean in meters (share of samples with a full link):

| Street | Current | Compact |
| --- | --- | --- |
| Telegraph Ave | 74 (2.9%) | 70 (0.5%) |
| Alcatraz Ave | 82 (1.6%) | 101 (17.4%) |
| College Ave | 87 (3.3%) | 91 (12.4%) |
| Claremont Ave | 56 (0) | 65 (0) |
| SR-24 | 43 (0) | 43 (0) |

## Bounding streets and counted junctions, PM

Simulator flow over counted flow, summed over each corridor's link stations, seed mean (from the two assessments; corridor names as the stations files give them). Intersection counts marked "not in the model" lie outside the compact extent.

| Corridor | Current: stations, ratio | Compact: stations, ratio |
| --- | --- | --- |
| AlcatrazAve | 8, 0.96 | 8, 0.95 |
| ashby | 2, 0.54 | 2, 0.55 |
| freeway ramps | 16, 1.14 | 8, 0.92 |
| intersection count alcatraz-claremont | 6, 0.83 | 6, 1.04 |
| intersection count alcatraz-college | 8, 0.95 | 8, 0.92 |
| intersection count ashby-claremont | 8, 0.78 | 8, 0.83 |
| intersection count mlk-52nd | 8, 0.88 | not in the model |
| intersection count mlk-55th | 8, 0.97 | not in the model |
| intersection count shattuck-52nd | 8, 0.79 | 8, 0.88 |
| intersection count shattuck-55th | 8, 0.93 | not in the model |
| intersection count sr24-52nd | 6, 0.83 | 6, 0.96 |
| intersection count sr24-clifton-claremont | 7, 0.99 | 7, 1.07 |
| intersection count sr24-hudson-claremont | 7, 1.07 | 7, 1.04 |
| intersection count sr24-mlk | 2, 0.89 | not in the model |
| intersection count telegraph-51st | 8, 0.75 | 8, 0.78 |
| intersection count telegraph-52nd-claremont | 8, 0.84 | 8, 0.98 |
| intersection count telegraph-55th | 8, 0.99 | 8, 1.05 |
| MarketSt_55thSt | 8, 0.73 | not in the model |
| sanpablo | 2, 0.98 | not in the model |
| tunnel | 2, 0.73 | 2, 0.75 |

Telegraph Ave and Alcatraz Ave legs at their junction (Oakland turning-movement counts, mean of four PM counts), and the Caltrans stations, veh/h:

| Station | Counted | Current | Compact |
| --- | --- | --- | --- |
| Telegraph Ave approaching Alcatraz Ave from the north (N leg entering) | 1,064 | 1,307 | 1,120 |
| Telegraph Ave leaving Alcatraz Ave to the north (N leg leaving) | 900 | 842 | 970 |
| Telegraph Ave approaching from the south (S leg entering) | 1,093 | 1,038 | 1,023 |
| Telegraph Ave leaving to the south (S leg leaving) | 910 | 1,128 | 917 |
| Alcatraz Ave approaching from the west (W leg entering) | 547 | 285 | 355 |
| Alcatraz Ave leaving to the west (W leg leaving) | 623 | 495 | 491 |
| Alcatraz Ave approaching from the east (E leg entering), held out | 418 | 377 | 459 |
| Alcatraz Ave leaving to the east (E leg leaving), held out | 689 | 539 | 578 |
| Ashby Ave west of Claremont Ave, inward / outward (Caltrans AADT x K), held out | 952 / 1,163 | 671 / 474 | 619 / 550 |
| Tunnel Rd at Domingo Ave, inward / outward (Caltrans AADT x K), held out | 1,094 / 1,337 | 865 / 916 | 941 / 875 |
| SR-24 off-ramp to Telegraph Ave at Aileen St | 621 | 740 | 622 |
| SR-24 on-ramp from Telegraph Ave at 56th St | 657 | 979 | 649 |
| SR-24 off-ramps at Keith Ave / Broadway / Miles Ave | 477 / 315 / 315 | 516 / 326 / 336 | 441 / 313 / 317 |
| SR-24 on-ramps at Brookside Ave / Broadway / Miles Ave | 351 / 351 / 360 | 494 / 219 / 357 | 130 / 326 / 388 |

## Count stations

| | Current | Compact |
| --- | --- | --- |
| Stations in the demand fit (all periods), fitted / held out | 271 / 86 (357) | 225 / 64 (289) |
| Of them from 2021 or later, fitted / held out | 120 / 27 | 117 / 23 |
| By source: volunteer count, 2010 and 2013 worksheets, Oakland TMC, Caltrans ramp, Caltrans AADT | 136, 177, 20, 16, 8 | 136, 129, 12, 8, 4 |
| Split: dependency groups, held | 313, 76 | 254, 59 |
| PM, recent stations GEH < 5, fitted | 75 of 92 (82%) | 69 of 89 (78%) |
| PM, recent stations GEH < 5, held out (out of sample) | 13 of 24 (54%) | 16 of 22 (73%) |
| PM, older counts GEH < 5, fitted / held out | 48 of 95 (51%) / 12 of 34 (35%) | 47 of 67 (70%) / 9 of 23 (39%) |
| AM, recent stations GEH < 5, fitted | 67 of 77 (87%) | 71 of 77 (92%) |
| AM, recent stations GEH < 5, held out | 14 of 19 (74%) | 14 of 19 (74%) |

The station rule needs more than 85%. The two held-out sets are not the same stations: the compact split was frozen anew by the same rule (design D4), and station ids carry network link numbers, so of the 159 station labels both models share, 26 are held out only in the current model and 26 only in the compact one. The older-count rows of the compact model cover fewer and nearer stations, so they are not comparable one for one.

## The delay-feedback loop

`tools/cost-loop.ts --config data/demand/rockridge-compact.config.json --jobs 3 --no-stop`, the acceptance rule unchanged: keep an iteration only if it is stable under D16 with fewer judged cars cleared from gridlock and less backlog than the free-flow and BPR costs, its headline-share error within 0.5 points of theirs, and no fitted GEH share down by more than 5 points. PM peak scored over seeds 1 to 10. Report: `data/calibration/rockridge-compact.cost-loop.md` (523 s wall clock, 0.62 GB peak).

| Iteration | PM stable (D16) | Judged / near / far cleared per hour | Where far (seed totals) | Backlog mean, seeds under 2% | Headline shares, error | Through cars HSB / CSB / HNB / CNB | GEH < 5, fitted / held out | Cost gap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 (free-flow and BPR costs) | yes | 0.20 / 0.20 / 4.20 | Ashby Ave / Domingo Ave / Tunnel Rd 14, Broadway / Patton St 11, Broadway 6 | 0.32%, 10 | 47 / 39 / 52 / 36, 8.4 | 221 / 235 / 75 / 138 | 74% / 64% | - |
| 1 | no | 1.60 / 1.60 / 25.90 | Ashby Ave / Domingo Ave / Tunnel Rd 30, Ashby Ave / Claremont Crescent 27, Ashby Ave / Claremont Ave 23 | 1.59%, 7 | 44 / 40 / 52 / 42, 7.2 | 177 / 177 / 85 / 144 | 75% / 62% | 0.202 |
| 2 | no | 0.20 / 0.20 / 11.80 | Ashby Ave / Domingo Ave / Tunnel Rd 41, Ashby Ave 19, Ashby Ave / Claremont Crescent 12 | 2.02%, 5 | 48 / 40 / 54 / 44, 5.6 | 176 / 169 / 73 / 149 | 81% / 64% | 0.060 |

Converged at iteration 2 (gap under 0.10). Every iteration was rejected: iteration 1 clears 1.6 judged cars an hour and leaves 7 seeds under 2% backlog, iteration 2 leaves only 5. The demand keeps its free-flow and BPR costs, and the final build reproduced the compact demand byte for byte. The delay feedback moves the southbound through cars down by 45 to 65 an hour and the headline error from 8.4 to 5.6 points, but the gridlock it creates sits at Ashby Ave between Claremont Ave and Domingo Ave, the same junction cluster that kept the current model's loop rejected, now a few hundred meters inside the compact model's north-east edge.

The current model's loop (round 37, `data/calibration/rockridge.record.md`), for comparison: iterations 1 to 3 cleared 0.10 / 0.00 / 0.00 judged cars an hour and 24.6 / 13.9 / 10.6 far ones (Ashby Ave / Claremont Crescent, Avalon Ave / Claremont Blvd, Ashby Ave / Claremont Ave), with backlog 1.07%, 1.75% and 1.86% (10, 6 and 5 seeds under 2%) and headline errors 5.4, 3.7 and 5.5; every iteration was rejected. The round recorded no through cars per block for its iterations.

## Three published proposals on both models

`explore --check` on the links in `public/data/rockridge.proposals.json` (area id changed for the compact model; the links name places, not link ids), PM, AM and midday, seeds 1 to 3, full hour. The search would want 10 seeds for an interval; with 3 these are point estimates. Through cars on the study area's side streets an hour, before and after, and the block with the largest all-car rise.

| Proposal | Period | Current: through before → after | Compact: through before → after | Current: largest all-car rise on one block | Compact: largest all-car rise on one block |
| --- | --- | --- | --- | --- | --- |
| p1, top option (six changes: filters at 63rd St & Colby St, Ayala Ave & Martin St, Ayala Ave & Forest St, 62nd St; diverter at 63rd St & Hillegass Ave; slow street on Colby St) | PM | 837 → 229 (−73%) | 978 → 507 (−48%) | 60th St, Claremont Ave / Hillegass Ave to Colby St: 38 → 100 | McAuley St, Colby St to Ayala Ave: 105 → 262 |
| | AM | 480 → 118 (−75%) | 437 → 159 (−64%) | McAuley St, Colby St to Ayala Ave: 62 → 151 | McAuley St, Colby St to Ayala Ave: 50 → 122 |
| | Midday | 373 → 103 (−72%) | 396 → 141 (−64%) | McAuley St, Ayala Ave to Howell St: 27 → 60 | McAuley St, Ayala Ave to Howell St: 40 → 88 |
| | Mean of periods | 564 → 150 (−73%) | 604 → 269 (−55%) | | |
| p3, no-closures option (five one-way blocks on Hillegass Ave, Colby St, Forest St, Martin St, 62nd St; slow street on Colby St) | PM | 837 → 437 (−48%) | 978 → 666 (−32%) | 60th St, Claremont Ave / Hillegass Ave to Colby St: 38 → 97 | 60th St, Claremont Ave / Hillegass Ave to Colby St: 105 → 192 |
| | AM | 480 → 237 (−51%) | 437 → 280 (−36%) | Dana St, 63rd St to North St: 41 → 84 | Hillegass Ave, 61st St to 60th St: 182 → 222 |
| | Midday | 373 → 210 (−44%) | 396 → 256 (−36%) | Dana St, 63rd St to North St: 31 → 60 | Canning St, 58th St to 59th St: 33 → 61 |
| | Mean of periods | 564 → 294 (−48%) | 604 → 401 (−34%) | | |
| p5, two-filter option (filters at 63rd St & Colby St and 63rd St & Hillegass Ave) | PM | 837 → 651 (−22%) | 978 → 702 (−28%) | Martin St, Claremont Ave to Ayala Ave: 271 → 328 | Martin St, Claremont Ave to Ayala Ave: 258 → 349 |
| | AM | 480 → 307 (−36%) | 437 → 283 (−35%) | Dana St, 63rd St to North St: 41 → 85 | Martin St, Claremont Ave to Ayala Ave: 183 → 216 |
| | Midday | 373 → 237 (−36%) | 396 → 282 (−29%) | 62nd St, Claremont Ave / College Ave to Hillegass Ave: 70 → 107 | Martin St, Claremont Ave to Ayala Ave: 154 → 196 |
| | Mean of periods | 564 → 398 (−29%) | 604 → 423 (−30%) | | |

The order of the three options is the same on both models (p1 cuts most, then p3, then p5), and both pass the access check with no rejection. The compact model gives p1 and p3 smaller cuts in percent (−55% and −34% against −73% and −48%) and roughly the same cut to p5. Its PM baseline carries more through cars (978 against 837 on seeds 1 to 3), mostly the southbound excess above, and p1 and p3 remove less of it. The largest all-car rises land on the same blocks in most rows (60th St, McAuley St, Martin St), larger in the compact model.

## Second round: a cordon prior from the current model

Decision by the project lead, 2026-11-16 ("One more round on its edges"): keep the current model published, set the compact model's edge trips from data instead of class assumptions, compare again, and switch only if southbound cut-through comes into line; otherwise drop the compact model. Method in design D8: the current model's shipped car flows, assigned on its own fit settings, cut where their routes cross the compact extent (`tools/cordon-prior.ts`), became the compact trip table, with the unchanged count fit on top and the frozen compact split. The prior was built without tuning: 155 s and 0.38 GB, 4 to 21 trips an hour lost at crossings no compact gate matched. The current model's assumed movement flows (393 an hour in the PM) were left out, because the compact build makes its own from the same counts. 292 an hour of freeway-to-freeway trips were also left out.

What sets each of the 78 compact gates' trips: the parent model's assignment 69 (63 surface and all 6 freeway gates), a count 2 (Tunnel Rd and Alcatraz Ave west, counts taken 230 and 307 m away), class default 7 (gates no parent route crosses: four service roads, Margarido Dr, Rockridge Pl, Oak Ridge Rd). The other four counted gates take counts 700 m to 1.5 km inside the extent; they keep the parent's trips and their counts act where they were taken, as fit stations (design D8). A run with no count scaling at all gave the same southbound result (Hillegass Ave SB 213, Colby St SB 232).

PM peak, three models (seeds 1 to 10 unless marked; the AM, midday, assessment, loop and proposal runs were not repeated for the prior, see below):

| | Current | Compact as built | Compact with cordon prior |
| --- | --- | --- | --- |
| Car trips an hour (PM, fitted table) | 26,352 | 14,308 | 19,194 |
| Through cars HSB / CSB / HNB / CNB (79-120 / 39-117 / 48-95 / 102-145) | 143 / 132 / 98 / 150 | 221 / 235 / 75 / 138 | 200 / 231 / 85 / 145 |
| Same, seeds 11-20 | 146 / 140 / 96 / 152 | 195 / 205 / 84 / 142 | 225 / 225 / 87 / 150 |
| Blocks inside their range, seeds 1-10 / 11-20 | 0 / 0 | 2 / 2 | 2 / 1 |
| Headline shares HNB / CNB / HSB / CSB (47 / 47 / 68 / 45), error, within 10 | 52.9 / 50.5 / 55.1 / 37.4; 7.5; 3 of 4 | 47.0 / 38.6 / 51.8 / 36.3; 8.4; 3 of 4 | 50.3 / 43.0 / 41.0 / 31.0; 12.1; 2 of 4 |
| Same, seeds 11-20 | 52.8 / 47.9 / 56.6 / 38.9; 3 of 4 | 46.9 / 39.9 / 53.1 / 37.6; 7.4; 3 of 4 | 52.6 / 44.3 / 38.4 / 32.1; 12.7; 2 of 4 |
| Cars cleared from gridlock an hour, judged / far | 0.60 / 0.50 | 0.20 / 4.20 | 0.30 / 7.20 |
| Same, seeds 11-20 | 0.00 / 1.30 | 0.20 / 5.70 | 0.30 / 5.50 |
| Entry backlog, seeds under 2% (1-10; 11-20) | 0.71%, 10; 0.57%, 10 | 0.32%, 10; 0.37%, 10 | 1.42%, 10; 1.48%, 9 |
| Stability rule (D16) | holds | holds | holds |
| Arterial mean speed (m/s) | 8.26 | 6.27 | 6.55 |
| Telegraph Ave approaching Alcatraz Ave from the north (1,064) | 1,307 | 1,120 | 1,262 |
| Telegraph Ave leaving to the south (910) | 1,128 | 917 | 1,009 |
| Alcatraz Ave approaching from the west (547) | 285 | 355 | 343 |
| Turns from Alcatraz Ave into Colby St and Hillegass Ave (360) | 259 | 440 | 381 |
| Entries from Telegraph Ave into the study area (264) | 465 | 460 | 535 |
| Recent stations GEH < 5, fitted | 75 of 92 (82%) | 69 of 89 (78%) | 67 of 89 (75%) |
| Validation stations, scored in the shipped fit | 18 of 24 (75%) | 16 of 22 (73%) | 13 of 22 (59%) |
| Older counts GEH < 5, fitted | 48 of 95 (51%) | 47 of 67 (70%) | 53 of 67 (79%) |

The fitted evidence got worse on every rule but the older counts: two headline shares outside 10 points instead of one, fewer recent stations within GEH 5, twice the backlog, and the Telegraph Ave north leg farther from its count. Southbound through cars stayed far above the current model's on both seed sets. By the round's rule the prior is not kept, and `rockridge-compact` is back on its as-built demand (byte for byte, `cdc967c2df88`). The round stopped there. The AM and midday runs, the assessment, the delay-feedback loop and the proposal checks were not repeated for the prior; the commands to run them are in the session report if wanted.

The west side. The prior brought the turns from Alcatraz Ave into Colby St and Hillegass Ave close to the count (381 against 360). It also cut the gates halfway to Shattuck Ave to 5 to 13 trips an hour on 61st, 62nd and 63rd St. But the entries from Telegraph Ave into the study area rose to 535 against 264 counted. The southbound excess therefore now comes from traffic that reaches Telegraph Ave and turns east into the grid, more than from the west-side gates. At the cordon the prior and the current model's own simulation agree in total (12,606 against 12,950 trips an hour entering). They differ at single gates: Alcatraz Ave west 563 against 345 (the count there is 547), Shattuck Ave 672 against 550, Claremont Ave north 237 against 105. The same trips still choose Hillegass Ave and Colby St southbound more often in the compact network than in the current one: College Ave northbound carries 343 against 436 and Hillegass Ave southbound 185 against 145 (median link flows). So the excess comes from how the compact network loads and routes the same trips, not from the gate volumes.

Assumed movements and double counting. The four assumed movement flows that turn from Alcatraz Ave into Hillegass Ave and Colby St pin 133 through trips an hour (PM) in every build. The build takes the trips they replace out of plain flows only where the static best route makes the same turn: 375 an hour in the current model, 129 in the compact as built and 0.2 with the prior. Turns the simulator's drivers make on routes the static assignment did not predict are not taken out, so on those turns pinned and plain trips can add up. The share of this in the excess was not measured separately.

## What the compact model cannot show

- Rerouting beyond the edge. Gate volumes are fixed, so traffic that a change in the Trapezoid pushes off its route cannot move to Shattuck Ave, Martin Luther King Jr Way, Broadway Terrace, SR-13 or the Berkeley streets north of Ashby Ave. It lands on Telegraph Ave, Alcatraz Ave, College Ave, Claremont Ave, Ashby Ave, Broadway and 51st St, so a proposal's effect on those streets is an upper bound. The current model has the same limit at its own, farther, edge.
- Changes in where trips enter. A closure that makes a whole corridor slower cannot shift demand between gates or to other ramps outside the extent (the Martin Luther King Jr Way ramps, SR-13).
- Effects on streets outside the extent, including the junctions where the current model's far gridlock sits (Claremont Ave / Russell St, Avalon Ave, Ashby Ave / Claremont Crescent).
- The counts outside the extent: the Martin Luther King Jr Way, Shattuck Ave / 55th St, Market St / 55th St and San Pablo Ave stations drop out of both the fit and the scoring.
- Trips of census blocks outside the extent as trips with their own origins; they arrive through gates at class-default or counted volumes.
- A gate volume better than its source: most compact gates are residential streets at a class default (ASSUMPTION), and the four counted surface gates take counts 300 to 900 m away.

## Reading

First round: the compact model runs four to five times faster and comes closer to the Telegraph Ave and Alcatraz Ave counts at their junction, but its edge sent more through trips across the study area, and southbound through cars on Hillegass Ave and Colby St rose from about 140 to 200 or more an hour. Second round: taking the edge trips from the current model's own trip table removed the guessed gate volumes and brought the Alcatraz Ave turn-ins near their count, yet southbound through cars stayed at 200 to 231 an hour and the fitted evidence got worse. So the excess comes from how the smaller network loads and routes the same trips, not from the edge assumptions. By the rule the project lead set, the compact model is not a candidate to switch to; I would drop it and keep only the generic extent and cordon tooling, which no shipped area uses.
