## Decisions

- The highlight is a separate transient state (`Hover`) held in the app, not part of `Selection`. It moves no camera and changes no scenario.
- It draws on its own map source with a dashed amber line inside a dark or white casing, and a ringed circle for intersections. Shape and width differ from the solid blue selection, so color is not the only signal. No animation, so reduced motion needs no special case.
- Keyboard: the active option in the combobox lights its place (the input keeps focus, per the ARIA combobox pattern). Table rows take focus (`tabIndex=0`) and light on focus.
- List visibility is `query present, results exist, not dismissed`. Only typing, Escape and choosing change `dismissed`; focus and blur do not. A first Escape closes the list and a second clears the query, as before.
- The Streets view has no visible map today, so the table highlight would show nothing. The map is shown in a sticky strip above the table, read-only (`interactive=false`).
- Hover handlers and list state are pure helpers in `src/lib/highlight.ts` and `src/lib/picker.ts`, so vitest covers them without a DOM.
