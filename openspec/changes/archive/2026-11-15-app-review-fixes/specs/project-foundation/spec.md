## ADDED Requirements

### Requirement: Data serving
The Worker SHALL answer a malformed percent sequence with 400, a missing `/data` file with a 404 JSON body, add `x-content-type-options: nosniff` to every `/data` response, and set `cache-control: no-cache` with an ETag so that unchanged files return 304.

#### Scenario: Missing file
- **WHEN** a client requests `/data/results/rockridge/none.json` that is not stored
- **THEN** it gets status 404 with a JSON body, not the app page
