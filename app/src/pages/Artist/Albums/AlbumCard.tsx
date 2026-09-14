import { HR } from "flowbite-react";
import { Album } from "../../../@types/album";
import ArtistListModal from "../ArtistListModal";
import InfoBadges from "../InfoBadges";
import { AlbumsSettingsType } from "./useAlbumsSettings";

type AlbumCardProps = {
  album: Album;
  index: number;
  settings: AlbumsSettingsType;
};

export default function AlbumCard({ album, index, settings }: AlbumCardProps) {
  return (
    <div className="group w-full text-sm">
      {/* thumbnail */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600">
        <a href={album.attributes.url} target="_blank" className="block">
          <img
            src={album.attributes.artwork.url.replace("{w}x{h}", "300x300")}
            className={`aspect-square w-full bg-black object-contain`}
          />
        </a>
      </div>

      {/* title & info badges */}
      <div className="mt-0.5 flex items-start justify-between gap-1">
        <p className="line-clamp-5 text-base font-medium text-pretty">
          {settings.showNumbering && `${index + 1}. `}
          {settings.truncateAlbumNames
            ? album.attributes.name.replace(/ - (Single|EP)$/, "")
            : album.attributes.name}
        </p>

        <div className="mt-0.5 flex shrink-0 gap-1">
          <InfoBadges
            item={album}
            showDolbyAtmos={settings.showDolbyAtmosBadge}
          />
        </div>
      </div>

      {/* artists */}
      {settings.showArtists && (
        <ArtistListModal
          type="albums"
          artistName={album.attributes.artistName}
          artists={album.relationships.artists.data}
          className="text-red-500 dark:text-red-400"
        />
      )}

      <div className="text-gray-500 dark:text-gray-400">
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
        {(settings.showUpc || settings.showAlbumId) && (
          <HR className="mt-1 mb-2 dark:bg-gray-500" />
        )}

        {/* upc */}
        {settings.showUpc && <p>UPC: {album.attributes.upc}</p>}

        {/* album id */}
        {settings.showAlbumId && <p>ID: {album.id}</p>}
      </div>
    </div>
  );
}
