import type { Market } from '../types/market.js';
import type { Artist } from '../types/artist.js';
import { BASE_API_URL, headers } from './API.js';
import { apiFetch } from './apiFetch.js';
import { getLanguage } from './getLanguage.js';

export async function fetchArtists(term: string, market: Market) {
  const params = new URLSearchParams({
    types: 'artists,songs',
    with: 'serverBubbles',
    term,
    extend: 'artistBio,bornOrFormed,isGroup,origin',
    limit: '10',
    'limit[albums]': '1',
    l: getLanguage(market),
  });
  const url = `${BASE_API_URL}/${market}/search?${params}`;

  const res = await apiFetch('Search', url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch artists (${res.status} ${res.statusText})`);

  const data = await res.json();
  const artists: Artist[] = data.results?.artist?.data;

  return artists;
}
