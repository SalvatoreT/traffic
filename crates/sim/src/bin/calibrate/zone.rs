//! Judged zone of the stability rule (change calibration-round-37): where a car cleared from gridlock counts against the rule.
//! The zone is the study area (its links and nodes, the bounding streets and the junctions on them, as the importer marks them)
//! plus every node within `judgedZone.bufferM` of it along the network, from the area config. A car counts as cleared near when
//! the node where it was held (the end of the link it waited on, or the node it was held in) lies in the zone. A far clearing
//! counts against the rule too when, at the snapshot before it, its blocking chain reaches a link in the zone (`linked`).
//! Read-only: the simulation is only observed between steps, so a run is unchanged.

use serde_json::{json, Value};
use std::cmp::Ordering;
use std::collections::{BinaryHeap, HashMap, HashSet, VecDeque};
use traffic_sim::model::{Network, RoadClass};

/// A head held by downstream space, or a vehicle held in a node, for at least this long is an edge of the blocking graph.
/// ASSUMPTION: long enough that a full exit, not a moment's spacing, holds it.
pub const CHAIN_MIN_WAIT_S: f32 = 60.0;
/// Jam spacing per standing car (m), as in the node report's full-link test of this binary. ASSUMPTION.
pub const JAM_SPACING_M: f64 = 6.5;
const CHAIN_MAX_LINKS: usize = 5000;

pub struct Zone {
    pub buffer_m: f64,
    /// Network distance (m, either direction of travel) of each node from the study area; 0 inside it.
    pub dist: Vec<f64>,
    pub core_link: Vec<bool>,
}

#[derive(Clone, Copy, PartialEq)]
struct Item(f64, usize);
impl Eq for Item {}
impl Ord for Item {
    fn cmp(&self, o: &Self) -> Ordering {
        o.0.partial_cmp(&self.0).unwrap_or(Ordering::Equal).then(o.1.cmp(&self.1))
    }
}
impl PartialOrd for Item {
    fn partial_cmp(&self, o: &Self) -> Option<Ordering> {
        Some(self.cmp(o))
    }
}

impl Zone {
    pub fn new(net: &Network, buffer_m: f64) -> Zone {
        let n = net.nodes.len();
        let core_link: Vec<bool> = net.links.iter().map(|l| l.in_study_area).collect();
        let mut dist = vec![f64::INFINITY; n];
        let mut adj: Vec<Vec<(usize, f64)>> = vec![Vec::new(); n];
        for l in &net.links {
            let (a, b) = (l.from as usize, l.to as usize);
            adj[a].push((b, l.length));
            adj[b].push((a, l.length));
        }
        let mut heap = BinaryHeap::new();
        for (i, nd) in net.nodes.iter().enumerate() {
            if nd.in_study_area {
                dist[i] = 0.0;
            }
        }
        for l in net.links.iter().filter(|l| l.in_study_area) {
            dist[l.from as usize] = 0.0;
            dist[l.to as usize] = 0.0;
        }
        for (i, &d) in dist.iter().enumerate() {
            if d == 0.0 {
                heap.push(Item(0.0, i));
            }
        }
        while let Some(Item(d, u)) = heap.pop() {
            if d > dist[u] {
                continue;
            }
            for &(v, w) in &adj[u] {
                if d + w < dist[v] {
                    dist[v] = d + w;
                    heap.push(Item(d + w, v));
                }
            }
        }
        Zone { buffer_m, dist, core_link }
    }

    pub fn with_buffer(&self, buffer_m: f64) -> Zone {
        Zone { buffer_m, dist: self.dist.clone(), core_link: self.core_link.clone() }
    }

    pub fn node_in(&self, n: usize) -> bool {
        self.dist[n] <= self.buffer_m + 1e-9
    }

    /// A link is in the zone when it is a study-area link or its head (the node a queue on it waits at) is in the zone.
    pub fn link_in(&self, net: &Network, l: usize) -> bool {
        self.core_link[l] || self.node_in(net.links[l].to as usize)
    }
}

/// `judgedZone.bufferM` of the area config, or None when the area defines no judged zone (then every clearing is judged).
pub fn buffer_from_area(area_cfg: &Value) -> Option<f64> {
    area_cfg["judgedZone"]["bufferM"].as_f64().filter(|b| b.is_finite() && *b >= 0.0)
}

/// Fields of one `Simulation::debug_stuck` line: (link, next link, wait s, blocked only by downstream space).
pub fn parse_stuck(line: &str) -> Option<(u32, Option<u32>, f32, bool)> {
    let t: Vec<&str> = line.split_whitespace().collect();
    let after = |k: &str| t.iter().position(|x| *x == k).and_then(|i| t.get(i + 1)).copied();
    let link = after("link")?.parse().ok()?;
    let wait = after("wait")?.parse().ok()?;
    let next = after("next").and_then(|s| s.strip_prefix("Some(")).and_then(|s| s.strip_suffix(')')).and_then(|s| s.parse().ok());
    let blocked = after("blocked_space")? == "true";
    Some((link, next, wait, blocked))
}

/// Blocking graph at one moment: link -> links its held vehicles wait to enter.
#[derive(Default, Clone)]
pub struct Snapshot {
    pub out: HashMap<u32, Vec<u32>>,
}

impl Snapshot {
    pub fn from_parts(stuck: &[String], held: &[(u32, u32, u32, f32)]) -> Snapshot {
        let mut s = Snapshot::default();
        for line in stuck {
            if let Some((l, Some(b), w, true)) = parse_stuck(line) {
                if w >= CHAIN_MIN_WAIT_S {
                    s.out.entry(l).or_default().push(b);
                }
            }
        }
        for &(_, a, b, w) in held {
            if w >= CHAIN_MIN_WAIT_S {
                s.out.entry(a).or_default().push(b);
            }
        }
        s
    }

    /// Links connected to `start` through held vehicles (either direction of the edges), `start` included.
    pub fn component(&self, start: u32) -> Vec<u32> {
        let mut und: HashMap<u32, Vec<u32>> = HashMap::new();
        for (&a, bs) in &self.out {
            for &b in bs {
                und.entry(a).or_default().push(b);
                und.entry(b).or_default().push(a);
            }
        }
        let mut seen: HashSet<u32> = HashSet::from([start]);
        let mut q = VecDeque::from([start]);
        while let Some(u) = q.pop_front() {
            if seen.len() >= CHAIN_MAX_LINKS {
                break;
            }
            for &v in und.get(&u).map(|v| v.as_slice()).unwrap_or(&[]) {
                if seen.insert(v) {
                    q.push_back(v);
                }
            }
        }
        let mut v: Vec<u32> = seen.into_iter().collect();
        v.sort_unstable();
        v
    }
}

/// One car cleared from gridlock: the link it was held on (or entered the node from), when, and its blocking chain.
pub struct Clearing {
    pub link: u32,
    pub t: f64,
    pub chain: Vec<u32>,
}

#[derive(Clone, Copy, Default, Debug, PartialEq)]
pub struct Split {
    pub near: u64,
    pub far: u64,
    /// Far clearings whose blocking chain reaches a link in the zone (they count against the rule).
    pub far_linked: u64,
}

impl Split {
    pub fn judged(&self) -> u64 {
        self.near + self.far_linked
    }
}

pub fn split(net: &Network, zone: &Zone, cl: &[Clearing]) -> Split {
    let mut s = Split::default();
    for c in cl {
        if zone.link_in(net, c.link as usize) {
            s.near += 1;
        } else {
            s.far += 1;
            if c.chain.iter().any(|&l| zone.link_in(net, l as usize)) {
                s.far_linked += 1;
            }
        }
    }
    s
}

/// Bounding streets of the area config's `boundary` (names, or `{ref, class}` for a road known by class) and their study-area links. A road known by
/// class (the freeway) has no study-area links, so its links of that class with both ends in the judged zone stand for it.
pub fn bounding_streets(net: &Network, area_cfg: &Value, zone: Option<&Zone>) -> Vec<(String, Vec<usize>)> {
    let mut out = Vec::new();
    for b in area_cfg["boundary"].as_array().map(|a| a.as_slice()).unwrap_or(&[]) {
        let (label, links): (String, Vec<usize>) = if let Some(name) = b.as_str() {
            (name.to_string(), (0..net.links.len()).filter(|&l| net.links[l].in_study_area && net.links[l].name == name).collect())
        } else {
            let label = b["ref"].as_str().or(b["name"].as_str()).unwrap_or("boundary").to_string();
            let motorway = b["class"].as_str() == Some("motorway");
            let inside = |l: usize| net.links[l].in_study_area || zone.map_or(false, |z| z.node_in(net.links[l].from as usize) && z.node_in(net.links[l].to as usize));
            (label, (0..net.links.len()).filter(|&l| motorway && net.links[l].class == RoadClass::Motorway && inside(l)).collect())
        };
        out.push((label, links));
    }
    out
}

/// Longest standing queue on each bounding street over the samples: (cars standing / lanes) x jam spacing, on one link.
#[derive(Clone, Default)]
pub struct QueueTrack {
    pub max_m: f64,
    pub link: Option<usize>,
    pub t: f64,
    pub full_samples: u32,
    pub samples: u32,
}

pub fn track_queues(net: &Network, streets: &[(String, Vec<usize>)], load: &[(u32, f32, u32)], t: f64, acc: &mut [QueueTrack]) {
    for (i, (_, links)) in streets.iter().enumerate() {
        let mut full = false;
        for &l in links {
            let lk = &net.links[l];
            let q = load[l].2 as f64 / lk.lanes.max(1) as f64 * JAM_SPACING_M;
            if q > acc[i].max_m {
                acc[i].max_m = q;
                acc[i].link = Some(l);
                acc[i].t = t;
            }
            full |= q >= 0.8 * lk.length;
        }
        acc[i].samples += 1;
        acc[i].full_samples += full as u32;
    }
}

pub fn report_json(net: &Network, zone: &Zone, cl: &[Clearing], label: &dyn Fn(usize) -> String, backlog: &[u32], streets: &[(String, Vec<usize>)], queues: &[QueueTrack]) -> Value {
    let s = split(net, zone, cl);
    let sens: Vec<Value> = [0.5, 1.0, 2.0]
        .iter()
        .map(|f| {
            let z = zone.with_buffer(zone.buffer_m * f);
            let x = split(net, &z, cl);
            json!({"bufferM": z.buffer_m, "near": x.near, "far": x.far, "farLinked": x.far_linked, "judged": x.judged()})
        })
        .collect();
    let mut far_sites: HashMap<usize, (u64, u64)> = HashMap::new();
    for c in cl.iter().filter(|c| !zone.link_in(net, c.link as usize)) {
        let e = far_sites.entry(net.links[c.link as usize].to as usize).or_default();
        e.0 += 1;
        e.1 += c.chain.iter().any(|&l| zone.link_in(net, l as usize)) as u64;
    }
    let mut far_sites: Vec<(usize, (u64, u64))> = far_sites.into_iter().collect();
    far_sites.sort_by(|a, b| b.1 .0.cmp(&a.1 .0).then(a.0.cmp(&b.0)));
    let zone_backlog: u64 = backlog.iter().enumerate().filter(|(n, _)| zone.node_in(*n)).map(|(_, &b)| b as u64).sum();
    let all_backlog: u64 = backlog.iter().map(|&b| b as u64).sum();
    json!({
        "bufferM": zone.buffer_m, "chainMinWaitS": CHAIN_MIN_WAIT_S,
        "zoneNodes": (0..net.nodes.len()).filter(|&n| zone.node_in(n)).count(),
        "zoneLinks": (0..net.links.len()).filter(|&l| zone.link_in(net, l)).count(),
        "total": cl.len(), "near": s.near, "far": s.far, "farLinked": s.far_linked, "judged": s.judged(),
        "sensitivity": sens,
        "farSites": far_sites.iter().map(|(n, (k, linked))| json!({"node": n, "streets": label(*n), "distM": (zone.dist[*n]).round(), "cleared": k, "linked": linked})).collect::<Vec<_>>(),
        "clearings": cl.iter().map(|c| json!({"link": c.link, "node": net.links[c.link as usize].to, "tMin": (c.t / 6.0).round() / 10.0, "near": zone.link_in(net, c.link as usize), "linked": c.chain.iter().any(|&l| zone.link_in(net, l as usize)), "chainLinks": c.chain.len()})).collect::<Vec<_>>(),
        "backlog": {"zoneTrips": zone_backlog, "allTrips": all_backlog},
        "boundingStreets": streets.iter().zip(queues).map(|((name, links), q)| json!({"street": name, "links": links.len(), "maxQueueM": q.max_m.round(), "link": q.link, "linkLengthM": q.link.map(|l| net.links[l].length.round()), "tMin": (q.t / 6.0).round() / 10.0, "fullShare": if q.samples > 0 { ((q.full_samples as f64 / q.samples as f64) * 1000.0).round() / 1000.0 } else { 0.0 }})).collect::<Vec<_>>(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn net(json: &str) -> Network {
        serde_json::from_str(json).unwrap()
    }

    /// A chain of four nodes 0-1-2-3, 100 m apart; node 0 and link 0 (0 -> 1) in the study area.
    fn line() -> Network {
        let node = |id: u32, x: f64, inside: bool| format!(r#"{{"id":{id},"x":{x},"y":0,"control":"uncontrolled","gate":false,"inStudyArea":{inside}}}"#);
        let link = |id: u32, a: u32, b: u32, inside: bool| format!(r#"{{"id":{id},"from":{a},"to":{b},"name":"S","class":"residential","lanes":1,"speedLimit":10,"length":100,"geometry":[[0,0],[1,0]],"fromBearing":90,"toBearing":90,"stopAtEnd":false,"humps":[],"inStudyArea":{inside}}}"#);
        net(&format!(
            r#"{{"version":1,"id":"t","name":"t","origin":{{"lat":0,"lon":0}},"nodes":[{},{},{},{}],"links":[{},{},{},{},{}]}}"#,
            node(0, 0.0, true),
            node(1, 100.0, false),
            node(2, 200.0, false),
            node(3, 300.0, false),
            link(0, 0, 1, true),
            link(1, 1, 2, false),
            link(2, 2, 3, false),
            link(3, 3, 2, false),
            link(4, 2, 1, false)
        ))
    }

    #[test]
    fn zone_is_study_area_plus_network_buffer() {
        let n = line();
        let z = Zone::new(&n, 150.0);
        assert_eq!(z.dist, vec![0.0, 0.0, 100.0, 200.0]);
        assert!(z.node_in(2) && !z.node_in(3));
        assert!(z.link_in(&n, 0) && z.link_in(&n, 1) && !z.link_in(&n, 2) && z.link_in(&n, 3));
        let z0 = z.with_buffer(0.0);
        assert!(!z0.link_in(&n, 1) && z0.link_in(&n, 4));
    }

    #[test]
    fn split_counts_near_far_and_linked() {
        let n = line();
        let z = Zone::new(&n, 50.0);
        let cl = vec![
            Clearing { link: 0, t: 60.0, chain: vec![0] },
            Clearing { link: 2, t: 120.0, chain: vec![2] },
            Clearing { link: 1, t: 180.0, chain: vec![1, 2] },
            Clearing { link: 2, t: 240.0, chain: vec![2, 3, 4] },
        ];
        let s = split(&n, &z, &cl);
        assert_eq!(s, Split { near: 1, far: 3, far_linked: 1 });
        assert_eq!(s.judged(), 2);
        assert_eq!(split(&n, &z.with_buffer(400.0), &cl), Split { near: 4, far: 0, far_linked: 0 });
    }

    #[test]
    fn parses_stuck_lines_and_builds_chains() {
        let line = "link 12 (3 -> 4) len 80 lanes 1 ctrl AllWayStop sig 0 wait 190 next Some(15) room Some(0.0) blocked_space true go false stop_t 2.0 nq 9";
        assert_eq!(parse_stuck(line), Some((12, Some(15), 190.0, true)));
        assert_eq!(parse_stuck("link 7 (1 -> 2) len 5 lanes 1 ctrl Signal sig 3 wait 70 next None room None blocked_space false go false stop_t 0.0 nq 1"), Some((7, None, 70.0, false)));
        let stuck = vec![line.to_string(), "link 15 (4 -> 5) len 80 lanes 1 ctrl Signal sig 1 wait 90 next Some(20) room Some(0.0) blocked_space true go false stop_t 0.0 nq 9".to_string(), "link 30 (8 -> 5) len 80 lanes 1 ctrl Signal sig 1 wait 30 next Some(20) room Some(0.0) blocked_space true go false stop_t 0.0 nq 9".to_string()];
        let snap = Snapshot::from_parts(&stuck, &[(9, 40, 12, 75.0), (9, 41, 12, 20.0)]);
        assert_eq!(snap.component(12), vec![12, 15, 20, 40]);
        assert_eq!(snap.component(30), vec![30]);
    }
}
