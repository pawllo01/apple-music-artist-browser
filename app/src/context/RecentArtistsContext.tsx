import { createContext } from "react";
import type { Artist } from "../@types/artist";

type RecentArtistsContextType = {
  recentArtists: Artist[];
  addRecentArtist: (artist: Artist) => void;
  removeArtist: (artistId: string) => void;
};

export const RecentArtistsContext =
  createContext<RecentArtistsContextType | null>(null);
