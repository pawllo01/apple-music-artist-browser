import type { Song } from "../../../@types/song";
import type { SongWithChildren } from "../../../@types/song-with-children";
import { VA } from "../../constants";

export function processSongs(
  songs: Song[],
  groupSongs: boolean,
  showAllVariousArtistsAlbums: boolean,
): Song[] | SongWithChildren[] {
  if (!groupSongs && showAllVariousArtistsAlbums) return songs; // get ALL songs

  if (!groupSongs) return getSongsWithoutVA(songs);

  return getGroupedSongs(songs, showAllVariousArtistsAlbums);
}

// all songs from non-various albums must be returned
// if song (with unique isrc) only appears on VA albums, only one will be returned
function getSongsWithoutVA(songs: Song[]) {
  const seenISRCs = new Set(
    songs
      .filter(
        (s) => s.relationships.albums.data[0].attributes?.artistName !== VA,
      )
      .map((s) => s.attributes.isrc),
  );

  return songs.filter((s) => {
    const isrc = s.attributes.isrc;
    const isVarious =
      s.relationships.albums.data[0].attributes?.artistName === VA;

    return !isVarious || (!seenISRCs.has(isrc) && seenISRCs.add(isrc));
  });
}

// prefer non-various songs - if possible parent song shouldn't be from VA album
// may cause reorder when firstly parent song is from VA album and then the non-various song is loaded (intended)
function getGroupedSongs(songs: Song[], showAllVariousArtistsAlbums: boolean) {
  const preferedSongs = songs.toSorted((a, b) => {
    const aAlbum = a.relationships.albums.data[0];
    const bAlbum = b.relationships.albums.data[0];
    const aVarious = Number(aAlbum.attributes?.artistName === VA);
    const bVarious = Number(bAlbum.attributes?.artistName === VA);
    return aVarious - bVarious;
  });

  const groups = preferedSongs.reduce<Record<string, Song[]>>((acc, song) => {
    const isrc = song.attributes.isrc;
    acc[isrc] ??= [];
    acc[isrc].push(song);
    return acc;
  }, {});

  const groupedSongs: SongWithChildren[] = [];

  // iterate over songs to keep original song order
  for (const song of songs) {
    const isrc = song.attributes.isrc;
    const parent = groups[isrc][0];

    if (song.id !== parent.id) continue;

    const children = groups[isrc].slice(1);
    const filtered = showAllVariousArtistsAlbums
      ? children
      : children.filter(
          (s) => s.relationships.albums.data[0].attributes?.artistName !== VA,
        );

    groupedSongs.push({ ...parent, children: filtered });
  }

  return groupedSongs;
}
