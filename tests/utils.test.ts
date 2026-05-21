import { describe, it, expect } from 'vitest';
import {
  buildSearchUrl,
  buildAdDetailUrl,
  validateOffset,
  validateLimit,
  isValidSection,
  isValidSort,
} from '../src/utils.js';

describe('buildSearchUrl', () => {
  it('builds basic URL with defaults', () => {
    const url = buildSearchUrl('https://www.bazos.cz', '/api/v1/ads.php', {});
    expect(url).toBe('https://www.bazos.cz/api/v1/ads.php?offset=0&limit=20');
  });

  it('includes all provided params', () => {
    const url = buildSearchUrl('https://www.bazos.cz', '/api/v1/ads.php', {
      section: 'AU',
      query: 'volvo',
      price_from: 10000,
      price_to: 50000,
      sort: 'price_asc',
      offset: 40,
      limit: 40,
    });
    expect(url).toContain('section=AU');
    expect(url).toContain('query=volvo');
    expect(url).toContain('price_from=10000');
    expect(url).toContain('price_to=50000');
    expect(url).toContain('sort=price_asc');
    expect(url).toContain('offset=40');
    expect(url).toContain('limit=40');
  });

  it('includes lat/lon for distance sort', () => {
    const url = buildSearchUrl('https://www.bazos.cz', '/api/v1/ads.php', {
      sort: 'distance',
      latitude: 49.1951,
      longitude: 16.6068,
    });
    expect(url).toContain('latitude=49.1951');
    expect(url).toContain('longitude=16.6068');
  });

  it('does not include lat/lon when sort is not distance', () => {
    const url = buildSearchUrl('https://www.bazos.cz', '/api/v1/ads.php', {
      sort: 'date',
      latitude: 49.1951,
      longitude: 16.6068,
    });
    expect(url).not.toContain('latitude');
    expect(url).not.toContain('longitude');
  });
});

describe('buildAdDetailUrl', () => {
  it('builds ad detail URL correctly', () => {
    const url = buildAdDetailUrl('https://www.bazos.cz', '123456');
    expect(url).toBe('https://www.bazos.cz/api/v1/ad-detail-2.php?ad_id=123456&edit=false');
  });
});

describe('validateOffset', () => {
  it('returns 0 for negative values', () => {
    expect(validateOffset(-10)).toBe(0);
  });

  it('clamps to max offset', () => {
    expect(validateOffset(300)).toBe(200);
  });

  it('returns valid offset as-is', () => {
    expect(validateOffset(40)).toBe(40);
  });
});

describe('validateLimit', () => {
  it('returns minimum limit for low values', () => {
    expect(validateLimit(5)).toBe(20);
  });

  it('clamps to max limit', () => {
    expect(validateLimit(300)).toBe(200);
  });

  it('rounds to nearest increment', () => {
    expect(validateLimit(35)).toBe(20);
    expect(validateLimit(45)).toBe(40);
  });
});

describe('isValidSection', () => {
  it('returns true for valid sections', () => {
    expect(isValidSection('AU')).toBe(true);
    expect(isValidSection('PC')).toBe(true);
    expect(isValidSection('OS')).toBe(true);
  });

  it('returns false for invalid sections', () => {
    expect(isValidSection('XX')).toBe(false);
    expect(isValidSection('')).toBe(false);
  });
});

describe('isValidSort', () => {
  it('returns true for valid sorts', () => {
    expect(isValidSort('date')).toBe(true);
    expect(isValidSort('price_asc')).toBe(true);
    expect(isValidSort('price_desc')).toBe(true);
    expect(isValidSort('distance')).toBe(true);
  });

  it('returns false for invalid sorts', () => {
    expect(isValidSort('name')).toBe(false);
    expect(isValidSort('')).toBe(false);
  });
});
