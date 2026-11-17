//! Experimental supplementary search moves after the beam (change improve-proposal-search-coverage, D3). Off in production; the benchmark
//! runs them to measure whether they are worth their simulations.
//!
//! - Delete: each forwarded finalist with one intervention removed.
//! - Swap: each screened package with one intervention replaced by another design at the same place (a junction variant that lost the
//!   beam's same-place ranking can return inside a different package).
//! - Coordinated: pairs of candidates where one lies on a legal bypass of the other, whatever their single scores, then the best of those
//!   pairs grown by a third candidate linked to either member.
//!
//! Every package goes through `eval_batch`: the shared cache, the access check, the run rejections and the charged budget are the beam's own.
//! The order of every queue is fixed by the inputs, so a run is deterministic. All allowances and orders are ASSUMPTIONS under test.

use super::bench::finalists;
use super::cands::conflicts;
use super::search::*;
use super::Params;
use serde_json::{json, Value};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Move {
    Delete,
    Swap,
    Coordinated,
}

impl Move {
    pub fn id(self) -> &'static str {
        match self {
            Move::Delete => "delete",
            Move::Swap => "swap",
            Move::Coordinated => "coordinated",
        }
    }
    pub fn parse(s: &str) -> Option<Vec<Move>> {
        match s {
            "delete" => Some(vec![Move::Delete]),
            "swap" => Some(vec![Move::Swap]),
            "coordinated" => Some(vec![Move::Coordinated]),
            "all" => Some(vec![Move::Delete, Move::Swap, Move::Coordinated]),
            _ => None,
        }
    }
}

fn sorted(mut s: Vec<u16>) -> Vec<u16> {
    s.sort_unstable();
    s
}

fn legal(ctx: &Ctx, s: &[u16]) -> bool {
    !s.is_empty() && s.len() <= ctx.p.depth && s.iter().enumerate().all(|(a, &i)| s[a + 1..].iter().all(|&j| i != j && !conflicts(&ctx.cands[i as usize], &ctx.cands[j as usize])))
}

fn push(ctx: &Ctx, st: &SearchState, q: &mut Vec<Vec<u16>>, s: Vec<u16>) {
    let s = sorted(s);
    if legal(ctx, &s) && !st.cache.contains_key(&s) && !q.contains(&s) {
        q.push(s);
    }
}

fn by_score(st: &SearchState) -> Vec<usize> {
    let mut v: Vec<usize> = (0..st.evals.len()).filter(|&i| st.evals[i].valid()).collect();
    v.sort_by(|&a, &b| st.evals[b].score.total_cmp(&st.evals[a].score).then(st.evals[a].set.cmp(&st.evals[b].set)));
    v
}

fn deletions(ctx: &Ctx, st: &SearchState, known: &[Vec<u16>]) -> Vec<Vec<u16>> {
    let mut q = Vec::new();
    for i in finalists(ctx, st, known) {
        let f = &st.evals[i].set;
        if f.len() < 2 {
            continue;
        }
        for k in 0..f.len() {
            push(ctx, st, &mut q, f.iter().enumerate().filter(|(j, _)| *j != k).map(|(_, &c)| c).collect());
        }
    }
    q
}

fn swaps(ctx: &Ctx, st: &SearchState) -> Vec<Vec<u16>> {
    let mut q = Vec::new();
    let n = ctx.cands.len() as u16;
    for i in by_score(st) {
        let f = st.evals[i].set.clone();
        for &m in &f {
            let place = places_of(ctx, &[m]);
            for v in 0..n {
                if v != m && !f.contains(&v) && places_of(ctx, &[v]) == place {
                    push(ctx, st, &mut q, f.iter().map(|&c| if c == m { v } else { c }).collect());
                }
            }
        }
    }
    q
}

fn triples(ctx: &Ctx, st: &SearchState, pairs: &[((u16, u16), f64)]) -> Vec<Vec<u16>> {
    let mut q = Vec::new();
    let linked = |a: u16| -> Vec<u16> { pairs.iter().filter_map(|((x, y), _)| if *x == a { Some(*y) } else if *y == a { Some(*x) } else { None }).collect() };
    let mut started: Vec<usize> = pairs.iter().filter_map(|((a, b), _)| st.cache.get(&vec![*a, *b]).copied()).filter(|&i| st.evals[i].valid()).collect();
    started.sort_by(|&a, &b| st.evals[b].score.total_cmp(&st.evals[a].score).then(st.evals[a].set.cmp(&st.evals[b].set)));
    for i in started {
        let s = st.evals[i].set.clone();
        let mut third: Vec<u16> = s.iter().flat_map(|&m| linked(m)).filter(|c| !s.contains(c)).collect();
        third.sort_unstable();
        third.dedup();
        for c in third {
            let mut t = s.clone();
            t.push(c);
            push(ctx, st, &mut q, t);
        }
    }
    q
}

fn interleave(queues: &[&[Vec<u16>]]) -> Vec<Vec<u16>> {
    let mut out: Vec<Vec<u16>> = Vec::new();
    let longest = queues.iter().map(|q| q.len()).max().unwrap_or(0);
    for r in 0..longest {
        for q in queues {
            if let Some(s) = q.get(r) {
                if !out.contains(s) {
                    out.push(s.clone());
                }
            }
        }
    }
    out
}

/// Run the supplement on a state the beam has filled: at most `allowance` more charged simulations. `pairs` are the coordinated pairs
/// (`bypass::coordinated_pairs`), `known` the known packages forwarded as finalists. Returns a record of what it queued and evaluated.
pub fn run(ctx: &Ctx, st: &mut SearchState, moves: &[Move], allowance: usize, pairs: &[((u16, u16), f64)], known: &[Vec<u16>]) -> Value {
    let start = st.used;
    let p = Params { budget_evals: Some(start + allowance), ..ctx.p.clone() };
    let c2 = Ctx { study: ctx.study, p: &p, cands: ctx.cands, base: ctx.base };
    st.exhausted = false;
    let on = |m: Move| moves.contains(&m);
    let share = allowance.div_ceil(moves.len().max(1));
    let del = if on(Move::Delete) { deletions(&c2, st, known) } else { Vec::new() };
    let swp = if on(Move::Swap) { swaps(&c2, st) } else { Vec::new() };
    let mut prs: Vec<Vec<u16>> = Vec::new();
    if on(Move::Coordinated) {
        for ((a, b), _) in pairs {
            push(&c2, st, &mut prs, vec![*a, *b]);
        }
        prs.truncate(share.div_ceil(2));
    }
    let first = interleave(&[&del, &swp, &prs]);
    let before = st.evals.len();
    eval_batch(&c2, st, first.clone());
    let r1 = st.evals.len() - before;
    let mut second = Vec::new();
    if !st.exhausted {
        let rest = |q: &[Vec<u16>]| q.iter().filter(|s| !st.cache.contains_key(*s)).cloned().collect::<Vec<_>>();
        let (d2, s2) = (rest(&del), rest(&swp));
        let t = if on(Move::Coordinated) && ctx.p.depth >= 3 { triples(&c2, st, pairs) } else { Vec::new() };
        second = interleave(&[&d2, &s2, &t]);
        eval_batch(&c2, st, second.clone());
    }
    let origin = |s: &Vec<u16>| if del.contains(s) { "delete" } else if swp.contains(s) { "swap" } else { "coordinated" };
    let evaluated: Vec<Value> = st.evals[before..].iter().map(|e| json!({"set": e.set, "origin": origin(&e.set), "valid": e.valid(), "score": if e.valid() { Some(e.score) } else { None }})).collect();
    let rec = json!({
        "moves": moves.iter().map(|m| m.id()).collect::<Vec<_>>(),
        "allowance": allowance,
        "charged": st.used - start,
        "queued": {"delete": del.len(), "swap": swp.len(), "coordinatedPairs": prs.len(), "secondRound": second.len()},
        "firstRound": r1,
        "stop": if st.exhausted { "allowance" } else { "queues empty" },
        "evaluated": evaluated,
    });
    if let Some(t) = st.trace.as_mut() {
        t.push(json!({"event": "supplement", "record": rec.clone()}));
    }
    st.exhausted = false;
    rec
}
