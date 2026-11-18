## Decision (user, 2026-11-18)

The user finds two-letter acronym boxes unhelpful and chose "Replace all six" with small sign-style pictures, the way a modal filter is a bar, a diverter a striped line, and a speed limit or Slow Street a drawn speed-limit sign.

## Design

### One source of truth

`src/lib/signs.ts` describes each picture as a list of shapes (SVG path data with fill, stroke, width and dash) and optional text, in a 32-unit box centered on the origin. `pictoSvg` and `pictoElement` write SVG from the list; `drawPicto` replays the same path data on a canvas with `Path2D`. The DOM markers, the scenario list, the legend keys, the proposal picture, the share image and the exported image cannot drift apart. This follows the pattern of `speedsign.ts`, which stays as it is for speed limits.

### The pictures

All of these are ASSUMPTIONS about what reads well at 20 to 30 CSS px. They echo common US road-sign conventions but are simplified and claim to be no official sign.

| Mark | Picture |
| --- | --- |
| control: two-way stop | red octagon, white border, "STOP" when drawn 24 px or taller, plain below that |
| control: all-way stop | smaller red octagon with a white "ALL" plaque under it |
| control: signal | dark rounded housing with red, yellow and green lamps |
| control: uncontrolled | gray octagon with a slash (stop removed) |
| control: traffic circle | the traffic-circle picture |
| signal_timing | the traffic light with a clock beside it |
| speed_hump | yellow diamond with a hump profile |
| traffic_circle | blue disc with three white circling arrows (counterclockwise, as US circles run) |
| one_way | black rectangle with a white arrow, turned to the street's heading |
| turn_ban | white disc, red ring and slash, black left-turn arrow |

The yellow diamond is the hump and the blue disc is the circle; the two never share a shape. Every picture differs in outline or pattern, so color is never the only signal. Each has a white outline and a hairline dark edge so it reads on any street color and on the dark basemap. A turn ban is always drawn as a left turn: the intervention carries no turn side, and the text names the turn.

### Control values

`ControlType` has five values: `signal`, `all_way_stop`, `two_way_stop`, `uncontrolled` and `traffic_circle`. Each maps to a picture in `pictoOf`; a control that becomes a traffic circle shares the picture and the legend key of a traffic-circle intervention. The legend lists only the variants present, in a fixed order.

### Rotation

A one-way sign turns by `-heading` (the network's heading is counterclockwise from east, the page turns clockwise) so the arrow points the way cars may go. The map is never rotated by the user, so the sign needs no counter-rotation. The proposal picture has the heading in its mark. The scenario list and the legend show the sign unrotated.

### Keys and text

Key text names the picture, then what it means, for example "Red stop sign: intersection changed to a two-way stop". The text key under a proposal picture lists each picture present, with a small copy of it. The `aria-hidden` map markers, the invisible modal-filter buttons and every text alternative are unchanged.

### Removed

`BADGE_TEXT`, `BADGE_STYLE`, `LetteredType`, `LetterBadge`, `isSignType` and the `.iv-badge` rules are gone. The proposal picture's `badge` and `arrow` marks merge into one `picto` mark.

## Risks

- A one-way sign on the proposal picture sits on its street and can overlap a bold change number. The number keeps its place; the sign is the same size as the other pictures.
- The "ALL" plaque and the "STOP" word are small. The key text and the title on each marker carry the meaning where the picture is too small to read.
