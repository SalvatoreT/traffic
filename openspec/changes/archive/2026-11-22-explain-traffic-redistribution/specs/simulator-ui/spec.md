## ADDED Requirements

### Requirement: A closure exposes an accessible redistribution view
An intervention or proposal SHALL expose baseline, closure-only, and package redistribution. Labels and non-color cues SHALL distinguish possible bypasses, observed cohort routes, and net all-car changes. A keyboard-accessible table SHALL match the map's evidence, retaining direction, period, geographic scope, and relevant detours beyond the viewport. Incomplete, unmatched, unavailable, capped, or unhealthy evidence SHALL remain visible and never imply zero diversion.

#### Scenario: Inspecting Colby and North
- **WHEN** a user inspects a closure at Colby/North
- **THEN** the user can inspect legal paths via 63rd/Dana, recorded usage if available, baseline and scenario block counts, and the closure-only versus complete-package comparison without conflating those evidence types

#### Scenario: Reading without the map or colors
- **WHEN** a user navigates by keyboard or screen reader or cannot distinguish map colors
- **THEN** the table and labels provide the same counts, signs, scenario identities, route evidence types, and coverage limitations

### Requirement: All-car effects accompany through-traffic summaries
Redistribution and proposal entry points SHALL show absolute all-car counts and signed changes alongside through-traffic effects. Passage classes SHALL consistently distinguish external-to-external trips from trips with an endpoint inside the area, or be marked unavailable while retaining all-car totals. Raw effects SHALL retain existing paired uncertainty and evidence status, including unresolved increases.

#### Scenario: Through traffic falls while total traffic rises
- **WHEN** a proposal reduces through-car counts but raises all-car counts on 63rd or Dana
- **THEN** both changes are visible and the through-traffic improvement does not stand in for the total traffic effect

#### Scenario: Boundary traffic has no neighborhood through metric
- **WHEN** a boundary link carries external-to-external cars but its existing neighborhood through counter is inapplicable
- **THEN** the UI shows valid origin/destination passage classes or marks the decomposition unavailable, and never relabels those cars local merely because the existing through counter is zero
