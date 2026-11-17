//! Search for packages of interventions that cut cut-through traffic on a study area's local streets with the least harm to any one
//! street. See `data/proposals/README.md` and `openspec/changes/proposals/`.
//!
//! cargo run --release -p traffic-sim --bin explore -- --area rockridge --periods pm_peak,am_peak --seeds 1,2,3 --beam 3 --depth 8 --candidates 40

use std::path::{Path, PathBuf};
use traffic_sim::explore::{annotate, objectives, profile, refs, report::explore, seeds, util, Params, Study};

fn usage(msg: &str) -> ! {
    if !msg.is_empty() {
        eprintln!("error: {msg}");
    }
    eprintln!(
        "usage: explore --area ID [--periods pm_peak,am_peak] [--seeds 1-10] [--beam 3] [--depth 8] [--candidates 40]\n\
         \x20              [--confirm-seeds 101-110] [--no-confirm]   (defaults: --seeds 1-3 --confirm-seeds 101-110; seeds accept lists or ranges: 1-10)\n\
         \x20              [--screen-minutes 30] [--minutes 60] [--budget-evals N] [--jobs N] [--harm-weight 0.1] [--expand 16]\n\
         \x20              [--finalists 12] [--options 6] [--objectives all|most-removed,no-closures,least-detour,fewest-changes] [--out public/data/ID.proposals.json] [--report data/proposals/ID.md]\n\
         \x20              [--references data/proposals/ID.references.json] [--profile ID[,ID...]|all] [--profiles FILE]   (optional limits; none are published) [--no-warm-start]\n\
         \x20              [--known data/proposals/ID.seeds.json] [--no-known]   known packages to recheck and start from (each run adds its published options)\n\
         \x20              [--check LINK ...] [--check-subsets] [--check-singles]   score given scenario links, or with --check-singles every candidate alone, by the search's own code, then print and exit (nothing is written)\n\
         \x20              [--add-seed LINK [--note TEXT] [--published-on DATE]] [--seed-proposals FILE] [--seed-labels FILE]   add to the seeds file, then exit\n\
         \x20              [--annotate]   add per-link pictures to the existing --out file (re-simulates the published packages; no search)"
    );
    std::process::exit(if msg.is_empty() { 0 } else { 2 });
}

/// `1,2,3`, or a range `1-10` (consecutive values: a continuous range with a fixed increment, as [TfL-TMG4, 7.5.1] expects).
fn seed_list(v: &str, what: &str) -> Vec<u64> {
    let bad = || usage(&format!("bad {what}"));
    match v.split_once('-') {
        Some((a, b)) => {
            let (a, b): (u64, u64) = (a.parse().unwrap_or_else(|_| bad()), b.parse().unwrap_or_else(|_| bad()));
            if a > b {
                bad();
            }
            (a..=b).collect()
        }
        None => v.split(',').map(|s| s.parse().unwrap_or_else(|_| bad())).collect(),
    }
}

fn main() {
    let argv: Vec<String> = std::env::args().skip(1).collect();
    let mut p = Params::new("rockridge");
    // The default run is the whole job: search on seeds 1-3, then confirm the shortlist on ten seeds that took no part in the search.
    p.seeds = vec![1, 2, 3];
    p.confirm_seeds = (101..=110).collect();
    let (mut out, mut report, mut references): (Option<PathBuf>, Option<PathBuf>, Option<PathBuf>) = (None, None, None);
    let (mut profile_id, mut profiles_path): (Option<String>, Option<PathBuf>) = (None, None);
    let mut no_warm = false;
    let mut no_known = false;
    let mut add_seed: Vec<String> = Vec::new();
    let mut seed_note = String::new();
    let mut seed_published = String::new();
    let mut seed_labels: Option<PathBuf> = None;
    let mut seed_files: Vec<PathBuf> = Vec::new();
    let mut known_path: Option<PathBuf> = None;
    let mut annotate = false;
    let mut check: Vec<String> = Vec::new();
    let mut check_subsets = false;
    let mut check_singles = false;
    let mut out_given = false;
    let mut i = 0;
    while i < argv.len() {
        let k = argv[i].as_str();
        if k == "-h" || k == "--help" {
            usage("");
        }
        if k == "--no-warm-start" {
            no_warm = true;
            i += 1;
            continue;
        }
        if k == "--no-confirm" {
            p.confirm_seeds = Vec::new();
            i += 1;
            continue;
        }
        if k == "--no-known" {
            no_known = true;
            i += 1;
            continue;
        }
        if k == "--annotate" {
            annotate = true;
            i += 1;
            continue;
        }
        if k == "--check-singles" {
            check_singles = true;
            i += 1;
            continue;
        }
        if k == "--check-subsets" {
            check_subsets = true;
            i += 1;
            continue;
        }
        i += 1;
        let v = argv.get(i).cloned().unwrap_or_else(|| usage(&format!("{k} needs a value")));
        let num = |what: &str| -> f64 { v.parse().unwrap_or_else(|_| usage(&format!("bad {what}"))) };
        match k {
            "--area" => p.area = v.clone(),
            "--periods" => p.periods = v.split(',').map(String::from).collect(),
            "--seeds" => p.seeds = seed_list(&v, "--seeds"),
            "--confirm-seeds" => p.confirm_seeds = seed_list(&v, "--confirm-seeds"),
            "--beam" => p.beam = num("--beam") as usize,
            "--depth" => p.depth = num("--depth") as usize,
            "--candidates" => p.candidates = num("--candidates") as usize,
            "--screen-minutes" => p.screen_minutes = num("--screen-minutes"),
            "--minutes" => p.minutes = num("--minutes"),
            "--budget-evals" => p.budget_evals = Some(num("--budget-evals") as usize),
            "--jobs" => p.jobs = (num("--jobs") as usize).max(1),
            "--harm-weight" => p.harm_weight = num("--harm-weight"),
            "--expand" => p.expand = num("--expand") as usize,
            "--finalists" => p.finalists = num("--finalists") as usize,
            "--options" => p.options = num("--options") as usize,
            "--objectives" => {
                p.objectives = if v == "all" {
                    objectives::ALL.to_vec()
                } else {
                    v.split(',').map(|i| objectives::Objective::from_id(i.trim()).unwrap_or_else(|| usage(&format!("unknown objective {i}; one of most-removed, no-closures, least-detour, fewest-changes, or all")))).collect()
                }
            }
            "--add-seed" => add_seed.push(v.clone()),
            "--note" => seed_note = v.clone(),
            "--published-on" => seed_published = v.clone(),
            "--seed-proposals" => seed_files.push(PathBuf::from(v)),
            "--seed-labels" => seed_labels = Some(PathBuf::from(v)),
            "--known" => known_path = Some(PathBuf::from(v)),
            "--check" => check.push(v.clone()),
            "--out" => {
                out = Some(PathBuf::from(v));
                out_given = true;
            }
            "--report" => report = Some(PathBuf::from(v)),
            "--references" => references = Some(PathBuf::from(v)),
            "--profile" => profile_id = Some(v.clone()),
            "--profiles" => profiles_path = Some(PathBuf::from(v)),
            _ => usage(&format!("unknown argument {k}")),
        }
        i += 1;
    }
    if p.periods.is_empty() || p.seeds.is_empty() || p.beam == 0 || p.depth == 0 {
        usage("periods, seeds, beam and depth must be non-empty / positive");
    }
    if p.confirm_seeds.iter().any(|s| p.seeds.contains(s)) {
        usage("--confirm-seeds must not overlap --seeds: confirmation needs seeds that took no part in the search");
    }
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("../..");
    p.source_revision = traffic_sim::explore::provenance::source_revision(&root);
    let study = Study::load(&root, &p.area).unwrap_or_else(|e| usage(&e));
    for per in &p.periods {
        if !study.demand.periods.iter().any(|d| &d.id == per) {
            usage(&format!("demand has no period {per}"));
        }
    }
    let out = out.unwrap_or_else(|| root.join(format!("public/data/{}.proposals.json", p.area)));
    if !add_seed.is_empty() || seed_labels.is_some() || !seed_files.is_empty() {
        let known_file = known_path.clone().unwrap_or_else(|| root.join(format!("data/proposals/{}.seeds.json", p.area)));
        let mut f = seeds::load(&known_file, &p.area).unwrap_or_else(|e| usage(&e));
        let today = util::today_utc();
        let mut entry = |link: String, source: &str, note: String, date: String, group: String, change: Option<f64>| {
            let ivs = traffic_sim::explore::decode::decode_scenario(&study.net, &study.topo, study.origin, &link).unwrap_or_else(|e| usage(&format!("{link}: {e}")));
            let e = seeds::Entry { link, source: source.into(), note, added: date.clone(), last_published: if source == seeds::SOURCE_HAND { seed_published.clone() } else { date }, group, size: ivs.len(), change_pct: change, score: None };
            let added = seeds::add(&mut f, e.clone());
            eprintln!("{} {}", if added { "added" } else { "already there:" }, e.link);
        };
        for l in &add_seed {
            entry(l.clone(), seeds::SOURCE_HAND, seed_note.clone(), today.clone(), String::new(), None);
        }
        for path in &seed_files {
            let file: serde_json::Value = serde_json::from_str(&std::fs::read_to_string(path).unwrap_or_else(|e| usage(&format!("{}: {e}", path.display())))).unwrap_or_else(|e| usage(&format!("{}: {e}", path.display())));
            for g in file["groups"].as_array().into_iter().flatten() {
                for pr in g["proposals"].as_array().into_iter().flatten().filter(|pr| pr["kind"] == "search") {
                    let Some(link) = pr["link"].as_str() else { continue };
                    let date = g["computed"]["date"].as_str().unwrap_or(&today).to_string();
                    let note = format!("published by an earlier search (group {}, option {}, {} through-car change {}%)", g["id"].as_str().unwrap_or(""), pr["id"].as_str().unwrap_or(""), date, pr["cutThrough"]["changePct"]);
                    entry(link.to_string(), seeds::SOURCE_SEARCH, note, date, g["id"].as_str().unwrap_or("").to_string(), pr["cutThrough"]["changePct"].as_f64());
                }
            }
        }
        if let Some(path) = &seed_labels {
            let list: Vec<serde_json::Value> = serde_json::from_str(&std::fs::read_to_string(path).unwrap_or_else(|e| usage(&format!("{}: {e}", path.display())))).unwrap_or_else(|e| usage(&format!("{}: {e}", path.display())));
            let pkgs: Vec<Vec<String>> = list.iter().map(|v| v["labels"].as_array().map(|a| a.iter().filter_map(|x| x.as_str().map(String::from)).collect()).unwrap_or_default()).collect();
            for (v, r) in list.iter().zip(traffic_sim::explore::check::links_from_labels(&study, &pkgs)) {
                match r {
                    Ok(link) => entry(link, seeds::SOURCE_SEARCH, v["note"].as_str().unwrap_or("").into(), v["date"].as_str().unwrap_or(&today).into(), v["group"].as_str().unwrap_or("").into(), None),
                    Err(why) => eprintln!("skipped: {why}"),
                }
            }
        }
        seeds::enforce_cap(&mut f, "");
        std::fs::write(&known_file, seeds::to_json(&f)).expect("write seeds");
        eprintln!("seeds file {}: {} package(s)", known_file.display(), f.seeds.len());
        return;
    }
    if !check.is_empty() || check_singles || check_subsets {
        if out_given || report.is_some() {
            usage("--check, --check-subsets and --check-singles only print; they write no proposals or report file, so --out and --report do not apply");
        }
        let profiles_file = profiles_path.clone().unwrap_or_else(|| root.join(format!("data/proposals/{}.profiles.json", p.area)));
        let profiles = if profiles_file.exists() { profile::load(&profiles_file).unwrap_or_else(|e| usage(&e)) } else { Vec::new() };
        p.profile = profile::choose(&profiles, profile_id.as_deref().filter(|i| *i != profile::UNCONSTRAINED)).unwrap_or_else(|e| usage(&e));
        traffic_sim::explore::check::check_links(&study, &p, &check, check_subsets, check_singles);
        return;
    }
    if annotate {
        let text = std::fs::read_to_string(&out).unwrap_or_else(|e| usage(&format!("cannot read {}: {e}", out.display())));
        let mut file: serde_json::Value = serde_json::from_str(&text).unwrap_or_else(|e| usage(&format!("{}: {e}", out.display())));
        let t0 = std::time::Instant::now();
        let s = annotate::annotate(&study, &mut file, p.jobs).unwrap_or_else(|e| usage(&e));
        std::fs::write(&out, util::pretty_json(&file)).expect("write proposals");
        eprintln!("annotated {} package(s) in {} group(s) from {} run(s) in {:.0}s; wrote {}", s.packages, s.groups, s.runs, t0.elapsed().as_secs_f64(), out.display());
        return;
    }
    let report = report.unwrap_or_else(|| root.join(format!("data/proposals/{}.md", p.area)));
    let profiles_file = profiles_path.clone().unwrap_or_else(|| root.join(format!("data/proposals/{}.profiles.json", p.area)));
    let profiles = if profiles_file.exists() || profiles_path.is_some() {
        profile::load(&profiles_file).unwrap_or_else(|e| usage(&e))
    } else if profile_id.is_some() {
        usage(&format!("no profiles file at {}", profiles_file.display()))
    } else {
        Vec::new()
    };
    let order = profile::order(&profiles);
    let unconstrained = profile::choose(&profiles, None).unwrap_or_else(|e| usage(&e));
    // `--profile all` runs every profile in file order (stricter limits first, the unconstrained group last); a comma list runs those in the order given.
    let ids: Vec<Option<String>> = match profile_id.as_deref() {
        Some("all") => order.iter().map(|i| Some(i.clone())).collect(),
        Some(list) => list.split(',').map(|i| Some(i.trim().to_string())).collect(),
        None => vec![None],
    };
    let ref_path = references.clone().unwrap_or_else(|| root.join(format!("data/proposals/{}.references.json", p.area)));
    for path in [&out, &report] {
        if let Some(d) = path.parent() {
            std::fs::create_dir_all(d).expect("create output directory");
        }
    }
    for id in ids {
        p.profile = profile::choose(&profiles, id.as_deref().filter(|i| *i != profile::UNCONSTRAINED)).unwrap_or_else(|e| usage(&e));
        p.references = Vec::new();
        if !p.profile.is_constrained() && (ref_path.exists() || references.is_some()) {
            p.references = refs::load(&ref_path).unwrap_or_else(|e| usage(&e));
            for r in &p.references {
                refs::resolve(&study, r).unwrap_or_else(|e| usage(&e));
            }
        }
        p.out = Some(out.clone());
        p.report = Some(report.clone());
        let existing = std::fs::read_to_string(&out).ok().and_then(|t| serde_json::from_str::<serde_json::Value>(&t).ok());
        p.warm_start = if no_warm { Vec::new() } else { profile::warm_packages(existing.as_ref(), &study, &p.profile.id) };
        if !p.warm_start.is_empty() {
            eprintln!("warm start: {} package(s) from the other group(s) of {}", p.warm_start.len(), out.display());
        }
        let known_file = known_path.clone().unwrap_or_else(|| root.join(format!("data/proposals/{}.seeds.json", p.area)));
        let mut seed_file = if no_known { seeds::SeedFile::empty(&p.area) } else { seeds::load(&known_file, &p.area).unwrap_or_else(|e| usage(&e)) };
        let (known, dropped) = seeds::prepare(&study, &seed_file);
        p.known = known;
        p.known_dropped = dropped;
        let o = explore(&study, &p);
        if !no_known {
            seeds::record(&mut seed_file, o.published.clone(), &util::today_utc());
            std::fs::write(&known_file, seeds::to_json(&seed_file)).expect("write seeds");
            eprintln!("seeds file {}: {} package(s)", known_file.display(), seed_file.seeds.len());
        }
        // Without --profile the run is the whole proposals list: it replaces the file instead of joining other groups.
        let merged = profile::merge_file(if profile_id.is_some() { existing.as_ref() } else { None }, &p.area, o.json.clone(), &order, &unconstrained);
        std::fs::write(&out, util::pretty_json(&merged)).expect("write proposals");
        let section = profile::report_section(&o.markdown, &p.profile);
        let old_report = if profile_id.is_some() { std::fs::read_to_string(&report).ok() } else { None };
        std::fs::write(&report, profile::merge_report(old_report.as_deref(), &p.area, &section, &p.profile.id, &order, &unconstrained)).expect("write report");
        eprintln!("wrote group {} to {} and {}", p.profile.id, out.display(), report.display());
    }
}
