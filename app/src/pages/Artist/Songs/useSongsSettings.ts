import { useLocalStorage } from "../../../hooks/useLocalStorage";

export default function useSongsSettings() {
  const [groupSongs, setGroupSongs] = useLocalStorage(
    "songs:group-songs",
    true,
  );

  const [showAllVariousArtistsAlbums, setShowAllVariousArtistsAlbums] =
    useLocalStorage("songs:show-all-va-albums", true);

  const [saveSorting, setSaveSorting] = useLocalStorage(
    "songs:save-sorting",
    false,
  );

  const [showDolbyAtmosBadge, setShowDolbyAtmosBadge] = useLocalStorage(
    "songs:show-dolby-atmos-badge",
    false,
  );

  const [truncateAlbumNames, setTruncateAlbumNames] = useLocalStorage(
    "songs:truncate-album-names",
    false,
  );

  const [showIdsInCells, setShowIdsInCells] = useLocalStorage(
    "songs:show-ids-in-cells",
    false,
  );

  return {
    groupSongs,
    setGroupSongs,
    showAllVariousArtistsAlbums,
    setShowAllVariousArtistsAlbums,
    saveSorting,
    setSaveSorting,
    showDolbyAtmosBadge,
    setShowDolbyAtmosBadge,
    truncateAlbumNames,
    setTruncateAlbumNames,
    showIdsInCells,
    setShowIdsInCells,
  };
}

export type SongsSettingsType = ReturnType<typeof useSongsSettings>;
