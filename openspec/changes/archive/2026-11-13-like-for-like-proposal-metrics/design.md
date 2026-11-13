## Decision: only like-for-like metrics (user, 2026-11-13)

User feedback on a card: "please only show apples-to-apples metrics ... it's very confusing that they measure different things" and "this kind of thing is counterproductive. It will make people think that the cut-through adds a ton of traffic onto their street, so be very careful whenever you're showing metrics. Be very clear about what the two values are." The main number stays cars an hour with the percentage below it (earlier decision, unchanged).

## What the two old numbers were

- Headline: unique through cars using any side street, averaged over the searched periods.
- Side effect: the rise in all traffic (through cars and the local trips of people who start or end a trip in the area, both directions) on one block, in the single worst period, after the noise band.

## Card

Figure 1 is unchanged: "−27 cars an hour cutting through", "128 → 101 through cars an hour (−21%)", with a definition: through cars on all side streets together, each counted once, for the periods shown.

Figure 2 is the same kind of car with the same averaging: the side-street block that gains the most through cars an hour, averaged over the same periods, for example "+12 through cars an hour on Colby Street between 63rd Street and North Street, the block that gains the most". Its definition says through cars only, both directions of that one block, and how many other blocks also gain beyond run-to-run variation. When no block gains beyond noise it reads "No block gains through traffic beyond run-to-run variation" and shows no number.

An all-traffic number is never placed beside a through number. The sentence summary the search writes uses through cars only.

## Details

- "Through cars an hour, by period": columns Period and "Through cars an hour, before → after (change)", cars an hour first.
- "All traffic on side-street blocks (through and local trips together)": one row per period, each labeled with its period. Columns: block that gains the most all traffic, all cars an hour before → after, change split into through cars and local trips, blocks gaining beyond noise. A period with no block past noise says so and shows dashes.
- One sentence under the table says what the extra cars are, computed from the table: the through share of the gain is the block's through-car increase over its all-car increase, summed over the rows that gain beyond noise; local trips are the rest. It says "Mostly local trips" only when local trips are at least half. It adds that the simulation keeps the number of trips fixed, so these are trips moving, not new traffic (the Results caveat already states fixed demand). When no row gains it says nothing.

## Per-block through flow

`RunOut.through` is veh/h per link of through vehicles, from the per-link cut-through counters (`cum[l][1]`, the ones behind `run_link_stats` index 2 and the map's cut-through overlay). `Simulation::cut_through_exits` exposes the cumulative counts. The counts are snapshotted when the warm-up ends and differenced at the end, so through flow uses the same window as all-car flow and the subtraction all minus through is a like-for-like split. A block's through flow is the sum over its links, averaged over seeds, with its standard deviation over seeds.

The area figure (`ct_vph`) keeps its definition, each vehicle once over the whole run, so it differs slightly from summing blocks by design.

## Through harm

For each block the through increase is the mean over periods of (scenario minus baseline) block through flow. Its noise band is `max(2 x sigma, 10)` as for all traffic, with sigma the baseline's spread over seeds combined across periods as independent: `sqrt(sum of period variances) / periods`. The worst block is the one with the largest increase past its band, else the largest raw increase. `increaseVehPerHour` is that block's raw increase, not reduced by the band, so the number matches the before and after figures people can check. `blocksAboveNoise` counts blocks past their band. `harm_calc` is reused.

## Ranking unchanged

The search objective and the finalist and option selection still use the all-traffic harm (largest increase in all traffic on one block in any period, past its band). Residents experience all traffic, so a filter that sends local trips down the next street should still lose. The README and the Proposals intro say so.

## File format

Version 4. `harm` becomes `{through: {worstBlock, increaseVehPerHour, blocksAboveNoise}}`. `byPeriod[p]` becomes `{cutThrough: {baselineVehPerHour, scenarioVehPerHour, changePct}, allTraffic: {worstBlock, baselineVehPerHour, scenarioVehPerHour, throughIncreaseVehPerHour, blocksAboveNoise}}`. The writer keeps groups from versions 2 to 4 under a version 4 envelope. The reader marks any group whose proposals lack the through-car fields as `legacy`, shows no options and says it is out of date. The published file reads that way until the search is rerun.

## Other labels

- Results: the card is "Through traffic on side streets", the metric "Through cars on all side streets", unit "cars an hour". The note says it differs from the per-block counts on the map and in the Streets table.
- Streets table: column groups "All cars (cars an hour)" and "Through cars (cars an hour)".
- Map legend and export caption: "Flow: all cars on a block, cars an hour" and "Cut-through: through cars on a block, cars an hour"; the legend help says what each overlay counts.
- The hover readout shares `CHANGE_NAME` and `CHANGE_UNIT` with the change legend and is being edited elsewhere, so those constants are left alone.

No citation is added: counts of cars need no published parameter.
