import type { Album } from './album.js';
import type { Song } from './song.js';
import type { Video } from './video.js';

export type ItemMap = {
  albums: Album;
  songs: Song;
  videos: Video;
};

export type Type = keyof ItemMap;
