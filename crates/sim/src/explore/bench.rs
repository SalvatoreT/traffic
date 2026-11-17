//! Finite-space search benchmark (change improve-proposal-search-coverage, decisions D1 and D4).
//!
//! A case freezes a small candidate set, a depth, a period and the runs to make. The table phase simulates every conflict-free package up to
//! the depth once per run setting (screening lengths and seeds, and the full hour on the selection seeds) and keeps a compact summary of each
//! run. Searches are then replayed against that table: a search asks for a package and is charged a simulation exactly as it would be live
//! (runs are deterministic for a seed), and never sees a package it did not ask for. The exhaustive table is used only afterwards, to score
//! what each search found. Nothing here changes the simulator.

use super::cands::{adopt, conflicts, Cand};
use super::objectives::{self, Objective};
use super::search::*;
use super::*;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::collections::{BTreeMap, HashMap};
use std::io::Write;
use std::path::Path;
use std::sync::Arc;

pub const CASE_SCHEMA: &str = "search-benchmark-case-1";
pub const RESULTS_SCHEMA: &str = "search-benchmark-results-1";

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RunSpec {
    pub minutes: f64,
    pub seeds: Vec<u64>,
}

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct SearchCfg {
    pub beam: usize,
    pub expand: usize,
    pub finalists: usize,
    pub harm_weight: f64,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CandSpec {
    pub id: String,
    pub iv: Intervention,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub origin: Option<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Case {
    pub schema: String,
    pub id: String,
    pub area: String,
    pub selection: String,
    /// SHA-256 of the network, demand and areas files the case was frozen on (full hex). Results on other files are labeled as such.
    pub inputs: BTreeMap<String, String>,
    pub period: String,
    pub depth: usize,
    /// Seeds of the baseline spread (the noise band) and of the full-hour selection runs.
    pub baseline_seeds: Vec<u64>,
    /// Screening settings to tabulate; each is also a screening-fidelity configuration.
    pub screen: Vec<RunSpec>,
    /// The full-hour selection runs (the production recheck): the reference the screening settings are judged against.
    pub full: RunSpec,
    pub search: SearchCfg,
    /// Seeds for the independent confirmation of the frozen shortlist; never used by the search or the selection.
    #[serde(default)]
    pub confirm: Option<RunSpec>,
    pub candidates: Vec<CandSpec>,
    /// Known packages (candidate ids) given to every competitor in the known-package runs.
    #[serde(default)]
    pub known: Vec<Vec<String>>,
    /// Named candidate subsets (ids), such as those the production generator offers: the analysis reports the best package inside each.
    #[serde(default)]
    pub coverage: BTreeMap<String, Vec<String>>,
}

impl Case {
    pub fn load(path: &Path) -> Result<(Case, String), String> {
        let bytes = std::fs::read(path).map_err(|e| format!("cannot read {}: {e}", path.display()))?;
        let c: Case = serde_json::from_slice(&bytes).map_err(|e| format!("{}: {e}", path.display()))?;
        if c.schema != CASE_SCHEMA {
            return Err(format!("{}: schema {} is not {CASE_SCHEMA}", path.display(), c.schema));
        }
        if c.screen.is_empty() || c.full.seeds.is_empty() || c.depth == 0 || c.candidates.is_empty() {
            return Err("a case needs screening settings, full-hour seeds, a depth and candidates".into());
        }
        Ok((c, util::sha256_hex(&bytes)))
    }

    /// Every (minutes, seed) run the table needs per package, in the order they are run: screening settings first, then the full hour.
    pub fn run_keys(&self) -> Vec<RunKey> {
        let mut out: Vec<RunKey> = Vec::new();
        for s in self.screen.iter().chain(std::iter::once(&self.full)) {
            for &seed in &s.seeds {
                let k = RunKey::new(s.minutes, seed);
                if !out.contains(&k) {
                    out.push(k);
                }
            }
        }
        out
    }

    /// Baseline runs: every run length the table uses, on the baseline seeds.
    pub fn baseline_keys(&self) -> Vec<RunKey> {
        let mut out: Vec<RunKey> = Vec::new();
        for k in self.run_keys() {
            for &seed in &self.baseline_seeds {
                let b = RunKey::new(k.minutes(), seed);
                if !out.contains(&b) {
                    out.push(b);
                }
            }
        }
        out
    }

    pub fn params(&self, jobs: usize) -> Params {
        let mut p = Params::new(&self.area);
        p.periods = vec![self.period.clone()];
        p.seeds = self.full.seeds.clone();
        p.beam = self.search.beam;
        p.expand = self.search.expand;
        p.depth = self.depth;
        p.finalists = self.search.finalists;
        p.harm_weight = self.search.harm_weight;
        p.minutes = self.full.minutes;
        p.screen_minutes = self.screen[0].minutes;
        p.jobs = jobs;
        p
    }

    pub fn known_sets(&self) -> Result<Vec<Vec<u16>>, String> {
        self.known
            .iter()
            .map(|k| {
                let mut s: Vec<u16> = k.iter().map(|id| self.candidates.iter().position(|c| &c.id == id).map(|i| i as u16).ok_or(format!("known package names unknown candidate {id}"))).collect::<Result<_, _>>()?;
                s.sort_unstable();
                Ok(s)
            })
            .collect()
    }
}

/// A run setting: minutes (tenths) and seed, so it can be a map key.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, Serialize, Deserialize)]
pub struct RunKey {
    pub tenths: u32,
    pub seed: u64,
}

impl RunKey {
    pub fn new(minutes: f64, seed: u64) -> RunKey {
        RunKey { tenths: (minutes * 10.0).round() as u32, seed }
    }
    pub fn minutes(&self) -> f64 {
        self.tenths as f64 / 10.0
    }
}

/// Candidates of a case, adopted in manifest order exactly as the audit runner did (the indices are the manifest's).
pub fn case_cands(study: &Study, case: &Case) -> Result<Vec<Cand>, String> {
    let mut cs: Vec<Cand> = Vec::new();
    for spec in &case.candidates {
        let link = study.encode(std::slice::from_ref(&spec.iv), None);
        let ivs = decode::decode_scenario(&study.net, &study.topo, study.origin, &link).map_err(|e| format!("candidate {}: {e}", spec.id))?;
        let [iv] = <[Intervention; 1]>::try_from(ivs).map_err(|_| format!("candidate {} does not decode to one intervention", spec.id))?;
        let old = cs.len();
        if adopt(study, &mut cs, &iv) as usize != old {
            return Err(format!("candidate {} duplicates an earlier candidate", spec.id));
        }
    }
    Ok(cs)
}

/// Every nonempty package of at most `depth` candidates: the conflict-free ones (size, then lexicographic order) and the conflicting ones
/// with the first conflicting pair.
pub fn enumerate(cands: &[Cand], depth: usize) -> (Vec<Vec<u16>>, Vec<(Vec<u16>, (u16, u16))>) {
    fn rec(c: &[Cand], depth: usize, start: usize, cur: &mut Vec<u16>, ok: &mut Vec<Vec<u16>>, bad: &mut Vec<(Vec<u16>, (u16, u16))>) {
        if !cur.is_empty() {
            let pair = cur.iter().enumerate().find_map(|(a, &i)| cur[a + 1..].iter().find(|&&j| conflicts(&c[i as usize], &c[j as usize])).map(|&j| (i, j)));
            match pair {
                Some(p) => bad.push((cur.clone(), p)),
                None => ok.push(cur.clone()),
            }
        }
        if cur.len() == depth {
            return;
        }
        for i in start..c.len() {
            cur.push(i as u16);
            rec(c, depth, i + 1, cur, ok, bad);
            cur.pop();
        }
    }
    let (mut ok, mut bad) = (Vec::new(), Vec::new());
    rec(cands, depth, 0, &mut Vec::new(), &mut ok, &mut bad);
    ok.sort_by(|a, b| a.len().cmp(&b.len()).then(a.cmp(b)));
    bad.sort_by(|a, b| a.0.len().cmp(&b.0.len()).then(a.0.cmp(&b.0)));
    (ok, bad)
}

/// What the benchmark keeps of one run: enough to rebuild a screening evaluation and the full-hour score with the production functions.
#[derive(Clone, Debug, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RunSum {
    pub ct_vph: f64,
    pub unroutable: u64,
    pub gridlock: u64,
    pub backlog: u64,
    pub spawned: u64,
    pub invalid: u64,
    pub inside_n: u64,
    pub inside_tt_s: f64,
    /// All cars and through cars per harm block (both directions), veh/h.
    pub block_flow: Vec<f64>,
    pub block_through: Vec<f64>,
}

impl RunSum {
    pub fn of(study: &Study, r: &RunOut) -> RunSum {
        RunSum {
            ct_vph: r.ct_vph,
            unroutable: r.unroutable,
            gridlock: r.gridlock_removed,
            backlog: r.backlog,
            spawned: r.spawned,
            invalid: r.invalid,
            inside_n: r.inside_n,
            inside_tt_s: r.inside_tt_s,
            block_flow: block_flows(study, &r.flow),
            block_through: block_flows(study, &r.through),
        }
    }
    pub fn inside_mean_s(&self) -> f64 {
        if self.inside_n > 0 {
            self.inside_tt_s / self.inside_n as f64
        } else {
            0.0
        }
    }
}

/// Per-block standard deviation of all-car flow over the baseline runs (the noise band's sigma, as `period_stat` computes it).
pub fn block_sigma(base: &[&RunSum]) -> Vec<f64> {
    let nb = base.first().map_or(0, |r| r.block_flow.len());
    (0..nb).map(|b| std_dev(&base.iter().map(|r| r.block_flow[b]).collect::<Vec<_>>())).collect()
}

/// A package's evaluation from its runs and the baseline runs on the same seeds, with the production rejection, harm and score rules. With one
/// seed this is exactly `eval_screen`; with several it is the recheck's rule (means over seeds, rejection on the means).
pub fn eval_runs(harm_weight: f64, set: &[u16], base: &[&RunSum], scen: &[&RunSum], sigma: &[f64]) -> Eval {
    assert_eq!(base.len(), scen.len(), "paired runs");
    let n = scen.len().max(1) as f64;
    let m = |v: &[&RunSum], f: &dyn Fn(&RunSum) -> f64| v.iter().map(|r| f(r)).sum::<f64>() / n;
    if scen.iter().map(|r| r.invalid).sum::<u64>() > 0 {
        return Eval::rejected(set, "invalid intervention".into());
    }
    let lite = PeriodStatLite { unroutable: m(base, &|r| r.unroutable as f64), gridlock: m(base, &|r| r.gridlock as f64), backlog: m(base, &|r| r.backlog as f64), spawned: m(base, &|r| r.spawned as f64) };
    if let Some(why) = run_reject(m(scen, &|r| r.unroutable as f64), m(scen, &|r| r.gridlock as f64), m(scen, &|r| r.backlog as f64), &lite) {
        return Eval::rejected(set, why);
    }
    let nb = sigma.len();
    let inc: Vec<f64> = (0..nb).map(|b| m(scen, &|r| r.block_flow[b]) - m(base, &|r| r.block_flow[b])).collect();
    let h = harm_calc(&inc, sigma);
    let red = reduction_pct(m(base, &|r| r.ct_vph), m(scen, &|r| r.ct_vph));
    Eval {
        set: set.to_vec(),
        reject: None,
        reduction_pct: red,
        harm: h.worst_adj,
        worst: h.worst,
        inc: inc.iter().map(|&x| x as f32).collect(),
        score: red - harm_weight * h.worst_adj,
        detour_s: m(scen, &|r| r.inside_mean_s()) - m(base, &|r| r.inside_mean_s()),
    }
}

/// One package's row of the table.
#[derive(Clone, Debug, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct PackageRow {
    pub set: Vec<u16>,
    /// The access check's reason when the package strands a node; such a package is not simulated.
    pub access: Option<String>,
    pub runs: BTreeMap<String, RunSum>,
}

pub fn key_name(k: RunKey) -> String {
    format!("{}m-s{}", k.minutes(), k.seed)
}

/// The finished table of a case.
#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Results {
    pub schema: String,
    pub identity: Value,
    pub enumeration: Value,
    pub baseline: BTreeMap<String, RunSum>,
    pub packages: Vec<PackageRow>,
    /// Elapsed time and machine; not part of the result's identity.
    #[serde(default)]
    pub timing: Value,
}

/// The identity fields a results or checkpoint file must share with this checkout (the source revision is recorded, not compared).
pub const IDENTITY_KEYS: [&str; 6] = ["case", "caseSha256", "simulator", "inputs", "harmBlocks", "method"];

/// What a results file must match: the case, the inputs and the simulator.
pub fn identity(study: &Study, root: &Path, case: &Case, case_sha: &str) -> Value {
    let file = |name: &str| std::fs::read(root.join("public/data").join(name)).map(|b| util::sha256_hex(&b)).unwrap_or_default();
    let actual: BTreeMap<String, String> = [("network", format!("{}.network.json", case.area)), ("demand", format!("{}.demand.json", case.area)), ("areas", "areas.json".to_string())].iter().map(|(k, f)| (k.to_string(), file(f))).collect();
    let frozen = actual == case.inputs;
    json!({
        "case": case.id,
        "caseSha256": case_sha,
        "simulator": crate::FINGERPRINT,
        "inputs": actual,
        "inputsLabel": if frozen { "frozen inputs of the case" } else { "CURRENT inputs, which differ from the case's frozen inputs: a separate result" },
        "inputsMatchCase": frozen,
        "calibration": study.calibration,
        "sourceRevision": super::provenance::source_revision(root),
        "method": RESULTS_SCHEMA,
        "harmBlocks": study.harm_blocks.len(),
        "nodes": study.net.nodes.len(),
        "links": study.net.links.len(),
    })
}

fn read_partial(path: &Path) -> Vec<Value> {
    let Ok(text) = std::fs::read_to_string(path) else { return Vec::new() };
    text.lines().filter_map(|l| serde_json::from_str::<Value>(l).ok()).collect()
}

/// Build (or resume) the table of a case. Each finished run is appended to `<out>.partial.jsonl`; a rerun skips what is there. The results
/// file is written once, at the end, and does not depend on `jobs` or on interruptions.
pub fn build_table(study: &Study, root: &Path, case: &Case, case_sha: &str, out: &Path, jobs: usize, max_runs: Option<usize>) -> Result<Option<Results>, String> {
    let ident = identity(study, root, case, case_sha);
    let cands = case_cands(study, case)?;
    let (legal, bad) = enumerate(&cands, case.depth);
    let partial = out.with_extension("partial.jsonl");
    let lines = read_partial(&partial);
    let mut f = std::fs::OpenOptions::new().create(true).append(true).open(&partial).map_err(|e| format!("{}: {e}", partial.display()))?;
    match lines.first() {
        Some(v) if IDENTITY_KEYS.iter().all(|k| v["identity"][*k] == ident[*k]) => {}
        Some(_) => return Err(format!("{} belongs to another case, input or simulator; move it aside", partial.display())),
        None => writeln!(f, "{}", json!({ "identity": ident })).map_err(|e| e.to_string())?,
    }
    let mut baseline: BTreeMap<String, RunSum> = BTreeMap::new();
    let mut runs: HashMap<(Vec<u16>, String), RunSum> = HashMap::new();
    let mut access: HashMap<Vec<u16>, Option<String>> = HashMap::new();
    for v in &lines[1.min(lines.len())..] {
        if let Some(k) = v["baseline"].as_str() {
            baseline.insert(k.into(), serde_json::from_value(v["run"].clone()).map_err(|e| e.to_string())?);
        } else if v.get("access").is_some() {
            let set: Vec<u16> = serde_json::from_value(v["set"].clone()).map_err(|e| e.to_string())?;
            access.insert(set, v["access"].as_str().map(String::from));
        } else if let Some(k) = v["key"].as_str() {
            let set: Vec<u16> = serde_json::from_value(v["set"].clone()).map_err(|e| e.to_string())?;
            runs.insert((set, k.into()), serde_json::from_value(v["run"].clone()).map_err(|e| e.to_string())?);
        }
    }
    let t0 = std::time::Instant::now();
    let mut done_now = 0usize;
    let budget_left = |done: usize| max_runs.map_or(usize::MAX, |m| m.saturating_sub(done));
    // Baseline.
    let want: Vec<RunKey> = case.baseline_keys().into_iter().filter(|k| !baseline.contains_key(&key_name(*k))).collect();
    let want: Vec<RunKey> = want.into_iter().take(budget_left(done_now)).collect();
    if !want.is_empty() {
        eprintln!("baseline: {} run(s)", want.len());
        let outs = parallel_map(jobs, &want, |k| RunSum::of(study, &run(study, &[], &case.period, k.seed, k.minutes(), &[])));
        for (k, r) in want.iter().zip(outs) {
            writeln!(f, "{}", json!({ "baseline": key_name(*k), "run": r })).map_err(|e| e.to_string())?;
            baseline.insert(key_name(*k), r);
        }
        f.flush().map_err(|e| e.to_string())?;
        done_now += want.len();
    }
    // Access checks (cheap, no simulation).
    let unchecked: Vec<Vec<u16>> = legal.iter().filter(|s| !access.contains_key(*s)).cloned().collect();
    if !unchecked.is_empty() {
        let ivs = |s: &Vec<u16>| s.iter().map(|&i| cands[i as usize].iv.clone()).collect::<Vec<_>>();
        let checks = parallel_map(jobs, &unchecked, |s| check_access(study, &ivs(s)).err());
        for (s, c) in unchecked.iter().zip(checks) {
            writeln!(f, "{}", json!({ "set": s, "access": c })).map_err(|e| e.to_string())?;
            access.insert(s.clone(), c);
        }
        f.flush().map_err(|e| e.to_string())?;
    }
    // Package runs, one run setting at a time so the first screening table is complete first.
    let mut todo: Vec<(Vec<u16>, RunKey)> = Vec::new();
    for k in case.run_keys() {
        for s in &legal {
            if access[s].is_none() && !runs.contains_key(&(s.clone(), key_name(k))) {
                todo.push((s.clone(), k));
            }
        }
    }
    let total = todo.len();
    let chunk = (jobs.max(1) * 2).max(1);
    let mut done = 0usize;
    for part in todo.chunks(chunk) {
        let left = budget_left(done_now);
        if left == 0 {
            break;
        }
        let part = &part[..part.len().min(left)];
        let outs = parallel_map(jobs, part, |(s, k)| {
            let ivs: Vec<Intervention> = s.iter().map(|&i| cands[i as usize].iv.clone()).collect();
            RunSum::of(study, &run(study, &ivs, &case.period, k.seed, k.minutes(), &[]))
        });
        for ((s, k), r) in part.iter().zip(outs) {
            writeln!(f, "{}", json!({ "set": s, "key": key_name(*k), "run": r })).map_err(|e| e.to_string())?;
            runs.insert((s.clone(), key_name(*k)), r);
        }
        f.flush().map_err(|e| e.to_string())?;
        done += part.len();
        done_now += part.len();
        eprintln!("{}: {done}/{total} package runs this session, {:.0}s", case.id, t0.elapsed().as_secs_f64());
    }
    let complete = case.baseline_keys().iter().all(|k| baseline.contains_key(&key_name(*k))) && legal.iter().all(|s| access[s].is_some() || case.run_keys().iter().all(|k| runs.contains_key(&(s.clone(), key_name(*k)))));
    if !complete {
        return Ok(None);
    }
    let packages: Vec<PackageRow> = legal
        .iter()
        .map(|s| PackageRow {
            set: s.clone(),
            access: access[s].clone(),
            runs: if access[s].is_some() { BTreeMap::new() } else { case.run_keys().iter().map(|k| (key_name(*k), runs[&(s.clone(), key_name(*k))].clone())).collect() },
        })
        .collect();
    let sim_minutes: f64 = case.run_keys().iter().map(|k| k.minutes()).sum::<f64>() * packages.iter().filter(|p| p.access.is_none()).count() as f64 + case.baseline_keys().iter().map(|k| k.minutes()).sum::<f64>();
    let res = Results {
        schema: RESULTS_SCHEMA.into(),
        identity: ident,
        enumeration: json!({
            "candidates": cands.len(),
            "depth": case.depth,
            "nonempty": legal.len() + bad.len(),
            "conflicting": bad.len(),
            "legal": legal.len(),
            "accessRejected": packages.iter().filter(|p| p.access.is_some()).count(),
            "simulatedPackages": packages.iter().filter(|p| p.access.is_none()).count(),
            "conflicts": bad.iter().map(|(s, (a, b))| json!({"set": s, "pair": [a, b]})).collect::<Vec<_>>(),
        }),
        baseline,
        packages,
        timing: json!({ "simulatedMinutes": sim_minutes, "secondsLastSession": t0.elapsed().as_secs_f64(), "jobs": jobs }),
    };
    let tmp = out.with_extension("tmp");
    std::fs::write(&tmp, serde_json::to_vec(&res).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    std::fs::rename(&tmp, out).map_err(|e| e.to_string())?;
    Ok(Some(res))
}

/// Check a results file against a case and this checkout. Returns the problems (empty: the file can be used).
pub fn verify(res: &Results, study: &Study, root: &Path, case: &Case, case_sha: &str) -> Vec<String> {
    let mut out = Vec::new();
    if res.schema != RESULTS_SCHEMA {
        out.push(format!("schema {} is not {RESULTS_SCHEMA}", res.schema));
    }
    let want = identity(study, root, case, case_sha);
    for k in IDENTITY_KEYS {
        if res.identity[k] != want[k] {
            out.push(format!("{k}: file has {}, this checkout has {}", res.identity[k], want[k]));
        }
    }
    let Ok(cands) = case_cands(study, case) else { return vec!["the case's candidates do not decode here".into()] };
    let (legal, _) = enumerate(&cands, case.depth);
    if res.packages.iter().map(|p| &p.set).collect::<Vec<_>>() != legal.iter().collect::<Vec<_>>() {
        out.push("the packages are not the case's enumeration".into());
    }
    for p in &res.packages {
        if p.access.is_none() && case.run_keys().iter().any(|k| !p.runs.contains_key(&key_name(*k))) {
            out.push(format!("package {:?} lacks a run", p.set));
        }
    }
    for k in case.baseline_keys() {
        if !res.baseline.contains_key(&key_name(k)) {
            out.push(format!("baseline lacks {}", key_name(k)));
        }
    }
    out
}

/// One evaluation setting: run length and seeds.
pub fn screen_table(res: &Results, case: &Case, spec: &RunSpec) -> ScreenTable {
    let base: Vec<&RunSum> = spec.seeds.iter().map(|&s| &res.baseline[&key_name(RunKey::new(spec.minutes, s))]).collect();
    let spread: Vec<&RunSum> = case.baseline_seeds.iter().map(|&s| &res.baseline[&key_name(RunKey::new(spec.minutes, s))]).collect();
    let sigma = block_sigma(&spread);
    let mut rows = HashMap::new();
    for p in &res.packages {
        let row = match &p.access {
            Some(why) => (Eval::rejected(&p.set, why.clone()), false),
            None => {
                let scen: Vec<&RunSum> = spec.seeds.iter().map(|&s| &p.runs[&key_name(RunKey::new(spec.minutes, s))]).collect();
                (eval_runs(case.search.harm_weight, &p.set, &base, &scen, &sigma), true)
            }
        };
        rows.insert(p.set.clone(), row);
    }
    ScreenTable { rows }
}

/// The finalists production forwards to the recheck: `pick_finalists` and each other objective's own finalists.
pub fn finalists(ctx: &Ctx, st: &SearchState, known: &[Vec<u16>]) -> Vec<usize> {
    let mut ids = pick_finalists(&st.evals, ctx.p.finalists, known);
    for &obj in ctx.p.objectives.iter().filter(|o| **o != Objective::MostRemoved) {
        for i in pick_finalists_for(ctx, &st.evals, (ctx.p.finalists / 3).max(3), &BeamLimit::for_objective(obj, ctx.p, ctx.cands)) {
            if !ids.iter().any(|&j| st.evals[j].set == st.evals[i].set) {
                ids.push(i);
            }
        }
    }
    for k in known {
        if let Some(i) = st.cache.get(k) {
            if !ids.contains(i) {
                ids.push(*i);
            }
        }
    }
    ids
}

/// The production search as it runs today: the main beam, then each other objective's beam over the shared cache.
pub fn production_beam(ctx: &Ctx, st: &mut SearchState, known: &[Vec<u16>]) {
    let fams: Vec<Family> = known.iter().map(|s| Family::new(s)).collect();
    beam_search_in(ctx, &fams, &BeamLimit::main(ctx.p), st);
    for &obj in ctx.p.objectives.iter().filter(|o| **o != Objective::MostRemoved) {
        if st.exhausted {
            break;
        }
        beam_search_in(ctx, &fams, &BeamLimit::for_objective(obj, ctx.p, ctx.cands), st);
    }
}

/// Exact nondominated set over the whole table (production dimensions).
pub fn oracle_nd(table: &ScreenTable) -> Vec<Vec<u16>> {
    let mut evals: Vec<Eval> = table.rows.values().map(|r| r.0.clone()).collect();
    evals.sort_by(|a, b| a.set.len().cmp(&b.set.len()).then(a.set.cmp(&b.set)));
    let mut nd: Vec<Vec<u16>> = search::non_dominated(&evals).into_iter().map(|i| evals[i].set.clone()).collect();
    nd.sort();
    nd
}

/// The detour objective's pool floor over a set of full-hour evaluations.
fn detour_floor(evals: &[&Eval]) -> f64 {
    objectives::DETOUR_REDUCTION_FLOOR * evals.iter().filter(|e| e.valid()).map(|e| e.reduction_pct).fold(0.0, f64::max)
}

/// Best package per objective among `pool` on full-hour evaluations. Most removed, no closures and fewest changes: highest score; least
/// detour: lowest detour among packages at or above `floor`. Ties go to fewer changes, then the lexicographically smaller set.
pub fn objective_best<'a>(cands: &[Cand], pool: &[&'a Eval], obj: Objective, floor: f64) -> Option<&'a Eval> {
    let ok = |e: &&&Eval| {
        e.valid()
            && e.reduction_pct > 0.0
            && match obj {
                Objective::MostRemoved => true,
                Objective::NoClosures => e.set.iter().all(|&c| objectives::closes_nothing(&cands[c as usize])),
                Objective::FewestChanges => e.set.len() <= objectives::FEWEST_MAX_CHANGES,
                Objective::LeastDetour => e.reduction_pct >= floor,
            }
    };
    let tie = |a: &Eval, b: &Eval| b.set.len().cmp(&a.set.len()).then(b.set.cmp(&a.set));
    let key = |e: &Eval| if obj == Objective::LeastDetour { -e.detour_s } else { e.score };
    pool.iter().filter(ok).max_by(|a, b| key(a).total_cmp(&key(b)).then_with(|| tie(a, b))).copied()
}

fn raw_max(e: &Eval) -> f64 {
    e.inc.iter().fold(f64::NEG_INFINITY, |m, &x| m.max(x as f64))
}

/// What one search did on one screening table, scored against the exhaustive table and the full-hour runs.
pub fn assess(ctx: &Ctx, st: &SearchState, known: &[Vec<u16>], table: &ScreenTable, full: &HashMap<Vec<u16>, Eval>, screen_cost: f64) -> Value {
    let fin = finalists(ctx, st, known);
    let fin_sets: Vec<Vec<u16>> = fin.iter().map(|&i| st.evals[i].set.clone()).collect();
    let visited: Vec<&Vec<u16>> = st.evals.iter().map(|e| &e.set).collect();
    let oracle_best = table.rows.values().filter(|r| r.0.valid()).map(|r| &r.0).max_by(|a, b| a.score.total_cmp(&b.score).then(b.set.cmp(&a.set))).unwrap();
    let found_best = st.evals.iter().filter(|e| e.valid()).max_by(|a, b| a.score.total_cmp(&b.score).then(b.set.cmp(&a.set)));
    let nd = oracle_nd(table);
    let nd_visited = nd.iter().filter(|s| visited.contains(s)).count();
    let nd_forwarded = nd.iter().filter(|s| fin_sets.contains(s)).count();
    let all_full: Vec<&Eval> = full.values().collect();
    let fin_full: Vec<&Eval> = fin_sets.iter().filter_map(|s| full.get(s)).collect();
    let floor = detour_floor(&all_full);
    let per_obj: Vec<Value> = objectives::ALL
        .iter()
        .map(|&obj| {
            let best = objective_best(ctx.cands, &all_full, obj, floor);
            let got = objective_best(ctx.cands, &fin_full, obj, floor);
            let gap = match (best, got) {
                (Some(b), Some(g)) if obj == Objective::LeastDetour => Some(g.detour_s - b.detour_s),
                (Some(b), Some(g)) => Some(b.score - g.score),
                _ => None,
            };
            json!({"objective": obj.id(), "oracle": best.map(|e| &e.set), "shortlist": got.map(|e| &e.set), "found": best.is_some() && got.map(|g| &g.set) == best.map(|b| &b.set), "gap": gap})
        })
        .collect();
    let mut full_rank: Vec<&Eval> = all_full.iter().copied().filter(|e| e.valid()).collect();
    full_rank.sort_by(|a, b| b.score.total_cmp(&a.score).then(a.set.cmp(&b.set)));
    let top = |k: usize| full_rank.iter().take(k).filter(|e| fin_sets.contains(&e.set)).count();
    let best_fin = fin_full.iter().filter(|e| e.valid()).max_by(|a, b| a.score.total_cmp(&b.score).then(b.set.cmp(&a.set)));
    let rejects = st.evals.iter().filter(|e| !e.valid()).count();
    let access_rejects = st.evals.iter().filter(|e| table.rows.get(&e.set).map_or(false, |r| !r.1)).count();
    json!({
        "charged": st.used,
        "simulatedMinutes": st.used as f64 * screen_cost,
        "visited": st.evals.len(),
        "rejectedAccess": access_rejects,
        "rejectedRun": rejects - access_rejects,
        "bestScreen": found_best.map(|e| json!({"set": e.set, "score": e.score})),
        "oracleBestScreen": {"set": oracle_best.set, "score": oracle_best.score},
        "screenGap": oracle_best.score - found_best.map_or(0.0, |e| e.score),
        "nondominated": {"oracle": nd.len(), "visited": nd_visited, "forwarded": nd_forwarded, "missed": nd.iter().filter(|s| !visited.contains(s)).collect::<Vec<_>>()},
        "finalists": fin_sets,
        "fullHour": {
            "oracleBest": full_rank.first().map(|e| json!({"set": e.set, "score": e.score})),
            "shortlistBest": best_fin.map(|e| json!({"set": e.set, "score": e.score, "reductionPct": e.reduction_pct, "adjustedHarm": e.harm, "rawMaxIncrease": raw_max(e), "detourS": e.detour_s})),
            "gap": full_rank.first().map_or(0.0, |b| b.score) - best_fin.map_or(0.0, |e| e.score),
            "top1": top(1), "top3": top(3), "top5": top(5),
            "objectives": per_obj,
        },
    })
}

/// Full-hour selection evaluations of every package (the recheck rule on the case's full-hour seeds).
pub fn full_evals(res: &Results, case: &Case) -> HashMap<Vec<u16>, Eval> {
    screen_table(res, case, &case.full).rows.into_iter().map(|(k, v)| (k, v.0)).collect()
}

/// Spearman rank correlation of two score lists (average ranks for ties).
pub fn spearman(a: &[f64], b: &[f64]) -> f64 {
    fn ranks(v: &[f64]) -> Vec<f64> {
        let mut idx: Vec<usize> = (0..v.len()).collect();
        idx.sort_by(|&i, &j| v[i].total_cmp(&v[j]));
        let mut r = vec![0.0; v.len()];
        let mut i = 0;
        while i < idx.len() {
            let mut j = i;
            while j + 1 < idx.len() && v[idx[j + 1]] == v[idx[i]] {
                j += 1;
            }
            for k in i..=j {
                r[idx[k]] = (i + j) as f64 / 2.0 + 1.0;
            }
            i = j + 1;
        }
        r
    }
    let (ra, rb) = (ranks(a), ranks(b));
    let (ma, mb) = (mean(&ra), mean(&rb));
    let cov: f64 = ra.iter().zip(&rb).map(|(x, y)| (x - ma) * (y - mb)).sum();
    let va: f64 = ra.iter().map(|x| (x - ma).powi(2)).sum();
    let vb: f64 = rb.iter().map(|y| (y - mb).powi(2)).sum();
    if va == 0.0 || vb == 0.0 {
        0.0
    } else {
        cov / (va * vb).sqrt()
    }
}

/// Make a replay context's table shared.
pub fn shared(t: ScreenTable) -> Arc<ScreenTable> {
    Arc::new(t)
}

/// A context for replays: no baseline runs are needed, the table holds them.
pub fn empty_baseline(study: &Study) -> Baseline {
    Baseline { full: Vec::new(), screen_runs: Vec::new(), screen: period_stat(study, &[]), hot: super::cands::hotspots(study, &[], 1.0) }
}

/// Replay the production beam on the audit's frozen screening table (`screen-results.projection.json`) and compare its visited sequences,
/// in order, and its finalists with the recorded ones. No simulation.
pub fn replay_evidence(study: &Study, case: &Case, proj: &Value) -> Result<Value, String> {
    let cands = case_cands(study, case)?;
    let table = Arc::new(table_from_projection(proj)?);
    replay_on(study, case, &cands, table, proj)
}

/// The audit's frozen screening evaluations as a table (access rejections, which start with "strands", cost nothing).
pub fn table_from_projection(proj: &Value) -> Result<ScreenTable, String> {
    let mut rows = HashMap::new();
    for r in proj["evaluations"].as_array().ok_or("no evaluations")? {
        let set: Vec<u16> = serde_json::from_value(r["set"].clone()).map_err(|e| e.to_string())?;
        let reject: Option<String> = r["reject"].as_str().map(String::from);
        let charged = !reject.as_deref().map_or(false, |w| w.starts_with("strands"));
        let e = Eval {
            set: set.clone(),
            reject: reject.clone(),
            reduction_pct: r["reductionPct"].as_f64().unwrap_or(0.0),
            harm: r["harm"].as_f64().unwrap_or(0.0),
            worst: r["worst"].as_u64().unwrap_or(0) as usize,
            inc: serde_json::from_value(r["blockIncreases"].clone()).unwrap_or_default(),
            score: if reject.is_some() { f64::NEG_INFINITY } else { r["score"].as_f64().unwrap_or(0.0) },
            detour_s: r["detourS"].as_f64().unwrap_or(0.0),
        };
        rows.insert(set, (e, charged));
    }
    Ok(ScreenTable { rows })
}

fn replay_on(study: &Study, case: &Case, cands: &[Cand], table: Arc<ScreenTable>, proj: &Value) -> Result<Value, String> {
    let cands = cands.to_vec();
    let p = case.params(1);
    let base = empty_baseline(study);
    let ctx = Ctx { study, p: &p, cands: &cands, base: &base };
    let mut st = SearchState::replay(table.clone());
    let mut stages = Vec::new();
    let mut matches = true;
    let fams: Vec<Family> = Vec::new();
    for (k, &obj) in p.objectives.iter().enumerate() {
        let lim = if obj == Objective::MostRemoved { BeamLimit::main(&p) } else { BeamLimit::for_objective(obj, &p, &cands) };
        beam_search_in(&ctx, &fams, &lim, &mut st);
        let got: Vec<&Vec<u16>> = st.evals.iter().map(|e| &e.set).collect();
        let want: Vec<Vec<u16>> = serde_json::from_value(proj["beamStages"][k]["visitedSets"].clone()).unwrap_or_default();
        let same = got.len() == want.len() && got.iter().zip(&want).all(|(a, b)| *a == b);
        matches &= same;
        stages.push(json!({"objective": obj.id(), "visited": got.len(), "recorded": want.len(), "sameSequence": same, "charged": st.used}));
    }
    let fin: Vec<Vec<u16>> = finalists(&ctx, &st, &[]).into_iter().map(|i| st.evals[i].set.clone()).collect();
    let want_fin: Vec<Vec<u16>> = serde_json::from_value(proj["beam"]["finalistSets"].clone()).unwrap_or_default();
    matches &= fin == want_fin;
    let nd = oracle_nd(&table);
    let visited: Vec<&Vec<u16>> = st.evals.iter().map(|e| &e.set).collect();
    Ok(json!({
        "matches": matches,
        "stages": stages,
        "finalists": fin, "finalistsMatch": fin == want_fin,
        "charged": st.used,
        "oracleNondominated": nd,
        "missedNondominated": nd.iter().filter(|s| !visited.contains(s)).collect::<Vec<_>>(),
        "trace": st.trace,
    }))
}

pub fn setting_id(s: &RunSpec) -> String {
    format!("{}m-x{}", s.minutes, s.seeds.len())
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Budget {
    /// The search as it is.
    Natural,
    /// The beam, then the supplement with its own allowance (more simulations than the beam).
    Extra,
    /// The beam stopped early so that it and the supplement together cost what the beam alone costs.
    Equal,
    /// A wider beam stopped at the cost of `beam+all@extra`: the equal-cost alternative to the supplement.
    Wide,
}

/// The frozen method list (design D5 of this change). ASSUMPTION: the supplement's allowance is a quarter of the beam's charged runs.
pub fn methods() -> Vec<(String, Vec<super::supplement::Move>, Budget)> {
    use super::supplement::Move;
    let mut v = vec![("beam".to_string(), Vec::new(), Budget::Natural)];
    for b in [Budget::Extra, Budget::Equal] {
        for (name, m) in [("delete", vec![Move::Delete]), ("swap", vec![Move::Swap]), ("coordinated", vec![Move::Coordinated]), ("all", vec![Move::Delete, Move::Swap, Move::Coordinated])] {
            v.push((format!("beam+{name}@{}", if b == Budget::Extra { "extra" } else { "equal" }), m, b));
        }
    }
    v.push(("wide@equal".to_string(), Vec::new(), Budget::Wide));
    v
}

pub const ALLOWANCE_SHARE: f64 = 0.25;
pub const WIDE_BEAM: usize = 2;
pub const WIDE_EXPAND: usize = 4;

pub fn allowance(beam_cost: usize) -> usize {
    ((beam_cost as f64 * ALLOWANCE_SHARE).ceil() as usize).max(1)
}

/// Run one method on a table. `beam_cost` is the unchanged beam's charged runs on the same table and known packages, `all_cost` that of
/// `beam+all@extra` (only `Wide` uses it).
#[allow(clippy::too_many_arguments)]
pub fn run_method(study: &Study, case: &Case, cands: &[Cand], table: Arc<ScreenTable>, known: &[Vec<u16>], pairs: &[((u16, u16), f64)], moves: &[super::supplement::Move], budget: Budget, beam_cost: usize, all_cost: usize) -> (SearchState, Value) {
    let base = empty_baseline(study);
    let mut p = case.params(1);
    let a = allowance(beam_cost);
    match budget {
        Budget::Equal => p.budget_evals = Some(beam_cost.saturating_sub(a)),
        Budget::Wide => {
            p.beam += WIDE_BEAM;
            p.expand += WIDE_EXPAND;
            p.budget_evals = Some(all_cost);
        }
        _ => {}
    }
    let ctx = Ctx { study, p: &p, cands, base: &base };
    let mut st = SearchState::replay(table);
    production_beam(&ctx, &mut st, known);
    let beam_charged = st.used;
    let rec = if matches!(budget, Budget::Extra | Budget::Equal) {
        let p2 = Params { budget_evals: None, ..p.clone() };
        let ctx2 = Ctx { study, p: &p2, cands, base: &base };
        super::supplement::run(&ctx2, &mut st, moves, a, pairs, known)
    } else {
        Value::Null
    };
    let mandatory: Vec<Vec<u16>> = known.iter().flat_map(|k| std::iter::once(k.clone()).chain(super::seeds::sub_packages(k))).collect();
    let known_charged = st.evals.iter().filter(|e| mandatory.contains(&e.set) && e.set.len() > 1 && st.table.as_ref().map_or(false, |t| t.rows.get(&e.set).map_or(false, |r| r.1))).count();
    (st, json!({"beamCharged": beam_charged, "allowance": if rec.is_null() { 0 } else { a }, "knownCharged": known_charged, "supplement": rec}))
}

/// How well a screening setting orders packages against the full-hour selection runs.
pub fn fidelity(table: &ScreenTable, full: &HashMap<Vec<u16>, Eval>) -> Value {
    let mut sets: Vec<&Vec<u16>> = table.rows.keys().filter(|s| table.rows[*s].0.valid() && full.get(*s).map_or(false, |e| e.valid())).collect();
    sets.sort();
    if sets.is_empty() {
        return json!({"packages": 0});
    }
    let a: Vec<f64> = sets.iter().map(|s| table.rows[*s].0.score).collect();
    let b: Vec<f64> = sets.iter().map(|s| full[*s].score).collect();
    let top = |v: &[f64], k: usize| {
        let mut idx: Vec<usize> = (0..v.len()).collect();
        idx.sort_by(|&i, &j| v[j].total_cmp(&v[i]).then(sets[i].cmp(sets[j])));
        idx.truncate(k);
        idx
    };
    let overlap = |k: usize| {
        let tb = top(&b, k);
        top(&a, k).iter().filter(|i| tb.contains(i)).count()
    };
    let win = top(&a, 1)[0];
    let full_rank = top(&b, b.len()).iter().position(|&i| i == win).map(|r| r + 1);
    json!({"packages": sets.len(), "spearman": spearman(&a, &b), "top5Overlap": overlap(5), "top10Overlap": overlap(10), "screenWinner": sets[win], "screenWinnerFullRank": full_rank, "fullWinner": sets[top(&b, 1)[0]]})
}

/// Replay every method on the primary screening setting (the first in the case) and the unchanged beam on every setting, cold and with the
/// case's known packages.
pub fn analyze(study: &Study, case: &Case, res: &Results) -> Value {
    let cands = case_cands(study, case).expect("case candidates");
    let full = full_evals(res, case);
    let pairs = super::bypass::coordinated_pairs(study, &case.period, &cands);
    let known = case.known_sets().expect("known packages");
    let mut runs = Vec::new();
    let mut fid = Vec::new();
    for (si, spec) in case.screen.iter().enumerate() {
        let table = Arc::new(screen_table(res, case, spec));
        let cost = spec.minutes * spec.seeds.len() as f64;
        fid.push(json!({"setting": setting_id(spec), "minutesPerPackage": cost, "fidelity": fidelity(&table, &full)}));
        for (mode, kn) in [("cold", Vec::new()), ("known", known.clone())] {
            if mode == "known" && kn.is_empty() {
                continue;
            }
            let all = methods();
            let list: Vec<_> = if si == 0 { all } else { all.into_iter().take(1).collect() };
            let mut beam_cost = 0;
            let mut all_cost = 0;
            for (id, moves, budget) in list {
                let (st, rec) = run_method(study, case, &cands, table.clone(), &kn, &pairs, &moves, budget, beam_cost, all_cost);
                if budget == Budget::Natural {
                    beam_cost = st.used;
                }
                if id == "beam+all@extra" {
                    all_cost = st.used;
                }
                let base = empty_baseline(study);
                let p = case.params(1);
                let ctx = Ctx { study, p: &p, cands: &cands, base: &base };
                let mut a = assess(&ctx, &st, &kn, &table, &full, cost);
                a["setting"] = json!(setting_id(spec));
                a["mode"] = json!(mode);
                a["method"] = json!(id);
                a["run"] = rec;
                runs.push(a);
            }
        }
    }
    let primary = screen_table(res, case, &case.screen[0]);
    let groups: Vec<Value> = case
        .coverage
        .iter()
        .map(|(name, ids)| {
            let ok: Vec<u16> = ids.iter().filter_map(|id| case.candidates.iter().position(|c| &c.id == id).map(|i| i as u16)).collect();
            let inside = |s: &Vec<u16>| s.iter().all(|c| ok.contains(c));
            let best = |rows: Vec<&Eval>| rows.into_iter().filter(|e| e.valid() && inside(&e.set)).max_by(|a, b| a.score.total_cmp(&b.score).then(b.set.cmp(&a.set))).map(|e| json!({"set": e.set, "score": e.score}));
            let fl: Vec<&Eval> = full.values().filter(|e| inside(&e.set)).collect();
            let floor = detour_floor(&full.values().collect::<Vec<_>>());
            json!({
                "group": name, "candidates": ok,
                "screenBest": best(primary.rows.values().map(|r| &r.0).collect()),
                "fullHourBest": best(full.values().collect()),
                "objectives": objectives::ALL.iter().map(|&o| json!({"objective": o.id(), "best": objective_best(&cands, &fl, o, floor).map(|e| json!({"set": e.set, "score": e.score, "detourS": e.detour_s}))})).collect::<Vec<_>>(),
            })
        })
        .collect();
    json!({
        "schema": "search-benchmark-analysis-1",
        "coverageGroups": groups,
        "identity": res.identity,
        "case": case.id,
        "period": case.period,
        "primarySetting": setting_id(&case.screen[0]),
        "fullSetting": setting_id(&case.full),
        "known": known,
        "coordinatedPairs": pairs.iter().map(|(p, x)| json!({"pair": [p.0, p.1], "extraCostS": x})).collect::<Vec<_>>(),
        "fidelity": fid,
        "runs": runs,
    })
}

fn run_of<'a>(a: &'a Value, setting: &str, mode: &str, method: &str) -> Option<&'a Value> {
    a["runs"].as_array()?.iter().find(|r| r["setting"] == setting && r["mode"] == mode && r["method"] == method)
}

fn found(r: &Value) -> i64 {
    r["fullHour"]["objectives"].as_array().map_or(0, |v| v.iter().filter(|o| o["found"] == json!(true)).count() as i64)
}

fn fgap(r: &Value) -> f64 {
    r["fullHour"]["gap"].as_f64().unwrap_or(f64::INFINITY)
}

fn recall(r: &Value) -> f64 {
    let n = r["nondominated"]["oracle"].as_f64().unwrap_or(0.0);
    if n > 0.0 {
        r["nondominated"]["forwarded"].as_f64().unwrap_or(0.0) / n
    } else {
        1.0
    }
}

/// The frozen adoption rules (design D5 of this change), applied to the analyses of the benchmark cases. `development` names the case whose
/// misses informed the challengers; it is reported but does not decide. `confirm` maps a case id to its confirmation output, when run.
pub fn decide(analyses: &[Value], development: &str, confirm: &HashMap<String, Value>) -> Value {
    let held: Vec<&Value> = analyses.iter().filter(|a| a["case"] != development).collect();
    let mut out = json!({"heldOut": held.iter().map(|a| &a["case"]).collect::<Vec<_>>(), "development": development});
    let mut challengers = Vec::new();
    for name in ["delete", "swap", "coordinated", "all"] {
        let (mut per_run, mut ok) = (Vec::new(), !held.is_empty());
        let (mut s_beam, mut s_x, mut s_wide) = ([0.0f64; 3], [0.0f64; 3], [0.0f64; 3]);
        let mut n = 0.0;
        let mut eq_gap = (0.0, 0.0);
        for a in &held {
            let ps = a["primarySetting"].as_str().unwrap_or("");
            for mode in ["cold", "known"] {
                let (Some(b), Some(x), Some(w)) = (run_of(a, ps, mode, "beam"), run_of(a, ps, mode, &format!("beam+{name}@extra")), run_of(a, ps, mode, "wide@equal")) else { continue };
                let c1 = x["screenGap"].as_f64().unwrap_or(f64::INFINITY) <= b["screenGap"].as_f64().unwrap_or(0.0) + 0.5;
                let c2 = fgap(x) <= fgap(b) + 0.5;
                let c3 = found(x) >= found(b);
                ok &= c1 && c2 && c3;
                if let Some(e) = run_of(a, ps, mode, &format!("beam+{name}@equal")) {
                    eq_gap.0 += fgap(e);
                    eq_gap.1 += fgap(b);
                }
                for (s, r) in [(&mut s_beam, b), (&mut s_x, x), (&mut s_wide, w)] {
                    s[0] += recall(r);
                    s[1] += found(r) as f64;
                    s[2] += fgap(r);
                }
                n += 1.0;
                per_run.push(json!({"case": a["case"], "mode": mode, "screenGapOk": c1, "fullGapOk": c2, "objectivesOk": c3, "beam": {"recall": recall(b), "found": found(b), "fullGap": fgap(b), "charged": b["charged"]}, "challenger": {"recall": recall(x), "found": found(x), "fullGap": fgap(x), "charged": x["charged"]}, "wide": {"recall": recall(w), "found": found(w), "fullGap": fgap(w), "charged": w["charged"]}}));
            }
        }
        let gain = n > 0.0 && ((s_x[0] - s_beam[0]) / n >= 0.10 || s_x[1] - s_beam[1] >= 2.0 || s_beam[2] - s_x[2] >= 1.0);
        let vs_wide = s_x[0] >= s_wide[0] && s_x[1] >= s_wide[1] && s_x[2] <= s_wide[2] && (s_x[0] > s_wide[0] || s_x[1] > s_wide[1] || s_x[2] < s_wide[2]);
        let equal_ok = eq_gap.0 <= eq_gap.1 + 1.0;
        let pass = ok && gain && vs_wide && equal_ok;
        challengers.push(json!({"challenger": name, "pass": pass, "perRunChecks": ok, "gainOverBeam": gain, "betterThanWideAtEqualCost": vs_wide, "equalBudgetNotWorse": equal_ok, "sums": {"beam": s_beam, "challenger": s_x, "wide": s_wide, "runs": n}, "runs": per_run}));
    }
    let order = ["delete", "swap", "coordinated", "all"];
    let mut passing: Vec<&Value> = challengers.iter().filter(|c| c["pass"] == json!(true)).collect();
    passing.sort_by(|a, b| {
        let g = |c: &Value| c["sums"]["challenger"][2].as_f64().unwrap_or(f64::INFINITY);
        let r = |c: &Value| c["sums"]["challenger"][0].as_f64().unwrap_or(0.0);
        let o = |c: &Value| order.iter().position(|x| c["challenger"] == *x).unwrap_or(9);
        g(a).total_cmp(&g(b)).then(r(b).total_cmp(&r(a))).then(o(a).cmp(&o(b)))
    });
    out["search"] = json!({"challengers": challengers, "adopt": passing.first().map(|c| c["challenger"].clone())});
    let mut settings = Vec::new();
    let ids: Vec<String> = held.first().and_then(|a| a["fidelity"].as_array()).map(|v| v.iter().filter_map(|f| f["setting"].as_str().map(String::from)).collect()).unwrap_or_default();
    for s in ids.iter().skip(1) {
        let (mut ok, mut gain_gap, mut gain_found, mut cost_ok) = (!held.is_empty(), 0.0, 0i64, true);
        let mut rows = Vec::new();
        let mut conf = Vec::new();
        for a in &held {
            let ps = a["primarySetting"].as_str().unwrap_or("");
            let (Some(b), Some(x)) = (run_of(a, ps, "cold", "beam"), run_of(a, s, "cold", "beam")) else {
                ok = false;
                continue;
            };
            let fid = |id: &str| a["fidelity"].as_array().and_then(|v| v.iter().find(|f| f["setting"] == id)).map(|f| f["fidelity"]["spearman"].as_f64().unwrap_or(0.0)).unwrap_or(0.0);
            let f1 = fgap(x) <= fgap(b) + 0.5 && found(x) >= found(b);
            let f2 = fid(s) >= fid(ps) - 0.02;
            let c = x["simulatedMinutes"].as_f64().unwrap_or(0.0) <= 3.5 * b["simulatedMinutes"].as_f64().unwrap_or(0.0);
            ok &= f1 && f2;
            cost_ok &= c;
            gain_gap += fgap(b) - fgap(x);
            gain_found += found(x) - found(b);
            let pick = |r: &Value| r["fullHour"]["shortlistBest"]["set"].clone();
            if let Some(cf) = confirm.get(a["case"].as_str().unwrap_or("")) {
                let score = |set: &Value| cf["packages"].as_array().and_then(|v| v.iter().find(|p| p["set"] == *set)).and_then(|p| p["score"].as_f64());
                if pick(x) != pick(b) {
                    conf.push(json!({"case": a["case"], "setting": score(&pick(x)), "primary": score(&pick(b))}));
                }
            }
            rows.push(json!({"case": a["case"], "gapOk": f1, "spearmanOk": f2, "costOk": c, "fullGap": [fgap(b), fgap(x)], "found": [found(b), found(x)], "spearman": [fid(ps), fid(s)], "minutes": [b["simulatedMinutes"], x["simulatedMinutes"]]}));
        }
        let gain = gain_gap >= 1.0 || gain_found >= 1;
        let conf_ok = !conf.is_empty()
            && conf.iter().all(|c| match (c["setting"].as_f64(), c["primary"].as_f64()) {
                (Some(x), Some(y)) => x >= y - 0.5,
                _ => false,
            })
            && conf.iter().any(|c| c["setting"].as_f64().unwrap_or(f64::NEG_INFINITY) >= c["primary"].as_f64().unwrap_or(f64::INFINITY) + 0.5);
        settings.push(json!({"setting": s, "pass": ok && gain && cost_ok && conf_ok, "perCaseChecks": ok, "gain": gain, "costOk": cost_ok, "confirmation": conf, "confirmationOk": conf_ok, "cases": rows}));
    }
    let adopt = settings.iter().filter(|s| s["pass"] == json!(true)).min_by(|a, b| {
        let m = |s: &Value| s["cases"].as_array().map_or(0.0, |v| v.iter().map(|c| c["minutes"][1].as_f64().unwrap_or(0.0)).sum::<f64>());
        m(a).total_cmp(&m(b))
    });
    out["screening"] = json!({"settings": settings, "adopt": adopt.map(|s| s["setting"].clone())});
    out
}

/// The frozen confirmation shortlist of one case: the full-hour best of each declared shortlist, and the full-hour best of all packages.
pub fn shortlist(analysis: &Value, full: &HashMap<Vec<u16>, Eval>) -> Vec<(Vec<u16>, Vec<String>)> {
    let mut out: Vec<(Vec<u16>, Vec<String>)> = Vec::new();
    let mut add = |set: Vec<u16>, why: String| match out.iter_mut().find(|x| x.0 == set) {
        Some(x) => x.1.push(why),
        None => out.push((set, vec![why])),
    };
    let ps = analysis["primarySetting"].as_str().unwrap_or("");
    for r in analysis["runs"].as_array().into_iter().flatten() {
        let m = r["method"].as_str().unwrap_or("");
        let keep = r["mode"] == "cold" && (m == "beam" || (r["setting"] == ps && (m.ends_with("@extra") || m == "wide@equal")));
        if let (true, Ok(set)) = (keep, serde_json::from_value::<Vec<u16>>(r["fullHour"]["shortlistBest"]["set"].clone())) {
            add(set, format!("{} {m}", r["setting"].as_str().unwrap_or("")));
        }
    }
    let best = full.values().filter(|e| e.valid()).max_by(|a, b| a.score.total_cmp(&b.score).then(b.set.len().cmp(&a.set.len())).then(b.set.cmp(&a.set)));
    if let Some(b) = best {
        add(b.set.clone(), "full-hour best of all packages".into());
    }
    out
}

/// Freeze the shortlist (written before any confirmation run), then run baseline and shortlist on the case's confirmation seeds, resumable,
/// and report scores and paired differences. The shortlist file is never rewritten with a different content.
pub fn confirm(study: &Study, case: &Case, res: &Results, out: &Path, jobs: usize) -> Result<(), String> {
    let spec = case.confirm.clone().ok_or("the case declares no confirmation seeds")?;
    if spec.seeds.iter().any(|s| case.baseline_seeds.contains(s) || case.screen.iter().chain(std::iter::once(&case.full)).any(|r| r.seeds.contains(s))) {
        return Err("confirmation seeds overlap the seeds the search and selection used".into());
    }
    let cands = case_cands(study, case)?;
    let full = full_evals(res, case);
    let analysis = analyze(study, case, res);
    let list = shortlist(&analysis, &full);
    let frozen_path = out.with_extension("shortlist.json");
    let frozen = json!({"case": case.id, "identity": res.identity, "seeds": spec.seeds, "minutes": spec.minutes, "packages": list.iter().map(|(s, w)| json!({"set": s, "selectedBy": w, "fullHourScore": full.get(s).map(|e| e.score)})).collect::<Vec<_>>()});
    if frozen_path.exists() {
        let prev: Value = serde_json::from_slice(&std::fs::read(&frozen_path).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
        if prev != frozen {
            return Err(format!("{} holds a different shortlist; it is never replaced", frozen_path.display()));
        }
    } else {
        std::fs::write(&frozen_path, serde_json::to_vec_pretty(&frozen).unwrap()).map_err(|e| e.to_string())?;
    }
    let partial = out.with_extension("partial.jsonl");
    let mut done: HashMap<(Vec<u16>, u64), RunSum> = HashMap::new();
    for v in read_partial(&partial) {
        if let (Ok(set), Some(seed), Ok(r)) = (serde_json::from_value::<Vec<u16>>(v["set"].clone()), v["seed"].as_u64(), serde_json::from_value::<RunSum>(v["run"].clone())) {
            done.insert((set, seed), r);
        }
    }
    let mut f = std::fs::OpenOptions::new().create(true).append(true).open(&partial).map_err(|e| e.to_string())?;
    let sets: Vec<Vec<u16>> = std::iter::once(Vec::new()).chain(list.iter().map(|x| x.0.clone())).collect();
    let todo: Vec<(Vec<u16>, u64)> = sets.iter().flat_map(|s| spec.seeds.iter().map(move |&k| (s.clone(), k))).filter(|k| !done.contains_key(k)).collect();
    for part in todo.chunks(jobs.max(1) * 2) {
        let outs = parallel_map(jobs, part, |(s, k)| {
            let ivs: Vec<Intervention> = s.iter().map(|&i| cands[i as usize].iv.clone()).collect();
            RunSum::of(study, &run(study, &ivs, &case.period, *k, spec.minutes, &[]))
        });
        for ((s, k), r) in part.iter().zip(outs) {
            writeln!(f, "{}", json!({"set": s, "seed": k, "run": r})).map_err(|e| e.to_string())?;
            done.insert((s.clone(), *k), r);
        }
        f.flush().map_err(|e| e.to_string())?;
        eprintln!("{} confirmation: {}/{} runs", case.id, done.len(), sets.len() * spec.seeds.len());
    }
    let base: Vec<&RunSum> = spec.seeds.iter().map(|&k| &done[&(Vec::new(), k)]).collect();
    let sigma = block_sigma(&base);
    let ref_set = list.first().map(|x| x.0.clone());
    let series = |s: &Vec<u16>, g: &dyn Fn(&RunSum) -> f64| spec.seeds.iter().map(|&k| g(&done[&(s.clone(), k)])).collect::<Vec<f64>>();
    let pd = |a: Vec<f64>, b: Vec<f64>| super::paired::Paired::of(&super::paired::diffs(&a, &b).unwrap_or_default());
    let pkgs: Vec<Value> = sets
        .iter()
        .map(|s| {
            let scen: Vec<&RunSum> = spec.seeds.iter().map(|&k| &done[&(s.clone(), k)]).collect();
            let e = eval_runs(case.search.harm_weight, s, &base, &scen, &sigma);
            let through = pd(series(&Vec::new(), &|r| r.ct_vph), series(s, &|r| r.ct_vph));
            let detour = pd(series(&Vec::new(), &|r| r.inside_mean_s()), series(s, &|r| r.inside_mean_s()));
            let vs_ref = ref_set.as_ref().filter(|r| *r != s && !s.is_empty()).map(|r| pd(series(r, &|x| x.ct_vph), series(s, &|x| x.ct_vph)).to_json("more through cars", "fewer through cars"));
            let raw = e.inc.iter().enumerate().max_by(|a, b| a.1.total_cmp(b.1).then(b.0.cmp(&a.0)));
            json!({
                "set": s, "labels": s.iter().map(|&i| &cands[i as usize].label).collect::<Vec<_>>(),
                "selectedBy": list.iter().find(|x| &x.0 == s).map(|x| &x.1),
                "reject": e.reject, "score": if e.valid() { Some(e.score) } else { None }, "reductionPct": e.reduction_pct, "adjustedHarm": e.harm,
                "rawMaxIncrease": raw.map(|x| *x.1), "rawMaxBlock": raw.map(|(b, _)| study.idx.blocks[study.harm_blocks[b]].label.clone()),
                "throughChange": through.to_json("increase", "decrease"), "insideTripTimeChangeS": detour.to_json("increase", "decrease"),
                "throughVsFirstShortlisted": vs_ref,
            })
        })
        .collect();
    let v = json!({
        "schema": "search-benchmark-confirmation-1", "case": case.id, "identity": res.identity, "seeds": spec.seeds, "minutes": spec.minutes,
        "method": super::paired::REPORT_METHOD,
        "scope": "Frozen shortlist only, on seeds no search or selection used. Paired Student t intervals over the seeds of one fixed model; pointwise; no interval for the nonlinear score or the largest block increase; trip times cover completed trips only.",
        "packages": pkgs,
    });
    let tmp = out.with_extension("tmp");
    std::fs::write(&tmp, serde_json::to_vec_pretty(&v).unwrap()).map_err(|e| e.to_string())?;
    std::fs::rename(&tmp, out).map_err(|e| e.to_string())?;
    Ok(())
}

/// The screening table of `spec` from a table run's checkpoint file, when every run it needs is there (the table phase runs the first
/// screening setting first, so this is available long before the whole table).
pub fn table_from_partial(study: &Study, case: &Case, partial: &Path, spec: &RunSpec) -> Result<ScreenTable, String> {
    let cands = case_cands(study, case)?;
    let (legal, _) = enumerate(&cands, case.depth);
    let mut baseline: BTreeMap<String, RunSum> = BTreeMap::new();
    let mut access: HashMap<Vec<u16>, Option<String>> = HashMap::new();
    let mut runs: BTreeMap<(Vec<u16>, String), RunSum> = BTreeMap::new();
    for v in read_partial(partial) {
        if let Some(k) = v["baseline"].as_str() {
            baseline.insert(k.into(), serde_json::from_value(v["run"].clone()).map_err(|e| e.to_string())?);
        } else if v.get("access").is_some() {
            access.insert(serde_json::from_value(v["set"].clone()).map_err(|e| e.to_string())?, v["access"].as_str().map(String::from));
        } else if let Some(k) = v["key"].as_str() {
            runs.insert((serde_json::from_value(v["set"].clone()).map_err(|e| e.to_string())?, k.into()), serde_json::from_value(v["run"].clone()).map_err(|e| e.to_string())?);
        }
    }
    let packages: Vec<PackageRow> = legal
        .iter()
        .map(|s| {
            let acc = access.get(s).cloned().ok_or(format!("no access check for {s:?} yet"))?;
            let mut r = BTreeMap::new();
            if acc.is_none() {
                for &seed in &spec.seeds {
                    let k = key_name(RunKey::new(spec.minutes, seed));
                    r.insert(k.clone(), runs.get(&(s.clone(), k.clone())).cloned().ok_or(format!("no {k} run for {s:?} yet"))?);
                }
            }
            Ok(PackageRow { set: s.clone(), access: acc, runs: r })
        })
        .collect::<Result<_, String>>()?;
    let res = Results { schema: RESULTS_SCHEMA.into(), identity: Value::Null, enumeration: Value::Null, baseline, packages, timing: Value::Null };
    for &seed in &case.baseline_seeds {
        if !res.baseline.contains_key(&key_name(RunKey::new(spec.minutes, seed))) {
            return Err(format!("no baseline run {} yet", key_name(RunKey::new(spec.minutes, seed))));
        }
    }
    Ok(screen_table(&res, case, spec))
}

/// Compare a screening table with the audit's frozen evaluations, and replay the beam on it against the recorded visited sequences.
pub fn compare_with_evidence(study: &Study, case: &Case, table: ScreenTable, proj: &Value) -> Result<Value, String> {
    let mut worst = [0.0f64; 4];
    let (mut rejects_differ, mut missing) = (Vec::new(), 0usize);
    for r in proj["evaluations"].as_array().ok_or("no evaluations")? {
        let set: Vec<u16> = serde_json::from_value(r["set"].clone()).map_err(|e| e.to_string())?;
        let Some((e, _)) = table.rows.get(&set) else {
            missing += 1;
            continue;
        };
        if e.reject.as_deref() != r["reject"].as_str() {
            rejects_differ.push(set.clone());
            continue;
        }
        if e.valid() {
            for (k, (a, b)) in [(e.reduction_pct, "reductionPct"), (e.harm, "harm"), (e.score, "score"), (e.detour_s, "detourS")].iter().enumerate() {
                worst[k] = worst[k].max((a - r[*b].as_f64().unwrap_or(f64::NAN)).abs());
            }
        }
    }
    let mut v = json!({"evaluations": proj["evaluations"].as_array().map_or(0, |a| a.len()), "missing": missing, "rejectionsDiffer": rejects_differ, "maxAbsDiff": {"reductionPct": worst[0], "harm": worst[1], "score": worst[2], "detourS": worst[3]}});
    let rows: Vec<Value> = table
        .rows
        .values()
        .map(|(e, _)| json!({"set": e.set, "reject": e.reject, "reductionPct": e.reduction_pct, "harm": e.harm, "worst": e.worst, "blockIncreases": e.inc, "score": if e.valid() { e.score } else { 0.0 }, "detourS": e.detour_s}))
        .collect();
    let mine = json!({"evaluations": rows, "beamStages": proj["beamStages"], "beam": proj["beam"]});
    let rep = replay_evidence(study, case, &mine)?;
    v["replay"] = json!({"matches": rep["matches"], "stages": rep["stages"], "finalistsMatch": rep["finalistsMatch"], "charged": rep["charged"], "missedNondominated": rep["missedNondominated"], "oracleNondominated": rep["oracleNondominated"]});
    v["identical"] = json!(missing == 0 && v["rejectionsDiffer"].as_array().map_or(false, |a| a.is_empty()) && worst.iter().all(|&w| w == 0.0) && rep["matches"] == json!(true));
    Ok(v)
}

/// Screening-only replay of every method on a screening table (no full-hour runs): charged runs, best-score gap and nondominated coverage.
pub fn methods_on_table(study: &Study, case: &Case, table: Arc<ScreenTable>) -> Value {
    let cands = case_cands(study, case).expect("case candidates");
    let pairs = super::bypass::coordinated_pairs(study, &case.period, &cands);
    let known = case.known_sets().expect("known packages");
    let nd = oracle_nd(&table);
    let oracle_best = table.rows.values().filter(|r| r.0.valid()).map(|r| r.0.score).fold(f64::NEG_INFINITY, f64::max);
    let mut out = Vec::new();
    for (mode, kn) in [("cold", Vec::new()), ("known", known)] {
        if mode == "known" && kn.is_empty() {
            continue;
        }
        let (mut beam_cost, mut all_cost) = (0, 0);
        for (id, moves, budget) in methods() {
            let (st, rec) = run_method(study, case, &cands, table.clone(), &kn, &pairs, &moves, budget, beam_cost, all_cost);
            if budget == Budget::Natural {
                beam_cost = st.used;
            }
            if id == "beam+all@extra" {
                all_cost = st.used;
            }
            let base = empty_baseline(study);
            let p = case.params(1);
            let ctx = Ctx { study, p: &p, cands: &cands, base: &base };
            let fin: Vec<Vec<u16>> = finalists(&ctx, &st, &kn).into_iter().map(|i| st.evals[i].set.clone()).collect();
            let visited: Vec<&Vec<u16>> = st.evals.iter().map(|e| &e.set).collect();
            let best = st.evals.iter().filter(|e| e.valid()).map(|e| e.score).fold(f64::NEG_INFINITY, f64::max);
            out.push(json!({"mode": mode, "method": id, "charged": st.used, "screenGap": oracle_best - best,
                "ndVisited": nd.iter().filter(|s| visited.contains(s)).count(), "ndForwarded": nd.iter().filter(|s| fin.contains(s)).count(), "nd": nd.len(),
                "missed": nd.iter().filter(|s| !visited.contains(s)).collect::<Vec<_>>(), "knownCharged": rec["knownCharged"]}));
        }
    }
    json!({"case": case.id, "scope": "screening table only; no full-hour runs", "runs": out})
}
