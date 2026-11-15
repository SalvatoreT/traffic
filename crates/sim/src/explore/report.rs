//! Recheck of the finalists, choice of the options to publish (design D4, D5), their titles and summaries, and the output files.

use super::cands::{adopt, conflicts, generate_with, profile_allows, Cand};
use super::naming::describe;
use super::refs::resolve;
use super::seeds::{self, Dropped};
use super::search::*;
use super::*;
use serde_json::{json, Value};
use std::fmt::Write as _;

/// A finalist rerun over every period and seed at full length.
pub struct Final {
    pub set: Vec<u16>,
    pub reject: Option<String>,
    pub base_vph: f64,
    pub scen_vph: f64,
    pub reduction_pct: f64,
    /// Search penalty: the largest increase in ALL traffic (through and local trips) on one side-street block, after the noise band, over the periods.
    pub harm: f64,
    /// Harm-block position of the block behind `harm`.
    pub worst: usize,
    /// Blocks whose all-traffic increase passes the noise band in any period.
    pub blocks_above: usize,
    /// Through cars only, averaged over the periods: the block that gains the most, and how many gain beyond noise.
    pub through: ThroughHarm,
    pub by_period: Vec<PeriodRes>,
    pub bounding: Vec<(String, f64, f64)>,
    pub inside_pct: f64,
    pub ped_pct: f64,
    pub bike_pct: f64,
    pub score: f64,
    /// Through cars per link in the picture's period, today and with the package.
    pub picture: Option<Picture>,
    /// A package carried over from a stricter group: always rechecked, and never dropped as within noise of a simpler one, so a looser profile's best is never worse than the stricter group's.
    pub forced: bool,
    /// Why the package fails the access check (it strands a block); set for reference packages, which are reported either way.
    pub access: Option<String>,
    /// Where the package came from: this search, or a known package (a seed from an earlier run, or one added by hand).
    pub origin: Origin,
    /// An earlier search published it. When two packages are within noise on through cars, the one published before is kept, so the list does not churn.
    pub prior: bool,
}

/// How a package got into the run.
#[derive(Clone, Debug, PartialEq)]
pub struct Origin {
    /// `search` (found by this run), `seed` (published by an earlier run, from the seeds file) or `hand` (added to the seeds file by a person).
    pub kind: &'static str,
    /// Date the seeds file first recorded it (empty for `search`).
    pub added: String,
    pub note: String,
}

impl Origin {
    pub fn search() -> Origin {
        Origin { kind: "search", added: String::new(), note: String::new() }
    }

    fn of(e: &seeds::Entry) -> Origin {
        Origin { kind: if e.source == seeds::SOURCE_HAND { "hand" } else { "seed" }, added: e.added.clone(), note: e.note.clone() }
    }

    fn json(&self) -> Value {
        let mut v = json!({"kind": self.kind});
        if self.kind != "search" {
            v["added"] = json!(self.added);
            if !self.note.is_empty() {
                v["note"] = json!(self.note);
            }
        }
        v
    }

    fn phrase(&self) -> String {
        match self.kind {
            "seed" => format!("seed from an earlier run, first recorded {}", self.added),
            "hand" => format!("added by hand {}{}", self.added, if self.note.is_empty() { String::new() } else { format!(": {}", self.note) }),
            _ => "found by this search".to_string(),
        }
    }
}

/// The period the proposal card's picture shows when it was searched.
pub const PICTURE_PERIOD: &str = "pm_peak";

/// Through cars an hour on each link in one period (the per-link counters behind the map's cut-through layer), averaged over the seeds,
/// today and with a package. The proposal card draws the change. Only links with a nonzero count in either column are kept.
#[derive(Clone, Debug, PartialEq)]
pub struct Picture {
    pub period: String,
    pub links: Vec<u32>,
    pub base: Vec<i32>,
    pub scen: Vec<i32>,
}

impl Picture {
    pub fn new(period: &str, base: &[f64], scen: &[f64]) -> Picture {
        let mut p = Picture { period: period.into(), links: Vec::new(), base: Vec::new(), scen: Vec::new() };
        for l in 0..base.len().min(scen.len()) {
            let (b, s) = (base[l].round() as i32, scen[l].round() as i32);
            if b != 0 || s != 0 {
                p.links.push(l as u32);
                p.base.push(b);
                p.scen.push(s);
            }
        }
        p
    }

    pub fn to_json(&self) -> Value {
        json!({"period": self.period, "links": self.links, "base": self.base, "scen": self.scen})
    }
}

/// Index of the period the picture shows: the PM peak if it was searched, else the first period.
pub fn picture_period(periods: &[String]) -> usize {
    periods.iter().position(|p| p == PICTURE_PERIOD).unwrap_or(0)
}

/// The side-street block that gains the most through cars an hour, averaged over the periods.
#[derive(Clone, Debug, PartialEq)]
pub struct ThroughHarm {
    /// Harm-block position.
    pub worst: usize,
    /// Raw mean increase on that block (cars an hour, both directions).
    pub increase: f64,
    pub blocks_above: usize,
}

/// One period's like-for-like figures: through cars across the area, and all traffic on the block that gains the most.
#[derive(Clone, Debug, PartialEq)]
pub struct PeriodRes {
    pub base_through: f64,
    pub scen_through: f64,
    pub cut_pct: f64,
    /// Harm-block position of the all-traffic worst block.
    pub worst: usize,
    pub block_base: f64,
    pub block_scen: f64,
    /// Through cars' share of the change on that block (scenario minus baseline).
    pub block_through_inc: f64,
    pub blocks_above: usize,
}

/// `inc` is the mean through-car increase per block over the periods and `sigma` the matching run-to-run spread. The worst block is the
/// one with the largest increase past its noise band (else the largest raw increase); `increase` is that block's raw increase.
pub fn through_harm(inc: &[f64], sigma: &[f64]) -> ThroughHarm {
    let h = harm_calc(inc, sigma);
    ThroughHarm { worst: h.worst, increase: inc.get(h.worst).copied().unwrap_or(0.0), blocks_above: h.n_above }
}

fn pct_change(base: f64, scen: f64) -> f64 {
    if base.abs() > 1e-9 {
        100.0 * (scen - base) / base
    } else {
        0.0
    }
}

pub fn recheck(ctx: &Ctx, sets: &[Vec<u16>]) -> Vec<Final> {
    let (study, p, base) = (ctx.study, ctx.p, ctx.base);
    let (np, ns) = (p.periods.len(), p.seeds.len());
    let mut jobs: Vec<(usize, usize, usize)> = Vec::new();
    for f in 0..sets.len() {
        for pi in 0..np {
            for si in 0..ns {
                jobs.push((f, pi, si));
            }
        }
    }
    let ivs: Vec<Vec<Intervention>> = sets.iter().map(|s| ctx.ivs(s)).collect();
    let outs = parallel_map(p.jobs, &jobs, |&(f, pi, si)| run(study, &ivs[f], &p.periods[pi], p.seeds[si], p.minutes, &[]));
    let mut finals = Vec::new();
    for (f, set) in sets.iter().enumerate() {
        let stats: Vec<PeriodStat> = (0..np)
            .map(|pi| {
                let runs: Vec<&RunOut> = (0..ns).map(|si| &outs[(f * np + pi) * ns + si]).collect();
                period_stat(study, &runs)
            })
            .collect();
        let mut reject = None;
        for (pi, s) in stats.iter().enumerate() {
            if let Some(why) = run_reject(s.unroutable, s.gridlock, s.backlog, &base.full[pi].lite()) {
                reject = Some(format!("{}: {why}", p.periods[pi]));
                break;
            }
        }
        let invalid: u64 = (0..np * ns).map(|k| outs[f * np * ns + k].invalid).sum();
        if invalid > 0 {
            reject = Some("invalid intervention".into());
        }
        finals.push(compare(ctx, set, &stats, reject));
    }
    finals
}

/// Compare a package's per-period statistics with the baseline's.
fn compare(ctx: &Ctx, set: &[u16], stats: &[PeriodStat], reject: Option<String>) -> Final {
    let (study, p, base) = (ctx.study, ctx.p, ctx.base);
    let np = stats.len();
    let nb = study.harm_blocks.len();
    let base_vph = mean(&base.full.iter().map(|s| s.ct_vph).collect::<Vec<_>>());
    let scen_vph = mean(&stats.iter().map(|s| s.ct_vph).collect::<Vec<_>>());
    let (mut harm, mut worst, mut worst_key) = (0.0f64, 0usize, f64::NEG_INFINITY);
    let mut above = vec![false; nb];
    let mut by_period = Vec::new();
    let mut through_inc = vec![0.0f64; nb];
    let mut through_var = vec![0.0f64; nb];
    for pi in 0..np {
        let inc: Vec<f64> = (0..nb).map(|b| stats[pi].block_flow[b] - base.full[pi].block_flow[b]).collect();
        let h = harm_calc(&inc, &base.full[pi].block_sigma);
        for b in 0..nb {
            if inc[b] - (NOISE_SIGMAS * base.full[pi].block_sigma[b]).max(NOISE_FLOOR_VEH_H) > 0.0 {
                above[b] = true;
            }
        }
        let key = h.worst_adj * 1e6 + inc[h.worst];
        if key > worst_key {
            worst_key = key;
            harm = h.worst_adj;
            worst = h.worst;
        }
        for b in 0..nb {
            through_inc[b] += (stats[pi].block_through[b] - base.full[pi].block_through[b]) / np as f64;
            through_var[b] += base.full[pi].block_through_sigma[b].powi(2);
        }
        by_period.push(PeriodRes {
            base_through: base.full[pi].ct_vph,
            scen_through: stats[pi].ct_vph,
            cut_pct: pct_change(base.full[pi].ct_vph, stats[pi].ct_vph),
            worst: h.worst,
            block_base: base.full[pi].block_flow[h.worst],
            block_scen: stats[pi].block_flow[h.worst],
            block_through_inc: stats[pi].block_through[h.worst] - base.full[pi].block_through[h.worst],
            blocks_above: h.n_above,
        });
    }
    let through_sigma: Vec<f64> = through_var.iter().map(|v| v.sqrt() / np.max(1) as f64).collect();
    let through = through_harm(&through_inc, &through_sigma);
    let mut bounding = Vec::new();
    for (k, s) in study.bounding.iter().enumerate() {
        let (fb, fs): (f64, f64) = (base.full.iter().map(|x| x.street_flow[k]).sum(), stats.iter().map(|x| x.street_flow[k]).sum());
        let dv = mean(&(0..np).map(|pi| stats[pi].street_speed[k] - base.full[pi].street_speed[k]).collect::<Vec<_>>());
        bounding.push((s.name.clone(), pct_change(fb, fs), dv * MPS_TO_MPH));
    }
    let m = |f: &dyn Fn(&PeriodStat) -> f64, s: &[PeriodStat]| mean(&s.iter().map(f).collect::<Vec<_>>());
    let red = reduction_pct(base_vph, scen_vph);
    Final {
        set: set.to_vec(),
        reject,
        base_vph,
        scen_vph,
        reduction_pct: red,
        harm,
        worst,
        blocks_above: above.iter().filter(|&&a| a).count(),
        through,
        by_period,
        bounding,
        inside_pct: pct_change(m(&|s| s.inside_s, &base.full), m(&|s| s.inside_s, stats)),
        ped_pct: pct_change(m(&|s| s.ped_conflicts, &base.full), m(&|s| s.ped_conflicts, stats)),
        bike_pct: pct_change(m(&|s| s.bike_conflicts, &base.full), m(&|s| s.bike_conflicts, stats)),
        score: score(p, red, harm),
        picture: {
            let pi = picture_period(&p.periods);
            Some(Picture::new(&p.periods[pi], &base.full[pi].link_through, &stats[pi].link_through))
        },
        forced: false,
        access: None,
        origin: Origin::search(),
        prior: false,
    }
}

// ---------------------------------------------------------------- choosing the options

pub struct Pick {
    pub idx: usize,
    pub why: String,
}

/// Dead band for comparing two options' cut-through reduction (percent of baseline): twice the standard error of a mean over the
/// seeds, from the baseline's run-to-run spread, at least `GOAL_NOISE_FLOOR_PCT`.
pub fn goal_noise_pct(base_cv_pct: f64, n_seeds: usize) -> f64 {
    (NOISE_SIGMAS * base_cv_pct / (n_seeds.max(1) as f64).sqrt()).max(GOAL_NOISE_FLOOR_PCT)
}

/// Choose up to `max` options from the rechecked finalists: no other finalist beats an option on reduction, harm and size; an option
/// whose reduction is within noise of a simpler one is dropped; the best single and the best overall always stay; the rest are
/// spread from fewest interventions to greatest reduction. Returns the picks (ordered by size, then reduction) and a note per finalist.
pub fn select_options(finals: &[Final], max: usize, noise_pct: f64) -> (Vec<Pick>, Vec<String>) {
    let mut notes: Vec<String> = vec![String::new(); finals.len()];
    let ok: Vec<usize> = (0..finals.len())
        .filter(|&i| {
            if let Some(w) = &finals[i].reject {
                notes[i] = format!("rejected: {w}");
                false
            } else if finals[i].reduction_pct <= noise_pct {
                notes[i] = format!("through-car change {:+.1}% is not a reduction beyond noise ({:.1}%)", -finals[i].reduction_pct, noise_pct);
                false
            } else {
                true
            }
        })
        .collect();
    // Stability: a package no earlier search published is dropped when one that was published is within noise of it on through cars and
    // no worse on harm or size, so two runs on near-identical inputs publish the same list.
    let published: Vec<usize> = ok.iter().copied().filter(|&i| finals[i].prior).collect();
    let mut ok = ok;
    ok.retain(|&i| {
        let a = &finals[i];
        if a.prior {
            return true;
        }
        match published.iter().copied().find(|&j| {
            let b = &finals[j];
            b.reduction_pct >= a.reduction_pct - noise_pct && b.harm <= a.harm + NOISE_FLOOR_VEH_H && b.set.len() <= a.set.len()
        }) {
            Some(j) => {
                notes[i] = format!("within noise of finalist {}, which an earlier search published: kept that one so the list does not churn", j + 1);
                false
            }
            None => true,
        }
    });
    // A package an earlier search published is dominated by a new one only when the new one beats it on through cars by more than noise.
    let dominated = |i: usize| {
        let a = &finals[i];
        ok.iter().copied().find(|&j| {
            let b = &finals[j];
            let margin = if a.prior && !b.prior { noise_pct } else { 0.0 };
            j != i
                && b.reduction_pct >= a.reduction_pct + margin
                && b.harm <= a.harm
                && b.set.len() <= a.set.len()
                && (b.reduction_pct > a.reduction_pct + margin || b.harm < a.harm || b.set.len() < a.set.len())
        })
    };
    let mut nd: Vec<usize> = Vec::new();
    for &i in &ok {
        match dominated(i) {
            Some(j) => notes[i] = format!("dominated by finalist {}", j + 1),
            None => nd.push(i),
        }
    }
    let mut keep: Vec<usize> = Vec::new();
    for &i in &nd {
        let a = &finals[i];
        let simpler = nd.iter().copied().filter(|_| !a.forced).find(|&j| {
            let b = &finals[j];
            b.set.len() < a.set.len() && a.reduction_pct <= b.reduction_pct + noise_pct && a.harm >= b.harm - NOISE_FLOOR_VEH_H
        });
        match simpler {
            Some(j) => notes[i] = format!("reduction within noise of simpler finalist {}", j + 1),
            None => keep.push(i),
        }
    }
    // Pareto-consistent listing: a larger package is listed only if it cuts through cars by more than every smaller one that is listed.
    let mut by_size = keep.clone();
    by_size.sort_by(|&a, &b| finals[a].set.len().cmp(&finals[b].set.len()).then(finals[b].reduction_pct.partial_cmp(&finals[a].reduction_pct).unwrap_or(std::cmp::Ordering::Equal)).then(a.cmp(&b)));
    let mut consistent: Vec<usize> = Vec::new();
    for &i in &by_size {
        match consistent.iter().copied().find(|&j| finals[j].set.len() < finals[i].set.len() && finals[j].reduction_pct >= finals[i].reduction_pct) {
            Some(j) => notes[i] = format!("not listed: smaller finalist {} cuts through cars at least as much", j + 1),
            None => consistent.push(i),
        }
    }
    let keep: Vec<usize> = keep.into_iter().filter(|i| consistent.contains(i)).collect();
    let by_score = |a: &usize, b: &usize| finals[*b].score.partial_cmp(&finals[*a].score).unwrap_or(std::cmp::Ordering::Equal).then(a.cmp(b));
    let mut picks: Vec<(usize, String)> = Vec::new();
    let mut by_s = keep.clone();
    by_s.sort_by(by_score);
    let lightest = by_s.iter().map(|&i| finals[i].set.len()).min().unwrap_or(0);
    if let Some(&b) = by_s.iter().find(|&&i| finals[i].set.len() == lightest) {
        picks.push((b, if lightest == 1 { "best single intervention" } else { "lightest option" }.into()));
    }
    if let Some(&b) = by_s.first() {
        if !picks.iter().any(|p| p.0 == b) {
            picks.push((b, "best overall".into()));
        } else {
            picks[0].1 = format!("{} and best overall", picks[0].1);
        }
    }
    let mut rest: Vec<usize> = keep.iter().copied().filter(|i| !picks.iter().any(|p| p.0 == *i)).collect();
    while picks.len() < max && !rest.is_empty() {
        // Add the option whose reduction is farthest from those already chosen, so the set spans light touch to strongest.
        let dist = |i: usize| picks.iter().map(|p| (finals[p.0].reduction_pct - finals[i].reduction_pct).abs()).fold(f64::INFINITY, f64::min);
        let (k, &i) = rest.iter().enumerate().max_by(|a, b| dist(*a.1).partial_cmp(&dist(*b.1)).unwrap_or(std::cmp::Ordering::Equal).then(b.1.cmp(a.1))).unwrap();
        picks.push((i, "spread between the others".into()));
        rest.remove(k);
    }
    for &i in &rest {
        notes[i] = "not chosen: similar to a chosen option".into();
    }
    picks.sort_by(|a, b| finals[a.0].set.len().cmp(&finals[b.0].set.len()).then(finals[a.0].reduction_pct.partial_cmp(&finals[b.0].reduction_pct).unwrap_or(std::cmp::Ordering::Equal)));
    for (n, (i, why)) in picks.iter().enumerate() {
        notes[*i] = format!("chosen as option {}: {why}", n + 1);
    }
    (picks.into_iter().map(|(idx, why)| Pick { idx, why }).collect(), notes)
}

// ---------------------------------------------------------------- titles and summaries

const SUFFIXES: [&str; 12] = ["Avenue", "Street", "Road", "Drive", "Way", "Place", "Court", "Boulevard", "Lane", "Terrace", "Circle", "Alley"];

fn short_street(name: &str) -> String {
    if name.starts_with("Unnamed") {
        return "an unnamed street".into();
    }
    let words: Vec<&str> = name.split_whitespace().collect();
    if words.len() > 1 && SUFFIXES.contains(words.last().unwrap()) {
        words[..words.len() - 1].join(" ")
    } else {
        name.to_string()
    }
}

fn list_and(items: &[String]) -> String {
    match items.len() {
        0 => String::new(),
        1 => items[0].clone(),
        n => format!("{} and {}", items[..n - 1].join(", "), items[n - 1]),
    }
}

fn number_word(n: usize) -> String {
    ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"].get(n).map(|s| s.to_string()).unwrap_or_else(|| n.to_string())
}

fn capitalize(s: &str) -> String {
    let mut c = s.chars();
    match c.next() {
        Some(f) => f.to_uppercase().collect::<String>() + c.as_str(),
        None => String::new(),
    }
}

/// (singular, plural) noun of a candidate kind.
fn noun(kind: &str) -> (&'static str, &'static str) {
    match kind {
        "modal_filter" | "node_filter" => ("filter", "filters"),
        "diagonal_diverter" => ("diagonal diverter", "diagonal diverters"),
        "one_way" => ("one-way conversion", "one-way conversions"),
        "turn_ban" => ("turn ban", "turn bans"),
        "speed_hump" => ("speed hump", "speed humps"),
        "traffic_circle" => ("traffic circle", "traffic circles"),
        "speed_limit" => ("lower speed limit", "lower speed limits"),
        "control" => ("all-way stop", "all-way stops"),
        _ => ("signal timing change", "signal timing changes"),
    }
}

fn kind_group(kind: &str) -> &str {
    if kind == "node_filter" {
        "modal_filter"
    } else {
        kind
    }
}

/// A plain title built from the package's contents, such as "Two filters on Hillegass and Colby".
pub fn title(cands: &[Cand], set: &[u16]) -> String {
    let mut groups: Vec<(&str, Vec<&Cand>)> = Vec::new();
    for &i in set {
        let c = &cands[i as usize];
        let g = kind_group(c.kind);
        match groups.iter_mut().find(|x| x.0 == g) {
            Some(x) => x.1.push(c),
            None => groups.push((g, vec![c])),
        }
    }
    groups.sort_by(|a, b| b.1.len().cmp(&a.1.len()).then(a.0.cmp(b.0)));
    let (kind, cs) = &groups[0];
    let mut places: Vec<String> = Vec::new();
    for c in cs {
        for s in &c.places {
            let s = short_street(s);
            if !places.contains(&s) {
                places.push(s);
            }
        }
    }
    let on = if places.len() > 4 { format!("{} and {} other streets", places[..3].join(", "), places.len() - 3) } else { list_and(&places) };
    let (sing, plur) = noun(kind);
    let head = if cs.len() == 1 { capitalize(sing) } else { capitalize(&format!("{} {}", number_word(cs.len()), plur)) };
    let rest: usize = groups[1..].iter().map(|g| g.1.len()).sum();
    let mut t = format!("{head} on {on}");
    if rest > 0 {
        let _ = write!(t, ", plus {} other {}", number_word(rest), if rest == 1 { "change" } else { "changes" });
    }
    t
}

fn lower_first(s: &str) -> String {
    let mut c = s.chars();
    match c.next() {
        Some(f) => f.to_lowercase().collect::<String>() + c.as_str(),
        None => String::new(),
    }
}

/// Two or three plain sentences: what the package does, what it achieves and where through cars gain the most. Every figure is a count
/// of through cars an hour, so the sentences compare like with like; all-traffic changes are reported apart.
pub fn summary(study: &Study, cands: &[Cand], f: &Final) -> String {
    let n = f.set.len();
    let labels: Vec<String> = f.set.iter().map(|&i| cands[i as usize].label.clone()).collect();
    let shown: Vec<String> = labels.iter().take(4).enumerate().map(|(k, l)| if k == 0 { l.clone() } else { lower_first(l) }).collect();
    let more = if n > 4 { format!(", and {} more", n - 4) } else { String::new() };
    let s1 = format!("It makes {} {}: {}{}.", number_word(n), if n == 1 { "change" } else { "changes" }, shown.join("; "), more);
    let s2 = format!(
        "In the simulation it {} through traffic on the area's side streets by {:.0}%, from {:.0} to {:.0} through cars an hour (average of the periods searched).",
        if f.reduction_pct >= 0.0 { "cuts" } else { "raises" },
        f.reduction_pct.abs(),
        f.base_vph,
        f.scen_vph
    );
    let t = &f.through;
    let s3 = if t.blocks_above > 0 {
        let others = t.blocks_above - 1;
        let tail = if others == 0 { String::new() } else { format!(", and {} other {} gain through cars beyond normal run-to-run variation", others, if others == 1 { "block" } else { "blocks" }) };
        format!("The side-street block that gains the most through traffic is {}, about {:.0} more through cars an hour on average{}.", study.idx.blocks[study.harm_blocks[t.worst]].label, t.increase, tail)
    } else {
        "No side-street block gains through traffic beyond normal run-to-run variation.".to_string()
    };
    format!("{s1} {s2} {s3}")
}

// ---------------------------------------------------------------- orchestration and output

pub struct Outcome {
    pub json: Value,
    pub markdown: String,
    pub cands: Vec<Cand>,
    pub state: SearchState,
    pub finals: Vec<Final>,
    pub picks: Vec<Pick>,
    pub base: Baseline,
    /// Reference packages (config order) rechecked like the finalists.
    pub ref_finals: Vec<Final>,
    pub known: KnownSummary,
    /// The options this run published, as seeds-file entries for the caller to record.
    pub published: Vec<seeds::Entry>,
}

/// What the run did with the seeds file.
#[derive(Clone, Debug, Default)]
pub struct KnownSummary {
    pub loaded: usize,
    pub rechecked: usize,
    pub dropped: Vec<Dropped>,
}

pub fn explore(study: &Study, p: &Params) -> Outcome {
    let t0 = std::time::Instant::now();
    eprintln!("baseline: {} period(s) x {} seed(s) at {} min, plus {} screening run(s) at {} min", p.periods.len(), p.seeds.len(), p.minutes, p.seeds.len(), p.screen_minutes);
    let base = run_baseline(study, p);
    eprintln!("baseline done in {:.0}s; cut-through {}", t0.elapsed().as_secs_f64(), p.periods.iter().zip(&base.full).map(|(n, s)| format!("{n} {:.0} veh/h", s.ct_vph)).collect::<Vec<_>>().join(", "));
    let mut cands = generate_with(study, &base.hot, p.candidates, &p.profile);
    eprintln!("{} candidate interventions:", cands.len());
    for (i, c) in cands.iter().enumerate() {
        eprintln!("  {:3} [{}] {}", i + 1, c.kind, c.label);
    }
    let warm = adopt_warm_start(study, p, &mut cands);
    // Known packages: each is adopted onto the candidate list like a warm-start package and always rechecked in full.
    let pkgs: Vec<Vec<Intervention>> = p.known.iter().map(|k| k.ivs.clone()).collect();
    let mut known = KnownSummary { loaded: p.known.len() + p.known_dropped.len(), rechecked: 0, dropped: p.known_dropped.clone() };
    for d in &known.dropped {
        eprintln!("known package dropped: {}: {}", d.link, d.reason);
    }
    let mut known_sets: Vec<(Vec<u16>, &seeds::Entry)> = Vec::new();
    for (k, r) in adopt_packages(study, p, &mut cands, &pkgs, "known package").into_iter().enumerate() {
        let entry = &p.known[k].entry;
        match r {
            Ok(set) if known_sets.iter().any(|x| x.0 == set) => known.dropped.push(Dropped { link: entry.link.clone(), reason: "duplicate of another known package".into() }),
            Ok(set) => known_sets.push((set, entry)),
            Err(reason) => known.dropped.push(Dropped { link: entry.link.clone(), reason }),
        }
    }
    known.rechecked = known_sets.len();
    eprintln!("known packages: {} loaded, {} to recheck, {} dropped", known.loaded, known.rechecked, known.dropped.len());
    let mut all_known: Vec<Vec<u16>> = warm.clone();
    for (set, _) in &known_sets {
        if !all_known.contains(set) {
            all_known.push(set.clone());
        }
    }
    let families: Vec<Family> = all_known.iter().map(|s| Family::new(s)).collect();
    let ctx = Ctx { study, p, cands: &cands, base: &base };
    let state = beam_search(&ctx, &families);
    let fin_idx = pick_finalists(&state.evals, p.finalists, &all_known);
    eprintln!("rechecking {} finalist(s) over {} period(s) x {} seed(s) at {} min", fin_idx.len(), p.periods.len(), p.seeds.len(), p.minutes);
    let mut sets: Vec<Vec<u16>> = fin_idx.iter().map(|&i| state.evals[i].set.clone()).collect();
    // Packages from a stricter group and known packages are rechecked whatever one-seed screening or the budget said.
    for w in &all_known {
        if !sets.contains(w) {
            sets.push(w.clone());
        }
    }
    let mut finals = recheck(&ctx, &sets);
    for f in finals.iter_mut() {
        f.forced = warm.contains(&f.set);
        if let Some((_, e)) = known_sets.iter().find(|x| x.0 == f.set) {
            f.origin = Origin::of(e);
            f.prior = !e.last_published.is_empty();
        }
    }
    let noise = goal_noise_pct(base_cv_pct(&base), p.seeds.len());
    let (picks, notes) = select_options(&finals, p.options, noise);
    // Reference packages join the candidate list after the search candidates, so the search's indices stay valid.
    let mut all = cands.clone();
    let mut ref_sets: Vec<Vec<u16>> = Vec::new();
    for r in &p.references {
        let ivs = resolve(study, r).unwrap_or_else(|e| panic!("{e}"));
        let mut set = Vec::new();
        for iv in ivs {
            let kind: &'static str = match iv.ty.as_str() {
                "modal_filter" if iv.node.is_some() => "node_filter",
                "modal_filter" => "modal_filter",
                "diagonal_diverter" => "diagonal_diverter",
                "one_way" => "one_way",
                "turn_ban" => "turn_ban",
                "speed_hump" => "speed_hump",
                "traffic_circle" => "traffic_circle",
                "speed_limit" => "speed_limit",
                "control" => "control",
                _ => "signal_timing",
            };
            set.push(all.len() as u16);
            all.push(Cand { label: describe(&study.net, &study.topo, &study.idx, &iv), key: format!("ref:{}:{}", r.id, all.len()), iv, kind, block: None, nodes: vec![], places: vec![], loc_score: 0.0 });
        }
        ref_sets.push(set);
    }
    let ctx_all = Ctx { study, p, cands: &all, base: &base };
    let mut ref_finals = if ref_sets.is_empty() { Vec::new() } else { eprintln!("rechecking {} reference package(s)", ref_sets.len()); recheck(&ctx_all, &ref_sets) };
    for f in ref_finals.iter_mut() {
        f.access = check_access(study, &ctx_all.ivs(&f.set)).err();
    }
    eprintln!("chose {} option(s); total {:.0}s", picks.len(), t0.elapsed().as_secs_f64());
    let json = build_json(study, p, &all, &base, &finals, &picks, &ref_finals, &known);
    let markdown = build_markdown(study, p, &ctx_all, &state, &finals, &picks, &notes, noise, &t0, &ref_finals, &known);
    let today = util::today_utc();
    let published: Vec<seeds::Entry> = picks
        .iter()
        .map(|pk| {
            let f = &finals[pk.idx];
            seeds::Entry {
                link: study.encode(&ctx.ivs(&f.set), Some(&p.periods[0])),
                source: seeds::SOURCE_SEARCH.into(),
                note: String::new(),
                added: today.clone(),
                last_published: today.clone(),
                group: p.profile.id.clone(),
                size: f.set.len(),
                change_pct: Some(r1(-f.reduction_pct)),
                score: Some(r1(f.score)),
            }
        })
        .collect();
    Outcome { json, markdown, cands, state, finals, picks, base, ref_finals, known, published }
}

/// Candidate sets for packages of interventions: each intervention matched to a candidate or added as one. A package the profile does not allow,
/// that cannot be combined (two interventions on one place), or that fails the access check gets `Err` with the reason (and a line on stderr).
pub fn adopt_packages(study: &Study, p: &Params, cands: &mut Vec<Cand>, pkgs: &[Vec<Intervention>], what: &str) -> Vec<Result<Vec<u16>, String>> {
    let mut out: Vec<Result<Vec<u16>, String>> = Vec::new();
    for (k, pkg) in pkgs.iter().enumerate() {
        let mut fail = |why: String| {
            eprintln!("{what} {}: not used, {why}", k + 1);
            out.push(Err(why));
        };
        if let Some(iv) = pkg.iter().find(|iv| !profile_allows(study, &p.profile, iv)) {
            fail(format!("{} is not allowed under {}", describe(&study.net, &study.topo, &study.idx, iv), p.profile.id));
            continue;
        }
        let mut local = cands.clone();
        let mut set: Vec<u16> = pkg.iter().map(|iv| adopt(study, &mut local, iv)).collect();
        set.sort_unstable();
        set.dedup();
        if set.iter().any(|&a| set.iter().any(|&b| a < b && conflicts(&local[a as usize], &local[b as usize]))) {
            fail("two of its interventions share a place".into());
            continue;
        }
        if let Err(why) = check_access(study, &pkg.clone()) {
            fail(format!("access check: {why}"));
            continue;
        }
        *cands = local;
        out.push(Ok(set));
    }
    out
}

/// The warm-start packages (those another group published) as candidate sets, without the ones that cannot be used or repeat.
pub fn adopt_warm_start(study: &Study, p: &Params, cands: &mut Vec<Cand>) -> Vec<Vec<u16>> {
    let mut out: Vec<Vec<u16>> = Vec::new();
    for set in adopt_packages(study, p, cands, &p.warm_start, "warm start package").into_iter().flatten() {
        if !out.contains(&set) {
            out.push(set);
        }
    }
    out
}

/// Mean over periods of the baseline's coefficient of variation of cut-through over seeds (percent); 0 with one seed.
fn base_cv_pct(base: &Baseline) -> f64 {
    mean(&base.full.iter().map(|s| s.ct_cv_pct).collect::<Vec<_>>())
}

fn r1(x: f64) -> f64 {
    (x * 10.0).round() / 10.0
}

#[allow(clippy::too_many_arguments)]
pub fn build_json(study: &Study, p: &Params, cands: &[Cand], base: &Baseline, finals: &[Final], picks: &[Pick], ref_finals: &[Final], known: &KnownSummary) -> Value {
    let entry = |id: String, title: String, f: &Final, kind: &str, note: Option<&str>| -> Value {
        let ivs: Vec<Intervention> = f.set.iter().map(|&i| cands[i as usize].iv.clone()).collect();
        let block_label = |b: usize| study.idx.blocks[study.harm_blocks[b]].label.clone();
        let by_period: serde_json::Map<String, Value> = p
            .periods
            .iter()
            .zip(&f.by_period)
            .map(|(name, r)| {
                (
                    name.clone(),
                    json!({
                        "cutThrough": {"baselineVehPerHour": r1(r.base_through), "scenarioVehPerHour": r1(r.scen_through), "changePct": r1(r.cut_pct)},
                        "allTraffic": {
                            "worstBlock": block_label(r.worst),
                            "baselineVehPerHour": r1(r.block_base),
                            "scenarioVehPerHour": r1(r.block_scen),
                            "throughIncreaseVehPerHour": r1(r.block_through_inc),
                            "blocksAboveNoise": r.blocks_above,
                        },
                    }),
                )
            })
            .collect();
        let mut v = json!({
            "id": id,
            "kind": kind,
            "origin": f.origin.json(),
            "title": title,
            "summary": summary(study, cands, f),
            "link": study.encode(&ivs, Some(&p.periods[0])),
            "interventions": f.set.iter().map(|&i| json!({"type": cands[i as usize].iv.ty, "label": cands[i as usize].label})).collect::<Vec<_>>(),
            "cutThrough": {"baselineVehPerHour": r1(f.base_vph), "scenarioVehPerHour": r1(f.scen_vph), "changePct": r1(-f.reduction_pct)},
            "harm": {"through": {"worstBlock": block_label(f.through.worst), "increaseVehPerHour": r1(f.through.increase), "blocksAboveNoise": f.through.blocks_above}},
            "context": {
                "boundingStreets": f.bounding.iter().map(|(name, flow, speed)| json!({"name": name, "flowChangePct": r1(*flow), "speedChangeMph": r1(*speed)})).collect::<Vec<_>>(),
                "insideTripTimeChangePct": r1(f.inside_pct),
                "pedConflictsChangePct": r1(f.ped_pct),
                "bikeConflictsChangePct": r1(f.bike_pct),
            },
            "byPeriod": by_period,
        });
        if let Some(n) = note {
            v["note"] = json!(n);
        }
        if let Some(w) = &f.access {
            v["accessProblem"] = json!(w);
        }
        if let Some(pic) = &f.picture {
            v["picture"] = pic.to_json();
        }
        v
    };
    let mut proposals: Vec<Value> = picks.iter().enumerate().map(|(n, pick)| entry(format!("p{}", n + 1), title(cands, &finals[pick.idx].set), &finals[pick.idx], "search", None)).collect();
    for (r, f) in p.references.iter().zip(ref_finals) {
        proposals.push(entry(r.id.clone(), r.title.clone(), f, "reference", Some(&r.note)));
    }
    json!({
        "id": p.profile.id,
        "title": p.profile.title,
        "note": p.profile.note,
        "computed": {
            "date": util::today_utc(),
            "periods": p.periods,
            "seeds": p.seeds,
            "minutes": p.minutes,
            "screenMinutes": p.screen_minutes,
            "initialLoad": true,
            "settleSeconds": crate::params::INITIAL_SETTLE_S,
            "window": "From t = 0 over `minutes` simulated minutes, after the initial load and settle interval: the run the app and the stored results make. Published figures come from the rechecks only; screening runs are the same run at `screenMinutes`.",
            "networkHash": study.net_hash,
            "demandHash": study.demand_hash,
            "calibration": study.calibration,
            "knownPackages": {
                "loaded": known.loaded,
                "rechecked": known.rechecked,
                "dropped": known.dropped.len(),
                "droppedBy": seeds::reason_counts(&known.dropped).into_iter().map(|(reason, count)| json!({"reason": reason, "count": count})).collect::<Vec<_>>(),
                "droppedPackages": known.dropped.iter().map(|d| json!({"link": d.link, "reason": d.reason})).collect::<Vec<_>>(),
            },
        },
        "baseline": {"cutThroughVehPerHour": p.periods.iter().zip(&base.full).map(|(n, s)| (n.clone(), json!(r1(s.ct_vph)))).collect::<serde_json::Map<String, Value>>()},
        "proposals": proposals,
    })
}

#[allow(clippy::too_many_arguments)]
fn build_markdown(study: &Study, p: &Params, ctx: &Ctx, state: &SearchState, finals: &[Final], picks: &[Pick], notes: &[String], noise: f64, t0: &std::time::Instant, ref_finals: &[Final], known: &KnownSummary) -> String {
    let (cands, base) = (ctx.cands, ctx.base);
    let mut md = String::new();
    let _ = writeln!(md, "# Proposals report: {}\n", study.area);
    let _ = writeln!(
        md,
        "Generated by `cargo run --release -p traffic-sim --bin explore` on {}. Periods {}, seeds {}, {} min runs; screening on {} / seed {} at {} min. Network hash {}, demand hash {}, baseline calibration status: {}. Wall time {:.0} s on {} job(s).\n",
        util::today_utc(),
        p.periods.join(", "),
        p.seeds.iter().map(|s| s.to_string()).collect::<Vec<_>>().join(", "),
        p.minutes,
        p.periods[0],
        p.seeds[0],
        p.screen_minutes,
        study.net_hash,
        study.demand_hash,
        study.calibration,
        t0.elapsed().as_secs_f64(),
        p.jobs
    );
    let _ = writeln!(md, "## Baseline\n");
    let _ = writeln!(md, "| Period | Through cars an hour, all side streets | Run-to-run spread | Inside trip time (s) | Ped conflicts | Bike conflicts |\n| --- | --- | --- | --- | --- | --- |");
    for (n, s) in p.periods.iter().zip(&base.full) {
        let _ = writeln!(md, "| {n} | {:.1} | {:.1}% | {:.0} | {:.0} | {:.0} |", s.ct_vph, s.ct_cv_pct, s.inside_s, s.ped_conflicts, s.bike_conflicts);
    }
    let _ = writeln!(
        md,
        "\nNoise band for \"traffic increased on a block\", for through cars and for all traffic alike: max({} x the block's standard deviation of flow across seeds, {} cars an hour). With one seed the band is the floor. Two options count as different in cut-through reduction when they differ by more than {:.1}% (twice the standard error of the seed mean).\n",
        NOISE_SIGMAS, NOISE_FLOOR_VEH_H, noise
    );
    let mut hb: Vec<usize> = (0..study.harm_blocks.len()).collect();
    hb.sort_by(|&a, &b| base.hot.block_ct[study.harm_blocks[b]].partial_cmp(&base.hot.block_ct[study.harm_blocks[a]]).unwrap_or(std::cmp::Ordering::Equal).then(a.cmp(&b)));
    let _ = writeln!(md, "Blocks carrying the most through trips in the baseline (through trips an hour, select-link analysis):\n");
    for &b in hb.iter().take(8) {
        let blk = &study.idx.blocks[study.harm_blocks[b]];
        let _ = writeln!(md, "- {}: {:.0}", blk.label, base.hot.block_ct[study.harm_blocks[b]]);
    }
    let mut nodes: Vec<usize> = (0..study.net.nodes.len()).filter(|&n| base.hot.node_ct[n] > 0.0).collect();
    nodes.sort_by(|&a, &b| base.hot.node_ct[b].partial_cmp(&base.hot.node_ct[a]).unwrap_or(std::cmp::Ordering::Equal).then(a.cmp(&b)));
    let _ = writeln!(md, "\nIntersections with the most through movements (through trips an hour):\n");
    for &n in nodes.iter().take(5) {
        let _ = writeln!(md, "- {}: {:.0}", study.idx.node_label(n as u32), base.hot.node_ct[n]);
    }
    let _ = writeln!(md, "\n## Candidates ({})\n", cands.len());
    for (i, c) in cands.iter().enumerate() {
        let _ = writeln!(md, "{}. {}", i + 1, c.label);
    }
    let _ = writeln!(md, "\n## Search\n");
    let _ = writeln!(md, "Beam {}, depth {}, expand {}, harm weight {} points of reduction per car an hour of increase in all traffic on one block (the search ranks on all traffic, because residents experience all of it), {} screening runs simulated{}.\n", p.beam, p.depth, p.expand, p.harm_weight, state.used, p.budget_evals.map(|b| format!(" (budget {b})")).unwrap_or_default());
    for l in &state.log {
        let _ = writeln!(md, "- {l}");
    }
    let _ = writeln!(md, "\n## Known packages\n");
    let _ = writeln!(
        md,
        "{} package(s) in the seeds file `data/proposals/{}.seeds.json` (published by earlier searches or added by hand): {} rechecked in full beside this search's finalists, {} dropped. Each known package and each package one intervention smaller than it was screened, and the best of them started a beam of their own. Known packages compete for the options on equal terms. When a package that was not published before is within noise of one that was, on through cars and with no more harm or interventions, the earlier one is kept so the list does not churn.\n",
        known.loaded,
        study.area,
        known.rechecked,
        known.dropped.len()
    );
    for d in &known.dropped {
        let _ = writeln!(md, "- Dropped: `{}`: {}", d.link, d.reason);
    }
    let _ = writeln!(md, "\n## Finalists, rechecked at full length\n");
    let _ = writeln!(
        md,
        "Through cars are counted on the area's side streets (each car once for the area; on a block, both directions). \"All traffic\" adds the local trips of people who live or drive there. Through figures average the periods searched; the ranking penalty is the largest all-traffic increase on one block in any period, past its noise band.\n"
    );
    let _ = writeln!(md, "| # | Interventions | Source | Through cars an hour, area change (average of periods) | Block gaining the most through cars (cars an hour, average of periods) | Blocks gaining through cars beyond noise | Ranking penalty: all-traffic increase on one block (cars an hour, worst period) | Outcome |\n| --- | --- | --- | --- | --- | --- | --- | --- |");
    for (i, f) in finals.iter().enumerate() {
        let _ = writeln!(
            md,
            "| {} | {} | {} | {:+.1}% | {} (+{:.0}) | {} | {} (+{:.0}) | {} |",
            i + 1,
            f.set.iter().map(|&c| cands[c as usize].label.clone()).collect::<Vec<_>>().join("; "),
            f.origin.kind,
            -f.reduction_pct,
            study.idx.blocks[study.harm_blocks[f.through.worst]].label,
            f.through.increase,
            f.through.blocks_above,
            study.idx.blocks[study.harm_blocks[f.worst]].label,
            f.harm,
            notes[i]
        );
    }
    let _ = writeln!(md, "\n## Chosen options\n");
    for (n, pick) in picks.iter().enumerate() {
        let f = &finals[pick.idx];
        let _ = writeln!(md, "{}. {} ({}; source: {}). {}", n + 1, title(cands, &f.set), pick.why, f.origin.phrase(), summary(study, cands, f));
    }
    if !picks.is_empty() {
        let _ = writeln!(md, "\n### All traffic on side-street blocks, by period (through and local trips together)\n");
        let _ = writeln!(md, "| Option | Period | Block that gains the most all-traffic cars | All cars an hour, before to after | Of the change, through cars | Blocks gaining all-traffic cars beyond noise |\n| --- | --- | --- | --- | --- | --- |");
        for (n, pick) in picks.iter().enumerate() {
            for (name, r) in p.periods.iter().zip(&finals[pick.idx].by_period) {
                let _ = writeln!(
                    md,
                    "| {} | {} | {} | {:.0} to {:.0} | {:+.0} of {:+.0} | {} |",
                    n + 1,
                    name,
                    study.idx.blocks[study.harm_blocks[r.worst]].label,
                    r.block_base,
                    r.block_scen,
                    r.block_through_inc,
                    r.block_scen - r.block_base,
                    r.blocks_above
                );
            }
        }
    }
    if !ref_finals.is_empty() {
        let _ = writeln!(md, "\n## Reference packages\n");
        for (r, f) in p.references.iter().zip(ref_finals) {
            let _ = writeln!(md, "- {} ({}). {} {}", r.title, r.id, r.note, summary(study, cands, f));
            if let Some(w) = &f.reject {
                let _ = writeln!(md, "  Would be rejected as a search result: {w}.");
            }
            if let Some(w) = &f.access {
                let _ = writeln!(md, "  Fails the access check: {w}.");
            }
        }
    }
    if picks.is_empty() {
        let _ = writeln!(md, "No rechecked package reduced cut-through beyond noise without a hard rejection, so nothing is proposed.");
    }
    md
}
