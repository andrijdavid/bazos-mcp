// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (C) 2024 Andrij David <andrijdavid@gmail.com>

export interface RateLimiterOptions {
  minDelayMs: number;
  maxJitterMs: number;
}

export class RateLimiter {
  private lastRequestTime = 0;
  private readonly minDelayMs: number;
  private readonly maxJitterMs: number;

  constructor(options: RateLimiterOptions) {
    this.minDelayMs = options.minDelayMs;
    this.maxJitterMs = options.maxJitterMs;
  }

  private calculateDelay(): number {
    const jitter = Math.floor(Math.random() * (this.maxJitterMs * 2 + 1)) - this.maxJitterMs;
    return Math.max(0, this.minDelayMs + jitter);
  }

  async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    const requiredDelay = this.calculateDelay();

    if (elapsed < requiredDelay) {
      const waitTime = requiredDelay - elapsed;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }
}
