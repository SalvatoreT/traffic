## Feedback recorded (project lead, live site)

1. "There are random floating `counted, no trips assigned` badges on the assumptions page"
2. "I still don't see the maps for the 'why cut through' section."
3. "could we have sticky headers for the 'Assumed movement flow' and 'Why cars cut through' section. Also, can you swap their order?"

## Decisions

- **Badges.** The tag was an inline-block with `white-space: nowrap` in a cell about 100 to 155 px wide; at 179 px it overflowed the cell and sat under the next column. It is now a block under the number, shortened to "no trips assigned", allowed to wrap, with `max-width: 100%`. The explanation stays in the note below the figures, which now reads periods as "AM peak" and not `am_peak`.
- **Maps.** After the baseline was republished, the live page showed a map on all seven reason cards: the stored file matches the loaded network, demand and simulator. When the stored file does not match, the page already drew no map; it now says "Map not available yet: the stored traffic for this version of the model is being updated." on each card and keeps the section note short.
- **Order.** Reasons first, movements second. Ids (`why-cars-cut-through`, `assumed-movement-flows`) are unchanged; the aliases in `route.ts` still resolve.
- **Sticky headings.** `position: sticky` on each section's h3, so it releases when the section ends. The scroller is `.stage` on every layout, and the top bar sits outside it, so the offset is `--sticky-top` (0) and one variable, `--sticky-h`, gives the heading height. The same variables feed `scroll-margin-top` for anchors and `scroll-padding-top` on the stage, so an anchored card and a keyboard-focused control are never under the heading (WCAG 2.2 SC 2.4.11). Street-pair subheadings are not sticky.
