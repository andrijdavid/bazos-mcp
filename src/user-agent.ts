// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (C) 2024 Andrij David <andrijdavid@gmail.com>

const ANDROID_VERSIONS = ['10', '11', '12', '13', '14'];

const DEVICE_MODELS = [
  'SM-G991B', // Samsung S21
  'SM-G998B', // Samsung S21 Ultra
  'SM-S901B', // Samsung S22
  'SM-S908B', // Samsung S22 Ultra
  'SM-S918B', // Samsung S23 Ultra
  'Pixel 6',
  'Pixel 6 Pro',
  'Pixel 7',
  'Pixel 7 Pro',
  'Pixel 8',
  'Pixel 8 Pro',
  'MI 11',
  'MI 12',
  'Redmi Note 12',
  'Redmi Note 13',
  'OnePlus 9 Pro',
  'OnePlus 10 Pro',
  'OnePlus 11',
  'OPPO Find X5',
  'OPPO Find X6',
  'vivo X90',
  'vivo X100',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDigitString(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

export interface UserAgentResult {
  userAgent: string;
  deviceId: string;
}

export function generateUserAgent(): UserAgentResult {
  const androidVersion = randomItem(ANDROID_VERSIONS);
  const model = randomItem(DEVICE_MODELS);
  const deviceId = randomDigitString(8);

  const userAgent = `bazos/2.12.1 (cz.ackee.bazos; build:${3580 + Math.floor(Math.random() * 10)}; android ${androidVersion}; model:${model}) okhttp/4.8.1`;

  return { userAgent, deviceId };
}
