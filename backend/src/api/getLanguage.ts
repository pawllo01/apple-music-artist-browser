import type { Market } from '../types/market.js';

export function getLanguage(market: Market) {
  let language = 'en-GB';
  if (market === 'ca') language = 'en-CA';
  if (market === 'us' || market === 'jp') language = 'en-US';
  return language;
}
