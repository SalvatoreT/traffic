//! Scenario-link decoder: a port of `decodeScenario` in `src/lib/hash.ts`, so a search can start from packages already published in a
//! proposals file. A link decodes against the network it was written for; an item with no match is an error, never skipped.

use super::link::{decode_geohash, heading_at, polyline_length, Proj};
use crate::diverter::node_legs;
use crate::model::{Control, Intervention, Network};
use crate::topo::Topo;

const LINK_TOLERANCE_M: f64 = 25.0;
const NODE_TOLERANCE_M: f64 = 30.0;
const BEARING_TOLERANCE_DEG: f64 = 45.0;

fn ang_diff(a: f64, b: f64) -> f64 {
    let d = (a - b).abs() % 360.0;
    if d > 180.0 {
        360.0 - d
    } else {
        d
    }
}

/// (distance, distance along) of the nearest point of a polyline (`nearestOnPolyline`).
fn nearest_on(g: &[[f64; 2]], px: f64, py: f64) -> (f64, f64) {
    let (mut best, mut along, mut acc) = (f64::INFINITY, 0.0, 0.0);
    for w in g.windows(2) {
        let (dx, dy) = (w[1][0] - w[0][0], w[1][1] - w[0][1]);
        let l2 = dx * dx + dy * dy;
        let t = if l2 > 0.0 { (((px - w[0][0]) * dx + (py - w[0][1]) * dy) / l2).clamp(0.0, 1.0) } else { 0.0 };
        let d = (px - (w[0][0] + t * dx)).hypot(py - (w[0][1] + t * dy));
        if d < best {
            best = d;
            along = acc + t * l2.sqrt();
        }
        acc += l2.sqrt();
    }
    (best, along)
}

fn match_link(net: &Network, x: f64, y: f64, bearing: Option<f64>) -> Option<(u32, f64)> {
    let mut best: Option<(u32, f64)> = None;
    let mut best_score = f64::INFINITY;
    for l in &net.links {
        let (dist, along) = nearest_on(&l.geometry, x, y);
        if dist > LINK_TOLERANCE_M {
            continue;
        }
        let hd = heading_at(&l.geometry, along);
        let mut score = dist;
        match bearing {
            Some(b) => {
                let d = ang_diff(hd, b);
                if d > BEARING_TOLERANCE_DEG {
                    continue;
                }
                score += d * 0.01;
            }
            None => {
                if l.reverse.is_some() && hd >= 180.0 {
                    score += 0.5;
                }
            }
        }
        if score < best_score {
            best_score = score;
            best = Some((l.id, along));
        }
    }
    best
}

fn nodes_near(net: &Network, x: f64, y: f64) -> Vec<u32> {
    let mut v: Vec<(f64, u32)> = net.nodes.iter().map(|n| ((n.x - x).hypot(n.y - y), n.id)).filter(|c| c.0 <= NODE_TOLERANCE_M).collect();
    v.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap_or(std::cmp::Ordering::Equal));
    v.into_iter().map(|c| c.1).collect()
}

fn best_by_bearing(net: &Network, ids: &[u32], bearing: f64, at: impl Fn(&[[f64; 2]]) -> f64) -> Option<u32> {
    let (mut best, mut bd) = (None, BEARING_TOLERANCE_DEG);
    for &id in ids {
        let d = ang_diff(at(&net.links[id as usize].geometry), bearing);
        if d <= bd {
            bd = d;
            best = Some(id);
        }
    }
    best
}

fn control_of(code: &str) -> Option<Control> {
    Some(match code {
        "s" => Control::Signal,
        "a" => Control::AllWayStop,
        "t" => Control::TwoWayStop,
        "u" => Control::Uncontrolled,
        "c" => Control::TrafficCircle,
        _ => return None,
    })
}

/// The interventions of a scenario link (`#v1;a=...;s=...`) on `net`. `Err` names the first item that is malformed or has no match.
pub fn decode_scenario(net: &Network, topo: &Topo, origin: (f64, f64), link: &str) -> Result<Vec<Intervention>, String> {
    let h = link.trim_start_matches('#');
    let Some(items) = h.split(';').find_map(|t| t.strip_prefix("s=")) else { return Ok(Vec::new()) };
    let proj = Proj::new(origin.0, origin.1);
    let mut out = Vec::new();
    for raw in items.split('~') {
        let f: Vec<&str> = raw.split(',').collect();
        let g = f.get(1).filter(|g| g.len() == 10).and_then(|g| decode_geohash(g)).ok_or_else(|| format!("bad item {raw}"))?;
        let (x, y) = proj.to_local(g.1, g.0);
        let num = |k: usize| f.get(k).and_then(|v| v.parse::<f64>().ok());
        let miss = || format!("item {raw} matches nothing in the network");
        let mut iv = Intervention { ty: String::new(), ..Default::default() };
        match f[0] {
            "mf" => {
                iv.ty = "modal_filter".into();
                iv.link = Some(match_link(net, x, y, None).ok_or_else(miss)?.0);
            }
            "sl" => {
                iv.ty = "speed_limit".into();
                iv.link = Some(match_link(net, x, y, None).ok_or_else(miss)?.0);
                iv.speed = Some(num(2).ok_or_else(miss)?);
            }
            "sh" => {
                iv.ty = "speed_hump".into();
                let (l, along) = match_link(net, x, y, None).ok_or_else(miss)?;
                iv.link = Some(l);
                iv.position = Some((along * 10.0).round() / 10.0);
            }
            "ow" => {
                iv.ty = "one_way".into();
                iv.link = Some(match_link(net, x, y, Some(num(2).ok_or_else(miss)?)).ok_or_else(miss)?.0);
            }
            "tb" => {
                let (bi, bo) = (num(2).ok_or_else(miss)?, num(3).ok_or_else(miss)?);
                let mut found = None;
                for n in nodes_near(net, x, y) {
                    let inc: Vec<u32> = net.links.iter().filter(|l| l.to == n).map(|l| l.id).collect();
                    let outg: Vec<u32> = net.links.iter().filter(|l| l.from == n).map(|l| l.id).collect();
                    let a = best_by_bearing(net, &inc, bi, |g| heading_at(g, polyline_length(g)));
                    let b = best_by_bearing(net, &outg, bo, |g| heading_at(g, 0.0));
                    if let (Some(a), Some(b)) = (a, b) {
                        found = Some((a, b));
                        break;
                    }
                }
                let (a, b) = found.ok_or_else(miss)?;
                iv.ty = "turn_ban".into();
                iv.from_link = Some(a);
                iv.to_link = Some(b);
            }
            code => {
                let n = *nodes_near(net, x, y).first().ok_or_else(miss)?;
                iv.node = Some(n);
                match code {
                    "mn" => {
                        iv.ty = "modal_filter".into();
                        if let Some(b) = f.get(2) {
                            let mut free = node_legs(topo, net, n);
                            let mut links: Vec<u32> = Vec::new();
                            for bearing in b.split('.') {
                                let bearing: f64 = bearing.parse().map_err(|_| miss())?;
                                let mut best = None;
                                let mut bd = BEARING_TOLERANCE_DEG;
                                for (i, l) in free.iter().enumerate() {
                                    let d = ang_diff(l.bearing, bearing);
                                    if d <= bd {
                                        bd = d;
                                        best = Some(i);
                                    }
                                }
                                let l = free.remove(best.ok_or_else(miss)?);
                                links.extend(l.ins.iter().chain(l.outs.iter()));
                            }
                            links.sort_unstable();
                            iv.legs = Some(links);
                        }
                    }
                    "tc" => iv.ty = "traffic_circle".into(),
                    "ct" => {
                        iv.ty = "control".into();
                        iv.control = Some(f.get(2).and_then(|c| control_of(c)).ok_or_else(miss)?);
                    }
                    "st" => {
                        iv.ty = "signal_timing".into();
                        iv.cycle = Some(num(2).ok_or_else(miss)?);
                    }
                    "dd" => {
                        iv.ty = "diagonal_diverter".into();
                        iv.bearing = Some(num(2).ok_or_else(miss)?);
                    }
                    _ => return Err(format!("unknown item {raw}")),
                }
            }
        }
        out.push(iv);
    }
    Ok(out)
}
