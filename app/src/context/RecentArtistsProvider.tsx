import type { ReactNode } from "react";
import { useCallback } from "react";
import type { Artist } from "../@types/artist";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { RecentArtistsContext } from "./RecentArtistsContext";

export default function RecentArtistsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [recentArtists, setRecentArtists] = useLocalStorage<Artist[]>(
    "app:recent-artists",
    [],
  );

  const addRecentArtist = useCallback(
    (artist: Artist) => {
      setRecentArtists((prev) =>
        [artist, ...prev.filter((a) => a.id !== artist.id)].slice(0, 20),
      );
    },
    [setRecentArtists],
  );

  const removeArtist = useCallback(
    (artistId: string) => {
      setRecentArtists((prev) => prev.filter((a) => a.id !== artistId));
    },
    [setRecentArtists],
  );

  return (
    <RecentArtistsContext
      value={{ recentArtists, addRecentArtist, removeArtist }}
    >
      {children}
    </RecentArtistsContext>
  );
}
