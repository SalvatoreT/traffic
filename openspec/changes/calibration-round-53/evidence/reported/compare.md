STATION LINES (ten seeds; same stations file for both sets)
| Criterion | Line | Baseline | Candidate | Pass |
| --- | --- | --- | --- | --- |
| PM fitted | 81 of 92 | 81 of 92 | 81 of 92 | yes |
| PM held out | 14 of 24 | 14 of 24 | 14 of 24 | yes |
| AM fitted | 72 of 77 | 72 of 77 | 72 of 77 | yes |
| AM held out | 15 of 19 | 15 of 19 | 15 of 19 | yes |

DIAGONAL STATIONS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 66 | 102 | 155 | 113 | 155 |
| McAuley St EB, Howell to Canning | held out | 12 | 60 | 75 | 73 | 75 |
| 60th St EB, Howell to Canning | held out | 23 | 61 | 62 | 66 | 62 |
| Ayala Ave NB, Martin to Howell | held out | 60 | 64 | 98 | 68 | 98 |
| Howell St SB, 59th to McAuley | fitted | 17 | 63 | 63 | 64 | 63 |
| Sum (5 stations) | | 178 | 349 | 453 | 384 | 453 |
| Sim / count | | | 1.96 | 2.54 | 2.16 | 2.54 |

DIAGONAL STATIONS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 50 | 62 | 148 | 68 | 148 |
| McAuley St EB, Howell to Canning | held out | 4 | 29 | 65 | 30 | 65 |
| 60th St EB, Howell to Canning | held out | 6 | 29 | 58 | 36 | 58 |
| Ayala Ave NB, Martin to Howell | held out | 50 | 48 | 61 | 49 | 61 |
| Howell St SB, 59th to McAuley | (no case) | | - | - | - | - |
| Sum (4 stations) | | 110 | 167 | 331 | 184 | 331 |
| Sim / count | | | 1.52 | 3.01 | 1.67 | 3.01 |

COLBY ST NB BLOCKS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Colby St NB, Forest/Claremont to McAuley | fitted | 189 | 170 | 200 | 151 | 200 |
| Colby St NB, McAuley to 60th | held out | 182 | 138 | 190 | 125 | 190 |
| Colby St NB, 60th to 61st | fitted | 179 | 116 | 166 | 112 | 166 |
| Colby St NB, 61st to 62nd | fitted | 174 | 135 | 176 | 131 | 176 |
| Colby St NB, 62nd to 63rd | fitted | 158 | 140 | 170 | 137 | 170 |
| Colby St NB, 63rd to 63rd | held out | 152 | 134 | 102 | 131 | 102 |
| Colby St NB, North to Alcatraz | fitted | 164 | 152 | 120 | 149 | 120 |
| Sum (7 stations) | | 1198 | 984 | 1124 | 935 | 1124 |
| Sim / count | | | 0.82 | 0.94 | 0.78 | 0.94 |

COLBY ST NB BLOCKS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Colby St NB, Forest/Claremont to McAuley | fitted | 130 | 110 | 122 | 98 | 122 |
| Colby St NB, McAuley to 60th | held out | 141 | 114 | 124 | 100 | 124 |
| Colby St NB, 60th to 61st | fitted | 144 | 101 | 117 | 94 | 117 |
| Colby St NB, 61st to 62nd | fitted | 134 | 105 | 104 | 99 | 104 |
| Colby St NB, 62nd to 63rd | fitted | 136 | 88 | 104 | 87 | 104 |
| Colby St NB, 63rd to 63rd | held out | 123 | 89 | 84 | 81 | 84 |
| Colby St NB, North to Alcatraz | fitted | 104 | 83 | 90 | 87 | 90 |
| Sum (7 stations) | | 912 | 689 | 745 | 646 | 745 |
| Sim / count | | | 0.76 | 0.82 | 0.71 | 0.82 |

SR-24 RAMPS pm_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 | 598 | 708 | 886 | 717 | 886 |
| Clifton St off-ramp (node 683), counted | held out 2010 | 617 | 718 | 887 | 713 | 887 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 996 | 926 | 1070 | 922 | 1070 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 1024 | 994 | 973 | 989 | 973 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1547 | 1440 | 1137 | 1396 | 1137 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1614 | 1524 | 1517 | 1527 | 1517 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 | 190 | 258 | 645 | 254 | 645 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 | 657 | 959 | 1307 | 969 | 1307 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 | 621 | 727 | 756 | 691 | 756 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 | 477 | 486 | 450 | 479 | 450 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 | 351 | 351 | 358 | 378 | 358 |
| on-ramp at node 1320 (Broadway) | fitted 2012 | 351 | 363 | 373 | 349 | 373 |
| off-ramp at node 1350 (Broadway) | fitted 2012 | 315 | 305 | 323 | 312 | 323 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 | 317 | 339 | 618 | 340 | 618 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 | 218 | 213 | 33 | 209 | 33 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 | 317 | 301 | 420 | 296 | 420 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 | 218 | 178 | 146 | 181 | 146 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 113 | 107 | 115 | 109 | 115 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 61 | 63 | 60 | 66 | 60 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 | 61 | 133 | 68 | 137 | 68 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 | 360 | 342 | 326 | 339 | 326 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 | 315 | 312 | 342 | 310 | 342 |

SR-24 RAMPS am_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 derived | 508 | 567 | 946 | 594 | 946 |
| Clifton St off-ramp (node 683), counted | held out 2010 derived | 524 | 639 | 835 | 634 | 835 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 1076 | 986 | 983 | 984 | 983 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 898 | 893 | 888 | 892 | 888 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1417 | 922 | 856 | 969 | 856 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1501 | 1519 | 1518 | 1519 | 1518 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 derived | 59 | 306 | 664 | 253 | 664 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 derived | 558 | 702 | 1136 | 706 | 1136 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 derived | 528 | 564 | 525 | 570 | 525 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 derived | 405 | 415 | 410 | 418 | 410 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 derived | 298 | 297 | 297 | 306 | 297 |
| on-ramp at node 1320 (Broadway) | fitted 2012 derived | 298 | 305 | 294 | 294 | 294 |
| off-ramp at node 1350 (Broadway) | fitted 2012 derived | 268 | 244 | 265 | 245 | 265 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 270 | 279 | 409 | 274 | 409 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 186 | 184 | 21 | 182 | 21 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 derived | 270 | 275 | 242 | 281 | 242 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 derived | 186 | 117 | 125 | 117 | 125 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 96 | 86 | 88 | 83 | 88 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 52 | 30 | 21 | 28 | 21 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 derived | 52 | 133 | 55 | 137 | 55 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 derived | 306 | 322 | 306 | 324 | 306 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 derived | 268 | 250 | 317 | 250 | 317 |

FLIPS candidate vs baseline (recent stations, judged as in the verdict)
| Period | Station | Set | Target | Baseline | GEH | Candidate | GEH | Flip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | McAuley Street Canning Street to Telegraph Avenue, EB (link 1935) | fitted | 14 | 36 | 4.4 | 43 | 5.4 | pass to fail |
| pm_peak | Howell Street McAuley Street to 60th Street, NB (link 2056) | fitted | 6 | 27 | 5.1 | 25 | 4.7 | fail to pass |
| am_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, SB (link 2592) | fitted | 163 | 116 | 4.0 | 98 | 5.7 | pass to fail |
| am_peak | Canning Street 61st Street to 62nd Street, SB (link 1903) | fitted | 47 | 18 | 5.0 | 27 | 3.4 | fail to pass |

THROUGH CARS IN THE STUDY AREA (all residential and service streets, per hour, seed mean and range; per-seed calibrate report)
| Period | Set | Shipped demand | Training demand |
| --- | --- | --- | --- |
| pm_peak | baseline | 786 (709 to 887) | 875 (704 to 979) |
| pm_peak | candidate | 774 (646 to 869) | 875 (704 to 979) |
| am_peak | baseline | 394 (372 to 411) | 504 (453 to 566) |
| am_peak | candidate | 402 (372 to 447) | 504 (453 to 566) |

SR-24 MAINLINE GATES, simulated (seed mean; entry: offered veh/h before scale from the run report, flow on the links leaving the gate, trips waiting at the end of the run (blank when the gate is not in the top-10 backlog table of a seed, counted as 0); exit: flow on the links into the gate)
| Period | Gate | Set | View | Offered | Simulated flow | Waiting at end (mean, seeds listed) |
| --- | --- | --- | --- | --- | --- | --- |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | shipped | 3942 | 3751 | 170 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | training | 4110 | 3863 | 210 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | shipped | 3938 | 3733 | 177 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | training | 4110 | 3863 | 210 (10 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | shipped | 947 | 941 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | training | 753 | 756 | 0 (1 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | shipped | 944 | 939 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | training | 753 | 756 | 0 (1 of 10) |
| pm_peak | SR-24 WB leaving at the west end (node 675) | baseline | shipped | | 3729 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | baseline | training | | 4124 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | candidate | shipped | | 3693 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | candidate | training | | 4124 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | shipped | | 682 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | training | | 875 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | shipped | | 686 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | training | | 875 | |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | shipped | 3657 | 3680 | 3 (5 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | training | 3699 | 3701 | 17 (6 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | shipped | 3659 | 3678 | 7 (5 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | training | 3699 | 3701 | 17 (6 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | shipped | - | 338 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | training | 376 | 383 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | shipped | - | 337 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | training | 376 | 383 | 0 (0 of 10) |
| am_peak | SR-24 WB leaving at the west end (node 675) | baseline | shipped | | 3079 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | baseline | training | | 3806 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | candidate | shipped | | 3115 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | candidate | training | | 3806 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | shipped | | 784 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | training | | 762 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | shipped | | 788 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | training | | 762 | |

DEMAND FILES (car veh/h; origin = trips that start at the gate, destination = trips that end there)
| Period | Set | View | Total | 602 origin | 1719 origin | 675 destination | 1726 destination | Surface gates origin | Surface gates destination |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | baseline | shipped | 24760 | 3942 | 947 | 3766 | 701 | 10377 | 12129 |
| pm_peak | baseline | training | 22660 | 4110 | 753 | 4149 | 890 | 8681 | 10816 |
| pm_peak | candidate | shipped | 24874 | 3938 | 944 | 3759 | 703 | 10449 | 12203 |
| pm_peak | candidate | training | 22660 | 4110 | 753 | 4149 | 890 | 8681 | 10816 |
| am_peak | baseline | shipped | 21511 | 3657 | 337 | 3087 | 790 | 9657 | 9115 |
| am_peak | baseline | training | 19124 | 3699 | 376 | 3847 | 764 | 7509 | 8304 |
| am_peak | candidate | shipped | 21508 | 3659 | 334 | 3100 | 791 | 9622 | 9093 |
| am_peak | candidate | training | 19124 | 3699 | 376 | 3847 | 764 | 7509 | 8304 |
