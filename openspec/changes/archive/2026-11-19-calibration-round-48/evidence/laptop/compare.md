STATION LINES (ten seeds; same stations file for both sets)
| Criterion | Line | Baseline | Candidate | Pass |
| --- | --- | --- | --- | --- |
| PM fitted | 74 of 92 | 74 of 92 | 78 of 92 | yes |
| PM held out | 14 of 24 | 14 of 24 | 13 of 24 | NO |
| AM fitted | 70 of 77 | 70 of 77 | 72 of 77 | yes |
| AM held out | 14 of 19 | 14 of 19 | 15 of 19 | yes |

DIAGONAL STATIONS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 66 | 183 | 516 | 151 | 260 |
| McAuley St EB, Howell to Canning | held out | 12 | 83 | 183 | 78 | 99 |
| 60th St EB, Howell to Canning | held out | 23 | 76 | 162 | 80 | 83 |
| Ayala Ave NB, Martin to Howell | held out | 60 | 81 | 212 | 73 | 129 |
| Howell St SB, 59th to McAuley | fitted | 17 | 72 | 162 | 80 | 80 |
| Sum (5 stations) | | 178 | 495 | 1234 | 462 | 651 |
| Sim / count | | | 2.78 | 6.93 | 2.59 | 3.66 |

DIAGONAL STATIONS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 50 | 85 | 180 | 63 | 151 |
| McAuley St EB, Howell to Canning | held out | 4 | 34 | 84 | 29 | 64 |
| 60th St EB, Howell to Canning | held out | 6 | 38 | 79 | 34 | 55 |
| Ayala Ave NB, Martin to Howell | held out | 50 | 48 | 86 | 39 | 70 |
| Howell St SB, 59th to McAuley | (no case) | | - | - | - | - |
| Sum (4 stations) | | 110 | 206 | 428 | 165 | 341 |
| Sim / count | | | 1.87 | 3.89 | 1.50 | 3.10 |

COLBY ST NB BLOCKS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Colby St NB, Forest/Claremont to McAuley | fitted | 189 | 122 | 144 | 161 | 185 |
| Colby St NB, McAuley to 60th | held out | 182 | 123 | 141 | 139 | 179 |
| Colby St NB, 60th to 61st | fitted | 179 | 118 | 133 | 115 | 153 |
| Colby St NB, 61st to 62nd | fitted | 174 | 128 | 151 | 133 | 152 |
| Colby St NB, 62nd to 63rd | fitted | 158 | 138 | 151 | 140 | 146 |
| Colby St NB, 63rd to 63rd | held out | 152 | 127 | 93 | 135 | 104 |
| Colby St NB, North to Alcatraz | fitted | 164 | 143 | 109 | 151 | 121 |
| Sum (7 stations) | | 1198 | 899 | 922 | 974 | 1038 |
| Sim / count | | | 0.75 | 0.77 | 0.81 | 0.87 |

COLBY ST NB BLOCKS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Colby St NB, Forest/Claremont to McAuley | fitted | 130 | 116 | 141 | 121 | 127 |
| Colby St NB, McAuley to 60th | held out | 141 | 110 | 120 | 116 | 125 |
| Colby St NB, 60th to 61st | fitted | 144 | 99 | 104 | 111 | 122 |
| Colby St NB, 61st to 62nd | fitted | 134 | 101 | 121 | 107 | 121 |
| Colby St NB, 62nd to 63rd | fitted | 136 | 83 | 116 | 91 | 121 |
| Colby St NB, 63rd to 63rd | held out | 123 | 79 | 97 | 91 | 85 |
| Colby St NB, North to Alcatraz | fitted | 104 | 82 | 97 | 86 | 103 |
| Sum (7 stations) | | 912 | 668 | 795 | 724 | 803 |
| Sim / count | | | 0.73 | 0.87 | 0.79 | 0.88 |

SR-24 RAMPS pm_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 | 598 | 773 | 975 | 690 | 850 |
| Clifton St off-ramp (node 683), counted | held out 2010 | 617 | 697 | 943 | 750 | 905 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 996 | 968 | 1054 | 923 | 975 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 1024 | 1029 | 1013 | 1054 | 1040 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1547 | 1266 | 1014 | 1513 | 1175 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1614 | 1512 | 1519 | 1526 | 1481 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 | 190 | 282 | 532 | 240 | 633 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 | 657 | 906 | 1272 | 1068 | 1305 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 | 621 | 724 | 646 | 733 | 721 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 | 477 | 513 | 437 | 522 | 478 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 | 351 | 455 | 414 | 401 | 423 |
| on-ramp at node 1320 (Broadway) | fitted 2012 | 351 | 266 | 310 | 383 | 433 |
| off-ramp at node 1350 (Broadway) | fitted 2012 | 315 | 301 | 319 | 314 | 315 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 | 317 | 365 | 578 | 380 | 581 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 | 218 | 253 | 34 | 216 | 105 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 | 317 | 287 | 524 | 304 | 508 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 | 218 | 131 | 151 | 192 | 162 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 113 | 126 | 126 | 116 | 115 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 61 | 91 | 89 | 63 | 70 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 | 61 | 150 | 107 | 153 | 65 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 | 360 | 400 | 381 | 318 | 353 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 | 315 | 304 | 325 | 343 | 354 |

SR-24 RAMPS am_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 derived | 508 | 570 | 1018 | 554 | 1057 |
| Clifton St off-ramp (node 683), counted | held out 2010 derived | 524 | 601 | 816 | 642 | 764 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 1076 | 1097 | 804 | 1064 | 985 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 898 | 881 | 893 | 913 | 899 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1417 | 883 | 818 | 990 | 836 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1501 | 1506 | 1497 | 1522 | 1515 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 derived | 59 | 255 | 493 | 293 | 692 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 derived | 558 | 710 | 1125 | 785 | 1125 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 derived | 528 | 676 | 556 | 597 | 577 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 derived | 405 | 407 | 385 | 437 | 419 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 derived | 298 | 420 | 294 | 336 | 302 |
| on-ramp at node 1320 (Broadway) | fitted 2012 derived | 298 | 256 | 252 | 331 | 305 |
| off-ramp at node 1350 (Broadway) | fitted 2012 derived | 268 | 250 | 255 | 271 | 279 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 270 | 313 | 424 | 264 | 509 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 186 | 216 | 18 | 188 | 32 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 derived | 270 | 250 | 271 | 266 | 313 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 derived | 186 | 57 | 116 | 141 | 139 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 96 | 67 | 62 | 91 | 95 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 52 | 33 | 20 | 46 | 49 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 derived | 52 | 226 | 62 | 140 | 67 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 derived | 306 | 347 | 396 | 297 | 323 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 derived | 268 | 283 | 288 | 282 | 320 |

FLIPS candidate vs baseline (recent stations, judged as in the verdict)
| Period | Station | Set | Target | Baseline | GEH | Candidate | GEH | Flip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | Dana Street North Street to Alcatraz Avenue, SB (link 1927) | fitted | 43 | 5 | 7.9 | 20 | 4.2 | fail to pass |
| pm_peak | Dana Street North Street to Alcatraz Avenue, NB (link 1926) | fitted | 7 | 31 | 5.5 | 16 | 2.7 | fail to pass |
| pm_peak | Dana Street 63rd Street to North Street, SB (link 1925) | fitted | 41 | 3 | 8.0 | 16 | 4.7 | fail to pass |
| pm_peak | Dana Street 63rd Street to North Street, NB (link 1924) | fitted | 11 | 60 | 8.3 | 21 | 2.6 | fail to pass |
| pm_peak | Colby Street 63rd Street to 63rd Street, NB (link 2601) | held out | 152 | 93 | 5.3 | 104 | 4.3 | fail to pass |
| pm_peak | Colby Street 60th Street to 61st Street, NB (link 2595) | fitted | 179 | 118 | 5.0 | 115 | 5.3 | pass to fail |
| pm_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, NB (link 2591) | fitted | 189 | 122 | 5.4 | 161 | 2.1 | fail to pass |
| pm_peak | 63rd Street Canning Street to Telegraph Avenue, EB (link 1860) | fitted | 27 | 81 | 7.4 | 51 | 3.8 | fail to pass |
| pm_peak | Canning Street 62nd Street to 63rd Street, NB (link 1904) | fitted | 18 | 1 | 5.6 | 8 | 2.7 | fail to pass |
| pm_peak | Canning Street 59th Street to McAuley Street, SB (link 1897) | held out | 49 | 21 | 4.7 | 10 | 7.2 | pass to fail |
| pm_peak | 60th Street Howell Street to Canning Street, WB (link 1867) | held out | 25 | 55 | 4.7 | 64 | 5.9 | pass to fail |
| pm_peak | Howell Street McAuley Street to 60th Street, NB (link 2056) | fitted | 6 | 21 | 4.1 | 27 | 5.1 | pass to fail |
| pm_peak | Howell Street 59th Street to McAuley Street, NB (link 2054) | fitted | 7 | 20 | 3.6 | 28 | 5.1 | pass to fail |
| am_peak | Colby Street 62nd Street to 63rd Street, NB (link 2599) | fitted | 136 | 83 | 5.1 | 91 | 4.2 | fail to pass |
| am_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, SB (link 2592) | fitted | 163 | 98 | 5.7 | 109 | 4.6 | fail to pass |
| am_peak | McAuley Street Colby Street to Ayala Avenue, WB (link 1928) | fitted | 16 | 39 | 4.4 | 44 | 5.2 | pass to fail |
| am_peak | Martin Street Ayala Avenue to Hermann Street / 58th Street, EB (link 1826) | fitted | 68 | 29 | 5.5 | 43 | 3.3 | fail to pass |
| am_peak | Ayala Avenue Martin Street to Howell Street, SB (link 1832) | held out | 36 | 78 | 5.6 | 54 | 2.7 | fail to pass |

THROUGH CARS IN THE STUDY AREA (all residential and service streets, per hour, seed mean and range; per-seed calibrate report)
| Period | Set | Shipped demand | Training demand |
| --- | --- | --- | --- |
| pm_peak | baseline | 729 (652 to 777) | 1019 (945 to 1126) |
| pm_peak | candidate | 944 (886 to 1044) | 1080 (1029 to 1117) |
| am_peak | baseline | 447 (407 to 497) | 549 (451 to 645) |
| am_peak | candidate | 466 (407 to 527) | 532 (448 to 567) |

SR-24 MAINLINE GATES, simulated (seed mean; entry: offered veh/h before scale from the run report, flow on the links leaving the gate, trips waiting at the end of the run (blank when the gate is not in the top-10 backlog table of a seed, counted as 0); exit: flow on the links into the gate)
| Period | Gate | Set | View | Offered | Simulated flow | Waiting at end (mean, seeds listed) |
| --- | --- | --- | --- | --- | --- | --- |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | shipped | 3945 | 3896 | 46 (8 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | training | 4112 | 4050 | 48 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | shipped | 4114 | 3819 | 270 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | training | 4368 | 3994 | 338 (10 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | shipped | 947 | 948 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | training | 753 | 752 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | shipped | 1232 | 1237 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | training | 700 | 689 | 0 (0 of 10) |
| pm_peak | SR-24 WB leaving at the west end (node 675) | baseline | shipped | | 3770 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | baseline | training | | 4101 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | candidate | shipped | | 3806 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | candidate | training | | 4040 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | shipped | | 710 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | training | | 863 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | shipped | | 755 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | training | | 980 | |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | shipped | 3656 | 3670 | 4 (3 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | training | 3696 | 3706 | 0 (2 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | shipped | 3676 | 3680 | 12 (6 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | training | 3730 | 3736 | 12 (7 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | shipped | - | 333 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | training | 376 | 373 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | shipped | 844 | 828 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | training | 746 | 751 | 0 (0 of 10) |
| am_peak | SR-24 WB leaving at the west end (node 675) | baseline | shipped | | 3152 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | baseline | training | | 3792 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | candidate | shipped | | 3265 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | candidate | training | | 4022 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | shipped | | 823 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | training | | 770 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | shipped | | 757 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | training | | 811 | |

DEMAND FILES (car veh/h; origin = trips that start at the gate, destination = trips that end there)
| Period | Set | View | Total | 602 origin | 1719 origin | 675 destination | 1726 destination | Surface gates origin | Surface gates destination |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | baseline | shipped | 27612 | 3945 | 947 | 3778 | 709 | 11585 | 13184 |
| pm_peak | baseline | training | 25044 | 4112 | 753 | 4156 | 891 | 9453 | 11473 |
| pm_peak | candidate | shipped | 28816 | 4114 | 1232 | 3949 | 854 | 12174 | 13819 |
| pm_peak | candidate | training | 26891 | 4368 | 700 | 4331 | 1119 | 10210 | 12390 |
| am_peak | baseline | shipped | 23204 | 3656 | 337 | 3159 | 818 | 10289 | 9406 |
| am_peak | baseline | training | 20584 | 3696 | 376 | 3859 | 765 | 7930 | 8644 |
| am_peak | candidate | shipped | 25301 | 3676 | 844 | 3366 | 831 | 11362 | 10846 |
| am_peak | candidate | training | 21936 | 3730 | 746 | 4147 | 834 | 9132 | 9411 |
