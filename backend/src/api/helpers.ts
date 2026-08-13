import storefronts from '../static/storefronts.json' with { type: 'json' };
import type { Market } from '../types/market.js';

export function getLanguage(market: Market) {
  let language = 'en-GB';
  if (market === 'ca') language = 'en-CA';
  if (market === 'us' || market === 'jp') language = 'en-US';
  return language;
}

export function getStorefronts(market: Market) {
  const storefront = storefronts[market];
  if (!storefront) throw new Error('Invalid market');

  return {
    itunes: storefront.storefront,
    appleMusic: `${storefront.storefront} t:music31`,
  };
}

export function normalizeIds(ids: number[]) {
  return [...new Set(ids)].sort((a, b) => b - a).slice(0, 20_000); // 20k limit
}

export function splitArrayIntoChunks<T>(array: T[], chunkSize: number) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}
