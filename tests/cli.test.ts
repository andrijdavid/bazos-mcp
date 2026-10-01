// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (C) 2024 Andrij David <andrijdavid@gmail.com>

import { describe, it, expect, beforeAll } from 'vitest';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const entry = resolve('dist/index.js');

describe('CLI entrypoint', () => {
  beforeAll(() => {
    execFileSync('npm', ['run', 'build'], { stdio: 'ignore' });
  }, 120_000);

  // npm/npx install bin as a symlink, so this is the invocation that matters
  it('serves stdio when launched through a symlink', async () => {
    const link = join(mkdtempSync(join(tmpdir(), 'bazos-bin-')), 'bazos-mcp');
    symlinkSync(entry, link);

    const child = spawn(link, [], { stdio: ['pipe', 'pipe', 'pipe'] });
    child.stdin.write(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'test', version: '1' },
        },
      }) + '\n',
    );

    const line = await new Promise<string>((done, fail) => {
      let buf = '';
      child.stdout.on('data', (d) => {
        buf += d;
        if (buf.includes('\n')) done(buf.slice(0, buf.indexOf('\n')));
      });
      child.on('exit', (code) => fail(new Error(`exited with ${code} before responding`)));
      setTimeout(() => fail(new Error('timed out waiting for response')), 10_000);
    }).finally(() => child.kill());

    expect(JSON.parse(line).result.protocolVersion).toBe('2024-11-05');
  }, 20_000);
});
