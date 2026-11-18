## Why

Six intervention types are marked on the map with two-letter boxes: IC, ST, SH, TC, 1W and TB. People have to learn the letters before the map says anything. A modal filter is already a bar across the street, a diagonal diverter a striped line, and a speed limit or Slow Street a drawn speed-limit sign, so the letters are the one mark that still needs a key to read.

## What changes

- The six lettered boxes become small sign-style pictures: a stop sign, a traffic light, a traffic light with a clock, a yellow diamond with a bump, a blue disc with circling arrows, a black one-way sign with a white arrow, and a turn arrow in a red slashed circle.
- The picture for an intervention control depends on the control value: two-way stop, all-way stop (with an ALL plaque), signal, uncontrolled (gray stop sign with a slash) and traffic circle.
- A one-way sign turns to point along its street.
- One module, `src/lib/signs.ts`, holds each picture as a list of shapes. The map markers, the scenario list, the legend, the proposal picture, the share image and the exported image all draw from it.
- Keys name the picture in words, for the variants present only, instead of listing letters. Aria labels and text alternatives stay as they are.
- The letter machinery (`BADGE_TEXT`, `BADGE_STYLE`, the `iv-badge` styles) is removed. The scenario list also shows the bar and the striped line for a modal filter and a diverter instead of the letters MF and DD.

## Impact

- Specs: `simulator-ui` (map image export, legend keys, and a new requirement for the pictures).
- Code: `src/lib/signs.ts`, `legend.ts`, `mapexport.ts`, `picture.ts`, `shareimage.ts`, the map, toolbar, scenario list and proposal components, `styles.css`.
- Generated data: proposal share images and link-preview cards that show these marks draw differently, so `data:previews` output changes. The text pages from `data:llms` do not mention the letters.
