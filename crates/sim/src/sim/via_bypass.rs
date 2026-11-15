//! Local bypass of an assumed movement that an intervention cuts (project lead decision of 2026-11-15, change
//! explain-traffic-redistribution).
//!
//! ASSUMPTION: a trip that must make a counted turn (`via`) and can no longer make it, nor any of its alternatives, keeps the turn's
//! intent when a legal route does: one that drives the counted approach street in the counted direction upstream of the turn and then
//! the onward street in the onward direction from the turn's exit on, within the plan's detour tolerance on free-flow costs, and passes
//! no node twice that the plain route does not. Without such a route the trip takes its plain route, as before.

use super::*;

/// Links followed along the approach street upstream of the counted turn, and along the onward street from its exit. ASSUMPTION: a
/// dozen blocks covers a neighborhood street; the detour tolerance limits how far a bypass can go anyway.
const VIA_CHAIN_MAX: usize = 12;

impl Simulation {
    /// Links of the street of `from`, in its direction: `from`, then the links reached by straight-through movements onto a link of the
    /// same name, downstream (`forward`) or upstream. A fork takes the lower link id. Empty-named links have no street.
    fn street_chain(&self, from: u32, forward: bool) -> Vec<u32> {
        let name = &self.net.links[from as usize].name;
        let mut out = vec![from];
        if name.is_empty() {
            return out;
        }
        let mut cur = from;
        while out.len() < VIA_CHAIN_MAX {
            let next = if forward {
                let ms = self.topo.lm_start[cur as usize];
                (ms..ms + self.topo.lm_cnt[cur as usize]).map(|m| &self.topo.mvs[m as usize]).filter(|m| m.kind == K_THROUGH && self.net.links[m.b as usize].name == *name).map(|m| m.b).min()
            } else {
                self.topo.preds[cur as usize].iter().map(|&m| &self.topo.mvs[m as usize]).filter(|m| m.kind == K_THROUGH && self.net.links[m.a as usize].name == *name).map(|m| m.a).min()
            };
            match next {
                Some(l) if !out.contains(&l) => {
                    out.push(l);
                    cur = l;
                }
                _ => break,
            }
        }
        out
    }

    /// Can the plan's primary movement still be made from `start` at all (not only within the tolerance)?
    fn via_cut(&mut self, start: Start, dest: u32, plan: u32) -> bool {
        let (a, b) = self.via_plans[plan as usize].moves[0];
        if self.usable_via(Some((a, b))).is_none() {
            return true;
        }
        self.via_router.ensure_m(dest, &self.topo, self.eff.static_modal(), &self.eff.ff);
        self.via_router.ensure_link_m(a, &self.topo, self.eff.static_modal(), &self.eff.ff);
        let to_a = match start {
            Start::Link(l) if l == a => 0.0,
            _ => self.start_cost(start, &self.via_router.link_tables[&a], &self.eff.mv_static),
        };
        let from_b = if self.topo.link_to[b as usize] == dest { 0.0 } else { self.start_cost(Start::Link(b), self.via_router.table(dest), &self.eff.mv_static) };
        !(to_a + from_b).is_finite()
    }

    /// The bypass of `pick_via` for a cut primary movement: the cheapest (approach link, onward link) pair within the tolerance whose
    /// route can be built, tried in cost order. Returns, as `pick_via` does, the movement onto the onward street (made like a counted
    /// movement, so the car keeps the bypass until it is back on that street) and the first link for `Start::Node`.
    pub(super) fn pick_via_bypass(&mut self, start: Start, dest: u32, seed: u32, plan: u32, route: &mut Vec<u32>) -> Option<((u32, u32), Option<u32>)> {
        if plan == NO_PLAN || !self.via_cut(start, dest, plan) {
            return None;
        }
        let (a, b) = self.via_plans[plan as usize].moves[0];
        let max = self.via_plans[plan as usize].max_detour;
        let (approach, onward) = (self.street_chain(a, false), self.street_chain(b, true));
        self.via_router.ensure_m(dest, &self.topo, self.eff.static_modal(), &self.eff.ff);
        let plain = self.start_cost(start, self.via_router.table(dest), &self.eff.mv_static);
        let mut cands: Vec<(f32, u32, u32)> = Vec::new();
        for &q in onward.iter().filter(|&&q| !self.eff.closed[q as usize]) {
            let to_dest = if self.topo.link_to[q as usize] == dest { 0.0 } else { self.start_cost(Start::Link(q), self.via_router.table(dest), &self.eff.mv_static) };
            if !to_dest.is_finite() {
                continue;
            }
            self.via_router.ensure_link_m(q, &self.topo, self.eff.static_modal(), &self.eff.ff);
            for &p in approach.iter().filter(|&&p| p != q && !self.eff.closed[p as usize]) {
                self.via_router.ensure_link_m(p, &self.topo, self.eff.static_modal(), &self.eff.ff);
                let to_p = match start {
                    Start::Link(l) if l == p => 0.0,
                    _ => self.start_cost(start, &self.via_router.link_tables[&p], &self.eff.mv_static),
                };
                let p_to_q = self.start_cost(Start::Link(p), &self.via_router.link_tables[&q], &self.eff.mv_static);
                let cost = to_p + p_to_q + to_dest;
                if cost.is_finite() && (!plain.is_finite() || cost <= max * plain) {
                    cands.push((cost, p, q));
                }
            }
        }
        cands.sort_by(|x, y| x.0.total_cmp(&y.0).then((x.1, x.2).cmp(&(y.1, y.2))));
        let mut plain_looped: Option<Vec<u32>> = None;
        for (_, p, q) in cands {
            self.router.ensure(dest, &self.topo, &self.eff, &self.link_cost);
            self.router.ensure_link(p, &self.topo, &self.eff, &self.link_cost);
            self.router.ensure_link(q, &self.topo, &self.eff, &self.link_cost);
            let first = match start {
                Start::Node(n) => match route::first_link(&self.router.link_tables[&p], &self.topo, &self.eff, n, seed) {
                    Some(f) => Some(f),
                    None => continue,
                },
                Start::Link(_) => None,
            };
            let from = match (start, first) {
                (_, Some(f)) => f,
                (Start::Link(l), None) => l,
                _ => continue,
            };
            let mut r: Vec<u32> = Vec::new();
            if from != p && !route::walk_to_link(&self.router.link_tables[&p], &self.topo, &self.eff, from, p, seed, &mut r) {
                continue;
            }
            if !route::walk_to_link(&self.router.link_tables[&q], &self.topo, &self.eff, p, q, seed, &mut r) {
                continue;
            }
            if self.topo.link_to[q as usize] != dest && !route::walk(self.router.table(dest), &self.topo, &self.eff, q, dest, seed, &mut r) {
                continue;
            }
            let mut nodes: Vec<u32> = Vec::with_capacity(r.len() + 2);
            nodes.push(match start {
                Start::Node(n) => n,
                Start::Link(l) => self.topo.link_to[l as usize],
            });
            if first.is_some() {
                nodes.push(self.topo.link_to[from as usize]);
            }
            nodes.extend(r.iter().map(|&l| self.topo.link_to[l as usize]));
            let looped = Self::repeated(nodes);
            if !looped.is_empty() {
                let pl = plain_looped.get_or_insert_with(|| self.plain_repeats(start, dest, seed));
                if looped.iter().any(|n| !pl.contains(n)) {
                    continue;
                }
            }
            let k = r.iter().position(|&l| l == q).unwrap();
            let before_q = if k == 0 { from } else { r[k - 1] };
            route.extend_from_slice(&r);
            return Some(((before_q, q), first));
        }
        None
    }
}
