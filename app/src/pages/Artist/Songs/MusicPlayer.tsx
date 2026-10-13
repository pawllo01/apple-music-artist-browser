import { useMemo, useState } from "react";

import { shuffle } from "lodash-es";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import { LuRepeat1, LuShuffle } from "react-icons/lu";
import type { Row } from "@tanstack/react-table";

import type { Song } from "../../../@types/song";
import CloseButton from "../../../components/CloseButton";
import ArtistListModal from "../ArtistListModal";
import InfoBadges from "../InfoBadges";

type MusicPlayerProps = {
  currentSong: Song | null;
  setCurrentSong: React.Dispatch<React.SetStateAction<Song | null>>;
  rows: Row<Song>[];
};

export default function MusicPlayer({
  currentSong,
  setCurrentSong,
  rows,
}: MusicPlayerProps) {
  const [isShuffle, setIsShuffle] = useState(false);

  const playableSongs = useMemo(() => {
    return rows
      .map((row) => row.original)
      .filter((song) => Boolean(song.attributes.previews[0]?.url));
  }, [rows]);

  const shuffledSongs = useMemo(() => {
    return shuffle(playableSongs);
  }, [playableSongs]);

  const songs = isShuffle ? shuffledSongs : playableSongs;

  const songIndexMap = useMemo(() => {
    return new Map(songs.map((song, index) => [song.id, index]));
  }, [songs]);

  const currentIndex = currentSong
    ? (songIndexMap.get(currentSong.id) ?? -1)
    : -1;

  const changeSong = (direction: 1 | -1) => {
    const total = songs.length;
    if (total === 0) return;

    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + direction + total) % total;

    setCurrentSong(songs[nextIndex]);
  };

  const player = (
    <AudioPlayer
      autoPlay
      src={currentSong?.attributes.previews[0]?.url}
      className="bg-transparent! shadow-none! outline-0"
      showDownloadProgress={false}
      showJumpControls={false}
      showSkipControls={true}
      onEnded={() => changeSong(1)}
      onClickNext={() => changeSong(1)}
      onClickPrevious={() => changeSong(-1)}
      customIcons={{
        loopOff: <LuRepeat1 title="Repeat" />,
        loop: <LuRepeat1 title="Repeat" className="text-red-500" />,
      }}
      customAdditionalControls={[
        RHAP_UI.LOOP,
        <button onClick={() => setIsShuffle((prev) => !prev)}>
          <LuShuffle
            title="Shuffle"
            className={`size-6.5 hover:opacity-90 ${isShuffle ? "text-red-500" : "text-[#868686]"}`}
          />
        </button>,
      ]}
    />
  );

  return (
    currentSong && (
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-2 border-t border-t-gray-200 bg-white/90 backdrop-blur lg:grid-cols-[1fr_2fr_1fr] dark:border-t-gray-600 dark:bg-gray-700/90">
        {/* song info */}
        <div className="flex items-center gap-2 ps-2 pt-2 lg:pt-0">
          {/* cover */}
          <img
            src={currentSong.attributes.artwork.url.replace("{w}x{h}", "60x60")}
            alt="Album cover"
            className="aspect-square w-12 rounded object-contain"
          />

          <div>
            {/* title */}
            <p className="flex items-center gap-1">
              <span
                className="line-clamp-1 text-sm"
                title={currentSong.attributes.name}
              >
                {currentSong.attributes.name}
              </span>
              <InfoBadges item={currentSong} />
            </p>

            {/* artists */}
            <ArtistListModal
              type="songs"
              artistName={currentSong.attributes.artistName}
              artists={currentSong.relationships.artists.data}
              className="line-clamp-1! text-sm text-gray-500 dark:text-gray-300"
            />
          </div>
        </div>

        {/* player */}
        <div className="col-span-2 row-start-2 lg:col-span-1 lg:row-start-auto">
          {player}
        </div>

        {/* close button */}
        <div className="pe-2 pt-2 lg:ms-auto lg:pt-0">
          <CloseButton onClick={() => setCurrentSong(null)} />
        </div>
      </div>
    )
  );
}
