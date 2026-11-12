//! Pedestrians (decision D4): sidewalk walking, crossings at nodes and marked mid-block crossings, driver yielding, signal
//! phases, and the vehicle-pedestrian safety surrogates (D5).
//!
//! Pedestrians do not interact with vehicles along a link; they meet them only at crosswalks. Each node has one crosswalk per
//! leg (street direction incident to the node) and each marked mid-block crossing is one crosswalk shared by both directions
//! of its street. A pedestrian's route is a shortest-walking-distance path over sidewalk waypoints, turned into a list of
//! walk and cross steps at spawn.

use super::*;
use std::cmp::Reverse;
use std::collections::BinaryHeap;

pub(super) const NONE_XW: u32 = u32::MAX;

/// Walking speed (m/s) from the normal fit in `params::PED_V_MEAN` ([Fitzpatrick2006]); the clip bounds are ASSUMPTION.
pub(super) fn sample_speed(rng: &mut Rng) -> f32 {
    (PED_V_MEAN + PED_V_SD * rng.normal()).clamp(PED_V_MIN, PED_V_MAX) as f32
}

/// Lognormal multiplier on the 3 s start-up margin of the critical gap ([Fitzpatrick2006] Table 11); the spread is ASSUMPTION.
pub(super) fn sample_gap(rng: &mut Rng) -> f32 {
    (PED_GAP_SIGMA * rng.normal()).exp() as f32
}

pub(super) struct Xw {
    pub node: u32,
    pub width: f32,
    pub marked: bool,
    pub p_yield: f32,
    /// Links whose vehicles approach this crosswalk, and (nodes only) links whose vehicles leave over it.
    pub in_links: Vec<u32>,
    pub out_links: Vec<u32>,
    pub crossing: u32,
    pub waiting: u32,
    pub last_clear_t: f64,
    pub last_pass_t: f64,
    pub last_pass_uid: u32,
    pub last_pass_v: f32,
    pub last_ped: u32,
    pub last_pair: (u32, u32),
}

impl Xw {
    /// Does the driver of vehicle `uid`, `d` m from the stop line at speed `v`, yield to the waiting pedestrian? The yield draw
    /// is a fixed function of (driver, crosswalk) with probability `p_yield`; a driver who can no longer stop comfortably
    /// cannot yield and one who is too far away has not yet reacted.
    pub fn yields(&self, id: u32, uid: u32, v: f32, d: f32) -> bool {
        if self.waiting == 0 {
            return false;
        }
        let u = hash32(uid, id) as f32 / u32::MAX as f32;
        u < self.p_yield && d <= v * v / (2.0 * PED_B_COMF) + PED_MIN_DECIDE_M && d >= v * v / (2.0 * PED_EMERGENCY_B) - 0.5
    }
}

#[derive(Clone, Copy)]
pub(super) enum Step {
    Walk { link: u32, from: f32, to: f32 },
    Cross { xw: u32, a_link: u32, a_pos: f32, b_link: u32, b_pos: f32, walk_leg: u32 },
}

const ST_WALK: u8 = 0;
const ST_WAIT: u8 = 1;
const ST_CROSS: u8 = 2;

pub(super) struct Ped {
    alive: bool,
    uid: u32,
    v: f32,
    gap_f: f32,
    steps: Vec<Step>,
    si: usize,
    pos: f32,
    state: u8,
    prog: f32,
    t_depart: f64,
    wait_t: f32,
}

#[derive(Clone, Copy)]
enum Kind {
    Along,
    Mid(u32),
    Node(u32),
}

#[derive(Clone, Copy)]
struct Edge {
    to: u32,
    cost: f32,
    kind: Kind,
}

struct NodeEdge {
    walk_leg: u32,
    xws: Vec<u32>,
}

struct Leg {
    angle: f64,
    links: Vec<u32>,
}

#[derive(Default)]
pub(super) struct PedWorld {
    pub xws: Vec<Xw>,
    /// Per link: marked mid-block crossings as (position along the link, crosswalk).
    pub mid: Vec<Vec<(f32, u32)>>,
    /// Per link: the node crosswalk its vehicles approach (in-link) / drive over when leaving a node (out-link).
    pub link_xw_in: Vec<u32>,
    pub link_xw_out: Vec<u32>,
    leg_in: Vec<u32>,
    leg_out: Vec<u32>,
    legs: Vec<Vec<Leg>>,
    // sidewalk graph
    state_link: Vec<u32>,
    state_pos: Vec<f32>,
    adj: Vec<Vec<Edge>>,
    node_edges: Vec<NodeEdge>,
    node_states: Vec<Vec<u32>>,
    cache: Vec<(u32, Vec<f32>)>,
    peds: Vec<Ped>,
    free: Vec<u32>,
    alive: usize,
    completed: u64,
    trip_time_sum: f64,
    cross_delay_sum: f64,
    crossings_done: u64,
    pub unroutable: u64,
}

impl PedWorld {
    pub fn n_alive(&self) -> usize {
        self.alive
    }

    pub fn mode_metrics(&self) -> PedMode {
        PedMode {
            in_network: self.alive as u64,
            completed_trips: self.completed,
            mean_trip_time: if self.completed > 0 { self.trip_time_sum / self.completed as f64 } else { 0.0 },
            mean_crossing_delay: if self.crossings_done > 0 { self.cross_delay_sum / self.crossings_done as f64 } else { 0.0 },
        }
    }

    pub fn build(net: &Network, topo: &Topo) -> PedWorld {
        let (nn, nl) = (topo.n_nodes, topo.n_links);
        let mut xbase = vec![0u32; nn];
        let mut w = PedWorld { mid: vec![Vec::new(); nl], link_xw_in: vec![NONE_XW; nl], link_xw_out: vec![NONE_XW; nl], leg_in: vec![0; nl], leg_out: vec![0; nl], ..Default::default() };

        // ---- legs of every node and their crosswalks
        for n in 0..nn {
            let mut inc: Vec<(f64, u32)> = Vec::new();
            for &l in topo.ins[n].iter().chain(topo.outs[n].iter()) {
                let g = &topo.geo[l as usize].pts;
                let (p, q) = if topo.link_to[l as usize] as usize == n { (g[g.len() - 1], g[g.len() - 2]) } else { (g[0], g[1]) };
                inc.push(((q[1] - p[1]).atan2(q[0] - p[0]).rem_euclid(std::f64::consts::TAU), l));
            }
            inc.sort_by(|a, b| a.partial_cmp(b).unwrap());
            let mut legs: Vec<Leg> = Vec::new();
            if !inc.is_empty() {
                // Start after the largest angular gap so that a leg is never split across the wrap-around.
                let m = inc.len();
                let mut start = 0;
                let mut best = -1.0;
                for i in 0..m {
                    let gap = (inc[(i + 1) % m].0 - inc[i].0).rem_euclid(std::f64::consts::TAU);
                    let gap = if m == 1 { std::f64::consts::TAU } else { gap };
                    if gap > best {
                        best = gap;
                        start = (i + 1) % m;
                    }
                }
                let mut prev = f64::NAN;
                for i in 0..m {
                    let (a, l) = inc[(start + i) % m];
                    let new_leg = prev.is_nan() || (a - prev).rem_euclid(std::f64::consts::TAU) > LEG_GAP_RAD;
                    if new_leg {
                        legs.push(Leg { angle: a, links: Vec::new() });
                    }
                    legs.last_mut().unwrap().links.push(l);
                    prev = a;
                }
            }
            let base = w.xws.len() as u32;
            xbase[n] = base;
            for (k, leg) in legs.iter().enumerate() {
                let lanes: u32 = leg.links.iter().map(|&l| net.links[l as usize].lanes.max(1)).sum();
                let (mut ins, mut outs) = (Vec::new(), Vec::new());
                for &l in &leg.links {
                    if topo.link_to[l as usize] as usize == n {
                        ins.push(l);
                        w.leg_in[l as usize] = k as u32;
                        w.link_xw_in[l as usize] = base + k as u32;
                    } else {
                        outs.push(l);
                        w.leg_out[l as usize] = k as u32;
                        w.link_xw_out[l as usize] = base + k as u32;
                    }
                }
                let marked = net.nodes[n].marked_crossing;
                w.xws.push(Xw {
                    node: n as u32,
                    width: lanes as f32 * PED_LANE_W,
                    marked,
                    p_yield: 0.0,
                    in_links: ins,
                    out_links: outs,
                    crossing: 0,
                    waiting: 0,
                    last_clear_t: f64::NEG_INFINITY,
                    last_pass_t: f64::NEG_INFINITY,
                    last_pass_uid: NONE_UID,
                    last_pass_v: 0.0,
                    last_ped: NONE_UID,
                    last_pair: (NONE_UID, NONE_UID),
                });
            }
            w.legs.push(legs);
        }

        // ---- mid-block crossings: one crosswalk per street, listed from the lower link id
        let mut wps: Vec<Vec<f32>> = (0..nl).map(|l| if net.links[l].has_sidewalk() { vec![0.0, topo.length[l]] } else { Vec::new() }).collect();
        let mut mids: Vec<(u32, f32)> = Vec::new();
        for l in 0..nl {
            let lk = &net.links[l];
            let Some(r) = lk.reverse else { continue };
            if !lk.has_sidewalk() || !net.links[r as usize].has_sidewalk() {
                continue;
            }
            for &p in &lk.crossings {
                let (len, lr) = (topo.length[l], topo.length[r as usize]);
                let p = (p as f32).clamp(MID_EDGE_M, (len - MID_EDGE_M).max(MID_EDGE_M));
                if (l as u32) < r {
                    mids.push((l as u32, p));
                } else {
                    mids.push((r, (lr - p * lr / len).clamp(0.0, lr)));
                }
            }
        }
        mids.sort_by(|a, b| a.partial_cmp(b).unwrap());
        mids.dedup_by(|a, b| a.0 == b.0 && (a.1 - b.1).abs() < 2.0);
        let mut mid_pairs: Vec<(u32, f32, u32, f32, u32)> = Vec::new(); // (link a, pos a, link b, pos b, xw)
        for &(l, p) in &mids {
            let r = net.links[l as usize].reverse.unwrap();
            let (len, lr) = (topo.length[l as usize], topo.length[r as usize]);
            let pr = (lr - p * lr / len).clamp(0.0, lr);
            let id = w.xws.len() as u32;
            w.xws.push(Xw {
                node: NONE_XW,
                width: (net.links[l as usize].lanes.max(1) + net.links[r as usize].lanes.max(1)) as f32 * PED_LANE_W,
                marked: true,
                p_yield: 0.0,
                in_links: vec![l, r],
                out_links: Vec::new(),
                crossing: 0,
                waiting: 0,
                last_clear_t: f64::NEG_INFINITY,
                last_pass_t: f64::NEG_INFINITY,
                last_pass_uid: NONE_UID,
                last_pass_v: 0.0,
                last_ped: NONE_UID,
                last_pair: (NONE_UID, NONE_UID),
            });
            w.mid[l as usize].push((p, id));
            w.mid[r as usize].push((pr, id));
            let (a, b) = (&mut wps[l as usize], pr);
            a.push(p);
            wps[r as usize].push(b);
            mid_pairs.push((l, p, r, pr, id));
        }
        for v in wps.iter_mut() {
            v.sort_by(|a, b| a.partial_cmp(b).unwrap());
        }
        for m in w.mid.iter_mut() {
            m.sort_by(|a, b| a.partial_cmp(b).unwrap());
        }

        // ---- sidewalk graph
        let mut sbase = vec![0u32; nl];
        for l in 0..nl {
            sbase[l] = w.state_link.len() as u32;
            for &p in &wps[l] {
                w.state_link.push(l as u32);
                w.state_pos.push(p);
            }
        }
        let ns = w.state_link.len();
        w.adj = vec![Vec::new(); ns];
        let find = |l: usize, p: f32| -> u32 {
            let k = wps[l].iter().position(|&x| (x - p).abs() < 1e-3).unwrap_or(0);
            sbase[l] + k as u32
        };
        for l in 0..nl {
            for k in 1..wps[l].len() {
                let (a, b) = (sbase[l] + k as u32 - 1, sbase[l] + k as u32);
                let c = wps[l][k] - wps[l][k - 1];
                w.adj[a as usize].push(Edge { to: b, cost: c, kind: Kind::Along });
                w.adj[b as usize].push(Edge { to: a, cost: c, kind: Kind::Along });
            }
        }
        for &(la, pa, lb, pb, id) in &mid_pairs {
            let (a, b) = (find(la as usize, pa), find(lb as usize, pb));
            let c = (w.xws[id as usize].width - PED_MIDBLOCK_BONUS_M).max(0.1);
            w.adj[a as usize].push(Edge { to: b, cost: c, kind: Kind::Mid(id) });
            w.adj[b as usize].push(Edge { to: a, cost: c, kind: Kind::Mid(id) });
        }
        w.node_states = vec![Vec::new(); nn];
        for n in 0..nn {
            let legs = &w.legs[n];
            let m = legs.len();
            // (state at this node, corner)
            let mut ends: Vec<(u32, u32, u32)> = Vec::new(); // (state, corner, leg)
            for (k, leg) in legs.iter().enumerate() {
                for &l in &leg.links {
                    if !net.links[l as usize].has_sidewalk() {
                        continue;
                    }
                    let inn = topo.link_to[l as usize] as usize == n;
                    let st = if inn { sbase[l as usize] + wps[l as usize].len() as u32 - 1 } else { sbase[l as usize] };
                    let corner = if inn { k } else { (k + m - 1) % m };
                    ends.push((st, corner as u32, k as u32));
                }
            }
            w.node_states[n] = ends.iter().map(|e| e.0).collect();
            let crossable = |k: usize| legs[k].links.iter().any(|&l| net.links[l as usize].class != RoadClass::Motorway);
            for &(sa, ca, la) in &ends {
                for &(sb, cb, _) in &ends {
                    if sa == sb || w.state_link[sa as usize] == w.state_link[sb as usize] {
                        continue;
                    }
                    let (ca, cb) = (ca as usize, cb as usize);
                    let d = (cb + m - ca) % m;
                    let ccw: Vec<usize> = (1..=d).map(|i| (ca + i) % m).collect();
                    let cw: Vec<usize> = (0..m - d).map(|i| (ca + m - i) % m).collect();
                    let ok = |v: &Vec<usize>| v.iter().all(|&k| crossable(k));
                    let pick = if ccw.len() <= cw.len() {
                        if ok(&ccw) { Some(ccw) } else if ok(&cw) { Some(cw) } else { None }
                    } else if ok(&cw) {
                        Some(cw)
                    } else if ok(&ccw) {
                        Some(ccw)
                    } else {
                        None
                    };
                    let Some(legs_crossed) = pick else { continue };
                    let xws: Vec<u32> = legs_crossed.iter().map(|&k| xbase[n] + k as u32).collect();
                    let cost: f32 = xws.iter().map(|&x| w.xws[x as usize].width).sum::<f32>() + PED_CORNER_M;
                    let ei = w.node_edges.len() as u32;
                    w.node_edges.push(NodeEdge { walk_leg: la, xws });
                    w.adj[sa as usize].push(Edge { to: sb, cost, kind: Kind::Node(ei) });
                }
            }
        }
        w
    }

    /// Distance table (m) to the destination node over sidewalk states.
    fn table(&mut self, dest: u32) -> usize {
        if let Some(i) = self.cache.iter().position(|c| c.0 == dest) {
            return i;
        }
        let mut dist = vec![f32::INFINITY; self.adj.len()];
        let mut heap: BinaryHeap<Reverse<(u32, u32)>> = BinaryHeap::new();
        for &s in &self.node_states[dest as usize] {
            dist[s as usize] = 0.0;
            heap.push(Reverse((0f32.to_bits(), s)));
        }
        while let Some(Reverse((bits, s))) = heap.pop() {
            let d = f32::from_bits(bits);
            if d > dist[s as usize] {
                continue;
            }
            // Edges are symmetric in cost; reverse search uses the same adjacency.
            for e in &self.adj[s as usize] {
                let nd = d + e.cost;
                if nd < dist[e.to as usize] {
                    dist[e.to as usize] = nd;
                    heap.push(Reverse((nd.to_bits(), e.to)));
                }
            }
        }
        if self.cache.len() >= 96 {
            self.cache.remove(0);
        }
        self.cache.push((dest, dist));
        self.cache.len() - 1
    }

    /// Steps of the shortest walk from `origin` to `dest`; None if there is none.
    fn route(&mut self, origin: u32, dest: u32) -> Option<Vec<Step>> {
        let ti = self.table(dest);
        let dist = &self.cache[ti].1;
        let mut s = *self.node_states[origin as usize].iter().min_by(|&&a, &&b| dist[a as usize].partial_cmp(&dist[b as usize]).unwrap())?;
        if !dist[s as usize].is_finite() {
            return None;
        }
        let mut steps: Vec<Step> = Vec::new();
        let mut guard = 0;
        while dist[s as usize] > 0.0 {
            guard += 1;
            if guard > 20000 {
                return None;
            }
            let mut best: Option<(f32, Edge)> = None;
            for e in &self.adj[s as usize] {
                let c = e.cost + dist[e.to as usize];
                if c.is_finite() && best.map_or(true, |(bc, _)| c < bc - 1e-4) {
                    best = Some((c, *e));
                }
            }
            let (_, e) = best?;
            let (la, pa) = (self.state_link[s as usize], self.state_pos[s as usize]);
            let (lb, pb) = (self.state_link[e.to as usize], self.state_pos[e.to as usize]);
            match e.kind {
                Kind::Along => match steps.last_mut() {
                    Some(Step::Walk { link, to, .. }) if *link == la && (*to - pa).abs() < 1e-3 => *to = pb,
                    _ => steps.push(Step::Walk { link: la, from: pa, to: pb }),
                },
                Kind::Mid(x) => steps.push(Step::Cross { xw: x, a_link: la, a_pos: pa, b_link: lb, b_pos: pb, walk_leg: 0 }),
                Kind::Node(ei) => {
                    let ne = &self.node_edges[ei as usize];
                    for &x in &ne.xws {
                        steps.push(Step::Cross { xw: x, a_link: la, a_pos: pa, b_link: lb, b_pos: pb, walk_leg: ne.walk_leg });
                    }
                }
            }
            s = e.to;
        }
        Some(steps)
    }

    pub fn draw(&self, topo: &Topo, net: &Network, out: &mut Vec<f32>) {
        let off = |l: u32| LANE_OFFSET0 + LANE_WIDTH * (topo.nmain[l as usize] as f64 - 1.0) + PED_OFFSET_M;
        let _ = net;
        for p in self.peds.iter().filter(|p| p.alive) {
            let (xy, h) = match p.steps.get(p.si) {
                Some(Step::Walk { link, from, to }) => {
                    let (pt, h) = topo.link_point(*link as usize, p.pos as f64, off(*link));
                    (pt, if to < from { h + std::f64::consts::PI } else { h })
                }
                Some(Step::Cross { a_link, a_pos, b_link, b_pos, .. }) => {
                    let (pa, _) = topo.link_point(*a_link as usize, *a_pos as f64, off(*a_link));
                    let (pb, _) = topo.link_point(*b_link as usize, *b_pos as f64, off(*b_link));
                    let u = if p.state == ST_CROSS { p.prog as f64 } else { 0.0 };
                    ([pa[0] + (pb[0] - pa[0]) * u, pa[1] + (pb[1] - pa[1]) * u], (pb[1] - pa[1]).atan2(pb[0] - pa[0]))
                }
                None => continue,
            };
            let spd = if p.state == ST_WAIT { 0.0 } else { p.v };
            out.extend_from_slice(&[xy[0] as f32, xy[1] as f32, h as f32, spd, KIND_PED as f32, 0.0]);
        }
    }
}

/// Angular gap (rad) between links that separates two legs of a node. ASSUMPTION: 25 degrees.
const LEG_GAP_RAD: f64 = 0.4363;
/// Keep mid-block crossings this far from the ends of a link (m). ASSUMPTION.
const MID_EDGE_M: f32 = 3.0;

impl Simulation {
    pub(super) fn spawn_ped(&mut self, uid: u32, origin: u32, dest: u32, t_arr: f64, v: f32, gap_f: f32) {
        let Some(steps) = self.world.route(origin, dest) else {
            self.world.unroutable += 1;
            return;
        };
        let id = match self.world.free.pop() {
            Some(i) => i as usize,
            None => {
                self.world.peds.push(Ped { alive: false, uid: 0, v: 0.0, gap_f: 1.0, steps: Vec::new(), si: 0, pos: 0.0, state: ST_WALK, prog: 0.0, t_depart: 0.0, wait_t: 0.0 });
                self.world.peds.len() - 1
            }
        };
        self.world.alive += 1;
        let p = &mut self.world.peds[id];
        *p = Ped { alive: true, uid, v, gap_f, steps, si: 0, pos: 0.0, state: ST_WALK, prog: 0.0, t_depart: t_arr, wait_t: 0.0 };
        self.ped_begin_step(id);
    }

    /// Set up the pedestrian's current step, or finish its trip.
    fn ped_begin_step(&mut self, id: usize) {
        let t = self.t;
        let p = &mut self.world.peds[id];
        match p.steps.get(p.si).copied() {
            None => {
                self.world.completed += 1;
                self.world.trip_time_sum += t - p.t_depart;
                p.alive = false;
                p.steps.clear();
                self.world.free.push(id as u32);
                self.world.alive -= 1;
            }
            Some(Step::Walk { from, .. }) => {
                p.state = ST_WALK;
                p.pos = from;
            }
            Some(Step::Cross { xw, .. }) => {
                p.state = ST_WAIT;
                p.wait_t = 0.0;
                p.prog = 0.0;
                self.world.xws[xw as usize].waiting += 1;
            }
        }
    }

    pub(super) fn update_peds(&mut self) {
        if !self.ped_on {
            return;
        }
        let dt = DT as f32;
        for id in 0..self.world.peds.len() {
            if !self.world.peds[id].alive {
                continue;
            }
            match self.world.peds[id].state {
                ST_WALK => {
                    let p = &mut self.world.peds[id];
                    let Step::Walk { from, to, .. } = p.steps[p.si] else { continue };
                    let dir = if to >= from { 1.0 } else { -1.0 };
                    p.pos += dir * p.v * dt;
                    if (p.pos - to) * dir >= 0.0 {
                        p.pos = to;
                        p.si += 1;
                        self.ped_begin_step(id);
                    }
                }
                ST_WAIT => {
                    self.world.peds[id].wait_t += dt;
                    self.ped_try_start(id);
                }
                _ => {
                    let t = self.t;
                    let p = &mut self.world.peds[id];
                    let Step::Cross { xw, .. } = p.steps[p.si] else { continue };
                    let width = self.world.xws[xw as usize].width;
                    p.prog += p.v * dt / width;
                    if p.prog >= 1.0 {
                        p.prog = 1.0;
                        p.si += 1;
                        let uid = p.uid;
                        let x = &mut self.world.xws[xw as usize];
                        x.crossing -= 1;
                        if x.crossing == 0 {
                            x.last_clear_t = t;
                            x.last_ped = uid;
                        }
                        self.ped_begin_step(id);
                    }
                }
            }
        }
    }

    pub(super) fn set_yield_probabilities(&mut self) {
        let (pm, pu) = (self.cfg.ped_yield_marked.unwrap_or(PED_YIELD_MARKED) as f32, self.cfg.ped_yield_unmarked.unwrap_or(PED_YIELD_UNMARKED) as f32);
        for x in self.world.xws.iter_mut() {
            x.p_yield = if x.marked { pm } else { pu };
        }
    }

    /// Frontmost vehicle of each lane of link `l` that has not yet reached the crosswalk stop point: (vehicle, distance to it).
    fn xw_front_vehicles(&self, l: u32, xw: u32, out: &mut Vec<(u32, f32)>) {
        let lu = l as usize;
        let target = match self.world.mid[lu].iter().find(|m| m.1 == xw) {
            Some(&(xp, _)) => xp - XW_STOP_M,
            None => self.topo.stop_pos[lu],
        };
        let limit = if self.world.mid[lu].iter().any(|m| m.1 == xw) { target + XW_STOP_M - 0.3 } else { target + 0.01 };
        for k in 0..self.topo.nlanes(lu) + self.bike_on as usize {
            for &v in &self.lanes[self.topo.qidx(lu, k)] {
                let veh = &self.vehs[v as usize];
                if veh.pos <= limit {
                    out.push((v, target - veh.pos));
                    break;
                }
            }
        }
    }

    fn ped_try_start(&mut self, id: usize) {
        let (xw, walk_leg, v, gap_f) = {
            let p = &self.world.peds[id];
            let Step::Cross { xw, walk_leg, .. } = p.steps[p.si] else { return };
            (xw, walk_leg, p.v, p.gap_f)
        };
        let node = self.world.xws[xw as usize].node;
        let ctrl = if node == NONE_XW { Control::Uncontrolled } else { self.eff.ctrl[node as usize] };
        let ok = if node != NONE_XW && ctrl == Control::Signal && self.ped_phase_known(node, walk_leg) {
            // At a signal: cross with the phase that serves the street being walked along, when no vehicle is in the crosswalk.
            self.ped_phase_green(node, walk_leg) && !self.transit_over_xw(node, xw)
        } else {
            let width = self.world.xws[xw as usize].width;
            let t_crit = width / v + PED_GAP_MARGIN_S * gap_f;
            self.ped_gap_ok(xw, t_crit)
        };
        if !ok {
            return;
        }
        let t = self.t;
        let (uid, wait) = {
            let p = &mut self.world.peds[id];
            p.state = ST_CROSS;
            p.prog = 0.0;
            (p.uid, p.wait_t)
        };
        self.world.cross_delay_sum += wait as f64;
        self.world.crossings_done += 1;
        // Post-encroachment time against the last vehicle that passed [Mahmud2017].
        let (lp_uid, lp_v, pet) = {
            let x = &self.world.xws[xw as usize];
            (x.last_pass_uid, x.last_pass_v, (t - x.last_pass_t) as f32)
        };
        let x = &mut self.world.xws[xw as usize];
        x.waiting -= 1;
        x.crossing += 1;
        x.last_ped = uid;
        if lp_uid != NONE_UID && pet < PET_ENCOUNTER_S && x.last_pair != (lp_uid, uid) {
            x.last_pair = (lp_uid, uid);
            self.vuln.ped_encounter(pet, lp_v);
        }
    }

    fn ped_phase_known(&self, node: u32, walk_leg: u32) -> bool {
        self.ped_phase(node, walk_leg).is_some()
    }

    /// Phase of the signal at `node` serving the street whose leg is `walk_leg`: the phase holding one of its approach links,
    /// else the phase whose approaches lie on the same axis within `PHASE_AXIS_DEG`.
    fn ped_phase(&self, node: u32, walk_leg: u32) -> Option<usize> {
        let plan = self.eff.sig[node as usize].as_ref()?;
        if plan.always_green {
            return None;
        }
        let n = node as usize;
        for (ph, links) in plan.links.iter().enumerate() {
            if links.iter().any(|&l| self.topo.link_to[l as usize] as usize == n && self.world.leg_in[l as usize] == walk_leg) {
                return Some(ph);
            }
        }
        let ang = self.world.legs[n].get(walk_leg as usize)?.angle;
        let axial = |a: f64, b: f64| {
            let d = norm_angle(a - b).abs();
            (if d > std::f64::consts::FRAC_PI_2 { std::f64::consts::PI - d } else { d }).to_degrees()
        };
        for (ph, links) in plan.links.iter().enumerate() {
            for &l in links {
                if let Some(leg) = self.world.legs[n].get(self.world.leg_in[l as usize] as usize) {
                    if axial(leg.angle, ang) < PHASE_AXIS_DEG {
                        return Some(ph);
                    }
                }
            }
        }
        None
    }

    fn ped_phase_green(&self, node: u32, walk_leg: u32) -> bool {
        match (self.ped_phase(node, walk_leg), self.eff.sig[node as usize].as_ref()) {
            (Some(ph), Some(plan)) => phase_state(plan, ph, self.t) == 1,
            _ => true,
        }
    }

    /// A vehicle crossing the node is bound over this crosswalk (it enters or leaves over it).
    fn transit_over_xw(&self, node: u32, xw: u32) -> bool {
        let x = &self.world.xws[xw as usize];
        self.transit[node as usize].iter().any(|t| {
            let m = &self.topo.mvs[t.mv as usize];
            x.in_links.contains(&m.a) || x.out_links.contains(&m.b)
        })
    }

    /// Can the pedestrian step off? Yielding drivers will stop; the others must be at least `t_crit` s away.
    fn ped_gap_ok(&self, xw: u32, t_crit: f32) -> bool {
        let x = &self.world.xws[xw as usize];
        let mut fronts: Vec<(u32, f32)> = Vec::new();
        for &l in &x.in_links {
            self.xw_front_vehicles(l, xw, &mut fronts);
        }
        for &(vid, d) in &fronts {
            let v = &self.vehs[vid as usize];
            if x.yields(xw, v.uid, v.v, d) || v.v < PED_STANDING_V {
                continue;
            }
            if d / v.v < t_crit {
                return false;
            }
        }
        if x.node != NONE_XW {
            let node = x.node as usize;
            if self.transit_over_xw(x.node, xw) {
                return false;
            }
            // Turning vehicles about to leave over this crosswalk.
            for &e in &self.topo.ins[node] {
                if x.in_links.contains(&e) {
                    continue;
                }
                for k in 0..self.topo.nlanes(e as usize) + self.bike_on as usize {
                    if let Some(&f) = self.lanes[self.topo.qidx(e as usize, k)].front() {
                        let fv = &self.vehs[f as usize];
                        if fv.next().map_or(false, |b| x.out_links.contains(&b)) && fv.v >= PED_STANDING_V {
                            let d = (self.topo.stop_pos[e as usize] - fv.pos).max(0.0);
                            if d / fv.v < t_crit {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        true
    }

    pub(super) fn ped_block_head(&self, vid: u32, l: usize, ctrl: Control) -> bool {
        let veh = &self.vehs[vid as usize];
        veh.next().map_or(false, |b| self.ped_block(veh, l as u32, b, ctrl))
    }

    /// Must the head vehicle of link `l`, bound for link `b`, hold for a crosswalk? A pedestrian in the crosswalk always stops
    /// it; a waiting pedestrian stops it when the driver yields (not at signals, where pedestrians wait for their phase).
    pub(super) fn ped_block(&self, veh: &Veh, l: u32, b: u32, ctrl: Control) -> bool {
        let d = (self.topo.stop_pos[l as usize] - veh.pos).max(0.0);
        for xw in [self.world.link_xw_in[l as usize], self.world.link_xw_out[b as usize]] {
            if xw == NONE_XW {
                continue;
            }
            let x = &self.world.xws[xw as usize];
            if x.crossing > 0 {
                return true;
            }
            if ctrl != Control::Signal && x.yields(xw, veh.uid, veh.v, d) {
                return true;
            }
        }
        false
    }

    pub(super) fn xw_vehicle_pass(&mut self, xw: u32, uid: u32, speed: f32, held: bool) {
        let t = self.t;
        let x = &mut self.world.xws[xw as usize];
        let pair = (uid, x.last_ped);
        if held {
            // The driver stopped for a pedestrian: exposure at its low speed, not a conflict.
            x.last_pair = pair;
            self.vuln.ped_exposure(speed);
        } else if x.last_ped != NONE_UID && x.last_pair != pair {
            if x.crossing > 0 {
                x.last_pair = pair;
                self.vuln.ped_encounter(0.0, speed);
            } else {
                let pet = (t - x.last_clear_t) as f32;
                if pet < PET_ENCOUNTER_S {
                    x.last_pair = pair;
                    self.vuln.ped_encounter(pet, speed);
                }
            }
        }
        let x = &mut self.world.xws[xw as usize];
        x.last_pass_t = t;
        x.last_pass_uid = uid;
        x.last_pass_v = speed;
    }

    /// The front of vehicle `vid` moved from `x0` to `x` on link `l`: score any mid-block crosswalk it crossed.
    pub(super) fn mid_block_passes(&mut self, vid: u32, l: usize, x0: f32, x: f32, v: f32) {
        if self.vehs[vid as usize].kind == KIND_BIKE {
            return;
        }
        let uid = self.vehs[vid as usize].uid;
        for i in 0..self.world.mid[l].len() {
            let (xp, xw) = self.world.mid[l][i];
            if x0 < xp && x >= xp {
                let held = std::mem::replace(&mut self.vehs[vid as usize].ped_held, false);
                self.xw_vehicle_pass(xw, uid, v, held);
            }
        }
    }
}

#[cfg(test)]
impl Simulation {
    pub(super) fn spawn_ped_mid(&mut self, uid: u32, xw: u32, v: f32) {
        let (l, p) = self.world.mid.iter().enumerate().find_map(|(l, m)| m.iter().find(|e| e.1 == xw).map(|e| (l as u32, e.0))).unwrap();
        let r = self.net.links[l as usize].reverse.unwrap();
        let pr = self.world.mid[r as usize].iter().find(|e| e.1 == xw).unwrap().0;
        let steps = vec![
            Step::Walk { link: l, from: 0.0, to: p },
            Step::Cross { xw, a_link: l, a_pos: p, b_link: r, b_pos: pr, walk_leg: 0 },
            Step::Walk { link: r, from: pr, to: self.topo.length[r as usize] },
        ];
        let id = self.world.peds.len();
        self.world.peds.push(Ped { alive: true, uid, v, gap_f: 1.0, steps, si: 0, pos: 0.0, state: ST_WALK, prog: 0.0, t_depart: self.t, wait_t: 0.0 });
        self.world.alive += 1;
        self.ped_begin_step(id);
    }
}
