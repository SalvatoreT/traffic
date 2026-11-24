//! Ban sets (change `turn-ban-set-candidates`): a named set of turn bans that the search treats as ONE intervention, so a depth of 6 can hold
//! "all left turns onto side streets" and five other changes. Candidates are derived from the network alone (no place is named in code) and
//! mirror `tools/lib/turn-ban-sets.ts`, which measured the same sets by hand (change `perimeter-turn-bans`).
//!
//! A ban set travels through the search as an `Intervention` of type `ban_set` whose `legs` hold the banned movements as `from, to` link pairs.
//! Like a Slow Street it never reaches the simulator: `street::expand` turns it into one `turn_ban` per pair, and the scenario link
//! (`link::encode_scenario`) lists every ban. The simulator and the app see only turn bans. Off unless `Params::ban_sets` is set.

use super::cands::{Cand, Hotspots};
use super::{check_access_for, stranded_nodes, Study};
use crate::eff::Eff;
use crate::model::{Intervention, Network, RoadClass};
use std::borrow::Cow;
use std::collections::{BTreeMap, BTreeSet, HashSet};

pub const TYPE: &str = "ban_set";
pub const KIND: &str = "ban_set";
/// First clause of the reason a package or set is left out for holding more turn bans than the cap allows.
pub const OVER_CAP: &str = "over the turn-ban cap";
const UNNAMED: &str = "Unnamed road";
/// The turn classes of the app's `turnKindOf` (`src/lib/turnkind.ts`): a heading change under `STRAIGHT_DEG` is straight on, over `U_DEG` a U-turn.
const STRAIGHT_DEG: f64 = 25.0;
const U_DEG: f64 = 155.0;
const REACH_M: f64 = 30.0;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Turn {
    Left,
    Right,
    Straight,
}

/// `turnKindOf` of the app: the turn from link `from` into link `to`, `None` for a U-turn.
pub fn turn_kind(net: &Network, from: u32, to: u32) -> Option<Turn> {
    use super::link::{point_along, polyline_length};
    let (a, b) = (net.links.get(from as usize)?, net.links.get(to as usize)?);
    let (la, lb) = (polyline_length(&a.geometry), polyline_length(&b.geometry));
    let r = (REACH_M.min(0.8 * la)).min(REACH_M.min(0.8 * lb));
    let pa = point_along(&a.geometry, la - r);
    let pb = point_along(&b.geometry, r);
    let (ea, sb) = (a.geometry.last()?, b.geometry.first()?);
    let corner = ((ea[0] + sb[0]) / 2.0, (ea[1] + sb[1]) / 2.0);
    let head_in = (corner.1 - pa.1).atan2(corner.0 - pa.0);
    let head_out = (pb.1 - corner.1).atan2(pb.0 - corner.0);
    let mut d = (head_out - head_in) * 180.0 / std::f64::consts::PI;
    while d > 180.0 {
        d -= 360.0;
    }
    while d <= -180.0 {
        d += 360.0;
    }
    if d.abs() < STRAIGHT_DEG {
        Some(Turn::Straight)
    } else if d.abs() > U_DEG {
        None
    } else if d > 0.0 {
        Some(Turn::Left)
    } else {
        Some(Turn::Right)
    }
}

fn street(l: &crate::model::Link) -> String {
    let t = l.name.trim();
    if t.is_empty() {
        UNNAMED.into()
    } else {
        t.into()
    }
}

/// An entry movement (design D1 of `perimeter-turn-bans`): a turn from a link that is not a residential or service link inside the study area
/// onto one that is, from a bounding street or from outside the area.
#[derive(Clone, Debug)]
pub struct Movement {
    pub from: u32,
    pub to: u32,
    pub node: u32,
    /// The bounding street the movement comes from; `None` for an outside link that is not on one.
    pub bounding: Option<String>,
    pub turn: Turn,
    pub onto: String,
    /// Connected run of the entered street inside the study area.
    pub run: usize,
    /// Banned in the base network in every searched period.
    pub base_banned: bool,
    /// The link item for this one ban decodes to this movement.
    pub encodes: bool,
}

impl Movement {
    pub fn usable(&self) -> bool {
        self.encodes && !self.base_banned
    }
}

#[derive(Clone, Debug)]
pub struct Run {
    pub street: String,
    pub through: bool,
}

pub struct Analysis {
    pub bounding: Vec<String>,
    pub runs: Vec<Run>,
    pub run_of: BTreeMap<u32, usize>,
    pub movements: Vec<Movement>,
}

/// Names of the study area's non-local links, sorted.
pub fn bounding_streets(study: &Study) -> Vec<String> {
    let names: BTreeSet<String> = study.net.links.iter().filter(|l| study.is_boundary[l.id as usize]).map(|l| l.name.trim().to_string()).filter(|n| !n.is_empty()).collect();
    names.into_iter().collect()
}

fn runs_of(study: &Study, bounding: &BTreeSet<String>) -> (Vec<Run>, BTreeMap<u32, usize>) {
    let net = &study.net;
    let local: Vec<&crate::model::Link> = net.links.iter().filter(|l| study.is_local[l.id as usize]).collect();
    let mut parent: BTreeMap<u32, u32> = local.iter().map(|l| (l.id, l.id)).collect();
    fn find(p: &mut BTreeMap<u32, u32>, x: u32) -> u32 {
        let mut r = x;
        while p[&r] != r {
            r = p[&r];
        }
        let mut c = x;
        while p[&c] != r {
            let n = p[&c];
            p.insert(c, r);
            c = n;
        }
        r
    }
    let mut at_node: BTreeMap<(u32, String), Vec<u32>> = BTreeMap::new();
    for l in &local {
        let name = l.name.trim();
        if name.is_empty() {
            continue;
        }
        for n in [l.from, l.to] {
            at_node.entry((n, name.to_string())).or_default().push(l.id);
        }
    }
    for ids in at_node.values() {
        for &id in &ids[1..] {
            let (a, b) = (find(&mut parent, id), find(&mut parent, ids[0]));
            parent.insert(a, b);
        }
    }
    let mut incident: BTreeMap<u32, BTreeSet<String>> = BTreeMap::new();
    for l in &net.links {
        let t = l.name.trim();
        if t.is_empty() || !bounding.contains(t) {
            continue;
        }
        for n in [l.from, l.to] {
            incident.entry(n).or_default().insert(t.to_string());
        }
    }
    let mut groups: BTreeMap<u32, Vec<&crate::model::Link>> = BTreeMap::new();
    for l in &local {
        let r = find(&mut parent, l.id);
        groups.entry(r).or_default().push(l);
    }
    let (mut runs, mut run_of) = (Vec::new(), BTreeMap::new());
    for (_, ls) in groups {
        let mut touches: BTreeSet<&String> = BTreeSet::new();
        for l in &ls {
            for n in [l.from, l.to] {
                touches.extend(incident.get(&n).into_iter().flatten());
            }
        }
        let id = runs.len();
        runs.push(Run { street: street(ls[0]), through: touches.len() >= 2 });
        for l in &ls {
            run_of.insert(l.id, id);
        }
    }
    (runs, run_of)
}

/// Every entry movement of the study's network, classified. `periods` are the searched periods: a movement the base network bans in every one
/// of them is left out of the sets.
pub fn analyze(study: &Study, periods: &[&str]) -> Analysis {
    let net = &study.net;
    let bounding: BTreeSet<String> = bounding_streets(study).into_iter().collect();
    let (runs, run_of) = runs_of(study, &bounding);
    let mut banned: Option<HashSet<(u32, u32)>> = None;
    for p in periods {
        let Some((n, _)) = study.period_access.get(*p) else { continue };
        let this: HashSet<(u32, u32)> = n.turn_bans.iter().map(|b| (b.from, b.to)).collect();
        banned = Some(match banned {
            None => this,
            Some(mut b) => {
                b.retain(|m| this.contains(m));
                b
            }
        });
    }
    let banned = banned.unwrap_or_else(|| net.turn_bans.iter().filter(|b| b.periods.is_empty()).map(|b| (b.from, b.to)).collect());
    let mut outs: BTreeMap<u32, Vec<u32>> = BTreeMap::new();
    for l in &net.links {
        outs.entry(l.from).or_default().push(l.id);
    }
    let mut movements = Vec::new();
    for a in net.links.iter().filter(|l| !study.is_local[l.id as usize]) {
        let name = a.name.trim();
        let on_bounding = a.in_study_area || bounding.contains(name);
        for &b in outs.get(&a.to).into_iter().flatten() {
            let bl = &net.links[b as usize];
            if !study.is_local[b as usize] || bl.to == a.from {
                continue;
            }
            let Some(turn) = turn_kind(net, a.id, b) else { continue };
            movements.push(Movement {
                from: a.id,
                to: b,
                node: a.to,
                bounding: (on_bounding && !name.is_empty()).then(|| name.to_string()),
                turn,
                onto: street(bl),
                run: run_of.get(&b).copied().unwrap_or(usize::MAX),
                base_banned: banned.contains(&(a.id, b)),
                encodes: true,
            });
        }
    }
    for m in movements.iter_mut() {
        let iv = Intervention { ty: "turn_ban".into(), from_link: Some(m.from), to_link: Some(m.to), ..Default::default() };
        let link = study.encode(std::slice::from_ref(&iv), None);
        m.encodes = matches!(super::decode::decode_scenario(net, &study.topo, study.origin, &link).as_deref(), Ok([b]) if b.ty == "turn_ban" && b.from_link == Some(m.from) && b.to_link == Some(m.to));
    }
    movements.sort_by(|p, q| (p.bounding.clone().unwrap_or_else(|| "~".into()), &p.onto, p.node, p.from, p.to).cmp(&(q.bounding.clone().unwrap_or_else(|| "~".into()), &q.onto, q.node, q.from, q.to)));
    Analysis { bounding: bounding.into_iter().collect(), runs, run_of, movements }
}

/// The banned movements of a `ban_set` intervention.
pub fn pairs(iv: &Intervention) -> Vec<(u32, u32)> {
    iv.legs.as_deref().unwrap_or(&[]).chunks_exact(2).map(|c| (c[0], c[1])).collect()
}

pub fn set_iv(moves: &[(u32, u32)]) -> Intervention {
    let mut v: Vec<(u32, u32)> = moves.to_vec();
    v.sort_unstable();
    v.dedup();
    Intervention { ty: TYPE.into(), legs: Some(v.iter().flat_map(|&(a, b)| [a, b]).collect()), ..Default::default() }
}

/// The interventions with every ban set written out as its turn bans. Anything else is untouched.
pub fn flatten(ivs: &[Intervention]) -> Cow<'_, [Intervention]> {
    if !ivs.iter().any(|iv| iv.ty == TYPE) {
        return Cow::Borrowed(ivs);
    }
    let mut out = Vec::new();
    for iv in ivs {
        if iv.ty == TYPE {
            out.extend(pairs(iv).into_iter().map(|(a, b)| Intervention { ty: "turn_ban".into(), from_link: Some(a), to_link: Some(b), ..Default::default() }));
        } else {
            out.push(iv.clone());
        }
    }
    Cow::Owned(out)
}

/// Individual turn bans in a package: one for each `turn_ban`, the size of each ban set.
pub fn ban_count(ivs: &[Intervention]) -> usize {
    ivs.iter().map(|iv| if iv.ty == TYPE { iv.legs.as_ref().map_or(0, |l| l.len() / 2) } else { (iv.ty == "turn_ban") as usize }).sum()
}

fn list_and(items: &[String]) -> String {
    match items.len() {
        0 | 1 => items.join(""),
        n => format!("{} and {}", items[..n - 1].join(", "), items[n - 1]),
    }
}

/// "No left turns from the bounding streets onto side streets (21 turns)": the words come from the movements alone. `onto` names the streets
/// entered when the movements do not all enter one street.
pub fn label(net: &Network, moves: &[(u32, u32)], onto: Option<&str>) -> String {
    let n = moves.len();
    let bounding: BTreeSet<String> = net.links.iter().filter(|l| l.in_study_area && !matches!(l.class, RoadClass::Residential | RoadClass::Service)).map(|l| l.name.trim().to_string()).filter(|s| !s.is_empty()).collect();
    let kinds: BTreeSet<&str> = moves.iter().map(|&(a, b)| match turn_kind(net, a, b) {
        Some(Turn::Left) => "left",
        Some(Turn::Right) => "right",
        _ => "other",
    }).collect();
    let what = match (kinds.len(), kinds.iter().next()) {
        (1, Some(&"left")) => "No left turns",
        (1, Some(&"right")) => "No right turns",
        _ => "No turns",
    };
    let mut from_b: BTreeSet<String> = BTreeSet::new();
    let mut other = false;
    let mut onto_names: BTreeSet<String> = BTreeSet::new();
    for &(a, b) in moves {
        let (la, lb) = (&net.links[a as usize], &net.links[b as usize]);
        let t = la.name.trim();
        if bounding.contains(t) {
            from_b.insert(t.to_string());
        } else {
            other = true;
        }
        onto_names.insert(street(lb));
    }
    let from_all = !bounding.is_empty() && from_b == bounding;
    let from = if from_all && other {
        "from the bounding streets and streets outside the area".to_string()
    } else if from_all {
        "from the bounding streets".to_string()
    } else if from_b.is_empty() {
        "from streets outside the area".to_string()
    } else if from_b.len() <= 3 && !other {
        format!("from {}", list_and(&from_b.iter().cloned().collect::<Vec<_>>()))
    } else {
        format!("from {} streets", from_b.len() + other as usize)
    };
    let to = match (onto, onto_names.len()) {
        (Some(o), _) => format!("onto {o}"),
        (None, 1) => format!("onto {}", onto_names.iter().next().unwrap()),
        _ => "onto side streets".to_string(),
    };
    let single_to = onto.is_none() && onto_names.len() == 1;
    let text = if single_to && (from_b.len() > 1 || other) { format!("{what} {to}") } else { format!("{what} {from} {to}") };
    format!("{text} ({n} {})", if n == 1 { "turn" } else { "turns" })
}

/// A ban set the search may use.
#[derive(Clone, Debug)]
pub struct Set {
    pub id: String,
    pub label: String,
    pub moves: Vec<(u32, u32)>,
    pub note: String,
}

#[derive(Clone, Debug)]
pub struct DroppedSet {
    pub id: String,
    pub label: String,
    pub bans: usize,
    pub reason: String,
}

#[derive(Clone, Debug, Default)]
pub struct Generated {
    /// Entry movements found, and how many the sets can use.
    pub entry_movements: usize,
    pub usable: usize,
    pub sets: Vec<Set>,
    pub dropped: Vec<DroppedSet>,
}

fn slug(s: &str) -> String {
    let t: String = s.to_lowercase().chars().map(|c| if c.is_ascii_alphanumeric() { c } else { '-' }).collect();
    let t = t.split('-').filter(|p| !p.is_empty()).collect::<Vec<_>>().join("-");
    if t.is_empty() {
        "unnamed".into()
    } else {
        t
    }
}

/// In-study nodes the package strands that the base network does not, over `periods`, lowest id first.
fn new_stranded(study: &Study, ivs: &[Intervention], periods: &[&str]) -> Vec<u32> {
    let expanded = super::street::expand(&study.net, ivs);
    let mut bad: BTreeSet<u32> = BTreeSet::new();
    for p in periods {
        let Some((net, base)) = study.period_access.get(*p) else { continue };
        let eff = Eff::derive(&study.topo, net, &expanded);
        bad.extend(stranded_nodes(study, &eff).into_iter().filter(|n| !base.contains(n)));
    }
    bad.into_iter().collect()
}

/// Takes the movements onto the street next to a stranded node out of `moves` until no node is stranded (the access-safe variant of the all-turns
/// set, as `keepAccess` in the TypeScript generator). `None` when a node stays stranded with nothing left to take out.
fn keep_access(study: &Study, a: &Analysis, moves: Vec<usize>, periods: &[&str]) -> Option<(Vec<usize>, Vec<usize>)> {
    let (mut kept, mut exempt) = (moves, Vec::new());
    for _ in 0..50 {
        let ivs = [set_iv(&kept.iter().map(|&i| (a.movements[i].from, a.movements[i].to)).collect::<Vec<_>>())];
        let bad = new_stranded(study, &ivs, periods);
        let Some(&node) = bad.first() else { return Some((kept, exempt)) };
        let runs: BTreeSet<usize> = study.net.links.iter().filter(|l| l.from == node || l.to == node).filter_map(|l| a.run_of.get(&l.id).copied()).collect();
        let (drop, keep): (Vec<usize>, Vec<usize>) = kept.iter().partition(|&&i| runs.contains(&a.movements[i].run));
        if drop.is_empty() {
            return None;
        }
        exempt.extend(drop);
        kept = keep;
    }
    Some((kept, exempt))
}

/// The ban sets of the study's network, over the searched `periods`: all left turns, all right turns, all turns (and the variant that leaves open the
/// turns a street needs for access), the turns onto the through streets, and for each bounding street and each interior street its turns and its
/// left turns. A set holds the entry left and right turns only (straight-across movements stay open). A set with fewer than two bans is the
/// single ban and is not a set; a set equal to an earlier one is merged into it; a set that strands a node is dropped with the reason.
pub fn generate(study: &Study, periods: &[&str]) -> Generated {
    generate_capped(study, periods, None)
}

/// Why a set of `bans` bans is not a candidate under `cap`, or `None` when it fits (or there is no cap).
pub fn over_cap_reason(bans: usize, cap: Option<usize>) -> Option<String> {
    cap.filter(|&c| bans > c).map(|c| format!("{OVER_CAP}: {bans} individual turn bans, more than the cap of {c}"))
}

/// `generate` with a cap on the bans of a set (`Params::max_turn_bans`): a set with more bans is dropped with the reason. `None` is `generate`.
pub fn generate_capped(study: &Study, periods: &[&str], cap: Option<usize>) -> Generated {
    let a = analyze(study, periods);
    let mut out = Generated { entry_movements: a.movements.len(), usable: a.movements.iter().filter(|m| m.usable()).count(), ..Default::default() };
    let turns: Vec<usize> = (0..a.movements.len()).filter(|&i| a.movements[i].usable() && a.movements[i].turn != Turn::Straight).collect();
    let left = |v: &[usize]| -> Vec<usize> { v.iter().copied().filter(|&i| a.movements[i].turn == Turn::Left).collect() };
    let mut want: Vec<(String, Vec<usize>, Option<String>, String)> = Vec::new();
    want.push(("left-turns".into(), left(&turns), None, "every entry left turn".into()));
    want.push(("right-turns".into(), turns.iter().copied().filter(|&i| a.movements[i].turn == Turn::Right).collect(), None, "every entry right turn".into()));
    want.push(("all-turns".into(), turns.clone(), None, "every entry left and right turn".into()));
    match keep_access(study, &a, turns.clone(), periods) {
        Some((kept, exempt)) if !exempt.is_empty() => {
            let note = format!("all turns, less the {} onto {} that would leave a node with no way in", exempt.len(), list_and(&exempt.iter().map(|&i| a.movements[i].onto.clone()).collect::<BTreeSet<_>>().into_iter().collect::<Vec<_>>()));
            want.push(("all-turns-access".into(), kept, None, note));
        }
        _ => {}
    }
    let through: Vec<usize> = turns.iter().copied().filter(|&i| a.runs.get(a.movements[i].run).map_or(false, |r| r.through)).collect();
    want.push(("through-streets".into(), through, Some("the through side streets".into()), "every entry turn onto the interior streets that touch two bounding streets".into()));
    for b in &a.bounding {
        let v: Vec<usize> = turns.iter().copied().filter(|&i| a.movements[i].bounding.as_deref() == Some(b)).collect();
        want.push((format!("from-{}", slug(b)), v.clone(), None, format!("every entry turn from {b}")));
        want.push((format!("from-{}-left", slug(b)), left(&v), None, format!("every entry left turn from {b}")));
    }
    for (r, run) in a.runs.iter().enumerate() {
        let v: Vec<usize> = turns.iter().copied().filter(|&i| a.movements[i].run == r).collect();
        let name = slug(&run.street);
        want.push((format!("onto-{name}-{r}"), v.clone(), None, format!("every entry turn onto {}", run.street)));
        want.push((format!("onto-{name}-{r}-left"), left(&v), None, format!("every entry left turn onto {}", run.street)));
    }
    let mut seen: BTreeMap<Vec<(u32, u32)>, String> = BTreeMap::new();
    for (id, idxs, onto, note) in want {
        let moves: Vec<(u32, u32)> = idxs.iter().map(|&i| (a.movements[i].from, a.movements[i].to)).collect::<BTreeSet<_>>().into_iter().collect();
        if moves.len() < 2 {
            continue;
        }
        let lab = label(&study.net, &moves, onto.as_deref());
        if let Some(reason) = over_cap_reason(moves.len(), cap) {
            out.dropped.push(DroppedSet { id, label: lab, bans: moves.len(), reason });
            continue;
        }
        if let Some(first) = seen.get(&moves) {
            out.dropped.push(DroppedSet { id, label: lab, bans: moves.len(), reason: format!("same bans as {first}") });
            continue;
        }
        if let Err(reason) = check_access_for(study, &[set_iv(&moves)], periods.iter().copied()) {
            out.dropped.push(DroppedSet { id, label: lab, bans: moves.len(), reason: format!("access check: {reason}") });
            continue;
        }
        seen.insert(moves.clone(), id.clone());
        out.sets.push(Set { id, label: lab, moves, note });
    }
    out
}

impl Generated {
    /// With a cap: the top-k sets for k from 2 to the cap, each the `k` highest-ranked movements of `ranked` (the search's single turn-ban candidates,
    /// which the candidate list orders by the baseline cut-through trips that use them, as the `explore --check-singles` log does). A set the access
    /// check refuses is dropped with the reason; one equal to a set already here is not added again. Not run without a cap.
    pub fn add_top_sets(&mut self, study: &Study, ranked: &[(u32, u32)], periods: &[&str], cap: usize) {
        for k in 2..=cap.min(ranked.len()) {
            let moves: Vec<(u32, u32)> = ranked[..k].iter().copied().collect::<BTreeSet<_>>().into_iter().collect();
            if moves.len() < 2 {
                continue;
            }
            let id = format!("top-{k}");
            let lab = label(&study.net, &moves, None);
            if let Some(first) = self.sets.iter().find(|s| s.moves == moves) {
                self.dropped.push(DroppedSet { id, label: lab, bans: moves.len(), reason: format!("same bans as {}", first.id) });
                continue;
            }
            if let Err(reason) = check_access_for(study, &[set_iv(&moves)], periods.iter().copied()) {
                self.dropped.push(DroppedSet { id, label: lab, bans: moves.len(), reason: format!("access check: {reason}") });
                continue;
            }
            self.sets.push(Set { id, label: lab, moves, note: format!("the {k} turn-ban candidates with the most baseline cut-through") });
        }
    }
}

impl Set {
    pub fn cand(&self, study: &Study, hot: Option<&Hotspots>) -> Cand {
        let net = &study.net;
        let mut nodes: Vec<u32> = self.moves.iter().map(|&(a, _)| net.links[a as usize].to).collect();
        nodes.sort_unstable();
        nodes.dedup();
        let mut places: Vec<String> = self.moves.iter().map(|&(_, b)| street(&net.links[b as usize])).collect();
        places.sort();
        places.dedup();
        let score = hot.map_or(0.0, |h| self.moves.iter().map(|m| h.mv_ct.get(m).copied().unwrap_or(0.0)).sum());
        Cand { iv: set_iv(&self.moves), kind: KIND, label: self.label.clone(), key: format!("bs:{}", self.id), block: None, nodes, places, loc_score: score }
    }
}

/// The ban-set candidates for a search over `periods` (empty when the study has no entry movements).
pub fn candidates(study: &Study, hot: &Hotspots, periods: &[&str]) -> Vec<Cand> {
    generate(study, periods).sets.iter().map(|s| s.cand(study, Some(hot))).collect()
}

/// A decoded link's interventions with every group of its turn bans that makes up a whole ban set folded into that set, largest set first. Turn bans
/// that are not part of a whole set stay single. A link that holds the bans of a set but was not made from it reads as the set: the scenario is the same.
pub fn collapse(sets: &[Set], ivs: Vec<Intervention>) -> Vec<Intervention> {
    let mut bans: BTreeSet<(u32, u32)> = ivs.iter().filter(|iv| iv.ty == "turn_ban").filter_map(|iv| iv.from_link.zip(iv.to_link)).collect();
    if bans.len() < 2 {
        return ivs;
    }
    let mut order: Vec<&Set> = sets.iter().collect();
    order.sort_by(|x, y| y.moves.len().cmp(&x.moves.len()).then(x.id.cmp(&y.id)));
    let mut folded: Vec<Intervention> = Vec::new();
    for s in order {
        if s.moves.iter().all(|m| bans.contains(m)) {
            for m in &s.moves {
                bans.remove(m);
            }
            folded.push(set_iv(&s.moves));
        }
    }
    if folded.is_empty() {
        return ivs;
    }
    let mut out: Vec<Intervention> = ivs.into_iter().filter(|iv| iv.ty != "turn_ban" || iv.from_link.zip(iv.to_link).map_or(true, |m| bans.contains(&m))).collect();
    out.extend(folded);
    out
}
