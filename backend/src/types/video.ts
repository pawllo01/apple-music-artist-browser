import type { Album } from './album.js';
import type { Artist } from './artist.js';
import type { Artwork } from './artwork.js';
import type { EditorialNotes } from './editorial-notes.js';
import type { Offer } from './offer.js';
import type { PlayParams } from './play-params.js';

// https://developer.apple.com/documentation/applemusicapi/musicvideos
export type Video = {
  id: string;
  type: 'music-videos';
  href: string;
  attributes: Attributes;
  relationships: Relationships;
};

// https://developer.apple.com/documentation/applemusicapi/musicvideos/relationships-data.dictionary
interface Relationships {
  albums: Albums;
  artists: Artists;
}

// https://developer.apple.com/documentation/applemusicapi/musicvideos/relationships-data.dictionary/musicvideosartistsrelationship
interface Artists {
  href: string;
  next?: string;
  data: Artist[];
}

// https://developer.apple.com/documentation/applemusicapi/musicvideos/relationships-data.dictionary/musicvideosalbumsrelationship
interface Albums {
  href: string;
  next?: string;
  data: Omit<Album, 'relationships'>[];
}

// https://developer.apple.com/documentation/applemusicapi/musicvideos/attributes-data.dictionary
interface Attributes {
  albumArtistName?: string;
  albumName?: string;
  artistName: string;
  artistUrl: string;
  artwork: Artwork;
  contentRating?: 'clean' | 'explicit';
  discNumber?: number;
  durationInMillis?: number;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  has4K: boolean;
  hasHDR: boolean;
  isrc: string;
  name: string;
  offers: Offer[];
  playParams?: PlayParams;
  previews: Preview[];
  releaseDate: string;
  trackNumber?: number;
  url: string;
  videoTraits: string[];
  workId?: string; // classical
  workName?: string; // classical
}

// https://developer.apple.com/documentation/applemusicapi/preview
interface Preview {
  artwork: Artwork;
  url: string;
  hlsUrl: string;
}
