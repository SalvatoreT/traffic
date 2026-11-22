// Reads the text `explore --check` prints for one package. Shared by summary.cjs and pick-seeds.cjs.
const num = (s) => (s === undefined ? NaN : Number(String(s).replace('+', '')));

/** The figures one `explore --check` log holds for its one package. */
function parseCheck(text) {
  const r = { periods: [], allowLines: 0, reject: null, access: null, decode: null };
  const lines = text.split('\n');
  for (const line of lines) {
    let m;
    if (/profile (allows|FORBIDS)/.test(line)) r.allowLines++;
    if ((m = /^\s*access check: (passes|fails.*)$/.exec(line))) r.access = m[1];
    if ((m = /does not decode: (.*)$/.exec(line))) r.decode = m[1];
    if ((m = /^recheck of (\d+) intervention\(s\): (no rejection|REJECTED, (.*))$/.exec(line))) { r.n = Number(m[1]); r.reject = m[3] ?? null; r.rechecked = true; }
    if ((m = /through cars an hour, mean of periods: ([\d.]+) -> ([\d.]+) \(([+-][\d.]+)%\); score ([+-][\d.]+); ranking penalty (\d+) on (.*)$/.exec(line))) {
      Object.assign(r, { base: num(m[1]), scen: num(m[2]), pct: num(m[3]), score: num(m[4]), penalty: num(m[5]), penaltyBlock: m[6] });
    }
    if ((m = /block with the largest through-car increase: (.*?) \(([+-]\d+); (.*)\), (\d+) block\(s\) with a resolved increase, (\d+) past the noise band/.exec(line))) {
      Object.assign(r, { throughBlock: m[1], throughInc: num(m[2]), throughIntervalText: m[3], blocksResolved: num(m[4]), blocksAbove: num(m[5]) });
    }
    if ((m = /through-car change interval: (\d+)% interval ([+-]\d+) to ([+-]\d+) cars an hour over (\d+) seeds/.exec(line))) {
      Object.assign(r, { lo: num(m[2]), hi: num(m[3]), seeds: num(m[4]) });
    } else if (/through-car change interval: /.test(line)) r.noInterval = line.split('interval: ')[1];
    if ((m = /^\s*(\w+): through (\d+) -> (\d+) \(([+-][\d.]+)%\); all-traffic block with the largest increase (.*) (\d+) -> (\d+)\s*$/.exec(line))) {
      r.periods.push({ period: m[1], base: num(m[2]), scen: num(m[3]), pct: num(m[4]), block: m[5], blockBase: num(m[6]), blockScen: num(m[7]) });
    }
    if ((m = /Unfinished requests numbered (\d+) of (\d+) at baseline and (\d+) of (\d+) with the package/.exec(line))) r.unfinished = { base: num(m[1]), baseOf: num(m[2]), scen: num(m[3]), scenOf: num(m[4]) };
  }
  return r;
}

module.exports = { parseCheck, num };
