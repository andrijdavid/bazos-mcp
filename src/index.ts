#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (C) 2024 Andrij David <andrijdavid@gmail.com>

import { startServer } from './tools.js';

startServer().catch((error) => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});
