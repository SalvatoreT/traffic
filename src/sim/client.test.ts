import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SimClient, type StatsMsg } from './client';
import { initialRun, RUN_SECONDS, runReducer } from '../lib/run';

class FakeWorker {
  static last: FakeWorker;
  onmessage: ((ev: { data: unknown }) => void) | null = null;
  onerror: unknown = null;
  sent: { t: string }[] = [];
  constructor() { FakeWorker.last = this; }
  postMessage(m: { t: string }) { this.sent.push(m); }
  terminate() { /* none */ }
  emit(data: unknown) { this.onmessage?.({ data }); }
}
const stats = (time: number, epoch: number) => ({ t: 'stats', time, comparing: false, scenario: {}, baseline: {}, achievedSpeed: null, epoch });

beforeEach(() => { vi.stubGlobal('Worker', FakeWorker); });
afterEach(() => { vi.unstubAllGlobals(); });

describe('SimClient restarts', () => {
  it('drops a finished old run reported after a period change until the new run reports', () => {
    const c = new SimClient();
    const w = FakeWorker.last;
    const got: StatsMsg[] = [];
    c.onStats = (s) => got.push(s);
    w.emit(stats(RUN_SECONDS, 0));
    expect(got).toHaveLength(1);
    c.send({ t: 'config', period: 'midday', demandScale: 1 });
    w.emit(stats(RUN_SECONDS, 0));
    expect(got).toHaveLength(1);
    w.emit(stats(2, 1));
    expect(got.map((s) => s.time)).toEqual([RUN_SECONDS, 2]);
  });
  it('drops reports of the old configuration while a debounced config is pending', () => {
    const c = new SimClient();
    const w = FakeWorker.last;
    const got: number[] = [];
    const progress: number[] = [];
    c.onStats = (s) => got.push(s.time);
    c.onProgress = (t) => progress.push(t);
    c.hold();
    w.emit(stats(RUN_SECONDS, 0));
    w.emit({ t: 'progress', time: RUN_SECONDS, epoch: 0 });
    expect(got).toEqual([]);
    expect(progress).toEqual([]);
    c.send({ t: 'config', period: 'midday', demandScale: 1.2 });
    w.emit(stats(5, 1));
    expect(got).toEqual([5]);
  });
  it('a dropped finish leaves the restarted run unfinished', () => {
    let s = runReducer(initialRun(true), { type: 'time', time: RUN_SECONDS });
    s = runReducer(s, { type: 'restart' });
    expect(s).toEqual({ running: true, finished: false, time: 0 });
  });
});
