## Why

An independent review of the live site confirmed fourteen defects in the web app and the Worker. The worst: changing the period after a run finished showed the old period's results as the new period's full hour and the new run never started. Others made the map disagree with the legend, Streets table and proposal pictures, left early noisy figures unlabeled, and let a damaged stored result or a malformed URL throw.

## What Changes

- A period or demand change no longer lets the old run's reports reach the new configuration. A period change is sent at once; only the demand slider is debounced, and the client drops reports until its config is sent.
- The cut-through and change-in-cut-through layers color a block from both directions summed, with the same dead band and top as the proposal picture. Flow and speed stay per direction. Legend text and hover rows say which.
- A scenario link opened in a running tab applies its period and demand as well as its interventions.
- A single early label appears wherever a rate is shown during the first five simulated minutes.
- The "Why cars cut through" card announces only a selection, and its path sentence is stable.
- Stored results are validated in full; an error boundary guards the app root; a late stored-result lookup never replaces a run the user started; a link scenario on the synthetic fixture starts.
- The Worker returns 400 for malformed `%` sequences, 404 JSON for a missing `/data` file, `nosniff`, and revalidates `/data` on every use (`no-cache` with ETag).
- Proposal picture and share image never label the multi-period average as the picture's period; object URLs are revoked correctly; control badges are named by type.
- The filter control respects `interactive`. Legends gain keys for bars, diverters, badges and the reason line, on screen and in the exported image; a stored-result export lists no cars.
- Reason maps keep From and To labels clear of boundary street names. The Streets table header sticks below the map strip.
- Cleanup: one badge map, dead styles and exports removed, one hash computation for proposals.

## Capabilities

### Modified Capabilities
- `simulator-ui`: restart handling, map layer semantics, early labels, announcements, stored-result safety, legends, Streets layout.
- `project-foundation`: Worker `/data` serving behavior.

## Impact

`src/App.tsx`, `src/sim/client.ts`, `src/lib/{change,hoverline,legend,mapexport,intentmap,intents,run,stored-results,picture,shareimage}.ts`, map, legend, Streets, intent and proposal components, `worker/index.ts`, styles. No simulator or data changes.
