## Why

Adding an intervention means picking a tool and then a street. People think the other way
around: they look at a street or an intersection and ask what they could do there. The
tool palette also takes up most of the Scenario panel.

## What Changes

- Selecting comes first. Click a street block or an intersection on the map, or find it
  by name, and the app offers the interventions that apply to that place.
- On desktop the choices appear in a pop-up at the selection. On a phone they appear in
  the bottom sheet. The same choices appear in the side panel when a place is picked from
  the search list, so the map is never required.
- Interventions already on the selected place are listed there with a remove button.
- **BREAKING**: the tool palette is removed.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `simulator-ui`: how an intervention is added

## Impact

`src/components` (Scenario panel, map selection, a new selection menu). The simulation
API and the link format are unchanged.

## Out of scope

Drawing new streets or moving existing ones. Multi-select.
