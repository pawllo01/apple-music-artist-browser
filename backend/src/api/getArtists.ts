import type { Artist } from '../types/artist.js';
import type { Market } from '../types/market.js';
import { BASE_API_URL, headers } from './config.js';
import { getLanguage } from './helpers.js';
import { loggedFetch } from './loggedFetch.js';

export async function getArtists(term: string, market: Market) {
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

  const res = await loggedFetch('Search', url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch artists (${res.status} ${res.statusText})`);

  const data = await res.json();
  const artists: Artist[] = data.results?.artist?.data;

  return artists;
}
