import type { ItemMap, Type } from '../types/item-types.js';
import type { Market } from '../types/market.js';
import { BASE_API_URL, headers } from './config.js';
import { getLanguage } from './helpers.js';
import { loggedFetch } from './loggedFetch.js';

export async function getItems<T extends Type>(type: T, ids: number[], market: Market) {
  const params = new URLSearchParams({
    ids: ids.join(','),
    extend: 'artistUrl,offers',
    include: 'artists,albums',
    'limit[albums]': '1',
    'limit[tracks]': '1',
    l: getLanguage(market),
  });
  const apiType = type === 'videos' ? 'music-videos' : type;
  const url = `${BASE_API_URL}/${market}/${apiType}?${params}`;

  const res = await loggedFetch(type, url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch ${type} (${res.status} ${res.statusText})`);

  const data = await res.json();
  const items: ItemMap[T][] = data.data || [];

  return items;
}
