#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (C) 2024 Andrij David <andrijdavid@gmail.com>

export { BazosClient } from './bazos-client.js';
export { createServer, startServer } from './tools.js';
export { generateUserAgent } from './user-agent.js';
export { RateLimiter } from './rate-limiter.js';
export { DOMAINS, SECTIONS, SORT_TYPES, DEFAULTS, LIMITS } from './config.js';
export type { Domain, SectionCode, SortType } from './config.js';
export type { Ad, AdDetail, UserRating, SearchParams } from './types.js';
export {
  buildSearchUrl,
  buildAdDetailUrl,
  validateOffset,
  validateLimit,
  isValidSection,
  isValidSort,
} from './utils.js';

import { startServer } from './tools.js';

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch((error) => {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  });
}
