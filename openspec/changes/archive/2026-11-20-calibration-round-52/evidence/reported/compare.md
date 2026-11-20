STATION LINES (ten seeds; same stations file for both sets)
| Criterion | Line | Baseline | Candidate | Pass |
| --- | --- | --- | --- | --- |
| PM fitted | 74 of 92 | 74 of 92 | 81 of 92 | yes |
| PM held out | 14 of 24 | 14 of 24 | 14 of 24 | yes |
| AM fitted | 70 of 77 | 70 of 77 | 72 of 77 | yes |
| AM held out | 14 of 19 | 14 of 19 | 15 of 19 | yes |

DIAGONAL STATIONS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 66 | 183 | 516 | 102 | 155 |
| McAuley St EB, Howell to Canning | held out | 12 | 83 | 183 | 60 | 75 |
| 60th St EB, Howell to Canning | held out | 23 | 76 | 162 | 61 | 62 |
| Ayala Ave NB, Martin to Howell | held out | 60 | 81 | 212 | 64 | 98 |
| Howell St SB, 59th to McAuley | fitted | 17 | 72 | 162 | 63 | 63 |
| Sum (5 stations) | | 178 | 495 | 1234 | 349 | 453 |
| Sim / count | | | 2.78 | 6.93 | 1.96 | 2.54 |

DIAGONAL STATIONS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 50 | 85 | 180 | 62 | 148 |
| McAuley St EB, Howell to Canning | held out | 4 | 34 | 84 | 29 | 65 |
| 60th St EB, Howell to Canning | held out | 6 | 38 | 79 | 29 | 58 |
| Ayala Ave NB, Martin to Howell | held out | 50 | 48 | 86 | 48 | 61 |
| Howell St SB, 59th to McAuley | (no case) | | - | - | - | - |
| Sum (4 stations) | | 110 | 206 | 428 | 167 | 331 |
| Sim / count | | | 1.87 | 3.89 | 1.52 | 3.01 |

COLBY ST NB BLOCKS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Colby St NB, Forest/Claremont to McAuley | fitted | 189 | 122 | 144 | 170 | 200 |
| Colby St NB, McAuley to 60th | held out | 182 | 123 | 141 | 138 | 190 |
| Colby St NB, 60th to 61st | fitted | 179 | 118 | 133 | 116 | 166 |
| Colby St NB, 61st to 62nd | fitted | 174 | 128 | 151 | 135 | 176 |
| Colby St NB, 62nd to 63rd | fitted | 158 | 138 | 151 | 140 | 170 |
| Colby St NB, 63rd to 63rd | held out | 152 | 127 | 93 | 134 | 102 |
| Colby St NB, North to Alcatraz | fitted | 164 | 143 | 109 | 152 | 120 |
| Sum (7 stations) | | 1198 | 899 | 922 | 984 | 1124 |
| Sim / count | | | 0.75 | 0.77 | 0.82 | 0.94 |

COLBY ST NB BLOCKS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Colby St NB, Forest/Claremont to McAuley | fitted | 130 | 116 | 141 | 110 | 122 |
| Colby St NB, McAuley to 60th | held out | 141 | 110 | 120 | 114 | 124 |
| Colby St NB, 60th to 61st | fitted | 144 | 99 | 104 | 101 | 117 |
| Colby St NB, 61st to 62nd | fitted | 134 | 101 | 121 | 105 | 104 |
| Colby St NB, 62nd to 63rd | fitted | 136 | 83 | 116 | 88 | 104 |
| Colby St NB, 63rd to 63rd | held out | 123 | 79 | 97 | 89 | 84 |
| Colby St NB, North to Alcatraz | fitted | 104 | 82 | 97 | 83 | 90 |
| Sum (7 stations) | | 912 | 668 | 795 | 689 | 745 |
| Sim / count | | | 0.73 | 0.87 | 0.76 | 0.82 |

SR-24 RAMPS pm_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 | 598 | 773 | 975 | 708 | 886 |
| Clifton St off-ramp (node 683), counted | held out 2010 | 617 | 697 | 943 | 718 | 887 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 996 | 968 | 1054 | 926 | 1070 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 1024 | 1029 | 1013 | 994 | 973 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1547 | 1266 | 1014 | 1440 | 1137 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1614 | 1512 | 1519 | 1524 | 1517 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 | 190 | 282 | 532 | 258 | 645 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 | 657 | 906 | 1272 | 959 | 1307 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 | 621 | 724 | 646 | 727 | 756 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 | 477 | 513 | 437 | 486 | 450 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 | 351 | 455 | 414 | 351 | 358 |
| on-ramp at node 1320 (Broadway) | fitted 2012 | 351 | 266 | 310 | 363 | 373 |
| off-ramp at node 1350 (Broadway) | fitted 2012 | 315 | 301 | 319 | 305 | 323 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 | 317 | 365 | 578 | 339 | 618 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 | 218 | 253 | 34 | 213 | 33 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 | 317 | 287 | 524 | 301 | 420 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 | 218 | 131 | 151 | 178 | 146 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 113 | 126 | 126 | 107 | 115 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 61 | 91 | 89 | 63 | 60 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 | 61 | 150 | 107 | 133 | 68 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 | 360 | 400 | 381 | 342 | 326 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 | 315 | 304 | 325 | 312 | 342 |

SR-24 RAMPS am_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 derived | 508 | 570 | 1018 | 567 | 946 |
| Clifton St off-ramp (node 683), counted | held out 2010 derived | 524 | 601 | 816 | 639 | 835 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 1076 | 1097 | 804 | 986 | 983 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 898 | 881 | 893 | 893 | 888 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1417 | 883 | 818 | 922 | 856 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1501 | 1506 | 1497 | 1519 | 1518 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 derived | 59 | 255 | 493 | 306 | 664 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 derived | 558 | 710 | 1125 | 702 | 1136 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 derived | 528 | 676 | 556 | 564 | 525 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 derived | 405 | 407 | 385 | 415 | 410 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 derived | 298 | 420 | 294 | 297 | 297 |
| on-ramp at node 1320 (Broadway) | fitted 2012 derived | 298 | 256 | 252 | 305 | 294 |
| off-ramp at node 1350 (Broadway) | fitted 2012 derived | 268 | 250 | 255 | 244 | 265 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 270 | 313 | 424 | 279 | 409 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 186 | 216 | 18 | 184 | 21 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 derived | 270 | 250 | 271 | 275 | 242 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 derived | 186 | 57 | 116 | 117 | 125 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 96 | 67 | 62 | 86 | 88 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 52 | 33 | 20 | 30 | 21 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 derived | 52 | 226 | 62 | 133 | 55 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 derived | 306 | 347 | 396 | 322 | 306 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 derived | 268 | 283 | 288 | 250 | 317 |

FLIPS candidate vs baseline (recent stations, judged as in the verdict)
| Period | Station | Set | Target | Baseline | GEH | Candidate | GEH | Flip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | Dana Street North Street to Alcatraz Avenue, NB (link 1926) | fitted | 7 | 31 | 5.5 | 22 | 4.0 | fail to pass |
| pm_peak | Dana Street 63rd Street to North Street, NB (link 1924) | fitted | 11 | 60 | 8.3 | 27 | 3.7 | fail to pass |
| pm_peak | Colby Street 63rd Street to 63rd Street, NB (link 2601) | held out | 152 | 93 | 5.3 | 102 | 4.4 | fail to pass |
| pm_peak | Colby Street 60th Street to 61st Street, NB (link 2595) | fitted | 179 | 118 | 5.0 | 116 | 5.2 | pass to fail |
| pm_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, NB (link 2591) | fitted | 189 | 122 | 5.4 | 170 | 1.4 | fail to pass |
| pm_peak | 63rd Street Canning Street to Telegraph Avenue, EB (link 1860) | fitted | 27 | 81 | 7.4 | 46 | 3.2 | fail to pass |
| pm_peak | 62nd Street Hillegass Avenue to Colby Street, EB (link 2678) | fitted | 16 | 51 | 6.1 | 37 | 4.0 | fail to pass |
| pm_peak | 62nd Street Florio Street / Claremont Avenue / +1 to Hillegass Avenue, EB (link 2622) | fitted | 59 | 117 | 6.2 | 81 | 2.6 | fail to pass |
| pm_peak | Canning Street 62nd Street to 63rd Street, NB (link 1904) | fitted | 18 | 1 | 5.6 | 10 | 2.2 | fail to pass |
| pm_peak | Canning Street 59th Street to McAuley Street, SB (link 1897) | held out | 49 | 21 | 4.7 | 9 | 7.5 | pass to fail |
| pm_peak | 60th Street Howell Street to Canning Street, WB (link 1867) | held out | 25 | 55 | 4.7 | 62 | 5.7 | pass to fail |
| pm_peak | McAuley Street Canning Street to Telegraph Avenue, EB (link 1935) | fitted | 14 | 48 | 6.1 | 36 | 4.4 | fail to pass |
| pm_peak | Ayala Avenue Martin Street to Howell Street, NB (link 1831) | held out | 60 | 212 | 13.0 | 98 | 4.3 | fail to pass |
| pm_peak | Forest Street Colby Street / Claremont Avenue to Ayala Avenue, EB (link 2697) | fitted | 66 | 183 | 10.5 | 102 | 3.9 | fail to pass |
| pm_peak | Howell Street McAuley Street to 60th Street, NB (link 2056) | fitted | 6 | 21 | 4.1 | 27 | 5.1 | pass to fail |
| am_peak | Colby Street 62nd Street to 63rd Street, NB (link 2599) | fitted | 136 | 83 | 5.1 | 88 | 4.5 | fail to pass |
| am_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, SB (link 2592) | fitted | 163 | 98 | 5.7 | 116 | 4.0 | fail to pass |
| am_peak | Canning Street 61st Street to 62nd Street, SB (link 1903) | fitted | 47 | 34 | 2.0 | 18 | 5.0 | pass to fail |
| am_peak | Martin Street Ayala Avenue to Hermann Street / 58th Street, EB (link 1826) | fitted | 68 | 29 | 5.5 | 39 | 4.0 | fail to pass |
| am_peak | Ayala Avenue Martin Street to Howell Street, SB (link 1832) | held out | 36 | 78 | 5.6 | 57 | 3.1 | fail to pass |

THROUGH CARS IN THE STUDY AREA (all residential and service streets, per hour, seed mean and range; per-seed calibrate report)
| Period | Set | Shipped demand | Training demand |
| --- | --- | --- | --- |
| pm_peak | baseline | 729 (652 to 777) | 1019 (945 to 1126) |
| pm_peak | candidate | 786 (709 to 887) | 875 (704 to 979) |
| am_peak | baseline | 447 (407 to 497) | 549 (451 to 645) |
| am_peak | candidate | 394 (372 to 411) | 504 (453 to 566) |

SR-24 MAINLINE GATES, simulated (seed mean; entry: offered veh/h before scale from the run report, flow on the links leaving the gate, trips waiting at the end of the run (blank when the gate is not in the top-10 backlog table of a seed, counted as 0); exit: flow on the links into the gate)
| Period | Gate | Set | View | Offered | Simulated flow | Waiting at end (mean, seeds listed) |
| --- | --- | --- | --- | --- | --- | --- |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | shipped | 3945 | 3896 | 46 (8 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | training | 4112 | 4050 | 48 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | shipped | 3942 | 3751 | 170 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | training | 4110 | 3863 | 210 (10 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | shipped | 947 | 948 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | training | 753 | 752 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | shipped | 947 | 941 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | training | 753 | 756 | 0 (1 of 10) |
| pm_peak | SR-24 WB leaving at the west end (node 675) | baseline | shipped | | 3770 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | baseline | training | | 4101 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | candidate | shipped | | 3729 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | candidate | training | | 4124 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | shipped | | 710 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | training | | 863 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | shipped | | 682 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | training | | 875 | |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | shipped | 3656 | 3670 | 4 (3 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | training | 3696 | 3706 | 0 (2 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | shipped | 3657 | 3680 | 3 (5 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | training | 3699 | 3701 | 17 (6 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | shipped | - | 333 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | training | 376 | 373 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | shipped | - | 338 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | training | 376 | 383 | 0 (0 of 10) |
| am_peak | SR-24 WB leaving at the west end (node 675) | baseline | shipped | | 3152 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | baseline | training | | 3792 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | candidate | shipped | | 3079 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | candidate | training | | 3806 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | shipped | | 823 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | training | | 770 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | shipped | | 784 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | training | | 762 | |

DEMAND FILES (car veh/h; origin = trips that start at the gate, destination = trips that end there)
| Period | Set | View | Total | 602 origin | 1719 origin | 675 destination | 1726 destination | Surface gates origin | Surface gates destination |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | baseline | shipped | 27612 | 3945 | 947 | 3778 | 709 | 11585 | 13184 |
| pm_peak | baseline | training | 25044 | 4112 | 753 | 4156 | 891 | 9453 | 11473 |
| pm_peak | candidate | shipped | 24760 | 3942 | 947 | 3766 | 701 | 10377 | 12129 |
| pm_peak | candidate | training | 22660 | 4110 | 753 | 4149 | 890 | 8681 | 10816 |
| am_peak | baseline | shipped | 23204 | 3656 | 337 | 3159 | 818 | 10289 | 9406 |
| am_peak | baseline | training | 20584 | 3696 | 376 | 3859 | 765 | 7930 | 8644 |
| am_peak | candidate | shipped | 21511 | 3657 | 337 | 3087 | 790 | 9657 | 9115 |
| am_peak | candidate | training | 19124 | 3699 | 376 | 3847 | 764 | 7509 | 8304 |
