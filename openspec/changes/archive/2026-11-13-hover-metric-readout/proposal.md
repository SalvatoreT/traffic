## Why

The hover label on the map names a street block but not the number behind its color. People want to read the value the legend is tracking without opening the street's menu or the Streets table.

## What Changes

- The hover label gains a second line under the block name: a small color swatch, the metric name and its value with unit.
- Which metric and view it shows follows the legend: cut-through, flow or speed, in the baseline, scenario or change view. The change view shows the before and after values and the signed change.
- The swatch is the color the map draws for that street, in the current theme.
- Before stats exist, the line reads "No data yet".

## Capabilities

### Modified Capabilities

- `simulator-ui`: the live traffic map requirement gains a hover readout.

## Impact

`src/components/MapView.tsx`, `src/lib/hoverline.ts` (new), `src/lib/ramps.ts`, `src/lib/naming.ts`, `src/styles.css`, tests.
