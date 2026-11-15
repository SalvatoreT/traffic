import { describe, expect, it } from 'vitest';
import { contentType } from './content-type';

describe('content type of a published file', () => {
  it('labels the generated text pages', () => {
    expect(contentType('public/data/llms/llms.txt')).toBe('text/plain; charset=utf-8');
    expect(contentType('public/data/llms/proposals.md')).toBe('text/markdown; charset=utf-8');
    expect(contentType('x.json')).toBe('application/json; charset=utf-8');
    expect(contentType('x.csv')).toBe('text/csv; charset=utf-8');
    expect(contentType('public/data/og/home-0a1b2c3d.jpg')).toBe('image/jpeg');
    expect(contentType('x.bin')).toBe('application/octet-stream');
  });
});
