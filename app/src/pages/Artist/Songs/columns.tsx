import { Badge } from "flowbite-react";
import { FaPlay } from "react-icons/fa";
import { createColumnHelper } from "@tanstack/react-table";
import { convertMillisecondsToMMSS } from "../../../@other/fuctions";
import type { SongWithChildren } from "../../../@types/song-with-children";
import { ExpandButton } from "../../../components/ExpandButton";
import InfoBadges from "../InfoBadges";

// docs - https://tanstack.com/table/latest/docs/guide/column-defs

const columnHelper = createColumnHelper<SongWithChildren>();

const sizes = {
  FULL: "flex-1 min-w-64",
  count: "w-[48px] justify-center",
  cover: "w-[64px]",
  time: "w-[65px]",
  date: "w-[87px]",
  album_date: "w-[87px]",
  group: "w-[87px]",
  isrc: "w-[109px]",
  upc: "w-[127px]",
  song_id: "w-[95px]",
  album_id: "w-[95px]",
};

export function createColumns(
  groupSongs: boolean,
  showDolbyAtmosBadge: boolean,
  truncateAlbumNames: boolean,
  showIdsInCells: boolean,
  changeCurrentSong: (song: SongWithChildren) => void,
) {
  return [
    // count
    columnHelper.display({
      id: "count",
      meta: { className: sizes.count },
      header: ({ table }) =>
        groupSongs ? (
          <ExpandButton
            title="Expand all rows"
            expanded={table.getIsAllRowsExpanded()}
            onClick={table.getToggleAllRowsExpandedHandler()}
          />
        ) : (
          <p className="text-center">#</p>
        ),
      cell: ({ row, index }) => (
        // index is passed when rendering cells
        // https://github.com/TanStack/table/discussions/2974#discussioncomment-15452130
        <span className="flex flex-col items-center">
          {index + 1}
          {row.subRows.length > 0 && (
            <ExpandButton
              title={`${row.subRows.length} more song${row.subRows.length > 1 ? "s" : ""}`}
              expanded={row.getIsExpanded()}
              onClick={row.getToggleExpandedHandler()}
            />
          )}
        </span>
      ),
    }),

    // cover
    columnHelper.display({
      id: "cover",
      meta: { className: sizes.cover },
      header: "Cover",
      cell: ({ row }) => (
        <div className="relative aspect-square w-12 overflow-hidden rounded">
          <img
            src={row.original.attributes.artwork.url.replace(
              "{w}x{h}",
              "60x60",
            )}
            className="size-full object-contain"
          />
          {/* overlay */}
          {row.original.attributes.previews[0]?.url && (
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => changeCurrentSong(row.original)}
            >
              <FaPlay className="size-4 text-white/90" />
            </div>
          )}
        </div>
      ),
    }),

    // name
    columnHelper.accessor("attributes.name", {
      id: "name",
      enableHiding: false,
      meta: { className: sizes.FULL },
      header: "Name",
      cell: ({ row, getValue }) => (
        <span className="flex items-center gap-1">
          <span>
            <a
              href={row.original.attributes.url}
              target="_blank"
              className="hover:underline"
            >
              {getValue()}
              {showIdsInCells && ` [${row.original.id}]`}
            </a>
          </span>
          <InfoBadges
            item={row.original}
            showDolbyAtmos={showDolbyAtmosBadge}
          />
        </span>
      ),
    }),

    // artist
    columnHelper.accessor(
      (song) => song.attributes.artistName.replace(" & ", ", "),
      {
        id: "artist",
        meta: { className: sizes.FULL },
        header: "Artist",
        cell: ({ row }) => (
          <span>
            {row.original.relationships.artists.data.map((artist, i) => (
              <span key={artist.id}>
                <a
                  href={artist.attributes?.url}
                  target="_blank"
                  className="hover:underline"
                >
                  {artist.attributes?.name}
                </a>
                {i < row.original.relationships.artists.data.length - 1 && ", "}
              </span>
            ))}
          </span>
        ),
      },
    ),

    // album
    columnHelper.accessor("attributes.albumName", {
      id: "album",
      meta: { className: sizes.FULL },
      header: "Album",
      cell: ({ row, getValue }) => {
        const album = row.original.relationships.albums.data[0];
        return (
          <span className="flex items-center gap-1">
            <span>
              <a
                href={album.attributes.url}
                target="_blank"
                className="hover:underline"
              >
                {truncateAlbumNames
                  ? getValue().replace(/ - (Single|EP)$/, "")
                  : getValue()}
                {showIdsInCells && ` [${album.id}]`}
              </a>
            </span>
            <InfoBadges item={album} showDolbyAtmos={showDolbyAtmosBadge} />
          </span>
        );
      },
    }),

    // time
    columnHelper.accessor((song) => song.attributes.durationInMillis || 0, {
      id: "time",
      enableGlobalFilter: false,
      meta: { className: sizes.time },
      header: "Time",
      cell: ({ getValue }) => convertMillisecondsToMMSS(getValue()),
    }),

    // date
    columnHelper.accessor((song) => song.attributes.releaseDate || "", {
      id: "date",
      sortDescFirst: true,
      meta: { className: sizes.date },
      header: "Date",
      cell: ({ row }) => (
        <span className="text-nowrap">
          {row.original.attributes.releaseDate}
        </span>
      ),
    }),

    // album date
    columnHelper.accessor(
      (song) => song.relationships.albums.data[0].attributes.releaseDate || "",
      {
        id: "album_date",
        sortDescFirst: true,
        meta: { className: sizes.album_date },
        header: "Album date",
        cell: ({ row }) => (
          <span className="text-nowrap">
            {row.original.relationships.albums.data[0].attributes.releaseDate}
          </span>
        ),
      },
    ),

    // group
    columnHelper.accessor((song) => song.children?.length || 0, {
      id: "group",
      meta: { className: sizes.group },
      header: ({ table }) => (
        <span className="flex items-center justify-between gap-1">
          Group
          <ExpandButton
            title="Expand all rows"
            expanded={table.getIsAllRowsExpanded()}
            onClick={(e) => {
              e.stopPropagation();
              table.toggleAllRowsExpanded();
            }}
          />
        </span>
      ),
      cell: ({ row }) =>
        row.subRows.length > 0 && (
          <ExpandButton
            title={`${row.subRows.length} more song${row.subRows.length > 1 ? "s" : ""}`}
            expanded={row.getIsExpanded()}
            onClick={row.getToggleExpandedHandler()}
          >
            <Badge className="pointer-events-none ms-1 rounded-full px-1.5 select-none">
              {row.subRows.length}
            </Badge>
          </ExpandButton>
        ),
    }),

    // isrc
    columnHelper.accessor("attributes.isrc", {
      id: "isrc",
      meta: { className: sizes.isrc },
      header: "ISRC",
      cell: ({ getValue }) => <span className="font-mono">{getValue()}</span>,
    }),

    // upc
    columnHelper.accessor(
      (song) => song.relationships.albums.data[0].attributes.upc,
      {
        id: "upc",
        meta: { className: sizes.upc },
        header: "UPC",
        cell: ({ getValue }) => getValue(),
      },
    ),

    // song id
    columnHelper.accessor((song) => Number(song.id), {
      id: "song_id",
      meta: { className: sizes.song_id },
      header: "Song ID",
      cell: ({ getValue }) => getValue(),
    }),

    // album id
    columnHelper.accessor(
      (song) => Number(song.relationships.albums.data[0].id),
      {
        id: "album_id",
        meta: { className: sizes.album_id },
        header: "Album ID",
        cell: ({ getValue }) => getValue(),
      },
    ),
  ];
}
