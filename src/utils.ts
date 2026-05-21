// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (C) 2024 Andrij David <andrijdavid@gmail.com>

import { LIMITS, type SectionCode, type SortType } from './config.js';
import type { SearchParams } from './types.js';

export function buildSearchUrl(
  baseUrl: string,
  path: string,
  params: SearchParams
): string {
  const url = new URL(path, baseUrl);

  const offset = params.offset ?? 0;
  const limit = params.limit ?? LIMITS.limitIncrement;

  url.searchParams.set('offset', String(offset));
  url.searchParams.set('limit', String(limit));

  if (params.section) {
    url.searchParams.set('section', params.section);
  }

  if (params.query) {
    url.searchParams.set('query', params.query);
  }

  if (params.price_from !== undefined && params.price_from >= 0) {
    url.searchParams.set('price_from', String(params.price_from));
  }

  if (params.price_to !== undefined && params.price_to >= 0) {
    url.searchParams.set('price_to', String(params.price_to));
  }

  if (params.sort) {
    url.searchParams.set('sort', params.sort);
  }

  if (params.sort === 'distance' && params.latitude !== undefined && params.longitude !== undefined) {
    url.searchParams.set('latitude', String(params.latitude));
    url.searchParams.set('longitude', String(params.longitude));
  }

  if (params.phone) {
    url.searchParams.set('phone', params.phone);
  }

  if (params.email) {
    url.searchParams.set('email', params.email);
  }

  return url.toString();
}

export function buildAdDetailUrl(baseUrl: string, adId: string): string {
  const url = new URL('/api/v1/ad-detail-2.php', baseUrl);
  url.searchParams.set('ad_id', adId);
  url.searchParams.set('edit', 'false');
  return url.toString();
}

export function validateOffset(value: number): number {
  const v = Math.max(0, Math.floor(value));
  return Math.min(v, LIMITS.maxOffset);
}

export function validateLimit(value: number): number {
  const v = Math.max(LIMITS.limitIncrement, Math.floor(value));
  const clamped = Math.min(v, LIMITS.maxLimit);
  return Math.floor(clamped / LIMITS.limitIncrement) * LIMITS.limitIncrement;
}

export function isValidSection(section: string): section is SectionCode {
  const validSections: readonly string[] = [
    'AU', 'DE', 'DU', 'EL', 'FO', 'HU', 'KN', 'MO', 'MT', 'NA', 'OB',
    'PC', 'PR', 'RE', 'SL', 'SP', 'ST', 'VS', 'ZV', 'OS',
  ];
  return validSections.includes(section);
}

export function isValidSort(sort: string): sort is SortType {
  const validSorts: readonly string[] = ['date', 'price_asc', 'price_desc', 'distance'];
  return validSorts.includes(sort);
}
