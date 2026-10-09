import { HR } from "flowbite-react";

import { Album } from "../../../@types/album";
import ArtistListModal from "../ArtistListModal";
import ContextMenu from "../ContextMenu";
import InfoBadges from "../InfoBadges";
import { AlbumsSettingsType } from "./useAlbumsSettings";

type Props = {
  album: Album;
  index: number;
  settings: AlbumsSettingsType;
  isList: boolean;
};

export default function AlbumCard({ album, index, settings, isList }: Props) {
  const title = `${settings.showNumbering ? `${index + 1}. ` : ""}${
    settings.truncateAlbumNames
      ? album.attributes.name.replace(/ - (Single|EP)$/, "")
      : album.attributes.name
  }`;

  return (
    <div
      className={`group w-full text-sm ${isList ? "flex items-center gap-2 border-t border-gray-300 py-2 dark:border-gray-500" : ""}`}
    >
      {/* thumbnail */}
      <div
        className={`relative ${isList ? "w-[clamp(115px,33%,140px)] shrink-0" : ""}`}
      >
        <a
          href={album.attributes.url}
          target="_blank"
          className="block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600"
        >
          <img
            src={album.attributes.artwork.url.replace("{w}x{h}", "300x300")}
            className={`aspect-square w-full bg-black object-contain`}
          />
        </a>

        {/* context menu */}
        <ContextMenu item={album} />
      </div>

      <div className={`${isList ? "flex-1" : ""}`}>
        {/* title & info badges */}
        {isList ? (
          <p className="text-base font-medium">
            {title}&nbsp;
            <span className="inline-flex shrink-0 gap-1 align-middle">
              <InfoBadges
                item={album}
                showDolbyAtmos={settings.showDolbyAtmosBadge}
              />
            </span>
          </p>
        ) : (
          <div className="mt-0.5 flex items-start justify-between gap-1">
            <p className="line-clamp-5 text-base font-medium text-pretty">
              {title}
            </p>
            <span className="mt-0.5 flex shrink-0 gap-1">
              <InfoBadges
                item={album}
                showDolbyAtmos={settings.showDolbyAtmosBadge}
              />
            </span>
          </div>
        )}

        {/* artists */}
        {settings.showArtists && (
          <ArtistListModal
            type="albums"
            artistName={album.attributes.artistName}
            artists={album.relationships.artists.data}
            className="text-red-500 dark:text-red-400"
          />
        )}

        <div className="text-gray-500 dark:text-gray-300">
          <p>
            {/* release date */}
            <span title={album.attributes.releaseDate}>
              {settings.showFullReleaseDate
                ? album.attributes.releaseDate
                : album.attributes.releaseDate?.slice(0, 4)}
            </span>

            {/* track count */}
            {settings.showSongCount &&
              ` • ${album.attributes.trackCount} ${album.attributes.trackCount > 1 ? "songs" : "song"}`}

            {/* genre */}
            {settings.showGenre && ` • ${album.attributes.genreNames[0]}`}
          </p>

          {/* label */}
          {settings.showLabel && <p>{album.attributes.recordLabel}</p>}

          {/* horizontal line */}
          {(settings.showUpc || settings.showAlbumId) &&
            (isList ? (
              <div className="mt-2" />
            ) : (
              <HR className="mt-0.5 mb-1.5 dark:bg-gray-600" />
            ))}

          {/* upc */}
          {settings.showUpc && (
            <p>
              <strong>UPC</strong>: {album.attributes.upc}
            </p>
          )}

          {/* album id */}
          {settings.showAlbumId && (
            <p>
              <strong>ID</strong>: {album.id}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
