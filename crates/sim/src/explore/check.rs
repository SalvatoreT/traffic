//! Score given packages by the search's own code paths: the access check, the profile's limits, the candidate list, the screening run
//! and the full recheck. Used to find out why a package the search published before is not found now (`explore --check`).

use super::cands::{adopt, generate_with, profile_allows};
use super::decode::decode_scenario;
use super::report::{recheck, Final};
use super::search::*;
use super::*;

/// Print how the search treats each package link: per intervention, whether the profile allows it and whether the candidate list holds it;
/// whether the package passes the access check; its full recheck over every period and seed; and, with `subsets`, the screening score of
/// every non-empty subset (one period, one seed, shortened run), which shows whether a beam could reach the package.
pub fn check_links(study: &Study, p: &Params, links: &[String], subsets: bool, singles: bool) {
    let base = run_baseline(study, p);
    let mut cands = generate_with(study, &base.hot, p.candidates, &p.profile);
    let n_gen = cands.len();
    println!("candidate list: {n_gen} candidates under profile {}", p.profile.id);
    let mut sets: Vec<Vec<u16>> = Vec::new();
    for link in links {
        let ivs = match decode_scenario(&study.net, &study.topo, study.origin, link) {
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
        match check_access(study, &ivs) {
            Ok(()) => println!("  access check: passes"),
            Err(e) => println!("  access check: fails, {e}"),
        }
        sets.push(set);
    }
    let ctx = Ctx { study, p, cands: &cands, base: &base };
    if singles {
        let mut st = SearchState::new();
        eval_batch(&ctx, &mut st, (0..cands.len() as u16).map(|i| vec![i]).collect());
        let ok: Vec<u16> = (0..cands.len() as u16).filter(|&i| st.evals[st.cache[&vec![i]]].valid()).collect();
        let ev = |i: u16| &st.evals[st.cache[&vec![i]]];
        let mut by_score = ok.clone();
        by_score.sort_by(|&a, &b| ev(b).score.partial_cmp(&ev(a).score).unwrap().then(a.cmp(&b)));
        let mut by_red = ok.clone();
        by_red.sort_by(|&a, &b| ev(b).reduction_pct.partial_cmp(&ev(a).reduction_pct).unwrap().then(a.cmp(&b)));
        println!("\nsingles: {} valid of {} candidates (expand takes the best {} by score with a reduction)", ok.len(), cands.len(), p.expand);
        for (name, order) in [("score", &by_score), ("reduction", &by_red)] {
            println!("  top 15 by {name}:");
            for (r, &i) in order.iter().take(15).enumerate() {
                println!("    {:3}. score {:+.1}, cut-through -{:.1}%, harm {:.0}: {}", r + 1, ev(i).score, ev(i).reduction_pct, ev(i).harm, cands[i as usize].label);
            }
        }
        for set in &sets {
            for &i in set {
                if (i as usize) < n_gen && ok.contains(&i) {
                    let (rs, rr) = (by_score.iter().position(|&x| x == i).unwrap() + 1, by_red.iter().position(|&x| x == i).unwrap() + 1);
                    println!("  {}: rank {rs} by score, {rr} by reduction (score {:+.1}, -{:.1}%, harm {:.0})", cands[i as usize].label, ev(i).score, ev(i).reduction_pct, ev(i).harm);
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
