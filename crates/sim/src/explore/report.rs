//! Recheck of the finalists, choice of the options to publish (design D4, D5), their titles and summaries, and the output files.

use super::cands::{adopt, conflicts, generate_with, profile_allows, Cand};
use super::naming::describe;
use super::paired::{diffs, option_gain, CtPairs, Paired, Status, LEVEL, MIN_PAIRS, REPORT_METHOD};
use super::refs::resolve;
use super::seeds::{self, Dropped};
use super::similar;
use super::search::*;
use super::objectives::{eligible, Objective, DETOUR_REDUCTION_FLOOR, DETOUR_TIE_S};
use super::*;
use serde_json::{json, Value};
use std::fmt::Write as _;

/// A finalist rerun over every period and seed at full length.
#[derive(Clone)]
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
    /// Through cars only, averaged over the periods: the block with the largest raw increase (apart from the search penalty's block),
    /// and how many blocks gain beyond the noise band or beyond their seed interval.
    pub through: ThroughHarm,
    /// Scenario minus baseline through cars an hour, area-wide and averaged over the periods within each seed, paired by seed.
    pub effect: Paired,
    /// The per-period, per-seed through cars an hour behind `effect`, kept for option-to-option comparisons.
    pub pairs: CtPairs,
    /// What the runs behind this package did in the choice of options: `selection` (they chose the options and estimate them),
    /// `confirmation` (a frozen shortlist on seeds not used to choose) or `reference` (not a candidate for the options).
    pub role: &'static str,
    pub by_period: Vec<PeriodRes>,
    pub bounding: Vec<(String, f64, f64)>,
    pub inside_pct: f64,
    pub ped_pct: f64,
    pub bike_pct: f64,
    pub score: f64,
    /// Through cars per link in the picture's period, today and with the package.
    pub picture: Option<Picture>,
    /// All cars per link on the side-street blocks the card measures, same period, links and seeds as `picture`.
    pub picture_all: Option<Picture>,
    /// A package carried over from a stricter group: always rechecked, and never dropped as within noise of a simpler one, so a looser profile's best is never worse than the stricter group's.
    pub forced: bool,
    /// Why the package fails the access check (it strands a block); set for reference packages, which are reported either way.
    pub access: Option<String>,
    /// Where the package came from: this search, or a known package (a seed from an earlier run, or one added by hand).
    pub origin: Origin,
    /// An earlier search published it. When two packages are within noise on through cars, the one published before is kept, so the list does not churn.
    pub prior: bool,
    /// The places the package acts at, sorted (see `places_of`): equal places mean the packages differ only in the variant at a place.
    pub places: Vec<String>,
    /// Through-car change on each side-street block (harm-block order), mean over the periods and seeds: the package's per-block picture.
    pub block_change: Vec<f64>,
    /// Added trip time (s per trip) of completed car trips that start or end inside the study area, scenario minus baseline, paired by seed
    /// and averaged over the periods. Positive is a longer trip. Trips that complete are the only ones timed, so a package that strands or
    /// delays trips beyond the run's end is understated.
    pub detour: Paired,
    pub detour_s: f64,
    /// The per-seed values behind `detour` (periods averaged), in seed order, so two packages' detours can be compared pair by pair.
    pub detour_seeds: Vec<f64>,
    /// The same trips' summed added time, vehicle-minutes an hour.
    pub detour_vmin_h: f64,
    /// Some intervention in the package closes a street or an intersection to cars (a modal filter or a diverter).
    pub closes: bool,
    /// The objectives this package is the best for in the published list (set when it is chosen).
    pub objectives: Vec<super::objectives::Objective>,
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
        Picture::scoped(period, base, scen, &[])
    }

    /// Like `new`, but with a non-empty `in_scope` only the links marked there are kept.
    pub fn scoped(period: &str, base: &[f64], scen: &[f64], in_scope: &[bool]) -> Picture {
        let mut p = Picture { period: period.into(), links: Vec::new(), base: Vec::new(), scen: Vec::new() };
        for l in 0..base.len().min(scen.len()) {
            if !in_scope.is_empty() && !in_scope.get(l).copied().unwrap_or(false) {
                continue;
            }
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

/// The links of the side-street blocks the search measures: the only links whose all-car counts the card needs.
pub fn measured_links(study: &Study) -> Vec<bool> {
    let mut m = vec![false; study.net.links.len()];
    for &b in &study.harm_blocks {
        for &l in &study.idx.blocks[b].links {
            m[l as usize] = true;
        }
    }
    m
}

/// Index of the period the picture shows: the PM peak if it was searched, else the first period.
pub fn picture_period(periods: &[String]) -> usize {
    periods.iter().position(|p| p == PICTURE_PERIOD).unwrap_or(0)
}

/// Through cars on side-street blocks, averaged over the periods. The raw maximum (`worst`, `increase`) and the search penalty
/// (`penalty_block`, `penalty`) are different quantities and may name different blocks.
#[derive(Clone, Debug, PartialEq)]
pub struct ThroughHarm {
    /// Harm-block position of the block with the largest raw mean increase (cars an hour, both directions). Ties go to the lowest position.
    pub worst: usize,
    /// Raw mean increase on that block.
    pub increase: f64,
    /// Through cars an hour on that block before and after, mean over seeds and periods.
    pub base: f64,
    pub scen: f64,
    /// Scenario minus baseline on that block, paired by seed. Chosen after seeing the data among many blocks, so the interval is not adjusted for that choice.
    pub effect: Paired,
    /// The block the noise-adjusted rule picks (largest increase past its band) and its penalty after the band; none when no block passes its band.
    pub penalty_block: Option<usize>,
    pub penalty: f64,
    /// Blocks whose increase passes the noise band (an assumed dead band).
    pub blocks_above: usize,
    /// Blocks whose seed interval is above zero.
    pub blocks_resolved: usize,
}

/// One period's like-for-like figures: through cars across the area, and all traffic on the block with the largest raw increase.
#[derive(Clone, Debug, PartialEq)]
pub struct PeriodRes {
    pub base_through: f64,
    pub scen_through: f64,
    pub cut_pct: f64,
    pub effect: Paired,
    /// Harm-block position of the all-traffic block with the largest raw increase in this period.
    pub worst: usize,
    pub block_base: f64,
    pub block_scen: f64,
    /// Through cars' share of the change on that block (scenario minus baseline).
    pub block_through_inc: f64,
    /// All-traffic change on that block, paired by seed.
    pub block_effect: Paired,
    /// The block behind the search penalty in this period and the penalty after the noise band; none when no block passes its band.
    pub penalty_block: Option<usize>,
    pub penalty: f64,
    pub blocks_above: usize,
}

/// `inc` is the mean through-car increase per block over the periods and `sigma` the matching run-to-run spread. The raw maximum is the
/// block with the largest increase; the penalty block is the one with the largest increase past its noise band. Both are reported.
pub fn through_harm(inc: &[f64], sigma: &[f64]) -> ThroughHarm {
    let h = harm_calc(inc, sigma);
    ThroughHarm {
        worst: h.raw_worst,
        increase: h.raw_increase,
        base: 0.0,
        scen: 0.0,
        effect: Paired::none(),
        penalty_block: h.adj_block,
        penalty: h.worst_adj,
        blocks_above: h.n_above,
        blocks_resolved: 0,
    }
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

/// Compare a package's per-period statistics with the baseline's. Runs are paired by seed within each period.
fn compare(ctx: &Ctx, set: &[u16], stats: &[PeriodStat], reject: Option<String>) -> Final {
    let (study, p, base) = (ctx.study, ctx.p, ctx.base);
    let (np, ns) = (stats.len(), p.seeds.len());
    let nb = study.harm_blocks.len();
    let pairs = CtPairs::new(
        &p.seeds,
        base.full.iter().map(|s| s.runs.iter().map(|r| r.ct_vph).collect()).collect(),
        stats.iter().map(|s| s.runs.iter().map(|r| r.ct_vph).collect()).collect(),
    )
    .unwrap_or_else(|e| panic!("final comparison needs one baseline and one scenario run per period and seed: {e}"));
    let base_vph = mean(&base.full.iter().map(|s| s.ct_vph).collect::<Vec<_>>());
    let scen_vph = mean(&stats.iter().map(|s| s.ct_vph).collect::<Vec<_>>());
    let (mut harm, mut worst, mut worst_key) = (0.0f64, 0usize, f64::NEG_INFINITY);
    let mut above = vec![false; nb];
    let mut by_period = Vec::new();
    let mut through_inc = vec![0.0f64; nb];
    let mut through_var = vec![0.0f64; nb];
    let mut through_base = vec![0.0f64; nb];
    let mut through_scen = vec![0.0f64; nb];
    let mut through_seed = vec![vec![0.0f64; ns]; nb];
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
            through_base[b] += base.full[pi].block_through[b] / np as f64;
            through_scen[b] += stats[pi].block_through[b] / np as f64;
            through_var[b] += base.full[pi].block_through_sigma[b].powi(2);
            for s in 0..ns {
                through_seed[b][s] += (stats[pi].runs[s].block_through[b] - base.full[pi].runs[s].block_through[b]) / np as f64;
            }
        }
        let raw = h.raw_worst;
        by_period.push(PeriodRes {
            base_through: base.full[pi].ct_vph,
            scen_through: stats[pi].ct_vph,
            cut_pct: pct_change(base.full[pi].ct_vph, stats[pi].ct_vph),
            effect: pairs.period_effect(pi),
            worst: raw,
            block_base: base.full[pi].block_flow[raw],
            block_scen: stats[pi].block_flow[raw],
            block_through_inc: stats[pi].block_through[raw] - base.full[pi].block_through[raw],
            block_effect: Paired::of(&(0..ns).map(|s| stats[pi].runs[s].block_flow[raw] - base.full[pi].runs[s].block_flow[raw]).collect::<Vec<_>>()),
            penalty_block: h.adj_block,
            penalty: h.worst_adj,
            blocks_above: h.n_above,
        });
    }
    let through_sigma: Vec<f64> = through_var.iter().map(|v| v.sqrt() / np.max(1) as f64).collect();
    let mut through = through_harm(&through_inc, &through_sigma);
    if nb > 0 {
        let w = through.worst;
        through.base = through_base[w];
        through.scen = through_scen[w];
        through.effect = Paired::of(&through_seed[w]);
        through.blocks_resolved = through_seed.iter().filter(|v| Paired::of(v).status() == Status::Positive).count();
    }
    let mut bounding = Vec::new();
    for (k, s) in study.bounding.iter().enumerate() {
        let (fb, fs): (f64, f64) = (base.full.iter().map(|x| x.street_flow[k]).sum(), stats.iter().map(|x| x.street_flow[k]).sum());
        let dv = mean(&(0..np).map(|pi| stats[pi].street_speed[k] - base.full[pi].street_speed[k]).collect::<Vec<_>>());
        bounding.push((s.name.clone(), pct_change(fb, fs), dv * MPS_TO_MPH));
    }
    let m = |f: &dyn Fn(&PeriodStat) -> f64, s: &[PeriodStat]| mean(&s.iter().map(f).collect::<Vec<_>>());
    let mut detour_seed = vec![0.0f64; ns];
    let mut detour_vmin_h = 0.0;
    for pi in 0..np {
        for sd in 0..ns {
            detour_seed[sd] += (stats[pi].runs[sd].inside_s - base.full[pi].runs[sd].inside_s) / np as f64;
        }
        detour_vmin_h += (stats[pi].inside_tt_s - base.full[pi].inside_tt_s) / p.minutes.max(1e-9) / np as f64;
    }
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
        effect: pairs.effect(),
        pairs,
        role: "selection",
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
        picture_all: {
            let pi = picture_period(&p.periods);
            Some(Picture::scoped(&p.periods[pi], &base.full[pi].link_flow, &stats[pi].link_flow, &measured_links(study)))
        },
        forced: false,
        access: None,
        origin: Origin::search(),
        prior: false,
        places: places_of(ctx, set),
        block_change: through_inc,
        detour: Paired::of(&detour_seed),
        detour_s: mean(&detour_seed),
        detour_seeds: detour_seed,
        detour_vmin_h,
        closes: set.iter().any(|&i| !super::objectives::closes_nothing(&ctx.cands[i as usize])),
        objectives: Vec::new(),
    }
}

impl Default for Final {
    /// An empty comparison (no runs, no evidence): the base for fixtures and tests.
    fn default() -> Final {
        Final {
            set: Vec::new(),
            reject: None,
            base_vph: 0.0,
            scen_vph: 0.0,
            reduction_pct: 0.0,
            harm: 0.0,
            worst: 0,
            blocks_above: 0,
            through: through_harm(&[], &[]),
            effect: Paired::none(),
            pairs: CtPairs::default(),
            role: "selection",
            by_period: Vec::new(),
            bounding: Vec::new(),
            inside_pct: 0.0,
            ped_pct: 0.0,
            bike_pct: 0.0,
            score: 0.0,
            picture: None,
            picture_all: None,
            forced: false,
            access: None,
            origin: Origin::search(),
            prior: false,
            places: Vec::new(),
            block_change: Vec::new(),
            detour: Paired::none(),
            detour_s: 0.0,
            detour_seeds: Vec::new(),
            detour_vmin_h: 0.0,
            closes: false,
            objectives: Vec::new(),
        }
    }
}

// ---------------------------------------------------------------- choosing the options

#[derive(Clone)]
pub struct Pick {
    pub idx: usize,
    pub why: String,
    /// The objectives this option is the best for.
    pub objectives: Vec<super::objectives::Objective>,
}

/// Whether a package's through-car reduction is established. With at least `MIN_PAIRS` seed pairs the interval of the paired
/// per-seed change must lie below zero; with fewer the evidence is insufficient and only the practical floor `GOAL_NOISE_FLOOR_PCT`
/// (an assumption, not an uncertainty measure) screens it.
pub fn reduces(f: &Final) -> bool {
    f.reduction_pct > GOAL_NOISE_FLOOR_PCT && (f.effect.n < MIN_PAIRS || f.effect.status() == Status::Negative)
}

/// Whether `a` cuts through cars by more than `b` does. The comparison pairs the two packages' runs on the same seeds; `a` beats `b` when
/// the interval of the per-seed gain is above zero and the gain is at least `GOAL_NOISE_FLOOR_PCT` points of the baseline. With fewer than
/// `MIN_PAIRS` pairs, or runs that are not the same pairs, there is no interval and only the practical floor on the means applies.
pub fn beats(a: &Final, b: &Final) -> bool {
    beats_figures(&Figures::of(a), &Figures::of(b))
}

/// `beats` on the figures it reads, so a published file can be judged the same way as a finalist.
pub fn beats_figures(a: &Figures, b: &Figures) -> bool {
    let floor_only = a.reduction_pct - b.reduction_pct > GOAL_NOISE_FLOOR_PCT;
    match option_gain(a.pairs, b.pairs) {
        Some(g) if g.n >= MIN_PAIRS => {
            let base = a.pairs.base_mean();
            let pts = if base > 0.0 { 100.0 * g.mean / base } else { 0.0 };
            g.status() == Status::Positive && pts >= GOAL_NOISE_FLOOR_PCT
        }
        _ => floor_only,
    }
}

/// Choose up to `max` options from the rechecked finalists: no other finalist beats an option on reduction, harm and size; an option
/// that does not beat a simpler one on through cars (paired on seeds, see `beats`) is dropped; the best single and the best overall always
/// stay; the rest are spread from fewest interventions to greatest reduction. Returns the picks (ordered by size, then reduction) and a
/// note per finalist.
pub fn select_options(finals: &[Final], max: usize) -> (Vec<Pick>, Vec<String>) {
    let (picks, notes, _) = select_with_folds(finals, max);
    (picks, notes)
}

/// `select_options` and the near-duplicates it folded into the options it kept (see `similar`).
/// The packages of `pool` (finalist indices) that stay after the filters of the choice: established reductions, the stability rule, domination,
/// simpler packages, the Pareto-consistent listing and near-duplicates. The notes of the packages that drop out are written to `notes`.
fn keep_pool(finals: &[Final], pool: &[usize], notes: &mut Vec<String>, detour: bool) -> (Vec<usize>, Vec<similar::Fold>) {
    let ok: Vec<usize> = pool
        .iter()
        .copied()
        .filter(|&i| {
            if let Some(w) = &finals[i].reject {
                notes[i] = format!("rejected: {w}");
                false
            } else if !reduces(&finals[i]) {
                notes[i] = format!(
                    "through-car change {:+.1}% is not an established reduction ({}; practical floor {:.1}%)",
                    -finals[i].reduction_pct,
                    if finals[i].effect.n < MIN_PAIRS { format!("{} seed pair(s), fewer than {MIN_PAIRS}", finals[i].effect.n) } else { format!("seed interval {}", finals[i].effect.status().as_str()) },
                    GOAL_NOISE_FLOOR_PCT
                );
                false
            } else {
                true
            }
        })
        .collect();
    // Stability: a package no earlier search published is dropped when one that was published is not beaten by it on through cars and
    // is no worse on harm or size, so two runs on near-identical inputs publish the same list.
    let published: Vec<usize> = ok.iter().copied().filter(|&i| finals[i].prior).collect();
    let mut ok = ok;
    ok.retain(|&i| {
        let a = &finals[i];
        if a.prior {
            return true;
        }
        match published.iter().copied().find(|&j| {
            let b = &finals[j];
            !beats(a, b) && b.harm <= a.harm + NOISE_FLOOR_VEH_H && b.set.len() <= a.set.len()
        }) {
            Some(j) => {
                notes[i] = format!("does not beat finalist {}, which an earlier search published, on through cars: kept that one so the list does not churn", j + 1);
                false
            }
            None => true,
        }
    });
    // A package an earlier search published is dominated by a new one only when the new one beats it on through cars (`beats`).
    let dominated = |i: usize| {
        let a = &finals[i];
        ok.iter().copied().find(|&j| {
            let b = &finals[j];
            let at_least = if a.prior && !b.prior { beats(b, a) } else { b.reduction_pct >= a.reduction_pct };
            let ahead = if a.prior && !b.prior { beats(b, a) } else { b.reduction_pct > a.reduction_pct };
            j != i && at_least && b.harm <= a.harm && b.set.len() <= a.set.len() && (!detour || b.detour_s <= a.detour_s) && (ahead || b.harm < a.harm || b.set.len() < a.set.len())
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
            b.set.len() < a.set.len() && !beats(a, b) && a.harm >= b.harm - NOISE_FLOOR_VEH_H && (!detour || a.detour_s >= b.detour_s)
        });
        match simpler {
            Some(j) => notes[i] = format!("does not beat simpler finalist {} on through cars", j + 1),
            None => keep.push(i),
        }
    }
    // Pareto-consistent listing: a larger package is listed only if it cuts through cars by more than every smaller one that is listed.
    let mut by_size = keep.clone();
    by_size.sort_by(|&a, &b| finals[a].set.len().cmp(&finals[b].set.len()).then(finals[b].reduction_pct.partial_cmp(&finals[a].reduction_pct).unwrap_or(std::cmp::Ordering::Equal)).then(a.cmp(&b)));
    let mut consistent: Vec<usize> = Vec::new();
    for &i in &by_size {
        match consistent.iter().copied().find(|&j| finals[j].set.len() < finals[i].set.len() && finals[j].reduction_pct >= finals[i].reduction_pct && (!detour || finals[j].detour_s <= finals[i].detour_s)) {
            Some(j) => notes[i] = format!("not listed: smaller finalist {} cuts through cars at least as much", j + 1),
            None => consistent.push(i),
        }
    }
    let keep: Vec<usize> = keep.into_iter().filter(|i| consistent.contains(i)).collect();
    let (keep, folds) = similar::dedupe(finals, &keep);
    for f in &folds {
        notes[f.from] = format!("folded into finalist {}: {}", f.into + 1, f.why.phrase());
    }
    (keep, folds)
}

pub fn select_with_folds(finals: &[Final], max: usize) -> (Vec<Pick>, Vec<String>, Vec<similar::Fold>) {
    let mut notes: Vec<String> = vec![String::new(); finals.len()];
    let all: Vec<usize> = (0..finals.len()).collect();
    let (keep, folds) = keep_pool(finals, &all, &mut notes, false);
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
    picks.sort_by(|a, b| similar::order_options(&finals[a.0], &finals[b.0]).then(a.0.cmp(&b.0)));
    for (n, (i, why)) in picks.iter().enumerate() {
        notes[*i] = format!("chosen as option {}: {why}", n + 1);
    }
    (picks.into_iter().map(|(idx, why)| Pick { idx, why, objectives: Vec::new() }).collect(), notes, folds)
}

/// Whether `a` has a resolvably lower residents' detour than `b`: with at least `MIN_PAIRS` shared seeds, the interval of the per-seed
/// difference lies above zero; otherwise the mean detours differ by more than `DETOUR_TIE_S` seconds per trip (ASSUMPTION).
pub fn detour_lower(a: &Final, b: &Final) -> bool {
    let n = a.detour_seeds.len();
    if n >= MIN_PAIRS && n == b.detour_seeds.len() && a.pairs.seeds == b.pairs.seeds {
        return diffs(&a.detour_seeds, &b.detour_seeds).map_or(false, |d| Paired::of(&d).status() == Status::Positive);
    }
    b.detour_s - a.detour_s > DETOUR_TIE_S
}

/// The winner of `obj` among the packages of `keep` it can win. Most removed, no closures and fewest changes: highest score, then fewer
/// changes, then the earlier finalist. Least detour: among the packages that remove at least `DETOUR_REDUCTION_FLOOR` of the most removed
/// in `keep`, the smallest residents' detour; a package whose detour the paired comparison cannot tell from that one's competes on
/// through cars removed, then fewer changes, then the earlier finalist.
pub fn objective_winner(finals: &[Final], obj: Objective, keep: &[usize]) -> Option<usize> {
    let by_removed = |a: usize, b: usize| finals[a].reduction_pct.partial_cmp(&finals[b].reduction_pct).unwrap_or(std::cmp::Ordering::Equal).then(finals[b].set.len().cmp(&finals[a].set.len())).then(b.cmp(&a));
    if obj == Objective::LeastDetour {
        let best = keep.iter().map(|&i| finals[i].reduction_pct).fold(0.0, f64::max);
        let above: Vec<usize> = keep.iter().copied().filter(|&i| finals[i].reduction_pct >= DETOUR_REDUCTION_FLOOR * best).collect();
        let lowest = above.iter().copied().min_by(|&a, &b| finals[a].detour_s.partial_cmp(&finals[b].detour_s).unwrap_or(std::cmp::Ordering::Equal).then(by_removed(b, a)))?;
        return above.iter().copied().filter(|&c| c == lowest || !detour_lower(&finals[lowest], &finals[c])).max_by(|&a, &b| by_removed(a, b));
    }
    keep.iter().copied().max_by(|&a, &b| finals[a].score.partial_cmp(&finals[b].score).unwrap_or(std::cmp::Ordering::Equal).then(finals[b].set.len().cmp(&finals[a].set.len())).then(b.cmp(&a)))
}

/// The largest rise in all cars on one block over the periods (cars an hour) and the half width of that block's paired interval, when it has one.
pub fn largest_rise(f: &Final) -> (f64, Option<f64>) {
    f.by_period
        .iter()
        .map(|r| (r.block_scen - r.block_base, r.block_effect.half))
        .max_by(|a, b| a.0.partial_cmp(&b.0).unwrap_or(std::cmp::Ordering::Equal))
        .unwrap_or((f.harm, None))
}

/// What the displacement rule reads from one option: through cars removed (percent), the largest all-car rise on one block (cars an hour)
/// with the half width of its paired interval when it has one, and the per-seed through-car runs behind the paired comparison.
#[derive(Clone, Copy, Debug)]
pub struct Figures<'a> {
    pub reduction_pct: f64,
    pub rise: f64,
    pub rise_half: Option<f64>,
    pub pairs: &'a CtPairs,
}

impl<'a> Figures<'a> {
    pub fn of(f: &'a Final) -> Figures<'a> {
        let (rise, rise_half) = largest_rise(f);
        Figures { reduction_pct: f.reduction_pct, rise, rise_half, pairs: &f.pairs }
    }
}

/// Basis of a displacement record: the seeds that chose the option (`search`) or the fresh seeds that confirmed it (`confirmation`).
pub const BASIS_SEARCH: &str = "search";
pub const BASIS_CONFIRMATION: &str = "confirmation";

/// `1-3` for consecutive seeds, otherwise the list.
pub fn seed_span(seeds: &[u64]) -> String {
    match (seeds.first(), seeds.last()) {
        (Some(a), Some(b)) if seeds.len() > 2 && seeds.windows(2).all(|w| w[1] == w[0] + 1) => format!("{a}-{b}"),
        _ => seeds.iter().map(|s| s.to_string()).collect::<Vec<_>>().join(", "),
    }
}

/// `search seeds 1-3` or `confirmation seeds 101-110`.
pub fn basis_label(basis: &str, seeds: &[u64]) -> String {
    format!("{} seeds {}", if basis == BASIS_CONFIRMATION { "confirmation" } else { "search" }, seed_span(seeds))
}

/// An option that was not published because another one removes as many through cars and piles fewer cars onto one block.
#[derive(Clone, Debug, PartialEq)]
pub struct Displaced {
    pub from: usize,
    pub by: usize,
    pub removed: f64,
    pub by_removed: f64,
    pub rise: f64,
    pub by_rise: f64,
    /// How much smaller the other's rise must be to count, and where that came from: `paired intervals` (both rises have one) or `floor`.
    pub noise: f64,
    pub noise_basis: &'static str,
    /// `at least as many` through cars removed, or `not distinguishable` on the paired comparison.
    pub removal: &'static str,
    /// Which runs the figures come from: `BASIS_SEARCH` or `BASIS_CONFIRMATION`, and their seeds (empty when not stated).
    pub basis: &'static str,
    pub seeds: Vec<u64>,
}

impl Displaced {
    pub fn on(mut self, basis: &'static str, seeds: &[u64]) -> Displaced {
        self.basis = basis;
        self.seeds = seeds.to_vec();
        self
    }

    pub fn phrase(&self) -> String {
        let core = format!(
            "removes {:.1}% of through cars against {:.1}% ({}), and its largest all-car rise on one block is {:.0} cars an hour against {:.0}, a difference of more than {:.0} ({})",
            self.by_removed, self.removed, self.removal, self.by_rise, self.rise, self.noise, self.noise_basis
        );
        if self.seeds.is_empty() {
            core
        } else {
            format!("{core}, figures from the {}", basis_label(self.basis, &self.seeds))
        }
    }
}

/// Whether finalist `by` makes finalist `from` unnecessary as an untagged option: `by` removes at least as many through cars or is not
/// distinguishable from `from` on the paired comparison (`beats`), and its largest all-car rise on one block is smaller by more than the
/// noise of the two rises (the paired intervals' half widths combined; `NOISE_FLOOR_VEH_H` when either has none, an ASSUMPTION).
pub fn displaces(finals: &[Final], from: usize, by: usize) -> Option<Displaced> {
    displaces_figures(&Figures::of(&finals[from]), &Figures::of(&finals[by]), from, by)
}

/// `displaces` on the figures it reads; `from` and `by` are the positions the record carries.
pub fn displaces_figures(a: &Figures, b: &Figures, from: usize, by: usize) -> Option<Displaced> {
    let removal = if b.reduction_pct >= a.reduction_pct {
        "at least as many"
    } else if !beats_figures(a, b) {
        "not distinguishable"
    } else {
        return None;
    };
    let (noise, noise_basis) = match (a.rise_half, b.rise_half) {
        (Some(x), Some(y)) => ((x * x + y * y).sqrt(), "paired intervals"),
        _ => (NOISE_FLOOR_VEH_H, "floor"),
    };
    (a.rise - b.rise > noise).then_some(Displaced {
        from,
        by,
        removed: a.reduction_pct,
        by_removed: b.reduction_pct,
        rise: a.rise,
        by_rise: b.rise,
        noise,
        noise_basis,
        removal,
        basis: BASIS_SEARCH,
        seeds: Vec::new(),
    })
}

/// The options the displacement rule drops from a list of published options, one at a time: the worst displaced option (the largest rise
/// among those a listed option displaces, taken against the displacing option with the smallest rise) goes, and the rest are judged again.
/// `protected` marks goal winners, which are never dropped. `from` and `by` index `figs`. The list is not refilled.
pub fn displace_listed(figs: &[Figures], protected: &[bool], basis: &'static str, seeds: &[u64]) -> Vec<Displaced> {
    let mut gone = vec![false; figs.len()];
    let mut out: Vec<Displaced> = Vec::new();
    loop {
        let listed: Vec<usize> = (0..figs.len()).filter(|&i| !gone[i]).collect();
        let worst = listed
            .iter()
            .filter(|&&i| !protected.get(i).copied().unwrap_or(false))
            .filter_map(|&i| listed.iter().filter(|&&k| k != i).filter_map(|&k| displaces_figures(&figs[i], &figs[k], i, k)).min_by(|a, b| a.by_rise.partial_cmp(&b.by_rise).unwrap_or(std::cmp::Ordering::Equal)))
            .max_by(|a, b| a.rise.partial_cmp(&b.rise).unwrap_or(std::cmp::Ordering::Equal));
        match worst {
            Some(d) => {
                gone[d.from] = true;
                out.push(d.on(basis, seeds));
            }
            None => break out,
        }
    }
}

/// Choose the published options for several objectives. Each objective picks its winner from the packages it may win, after the same filters
/// and near-duplicate folding as the main choice, applied inside that objective's pool, so a package that is better on the main score but
/// closes a street cannot hide the best package without closures. A package that wins several objectives is one option with all its tags.
/// The rest of the list, up to `max`, is the best remaining by through cars removed that is not similar to an option already chosen and that
/// no other published option displaces (`displaces`); goal winners are never dropped. Returns the picks, a note per finalist, the folds and
/// the options dropped for displacement.
pub fn select_by_objectives(finals: &[Final], p: &Params, max: usize) -> (Vec<Pick>, Vec<String>, Vec<similar::Fold>, Vec<Displaced>) {
    let all: Vec<usize> = (0..finals.len()).collect();
    let mut notes: Vec<String> = vec![String::new(); finals.len()];
    let (keep_all, folds_all) = keep_pool(finals, &all, &mut notes, false);
    let mut folds: Vec<similar::Fold> = folds_all;
    let mut chosen: Vec<(usize, Vec<Objective>)> = Vec::new();
    let mut order: Vec<Objective> = p.objectives.clone();
    if !order.contains(&Objective::MostRemoved) {
        order.insert(0, Objective::MostRemoved);
    }
    for obj in order {
        let (keep, fo) = if obj == Objective::MostRemoved {
            (keep_all.clone(), Vec::new())
        } else {
            let pool: Vec<usize> = all.iter().copied().filter(|&i| eligible(obj, &finals[i])).collect();
            keep_pool(finals, &pool, &mut vec![String::new(); finals.len()], obj == Objective::LeastDetour)
        };
        let Some(w) = objective_winner(finals, obj, &keep) else { continue };
        folds.extend(fo);
        match chosen.iter_mut().find(|c| c.0 == w) {
            Some(c) => c.1.push(obj),
            None => chosen.push((w, vec![obj])),
        }
    }
    chosen.truncate(max.max(1));
    let by_score = |a: &usize, b: &usize| finals[*b].score.partial_cmp(&finals[*a].score).unwrap_or(std::cmp::Ordering::Equal).then(a.cmp(b));
    let mut rest: Vec<usize> = keep_all.iter().copied().filter(|i| !chosen.iter().any(|c| c.0 == *i)).collect();
    rest.sort_by(by_score);
    let mut dropped: Vec<Displaced> = Vec::new();
    let extra: Vec<usize> = loop {
        let mut extra: Vec<usize> = Vec::new();
        for &i in rest.iter().filter(|i| !dropped.iter().any(|d| d.from == **i)) {
            if chosen.len() + extra.len() >= max {
                break;
            }
            if chosen.iter().map(|c| c.0).chain(extra.iter().copied()).any(|k| similar::similar(&finals[i], &finals[k]).is_some()) {
                continue;
            }
            extra.push(i);
        }
        let listed: Vec<usize> = chosen.iter().map(|c| c.0).chain(extra.iter().copied()).collect();
        let worst = extra
            .iter()
            .filter_map(|&i| listed.iter().filter(|&&k| k != i).filter_map(|&k| displaces(finals, i, k)).min_by(|a, b| a.by_rise.partial_cmp(&b.by_rise).unwrap_or(std::cmp::Ordering::Equal)))
            .max_by(|a, b| a.rise.partial_cmp(&b.rise).unwrap_or(std::cmp::Ordering::Equal));
        match worst {
            Some(d) => dropped.push(d.on(BASIS_SEARCH, &p.seeds)),
            None => break extra,
        }
    };
    let mut picks: Vec<Pick> = chosen
        .into_iter()
        .map(|(idx, objs)| Pick { idx, why: format!("best for {}", objs.iter().map(|o| o.label()).collect::<Vec<_>>().join(" and ")), objectives: objs })
        .chain(extra.into_iter().map(|idx| Pick { idx, why: "next best by through cars removed".into(), objectives: Vec::new() }))
        .collect();
    picks.sort_by(|a, b| similar::order_options(&finals[a.idx], &finals[b.idx]).then(a.idx.cmp(&b.idx)));
    let mut seen_from: Vec<usize> = Vec::new();
    folds.retain(|f| picks.iter().any(|pk| pk.idx == f.into) && !picks.iter().any(|pk| pk.idx == f.from) && {
        let fresh = !seen_from.contains(&f.from);
        seen_from.push(f.from);
        fresh
    });
    for f in &folds {
        notes[f.from] = format!("folded into finalist {}: {}", f.into + 1, f.why.phrase());
    }
    for d in &dropped {
        notes[d.from] = format!("not published: finalist {} {}", d.by + 1, d.phrase());
    }
    for (n, pk) in picks.iter().enumerate() {
        notes[pk.idx] = format!("chosen as option {}: {}", n + 1, pk.why);
    }
    (picks, notes, folds, dropped)
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
        "slow_street" => ("Slow Street", "Slow Streets"),
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

/// "95% interval -31 to -12 cars an hour over 10 seeds", or why there is none (too few seeds). Cars an hour, signed.
/// The interval of the residents' detour, in seconds per trip.
pub fn detour_phrase(e: &Paired) -> String {
    match e.interval() {
        _ if e.n < MIN_PAIRS => format!("{} seed{} is not enough for an interval", e.n, if e.n == 1 { "" } else { "s" }),
        Some((lo, hi)) => format!("{:.0}% interval {:+.1} to {:+.1} s over {} seeds", 100.0 * LEVEL, lo, hi, e.n),
        None => "no interval".to_string(),
    }
}

pub fn interval_phrase(e: &Paired) -> String {
    match e.interval() {
        _ if e.n < MIN_PAIRS => format!("{} seed{} is not enough for an interval; at least {MIN_PAIRS} are needed", e.n, if e.n == 1 { "" } else { "s" }),
        Some((lo, hi)) => format!("{:.0}% interval {:+.0} to {:+.0} cars an hour over {} seeds", 100.0 * LEVEL, lo, hi, e.n),
        None => "no interval".to_string(),
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
    let seeds = f.effect.n;
    let s2 = format!(
        "In the simulation it {} through traffic on the area's side streets by {:.0}%, from {:.0} to {:.0} through cars an hour (mean of {} seed{} and of the periods searched; {}).",
        if f.reduction_pct >= 0.0 { "cuts" } else { "raises" },
        f.reduction_pct.abs(),
        f.base_vph,
        f.scen_vph,
        seeds,
        if seeds == 1 { "" } else { "s" },
        interval_phrase(&f.effect)
    );
    let t = &f.through;
    let label = |b: usize| study.harm_blocks.get(b).map(|&h| study.idx.blocks[h].label.clone()).unwrap_or_default();
    let s3 = if study.harm_blocks.is_empty() {
        String::new()
    } else if t.increase.round() > 0.0 {
        let status = match t.effect.status() {
            Status::Positive => format!("resolved from seed variation: {}", interval_phrase(&t.effect)),
            Status::Unresolved => format!("not resolved from seed variation: {}", interval_phrase(&t.effect)),
            _ => interval_phrase(&t.effect),
        };
        let others = if t.effect.n >= MIN_PAIRS && t.blocks_resolved > 1 { format!(" {} blocks in all have an increase resolved from seed variation.", t.blocks_resolved) } else { String::new() };
        format!("The side-street block with the largest increase in through traffic is {}, about {:.0} more through cars an hour on average ({}).{}", label(t.worst), t.increase, status, others)
    } else {
        format!("No side-street block gains through cars on average; the largest change is {:+.0} through cars an hour on {}.", t.increase, label(t.worst))
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
    /// The chosen options' final comparisons in pick order, from the confirmation runs when there were any, else the finalists' own.
    pub shown: Vec<Final>,
    pub base: Baseline,
    /// Reference packages (config order) rechecked like the finalists.
    pub ref_finals: Vec<Final>,
    pub known: KnownSummary,
    /// The options this run published, as seeds-file entries for the caller to record.
    pub published: Vec<seeds::Entry>,
}

/// A package folded into a published option: shown on that option's card as a tweak, with its own figures from the runs that chose it.
#[derive(Clone)]
pub struct Variant {
    pub f: Final,
    pub link: String,
    pub differs: Vec<String>,
    pub why: similar::Why,
}

/// What the choice of options folded away: the variants of each published option (in `shown` order) and a machine-readable record of every
/// fold, and the options dropped for displacement.
#[derive(Clone, Default)]
pub struct SimilarOut {
    pub variants: Vec<Vec<Variant>>,
    pub folded: Vec<Value>,
    pub dropped: Vec<Value>,
}

/// A machine-readable record of every option dropped for displacement; `from` and `by` index `finals`.
pub fn displaced_out(ctx: &Ctx, finals: &[Final], dropped: &[Displaced]) -> Vec<Value> {
    let link = |f: &Final| ctx.study.encode(&ctx.ivs(&f.set), Some(&ctx.p.periods[0]));
    dropped.iter().map(|d| dropped_json(d, &link(&finals[d.from]), &link(&finals[d.by]))).collect()
}

pub fn dropped_json(d: &Displaced, from: &str, by: &str) -> Value {
    json!({
        "from": from, "by": by, "reason": d.phrase(), "removal": d.removal,
        "basis": d.basis, "seeds": d.seeds,
        "throughCarsRemovedPct": r1(d.removed), "byThroughCarsRemovedPct": r1(d.by_removed),
        "largestRiseVehPerHour": r1(d.rise), "byLargestRiseVehPerHour": r1(d.by_rise),
        "noiseVehPerHour": r1(d.noise), "noiseBasis": d.noise_basis,
    })
}

pub fn similar_out(ctx: &Ctx, finals: &[Final], picks: &[Pick], folds: &[similar::Fold]) -> SimilarOut {
    let link = |f: &Final| ctx.study.encode(&ctx.ivs(&f.set), Some(&ctx.p.periods[0]));
    let variants = picks
        .iter()
        .map(|pk| {
            folds
                .iter()
                .filter(|f| f.into == pk.idx)
                .map(|f| Variant { f: finals[f.from].clone(), link: link(&finals[f.from]), differs: similar::differences(ctx, &finals[pk.idx].set, &finals[f.from].set), why: f.why.clone() })
                .collect()
        })
        .collect();
    let folded = folds
        .iter()
        .map(|f| json!({"from": link(&finals[f.from]), "into": link(&finals[f.into]), "why": f.why.key(), "reason": f.why.phrase(), "intoPublished": picks.iter().any(|pk| pk.idx == f.into)}))
        .collect();
    SimilarOut { variants, folded, dropped: Vec::new() }
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
    if p.bypass_locations > 0 {
        let sup = super::bypass::supplement(study, &p.periods[0], &cands, &p.profile, p.bypass_locations);
        eprintln!("bypass supplement (experimental): {} candidate(s) at up to {} location(s)", sup.added.len(), p.bypass_locations);
        cands.extend(sup.added.into_iter().map(|s| s.cand));
    }
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
    let mut state = beam_search(&ctx, &families);
    // Each other objective grows its own beam over the shared screening cache: singles and packages already screened are reused.
    let others: Vec<Objective> = p.objectives.iter().copied().filter(|o| *o != Objective::MostRemoved).collect();
    for &obj in &others {
        let lim = BeamLimit::for_objective(obj, p, &cands);
        let before = state.used;
        eprintln!("beam for {}", obj.label());
        beam_search_in(&ctx, &families, &lim, &mut state);
        eprintln!("beam for {}: {} new screening run(s)", obj.label(), state.used - before);
    }
    if !p.supplement.is_empty() {
        let pairs = if p.supplement.contains(&super::supplement::Move::Coordinated) { super::bypass::coordinated_pairs(study, &p.periods[0], &cands) } else { Vec::new() };
        let allowance = super::bench::allowance(state.used);
        let rec = super::supplement::run(&ctx, &mut state, &p.supplement, allowance, &pairs, &all_known);
        eprintln!("supplementary moves (experimental): {} screening run(s), stopped on {}", rec["charged"], rec["stop"]);
    }
    let fin_idx = pick_finalists(&state.evals, p.finalists, &all_known);
    let mut fin_idx = fin_idx;
    for &obj in &others {
        let lim = BeamLimit::for_objective(obj, p, &cands);
        for i in pick_finalists_for(&ctx, &state.evals, (p.finalists / 3).max(3), &lim) {
            if !fin_idx.iter().any(|&j| state.evals[j].set == state.evals[i].set) {
                fin_idx.push(i);
            }
        }
    }
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
    let (picks, mut notes, folds, dropped) = select_by_objectives(&finals, p, p.options);
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
                "slow_street" => "slow_street",
                "control" => "control",
                _ => "signal_timing",
            };
            set.push(all.len() as u16);
            all.push(Cand { label: describe(&study.net, &study.topo, &study.idx, &iv), key: format!("ref:{}:{}", r.id, all.len()), iv, kind, block: None, nodes: vec![], places: vec![], loc_score: 0.0 });
        }
        ref_sets.push(set);
    }
    // The shortlist is frozen here. With confirmation seeds, the chosen options and the references are rerun on seeds that took no part
    // in screening, rechecking or choosing, and those runs are what is published; otherwise the published estimates come from the runs that
    // chose them and are labeled exploratory.
    let (pc, base_c);
    let (est_p, est_base): (&Params, &Baseline) = if p.confirm_seeds.is_empty() {
        (p, &base)
    } else {
        pc = Params { seeds: p.confirm_seeds.clone(), ..p.clone() };
        eprintln!("confirming {} chosen option(s) and {} reference(s) on {} unused seed(s) per period", picks.len(), ref_sets.len(), pc.seeds.len());
        base_c = run_baseline_full(study, &pc);
        (&pc, &base_c)
    };
    let ctx_all = Ctx { study, p: est_p, cands: &all, base: est_base };
    let shown: Vec<Final> = if p.confirm_seeds.is_empty() {
        picks.iter().map(|pk| finals[pk.idx].clone()).collect()
    } else {
        let mut cf = recheck(&ctx_all, &picks.iter().map(|pk| finals[pk.idx].set.clone()).collect::<Vec<_>>());
        for (f, pk) in cf.iter_mut().zip(&picks) {
            let o = &finals[pk.idx];
            f.origin = o.origin.clone();
            f.prior = o.prior;
            f.forced = o.forced;
            f.role = "confirmation";
        }
        cf
    };
    let mut shown = shown;
    for (f, pk) in shown.iter_mut().zip(&picks) {
        f.objectives = pk.objectives.clone();
    }
    // The published order is by the figures that are published: with confirmation seeds, those are the confirmation runs.
    let (picks, shown) = {
        let mut perm: Vec<usize> = (0..picks.len()).collect();
        perm.sort_by(|&a, &b| similar::order_options(&shown[a], &shown[b]).then(a.cmp(&b)));
        let mut pk: Vec<Option<Pick>> = picks.into_iter().map(Some).collect();
        let mut sh: Vec<Option<Final>> = shown.into_iter().map(Some).collect();
        let picks: Vec<Pick> = perm.iter().map(|&i| pk[i].take().expect("pick")).collect();
        let shown: Vec<Final> = perm.iter().map(|&i| sh[i].take().expect("shown")).collect();
        (picks, shown)
    };
    // The rule runs again on the figures that are published. An option it drops is removed, and the list is not refilled.
    let (shown_all, picks_all) = (shown.clone(), picks.clone());
    let after = if p.confirm_seeds.is_empty() {
        Vec::new()
    } else {
        let figs: Vec<Figures> = shown.iter().map(Figures::of).collect();
        let protected: Vec<bool> = shown.iter().map(|f| !f.objectives.is_empty()).collect();
        displace_listed(&figs, &protected, BASIS_CONFIRMATION, &p.confirm_seeds)
    };
    let kept = |i: usize| !after.iter().any(|d| d.from == i);
    let picks: Vec<Pick> = picks.into_iter().enumerate().filter(|(i, _)| kept(*i)).map(|(_, pk)| pk).collect();
    let shown: Vec<Final> = shown.into_iter().enumerate().filter(|(i, _)| kept(*i)).map(|(_, f)| f).collect();
    for (n, pk) in picks.iter().enumerate() {
        notes[pk.idx] = format!("chosen as option {}: {}", n + 1, pk.why);
    }
    for d in &after {
        notes[picks_all[d.from].idx] = format!("not published after confirmation, displaced by \"{}\": {}", title(&cands, &shown_all[d.by].set), d.phrase());
    }
    let mut sim = similar_out(&ctx_all, &finals, &picks, &folds);
    sim.dropped = displaced_out(&ctx_all, &finals, &dropped);
    sim.dropped.extend(displaced_out(&ctx_all, &shown_all, &after));
    let mut ref_finals = if ref_sets.is_empty() { Vec::new() } else { eprintln!("rechecking {} reference package(s)", ref_sets.len()); recheck(&ctx_all, &ref_sets) };
    for f in ref_finals.iter_mut() {
        f.access = check_access(study, &ctx_all.ivs(&f.set)).err();
        f.role = "reference";
    }
    eprintln!("chose {} option(s); total {:.0}s", picks.len(), t0.elapsed().as_secs_f64());
    let json = build_json(study, p, &all, est_base, &shown, &ref_finals, &known, &Estimation { seeds: est_p.seeds.clone(), confirmed: !p.confirm_seeds.is_empty(), shortlist: shown_all.iter().map(|f| study.encode(&ctx.ivs(&f.set), Some(&p.periods[0]))).collect() }, &sim);
    let markdown = build_markdown(study, p, &ctx_all, &state, &finals, &picks, &notes, &t0, &ref_finals, &known, &shown, &sim);
    let today = util::today_utc();
    let published: Vec<seeds::Entry> = picks
        .iter()
        .zip(&shown)
        .map(|(_, f)| seeds::Entry {
            link: study.encode(&ctx.ivs(&f.set), Some(&p.periods[0])),
            source: seeds::SOURCE_SEARCH.into(),
            note: String::new(),
            added: today.clone(),
            last_published: today.clone(),
            group: p.profile.id.clone(),
            size: f.set.len(),
            change_pct: Some(r1(-f.reduction_pct)),
            score: Some(r1(f.score)),
        })
        .collect();
    Outcome { json, markdown, cands, state, finals, picks, shown, base, ref_finals, known, published }
}

/// Candidate sets for packages of interventions: each intervention matched to a candidate or added as one. A package the profile does not allow,
/// that cannot be combined (two interventions on one place), that has more interventions than the search depth (the largest package an option may be), or that fails the access check gets `Err` with the reason (and a line on stderr).
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
        if pkg.len() > p.depth {
            fail(format!("{} interventions, more than the search depth of {}", pkg.len(), p.depth));
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

fn r1(x: f64) -> f64 {
    (x * 10.0).round() / 10.0
}

/// Which seeds the published estimates come from, and whether they were kept apart from the runs that chose the options.
pub struct Estimation {
    pub seeds: Vec<u64>,
    pub confirmed: bool,
    /// The packages that were confirmed or estimated, in published order, before the displacement rule ran on the confirmed figures.
    pub shortlist: Vec<String>,
}

fn variant_json(v: &Variant) -> Value {
    let f = &v.f;
    json!({
        "link": v.link,
        "differs": v.differs,
        "why": v.why.key(),
        "origin": f.origin.json(),
        "cutThrough": {
            "baselineVehPerHour": r1(f.base_vph), "scenarioVehPerHour": r1(f.scen_vph), "changePct": r1(-f.reduction_pct),
            "role": f.role, "seeds": f.pairs.seeds,
        },
    })
}

fn effect_json(e: &Paired) -> Value {
    e.to_json("increase", "decrease")
}

/// The shared `computed` block fields that say what made the figures (design D1 and D2 of `proposal-evidence-integrity`).
fn provenance_json(p: &Params, est: &Estimation, shortlist: &[String]) -> Value {
    let mut v = provenance_core(p, est, shortlist);
    if p.bypass_locations > 0 || !p.supplement.is_empty() {
        v["settings"]["searchExtensions"] = json!({"experimental": true, "bypassLocations": p.bypass_locations, "supplement": p.supplement.iter().map(|m| m.id()).collect::<Vec<_>>(), "allowanceShare": super::bench::ALLOWANCE_SHARE});
    }
    v
}

fn provenance_core(p: &Params, est: &Estimation, shortlist: &[String]) -> Value {
    json!({
        "simulator": crate::FINGERPRINT,
        "reportMethod": REPORT_METHOD,
        "sourceRevision": p.source_revision,
        "settings": {
            "beam": p.beam, "depth": p.depth, "candidates": p.candidates, "expand": p.expand, "finalists": p.finalists, "options": p.options,
            "harmWeight": p.harm_weight, "budgetEvals": p.budget_evals, "profile": p.profile.id,
            "noiseSigmas": NOISE_SIGMAS, "noiseFloorVehPerHour": NOISE_FLOOR_VEH_H, "goalFloorPct": GOAL_NOISE_FLOOR_PCT,
        },
        "estimation": {
            "method": "Student t interval on per-seed differences, scenario minus baseline on the same period and seed",
            "level": LEVEL,
            "minPairs": MIN_PAIRS,
            "aggregation": "Equal-weight mean of the periods within each seed, then paired by seed. Percent changes divide by the baseline mean.",
            "scope": "Seed variability with the network, demand and model fixed. It does not cover calibration error, demand error or day-to-day variation in real traffic.",
            "maximum": "The block with the largest raw increase is chosen after looking at all blocks, so its interval is not adjusted for that choice.",
            "practicalFloors": "The noise band, its floor and the reduction floor are assumed dead bands for screening. They are not uncertainty intervals.",
            "selection": {
                "estimates": if est.confirmed { "confirmation" } else { "exploratory" },
                "discoverySeeds": p.seeds,
                "confirmationSeeds": if est.confirmed { json!(est.seeds) } else { json!([]) },
                "shortlist": shortlist,
            },
        },
    })
}

/// Option `k + 1` against option `k + 2` on the same seeds: how many more points of through cars it cuts.
pub fn comparison_json(k: usize, gain: Option<Paired>, base_mean: f64) -> Value {
    match gain {
        Some(g) if base_mean > 0.0 => json!({
            "option": format!("p{}", k + 1), "against": format!("p{}", k + 2),
            "extraCutVehPerHour": g.to_json("better", "worse"),
            "extraCutPoints": g.scaled(100.0 / base_mean).to_json("better", "worse"),
        }),
        _ => json!({"option": format!("p{}", k + 1), "against": format!("p{}", k + 2), "extraCutVehPerHour": {"n": 0, "status": "insufficient"}}),
    }
}

/// The report line for `comparison_json`.
pub fn comparison_line(k: usize, gain: Option<Paired>, base_mean: f64) -> String {
    let c = match gain {
        Some(g) if base_mean > 0.0 => {
            let pts = g.scaled(100.0 / base_mean);
            match (g.status(), pts.interval()) {
                (Status::Positive, Some((lo, hi))) => format!("cuts through cars by {:.1} more points (interval {:.1} to {:.1} over {} seeds)", pts.mean, lo, hi, pts.n),
                (Status::Negative, Some((lo, hi))) => format!("cuts through cars by {:.1} fewer points (interval {:.1} to {:.1} over {} seeds)", -pts.mean, -hi, -lo, pts.n),
                (Status::Unresolved, Some((lo, hi))) => format!("is not resolved from option {}: {:+.1} points (interval {:.1} to {:.1} over {} seeds)", k + 2, pts.mean, lo, hi, pts.n),
                _ => format!("has insufficient evidence against option {}: {} seed pair(s), at least {MIN_PAIRS} needed", k + 2, g.n),
            }
        }
        _ => format!("cannot be compared with option {}: the runs are not the same seed pairs", k + 2),
    };
    format!("- Option {} {c} than option {}, paired on the same seeds.", k + 1, k + 2)
}

/// The report's explanation of the displacement rule.
pub fn displacement_intro() -> String {
    format!("An option that wins no goal is not published when another published option removes at least as many through cars, or cannot be told from it on the paired comparison, and piles clearly fewer cars onto its worst block (floor when a rise has no interval: {} cars an hour, an assumption). The rule runs twice: on the search seeds when the options are chosen, and again on the confirmation seeds, whose figures are the published ones. Each line says which seeds its figures come from.", NOISE_FLOOR_VEH_H)
}

/// The report line for one dropped record.
pub fn dropped_line(d: &Value) -> String {
    format!("- `{}` dropped for `{}`: {}.", d["from"].as_str().unwrap_or(""), d["by"].as_str().unwrap_or(""), d["reason"].as_str().unwrap_or(""))
}

#[allow(clippy::too_many_arguments)]
pub fn build_json(study: &Study, p: &Params, cands: &[Cand], base: &Baseline, shown: &[Final], ref_finals: &[Final], known: &KnownSummary, est: &Estimation, sim: &SimilarOut) -> Value {
    let block_label = |b: usize| study.idx.blocks[study.harm_blocks[b]].label.clone();
    let opt_label = |b: Option<usize>| b.map(block_label).map(Value::from).unwrap_or(Value::Null);
    let entry = |id: String, title: String, f: &Final, kind: &str, note: Option<&str>| -> Value {
        let ivs: Vec<Intervention> = f.set.iter().map(|&i| cands[i as usize].iv.clone()).collect();
        let by_period: serde_json::Map<String, Value> = p
            .periods
            .iter()
            .zip(&f.by_period)
            .map(|(name, r)| {
                (
                    name.clone(),
                    json!({
                        "cutThrough": {"baselineVehPerHour": r1(r.base_through), "scenarioVehPerHour": r1(r.scen_through), "changePct": r1(r.cut_pct), "effect": effect_json(&r.effect)},
                        "allTraffic": {
                            "largestIncrease": {
                                "block": block_label(r.worst),
                                "baselineVehPerHour": r1(r.block_base),
                                "scenarioVehPerHour": r1(r.block_scen),
                                "increaseVehPerHour": r1(r.block_scen - r.block_base),
                                "throughIncreaseVehPerHour": r1(r.block_through_inc),
                                "effect": effect_json(&r.block_effect),
                            },
                            "adjustedPenalty": {"block": opt_label(r.penalty_block), "penaltyVehPerHour": r1(r.penalty)},
                            "blocksAboveBand": r.blocks_above,
                        },
                    }),
                )
            })
            .collect();
        let t = &f.through;
        let per = |sel: &dyn Fn(&CtPairs) -> &Vec<Vec<f64>>| -> serde_json::Map<String, Value> { p.periods.iter().zip(sel(&f.pairs)).map(|(n, v)| (n.clone(), json!(v.iter().map(|x| r1(*x)).collect::<Vec<_>>()))).collect() };
        let base_mean = f.pairs.base_mean();
        let mut v = json!({
            "id": id,
            "kind": kind,
            "origin": f.origin.json(),
            "title": title,
            "summary": summary(study, cands, f),
            "link": study.encode(&ivs, Some(&p.periods[0])),
            "interventions": f.set.iter().map(|&i| json!({"type": cands[i as usize].iv.ty, "label": cands[i as usize].label})).collect::<Vec<_>>(),
            "cutThrough": {
                "baselineVehPerHour": r1(f.base_vph), "scenarioVehPerHour": r1(f.scen_vph), "changePct": r1(-f.reduction_pct),
                "effect": effect_json(&f.effect),
                "changePctEffect": if base_mean > 0.0 { effect_json(&f.effect.scaled(100.0 / base_mean)) } else { Value::Null },
            },
            "harm": {"through": {
                "largestIncrease": {
                    "block": block_label(t.worst), "baselineVehPerHour": r1(t.base), "scenarioVehPerHour": r1(t.scen), "increaseVehPerHour": r1(t.increase),
                    "effect": effect_json(&t.effect),
                },
                "adjustedPenalty": {"block": opt_label(t.penalty_block), "penaltyVehPerHour": r1(t.penalty)},
                "blocksAboveBand": t.blocks_above,
                "blocksResolvedIncrease": t.blocks_resolved,
            }},
            "context": {
                "boundingStreets": f.bounding.iter().map(|(name, flow, speed)| json!({"name": name, "flowChangePct": r1(*flow), "speedChangeMph": r1(*speed)})).collect::<Vec<_>>(),
                "insideTripTimeChangePct": r1(f.inside_pct),
                "pedConflictsChangePct": r1(f.ped_pct),
                "bikeConflictsChangePct": r1(f.bike_pct),
            },
            "byPeriod": by_period,
            "evidence": {
                "role": f.role,
                "seeds": f.pairs.seeds,
                "baselineVehPerHour": per(&|c| &c.base),
                "scenarioVehPerHour": per(&|c| &c.scen),
            },
        });
        v["residentsDetour"] = json!({
            "secondsPerTrip": r1(f.detour_s),
            "effect": effect_json(&f.detour),
            "vehicleMinutesPerHour": r1(f.detour_vmin_h),
        });
        if !f.objectives.is_empty() {
            v["objectives"] = json!(f.objectives.iter().map(|o| o.id()).collect::<Vec<_>>());
        }
        if let Some(n) = note {
            v["note"] = json!(n);
        }
        if let Some(w) = &f.access {
            v["accessProblem"] = json!(w);
        }
        if let Some(pic) = &f.picture {
            v["picture"] = pic.to_json();
        }
        if let Some(pic) = &f.picture_all {
            v["pictureAll"] = pic.to_json();
        }
        v
    };
    let mut proposals: Vec<Value> = shown.iter().enumerate().map(|(n, f)| entry(format!("p{}", n + 1), title(cands, &f.set), f, "search", None)).collect();
    for (v, vs) in proposals.iter_mut().zip(&sim.variants) {
        if !vs.is_empty() {
            v["variants"] = json!(vs.iter().map(variant_json).collect::<Vec<_>>());
        }
    }
    for (r, f) in p.references.iter().zip(ref_finals) {
        proposals.push(entry(r.id.clone(), r.title.clone(), f, "reference", Some(&r.note)));
    }
    // Each option against the next simpler one on the same seeds: how many more points of through cars it cuts.
    let comparisons: Vec<Value> = shown.windows(2).enumerate().map(|(k, w)| comparison_json(k, option_gain(&w[0].pairs, &w[1].pairs), w[0].pairs.base_mean())).collect();
    let mut computed = json!({
        "date": util::today_utc(),
        "periods": p.periods,
        "seeds": est.seeds,
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
    });
    computed["objectives"] = json!({
        "list": p.objectives.iter().map(|o| json!({"id": o.id(), "label": o.label(), "rule": o.rule()})).collect::<Vec<_>>(),
        "detourReductionFloor": DETOUR_REDUCTION_FLOOR,
        "detourTieSeconds": DETOUR_TIE_S,
        "note": "Each option lists the objectives it is the best for. Detour is the added trip time of completed car trips that start or end inside the study area, scenario minus baseline on the same seed. ASSUMPTION: the reduction floor, and the detour tie threshold used only when fewer than the minimum seed pairs are available.",
    });
    computed["displacement"] = json!({
        "rule": "An option that is not the winner of a goal is not published when another published option removes at least as many through cars, or is not distinguishable from it on the paired comparison, and its largest all-car rise on one block is smaller by more than the noise of the two rises: the paired intervals' half widths combined, or a floor when either has none. The rule runs on the search seeds when the options are chosen and again on the confirmation seeds, whose figures are the published ones; each dropped record says which (`basis`, `seeds`). The list is not refilled. ASSUMPTION: the floor.",
        "floorVehPerHour": NOISE_FLOOR_VEH_H,
        "dropped": sim.dropped,
    });
    computed["similarity"] = json!({
        "rule": "Two rechecked packages are similar when they act at the same places, or differ by at most one change and cut through cars alike on the paired comparison, or change through cars on the side-street blocks almost identically. One of each similar group is published; the others are listed on it as variants. ASSUMPTION: the thresholds.",
        "pictureDistanceMax": similar::PICTURE_DISTANCE_MAX,
        "folded": sim.folded,
    });
    for (k, v) in provenance_json(p, est, &est.shortlist).as_object().expect("object") {
        computed[k] = v.clone();
    }
    json!({
        "id": p.profile.id,
        "title": p.profile.title,
        "note": p.profile.note,
        "computed": computed,
        "baseline": {"cutThroughVehPerHour": p.periods.iter().zip(&base.full).map(|(n, s)| (n.clone(), json!(r1(s.ct_vph)))).collect::<serde_json::Map<String, Value>>()},
        "optionComparisons": comparisons,
        "proposals": proposals,
    })
}

#[allow(clippy::too_many_arguments)]
fn build_markdown(study: &Study, p: &Params, ctx: &Ctx, state: &SearchState, finals: &[Final], picks: &[Pick], notes: &[String], t0: &std::time::Instant, ref_finals: &[Final], known: &KnownSummary, shown: &[Final], sim: &SimilarOut) -> String {
    let (cands, base) = (ctx.cands, ctx.base);
    let mut md = String::new();
    let confirmed = !p.confirm_seeds.is_empty();
    let _ = writeln!(md, "# Proposals report: {}\n", study.area);
    let _ = writeln!(
        md,
        "Generated by `cargo run --release -p traffic-sim --bin explore` on {}. Periods {}, discovery seeds {}, {} min runs; screening on {} / seed {} at {} min. Network hash {}, demand hash {}, simulator {}, reporting method {}, source revision {}, baseline calibration status: {}. Wall time {:.0} s on {} job(s).\n",
        util::today_utc(),
        p.periods.join(", "),
        p.seeds.iter().map(|s| s.to_string()).collect::<Vec<_>>().join(", "),
        p.minutes,
        p.periods[0],
        p.seeds[0],
        p.screen_minutes,
        study.net_hash,
        study.demand_hash,
        crate::FINGERPRINT,
        REPORT_METHOD,
        p.source_revision,
        study.calibration,
        t0.elapsed().as_secs_f64(),
        p.jobs
    );
    let _ = writeln!(
        md,
        "Estimates of the chosen options: {}. Intervals are {:.0}% Student t intervals on per-seed differences (scenario minus baseline on the same period and seed), made only from at least {} seeds. They cover seed variability with the network, demand and model fixed; they do not cover calibration error, demand error or day-to-day variation in real traffic.\n",
        if confirmed {
            format!("confirmation: the shortlist was frozen and rerun on seeds {} that took no part in screening, rechecking or choosing", p.confirm_seeds.iter().map(|s| s.to_string()).collect::<Vec<_>>().join(", "))
        } else {
            "exploratory: the runs that chose the options also estimate them, so the intervals are not an independent confirmation".to_string()
        },
        100.0 * LEVEL,
        MIN_PAIRS
    );
    let _ = writeln!(md, "## Baseline\n");
    let _ = writeln!(md, "| Period | Through cars an hour, all side streets | Seed-to-seed spread (SD as % of mean) | Inside trip time (s) | Ped conflicts | Bike conflicts |\n| --- | --- | --- | --- | --- | --- |");
    for (n, s) in p.periods.iter().zip(&base.full) {
        let _ = writeln!(md, "| {n} | {:.1} | {:.1}% | {:.0} | {:.0} | {:.0} |", s.ct_vph, s.ct_cv_pct, s.inside_s, s.ped_conflicts, s.bike_conflicts);
    }
    let _ = writeln!(
        md,
        "\nPractical floors (assumptions, not uncertainty intervals): the search's noise band for \"traffic increased on a block\", for through cars and for all traffic alike, is max({} x the block's standard deviation of flow across seeds, {} cars an hour); an option counts as cutting through cars only above {:.1}% of the baseline. Whether an effect or a difference between options is resolved is decided by the paired interval, not by these floors.\n",
        NOISE_SIGMAS, NOISE_FLOOR_VEH_H, GOAL_NOISE_FLOOR_PCT
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
    let blk = |b: usize| study.harm_blocks.get(b).map(|&h| study.idx.blocks[h].label.clone()).unwrap_or_else(|| "none".into());
    let _ = writeln!(md, "\n## Finalists, rechecked at full length\n");
    let _ = writeln!(
        md,
        "Through cars are counted on the area's side streets (each car once for the area; on a block, both directions). \"All traffic\" adds the local trips of people who live or drive there. Through figures are means over the {} discovery seeds and the periods searched. The block with the largest raw increase and the block behind the ranking penalty are different quantities and may differ: the penalty is the largest all-traffic increase on one block in any period after subtracting its assumed noise band.\n",
        p.seeds.len()
    );
    let _ = writeln!(md, "| # | Interventions | Source | Through cars an hour, area change (mean of periods and seeds) | Seed interval of that change | Block with the largest through-car increase (cars an hour) | Its interval | Blocks with a resolved through-car increase | Ranking penalty: block and all-traffic increase past its band (cars an hour, worst period) | Residents' detour (s per trip) | Outcome |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
    for (i, f) in finals.iter().enumerate() {
        let _ = writeln!(
            md,
            "| {} | {} | {} | {:+.1}% | {} | {} ({:+.0}) | {} | {} | {} ({:+.0}) | {:+.1} | {} |",
            i + 1,
            f.set.iter().map(|&c| cands[c as usize].label.clone()).collect::<Vec<_>>().join("; "),
            f.origin.kind,
            -f.reduction_pct,
            interval_phrase(&f.effect),
            blk(f.through.worst),
            f.through.increase,
            interval_phrase(&f.through.effect),
            f.through.blocks_resolved,
            f.through.penalty_block.map(blk).unwrap_or_else(|| "none past its band".into()),
            f.harm,
            f.detour_s,
            notes[i]
        );
    }
    let _ = writeln!(md, "\n## Residents' detour\n");
    let _ = writeln!(
        md,
        "The least-detour objective takes, among the packages that remove at least {:.0}% of the most removed (ASSUMPTION: the share), the one with the smallest added resident trip time per trip. A difference in detour the paired comparison cannot resolve goes to the package that removes more through cars, then to the one with fewer changes.\n",
        DETOUR_REDUCTION_FLOOR * 100.0
    );
    let _ = writeln!(md, "\n## Chosen options\n");
    for (n, (pick, f)) in picks.iter().zip(shown).enumerate() {
        let _ = writeln!(md, "{}. {} ({}; source: {}; estimates: {}). {} Residents' detour: {:+.1} s per trip, {:+.0} vehicle-minutes an hour ({}).", n + 1, title(cands, &f.set), pick.why, f.origin.phrase(), f.role, summary(study, cands, f), f.detour_s, f.detour_vmin_h, detour_phrase(&f.detour));
    }
    for (k, w) in shown.windows(2).enumerate() {
        let _ = writeln!(md, "{}", comparison_line(k, option_gain(&w[0].pairs, &w[1].pairs), w[0].pairs.base_mean()));
    }
    if !picks.is_empty() {
        let _ = writeln!(md, "\n### All traffic on side-street blocks, by period (through and local trips together)\n");
        let _ = writeln!(md, "| Option | Period | Block with the largest all-traffic increase | All cars an hour, before to after | Of the change, through cars | Seed interval of the change | Ranking penalty block and value past its band |\n| --- | --- | --- | --- | --- | --- | --- |");
        for (n, f) in shown.iter().enumerate() {
            for (name, r) in p.periods.iter().zip(&f.by_period) {
                let _ = writeln!(
                    md,
                    "| {} | {} | {} | {:.0} to {:.0} | {:+.0} of {:+.0} | {} | {} ({:+.0}) |",
                    n + 1,
                    name,
                    blk(r.worst),
                    r.block_base,
                    r.block_scen,
                    r.block_through_inc,
                    r.block_scen - r.block_base,
                    interval_phrase(&r.block_effect),
                    r.penalty_block.map(blk).unwrap_or_else(|| "none past its band".into()),
                    r.penalty
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
    if !sim.folded.is_empty() {
        let _ = writeln!(md, "\n## Similar packages\n");
        let _ = writeln!(md, "Near-duplicates are published once; the others are listed on the kept option as variants. Picture distance limit (assumption): {:.2}.\n", similar::PICTURE_DISTANCE_MAX);
        for f in &sim.folded {
            let _ = writeln!(md, "- `{}` folded into `{}`: {}{}.", f["from"].as_str().unwrap_or(""), f["into"].as_str().unwrap_or(""), f["reason"].as_str().unwrap_or(""), if f["intoPublished"] == true { "" } else { " (the package it folded into was not published either)" });
        }
    }
    if !sim.dropped.is_empty() {
        let _ = writeln!(md, "\n## Dropped for displacement\n");
        let _ = writeln!(md, "{}\n", displacement_intro());
        for d in &sim.dropped {
            let _ = writeln!(md, "{}", dropped_line(d));
        }
    }
    if picks.is_empty() {
        let _ = writeln!(md, "No rechecked package reduced cut-through by an established amount without a hard rejection, so nothing is proposed.");
    }
    md
}
