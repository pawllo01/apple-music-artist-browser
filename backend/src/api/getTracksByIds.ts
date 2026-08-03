import type { Market } from '../types/market.js';
import type { Song } from '../types/song.js';
import { BASE_API_URL, headers } from './config.js';
import { getLanguage } from './helpers.js';
import { loggedFetch } from './loggedFetch.js';

export async function getTracksByIds(trackIds: number[], market: Market) {
  const params = new URLSearchParams({
    ids: trackIds.join(','),
    extend: 'artistUrl,offers',
    include: 'artists,albums',
    'limit[albums]': '1',
    l: getLanguage(market),
  });
  const url = `${BASE_API_URL}/${market}/songs?${params}`;

  const res = await loggedFetch('Tracks', url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch tracks (${res.status} ${res.statusText})`);

  const data = await res.json();
  const tracks: Song[] = data.data || [];

  return tracks;
}
