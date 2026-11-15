## Context

The client tags worker reports with an epoch that only advances when a restart message is sent. The period effect restarted the run state at once but sent its config after a 250 ms debounce, so a report of the old finished hour carried the current epoch.

## Decisions

- **Hold, then send.** `SimClient.hold()` drops reports until the next restart message goes out. The period effect sends its config in the same effect with no timer; the demand slider holds and debounces. App also clears live stats on restart. Alternative considered: bumping the epoch locally. Rejected, because it desyncs from the worker's own count.
- **Block-summed cut-through (user decision from review).** The cut-through layers take their color from the sum of a block's directions with dead band 7.5 and top 100 cars an hour, matching the picture, Streets and cards. Both directions draw in one color. Hover lists each direction ("this direction") and the block total ("both directions"). Flow and speed keep per-direction color, with a top of one lane's capacity, and the legend says so.
- **Early label.** `isEarly(finished, time)` is true before 300 simulated seconds of an unfinished run. One label and note text is used in Results, Streets, map hover, the legend, the selection readout and the reasons card. Text carries it, not color.
- **Stable reasons card.** Streets within 25% of each other in flow order alphabetically, so near-equal flows do not swap places. The sentence is held while the run plays. A separate polite status announces selection only. This is a display tolerance, not a calibrated value.
- **Stored results.** `parseResult` checks base64, link-stat length against the network (stride 4), intent stride (3) and the metrics fields the UI reads. A bad file reads as no stored result.
- **Worker caching.** `cache-control: no-cache` with the R2 ETag: browsers revalidate and get a 304 when unchanged, so a new bundle never pairs with data from before a publish.
- **Badges.** One `BADGE_TEXT`/`BADGE_NAME` pair; filters and diverters are not badges.

## Risks

Revalidating `/data` adds a round trip per file per load; 304s keep it small.
