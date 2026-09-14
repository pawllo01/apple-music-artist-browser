import { useLocalStorage } from "../../../hooks/useLocalStorage";

export default function useAlbumsSettings() {
  const [groupByYear, setGroupByYear] = useLocalStorage(
    "albums:group-by-year",
    { enabled: false, sortDescFirst: true },
  );

  const [showNumbering, setShowNumbering] = useLocalStorage(
    "albums:show-numbering",
    false,
  );

  const [truncateAlbumNames, setTruncateAlbumNames] = useLocalStorage(
    "albums:truncate-album-names",
    false,
  );

  const [showDolbyAtmosBadge, setShowDolbyAtmosBadge] = useLocalStorage(
    "albums:show-dolby-atmos-badge",
    false,
  );

  const [showArtists, setShowArtists] = useLocalStorage(
    "albums:show-artists",
    true,
  );

  const [showFullReleaseDate, setShowFullReleaseDate] = useLocalStorage(
    "albums:show-full-release-date",
    false,
  );

  const [showSongCount, setShowSongCount] = useLocalStorage(
    "albums:show-song-count",
    true,
  );

  const [showGenre, setShowGenre] = useLocalStorage("albums:show-genre", false);

  const [showLabel, setShowLabel] = useLocalStorage("albums:show-label", false);

  const [showUpc, setShowUpc] = useLocalStorage("albums:show-isrc", false);

  const [showAlbumId, setShowAlbumId] = useLocalStorage(
    "albums:show-album-id",
    false,
  );

  return {
    groupByYear,
    setGroupByYear,
    showNumbering,
    setShowNumbering,
    truncateAlbumNames,
    setTruncateAlbumNames,
    showDolbyAtmosBadge,
    setShowDolbyAtmosBadge,
    showArtists,
    setShowArtists,
    showFullReleaseDate,
    setShowFullReleaseDate,
    showSongCount,
    setShowSongCount,
    showGenre,
    setShowGenre,
    showLabel,
    setShowLabel,
    showUpc,
    setShowUpc,
    showAlbumId,
    setShowAlbumId,
  };
}

export type AlbumsSettingsType = ReturnType<typeof useAlbumsSettings>;
