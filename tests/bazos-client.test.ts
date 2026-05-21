import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BazosClient } from '../src/bazos-client.js';

describe('BazosClient', () => {
  let client: BazosClient;

  beforeEach(() => {
    client = new BazosClient();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('getBaseUrl returns correct domain URLs', () => {
    expect(client.getBaseUrl('cz')).toBe('https://www.bazos.cz');
    expect(client.getBaseUrl('sk')).toBe('https://www.bazos.sk');
  });

  it('applies rate limiting between requests', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([{ id: '1' }]), { status: 200 })
    );

    // First request should go immediately (no previous request)
    await client.searchAds('cz', {});
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Second request should wait
    const promise = client.searchAds('cz', {});
    // Fast-forward past the delay
    vi.advanceTimersByTime(2000);
    await promise;

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    fetchSpy.mockRestore();
  });

  it('throws on HTTP error', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response('Not Found', { status: 404, statusText: 'Not Found' })
    );

    await expect(client.searchAds('cz', {})).rejects.toThrow('HTTP 404');
  });

  it('injects random user-agent and device-id headers', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 })
    );

    await client.searchAds('cz', {});

    const call = fetchSpy.mock.calls[0];
    const init = call[1] as { headers?: Record<string, string> };
    const headers = init.headers ?? {};

    expect(headers['user-agent']).toContain('bazos');
    expect(headers['x-deviceid']).toMatch(/^\d{8}$/);

    fetchSpy.mockRestore();
  });
});
