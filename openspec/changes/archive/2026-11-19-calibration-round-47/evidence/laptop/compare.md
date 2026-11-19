
DIAGONAL STATIONS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | caldecott-pair-sum shipped | caldecott-pair-sum training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 66 | 183 | 516 | 201 | 517 |
| McAuley St EB, Howell to Canning | held out | 12 | 83 | 183 | 88 | 184 |
| 60th St EB, Howell to Canning | held out | 23 | 76 | 162 | 86 | 167 |
| Ayala Ave NB, Martin to Howell | held out | 60 | 81 | 212 | 83 | 217 |
| Howell St SB, 59th to McAuley | fitted | 17 | 72 | 162 | 82 | 169 |
| Sum | | 178 | 495 | 1234 | 539 | 1253 |

DIAGONAL STATIONS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | caldecott-pair-sum shipped | caldecott-pair-sum training |
| --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 50 | 85 | 180 | 74 | 196 |
| McAuley St EB, Howell to Canning | held out | 4 | 34 | 84 | 34 | 91 |
| 60th St EB, Howell to Canning | held out | 6 | 38 | 79 | 33 | 85 |
| Ayala Ave NB, Martin to Howell | held out | 50 | 48 | 86 | 46 | 86 |
| Howell St SB, 59th to McAuley | (no case) |
| Sum | | 110 | 206 | 428 | 187 | 458 |

SR-24 RAMPS pm_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target baseline / caldecott-pair-sum | baseline shipped | baseline training | caldecott-pair-sum shipped | caldecott-pair-sum training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 | 598 / 598 | 773 | 975 | 765 | 955 |
| Clifton St off-ramp (node 683), counted | held out 2010 | 617 / 617 | 697 | 943 | 698 | 946 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 996 / 996 | 968 | 1054 | 956 | 1105 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 1024 / 1024 | 1029 | 1013 | 1030 | 1014 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1547 / 1547 | 1266 | 1014 | 1301 | 1019 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1614 / 1614 | 1512 | 1519 | 1519 | 1526 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 | 190 / 190 | 282 | 532 | 259 | 528 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 | 657 / 657 | 906 | 1272 | 900 | 1252 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 | 621 / 621 | 724 | 646 | 743 | 641 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 | 477 / 477 | 513 | 437 | 507 | 435 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 | 351 / 351 | 455 | 414 | 459 | 407 |
| on-ramp at node 1320 (Broadway) | fitted 2012 | 351 / 351 | 266 | 310 | 271 | 323 |
| off-ramp at node 1350 (Broadway) | fitted 2012 | 315 / 315 | 301 | 319 | 304 | 318 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 | 317 / 317 | 365 | 578 | 360 | 597 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 | 218 / 218 | 253 | 34 | 249 | 36 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 | 317 / 317 | 287 | 524 | 285 | 520 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 | 218 / 218 | 131 | 151 | 132 | 153 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 113 / 113 | 126 | 126 | 125 | 127 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 61 / - | 91 | 89 | - | - |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 | 61 / - | 150 | 107 | - | - |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 | 360 / 360 | 400 | 381 | 400 | 377 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 | 315 / 315 | 304 | 325 | 305 | 326 |
| Caldecott Lane on-ramps 1695 + 1711, merged station (candidate only) | fitted 2024 | - / 122 | - | - | 219 | 184 |

SR-24 RAMPS am_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target baseline / caldecott-pair-sum | baseline shipped | baseline training | caldecott-pair-sum shipped | caldecott-pair-sum training |
| --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 derived | 508 / 508 | 570 | 1018 | 565 | 1006 |
| Clifton St off-ramp (node 683), counted | held out 2010 derived | 524 / 524 | 601 | 816 | 605 | 828 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 1076 / 1076 | 1097 | 804 | 1109 | 793 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 898 / 898 | 881 | 893 | 879 | 894 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1417 / 1417 | 883 | 818 | 876 | 805 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1501 / 1501 | 1506 | 1497 | 1507 | 1499 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 derived | 59 / 59 | 255 | 493 | 257 | 512 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 derived | 558 / 558 | 710 | 1125 | 713 | 1127 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 derived | 528 / 528 | 676 | 556 | 678 | 546 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 derived | 405 / 405 | 407 | 385 | 415 | 384 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 derived | 298 / 298 | 420 | 294 | 412 | 292 |
| on-ramp at node 1320 (Broadway) | fitted 2012 derived | 298 / 298 | 256 | 252 | 250 | 251 |
| off-ramp at node 1350 (Broadway) | fitted 2012 derived | 268 / 268 | 250 | 255 | 243 | 256 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 270 / 270 | 313 | 424 | 317 | 420 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 186 / 186 | 216 | 18 | 212 | 17 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 derived | 270 / 270 | 250 | 271 | 257 | 268 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 derived | 186 / 186 | 57 | 116 | 59 | 117 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 96 / 96 | 67 | 62 | 77 | 65 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 52 / - | 33 | 20 | - | - |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 derived | 52 / - | 226 | 62 | - | - |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 derived | 306 / 306 | 347 | 396 | 352 | 398 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 derived | 268 / 268 | 283 | 288 | 274 | 294 |
| Caldecott Lane on-ramps 1695 + 1711, merged station (candidate only) | fitted 2024 derived | - / 103 | - | - | 225 | 83 |

FLIPS caldecott-pair-sum vs baseline (recent stations; * = target changed)
| Period | Station | Set | Target base / cand | Baseline | GEH | Candidate | GEH | Flip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | Canning Street 62nd Street to 63rd Street, NB (link 1904) | fitted | 18 / 18 | 1 | 5.6 | 3 | 4.8 | fail to pass |
| am_peak | Colby Street 62nd Street to 63rd Street, NB (link 2599) | fitted | 136 / 136 | 83 | 5.1 | 96 | 3.7 | fail to pass |
| am_peak | 60th Street Canning Street to Telegraph Avenue, EB (link 1870) | fitted | 8 / 8 | 37 | 6.0 | 30 | 5.0 | fail to pass |

CALDECOTT LANE LINKS (link start flow, veh/h, seed mean; link 4080 = on-ramp at node 1695, 4058 = on-ramp at node 1711)
| Period | Set | 4080 shipped | 4058 shipped | sum shipped | 4080 training | 4058 training | sum training |
| --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | baseline | 91 | 150 | 241 | 89 | 107 | 196 |
| pm_peak | caldecott-pair-sum | 31 | 187 | 219 | 35 | 149 | 184 |
| am_peak | baseline | 33 | 226 | 258 | 20 | 62 | 81 |
| am_peak | caldecott-pair-sum | 10 | 215 | 225 | 18 | 66 | 83 |
