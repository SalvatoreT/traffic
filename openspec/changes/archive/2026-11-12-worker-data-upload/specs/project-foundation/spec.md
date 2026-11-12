## ADDED Requirements

### Requirement: Authenticated data publishing through the Worker
The Worker SHALL accept reads and writes of data files under the `areas/`, `osm/` and `demand/` prefixes of its bucket only from requests carrying the configured upload secret, and SHALL refuse all such requests when no secret is configured.

#### Scenario: Valid upload
- **WHEN** a PUT with the correct secret and an allowed key arrives
- **THEN** the object is stored in the bucket and the response reports its size

#### Scenario: Wrong or missing secret
- **WHEN** a request arrives without the correct secret
- **THEN** it is refused with 401 and nothing is read or written

#### Scenario: Key outside the data prefixes
- **WHEN** an authenticated request names a key outside the allowed prefixes
- **THEN** it is refused with 400

#### Scenario: No secret configured
- **WHEN** the Worker has no upload secret
- **THEN** the endpoint answers 503
