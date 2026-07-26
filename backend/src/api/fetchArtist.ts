import type { Market } from '../types/market.js';
import type { Artist } from '../types/artist.js';
import { BASE_API_URL, headers } from './API.js';
import { apiFetch } from './apiFetch.js';
import { getLanguage } from './getLanguage.js';

export async function fetchArtist(artistId: number, market: Market) {
  const params = new URLSearchParams({
    extend: 'artistBio,bornOrFormed,isGroup,origin',
    'limit[albums]': '1',
    l: getLanguage(market),
  });
  const url = `${BASE_API_URL}/${market}/artists/${artistId}?${params}`;

  const res = await apiFetch('Artist', url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch artist (${res.status} ${res.statusText})`);

  const data = await res.json();
  const artist: Artist = data.data[0];

  return artist;
}
