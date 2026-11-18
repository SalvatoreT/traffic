## 1. Decision

- [x] 1.1 Record the user's decision of 2026-11-18 and the picture choices in `design.md`.

## 2. Pictures

- [x] 2.1 Add `src/lib/signs.ts`: shape lists for each picture, SVG and canvas writers, `pictoOf`, heading to rotation.
- [x] 2.2 Draw the pictures on the map markers, in the scenario list, in the legend, in the proposal picture and key, in the share image and its keys, and in the exported image and its key.
- [x] 2.3 Thread the control value through the legend symbols and the picture marks.
- [x] 2.4 Remove the letter machinery and the `.iv-badge` styles.

## 3. Tests and checks

- [x] 3.1 Tests for `signs.ts`, the legend keys and the picture marks; `npx vitest run` and `npx tsc --noEmit` pass.
- [x] 3.2 Look at the map, legend, scenario list, proposal picture and exported image at desktop and Pixel 7 widths.
