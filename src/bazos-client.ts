// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (C) 2024 Andrij David <andrijdavid@gmail.com>

import { DOMAINS, API_PATHS, DEFAULTS } from './config.js';
import type { Domain } from './config.js';
import { RateLimiter } from './rate-limiter.js';
import { generateUserAgent } from './user-agent.js';
import { buildSearchUrl, buildAdDetailUrl } from './utils.js';
import type { Ad, AdDetail, SearchParams, UserRating } from './types.js';

export class BazosClient {
  private readonly rateLimiter: RateLimiter;

  constructor() {
    this.rateLimiter = new RateLimiter({
      minDelayMs: DEFAULTS.minDelayMs,
      maxJitterMs: DEFAULTS.maxJitterMs,
    });
  }

  private async fetchJson<T>(url: string): Promise<T> {
    await this.rateLimiter.throttle();

    const { userAgent, deviceId } = generateUserAgent();

    const response = await fetch(url, {
      headers: {
        'user-agent': userAgent,
        'x-deviceid': deviceId,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
    }

    const data = (await response.json()) as T;
    return data;
  }

  getBaseUrl(domain: Domain): string {
    return DOMAINS[domain];
  }

  async searchAds(domain: Domain, params: SearchParams): Promise<Ad[]> {
    const baseUrl = this.getBaseUrl(domain);
    const url = buildSearchUrl(baseUrl, API_PATHS.ads, params);
    return this.fetchJson<Ad[]>(url);
  }

  async getAdDetail(domain: Domain, adId: string): Promise<AdDetail> {
    const baseUrl = this.getBaseUrl(domain);
    const url = buildAdDetailUrl(baseUrl, adId);
    return this.fetchJson<AdDetail>(url);
  }

  async getUserRatings(domain: Domain, params: SearchParams): Promise<UserRating[]> {
    const baseUrl = this.getBaseUrl(domain);
    const url = buildSearchUrl(baseUrl, API_PATHS.ratings, {
      offset: params.offset,
      limit: params.limit,
      phone: params.phone,
      email: params.email,
    });
    return this.fetchJson<UserRating[]>(url);
  }
}
