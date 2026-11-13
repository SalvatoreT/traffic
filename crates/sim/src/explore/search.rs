//! Baseline, scoring and beam search (design D1, D4).
//!
//! Goal: through vehicles per hour that use a local street, averaged over the periods searched. Harm: the largest increase in total flow
//! (both directions) on any one local block, after subtracting the noise band, taken over the periods. Screening runs use one
//! period, one seed and a shortened run; the finalists are rechecked elsewhere (`report`).

use super::cands::{conflicts, hotspots, generate_with, Cand, Hotspots};
use super::*;
use std::collections::HashMap;
use std::time::Instant;

/// One period's runs over the seeds, reduced to means.
pub struct PeriodStat {
    pub ct_vph: f64,
    /// Standard deviation of cut-through over the seeds, percent of the mean (0 with one seed).
    pub ct_cv_pct: f64,
    pub ped_conflicts: f64,
    pub bike_conflicts: f64,
    pub inside_s: f64,
    pub unroutable: f64,
    pub gridlock: f64,
    pub backlog: f64,
    pub spawned: f64,
    /// Total flow per harm block (both directions), mean over seeds.
    pub block_flow: Vec<f64>,
    /// Standard deviation of the block flow over seeds.
    pub block_sigma: Vec<f64>,
    /// Per bounding street: summed flow of its in-study links (veh/h) and flow-weighted mean speed (m/s).
    pub street_flow: Vec<f64>,
    pub street_speed: Vec<f64>,
}

pub fn block_flows(study: &Study, flow: &[f32]) -> Vec<f64> {
    study.harm_blocks.iter().map(|&b| study.idx.blocks[b].links.iter().map(|&l| flow[l as usize] as f64).sum()).collect()
}

pub fn period_stat(study: &Study, runs: &[&RunOut]) -> PeriodStat {
    let n = runs.len().max(1) as f64;
    let per_run: Vec<Vec<f64>> = runs.iter().map(|r| block_flows(study, &r.flow)).collect();
    let nb = study.harm_blocks.len();
    let block_flow: Vec<f64> = (0..nb).map(|b| per_run.iter().map(|v| v[b]).sum::<f64>() / n).collect();
    let block_sigma: Vec<f64> = (0..nb).map(|b| std_dev(&per_run.iter().map(|v| v[b]).collect::<Vec<_>>())).collect();
    let mut street_flow = Vec::new();
    let mut street_speed = Vec::new();
    for s in &study.bounding {
        let (mut f, mut fs) = (0.0, 0.0);
        for r in runs {
            for &l in &s.links {
                let q = r.flow[l as usize] as f64;
                f += q;
                fs += q * r.speed[l as usize] as f64;
            }
        }
        street_flow.push(f / n);
        street_speed.push(if f > 0.0 { fs / f } else { 0.0 });
    }
    let m = |g: &dyn Fn(&RunOut) -> f64| runs.iter().map(|r| g(r)).sum::<f64>() / n;
    PeriodStat {
        ct_vph: m(&|r| r.ct_vph),
        ct_cv_pct: {
            let v: Vec<f64> = runs.iter().map(|r| r.ct_vph).collect();
            if mean(&v) > 0.0 {
                100.0 * std_dev(&v) / mean(&v)
            } else {
                0.0
            }
        },
        ped_conflicts: m(&|r| r.ped_conflicts as f64),
        bike_conflicts: m(&|r| r.bike_conflicts as f64),
        inside_s: m(&|r| r.inside_mean_s()),
        unroutable: m(&|r| r.unroutable as f64),
        gridlock: m(&|r| r.gridlock_removed as f64),
        backlog: m(&|r| r.backlog as f64),
        spawned: m(&|r| r.spawned as f64),
        block_flow,
        block_sigma,
        street_flow,
        street_speed,
    }
}

pub struct Baseline {
    /// Per period, the full-length runs over the seeds.
    pub full: Vec<PeriodStat>,
    /// First period at the screening length, per seed (the first is the paired baseline for screening runs).
    pub screen_runs: Vec<RunOut>,
    pub screen: PeriodStat,
    pub hot: Hotspots,
}

/// Select links for the baseline: every non-motorway link inside the study area.
pub fn nominated_links(study: &Study) -> Vec<u32> {
    study.net.links.iter().filter(|l| l.in_study_area && l.class != RoadClass::Motorway).map(|l| l.id).collect()
}

pub fn run_baseline(study: &Study, p: &Params) -> Baseline {
    let sel = nominated_links(study);
    // (period index, seed index, minutes, select links?)
    let mut jobs: Vec<(usize, usize, f64, bool)> = Vec::new();
    for pi in 0..p.periods.len() {
        for si in 0..p.seeds.len() {
            jobs.push((pi, si, p.minutes, si == 0));
        }
    }
    for si in 0..p.seeds.len() {
        jobs.push((0, si, p.screen_minutes, false));
    }
    let mut outs = parallel_map(p.jobs, &jobs, |&(pi, si, minutes, record)| run(study, &[], &p.periods[pi], p.seeds[si], minutes, if record { &sel } else { &[] }));
    let ns = p.seeds.len();
    for (k, o) in outs.iter().enumerate() {
        let (pi, si) = if k < p.periods.len() * ns { (k / ns, k % ns) } else { (0, k - p.periods.len() * ns) };
        eprintln!(
            "  baseline {} seed {} {:.0} min: cut-through {:.0} veh/h, unroutable {}, gridlock removed {}, backlog {}",
            p.periods[pi],
            p.seeds[si],
            if k < p.periods.len() * ns { p.minutes } else { p.screen_minutes },
            o.ct_vph,
            o.unroutable,
            o.gridlock_removed,
            o.backlog
        );
    }
    let mut screen_runs: Vec<RunOut> = outs.split_off(p.periods.len() * ns);
    let mut hot_records: Vec<crate::sim::SelectLinkRecord> = Vec::new();
    let mut full: Vec<PeriodStat> = Vec::new();
    for pi in 0..p.periods.len() {
        let runs: Vec<&RunOut> = outs[pi * ns..(pi + 1) * ns].iter().collect();
        full.push(period_stat(study, &runs));
    }
    for pi in 0..p.periods.len() {
        hot_records.append(&mut outs[pi * ns].records);
    }
    let hot = hotspots(study, &hot_records, p.minutes / 60.0 * p.periods.len() as f64);
    let screen = period_stat(study, &screen_runs.iter().collect::<Vec<_>>());
    screen_runs.iter_mut().for_each(|r| r.records.clear());
    Baseline { full, screen_runs, screen, hot }
}

/// Reason a scenario run is rejected against the baseline run it is paired with, if any.
pub fn run_reject(scen_unroutable: f64, scen_gridlock: f64, scen_backlog: f64, base: &PeriodStatLite) -> Option<String> {
    if scen_unroutable > base.unroutable + 1e-9 {
        return Some(format!("unroutable trips {scen_unroutable:.0} above baseline {:.0}", base.unroutable));
    }
    if scen_gridlock > base.gridlock * (1.0 + GRIDLOCK_SHARE) + GRIDLOCK_SLACK {
        return Some(format!("gridlock removals {scen_gridlock:.0} above baseline {:.0}", base.gridlock));
    }
    if scen_backlog > base.backlog + BACKLOG_SHARE * base.spawned {
        return Some(format!("entry backlog {scen_backlog:.0} above baseline {:.0}", base.backlog));
    }
    None
}

pub struct PeriodStatLite {
    pub unroutable: f64,
    pub gridlock: f64,
    pub backlog: f64,
    pub spawned: f64,
}

impl PeriodStat {
    pub fn lite(&self) -> PeriodStatLite {
        PeriodStatLite { unroutable: self.unroutable, gridlock: self.gridlock, backlog: self.backlog, spawned: self.spawned }
    }
}

pub struct HarmRes {
    /// Largest increase after subtracting the noise band, floored at 0 (veh/h).
    pub worst_adj: f64,
    /// Harm-block position of the worst block: the largest adjusted increase, else the largest raw increase.
    pub worst: usize,
    pub n_above: usize,
}

/// Harm of one period: `inc` is scenario minus baseline block flow, `sigma` the baseline's spread over seeds.
pub fn harm_calc(inc: &[f64], sigma: &[f64]) -> HarmRes {
    let band = |b: usize| (NOISE_SIGMAS * sigma[b]).max(NOISE_FLOOR_VEH_H);
    let (mut worst_adj, mut worst, mut n_above) = (0.0f64, 0usize, 0usize);
    let (mut worst_raw, mut worst_raw_i) = (f64::NEG_INFINITY, 0usize);
    for b in 0..inc.len() {
        let adj = inc[b] - band(b);
        if adj > 0.0 {
            n_above += 1;
        }
        if adj > worst_adj {
            worst_adj = adj;
            worst = b;
        }
        if inc[b] > worst_raw {
            worst_raw = inc[b];
            worst_raw_i = b;
        }
    }
    if worst_adj <= 0.0 {
        worst = worst_raw_i;
    }
    HarmRes { worst_adj, worst, n_above }
}

pub fn reduction_pct(base: f64, scen: f64) -> f64 {
    if base > 0.0 {
        100.0 * (base - scen) / base
    } else {
        0.0
    }
}

/// A screened package.
pub struct Eval {
    pub set: Vec<u16>,
    pub reject: Option<String>,
    pub reduction_pct: f64,
    pub harm: f64,
    /// Harm-block position of the worst block.
    pub worst: usize,
    /// Raw increase per harm block (veh/h).
    pub inc: Vec<f32>,
    pub score: f64,
}

impl Eval {
    pub fn valid(&self) -> bool {
        self.reject.is_none()
    }
    fn rejected(set: &[u16], why: String) -> Eval {
        Eval { set: set.to_vec(), reject: Some(why), reduction_pct: 0.0, harm: 0.0, worst: 0, inc: Vec::new(), score: f64::NEG_INFINITY }
    }
}

pub fn score(p: &Params, reduction_pct: f64, harm: f64) -> f64 {
    reduction_pct - p.harm_weight * harm
}

pub struct Ctx<'a> {
    pub study: &'a Study,
    pub p: &'a Params,
    pub cands: &'a [Cand],
    pub base: &'a Baseline,
}

impl Ctx<'_> {
    pub fn ivs(&self, set: &[u16]) -> Vec<Intervention> {
        set.iter().map(|&i| self.cands[i as usize].iv.clone()).collect()
    }
}

/// Screening run for a package that already passed the access check.
fn eval_screen(ctx: &Ctx, set: &[u16]) -> Eval {
    let p = ctx.p;
    let out = run(ctx.study, &ctx.ivs(set), &p.periods[0], p.seeds[0], p.screen_minutes, &[]);
    let base_run = &ctx.base.screen_runs[0];
    let lite = PeriodStatLite { unroutable: base_run.unroutable as f64, gridlock: base_run.gridlock_removed as f64, backlog: base_run.backlog as f64, spawned: base_run.spawned as f64 };
    if out.invalid > 0 {
        return Eval::rejected(set, "invalid intervention".into());
    }
    if let Some(why) = run_reject(out.unroutable as f64, out.gridlock_removed as f64, out.backlog as f64, &lite) {
        return Eval::rejected(set, why);
    }
    let base_flow = block_flows(ctx.study, &base_run.flow);
    let scen_flow = block_flows(ctx.study, &out.flow);
    let inc: Vec<f64> = scen_flow.iter().zip(&base_flow).map(|(s, b)| s - b).collect();
    let h = harm_calc(&inc, &ctx.base.screen.block_sigma);
    let red = reduction_pct(base_run.ct_vph, out.ct_vph);
    Eval { set: set.to_vec(), reject: None, reduction_pct: red, harm: h.worst_adj, worst: h.worst, inc: inc.iter().map(|&x| x as f32).collect(), score: score(p, red, h.worst_adj) }
}

pub struct SearchState {
    pub evals: Vec<Eval>,
    pub cache: HashMap<Vec<u16>, usize>,
    /// Simulated screening runs so far (rejections before simulation are free).
    pub used: usize,
    pub exhausted: bool,
    pub log: Vec<String>,
    started: Instant,
}

impl SearchState {
    pub fn new() -> SearchState {
        SearchState { evals: Vec::new(), cache: HashMap::new(), used: 0, exhausted: false, log: Vec::new(), started: Instant::now() }
    }
}

impl Default for SearchState {
    fn default() -> Self {
        Self::new()
    }
}

/// Evaluate sets not seen before, within the budget; results go into the state's cache.
fn eval_batch(ctx: &Ctx, st: &mut SearchState, sets: Vec<Vec<u16>>) {
    let mut want: Vec<Vec<u16>> = Vec::new();
    for s in sets {
        if !st.cache.contains_key(&s) && !want.contains(&s) {
            want.push(s);
        }
    }
    let checks: Vec<Result<(), String>> = parallel_map(ctx.p.jobs, &want, |s| check_access(ctx.study, &ctx.ivs(s)));
    let mut to_run: Vec<Vec<u16>> = Vec::new();
    let mut results: HashMap<Vec<u16>, Eval> = HashMap::new();
    for (s, c) in want.iter().zip(checks) {
        match c {
            Err(why) => {
                results.insert(s.clone(), Eval::rejected(s, why));
            }
            Ok(()) => to_run.push(s.clone()),
        }
    }
    if let Some(b) = ctx.p.budget_evals {
        let left = b.saturating_sub(st.used);
        if to_run.len() > left {
            to_run.truncate(left);
            st.exhausted = true;
        }
    }
    let evals = parallel_map(ctx.p.jobs, &to_run, |s| eval_screen(ctx, s));
    st.used += to_run.len();
    for e in evals {
        results.insert(e.set.clone(), e);
    }
    for s in want {
        if let Some(e) = results.remove(&s) {
            st.cache.insert(s, st.evals.len());
            st.evals.push(e);
        }
    }
}

fn describe_set(ctx: &Ctx, set: &[u16]) -> String {
    set.iter().map(|&i| ctx.cands[i as usize].label.clone()).collect::<Vec<_>>().join("; ")
}

fn progress(ctx: &Ctx, st: &mut SearchState, depth: usize, best: Option<usize>) {
    let line = match best {
        Some(b) => {
            let e = &st.evals[b];
            format!(
                "depth {depth}: best so far {:+.1} (cut-through -{:.1}%, harm {:.0} veh/h, {} intervention(s)): {} | evals {}{} | {:.0}s",
                e.score,
                e.reduction_pct,
                e.harm,
                e.set.len(),
                describe_set(ctx, &e.set),
                st.used,
                ctx.p.budget_evals.map(|b| format!("/{b}")).unwrap_or_default(),
                st.started.elapsed().as_secs_f64()
            )
        }
        None => format!("depth {depth}: no valid package yet | evals {} | {:.0}s", st.used, st.started.elapsed().as_secs_f64()),
    };
    eprintln!("{line}");
    st.log.push(line);
}

fn best_valid(st: &SearchState) -> Option<usize> {
    (0..st.evals.len()).filter(|&i| st.evals[i].valid()).max_by(|&a, &b| st.evals[a].score.partial_cmp(&st.evals[b].score).unwrap_or(std::cmp::Ordering::Equal).then_with(|| b.cmp(&a)))
}

/// Beam search: all single candidates first, then add one candidate at a time to each package in the beam.
pub fn beam_search(ctx: &Ctx) -> SearchState {
    let mut st = SearchState::new();
    let n = ctx.cands.len();
    let singles: Vec<Vec<u16>> = (0..n as u16).map(|i| vec![i]).collect();
    eval_batch(ctx, &mut st, singles);
    // Single results by candidate index.
    fn single_eval(st: &SearchState, c: u16) -> Option<&Eval> {
        st.cache.get(&vec![c]).map(|&i| &st.evals[i])
    }
    let mut ranked: Vec<u16> = (0..n as u16).filter(|&c| single_eval(&st, c).map_or(false, |e| e.valid())).collect();
    ranked.sort_by(|&a, &b| {
        let (ea, eb) = (single_eval(&st, a).unwrap(), single_eval(&st, b).unwrap());
        eb.score.partial_cmp(&ea.score).unwrap_or(std::cmp::Ordering::Equal).then(a.cmp(&b))
    });
    let b = best_valid(&st);
    progress(ctx, &mut st, 1, b);
    let top_singles: Vec<u16> = ranked.iter().copied().filter(|&c| single_eval(&st, c).unwrap().reduction_pct > 0.0).take(ctx.p.expand).collect();
    let usable: Vec<bool> = (0..n as u16).map(|c| single_eval(&st, c).map_or(false, |e| e.valid())).collect();
    let mut beam: Vec<usize> = ranked.iter().take(ctx.p.beam).map(|&c| st.cache[&vec![c]]).collect();
    let mut global_best = best_valid(&st).map_or(f64::NEG_INFINITY, |b| st.evals[b].score);
    for depth in 2..=ctx.p.depth {
        if st.exhausted || beam.is_empty() {
            break;
        }
        let mut new_sets: Vec<Vec<u16>> = Vec::new();
        for &bi in &beam {
            let member = st.evals[bi].set.clone();
            let mut ext: Vec<u16> = top_singles.clone();
            // Repair moves: candidates on or next to the blocks this package pushed traffic onto.
            let mut hot: Vec<usize> = (0..st.evals[bi].inc.len()).filter(|&b| st.evals[bi].inc[b] as f64 > NOISE_FLOOR_VEH_H).collect();
            hot.sort_by(|&a, &b| st.evals[bi].inc[b].partial_cmp(&st.evals[bi].inc[a]).unwrap_or(std::cmp::Ordering::Equal).then(a.cmp(&b)));
            for &hb in hot.iter().take(3) {
                let blk = &ctx.study.idx.blocks[ctx.study.harm_blocks[hb]];
                for c in 0..n as u16 {
                    let cand = &ctx.cands[c as usize];
                    let near = cand.block == Some(ctx.study.harm_blocks[hb]) || cand.nodes.iter().any(|&x| x == blk.a || x == blk.b);
                    if near && usable[c as usize] && !ext.contains(&c) {
                        ext.push(c);
                    }
                }
            }
            for c in ext {
                if member.contains(&c) || member.iter().any(|&m| conflicts(&ctx.cands[m as usize], &ctx.cands[c as usize])) {
                    continue;
                }
                let mut s = member.clone();
                s.push(c);
                s.sort_unstable();
                if !new_sets.contains(&s) {
                    new_sets.push(s);
                }
            }
        }
        let before = st.evals.len();
        eval_batch(ctx, &mut st, new_sets);
        let mut level: Vec<usize> = (before..st.evals.len()).filter(|&i| st.evals[i].valid()).collect();
        level.sort_by(|&a, &b| st.evals[b].score.partial_cmp(&st.evals[a].score).unwrap_or(std::cmp::Ordering::Equal).then(a.cmp(&b)));
        let b = best_valid(&st);
        progress(ctx, &mut st, depth, b);
        let level_best = level.first().map_or(f64::NEG_INFINITY, |&i| st.evals[i].score);
        if level_best <= global_best + 1e-9 {
            st.log.push(format!("depth {depth}: no package beats the best so far; stopping"));
            eprintln!("depth {depth}: no package beats the best so far; stopping");
            break;
        }
        global_best = level_best;
        level.truncate(ctx.p.beam);
        beam = level;
    }
    st
}

/// Packages no other evaluated package beats on cut-through reduction, harm and number of interventions (maximize, minimize, minimize).
pub fn non_dominated(evals: &[Eval]) -> Vec<usize> {
    let ok: Vec<usize> = (0..evals.len()).filter(|&i| evals[i].valid() && evals[i].reduction_pct > 0.0).collect();
    ok.iter()
        .copied()
        .filter(|&i| {
            let a = &evals[i];
            !ok.iter().any(|&j| {
                let b = &evals[j];
                j != i
                    && b.reduction_pct >= a.reduction_pct
                    && b.harm <= a.harm
                    && b.set.len() <= a.set.len()
                    && (b.reduction_pct > a.reduction_pct || b.harm < a.harm || b.set.len() < a.set.len())
            })
        })
        .collect()
}

/// Up to `cap` finalists from the non-dominated set: the best by score, then the best at each size.
pub fn pick_finalists(evals: &[Eval], cap: usize) -> Vec<usize> {
    let mut nd = non_dominated(evals);
    nd.sort_by(|&a, &b| evals[b].score.partial_cmp(&evals[a].score).unwrap_or(std::cmp::Ordering::Equal).then(a.cmp(&b)));
    let mut out: Vec<usize> = nd.iter().copied().take(cap.div_ceil(2)).collect();
    let max_n = nd.iter().map(|&i| evals[i].set.len()).max().unwrap_or(0);
    for k in 1..=max_n {
        if out.len() >= cap {
            break;
        }
        if let Some(&i) = nd.iter().find(|&&i| evals[i].set.len() == k && !out.contains(&i)) {
            out.push(i);
        }
    }
    for &i in &nd {
        if out.len() >= cap {
            break;
        }
        if !out.contains(&i) {
            out.push(i);
        }
    }
    out.sort_by(|&a, &b| evals[b].score.partial_cmp(&evals[a].score).unwrap_or(std::cmp::Ordering::Equal).then(a.cmp(&b)));
    out
}

pub fn make_cands(study: &Study, base: &Baseline, p: &Params) -> Vec<Cand> {
    generate_with(study, &base.hot, p.candidates, &p.profile)
}
