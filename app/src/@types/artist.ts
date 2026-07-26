export type Artist = {
  id: string;
  type: string;
  href: string;
  attributes: Attributes;
  relationships: Relationships;
};

interface Relationships {
  albums: Albums;
}

interface Albums {
  href: string;
  next?: string;
  data: Datum[];
}

interface Datum {
  id: string;
  type: string;
  href: string;
}

interface Attributes {
  artistBio?: string;
  artwork?: Artwork;
  bornOrFormed?: string;
  editorialNotes?: EditorialNotes;
  genreNames: string[];
  isGroup: boolean;
  name: string;
  origin?: string;
  url: string;
}

interface EditorialNotes {
  short: string;
}

interface Artwork {
  width: number;
  height: number;
  url: string;
  bgColor: string;
  textColor1: string;
  textColor2: string;
  textColor3: string;
  textColor4: string;
}
