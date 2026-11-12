//! Constraint profiles (data, per study area) and the merge of per-profile results into one proposals file and one report.
//! A profile removes candidate interventions before the search; everything else about the search is unchanged.

use serde::Deserialize;
use serde_json::{json, Value};
use std::path::Path;

pub const UNCONSTRAINED: &str = "unconstrained";

#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Profile {
    pub id: String,
    pub title: String,
    #[serde(default)]
    pub note: String,
    /// Intervention types (as in a scenario link, for example `speed_hump`) the search may not use.
    #[serde(default)]
    pub exclude_types: Vec<String>,
    /// No intervention on the study area's bounding streets or at their intersections.
    #[serde(default)]
    pub exclude_boundary: bool,
}

impl Profile {
    pub fn unconstrained() -> Profile {
        Profile {
            id: UNCONSTRAINED.into(),
            title: "Without limits".into(),
            note: "Every tool except new traffic lights, anywhere in the area. Shown for comparison.".into(),
            exclude_types: Vec::new(),
            exclude_boundary: false,
        }
    }

    pub fn is_constrained(&self) -> bool {
        !self.exclude_types.is_empty() || self.exclude_boundary
    }
}

pub fn load(path: &Path) -> Result<Vec<Profile>, String> {
    let text = std::fs::read_to_string(path).map_err(|e| format!("cannot read {}: {e}", path.display()))?;
    let list: Vec<Profile> = serde_json::from_str(&text).map_err(|e| format!("{}: {e}", path.display()))?;
    let mut seen: Vec<&str> = Vec::new();
    for p in &list {
        if seen.contains(&p.id.as_str()) {
            return Err(format!("{}: duplicate profile id {}", path.display(), p.id));
        }
        seen.push(&p.id);
    }
    Ok(list)
}

/// The profile to run: `id` from the list, or the list's unconstrained entry (or the built-in one) when `id` is absent.
pub fn choose(list: &[Profile], id: Option<&str>) -> Result<Profile, String> {
    let want = id.unwrap_or(UNCONSTRAINED);
    match list.iter().find(|p| p.id == want) {
        Some(p) => Ok(p.clone()),
        None if id.is_none() => Ok(Profile::unconstrained()),
        None => Err(format!("no profile {want}; the profiles file has: {}", list.iter().map(|p| p.id.as_str()).collect::<Vec<_>>().join(", "))),
    }
}

/// Group ids in display order: the profiles file's order, with the unconstrained group last unless the file places it.
pub fn order(list: &[Profile]) -> Vec<String> {
    let mut o: Vec<String> = list.iter().map(|p| p.id.clone()).collect();
    if !o.iter().any(|i| i == UNCONSTRAINED) {
        o.push(UNCONSTRAINED.into());
    }
    o
}

fn group_of_v1(old: &Value, fallback: &Profile) -> Value {
    json!({
        "id": fallback.id, "title": fallback.title, "note": fallback.note,
        "computed": old["computed"], "baseline": old["baseline"], "proposals": old["proposals"],
    })
}

/// Put `group` into the proposals file `existing`, replacing the group with the same id and keeping the others.
/// A file in the earlier single-group format (version 1) counts as the unconstrained group.
pub fn merge_file(existing: Option<&Value>, area: &str, group: Value, order: &[String], unconstrained: &Profile) -> Value {
    let mut groups: Vec<Value> = match existing {
        Some(v) if v["version"] == 2 => v["groups"].as_array().cloned().unwrap_or_default(),
        Some(v) if v["version"] == 1 && v["proposals"].is_array() => vec![group_of_v1(v, unconstrained)],
        _ => Vec::new(),
    };
    let id = group["id"].as_str().unwrap_or_default().to_string();
    match groups.iter_mut().find(|g| g["id"] == id.as_str()) {
        Some(g) => *g = group,
        None => groups.push(group),
    }
    let rank = |g: &Value| order.iter().position(|o| g["id"] == o.as_str()).unwrap_or(order.len());
    groups.sort_by_key(rank);
    json!({"version": 2, "area": area, "groups": groups})
}

fn marker(id: &str) -> String {
    format!("<!-- profile:{id} -->")
}

/// One profile's report section: the run's report without its title, headings one level down, under a heading for the profile.
pub fn report_section(markdown: &str, p: &Profile) -> String {
    let mut s = String::new();
    s.push_str(&marker(&p.id));
    s.push_str(&format!("\n## {} ({})\n\n", p.title, p.id));
    if !p.note.is_empty() {
        s.push_str(&format!("{}\n\n", p.note));
    }
    if p.is_constrained() {
        let mut bits: Vec<String> = Vec::new();
        if p.exclude_boundary {
            bits.push("no intervention on a bounding street or at an intersection with one".into());
        }
        if !p.exclude_types.is_empty() {
            bits.push(format!("no {}", p.exclude_types.join(", ")));
        }
        s.push_str(&format!("Candidate limits: {}.\n\n", bits.join("; ")));
    }
    let body = markdown.lines().skip_while(|l| l.starts_with("# ") || l.trim().is_empty());
    for l in body {
        if l.starts_with('#') {
            s.push('#');
        }
        s.push_str(l);
        s.push('\n');
    }
    s
}

/// Replace or add this profile's section in the report. A report in the earlier single-run format counts as the unconstrained section.
pub fn merge_report(existing: Option<&str>, area: &str, section: &str, id: &str, order: &[String], unconstrained: &Profile) -> String {
    let mut sections: Vec<(String, String)> = Vec::new();
    if let Some(text) = existing {
        if text.contains("<!-- profile:") {
            let mut cur: Option<(String, String)> = None;
            for l in text.lines() {
                if let Some(rest) = l.strip_prefix("<!-- profile:").and_then(|r| r.strip_suffix(" -->")) {
                    if let Some(c) = cur.take() {
                        sections.push(c);
                    }
                    cur = Some((rest.to_string(), String::new()));
                }
                if let Some((_, body)) = cur.as_mut() {
                    body.push_str(l);
                    body.push('\n');
                }
            }
            sections.extend(cur);
        } else if text.starts_with("# ") {
            sections.push((UNCONSTRAINED.into(), report_section(text, unconstrained)));
        }
    }
    match sections.iter_mut().find(|s| s.0 == id) {
        Some(s) => s.1 = section.to_string(),
        None => sections.push((id.to_string(), section.to_string())),
    }
    let rank = |s: &(String, String)| order.iter().position(|o| *o == s.0).unwrap_or(order.len());
    sections.sort_by_key(rank);
    let mut out = format!("# Proposals report: {area}\n\n");
    for (_, body) in sections {
        out.push_str(body.trim_end());
        out.push_str("\n\n");
    }
    out.trim_end().to_string() + "\n"
}
