export type Album = {
  id: string;
  type: string;
  href: string;
  attributes: Attributes;
};

interface Attributes {
  artistName: string;
  artwork: Artwork;
  audioTraits: string[];
  contentRating?: string;
  copyright?: string;
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
  artistUrl?: string;
  editorialNotes?: EditorialNotes;
}

interface Artwork {
  bgColor: string;
  hasP3: boolean;
  height: number;
  textColor1: string;
  textColor2: string;
  textColor3: string;
  textColor4: string;
  url: string;
  width: number;
}

interface Offer {
  buyParams: string;
  price: number;
  priceFormatted: string;
  type: string;
}

interface PlayParams {
  id: string;
  kind: string;
}

interface EditorialNotes {
  name?: string;
  short: string;
  tagline?: string;
  standard?: string;
}
