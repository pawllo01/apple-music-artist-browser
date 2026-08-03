import marketsWithoutStore from '../static/markets-without-store.json' with { type: 'json' };
import storefronts from '../static/storefronts.json' with { type: 'json' };
import type { Market } from '../types/market.js';
import { loggedFetch } from './loggedFetch.js';

export async function getArtistTrackIds(
  artistId: number,
  market: Market,
  fullMode: boolean = false,
) {
  const storefront = storefronts[market];
  if (!storefront) throw new Error('Invalid market');

  const itunesStorefront = storefront.storefront;
  const appleMusicStorefront = `${storefront.storefront} t:music31`;

  const ALL_SONG_IDS: number[] = [];

  // fetch all itunes songs (only for markets with iTunes Store)
  if (!marketsWithoutStore.includes(market)) {
    const itunesIds = await fetchArtistItemIds('songs', artistId, itunesStorefront);
    ALL_SONG_IDS.push(...itunesIds);
  }

  if (fullMode) {
    // fetch all apple music songs
    const appleMusicIds = await fetchArtistItemIds('songs', artistId, appleMusicStorefront);
    ALL_SONG_IDS.push(...appleMusicIds);
  }
  // normal mode doesn't fetch thousands of tracks from Various Artists albums (compilations)
  else {
    // check missing albums
    if (!marketsWithoutStore.includes(market)) {
      const itunesAlbumIds = await fetchArtistItemIds('albums', artistId, itunesStorefront);
      const appleMusicAlbumIds = await fetchArtistItemIds('albums', artistId, appleMusicStorefront);
      const albumIdsOnlyOnAppleMusic = appleMusicAlbumIds.filter(
        (id) => !itunesAlbumIds.includes(id),
      );

      if (albumIdsOnlyOnAppleMusic.length > 0) {
        const songIds = await fetchSongIdsFromAlbums(
          albumIdsOnlyOnAppleMusic,
          appleMusicStorefront,
        );
        ALL_SONG_IDS.push(...songIds);
      }
    }
    // for markets without iTunes Store, fetch only albums from Apple Music
    else {
      const appleMusicAlbumIds = await fetchArtistItemIds('albums', artistId, appleMusicStorefront);
      if (appleMusicAlbumIds.length > 0) {
        const songIds = await fetchSongIdsFromAlbums(appleMusicAlbumIds, appleMusicStorefront);
        ALL_SONG_IDS.push(...songIds);
      }
    }
  }

  return [...new Set(ALL_SONG_IDS)].sort((a, b) => b - a).slice(0, 20000); // 20k limit
}

const fetchArtistItemIds = async (
  type: 'albums' | 'songs' | 'videos',
  artistId: number,
  storefrontHeader: string,
) => {
  const dkIds: Record<typeof type, number> = {
    albums: 2,
    songs: 1,
    videos: 5,
  };

  const url = `https://itunes.apple.com/WebObjects/MZStore.woa/wa/sort?entityType=1&id=${artistId}&dkId=${dkIds[type]}&sort=2&sortDirection=2`;

  const data = await fetchAppleJson(`${type} ids ${storefrontHeader}`, url, storefrontHeader);

  return (data.adamIds || []) as number[];
};

const fetchSongIdsFromAlbums = async (albumIds: number[], storefrontHeader: string) => {
  const url = `https://uclient-api.itunes.apple.com/WebObjects/MZStorePlatform.woa/wa/lookup?id=${albumIds.join(',')}&version=2&caller=DI14&p=product`;

  const data = await fetchAppleJson(`Lookup albums`, url, storefrontHeader);

  const songIds: number[] = [];

  if (data.results) {
    // get only song ids
    for (const album of Object.values(data.results) as any) {
      for (const song of Object.values(album.children) as any) {
        if (song.kind === 'song') {
          songIds.push(Number(song.id));
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
