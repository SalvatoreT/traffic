## Why

With an intervention in place, the map shows the scenario's traffic but not how it
differs from today. To see what a filter or diverter did, people have to compare numbers
in the Results panel or the Streets table. The question they bring is where traffic went
up and where it went down, and that is a map question.

## What Changes

- When a scenario has interventions, the map can color each street by its change from
  the baseline for the chosen metric: cut-through, speed or flow.
- The change view turns on by itself when the first intervention is added and can be
  switched back to the scenario's own values.
- The legend shows a two-sided scale centered on no change.
- Selecting a street shows its baseline value, scenario value and the change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `simulator-ui`: a change-from-baseline view of the traffic overlay

## Impact

`src/` only. The worker already runs the baseline alongside the scenario.

## Out of scope

Change views for walking and biking metrics. Exporting the difference.
