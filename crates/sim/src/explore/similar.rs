//! Near-duplicate options: which rechecked packages are variants of one another, which one is kept, and how the rest are described on the kept
//! option's card. Thresholds are assumptions; see `openspec/changes/simplify-proposals/design.md`.

use super::report::{beats, Final};
use super::search::{places_of, Ctx};
use std::cmp::Ordering;

/// ASSUMPTION: two packages whose per-block through-car changes differ by at most this share of the two changes' combined size are the same picture.
/// The distance is `sum |a - b| / (sum |a| + sum |b|)` over the side-street blocks: 0 for equal changes, 1 for opposite ones, and about 0.1 when
/// one is the other scaled by 1.22.
pub const PICTURE_DISTANCE_MAX: f64 = 0.10;

#[derive(Clone, Debug, PartialEq)]
pub enum Why {
    /// The packages act at the same places and differ only in the variant at one or more of them.
    Places,
    /// One differs from the other by at most one change (one added, dropped or swapped) and they cut through cars alike under the paired comparison.
    OneChange,
    /// Their per-block through-car changes are nearly the same; the distance is recorded.
    Picture(f64),
}

impl Why {
    pub fn key(&self) -> &'static str {
        match self {
            Why::Places => "same-places",
            Why::OneChange => "one-change",
            Why::Picture(_) => "same-picture",
        }
    }

    pub fn phrase(&self) -> String {
        match self {
            Why::Places => "acts at the same places and differs only in the variant at one of them".into(),
            Why::OneChange => "differs by at most one change and cuts through cars no differently on the paired comparison".into(),
            Why::Picture(d) => format!("changes through cars on the side-street blocks almost identically (distance {d:.2}, limit {PICTURE_DISTANCE_MAX:.2})"),
        }
    }
}

pub fn picture_distance(a: &[f64], b: &[f64]) -> Option<f64> {
    if a.is_empty() || a.len() != b.len() {
        return None;
    }
    let size: f64 = a.iter().chain(b).map(|x| x.abs()).sum();
    if size < 1e-9 {
        return None;
    }
    Some(a.iter().zip(b).map(|(x, y)| (x - y).abs()).sum::<f64>() / size)
}

fn one_change_apart(a: &[u16], b: &[u16]) -> bool {
    let only_a = a.iter().filter(|x| !b.contains(x)).count();
    let only_b = b.iter().filter(|x| !a.contains(x)).count();
    only_a <= 1 && only_b <= 1
}

/// Whether two rechecked packages count as near-duplicates, and why.
pub fn similar(a: &Final, b: &Final) -> Option<Why> {
    if !a.places.is_empty() && a.places == b.places {
        return Some(Why::Places);
    }
    if one_change_apart(&a.set, &b.set) && !beats(a, b) && !beats(b, a) {
        return Some(Why::OneChange);
    }
    picture_distance(&a.block_change, &b.block_change).filter(|d| *d <= PICTURE_DISTANCE_MAX).map(Why::Picture)
}

fn r1(x: f64) -> f64 {
    (x * 10.0).round() / 10.0
}

fn tenths(x: f64) -> i64 {
    (x * 10.0).round() as i64
}

/// The largest rise in all cars on one side-street block in any period, cars an hour as published (0 when none rises).
pub fn rise(f: &Final) -> f64 {
    f.by_period.iter().map(|r| r1(r.block_scen - r.block_base)).fold(0.0, f64::max)
}

/// Through cars removed an hour, as published to one decimal.
pub fn removed(f: &Final) -> f64 {
    r1(r1(f.base_vph) - r1(f.scen_vph))
}

/// The order of the published options: most through cars removed first; ties go to fewer changes, then the smaller largest all-car rise.
pub fn order_options(a: &Final, b: &Final) -> Ordering {
    tenths(removed(b)).cmp(&tenths(removed(a))).then(a.set.len().cmp(&b.set.len())).then(tenths(rise(a)).cmp(&tenths(rise(b))))
}

/// Which of two similar packages is kept: the one that cuts more through cars when it wins the paired comparison, else the one with fewer
/// changes, then the smaller largest all-car rise, then the one an earlier search published, then the earlier finalist.
fn keeps(finals: &[Final], i: usize, j: usize) -> bool {
    let (a, b) = (&finals[i], &finals[j]);
    if beats(a, b) {
        return true;
    }
    if beats(b, a) {
        return false;
    }
    a.set.len().cmp(&b.set.len()).then(tenths(rise(a)).cmp(&tenths(rise(b)))).then(b.prior.cmp(&a.prior)).then(i.cmp(&j)) == Ordering::Less
}

#[derive(Clone, Debug, PartialEq)]
pub struct Fold {
    pub from: usize,
    pub into: usize,
    pub why: Why,
}

/// Fold near-duplicates among `keep` (finalist indices) into one each. Candidates are taken in the published order, so the result does not
/// depend on the order of `keep`. Returns the survivors and a fold for every package that disappeared, each pointing at a survivor.
pub fn dedupe(finals: &[Final], keep: &[usize]) -> (Vec<usize>, Vec<Fold>) {
    let mut order: Vec<usize> = keep.to_vec();
    order.sort_by(|&a, &b| order_options(&finals[a], &finals[b]).then(a.cmp(&b)));
    let mut kept: Vec<usize> = Vec::new();
    let mut folds: Vec<Fold> = Vec::new();
    for c in order {
        let sims: Vec<(usize, Why)> = kept.iter().filter_map(|&k| similar(&finals[c], &finals[k]).map(|w| (k, w))).collect();
        if sims.is_empty() {
            kept.push(c);
            continue;
        }
        if sims.iter().all(|(k, _)| keeps(finals, c, *k)) {
            for (k, w) in sims {
                kept.retain(|&x| x != k);
                for f in folds.iter_mut().filter(|f| f.into == k) {
                    f.into = c;
                }
                folds.push(Fold { from: k, into: c, why: w });
            }
            kept.push(c);
        } else if let Some((k, w)) = sims.into_iter().find(|(k, _)| keeps(finals, *k, c)) {
            folds.push(Fold { from: c, into: k, why: w });
        }
    }
    (kept, folds)
}

/// One plain line per difference between a variant and the kept package: a variant swapped in at one place, a change to add, a change to drop.
pub fn differences(ctx: &Ctx, kept: &[u16], variant: &[u16]) -> Vec<String> {
    let label = |c: u16| ctx.cands[c as usize].label.clone();
    let place = |c: u16| places_of(ctx, &[c]).remove(0);
    let mut drops: Vec<u16> = kept.iter().copied().filter(|c| !variant.contains(c)).collect();
    let mut adds: Vec<u16> = variant.iter().copied().filter(|c| !kept.contains(c)).collect();
    let mut out = Vec::new();
    for d in drops.clone() {
        if let Some(pos) = adds.iter().position(|&a| place(a) == place(d)) {
            out.push(format!("Use {} instead of {}", label(adds.remove(pos)), label(d)));
            drops.retain(|&x| x != d);
        }
    }
    out.extend(drops.iter().map(|&d| format!("Drop: {}", label(d))));
    out.extend(adds.iter().map(|&a| format!("Add: {}", label(a))));
    if out.is_empty() {
        out.push("Same changes in another order".into());
    }
    out
}
