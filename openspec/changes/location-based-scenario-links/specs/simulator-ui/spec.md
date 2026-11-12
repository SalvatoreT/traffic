## ADDED Requirements

### Requirement: Location-based scenario links
Shareable scenario links SHALL encode each intervention by geographic location, with a bearing where direction matters, together with the area id and a format version, and SHALL NOT depend on network link or node indices.

#### Scenario: Network regenerated
- **WHEN** a link is opened after the street network has been rebuilt with different link and node indices
- **THEN** each intervention is restored on the same street block or intersection as before

#### Scenario: Location no longer exists
- **WHEN** an intervention's location has no matching street or intersection within tolerance
- **THEN** the rest of the scenario loads and the unplaced intervention is listed with an explanation

#### Scenario: Old-format link
- **WHEN** a link in the earlier index-based format is opened
- **THEN** the app explains that the link predates a map update and starts from the baseline
