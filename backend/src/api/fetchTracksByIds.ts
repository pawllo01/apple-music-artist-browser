import type { Market } from '../types/market.js';
import type { Song } from '../types/song.js';
import { BASE_API_URL, headers } from './API.js';
import { apiFetch } from './apiFetch.js';
import { getLanguage } from './getLanguage.js';

export async function fetchTracksByIds(trackIds: number[], market: Market) {
  const params = new URLSearchParams({
    ids: trackIds.join(','),
    extend: 'artistUrl,offers',
    include: 'artists,albums',
    'limit[albums]': '1',
    l: getLanguage(market),
  });
  const url = `${BASE_API_URL}/${market}/songs?${params}`;

  const res = await apiFetch('Tracks', url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch tracks (${res.status} ${res.statusText})`);

  const data = await res.json();
  const tracks: Song[] = data.data || [];

  return tracks;
}
