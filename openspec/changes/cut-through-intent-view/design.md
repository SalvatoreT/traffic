## Context

Round 21 (`through-trip-intents`) gave approach groups and an intent map in the calibrate report. This change brings the same idea to the app.

## Decisions

D1. Owner decisions, 2026-11-14. A list plus a map highlight: a panel lists each reason with through cars an hour, baseline against scenario, live, and selecting one draws its typical path. The list is short (8 reasons) and curated in the area's data, plus "Other", each marked observed or assumed.

D2. Intents are data (`throughIntents` in the area config). A through trip that uses a residential or service street of the study area is filed under the first reason whose `fromGroups` hold its origin group and `toGroups` its destination group, else Other. The eight Rockridge reasons come from what the round 21 intent map shows carries the most through cars: Berkeley and College Ave traffic to the SR-24 on-ramps, Telegraph Ave and west-side traffic to the on-ramps, SR-24 off-ramp traffic to Berkeley and Telegraph Ave north, off-ramp traffic to Alcatraz Ave west and the hills, south and west Oakland traffic to Berkeley, the reverse, Oakland cross-town traffic, and hills and south Oakland traffic to the on-ramps.

D3. Where the classification lives. The builder writes the intent index on each car flow (`intent`) and the intent list (`intents`) at the top of the demand file, rather than a node-to-group map. The index is a few bytes a flow, the simulator needs no group logic, and one TypeScript implementation (`tools/lib/through-intents.ts`) decides. `tools/through-intents.ts` re-tags a built demand file without the 11-minute fit.

D4. Basis honesty. `observed` means a turning-movement or freeway-share count limits how many cars the model sends this way; where they come from and why they pick side streets is still an assumption of the model. `assumed` means no count limits it. The UI badge says "Observed counts" or "Assumed" in text and the note says what is which. These are hypotheses, not interviews.

D5. Counting. A through car is tallied under its flow's intent (or Other) at the moment `ct_vehicles` counts it, so the rows add up to the through-car total. Link use: when counted, every link the car entered so far is added to its intent, and each later exit adds that link. Both are cumulative since t = 0; the UI divides by elapsed hours, the window of the through-car figure. Whole-number rows are apportioned (largest remainder) so they add up to the rounded total.

D6. Map highlight. Links with at least 8% of the reason's cars an hour (and 1 an hour) are drawn, width 0.1 px per car an hour (clamped 2.5 to 15 px), on the run the map shows. The text summary names the arterials the cars turn off, the side streets used with direction, and where they rejoin, from the heaviest links. Display thresholds are assumptions.

D7. Coverage (seed 1, run-average): PM 95%, AM 94%, midday 91% of through cars fall under a listed reason.
