//! Slow Street: one intervention that limits every block of one named street, inside the study area, to 15 mph. The street is found from the
//! network alone (names, study-area flag, shared intersections), so any area and any street works. The simulator never sees the item: `expand`
//! turns it into one per-block `speed_limit` each, which the engine already applies. Mirrored by `src/lib/slowstreet.ts`.

use super::cands::mph_to_mps;
use crate::model::{Intervention, Link, Network};
use std::collections::{BTreeMap, BTreeSet};

pub const TYPE: &str = "slow_street";
pub const SLOW_STREET_MPH: f64 = 15.0;
const UNNAMED: &str = "Unnamed road";

/// The speed a Slow Street sets, m/s at the two decimals a scenario link carries.
pub fn slow_street_mps() -> f64 {
    mph_to_mps(SLOW_STREET_MPH)
}

/// The connected run of one street inside the study area that contains a chosen block.
#[derive(Clone, Debug, PartialEq)]
pub struct Run {
    pub name: String,
    /// Directed links of each block (one or two), blocks in order of their lowest link id.
    pub blocks: Vec<Vec<u32>>,
    /// First link of the block with the lowest link id: the same whichever block of the run was chosen.
    pub canonical: u32,
    pub from: String,
    pub to: String,
    /// The street has other blocks in the study area that this run does not reach.
    pub split: bool,
}

fn name_of(l: &Link) -> Option<&str> {
    let t = l.name.trim();
    (!t.is_empty()).then_some(t)
}

fn block_key(net: &Network, l: &Link) -> u32 {
    match l.reverse.filter(|&r| r != l.id && (r as usize) < net.links.len()) {
        Some(r) => l.id.min(r),
        None => l.id,
    }
}

fn join_names(names: &[String], fallback: &str) -> String {
    match names.len() {
        0 => fallback.into(),
        1 | 2 => names.join(" / "),
        n => format!("{} / {} / +{}", names[0], names[1], n - 2),
    }
}

/// The run of the street of `link`: the blocks with its name that lie in the study area and connect to the link's block through shared
/// intersections. None for an unnamed link or one outside the study area.
pub fn street_run(net: &Network, link: u32) -> Option<Run> {
    let l0 = net.links.get(link as usize)?;
    let name = name_of(l0)?;
    let mut blocks: BTreeMap<u32, Vec<u32>> = BTreeMap::new();
    for l in net.links.iter().filter(|l| name_of(l) == Some(name)) {
        blocks.entry(block_key(net, l)).or_default().push(l.id);
    }
    blocks.retain(|_, ls| ls.iter().any(|&i| net.links[i as usize].in_study_area));
    let start = block_key(net, l0);
    if !blocks.contains_key(&start) {
        return None;
    }
    let ends = |ls: &[u32]| -> BTreeSet<u32> { ls.iter().flat_map(|&i| [net.links[i as usize].from, net.links[i as usize].to]).collect() };
    let mut at_node: BTreeMap<u32, Vec<u32>> = BTreeMap::new();
    for (k, ls) in &blocks {
        for n in ends(ls) {
            at_node.entry(n).or_default().push(*k);
        }
    }
    let mut run: BTreeSet<u32> = BTreeSet::new();
    let mut todo = vec![start];
    while let Some(k) = todo.pop() {
        if !run.insert(k) {
            continue;
        }
        for n in ends(&blocks[&k]) {
            todo.extend(at_node[&n].iter().copied().filter(|b| !run.contains(b)));
        }
    }
    let mut touching: BTreeMap<u32, usize> = BTreeMap::new();
    for k in &run {
        for n in ends(&blocks[k]) {
            *touching.entry(n).or_default() += 1;
        }
    }
    let mut street_names: BTreeMap<u32, BTreeSet<String>> = BTreeMap::new();
    for l in &net.links {
        let t = l.name.trim();
        if !t.is_empty() && t != name && t != UNNAMED {
            for n in [l.from, l.to] {
                street_names.entry(n).or_default().insert(t.to_string());
            }
        }
    }
    let text = |n: u32| -> String {
        let others: Vec<String> = street_names.get(&n).map(|s| s.iter().cloned().collect()).unwrap_or_default();
        join_names(&others, if net.nodes[n as usize].gate { "the study-area edge" } else { "a dead end" })
    };
    let ends_of_run: Vec<u32> = touching.iter().filter(|(_, c)| **c == 1).map(|(n, _)| *n).collect();
    let dist = |a: u32, b: u32| (net.nodes[a as usize].x - net.nodes[b as usize].x).hypot(net.nodes[a as usize].y - net.nodes[b as usize].y);
    let mut pair: Option<(u32, u32)> = None;
    let mut best = -1.0;
    for (i, &a) in ends_of_run.iter().enumerate() {
        for &b in &ends_of_run[i + 1..] {
            if dist(a, b) > best {
                best = dist(a, b);
                pair = Some((a, b));
            }
        }
    }
    let (from, to) = match pair {
        Some((a, b)) => {
            let (ta, tb) = (text(a), text(b));
            if (ta.to_lowercase(), a) <= (tb.to_lowercase(), b) { (ta, tb) } else { (tb, ta) }
        }
        None => (String::new(), String::new()),
    };
    let first = *run.iter().next()?;
    Some(Run { name: name.to_string(), canonical: blocks[&first][0], blocks: run.iter().map(|k| blocks[k].clone()).collect(), from, to, split: run.len() < blocks.len() })
}

/// "Slow Street on Colby Street (15 mph, 62nd Street to Alcatraz Avenue)".
pub fn label(run: &Run) -> String {
    let span = if run.from.is_empty() { "a loop".to_string() } else { format!("{} to {}", run.from, run.to) };
    let gap = if run.split { "; this connected stretch only, the street has another stretch in the study area" } else { "" };
    format!("Slow Street on {} ({} mph, {span}{gap})", run.name, SLOW_STREET_MPH)
}

/// The engine's form of an intervention list: each Slow Street becomes a 15 mph `speed_limit` on every block of its run that is faster
/// than that (a limit never raises a slower block). A Slow Street that matches no street is dropped.
pub fn expand(net: &Network, ivs: &[Intervention]) -> Vec<Intervention> {
    if !ivs.iter().any(|iv| iv.ty == TYPE) {
        return ivs.to_vec();
    }
    let mps = slow_street_mps();
    let mut out = Vec::new();
    for iv in ivs {
        if iv.ty != TYPE {
            out.push(iv.clone());
            continue;
        }
        let Some(run) = iv.link.and_then(|l| street_run(net, l)) else { continue };
        for b in &run.blocks {
            if b.iter().all(|&l| net.links[l as usize].speed_limit > mps + 0.1) {
                out.push(Intervention { ty: "speed_limit".into(), link: Some(b[0]), speed: Some(mps), ..Default::default() });
            }
        }
    }
    out
}
