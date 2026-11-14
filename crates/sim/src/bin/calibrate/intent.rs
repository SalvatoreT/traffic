//! Intent map of the calibrate report (calibration round 21): through cars on the counted blocks and on the study area's residential streets, by the
//! approach group they came from and the group they were going to, with the arterial each trip would otherwise use, next to what the counts imply.
//! Groups are data (`data/demand/<area>.groups.json`, written by tools/build-demand.ts from the area config); nothing here names a street of one area.

use serde_json::{json, Value};
use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap};
use std::fmt::Write as _;
use traffic_sim::model::{Network, RoadClass};

pub const STUDY: &str = "study-area";

pub struct Groups {
    labels: HashMap<String, String>,
    node: HashMap<u32, String>,
    sets: HashMap<String, Vec<String>>,
}

impl Groups {
    /// `net` adds the study-area nodes (reserved group `study-area`); without it only the labels and sets are read (the multi-seed summary needs no more).
    pub fn from_json(v: &Value, net: Option<&Network>) -> Groups {
        let mut labels = HashMap::new();
        let mut node = HashMap::new();
        labels.insert(STUDY.to_string(), v["studyLabel"].as_str().unwrap_or("The study area (a trip end inside it)").to_string());
        for g in v["groups"].as_array().map(|a| a.as_slice()).unwrap_or(&[]) {
            let id = g["id"].as_str().unwrap_or("").to_string();
            labels.insert(id.clone(), g["label"].as_str().unwrap_or(&id).to_string());
            for n in g["nodes"].as_array().map(|a| a.as_slice()).unwrap_or(&[]) {
                if let Some(n) = n.as_u64() {
                    node.insert(n as u32, id.clone());
                }
            }
        }
        if let Some(net) = net {
            for n in &net.nodes {
                if n.in_study_area {
                    node.insert(n.id, STUDY.to_string());
                }
            }
        }
        let mut sets = HashMap::new();
        if let Some(o) = v["sets"].as_object() {
            for (k, m) in o {
                sets.insert(k.clone(), m.as_array().map(|a| a.iter().filter_map(|x| x.as_str().map(String::from)).collect()).unwrap_or_default());
            }
        }
        Groups { labels, node, sets }
    }

    pub fn of(&self, node: u32) -> &str {
        self.node.get(&node).map_or("unplaced", |s| s.as_str())
    }

    pub fn label(&self, id: &str) -> String {
        self.labels.get(id).cloned().unwrap_or_else(|| id.to_string())
    }

    /// Group ids a list of group or set ids stands for.
    pub fn expand(&self, refs: &Value) -> Vec<String> {
        let mut out: Vec<String> = Vec::new();
        let list: Vec<&str> = match refs {
            Value::String(s) => vec![s.as_str()],
            Value::Array(a) => a.iter().filter_map(|x| x.as_str()).collect(),
            _ => vec![],
        };
        for r in list {
            match self.sets.get(r) {
                Some(m) => out.extend(m.iter().cloned()),
                None => out.push(r.to_string()),
            }
        }
        out
    }
}

pub struct Arterial {
    pub label: String,
    pub name: Option<String>,
    pub motorway: bool,
}

/// Arterials named by the area's boundary streets: a street name, or a motorway-class boundary (`ref` shown as "SR-24" for "CA 24").
pub fn arterials_from_boundary(area: &Value) -> Vec<Arterial> {
    let mut out = Vec::new();
    for b in area["boundary"].as_array().map(|a| a.as_slice()).unwrap_or(&[]) {
        match b {
            Value::String(s) => out.push(Arterial { label: s.clone(), name: Some(s.clone()), motorway: false }),
            Value::Object(o) => {
                let motorway = o.get("class").and_then(|c| c.as_str()) == Some("motorway");
                let r = o.get("ref").and_then(|c| c.as_str()).unwrap_or("");
                let label = if let Some(n) = r.strip_prefix("CA ") { format!("SR-{}", n.trim()) } else if !r.is_empty() { r.to_string() } else { o.get("name").and_then(|c| c.as_str()).unwrap_or("freeway").to_string() };
                out.push(Arterial { label, name: o.get("name").and_then(|c| c.as_str()).map(String::from), motorway });
            }
            _ => {}
        }
    }
    out
}

/// Free-flow shortest paths with the study area's local streets closed: the arterial a through trip would use if it kept off them.
pub struct Alt {
    from: Vec<usize>,
    to: Vec<usize>,
    len: Vec<f64>,
    cost_ms: Vec<u64>,
    banned: Vec<bool>,
    near: Vec<bool>,
    art: Vec<Option<usize>>,
    labels: Vec<String>,
    out: Vec<Vec<usize>>,
    cache: HashMap<(u32, u32), String>,
}

/// An arterial counts toward a trip's label when the path runs at least this far on it near the study area.
const MIN_RUN_M: f64 = 100.0;

impl Alt {
    pub fn new(net: &Network, arterials: &[Arterial], near_m: f64) -> Alt {
        let nn = net.nodes.len();
        let study: Vec<(f64, f64)> = net.nodes.iter().filter(|n| n.in_study_area).map(|n| (n.x, n.y)).collect();
        let mut out = vec![Vec::new(); nn];
        let (mut from, mut to, mut len, mut cost_ms, mut banned, mut near, mut art) = (vec![], vec![], vec![], vec![], vec![], vec![], vec![]);
        for (l, k) in net.links.iter().enumerate() {
            out[k.from as usize].push(l);
            from.push(k.from as usize);
            to.push(k.to as usize);
            len.push(k.length);
            cost_ms.push((k.length / k.speed_limit.max(1.0) * 1000.0) as u64);
            banned.push(k.in_study_area && matches!(k.class, RoadClass::Residential | RoadClass::Service));
            let (a, b) = (&net.nodes[k.from as usize], &net.nodes[k.to as usize]);
            let (mx, my) = ((a.x + b.x) / 2.0, (a.y + b.y) / 2.0);
            near.push(study.iter().any(|&(x, y)| ((x - mx).powi(2) + (y - my).powi(2)).sqrt() <= near_m));
            art.push(arterials.iter().position(|r| (r.motorway && k.class == RoadClass::Motorway) || r.name.as_ref().map_or(false, |n| !k.name.is_empty() && n.eq_ignore_ascii_case(&k.name))));
        }
        Alt { from, to, len, cost_ms, banned, near, art, labels: arterials.iter().map(|a| a.label.clone()).collect(), out, cache: HashMap::new() }
    }

    /// Arterials the path runs on near the study area, in order ("Telegraph Avenue then Claremont Avenue"), or why there is none.
    pub fn label(&mut self, o: u32, d: u32) -> String {
        if let Some(s) = self.cache.get(&(o, d)) {
            return s.clone();
        }
        let s = self.compute(o as usize, d as usize);
        self.cache.insert((o, d), s.clone());
        s
    }

    fn compute(&self, o: usize, d: usize) -> String {
        let n = self.out.len();
        let mut dist = vec![u64::MAX; n];
        let mut pred = vec![usize::MAX; n];
        let mut heap = BinaryHeap::new();
        dist[o] = 0;
        heap.push((Reverse(0u64), o));
        while let Some((Reverse(dd), u)) = heap.pop() {
            if dd > dist[u] {
                continue;
            }
            if u == d {
                break;
            }
            for &l in &self.out[u] {
                if self.banned[l] {
                    continue;
                }
                let v = self.to[l];
                let nd = dd + self.cost_ms[l];
                if nd < dist[v] {
                    dist[v] = nd;
                    pred[v] = l;
                    heap.push((Reverse(nd), v));
                }
            }
        }
        if dist[d] == u64::MAX {
            return "no route without the local streets".to_string();
        }
        let mut path = Vec::new();
        let mut v = d;
        while v != o {
            let l = pred[v];
            path.push(l);
            v = self.from[l];
        }
        path.reverse();
        let mut order: Vec<usize> = Vec::new();
        let mut run: HashMap<usize, f64> = HashMap::new();
        for &l in &path {
            if let (Some(a), true) = (self.art[l], self.near[l]) {
                if !order.contains(&a) {
                    order.push(a);
                }
                *run.entry(a).or_insert(0.0) += self.len[l];
            }
        }
        let names: Vec<&str> = order.iter().filter(|a| run[a] >= MIN_RUN_M).map(|&a| self.labels[a].as_str()).collect();
        if names.is_empty() {
            "none near the study area".to_string()
        } else {
            names.join(" then ")
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct Row {
    pub block: String,
    pub from: String,
    pub to: String,
    pub vph: f64,
    pub arterial: String,
}

/// Rows for one block: through trips counted by (origin group, destination group), each with its most common arterial label; veh/h = trips x `per_h`.
pub fn tally(block: &str, trips: &[(u32, u32)], per_h: f64, groups: &Groups, alt: &mut Alt) -> Vec<Row> {
    let mut by: HashMap<(String, String), (f64, HashMap<String, f64>)> = HashMap::new();
    for &(o, d) in trips {
        let key = (groups.of(o).to_string(), groups.of(d).to_string());
        let lab = alt.label(o, d);
        let e = by.entry(key).or_insert((0.0, HashMap::new()));
        e.0 += per_h;
        *e.1.entry(lab).or_insert(0.0) += per_h;
    }
    let mut rows: Vec<Row> = by.into_iter().map(|((f, t), (v, l))| Row { block: block.to_string(), from: f, to: t, vph: v, arterial: top_label(&l) }).collect();
    rows.sort_by(|a, b| b.vph.partial_cmp(&a.vph).unwrap().then(a.from.cmp(&b.from)).then(a.to.cmp(&b.to)));
    rows
}

fn top_label(m: &HashMap<String, f64>) -> String {
    m.iter().max_by(|a, b| a.1.partial_cmp(b.1).unwrap().then(b.0.cmp(a.0))).map(|x| x.0.clone()).unwrap_or_default()
}

pub fn rows_json(rows: &[Row]) -> Value {
    Value::Array(rows.iter().map(|r| json!({"block": r.block, "from": r.from, "to": r.to, "vph": (r.vph * 1000.0).round() / 1000.0, "arterial": r.arterial})).collect())
}

pub fn rows_from_json(v: &Value) -> Vec<Row> {
    v.as_array().map(|a| a.iter().map(|r| Row { block: r["block"].as_str().unwrap_or("").to_string(), from: r["from"].as_str().unwrap_or("").to_string(), to: r["to"].as_str().unwrap_or("").to_string(), vph: r["vph"].as_f64().unwrap_or(0.0), arterial: r["arterial"].as_str().unwrap_or("").to_string() }).collect()).unwrap_or_default()
}

/// Mean over seeds: a pair missing in a seed counts as 0 there. The arterial label is the one with most veh/h over the seeds.
pub fn mean_rows(runs: &[Vec<Row>]) -> Vec<Row> {
    let n = runs.len().max(1) as f64;
    let mut by: HashMap<(String, String, String), (f64, HashMap<String, f64>)> = HashMap::new();
    for rows in runs {
        for r in rows {
            let e = by.entry((r.block.clone(), r.from.clone(), r.to.clone())).or_insert((0.0, HashMap::new()));
            e.0 += r.vph;
            *e.1.entry(r.arterial.clone()).or_insert(0.0) += r.vph;
        }
    }
    let mut out: Vec<Row> = by.into_iter().map(|((b, f, t), (v, l))| Row { block: b, from: f, to: t, vph: v / n, arterial: top_label(&l) }).collect();
    out.sort_by(|a, b| a.block.cmp(&b.block).then(b.vph.partial_cmp(&a.vph).unwrap()).then(a.from.cmp(&b.from)).then(a.to.cmp(&b.to)));
    out
}

/// Model veh/h of an intent: rows of the block whose origin and destination groups lie in the intent's lists.
pub fn intent_model(rows: &[Row], block: &str, from: &[String], to: &[String]) -> f64 {
    rows.iter().filter(|r| r.block == block && from.contains(&r.from) && to.contains(&r.to)).map(|r| r.vph).sum()
}

fn range_text(lo: f64, hi: f64, mid: Option<f64>) -> String {
    match mid {
        Some(m) if (hi - lo).abs() > 0.5 => format!("{m:.0} ({lo:.0} to {hi:.0})"),
        Some(m) => format!("{m:.0}"),
        None => format!("{lo:.0} to {hi:.0}"),
    }
}

/// Markdown section: per block the intents the counts imply against the model, then the model's pairs and the arterials the trips avoid.
pub fn report(rows: &[Row], groups: &Groups, targets: &Value, seeds: usize, pm: bool) -> String {
    let mut md = String::new();
    let map = &targets["intentMap"];
    let _ = writeln!(md, "\n## Intent map: through cars by where they come from and where they are going\n");
    let _ = writeln!(md, "{}\n", map["note"].as_str().unwrap_or("Through = neither trip end is in the study area. Groups are the approach groups of the area config; a node that is not a gate takes the group of the nearest gate (ASSUMPTION). The arterial is the one a trip would use on the shortest free-flow path with the study area's residential and service streets closed, where it runs on a boundary street near the study area."));
    let _ = writeln!(md, "Model figures are the mean of {seeds} seed(s), per hour of the run. Basis: OBSERVED = read from the resident volunteer count of Feb 25, 2025 or its headline shares; ASSUMPTION = inferred from those numbers or chosen.\n");
    let mut blocks: Vec<String> = map["blocks"].as_array().map(|a| a.iter().filter_map(|b| b["block"].as_str().map(String::from)).collect()).unwrap_or_default();
    for r in rows {
        if !blocks.contains(&r.block) {
            blocks.push(r.block.clone());
        }
    }
    for block in &blocks {
        let mine: Vec<&Row> = rows.iter().filter(|r| &r.block == block).collect();
        let total: f64 = mine.iter().map(|r| r.vph).sum();
        let _ = writeln!(md, "### {block}\n");
        let spec = map["blocks"].as_array().and_then(|a| a.iter().find(|b| b["block"].as_str() == Some(block)));
        let sel = targets["selectLink"].as_array().and_then(|a| a.iter().find(|t| format!("{} {}", t["street"].as_str().unwrap_or(""), t["direction"].as_str().unwrap_or("")) == *block));
        if let Some(t) = sel {
            let key = if pm { "pm_peak" } else { "am_peak" };
            let g = |k: &str| t[k][key].as_f64();
            if let (Some(vol), Some(whole)) = (g("observedVehPerHour"), g("wholeStreetVehPerHour")) {
                let hi = (vol - g("endAlongVehPerHour").unwrap_or(0.0)).max(whole);
                let _ = writeln!(md, "Observed: block volume {vol:.0} veh/h, whole-street cars {whole:.0}, so through cars {whole:.0} to {hi:.0} veh/h. Model: {total:.0} through cars per hour.\n");
            }
        }
        if let Some(spec) = spec {
            if let Some(n) = spec["note"].as_str() {
                let _ = writeln!(md, "{n}\n");
            }
            if let Some(list) = spec["intents"].as_array() {
                let _ = writeln!(md, "| Intent | Basis | Implied veh/h | Model veh/h | Position |\n| --- | --- | --- | --- | --- |");
                let mut listed = 0.0;
                let (mut lo_sum, mut hi_sum, mut mid_sum) = (0.0, 0.0, 0.0);
                for it in list {
                    let (from, to) = (groups.expand(&it["from"]), groups.expand(&it["to"]));
                    let m = intent_model(rows, block, &from, &to);
                    listed += m;
                    let (lo, hi) = (it["low"].as_f64().unwrap_or(0.0), it["high"].as_f64().unwrap_or(0.0));
                    let mid = it["implied"].as_f64();
                    lo_sum += lo;
                    hi_sum += hi;
                    mid_sum += mid.unwrap_or((lo + hi) / 2.0);
                    let pos = if m < lo - 0.5 { "below" } else if m > hi + 0.5 { "above" } else { "within" };
                    let _ = writeln!(md, "| {} | {} | {} | {m:.0} | {pos} |", it["label"].as_str().unwrap_or(""), it["basis"].as_str().unwrap_or(""), range_text(lo, hi, mid));
                }
                let _ = writeln!(md, "| Intents listed, together | | {} | {listed:.0} | |", range_text(lo_sum, hi_sum, Some(mid_sum)));
                let _ = writeln!(md, "| Other through cars (no intent listed) | | | {:.0} | |", (total - listed).max(0.0));
                md.push('\n');
            }
        }
        if mine.is_empty() {
            let _ = writeln!(md, "No through cars recorded.\n");
            continue;
        }
        let _ = writeln!(md, "Model through cars by origin and destination group (largest 12 of {} pairs):\n", mine.len());
        let _ = writeln!(md, "| From | To | Model veh/h | Arterial otherwise used (free flow, local streets closed) |\n| --- | --- | --- | --- |");
        for r in mine.iter().take(12) {
            let _ = writeln!(md, "| {} | {} | {:.1} | {} |", groups.label(&r.from), groups.label(&r.to), r.vph, r.arterial);
        }
        let rest: f64 = mine.iter().skip(12).map(|r| r.vph).sum();
        if rest > 0.05 {
            let _ = writeln!(md, "| other pairs | | {rest:.1} | |");
        }
        let mut by_art: HashMap<&str, f64> = HashMap::new();
        for r in &mine {
            *by_art.entry(r.arterial.as_str()).or_insert(0.0) += r.vph;
        }
        let mut arts: Vec<(&str, f64)> = by_art.into_iter().collect();
        arts.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap().then(a.0.cmp(b.0)));
        let _ = writeln!(md, "\nBy the arterial these cars would otherwise use: {}.\n", arts.iter().take(6).map(|(a, v)| format!("{a} {v:.0} veh/h")).collect::<Vec<_>>().join("; "));
        if mine.len() > 12 && block.starts_with("Study area") {
            for (title, pick) in [("origin", 0usize), ("destination", 1usize)] {
                let mut by: HashMap<&str, f64> = HashMap::new();
                for r in &mine {
                    *by.entry(if pick == 0 { r.from.as_str() } else { r.to.as_str() }).or_insert(0.0) += r.vph;
                }
                let mut v: Vec<(&str, f64)> = by.into_iter().collect();
                v.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap().then(a.0.cmp(b.0)));
                let _ = writeln!(md, "By {title} group: {}.\n", v.iter().take(10).map(|(g, x)| format!("{} {x:.0}", groups.label(g))).collect::<Vec<_>>().join("; "));
            }
        }
    }
    md
}

#[cfg(test)]
mod tests {
    use super::*;

    fn rows() -> Vec<Row> {
        let r = |f: &str, t: &str, v: f64, a: &str| Row { block: "B".into(), from: f.into(), to: t.into(), vph: v, arterial: a.into() };
        vec![r("n", "fw", 30.0, "Telegraph Avenue"), r("n", "w", 10.0, "Telegraph Avenue"), r("s", "fw", 5.0, "College Avenue")]
    }

    #[test]
    fn intent_volume_sums_matching_pairs() {
        let v = intent_model(&rows(), "B", &["n".to_string()], &["fw".to_string()]);
        assert!((v - 30.0).abs() < 1e-9);
        assert!((intent_model(&rows(), "B", &["n".to_string(), "s".to_string()], &["fw".to_string()]) - 35.0).abs() < 1e-9);
        assert_eq!(intent_model(&rows(), "other", &["n".to_string()], &["fw".to_string()]), 0.0);
    }

    #[test]
    fn sets_expand_and_missing_pairs_count_as_zero_in_the_mean() {
        let g = Groups::from_json(&json!({"groups": [{"id": "a", "label": "A", "nodes": [1]}], "sets": {"s": ["a", "b"]}}), None);
        assert_eq!(g.expand(&json!(["s", "c"])), vec!["a".to_string(), "b".to_string(), "c".to_string()]);
        assert_eq!(g.of(1), "a");
        assert_eq!(g.of(9), "unplaced");
        let m = mean_rows(&[rows(), rows()[..1].to_vec()]);
        let s = m.iter().find(|r| r.from == "s").unwrap();
        assert!((s.vph - 2.5).abs() < 1e-9);
        let n = m.iter().find(|r| r.from == "n" && r.to == "fw").unwrap();
        assert!((n.vph - 30.0).abs() < 1e-9);
    }

    #[test]
    fn rows_round_trip_through_json() {
        let r = rows();
        assert_eq!(rows_from_json(&rows_json(&r)), r);
    }

    #[test]
    fn boundary_names_become_arterials() {
        let a = arterials_from_boundary(&json!({"boundary": ["Telegraph Avenue", {"ref": "CA 24", "class": "motorway"}]}));
        assert_eq!(a[0].label, "Telegraph Avenue");
        assert_eq!(a[1].label, "SR-24");
        assert!(a[1].motorway);
    }
}
