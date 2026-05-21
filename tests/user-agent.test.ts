import { describe, it, expect } from 'vitest';
import { generateUserAgent } from '../src/user-agent.js';

describe('generateUserAgent', () => {
  it('returns a user agent string containing bazos', () => {
    const result = generateUserAgent();
    expect(result.userAgent).toContain('bazos');
    expect(result.userAgent).toContain('okhttp/4.8.1');
  });

  it('returns an 8-digit device ID', () => {
    const result = generateUserAgent();
    expect(result.deviceId).toMatch(/^\d{8}$/);
  });

  it('generates different UAs on subsequent calls', () => {
    const a = generateUserAgent();
    const b = generateUserAgent();
    // It is theoretically possible they collide, but extremely unlikely.
    expect(a.userAgent).not.toBe(b.userAgent);
    expect(a.deviceId).not.toBe(b.deviceId);
  });

  it('contains android version', () => {
    const result = generateUserAgent();
    expect(result.userAgent).toMatch(/android \d{1,2}/);
  });

  it('contains a model name', () => {
    const result = generateUserAgent();
    expect(result.userAgent).toContain('model:');
  });
});
