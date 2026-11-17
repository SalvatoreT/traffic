# agent-access Specification

## Purpose
TBD - created by archiving change llm-friendly. Update Purpose after archive.

## Requirements

### Requirement: Text pages for language models
The site SHALL publish `/llms.txt`, `/llms-full.txt` and a text version of each tab as static files generated from the data files and the docs, each stating the date and input hashes it was generated from, the calibration status and that results are a simulation, not a forecast. Numbers computed on inputs that differ from the files served SHALL be marked out of date.

#### Scenario: Stale proposals
- **WHEN** the proposals file was computed on a different demand hash
- **THEN** `/proposals.md` says "Out of date" and still lists the proposals

#### Scenario: Missing page
- **WHEN** a generated page has not been published
- **THEN** its path answers 404, not the app page

### Requirement: No server-side run
The site SHALL NOT offer an endpoint that runs a scenario, and `/llms.txt` SHALL say so.

#### Scenario: Reading llms.txt
- **WHEN** an agent reads `/llms.txt`
- **THEN** it is told to run the model locally

### Requirement: Headless scenario runs
`npm run simulate` SHALL run one scenario from a link or an interventions file on the same WASM build as the app, at the app's seed, run length and demand by default, and print JSON with the inputs, baseline and scenario figures for the side streets inside the study area, whether either run is oversaturated, unplaced interventions and per-block changes. It SHALL NOT print whole-network figures such as trip times, delay, completed or unroutable trips, walking and biking indicators or network counts. It SHALL exit non-zero with a message for an undecodable link or missing data.

#### Scenario: Same as the app
- **WHEN** a published proposal's link is run at seed 1
- **THEN** the through cars an hour equal the app's after a full hour

### Requirement: Finding places
`--find` SHALL list the blocks and intersections that match street names with the link item for every intervention that can be placed there.

#### Scenario: Two streets
- **WHEN** the query names two streets that meet
- **THEN** the intersection is listed first with its filter, circle, control, diverter and turn-ban items

### Requirement: Human page unchanged
The app's page SHALL change for people only by a "For AI agents" footer link.

#### Scenario: Screenshot
- **WHEN** the home page is compared with and without that link
- **THEN** only the footer differs

### Requirement: Share links in text pages
The generated proposals page SHALL give each package's share link beside its scenario link.

#### Scenario: Proposals page
- **WHEN** `proposals.md` is generated
- **THEN** every package lists `Share link: <site>/p/<slug>` and its scenario link

### Requirement: Check modes only print
`explore --check-singles` and `--check-subsets` SHALL enter check mode without `--check`. `--check-singles` SHALL score every candidate alone over the given periods, seeds and screening length, print one row each (type, label, link, through cars before and after, largest all-car rise and its block, score) and say which periods, seeds and run length it ran. Any check flag SHALL refuse `--out` and `--report` and SHALL NOT write the proposals or report files.

#### Scenario: Singles alone
- **WHEN** `explore --check-singles` runs with no `--check`
- **THEN** it prints the singles table and exits without a search and without writing a file

#### Scenario: Output paths refused
- **WHEN** a check flag is given with `--out`
- **THEN** it exits with a usage error and writes nothing

### Requirement: Search options for objectives
`explore` SHALL accept `--objectives` (`all` or a list of `most-removed`, `no-closures`, `least-detour`, `fewest-changes`), and SHALL write each option's objectives and residents' detour into the proposals file and the report. It SHALL NOT accept a detour weight.

#### Scenario: One objective
- **WHEN** `explore` runs with `--objectives most-removed`
- **THEN** only the main beam runs and options carry only that tag when they win it
