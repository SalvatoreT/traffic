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

// Visit time ranges in ascending order, revisiting any link whose exact f32 label
// improves inside the current range. Bin width affects workload only.
const LAST_BIN: usize = 511;
const MAX_BIN_POPS: usize = 1024;
fn time_bin(seconds: f32) -> usize {
    ((seconds as usize) / 4).min(LAST_BIN)
}

fn cost_key(cost: f32, link: u32) -> u64 {
    (u64::from(cost.to_bits()) << 32) | u64::from(link)
}

fn unpack_key(key: u64) -> (f32, u32) {
    (f32::from_bits((key >> 32) as u32), key as u32)
}

#[derive(Clone, Default)]
struct CostQueue {
    bins: Vec<Vec<u64>>,
    overflow: BinaryHeap<Reverse<u64>>,
    first: usize,
    last: usize,
    pops_in_bin: usize,
    ordered: bool,
}

impl CostQueue {
    fn clear(&mut self) {
        self.overflow.clear();
        self.ordered = false;
        self.pops_in_bin = 0;
        if self.first <= self.last && self.last < self.bins.len() {
            for bin in &mut self.bins[self.first..=self.last] { bin.clear(); }
        }
        self.first = self.bins.len();
        self.last = 0;
    }

    #[inline]
    fn push(&mut self, cost: f32, link: u32) {
        // Four seconds per bin, capped to keep memory bounded on large networks.
        let bin = time_bin(cost);
        if bin == LAST_BIN || self.ordered {
            self.overflow.push(Reverse(cost_key(cost, link)));
            return;
        }
        if bin >= self.bins.len() {
            self.bins.resize_with(bin + 1, Vec::new);
        }
        self.first = self.first.min(bin);
        self.last = self.last.max(bin);
        self.bins[bin].push(cost_key(cost, link));
    }

    // For networks with many sub-second or zero-cost arcs an entire search can fit
    // in one bin. Bound label revisits there by switching to exact distance order.
    #[cold]
    fn finish_in_heap(&mut self) {
        for bin in &mut self.bins[self.first..=self.last] {
            self.overflow.extend(bin.drain(..).map(Reverse));
        }
        self.ordered = true;
        self.first = self.bins.len();
        self.last = 0;
    }

    #[inline]
    fn pop(&mut self) -> Option<(f32, u32)> {
        while self.first <= self.last && self.first < self.bins.len() {
            if let Some(key) = self.bins[self.first].pop() {
                self.pops_in_bin += 1;
                if self.pops_in_bin == MAX_BIN_POPS { self.finish_in_heap(); }
                return Some(unpack_key(key));
            }
            self.first += 1;
            self.pops_in_bin = 0;
        }
        self.overflow.pop().map(|Reverse(key)| unpack_key(key))
    }
}

pub struct Router {
    pub tables: Vec<Option<Vec<f32>>>,
    /// Cost-to-go from the start of every link through one target link (the first leg of a trip that must make an assumed movement), each entry including the cost of the link itself and of the target link, cached per target for one cost epoch.
    pub link_tables: HashMap<u32, Vec<f32>>,
    heap: CostQueue,
    reverse: ReverseCosts,
    epoch_costs: bool,
}

// Open backward arcs and their common (driver-independent) traversal times for one
// cost epoch. A shortest-path tree can walk these slices without loading junction geometry.
#[derive(Default)]
struct ReverseCosts {
    offsets: Vec<usize>,
    arcs: Vec<(u32, f32)>,
}

impl ReverseCosts {
    fn ensure(&mut self, topo: &Topo, m: Modal<'_>, cost: &[f32]) {
        if !self.offsets.is_empty() { return; }
        self.arcs.clear();
        self.offsets.push(0);
        for predecessors in &topo.preds {
            for &mv in predecessors {
                let a = topo.mvs[mv as usize].a;
                if m.mv_ok[mv as usize] && !m.closed[a as usize] {
                    self.arcs.push((a, cost[a as usize] * m.w[a as usize] + m.mv_cost[mv as usize]));
                }
            }
            self.offsets.push(self.arcs.len());
        }
    }

    #[inline]
    fn predecessors(&self, link: usize) -> &[(u32, f32)] {
        &self.arcs[self.offsets[link]..self.offsets[link + 1]]
    }
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
fn normal_quantiles() -> &'static [f32] {
    static T: std::sync::OnceLock<Vec<f32>> = std::sync::OnceLock::new();
    T.get_or_init(|| (0..1u32 << Z_BITS).map(|i| inv_norm((i as f64 + 0.5) / (1u32 << Z_BITS) as f64) as f32).collect())
}

/// Perceived cost of an arc of measured cost `e` (s) for driver `seed`: normal with mean `e` and variance `beta` x `e`, truncated at zero,
/// drawn once per (driver, arc) [DaganzoSheffi1977], [Sheffi1985] (ch. 11, eq. 11.12; variance proportional to the measured time, so the
/// variance of a route is `beta` times its cost however many arcs it has). `beta` (s) is the variance over an arc of unit cost.
#[inline]
pub fn perceive(e: f32, beta: f32, seed: u32, salt: u32, key: u32) -> f32 {
    if seed == NO_NOISE || beta <= 0.0 {
        return e;
    }
    (e + (beta * e.max(0.0)).sqrt() * normal_quantiles()[(hash32(seed ^ salt, key) >> (32 - Z_BITS)) as usize]).max(0.0)
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
    queue: SearchQueue,
    offsets: Vec<usize>,
    arcs: Vec<PerceivedArc>,
    tied: Vec<bool>,
}

#[derive(Clone, Default)]
struct SearchQueue {
    buckets: CostQueue,
    exact: BinaryHeap<Reverse<u64>>,
}

impl SearchQueue {
    fn clear<const EXACT: bool>(&mut self) {
        if EXACT { self.exact.clear(); } else { self.buckets.clear(); }
    }

    #[inline]
    fn push<const EXACT: bool>(&mut self, cost: f32, link: u32) {
        if EXACT {
            self.exact.push(Reverse(cost_key(cost, link)));
        } else {
            self.buckets.push(cost, link);
        }
    }

    #[inline]
    fn pop<const EXACT: bool>(&mut self) -> Option<(f32, u32)> {
        if EXACT {
            self.exact.pop().map(|Reverse(key)| unpack_key(key))
        } else {
            self.buckets.pop()
        }
    }
}

enum PathResult { Found(f32), Unreachable, Tied }

#[derive(Clone, Copy)]
struct PerceivedArc {
    to: u32,
    movement: u32,
    seconds: f32,
    deviation: f32,
}

impl Perceived {
    /// Links from `from` to `goal` (for `From::Node` the first link included; for `From::Link(l)` the links after `l`; the goal link last)
    /// appended to `out`, and their perceived cost; None when unreachable. `first_ok` filters the first link taken.
    #[allow(clippy::too_many_arguments)]
    pub fn search(&mut self, topo: &Topo, m: Modal<'_>, cost: &[f32], beta: f32, seed: u32, from: From, goal: Goal, first_ok: &dyn Fn(u32) -> bool, out: &mut Vec<u32>) -> Option<f32> {
        self.invalidate();
        self.search_cached(topo, m, cost, beta, seed, from, goal, first_ok, INF, out)
    }

    pub(crate) fn invalidate(&mut self) {
        self.offsets.clear();
    }

    // The simulation reuses the open movement graph and the noise scale of each arc
    // until observed travel times or interventions change.
    #[allow(clippy::too_many_arguments)]
    pub(crate) fn search_cached(&mut self, topo: &Topo, m: Modal<'_>, cost: &[f32], beta: f32, seed: u32, from: From, goal: Goal, first_ok: &dyn Fn(u32) -> bool, limit: f32, out: &mut Vec<u32>) -> Option<f32> {
        if self.offsets.is_empty() {
            self.arcs.clear();
            self.offsets.push(0);
            for a in 0..topo.n_links {
                let link_time = cost[a] * m.w[a];
                for mv in topo.lm_start[a]..topo.lm_start[a] + topo.lm_cnt[a] {
                    let b = topo.mvs[mv as usize].b;
                    if m.mv_ok[mv as usize] && !m.closed[b as usize] {
                        let seconds = m.mv_cost[mv as usize] + link_time;
                        self.arcs.push(PerceivedArc { to: b, movement: mv, seconds, deviation: (beta * seconds.max(0.0)).sqrt() });
                    }
                }
                self.offsets.push(self.arcs.len());
            }
        }
        // A unique shortest path has the same parents in either queue order. Equal
        // labels on its predecessor chain require the original cost-then-link ordering.
        let mut result = self.find::<false>(topo, m, cost, beta, seed, from, goal, first_ok, limit, out);
        if matches!(result, PathResult::Tied) {
            result = self.find::<true>(topo, m, cost, beta, seed, from, goal, first_ok, limit, out);
        }
        match result {
            PathResult::Found(d) => Some(d),
            PathResult::Unreachable => None,
            PathResult::Tied => unreachable!("the exact queue resolves predecessor ties"),
        }
    }

    #[allow(clippy::too_many_arguments)]
    fn find<const EXACT: bool>(&mut self, topo: &Topo, m: Modal<'_>, cost: &[f32], beta: f32, seed: u32, from: From, goal: Goal, first_ok: &dyn Fn(u32) -> bool, limit: f32, out: &mut Vec<u32>) -> PathResult {
        let n = topo.n_links;
        let done = |l| goal.reached(topo, l);
        if let From::Link(l) = from {
            if done(l) {
                return PathResult::Found(0.0);
            }
        }
        self.dist.clear();
        self.dist.resize(n, INF);
        self.pred.resize(n, u32::MAX);
        self.tied.resize(n, false);
        self.queue.clear::<EXACT>();
        let arc = |l: u32| cost[l as usize] * m.w[l as usize];
        match from {
            From::Node(o) => {
                for &b in &topo.outs[o as usize] {
                    if m.closed[b as usize] || !first_ok(b) {
                        continue;
                    }
                    self.dist[b as usize] = 0.0;
                    self.pred[b as usize] = u32::MAX;
                    if !EXACT { self.tied[b as usize] = false; }
                    self.queue.push::<EXACT>(0.0, b);
                }
            }
            From::Link(l) => self.relax::<EXACT>(seed, beta, l, 0.0, Some(first_ok)),
        }
        // At a single terminal the last traversal has the same price on every path.
        let single_terminal = match goal {
            Goal::Link(_) => true,
            Goal::Dest(d) => topo.ins[d as usize].len() == 1,
        };
        let mut ceiling = limit;
        let mut hit: Option<(u32, f32)> = None;
        while let Some((d, a)) = self.queue.pop::<EXACT>() {
            if d > ceiling {
                if EXACT || time_bin(d) > time_bin(ceiling) { break; }
                continue;
            }
            if d > self.dist[a as usize] {
                continue;
            }
            if done(a) {
                let total = d + perceive_last(arc(a), beta, seed, a);
                if total > limit { continue; }
                if hit.is_none_or(|(link, best)| total < best || (total == best && a < link)) {
                    hit = Some((a, total));
                    ceiling = if single_terminal { d } else { total };
                    if EXACT && single_terminal { break; }
                }
                continue;
            }
            self.relax::<EXACT>(seed, beta, a, d, None);
        }
        let Some((g, d)) = hit else { return PathResult::Unreachable };
        let mark = out.len();
        let mut l = g;
        loop {
            if !EXACT && self.tied[l as usize] {
                out.truncate(mark);
                return PathResult::Tied;
            }
            out.push(l);
            let p = self.pred[l as usize];
            if p == u32::MAX {
                break;
            }
            l = p;
        }
        out[mark..].reverse();
        PathResult::Found(d)
    }

    #[inline]
    fn relax<const EXACT: bool>(&mut self, seed: u32, beta: f32, a: u32, d: f32, first_ok: Option<&dyn Fn(u32) -> bool>) {
        let quantiles = normal_quantiles();
        for arc in &self.arcs[self.offsets[a as usize]..self.offsets[a as usize + 1]] {
            if first_ok.is_some_and(|f| !f(arc.to)) { continue; }
            let seconds = if seed == NO_NOISE || beta <= 0.0 {
                arc.seconds
            } else {
                let bin = (hash32(seed ^ SALT_MV, arc.movement) >> (32 - Z_BITS)) as usize;
                (arc.seconds + arc.deviation * quantiles[bin]).max(0.0)
            };
            let c = d + seconds;
            let parent = if first_ok.is_some() { u32::MAX } else { a };
            if c < self.dist[arc.to as usize] {
                self.dist[arc.to as usize] = c;
                self.pred[arc.to as usize] = parent;
                if !EXACT { self.tied[arc.to as usize] = false; }
                self.queue.push::<EXACT>(c, arc.to);
            } else if !EXACT && c == self.dist[arc.to as usize] && self.pred[arc.to as usize] != parent {
                self.tied[arc.to as usize] = true;
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
        Router { tables: (0..n_nodes).map(|_| None).collect(), link_tables: HashMap::new(), heap: CostQueue::default(), reverse: ReverseCosts::default(), epoch_costs: false }
    }

    // The simulation calls invalidate at every cost epoch or policy change. Standalone
    // callers may pass different weights for each newly requested tree.
    pub(crate) fn for_epoch(n_nodes: usize) -> Router {
        Router { epoch_costs: true, ..Router::new(n_nodes) }
    }

    pub fn invalidate(&mut self) {
        self.reverse.offsets.clear();
        self.clear_tables();
    }

    pub(crate) fn clear_tables(&mut self) {
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
            self.heap.push(h[target as usize], target);
        }
        if !self.epoch_costs { self.reverse.offsets.clear(); }
        self.reverse.ensure(topo, m, cost);
        self.fill_table(&mut h, |a| a == target);
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
        for &l in &topo.ins[dest as usize] {
            if !eff.closed[l as usize] {
                h[l as usize] = cost[l as usize] * eff.w[l as usize];
                self.heap.push(h[l as usize], l);
            }
        }
        if !self.epoch_costs { self.reverse.offsets.clear(); }
        self.reverse.ensure(topo, eff, cost);
        self.fill_table(&mut h, |a| topo.link_to[a as usize] == dest);
        self.tables[dest as usize] = Some(h);
    }

    fn fill_table(&mut self, h: &mut [f32], is_goal: impl Fn(u32) -> bool) {
        while let Some((hl, l)) = self.heap.pop() {
            if hl > h[l as usize] { continue; }
            for &(a, seconds) in self.reverse.predecessors(l as usize) {
                if is_goal(a) { continue; }
                let cand = seconds + hl;
                if cand < h[a as usize] {
                    h[a as usize] = cand;
                    self.heap.push(cand, a);
                }
            }
        }
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

#[cfg(test)]
mod queue_tests {
    use super::*;

    #[test]
    fn dense_time_bin_switches_to_exact_order_for_the_rest_of_the_search() {
        let mut queue = CostQueue::default();
        queue.push(3.0, 3);
        queue.push(12.0, 4);
        queue.push(100_000.0, 5);
        for _ in 0..MAX_BIN_POPS {
            queue.push(0.0, 0);
            assert_eq!(queue.pop(), Some((0.0, 0)));
        }
        assert!(queue.ordered);
        // Entries from the current bin, later bins and overflow still participate.
        queue.push(2.0, 2);
        queue.push(2.0, 1);
        for item in [(2.0, 1), (2.0, 2), (3.0, 3), (12.0, 4), (100_000.0, 5)] {
            assert_eq!(queue.pop(), Some(item));
        }
        assert_eq!(queue.pop(), None);
        queue.clear();
        assert!(!queue.ordered);
        queue.push(1.0, 1);
        assert_eq!(queue.pop(), Some((1.0, 1)));
    }
}
