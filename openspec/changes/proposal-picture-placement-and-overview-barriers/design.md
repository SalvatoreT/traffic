## Context

Owner words, 2026-11-14: "Instead of showing the MF square on the simulation map, show the perpendicular lines like you have on proposals page. Also, I want to be able to right click the proposals images and download them like a regular image. Also, put the picture right after the title in the proposal. I want to be able to download and send the proposal image and have it have the relevant legend, time period, and show the overall cut through decrease."

## Decisions

D1. Owner decision. A modal filter has no badge on the simulation map. Its bars are map symbols drawn like the proposal picture's bars (dark bar, yellow dashes, white halo, 2.2 : 0.6). Bar size follows the drawn road, with a minimum of 14 px long so it reads at the fitted overview (ASSUMPTION: design choice). Owner correction, 2026-11-14: the bars stay at the end of the road, like the proposal picture. A leg's bar is always 8 m along its street from where the leg begins, at every zoom; zoomed out the four bars overlap into one compact mark (14 px bar plus 2 x 8 m of ground, about 19 px on the phone and 21 px on the desktop at the fitted overview). A first version pushed the bars outward with zoom and they read as dotted squares floating in the blocks. A block filter has one bar at mid-block.

D2. Each filter keeps a transparent, focusable 24 by 24 px button at its node or block midpoint with the badge's accessible name and tooltip, a visible focus ring, and a click that selects it (WCAG 2.2 SC 2.5.8, 2.4.7). Clicking a bar selects its filter. Other intervention types keep their badges at their old size. Export draws the same bars at the same places.

D3. Owner decision. The card's picture is its first element after the title. The grid has the picture column on the left from 720 px, summary and figures on the right, so reading order matches visual order. Below 720 px it is one column.

D4. Owner decision. The picture is a PNG shown in an `<img>`, so a right click or long press saves it. It is built as one SVG with text laid out by measuring with the page's font stack, then rasterized on a canvas at 2x (1600 px wide). It uses system fonts, because web fonts do not load inside an SVG image. It is drawn once the card is within 600 px of the screen. Its text alternative is the card title, the changes and the facts of the old inline picture.

D5. The image states through cars like for like: the picture's own period ("PM peak (16:00-18:00 weekday): 598 → 512 an hour (−14%)") and, on a second line, the card's average over the searched periods when more than one was searched. It also carries the legend ramp with numbers, the bar key and the outlined-block key, "Simulation result, not a forecast" with the area's calibration status, the area name, the OpenStreetMap attribution and the site address.

D6. The image is light in both themes. Choice: one image, so what is saved is what is shown. In dark mode it appears as a white card with a border, which reads as a picture, not as a gap. The page keeps the text legend in a closed `details` and the attribution under the image.

D7. The "Why cars cut through" highlight was orange (#d9480f light, #ffa94d dark), the hue of increases on the change view. It is now violet (#7a1fc2 light, #e4ccff dark) and dashed (2.4 : 1.2 line widths) with a solid casing. No scale uses violet or dashes this thick.

D8. Owner decision, 2026-11-14: "You don't need to number the title in the proposal image." The image's title is the proposal's title with no number; the card heading keeps its number. The download name is the area id, a slug of the title (at most 60 characters) and the period id, for example `rockridge-filter-on-martin-and-ayala-pm-peak.png`.

D9. Owner decision, 2026-11-14: "If there's space, you could also put a QR code to the proposal 'open in the map' in the bottom right corner where it's currently blank." The footer is split in two: status, area, attribution and site address on the left, a QR code on the right with the label "Open this proposal in the simulator". The QR code encodes the absolute address `location.origin` + `/` + the proposal's link (which carries the period). It is drawn by the MIT-licensed `qrcode-generator` 2.0.4 (about 56 KB unminified, no network call): byte mode, error correction M, quiet zone of 4 modules, black modules on a white box in any theme, 3 layout px per module (6 px in the 2x PNG). The footer grows to hold it, so it never covers the map, legend or text. Checked by decoding the saved PNG with `jsqr` in the browser test run.
