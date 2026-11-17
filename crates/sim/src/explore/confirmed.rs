//! The displacement rule on the figures that are published (design `displacement-after-confirmation`): applied to a finished proposals
//! file, with the same function the search runs after confirmation (`report::displace_listed`), and the matching edits to the report.

use super::paired::{option_gain, CtPairs};
use super::report::{basis_label, comparison_json, comparison_line, displace_listed, displacement_intro, dropped_json, dropped_line, Figures, BASIS_CONFIRMATION, BASIS_SEARCH};
use serde_json::Value;

/// What the rule changed in one group of a proposals file.
#[derive(Clone, Debug, Default)]
pub struct GroupChange {
    pub id: String,
    /// Old option ids (`p3`) dropped, in drop order, with the new id of every option that stays (`p4` to `p3`), in file order.
    pub dropped: Vec<String>,
    pub renamed: Vec<(String, String)>,
    /// Dropped records without a `basis` that were labeled as search-seed figures.
    pub labeled: usize,
    /// Old option number (from 1) to its new number; `None` for a dropped option.
    pub numbers: Vec<Option<usize>>,
    /// The finalist-table note of each dropped option, by old number.
    pub notes: Vec<(usize, String)>,
    pub comparison_lines: Vec<String>,
    pub records: Vec<Value>,
}

impl GroupChange {
    pub fn changed(&self) -> bool {
        !self.dropped.is_empty() || self.labeled > 0
    }
}

struct Owned {
    reduction_pct: f64,
    rise: f64,
    rise_half: Option<f64>,
    pairs: CtPairs,
}

fn nums(v: &Value) -> Result<Vec<f64>, String> {
    v.as_array().ok_or("not an array")?.iter().map(|x| x.as_f64().ok_or_else(|| "not a number".to_string())).collect()
}

/// The figures of one published option, read back from its stored values: the largest all-car rise on one block over the periods (the
/// one `report::largest_rise` takes), and the per-seed through cars behind the paired comparison.
fn owned(prop: &Value, periods: &[String]) -> Result<Owned, String> {
    let at = |m: &str| format!("{}: {m}", prop["id"].as_str().unwrap_or("?"));
    let reduction_pct = -prop["cutThrough"]["changePct"].as_f64().ok_or_else(|| at("no cutThrough.changePct"))?;
    let mut best: Option<(f64, Option<f64>)> = None;
    for per in periods {
        let l = &prop["byPeriod"][per]["allTraffic"]["largestIncrease"];
        let rise = l["increaseVehPerHour"].as_f64().ok_or_else(|| at(&format!("no all-car rise in {per}")))?;
        let half = l["effect"]["interval"].as_array().and_then(|a| Some((a.get(1)?.as_f64()? - a.first()?.as_f64()?) / 2.0));
        if best.map_or(true, |b| rise >= b.0) {
            best = Some((rise, half));
        }
    }
    let (rise, rise_half) = best.ok_or_else(|| at("no periods"))?;
    let ev = &prop["evidence"];
    let seeds: Vec<u64> = ev["seeds"].as_array().ok_or_else(|| at("no evidence.seeds"))?.iter().filter_map(|x| x.as_u64()).collect();
    let series = |k: &str| -> Result<Vec<Vec<f64>>, String> { periods.iter().map(|per| nums(&ev[k][per]).map_err(|e| at(&format!("evidence.{k}.{per}: {e}")))).collect() };
    let pairs = CtPairs::new(&seeds, series("baselineVehPerHour")?, series("scenarioVehPerHour")?).map_err(|e| at(&e))?;
    Ok(Owned { reduction_pct, rise, rise_half, pairs })
}

fn seeds_of(v: &Value) -> Vec<u64> {
    v.as_array().map(|a| a.iter().filter_map(|x| x.as_u64()).collect()).unwrap_or_default()
}

/// Apply the rule to every group of a proposals file whose figures are confirmation figures: drop the options it displaces, renumber the
/// ones that stay (`p1`..`pN`, the way a search numbers them), recompute the comparisons between neighbors, and record each drop with its
/// confirmation figures. Records written before the label existed are labeled as search-seed figures. The file is otherwise untouched.
pub fn reapply(file: &mut Value) -> Result<Vec<GroupChange>, String> {
    let groups = file["groups"].as_array_mut().ok_or("the file has no groups")?;
    let mut out = Vec::new();
    for g in groups.iter_mut() {
        let id = g["id"].as_str().unwrap_or("").to_string();
        let periods: Vec<String> = g["computed"]["periods"].as_array().map(|a| a.iter().filter_map(|x| x.as_str().map(String::from)).collect()).unwrap_or_default();
        let sel = g["computed"]["estimation"]["selection"].clone();
        let (discovery, confirmation) = (seeds_of(&sel["discoverySeeds"]), seeds_of(&sel["confirmationSeeds"]));
        let mut ch = GroupChange { id: id.clone(), ..GroupChange::default() };
        if let Some(recs) = g["computed"]["displacement"]["dropped"].as_array_mut() {
            for r in recs.iter_mut().filter(|r| r.get("basis").is_none()) {
                let label = basis_label(BASIS_SEARCH, &discovery);
                r["reason"] = format!("{}, figures from the {label}", r["reason"].as_str().unwrap_or("")).into();
                r["basis"] = BASIS_SEARCH.into();
                r["seeds"] = discovery.iter().copied().collect::<Vec<u64>>().into();
                ch.labeled += 1;
            }
        }
        let props = g["proposals"].as_array().ok_or_else(|| format!("group {id}: no proposals"))?.clone();
        let search: Vec<usize> = (0..props.len()).filter(|&j| props[j]["kind"] == "search").collect();
        ch.numbers = (1..=search.len()).map(Some).collect();
        let confirmed = sel["estimates"] == "confirmation" && !confirmation.is_empty();
        let mut dropped: Vec<super::report::Displaced> = Vec::new();
        if confirmed {
            let figs: Vec<Owned> = search.iter().map(|&j| owned(&props[j], &periods)).collect::<Result<_, _>>().map_err(|e| format!("group {id}: {e}"))?;
            let view: Vec<Figures> = figs.iter().map(|o| Figures { reduction_pct: o.reduction_pct, rise: o.rise, rise_half: o.rise_half, pairs: &o.pairs }).collect();
            let protected: Vec<bool> = search.iter().map(|&j| props[j]["objectives"].as_array().map_or(false, |a| !a.is_empty())).collect();
            dropped = displace_listed(&view, &protected, BASIS_CONFIRMATION, &confirmation);
        }
        if !dropped.is_empty() {
            let link = |k: usize| props[search[k]]["link"].as_str().unwrap_or("").to_string();
            let title = |k: usize| props[search[k]]["title"].as_str().unwrap_or("").to_string();
            let gone = |k: usize| dropped.iter().any(|d| d.from == k);
            let mut kept: Vec<usize> = Vec::new();
            for k in 0..search.len() {
                let oid = props[search[k]]["id"].as_str().unwrap_or("").to_string();
                if gone(k) {
                    ch.numbers[k] = None;
                } else {
                    kept.push(k);
                    ch.numbers[k] = Some(kept.len());
                    let nid = format!("p{}", kept.len());
                    if nid != oid {
                        ch.renamed.push((oid, nid));
                    }
                }
            }
            let mut proposals: Vec<Value> = Vec::new();
            let mut next = 0;
            for (j, p) in props.iter().enumerate() {
                match search.iter().position(|&s| s == j) {
                    Some(k) if gone(k) => {}
                    Some(_) => {
                        let mut p = p.clone();
                        next += 1;
                        p["id"] = format!("p{next}").into();
                        proposals.push(p);
                    }
                    None => proposals.push(p.clone()),
                }
            }
            let figs: Vec<Owned> = kept.iter().map(|&k| owned(&props[search[k]], &periods)).collect::<Result<_, _>>()?;
            let comparisons: Vec<(Value, String)> = figs
                .windows(2)
                .enumerate()
                .map(|(k, w)| {
                    let (gain, base) = (option_gain(&w[0].pairs, &w[1].pairs), w[0].pairs.base_mean());
                    (comparison_json(k, gain, base), comparison_line(k, gain, base))
                })
                .collect();
            for d in &dropped {
                ch.dropped.push(props[search[d.from]]["id"].as_str().unwrap_or("").to_string());
                ch.notes.push((d.from + 1, format!("not published after confirmation, displaced by \"{}\": {}", title(d.by), d.phrase())));
                ch.records.push(dropped_json(d, &link(d.from), &link(d.by)));
            }
            ch.comparison_lines = comparisons.iter().map(|c| c.1.clone()).collect();
            g["optionComparisons"] = comparisons.into_iter().map(|c| c.0).collect::<Vec<_>>().into();
            g["proposals"] = proposals.into();
            let lost: Vec<String> = ch.records.iter().map(|r| r["from"].as_str().unwrap_or("").to_string()).collect();
            if let Some(folded) = g["computed"]["similarity"]["folded"].as_array_mut() {
                for f in folded.iter_mut().filter(|f| lost.iter().any(|l| f["into"] == l.as_str())) {
                    f["intoPublished"] = false.into();
                }
            }
            let recs = g["computed"]["displacement"].as_object_mut().ok_or_else(|| format!("group {id}: no computed.displacement"))?;
            let list = recs.entry("dropped").or_insert_with(|| Value::Array(Vec::new()));
            list.as_array_mut().ok_or("computed.displacement.dropped is not a list")?.extend(ch.records.clone());
        }
        ch.records = g["computed"]["displacement"]["dropped"].as_array().cloned().unwrap_or_default();
        out.push(ch);
    }
    Ok(out)
}

fn marker(l: &str) -> Option<&str> {
    l.strip_prefix("<!-- profile:").and_then(|r| r.strip_suffix(" -->"))
}

fn number_prefix(l: &str, sep: &str) -> Option<(usize, usize)> {
    let digits = l.chars().take_while(|c| c.is_ascii_digit()).count();
    (digits > 0 && l[digits..].starts_with(sep)).then(|| (l[..digits].parse().unwrap_or(0), digits + sep.len()))
}

fn patch_section(lines: &[&str], c: &GroupChange) -> Vec<String> {
    #[derive(PartialEq)]
    enum Sec {
        Other,
        Finalists,
        Chosen,
        Traffic,
        Dropped,
    }
    let mut out: Vec<String> = Vec::new();
    let (mut sec, mut level, mut wrote, mut seen_dropped) = (Sec::Other, 2usize, false, false);
    let block = || -> Vec<String> {
        let mut b = vec![String::new(), displacement_intro(), String::new()];
        b.extend(c.records.iter().map(dropped_line));
        b.push(String::new());
        b
    };
    for &l in lines {
        if l.starts_with('#') {
            let hashes = l.chars().take_while(|&ch| ch == '#').count();
            let title = l[hashes..].trim();
            sec = if title.starts_with("Finalists, rechecked") {
                Sec::Finalists
            } else if title == "Chosen options" {
                level = hashes;
                Sec::Chosen
            } else if title.starts_with("All traffic on side-street blocks") {
                Sec::Traffic
            } else if title == "Dropped for displacement" {
                seen_dropped = true;
                Sec::Dropped
            } else {
                Sec::Other
            };
            out.push(l.to_string());
            if sec == Sec::Dropped {
                out.extend(block());
            }
            continue;
        }
        match sec {
            Sec::Dropped => {}
            Sec::Chosen => {
                if let Some((n, len)) = number_prefix(l, ". ") {
                    if let Some(m) = c.numbers.get(n.wrapping_sub(1)).copied().flatten() {
                        out.push(format!("{m}. {}", &l[len..]));
                    }
                } else if l.starts_with("- Option ") {
                    if !wrote {
                        out.extend(c.comparison_lines.iter().cloned());
                        wrote = true;
                    }
                } else {
                    out.push(l.to_string());
                }
            }
            Sec::Traffic => match l.strip_prefix("| ").and_then(|r| number_prefix(r, " |")) {
                Some((n, len)) => {
                    if let Some(m) = c.numbers.get(n.wrapping_sub(1)).copied().flatten() {
                        out.push(format!("| {m} |{}", &l[2 + len..]));
                    }
                }
                None => out.push(l.to_string()),
            },
            Sec::Finalists => {
                const KEY: &str = "| chosen as option ";
                match l.rfind(KEY).filter(|_| l.ends_with(" |")) {
                    Some(pos) => {
                        let rest = &l[pos + KEY.len()..];
                        let n: usize = rest.chars().take_while(|ch| ch.is_ascii_digit()).collect::<String>().parse().unwrap_or(0);
                        match c.numbers.get(n.wrapping_sub(1)).copied().flatten() {
                            Some(m) => out.push(format!("{}{KEY}{m}{}", &l[..pos], &rest[n.to_string().len()..])),
                            None => match c.notes.iter().find(|x| x.0 == n) {
                                Some(note) => out.push(format!("{}| {} |", &l[..pos], note.1)),
                                None => out.push(l.to_string()),
                            },
                        }
                    }
                    None => out.push(l.to_string()),
                }
            }
            Sec::Other => out.push(l.to_string()),
        }
    }
    if !seen_dropped && !c.records.is_empty() {
        while out.last().map_or(false, |l| l.is_empty()) {
            out.pop();
        }
        out.push(String::new());
        out.push(format!("{} Dropped for displacement", "#".repeat(level)));
        out.extend(block());
    }
    out
}

/// The report with the edits `reapply` made: the dropped options' entries gone from the chosen options and the all-traffic table, the
/// rest renumbered, the comparisons between neighbors rewritten, the finalist notes updated and the dropped records listed. A report with
/// profile markers is edited section by section; one without is the section of the only group.
pub fn patch_report(md: &str, changes: &[GroupChange]) -> String {
    let lines: Vec<&str> = md.lines().collect();
    let starts: Vec<usize> = (0..lines.len()).filter(|&i| marker(lines[i]).is_some()).collect();
    let mut out: Vec<String> = Vec::new();
    if starts.is_empty() {
        match changes.iter().filter(|c| c.changed()).collect::<Vec<_>>().as_slice() {
            [c] if changes.len() == 1 => out = patch_section(&lines, c),
            _ => return md.to_string(),
        }
    } else {
        out.extend(lines[..starts[0]].iter().map(|l| l.to_string()));
        for (n, &s) in starts.iter().enumerate() {
            let end = starts.get(n + 1).copied().unwrap_or(lines.len());
            match changes.iter().find(|c| Some(c.id.as_str()) == marker(lines[s]) && c.changed()) {
                Some(c) => out.extend(patch_section(&lines[s..end], c)),
                None => out.extend(lines[s..end].iter().map(|l| l.to_string())),
            }
        }
    }
    let mut text = out.join("\n");
    if md.ends_with('\n') {
        text.push('\n');
    }
    text
}
