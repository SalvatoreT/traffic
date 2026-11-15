//! Read-only views of the router's state for calibration diagnostics.

use super::*;

impl Simulation {
    /// Topology, effective network and current per-link route costs (s, before the perceived-cost weight) the router plans on.
    pub fn router_view(&self) -> (&Topo, &Eff, &[f32]) {
        (&self.topo, &self.eff, &self.link_cost)
    }
}
