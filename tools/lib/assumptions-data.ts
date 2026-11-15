// The Assumptions tab's table of assumed movements: the demand config (movements and their intents) joined to the numbers of the demand fit report. No I/O.
import { ASSUMPTIONS_VERSION, type AssumedMovementView, type AssumptionsFile } from '../../src/lib/assumptions';

export interface MovementCfg {
  id: string; label: string; maxDetour: number;
  intents?: { id: string; label: string; fromGroup: string | string[]; toGroup: string | string[] }[];
}
export interface AssumptionsCfg {
  assumedMovementFlows: { movements: MovementCfg[] };
  volunteerCount?: { periods: { am: string; pm: string; midday?: string }; middayFromPm?: boolean };
}

export interface MovementRow { movement: string; period: string; counted: number; through: number; local: number }
export interface IntentRow { movement: string; period: string; intent: string; assigned: number }

const STUDY = 'study-area';
const cells = (line: string): string[] => line.replace(/^\|/, '').replace(/\|\s*$/, '').split(/ \| /).map((c) => c.trim());

/** The two tables of the fit report's "Assumed movement flows" section. Throws when the section or a table is not as expected, so a changed report is noticed. */
export function parseFitReport(text: string): { movements: MovementRow[]; intents: IntentRow[] } {
  const start = text.indexOf('## Assumed movement flows');
  if (start < 0) throw new Error('The fit report has no "Assumed movement flows" section.');
  const rest = text.slice(start + 3);
  const next = rest.search(/\n## /);
  const section = next < 0 ? rest : rest.slice(0, next);
  const rows = (header: string): string[][] => {
    const at = section.split('\n').findIndex((l) => l.startsWith(header));
    if (at < 0) throw new Error(`The fit report's assumed movement section has no table headed ${header}`);
    const lines = section.split('\n').slice(at + 2);
    const out: string[][] = [];
    for (const l of lines) { if (!l.startsWith('|')) break; out.push(cells(l)); }
    return out;
  };
  const movements = rows('| Movement | Period | Counted').map((c) => ({ movement: c[0], period: c[1], counted: Number(c[2]), through: Number(c[6]), local: Number(c[7]) }));
  const intents = rows('| Movement | Period | Intent').map((c) => ({ movement: c[0], period: c[1], intent: c[2], assigned: Number(c[6]) }));
  for (const r of [...movements.flatMap((m) => [m.counted, m.through, m.local]), ...intents.map((i) => i.assigned)]) if (!Number.isFinite(r)) throw new Error('A number in the fit report\'s assumed movement tables did not parse.');
  return { movements, intents };
}

const dayLabel = (id: string): string => {
  const m = /(\d{4})-(\d{2})-(\d{2})/.exec(id);
  if (!m) return '';
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][Number(m[2]) - 1];
  return `${month} ${Number(m[3])}, ${m[1]}`;
};

/** `countSourceId` is the id of the count file's source ("volunteer-count-2025-02-25"); its date names the count. */
export function buildAssumptions(cfg: AssumptionsCfg, fitText: string, o: { area: string; demandHash: string; countSourceId: string; generated: string }): AssumptionsFile {
  const fit = parseFitReport(fitText);
  const vc = cfg.volunteerCount;
  const measured = vc ? [vc.periods.am, vc.periods.pm] : [];
  const scaled = vc?.periods.midday && vc.middayFromPm ? [vc.periods.midday] : [];
  const movements: AssumedMovementView[] = cfg.assumedMovementFlows.movements.map((m) => {
    const rows = fit.movements.filter((r) => r.movement === m.label);
    if (!rows.length) throw new Error(`The fit report has no row for the assumed movement "${m.label}".`);
    const counted: AssumedMovementView['counted'] = {}, assigned: AssumedMovementView['assigned'] = {};
    for (const r of rows) { counted[r.period] = r.counted; assigned[r.period] = { total: r.through + r.local, through: r.through }; }
    const intents = (m.intents ?? []).map((it) => {
      const vph: Record<string, number> = {};
      for (const r of fit.intents.filter((x) => x.movement === m.label && x.intent === it.label)) vph[r.period] = r.assigned;
      const local = [it.fromGroup, it.toGroup].some((g) => (Array.isArray(g) ? g : [g]).includes(STUDY));
      return { id: it.id, label: it.label, through: !local, vph };
    });
    return { id: m.id, label: m.label, maxDetour: m.maxDetour, counted, assigned, intents };
  });
  const day = dayLabel(o.countSourceId);
  return {
    version: ASSUMPTIONS_VERSION, area: o.area, generated: o.generated, inputs: { demandHash: o.demandHash },
    count: { label: day ? `the resident volunteer count of ${day}` : 'the resident volunteer count', measured, scaled },
    movements,
  };
}
