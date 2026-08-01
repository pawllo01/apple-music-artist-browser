import type { Album } from './album.js';
import type { Artist } from './artist.js';
import type { Artwork } from './artwork.js';
import type { EditorialNotes } from './editorial-notes.js';
import type { Offer } from './offer.js';
import type { PlayParams } from './play-params.js';

// https://developer.apple.com/documentation/applemusicapi/songs
export type Song = {
  id: string;
  type: 'songs';
  href: string;
  attributes: Attributes;
  relationships: Relationships;
};

// https://developer.apple.com/documentation/applemusicapi/songs/relationships-data.dictionary
interface Relationships {
  albums: Albums;
  artists: Artists;
}

// https://developer.apple.com/documentation/applemusicapi/songs/relationships-data.dictionary/songsartistsrelationship
interface Artists {
  href: string;
  next?: string;
  data: Artist[];
}

// https://developer.apple.com/documentation/applemusicapi/songs/relationships-data.dictionary/songsalbumsrelationship
interface Albums {
  href: string;
  next?: string;
  data: Omit<Album, 'relationships'>[];
}

// https://developer.apple.com/documentation/applemusicapi/songs/attributes-data.dictionary
interface Attributes {
  albumArtistName: string;
  albumName: string;
  artistName: string;
  artistUrl: string;
  artwork: Artwork;
  attribution?: string; // classical
  audioLocale: string;
  audioTraits: string[];
  composerName?: string;
  contentRating?: 'clean' | 'explicit';
  discNumber: number;
  durationInMillis?: number;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  hasLyrics: boolean;
  hasTimeSyncedLyrics: boolean;
  isAppleDigitalMaster: boolean;
  isMasteredForItunes: boolean;
  isVocalAttenuationAllowed: boolean;
  isrc: string;
  name: string;
  offers: Offer[];
  playParams?: PlayParams;
  previews: Preview[];
  releaseDate?: string;
  trackNumber: number;
  url: string;
}

// https://developer.apple.com/documentation/applemusicapi/preview
interface Preview {
  url: string;
}
