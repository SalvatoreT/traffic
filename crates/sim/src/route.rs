//! Turn-aware time-shortest-path routing over links [Wardrop1952], [Peeta2001].
//!
//! One reverse Dijkstra per destination node yields, for every link, the cost-to-go from the *start*
//! of that link. Tables are cached per destination for one cost epoch. A route is then walked
//! forward choosing, at each node, the movement minimizing (turn cost + cost-to-go), with a static
//! per-(driver, link) perceived-cost noise so that drivers do not all pick identical routes.

use crate::eff::Eff;
use crate::params::*;
use crate::rng::hash32;
use crate::topo::Topo;
use std::cmp::Reverse;
use std::collections::BinaryHeap;

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
    heap: BinaryHeap<Reverse<(u32, u32)>>,
}

#[inline]
pub fn noise(seed: u32, link: u32) -> f32 {
    if seed == NO_NOISE {
        return 1.0;
    }
    let u = hash32(seed, link) as f32 / u32::MAX as f32;
    1.0 + (2.0 * u - 1.0) * ROUTE_NOISE
}

impl Router {
    pub fn new(n_nodes: usize) -> Router {
        Router { tables: (0..n_nodes).map(|_| None).collect(), heap: BinaryHeap::new() }
    }

    pub fn invalidate(&mut self) {
        for t in self.tables.iter_mut() {
            *t = None;
        }
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
                if eff.closed[a] {
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
pub fn first_link(table: &[f32], topo: &Topo, eff: &Eff, origin: u32, seed: u32) -> Option<u32> {
    first_link_m(table, topo, eff.car_modal(), origin, seed)
}

pub fn first_link_m(table: &[f32], topo: &Topo, eff: Modal<'_>, origin: u32, seed: u32) -> Option<u32> {
    let mut best: Option<(f32, u32)> = None;
    for &b in &topo.outs[origin as usize] {
        if eff.closed[b as usize] {
            continue;
        }
        let h = table[b as usize];
        if !h.is_finite() {
            continue;
        }
        let c = h * noise(seed, b);
        if best.map_or(true, |(bc, _)| c < bc) {
            best = Some((c, b));
        }
    }
    best.map(|x| x.1)
}

/// Walk forward from the end of link `from` to `dest`, appending the following links to `route`.
pub fn walk(table: &[f32], topo: &Topo, eff: &Eff, from: u32, dest: u32, seed: u32, route: &mut Vec<u32>) -> bool {
    walk_m(table, topo, eff.car_modal(), from, dest, seed, route)
}

pub fn walk_m(table: &[f32], topo: &Topo, eff: Modal<'_>, from: u32, dest: u32, seed: u32, route: &mut Vec<u32>) -> bool {
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
            let c = (h + eff.mv_cost[m as usize]) * noise(seed, b);
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
