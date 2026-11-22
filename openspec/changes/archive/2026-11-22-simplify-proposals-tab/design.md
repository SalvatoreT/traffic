## Context

The project lead asked for these changes on 2026-11-22, in these words:

> Remove the Streets tab. Also, the Proposals tab has an overwhelming amount of information. Show just the map and headline figures and let people expand anything else they want to drill down on. Also, have sticky headers for these proposals like you have elsewhere.
>
> The main tabs show have a gradient or something to indicate there are more tabs when you're on a smaller screen. Right now it's not super clear.

and, later the same day:

> Move the theme selector to the bottom. It's too prominent. Also make sure you can see the link to the source code on mobile. Also, make sure the screen doesn't shift left/right on mobile. Right now the proposals and methodology tabs can shift left/right if I drag the screen either way. I suspect something is too big.

The sections below record how each was carried out.

## Decisions

### Streets tab

Removed with its component, styles, `streetcols` and `roving` helpers and their tests. `showService` stays: the Scenario panel uses it. `STREETS_INTRO` stays in `copy.ts` because the text page still uses it.

`/streets` is no longer a tab path, so `viewOfPath` returns null and the existing rule for unknown paths applies: the Map opens and the address is corrected, keeping a scenario fragment. The Worker no longer lists `/streets` for the app shell; the static single-page fallback serves it.

The generated `streets.md` held the only text version of today's block-by-block figures. The proposals and baseline JSON files hold them per link, not per block. So the table is folded into `index.md` under "Street by street", and `/streets.md` answers with a 301 to `/index.md` so old links and cached indexes do not hit the app shell. `llms.txt`, `llms-full.txt`, the docs, the README, `index.html` and the preview plan name no Streets page. The preview plan builds one card per tab from `VIEWS`, so the Streets card disappears without a special case.

### Headline figures

"Headline figures" means the two figures the card already led with, each labeled as what it is:

- through cars an hour before → after on the area's side streets, with the change in cars an hour and in percent;
- the side-street block with the largest rise in all cars an hour, with its before → after (all cars, never added to or compared with the through-car figure).

The line for that block is the one the card showed before. `data/proposals/README.md` calls the like-for-like through-car block the card's side effect; the card has shown the all-car block as its second figure and kept the through-car block in More detail, and that arrangement is kept. Failed access or validity checks stay visible because they say a figure should not be trusted. The calibration caveat stays at page level, outside any disclosure.

### What moved behind disclosures

Card, all closed by default, in this order:

1. "Changes in this package (N)", only when N is above three; a short list stays visible under the heading "Changes".
2. "In words, and where these figures come from": the summary, what it is best for, the scope sentence and interval of the headline figure, the evidence note and the comparison with the next option.
3. "Through cars an hour, by period": the table.
4. "All cars on the worst block, and the search's ranking penalty": the definition, the through and local split with its interval, the table, the note on what the extra cars are, and the note that no diversion has been ruled out.
5. "Context: through cars on one block, through routes, resident detour": the like-for-like through-car block with its definition, the route count, the detour.
6. "Variants (N)": all variants, no longer three then "more".
7. Inside the map: "Streets that change, where filtered traffic goes, and the map key". The readout beside the map stays, because hover and tap numbers appear there.

Page: two sentences visible. "How to read these cards, and where the figures come from" holds the rest of the introduction, the through-route caveat, the computed date and the provenance line. The exploratory, out-of-date, not-verified and failed-confirmation notices stay visible.

The resident detour moved from a visible box to item 5. The lead listed context metrics among the things to fold; this one is a cost to residents, so it is flagged in the report.

Disclosures are native `details` and `summary`. Closed by default, so no scripts decide their state. The map's "Back to list" opens the disclosure that holds the row it returns to.

### Sticky headers

Same method as the Assumptions headings: `position: sticky; top: var(--sticky-top)` in the stage's scroll, opaque themed background, a lower edge. The header holds the number, title and headline figure. The card's top padding moved into the header so it pins flush. The header's measured height goes into `--prop-head-h` on the card, which offsets the pinned map column and readout on wide cards. The stage's `scroll-padding-top` is 7rem on narrow screens and 21rem where the map pins, so a focused control is not left under the header or the pinned readout (WCAG 2.4.11). Three-column cards are gone: with the street list folded, two columns are enough.

### Tab row cue

The old cue was a mask that faded the labels themselves, which also dimmed the edge tab. It is replaced by a wrapper around the row with two pseudo-elements: a gradient from the header color and a chevron, shown by `data-more` on the wrapper only on the sides that have more tabs. They take no pointer events. The row's `scroll-padding-inline` is 2.75rem so a focused or clicked tab is not left under a fade. The pure helpers `moreSides` and `centeredScroll` sit in `src/lib/overflow.ts` and are unit tested. Without the Streets tab the row still overflows at 320, 375 and 414 px (the cue shows on the right at the Map tab at all three). Forced-colors mode drops the cue; the row stays scrollable. Opacity changes only with `prefers-reduced-motion: no-preference`.

### Theme and footer

The Theme select moved to the footer as a small labeled control with the same state and storage. The footer was `display: none` below 720 px, which hid the source link; it is now shown on phones, wrapped, with 24 px targets and safe-area bottom padding. The bottom sheet sits at `bottom: var(--foot-h)` and is clipped to its visible height so its hidden part does not cover the footer. The sheet's snap heights use the window height above the footer.

### Sideways panning

Measured at 320, 375 and 414 px, closed and open, on every tab, in Chromium with touch emulation, on `main` and on this branch: the document, `.stage` and `.app` were never wider than the screen, and touch drags moved nothing. The report from a phone could not be reproduced that way. The only overflow found at any width from 280 to 760 px is two spans of the Map tab's playback clock at 280 px, below the 320 px target. So no single oversized element is confirmed as the cause. The change therefore adds guards, and keeps the check: `html, body` and `.stage` clip horizontal overflow and set `overscroll-behavior-x: none`. `tools/check-mobile-layout.mjs` runs the measurement and a touch drag for each tab, closed and open. One more possible cause on iOS is that a focused `select` or `input` with a font size under 16 px makes Safari zoom the page, after which it can be dragged sideways; the footer select is 12.8 px like the other selects, and this is not changed here.

## Risks

- Hiding the map's street list means a person must open a disclosure to pick a street from a list; hovering or tapping the map still works.
- `llms-full.txt` includes `index.md`, so it now carries the street table (about 9 KB).
- Tests cover helpers and source rules. The repo has no component or end-to-end test runner, and Playwright is not a dependency, so the layout check is a script, not part of `npm test`.
