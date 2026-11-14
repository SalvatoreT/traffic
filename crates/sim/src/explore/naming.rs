//! Street, block and intersection names as the app shows them: a port of `buildIndex` (`src/lib/naming.ts`) and
//! `describeIntervention` (`src/lib/describe.ts`, `src/lib/diverter.ts`) so proposal labels read like the app's.

use crate::diverter::node_legs;
use crate::explore::link::{point_along, polyline_length};
use crate::model::{Control, Intervention, Network, RoadClass};
use crate::topo::Topo;
use std::cmp::Ordering;

pub const UNNAMED: &str = "Unnamed road";

pub struct Block {
    /// Lowest link id of the block.
    pub key: u32,
    /// One or two directed links (a two-way block has both).
    pub links: Vec<u32>,
    pub a: u32,
    pub b: u32,
    pub name: String,
    pub label: String,
    pub cls: RoadClass,
    pub in_study: bool,
}

pub struct NameIndex {
    pub link_name: Vec<String>,
    pub node_name: Vec<String>,
    pub node_streets: Vec<Vec<String>>,
    pub blocks: Vec<Block>,
    pub block_of_link: Vec<usize>,
    pub incoming: Vec<Vec<u32>>,
    pub outgoing: Vec<Vec<u32>>,
}

fn locale_cmp(a: &str, b: &str) -> Ordering {
    a.to_lowercase().cmp(&b.to_lowercase()).then_with(|| a.cmp(b))
}

fn link_street(name: &str) -> String {
    let t = name.trim();
    if t.is_empty() {
        UNNAMED.into()
    } else {
        t.into()
    }
}

fn list_names(names: &[String]) -> String {
    match names.len() {
        0 | 1 => names.join(""),
        n => format!("{} and {}", names[..n - 1].join(", "), names[n - 1]),
    }
}

fn join_names(names: &[String], fallback: &str) -> String {
    match names.len() {
        0 => fallback.into(),
        1 | 2 => names.join(" / "),
        n => format!("{} / {} / +{}", names[0], names[1], n - 2),
    }
}

impl NameIndex {
    pub fn new(net: &Network) -> NameIndex {
        let n = net.nodes.len();
        let mut incoming: Vec<Vec<u32>> = vec![Vec::new(); n];
        let mut outgoing: Vec<Vec<u32>> = vec![Vec::new(); n];
        for l in &net.links {
            outgoing[l.from as usize].push(l.id);
            incoming[l.to as usize].push(l.id);
        }
        let mut node_streets: Vec<Vec<String>> = vec![Vec::new(); n];
        for l in &net.links {
            for nid in [l.from, l.to] {
                let s = link_street(&l.name);
                if !node_streets[nid as usize].contains(&s) {
                    node_streets[nid as usize].push(s);
                }
            }
        }
        for a in node_streets.iter_mut() {
            a.sort_by(|p, q| match (p == UNNAMED, q == UNNAMED) {
                (true, true) => Ordering::Equal,
                (true, false) => Ordering::Greater,
                (false, true) => Ordering::Less,
                _ => locale_cmp(p, q),
            });
        }
        let node_name: Vec<String> = node_streets
            .iter()
            .enumerate()
            .map(|(i, s)| match s.len() {
                0 => format!("Node {i}"),
                1 => format!("{} (junction)", s[0]),
                _ => join_names(s, &format!("Node {i}")).replace(" / ", " & "),
            })
            .collect();
        let link_name: Vec<String> = net
            .links
            .iter()
            .map(|l| {
                let own = l.name.trim();
                if !own.is_empty() {
                    return own.to_string();
                }
                let kind = if l.class == RoadClass::Service { "service road" } else { "road" };
                let near: Vec<&String> = node_streets[l.from as usize].iter().chain(node_streets[l.to as usize].iter()).filter(|s| s.as_str() != UNNAMED).collect();
                match near.first() {
                    Some(s) => format!("Unnamed {kind} off {s}"),
                    None => format!("Unnamed {kind}"),
                }
            })
            .collect();
        let mut blocks: Vec<Block> = Vec::new();
        let mut block_of_link = vec![usize::MAX; net.links.len()];
        for l in &net.links {
            if block_of_link[l.id as usize] != usize::MAX {
                continue;
            }
            let rev = l.reverse.filter(|&r| r != l.id && (r as usize) < net.links.len());
            let ids: Vec<u32> = match rev {
                Some(r) => vec![l.id.min(r), l.id.max(r)],
                None => vec![l.id],
            };
            let first = &net.links[ids[0] as usize];
            let unnamed = first.name.trim().is_empty();
            let name = link_name[first.id as usize].clone();
            let others = |nid: u32| -> Vec<String> { node_streets[nid as usize].iter().filter(|s| **s != name && s.as_str() != UNNAMED).cloned().collect() };
            let is_dead_end = |nid: u32| !net.nodes[nid as usize].gate && incoming[nid as usize].len() + outgoing[nid as usize].len() <= if rev.is_some() { 2 } else { 1 };
            let end_text = |nid: u32| join_names(&others(nid), if net.nodes[nid as usize].gate { "the study-area edge" } else { "a dead end" });
            let label = if unnamed {
                let dead = if is_dead_end(first.from) {
                    Some(first.from)
                } else if is_dead_end(first.to) {
                    Some(first.to)
                } else {
                    None
                };
                let far = if dead == Some(first.from) { first.to } else { first.from };
                let base = name.strip_prefix("Unnamed service road off ").or_else(|| name.strip_prefix("Unnamed road off ")).unwrap_or(&name).to_string();
                let far_streets: Vec<String> = others(far).into_iter().filter(|s| *s != base).collect();
                if dead.is_some() {
                    format!("{name} (cul-de-sac end)")
                } else if !far_streets.is_empty() {
                    format!("{name} to {}", join_names(&far_streets, ""))
                } else {
                    name.clone()
                }
            } else {
                let (ea, eb) = (end_text(first.from), end_text(first.to));
                if ea == eb { format!("{name} at {ea}") } else { format!("{name} between {ea} and {eb}") }
            };
            let idx = blocks.len();
            for &id in &ids {
                block_of_link[id as usize] = idx;
            }
            blocks.push(Block { key: ids[0], links: ids.clone(), a: first.from, b: first.to, name, label, cls: first.class, in_study: ids.iter().any(|&i| net.links[i as usize].in_study_area) });
        }
        NameIndex { link_name, node_name, node_streets, blocks, block_of_link, incoming, outgoing }
    }

    pub fn block_label(&self, link: u32) -> String {
        self.block_of_link.get(link as usize).and_then(|&b| self.blocks.get(b)).map(|b| b.label.clone()).unwrap_or_else(|| format!("link {link}"))
    }

    pub fn node_label(&self, node: u32) -> String {
        self.node_name.get(node as usize).cloned().unwrap_or_else(|| format!("node {node}"))
    }
}

pub fn control_label(c: Control) -> &'static str {
    match c {
        Control::AllWayStop => "All-way stop",
        Control::TwoWayStop => "Two-way stop",
        Control::Signal => "Traffic signal",
        Control::Uncontrolled => "Uncontrolled",
        Control::TrafficCircle => "Traffic circle",
    }
}

const ON_LINE_DEG: f64 = 2.0;

fn side_of(leg: f64, barrier: f64) -> Option<bool> {
    let s = (leg - barrier).to_radians().sin();
    if s.abs() < ON_LINE_DEG.to_radians().sin() {
        None
    } else {
        Some(s > 0.0)
    }
}

const CARD4: [&str; 4] = ["north", "east", "south", "west"];
const CARD8: [&str; 8] = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"];

/// "Hillegass Avenue (north) with 62nd Street (west), and Hillegass Avenue (south) with 62nd Street (east)" (`connectedLabel`).
pub fn connected_label(net: &Network, topo: &Topo, idx: &NameIndex, node: u32, bearing: f64) -> Option<String> {
    let _ = idx;
    let legs = node_legs(topo, net, node);
    if legs.len() != 4 {
        return None;
    }
    let barrier = bearing.rem_euclid(360.0) % 180.0;
    let mut a: Vec<usize> = Vec::new();
    let mut b: Vec<usize> = Vec::new();
    for (i, l) in legs.iter().enumerate() {
        match side_of(l.bearing, barrier)? {
            true => a.push(i),
            false => b.push(i),
        }
    }
    if a.len() != 2 {
        return None;
    }
    let street = |i: usize| -> String {
        let l = legs[i].outs.first().or(legs[i].ins.first()).copied().unwrap_or(0);
        link_street(&net.links[l as usize].name)
    };
    let four: Vec<&str> = legs.iter().map(|l| CARD4[(((l.bearing + 45.0) % 360.0) / 90.0).floor() as usize]).collect();
    let mut uniq = four.clone();
    uniq.sort();
    uniq.dedup();
    let dir: Vec<&str> = if uniq.len() == legs.len() { four } else { legs.iter().map(|l| CARD8[(((l.bearing + 22.5) % 360.0) / 45.0).floor() as usize]).collect() };
    let mut ns: Vec<(String, Vec<f64>)> = Vec::new();
    for (i, l) in legs.iter().enumerate() {
        let s = street(i);
        let v = l.bearing.to_radians().sin().abs();
        match ns.iter_mut().find(|e| e.0 == s) {
            Some(e) => e.1.push(v),
            None => ns.push((s, vec![v])),
        }
    }
    let score = |s: &str| -> f64 {
        let v = &ns.iter().find(|e| e.0 == s).unwrap().1;
        v.iter().sum::<f64>() / v.len() as f64
    };
    let mut keys: Vec<&String> = ns.iter().map(|e| &e.0).collect();
    keys.sort_by(|p, q| score(p).partial_cmp(&score(q)).unwrap_or(Ordering::Equal).then_with(|| locale_cmp(p, q)));
    let lead = keys[0].clone();
    let text = |i: usize| format!("{} ({})", street(i), dir[i]);
    let mut pairs: Vec<(usize, usize)> = [(a[0], a[1]), (b[0], b[1])]
        .iter()
        .map(|&(x, y)| {
            let first = if street(y) == lead && street(x) != lead { y } else { x };
            (first, if first == x { y } else { x })
        })
        .collect();
    pairs.sort_by(|p, q| ((legs[p.0].bearing + 45.0) % 360.0).partial_cmp(&((legs[q.0].bearing + 45.0) % 360.0)).unwrap_or(Ordering::Equal));
    Some(pairs.iter().map(|p| format!("{} with {}", text(p.0), text(p.1))).collect::<Vec<_>>().join(", and "))
}

/// "northbound": the compass direction a link carries traffic, from the way it leaves its start (`compassWord`).
pub fn compass_word(net: &Network, link: u32) -> String {
    let i = ((net.leg_bearing(link, true) / 90.0).round() as usize) % 4;
    format!("{}bound", ["north", "east", "south", "west"][i])
}

/// "toward 63rd Street": the streets that meet a link's far end, or `None` when none does (`headingTo`).
pub fn heading_to(net: &Network, idx: &NameIndex, link: u32) -> Option<String> {
    let l = &net.links[link as usize];
    let own = link_street(&l.name);
    let o: Vec<&String> = idx.node_streets[l.to as usize].iter().filter(|s| **s != own && s.as_str() != UNNAMED).collect();
    let list = match o.len() {
        0 => return None,
        1 => o[0].clone(),
        2 => format!("{} and {}", o[0], o[1]),
        n => format!("{}, {} and {} more", o[0], o[1], n - 2),
    };
    Some(format!("toward {list}"))
}

/// The app's one-line description of an intervention (`describeIntervention`).
pub fn describe(net: &Network, topo: &Topo, idx: &NameIndex, iv: &Intervention) -> String {
    let ln = |l: u32| idx.block_label(l);
    let nn = |n: u32| idx.node_label(n);
    match iv.ty.as_str() {
        "modal_filter" => match (iv.link, iv.node) {
            (Some(l), _) => format!("Modal filter on {}", ln(l)),
            (None, Some(n)) => match iv.legs.as_ref().filter(|_| (n as usize) < net.nodes.len()) {
                Some(legs) => {
                    let mut names: Vec<String> = node_legs(topo, net, n)
                        .iter()
                        .filter(|l| l.ins.iter().chain(l.outs.iter()).any(|k| legs.contains(k)))
                        .filter_map(|l| l.outs.first().or(l.ins.first()).map(|&k| idx.link_name[k as usize].clone()))
                        .collect();
                    names.sort_by(|a, b| locale_cmp(a, b));
                    names.dedup();
                    let mut others: Vec<String> = node_legs(topo, net, n).iter().filter_map(|l| l.outs.first().or(l.ins.first()).map(|&k| idx.link_name[k as usize].clone())).filter(|s| !names.contains(s) && !s.starts_with("Unnamed")).collect();
                    others.sort_by(|a, b| locale_cmp(a, b));
                    others.dedup();
                    let at = if others.is_empty() { nn(n) } else { list_names(&others) };
                    format!("Modal filter on {} at {}", list_names(&names), at)
                }
                None => format!("Modal filter at {}", nn(n)),
            },
            _ => "Modal filter".into(),
        },
        "speed_limit" => format!("Speed limit {} mph on {}", js_round(iv.speed.unwrap_or(0.0) * 2.23694), ln(iv.link.unwrap_or(0))),
        "speed_hump" => format!("Speed hump on {}", ln(iv.link.unwrap_or(0))),
        "traffic_circle" => format!("Traffic circle at {}", nn(iv.node.unwrap_or(0))),
        "control" => format!("{} at {}", control_label(iv.control.unwrap_or(Control::Uncontrolled)), nn(iv.node.unwrap_or(0))),
        "signal_timing" => format!("Signal cycle {} s at {}", iv.cycle.unwrap_or(0.0), nn(iv.node.unwrap_or(0))),
        "one_way" => {
            let l = iv.link.unwrap_or(0);
            if (l as usize) >= net.links.len() {
                return format!("One-way on {}", ln(l));
            }
            match heading_to(net, idx, l) {
                Some(to) => format!("One-way {} on {} ({to})", compass_word(net, l), ln(l)),
                None => format!("One-way {} on {}", compass_word(net, l), ln(l)),
            }
        }
        "diagonal_diverter" => {
            let n = iv.node.unwrap_or(0);
            match connected_label(net, topo, idx, n, iv.bearing.unwrap_or(0.0)) {
                Some(c) => format!("Diagonal diverter at {}, connecting {c}", nn(n)),
                None => format!("Diagonal diverter at {}", nn(n)),
            }
        }
        "turn_ban" => {
            let a = iv.from_link.and_then(|l| net.links.get(l as usize));
            let b = iv.to_link.and_then(|l| net.links.get(l as usize));
            format!(
                "Turn ban at {}: {} to {}",
                a.map_or("?".to_string(), |a| nn(a.to)),
                a.map_or("?".to_string(), |a| idx.link_name[a.id as usize].clone()),
                b.map_or("?".to_string(), |b| idx.link_name[b.id as usize].clone())
            )
        }
        other => other.to_string(),
    }
}

fn js_round(x: f64) -> f64 {
    (x + 0.5).floor()
}

/// Point at the middle of a link (used by reports).
pub fn link_mid(net: &Network, l: u32) -> (f64, f64) {
    let g = &net.links[l as usize].geometry;
    let p = point_along(g, polyline_length(g) / 2.0);
    (p.0, p.1)
}
