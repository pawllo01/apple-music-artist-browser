import type { Album } from './album.js';

export type Song = {
  id: string;
  type: string;
  href: string;
  attributes: Attributes;
  relationships: Relationships;
  meta?: Meta;
};

interface Meta {
  formerIds: string[];
}

interface Relationships {
  albums: Albums;
  artists: Artists;
}

interface Artists {
  href: string;
  data: ArtistDatum[];
  next?: string;
}

interface ArtistDatum {
  id: string;
  type: string;
  href: string;
  attributes?: ArtistAttributes;
  relationships?: ArtistRelationships;
}

interface ArtistRelationships {
  albums: ArtistAlbums;
}

interface ArtistAlbums {
  href: string;
  next: string;
  data: Datum[];
}

interface Datum {
  id: string;
  type: string;
  href: string;
}

interface ArtistAttributes {
  artwork: ArtistArtwork;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  name: string;
  url: string;
  classicalUrl?: string;
}

interface EditorialNotes {
  short: string;
}

interface ArtistArtwork {
  bgColor: string;
  defaultCropCode: string;
  hasP3: boolean;
  height: number;
  textColor1: string;
  textColor2: string;
  textColor3: string;
  textColor4: string;
  url: string;
  width: number;
}

interface Albums {
  href: string;
  data: Album[];
}

interface Attributes {
  albumName: string;
  artistName: string;
  artistUrl: string;
  artwork: Artwork;
  audioLocale: string;
  audioTraits: string[];
  composerName?: string;
  discNumber: number;
  durationInMillis?: number;
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
  contentRating?: string;
  attribution?: string;
  editorialNotes?: EditorialNotes;
}

interface EditorialNotes {
  short: string;
}

interface Preview {
  url: string;
}

interface PlayParams {
  id: string;
  kind: string;
}

interface Offer {
  type: string;
  buyParams?: string;
  price?: number;
  priceFormatted?: string;
}

interface Artwork {
  width: number;
  height: number;
  hasP3: boolean;
  url: string;
  bgColor: string;
  textColor1: string;
  textColor2: string;
  textColor3: string;
  textColor4: string;
}
