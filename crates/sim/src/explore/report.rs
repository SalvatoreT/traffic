//! Recheck of the finalists, choice of the options to publish (design D4, D5), their titles and summaries, and the output files.

use super::cands::{generate_with, Cand};
use super::naming::describe;
use super::refs::{resolve, RefCfg};
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
    pub harm: f64,
    /// Harm-block position of the worst block.
    pub worst: usize,
    pub blocks_above: usize,
    pub by_period: Vec<(f64, f64)>,
    pub bounding: Vec<(String, f64, f64)>,
    pub inside_pct: f64,
    pub ped_pct: f64,
    pub bike_pct: f64,
    pub score: f64,
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
        by_period.push((pct_change(base.full[pi].ct_vph, stats[pi].ct_vph), h.worst_adj));
    }
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
        by_period,
        bounding,
        inside_pct: pct_change(m(&|s| s.inside_s, &base.full), m(&|s| s.inside_s, stats)),
        ped_pct: pct_change(m(&|s| s.ped_conflicts, &base.full), m(&|s| s.ped_conflicts, stats)),
        bike_pct: pct_change(m(&|s| s.bike_conflicts, &base.full), m(&|s| s.bike_conflicts, stats)),
        score: score(p, red, harm),
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
                notes[i] = format!("cut-through change {:+.1}% is not a reduction beyond noise ({:.1}%)", -finals[i].reduction_pct, noise_pct);
                false
            } else {
                true
            }
        })
        .collect();
    let dominated = |i: usize| {
        let a = &finals[i];
        ok.iter().copied().find(|&j| {
            let b = &finals[j];
            j != i && b.reduction_pct >= a.reduction_pct && b.harm <= a.harm && b.set.len() <= a.set.len() && (b.reduction_pct > a.reduction_pct || b.harm < a.harm || b.set.len() < a.set.len())
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
        let simpler = nd.iter().copied().find(|&j| {
            let b = &finals[j];
            b.set.len() < a.set.len() && a.reduction_pct <= b.reduction_pct + noise_pct && a.harm >= b.harm - NOISE_FLOOR_VEH_H
        });
        match simpler {
            Some(j) => notes[i] = format!("reduction within noise of simpler finalist {}", j + 1),
            None => keep.push(i),
        }
    }
    let by_score = |a: &usize, b: &usize| finals[*b].score.partial_cmp(&finals[*a].score).unwrap_or(std::cmp::Ordering::Equal).then(a.cmp(b));
    let mut picks: Vec<(usize, String)> = Vec::new();
    let mut by_s = keep.clone();
    by_s.sort_by(by_score);
    if let Some(&b) = by_s.iter().find(|&&i| finals[i].set.len() == 1) {
        picks.push((b, "best single intervention".into()));
    }
    if let Some(&b) = by_s.first() {
        if !picks.iter().any(|p| p.0 == b) {
            picks.push((b, "best overall".into()));
        } else {
            picks[0].1 = "best single intervention and best overall".into();
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

/// Two or three plain sentences: what the package does, what it achieves and its worst side effect by street name.
pub fn summary(study: &Study, cands: &[Cand], f: &Final) -> String {
    let n = f.set.len();
    let labels: Vec<String> = f.set.iter().map(|&i| cands[i as usize].label.clone()).collect();
    let shown: Vec<String> = labels.iter().take(4).enumerate().map(|(k, l)| if k == 0 { l.clone() } else { lower_first(l) }).collect();
    let more = if n > 4 { format!(", and {} more", n - 4) } else { String::new() };
    let s1 = format!("It makes {} {}: {}{}.", number_word(n), if n == 1 { "change" } else { "changes" }, shown.join("; "), more);
    let s2 = format!(
        "In the simulation it {} cut-through traffic on local streets inside the study area by {:.0}%, from {:.0} to {:.0} through vehicles an hour.",
        if f.reduction_pct >= 0.0 { "cuts" } else { "raises" },
        f.reduction_pct.abs(),
        f.base_vph,
        f.scen_vph
    );
    let blk = &study.idx.blocks[study.harm_blocks[f.worst]];
    let s3 = if f.harm > 0.0 {
        let others = f.blocks_above.saturating_sub(1);
        let tail = if others == 0 { String::new() } else { format!(", and {} other {} gain traffic beyond normal run-to-run variation", others, if others == 1 { "block" } else { "blocks" }) };
        format!("The worst side effect is about {:.0} more vehicles an hour on {}{}.", f.harm, blk.label, tail)
    } else {
        "No block inside the study area gains traffic beyond normal run-to-run variation.".to_string()
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
}

pub fn explore(study: &Study, p: &Params) -> Outcome {
    let t0 = std::time::Instant::now();
    eprintln!("baseline: {} period(s) x {} seed(s) at {} min, plus {} screening run(s) at {} min", p.periods.len(), p.seeds.len(), p.minutes, p.seeds.len(), p.screen_minutes);
    let base = run_baseline(study, p);
    eprintln!("baseline done in {:.0}s; cut-through {}", t0.elapsed().as_secs_f64(), p.periods.iter().zip(&base.full).map(|(n, s)| format!("{n} {:.0} veh/h", s.ct_vph)).collect::<Vec<_>>().join(", "));
    let cands = generate_with(study, &base.hot, p.candidates, &p.profile);
    eprintln!("{} candidate interventions:", cands.len());
    for (i, c) in cands.iter().enumerate() {
        eprintln!("  {:3} [{}] {}", i + 1, c.kind, c.label);
    }
    let ctx = Ctx { study, p, cands: &cands, base: &base };
    let state = beam_search(&ctx);
    let fin_idx = pick_finalists(&state.evals, p.finalists);
    eprintln!("rechecking {} finalist(s) over {} period(s) x {} seed(s) at {} min", fin_idx.len(), p.periods.len(), p.seeds.len(), p.minutes);
    let sets: Vec<Vec<u16>> = fin_idx.iter().map(|&i| state.evals[i].set.clone()).collect();
    let finals = recheck(&ctx, &sets);
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
    let ref_finals = if ref_sets.is_empty() { Vec::new() } else { eprintln!("rechecking {} reference package(s)", ref_sets.len()); recheck(&ctx_all, &ref_sets) };
    eprintln!("chose {} option(s); total {:.0}s", picks.len(), t0.elapsed().as_secs_f64());
    let json = build_json(study, p, &all, &base, &finals, &picks, &ref_finals);
    let markdown = build_markdown(study, p, &ctx_all, &state, &finals, &picks, &notes, noise, &t0, &ref_finals);
    Outcome { json, markdown, cands, state, finals, picks, base, ref_finals }
}

/// Mean over periods of the baseline's coefficient of variation of cut-through over seeds (percent); 0 with one seed.
fn base_cv_pct(base: &Baseline) -> f64 {
    mean(&base.full.iter().map(|s| s.ct_cv_pct).collect::<Vec<_>>())
}

fn r1(x: f64) -> f64 {
    (x * 10.0).round() / 10.0
}

pub fn build_json(study: &Study, p: &Params, cands: &[Cand], base: &Baseline, finals: &[Final], picks: &[Pick], ref_finals: &[Final]) -> Value {
    let entry = |id: String, title: String, f: &Final, kind: &str, note: Option<&str>| -> Value {
        let ivs: Vec<Intervention> = f.set.iter().map(|&i| cands[i as usize].iv.clone()).collect();
        let by_period: serde_json::Map<String, Value> = p.periods.iter().zip(&f.by_period).map(|(name, (cut, harm))| (name.clone(), json!({"cutThroughChangePct": r1(*cut), "worstIncreaseVehPerHour": harm.round()}))).collect();
        let mut v = json!({
            "id": id,
            "kind": kind,
            "title": title,
            "summary": summary(study, cands, f),
            "link": study.encode(&ivs, Some(&p.periods[0])),
            "interventions": f.set.iter().map(|&i| json!({"type": cands[i as usize].iv.ty, "label": cands[i as usize].label})).collect::<Vec<_>>(),
            "cutThrough": {"baselineVehPerHour": r1(f.base_vph), "scenarioVehPerHour": r1(f.scen_vph), "changePct": r1(-f.reduction_pct)},
            "harm": {"worstBlock": study.idx.blocks[study.harm_blocks[f.worst]].label, "worstIncreaseVehPerHour": f.harm.round(), "blocksAboveNoise": f.blocks_above},
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
            "networkHash": study.net_hash,
            "demandHash": study.demand_hash,
            "calibration": study.calibration,
        },
        "baseline": {"cutThroughVehPerHour": p.periods.iter().zip(&base.full).map(|(n, s)| (n.clone(), json!(r1(s.ct_vph)))).collect::<serde_json::Map<String, Value>>()},
        "proposals": proposals,
    })
}

#[allow(clippy::too_many_arguments)]
fn build_markdown(study: &Study, p: &Params, ctx: &Ctx, state: &SearchState, finals: &[Final], picks: &[Pick], notes: &[String], noise: f64, t0: &std::time::Instant, ref_finals: &[Final]) -> String {
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
    let _ = writeln!(md, "| Period | Cut-through (veh/h) | Run-to-run spread | Inside trip time (s) | Ped conflicts | Bike conflicts |\n| --- | --- | --- | --- | --- | --- |");
    for (n, s) in p.periods.iter().zip(&base.full) {
        let _ = writeln!(md, "| {n} | {:.1} | {:.1}% | {:.0} | {:.0} | {:.0} |", s.ct_vph, s.ct_cv_pct, s.inside_s, s.ped_conflicts, s.bike_conflicts);
    }
    let _ = writeln!(
        md,
        "\nNoise band for \"traffic increased on a block\": max({} x the block's standard deviation of flow across seeds, {} veh/h). With one seed the band is the floor. Two options count as different in cut-through reduction when they differ by more than {:.1}% (twice the standard error of the seed mean).\n",
        NOISE_SIGMAS, NOISE_FLOOR_VEH_H, noise
    );
    let mut hb: Vec<usize> = (0..study.harm_blocks.len()).collect();
    hb.sort_by(|&a, &b| base.hot.block_ct[study.harm_blocks[b]].partial_cmp(&base.hot.block_ct[study.harm_blocks[a]]).unwrap_or(std::cmp::Ordering::Equal).then(a.cmp(&b)));
    let _ = writeln!(md, "Blocks carrying the most cut-through in the baseline (trips per hour, select-link analysis):\n");
    for &b in hb.iter().take(8) {
        let blk = &study.idx.blocks[study.harm_blocks[b]];
        let _ = writeln!(md, "- {}: {:.0}", blk.label, base.hot.block_ct[study.harm_blocks[b]]);
    }
    let mut nodes: Vec<usize> = (0..study.net.nodes.len()).filter(|&n| base.hot.node_ct[n] > 0.0).collect();
    nodes.sort_by(|&a, &b| base.hot.node_ct[b].partial_cmp(&base.hot.node_ct[a]).unwrap_or(std::cmp::Ordering::Equal).then(a.cmp(&b)));
    let _ = writeln!(md, "\nIntersections with the most cut-through movements (trips per hour):\n");
    for &n in nodes.iter().take(5) {
        let _ = writeln!(md, "- {}: {:.0}", study.idx.node_label(n as u32), base.hot.node_ct[n]);
    }
    let _ = writeln!(md, "\n## Candidates ({})\n", cands.len());
    for (i, c) in cands.iter().enumerate() {
        let _ = writeln!(md, "{}. {}", i + 1, c.label);
    }
    let _ = writeln!(md, "\n## Search\n");
    let _ = writeln!(md, "Beam {}, depth {}, expand {}, harm weight {} points of reduction per veh/h, {} screening runs simulated{}.\n", p.beam, p.depth, p.expand, p.harm_weight, state.used, p.budget_evals.map(|b| format!(" (budget {b})")).unwrap_or_default());
    for l in &state.log {
        let _ = writeln!(md, "- {l}");
    }
    let _ = writeln!(md, "\n## Finalists, rechecked at full length\n");
    let _ = writeln!(md, "| # | Interventions | Cut-through change | Worst block (veh/h) | Blocks above noise | Outcome |\n| --- | --- | --- | --- | --- | --- |");
    for (i, f) in finals.iter().enumerate() {
        let _ = writeln!(
            md,
            "| {} | {} | {:+.1}% | {} (+{:.0}) | {} | {} |",
            i + 1,
            f.set.iter().map(|&c| cands[c as usize].label.clone()).collect::<Vec<_>>().join("; "),
            -f.reduction_pct,
            study.idx.blocks[study.harm_blocks[f.worst]].label,
            f.harm,
            f.blocks_above,
            notes[i]
        );
    }
    let _ = writeln!(md, "\n## Chosen options\n");
    for (n, pick) in picks.iter().enumerate() {
        let f = &finals[pick.idx];
        let _ = writeln!(md, "{}. {} ({}). {}", n + 1, title(cands, &f.set), pick.why, summary(study, cands, f));
    }
    if !ref_finals.is_empty() {
        let _ = writeln!(md, "\n## Reference packages\n");
        for (r, f) in p.references.iter().zip(ref_finals) {
            let _ = writeln!(md, "- {} ({}). {} {}", r.title, r.id, r.note, summary(study, cands, f));
            if let Some(w) = &f.reject {
                let _ = writeln!(md, "  Would be rejected as a search result: {w}.");
            }
        }
    }
    if picks.is_empty() {
        let _ = writeln!(md, "No rechecked package reduced cut-through beyond noise without a hard rejection, so nothing is proposed.");
    }
    md
}
