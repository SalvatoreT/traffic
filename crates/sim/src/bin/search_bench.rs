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
    let sup = bypass::supplement(study, &case.period, &generated, &profile, n_loc / 2);
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
        "supplement": {"maxLocations": n_loc / 2, "perCandidate": bypass::PER_CANDIDATE, "detourToleranceS": bypass::BYPASS_DETOUR_S, "added": added, "sameAsGenerated": sup.already.len(), "log": sup.log},
        "coordinatedPairs": pairs.iter().map(|((a, b), x)| json!({"pair": [a, b], "ids": [case.candidates[*a as usize].id, case.candidates[*b as usize].id], "extraCostS": x})).collect::<Vec<_>>(),
    })
}
