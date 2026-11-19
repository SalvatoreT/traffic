STATION LINES (ten seeds; same stations file for both sets)
| Criterion | Line | Baseline | Candidate | Pass |
| --- | --- | --- | --- | --- |
| PM fitted | 74 of 92 | 74 of 92 | 81 of 92 | yes |
| PM held out | 14 of 24 | 14 of 24 | 13 of 24 | NO |
| AM fitted | 70 of 77 | 70 of 77 | 74 of 77 | yes |
| AM held out | 14 of 19 | 14 of 19 | 14 of 19 | yes |

DIAGONAL STATIONS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 66 | 183 | 516 | 113 | 170 |
| McAuley St EB, Howell to Canning | held out | 12 | 83 | 183 | 60 | 71 |
| 60th St EB, Howell to Canning | held out | 23 | 76 | 162 | 62 | 69 |
| Ayala Ave NB, Martin to Howell | held out | 60 | 81 | 212 | 61 | 111 |
| Howell St SB, 59th to McAuley | fitted | 17 | 72 | 162 | 60 | 71 |
| Sum (5 stations) | | 178 | 495 | 1234 | 355 | 492 |
| Sim / count | | | 2.78 | 6.93 | 2.00 | 2.77 |

DIAGONAL STATIONS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 50 | 85 | 180 | 66 | 121 |
| McAuley St EB, Howell to Canning | held out | 4 | 34 | 84 | 28 | 63 |
| 60th St EB, Howell to Canning | held out | 6 | 38 | 79 | 31 | 56 |
| Ayala Ave NB, Martin to Howell | held out | 50 | 48 | 86 | 51 | 52 |
| Howell St SB, 59th to McAuley | (no case) | | - | - | - | - |
| Sum (4 stations) | | 110 | 206 | 428 | 175 | 293 |
| Sim / count | | | 1.87 | 3.89 | 1.59 | 2.66 |

COLBY ST NB BLOCKS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Colby St NB, Forest/Claremont to McAuley | fitted | 189 | 122 | 144 | 159 | 211 |
| Colby St NB, McAuley to 60th | held out | 182 | 123 | 141 | 130 | 212 |
| Colby St NB, 60th to 61st | fitted | 179 | 118 | 133 | 114 | 179 |
| Colby St NB, 61st to 62nd | fitted | 174 | 128 | 151 | 125 | 183 |
| Colby St NB, 62nd to 63rd | fitted | 158 | 138 | 151 | 129 | 170 |
| Colby St NB, 63rd to 63rd | held out | 152 | 127 | 93 | 126 | 116 |
| Colby St NB, North to Alcatraz | fitted | 164 | 143 | 109 | 143 | 138 |
| Sum (7 stations) | | 1198 | 899 | 922 | 927 | 1210 |
| Sim / count | | | 0.75 | 0.77 | 0.77 | 1.01 |

COLBY ST NB BLOCKS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Colby St NB, Forest/Claremont to McAuley | fitted | 130 | 116 | 141 | 114 | 131 |
| Colby St NB, McAuley to 60th | held out | 141 | 110 | 120 | 116 | 127 |
| Colby St NB, 60th to 61st | fitted | 144 | 99 | 104 | 107 | 114 |
| Colby St NB, 61st to 62nd | fitted | 134 | 101 | 121 | 107 | 111 |
| Colby St NB, 62nd to 63rd | fitted | 136 | 83 | 116 | 90 | 111 |
| Colby St NB, 63rd to 63rd | held out | 123 | 79 | 97 | 87 | 89 |
| Colby St NB, North to Alcatraz | fitted | 104 | 82 | 97 | 86 | 99 |
| Sum (7 stations) | | 912 | 668 | 795 | 706 | 781 |
| Sim / count | | | 0.73 | 0.87 | 0.77 | 0.86 |

SR-24 RAMPS pm_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 | 598 | 773 | 975 | 692 | 844 |
| Clifton St off-ramp (node 683), counted | held out 2010 | 617 | 697 | 943 | 723 | 882 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 996 | 968 | 1054 | 916 | 955 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 1024 | 1029 | 1013 | 995 | 997 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1547 | 1266 | 1014 | 1438 | 1082 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1614 | 1512 | 1519 | 1522 | 1524 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 | 190 | 282 | 532 | 265 | 705 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 | 657 | 906 | 1272 | 1021 | 1300 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 | 621 | 724 | 646 | 731 | 724 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 | 477 | 513 | 437 | 486 | 458 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 | 351 | 455 | 414 | 357 | 382 |
| on-ramp at node 1320 (Broadway) | fitted 2012 | 351 | 266 | 310 | 390 | 412 |
| off-ramp at node 1350 (Broadway) | fitted 2012 | 315 | 301 | 319 | 313 | 322 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 | 317 | 365 | 578 | 349 | 595 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 | 218 | 253 | 34 | 205 | 53 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 | 317 | 287 | 524 | 291 | 494 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 | 218 | 131 | 151 | 190 | 156 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 113 | 126 | 126 | 112 | 113 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 61 | 91 | 89 | 61 | 62 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 | 61 | 150 | 107 | 156 | 72 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 | 360 | 400 | 381 | 330 | 333 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 | 315 | 304 | 325 | 324 | 339 |

SR-24 RAMPS am_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 derived | 508 | 570 | 1018 | 556 | 941 |
| Clifton St off-ramp (node 683), counted | held out 2010 derived | 524 | 601 | 816 | 642 | 828 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 1076 | 1097 | 804 | 1042 | 992 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 898 | 881 | 893 | 905 | 876 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1417 | 883 | 818 | 958 | 873 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1501 | 1506 | 1497 | 1520 | 1506 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 derived | 59 | 255 | 493 | 300 | 661 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 derived | 558 | 710 | 1125 | 718 | 1111 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 derived | 528 | 676 | 556 | 587 | 586 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 derived | 405 | 407 | 385 | 420 | 409 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 derived | 298 | 420 | 294 | 316 | 292 |
| on-ramp at node 1320 (Broadway) | fitted 2012 derived | 298 | 256 | 252 | 309 | 309 |
| off-ramp at node 1350 (Broadway) | fitted 2012 derived | 268 | 250 | 255 | 251 | 267 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 270 | 313 | 424 | 276 | 400 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 186 | 216 | 18 | 186 | 31 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 derived | 270 | 250 | 271 | 281 | 283 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 derived | 186 | 57 | 116 | 124 | 141 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 96 | 67 | 62 | 81 | 77 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 52 | 33 | 20 | 28 | 18 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 derived | 52 | 226 | 62 | 136 | 58 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 derived | 306 | 347 | 396 | 315 | 301 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 derived | 268 | 283 | 288 | 267 | 260 |

FLIPS candidate vs baseline (recent stations, judged as in the verdict)
| Period | Station | Set | Target | Baseline | GEH | Candidate | GEH | Flip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | Dana Street North Street to Alcatraz Avenue, SB (link 1927) | fitted | 43 | 5 | 7.9 | 18 | 4.6 | fail to pass |
| pm_peak | Dana Street North Street to Alcatraz Avenue, NB (link 1926) | fitted | 7 | 31 | 5.5 | 22 | 4.0 | fail to pass |
| pm_peak | Dana Street 63rd Street to North Street, NB (link 1924) | fitted | 11 | 60 | 8.3 | 28 | 3.8 | fail to pass |
| pm_peak | Colby Street 63rd Street to 63rd Street, NB (link 2601) | held out | 152 | 93 | 5.3 | 116 | 3.1 | fail to pass |
| pm_peak | Colby Street 60th Street to 61st Street, NB (link 2595) | fitted | 179 | 118 | 5.0 | 114 | 5.4 | pass to fail |
| pm_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, NB (link 2591) | fitted | 189 | 122 | 5.4 | 159 | 2.3 | fail to pass |
| pm_peak | 63rd Street Canning Street to Telegraph Avenue, EB (link 1860) | fitted | 27 | 81 | 7.4 | 50 | 3.6 | fail to pass |
| pm_peak | Canning Street 62nd Street to 63rd Street, NB (link 1904) | fitted | 18 | 1 | 5.6 | 7 | 3.1 | fail to pass |
| pm_peak | Canning Street 59th Street to McAuley Street, SB (link 1897) | held out | 49 | 21 | 4.7 | 9 | 7.4 | pass to fail |
| pm_peak | 60th Street Howell Street to Canning Street, WB (link 1867) | held out | 25 | 55 | 4.7 | 66 | 6.0 | pass to fail |
| pm_peak | McAuley Street Canning Street to Telegraph Avenue, EB (link 1935) | fitted | 14 | 48 | 6.1 | 35 | 4.2 | fail to pass |
| pm_peak | Forest Street Colby Street / Claremont Avenue to Ayala Avenue, EB (link 2697) | fitted | 66 | 183 | 10.5 | 113 | 4.9 | fail to pass |
| am_peak | Colby Street 62nd Street to 63rd Street, NB (link 2599) | fitted | 136 | 83 | 5.1 | 90 | 4.3 | fail to pass |
| am_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, SB (link 2592) | fitted | 163 | 98 | 5.7 | 113 | 4.3 | fail to pass |
| am_peak | 60th Street Canning Street to Telegraph Avenue, EB (link 1870) | fitted | 8 | 37 | 6.0 | 29 | 4.9 | fail to pass |
| am_peak | Martin Street Ayala Avenue to Hermann Street / 58th Street, EB (link 1826) | fitted | 68 | 29 | 5.5 | 43 | 3.3 | fail to pass |

THROUGH CARS IN THE STUDY AREA (all residential and service streets, per hour, seed mean and range; per-seed calibrate report)
| Period | Set | Shipped demand | Training demand |
| --- | --- | --- | --- |
| pm_peak | baseline | 729 (652 to 777) | 1019 (945 to 1126) |
| pm_peak | candidate | 852 (795 to 909) | 986 (918 to 1120) |
| am_peak | baseline | 447 (407 to 497) | 549 (451 to 645) |
| am_peak | candidate | 425 (404 to 454) | 512 (449 to 638) |

SR-24 MAINLINE GATES, simulated (seed mean; entry: offered veh/h before scale from the run report, flow on the links leaving the gate, trips waiting at the end of the run (blank when the gate is not in the top-10 backlog table of a seed, counted as 0); exit: flow on the links into the gate)
| Period | Gate | Set | View | Offered | Simulated flow | Waiting at end (mean, seeds listed) |
| --- | --- | --- | --- | --- | --- | --- |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | shipped | 3945 | 3896 | 46 (8 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | training | 4112 | 4050 | 48 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | shipped | 3943 | 3707 | 168 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | training | 4111 | 3925 | 153 (10 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | shipped | 947 | 948 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | training | 753 | 752 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | shipped | 947 | 949 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | training | 747 | 751 | 0 (0 of 10) |
| pm_peak | SR-24 WB leaving at the west end (node 675) | baseline | shipped | | 3770 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | baseline | training | | 4101 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | candidate | shipped | | 3683 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | candidate | training | | 3969 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | shipped | | 710 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | training | | 863 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | shipped | | 670 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | training | | 870 | |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | shipped | 3656 | 3670 | 4 (3 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | training | 3696 | 3706 | 0 (2 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | shipped | 3639 | 3660 | 16 (4 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | training | 3694 | 3690 | 12 (4 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | shipped | - | 333 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | training | 376 | 373 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | shipped | - | 341 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | training | 376 | 367 | 0 (0 of 10) |
| am_peak | SR-24 WB leaving at the west end (node 675) | baseline | shipped | | 3152 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | baseline | training | | 3792 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | candidate | shipped | | 3156 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | candidate | training | | 3840 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | shipped | | 823 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | training | | 770 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | shipped | | 800 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | training | | 749 | |

DEMAND FILES (car veh/h; origin = trips that start at the gate, destination = trips that end there)
| Period | Set | View | Total | 602 origin | 1719 origin | 675 destination | 1726 destination | Surface gates origin | Surface gates destination |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | baseline | shipped | 27612 | 3945 | 947 | 3778 | 709 | 11585 | 13184 |
| pm_peak | baseline | training | 25044 | 4112 | 753 | 4156 | 891 | 9453 | 11473 |
| pm_peak | candidate | shipped | 26990 | 3943 | 947 | 3776 | 709 | 10255 | 12134 |
| pm_peak | candidate | training | 24952 | 4111 | 747 | 4153 | 891 | 8495 | 10749 |
| am_peak | baseline | shipped | 23204 | 3656 | 337 | 3159 | 818 | 10289 | 9406 |
| am_peak | baseline | training | 20584 | 3696 | 376 | 3859 | 765 | 7930 | 8644 |
| am_peak | candidate | shipped | 23187 | 3639 | 337 | 3158 | 814 | 9321 | 9025 |
| am_peak | candidate | training | 20328 | 3694 | 376 | 3855 | 762 | 7300 | 8117 |
