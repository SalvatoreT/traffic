# Demand data and method (Rockridge)

Regenerate everything: `NODE_USE_ENV_PROXY=1 npx tsx tools/fetch-demand.ts` (add `--force` to re-download; the env var is only needed behind an HTTP proxy), then `npx tsx tools/build-demand.ts`. Settings: `data/demand/rockridge.config.json`. Raw files (gitignored, stored in R2) were retrieved 2026-11-11.

## Raw files (`data/demand/raw/`)

| File | Source URL | License | Filter / command |
| --- | --- | --- | --- |
| `oakland-multimodal/*.csv` (4 files: 2018-09-11, 2018-09-12, 2019-09-10, 2021-09-29 PM peak turning-movement counts, Telegraph Ave & Alcatraz Ave, Quality Counts reports incl. peak-hour vehicle volumes by movement) | https://data.oaklandca.gov/d/amtg-eh64 (zip `OaklandTurningMovementCounts.zip`, 35 MB, via `/api/views/amtg-eh64/files/12a70ef9-737d-4c3e-b7da-dc6b497d4121`) | City of Oakland open data (OakDOT); no explicit licence field in the catalogue | `fetch-demand.ts` extracts the named members listed in `config.fetch.tmcMembers`; the zip holds ~390 counts for 36 intersections, only Telegraph/Alcatraz is in the area (Telegraph/40th, 27th, Broadway, 55th/Market are outside) |
| `caltrans-aadt-bbox.json` | https://caltrans-gis.dot.ca.gov/arcgis/rest/services/CHhighway/Traffic_AADT/FeatureServer/0 (Caltrans Annual Average Daily Traffic) | Caltrans open data | ArcGIS REST `query`, envelope = bbox +/- 0.04 deg, `outFields=*`, `returnGeometry=false`. Context only: SR-24, SR-13 (Claremont Ave/Tunnel Rd, Telegraph/Ashby), SR-123 |
| `lodes8-ca-2024-rockridge.json` | https://lehd.ces.census.gov/data/lodes/LODES8/ca/od/ca_od_main_JT00_2024.csv.gz (98 MB) and https://lehd.ces.census.gov/data/lodes/LODES8/ca/ca_xwalk.csv.gz (9 MB) | US Census Bureau LEHD, public domain | `tools/lib/demand-lodes-extract.ts` (streamed): blocks whose xwalk centroid (`blklatdd`/`blklondd`) is in the bbox (196 blocks, 12 tracts); OD rows with home or work in those blocks (12,941 of 16.4M); per block: resident workers, jobs; flows to/from outside blocks aggregated by 8 compass sectors x 4 distance bands (3/8/20 km) from the bbox centre |

## Sources checked and not usable

- Oakland Socrata catalogue (`data.oaklandca.gov`, queries: traffic count, traffic volume, ADT, speed survey, counts, crash): no ADT, segment volume or speed-survey dataset exists; the only counts are the annual multi-modal turning-movement counts above (36 intersections, mostly outside the area).
- Berkeley open data (`data.cityofberkeley.info`): catalogue search for traffic/count/volume returns only signals and conduits; no traffic counts found.
- Alameda CTC, MTC, Replica public summaries, Oakland speed surveys: not searched in depth / not found; no data used.
- Caltrans AADT on SR-13 Claremont Ave (PM 10.79, AADT 32,500 back / 23,500 ahead, 2023-24 count year) is the nearest state count to the Claremont gate but sits at Ashby/Tunnel Rd, so it is scaled (below).

## Method

1. Gate peak volume. DATA: gates on Telegraph (N and S legs) and Alcatraz (W leg) take PM peak-hour entering/leaving volumes from the Telegraph & Alcatraz counts (mean of 4 counts); the leg is chosen from the gate's compass direction relative to the count intersection and street name. If several gate nodes share a leg the volume is split among them by whether they can emit/absorb traffic. ASSUMPTION: the south Telegraph gate reuses the S-leg volume as proxy.
2. DATA/ASSUMPTION: Claremont gate: Caltrans SR-13 AADT 23,500 x 0.6 (assumed attenuation) = 14,100 ADT.
3. ASSUMPTION: all other gates use per-class default ADT (primary 14,000; secondary 9,000; tertiary 5,000; residential 800; service 150); freeway-class gates carry no demand.
4. ASSUMPTION: peak hour = ADT x K (K = 0.09, urban arterial range 0.08-0.10); directional inbound share 0.45 (PM). Count-based gates use the measured split.
5. ASSUMPTION: AM and midday gate volumes = PM peak-hour volume x 0.85 and 0.62; inbound shares 0.58 (AM), 0.50 (midday), 0.45 (PM). Uncalibrated.
6. DATA + ASSUMPTION: local trips. LODES resident workers and jobs per block map to the nearest in-area node on a residential link. ASSUMPTION rates: 3.2 daily trips per resident worker, 3.5 per job, vehicle mode share 0.62, peak-hour share 0.085/0.06/0.095 (AM/midday/PM), origin share of resident trips 0.7/0.5/0.3, 80% of local trips external. DATA: each block's external trips are split by LODES home/work direction sector, then to gates by angular proximity (Gaussian, sigma 45 deg) x gate in/out target. Remaining 20% are internal, gravity weighted by attraction x exp(-d/1 km) (ASSUMPTION). Local use of any gate is capped at 50% of its target.
7. ASSUMPTION: through trips (gate to gate). Residual gate inflow/outflow after local trips is balanced by Furness/IPF (outflow targets scaled to total inflow). Seed = target outflow x turn factor: straight-through (>=135 deg) 1.0, adjacent (75-135 deg) 0.6, oblique 0.3, U-turn-like (<40 deg) 0.05; x3 for same-street pairs. This gravity/turn-plausibility form is a modelling assumption, not fitted.
8. Flows below 0.5 veh/h are dropped (max 4,000 flows) and totals renormalised.

Results (veh/h, weekday): AM 11,043, midday 7,384, PM 11,226; through share ~83-85%. Through share is a consequence of gate defaults and local-trip caps and is uncalibrated; treat it as an upper-bound prior until compared with observed cut-through. Run the tool for a per-gate target table.
