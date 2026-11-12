//! Diagonal diverter: permitted motor movements at a four-leg node, derived from the barrier bearing.
//!
//! The barrier is a straight line through the node. A movement is permitted only between two different legs on the same side of it,
//! so a four-leg node becomes two separate L-turns. Leg directions are measured from the node along the first stretch of each
//! link's geometry, so curved or staggered legs (merged by the importer) classify by how they leave the intersection.

use crate::model::Network;
use crate::topo::Topo;

/// Distance along a link used to measure how a leg leaves the node (m). ASSUMPTION: long enough to skip the local junction
/// geometry of staggered legs, short enough to stay on the first block.
const LEG_PROBE_M: f64 = 15.0;
/// A leg closer than this angle to the barrier line has no clear side (degrees). ASSUMPTION.
const ON_LINE_DEG: f64 = 2.0;

/// One street approach to a node: the links that enter it and leave it (a two-way street is one leg).
#[derive(Clone, Debug)]
pub struct Leg {
    pub ins: Vec<u32>,
    pub outs: Vec<u32>,
    /// Bearing leaving the node, degrees clockwise from north in [0, 360).
    pub bearing: f64,
}

fn bearing_deg(dx: f64, dy: f64) -> f64 {
    dx.atan2(dy).to_degrees().rem_euclid(360.0)
}

/// Point `dist` meters along a polyline from its first point.
fn point_along(pts: &[[f64; 2]], dist: f64) -> [f64; 2] {
    let mut left = dist;
    for w in pts.windows(2) {
        let d = ((w[1][0] - w[0][0]).powi(2) + (w[1][1] - w[0][1]).powi(2)).sqrt();
        if d >= left && d > 1e-9 {
            let u = left / d;
            return [w[0][0] + (w[1][0] - w[0][0]) * u, w[0][1] + (w[1][1] - w[0][1]) * u];
        }
        left -= d;
    }
    *pts.last().unwrap()
}

/// Bearing from the node along link `l` (leaving the node if `outgoing`, else the reverse of an approach).
fn link_bearing(topo: &Topo, net: &Network, node: usize, l: u32, outgoing: bool) -> f64 {
    let mut pts = topo.geo[l as usize].pts.clone();
    if !outgoing {
        pts.reverse();
    }
    let n = &net.nodes[node];
    let mut probe = LEG_PROBE_M;
    loop {
        let p = point_along(&pts, probe);
        let (dx, dy) = (p[0] - n.x, p[1] - n.y);
        if dx.hypot(dy) >= 3.0 || probe >= 4.0 * LEG_PROBE_M {
            return bearing_deg(dx, dy);
        }
        probe *= 2.0;
    }
}

/// The legs of a node, merging the two directions of a two-way street. A one-way street is one leg.
pub fn node_legs(topo: &Topo, net: &Network, node: u32) -> Vec<Leg> {
    let n = node as usize;
    let ins = &topo.ins[n];
    let outs = &topo.outs[n];
    let mut legs: Vec<Leg> = Vec::new();
    let mut out_used = vec![false; outs.len()];
    for &a in ins {
        let mut pair = None;
        if let Some(r) = net.links[a as usize].reverse {
            pair = outs.iter().position(|&o| o == r);
        }
        if pair.is_none() {
            let from = topo.link_from[a as usize];
            pair = outs.iter().enumerate().position(|(k, &o)| !out_used[k] && topo.link_to[o as usize] == from);
        }
        let mut leg = Leg { ins: vec![a], outs: vec![], bearing: 0.0 };
        if let Some(k) = pair {
            out_used[k] = true;
            leg.outs.push(outs[k]);
            leg.bearing = link_bearing(topo, net, n, outs[k], true);
        } else {
            leg.bearing = link_bearing(topo, net, n, a, false);
        }
        legs.push(leg);
    }
    for (k, &o) in outs.iter().enumerate() {
        if !out_used[k] {
            legs.push(Leg { ins: vec![], outs: vec![o], bearing: link_bearing(topo, net, n, o, true) });
        }
    }
    legs
}

/// Side of the barrier line (bearing `barrier`, degrees) a leg with bearing `leg` lies on: `Some(true/false)`, or `None` on the line.
fn side(leg: f64, barrier: f64) -> Option<bool> {
    let s = (leg - barrier).to_radians().sin();
    if s.abs() < ON_LINE_DEG.to_radians().sin() {
        None
    } else {
        Some(s > 0.0)
    }
}

/// Directed movements `(in link, out link)` a diagonal diverter at `node` with barrier `bearing` permits for motor vehicles.
/// `Err` when the node does not have exactly four legs, or the bearing does not leave two legs on each side.
pub fn permitted_movements(topo: &Topo, net: &Network, node: u32, bearing: f64) -> Result<Vec<(u32, u32)>, String> {
    if node as usize >= topo.n_nodes || !bearing.is_finite() {
        return Err("no such node or bearing".into());
    }
    let legs = node_legs(topo, net, node);
    if legs.len() != 4 {
        return Err(format!("needs four legs, found {}", legs.len()));
    }
    let sides: Vec<Option<bool>> = legs.iter().map(|l| side(l.bearing, bearing)).collect();
    if sides.iter().any(|s| s.is_none()) {
        return Err("a leg lies on the barrier line".into());
    }
    let pos = sides.iter().filter(|s| **s == Some(true)).count();
    if pos != 2 {
        return Err("barrier does not leave two legs on each side".into());
    }
    let mut out = Vec::new();
    for (i, la) in legs.iter().enumerate() {
        for (j, lb) in legs.iter().enumerate() {
            if i == j || sides[i] != sides[j] {
                continue;
            }
            for &a in &la.ins {
                for &b in &lb.outs {
                    out.push((a, b));
                }
            }
        }
    }
    out.sort_unstable();
    Ok(out)
}

/// Every movement at `node` that a diverter forbids.
pub fn banned_movements(topo: &Topo, net: &Network, node: u32, bearing: f64) -> Result<Vec<(u32, u32)>, String> {
    let ok = permitted_movements(topo, net, node, bearing)?;
    let mut banned = Vec::new();
    for m in &topo.mvs[topo.mbase[node as usize] as usize..(topo.mbase[node as usize] + topo.mcount[node as usize]) as usize] {
        if ok.binary_search(&(m.a, m.b)).is_err() {
            banned.push((m.a, m.b));
        }
    }
    Ok(banned)
}
