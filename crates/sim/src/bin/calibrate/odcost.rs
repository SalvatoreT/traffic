//! `--od-costs PATH` (calibration round 30): for every through trip on chosen links, the router's cost of the route it drove and of the
//! best route with the study area's local streets closed, both on the costs in force when the trip asked to depart, split into the terms
//! the router adds (measured link and movement times, movement traversal, turn penalty, control constant, local-street weight), plus the
//! time each route takes on the measured times along the way. Written as JSON for offline aggregation.

use serde_json::{json, Value};
use std::cmp::Reverse;
use std::collections::BinaryHeap;
use traffic_sim::model::{Control, Network, RoadClass};
use traffic_sim::params::node_delays;
use traffic_sim::sim::{Simulation, TripRecord, TripTiming};

/// Router costs captured once a minute: per-link cost and per-movement cost.
pub struct Snaps {
    pub t: Vec<f64>,
    pub link: Vec<Vec<f32>>,
    pub mv: Vec<Vec<f32>>,
}

impl Snaps {
    pub fn new() -> Snaps {
        Snaps { t: Vec::new(), link: Vec::new(), mv: Vec::new() }
    }
    pub fn take(&mut self, t: f64, sim: &Simulation) {
        let (_, eff, lc) = sim.router_view();
        self.t.push(t);
        self.link.push(lc.to_vec());
        self.mv.push(eff.mv_cost.clone());
    }
    fn at(&self, t: f64) -> usize {
        self.t.iter().rposition(|&x| x <= t).unwrap_or(0)
    }
}

#[derive(Default, Clone, Copy)]
struct Terms {
    meas: f64,
    trav: f64,
    turn: f64,
    ctrl: f64,
    local: f64,
}

impl Terms {
    fn json(&self) -> Value {
        json!({"measured": r1(self.meas), "traversal": r1(self.trav), "turn": r1(self.turn), "control": r1(self.ctrl), "localWeight": r1(self.local), "perceived": r1(self.meas + self.trav + self.turn + self.ctrl + self.local)})
    }
}

fn r1(x: f64) -> f64 {
    (x * 10.0).round() / 10.0
}

fn ctrl_const(sim: &Simulation, mv: usize) -> f64 {
    let (topo, eff, _) = sim.router_view();
    let m = &topo.mvs[mv];
    let dl = node_delays();
    (match eff.ctrl[m.node as usize] {
        Control::Signal => dl.signal,
        Control::AllWayStop => dl.all_way_stop,
        Control::TwoWayStop if eff.minor[m.a as usize] => dl.minor_stop,
        Control::TrafficCircle => dl.circle,
        _ => 0.0,
    }) as f64
}

/// Terms of `route` after `from` on snapshot `k`; `None` when a movement is missing.
fn terms(sim: &Simulation, snaps: &Snaps, k: usize, from: u32, route: &[u32]) -> Option<Terms> {
    let (topo, eff, _) = sim.router_view();
    let (lc, mc) = (&snaps.link[k], &snaps.mv[k]);
    let mut t = Terms::default();
    let mut prev = from;
    for &b in route {
        let mv = topo.find_mv(prev, b)? as usize;
        let (a, bu) = (prev as usize, b as usize);
        let extra_w = (mc[mv] - eff.mv_static[mv]) as f64;
        let wa = eff.route_w[a] as f64;
        let extra = extra_w / wa;
        let cc = ctrl_const(sim, mv);
        let ff = eff.mv_ff[mv] as f64;
        t.meas += lc[bu] as f64 + extra;
        t.trav += ff;
        t.ctrl += cc;
        t.turn += eff.mv_static[mv] as f64 - ff - cc;
        t.local += (eff.route_w[bu] as f64 - 1.0) * lc[bu] as f64 + (extra_w - extra);
        prev = b;
    }
    Some(t)
}

/// Time along `route` after `from` starting at `t0` on the measured terms, reading each link's time from the snapshot in force when the car reaches it.
fn timed(sim: &Simulation, snaps: &Snaps, t0: f64, from: u32, route: &[u32]) -> Option<f64> {
    let (topo, eff, _) = sim.router_view();
    let mut t = t0;
    let mut prev = from;
    for &b in route {
        let k = snaps.at(t);
        let mv = topo.find_mv(prev, b)? as usize;
        let extra = (snaps.mv[k][mv] - eff.mv_static[mv]) as f64 / eff.route_w[prev as usize] as f64;
        t += snaps.link[k][b as usize] as f64 + extra + eff.mv_ff[mv] as f64;
        prev = b;
    }
    Some(t - t0)
}

/// Cheapest route from the end of link `from` to link `to` on snapshot `k` (perceived cost, no driver noise), avoiding `banned` links.
fn best(sim: &Simulation, snaps: &Snaps, k: usize, from: u32, to: u32, banned: &[bool]) -> Option<Vec<u32>> {
    let (topo, eff, _) = sim.router_view();
    let (lc, mc) = (&snaps.link[k], &snaps.mv[k]);
    let n = topo.n_links;
    let mut dist = vec![f64::INFINITY; n];
    let mut pred = vec![u32::MAX; n];
    let mut heap = BinaryHeap::new();
    dist[from as usize] = 0.0;
    heap.push((Reverse((0.0f64 * 1000.0) as u64), from));
    while let Some((Reverse(d1000), a)) = heap.pop() {
        let d = d1000 as f64 / 1000.0;
        if d > dist[a as usize] + 1e-6 {
            continue;
        }
        if a == to {
            break;
        }
        let s = topo.lm_start[a as usize];
        for mv in s..s + topo.lm_cnt[a as usize] {
            let m = &topo.mvs[mv as usize];
            let b = m.b as usize;
            if !eff.mv_ok[mv as usize] || eff.closed[b] || (banned[b] && b != to as usize) {
                continue;
            }
            let nd = d + lc[b] as f64 * eff.route_w[b] as f64 + mc[mv as usize] as f64;
            if nd + 1e-6 < dist[b] {
                dist[b] = nd;
                pred[b] = a;
                heap.push((Reverse((nd * 1000.0) as u64), m.b));
            }
        }
    }
    if !dist[to as usize].is_finite() {
        return None;
    }
    let mut path = vec![to];
    let mut c = to;
    while pred[c as usize] != from {
        c = pred[c as usize];
        if c == u32::MAX {
            return None;
        }
        path.push(c);
    }
    path.reverse();
    Some(path)
}

/// Links of `route` after `from` whose measured time on snapshot `k` exceeds their free-flow time by more than 5 s: (link, excess s).
fn slow(sim: &Simulation, snaps: &Snaps, k: usize, from: u32, route: &[u32]) -> Vec<(u32, f64)> {
    let (topo, eff, _) = sim.router_view();
    let mut out = Vec::new();
    let mut prev = from;
    for &b in route {
        let Some(mv) = topo.find_mv(prev, b) else { break };
        let extra = (snaps.mv[k][mv as usize] - eff.mv_static[mv as usize]) as f64 / eff.route_w[prev as usize] as f64;
        let x = snaps.link[k][b as usize] as f64 - eff.ff[b as usize] as f64 + extra;
        if x > 5.0 {
            out.push((b, r1(x)));
        }
        prev = b;
    }
    out
}

/// Street names along `route` with at least 80 m on each, in order.
fn streets(net: &Network, route: &[u32]) -> Vec<String> {
    let mut out: Vec<(String, f64)> = Vec::new();
    for &l in route {
        let k = &net.links[l as usize];
        let name = if k.class == RoadClass::Motorway { "freeway".to_string() } else if k.name.is_empty() { "(unnamed)".to_string() } else { k.name.clone() };
        match out.last_mut() {
            Some((n, m)) if *n == name => *m += k.length,
            _ => out.push((name, k.length)),
        }
    }
    let mut names: Vec<String> = Vec::new();
    for (n, m) in out {
        if m >= 80.0 && names.last() != Some(&n) {
            names.push(n);
        }
    }
    names
}

pub fn write(path: &std::path::Path, sim: &Simulation, net: &Network, snaps: &Snaps, sets: &[(String, Vec<u32>)], groups: Option<&super::intent::Groups>, recs: &[TripRecord], tims: &[TripTiming]) {
    let banned: Vec<bool> = net.links.iter().map(|k| k.in_study_area && matches!(k.class, RoadClass::Residential | RoadClass::Service)).collect();
    let mut out = Vec::new();
    let by_uid: std::collections::HashMap<u32, &TripTiming> = tims.iter().map(|t| (t.uid, t)).collect();
    for r in recs {
        let Some(&tm) = by_uid.get(&r.uid) else { continue };
        let (o, d) = (r.origin as usize, r.dest as usize);
        if net.nodes[o].in_study_area || net.nodes[d].in_study_area || r.trail.len() < 2 {
            continue;
        }
        let on: Vec<&str> = sets.iter().filter(|(_, ls)| r.trail.iter().any(|l| ls.contains(l))).map(|(n, _)| n.as_str()).collect();
        if on.is_empty() {
            continue;
        }
        let k = snaps.at(tm.t_arr.max(0.0));
        // Compare the surface part only: from the last link of a leading freeway run (the off-ramp) to the first freeway link after it (the on-ramp), so a ramp the trip had to use (an assumed movement) is kept.
        let mw = |l: u32| net.links[l as usize].class == RoadClass::Motorway;
        let lead = r.trail.iter().take_while(|&&l| mw(l)).count();
        let i0 = lead.saturating_sub(1);
        let i1 = r.trail[i0 + 1..].iter().position(|&l| mw(l)).map_or(r.trail.len() - 1, |p| i0 + 1 + p);
        if i1 <= i0 {
            continue;
        }
        let (from, last) = (r.trail[i0], r.trail[i1]);
        let drove = &r.trail[i0 + 1..=i1];
        let alt = best(sim, snaps, k, from, last, &banned);
        let k_ins = snaps.at(tm.t_ins.max(0.0));
        let free = vec![false; banned.len()];
        let opt = best(sim, snaps, k_ins, from, last, &free);
        let opt_v = opt.as_ref().map(|p| json!({"same": p.as_slice() == drove, "streets": streets(net, p), "perceived": terms(sim, snaps, k_ins, from, p).map(|t| r1(t.meas + t.trav + t.turn + t.ctrl + t.local)), "drovePerceived": terms(sim, snaps, k_ins, from, drove).map(|t| r1(t.meas + t.trav + t.turn + t.ctrl + t.local))}));
        let walk_v = {
            let (topo, eff, _) = sim.router_view();
            let m = traffic_sim::route::Modal { closed: &eff.closed, mv_ok: &eff.mv_ok, mv_cost: &snaps.mv[k_ins], w: &eff.route_w };
            let mut rt = traffic_sim::route::Router::new(topo.n_nodes);
            rt.ensure_m(r.dest, topo, m, &snaps.link[k_ins]);
            let mut w = Vec::new();
            let ok = traffic_sim::route::walk_m(rt.table(r.dest), topo, m, r.trail[0], r.dest, &mut w);
            json!({"ok": ok, "same": ok && w.as_slice() == &r.trail[1..], "streets": streets(net, &w), "h0": rt.table(r.dest)[r.trail[0] as usize]})
        };
        let alt_v = alt.as_ref().map(|p| {
            json!({"streets": streets(net, p), "slow": slow(sim, snaps, k, from, p), "terms": terms(sim, snaps, k, from, p).map(|t| t.json()), "timed": timed(sim, snaps, tm.t_ins, from, p).map(r1), "lengthM": r1(p.iter().map(|&l| net.links[l as usize].length).sum::<f64>())})
        });
        out.push(json!({
            "uid": r.uid, "tuid": tm.uid, "blocks": on, "origin": r.origin, "dest": r.dest,
            "og": groups.map(|g| g.of(r.origin).to_string()), "dg": groups.map(|g| g.of(r.dest).to_string()),
            "tArr": r1(tm.t_arr), "tIns": r1(tm.t_ins), "tDone": r1(tm.t_done), "switches": r.switches, "guided": r.guided,
            "drove": {"streets": streets(net, drove), "slow": slow(sim, snaps, k, from, drove), "terms": terms(sim, snaps, k, from, drove).map(|t| t.json()), "timed": timed(sim, snaps, tm.t_ins, from, drove).map(r1), "actual": r1(tm.t_done - tm.t_ins), "lengthM": r1(drove.iter().map(|&l| net.links[l as usize].length).sum::<f64>())},
            "alt": alt_v, "opt": opt_v, "walk": walk_v,
        }));
    }
    let labels: Value = groups.map_or(Value::Null, |g| {
        let mut ids: Vec<String> = out.iter().flat_map(|t| [t["og"].as_str().unwrap_or("").to_string(), t["dg"].as_str().unwrap_or("").to_string()]).collect();
        ids.sort();
        ids.dedup();
        Value::Object(ids.into_iter().map(|i| (i.clone(), Value::String(g.label(&i)))).collect())
    });
    std::fs::write(path, serde_json::to_string(&json!({"labels": labels, "trips": out})).unwrap()).expect("write od-costs");
}
