//! Paired effect estimates over seeds (design D2 of `proposal-evidence-integrity`).
//!
//! Every scenario run is paired with the baseline run that has the same period and seed. An effect is the mean of the per-seed
//! differences with a two-sided Student t interval on those differences; an option-to-option difference pairs the two scenarios on
//! the same seeds. The interval covers seed variability under fixed model inputs. It does not cover calibration error, demand error
//! or day-to-day variation in real traffic.

use serde_json::{json, Value};

/// Version of the reporting method: the pairing, the aggregation, the interval and the selection rules. Bump it when any of them
/// changes so a reader can tell figures made under another method (the simulator fingerprint does not cover this module).
pub const REPORT_METHOD: &str = "paired-t-1";

/// Confidence level of every interval. ASSUMPTION: 95%, the level used for the intervals in [WebTAG-M3.1, C.3.14].
pub const LEVEL: f64 = 0.95;

/// Fewest seed pairs for which a comparison makes a statement. [WebTAG-M3.1, C.9.1] gives 10 runs as a starting point, not a
/// guarantee of precision; [TfL-TMG4, 7.5.1] expects 20 for a validated model. ASSUMPTION: 10 for the final comparison.
pub const MIN_PAIRS: usize = 10;

/// Two-sided 95% critical values of Student's t, degrees of freedom 1 to 60 [NIST-Handbook, 1.3.6.7.2].
const T975: [f64; 60] = [
    12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145, 2.131, 2.120, 2.110, 2.101, 2.093, 2.086, 2.080, 2.074, 2.069, 2.064, 2.060, 2.056, 2.052, 2.048, 2.045,
    2.042, 2.040, 2.037, 2.035, 2.032, 2.030, 2.028, 2.026, 2.024, 2.023, 2.021, 2.020, 2.018, 2.017, 2.015, 2.014, 2.013, 2.012, 2.011, 2.010, 2.009, 2.008, 2.007, 2.006, 2.005, 2.004, 2.003, 2.002, 2.002,
    2.001, 2.000,
];

/// Critical value for `df` degrees of freedom. Beyond the table the value at 60 degrees is used, which is slightly wide.
pub fn t_crit(df: usize) -> f64 {
    match df {
        0 => f64::INFINITY,
        d => T975[(d - 1).min(T975.len() - 1)],
    }
}

/// What an interval says about the sign of an effect.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Status {
    /// The interval is above zero.
    Positive,
    /// The interval is below zero.
    Negative,
    /// The interval includes zero: the data do not resolve the sign.
    Unresolved,
    /// Fewer than `MIN_PAIRS` pairs: no statement is made.
    Insufficient,
}

impl Status {
    pub fn as_str(self) -> &'static str {
        match self {
            Status::Positive => "positive",
            Status::Negative => "negative",
            Status::Unresolved => "unresolved",
            Status::Insufficient => "insufficient",
        }
    }
}

/// Mean of paired differences, their sample standard deviation and the interval half width (absent below two pairs).
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Paired {
    pub n: usize,
    pub mean: f64,
    pub sd: f64,
    pub half: Option<f64>,
}

impl Paired {
    pub fn none() -> Paired {
        Paired { n: 0, mean: 0.0, sd: 0.0, half: None }
    }

    pub fn of(d: &[f64]) -> Paired {
        let n = d.len();
        if n == 0 {
            return Paired::none();
        }
        let mean = d.iter().sum::<f64>() / n as f64;
        if n < 2 {
            return Paired { n, mean, sd: 0.0, half: None };
        }
        let sd = (d.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / (n - 1) as f64).sqrt();
        Paired { n, mean, sd, half: Some(t_crit(n - 1) * sd / (n as f64).sqrt()) }
    }

    pub fn interval(&self) -> Option<(f64, f64)> {
        self.half.map(|h| (self.mean - h, self.mean + h))
    }

    pub fn status(&self) -> Status {
        match (self.n >= MIN_PAIRS, self.interval()) {
            (true, Some((lo, _))) if lo > 0.0 => Status::Positive,
            (true, Some((_, hi))) if hi < 0.0 => Status::Negative,
            (true, Some(_)) => Status::Unresolved,
            _ => Status::Insufficient,
        }
    }

    /// The same estimate scaled, for a percentage of a baseline.
    pub fn scaled(&self, k: f64) -> Paired {
        Paired { n: self.n, mean: self.mean * k, sd: self.sd * k.abs(), half: self.half.map(|h| h * k.abs()) }
    }

    /// Published form. `pos` and `neg` name a resolved positive and a resolved negative effect for the quantity (for example `increase` and `decrease`).
    pub fn to_json(&self, pos: &str, neg: &str) -> Value {
        let status = match self.status() {
            Status::Positive => pos,
            Status::Negative => neg,
            other => other.as_str(),
        };
        let mut v = json!({"n": self.n, "mean": r2(self.mean), "sd": r2(self.sd), "status": status});
        if let Some((lo, hi)) = self.interval() {
            v["interval"] = json!([r2(lo), r2(hi)]);
        }
        v
    }
}

fn r2(x: f64) -> f64 {
    (x * 100.0).round() / 100.0
}

/// Per seed, the difference `b - a` of two series with the same length. Series of different length are not pairs.
pub fn diffs(a: &[f64], b: &[f64]) -> Result<Vec<f64>, String> {
    if a.len() != b.len() {
        return Err(format!("{} runs paired with {}", a.len(), b.len()));
    }
    Ok(a.iter().zip(b).map(|(x, y)| y - x).collect())
}

/// Through cars an hour of the baseline and of one scenario, per period and seed (`[period][seed]`).
#[derive(Clone, Debug, Default, PartialEq)]
pub struct CtPairs {
    pub seeds: Vec<u64>,
    pub base: Vec<Vec<f64>>,
    pub scen: Vec<Vec<f64>>,
}

impl CtPairs {
    /// Rejects a missing or mismatched pair: every period needs one baseline and one scenario value for every seed.
    pub fn new(seeds: &[u64], base: Vec<Vec<f64>>, scen: Vec<Vec<f64>>) -> Result<CtPairs, String> {
        if base.len() != scen.len() {
            return Err(format!("{} baseline periods against {} scenario periods", base.len(), scen.len()));
        }
        for (p, (b, s)) in base.iter().zip(&scen).enumerate() {
            if b.len() != seeds.len() || s.len() != seeds.len() {
                return Err(format!("period {p}: {} baseline and {} scenario runs for {} seeds", b.len(), s.len(), seeds.len()));
            }
        }
        Ok(CtPairs { seeds: seeds.to_vec(), base, scen })
    }

    fn per_seed(v: &[Vec<f64>], n: usize) -> Vec<f64> {
        (0..n).map(|s| v.iter().map(|p| p[s]).sum::<f64>() / v.len().max(1) as f64).collect()
    }

    /// The published headline averages the periods with equal weights within each seed, so the pairing is by seed.
    pub fn base_agg(&self) -> Vec<f64> {
        Self::per_seed(&self.base, self.seeds.len())
    }

    pub fn scen_agg(&self) -> Vec<f64> {
        Self::per_seed(&self.scen, self.seeds.len())
    }

    /// Scenario minus baseline per seed for the headline.
    pub fn effect(&self) -> Paired {
        Paired::of(&diffs(&self.base_agg(), &self.scen_agg()).unwrap_or_default())
    }

    pub fn period_effect(&self, p: usize) -> Paired {
        Paired::of(&diffs(&self.base[p], &self.scen[p]).unwrap_or_default())
    }

    pub fn base_mean(&self) -> f64 {
        let a = self.base_agg();
        a.iter().sum::<f64>() / a.len().max(1) as f64
    }
}

/// How much better `a` cuts through cars than `b`: the per-seed values of `b - a` in cars an hour, scenario against scenario on the
/// same seeds, as a Paired estimate. Positive means `a` leaves fewer through cars. `None` when the runs are not the same pairs.
pub fn option_gain(a: &CtPairs, b: &CtPairs) -> Option<Paired> {
    if a.seeds != b.seeds || a.base.len() != b.base.len() {
        return None;
    }
    diffs(&a.scen_agg(), &b.scen_agg()).ok().map(|d| Paired::of(&d))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn interval_follows_the_t_distribution() {
        // 10 differences with mean 2 and sd 1: half width t(9) * 1 / sqrt(10) = 2.262 / 3.1623.
        let d: Vec<f64> = vec![1.0, 3.0, 2.0, 2.0, 1.0, 3.0, 2.0, 2.0, 1.0, 3.0];
        let p = Paired::of(&d);
        assert!((p.mean - 2.0).abs() < 1e-12);
        let sd = (d.iter().map(|x| (x - 2.0).powi(2)).sum::<f64>() / 9.0).sqrt();
        assert!((p.sd - sd).abs() < 1e-12);
        assert!((p.half.unwrap() - 2.262 * sd / 10f64.sqrt()).abs() < 1e-9);
        assert_eq!(p.status(), Status::Positive);
    }

    #[test]
    fn few_pairs_make_no_statement() {
        assert_eq!(Paired::of(&[]).status(), Status::Insufficient);
        assert_eq!(Paired::of(&[5.0]).half, None);
        assert_eq!(Paired::of(&[5.0, 6.0, 7.0]).status(), Status::Insufficient);
        assert!(Paired::of(&[5.0, 6.0, 7.0]).half.is_some());
    }

    #[test]
    fn t_values_match_the_published_table() {
        assert_eq!(t_crit(1), 12.706);
        assert_eq!(t_crit(9), 2.262);
        assert_eq!(t_crit(60), 2.000);
        assert_eq!(t_crit(500), 2.000);
        assert!(t_crit(0).is_infinite());
    }

    #[test]
    fn mismatched_series_are_not_pairs() {
        assert!(diffs(&[1.0, 2.0], &[1.0]).is_err());
        assert!(CtPairs::new(&[1, 2], vec![vec![1.0, 2.0]], vec![vec![1.0]]).is_err());
        assert!(CtPairs::new(&[1, 2], vec![vec![1.0, 2.0]], vec![]).is_err());
    }
}
