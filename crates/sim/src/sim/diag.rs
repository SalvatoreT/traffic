//! Read-only views of the router's state for calibration diagnostics.

use super::*;

impl Simulation {
    /// Topology, effective network and current per-link route costs (s, before the perceived-cost weight) the router plans on.
    pub fn router_view(&self) -> (&Topo, &Eff, &[f32]) {
        (&self.topo, &self.eff, &self.link_cost)
    }
}

impl Simulation {
    /// Validation case l2: a standing vehicle that never moves, in `lane` of `link` at `pos`, nominally bound for `next` and its end node; returns its uid.
    #[doc(hidden)]
    pub fn place_obstacle(&mut self, link: u32, lane: usize, pos: f32, next: u32) -> u32 {
        let dest = self.topo.link_to[next as usize];
        let id = self.alloc_veh();
        let uid = self.uid_next;
        self.uid_next += 1;
        self.vehs[id as usize] = Veh { alive: true, uid, link, lane: lane as u8, pos, frozen: true, dest, origin: self.topo.link_from[link as usize], route: vec![next], t_depart: self.t, t_enter: self.t, ..Veh::blank() };
        self.lanes[self.topo.qidx(link as usize, lane)].push_back(id);
        uid
    }

    /// (uid, position, speed) of every vehicle on `link`.
    #[doc(hidden)]
    pub fn link_occupants(&self, link: u32) -> Vec<(u32, f32, f32)> {
        let l = link as usize;
        (0..self.topo.nlanes(l)).flat_map(|k| self.lanes[self.topo.qidx(l, k)].iter().map(|&id| (self.vehs[id as usize].uid, self.vehs[id as usize].pos, self.vehs[id as usize].v))).collect()
    }
}
