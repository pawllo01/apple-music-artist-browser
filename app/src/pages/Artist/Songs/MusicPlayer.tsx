import type { Dispatch, SetStateAction } from "react";
import AudioPlayer from "react-h5-audio-player";
import type { Row } from "@tanstack/react-table";

import type { SongWithChildren } from "../../../@types/song-with-children";
import CloseButton from "../../../components/CloseButton";
import ArtistListModal from "../ArtistListModal";
import InfoBadges from "../InfoBadges";

type MusicPlayerProps = {
  currentSong: SongWithChildren | null;
  setCurrentSong: Dispatch<SetStateAction<SongWithChildren | null>>;
  rows: Row<SongWithChildren>[];
};

export default function MusicPlayer({
  currentSong,
  setCurrentSong,
  rows,
}: MusicPlayerProps) {
  const changeSong = (direction: 1 | -1) => {
    if (!currentSong || rows.length === 0) return;

    const currentRowIndex = rows.findIndex(
      (row) => row.original.id === currentSong.id,
    );

    if (currentRowIndex === -1) {
      setCurrentSong(rows[0].original);
      return;
    }

    let rowIndex = currentRowIndex;

    for (let i = 0; i < rows.length; i++) {
      rowIndex = (rowIndex + direction + rows.length) % rows.length;

      const song = rows[rowIndex].original;

      if (song.attributes.previews[0]?.url) {
        setCurrentSong(song);
        break;
      }
    }
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
    />
  );

  return (
    currentSong && (
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-2 border-t border-t-gray-200 bg-white/90 backdrop-blur lg:grid-cols-[1fr_2fr_1fr] dark:border-t-transparent dark:bg-gray-700/90">
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
              className="line-clamp-1! text-sm text-gray-500 dark:text-gray-400"
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
