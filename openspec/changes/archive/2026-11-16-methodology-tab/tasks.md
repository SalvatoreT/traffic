## 1. Routing and serving

- [x] 1.1 Add `methodology` to `View` and `VIEWS` between Streets and Assumptions; update the route and worker tests
- [x] 1.2 Add `/methodology` and `/methodology.md` to `run_worker_first` and `methodology` to the text pages the Worker serves
- [x] 1.3 Add a preview summary for the tab and a no-script link

## 2. Page

- [x] 2.1 Write the shared copy in `src/lib/methodology.ts` with a word-count and content test
- [x] 2.2 Build `Methodology.tsx` with the two step diagrams and the cut-through diagram
- [x] 2.3 Theme and responsive styles in `methodology.css`

## 3. Text page

- [x] 3.1 `methodologyMd` in `tools/lib/llms-docs.ts`, listed in `llms.txt`, the overview and the full text

## 4. Verification

- [x] 4.1 Check in Chromium at 1440x900 and on a phone, light and dark: no horizontal scroll, anchors, deep link, axe
- [x] 4.2 `npx vitest run` and `npx tsc --noEmit`
