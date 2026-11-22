# Scenario links

A scenario link says which interventions to place, in which demand period. Opening it in the app puts those interventions on the map; `npm run simulate -- --link "<link>"` runs it headless. A link names places by position, not by network ids, so it survives a rebuild of the network data.

## Form

```
https://<site>/#v1;a=<area>;p=<period>;d=<demand scale>;s=<item>~<item>~<item>
```

Everything after the first `#` is the link. It is a list of tokens separated by `;`.

| Token | Meaning | Required |
| --- | --- | --- |
| `v1` | The format version. It must come first. Other versions are refused. | yes |
| `a=<area>` | The study area id (`areas.json`). A link for another area than the one loaded is refused. | no |
| `p=<period>` | The demand period id: one of the `id` values in the area's demand file (for example `pm_peak`, `am_peak`, `midday`). Without it the app opens the area's default period. | no |
| `d=<scale>` | Demand scale, 0.1 to 3. Left out when it is 1. | no |
| `s=<items>` | The interventions, joined by `~`, at most 200. Left out for the baseline. | no |

`#v1` alone is valid and means the baseline. Tokens other than these are ignored. A link that cannot be decoded (wrong version, wrong area, a bad code, a geohash that is not 10 characters, a parameter out of range) opens nothing and is reported as invalid; the CLI exits with code 2 and says which part is wrong.

## Items

Each item is `<code>,<geohash>[,<parameter>...]`.

- `<code>` is two letters that name the intervention type.
- `<geohash>` is the standard geohash (alphabet `0123456789bcdefghjkmnpqrstuvwxyz`) of a point, exactly 10 characters, which is a cell of about 1 m. The point is where the intervention goes: the middle of a block, or an intersection.
- Parameters follow, separated by commas.

| Code | Intervention | Point | Parameters |
| --- | --- | --- | --- |
| `mf` | Modal filter on a street block | middle of the block | none |
| `mn` | Modal filter at an intersection | the intersection | optional: bearings of the legs it closes, in whole degrees joined by `.`, such as `175.355`. Absent: every leg. |
| `sl` | Speed limit on a block | middle of the block | the limit in meters per second, 1 to 40 (20 mph is 8.94) |
| `ss` | Slow Street: 15 mph on every block of one street | middle of any block of the street | none |
| `sh` | Speed hump | the hump | none |
| `tc` | Traffic circle | the intersection | none |
| `ct` | Intersection control | the intersection | one letter: `s` signal, `a` all-way stop, `t` two-way stop, `u` uncontrolled, `c` traffic circle |
| `st` | Signal cycle | the signal | the cycle in seconds, 20 to 240 |
| `ow` | One-way street | middle of the block | bearing of the direction that stays open, degrees clockwise from north, 0 to 360 |
| `tb` | Turn ban | the intersection | bearing of the arriving link as it reaches the intersection, then bearing of the leaving link as it leaves it |
| `dd` | Diagonal diverter | the intersection | the barrier line's bearing in whole degrees, 0 to 179 |

Bearings are compass degrees, clockwise from north: 0 north, 90 east, 180 south, 270 west. Bearings the app writes are rounded to 5 degrees; any value within 45 degrees of the real direction still matches.

`mn` bearings name the street legs the filter closes. `mn,<geohash>` closes every leg. At a junction that joins several streets, `mn,<geohash>,175.355` closes only the legs that run at about 175 and 355 degrees (one street, both directions) and leaves the others open. That is how "a filter on Colby St at 60th St" is written; the intersection's other street stays open.

## How items are placed

The app and the CLI place each item on the street network by position:

- Block items (`mf`, `sl`, `ss`, `sh`, `ow`) match the nearest street link within 25 m of the point. For `ow` the link must also run within 45 degrees of the bearing, which picks the direction. For `sh` the hump goes where the point projects onto the link.
- Intersection items (`mn`, `tc`, `ct`, `st`, `dd`) match the nearest intersection within 30 m.
- A turn ban (`tb`) looks at the intersections within 30 m for an arriving link whose end bearing is within 45 degrees of the first bearing and a leaving link whose start bearing is within 45 degrees of the second.
- An item that matches nothing is not an error. It is left out and reported as unplaced, with its type, its position, the nearest street name and the reason. The app shows a message; the CLI lists it under `inputs.unplacedInterventions` and, with `--strict`, fails.

A Slow Street (`ss`) is one change that limits a whole street to 15 mph (6.71 m/s). The point only names the street: the item matches the block as above, then takes every block of that street inside the study area that connects to it through shared intersections. A street is its name. Where the street has a gap, or changes name, only the connected run that holds the chosen block counts, and its label says so. A block that is already at 15 mph or slower keeps its limit. The app and the search write the item at the middle of the run's lowest-numbered block, so every link for one Slow Street is the same string. Links written before this item existed, with an `sl` item on each block, still open and run as they did.

Items are order-independent: `a~b` and `b~a` are the same scenario.

## Building a link by hand

1. Find the place and take its item from `npm run simulate -- --find "Colby St & 60th St"`. It prints, for each matching block or intersection, every intervention that can go there with its `item` string, its label as the app words it, and its JSON form.
2. Join the items you want with `~` and put them after `s=`.
3. Add `a=<area>` and `p=<period>`.

For example, with items `mn,9q9p3cz9dy,175.355` and `ct,9q9p3cz9dy,a`:

```
#v1;a=rockridge;p=pm_peak;s=mn,9q9p3cz9dy,175.355~ct,9q9p3cz9dy,a
```

Without the CLI, compute the geohash of the latitude and longitude of the place with any standard geohash encoder at length 10, and use the type table above. The `lon` and `lat` of every intersection are in the `--find` output; a block's point is its midpoint.

## The JSON form

`npm run simulate -- --interventions file.json` takes the same interventions as a JSON list with network ids, valid for one network file only:

```json
[
  {"type": "modal_filter", "link": 2593},
  {"type": "modal_filter", "node": 799, "legs": [2593, 2594, 2595, 2596]},
  {"type": "speed_limit", "link": 2619, "speed": 8.94},
  {"type": "slow_street", "link": 2619},
  {"type": "speed_hump", "link": 2619, "position": 40},
  {"type": "traffic_circle", "node": 799},
  {"type": "control", "node": 799, "control": "all_way_stop"},
  {"type": "signal_timing", "node": 25, "cycle": 90},
  {"type": "one_way", "link": 2619},
  {"type": "turn_ban", "fromLink": 2593, "toLink": 1863},
  {"type": "diagonal_diverter", "node": 799, "bearing": 42}
]
```

The ids in this example are placeholders. Take the real ones from `--find`.

## Tabs and sections

The app's pages have their own paths: `/` (Map), `/proposals`, `/methodology`, `/assumptions` and `/sources`. A scenario fragment goes after the path (for example `/proposals#v1;...`), and any other fragment on a tab is the id of a section on that page. Each tab also has a text version at `/<tab>.md` (`/index.md` for the Map), which names its sections. The old `/streets` path opens the Map. On the Proposals tab each card is a section named `proposal-1`, `proposal-2` and so on for the options in order, and `proposal-<id>` for an earlier or comparison proposal (for example `proposal-earlier-62nd-diverters`). An address that uses an older card id, such as `#unconstrained-p1`, opens the same card and is rewritten to the new form.

## Share paths

A published proposal also has a share path, `https://<site>/p/<slug>`, for example `/p/unconstrained-7dvnr3q3`. Chat apps read a link's preview from the page the server returns and never see the part after `#`, so a scenario link always previews as the site's home page, and a share path previews as that proposal: its title, its through-car figures and a map. Opening a share path in a browser opens the Map with the proposal's scenario and period, exactly as its scenario link does, and the address bar then shows the scenario link. A slug that is not published any more opens the Proposals tab with a notice. Slugs are listed in `proposals.md` and `llms.txt` next to each package, and are stable: a slug is the group id and a hash of the package's items, period and group, not its position in the list. Scenario links keep working.
