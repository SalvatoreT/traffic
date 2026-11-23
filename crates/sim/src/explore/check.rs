//! Score given packages by the search's own code paths: the access check, the profile's limits, the candidate list, the screening run
//! and the full recheck. Used to find out why a package the search published before is not found now (`explore --check`).

use super::cands::{adopt, generate_with, profile_allows, Cand};
use super::decode::decode_scenario;
use super::report::{recheck, Final};
use super::search::*;
use super::*;

/// Print how the search treats each package link: per intervention, whether the profile allows it and whether the candidate list holds it;
/// whether the package passes the access check; its full recheck over every period and seed; and, with `subsets`, the screening score of
/// every non-empty subset (one period, one seed, shortened run), which shows whether a beam could reach the package.
pub fn check_links(study: &Study, p: &Params, links: &[String], subsets: bool, singles: bool) {
    let base = run_baseline(study, p);
    let mut cands = super::cands::generate_search(study, &base.hot, p);
    let n_gen = cands.len();
    println!("candidate list: {n_gen} candidates under profile {}", p.profile.id);
    for (i, c) in cands.iter().enumerate() {
        println!("  candidate {} [{}] {}", i + 1, c.kind, c.label);
    }
    let mut sets: Vec<Vec<u16>> = Vec::new();
    let ban_sets = if p.ban_sets { super::bansets::generate(study, &p.periods.iter().map(String::as_str).collect::<Vec<_>>()).sets } else { Vec::new() };
    for link in links {
        let ivs = match decode_scenario(&study.net, &study.topo, study.origin, link).map(|v| super::bansets::collapse(&ban_sets, v)) {
            Ok(v) => v,
            Err(e) => {
                println!("\n{link}\n  does not decode: {e}");
                continue;
            }
        };
        println!("\n{link}");
        let mut set: Vec<u16> = Vec::new();
        for iv in &ivs {
            let i = adopt(study, &mut cands, iv);
            set.push(i);
            println!(
                "  {}: profile {}, {}",
                cands[i as usize].label,
                if profile_allows(study, &p.profile, iv) { "allows" } else { "FORBIDS" },
                if (i as usize) < n_gen { format!("candidate {}", i + 1) } else { "NOT in the candidate list".to_string() }
            );
        }
        match check_access_for(study, &ivs, p.periods.iter().map(String::as_str)) {
            Ok(()) => println!("  access check: passes"),
            Err(e) => println!("  access check: fails, {e}"),
        }
        sets.push(set);
    }
    let ctx = Ctx { study, p, cands: &cands, base: &base };
    if singles {
        let rows = score_singles(&ctx);
        println!("\n{}", singles_header(p));
        print_singles(study, p, &cands, &rows, n_gen);
        for set in &sets {
            for &i in set {
                if let Some(r) = rows.iter().find(|r| r.cand == i) {
                    println!("  {}: score {:+.1}, through {:.1} -> {:.1}, largest all-car rise {:+.0}", cands[i as usize].label, r.score, r.base_ct, r.scen_ct, r.rise);
                }
            }
        }
    }
    let finals: Vec<Final> = recheck(&ctx, &sets);
    for (set, f) in sets.iter().zip(&finals) {
        println!("\nrecheck of {} intervention(s): {}", set.len(), match &f.reject { Some(w) => format!("REJECTED, {w}"), None => "no rejection".into() });
        println!("  through cars an hour, mean of periods: {:.1} -> {:.1} ({:+.1}%); score {:+.1}; ranking penalty {:.0} on {}", f.base_vph, f.scen_vph, -f.reduction_pct, f.score, f.harm, study.idx.blocks[study.harm_blocks[f.worst]].label);
        println!(
            "  block with the largest through-car increase: {} ({:+.0}; {}), {} block(s) with a resolved increase, {} past the noise band",
            study.idx.blocks[study.harm_blocks[f.through.worst]].label,
            f.through.increase,
            super::report::interval_phrase(&f.through.effect),
            f.through.blocks_resolved,
            f.through.blocks_above
        );
        println!("  through-car change interval: {}", super::report::interval_phrase(&f.effect));
        let elapsed = f.detour_s.map_or_else(|| "unavailable".into(), |s| format!("{s:+.1} s per request"));
        let c = &f.detour_coverage;
        println!("  Resident elapsed time through the {}-minute cutoff was {elapsed}. Unfinished requests numbered {} of {} at baseline and {} of {} with the package.", p.minutes, c.baseline_unfinished, c.baseline_requests, c.scenario_unfinished, c.scenario_requests);
        for (name, r) in p.periods.iter().zip(&f.by_period) {
            println!("  {name}: through {:.0} -> {:.0} ({:+.1}%); all-traffic block with the largest increase {} {:.0} -> {:.0}", r.base_through, r.scen_through, r.cut_pct, study.idx.blocks[study.harm_blocks[r.worst]].label, r.block_base, r.block_scen);
        }
        if subsets && set.len() > 1 {
            let mut all: Vec<Vec<u16>> = Vec::new();
            for mask in 1u32..(1 << set.len()) {
                all.push((0..set.len()).filter(|k| mask >> k & 1 == 1).map(|k| set[k]).collect::<Vec<u16>>());
            }
            all.iter_mut().for_each(|s| s.sort_unstable());
            let mut st = SearchState::new();
            eval_batch(&ctx, &mut st, all.clone());
            all.sort_by_key(|s| (s.len(), s.clone()));
            println!("  screening ({} {}, seed {}, {} min), every subset:", p.periods[0], "run", p.seeds[0], p.screen_minutes);
            for s in &all {
                let e = &st.evals[st.cache[s]];
                let names: Vec<String> = s.iter().map(|&i| format!("{}", set.iter().position(|&x| x == i).unwrap() + 1)).collect();
                let worst = if e.inc.is_empty() { String::new() } else { study.idx.blocks[study.harm_blocks[e.worst]].label.clone() };
                match &e.reject {
                    Some(w) => println!("    [{}] REJECTED: {w}", names.join(",")),
                    None => println!("    [{}] score {:+.1}, cut-through -{:.1}%, harm {:.0} on {}", names.join(","), e.score, e.reduction_pct, e.harm, worst),
                }
            }
        }
    }
}

/// One candidate scored alone.
pub struct SingleRow {
    pub cand: u16,
    pub reject: Option<String>,
    /// Through cars an hour, mean over the periods and seeds run.
    pub base_ct: f64,
    pub scen_ct: f64,
    pub reduction_pct: f64,
    /// Largest all-car rise on one block in any period (cars an hour, both directions), and the harm-block position of that block.
    pub rise: f64,
    pub rise_block: usize,
    pub score: f64,
}

/// What `score_singles` runs, in words: the periods, seeds and run length actually used.
pub fn singles_header(p: &Params) -> String {
    format!(
        "singles scored on period(s) {}, seed(s) {}, {} min runs (the screening length; --periods, --seeds and --screen-minutes set them), harm weight {}",
        p.periods.join(","),
        p.seeds.iter().map(|s| s.to_string()).collect::<Vec<_>>().join(","),
        p.screen_minutes,
        p.harm_weight
    )
}

/// Score every candidate alone over all of `p.periods` and `p.seeds` at the screening length, paired with baseline runs of the same
/// period, seed and length. Through cars is the mean over periods and seeds; the rise is the largest in any period (seed means).
pub fn score_singles(ctx: &Ctx) -> Vec<SingleRow> {
    let (study, p) = (ctx.study, ctx.p);
    let ns = p.seeds.len();
    let cells: Vec<(usize, usize)> = (0..p.periods.len()).flat_map(|pi| (0..ns).map(move |si| (pi, si))).collect();
    let base_runs = parallel_map(p.jobs, &cells, |&(pi, si)| run(study, &[], &p.periods[pi], p.seeds[si], p.screen_minutes, &[]));
    let base_stats: Vec<PeriodStat> = (0..p.periods.len()).map(|pi| period_stat(study, &base_runs[pi * ns..(pi + 1) * ns].iter().collect::<Vec<_>>())).collect();
    let ids: Vec<u16> = (0..ctx.cands.len() as u16).collect();
    let checks: Vec<Result<(), String>> = parallel_map(p.jobs, &ids, |&i| check_access_for(study, &ctx.ivs(&[i]), p.periods.iter().map(String::as_str)));
    let todo: Vec<u16> = ids.iter().copied().filter(|&i| checks[i as usize].is_ok()).collect();
    let jobs: Vec<(u16, usize, usize)> = todo.iter().flat_map(|&c| cells.iter().map(move |&(pi, si)| (c, pi, si))).collect();
    let outs = parallel_map(p.jobs, &jobs, |&(c, pi, si)| run(study, &ctx.ivs(&[c]), &p.periods[pi], p.seeds[si], p.screen_minutes, &[]));
    let mut rows: Vec<SingleRow> = Vec::new();
    for &i in &ids {
        if let Err(why) = &checks[i as usize] {
            rows.push(SingleRow { cand: i, reject: Some(why.clone()), base_ct: 0.0, scen_ct: 0.0, reduction_pct: 0.0, rise: 0.0, rise_block: 0, score: f64::NEG_INFINITY });
            continue;
        }
        let k = todo.iter().position(|&c| c == i).unwrap();
        let mine = &outs[k * cells.len()..(k + 1) * cells.len()];
        let (mut reject, mut rise, mut rise_block) = (None, f64::NEG_INFINITY, 0usize);
        let (mut worst_adj, mut worst_adj_block) = (0.0f64, 0usize);
        let (mut b_sum, mut s_sum) = (0.0, 0.0);
        for pi in 0..p.periods.len() {
            let runs: Vec<&RunOut> = mine[pi * ns..(pi + 1) * ns].iter().collect();
            if runs.iter().any(|r| r.invalid > 0) {
                reject = Some("invalid intervention".to_string());
            }
            let st = period_stat(study, &runs);
            reject = reject.or_else(|| run_reject(st.unroutable, st.gridlock, st.backlog, &base_stats[pi].lite()));
            let inc: Vec<f64> = st.block_flow.iter().zip(&base_stats[pi].block_flow).map(|(a, b)| a - b).collect();
            let h = harm_calc(&inc, &base_stats[pi].block_sigma);
            if h.raw_increase > rise {
                rise = h.raw_increase;
                rise_block = h.raw_worst;
            }
            if h.worst_adj > worst_adj {
                worst_adj = h.worst_adj;
                worst_adj_block = h.worst;
            }
            b_sum += base_stats[pi].ct_vph;
            s_sum += st.ct_vph;
        }
        let _ = worst_adj_block;
        let np = p.periods.len() as f64;
        let (base_ct, scen_ct) = (b_sum / np, s_sum / np);
        let red = reduction_pct(base_ct, scen_ct);
        rows.push(SingleRow { cand: i, reject, base_ct, scen_ct, reduction_pct: red, rise: rise.max(0.0), rise_block, score: score(p, red, worst_adj) });
    }
    rows
}

/// One row per candidate, best score first: type, label, link, through cars before -> after, largest all-car rise and its block, score.
pub fn print_singles(study: &Study, p: &Params, cands: &[Cand], rows: &[SingleRow], n_gen: usize) {
    let mut order: Vec<&SingleRow> = rows.iter().collect();
    order.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap_or(std::cmp::Ordering::Equal).then(a.cand.cmp(&b.cand)));
    for r in order {
        let c = &cands[r.cand as usize];
        let link = study.encode(std::slice::from_ref(&c.iv), Some(&p.periods[0]));
        let origin = if (r.cand as usize) < n_gen { "" } else { " [not in the candidate list]" };
        match &r.reject {
            Some(why) => println!("  #{} {} | {} | {link} | REJECTED: {why}{origin}", r.cand + 1, c.kind, c.label),
            None => println!(
                "  #{} {} | {} | {link} | through {:.1} -> {:.1} ({:+.1}%) | largest all-car rise {:+.0} on {} | score {:+.1}{origin}",
                r.cand + 1,
                c.kind,
                c.label,
                r.base_ct,
                r.scen_ct,
                -r.reduction_pct,
                r.rise,
                study.idx.blocks[study.harm_blocks[r.rise_block]].label,
                r.score
            ),
        }
    }
}

/// Scenario links for packages known only by the labels of their interventions (as an old report lists them), matched against the labels of
/// every intervention the candidate generator offers anywhere on the network. `Err` names the first label with no match.
pub fn links_from_labels(study: &Study, packages: &[Vec<String>]) -> Vec<Result<String, String>> {
    let hot = super::cands::Hotspots {
        block_ct: vec![1.0; study.idx.blocks.len()],
        node_ct: vec![1.0; study.net.nodes.len()],
        mv_ct: Default::default(),
    };
    let all = generate_with(study, &hot, usize::MAX / 4, &super::profile::Profile::unconstrained());
    packages
        .iter()
        .map(|labels| {
            let mut ivs = Vec::new();
            for l in labels {
                let c = all.iter().find(|c| c.label == *l).ok_or_else(|| format!("no intervention on this network is labeled \"{l}\""))?;
                ivs.push(c.iv.clone());
            }
            Ok(study.encode(&ivs, None))
        })
        .collect()
}
