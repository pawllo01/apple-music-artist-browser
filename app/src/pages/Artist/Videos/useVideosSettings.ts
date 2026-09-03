import { useLocalStorage } from "../../../hooks/useLocalStorage";

export default function useVideosSettings() {
  const [groupByYear, setGroupByYear] = useLocalStorage(
    "videos:group-by-year",
    { enabled: false, sortDescFirst: true },
  );

  const [cropThumbnails, setCropThumbnails] = useLocalStorage(
    "videos:crop-thumbnails",
    true,
  );

  const [showNumbering, setShowNumbering] = useLocalStorage(
    "videos:show-numbering",
    false,
  );

  const [showFromAlbum, setShowFromAlbum] = useLocalStorage(
    "videos:show-from-album",
    true,
  );

  const [showArtists, setShowArtists] = useLocalStorage(
    "videos:show-artists",
    true,
  );

  const [showFullReleaseDate, setShowFullReleaseDate] = useLocalStorage(
    "videos:show-full-release-date",
    false,
  );

  const [showGenre, setShowGenre] = useLocalStorage("videos:show-genre", true);

  const [showIsrc, setShowIsrc] = useLocalStorage("videos:show-isrc", false);

  const [showVideoId, setShowVideoId] = useLocalStorage(
    "videos:show-video-id",
    false,
  );

  return {
    groupByYear,
    setGroupByYear,
    cropThumbnails,
    setCropThumbnails,
    showNumbering,
    setShowNumbering,
    showFromAlbum,
    setShowFromAlbum,
    showArtists,
    setShowArtists,
    showFullReleaseDate,
    setShowFullReleaseDate,
    showGenre,
    setShowGenre,
    showIsrc,
    setShowIsrc,
    showVideoId,
    setShowVideoId,
  };
}

export type VideosSettingsType = ReturnType<typeof useVideosSettings>;
