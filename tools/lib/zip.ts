import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';

/** Reads named members of a zip archive (stored or deflated) through its central directory. Node built-ins only. */
export function readZip(path: string, want?: (name: string) => boolean): Map<string, Buffer> {
  return readZipBuffer(readFileSync(path), want);
}

export function readZipBuffer(buf: Buffer, want?: (name: string) => boolean): Map<string, Buffer> {
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) throw new Error('not a zip file (no end-of-central-directory record)');
  const n = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const out = new Map<string, Buffer>();
  for (let i = 0; i < n; i++) {
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28);
    const elen = buf.readUInt16LE(p + 30);
    const clen = buf.readUInt16LE(p + 32);
    const lho = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nlen);
    p += 46 + nlen + elen + clen;
    if (want && !want(name)) continue;
    const start = lho + 30 + buf.readUInt16LE(lho + 26) + buf.readUInt16LE(lho + 28);
    const data = buf.subarray(start, start + csize);
    out.set(name, method === 0 ? data : inflateRawSync(data));
  }
  return out;
}
