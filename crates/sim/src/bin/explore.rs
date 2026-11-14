//! Search for packages of interventions that cut cut-through traffic on a study area's local streets with the least harm to any one
//! street. See `data/proposals/README.md` and `openspec/changes/proposals/`.
//!
//! cargo run --release -p traffic-sim --bin explore -- --area rockridge --periods pm_peak,am_peak --seeds 1,2,3 --beam 3 --depth 8 --candidates 40

use std::path::{Path, PathBuf};
use traffic_sim::explore::{profile, refs, report::explore, Params, Study};

fn usage(msg: &str) -> ! {
    if !msg.is_empty() {
        eprintln!("error: {msg}");
    }
    eprintln!(
        "usage: explore --area ID [--periods pm_peak,am_peak] [--seeds 1,2,3] [--beam 3] [--depth 8] [--candidates 40]\n\
         \x20              [--screen-minutes 30] [--minutes 60] [--budget-evals N] [--jobs N] [--harm-weight 0.1] [--expand 16]\n\
         \x20              [--finalists 12] [--options 5] [--out public/data/ID.proposals.json] [--report data/proposals/ID.md]\n\
         \x20              [--references data/proposals/ID.references.json] [--profile ID[,ID...]|all] [--profiles data/proposals/AREA.profiles.json] [--no-warm-start]"
    );
    std::process::exit(if msg.is_empty() { 0 } else { 2 });
}

fn main() {
    let argv: Vec<String> = std::env::args().skip(1).collect();
    let mut p = Params::new("rockridge");
    let (mut out, mut report, mut references): (Option<PathBuf>, Option<PathBuf>, Option<PathBuf>) = (None, None, None);
    let (mut profile_id, mut profiles_path): (Option<String>, Option<PathBuf>) = (None, None);
    let mut no_warm = false;
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
        i += 1;
        let v = argv.get(i).cloned().unwrap_or_else(|| usage(&format!("{k} needs a value")));
        let num = |what: &str| -> f64 { v.parse().unwrap_or_else(|_| usage(&format!("bad {what}"))) };
        match k {
            "--area" => p.area = v.clone(),
            "--periods" => p.periods = v.split(',').map(String::from).collect(),
            "--seeds" => p.seeds = v.split(',').map(|s| s.parse().unwrap_or_else(|_| usage("bad --seeds"))).collect(),
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
            "--out" => out = Some(PathBuf::from(v)),
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
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("../..");
    let study = Study::load(&root, &p.area).unwrap_or_else(|e| usage(&e));
    for per in &p.periods {
        if !study.demand.periods.iter().any(|d| &d.id == per) {
            usage(&format!("demand has no period {per}"));
        }
    }
    let out = out.unwrap_or_else(|| root.join(format!("public/data/{}.proposals.json", p.area)));
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
        let o = explore(&study, &p);
        let merged = profile::merge_file(existing.as_ref(), &p.area, o.json.clone(), &order, &unconstrained);
        std::fs::write(&out, serde_json::to_string_pretty(&merged).unwrap() + "\n").expect("write proposals");
        let section = profile::report_section(&o.markdown, &p.profile);
        let old_report = std::fs::read_to_string(&report).ok();
        std::fs::write(&report, profile::merge_report(old_report.as_deref(), &p.area, &section, &p.profile.id, &order, &unconstrained)).expect("write report");
        eprintln!("wrote group {} to {} and {}", p.profile.id, out.display(), report.display());
    }
}
