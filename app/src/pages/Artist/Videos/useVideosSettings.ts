import { useLocalStorage } from "../../../hooks/useLocalStorage";

export default function useVideosSettings() {
  const [cropThumbnails, setCropThumbnails] = useLocalStorage(
    "videos:crop-thumbnails",
    true,
  );

  const [showVideoNumbers, setShowVideoNumbers] = useLocalStorage(
    "videos:show-video-numbers",
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

  const [showGenre, setShowGenre] = useLocalStorage("videos:show-genre", true);

  const [showFullReleaseDate, setShowFullReleaseDate] = useLocalStorage(
    "videos:show-full-release-date",
    false,
  );

  const [showIsrc, setShowIsrc] = useLocalStorage("videos:show-isrc", false);

  const [showVideoId, setShowVideoId] = useLocalStorage(
    "videos:show-video-id",
    false,
  );

  return {
    cropThumbnails,
    setCropThumbnails,
    showVideoNumbers,
    setShowVideoNumbers,
    showFromAlbum,
    setShowFromAlbum,
    showArtists,
    setShowArtists,
    showGenre,
    setShowGenre,
    showFullReleaseDate,
    setShowFullReleaseDate,
    showIsrc,
    setShowIsrc,
    showVideoId,
    setShowVideoId,
  };
}

export type VideosSettingsType = ReturnType<typeof useVideosSettings>;
