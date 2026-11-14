## Context

Owner words, 2026-11-14: "Instead of showing the MF square on the simulation map, show the perpendicular lines like you have on proposals page. Also, I want to be able to right click the proposals images and download them like a regular image. Also, put the picture right after the title in the proposal. I want to be able to download and send the proposal image and have it have the relevant legend, time period, and show the overall cut through decrease."

## Decisions

D1. Owner decision. A modal filter has no badge on the simulation map. Its bars are map symbols drawn like the proposal picture's bars (dark bar, yellow dashes, white halo, 2.2 : 0.6). Bar size follows the drawn road, with a minimum of 15 px long so it reads at the fitted overview (ASSUMPTION: design choice). A leg's bar sits at `max(8 m, (length/2 + thickness/2 + 2 px) at the current meters per pixel)` along its street, so the bars of the legs of one junction do not run into each other when zoomed out and stay on their streets. A block filter has one bar at mid-block.

D2. Each filter keeps a transparent, focusable 24 by 24 px button at its node or block midpoint with the badge's accessible name and tooltip, a visible focus ring, and a click that selects it (WCAG 2.2 SC 2.5.8, 2.4.7). Clicking a bar selects its filter. Other intervention types keep their badges at their old size. Export draws the same bars at the same places.

D3. Owner decision. The card's picture is its first element after the title. The grid has the picture column on the left from 720 px, summary and figures on the right, so reading order matches visual order. Below 720 px it is one column.

D4. Owner decision. The picture is a PNG shown in an `<img>`, so a right click or long press saves it. It is built as one SVG with text laid out by measuring with the page's font stack, then rasterized on a canvas at 2x (1600 px wide). It uses system fonts, because web fonts do not load inside an SVG image. It is drawn once the card is within 600 px of the screen. Its text alternative is the card title, the changes and the facts of the old inline picture.

D5. The image states through cars like for like: the picture's own period ("PM peak (16:00-18:00 weekday): 598 → 512 an hour (−14%)") and, on a second line, the card's average over the searched periods when more than one was searched. It also carries the legend ramp with numbers, the bar key and the outlined-block key, "Simulation result, not a forecast" with the area's calibration status, the area name, the OpenStreetMap attribution and the site address.

D6. The image is light in both themes. Choice: one image, so what is saved is what is shown. In dark mode it appears as a white card with a border, which reads as a picture, not as a gap. The page keeps the text legend in a closed `details` and the attribution under the image.

D7. The "Why cars cut through" highlight was orange (#d9480f light, #ffa94d dark), the hue of increases on the change view. It is now violet (#7a1fc2 light, #e4ccff dark) and dashed (2.4 : 1.2 line widths) with a solid casing. No scale uses violet or dashes this thick.
