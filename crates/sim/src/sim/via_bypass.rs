//! Local bypass of an assumed movement that an intervention cuts (project lead decision of 2026-11-15, change
//! explain-traffic-redistribution).
//!
//! ASSUMPTION: a trip that must make a counted turn (`via`) and can no longer make it keeps the turn's
//! intent when a legal route does: one that drives the counted approach street in the counted direction upstream of the turn and then
//! the onward street in the onward direction from the turn's exit on, within the plan's detour tolerance on free-flow costs, and passes
//! no node twice that the plain route does not. Such bypasses compete with the plan's configured alternatives on cost (lead decision of
//! 2026-11-15); without any candidate the trip takes its plain route.

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
    pub(super) fn via_cut(&mut self, start: Start, dest: Goal, plan: u32) -> bool {
        let (a, b) = self.via_plans[plan as usize].moves[0];
        if self.usable_via(Some((a, b))).is_none() {
            return true;
        }
        self.via_router.ensure_goal(dest, &self.topo, self.eff.static_modal(), &self.eff.ff);
        self.via_router.ensure_link_m(a, &self.topo, self.eff.static_modal(), &self.eff.ff);
        let to_a = match start {
            Start::Link(l) if l == a => 0.0,
            _ => self.start_cost(start, &self.via_router.link_tables[&a], &self.eff.mv_static),
        };
        let from_b = if dest.reached(&self.topo, b) { 0.0 } else { self.start_cost(Start::Link(b), self.via_router.goal_table(dest), &self.eff.mv_static) };
        !(to_a + from_b).is_finite()
    }

    /// Bypass candidates (free-flow cost, approach link, onward link) of a plan whose primary movement is cut, within its tolerance.
    fn bypass_candidates(&mut self, start: Start, dest: Goal, plan: u32) -> Vec<(f32, u32, u32)> {
        let (a, b) = self.via_plans[plan as usize].moves[0];
        let max = self.via_plans[plan as usize].max_detour;
        let (approach, onward) = (self.street_chain(a, false), self.street_chain(b, true));
        self.via_router.ensure_goal(dest, &self.topo, self.eff.static_modal(), &self.eff.ff);
        let plain = self.start_cost(start, self.via_router.goal_table(dest), &self.eff.mv_static);
        let mut cands: Vec<(f32, u32, u32)> = Vec::new();
        for &q in onward.iter().filter(|&&q| !self.eff.closed[q as usize]) {
            let to_dest = if dest.reached(&self.topo, q) { 0.0 } else { self.start_cost(Start::Link(q), self.via_router.goal_table(dest), &self.eff.mv_static) };
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
        cands
    }

    /// Cost by the router's current link costs (the mean of what a departing car perceives, without its own perception error) of reaching `via`
    /// from `start`, then going on to `then` (when given) and to `dest`.
    fn live_cost(&mut self, start: Start, via: u32, then: Option<u32>, dest: Goal) -> f32 {
        self.router.ensure_goal(dest, &self.topo, self.eff.car_modal(), &self.link_cost);
        self.router.ensure_link(via, &self.topo, &self.eff, &self.link_cost);
        let to_via = match start {
            Start::Link(l) if l == via => 0.0,
            _ => self.start_cost(start, &self.router.link_tables[&via], &self.eff.mv_cost),
        };
        let (last, mid) = match then {
            Some(q) => {
                self.router.ensure_link(q, &self.topo, &self.eff, &self.link_cost);
                (q, self.start_cost(Start::Link(via), &self.router.link_tables[&q], &self.eff.mv_cost))
            }
            None => (via, 0.0),
        };
        let on = if dest.reached(&self.topo, last) { 0.0 } else { self.start_cost(Start::Link(last), self.router.goal_table(dest), &self.eff.mv_cost) };
        to_via + mid + on
    }

    /// Project lead decision of 2026-11-15 (ASSUMPTION): when a plan's primary movement is cut, its configured alternatives within the
    /// tolerance (`alts`, free-flow cost and movement) and the local bypasses within it compete on the router's cost at departure; the
    /// cheapest that can be built wins, ties going to the smaller detour (free-flow cost), then to the bypass. No kind has priority.
    pub(super) fn pick_cut_via(&mut self, start: Start, dest: Goal, seed: u32, plan: u32, alts: &[(f32, (u32, u32))], route: &mut Vec<u32>) -> Option<((u32, u32), Option<u32>)> {
        // (live cost, free-flow cost, kind: 0 bypass, 1 alternative, first link, second link)
        let mut all: Vec<(f32, f32, u8, u32, u32)> = Vec::new();
        for &(ff, (a, b)) in alts {
            self.router.ensure_goal(dest, &self.topo, self.eff.car_modal(), &self.link_cost);
            self.router.ensure_link(a, &self.topo, &self.eff, &self.link_cost);
            let to_a = match start {
                Start::Link(l) if l == a => 0.0,
                _ => self.start_cost(start, &self.router.link_tables[&a], &self.eff.mv_cost),
            };
            let cost = to_a + self.eff.mv_cost[self.topo.find_mv(a, b).unwrap() as usize] + self.router.goal_table(dest)[b as usize];
            all.push((cost, ff, 1, a, b));
        }
        for (ff, p, q) in self.bypass_candidates(start, dest, plan) {
            let live = self.live_cost(start, p, Some(q), dest);
            all.push((live, ff, 0, p, q));
        }
        all.sort_by(|x, y| x.0.total_cmp(&y.0).then(x.1.total_cmp(&y.1)).then(x.2.cmp(&y.2)).then((x.3, x.4).cmp(&(y.3, y.4))));
        let mut plain_looped: Option<Vec<u32>> = None;
        for (_, _, kind, x, y) in all {
            let got = if kind == 1 { self.try_via_move(start, dest, seed, plan, (x, y), route, &mut plain_looped) } else { self.try_bypass(start, dest, seed, x, y, route, &mut plain_looped) };
            if got.is_some() {
                return got;
            }
        }
        None
    }

    /// Build the bypass route through approach link `p` and onward link `q`; the returned movement is the one onto the onward street
    /// (made like a counted movement, so the car keeps the bypass until it is back on that street).
    fn try_bypass(&mut self, start: Start, dest: Goal, seed: u32, p: u32, q: u32, route: &mut Vec<u32>, plain_looped: &mut Option<Vec<u32>>) -> Option<((u32, u32), Option<u32>)> {
        let first = match start {
            Start::Node(n) => {
                let mut r0: Vec<u32> = Vec::new();
                if !self.plan(Start::Node(n), Goal::Link(p), seed, None, &mut r0) {
                    return None;
                }
                Some(r0[0])
            }
            Start::Link(_) => None,
        };
        let from = match (start, first) {
            (_, Some(f)) => f,
            (Start::Link(l), None) => l,
            _ => return None,
        };
        let mut r: Vec<u32> = Vec::new();
        if from != p && !self.plan(Start::Link(from), Goal::Link(p), seed, None, &mut r) {
            return None;
        }
        if !self.plan(Start::Link(p), Goal::Link(q), seed, None, &mut r) {
            return None;
        }
        if !dest.reached(&self.topo, q) && !self.plan(Start::Link(q), dest, seed, None, &mut r) {
            return None;
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
                return None;
            }
        }
        let k = r.iter().position(|&l| l == q).unwrap();
        let before_q = if k == 0 { from } else { r[k - 1] };
        route.extend_from_slice(&r);
        Some(((before_q, q), first))
    }
}
