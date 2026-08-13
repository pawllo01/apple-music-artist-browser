import marketsWithoutStore from '../static/markets-without-store.json' with { type: 'json' };
import type { Type } from '../types/item-types.js';
import type { Market } from '../types/market.js';
import { getStorefronts, normalizeIds, splitArrayIntoChunks } from './helpers.js';
import { loggedFetch } from './loggedFetch.js';

export async function getArtistItemIds(
  type: Type,
  artistId: number,
  market: Market,
  fullMode: boolean = false,
) {
  const { itunes, appleMusic } = getStorefronts(market);
  const marketWithItunesStore = !marketsWithoutStore.includes(market);

  const IDS: number[] = [];

  if (marketWithItunesStore) {
    IDS.push(...(await fetchIdsByStorefront(type, artistId, itunes)));
  }

  if (type === 'albums' || type === 'videos' || (type === 'songs' && fullMode)) {
    IDS.push(...(await fetchIdsByStorefront(type, artistId, appleMusic)));
  }

  // normal mode doesn't fetch thousands of songs from Various Artists albums (compilations)
  if (type === 'songs' && !fullMode) {
    // check missing albums
    if (!marketsWithoutStore.includes(market)) {
      const itunesAlbumIds = await fetchIdsByStorefront('albums', artistId, itunes);
      const appleMusicAlbumIds = await fetchIdsByStorefront('albums', artistId, appleMusic);
      const albumIdsOnlyOnAppleMusic = appleMusicAlbumIds.filter(
        (id) => !itunesAlbumIds.includes(id),
      );

      if (albumIdsOnlyOnAppleMusic.length > 0) {
        const songIds = await fetchSongIdsFromAlbums(albumIdsOnlyOnAppleMusic, appleMusic);
        IDS.push(...songIds);
      }
    }
    // for markets without iTunes Store, fetch only albums from Apple Music
    else {
      const appleMusicAlbumIds = await fetchIdsByStorefront('albums', artistId, appleMusic);
      if (appleMusicAlbumIds.length > 0) {
        const songIds = await fetchSongIdsFromAlbums(appleMusicAlbumIds, appleMusic);
        IDS.push(...songIds);
      }
    }
  }

  return normalizeIds(IDS);
}

const fetchIdsByStorefront = async (type: Type, artistId: number, storefrontHeader: string) => {
  const dkIds: Record<Type, number> = {
    albums: 2,
    songs: 1,
    videos: 5,
  };

  const url = `https://itunes.apple.com/WebObjects/MZStore.woa/wa/sort?entityType=1&id=${artistId}&dkId=${dkIds[type]}&sort=2&sortDirection=2`;

  const data = await fetchAppleJson(`${type} ids ${storefrontHeader}`, url, storefrontHeader);

  return (data.adamIds || []) as number[];
};

const fetchSongIdsFromAlbums = async (albumIds: number[], storefrontHeader: string) => {
  const albumIdChunks = splitArrayIntoChunks(albumIds, 100);

  const promises = albumIdChunks.map((ids) => {
    return fetchAppleJson(
      'Lookup albums',
      `https://uclient-api.itunes.apple.com/WebObjects/MZStorePlatform.woa/wa/lookup?id=${ids.join(',')}&version=2&caller=DI14&p=product`,
      storefrontHeader,
    );
  });

  const results = await Promise.all(promises);

  const songIds: number[] = [];

  for (const data of results) {
    if (data.results) {
      for (const album of Object.values(data.results) as any) {
        for (const item of Object.values(album.children) as any) {
          if (item.kind === 'song') {
            songIds.push(Number(item.id));
          }
        }
      }
    }
  }

  return songIds;
};

const fetchAppleJson = async (name: string, url: string, storefrontHeader: string) => {
  const res = await loggedFetch(name, url, {
    headers: {
      Host: 'itunes.apple.com',
      'User-Agent':
        'iTunes/12.13.10 (Windows; Microsoft Windows 11 x64 (Build 26200); x64) AppleWebKit/7613.2007.1014.14 (dt:2)',
      Accept: '*/*',
      Origin: 'https://music.apple.com',
      Referer: 'https://music.apple.com/',
      'X-Apple-Store-Front': storefrontHeader,
    },
  });

  if (!res.ok) throw new Error(`${name} request failed (${res.status} ${res.statusText})`);

  return await res.json();
};
