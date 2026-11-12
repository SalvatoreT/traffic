//! Headless calibration run: loads a study area, runs the baseline, and reports modeled versus observed
//! select-link shares plus network health. See data/calibration/README.md.
//!
//! cargo run --release -p traffic-sim --bin calibrate -- --area rockridge --period pm_peak --minutes 60 --scale 1.0 --seed 1

use serde_json::{json, Value};
use std::cmp::Ordering;
use std::collections::{BinaryHeap, HashMap};
use std::fmt::Write as _;
use std::path::{Path, PathBuf};
use traffic_sim::model::{Config, Control, Demand, FlowMode, Network, RoadClass};
use traffic_sim::sim::{SelectLinkRecord, Simulation, StreetVisit};

struct Args {
    area: String,
    period: String,
    minutes: f64,
    scale: f64,
    seed: u64,
    warmup_min: f64,
    local_factor: Option<f64>,
    /// `--reroute-share <x>`: share of drivers re-routing per epoch, 0 to 1 (default 0.8).
    reroute_share: Option<f64>,
    adapt_min: Option<f64>,
    motorway_removal: bool,
    no_rtor: bool,
    out: Option<PathBuf>,
    write: bool,
    link_flows: bool,
    /// `--cars-only`: drop bicycle and pedestrian flows for an A/B comparison.
    cars_only: bool,
    /// `--drop bicycle,pedestrian`: drop the listed modes' flows.
    drop: Vec<String>,
    /// `--demand PATH` / `--network PATH`: read these files instead of `public/data/<area>.{demand,network}.json` (for A/B runs of variant demand).
    demand_path: Option<PathBuf>,
    network_path: Option<PathBuf>,
}

fn parse_args() -> Args {
    let mut a = Args { area: "rockridge".into(), period: "pm_peak".into(), minutes: 60.0, scale: 1.0, seed: 1, warmup_min: 10.0, local_factor: None, reroute_share: None, adapt_min: None, motorway_removal: false, no_rtor: false, out: None, write: true, link_flows: false, cars_only: false, drop: Vec::new(), demand_path: None, network_path: None };
    let argv: Vec<String> = std::env::args().skip(1).collect();
    let mut i = 0;
    while i < argv.len() {
        let k = argv[i].as_str();
        let mut val = || {
            i += 1;
            argv.get(i).cloned().unwrap_or_else(|| usage(&format!("{k} needs a value")))
        };
        match k {
            "--area" => a.area = val(),
            "--period" => a.period = val(),
            "--minutes" => a.minutes = val().parse().unwrap_or_else(|_| usage("bad --minutes")),
            "--scale" => a.scale = val().parse().unwrap_or_else(|_| usage("bad --scale")),
            "--seed" => a.seed = val().parse().unwrap_or_else(|_| usage("bad --seed")),
            "--warmup" => a.warmup_min = val().parse().unwrap_or_else(|_| usage("bad --warmup")),
            "--reroute-share" => a.reroute_share = Some(val().parse().unwrap_or_else(|_| usage("bad --reroute-share"))),
            "--local-factor" => a.local_factor = Some(val().parse().unwrap_or_else(|_| usage("bad --local-factor"))),
            "--adapt-min" => a.adapt_min = Some(val().parse().unwrap_or_else(|_| usage("bad --adapt-min"))),
            "--motorway-removal" => a.motorway_removal = true,
            "--no-rtor" => a.no_rtor = true,
            "--out" => a.out = Some(PathBuf::from(val())),
            "--no-write" => a.write = false,
            "--link-flows" => a.link_flows = true,
            "--cars-only" => a.cars_only = true,
            "--demand" => a.demand_path = Some(PathBuf::from(val())),
            "--network" => a.network_path = Some(PathBuf::from(val())),
            "--drop" => a.drop = val().split(',').map(String::from).collect(),
            "-h" | "--help" => usage(""),
            _ => usage(&format!("unknown argument {k}")),
        }
        i += 1;
    }
    a
}

fn usage(msg: &str) -> ! {
    if !msg.is_empty() {
        eprintln!("error: {msg}");
    }
    eprintln!("usage: calibrate [--area rockridge] [--period pm_peak] [--minutes 60] [--scale 1.0] [--seed 1] [--warmup 10] [--adapt-min 5] [--motorway-removal] [--no-rtor] [--out DIR] [--no-write] [--link-flows] [--cars-only]");
    std::process::exit(if msg.is_empty() { 0 } else { 2 });
}

fn root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../..")
}

fn bearing(net: &Network, l: usize) -> f64 {
    let g = &net.links[l].geometry;
    let (a, b) = (g.first().copied().unwrap_or([0.0, 0.0]), g.last().copied().unwrap_or([0.0, 1.0]));
    (b[0] - a[0]).atan2(b[1] - a[1]).to_degrees().rem_euclid(360.0)
}

fn ang_diff(a: f64, b: f64) -> f64 {
    let d = (a - b).abs() % 360.0;
    if d > 180.0 {
        360.0 - d
    } else {
        d
    }
}

fn dir_char(brg: f64) -> char {
    ['N', 'E', 'S', 'W'][(((brg + 45.0) / 90.0) as usize) % 4]
}

fn same(a: &str, b: &str) -> bool {
    a.eq_ignore_ascii_case(b)
}

/// Street name without trailing qualifiers such as "north of X".
fn base_street(s: &str) -> String {
    let low = s.to_lowercase();
    for q in [" north of ", " south of ", " east of ", " west of "] {
        if let Some(i) = low.find(q) {
            return s[..i].to_string();
        }
    }
    s.to_string()
}

enum Via {
    Freeway,
    Street(String, Option<char>),
}

/// "Telegraph Avenue north of Alcatraz Avenue" -> ('N', "Alcatraz Avenue"): the side of the cross street the visited part of the street lies on.
fn via_qualifier(s: &str) -> Option<(char, String)> {
    let low = s.to_lowercase();
    for (q, c) in [(" north of ", 'N'), (" south of ", 'S'), (" east of ", 'E'), (" west of ", 'W')] {
        if let Some(i) = low.find(q) {
            return Some((c, s[i + q.len()..].to_string()));
        }
    }
    None
}

/// Links of `street` lying on side `side` of its crossing with `cross` (link midpoint beyond the crossing node along that compass axis).
fn qualified_links(net: &Network, street: &str, side: char, cross: &str) -> Vec<u32> {
    let nn = net.nodes.len();
    let mut at: Vec<Vec<usize>> = vec![Vec::new(); nn];
    for (l, k) in net.links.iter().enumerate() {
        at[k.from as usize].push(l);
        at[k.to as usize].push(l);
    }
    let Some(n) = (0..nn).find(|&n| at[n].iter().any(|&l| same(&net.links[l].name, street)) && at[n].iter().any(|&l| same(&net.links[l].name, cross))) else { return Vec::new() };
    let (px, py) = (net.nodes[n].x, net.nodes[n].y);
    (0..net.links.len())
        .filter(|&l| {
            let k = &net.links[l];
            if !same(&k.name, street) || k.class == RoadClass::Motorway {
                return false;
            }
            let (a, b) = (&net.nodes[k.from as usize], &net.nodes[k.to as usize]);
            let (mx, my) = ((a.x + b.x) / 2.0, (a.y + b.y) / 2.0);
            match side {
                'N' => my > py,
                'S' => my < py,
                'E' => mx > px,
                _ => mx < px,
            }
        })
        .map(|l| l as u32)
        .collect()
}

fn parse_via(s: &str) -> Via {
    if s.eq_ignore_ascii_case("freeway") {
        return Via::Freeway;
    }
    let base = base_street(s);
    for (suf, c) in [(" NB", 'N'), (" SB", 'S'), (" EB", 'E'), (" WB", 'W')] {
        if let Some(st) = base.strip_suffix(suf) {
            return Via::Street(st.to_string(), Some(c));
        }
    }
    Via::Street(base, None)
}

fn visit_matches(v: &StreetVisit, name: &str, dir: Option<char>) -> bool {
    same(&v.name, name) && dir.map_or(true, |d| v.dir == d)
}

/// Links of the named street between two cross streets, in the stated direction of travel.
/// Returns the link ids and a note describing how they were found.
fn resolve_block(net: &Network, street: &str, dir: &str, between: &[String]) -> (Vec<u32>, String) {
    let want = match dir {
        "NB" => 0.0,
        "EB" => 90.0,
        "SB" => 180.0,
        _ => 270.0,
    };
    let street_links: Vec<usize> = (0..net.links.len())
        .filter(|&l| same(&net.links[l].name, street) && net.links[l].class != RoadClass::Motorway && ang_diff(bearing(net, l), want) <= 75.0)
        .collect();
    let nn = net.nodes.len();
    let mut inc: Vec<Vec<usize>> = vec![Vec::new(); nn];
    for (l, k) in net.links.iter().enumerate() {
        inc[k.from as usize].push(l);
        inc[k.to as usize].push(l);
    }
    let cross_nodes = |x: &str| -> Vec<usize> {
        (0..nn)
            .filter(|&n| inc[n].iter().any(|&l| same(&net.links[l].name, x)) && inc[n].iter().any(|&l| same(&net.links[l].name, street)))
            .collect()
    };
    let fallback = |why: &str| -> (Vec<u32>, String) {
        let v: Vec<u32> = street_links.iter().filter(|&&l| net.links[l].in_study_area).map(|&l| l as u32).collect();
        (v, format!("FALLBACK ({why}): all study-area {street} {dir} links"))
    };
    if between.len() != 2 {
        return fallback("no between pair");
    }
    let mut out_adj: HashMap<usize, Vec<usize>> = HashMap::new();
    for &l in &street_links {
        out_adj.entry(net.links[l].from as usize).or_default().push(l);
    }
    for order in [[0usize, 1], [1, 0]] {
        let a = cross_nodes(&between[order[0]]);
        let b = cross_nodes(&between[order[1]]);
        if a.is_empty() || b.is_empty() {
            continue;
        }
        // Dijkstra over the street's own directed links.
        let mut dist: HashMap<usize, f64> = HashMap::new();
        let mut prev: HashMap<usize, usize> = HashMap::new();
        let mut heap = BinaryHeap::new();
        for &s in &a {
            dist.insert(s, 0.0);
            heap.push((std::cmp::Reverse((0.0f64 * 1000.0) as u64), s));
        }
        while let Some((std::cmp::Reverse(d1000), n)) = heap.pop() {
            let d = d1000 as f64 / 1000.0;
            if d > *dist.get(&n).unwrap_or(&f64::INFINITY) + 1e-9 {
                continue;
            }
            for &l in out_adj.get(&n).map(|v| v.as_slice()).unwrap_or(&[]) {
                let m = net.links[l].to as usize;
                let nd = d + net.links[l].length;
                if nd < *dist.get(&m).unwrap_or(&f64::INFINITY) {
                    dist.insert(m, nd);
                    prev.insert(m, l);
                    heap.push((std::cmp::Reverse((nd * 1000.0) as u64), m));
                }
            }
        }
        let best = b.iter().filter(|n| dist.contains_key(n) && !a.contains(n)).min_by(|x, y| dist[x].partial_cmp(&dist[y]).unwrap_or(Ordering::Equal));
        if let Some(&end) = best {
            let mut path = Vec::new();
            let mut n = end;
            while let Some(&l) = prev.get(&n) {
                path.push(l as u32);
                n = net.links[l].from as usize;
                if a.contains(&n) {
                    break;
                }
            }
            path.reverse();
            return (path, format!("path {} -> {} ({:.0} m)", between[order[0]], between[order[1]], dist[&end]));
        }
    }
    fallback("no path between the cross streets")
}

struct ShareRow {
    target: String,
    side: &'static str,
    via: String,
    observed: f64,
    observed_pm: Option<f64>,
    modeled: f64,
    n: usize,
    headline: bool,
}

fn pct(x: f64) -> String {
    format!("{:.0}%", 100.0 * x)
}

fn street_label(net: &Network, n: usize, inc: &[Vec<usize>]) -> String {
    let mut names: Vec<String> = Vec::new();
    for &l in &inc[n] {
        let nm = &net.links[l].name;
        if !nm.is_empty() && !names.contains(nm) {
            names.push(nm.clone());
        }
    }
    names.sort();
    if names.is_empty() {
        "(unnamed)".into()
    } else {
        names.into_iter().take(3).collect::<Vec<_>>().join(" / ")
    }
}

fn ctrl_str(c: Control) -> &'static str {
    match c {
        Control::Signal => "signal",
        Control::AllWayStop => "all_way_stop",
        Control::TwoWayStop => "two_way_stop",
        Control::Uncontrolled => "uncontrolled",
        Control::TrafficCircle => "traffic_circle",
    }
}

fn main() {
    let args = parse_args();
    let root = root();
    let read = |p: PathBuf| std::fs::read_to_string(&p).unwrap_or_else(|e| usage(&format!("cannot read {}: {e}", p.display())));
    let net_json = read(args.network_path.clone().unwrap_or_else(|| root.join(format!("public/data/{}.network.json", args.area))));
    let dem_json = read(args.demand_path.clone().unwrap_or_else(|| root.join(format!("public/data/{}.demand.json", args.area))));
    let targets: Value = serde_json::from_str(&read(root.join(format!("data/calibration/{}.targets.json", args.area)))).expect("targets json");
    let net: Network = serde_json::from_str(&net_json).expect("network");
    let mut demand: Demand = serde_json::from_str(&dem_json).expect("demand");
    if args.cars_only {
        for p in demand.periods.iter_mut() {
            p.flows.retain(|f| f.mode == FlowMode::Car);
        }
    }
    for p in demand.periods.iter_mut() {
        p.flows.retain(|f| !args.drop.iter().any(|d| (d == "bicycle" && f.mode == FlowMode::Bicycle) || (d == "pedestrian" && f.mode == FlowMode::Pedestrian)));
    }
    let nn = net.nodes.len();
    let mut inc: Vec<Vec<usize>> = vec![Vec::new(); nn];
    for (l, k) in net.links.iter().enumerate() {
        inc[k.from as usize].push(l);
        inc[k.to as usize].push(l);
    }

    // ---- resolve targets
    struct Target {
        label: String,
        links: Vec<u32>,
        note: String,
        from: Vec<(String, f64, Option<f64>)>,
        to: Vec<(String, f64, Option<f64>)>,
    }
    let shares = |v: &Value| -> Vec<(String, f64, Option<f64>)> {
        v.as_array()
            .map(|a| a.iter().map(|e| (e["via"].as_str().unwrap_or("").to_string(), e["share"].as_f64().unwrap_or(0.0), e["pmPeakShare"].as_f64())).collect())
            .unwrap_or_default()
    };
    let mut tgts: Vec<Target> = Vec::new();
    for t in targets["selectLink"].as_array().map(|v| v.as_slice()).unwrap_or(&[]) {
        let street = t["street"].as_str().unwrap_or("");
        let dir = t["direction"].as_str().unwrap_or("NB");
        let between: Vec<String> = t["between"].as_array().map(|a| a.iter().filter_map(|x| x.as_str().map(String::from)).collect()).unwrap_or_default();
        let (links, note) = resolve_block(&net, street, dir, &between);
        tgts.push(Target { label: format!("{street} {dir}"), links, note, from: shares(&t["from"]), to: shares(&t["to"]) });
    }

    // ---- freeway ramps: surface nodes touched by motorway-class and surface links
    struct Ramp {
        node: usize,
        on: bool,
        links: Vec<u32>,
    }
    let mut ramps: Vec<Ramp> = Vec::new();
    for n in 0..nn {
        let fw: Vec<usize> = inc[n].iter().copied().filter(|&l| net.links[l].class == RoadClass::Motorway).collect();
        let surf = inc[n].iter().any(|&l| net.links[l].class != RoadClass::Motorway);
        if fw.is_empty() || !surf {
            continue;
        }
        let on: Vec<u32> = fw.iter().filter(|&&l| net.links[l].from as usize == n).map(|&l| l as u32).collect();
        let off: Vec<u32> = fw.iter().filter(|&&l| net.links[l].to as usize == n).map(|&l| l as u32).collect();
        if !on.is_empty() {
            ramps.push(Ramp { node: n, on: true, links: on });
        }
        if !off.is_empty() {
            ramps.push(Ramp { node: n, on: false, links: off });
        }
    }

    let mut sel: Vec<u32> = tgts.iter().flat_map(|t| t.links.iter().copied()).collect();
    sel.extend(ramps.iter().flat_map(|r| r.links.iter().copied()));
    // Qualified ramp via-streets ("Telegraph Avenue north of Alcatraz Avenue"): the street's links on that side are select links too.
    let mut qual: HashMap<String, Vec<u32>> = HashMap::new();
    for key in ["ontoFreewayFromNorth", "fromFreewayGoingNorth"] {
        for e in targets["freewayRamp"][key].as_array().map(|v| v.as_slice()).unwrap_or(&[]) {
            let via = e["via"].as_str().unwrap_or("");
            if let Some((side, cross)) = via_qualifier(via) {
                if let Via::Street(name, _) = parse_via(via) {
                    let ls = qualified_links(&net, &name, side, &cross);
                    sel.extend(ls.iter().copied());
                    qual.insert(via.to_string(), ls);
                }
            }
        }
    }
    sel.sort_unstable();
    sel.dedup();

    // ---- run
    let cfg = Config { seed: args.seed, period: args.period.clone(), demand_scale: args.scale, select_links: sel, local_cost_factor: args.local_factor, reroute_share: args.reroute_share, signal_adapt_min: args.adapt_min, motorway_gridlock_removal: args.motorway_removal, no_right_turn_on_red: args.no_rtor, ..Default::default() };
    let mut sim = Simulation::from_parts(net.clone(), demand.clone(), cfg).expect("sim");
    let total_s = args.minutes * 60.0;
    let warm_s = if total_s >= 1800.0 { args.warmup_min * 60.0 } else { 0.0 };
    let t0 = std::time::Instant::now();
    #[derive(Clone)]
    struct Sample {
        t: f64,
        veh: u64,
        backlog: u64,
        completed: u64,
        removed: u64,
        art_speed: f64,
    }
    let mut series: Vec<Sample> = Vec::new();
    let (mut last_t, mut last_vs) = (0.0, 0.0);
    let mut exits0: Vec<u32> = vec![0; net.links.len()];
    let mut t = 0.0;
    let mut warmed = warm_s == 0.0;
    while t < total_s - 1e-9 {
        let dt = 5.0f64.min(total_s - t);
        sim.step(dt);
        t += dt;
        if !warmed && t >= warm_s - 1e-9 {
            exits0 = sim.diagnostics().link_exits.to_vec();
            warmed = true;
        }
        if (t % 300.0).abs() < 1e-6 || (t - total_s).abs() < 1e-9 {
            let m = sim.metrics();
            let d = sim.diagnostics();
            let art = if d.art_t > last_t { (d.art_vs - last_vs) / (d.art_t - last_t) } else { 0.0 };
            last_t = d.art_t;
            last_vs = d.art_vs;
            if series.last().map_or(true, |s| (s.t - t).abs() > 1e-6) {
                series.push(Sample { t, veh: m.vehicles_in_network, backlog: m.backlog, completed: m.completed_trips, removed: m.gridlock_removed, art_speed: art });
            }
        }
    }
    let wall = t0.elapsed().as_secs_f64();
    sim.check_invariants().expect("invariants");
    let m = sim.metrics();
    let d = sim.diagnostics();
    let recs: Vec<SelectLinkRecord> = sim.select_link_records();

    // ---- select-link shares
    let pm = args.period == "pm_peak";
    let mut rows: Vec<ShareRow> = Vec::new();
    let mut notes: Vec<String> = Vec::new();
    for t in &tgts {
        let set: std::collections::HashSet<u32> = t.links.iter().copied().collect();
        let mine: Vec<(&SelectLinkRecord, usize, usize)> = recs
            .iter()
            .filter_map(|r| {
                let idx: Vec<usize> = r.hits.iter().filter(|h| set.contains(&h.0)).map(|h| h.1).collect();
                Some((r, *idx.iter().min()?, *idx.iter().max()?))
            })
            .collect();
        let n = mine.len();
        notes.push(format!("{}: {} links ({}), {} trips ({} completed)", t.label, t.links.len(), t.note, n, mine.iter().filter(|x| x.0.completed).count()));
        for (side, list) in [("from", &t.from), ("to", &t.to)] {
            for (via, share, pmshare) in list {
                let v = parse_via(via);
                let hit = mine
                    .iter()
                    .filter(|(r, f, l)| match &v {
                        Via::Freeway => {
                            if side == "from" {
                                r.origin_freeway
                            } else {
                                r.dest_freeway
                            }
                        }
                        Via::Street(name, dir) => {
                            let part = if side == "from" { &r.streets[..*f] } else { &r.streets[(*l + 1).min(r.streets.len())..] };
                            part.iter().any(|s| visit_matches(s, name, *dir))
                        }
                    })
                    .count();
                rows.push(ShareRow {
                    target: t.label.clone(),
                    side: if side == "from" { "from" } else { "to" },
                    via: via.clone(),
                    observed: *share,
                    observed_pm: *pmshare,
                    modeled: if n > 0 { hit as f64 / n as f64 } else { f64::NAN },
                    n,
                    headline: matches!(v, Via::Freeway),
                });
            }
        }
    }

    // ---- ramp shares
    let loc = targets["freewayRamp"]["location"].as_str().unwrap_or("").to_lowercase();
    let ramp_sets: Vec<(&Ramp, std::collections::HashSet<u32>)> = ramps
        .iter()
        .filter(|r| inc[r.node].iter().any(|&l| !net.links[l].name.is_empty() && loc.contains(&net.links[l].name.to_lowercase())))
        .map(|r| (r, r.links.iter().copied().collect()))
        .collect();
    // Rows: direction, via, observed, modeled over all trips on the ramps, trips on the ramps, modeled over the trips from (to) the stated side with qualified streets, those trips.
    let side_key = targets["freewayRamp"]["side"].as_str().and_then(|x| x.chars().next()).map(|c| c.to_ascii_uppercase());
    let mut ramp_rows: Vec<(&'static str, String, f64, f64, usize, f64, usize)> = Vec::new();
    for (key, on) in [("ontoFreewayFromNorth", true), ("fromFreewayGoingNorth", false)] {
        let mine: Vec<(&SelectLinkRecord, usize, usize)> = recs
            .iter()
            .filter_map(|r| {
                let idx: Vec<usize> = r.hits.iter().filter(|h| ramp_sets.iter().any(|(rp, s)| rp.on == on && s.contains(&h.0))).map(|h| h.1).collect();
                Some((r, *idx.iter().min()?, *idx.iter().max()?))
            })
            .collect();
        for e in targets["freewayRamp"][key].as_array().map(|v| v.as_slice()).unwrap_or(&[]) {
            let via = e["via"].as_str().unwrap_or("");
            let Via::Street(name, dir) = parse_via(via) else { continue };
            let hit = mine
                .iter()
                .filter(|(r, f, l)| {
                    let part = if on { &r.streets[..(*f + 1).min(r.streets.len())] } else { &r.streets[(*l).min(r.streets.len())..] };
                    part.iter().any(|s| visit_matches(s, &name, dir))
                })
                .count();
            // Refined: only trips whose surface end (origin for the on-ramp, destination for the off-ramp) lies on the stated side of the ramp,
            // and a qualified street ("north of X") counts only on its links on that side, visited before the ramp (after it for the off-ramp).
            let ql = qual.get(via);
            let side_ok = |r: &SelectLinkRecord| -> bool {
                let Some(sd) = side_key else { return true };
                let ramp_node = r.hits.iter().find_map(|h| ramp_sets.iter().find(|(rp, s)| rp.on == on && s.contains(&h.0)).map(|(rp, _)| rp.node));
                let Some(rn) = ramp_node else { return false };
                let end = if on { r.origin } else { r.dest } as usize;
                let (e, q) = (&net.nodes[end], &net.nodes[rn]);
                match sd {
                    'N' => e.y > q.y,
                    'S' => e.y < q.y,
                    'E' => e.x > q.x,
                    _ => e.x < q.x,
                }
            };
            let mine2: Vec<&(&SelectLinkRecord, usize, usize)> = mine.iter().filter(|(r, _, _)| side_ok(r)).collect();
            let hit2 = mine2
                .iter()
                .filter(|(r, f, l)| {
                    if let Some(ls) = ql {
                        let is_ramp = |h: &(u32, usize)| ramp_sets.iter().any(|(rp, st)| rp.on == on && st.contains(&h.0));
                        let first_ramp = r.hits.iter().position(is_ramp);
                        let last_ramp = r.hits.iter().rposition(is_ramp);
                        return if on { r.hits.iter().take(first_ramp.unwrap_or(0)).any(|h| ls.contains(&h.0)) } else { r.hits.iter().skip(last_ramp.map_or(r.hits.len(), |i| i + 1)).any(|h| ls.contains(&h.0)) };
                    }
                    let part = if on { &r.streets[..(*f + 1).min(r.streets.len())] } else { &r.streets[(*l).min(r.streets.len())..] };
                    part.iter().any(|s| visit_matches(s, &name, dir))
                })
                .count();
            ramp_rows.push((if on { "onto freeway" } else { "from freeway" }, via.to_string(), e["share"].as_f64().unwrap_or(0.0), if mine.is_empty() { f64::NAN } else { hit as f64 / mine.len() as f64 }, mine.len(), if mine2.is_empty() { f64::NAN } else { hit2 as f64 / mine2.len() as f64 }, mine2.len()));
        }
    }

    // ---- health
    let spawned = m.spawned.max(1) as f64;
    let backlog_pct = 100.0 * m.backlog as f64 / spawned;
    let tail: Vec<&Sample> = series.iter().filter(|s| s.t > total_s - 900.0).collect();
    let art_tail = if tail.is_empty() { 0.0 } else { tail.iter().map(|s| s.art_speed).sum::<f64>() / tail.len() as f64 };
    let stable = m.gridlock_removed == 0 && backlog_pct < 2.0 && m.arterial_mean_speed > 4.0;
    let elapsed_h = (total_s - warm_s).max(1.0) / 3600.0;

    // ---- top links / nodes
    let mut link_idx: Vec<usize> = (0..net.links.len()).collect();
    link_idx.sort_by(|&a, &b| d.link_delay_s[b].partial_cmp(&d.link_delay_s[a]).unwrap_or(Ordering::Equal));
    let mut node_idx: Vec<usize> = (0..nn).collect();
    node_idx.sort_by(|&a, &b| d.node_wait_s[b].partial_cmp(&d.node_wait_s[a]).unwrap_or(Ordering::Equal));

    // ---- key street flows (mid-block, per direction)
    let keys = ["Telegraph", "College", "Claremont", "Alcatraz", "Hillegass", "Colby", "Benvenue", "Martin"];
    let mut flow_rows: Vec<(String, char, usize, f64, f64)> = Vec::new();
    for k in keys {
        for dch in ['N', 'E', 'S', 'W'] {
            let mut fl: Vec<f64> = (0..net.links.len())
                .filter(|&l| {
                    let lk = &net.links[l];
                    lk.name.to_lowercase().starts_with(&k.to_lowercase()) && lk.in_study_area && lk.length >= 40.0 && lk.class != RoadClass::Motorway && dir_char(bearing(&net, l)) == dch
                })
                .map(|l| (d.link_exits[l] - exits0[l]) as f64 / elapsed_h)
                .collect();
            if fl.is_empty() {
                continue;
            }
            fl.sort_by(|a, b| a.partial_cmp(b).unwrap());
            flow_rows.push((k.to_string(), dch, fl.len(), fl[fl.len() / 2], *fl.last().unwrap()));
        }
    }

    // ---- demand summary
    let period = demand.periods.iter().find(|p| p.id == args.period).or(demand.periods.first());
    let total_demand: f64 = period.map(|p| p.flows.iter().filter(|f| f.mode == FlowMode::Car).map(|f| f.veh_per_hour).sum()).unwrap_or(0.0);
    let mode_demand = |md: FlowMode| -> (usize, f64) {
        period.map_or((0, 0.0), |p| p.flows.iter().filter(|f| f.mode == md).fold((0, 0.0), |a, f| (a.0 + 1, a.1 + f.veh_per_hour)))
    };
    let (bike_flows, bike_vph) = mode_demand(FlowMode::Bicycle);
    let (ped_flows, ped_vph) = mode_demand(FlowMode::Pedestrian);
    let mut by_origin: HashMap<u32, f64> = HashMap::new();
    if let Some(p) = period {
        for f in &p.flows {
            if f.mode == FlowMode::Car {
                *by_origin.entry(f.origin).or_default() += f.veh_per_hour;
            }
        }
    }
    let mut top_origins: Vec<(u32, f64)> = by_origin.into_iter().collect();
    top_origins.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

    // ---- markdown
    let mut md = String::new();
    let _ = writeln!(md, "# Calibration report: {} {} scale {} seed {} ({} min)\n", args.area, args.period, args.scale, args.seed, args.minutes);
    let _ = writeln!(md, "Offered demand {:.0} veh/h x scale {} = {:.0} veh/h. Run took {:.1} s wall clock. Flow tables use the window after a {:.0} min warm-up; select-link and health figures cover the whole run from an empty network.\n", total_demand, args.scale, total_demand * args.scale, wall, warm_s / 60.0);
    let _ = writeln!(md, "## Stability (design D4)\n");
    let _ = writeln!(md, "| Criterion | Threshold | Value | Result |\n| --- | --- | --- | --- |");
    let _ = writeln!(md, "| Gridlock removals | 0 | {} | {} |", m.gridlock_removed, if m.gridlock_removed == 0 { "pass" } else { "FAIL" });
    let _ = writeln!(md, "| Backlog / spawned | < 2% | {:.1}% ({} of {}) | {} |", backlog_pct, m.backlog, m.spawned, if backlog_pct < 2.0 { "pass" } else { "FAIL" });
    let _ = writeln!(md, "| Arterial mean speed (run) | > 4 m/s | {:.2} m/s (last 15 min {:.2}) | {} |", m.arterial_mean_speed, art_tail, if m.arterial_mean_speed > 4.0 { "pass" } else { "FAIL" });
    let _ = writeln!(md, "\nOverall: **{}**. Mean trip delay {:.0} s, mean trip time {:.0} s, completed {}, unroutable {}.\n", if stable { "STABLE" } else { "NOT STABLE" }, m.mean_trip_delay, m.mean_trip_time, m.completed_trips, m.unroutable_trips);
    let _ = writeln!(md, "| t (min) | vehicles in network | backlog | completed | removals | arterial speed in interval (m/s) |\n| --- | --- | --- | --- | --- | --- |");
    for s in &series {
        let _ = writeln!(md, "| {:.0} | {} | {} | {} | {} | {:.2} |", s.t / 60.0, s.veh, s.backlog, s.completed, s.removed, s.art_speed);
    }
    let _ = writeln!(md, "## Per-mode results\n");
    let _ = writeln!(md, "Offered: {:.0} car veh/h; {} bicycle flows ({:.0}/h); {} pedestrian flows ({:.0}/h). Bicycle and pedestrian volumes are assumptions, not counts.\n", total_demand, bike_flows, bike_vph * args.scale, ped_flows, ped_vph * args.scale);
    let _ = writeln!(md, "| Mode | In network | Completed | Mean time (s) | Other |\n| --- | --- | --- | --- | --- |");
    let _ = writeln!(md, "| Car | {} | {} | {:.0} | |", m.modes.car.in_network, m.modes.car.completed_trips, m.modes.car.mean_trip_time);
    let _ = writeln!(md, "| Bicycle | {} | {} | {:.0} | |", m.modes.bicycle.in_network, m.modes.bicycle.completed_trips, m.modes.bicycle.mean_trip_time);
    let _ = writeln!(md, "| Pedestrian | {} | {} | {:.0} | mean crossing delay {:.1} s |", m.modes.pedestrian.in_network, m.modes.pedestrian.completed_trips, m.modes.pedestrian.mean_trip_time, m.modes.pedestrian.mean_crossing_delay);
    let v = &m.vulnerable;
    let _ = writeln!(md, "\nVulnerable road users (surrogate indicators): pedestrian conflicts {}, bicycle conflicts {}, close passes {}, pedestrian injury-risk index {:.3}, bicycle injury-risk index {:.3} (proxy), mean vehicle speed at pedestrian encounters {:.2} m/s.\n", v.ped_conflicts, v.bike_conflicts, v.close_passes, v.ped_injury_risk_index, v.bike_injury_risk_index, v.mean_vehicle_speed_at_ped_encounter);
    let _ = writeln!(md, "\n## Select-link shares: modeled vs observed (design D5: headline = freeway shares, tolerance +/-10 pp)\n");
    for n in &notes {
        let _ = writeln!(md, "- {n}");
    }
    let _ = writeln!(md, "\n| Block | Side | Via | Observed | Modeled | Diff (pp) | n trips | Headline |\n| --- | --- | --- | --- | --- | --- | --- | --- |");
    let mut head_ok = 0;
    let mut head_n = 0;
    for r in &rows {
        let obs = if pm { r.observed_pm.unwrap_or(r.observed) } else { r.observed };
        let diff = 100.0 * (r.modeled - obs);
        let ok = diff.abs() <= 10.0;
        if r.headline {
            head_n += 1;
            if ok {
                head_ok += 1;
            }
        }
        let o = match r.observed_pm {
            Some(p) => format!("{} (PM {})", pct(r.observed), pct(p)),
            None => pct(r.observed),
        };
        let _ = writeln!(md, "| {} | {} | {} | {} | {} | {:+.0} | {} | {} |", r.target, r.side, r.via, o, if r.modeled.is_nan() { "n/a".into() } else { pct(r.modeled) }, if diff.is_nan() { 0.0 } else { diff }, r.n, if r.headline { if ok { "within" } else { "OUTSIDE" } } else { "" });
    }
    let _ = writeln!(md, "\nHeadline shares within tolerance: {head_ok} of {head_n}. Observed column uses the PM-peak share where one is given and the period is pm_peak. 'Via' shares are the fraction of select-link trips using that street before (from) or after (to) the block; freeway = origin / destination gate with a motorway-class link attached.\n");
    if !ramp_rows.is_empty() {
        let _ = writeln!(md, "## Claremont ramps: streets used before the on-ramp / after the off-ramp\n");
        let _ = writeln!(md, "Observed shares are for traffic from/to the north only. 'Modeled' is over all trips on the ramps and any visit to the street (an upper bound for streets that serve both sides). 'Modeled, side' counts only trips whose surface end lies on the side of the ramp stated in the targets file (`freewayRamp.side`), and for a street with a qualifier (\"north of X\") only its links on that side of X.\n");
        let _ = writeln!(md, "| Direction | Via | Observed | Modeled | n ramp trips | Modeled, side | n side trips |\n| --- | --- | --- | --- | --- | --- | --- |");
        for (k, v, o, mo, n, m2, n2) in &ramp_rows {
            let _ = writeln!(md, "| {k} | {v} | {} | {} | {n} | {} | {n2} |", pct(*o), if mo.is_nan() { "n/a".into() } else { pct(*mo) }, if m2.is_nan() { "n/a".into() } else { pct(*m2) });
        }
        md.push('\n');
    }
    let _ = writeln!(md, "## Top 15 links by delay\n");
    let _ = writeln!(md, "| Link | Street | Class | Lanes | Len (m) | End node control | Delay (veh-h) | Stopped (veh-h) | Mean stopped veh | Flow (veh/h) |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
    for &l in link_idx.iter().take(15) {
        let lk = &net.links[l];
        let _ = writeln!(md, "| {} | {} | {:?} | {} | {:.0} | {} | {:.2} | {:.2} | {:.1} | {:.0} |", l, if lk.name.is_empty() { "(unnamed)" } else { &lk.name }, lk.class, lk.lanes, lk.length, ctrl_str(net.nodes[lk.to as usize].control), d.link_delay_s[l] / 3600.0, d.link_stopped_s[l] / 3600.0, d.link_stopped_s[l] / total_s as f32, (d.link_exits[l] - exits0[l]) as f64 / elapsed_h);
    }
    let _ = writeln!(md, "\n## Top 15 nodes by blocked time\n");
    let _ = writeln!(md, "Blocked time = lane-head seconds waiting at the stop line without permission (signal red, conflict, stop sign or no downstream space).\n");
    let plans: HashMap<u32, String> = sim
        .signal_plans()
        .into_iter()
        .map(|(n, c, _, g)| (n, format!("{:.0} s: {}", c, g.iter().map(|x| format!("{:.0}", x)).collect::<Vec<_>>().join("/"))))
        .collect();
    let _ = writeln!(md, "| Node | Streets | Control | Gate | Blocked (lane-h) | of which no downstream space | Signal plan at end (cycle: greens) |\n| --- | --- | --- | --- | --- | --- | --- |");
    for &n in node_idx.iter().take(15) {
        let _ = writeln!(md, "| {} | {} | {} | {} | {:.2} | {:.2} | {} |", n, street_label(&net, n, &inc), ctrl_str(net.nodes[n].control), if net.nodes[n].gate { "yes" } else { "" }, d.node_wait_s[n] / 3600.0, d.node_space_s[n] / 3600.0, plans.get(&(n as u32)).cloned().unwrap_or_default());
    }
    let mut rem: HashMap<u32, (usize, f64)> = HashMap::new();
    for &(l, t) in sim.debug_gridlock() {
        let e = rem.entry(l).or_insert((0, t));
        e.0 += 1;
    }
    let mut rem: Vec<(u32, (usize, f64))> = rem.into_iter().collect();
    rem.sort_by(|a, b| b.1 .0.cmp(&a.1 .0).then(a.1 .1.partial_cmp(&b.1 .1).unwrap_or(Ordering::Equal)));
    if !rem.is_empty() {
        let _ = writeln!(md, "\n## Gridlock removals by link (top 10)\n");
        let _ = writeln!(md, "| Link | Street | End node | Control | Removals | First at (min) |\n| --- | --- | --- | --- | --- | --- |");
        for (l, (n, t)) in rem.iter().take(10) {
            let lk = &net.links[*l as usize];
            let _ = writeln!(md, "| {} | {} | {} | {} | {} | {:.1} |", l, if lk.name.is_empty() { "(unnamed)" } else { &lk.name }, street_label(&net, lk.to as usize, &inc), ctrl_str(net.nodes[lk.to as usize].control), n, t / 60.0);
        }
    }
    let mut bl: Vec<(usize, u32)> = d.node_backlog.iter().enumerate().filter(|x| *x.1 > 0).map(|(n, &b)| (n, b)).collect();
    bl.sort_by(|a, b| b.1.cmp(&a.1));
    if !bl.is_empty() {
        let _ = writeln!(md, "\n## Entry backlog by origin node at end of run (top 10)\n");
        let _ = writeln!(md, "| Node | Streets | Trips waiting | Offered veh/h (before scale) |\n| --- | --- | --- | --- |");
        for (n, b) in bl.iter().take(10) {
            let off = top_origins.iter().find(|x| x.0 as usize == *n).map_or(0.0, |x| x.1);
            let _ = writeln!(md, "| {} | {} | {} | {:.0} |", n, street_label(&net, *n, &inc), b, off);
        }
    }
    let _ = writeln!(md, "\n## Flow on key streets (veh/h per direction, study-area links of 40 m or more)\n");
    let _ = writeln!(md, "| Street | Direction of travel | Links | Median flow | Max flow |\n| --- | --- | --- | --- | --- |");
    for (k, dch, n, med, max) in &flow_rows {
        let _ = writeln!(md, "| {k} | {dch} | {n} | {med:.0} | {max:.0} |");
    }
    let _ = writeln!(md, "\n## Largest demand origins (offered, before scale)\n");
    let _ = writeln!(md, "| Node | Streets | Veh/h |\n| --- | --- | --- |");
    for (n, v) in top_origins.iter().take(10) {
        let _ = writeln!(md, "| {} | {} | {:.0} |", n, street_label(&net, *n as usize, &inc), v);
    }
    print!("{md}");

    if args.write {
        let dir = args.out.clone().unwrap_or_else(|| root.join("data/calibration/reports"));
        std::fs::create_dir_all(&dir).expect("mkdir reports");
        let stem = format!("{}-{}-s{}-seed{}", args.area, args.period, args.scale, args.seed);
        std::fs::write(dir.join(format!("{stem}.md")), &md).expect("write md");
        let js = json!({
            "area": args.area, "period": args.period, "scale": args.scale, "seed": args.seed, "minutes": args.minutes,
            "offeredVehPerHour": total_demand * args.scale,
            "stable": stable,
            "health": {
                "gridlockRemoved": m.gridlock_removed, "backlog": m.backlog, "spawned": m.spawned, "backlogPct": backlog_pct,
                "arterialMeanSpeed": m.arterial_mean_speed, "arterialMeanSpeedLast15min": art_tail,
                "meanTripDelay": m.mean_trip_delay, "meanTripTime": m.mean_trip_time, "completed": m.completed_trips, "unroutable": m.unroutable_trips,
            },
            "modes": serde_json::to_value(&m.modes).unwrap_or(Value::Null),
            "vulnerable": serde_json::to_value(&m.vulnerable).unwrap_or(Value::Null),
            "series": series.iter().map(|s| json!({"tMin": s.t / 60.0, "vehicles": s.veh, "backlog": s.backlog, "completed": s.completed, "removed": s.removed, "arterialSpeed": s.art_speed})).collect::<Vec<_>>(),
            "shares": rows.iter().map(|r| json!({
                "block": r.target, "side": r.side, "via": r.via, "observed": r.observed, "observedPm": r.observed_pm,
                "modelled": if r.modeled.is_nan() { Value::Null } else { json!(r.modeled) }, "n": r.n, "headline": r.headline,
            })).collect::<Vec<_>>(),
            "rampShares": ramp_rows.iter().map(|(k, v, o, mo, n, m2, n2)| json!({"direction": k, "via": v, "observed": o, "modelled": if mo.is_nan() { Value::Null } else { json!(mo) }, "n": n, "modelledSide": if m2.is_nan() { Value::Null } else { json!(m2) }, "nSide": n2})).collect::<Vec<_>>(),
            "topLinks": link_idx.iter().take(15).map(|&l| json!({"link": l, "street": net.links[l].name, "delayVehH": d.link_delay_s[l] / 3600.0, "stoppedVehH": d.link_stopped_s[l] / 3600.0})).collect::<Vec<_>>(),
            "topNodes": node_idx.iter().take(15).map(|&n| json!({"node": n, "streets": street_label(&net, n, &inc), "control": ctrl_str(net.nodes[n].control), "blockedLaneH": d.node_wait_s[n] / 3600.0, "noSpaceLaneH": d.node_space_s[n] / 3600.0})).collect::<Vec<_>>(),
            "linkFlowVehPerHour": if args.link_flows { json!((0..net.links.len()).map(|l| ((d.link_exits[l] - exits0[l]) as f64 / elapsed_h).round()).collect::<Vec<_>>()) } else { Value::Null },
            "streetFlows": flow_rows.iter().map(|(k, dch, n, med, max)| json!({"street": k, "dir": dch.to_string(), "links": n, "medianVehPerHour": med, "maxVehPerHour": max})).collect::<Vec<_>>(),
        });
        std::fs::write(dir.join(format!("{stem}.json")), serde_json::to_string_pretty(&js).unwrap()).expect("write json");
        eprintln!("wrote {}/{stem}.md and .json", dir.display());
    }
}
