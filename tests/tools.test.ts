import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createServer } from '../src/tools.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

describe('MCP Server Tools', () => {
  let client: Client;

  beforeEach(async () => {
    const server = createServer();
    const transports = InMemoryTransport.createLinkedPair();
    await server.connect(transports[0]);

    client = new Client({ name: 'test-client', version: '1.0.0' });
    await client.connect(transports[1]);
  });

  it('lists expected tools', async () => {
    const result = await client.listTools();
    const names = result.tools.map((t) => t.name);
    expect(names).toContain('search_ads');
    expect(names).toContain('get_ad_detail');
    expect(names).toContain('get_user_ratings');
  });

  it('search_ads returns error for invalid domain', async () => {
    const result = await client.callTool({
      name: 'search_ads',
      arguments: { domain: 'de' },
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Invalid domain');
  });

  it('get_ad_detail returns error for missing ad_id', async () => {
    const result = await client.callTool({
      name: 'get_ad_detail',
      arguments: { domain: 'cz' },
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Missing ad_id');
  });

  it('get_user_ratings returns error for invalid domain', async () => {
    const result = await client.callTool({
      name: 'get_user_ratings',
      arguments: { domain: 'fr' },
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Invalid domain');
  });
});
