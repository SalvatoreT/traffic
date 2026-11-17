//! Finite-space proposal-search benchmark (change improve-proposal-search-coverage). See `data/search-benchmark/README.md`.
//!
//!   search_bench describe --case FILE                         decode the candidates, count the packages, check the inputs (no simulation)
//!   search_bench table    --case FILE --out FILE [--jobs N]   simulate every package (resumable; one results file at the end)
//!   search_bench verify   --case FILE --results FILE          check a results file against the case, the inputs and this build
//!   search_bench coverage --case FILE [--locations 40]        why each case candidate is or is not generated, and the bypass supplement
//!   search_bench evidence --case FILE --projection FILE       replay the beam on the audit's frozen screening table (no simulation)
//!   search_bench reproduce --case FILE --partial FILE --projection FILE   compare the first screening setting of a table run with the audit
//!   search_bench analyze  --case FILE --results FILE --out FILE   replay every search method and screening setting against the table
//!   search_bench confirm  --case FILE --results FILE --out FILE [--jobs N]   freeze the shortlist, then run it on the case's confirmation seeds
//!   search_bench decide   --analyses A,B,C --development CASE [--confirm X,Y,Z] [--out FILE]   apply the frozen adoption rules (design D9)
//!   search_bench spot     --case FILE --projection FILE --sets 1.7.9,2.4.5   rerun some of the audit's packages and compare
//! Every mode takes --root DIR (default: the current directory).

use serde_json::{json, Value};
use std::collections::BTreeMap;
use std::path::{Path, PathBuf};
use traffic_sim::explore::bench::{self, Case, Results};
use traffic_sim::explore::{bypass, cands, check_access, profile::Profile, run, Study};

fn die(msg: &str) -> ! {
    eprintln!("search-bench: {msg}");
    std::process::exit(2)
}

fn write_json(path: &Path, v: &Value) {
    if let Some(d) = path.parent() {
        let _ = std::fs::create_dir_all(d);
    }
    let tmp = path.with_extension("tmp");
    std::fs::write(&tmp, serde_json::to_vec_pretty(v).unwrap()).unwrap_or_else(|e| die(&format!("{}: {e}", tmp.display())));
    std::fs::rename(&tmp, path).unwrap_or_else(|e| die(&format!("{}: {e}", path.display())));
}

fn read_results(path: &Path) -> Results {
    serde_json::from_slice(&std::fs::read(path).unwrap_or_else(|e| die(&format!("{}: {e}", path.display())))).unwrap_or_else(|e| die(&format!("{}: {e}", path.display())))
}

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let Some(mode) = args.first().cloned() else { die("give a mode: describe, table, verify, coverage, evidence, analyze or confirm") };
    let mut opt: BTreeMap<String, String> = BTreeMap::new();
    let mut i = 1;
    while i < args.len() {
        let k = args[i].strip_prefix("--").unwrap_or_else(|| die(&format!("unexpected argument {}", args[i])));
        let v = args.get(i + 1).cloned().unwrap_or_else(|| die(&format!("--{k} needs a value")));
        opt.insert(k.into(), v);
        i += 2;
    }
    let root = PathBuf::from(opt.get("root").cloned().unwrap_or_else(|| ".".into()));
    if mode == "decide" {
        let read = |p: &str| -> Value { serde_json::from_slice(&std::fs::read(p).unwrap_or_else(|e| die(&format!("{p}: {e}")))).unwrap_or_else(|e| die(&format!("{p}: {e}"))) };
        let analyses: Vec<Value> = opt.get("analyses").unwrap_or_else(|| die("--analyses a.json,b.json is required")).split(',').map(read).collect();
        let confirm: std::collections::HashMap<String, Value> = opt.get("confirm").map(|c| c.split(',').map(read).map(|v| (v["case"].as_str().unwrap_or("").to_string(), v)).collect()).unwrap_or_default();
        let v = bench::decide(&analyses, opt.get("development").map(String::as_str).unwrap_or(""), &confirm);
        match opt.get("out") {
            Some(o) => write_json(Path::new(o), &v),
            None => println!("{}", serde_json::to_string_pretty(&v).unwrap()),
        }
        return;
    }
    let case_path = PathBuf::from(opt.get("case").unwrap_or_else(|| die("--case is required")));
    let (case, case_sha) = Case::load(&case_path).unwrap_or_else(|e| die(&e));
    let study = Study::load(&root, &case.area).unwrap_or_else(|e| die(&e));
    let jobs: usize = opt.get("jobs").map(|s| s.parse().unwrap_or_else(|_| die("--jobs is a number"))).unwrap_or(3);
    let out = opt.get("out").map(PathBuf::from);
    let ident = bench::identity(&study, &root, &case, &case_sha);
    if ident["inputsMatchCase"] != json!(true) {
        eprintln!("NOTE: the inputs differ from the case's frozen inputs; results are labeled as current-input results");
    }
    match mode.as_str() {
        "describe" => {
            let cs = bench::case_cands(&study, &case).unwrap_or_else(|e| die(&e));
            let (legal, bad) = bench::enumerate(&cs, case.depth);
            let known = case.known_sets().unwrap_or_else(|e| die(&e));
            let v = json!({
                "identity": ident,
                "candidates": cs.iter().zip(&case.candidates).enumerate().map(|(i, (c, s))| json!({"index": i, "id": s.id, "label": c.label, "kind": c.kind, "link": study.encode(std::slice::from_ref(&c.iv), None)})).collect::<Vec<_>>(),
                "packages": {"nonempty": legal.len() + bad.len(), "conflicting": bad.len(), "legal": legal.len()},
                "runKeys": case.run_keys().iter().map(|k| bench::key_name(*k)).collect::<Vec<_>>(),
                "baselineKeys": case.baseline_keys().iter().map(|k| bench::key_name(*k)).collect::<Vec<_>>(),
                "simulatedMinutesUpperBound": legal.len() as f64 * case.run_keys().iter().map(|k| k.minutes()).sum::<f64>() + case.baseline_keys().iter().map(|k| k.minutes()).sum::<f64>(),
                "known": known,
                "seedsFileInCase": seeds_in_case(&study, &root, &case, &cs),
            });
            println!("{}", serde_json::to_string_pretty(&v).unwrap());
        }
        "table" => {
            let out = out.unwrap_or_else(|| die("--out is required"));
            let max_runs = opt.get("max-runs").map(|s| s.parse().unwrap_or_else(|_| die("--max-runs is a number")));
            match bench::build_table(&study, &root, &case, &case_sha, &out, jobs, max_runs).unwrap_or_else(|e| die(&e)) {
                Some(r) => eprintln!("{}: complete, {} packages, written to {}", case.id, r.packages.len(), out.display()),
                None => eprintln!("{}: not complete yet; run the same command again to continue", case.id),
            }
        }
        "verify" => {
            let res = read_results(Path::new(opt.get("results").unwrap_or_else(|| die("--results is required"))));
            let problems = bench::verify(&res, &study, &root, &case, &case_sha);
            if problems.is_empty() {
                println!("{}: results match the case, the inputs and this simulator ({})", case.id, traffic_sim::FINGERPRINT);
            } else {
                die(&format!("results do not match:\n  - {}", problems.join("\n  - ")));
            }
        }
        "coverage" => {
            let n_loc: usize = opt.get("locations").map(|s| s.parse().unwrap_or_else(|_| die("--locations is a number"))).unwrap_or(40);
            let v = coverage(&study, &case, n_loc, &ident);
            match out {
                Some(o) => write_json(&o, &v),
                None => println!("{}", serde_json::to_string_pretty(&v).unwrap()),
            }
        }
        "evidence" => {
            let proj: Value = serde_json::from_slice(&std::fs::read(opt.get("projection").unwrap_or_else(|| die("--projection is required"))).unwrap_or_else(|e| die(&e.to_string()))).unwrap_or_else(|e| die(&e.to_string()));
            let v = bench::replay_evidence(&study, &case, &proj).unwrap_or_else(|e| die(&e));
            println!("{}", serde_json::to_string_pretty(&v).unwrap());
            if v["matches"] != json!(true) {
                std::process::exit(1);
            }
        }
        "spot" => {
            let proj: Value = serde_json::from_slice(&std::fs::read(opt.get("projection").unwrap_or_else(|| die("--projection is required"))).unwrap_or_else(|e| die(&e.to_string()))).unwrap_or_else(|e| die(&e.to_string()));
            let sets: Vec<Vec<u16>> = opt.get("sets").unwrap_or_else(|| die("--sets is required, e.g. 1.7.9,2.4.5")).split(',').map(|s| s.split('.').map(|x| x.parse().unwrap_or_else(|_| die("bad --sets"))).collect()).collect();
            let spec = &case.screen[0];
            let cs = bench::case_cands(&study, &case).unwrap_or_else(|e| die(&e));
            let bases: Vec<bench::RunSum> = traffic_sim::explore::parallel_map(jobs, &case.baseline_seeds, |&s| bench::RunSum::of(&study, &run(&study, &[], &case.period, s, spec.minutes, &[])));
            let base_refs: Vec<&bench::RunSum> = bases.iter().collect();
            let sigma = bench::block_sigma(&base_refs);
            let first: Vec<&bench::RunSum> = spec.seeds.iter().map(|s| &bases[case.baseline_seeds.iter().position(|b| b == s).unwrap()]).collect();
            let outs = traffic_sim::explore::parallel_map(jobs, &sets, |s| {
                let ivs: Vec<_> = s.iter().map(|&i| cs[i as usize].iv.clone()).collect();
                spec.seeds.iter().map(|&k| bench::RunSum::of(&study, &run(&study, &ivs, &case.period, k, spec.minutes, &[]))).collect::<Vec<_>>()
            });
            let rows: Vec<Value> = sets
                .iter()
                .zip(&outs)
                .map(|(s, o)| {
                    let e = bench::eval_runs(case.search.harm_weight, s, &first, &o.iter().collect::<Vec<_>>(), &sigma);
                    let rec = proj["evaluations"].as_array().and_then(|v| v.iter().find(|r| r["set"] == json!(s))).cloned().unwrap_or(Value::Null);
                    let d = |a: f64, k: &str| (a - rec[k].as_f64().unwrap_or(f64::NAN)).abs();
                    let worst = [d(e.reduction_pct, "reductionPct"), d(e.harm, "harm"), d(e.score, "score"), d(e.detour_s, "detourS")].iter().fold(0.0f64, |m, x| m.max(*x));
                    json!({"set": s, "now": {"reductionPct": e.reduction_pct, "harm": e.harm, "score": e.score, "detourS": e.detour_s}, "audit": {"reductionPct": rec["reductionPct"], "harm": rec["harm"], "score": rec["score"], "detourS": rec["detourS"]}, "maxAbsDiff": worst})
                })
                .collect();
            let identical = rows.iter().all(|r| r["maxAbsDiff"].as_f64() == Some(0.0));
            println!("{}", serde_json::to_string_pretty(&json!({"identity": ident, "setting": bench::setting_id(spec), "identical": identical, "rows": rows})).unwrap());
        }
        "reproduce" => {
            let proj: Value = serde_json::from_slice(&std::fs::read(opt.get("projection").unwrap_or_else(|| die("--projection is required"))).unwrap_or_else(|e| die(&e.to_string()))).unwrap_or_else(|e| die(&e.to_string()));
            let partial = PathBuf::from(opt.get("partial").unwrap_or_else(|| die("--partial is required (the table run's .partial.jsonl)")));
            let table = bench::table_from_partial(&study, &case, &partial, &case.screen[0]).unwrap_or_else(|e| die(&e));
            let mut v = bench::compare_with_evidence(&study, &case, table, &proj).unwrap_or_else(|e| die(&e));
            v["identity"] = ident.clone();
            println!("{}", serde_json::to_string_pretty(&v).unwrap());
        }
        "analyze" => {
            let res = read_results(Path::new(opt.get("results").unwrap_or_else(|| die("--results is required"))));
            let problems = bench::verify(&res, &study, &root, &case, &case_sha);
            if !problems.is_empty() {
                die(&format!("results do not match:\n  - {}", problems.join("\n  - ")));
            }
            let v = bench::analyze(&study, &case, &res);
            write_json(&out.unwrap_or_else(|| die("--out is required")), &v);
        }
        "confirm" => {
            let res = read_results(Path::new(opt.get("results").unwrap_or_else(|| die("--results is required"))));
            let problems = bench::verify(&res, &study, &root, &case, &case_sha);
            if !problems.is_empty() {
                die(&format!("results do not match:\n  - {}", problems.join("\n  - ")));
            }
            let out = out.unwrap_or_else(|| die("--out is required"));
            bench::confirm(&study, &case, &res, &out, jobs).unwrap_or_else(|e| die(&e));
        }
        _ => die(&format!("unknown mode {mode}")),
    }
}

/// Coverage of the case's candidates by the production generator, and what the bypass supplement adds.
fn coverage(study: &Study, case: &Case, n_loc: usize, ident: &Value) -> Value {
    let seed = case.baseline_seeds[0];
    eprintln!("baseline {} seed {seed}, {} min, with select-link records", case.period, case.full.minutes);
    let sel = traffic_sim::explore::search::nominated_links(study);
    let r = run(study, &[], &case.period, seed, case.full.minutes, &sel);
    let hot = cands::hotspots(study, &r.records, case.full.minutes / 60.0);
    let profile = Profile::unconstrained();
    let ranked = cands::ranked_locations(study, &hot);
    let kept = cands::kept_locations(&ranked, n_loc, &profile);
    let generated = cands::generate_with(study, &hot, n_loc, &profile);
    let cs = bench::case_cands(study, case).unwrap_or_else(|e| die(&e));
    let busiest = study.harm_blocks.iter().map(|&b| hot.block_ct[b]).fold(0.0, f64::max);
    let loc_rank = |l: cands::Loc| ranked.iter().position(|x| x.0 == l);
    let loc_json = |l: cands::Loc| {
        let pos = loc_rank(l);
        json!({"location": format!("{l:?}"), "throughTripsPerHour": pos.map(|p| ranked[p].1).unwrap_or(0.0), "rank": pos.map(|p| p + 1), "kept": kept.iter().any(|k| k.0 == l), "interior": pos.map(|p| ranked[p].2)})
    };
    let cutoff = kept.iter().map(|k| k.1).fold(f64::INFINITY, f64::min);
    let sup = bypass::supplement(study, &case.period, &generated, &profile, n_loc);
    let rows: Vec<Value> = cs
        .iter()
        .zip(&case.candidates)
        .map(|(c, spec)| {
            let present = generated.iter().position(|g| cands::same_intervention(study, &g.iv, &c.iv));
            let in_sup = sup.added.iter().find(|s| cands::same_intervention(study, &s.cand.iv, &c.iv));
            let mut why: Vec<String> = Vec::new();
            let mut where_ = Vec::new();
            if c.kind == "slow_street" {
                let run = c.iv.link.and_then(|l| traffic_sim::explore::street::street_run(&study.net, l));
                let top = run.as_ref().map(|r| r.blocks.iter().map(|b| hot.block_ct[study.idx.block_of_link[b[0] as usize]]).fold(0.0, f64::max)).unwrap_or(0.0);
                let share = if busiest > 0.0 { top / busiest } else { 0.0 };
                where_.push(json!({"busiestBlockThroughTripsPerHour": top, "shareOfBusiestBlock": share, "threshold": cands::SLOW_STREET_MIN_SHARE}));
                if present.is_none() && share < cands::SLOW_STREET_MIN_SHARE {
                    why.push(format!("Slow Street rule: the street's busiest block carries {:.0}% of the busiest block's through trips, below the {:.0}% threshold", share * 100.0, cands::SLOW_STREET_MIN_SHARE * 100.0));
                }
            } else {
                let locs: Vec<cands::Loc> = match c.block {
                    Some(b) => vec![cands::Loc::Block(b)],
                    None => c.nodes.iter().map(|&n| cands::Loc::Node(n)).collect(),
                };
                for l in locs {
                    let j = loc_json(l);
                    if present.is_none() {
                        if j["rank"].is_null() {
                            why.push(format!("{l:?}: no through trip of the baseline select-link records passes here"));
                        } else if j["kept"] == json!(false) {
                            why.push(format!("{l:?}: ranked {} by through trips ({:.1}/h), below the {n_loc} kept locations (cutoff {:.1}/h)", j["rank"], j["throughTripsPerHour"].as_f64().unwrap_or(0.0), cutoff));
                        } else {
                            why.push(format!("{l:?}: location kept, but the generator offers no {} there", c.kind));
                        }
                    }
                    where_.push(j);
                }
            }
            json!({
                "id": spec.id, "label": c.label, "kind": c.kind,
                "generated": present.is_some(), "generatedIndex": present,
                "supplement": in_sup.map(|s| json!({"fromCandidate": generated[s.from].label, "bypass": s.bypass.to_json()})),
                "why": why, "locations": where_,
            })
        })
        .collect();
    let added: Vec<Value> = sup
        .added
        .iter()
        .map(|s| json!({"label": s.cand.label, "kind": s.cand.kind, "link": study.encode(std::slice::from_ref(&s.cand.iv), None), "fromCandidate": generated[s.from].label, "bypass": s.bypass.to_json(), "access": check_access(study, std::slice::from_ref(&s.cand.iv)).err()}))
        .collect();
    let pairs = bypass::coordinated_pairs(study, &case.period, &cs);
    json!({
        "identity": ident,
        "period": case.period, "seed": seed, "minutes": case.full.minutes,
        "generator": {"locations": n_loc, "candidates": generated.len(), "rankedLocations": ranked.len(), "cutoffThroughTripsPerHour": cutoff},
        "caseCandidates": rows,
        "generatedCandidates": generated.iter().enumerate().map(|(i, c)| json!({"index": i, "label": c.label, "kind": c.kind, "iv": c.iv, "nodes": c.nodes, "block": c.block, "places": c.places, "xy": cand_xy(study, c)})).collect::<Vec<_>>(),
        "supplementCandidates": sup.added.iter().map(|x| json!({"label": x.cand.label, "kind": x.cand.kind, "iv": x.cand.iv, "nodes": x.cand.nodes, "block": x.cand.block, "places": x.cand.places, "xy": cand_xy(study, &x.cand)})).collect::<Vec<_>>(),
        "keptLocations": kept.iter().enumerate().map(|(i, (l, v))| json!({"rank": i + 1, "location": format!("{l:?}"), "throughTripsPerHour": v})).collect::<Vec<_>>(),
        "supplement": {"maxLocations": n_loc, "perCandidate": bypass::PER_CANDIDATE, "detourToleranceS": bypass::BYPASS_DETOUR_S, "added": added, "sameAsGenerated": sup.already.len(), "log": sup.log},
        "coordinatedPairs": pairs.iter().map(|((a, b), x)| json!({"pair": [a, b], "ids": [case.candidates[*a as usize].id, case.candidates[*b as usize].id], "extraCostS": x})).collect::<Vec<_>>(),
    })
}

/// Where a candidate acts, in network meters: its node, the middle of its block, or the middle of its street run.
fn cand_xy(study: &Study, c: &cands::Cand) -> [f64; 2] {
    let node_xy = |n: u32| [study.net.nodes[n as usize].x, study.net.nodes[n as usize].y];
    let links: Vec<u32> = match (c.block, c.kind) {
        (Some(b), _) => study.idx.blocks[b].links.clone(),
        (None, "slow_street") => c.iv.link.and_then(|l| traffic_sim::explore::street::street_run(&study.net, l)).map(|r| r.blocks.concat()).unwrap_or_default(),
        _ => Vec::new(),
    };
    if links.is_empty() {
        return c.nodes.first().map(|&n| node_xy(n)).unwrap_or([0.0, 0.0]);
    }
    let pts: Vec<[f64; 2]> = links.iter().flat_map(|&l| [node_xy(study.net.links[l as usize].from), node_xy(study.net.links[l as usize].to)]).collect();
    let n = pts.len() as f64;
    [pts.iter().map(|p| p[0]).sum::<f64>() / n, pts.iter().map(|p| p[1]).sum::<f64>() / n]
}

/// Packages of the area's seeds file (earlier published or hand-added packages) made only of the case's candidates, as candidate ids.
fn seeds_in_case(study: &Study, root: &Path, case: &Case, cs: &[cands::Cand]) -> Vec<Vec<String>> {
    let path = root.join(format!("data/proposals/{}.seeds.json", case.area));
    let Ok(file) = traffic_sim::explore::seeds::load(&path, &case.area) else { return Vec::new() };
    let (ok, _) = traffic_sim::explore::seeds::prepare(study, &file);
    let mut out: Vec<Vec<u16>> = Vec::new();
    for p in ok {
        let idx: Option<Vec<u16>> = p.ivs.iter().map(|iv| cs.iter().position(|c| cands::same_intervention(study, &c.iv, iv)).map(|i| i as u16)).collect();
        if let Some(mut s) = idx {
            s.sort_unstable();
            s.dedup();
            let legal = s.len() <= case.depth && s.iter().enumerate().all(|(a, &i)| s[a + 1..].iter().all(|&j| !cands::conflicts(&cs[i as usize], &cs[j as usize])));
            if legal && !out.contains(&s) {
                out.push(s);
            }
        }
    }
    out.iter().map(|s| s.iter().map(|&i| case.candidates[i as usize].id.clone()).collect()).collect()
}
