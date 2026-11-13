## Context

The map colors each directed link by its own intensity. A street block is one or two directed links, so a two-way block has two colors on the map.

## Decisions

- **D1. Direction.** The line reports the hovered directed link, not the block sum, and names the direction ("toward Elm St") when the block has two. A block-total number next to one direction's swatch would disagree with the map, and a block-total color is never drawn. The Streets table keeps the both-directions total. One-way blocks show no direction.
- **D2. Same color as the map.** The swatch uses the intensity function, the 1/250 quantization and the stops the paint expressions use (`colorForIntensity` in `ramps.ts`), interpolated linearly in RGB as MapLibre does, so it matches the drawn line in both themes. No data, no traffic and the change dead band use the muted gray the map uses.
- **D3. Metrics and units.** Flow and cut-through in veh/h. Speed as percent of the limit, which is what the legend scale shows, with mph in parentheses. The change view reuses `readoutText` ("Flow: 600 → 100 veh/h (−500)"). SI stays internal and conversion happens in the helper.
- **D4. Accessibility.** Metric name and value are text. The swatch is decorative and has a border in the text color, which has far more than 3:1 against the label background in both themes. The label stays hidden from assistive technology like the existing hover label; the Streets table is the text alternative.
- **D5. Live.** The hovered link is state, and the line is derived from the current stats, so it updates as stats arrive.
- Keyboard focus: the map has no focusable blocks and the Streets table rows already show the numbers, so no tooltip is added there.

No published research is involved; the values are the simulator's own outputs.
