//! Wandering metrics of completed car trips: detour ratio against the shortest network distance, loops, reversals.
//!
//! Distances use link lengths plus movement lengths, the same quantities the car router sums, so a trip that follows the shortest
//! path has a detour ratio of exactly 1. The shortest path honors closures and turn bans (`Eff::mv_ok`).

use crate::eff::Eff;
use crate::model::Network;
use crate::route::{Modal, Router, INF};
use crate::sim::TripRecord;
use crate::topo::Topo;

/// A trip is "reversal-like" when it enters the reverse of a link it used within this driven distance (m).
pub const REVERSAL_WINDOW_M: f32 = 200.0;
/// Detour-ratio thresholds reported as shares of trips.
pub const DETOUR_HIGH: f32 = 1.3;
pub const DETOUR_VERY_HIGH: f32 = 2.0;

#[derive(Clone, Debug)]
pub struct TripMetric {
    pub uid: u32,
    pub origin: u32,
    pub dest: u32,
    pub driven_m: f32,
    pub shortest_m: f32,
    pub detour: f32,
    /// Driven length on links flagged `in_study_area` (m).
    pub study_m: f32,
    pub switches: u16,
    pub guided: bool,
    /// The same link was entered twice.
    pub link_repeat: bool,
    /// Most visits to any one node (origin and the end node of every link entered).
    pub node_max_visits: u8,
    /// A link was followed within `REVERSAL_WINDOW_M` by its reverse.
    pub reversal: bool,
}

impl TripMetric {
    /// Same link twice, or the same node three or more times.
    pub fn looped(&self) -> bool {
        self.link_repeat || self.node_max_visits >= 3
    }
}

fn reverse_of(topo: &Topo, l: u32) -> Option<u32> {
    let (f, t) = (topo.link_from[l as usize], topo.link_to[l as usize]);
    topo.outs[t as usize].iter().copied().find(|&b| topo.link_to[b as usize] == f)
}

/// Driven length of a trail: full link lengths plus the movement between consecutive links.
pub fn trail_length(topo: &Topo, trail: &[u32]) -> f32 {
    let mut m = 0.0;
    for (i, &l) in trail.iter().enumerate() {
        m += topo.length[l as usize];
        if i > 0 {
            if let Some(mv) = topo.find_mv(trail[i - 1], l) {
                m += topo.mvs[mv as usize].len;
            }
        }
    }
    m
}

pub fn analyze(topo: &Topo, eff: &Eff, net: &Network, recs: &[TripRecord]) -> Vec<TripMetric> {
    let mv_len: Vec<f32> = topo.mvs.iter().map(|m| m.len).collect();
    let ones = vec![1.0f32; topo.n_links];
    let modal = Modal { closed: &eff.closed, mv_ok: &eff.mv_ok, mv_cost: &mv_len, w: &ones };
    let mut router = Router::new(topo.n_nodes);
    let mut order: Vec<usize> = (0..recs.len()).collect();
    order.sort_by_key(|&i| recs[i].dest);
    let mut out: Vec<Option<TripMetric>> = vec![None; recs.len()];
    let mut cur_dest = u32::MAX;
    let mut visits = vec![0u8; topo.n_nodes];
    for &i in &order {
        let r = &recs[i];
        if r.trail.is_empty() {
            continue;
        }
        if r.dest != cur_dest {
            if cur_dest != u32::MAX {
                router.tables[cur_dest as usize] = None;
            }
            router.ensure_m(r.dest, topo, modal, &topo.length);
            cur_dest = r.dest;
        }
        let table = router.table(r.dest);
        let mut shortest = INF;
        for &b in &topo.outs[r.origin as usize] {
            if !eff.closed[b as usize] {
                shortest = shortest.min(table[b as usize]);
            }
        }
        let driven = trail_length(topo, &r.trail);
        if !shortest.is_finite() || shortest <= 0.0 {
            shortest = driven;
        }
        let mut study = 0.0;
        for &l in &r.trail {
            if net.links[l as usize].in_study_area {
                study += topo.length[l as usize];
            }
        }
        // Loops: repeated link, repeated node.
        let mut link_repeat = false;
        let mut sorted = r.trail.clone();
        sorted.sort_unstable();
        if sorted.windows(2).any(|w| w[0] == w[1]) {
            link_repeat = true;
        }
        let mut nodes: Vec<u32> = Vec::with_capacity(r.trail.len() + 1);
        nodes.push(r.origin);
        nodes.extend(r.trail.iter().map(|&l| topo.link_to[l as usize]));
        let mut max_v = 0u8;
        for &n in &nodes {
            visits[n as usize] = visits[n as usize].saturating_add(1);
            max_v = max_v.max(visits[n as usize]);
        }
        for &n in &nodes {
            visits[n as usize] = 0;
        }
        // Reversals: a link followed by its reverse within the window.
        let mut reversal = false;
        'outer: for a in 0..r.trail.len() {
            let Some(rev) = reverse_of(topo, r.trail[a]) else { continue };
            let mut d = 0.0;
            for b in a + 1..r.trail.len() {
                if r.trail[b] == rev {
                    reversal = true;
                    break 'outer;
                }
                d += topo.length[r.trail[b] as usize];
                if d > REVERSAL_WINDOW_M {
                    break;
                }
            }
        }
        out[i] = Some(TripMetric {
            uid: r.uid,
            origin: r.origin,
            dest: r.dest,
            driven_m: driven,
            shortest_m: shortest,
            detour: (driven / shortest).max(1.0),
            study_m: study,
            switches: r.switches,
            guided: r.guided,
            link_repeat,
            node_max_visits: max_v,
            reversal,
        });
    }
    out.into_iter().flatten().collect()
}

/// Aggregates over a set of trips.
#[derive(Clone, Debug, Default)]
pub struct WanderStats {
    pub trips: usize,
    pub mean_switches: f64,
    /// Share of trips with at least one en-route switch.
    pub share_switched: f64,
    pub mean_detour: f64,
    pub median_detour: f64,
    pub share_detour_high: f64,
    pub share_detour_very_high: f64,
    pub share_loops: f64,
    pub share_reversal: f64,
    /// In-study-area vehicle-miles of the set, and the share driven by trips with a detour ratio above `DETOUR_HIGH`.
    pub study_miles: f64,
    pub study_share_detour_high: f64,
}

const M_PER_MILE: f64 = 1609.344;

pub fn summarize<'a>(it: impl Iterator<Item = &'a TripMetric>) -> WanderStats {
    let v: Vec<&TripMetric> = it.collect();
    let n = v.len();
    if n == 0 {
        return WanderStats::default();
    }
    let nf = n as f64;
    let sh = |f: &dyn Fn(&TripMetric) -> bool| v.iter().filter(|t| f(t)).count() as f64 / nf;
    let mut d: Vec<f32> = v.iter().map(|t| t.detour).collect();
    d.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    let study: f64 = v.iter().map(|t| t.study_m as f64).sum();
    let study_hi: f64 = v.iter().filter(|t| t.detour > DETOUR_HIGH).map(|t| t.study_m as f64).sum();
    WanderStats {
        trips: n,
        mean_switches: v.iter().map(|t| t.switches as f64).sum::<f64>() / nf,
        share_switched: sh(&|t| t.switches > 0),
        mean_detour: v.iter().map(|t| t.detour as f64).sum::<f64>() / nf,
        median_detour: d[n / 2] as f64,
        share_detour_high: sh(&|t| t.detour > DETOUR_HIGH),
        share_detour_very_high: sh(&|t| t.detour > DETOUR_VERY_HIGH),
        share_loops: sh(&|t| t.looped()),
        share_reversal: sh(&|t| t.reversal),
        study_miles: study / M_PER_MILE,
        study_share_detour_high: if study > 0.0 { study_hi / study } else { 0.0 },
    }
}
