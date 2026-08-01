import type { Artwork } from './artwork.js';
import type { EditorialNotes } from './editorial-notes.js';

// https://developer.apple.com/documentation/applemusicapi/artists
export type Artist = {
  id: string;
  type: 'artists';
  href: string;
  attributes: Attributes;
};

// https://developer.apple.com/documentation/applemusicapi/artists/attributes-data.dictionary
interface Attributes {
  artwork?: Artwork;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  name: string;
  url: string;
  // amp
  artistBio?: string;
  bornOrFormed?: string;
  isGroup?: boolean;
  origin?: string;
}
