STATION LINES (ten seeds; same stations file for both sets)
| Criterion | Line | Baseline | Candidate | Pass |
| --- | --- | --- | --- | --- |
| PM fitted | 74 of 92 | 74 of 92 | 80 of 92 | yes |
| PM held out | 14 of 24 | 14 of 24 | 13 of 24 | NO |
| AM fitted | 70 of 77 | 70 of 77 | 72 of 77 | yes |
| AM held out | 14 of 19 | 14 of 19 | 15 of 19 | yes |

DIAGONAL STATIONS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 66 | 183 | 516 | 115 | 169 |
| McAuley St EB, Howell to Canning | held out | 12 | 83 | 183 | 62 | 75 |
| 60th St EB, Howell to Canning | held out | 23 | 76 | 162 | 62 | 61 |
| Ayala Ave NB, Martin to Howell | held out | 60 | 81 | 212 | 52 | 94 |
| Howell St SB, 59th to McAuley | fitted | 17 | 72 | 162 | 68 | 65 |
| Sum (5 stations) | | 178 | 495 | 1234 | 357 | 464 |
| Sim / count | | | 2.78 | 6.93 | 2.01 | 2.61 |

DIAGONAL STATIONS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 50 | 85 | 180 | 68 | 167 |
| McAuley St EB, Howell to Canning | held out | 4 | 34 | 84 | 33 | 74 |
| 60th St EB, Howell to Canning | held out | 6 | 38 | 79 | 34 | 62 |
| Ayala Ave NB, Martin to Howell | held out | 50 | 48 | 86 | 36 | 62 |
| Howell St SB, 59th to McAuley | (no case) | | - | - | - | - |
| Sum (4 stations) | | 110 | 206 | 428 | 171 | 365 |
| Sim / count | | | 1.87 | 3.89 | 1.56 | 3.32 |

COLBY ST NB BLOCKS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Colby St NB, Forest/Claremont to McAuley | fitted | 189 | 122 | 144 | 143 | 190 |
| Colby St NB, McAuley to 60th | held out | 182 | 123 | 141 | 141 | 188 |
| Colby St NB, 60th to 61st | fitted | 179 | 118 | 133 | 119 | 162 |
| Colby St NB, 61st to 62nd | fitted | 174 | 128 | 151 | 135 | 176 |
| Colby St NB, 62nd to 63rd | fitted | 158 | 138 | 151 | 141 | 159 |
| Colby St NB, 63rd to 63rd | held out | 152 | 127 | 93 | 135 | 106 |
| Colby St NB, North to Alcatraz | fitted | 164 | 143 | 109 | 152 | 123 |
| Sum (7 stations) | | 1198 | 899 | 922 | 965 | 1104 |
| Sim / count | | | 0.75 | 0.77 | 0.81 | 0.92 |

COLBY ST NB BLOCKS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Colby St NB, Forest/Claremont to McAuley | fitted | 130 | 116 | 141 | 116 | 121 |
| Colby St NB, McAuley to 60th | held out | 141 | 110 | 120 | 112 | 118 |
| Colby St NB, 60th to 61st | fitted | 144 | 99 | 104 | 105 | 106 |
| Colby St NB, 61st to 62nd | fitted | 134 | 101 | 121 | 112 | 117 |
| Colby St NB, 62nd to 63rd | fitted | 136 | 83 | 116 | 89 | 115 |
| Colby St NB, 63rd to 63rd | held out | 123 | 79 | 97 | 82 | 83 |
| Colby St NB, North to Alcatraz | fitted | 104 | 82 | 97 | 86 | 91 |
| Sum (7 stations) | | 912 | 668 | 795 | 701 | 750 |
| Sim / count | | | 0.73 | 0.87 | 0.77 | 0.82 |

SR-24 RAMPS pm_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 | 598 | 773 | 975 | 693 | 873 |
| Clifton St off-ramp (node 683), counted | held out 2010 | 617 | 697 | 943 | 715 | 881 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 996 | 968 | 1054 | 906 | 1040 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 1024 | 1029 | 1013 | 1001 | 972 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1547 | 1266 | 1014 | 1470 | 1152 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1614 | 1512 | 1519 | 1527 | 1524 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 | 190 | 282 | 532 | 249 | 639 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 | 657 | 906 | 1272 | 983 | 1307 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 | 621 | 724 | 646 | 730 | 766 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 | 477 | 513 | 437 | 504 | 450 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 | 351 | 455 | 414 | 364 | 338 |
| on-ramp at node 1320 (Broadway) | fitted 2012 | 351 | 266 | 310 | 368 | 378 |
| off-ramp at node 1350 (Broadway) | fitted 2012 | 315 | 301 | 319 | 304 | 316 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 | 317 | 365 | 578 | 337 | 596 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 | 218 | 253 | 34 | 212 | 36 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 | 317 | 287 | 524 | 297 | 443 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 | 218 | 131 | 151 | 192 | 149 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 113 | 126 | 126 | 110 | 113 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 61 | 91 | 89 | 61 | 64 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 | 61 | 150 | 107 | 138 | 63 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 | 360 | 400 | 381 | 349 | 325 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 | 315 | 304 | 325 | 316 | 331 |

SR-24 RAMPS am_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target | baseline shipped | baseline training | candidate shipped | candidate training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 derived | 508 | 570 | 1018 | 580 | 918 |
| Clifton St off-ramp (node 683), counted | held out 2010 derived | 524 | 601 | 816 | 622 | 832 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 1076 | 1097 | 804 | 998 | 1006 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 898 | 881 | 893 | 903 | 893 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1417 | 883 | 818 | 961 | 847 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1501 | 1506 | 1497 | 1516 | 1520 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 derived | 59 | 255 | 493 | 247 | 663 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 derived | 558 | 710 | 1125 | 710 | 1152 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 derived | 528 | 676 | 556 | 563 | 544 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 derived | 405 | 407 | 385 | 419 | 403 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 derived | 298 | 420 | 294 | 305 | 285 |
| on-ramp at node 1320 (Broadway) | fitted 2012 derived | 298 | 256 | 252 | 303 | 305 |
| off-ramp at node 1350 (Broadway) | fitted 2012 derived | 268 | 250 | 255 | 247 | 262 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 270 | 313 | 424 | 272 | 404 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 186 | 216 | 18 | 175 | 23 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 derived | 270 | 250 | 271 | 282 | 237 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 derived | 186 | 57 | 116 | 118 | 130 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 96 | 67 | 62 | 84 | 87 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 52 | 33 | 20 | 29 | 21 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 derived | 52 | 226 | 62 | 137 | 54 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 derived | 306 | 347 | 396 | 316 | 302 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 derived | 268 | 283 | 288 | 254 | 289 |

FLIPS candidate vs baseline (recent stations, judged as in the verdict)
| Period | Station | Set | Target | Baseline | GEH | Candidate | GEH | Flip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | Dana Street North Street to Alcatraz Avenue, NB (link 1926) | fitted | 7 | 31 | 5.5 | 23 | 4.2 | fail to pass |
| pm_peak | Dana Street 63rd Street to North Street, NB (link 1924) | fitted | 11 | 60 | 8.3 | 30 | 4.2 | fail to pass |
| pm_peak | Colby Street 63rd Street to 63rd Street, NB (link 2601) | held out | 152 | 93 | 5.3 | 106 | 4.0 | fail to pass |
| pm_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, NB (link 2591) | fitted | 189 | 122 | 5.4 | 143 | 3.5 | fail to pass |
| pm_peak | 63rd Street Dana Street to Canning Street, EB (link 1858) | held out | 60 | 71 | 1.4 | 22 | 5.9 | pass to fail |
| pm_peak | 63rd Street Canning Street to Telegraph Avenue, EB (link 1860) | fitted | 27 | 81 | 7.4 | 45 | 3.0 | fail to pass |
| pm_peak | 62nd Street Hillegass Avenue to Colby Street, EB (link 2678) | fitted | 16 | 51 | 6.1 | 35 | 3.8 | fail to pass |
| pm_peak | 62nd Street Florio Street / Claremont Avenue / +1 to Hillegass Avenue, EB (link 2622) | fitted | 59 | 117 | 6.2 | 64 | 0.6 | fail to pass |
| pm_peak | Canning Street 59th Street to McAuley Street, SB (link 1897) | held out | 49 | 21 | 4.7 | 9 | 7.4 | pass to fail |
| pm_peak | 60th Street Howell Street to Canning Street, WB (link 1867) | held out | 25 | 55 | 4.7 | 63 | 5.7 | pass to fail |
| pm_peak | McAuley Street Canning Street to Telegraph Avenue, EB (link 1935) | fitted | 14 | 48 | 6.1 | 35 | 4.3 | fail to pass |
| pm_peak | Ayala Avenue Martin Street to Howell Street, NB (link 1831) | held out | 60 | 212 | 13.0 | 94 | 3.9 | fail to pass |
| pm_peak | Howell Street McAuley Street to 60th Street, NB (link 2056) | fitted | 6 | 21 | 4.1 | 27 | 5.2 | pass to fail |
| am_peak | Colby Street 62nd Street to 63rd Street, NB (link 2599) | fitted | 136 | 83 | 5.1 | 89 | 4.5 | fail to pass |
| am_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, SB (link 2592) | fitted | 163 | 98 | 5.7 | 109 | 4.6 | fail to pass |
| am_peak | 58th Street Hermann Street / Martin Street to Canning Street, WB (link 1987) | fitted | 150 | 98 | 4.7 | 95 | 5.0 | pass to fail |
| am_peak | Martin Street Ayala Avenue to Hermann Street / 58th Street, EB (link 1826) | fitted | 68 | 29 | 5.5 | 34 | 4.7 | fail to pass |
| am_peak | Ayala Avenue Martin Street to Howell Street, SB (link 1832) | held out | 36 | 78 | 5.6 | 63 | 3.9 | fail to pass |

THROUGH CARS IN THE STUDY AREA (all residential and service streets, per hour, seed mean and range; per-seed calibrate report)
| Period | Set | Shipped demand | Training demand |
| --- | --- | --- | --- |
| pm_peak | baseline | 729 (652 to 777) | 1019 (945 to 1126) |
| pm_peak | candidate | 796 (720 to 945) | 905 (788 to 1012) |
| am_peak | baseline | 447 (407 to 497) | 549 (451 to 645) |
| am_peak | candidate | 447 (396 to 470) | 559 (483 to 629) |

SR-24 MAINLINE GATES, simulated (seed mean; entry: offered veh/h before scale from the run report, flow on the links leaving the gate, trips waiting at the end of the run (blank when the gate is not in the top-10 backlog table of a seed, counted as 0); exit: flow on the links into the gate)
| Period | Gate | Set | View | Offered | Simulated flow | Waiting at end (mean, seeds listed) |
| --- | --- | --- | --- | --- | --- | --- |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | shipped | 3945 | 3896 | 46 (8 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | training | 4112 | 4050 | 48 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | shipped | 3940 | 3742 | 192 (10 of 10) |
| pm_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | training | 4109 | 3868 | 208 (10 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | shipped | 947 | 948 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | training | 753 | 752 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | shipped | 947 | 945 | 0 (0 of 10) |
| pm_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | training | 752 | 757 | 0 (0 of 10) |
| pm_peak | SR-24 WB leaving at the west end (node 675) | baseline | shipped | | 3770 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | baseline | training | | 4101 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | candidate | shipped | | 3730 | |
| pm_peak | SR-24 WB leaving at the west end (node 675) | candidate | training | | 4101 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | shipped | | 710 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | training | | 863 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | shipped | | 681 | |
| pm_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | training | | 868 | |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | shipped | 3656 | 3670 | 4 (3 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | baseline | training | 3696 | 3706 | 0 (2 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | shipped | 3655 | 3673 | 24 (6 of 10) |
| am_peak | SR-24 EB entering at the west end (Grove Shafter Fwy) (node 602) | candidate | training | 3695 | 3704 | 19 (6 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | shipped | - | 333 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | baseline | training | 376 | 373 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | shipped | - | 334 | 0 (0 of 10) |
| am_peak | SR-24 WB entering from the Caldecott Tunnel (node 1719) | candidate | training | 376 | 383 | 0 (0 of 10) |
| am_peak | SR-24 WB leaving at the west end (node 675) | baseline | shipped | | 3152 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | baseline | training | | 3792 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | candidate | shipped | | 3088 | |
| am_peak | SR-24 WB leaving at the west end (node 675) | candidate | training | | 3808 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | shipped | | 823 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | baseline | training | | 770 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | shipped | | 753 | |
| am_peak | SR-24 EB leaving toward the Caldecott Tunnel (node 1726) | candidate | training | | 759 | |

DEMAND FILES (car veh/h; origin = trips that start at the gate, destination = trips that end there)
| Period | Set | View | Total | 602 origin | 1719 origin | 675 destination | 1726 destination | Surface gates origin | Surface gates destination |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | baseline | shipped | 27612 | 3945 | 947 | 3778 | 709 | 11585 | 13184 |
| pm_peak | baseline | training | 25044 | 4112 | 753 | 4156 | 891 | 9453 | 11473 |
| pm_peak | candidate | shipped | 24954 | 3940 | 947 | 3764 | 702 | 10462 | 12313 |
| pm_peak | candidate | training | 22543 | 4109 | 752 | 4147 | 891 | 8717 | 10815 |
| am_peak | baseline | shipped | 23204 | 3656 | 337 | 3159 | 818 | 10289 | 9406 |
| am_peak | baseline | training | 20584 | 3696 | 376 | 3859 | 765 | 7930 | 8644 |
| am_peak | candidate | shipped | 21428 | 3655 | 337 | 3092 | 750 | 9631 | 9109 |
| am_peak | candidate | training | 18896 | 3695 | 376 | 3843 | 765 | 7463 | 8258 |
