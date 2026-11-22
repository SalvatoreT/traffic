//! Known packages ("seeds"): scenario links of packages worth rechecking on every search, kept per study area in
//! `data/proposals/<area>.seeds.json`. Every search adds the options it publishes; people can add packages by hand with a note.
//! A search decodes the links on the current network, rechecks the ones its profile allows in full beside its own finalists, and
//! starts part of its beam from them (design D7 of `search-keeps-known-packages`).

use super::decode::decode_scenario;
use super::Study;
use crate::model::Intervention;
use serde::{Deserialize, Serialize};
use std::path::Path;

/// Most entries a seeds file keeps. Each seed costs a full recheck in every search, so the cap bounds the run time.
pub const DEFAULT_CAP: usize = 20;

/// Where a package came from: a search that published it, or a person who added it.
pub const SOURCE_SEARCH: &str = "search";
pub const SOURCE_HAND: &str = "hand";

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Entry {
    pub link: String,
    /// `search` or `hand`.
    pub source: String,
    #[serde(default)]
    pub note: String,
    /// Date the package was first recorded.
    pub added: String,
    /// Date of the last search that published it (empty for a hand-added package no search has published).
    #[serde(default)]
    pub last_published: String,
    /// Group (profile id) of the search that published it last.
    #[serde(default)]
    pub group: String,
    #[serde(default)]
    pub size: usize,
    /// Through-car change in percent at the last publication (negative is a reduction).
    #[serde(default)]
    pub change_pct: Option<f64>,
    /// Search score at the last publication.
    #[serde(default)]
    pub score: Option<f64>,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SeedFile {
    pub version: u32,
    pub area: String,
    #[serde(default = "default_cap")]
    pub cap: usize,
    pub seeds: Vec<Entry>,
}

fn default_cap() -> usize {
    DEFAULT_CAP
}

impl SeedFile {
    pub fn empty(area: &str) -> SeedFile {
        SeedFile { version: 1, area: area.into(), cap: DEFAULT_CAP, seeds: Vec::new() }
    }
}

/// The items of a link's `s=` part, sorted: two links with the same key are the same package. The period and the order of the items do not matter.
pub fn key(link: &str) -> String {
    let h = link.trim().trim_start_matches('#');
    let mut items: Vec<&str> = h.split(';').find_map(|t| t.strip_prefix("s=")).map(|s| s.split('~').collect()).unwrap_or_default();
    items.sort_unstable();
    items.join("~")
}

/// The file at `path`, or an empty one when there is none.
pub fn load(path: &Path, area: &str) -> Result<SeedFile, String> {
    if !path.exists() {
        return Ok(SeedFile::empty(area));
    }
    let text = std::fs::read_to_string(path).map_err(|e| format!("cannot read {}: {e}", path.display()))?;
    let f: SeedFile = serde_json::from_str(&text).map_err(|e| format!("{}: {e}", path.display()))?;
    if f.area != area {
        return Err(format!("{} is for area {}, not {area}", path.display(), f.area));
    }
    Ok(f)
}

pub fn to_json(f: &SeedFile) -> String {
    let mut s = serde_json::to_string_pretty(f).expect("serialize seeds");
    s.push('\n');
    s
}

/// Add the options a search published. A package already in the file keeps its first date, source and note and takes the new figures;
/// a new one is appended. Then the file is cut to its cap by dropping, among the search-published entries this run did not publish, the
/// oldest first and the weakest first among equals. Hand-added entries and the ones published now are never dropped.
pub fn record(file: &mut SeedFile, published: Vec<Entry>, today: &str) {
    for e in published {
        match file.seeds.iter_mut().find(|x| key(&x.link) == key(&e.link)) {
            Some(x) => {
                x.link = e.link;
                x.last_published = e.last_published;
                x.group = e.group;
                x.size = e.size;
                x.change_pct = e.change_pct;
                x.score = e.score;
            }
            None => file.seeds.push(e),
        }
    }
    enforce_cap(file, today);
}

/// How strong a seed looks: its search score, else its through-car reduction, else nothing.
fn strength(e: &Entry) -> f64 {
    e.score.or(e.change_pct.map(|c| -c)).unwrap_or(f64::NEG_INFINITY)
}

/// Append a package unless the file already has it. Returns whether it was added.
pub fn add(file: &mut SeedFile, e: Entry) -> bool {
    if file.seeds.iter().any(|x| key(&x.link) == key(&e.link)) {
        return false;
    }
    file.seeds.push(e);
    true
}

/// Cut the file to its cap, dropping search-published entries that were not published on `today`: oldest first, weakest first among equals.
pub fn enforce_cap(file: &mut SeedFile, today: &str) {
    let cap = file.cap.max(1);
    while file.seeds.len() > cap {
        let drop = (0..file.seeds.len())
            .filter(|&i| file.seeds[i].source != SOURCE_HAND && file.seeds[i].last_published != today)
            .min_by(|&a, &b| {
                let (x, y) = (&file.seeds[a], &file.seeds[b]);
                x.last_published
                    .cmp(&y.last_published)
                    .then(strength(x).partial_cmp(&strength(y)).unwrap_or(std::cmp::Ordering::Equal))
                    .then(a.cmp(&b))
            });
        match drop {
            Some(i) => {
                file.seeds.remove(i);
            }
            None => break,
        }
    }
}

/// A seed that decoded on the current network.
#[derive(Clone, Debug)]
pub struct Prepared {
    pub entry: Entry,
    pub ivs: Vec<Intervention>,
}

/// A seed a search could not use, and why.
#[derive(Clone, Debug, PartialEq)]
pub struct Dropped {
    pub link: String,
    pub reason: String,
}

/// Decode every entry on the study's network. An entry with no match, or with no interventions, is dropped with the reason.
pub fn prepare(study: &Study, file: &SeedFile) -> (Vec<Prepared>, Vec<Dropped>) {
    prepare_with(study, file, &[])
}

/// As `prepare`, with the turn bans of each package that make up a whole ban set in `sets` folded into that set (`bansets::collapse`), so a
/// package of a set and a filter counts two interventions, not twenty-two.
pub fn prepare_with(study: &Study, file: &SeedFile, sets: &[super::bansets::Set]) -> (Vec<Prepared>, Vec<Dropped>) {
    let (mut ok, mut dropped) = (Vec::new(), Vec::new());
    for e in &file.seeds {
        match decode_scenario(&study.net, &study.topo, study.origin, &e.link).map(|ivs| super::bansets::collapse(sets, ivs)) {
            Ok(ivs) if !ivs.is_empty() => ok.push(Prepared { entry: e.clone(), ivs }),
            Ok(_) => dropped.push(Dropped { link: e.link.clone(), reason: "no interventions".into() }),
            Err(why) => dropped.push(Dropped { link: e.link.clone(), reason: format!("no longer decodes on this network: {why}") }),
        }
    }
    (ok, dropped)
}

/// Every package made by removing one intervention from `set` (empty for a single intervention), each sorted.
pub fn sub_packages(set: &[u16]) -> Vec<Vec<u16>> {
    if set.len() < 2 {
        return Vec::new();
    }
    (0..set.len())
        .map(|k| {
            let mut s: Vec<u16> = set.iter().enumerate().filter(|(i, _)| *i != k).map(|(_, &c)| c).collect();
            s.sort_unstable();
            s
        })
        .collect()
}

/// Group `dropped` reasons for the output file: (reason, count), reasons trimmed to their first clause so the same cause counts once.
pub fn reason_counts(dropped: &[Dropped]) -> Vec<(String, usize)> {
    let mut out: Vec<(String, usize)> = Vec::new();
    for d in dropped {
        let r = d.reason.split(':').next().unwrap_or("").trim().to_string();
        match out.iter_mut().find(|x| x.0 == r) {
            Some(x) => x.1 += 1,
            None => out.push((r, 1)),
        }
    }
    out
}
