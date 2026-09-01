import { useContext } from "react";
import { HR } from "flowbite-react";
import { FaPlay } from "react-icons/fa";

import { convertMillisecondsToMMSS } from "../../../@other/fuctions";
import { Video } from "../../../@types/video";
import { CurrentVideoContext } from "../../../context/CurrentVideoContext";
import ArtistListModal from "../ArtistListModal";
import InfoBadges from "../InfoBadges";
import { VideosSettingsType } from "./useVideosSettings";

type VideoCardProps = {
  video: Video;
  index: number;
  settings: VideosSettingsType;
};

export default function VideoCard({ video, index, settings }: VideoCardProps) {
  const { setCurrentVideo } = useContext(CurrentVideoContext)!;

  const album = video.relationships.albums.data[0];

  return (
    <div className="group w-full text-sm">
      {/* thumbnail */}
      <div className="relative">
        <a
          href={video.attributes.url}
          target="_blank"
          className="block overflow-hidden rounded-xl"
        >
          <img
            src={video.attributes.artwork.url.replace("{w}x{h}mv", "640x640bb")}
            className={`aspect-video w-full ${settings.cropThumbnails ? "object-cover" : "bg-black object-contain"}`}
          />
        </a>

        {/* preview */}
        <button
          className="absolute bottom-3 left-3 rounded-full bg-black/50 transition hover:scale-110 lg:opacity-0 lg:group-hover:opacity-100"
          title="Watch Preview"
          onClick={() => setCurrentVideo(video)}
        >
          <FaPlay className="m-3 size-3 text-white" />
        </button>

        {/* duration */}
        {video.attributes.durationInMillis && (
          <span className="absolute right-2 bottom-2 rounded bg-black/50 p-1 text-xs leading-none text-white">
            {convertMillisecondsToMMSS(video.attributes.durationInMillis)}
          </span>
        )}
      </div>

      {/* title & info badges */}
      <div className="mt-0.5 flex items-start justify-between gap-1">
        <p className="text-base font-medium">
          {settings.showNumbering && `${index + 1}. `}
          {video.attributes.name}
        </p>
        <p className="mt-0.5 flex shrink-0 gap-1">
          <InfoBadges item={video} />
        </p>
      </div>

      {/* from album */}
      {album && settings.showFromAlbum && (
        <p className="text-primary-600 dark:text-primary-400">
          From:{" "}
          <a
            href={album.attributes.url}
            target="_blank"
            className="hover:underline"
          >
            {album.attributes.name}
            {album.attributes.contentRating === "explicit" && <>&nbsp;[E]</>}
            {album.attributes.contentRating === "clean" && <>&nbsp;[C]</>}
          </a>
        </p>
      )}

      {/* artists */}
      {settings.showArtists && (
        <ArtistListModal
          type="videos"
          artistName={video.attributes.artistName}
          artists={video.relationships.artists.data}
          className="text-red-500 dark:text-red-400"
        />
      )}

      <div className="text-gray-500 dark:text-gray-400">
        <p>
          {/* release date */}
          <span title={video.attributes.releaseDate}>
            {settings.showFullReleaseDate
              ? video.attributes.releaseDate
              : video.attributes.releaseDate?.slice(0, 4)}
          </span>

          {/* genre */}
          {settings.showGenre && (
            <>
              {video.attributes.releaseDate && " • "}
              {video.attributes.genreNames.join(", ")}
            </>
          )}
        </p>

        {/* horizontal line */}
        {(settings.showIsrc || settings.showVideoId) && (
          <HR className="mt-1 mb-2 dark:bg-gray-500" />
        )}

        {/* isrc */}
        {settings.showIsrc && <p>ISRC: {video.attributes.isrc}</p>}

        {/* video id */}
        {settings.showVideoId && <p>ID: {video.id}</p>}
      </div>
    </div>
  );
}
