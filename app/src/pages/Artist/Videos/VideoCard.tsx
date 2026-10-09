import { useContext } from "react";

import { HR } from "flowbite-react";
import { FaPlay } from "react-icons/fa";

import { convertMillisecondsToMMSS } from "../../../@other/fuctions";
import { Video } from "../../../@types/video";
import { CurrentVideoContext } from "../../../context/CurrentVideoContext";
import ArtistListModal from "../ArtistListModal";
import ContextMenu from "../ContextMenu";
import InfoBadges from "../InfoBadges";
import { VideosSettingsType } from "./useVideosSettings";

type Props = {
  video: Video;
  index: number;
  settings: VideosSettingsType;
  isList: boolean;
};

export default function VideoCard({ video, index, settings, isList }: Props) {
  const { setCurrentVideo } = useContext(CurrentVideoContext)!;

  const title = `${settings.showNumbering ? `${index + 1}. ` : ""}${video.attributes.name}`;

  const album = video.relationships.albums.data[0];

  return (
    <div
      className={`group w-full text-sm ${isList ? "flex items-center gap-2 border-t border-gray-300 py-2 dark:border-gray-500" : ""}`}
    >
      {/* thumbnail */}
      <div
        className={`relative ${isList ? "w-[clamp(130px,45%,240px)] shrink-0" : ""}`}
      >
        <a
          href={video.attributes.url}
          target="_blank"
          className="block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600"
        >
          <img
            src={video.attributes.artwork.url.replace("{w}x{h}mv", "640x640bb")}
            className={`aspect-video w-full ${settings.cropThumbnails ? "object-cover" : "bg-black object-contain"}`}
          />
        </a>

        {/* preview */}
        <button
          className="hover:gradient absolute bottom-2 left-2 flex size-9 items-center justify-center rounded-full bg-black/50 transition lg:opacity-0 lg:group-hover:opacity-100"
          title="Watch Preview"
          onClick={() => setCurrentVideo(video)}
        >
          <FaPlay className="size-3 text-white" />
        </button>

        {/* duration */}
        {video.attributes.durationInMillis && (
          <span className="absolute right-2 bottom-2 rounded bg-black/50 p-1 text-xs leading-none text-white group-hover:hidden">
            {convertMillisecondsToMMSS(video.attributes.durationInMillis)}
          </span>
        )}

        {/* context menu */}
        <ContextMenu item={video} />
      </div>

      <div className={`${isList ? "flex-1" : ""}`}>
        {/* title & info badges */}
        {isList ? (
          <p className="text-base font-medium">
            {title}&nbsp;
            <span className="inline-flex shrink-0 gap-1 align-middle">
              <InfoBadges item={video} />
            </span>
          </p>
        ) : (
          <div className="mt-0.5 flex items-start justify-between gap-1">
            <p className="line-clamp-5 text-base font-medium text-pretty">
              {title}
            </p>
            <span className="mt-0.5 flex shrink-0 gap-1">
              <InfoBadges item={video} />
            </span>
          </div>
        )}

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

        <div className="text-gray-500 dark:text-gray-300">
          <p>
            {/* release date */}
            <span title={video.attributes.releaseDate}>
              {settings.showFullReleaseDate
                ? video.attributes.releaseDate
                : video.attributes.releaseDate?.slice(0, 4)}
            </span>

            {/* genre */}
            {settings.showGenre && ` • ${video.attributes.genreNames[0]}`}
          </p>

          {/* horizontal line */}
          {(settings.showIsrc || settings.showVideoId) &&
            (isList ? (
              <div className="mt-2" />
            ) : (
              <HR className="mt-0.5 mb-1.5 dark:bg-gray-600" />
            ))}

          {/* isrc */}
          {settings.showIsrc && (
            <p>
              <strong>ISRC</strong>: {video.attributes.isrc}
            </p>
          )}

          {/* video id */}
          {settings.showVideoId && (
            <p>
              <strong>ID</strong>: {video.id}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
