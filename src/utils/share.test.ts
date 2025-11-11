import { describe, it, expect } from 'vitest';
import { normalizeShareUrl } from './share';

describe('share normalize', () => {
  it('uses canonical when provided', () => {
    const url = normalizeShareUrl('https://site.tld/a?utm_source=x#hash', 'https://example.com/canonical?utm_medium=y#h');
    expect(url).toBe('https://example.com/canonical');
  });

  it('drops tgWebAppData/hash/utm', () => {
    const url = normalizeShareUrl('https://s.tld/p?q=1&utm_source=xxx&tgWebAppData=zzz#frag');
    expect(url).toBe('https://s.tld/p?q=1');
  });

  it('safe on garbage', () => {
    const url = normalizeShareUrl(':::::.not a url:::::');
    expect(url).toBe('');
  });
});
