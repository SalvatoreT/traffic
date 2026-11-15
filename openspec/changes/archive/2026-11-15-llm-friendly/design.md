## Decisions

- **Static text plus a local CLI, no run API** (project lead's constraint: no new compute or write paths on the public site). Agents run the model themselves.
- **Generated from the repo, not copied.** The pages are built from the data files, `docs/` and shared constants in `src/lib/copy.ts` (a test checks they still match the components). Guides under `docs/` are the single source for the link grammar, the data files and the local-run steps, and are included verbatim.
- **Published through R2.** Pages depend on data published with `data:push`, so they live at `areas/llms/*`. The Worker maps `/llms.txt`, `/llms-full.txt` and eight `.md` paths to those keys with explicit content types, `nosniff`, `no-cache` and ETags; a missing file is a 404. The existing upload key rule already allows the prefix.
- **Same numbers as the app.** The CLI uses the WASM runner of the stored results, with the app's defaults (seed 1, 3600 s, demand 1) and the straightened network the app uses. Block figures use the Streets tab's aggregation. On the PM peak diagonal-diverter proposal the CLI and the app both gave 622 to 597 through cars an hour.
- **Honesty.** Every page opens with the not-a-forecast statement and the area's calibration words; numbers computed on other inputs are marked "Out of date" and still shown (same rule as the app's proposal groups).
- **Repository public** (confirmed unauthenticated), so the local-run steps clone it.
- **Citations.** Item parameters and effects cite the specs already in force ([Rodegerdts2010], [Webster1958], [Brilon1999]); the CLI adds no model parameters. The 7.5 cars an hour noise band is the map's existing dead band.
