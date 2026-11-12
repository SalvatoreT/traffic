//! Diagonal diverter: permitted motor movements at a four-leg node, derived from the barrier bearing.
//!
//! The barrier is a straight line through the node. A movement is permitted only between two different legs on the same side of it,
//! so a four-leg node becomes two separate L-turns. Leg directions come from `Network::leg_bearing`, which measures how each link
//! leaves the intersection beyond the footprint of a merged staggered junction.

use crate::model::Network;
use crate::topo::Topo;

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

/// Bearing from the node along link `l` (leaving the node if `outgoing`, else the reverse of an approach): the importer's
/// per-link bearing, which ignores the connector of a merged staggered junction (`Network::leg_bearing`).
fn link_bearing(net: &Network, l: u32, outgoing: bool) -> f64 {
    net.leg_bearing(l, outgoing)
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
            leg.bearing = link_bearing(net, outs[k], true);
        } else {
            leg.bearing = link_bearing(net, a, false);
        }
        legs.push(leg);
    }
    for (k, &o) in outs.iter().enumerate() {
        if !out_used[k] {
            legs.push(Leg { ins: vec![], outs: vec![o], bearing: link_bearing(net, o, true) });
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
