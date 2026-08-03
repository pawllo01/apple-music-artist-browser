import type { Artist } from '../types/artist.js';
import type { Market } from '../types/market.js';
import { BASE_API_URL, headers } from './config.js';
import { getLanguage } from './helpers.js';
import { loggedFetch } from './loggedFetch.js';

export async function getArtist(artistId: number, market: Market) {
  const params = new URLSearchParams({
    extend: 'artistBio,bornOrFormed,isGroup,origin',
    'limit[albums]': '1',
    l: getLanguage(market),
  });
  const url = `${BASE_API_URL}/${market}/artists/${artistId}?${params}`;

  const res = await loggedFetch('Artist', url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch artist (${res.status} ${res.statusText})`);

  const data = await res.json();
  const artist: Artist = data.data[0];

  return artist;
}
