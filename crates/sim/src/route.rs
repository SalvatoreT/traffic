//! Turn-aware time-shortest-path routing over links [Wardrop1952], [Peeta2001].
//!
//! One reverse Dijkstra per destination node yields, for every link, the cost-to-go from the *start*
//! of that link. Tables are cached per destination for one cost epoch. A route is then walked
//! forward choosing, at each node, the movement minimizing (turn cost + cost-to-go). That walk is the route of a driver without
//! perception error. A driver with perception error routes on perceived costs drawn once for the trip (`Perceived`).

use crate::eff::Eff;
use crate::rng::hash32;
use crate::topo::Topo;
use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap};

pub const INF: f32 = f32::INFINITY;
/// Noise seed meaning "no perceived-cost noise".
pub const NO_NOISE: u32 = u32::MAX;

/// Per-mode view of the effective network used by the router: which links and movements are usable, movement costs and the
/// perceived-cost weight of each link.
#[derive(Clone, Copy)]
pub struct Modal<'a> {
    pub closed: &'a [bool],
    pub mv_ok: &'a [bool],
    pub mv_cost: &'a [f32],
    pub w: &'a [f32],
}

impl Eff {
    pub fn car_modal(&self) -> Modal<'_> {
        Modal { closed: &self.closed, mv_ok: &self.mv_ok, mv_cost: &self.mv_cost, w: &self.route_w }
    }
    /// Car costs without the measured movement times a running simulation adds to `mv_cost`: for routing on free-flow link times.
    pub fn static_modal(&self) -> Modal<'_> {
        Modal { closed: &self.closed, mv_ok: &self.mv_ok, mv_cost: &self.mv_static, w: &self.route_w }
    }
    pub fn bike_modal(&self) -> Modal<'_> {
        Modal { closed: &self.bike_closed, mv_ok: &self.bike_mv_ok, mv_cost: &self.bike_mv_cost, w: &self.bike_w }
    }
}

pub struct Router {
    pub tables: Vec<Option<Vec<f32>>>,
    /// Cost-to-go from the start of every link through one target link (the first leg of a trip that must make an assumed movement), each entry including the cost of the link itself and of the target link, cached per target for one cost epoch.
    pub link_tables: HashMap<u32, Vec<f32>>,
    heap: BinaryHeap<Reverse<(u32, u32)>>,
}

const SALT_MV: u32 = 0x5EED_0D15;
const SALT_LAST: u32 = 0x0F1E_57D1;
const Z_BITS: u32 = 12;

/// Standard normal quantile by P. J. Acklam's rational approximation (relative error below 1.2e-9); libm only, so native and WASM agree.
fn inv_norm(p: f64) -> f64 {
    const A: [f64; 6] = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
    const B: [f64; 5] = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
    const C: [f64; 6] = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const D: [f64; 4] = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
    let tail = |q: f64| (((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) / ((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q + 1.0);
    if p < 0.02425 {
        tail(libm::sqrt(-2.0 * libm::log(p)))
    } else if p > 1.0 - 0.02425 {
        -tail(libm::sqrt(-2.0 * libm::log(1.0 - p)))
    } else {
        let q = p - 0.5;
        let r = q * q;
        (((((A[0] * r + A[1]) * r + A[2]) * r + A[3]) * r + A[4]) * r + A[5]) * q / (((((B[0] * r + B[1]) * r + B[2]) * r + B[3]) * r + B[4]) * r + 1.0)
    }
}

/// Standard normal deviate fixed per (driver, key): the quantile of the midpoint of one of 4,096 equal-probability bins picked by a hash.
#[inline]
fn z(seed: u32, key: u32) -> f32 {
    static T: std::sync::OnceLock<Vec<f32>> = std::sync::OnceLock::new();
    let t = T.get_or_init(|| (0..1u32 << Z_BITS).map(|i| inv_norm((i as f64 + 0.5) / (1u32 << Z_BITS) as f64) as f32).collect());
    t[(hash32(seed, key) >> (32 - Z_BITS)) as usize]
}

/// Perceived cost of an arc of measured cost `e` (s) for driver `seed`: normal with mean `e` and variance `beta` x `e`, truncated at zero,
/// drawn once per (driver, arc) [DaganzoSheffi1977], [Sheffi1985] (ch. 11, eq. 11.12; variance proportional to the measured time, so the
/// variance of a route is `beta` times its cost however many arcs it has). `beta` (s) is the variance over an arc of unit cost.
#[inline]
pub fn perceive(e: f32, beta: f32, seed: u32, salt: u32, key: u32) -> f32 {
    if seed == NO_NOISE || beta <= 0.0 {
        return e;
    }
    (e + (beta * e.max(0.0)).sqrt() * z(seed ^ salt, key)).max(0.0)
}

/// Perceived traversal of the approach and its outgoing movement, drawn once per (driver, movement).
#[inline]
pub fn perceive_mv(e: f32, beta: f32, seed: u32, mv: u32) -> f32 {
    perceive(e, beta, seed, SALT_MV, mv)
}

/// Perceived cost of the final link, where no outgoing movement is taken, one draw per (driver, link).
#[inline]
pub fn perceive_last(e: f32, beta: f32, seed: u32, link: u32) -> f32 {
    perceive(e, beta, seed, SALT_LAST, link)
}

#[derive(Clone, Copy, Debug)]
pub enum From {
    Node(u32),
    Link(u32),
}

#[derive(Clone, Copy, Debug)]
pub enum Goal {
    Dest(u32),
    Link(u32),
}

/// Shortest path on one driver's perceived costs: the probit route choice of stochastic network loading, where each driver is one draw of
/// the perceived link times and takes the shortest path on them [DaganzoSheffi1977], [Sheffi1985] (ch. 11.2). The draw is fixed for the trip
/// (deterministic from the driver's seed), so re-planning en route uses the same perception on current measured times. Forward Dijkstra
/// over link starts; a goal link also pays its terminal traversal. Ties break on link id.
#[derive(Clone, Default)]
pub struct Perceived {
    dist: Vec<f32>,
    pred: Vec<u32>,
    heap: BinaryHeap<Reverse<(u32, u32)>>,
}

impl Perceived {
    /// Links from `from` to `goal` (for `From::Node` the first link included; for `From::Link(l)` the links after `l`; the goal link last)
    /// appended to `out`, and their perceived cost; None when unreachable. `first_ok` filters the first link taken.
    #[allow(clippy::too_many_arguments)]
    pub fn search(&mut self, topo: &Topo, m: Modal<'_>, cost: &[f32], beta: f32, seed: u32, from: From, goal: Goal, first_ok: &dyn Fn(u32) -> bool, out: &mut Vec<u32>) -> Option<f32> {
        let n = topo.n_links;
        let done = |l| goal.reached(topo, l);
        if let From::Link(l) = from {
            if done(l) {
                return Some(0.0);
            }
        }
        self.dist.clear();
        self.dist.resize(n, INF);
        self.pred.clear();
        self.pred.resize(n, u32::MAX);
        self.heap.clear();
        let arc = |l: u32| cost[l as usize] * m.w[l as usize];
        match from {
            From::Node(o) => {
                for &b in &topo.outs[o as usize] {
                    if m.closed[b as usize] || !first_ok(b) {
                        continue;
                    }
                    self.dist[b as usize] = 0.0;
                    self.heap.push(Reverse((0, b)));
                }
            }
            From::Link(l) => self.relax(topo, m, cost, beta, seed, l, 0.0, Some(first_ok)),
        }
        let mut hit: Option<(u32, f32)> = None;
        while let Some(Reverse((bits, a))) = self.heap.pop() {
            let d = f32::from_bits(bits);
            if hit.is_some_and(|(_, best)| d > best) {
                break;
            }
            if d > self.dist[a as usize] {
                continue;
            }
            if done(a) {
                let total = d + perceive_last(arc(a), beta, seed, a);
                if hit.is_none_or(|(link, best)| total < best || (total == best && a < link)) {
                    hit = Some((a, total));
                }
                continue;
            }
            self.relax(topo, m, cost, beta, seed, a, d, None);
        }
        let (g, d) = hit?;
        let mark = out.len();
        let mut l = g;
        loop {
            out.push(l);
            let p = self.pred[l as usize];
            if p == u32::MAX {
                break;
            }
            l = p;
        }
        out[mark..].reverse();
        Some(d)
    }

    #[allow(clippy::too_many_arguments)]
    #[inline]
    fn relax(&mut self, topo: &Topo, m: Modal<'_>, cost: &[f32], beta: f32, seed: u32, a: u32, d: f32, first_ok: Option<&dyn Fn(u32) -> bool>) {
        let ms = topo.lm_start[a as usize];
        for mv in ms..ms + topo.lm_cnt[a as usize] {
            if !m.mv_ok[mv as usize] {
                continue;
            }
            let b = topo.mvs[mv as usize].b;
            if m.closed[b as usize] || first_ok.is_some_and(|f| !f(b)) {
                continue;
            }
            let c = d + perceive_mv(m.mv_cost[mv as usize] + cost[a as usize] * m.w[a as usize], beta, seed, mv);
            if c < self.dist[b as usize] {
                self.dist[b as usize] = c;
                self.pred[b as usize] = if first_ok.is_some() { u32::MAX } else { a };
                self.heap.push(Reverse((c.to_bits(), b)));
            }
        }
    }
}

impl Goal {
    pub fn reached(self, topo: &Topo, link: u32) -> bool {
        match self { Goal::Dest(d) => topo.link_to[link as usize] == d, Goal::Link(l) => link == l }
    }
}

impl Router {
    pub fn ensure_goal(&mut self, goal: Goal, topo: &Topo, modal: Modal<'_>, cost: &[f32]) {
        match goal {
            Goal::Dest(d) => self.ensure_m(d, topo, modal, cost),
            Goal::Link(l) => self.ensure_link_m(l, topo, modal, cost),
        }
    }

    pub fn goal_table(&self, goal: Goal) -> &[f32] {
        match goal { Goal::Dest(d) => self.table(d), Goal::Link(l) => &self.link_tables[&l] }
    }

    pub fn new(n_nodes: usize) -> Router {
        Router { tables: (0..n_nodes).map(|_| None).collect(), link_tables: HashMap::new(), heap: BinaryHeap::new() }
    }

    pub fn invalidate(&mut self) {
        for t in self.tables.iter_mut() {
            *t = None;
        }
        self.link_tables.clear();
    }

    /// Cost-to-go from the start of every link through link `target`, the target's own cost included (the table of a trip's first leg when it must pass `target`).
    pub fn ensure_link(&mut self, target: u32, topo: &Topo, eff: &Eff, cost: &[f32]) {
        self.ensure_link_m(target, topo, eff.car_modal(), cost);
    }

    pub fn ensure_link_m(&mut self, target: u32, topo: &Topo, m: Modal<'_>, cost: &[f32]) {
        if self.link_tables.contains_key(&target) {
            return;
        }
        let mut h = vec![INF; topo.n_links];
        self.heap.clear();
        if !m.closed[target as usize] {
            h[target as usize] = cost[target as usize] * m.w[target as usize];
            self.heap.push(Reverse((h[target as usize].to_bits(), target)));
        }
        while let Some(Reverse((bits, l))) = self.heap.pop() {
            let hl = f32::from_bits(bits);
            if hl > h[l as usize] {
                continue;
            }
            for &mv in &topo.preds[l as usize] {
                if !m.mv_ok[mv as usize] {
                    continue;
                }
                let a = topo.mvs[mv as usize].a as usize;
                if m.closed[a] || a == target as usize {
                    continue;
                }
                let cand = cost[a] * m.w[a] + m.mv_cost[mv as usize] + hl;
                if cand < h[a] {
                    h[a] = cand;
                    self.heap.push(Reverse((cand.to_bits(), a as u32)));
                }
            }
        }
        self.link_tables.insert(target, h);
    }

    pub fn ensure(&mut self, dest: u32, topo: &Topo, eff: &Eff, cost: &[f32]) {
        self.ensure_m(dest, topo, eff.car_modal(), cost);
    }

    pub fn ensure_m(&mut self, dest: u32, topo: &Topo, eff: Modal<'_>, cost: &[f32]) {
        if self.tables[dest as usize].is_some() {
            return;
        }
        let mut h = vec![INF; topo.n_links];
        self.heap.clear();
        for l in 0..topo.n_links {
            if topo.link_to[l] == dest && !eff.closed[l] {
                h[l] = cost[l] * eff.w[l];
                self.heap.push(Reverse((h[l].to_bits(), l as u32)));
            }
        }
        while let Some(Reverse((bits, l))) = self.heap.pop() {
            let hl = f32::from_bits(bits);
            if hl > h[l as usize] {
                continue;
            }
            for &mv in &topo.preds[l as usize] {
                if !eff.mv_ok[mv as usize] {
                    continue;
                }
                let a = topo.mvs[mv as usize].a as usize;
                if eff.closed[a] || topo.link_to[a] == dest {
                    continue;
                }
                let cand = cost[a] * eff.w[a] + eff.mv_cost[mv as usize] + hl;
                if cand < h[a] {
                    h[a] = cand;
                    self.heap.push(Reverse((cand.to_bits(), a as u32)));
                }
            }
        }
        self.tables[dest as usize] = Some(h);
    }

    /// Cost-to-go table for `dest` (must have been `ensure`d).
    pub fn table(&self, dest: u32) -> &[f32] {
        self.tables[dest as usize].as_ref().unwrap()
    }
}

/// Choose the first link out of `origin` toward `dest`. Returns the link or None if unroutable.
pub fn first_link(table: &[f32], topo: &Topo, eff: &Eff, origin: u32) -> Option<u32> {
    first_link_m(table, topo, eff.car_modal(), origin)
}

pub fn first_link_m(table: &[f32], topo: &Topo, eff: Modal<'_>, origin: u32) -> Option<u32> {
    let mut best: Option<(f32, u32)> = None;
    for &b in &topo.outs[origin as usize] {
        if eff.closed[b as usize] {
            continue;
        }
        let h = table[b as usize];
        if !h.is_finite() {
            continue;
        }
        let c = h;
        if best.map_or(true, |(bc, _)| c < bc) {
            best = Some((c, b));
        }
    }
    best.map(|x| x.1)
}

/// Walk forward from the end of link `from` to `dest` on the table's costs (no perception error), appending the following links to `route`.
pub fn walk(table: &[f32], topo: &Topo, eff: &Eff, from: u32, dest: u32, route: &mut Vec<u32>) -> bool {
    walk_m(table, topo, eff.car_modal(), from, dest, route)
}

pub fn walk_m(table: &[f32], topo: &Topo, eff: Modal<'_>, from: u32, dest: u32, route: &mut Vec<u32>) -> bool {
    let mut l = from;
    let mut steps = 0;
    loop {
        if topo.link_to[l as usize] == dest {
            return true;
        }
        let ms = topo.lm_start[l as usize];
        let mc = topo.lm_cnt[l as usize];
        let mut best: Option<(f32, u32)> = None;
        for m in ms..ms + mc {
            if !eff.mv_ok[m as usize] {
                continue;
            }
            let b = topo.mvs[m as usize].b;
            let h = table[b as usize];
            if !h.is_finite() {
                continue;
            }
            let c = h + eff.mv_cost[m as usize];
            if best.map_or(true, |(bc, _)| c < bc) {
                best = Some((c, b));
            }
        }
        match best {
            Some((_, b)) => {
                route.push(b);
                l = b;
            }
            None => return false,
        }
        steps += 1;
        if steps > 4000 {
            return false;
        }
    }
}

/// Walk forward from the end of link `from` until link `target` is entered, appending the links after `from` (including `target`) to `route`.
pub fn walk_to_link(table: &[f32], topo: &Topo, eff: &Eff, from: u32, target: u32, route: &mut Vec<u32>) -> bool {
    let m = eff.car_modal();
    let (mut l, mut steps) = (from, 0);
    while l != target {
        let ms = topo.lm_start[l as usize];
        let mut best: Option<(f32, u32)> = None;
        for mv in ms..ms + topo.lm_cnt[l as usize] {
            if !m.mv_ok[mv as usize] {
                continue;
            }
            let b = topo.mvs[mv as usize].b;
            let h = table[b as usize];
            if !h.is_finite() {
                continue;
            }
            let c = h + m.mv_cost[mv as usize];
            if best.map_or(true, |(bc, _)| c < bc) {
                best = Some((c, b));
            }
        }
        let Some((_, b)) = best else { return false };
        route.push(b);
        l = b;
        steps += 1;
        if steps > 4000 {
            return false;
        }
    }
    true
}
