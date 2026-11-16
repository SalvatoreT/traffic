## Decisions

Decisions by the project lead, 2026-11-15, after reviewing a preview of the first version.

### D1: What counts as measured

A link is measured when the data flags it `inStudyArea` and its class is `residential` or `service` (`linkMeasured` in `src/lib/scope.ts`; a block is measured when its first link is). This is the same set the simulator uses for the through-car count (`is_local`) and the search uses for harm (`harm_blocks`), so every figure on screen describes the streets the question is about.

The preview shaded study-area arterial links as well and offered a `?shade=interior` switch. The lead chose the interior reading as the only behavior: bounding streets are context. The switch and the other scope are removed. Study areas stay data: nothing names a street in code.

### D2: Context versus no traffic

Streets that are not measured are drawn as a thin dashed centerline, lighter than the basemap street, without casing or ramp. A measured street with no traffic takes the ramp's lowest color, thin, with the white or dark casing. Dashes, width and casing carry the difference as well as color. Both themes were checked in screenshots. The dash and color values are design choices, not calibrated values.

### D3: Speed mode dropped, Flow kept

The Speed overlay, its legend and hover text, and the speed rows of the Results and Streets views are removed. The map has two modes, each with a baseline and a change view. Old links never carried a map mode (it is interface state, not part of the scenario fragment), so no link parsing changes: a link always opens in Cut-through.

### D4: Whole-network figures removed, not hidden

The simulator's `Metrics` still carries trip time and delay, completed and unroutable trips, per-mode results, walking and biking safety, network health counts and the arterial mean speed. The metrics are aggregates over the whole network with no per-link breakdown, so none can be restricted to the study area in the app. The app does not show them, and the dead UI code and copy are deleted. `crates/sim` is untouched, and stored results keep their fields and keep loading (the safety-version check for stored walking and biking data stays).

Close-following conflicts stay: the simulator counts them only on residential streets inside the study area. The oversaturation caution stays as one sentence without counts, because a run that removed vehicles to clear gridlock understates congestion whatever the figure shown.

The headless report follows the app: `metrics[]` lists the through-car and conflict figures, `networkHealth` carries only the oversaturation flag and the skipped and unplaced counts, and block rows drop mean speed.

### D5: Where traffic goes and proposals

The net-change table lists measured blocks only. One summary row, "Bounding streets and outside", gives the net all-car change summed over every other link, with its paired interval. It stays because it is how displacement off the side streets is seen. Proposal cards read the published file: their largest all-car rise was already computed over side-street blocks, so only labels change. The bounding-streets table and the "Inside the area" block are dropped from cards and text pages; the data file still records them.

## Risks

- A shared link that selects a bounding street still opens, but the street shows "Outside the study area: not measured".
- Stored precomputed results made before this change keep their extra fields; the app ignores them.
