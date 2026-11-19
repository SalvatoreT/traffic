KEEP RULE, station lines (3 seeds, sets -screen, baseline target/assess-seeds/60r46-base-screen; fitted on the shipped demand, held out on the cross-validation demand; the lines are the ten-seed keep rule, shown for orientation only)

ramp-k-counted: 15 stations with a changed target (ramp on 701, ramp off 702, ramp off 1133, ramp on 1312, ramp on 1320, ramp off 1350, ramp off 1556, ramp on 1556, ramp off 1577, ramp on 1669, ramp off 1695, ramp on 1695, ramp on 1711, ramp on 1741, ramp off 1743)
| Criterion | Line | Baseline | Candidate | Pass | Without changed: line (baseline on the same stations) | Candidate | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PM fitted | 74 of 92 | 73 of 92 | 73 of 92 | NO | 71 of 89 | 71 of 89 | yes |
| PM held out | 14 of 24 | 14 of 24 | 14 of 24 | yes | 14 of 24 | 14 of 24 | yes |
| AM fitted | 70 of 77 | 70 of 77 | 70 of 77 | yes | 70 of 77 | 70 of 77 | yes |
| AM held out | 14 of 19 | 14 of 19 | 14 of 19 | yes | 14 of 19 | 14 of 19 | yes |

ramp-k-counted-min2: 15 stations with a changed target (ramp on 701, ramp off 702, ramp off 1133, ramp on 1312, ramp on 1320, ramp off 1350, ramp off 1556, ramp on 1556, ramp off 1577, ramp on 1669, ramp off 1695, ramp on 1695, ramp on 1711, ramp on 1741, ramp off 1743)
| Criterion | Line | Baseline | Candidate | Pass | Without changed: line (baseline on the same stations) | Candidate | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PM fitted | 74 of 92 | 73 of 92 | 73 of 92 | NO | 71 of 89 | 71 of 89 | yes |
| PM held out | 14 of 24 | 14 of 24 | 12 of 24 | NO | 14 of 24 | 12 of 24 | NO |
| AM fitted | 70 of 77 | 70 of 77 | 70 of 77 | yes | 70 of 77 | 70 of 77 | yes |
| AM held out | 14 of 19 | 14 of 19 | 12 of 19 | NO | 14 of 19 | 12 of 19 | NO |

DIAGONAL STATIONS pm_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | ramp-k-counted shipped | ramp-k-counted training | ramp-k-counted-min2 shipped | ramp-k-counted-min2 training |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 66 | 196 | 534 | 208 | 534 | 208 | 540 |
| McAuley St EB, Howell to Canning | held out | 12 | 86 | 173 | 94 | 173 | 94 | 174 |
| 60th St EB, Howell to Canning | held out | 23 | 72 | 158 | 62 | 158 | 62 | 140 |
| Ayala Ave NB, Martin to Howell | held out | 60 | 90 | 218 | 95 | 218 | 95 | 239 |
| Howell St SB, 59th to McAuley | fitted | 17 | 75 | 171 | 81 | 171 | 81 | 134 |
| Sum | | 178 | 520 | 1253 | 540 | 1253 | 540 | 1228 |

DIAGONAL STATIONS am_peak (simulated veh/h, seed mean; shipped = shipped demand, training = cross-validation demand)
| Station | Set | Counted | baseline shipped | baseline training | ramp-k-counted shipped | ramp-k-counted training | ramp-k-counted-min2 shipped | ramp-k-counted-min2 training |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Forest St EB | fitted | 50 | 87 | 162 | 85 | 162 | 85 | 234 |
| McAuley St EB, Howell to Canning | held out | 4 | 36 | 74 | 36 | 74 | 36 | 107 |
| 60th St EB, Howell to Canning | held out | 6 | 41 | 71 | 32 | 71 | 32 | 85 |
| Ayala Ave NB, Martin to Howell | held out | 50 | 47 | 71 | 61 | 71 | 61 | 100 |
| Howell St SB, 59th to McAuley | (no case) |
| Sum | | 110 | 210 | 378 | 214 | 378 | 214 | 525 |

SR-24 RAMPS pm_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target baseline / ramp-k-counted / ramp-k-counted-min2 | baseline shipped | baseline training | ramp-k-counted shipped | ramp-k-counted training | ramp-k-counted-min2 shipped | ramp-k-counted-min2 training |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 | 598 / 598 / 598 | 794 | 997 | 783 | 997 | 783 | 1054 |
| Clifton St off-ramp (node 683), counted | held out 2010 | 617 / 617 / 617 | 706 | 947 | 708 | 947 | 708 | 879 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 996 / 996 / 996 | 997 | 996 | 935 | 996 | 935 | 746 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 1024 / 1024 / 1024 | 1055 | 999 | 1030 | 999 | 1030 | 987 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1547 / 1547 / 1547 | 1237 | 1084 | 1267 | 1084 | 1267 | 943 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1614 / 1614 / 1614 | 1505 | 1515 | 1522 | 1515 | 1522 | 1518 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 | 190 / 190 / 190 | 295 | 518 | 270 | 518 | 270 | 515 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 | 657 / 536 / 536 | 913 | 1268 | 774 | 1268 | 774 | 1259 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 | 621 / 506 / 506 | 718 | 630 | 651 | 630 | 651 | 574 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 | 477 / 389 / 389 | 528 | 446 | 392 | 446 | 392 | 485 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 | 351 / 286 / 286 | 452 | 417 | 332 | 417 | 332 | 342 |
| on-ramp at node 1320 (Broadway) | fitted 2012 | 351 / 286 / 286 | 249 | 307 | 236 | 307 | 236 | 250 |
| off-ramp at node 1350 (Broadway) | fitted 2012 | 315 / 257 / 257 | 306 | 313 | 255 | 313 | 255 | 277 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 | 317 / 259 / 259 | 369 | 587 | 302 | 587 | 302 | 484 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 | 218 / 178 / 178 | 245 | 33 | 205 | 33 | 205 | 17 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 | 317 / 259 / 259 | 285 | 512 | 256 | 512 | 256 | 452 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 | 218 / 178 / 178 | 130 | 158 | 67 | 158 | 67 | 140 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 113 / 92 / 92 | 129 | 119 | 100 | 119 | 100 | 91 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 | 61 / 50 / 50 | 96 | 87 | 75 | 87 | 75 | 76 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 | 61 / 50 / 50 | 138 | 110 | 175 | 110 | 175 | 66 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 | 360 / 293 / 293 | 411 | 386 | 321 | 386 | 321 | 388 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 | 315 / 257 / 257 | 292 | 352 | 260 | 352 | 260 | 303 |

SR-24 RAMPS am_peak (target: count, or ADT x K from the stations file; simulated veh/h, seed mean)
| Ramp | Set | Target baseline / ramp-k-counted / ramp-k-counted-min2 | baseline shipped | baseline training | ramp-k-counted shipped | ramp-k-counted training | ramp-k-counted-min2 shipped | ramp-k-counted-min2 training |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Claremont Ave on-ramp (node 833), counted | held out 2010 derived | 508 / 508 / 508 | 541 | 967 | 553 | 967 | 553 | 1006 |
| Clifton St off-ramp (node 683), counted | held out 2010 derived | 524 / 524 / 524 | 604 | 827 | 575 | 827 | 575 | 752 |
| 52nd St on-ramp (node 725), counted | held out 2013 | 1076 / 1076 / 1076 | 1125 | 893 | 1067 | 893 | 1067 | 669 |
| 52nd St off-ramp (node 727), counted | fitted 2013 | 898 / 898 / 898 | 893 | 885 | 848 | 885 | 848 | 884 |
| MLK Jr Way on-ramp (node 679), counted | held out 2013 | 1417 / 1417 / 1417 | 915 | 837 | 873 | 837 | 873 | 755 |
| MLK Jr Way off-ramp (node 719), counted | fitted 2013 | 1501 / 1501 / 1501 | 1496 | 1491 | 1471 | 1491 | 1471 | 1501 |
| on-ramp at node 280 (Martin Luther King Junior Way) | fitted 2012 derived | 59 / 59 / 59 | 206 | 478 | 290 | 478 | 290 | 393 |
| on-ramp at node 701 (Telegraph Avenue / 56th Street) | held out 2012 derived | 558 / 455 / 455 | 728 | 1128 | 633 | 1128 | 633 | 1120 |
| off-ramp at node 702 (Telegraph Avenue / Aileen Street) | fitted 2012 derived | 528 / 430 / 430 | 673 | 520 | 591 | 520 | 591 | 539 |
| off-ramp at node 1133 (Keith Avenue) | fitted 2012 derived | 405 / 330 / 330 | 415 | 387 | 361 | 387 | 361 | 367 |
| on-ramp at node 1312 (Brookside Avenue / Broadway) | fitted 2012 derived | 298 / 243 / 243 | 409 | 289 | 357 | 289 | 357 | 276 |
| on-ramp at node 1320 (Broadway) | fitted 2012 derived | 298 / 243 / 243 | 248 | 232 | 233 | 232 | 233 | 265 |
| off-ramp at node 1350 (Broadway) | fitted 2012 derived | 268 / 218 / 218 | 250 | 256 | 226 | 256 | 226 | 228 |
| off-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 270 / 220 / 220 | 311 | 415 | 270 | 415 | 270 | 400 |
| on-ramp at node 1556 (Broadway Terrace) | held out 2012 derived | 186 / 151 / 151 | 205 | 16 | 155 | 16 | 155 | 20 |
| off-ramp at node 1577 (Broadway Terrace) | held out 2012 derived | 270 / 220 / 220 | 260 | 272 | 199 | 272 | 199 | 334 |
| on-ramp at node 1669 (Glenwood Glade / Broadway Terrace / Pinewood Road) | held out 2012 derived | 186 / 151 / 151 | 54 | 110 | 45 | 110 | 45 | 124 |
| off-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 96 / 78 / 78 | 60 | 56 | 45 | 56 | 45 | 66 |
| on-ramp at node 1695 (Caldecott Lane) | fitted 2024 derived | 52 / 42 / 42 | 30 | 18 | 17 | 18 | 17 | 19 |
| on-ramp at node 1711 (Caldecott Lane) | fitted 2024 derived | 52 / 42 / 42 | 221 | 54 | 231 | 54 | 231 | 51 |
| on-ramp at node 1741 (Miles Avenue) | fitted 2012 derived | 306 / 249 / 249 | 361 | 378 | 303 | 378 | 303 | 374 |
| off-ramp at node 1743 (Miles Avenue) | fitted 2012 derived | 268 / 218 / 218 | 284 | 306 | 226 | 306 | 226 | 229 |

FLIPS ramp-k-counted vs baseline (recent stations; * = target changed)
| Period | Station | Set | Target base / cand | Baseline | GEH | Candidate | GEH | Flip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | Colby Street 60th Street to 61st Street, NB (link 2595) | fitted | 179 / 179 | 107 | 6.0 | 158 | 1.6 | fail to pass |
| pm_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, NB (link 2591) | fitted | 189 / 189 | 111 | 6.4 | 168 | 1.5 | fail to pass |
| pm_peak | 62nd Street Hillegass Avenue to Colby Street, EB (link 2678) | fitted | 16 / 16 | 45 | 5.3 | 42 | 4.8 | fail to pass |
| pm_peak | 61st Street Canning Street to Telegraph Avenue, EB (link 2016) | fitted | 29 / 29 | 44 | 2.4 | 66 | 5.4 | pass to fail |
| pm_peak | McAuley Street Colby Street to Ayala Avenue, WB (link 1928) | fitted | 24 / 24 | 49 | 4.1 | 73 | 7.0 | pass to fail |
| pm_peak | Ayala Avenue Hermann Street to Martin Street, NB (link 1829) | fitted | 64 / 64 | 102 | 4.2 | 129 | 6.6 | pass to fail |
| am_peak | Dana Street North Street to Alcatraz Avenue, SB (link 1927) | fitted | 45 / 45 | 38 | 1.1 | 16 | 5.3 | pass to fail |
| am_peak | Dana Street 63rd Street to North Street, NB (link 1924) | fitted | 15 / 15 | 42 | 5.1 | 35 | 3.9 | fail to pass |
| am_peak | Colby Street North Street to Alcatraz Avenue, SB (link 2606) | fitted | 109 / 109 | 77 | 3.4 | 60 | 5.3 | pass to fail |
| am_peak | Colby Street 62nd Street to 63rd Street, SB (link 2600) | fitted | 171 / 171 | 139 | 2.6 | 110 | 5.2 | pass to fail |
| am_peak | Colby Street 62nd Street to 63rd Street, NB (link 2599) | fitted | 136 / 136 | 79 | 5.5 | 109 | 2.4 | fail to pass |
| am_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, SB (link 2592) | fitted | 163 / 163 | 109 | 4.7 | 91 | 6.4 | pass to fail |
| am_peak | 62nd Street Hillegass Avenue to Colby Street, WB (link 2677) | fitted | 17 / 17 | 1 | 5.5 | 2 | 4.9 | fail to pass |
| am_peak | Canning Street 58th Street to 59th Street, SB (link 1895) | fitted | 19 / 19 | 3 | 5.0 | 1 | 5.7 | pass to fail |
| am_peak | Martin Street Ayala Avenue to Hermann Street / 58th Street, WB (link 1825) | fitted | 150 / 150 | 84 | 6.1 | 101 | 4.4 | fail to pass |
| am_peak | Martin Street Ayala Avenue to Hermann Street / 58th Street, EB (link 1826) | fitted | 68 / 68 | 27 | 5.9 | 44 | 3.3 | fail to pass |

FLIPS ramp-k-counted-min2 vs baseline (recent stations; * = target changed)
| Period | Station | Set | Target base / cand | Baseline | GEH | Candidate | GEH | Flip |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pm_peak | Colby Street 63rd Street to 63rd Street, NB (link 2601) | held out | 152 / 152 | 84 | 6.2 | 138 | 1.1 | fail to pass |
| pm_peak | Colby Street 60th Street to 61st Street, NB (link 2595) | fitted | 179 / 179 | 107 | 6.0 | 158 | 1.6 | fail to pass |
| pm_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, NB (link 2591) | fitted | 189 / 189 | 111 | 6.4 | 168 | 1.5 | fail to pass |
| pm_peak | 62nd Street Colby Street to Canning Street, EB (link 1846) | held out | 11 / 11 | 22 | 2.8 | 40 | 5.8 | pass to fail |
| pm_peak | 62nd Street Hillegass Avenue to Colby Street, EB (link 2678) | fitted | 16 / 16 | 45 | 5.3 | 42 | 4.8 | fail to pass |
| pm_peak | Canning Street 59th Street to McAuley Street, SB (link 1897) | held out | 49 / 49 | 21 | 4.8 | 15 | 5.9 | pass to fail |
| pm_peak | 61st Street Canning Street to Telegraph Avenue, EB (link 2016) | fitted | 29 / 29 | 44 | 2.4 | 66 | 5.4 | pass to fail |
| pm_peak | 60th Street Howell Street to Canning Street, WB (link 1867) | held out | 25 / 25 | 55 | 4.7 | 67 | 6.2 | pass to fail |
| pm_peak | McAuley Street Colby Street to Ayala Avenue, WB (link 1928) | fitted | 24 / 24 | 49 | 4.1 | 73 | 7.0 | pass to fail |
| pm_peak | Ayala Avenue Hermann Street to Martin Street, NB (link 1829) | fitted | 64 / 64 | 102 | 4.2 | 129 | 6.6 | pass to fail |
| am_peak | Dana Street North Street to Alcatraz Avenue, SB (link 1927) | fitted | 45 / 45 | 38 | 1.1 | 16 | 5.3 | pass to fail |
| am_peak | Dana Street 63rd Street to North Street, NB (link 1924) | fitted | 15 / 15 | 42 | 5.1 | 35 | 3.9 | fail to pass |
| am_peak | Colby Street North Street to Alcatraz Avenue, SB (link 2606) | fitted | 109 / 109 | 77 | 3.4 | 60 | 5.3 | pass to fail |
| am_peak | Colby Street 62nd Street to 63rd Street, SB (link 2600) | fitted | 171 / 171 | 139 | 2.6 | 110 | 5.2 | pass to fail |
| am_peak | Colby Street 62nd Street to 63rd Street, NB (link 2599) | fitted | 136 / 136 | 79 | 5.5 | 109 | 2.4 | fail to pass |
| am_peak | Colby Street Forest Street / Claremont Avenue to McAuley Street, SB (link 2592) | fitted | 163 / 163 | 109 | 4.7 | 91 | 6.4 | pass to fail |
| am_peak | 62nd Street Hillegass Avenue to Colby Street, WB (link 2677) | fitted | 17 / 17 | 1 | 5.5 | 2 | 4.9 | fail to pass |
| am_peak | Canning Street 58th Street to 59th Street, SB (link 1895) | fitted | 19 / 19 | 3 | 5.0 | 1 | 5.7 | pass to fail |
| am_peak | McAuley Street Howell Street to Canning Street, WB (link 1932) | held out | 20 / 20 | 28 | 1.6 | 52 | 5.3 | pass to fail |
| am_peak | Martin Street Ayala Avenue to Hermann Street / 58th Street, WB (link 1825) | fitted | 150 / 150 | 84 | 6.1 | 101 | 4.4 | fail to pass |
| am_peak | Martin Street Ayala Avenue to Hermann Street / 58th Street, EB (link 1826) | fitted | 68 / 68 | 27 | 5.9 | 44 | 3.3 | fail to pass |
| am_peak | Ayala Avenue Martin Street to Howell Street, NB (link 1831) | held out | 50 / 50 | 71 | 2.7 | 100 | 5.7 | pass to fail |
