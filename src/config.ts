// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (C) 2024 Andrij David <andrijdavid@gmail.com>

export const DOMAINS = {
  cz: 'https://www.bazos.cz',
  sk: 'https://www.bazos.sk',
} as const;

export type Domain = keyof typeof DOMAINS;

export const SECTIONS = {
  AU: 'Auto',
  DE: 'Deti',
  DU: 'Dum a Zahrada',
  EL: 'Elektro',
  FO: 'Foto',
  HU: 'Hudba',
  KN: 'Knihy',
  MO: 'Mobily',
  MT: 'Motorky',
  NA: 'Nabytek',
  OB: 'Obleceni',
  PC: 'PC',
  PR: 'Prace',
  RE: 'Reality',
  SL: 'Sluzby',
  SP: 'Sport',
  ST: 'Stroje',
  VS: 'Vstupenky',
  ZV: 'Zvirata',
  OS: 'Ostatni',
} as const;

export type SectionCode = keyof typeof SECTIONS;

export const SORT_TYPES = ['date', 'price_asc', 'price_desc', 'distance'] as const;
export type SortType = (typeof SORT_TYPES)[number];

export const API_PATHS = {
  ads: '/api/v1/ads.php',
  adDetail: '/api/v1/ad-detail-2.php',
  ratings: '/api/v1/ratings.php',
} as const;

export const DEFAULTS = {
  offset: 0,
  limit: 20,
  sort: 'date' as SortType,
  minDelayMs: 900,
  maxJitterMs: 400,
} as const;

export const LIMITS = {
  maxLimit: 200,
  limitIncrement: 20,
  maxOffset: 200,
  offsetIncrement: 20,
} as const;
