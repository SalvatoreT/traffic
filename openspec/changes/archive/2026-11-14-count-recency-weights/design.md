## Context

Round 24 of the Rockridge calibration. Round 23 found that 56 of the 84 failing PM stations are the 100 turning-movement stations of the 2010 and 2013 environmental-review counts (44 pass, the model is at 0.82 of them), while the volunteer count of February 2025 passes 94 of 107, and that the old counts were used with no adjustment for their age. The record (`data/calibration/rockridge.record.md`, twenty-fourth round) has the measurements. PM peak, seeds 1 to 10 unless stated.

## Owner decision

"Let's make sure the newer data is more important than the 2010/2013 data"

## Decisions

D1. Every station carries its source and count year, from provenance: file name year (OakDOT counts, mean 2019 for 2018, 2018, 2019 and 2021), count date (volunteer count 2025, Safeway counts 2010, Children's Hospital counts 2013), latest published year of a ramp row (2024 and 2012) and the Caltrans count year set in the config (2024, from the 2023-24 count year of the service). No source lacks a date. A station with year null takes the last band and the reports say "unknown, treated as old".

D2. The weight is a band rule on age, in the area config: weight x1 up to 10 years, x0.5 beyond, reference year 2026. Both numbers are ASSUMPTIONs (no study gives them). The 10-year edge separates the 2010, 2013 and 2012 sources (age 13 to 16) from the 2018 to 2025 sources (age 1 to 8), so the city counts of 2018 to 2021 keep full weight. A weight of 0 takes the stations out of every fit and scores them as held out. The code names no source and no area.

D3. Settings tested at old counts of 1.0, 0.5, 0.25 and 0 (held out only). All fit and simulated on PM seeds 1 to 10, then the kept setting on all three periods. 0 fails D16 (4.70 removals per hour), moves Hillegass Ave SB and Colby St SB above their ranges and loses the ramp anchors. 1.0, 0.5 and 0.25 hold D5 and D16 and keep the through blocks inside their ranges. Pass counts of the recent sources are the same at 1.0, 0.5 and 0.25 (82 of 94), and the 2010 counts lose passes with the weight (14, 11, 10 of 26). Kept 0.5: it follows the decision, holds the guards and costs 3 fitted stations of 190 against 1.0. 0.25 is not kept because the Clifton St ramp moves to 937 against 617 for no station gain.

D4. Growth from the count year is not applied. The published ramp ADT rows [CaltransRampADT] change by -2.1 to +1.0% a year (median -0.8%, eight rows) and the OakDOT counts [OaklandTMC] fall from 2018 to 2021; no source gives a rate for arterials. The mechanism exists (`growthPerYear` by source id, empty) so a verified rate can be added as data.

D5. Ashby Ave and Claremont Ave. The leg stations used the signal's own links, and the slip link 3449 (OSM `primary_link`, 491 veh/h modeled) was on neither leg. The Synchro worksheet of the Safeway study [SafewayCollege-DEIR2011] (page 482) counts the westbound right turn in the signalized lane group, with no separate lane, so the counted 239 are the vehicles that make the turn by either path. A slip link is now part of the legs it joins, found by geometry and not by name, and the movement that can use it has no movement station. The corridor ratio on the simulator's flows goes from 0.88 to 1.01.

D6. Reporting. The fit report, the station files and the assessment give GEH below 5 per source and count year, fitted and held out, per period, and the station rule overall and for sources counted in the last five years. The 85% rule is not redefined. An honest reading: it is not met overall (PM 68% fitted, 64% held out; AM 68% and 66%; midday 78% and 70%) and it is met on the recent sources in all three periods (PM 87% and 86%, AM 89% and 91%, midday 96% and 96%), with or without the weights. The recent set is 89 volunteer-count stations of 94 in the PM, from one hour of one day; the other recent stations pass 2 of 5. Applying the rule to recent sources only would drop the 2018 to 2021 city counts and the older ramp rows, so it is the owner's call and the numbers are in the record.

D7. Status. `status` stays `uncalibrated`, `experimentalPeriods` stays `["pm_peak"]`: the overall station rule fails and D16 and D5 hold.

## Results

PM peak, seeds 1 to 10, before and after (the record has the full tables): through cars Hillegass Ave SB / Colby St SB / Hillegass Ave NB / Colby St NB 111 / 103 / 74 / 146 to 110 / 97 / 66 / 139 (observed 79-120 / 39-117 / 48-95 / 102-145); headline shares 47.8 / 37.7 / 61.0 / 40.5 to 50.1 / 37.7 / 64.6 / 41.9 (error 5.4 to 4.7); removals per hour PM / AM / midday 0.40 / 0.00 / 0.00 to 0.10 / 0.00 / 0.00; 52nd St and Clifton St off-ramps 899 / 828 to 900 / 883 (1,024 / 617 counted); Alcatraz Ave entries 251 to 255 (360); fitted stations 131 to 130 of 190, held out 34 to 35 of 55. Network 5fe8241a6ba1e306 unchanged, demand 222fb062e8e5dc1c to 74a9882dd4286e12.
