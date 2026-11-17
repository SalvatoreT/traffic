//! Local OD records identify junctions, not addresses. ASSUMPTION: the first and last
//! blocks of the unmodified free-flow route represent the two address blocks. Their
//! positions are fixed before scenario routing; a reverse link serves the same place.

use super::*;

#[derive(Clone, Copy, Default)]
pub(super) struct Curbs {
    first: Option<u32>,
    last: Option<u32>,
}

impl Curbs {
    pub(super) fn has_destination(&self) -> bool {
        self.last.is_some()
    }
}

impl Simulation {
    pub(super) fn assign_curbs(&mut self) {
        // One destination tree at a time, bounded even on a city network.
        let mut order: Vec<usize> = (0..self.flows.len())
            .filter(|&i| {
                let f = &self.flows[i];
                f.mode == FlowMode::Car && (!self.net.nodes[f.origin as usize].gate || !self.net.nodes[f.dest as usize].gate)
            })
            .collect();
        order.sort_by_key(|&i| self.flows[i].dest);
        let mut r = Router::new(self.topo.n_nodes);
        let mut prev = None;
        let mut path = Vec::new();
        for i in order {
            let f = &self.flows[i];
            if prev != Some(f.dest) {
                if let Some(d) = prev {
                    r.tables[d as usize] = None;
                }
                r.ensure(f.dest, &self.topo, &self.eff, &self.eff.ff);
                prev = Some(f.dest);
            }
            let table = r.table(f.dest);
            let Some(first) = route::first_link(table, &self.topo, &self.eff, f.origin) else { continue };
            path.clear();
            if !route::walk(table, &self.topo, &self.eff, first, f.dest, &mut path) {
                continue;
            }
            let last = path.last().copied().unwrap_or(first);
            let address = |n: u32, l: u32| (!self.net.nodes[n as usize].gate && self.topo.stop_pos[l as usize] - self.topo.emerge_pos[l as usize] >= MID_BLOCK_MIN_M).then_some(l);
            self.flows[i].curbs = Curbs {
                first: address(f.origin, first),
                last: address(f.dest, last),
            };
        }
    }

    fn curb_directions(&self, link: Option<u32>) -> [Option<u32>; 2] {
        [link, link.and_then(|l| self.net.links[l as usize].reverse)]
    }

    /// Route from a permitted first link or origin node, through the flow's assumed
    /// movements where feasible, to a permitted destination link or gate.
    pub(super) fn car_path(&mut self, origin: u32, dest: u32, curbs: Curbs, seed: u32, vplan: u32, out: &mut Vec<u32>) -> Option<Option<(u32, u32)>> {
        for (i, first) in self.curb_directions(curbs.first).into_iter().enumerate() {
            if (i > 0 && first.is_none()) || first.is_some_and(|l| self.eff.closed[l as usize]) {
                continue;
            }
            for (j, last) in self.curb_directions(curbs.last).into_iter().enumerate() {
                if (j > 0 && last.is_none()) || last.is_some_and(|l| self.eff.closed[l as usize]) {
                    continue;
                }
                // If both positions are on one now-reversed block, the destination lies
                // behind the insertion point. The trip must leave and legally re-enter it.
                if i > 0 && j > 0 && first == last && curbs.first == curbs.last {
                    if let Some(path) = self.return_to_curb(first.unwrap(), seed, None) {
                        out.extend(path);
                        return Some(None);
                    }
                    continue;
                }
                let start = first.map_or(Start::Node(origin), Start::Link);
                let goal = last.map_or(Goal::Dest(dest), Goal::Link);
                let mut route = Vec::new();
                if vplan != NO_PLAN {
                    for sd in [seed, NO_NOISE] {
                        if let Some((via, new_first)) = self.pick_via(start, goal, sd, vplan, &mut route) {
                            out.extend(first.or(new_first));
                            out.append(&mut route);
                            return Some(Some(via));
                        }
                    }
                }
                if self.plan(start, goal, seed, None, &mut route) {
                    out.extend(first);
                    out.append(&mut route);
                    return Some(None);
                }
            }
        }
        None
    }

    fn return_to_curb(&mut self, l: u32, seed: u32, first_ok: Option<&dyn Fn(u32) -> bool>) -> Option<Vec<u32>> {
        let start = self.topo.lm_start[l as usize];
        let mut best = None;
        let mut best_cost = INF;
        for m in start..start + self.topo.lm_cnt[l as usize] {
            let b = self.topo.mvs[m as usize].b;
            if !self.eff.mv_ok[m as usize] || self.eff.closed[b as usize] || first_ok.is_some_and(|ok| !ok(b)) {
                continue;
            }
            let mut path = vec![l, b];
            if self.plan(Start::Link(b), Goal::Link(l), seed, None, &mut path) {
                let cost = self.path_cost(l, &path[1..], seed);
                if cost < best_cost {
                    best = Some(path);
                    best_cost = cost;
                }
            }
        }
        best
    }

    /// A destination on the occupied link is reached directly only if its curb is ahead.
    pub(super) fn remaining_path(&mut self, vid: u32, goal: Goal, endpoint: f32, seed: u32, first_ok: Option<&dyn Fn(u32) -> bool>, out: &mut Vec<u32>) -> bool {
        let v = &self.vehs[vid as usize];
        let l = v.link;
        if matches!(goal, Goal::Link(target) if target == l) && endpoint < v.pos {
            if let Some(path) = self.return_to_curb(l, seed, first_ok) {
                out.extend_from_slice(&path[1..]);
                return true;
            }
            return false;
        }
        self.plan(Start::Link(l), goal, seed, first_ok, out)
    }

    /// Positions use the canonical block's coordinate even when the scenario uses
    /// its reverse. The stored origin comes first on a one-block trip.
    pub(super) fn curb_positions(&self, uid: u32, curbs: Curbs, first: u32, last: u32) -> (Option<f32>, Option<f32>) {
        let sample = |block: Option<u32>, role, link: u32| {
            let b = block?;
            let p = if curbs.first == curbs.last {
                let pair = self.one_link_ends(uid, b as usize)?;
                if role == END_ORIGIN {
                    pair.0
                } else {
                    pair.1
                }
            } else {
                self.mid_block_pos(uid, b as usize, role)?
            };
            Some(if link == b {
                p
            } else {
                (1.0 - p / self.topo.length[b as usize]) * self.topo.length[link as usize]
            })
        };
        (sample(curbs.first, END_ORIGIN, first), sample(curbs.last, END_DEST, last))
    }
}
