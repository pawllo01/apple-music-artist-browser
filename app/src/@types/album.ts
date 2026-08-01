import type { Artist } from './artist.js';
import type { Artwork } from './artwork.js';
import type { EditorialNotes } from './editorial-notes.js';
import type { Offer } from './offer.js';
import type { PlayParams } from './play-params.js';

// https://developer.apple.com/documentation/applemusicapi/albums
export type Album = {
  id: string;
  type: 'albums';
  href: string;
  attributes: Attributes;
  relationships: Relationships;
};

// https://developer.apple.com/documentation/applemusicapi/albums/relationships-data.dictionary
interface Relationships {
  artists: Artists;
}

// https://developer.apple.com/documentation/applemusicapi/albums/relationships-data.dictionary/albumsartistsrelationship
interface Artists {
  href: string;
  next?: string;
  data: Artist[];
}

// https://developer.apple.com/documentation/applemusicapi/albums/attributes-data.dictionary
interface Attributes {
  artistName: string;
  artistUrl?: string;
  artwork: Artwork;
  audioTraits: string[];
  classicalUrl?: string;
  contentRating?: 'clean' | 'explicit';
  copyright?: string;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  isCompilation: boolean;
  isComplete: boolean;
  isMasteredForItunes: boolean;
  isPrerelease: boolean;
  isSingle: boolean;
  name: string;
  offers: Offer[];
  playParams?: PlayParams;
  recordLabel?: string;
  releaseDate: string;
  trackCount: number;
  upc: string;
  url: string;
}
