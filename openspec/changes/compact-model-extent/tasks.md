## 1. Extent as data

- [x] 1.1 `extent` (polygon, `bufferM`, `include`) and `preview` in the area config type; importer crops to the extent and cuts ways at the polygon edge
- [x] 1.2 Importer lists preview areas last and copies the flag; the app's default skips preview areas
- [x] 1.3 Verify the `rockridge` network, basemap and `areas.json` are byte-identical after the change
- [ ] 1.4 Tests: extent crop and cut gate, buffer, includes, area without extent unchanged, preview ordering

## 2. Compact area

- [x] 2.1 `data/areas/rockridge-compact.json`: same study area and settings as `rockridge`, extent polygon chosen by the rule in design.md, `preview: true`
- [x] 2.2 `data/demand/rockridge-compact.config.json` and `data/calibration/rockridge-compact.targets.json` (copies with the outputs renamed)
- [x] 2.3 Census blocks outside the extent left out of the demand build
- [x] 2.4 Freeze the compact split (`--freeze-split` on the compact config); the `rockridge` split file unchanged
- [ ] 2.5 Build the compact demand (shipped and training views); record peak memory and run time; verify `rockridge` demand unchanged

## 3. Evaluation (same rules as the current model, no tuning)

- [ ] 3.1 Validation suite unaffected (no engine change)
- [ ] 3.2 PM seeds 1-10 on both models
- [ ] 3.3 PM seeds 11-20, AM and midday seeds 1-10
- [ ] 3.4 Assessment to its own output set (`--suffix`)
- [ ] 3.5 Delay-feedback loop under the unchanged acceptance rule
- [ ] 3.6 Three published proposals on both models (`explore --check`, PM, AM, midday, seeds 1-3)

## 4. Report

- [ ] 4.1 `data/calibration/rockridge.extent-comparison.md`
- [ ] 4.2 Tests pass (`cargo test -p traffic-sim`, `npm test`), merge, push
