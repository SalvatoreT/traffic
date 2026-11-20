STATION LINES (ten seeds; same stations file for both sets)
| Criterion | Line | Baseline | Candidate | Pass |
| --- | --- | --- | --- | --- |
| PM fitted | 74 of 92 | 74 of 92 | 82 of 92 | yes |
| PM held out | 14 of 24 | 14 of 24 | 14 of 24 | yes |
| AM fitted | 70 of 77 | 70 of 77 | 74 of 77 | yes |
| AM held out | 14 of 19 | 14 of 19 | 15 of 19 | yes |

DIAGONAL STATIONS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 66 | 183 | 516 | 107 | 161 |
| McAuley St EB, Howell to Canning | held out | 12 | 83 | 183 | 65 | 81 |
| 60th St EB, Howell to Canning | held out | 23 | 76 | 162 | 64 | 66 |
| Ayala Ave NB, Martin to Howell | held out | 60 | 81 | 212 | 52 | 90 |
| Howell St SB, 59th to McAuley | fitted | 17 | 72 | 162 | 67 | 68 |
| Sum (5 stations) | | 178 | 495 | 1234 | 354 | 465 |
| Sim / count | | | 2.78 | 6.93 | 1.99 | 2.61 |

DIAGONAL STATIONS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 50 | 85 | 180 | 60 | 167 |
| McAuley St EB, Howell to Canning | held out | 4 | 34 | 84 | 28 | 74 |
| 60th St EB, Howell to Canning | held out | 6 | 38 | 79 | 29 | 57 |
| Ayala Ave NB, Martin to Howell | held out | 50 | 48 | 86 | 36 | 66 |
| Howell St SB, 59th to McAuley | (no case) | | - | - | - | - |
| Sum (4 stations) | | 110 | 206 | 428 | 154 | 365 |
| Sim / count | | | 1.87 | 3.89 | 1.40 | 3.31 |

COLBY ST NB BLOCKS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Colby St NB, Forest/Claremont to McAuley | fitted | 189 | 122 | 144 | 145 | 189 |
| Colby St NB, McAuley to 60th | held out | 182 | 123 | 141 | 142 | 182 |
| Colby St NB, 60th to 61st | fitted | 179 | 118 | 133 | 125 | 161 |
| Colby St NB, 61st to 62nd | fitted | 174 | 128 | 151 | 134 | 169 |
| Colby St NB, 62nd to 63rd | fitted | 158 | 138 | 151 | 140 | 157 |
| Colby St NB, 63rd to 63rd | held out | 152 | 127 | 93 | 135 | 106 |
| Colby St NB, North to Alcatraz | fitted | 164 | 143 | 109 | 155 | 117 |
| Sum (7 stations) | | 1198 | 899 | 922 | 976 | 1081 |
| Sim / count | | | 0.75 | 0.77 | 0.81 | 0.90 |

COLBY ST NB BLOCKS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Colby St NB, Forest/Claremont to McAuley | fitted | 130 | 116 | 141 | 113 | 114 |
| Colby St NB, McAuley to 60th | held out | 141 | 110 | 120 | 108 | 109 |
| Colby St NB, 60th to 61st | fitted | 144 | 99 | 104 | 102 | 97 |
| Colby St NB, 61st to 62nd | fitted | 134 | 101 | 121 | 111 | 109 |
| Colby St NB, 62nd to 63rd | fitted | 136 | 83 | 116 | 95 | 110 |
| Colby St NB, 63rd to 63rd | held out | 123 | 79 | 97 | 85 | 82 |
| Colby St NB, North to Alcatraz | fitted | 104 | 82 | 97 | 88 | 86 |
| Sum (7 stations) | | 912 | 668 | 795 | 701 | 707 |
| Sim / count | | | 0.73 | 0.87 | 0.77 | 0.78 |

SR-24 RAMPS pm_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 | 598 | 773 | 975 | 728 | 880 |
| Clifton St off-ramp (node 683), counted | held out 2010 | 617 | 697 | 943 | 714 | 887 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 996 | 968 | 1054 | 937 | 1060 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 1024 | 1029 | 1013 | 985 | 973 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1547 | 1266 | 1014 | 1428 | 1100 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1614 | 1512 | 1519 | 1525 | 1518 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 | 190 | 282 | 532 | 251 | 667 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 | 657 | 906 | 1272 | 952 | 1291 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 | 621 | 724 | 646 | 731 | 725 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 | 477 | 513 | 437 | 487 | 450 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 | 351 | 455 | 414 | 370 | 339 |
| on-ramp at node 1320 (Broadway) | fitted 2012 | 351 | 266 | 310 | 361 | 397 |
| off-ramp at node 1350 (Broadway) | fitted 2012 | 315 | 301 | 319 | 311 | 313 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 | 317 | 365 | 578 | 330 | 593 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 | 218 | 253 | 34 | 211 | 37 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 | 317 | 287 | 524 | 300 | 431 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 | 218 | 131 | 151 | 188 | 144 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 113 | 126 | 126 | 113 | 112 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 61 | 91 | 89 | 61 | 62 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 | 61 | 150 | 107 | 137 | 67 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 | 360 | 400 | 381 | 342 | 343 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 | 315 | 304 | 325 | 317 | 332 |

SR-24 RAMPS am_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 derived | 508 | 570 | 1018 | 568 | 934 |
| Clifton St off-ramp (node 683), counted | held out 2010 derived | 524 | 601 | 816 | 626 | 822 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 1076 | 1097 | 804 | 973 | 982 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 898 | 881 | 893 | 898 | 901 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1417 | 883 | 818 | 935 | 852 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1501 | 1506 | 1497 | 1516 | 1515 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 derived | 59 | 255 | 493 | 303 | 658 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 derived | 558 | 710 | 1125 | 707 | 1150 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 derived | 528 | 676 | 556 | 576 | 533 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 derived | 405 | 407 | 385 | 415 | 407 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 derived | 298 | 420 | 294 | 308 | 281 |
| on-ramp at node 1320 (Broadway) | fitted 2012 derived | 298 | 256 | 252 | 306 | 306 |
| off-ramp at node 1350 (Broadway) | fitted 2012 derived | 268 | 250 | 255 | 250 | 251 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 270 | 313 | 424 | 272 | 416 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 186 | 216 | 18 | 183 | 23 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 derived | 270 | 250 | 271 | 280 | 196 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 derived | 186 | 57 | 116 | 123 | 121 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 96 | 67 | 62 | 86 | 83 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 52 | 33 | 20 | 30 | 20 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 derived | 52 | 226 | 62 | 144 | 55 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 derived | 306 | 347 | 396 | 314 | 302 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 derived | 268 | 283 | 288 | 254 | 296 |

FLIPS candidate vs baseline (recent stations, judged as in the verdict)
| Period | Station | Set | Target | Baseline | GEH | Candidate | GEH | Flip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | Dana Street North Street to Alcatraz Avenue, NB (link 1926) | fitted | 7 | 31 | 5.5 | 23 | 4.2 | fail to pass |
| pm_peak | Dana Street 63rd Street to North Street, NB (link 1924) | fitted | 11 | 60 | 8.3 | 29 | 4.0 | fail to pass |
| pm_peak | Colby Street 63rd Street to 63rd Street, NB (link 2601) | held out | 152 | 93 | 5.3 | 106 | 4.1 | fail to pass |
| pm_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, NB (link 2591) | fitted | 189 | 122 | 5.4 | 145 | 3.4 | fail to pass |
| pm_peak | 63rd Street Canning Street to Telegraph Avenue, EB (link 1860) | fitted | 27 | 81 | 7.4 | 44 | 2.8 | fail to pass |
| pm_peak | 62nd Street Hillegass Avenue to Colby Street, EB (link 2678) | fitted | 16 | 51 | 6.1 | 37 | 4.0 | fail to pass |
| pm_peak | 62nd Street Florio Street / Claremont Avenue / +1 to Hillegass Avenue, EB (link 2622) | fitted | 59 | 117 | 6.2 | 74 | 1.8 | fail to pass |
| pm_peak | Canning Street 59th Street to McAuley Street, SB (link 1897) | held out | 49 | 21 | 4.7 | 9 | 7.5 | pass to fail |
| pm_peak | 60th Street Howell Street to Canning Street, WB (link 1867) | held out | 25 | 55 | 4.7 | 61 | 5.5 | pass to fail |
| pm_peak | McAuley Street Canning Street to Telegraph Avenue, EB (link 1935) | fitted | 14 | 48 | 6.1 | 39 | 4.9 | fail to pass |
| pm_peak | Ayala Avenue Martin Street to Howell Street, NB (link 1831) | held out | 60 | 212 | 13.0 | 90 | 3.4 | fail to pass |
| pm_peak | Forest Street Colby Street / Claremont Avenue to Ayala Avenue, EB (link 2697) | fitted | 66 | 183 | 10.5 | 107 | 4.4 | fail to pass |
| am_peak | Colby Street 62nd Street to 63rd Street, NB (link 2599) | fitted | 136 | 83 | 5.1 | 95 | 3.8 | fail to pass |
| am_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, SB (link 2592) | fitted | 163 | 98 | 5.7 | 108 | 4.7 | fail to pass |
| am_peak | 60th Street Canning Street to Telegraph Avenue, EB (link 1870) | fitted | 8 | 37 | 6.0 | 29 | 4.8 | fail to pass |
| am_peak | Martin Street Ayala Avenue to Hermann Street / 58th Street, EB (link 1826) | fitted | 68 | 29 | 5.5 | 34 | 4.8 | fail to pass |
| am_peak | Ayala Avenue Martin Street to Howell Street, SB (link 1832) | held out | 36 | 78 | 5.6 | 58 | 3.2 | fail to pass |

THROUGH CARS IN THE STUDY AREA (all residential and service streets, per hour, seed mean and range; per-seed calibrate report)
| Period | Set | Shipped demand | Training demand |
| --- | --- | --- | --- |
| pm_peak | baseline | 729 (652 to 777) | 1019 (945 to 1126) |
| pm_peak | candidate | 800 (735 to 865) | 931 (825 to 1033) |
| am_peak | baseline | 447 (407 to 497) | 549 (451 to 645) |
| am_peak | candidate | 427 (382 to 486) | 566 (505 to 640) |

SR-24 MAINLINE GATES, simulated (seed mean; entry: offered veh/h before scale from the run report, flow on the links leaving the gate, trips waiting at the end of the run (blank when the gate is not in the top-10 backlog table of a seed, counted as 0); exit: flow on the links into the gate)
| Period | Gate | Set | View | Offered | Simulated flow | Waiting at end (mean, seeds listed) |
| --- | --- | --- | --- | --- | --- | --- |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | shipped | 3945 | 3896 | 46 (8 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | training | 4112 | 4050 | 48 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | shipped | 3940 | 3727 | 193 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | training | 4110 | 3871 | 220 (10 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | shipped | 947 | 948 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | training | 753 | 752 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | shipped | 948 | 949 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | training | 753 | 746 | 0 (0 of 10) |
| pm_peak | SR-24 WB leaving at the west end (node 675) | baseline | shipped | | 3770 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | baseline | training | | 4101 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | candidate | shipped | | 3736 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | candidate | training | | 4125 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | shipped | | 710 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | training | | 863 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | shipped | | 679 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | training | | 874 | |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | shipped | 3656 | 3670 | 4 (3 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | training | 3696 | 3706 | 0 (2 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | shipped | 3654 | 3675 | 22 (9 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | training | 3694 | 3700 | 27 (8 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | shipped | - | 333 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | training | 376 | 373 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | shipped | - | 336 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | training | 376 | 375 | 0 (0 of 10) |
| am_peak | SR-24 WB leaving at the west end (node 675) | baseline | shipped | | 3152 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | baseline | training | | 3792 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | candidate | shipped | | 3065 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | candidate | training | | 3798 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | shipped | | 823 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | training | | 770 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | shipped | | 790 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | training | | 757 | |

DEMAND FILES (car veh/h; origin = trips that start at the gate, destination = trips that end there)
| Period | Set | View | Total | 602 origin | 1719 origin | 675 destination | 1726 destination | Surface gates origin | Surface gates destination |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | baseline | shipped | 27612 | 3945 | 947 | 3778 | 709 | 11585 | 13184 |
| pm_peak | baseline | training | 25044 | 4112 | 753 | 4156 | 891 | 9453 | 11473 |
| pm_peak | candidate | shipped | 24689 | 3940 | 948 | 3766 | 703 | 10375 | 12123 |
| pm_peak | candidate | training | 22570 | 4110 | 753 | 4146 | 891 | 8716 | 10852 |
| am_peak | baseline | shipped | 23204 | 3656 | 337 | 3159 | 818 | 10289 | 9406 |
| am_peak | baseline | training | 20584 | 3696 | 376 | 3859 | 765 | 7930 | 8644 |
| am_peak | candidate | shipped | 21440 | 3654 | 337 | 3086 | 789 | 9653 | 9115 |
| am_peak | candidate | training | 18834 | 3694 | 376 | 3843 | 764 | 7478 | 8235 |
