//! Effective-graph queries for the redistribution diagnostic (change explain-traffic-redistribution, decision D1).
//!
//! Everything here reads the simulator's own movement permissions (`Eff`, the same derivation a run uses, with the period's turn bans)
//! and runs nothing. A witness is a legal path in the scenario's graph around one movement that the selected intervention closes. It
//! shows that drivers could go that way; it says nothing about how many do. Routes are found on free-flow perceived costs, the costs
//! the router starts from [Wardrop1952; Peeta2001].

use crate::eff::Eff;
use crate::model::{Intervention, Network};
use crate::route::{Modal, INF};
use crate::topo::Topo;
use serde_json::{json, Value};
use std::cmp::Reverse;
use std::collections::BinaryHeap;

/// Version of the output of `analyze`.
pub const GRAPH_SCHEMA: u32 = 1;
/// Witnesses listed per closed movement. The search behind each is exhaustive; only the listing is capped.
pub const WITNESS_LIST_MAX: usize = 3;
/// Movement steps upstream of the closed movement's approach and downstream of its exit that a witness may start from and rejoin at.
/// ASSUMPTION: two junctions, enough for a one-block dogleg around a closure on either side.
pub const WITNESS_REACH: usize = 2;

pub struct Graphs {
    pub topo: Topo,
    pub base: Eff,
    pub scen: Eff,
}

/// The network as a run of `period` sees it (turn bans of other periods dropped, as `Simulation::build` does).
pub fn period_network(net: &Network, period: &str) -> Network {
    let mut net = net.clone();
    net.turn_bans.retain(|b| b.periods.is_empty() || b.periods.iter().any(|p| p == period));
    net.turn_bans.retain(|b| (b.from as usize) < net.links.len() && (b.to as usize) < net.links.len());
    net
}

impl Graphs {
    pub fn new(net: &Network, period: &str, base: &[Intervention], scen: &[Intervention]) -> Graphs {
        let net = period_network(net, period);
        let topo = Topo::new(&net);
        let base = Eff::derive(&topo, &net, base);
        let scen = Eff::derive(&topo, &net, scen);
        Graphs { topo, base, scen }
    }
}

fn modal<'a>(e: &'a Eff, mode: &str) -> Modal<'a> {
    if mode == "bike" {
        e.bike_modal()
    } else {
        e.static_modal()
    }
}

fn link_cost<'a>(e: &'a Eff, mode: &str) -> &'a [f32] {
    if mode == "bike" {
        &e.bike_link_cost
    } else {
        &e.ff
    }
}

/// The movement may be driven: open in the mode's view and both links open.
pub fn legal(t: &Topo, m: Modal<'_>, mv: usize) -> bool {
    let x = &t.mvs[mv];
    m.mv_ok[mv] && !m.closed[x.a as usize] && !m.closed[x.b as usize]
}

/// FNV-1a over the legal-movement bits: identifies the graph a witness was searched on.
pub fn graph_hash(t: &Topo, m: Modal<'_>) -> String {
    let mut h: u64 = 0xcbf2_9ce4_8422_2325;
    for mv in 0..t.mvs.len() {
        h ^= legal(t, m, mv) as u64;
        h = h.wrapping_mul(0x0100_0000_01b3);
    }
    for &c in m.closed {
        h ^= c as u64;
        h = h.wrapping_mul(0x0100_0000_01b3);
    }
    format!("{h:016x}")
}

/// Links within `steps` legal movements of `from` in the given direction, not counting links that touch `avoid` (the closed junction).
fn reach(t: &Topo, m: Modal<'_>, from: u32, steps: usize, forward: bool, avoid: u32) -> Vec<u32> {
    let mut out = vec![from];
    let mut frontier = vec![from];
    for _ in 0..steps {
        let mut next = Vec::new();
        for &l in &frontier {
            let mvs: Vec<usize> = if forward {
                (t.lm_start[l as usize]..t.lm_start[l as usize] + t.lm_cnt[l as usize]).map(|x| x as usize).collect()
            } else {
                t.preds[l as usize].iter().map(|&x| x as usize).collect()
            };
            for mv in mvs {
                if !legal(t, m, mv) {
                    continue;
                }
                let o = if forward { t.mvs[mv].b } else { t.mvs[mv].a };
                if t.link_from[o as usize] == avoid || t.link_to[o as usize] == avoid || out.contains(&o) {
                    continue;
                }
                out.push(o);
                next.push(o);
            }
        }
        frontier = next;
    }
    out
}

/// Dijkstra over links from `sources` (cost counted after the source link) on the legal movements: every reachable link gets its cost
/// and predecessor, so the search is exhaustive over the graph.
fn search(t: &Topo, m: Modal<'_>, cost: &[f32], sources: &[u32]) -> (Vec<f32>, Vec<u32>) {
    let n = t.n_links;
    let mut d = vec![INF; n];
    let mut prev = vec![u32::MAX; n];
    let mut heap = BinaryHeap::new();
    for &s in sources {
        if !m.closed[s as usize] {
            d[s as usize] = 0.0;
            heap.push(Reverse((0f32.to_bits(), s)));
        }
    }
    while let Some(Reverse((bits, l))) = heap.pop() {
        let dl = f32::from_bits(bits);
        if dl > d[l as usize] {
            continue;
        }
        for mv in t.lm_start[l as usize]..t.lm_start[l as usize] + t.lm_cnt[l as usize] {
            if !legal(t, m, mv as usize) {
                continue;
            }
            let b = t.mvs[mv as usize].b;
            let c = dl + m.mv_cost[mv as usize] + cost[b as usize] * m.w[b as usize];
            if c < d[b as usize] {
                d[b as usize] = c;
                prev[b as usize] = l;
                heap.push(Reverse((c.to_bits(), b)));
            }
        }
    }
    (d, prev)
}

fn path_to(prev: &[u32], end: u32) -> Vec<u32> {
    let mut path = vec![end];
    let mut x = end;
    while prev[x as usize] != u32::MAX {
        x = prev[x as usize];
        path.push(x);
    }
    path.reverse();
    path
}

fn path_cost(t: &Topo, m: Modal<'_>, cost: &[f32], path: &[u32]) -> Option<f32> {
    let mut c = 0.0;
    for w in path.windows(2) {
        let mv = t.find_mv(w[0], w[1])? as usize;
        if !legal(t, m, mv) {
            return None;
        }
        c += m.mv_cost[mv] + cost[w[1] as usize] * m.w[w[1] as usize];
    }
    Some(c)
}

/// Is every consecutive pair of `path` a legal movement in the scenario graph? The check the parity fixtures use.
pub fn path_is_legal(g: &Graphs, mode: &str, path: &[u32]) -> bool {
    let m = modal(&g.scen, mode);
    path.iter().all(|&l| (l as usize) < g.topo.n_links && !m.closed[l as usize]) && path_cost(&g.topo, m, link_cost(&g.scen, mode), path).is_some()
}

/// Legal witnesses around closed movement `mv`. Starts are links up to `WITNESS_REACH` junctions upstream of its approach, ends links up
/// to that many junctions downstream of its exit. A (start, end) pair counts when a cheapest baseline path between them makes the movement
/// (drivers between them had a reason to use it); its witness is the cheapest legal path between them in the scenario. Each start lists
/// the end with the cheapest witness.
fn witnesses(g: &Graphs, mode: &str, mv: usize) -> Value {
    let t = &g.topo;
    let (mb, ms) = (modal(&g.base, mode), modal(&g.scen, mode));
    let (cb, cs) = (link_cost(&g.base, mode), link_cost(&g.scen, mode));
    let x = &t.mvs[mv];
    let node = x.node;
    let mut starts = reach(t, mb, x.a, WITNESS_REACH, false, u32::MAX);
    starts.retain(|&l| !ms.closed[l as usize]);
    let targets = reach(t, mb, x.b, WITNESS_REACH, true, node);
    let (from_b, _) = search(t, mb, cb, &[x.b]);
    let through = mb.mv_cost[mv] + cb[x.b as usize] * mb.w[x.b as usize];
    let mut found: Vec<(Vec<u32>, f32, f32)> = Vec::new();
    let mut served_pairs = 0usize;
    let mut connected = false;
    for &s in &starts {
        let (db, _) = search(t, mb, cb, &[s]);
        let (ds, ps) = search(t, ms, cs, &[s]);
        let mut best: Option<(f32, u32)> = None;
        for &e in targets.iter().filter(|&&e| e != s) {
            let via = if s == x.a { 0.0 } else { db[x.a as usize] } + through + if e == x.b { 0.0 } else { from_b[e as usize] };
            if !via.is_finite() || via > db[e as usize] * 1.0001 + 0.01 {
                continue;
            }
            served_pairs += 1;
            if ds[e as usize].is_finite() {
                connected = true;
                if best.map_or(true, |(c, _)| ds[e as usize] < c) {
                    best = Some((ds[e as usize], e));
                }
            }
        }
        if let Some((c, e)) = best {
            let path = path_to(&ps, e);
            if !found.iter().any(|f| f.0 == path) {
                found.push((path, c, db[e as usize]));
            }
        }
    }
    found.sort_by(|a, b| (a.1 - a.2).total_cmp(&(b.1 - b.2)).then(a.1.total_cmp(&b.1)).then(a.0.cmp(&b.0)));
    let total = found.len();
    let r1 = |v: f32| (v * 10.0).round() / 10.0;
    json!({
        "movement": [x.a, x.b],
        "node": node,
        "starts": starts,
        "targets": targets,
        "servedPairs": served_pairs,
        "status": if connected { "found" } else if served_pairs == 0 { "unused" } else { "disconnected" },
        "exhaustive": true,
        "listed": total.min(WITNESS_LIST_MAX),
        "found": total,
        "cap": WITNESS_LIST_MAX,
        "paths": found.iter().take(WITNESS_LIST_MAX).map(|(p, c, b)| json!({ "links": p, "costS": r1(*c), "baselineCostS": r1(*b) })).collect::<Vec<_>>(),
    })
}

/// What the selected intervention changes in the graph and the legal paths around it.
///
/// `closed`: movements legal in the baseline and not in the scenario (the direct cohort selector). `crossings`: every baseline-legal
/// movement at a node the scenario changes (the broader, separately labeled selector). Closed links are listed as such.
pub fn analyze(net: &Network, period: &str, mode: &str, base: &[Intervention], scen: &[Intervention]) -> Value {
    let g = Graphs::new(net, period, base, scen);
    let t = &g.topo;
    let (mb, ms) = (modal(&g.base, mode), modal(&g.scen, mode));
    let mut closed = Vec::new();
    let mut nodes: Vec<u32> = Vec::new();
    for mv in 0..t.mvs.len() {
        if legal(t, mb, mv) && !legal(t, ms, mv) {
            closed.push(mv);
            if !nodes.contains(&t.mvs[mv].node) {
                nodes.push(t.mvs[mv].node);
            }
        }
    }
    let crossings: Vec<Value> = nodes
        .iter()
        .flat_map(|&n| (t.mbase[n as usize]..t.mbase[n as usize] + t.mcount[n as usize]).map(|m| m as usize))
        .filter(|&mv| legal(t, mb, mv))
        .map(|mv| json!([t.mvs[mv].a, t.mvs[mv].b, t.mvs[mv].node]))
        .collect();
    let closed_links: Vec<usize> = (0..t.n_links).filter(|&l| !mb.closed[l] && ms.closed[l]).collect();
    json!({
        "schema": GRAPH_SCHEMA,
        "mode": mode,
        "period": period,
        "graph": { "links": t.n_links, "movements": t.mvs.len(), "baseline": graph_hash(t, mb), "scenario": graph_hash(t, ms) },
        "closed": closed.iter().map(|&mv| json!([t.mvs[mv].a, t.mvs[mv].b, t.mvs[mv].node])).collect::<Vec<_>>(),
        "closedLinks": closed_links,
        "nodes": nodes,
        "crossings": crossings,
        "witnesses": closed.iter().map(|&mv| witnesses(&g, mode, mv)).collect::<Vec<_>>(),
        "limits": { "listPerMovement": WITNESS_LIST_MAX, "reachJunctions": WITNESS_REACH, "costs": "free-flow perceived" },
    })
}
