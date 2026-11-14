## ADDED Requirements

### Requirement: Through intents are data
The area config MAY define `throughIntents`: an ordered list of reasons, each with an id, a label, `fromGroups`, `toGroups`, an optional `avoids`, a basis of `observed` or `assumed`, and a note. The demand build SHALL write the list as `intents` in the demand file and set `intent` (the list index) on each car flow whose origin group and destination group are the first reason's. It SHALL stop on an unknown group, a repeated id or a missing field, and SHALL NOT change any volume.

#### Scenario: First match wins
- **WHEN** a flow's groups fit two reasons
- **THEN** its `intent` is the earlier one

#### Scenario: No match
- **WHEN** no reason fits
- **THEN** the flow has no `intent`
