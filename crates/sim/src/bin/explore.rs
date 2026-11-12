//! Search for packages of interventions that cut cut-through traffic on a study area's local streets with the least harm to any one
//! street. See `data/proposals/README.md` and `openspec/changes/proposals/`.
//!
//! cargo run --release -p traffic-sim --bin explore -- --area rockridge --periods pm_peak,am_peak --seeds 1,2,3 --beam 3 --depth 8 --candidates 40

use std::path::{Path, PathBuf};
use traffic_sim::explore::{report::explore, Params, Study};

fn usage(msg: &str) -> ! {
    if !msg.is_empty() {
        eprintln!("error: {msg}");
    }
    eprintln!(
        "usage: explore --area ID [--periods pm_peak,am_peak] [--seeds 1,2,3] [--beam 3] [--depth 8] [--candidates 40]\n\
         \x20              [--screen-minutes 30] [--minutes 60] [--budget-evals N] [--jobs N] [--harm-weight 0.1] [--expand 16]\n\
         \x20              [--finalists 12] [--options 5] [--out public/data/ID.proposals.json] [--report data/proposals/ID.md]"
    );
    std::process::exit(if msg.is_empty() { 0 } else { 2 });
}

fn main() {
    let argv: Vec<String> = std::env::args().skip(1).collect();
    let mut p = Params::new("rockridge");
    let (mut out, mut report): (Option<PathBuf>, Option<PathBuf>) = (None, None);
    let mut i = 0;
    while i < argv.len() {
        let k = argv[i].as_str();
        if k == "-h" || k == "--help" {
            usage("");
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
    p.out = Some(out.clone());
    p.report = Some(report.clone());
    let o = explore(&study, &p);
    for path in [&out, &report] {
        if let Some(d) = path.parent() {
            std::fs::create_dir_all(d).expect("create output directory");
        }
    }
    std::fs::write(&out, serde_json::to_string_pretty(&o.json).unwrap() + "\n").expect("write proposals");
    std::fs::write(&report, &o.markdown).expect("write report");
    eprintln!("wrote {} and {}", out.display(), report.display());
}
