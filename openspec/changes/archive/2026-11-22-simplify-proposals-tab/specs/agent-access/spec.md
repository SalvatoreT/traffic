## MODIFIED Requirements

### Requirement: Text pages for language models
The site SHALL publish `/llms.txt`, `/llms-full.txt` and a text version of each tab as static files generated from the data files and the docs, each stating the date and input hashes it was generated from, the calibration status and that results are a simulation, not a forecast. Numbers computed on inputs that differ from the files served SHALL be marked out of date. The overview page SHALL carry the table of today's cars an hour on every side-street block, by period, under "Street by street". No generated page or index SHALL name a Streets page, and the retired path `/streets.md` SHALL answer with a permanent redirect to `/index.md`.

#### Scenario: Stale proposals
- **WHEN** the proposals file was computed on a different demand hash
- **THEN** `/proposals.md` says "Out of date" and still lists the proposals

#### Scenario: Missing page
- **WHEN** a generated page has not been published
- **THEN** its path answers 404, not the app page

#### Scenario: Street table
- **WHEN** an agent reads `/index.md`
- **THEN** it finds a "Street by street" section with one row per side-street block and the all-car and through-car counts for each period

#### Scenario: Old Streets page
- **WHEN** an agent requests `/streets.md`
- **THEN** the response is a 301 to `/index.md`
