import { describe, it, expect, vi } from 'vitest';
import { RateLimiter } from '../src/rate-limiter.js';

describe('RateLimiter', () => {
  it('waits at least minDelayMs before first request', async () => {
    const limiter = new RateLimiter({ minDelayMs: 100, maxJitterMs: 0 });
    const start = Date.now();
    await limiter.throttle();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
  });

  it('waits between sequential requests', async () => {
    const limiter = new RateLimiter({ minDelayMs: 50, maxJitterMs: 0 });
    await limiter.throttle();
    const start = Date.now();
    await limiter.throttle();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40); // allow small margin
  });

  it('applies jitter', async () => {
    const limiter = new RateLimiter({ minDelayMs: 50, maxJitterMs: 20 });
    await limiter.throttle();

    const times: number[] = [];
    for (let i = 0; i < 5; i++) {
      const start = Date.now();
      await limiter.throttle();
      times.push(Date.now() - start);
    }

    const allSame = times.every((t) => t === times[0]);
    expect(allSame).toBe(false);
  });

  it('does not wait longer than necessary if enough time passed', async () => {
    const limiter = new RateLimiter({ minDelayMs: 500, maxJitterMs: 0 });
    await limiter.throttle();
    await new Promise((r) => setTimeout(r, 600));
    const start = Date.now();
    await limiter.throttle();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
  });
});
