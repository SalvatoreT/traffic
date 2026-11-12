# Data needs for an optimal plan

An optimal package is one that cuts cut-through traffic without raising volumes or speeds on the next street over. To find it, the model needs credible volumes on the streets the package changes and on the streets it could push traffic onto, the share of trips that are through trips, and how signals and ramps behave at the edges. Today the model has counts at a few arterial intersections and freeway ramps, and no count on Hillegass Ave, Colby St, College Ave or the east end of Alcatraz Ave, so most interior volumes are assumptions. This guide ranks what to collect, where to get it, and what each item would replace in the model.

Links below were opened on 2026-11-12 unless the status says otherwise. Several sites (oaklandca.gov, streetlightdata.com, transportation.gov) refused automated requests from the machine used for this research, so those claims come from search-result summaries and are marked "not confirmed". Prices and turnaround times appear only where a source states them.

## What would help most, in order

The count-coverage idea (audit R4 in `docs/simulator-audit.md`) says the next count is worth most where the model is least sure and no count constrains it. The PM station list in `data/demand/rockridge.fit.md` has 50 stations: freeway ramps, gates on Ashby Ave, Telegraph Ave and 43rd St, three Caltrans stations (Tunnel Rd, San Pablo Ave, and SR-13 Claremont Ave at Ashby, scaled by an assumed 0.6), and turning-movement legs at Telegraph/Alcatraz and Market/55th. Nothing sits on the interior streets. The audit also shows the north-side gates (Hillegass, Benvenue, College, Claremont Blvd) running on class defaults of 800 or 5,000 vehicles per day.

### 1. Volunteer counts on the interior blocks and the entry points

Fixes: the assumed volumes on Hillegass Ave and Colby St (residential default 800 ADT at the north gates; PM mid-block flows in the latest run are 45 northbound and 106 southbound on Hillegass Ave against 287 and 376 on College Ave) and the unconstrained College Ave and Alcatraz Ave east of Telegraph. A resident reports the Hillegass and Colby volumes are too low; a count settles that. The StreetLight shares (47% of Hillegass northbound from the freeway, and so on) are shares only, so the model has had nothing to say how many vehicles they are.
Where: volunteers, protocol in the next section. No agency involved.
How to ask: a sign-up sheet in the working group; no permit needed for sidewalk counting.
Need: weekday 4 to 6 PM and 7 to 9 AM, 15-minute bins, both directions, cars and trucks separate from bicycles and pedestrians, two PM days and one AM day. Minimum useful: one PM peak hour of two different weekdays at the four interior sites.
Use: new station rows in the count fit (`tools/lib/demand-fit.ts`, station list, step 13 in `data/demand/README.md`), replacing class-default gate volumes at Hillegass, Colby, College and Claremont, and holding some sites out of the fit as validation (audit C2).

### 2. Agency tube counts with speed and vehicle class

Fixes: the same interior volumes, over 24 hours for 7 days, plus the speed and truck share the model assumes (25 mph limits, no class split). It gives hour-of-day factors in place of the assumed AM 0.85 and midday 0.62 of the PM peak (`data/demand/README.md`, step 5).
Where: City of Berkeley Traffic Engineering will collect traffic data after a neighbor-signed request for a traffic calming study; the page says forms are due December 31 for the next cycle and are mailed to the Transportation Division at 1947 Center Street ([request page](https://www.berkeleyca.gov/city-services/livable-neighborhoods/request-traffic-calming), confirmed). It is for residential streets in Berkeley, so it fits the Berkeley blocks north of Alcatraz Ave. For Oakland, a search result describes OakDOT's Traffic Safety Request Program (Safe Streets Division, also reachable by 311) and past OakDOT reports that used pneumatic tube counts; the page itself blocked automated access (not confirmed).
How to ask: the Berkeley form by mail; for Oakland, 311 or the department's general contact, then a public records request for any counts already taken (item 3).
Need: tube data as hourly or 15-minute bins per direction with speed bins, one week, a non-holiday school week. Ask for the raw bins, not a summary page.
Use: a new count file read by the demand step as extra stations (same format as item 1), and a speed table for checking the free-flow speeds in `data/areas/rockridge.json`.

### 3. Signal timing plans at the edge signals and ramp terminals

Fixes: signal timing is derived by formula (Webster-style splits, cycle 75 to 120 s, re-estimated every 5 minutes from measured flows; `CYCLE_MIN`, `ADAPT_INTERVAL_S` in `crates/sim/src/params.rs`, record steps C5 and L). The PM-peak queue at the SR-24 west end and the Claremont and Telegraph ramp terminals depends on actual green splits and any coordination. Audit C7 lists this as unvalidated.
Where: City of Oakland (Telegraph/Alcatraz, Telegraph/52nd, Claremont/College, Claremont/Colby-Forest), City of Berkeley (Alcatraz and Telegraph east of the line, Ashby Ave), and Caltrans for the ramp terminals. Neither city publishes timing in open data: the Oakland portal's signal layer holds street names only and Berkeley's holds signal locations and conduit (both confirmed by catalog search). Which agency operates each ramp terminal: not confirmed.
How to ask: a California Public Records Act request. Oakland uses the NextRequest portal (`oaklandca.nextrequest.com`, reached but empty to my fetch; portal use is stated in search results, not confirmed). Berkeley takes requests through NextRequest or the City Clerk at records@berkeleyca.gov or (510) 981-6900, and says staff first decide within ten days whether disclosable records exist ([Berkeley page](https://berkeleyca.gov/your-government/public-records/requesting-public-information), confirmed). Caltrans District 4 takes requests through its Public Records Coordinator and asks for documents by name or specific description ([District 4 page](https://dot.ca.gov/caltrans-near-me/district-4/d4-popular-links/district-4-records-request), confirmed).
Need: the current timing sheet per intersection: cycle length, phase order, splits by time-of-day plan, offsets, pedestrian clearance, and whether detection is actuated or fixed. Name the intersections by cross streets in the request.
Use: nothing reads this yet. It needs a small input file per signal (proposed `data/areas/<area>.signals.json`) that the importer or simulator would use in place of the formula plan. This is new work.

### 4. Caltrans peak-hour factors, current ramp counts and freeway detector data

Fixes: the assumed peak-hour factor K = 0.09 and inbound share 0.45 (steps 4 and 5), ramp counts that mix 2012 to 2021 vintages with no peak direction, and the default 500 ADT on 14 unmatched ramps.
Where: Caltrans Traffic Census, which lists AADT, Ramp Volumes by district (2016 to 2024, District 4 included), and Peak Hour Volume Data for state highway sites, 2021 to 2024, as the AM and PM peak expressed as a share of AADT ([Traffic Census](https://dot.ca.gov/programs/traffic-operations/census), confirmed). PeMS holds detector data for freeways, "over ten years" of history and a stated one to two business days to approve an account ([PeMS](https://pems.dot.ca.gov/), confirmed). Which SR-24 mainline and ramp detectors are instrumented near this area: not confirmed, because the maps need a login.
How to ask: Census files are open downloads (XLSX). PeMS: apply for an account on the site. Ask District 4 (item 3) whether the 14 unmatched ramps have counts and whether any hourly ramp counts exist.
Need: the 2024 District 4 ramp workbook (already fetched per `data/demand/README.md`; check which rows are still 2012 vintage), Peak Hour Volume XLSX for 2024, and PeMS hourly flow by direction for SR-24 and the SR-24 ramps, Tuesday to Thursday, for one fall and one spring month.
Use: `tools/fetch-demand.ts` and `tools/lib/demand-ramp-extract.ts` for ramps; K and the inbound shares in `data/demand/rockridge.config.json`; PeMS hourly profiles for the AM and midday factors.

### 5. A fuller StreetLight or Replica export, with sample sizes

Fixes: the observed route shares are four headline and eleven ramp percentages with unknown sample size, so the fit can only treat them as soft constraints with weight 0.5 (`data/calibration/README.md`, audit C5). The Colby St southbound freeway share (45% observed) is where the model misses most, and the model cannot tell whether a 10-point gap is real or sampling noise.
Where: StreetLight's own marketing and a regional agency slide deck list select link, origin-destination, AADT and hourly traffic metrics, with day-part splits and trip length, speed and circuity ([StreetLight network O-D page](https://learn.streetlightdata.com/network-origin-destination-whitepaper) and [SCAG slides](https://ftip.scag.ca.gov/sites/default/files/2024-05/mtf102319_introductionandupdatestostreetlight.pdf), opened; the main site refused access). Replica documents network-link volumes, hourly auto volume profiles, O-D pairs, estimated turning movement counts at most signalized intersections (Spring and Fall 2022) and a road closure scenario tool ([Replica docs index](https://documentation.replicahq.com/llms.txt), [turning movements](https://documentation.replicahq.com/docs/turning-movement-counts-tmcs.md), [link volumes](https://documentation.replicahq.com/docs/daily-network-link-volumes.md)). Both are modeled or sampled estimates and should be checked against item 1.
How to ask: both are licensed. Who holds a license here: not confirmed. No Alameda CTC agreement turned up. One published example shows the model: a San Mateo County joint powers agency licensed StreetLight for up to 55 users including member agencies and named consultants; its 2020 draft order lists $275,000 for year one before discounts for a countywide multi-mode subscription ([draft order](https://ccag.ca.gov/wp-content/uploads/2020/04/6.3_A6_Draft-StreetLight-Agreement.pdf)). A search result says Replica offered free Places and Trends access to California public-sector employees through a March 31 deadline of an unstated year (not confirmed). The practical route is a request to a city, county or regional staff member who already has access, asking them to run a named list of zones.
Need: for the Hillegass and Colby select links and the Claremont ramps, weekday, by day part (AM, midday, PM), per direction: trip volumes (not only shares), the sample size or device count, top origin and destination zones in about ten zones around the study area, and trip length. Ask for the same analysis for Benvenue Ave, College Ave and Alcatraz Ave, so displacement can be checked.
Use: `data/calibration/rockridge.targets.json` (add volumes and uncertainty), and the share constraints in `tools/lib/share-targets.ts`. The deliverable itself is not redistributed.

### 6. Walking and biking counts

Fixes: pedestrian and bicycle volumes scale from one intersection (Telegraph/Alcatraz, four PM counts: about 151 on foot, 82 by bike), with a 6% walk and 4% bike mode-share prior that the scaling shows is too high for bicycles by about ten times (`data/demand/README.md`). Nothing checks the pattern away from that intersection.
Where: the Oakland multimodal count file already downloaded also holds other locations ([dataset](https://data.oaklandca.gov/d/amtg-eh64), confirmed: 36 intersections, annual since 2011), including Market/55th, which lies inside the model area and whose pedestrian and bicycle counts, if the reports hold them, are not yet used. Alameda CTC runs a countywide count program; its active transportation page is open but the count data was not found there ([page](https://www.alamedactc.org/planning/active-transportation)); a search result says about 150 sites counted every two years, with 2018, 2020 and 2022 summaries (not confirmed). Strava Metro states access is free for governments and advocacy groups through a partnership application ([Strava Metro](https://metro.strava.com/), confirmed); it shows bicycle exposure from app users, not full counts. Telraam describes a resident-window sensor that counts motor vehicles, cyclists and pedestrians ([Telraam](https://telraam.net/en/what-is-telraam), confirmed); price, accuracy and its no-images claim come from search results (not confirmed).
How to ask: the Oakland file is open; Strava Metro through its application form; Telraam through its website.
Need: pedestrians and bicycles by 15-minute bin at the item 1 sites, and the Oakland PM counts at Market/55th and the other in-area intersections.
Use: `tools/lib/demand-active.ts` (the scaling), and a second scale point or held-out check (audit P1).

### 7. Journey times along the corridors

Fixes: there is no travel-time check (audit C6). D4's 4 m/s arterial floor is a weak substitute, and the PM backing up at the SR-24 west end, 52nd St and Telegraph Ave cannot be judged without observed times.
Where: volunteers can time their own drives with a phone along Telegraph, College, Claremont and Alcatraz, ten runs per period; this is cheap and legal. TomTom's Traffic Stats service offers historical floating-car data with a 30-day free trial (API and portal) and a 60-day batch evaluation, then a paid license whose price the page does not give ([TomTom](https://developer.tomtom.com/traffic-stats/documentation/product-information/introduction), confirmed). MTC's Vital Signs uses INRIX speeds but only for freeways ([Vital Signs](https://vitalsigns.mtc.ca.gov/indicators/time-spent-in-congestion), confirmed). Google Maps and INRIX historical data for streets: no free source found (not confirmed).
How to ask: volunteers, no request. TomTom, through its sign-up.
Need: time and date, start and end cross street, direction, elapsed seconds. 95% interval of the observed mean, per period, with at least ten runs.
Use: a new comparison in the calibrate report (`crates/sim` calibrate binary); no input file exists.

### 8. Commute mode share for the nearby Census tracts

Fixes: the 6% and 4% walking and biking shares are assumptions because the Census API refused calls without a key.
Where: American Community Survey table B08301 through the Census API; free key by a form ([key signup](https://api.census.gov/data/key_signup.html), confirmed).
How to ask: the signup form, then a key is emailed. Turnaround is not stated on the page.
Need: B08301 for the 31 LODES tracts already used, latest 5-year estimate, with margins of error.
Use: `active` settings in `data/demand/rockridge.config.json` (mode shares) and `tools/lib/demand-active.ts`. It covers commute trips only.

### 9. A field check of the network: stop signs, humps, one-ways, turn bans, speed limits

Fixes: the route choice relies on OpenStreetMap controls and turn bans. The extract holds 1,711 stop nodes, 415 signal nodes, 573 hump nodes and 199 turn-restriction relations across the model area, and 2,373 of 8,281 road ways carry a `maxspeed` tag. Missing or wrong tags change which streets look attractive and are carried into every run.
Where: walk or bike each block with a tally sheet and compare it with the map. Tag definitions are on the OpenStreetMap wiki: [stops](https://wiki.openstreetmap.org/wiki/Tag:highway%3Dstop), [traffic calming](https://wiki.openstreetmap.org/wiki/Key:traffic_calming), [turn restrictions](https://wiki.openstreetmap.org/wiki/Relation:restriction), [maxspeed](https://wiki.openstreetmap.org/wiki/Key:maxspeed) (all confirmed). Oakland's open data has a Slow Streets layer last updated July 8, 2020 ([catalog](https://data.oaklandca.gov/api/catalog/v1?domains=data.oaklandca.gov&q=slow%20streets)).
How to ask: free OpenStreetMap accounts; edits are public and credited to the editor's handle, so nothing private enters the repository. Send the group a list of differences for review before editing.
Need: per block, sign or marking seen, and a photo of signs only (no people, no plates).
Use: fixes go into OpenStreetMap, then `npx tsx tools/fetch-osm.ts --force` and `npm run data`.

### 10. Crash data for the safety indicators

Fixes: safety is reported as surrogate indicators (speeds, time-to-collision) that have not been compared with any crash record here.
Where: UC Berkeley's Transportation Injury Mapping System; its home page lists a 2024 final and 2025 to 2026 provisional SWITRS update and says access is free with an account ([TIMS](https://tims.berkeley.edu/), confirmed).
How to ask: create an account on the site.
Need: injury crashes within the model area, five years, with location, mode, and primary collision factor.
Use: a comparison table in docs; not an input to the fit.

### 11. An optional entry and exit survey for the through-traffic share

Fixes: the through share depends on assumed trip tables, and the select-link shares are the only observation. Matching vehicles between two sites on the same street is the standard way to measure it, but it needs identifying information, which this project does not collect. Volunteers should not do it. If the group wants it, ask a traffic engineering firm or the agency to run it under its own privacy rules. How such surveys are done: not confirmed against a source.
Use: would add through-share targets next to the select-link shares.

## A count that volunteers can do this month

Pick two Tuesdays, Wednesdays or Thursdays in a school week without rain or a holiday. Count 4:00 to 6:00 PM on both days; add 7:00 to 9:00 AM on one of them. Light fades before 5 PM in December, so choose spots near a streetlight. One person per site per direction is enough on a residential block; two people per direction on Claremont, College and Telegraph.

Sites, in the order to fill them:

| Site | Location | Why |
| --- | --- | --- |
| H1 | Hillegass Ave, mid-block, Alcatraz end | No count; north gate runs on an assumed 800 ADT |
| H2 | Hillegass Ave, mid-block, Claremont end | Tests drop-off between ends (StreetLight notes little) |
| C1 | Colby St, mid-block, Alcatraz end | Same as H1 |
| C2 | Colby St, mid-block, Claremont end | Same as H2; Colby SB freeway share is the worst misfit |
| A1 | Alcatraz Ave, between Telegraph Ave and Colby St | One count at Telegraph/Alcatraz only |
| A2 | Alcatraz Ave, between Hillegass Ave and College Ave | East end has no count |
| L1 | College Ave, mid-block between Alcatraz and Claremont | North gate on assumed 5,000 ADT |
| L2 | Claremont Ave, between Colby/Forest and College Ave | Only a scaled station 3 km away |
| T1 | Telegraph Ave, south of Claremont/52nd | Gate volume borrowed from 40th St legs |

Pick the nearest block with a safe sidewalk spot if a site is awkward. Sites H1 to C2 matter most; fill them before the rest. Turning movements at Hillegass/Alcatraz and Colby/Alcatraz are a second stage that needs four counters per intersection.

Tally sheet, one per site and 15-minute bin (the sheet can be a column per bin on paper):

| Bin start | Dir 1 cars | Dir 1 trucks/buses | Dir 2 cars | Dir 2 trucks/buses | Bikes (both) | Pedestrians (both) |
| --- | --- | --- | --- | --- | --- | --- |
| 16:00 | | | | | | |
| 16:15 | | | | | | |

Rules: count a vehicle when its front crosses an imaginary line across the street. Use tally marks, then add them. Count the bin on the clock, not on a phone recording. Note rain, a blocked street or a school event.

Safety and privacy: stay on the sidewalk, wear a bright vest, and keep out of driveways. Work in pairs after dark. Do not record plates, faces or video of people, and do not photograph vehicles. Record counts only. A volunteer code replaces any name on the sheet and in files.

Sending results: one CSV per site and day, to a location the group names, with these columns.

| Column | Meaning |
| --- | --- |
| site_id | H1, H2, C1, and so on, from the table above |
| count_date | YYYY-MM-DD |
| bin_start | HH:MM, 24-hour local time |
| bin_minutes | 15 |
| direction | NB, SB, EB or WB |
| mode | car, truck_bus, bicycle or pedestrian |
| count | whole number |
| weather | dry, wet or other |
| volunteer_code | two-character code, not a name |
| notes | free text, optional |

Add one row per site giving latitude, longitude and the street name, in a second file. A tool in `tools/` could read both into the count-station list. No code has been written for this.

## Data the agencies already hold

| Agency | Dataset | Why it matters here | How to request | Link | Status |
| --- | --- | --- | --- | --- | --- |
| Oakland (OakDOT) | Annual multi-modal turning-movement counts, 36 intersections | Telegraph/Alcatraz and Market/55th are the only street counts in the model; pedestrian and bicycle counts | Open download | [data.oaklandca.gov/d/amtg-eh64](https://data.oaklandca.gov/d/amtg-eh64) | Confirmed |
| Oakland | Traffic Signals layer; Slow Streets layer (July 2020) | Signal locations by street name; no timing | Open download | [catalog search](https://data.oaklandca.gov/api/catalog/v1?domains=data.oaklandca.gov&q=signal) | Confirmed; no count, speed or timing data in the catalog |
| Oakland | Traffic safety requests, speed and volume studies, signal timing | Interior counts, timing sheets | 311 or records request through NextRequest | oaklandca.gov/topics/traffic-safety-requests | Not confirmed (site refused access; search summary only) |
| Berkeley | Traffic calming study with agency traffic data | Counts and speeds on Berkeley blocks next to Alcatraz Ave | Mailed neighbor-signed form, due December 31 | [request page](https://www.berkeleyca.gov/city-services/livable-neighborhoods/request-traffic-calming) | Confirmed |
| Berkeley | Public records, signal timing, existing counts | Timing at Ashby, Alcatraz, Telegraph | NextRequest or City Clerk, records@berkeleyca.gov, (510) 981-6900 | [page](https://berkeleyca.gov/your-government/public-records/requesting-public-information) | Confirmed |
| Berkeley | Open data portal | Only signals, conduit and a street layer; no counts | Open download | [data.cityofberkeley.info](https://data.cityofberkeley.info) | Confirmed |
| Caltrans | Traffic Census: AADT, ramp volumes, peak-hour data | Gate volumes, ramp ADT, replace K | Open XLSX downloads, 2024 listed as latest | [census page](https://dot.ca.gov/programs/traffic-operations/census) | Confirmed |
| Caltrans | PeMS freeway detectors | SR-24 mainline and ramp hourly flow | Account application, one to two business days | [pems.dot.ca.gov](https://pems.dot.ca.gov/) | Confirmed; SR-24 coverage not confirmed |
| Caltrans District 4 | Records: ramp terminal signal timing, ramp counts | Ramp queues in the PM peak | Public Records Coordinator, specific document description | [D4 page](https://dot.ca.gov/caltrans-near-me/district-4/d4-popular-links/district-4-records-request) | Confirmed; statewide portal page not available when opened |
| Alameda CTC | Bike and pedestrian count program | Held-out walking and biking checks | Unknown | [active transportation](https://www.alamedactc.org/planning/active-transportation) | Not confirmed (count data not found on the page) |
| MTC | Vital Signs congestion indicators | Freeway delay only | Data Downloads on the indicator page | [Vital Signs](https://vitalsigns.mtc.ca.gov/indicators/time-spent-in-congestion) | Confirmed; no street data. Travel model outputs: not confirmed |
| UC Berkeley SafeTREC | TIMS (SWITRS crashes) | Safety check | Free account | [tims.berkeley.edu](https://tims.berkeley.edu/) | Confirmed |
| US Census | ACS B08301 mode share; LODES | Mode shares; commute flows (LODES already used) | Free API key | [key signup](https://api.census.gov/data/key_signup.html) | Confirmed |
| BART | Monthly ridership reports with an XLS of actual ridership | College Ave station access | Open download | [ridership](https://www.bart.gov/about/reports/ridership) | Opened; station-level exits not confirmed |
| Waze (city partner program) | Incident and closure feeds | Not useful for this model's volumes | Agency partner program | [Waze for Cities](https://www.waze.com/partners/wazeforcities) | Program page confirmed; a local partnership not confirmed |
| Schools near the area | Drop-off and pickup counts | Possible local peaks | Unknown | none | Not confirmed; no public source found |

## Paid or licensed sources

StreetLight adds sampled trip volumes, origin-destination zones, hourly profiles and trip lengths for any chosen link. That would turn the resident-provided percentages into a table with sample sizes, and it would run the same analysis on the streets a scheme might push traffic onto. Replica adds modeled volumes for every link, hourly profiles, turning movement estimates and a road closure scenario. Its outputs are model estimates that can be compared with our own results, so use them only after item 1 shows they match local counts. TomTom Traffic Stats adds historical speeds for travel-time checks. Public agencies and regional commissions typically hold these licenses and pass access to member agencies and named consultants. Which Oakland, Berkeley or county agency holds one: not confirmed.

## What we already have and its limits

| Have | Source | Limit |
| --- | --- | --- |
| Turning-movement counts, PM peak, four dates each at four intersections | Oakland open data | Two in the area; Telegraph/Alcatraz and Market/55th only |
| Caltrans AADT at five state stations; ramp ADT for 22 of 36 ramps | Caltrans Traffic Census | 14 ramps on a 500 ADT default; ramp counts mix years from 2012 and have no peak direction |
| Commute flows between blocks | Census LODES 2024 | Commute trips only; local trip rates and mode shares are assumptions |
| Route shares on Hillegass Ave and Colby St, and at the Claremont ramps | Resident-provided StreetLight slide summary (January to July 2025) | Percentages only, device sample, no sample sizes; the Colby SB freeway share misses |
| Pedestrian and bicycle volumes at one intersection | Oakland counts | One scaling point; bicycle prior ten times the count |
| Network, stop signs, turn bans, humps | OpenStreetMap | Tagging errors carry through; speed limits tagged on 29% of road ways in the extract |
| Signal plans | Derived by formula | No agency timing sheets |
| Hour-of-day profile | Assumed factors on the PM peak | No AM or midday counts in the area |

## What data cannot settle

Counts describe traffic as it is. They cannot say how many people would change mode, route, departure time or destination after a scheme, and the app keeps the same trips before and after, so real schemes that remove traffic are understated. Behavior under schemes that do not exist yet has no measurement to fit, only comparisons with other places. To learn it, collect before-and-after counts on the same sites as items 1 and 2, with the same hours and days, for at least two weeks before a trial and at several points after it, including the neighboring streets, plus speeds, a bicycle and pedestrian count, and crash and complaint records from the same period.
