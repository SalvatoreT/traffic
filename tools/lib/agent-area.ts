import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { AreaEntry, Demand, Network } from '../../src/types';
import { straightenJunctionEnds } from '../../src/lib/junctionends';
import { hashText } from '../../src/lib/proposals';

export const repoRoot = resolve(import.meta.dirname, '../..');
export const DEFAULT_DATA_DIR = join(repoRoot, 'public/data');

/** A problem the person running a command can fix; the command prints the message and exits with `code`. */
export class CliError extends Error {
  constructor(message: string, readonly code: number = 1) { super(message); this.name = 'CliError'; }
}
export const EXIT = { usage: 2, data: 3, wasm: 4 } as const;

export const DATA_HELP = 'Get the data with `npm run data:download` (the published files, no credentials) or rebuild it with `npm run data` (needs `npm run data:pull` or `npm run data:fetch` first).';

export interface AreaFiles {
  dir: string; entry: AreaEntry;
  networkText: string; demandText: string;
  network: Network; demand: Demand;
  /** The network text for the simulator, with merged-junction geometry straightened exactly as the app does. */
  simNetwork: string;
  /** SHA-256 hex of the file bytes as served. */
  hashes: { network: string; demand: string };
}

const read = (path: string, what: string): string => {
  if (!existsSync(path)) throw new CliError(`Missing ${what}: ${path}. ${DATA_HELP}`, EXIT.data);
  return readFileSync(path, 'utf8');
};
const parse = <T>(text: string, path: string): T => {
  try { return JSON.parse(text) as T; } catch { throw new CliError(`${path} is not valid JSON (an interrupted download?). ${DATA_HELP}`, EXIT.data); }
};

export function readAreas(dir: string): AreaEntry[] {
  const path = join(dir, 'areas.json');
  const areas = parse<AreaEntry[]>(read(path, 'area list'), path);
  if (!Array.isArray(areas)) throw new CliError(`${path} is not an area list. ${DATA_HELP}`, EXIT.data);
  return areas;
}

/** Local path of a data file the area entry names (`/data/x.json` or a bare name). */
export const fileOf = (dir: string, url: string): string => join(dir, url.replace(/^\/data\//, ''));

export async function loadAreaFiles(dir: string, area: string): Promise<AreaFiles> {
  const areas = readAreas(dir);
  const entry = areas.find((a) => a.id === area);
  if (!entry) throw new CliError(`No area "${area}" in ${join(dir, 'areas.json')}. Areas there: ${areas.map((a) => a.id).join(', ') || 'none'}.`, EXIT.usage);
  const networkText = read(fileOf(dir, entry.network), 'network file');
  const demandText = read(fileOf(dir, entry.demand), 'demand file');
  const network = parse<Network>(networkText, entry.network);
  const demand = parse<Demand>(demandText, entry.demand);
  if (network.version !== 1 || network.id !== area || !Array.isArray(network.links) || !Array.isArray(network.nodes)) {
    throw new CliError(`${entry.network} is not a version 1 network for ${area}; it may be from another release. ${DATA_HELP}`, EXIT.data);
  }
  if (demand.version !== 1 || demand.area !== area || !Array.isArray(demand.periods) || demand.periods.length === 0) {
    throw new CliError(`${entry.demand} is not a version 1 demand file for ${area}; it may be from another release. ${DATA_HELP}`, EXIT.data);
  }
  const { network: straight, changed } = straightenJunctionEnds(network);
  return {
    dir, entry, networkText, demandText, network: changed > 0 ? straight : network, demand,
    simNetwork: changed > 0 ? JSON.stringify(straight) : networkText,
    hashes: { network: await hashText(networkText), demand: await hashText(demandText) },
  };
}
