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

import { realpathSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { startServer } from './tools.js';

// ponytail: npm installs bin as a symlink, so argv[1] is the link path while
// import.meta.url is the realpath. realpath + pathToFileURL also covers spaces,
// non-ASCII paths and Windows.
function isMainModule(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return import.meta.url === pathToFileURL(realpathSync(entry)).href;
  } catch {
    return false;
  }
}

if (isMainModule()) {
  startServer().catch((error) => {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  });
}
