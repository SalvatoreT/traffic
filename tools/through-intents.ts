// Re-annotates a built demand file with the cut-through intents of the area config, without the fit: the same step the demand build ends with.
// Usage: tsx tools/through-intents.ts [data/demand/<area>.config.json]
import { readFileSync, writeFileSync } from 'node:fs';
import { deriveApproachGroups, groupOfNode, type ApproachGroupsCfg } from './lib/approach-groups';
import { annotateFlows, resolveIntents, type IntentFlow, type ThroughIntentsCfg } from './lib/through-intents';

const cfg = JSON.parse(readFileSync(process.argv[2] ?? 'data/demand/rockridge.config.json', 'utf8'));
const area = JSON.parse(readFileSync(`data/areas/${cfg.area}.json`, 'utf8'));
const net = JSON.parse(readFileSync(cfg.network, 'utf8'));
const groups = deriveApproachGroups(net.nodes, net.links, area.approachGroups as ApproachGroupsCfg);
const nodeById = new Map<number, { id: number; x: number; y: number; gate: boolean; inStudyArea: boolean }>(net.nodes.map((n: { id: number; x: number; y: number; gate: boolean; inStudyArea: boolean }) => [n.id, n]));
const res = resolveIntents(area.throughIntents as ThroughIntentsCfg, groups);
const demand = JSON.parse(readFileSync(cfg.output, 'utf8'));
for (const per of demand.periods as { id: string; flows: IntentFlow[] }[]) {
  const vol = annotateFlows(per.flows, res, (id) => groupOfNode(groups, nodeById, id));
  console.log(`${per.id}: ${res.map((r, k) => `${r.out.id} ${vol[k].toFixed(0)}`).join(', ')}, none ${vol[res.length].toFixed(0)} veh/h (all flows)`);
}
demand.intents = res.map((r) => r.out);
const { intents, ...rest } = demand;
writeFileSync(cfg.output, JSON.stringify({ version: rest.version, area: rest.area, intents, ...Object.fromEntries(Object.entries(rest).filter(([k]) => k !== 'version' && k !== 'area')) }));
