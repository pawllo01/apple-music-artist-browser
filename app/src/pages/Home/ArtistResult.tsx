import { useContext } from "react";

import { Badge } from "flowbite-react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router";

import type { Artist } from "../../@types/artist";
import Avatar from "../../components/Avatar";
import CloseButton from "../../components/CloseButton";
import LabeledValue from "../../components/LabeledValue";
import { RecentArtistsContext } from "../../context/RecentArtistsContext";

type ArtistResultProps = {
  artist: Artist;
  showRemoveArtist: boolean;
};

export default function ArtistResult({
  artist,
  showRemoveArtist,
}: ArtistResultProps) {
  const { removeArtist } = useContext(RecentArtistsContext)!;

  const artistType = artist.attributes.isGroup ? "Group" : "Artist";

  return (
    <Link
      to={`/artist/${artist.id}/songs`}
      state={{ artist }}
      className="flex items-center gap-4 border-b border-gray-200 p-3 last:border-none hover:bg-gray-50 dark:border-gray-500 dark:hover:bg-gray-800"
    >
      {/* cover */}
      <Avatar
        url={artist.attributes.artwork?.url}
        className="size-12 shadow-lg"
      />

      <div className="flex flex-1 items-center justify-between gap-4">
        {/* name & type */}
        <div className="grow">
          <p className="font-medium">{artist.attributes.name}</p>

          <Badge
            color={artistType === "Artist" ? "gray" : "warning"}
            className="pointer-events-none w-fit shadow-sm"
          >
            {artistType}
          </Badge>
        </div>

        {/* genre */}
        {artist.attributes.genreNames.length > 0 && (
          <div className="grow text-end">
            <LabeledValue
              label="Genre"
              value={artist.attributes.genreNames[0]}
            />
          </div>
        )}

        {showRemoveArtist && (
          <CloseButton
            title="Remove artist"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeArtist(artist.id);
            }}
          />
        )}
      </div>
    </Link>
  );
}

export function ArtistResultSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-gray-200 p-3 last:border-none hover:bg-gray-50 dark:border-gray-500 dark:hover:bg-gray-800">
      {/* cover */}
      <Skeleton
        circle
        className="size-12! shadow-lg"
        containerClassName="block leading-none"
      />

      <div className="flex flex-1 items-center justify-between gap-4">
        {/* name & type */}
        <div className="grow">
          <Skeleton className="max-w-28" />
          <Skeleton width={46} height={20} className="shadow-sm" />
        </div>

        {/* genre */}
        <div className="grow text-end">
          <Skeleton
            width={38}
            className="text-xs"
            containerClassName="block leading-none"
          />
          <Skeleton className="max-w-18 text-sm" />
        </div>
      </div>
    </div>
  );
}
