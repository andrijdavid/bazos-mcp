// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (C) 2024 Andrij David <andrijdavid@gmail.com>

import type { SectionCode, SortType } from './config.js';

export interface Ad {
  id: string;
  from: string;
  title: string;
  price_formatted: string;
  currency: string;
  image_thumbnail: string;
  locality: string;
  topped: string;
  image_thumbnail_width: string;
  image_thumbnail_height: string;
  favourite: string;
  url: string;
  views: string;
}

export interface Category {
  id: string;
  title: string;
  url: string;
}

export interface Section {
  id: string;
  title: string;
  url: string;
  image: string;
}

export interface AdDetail {
  id: string;
  from: string;
  status: string;
  topped: boolean;
  title: string;
  description: string;
  price_formatted: string;
  currency: string;
  price: string;
  price_type: string;
  name: string;
  phone: string;
  phone_id: string;
  email_id: string;
  zip_code: string;
  locality: string;
  latitude: string;
  longitude: string;
  category: Category;
  url: string;
  top_possible: string;
  top_total: string;
  top_limit: string;
  topped_for_days: string;
  action_possible: string;
  views: string;
  section: Section;
  images: string[];
  image_thumbnail: string;
  image_thumbnail_width?: string;
  image_thumbnail_height?: string;
  favourite?: string;
  user_ads_count?: string;
  user_reviews_count?: string;
}

export interface UserRating {
  // The API returns an array; exact shape depends on data availability.
  // Using a generic record for flexibility.
  [key: string]: unknown;
}

export interface SearchParams {
  offset?: number;
  limit?: number;
  section?: SectionCode;
  query?: string;
  price_from?: number;
  price_to?: number;
  sort?: SortType;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
}

export interface BazosResponse<T> {
  data: T;
  status: number;
}
