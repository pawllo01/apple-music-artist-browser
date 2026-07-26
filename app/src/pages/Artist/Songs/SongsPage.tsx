import { useEffect, useMemo, useRef, useState } from "react";

import { Alert, Button, ButtonGroup, TextInput, Tooltip } from "flowbite-react";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import { HiInformationCircle, HiSearch } from "react-icons/hi";

import {
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { hideKeyboard } from "../../../@other/fuctions";
import type { SongWithChildren } from "../../../@types/song-with-children";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ScrollToTop from "../../../components/ScrollToTop";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { DEFAULT_COLUMNS } from "../constants";
import { createColumns } from "./columns";
import DrawerSettings from "./DrawerSettings";
import DropdownColumns from "./DropdownColumns";
import DropdownSettings from "./DropdownSettings";
import MusicPlayer from "./MusicPlayer";
import { processSongs } from "./processSongs";
import SongsTable from "./SongsTable";
import useFetchSongs from "./useFetchSongs";
import useSongsSettings from "./useSongsSettings";

type SongTab = "main" | "mixed" | "all";

export default function SongsPage() {
  const settings = useSongsSettings();
  const {
    pinSearchBar,
    setPinSearchBar,
    groupSongs,
    showAllVariousArtistsAlbums,
    saveSorting,
    showDolbyAtmosBadge,
    truncateAlbumNames,
    showIdsInCells,
  } = settings;
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const searchBarOffset = pinSearchBar
    ? (searchBarRef.current?.getBoundingClientRect().height ?? 0)
    : 0;

  // SONGS
  const query = useFetchSongs();
  const {
    songs,
    totalSongs,
    fetchAllPages,
    setFetchAllPages,
    error,
    isLoading,
  } = query;

  const [activeTab, setActiveTab] = useState<SongTab>("main");

  const [currentSong, setCurrentSong] = useState<SongWithChildren | null>(null);

  const changeCurrentSong = (song: SongWithChildren) => {
    if (song.attributes.previews[0]?.url) setCurrentSong(song);
  };

  const processedSongs = useMemo(
    () => processSongs(songs, groupSongs, showAllVariousArtistsAlbums),
    [songs, groupSongs, showAllVariousArtistsAlbums],
  );

  const songsByTab = useMemo(() => {
    return processedSongs.reduce<Record<SongTab, SongWithChildren[]>>(
      (acc, song) => {
        const isMixed =
          song.attributes.name.endsWith("(Mixed)") ||
          song.attributes.name.endsWith("[Mixed]");

        acc.all.push(song);
        acc[isMixed ? "mixed" : "main"].push(song);

        return acc;
      },
      { main: [], mixed: [], all: [] },
    );
  }, [processedSongs]);

  // COLUMNS
  const columns = useMemo(
    () =>
      createColumns(
        groupSongs,
        showDolbyAtmosBadge,
        truncateAlbumNames,
        showIdsInCells,
        changeCurrentSong,
      ),
    [groupSongs, showDolbyAtmosBadge, truncateAlbumNames, showIdsInCells],
  );

  // TABLE STATES
  // https://tanstack.com/table/latest/docs/guide/global-filtering
  const [globalFilter, setGlobalFilter] = useState<string>("");

  // https://tanstack.com/table/latest/docs/guide/expanding
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // https://tanstack.com/table/latest/docs/guide/sorting
  const [sorting, setSorting] = useState<SortingState>(() => {
    if (saveSorting) {
      const savedSorting = localStorage.getItem("songs:sorting-state");
      if (savedSorting) {
        try {
          return JSON.parse(savedSorting);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (saveSorting)
      localStorage.setItem("songs:sorting-state", JSON.stringify(sorting));
  }, [saveSorting, sorting]);

  // https://tanstack.com/table/latest/docs/guide/column-ordering
  const [columnOrder, setColumnOrder] = useLocalStorage<string[]>(
    "songs:column-order",
    columns.map((c) => c.id!),
  );

  // https://tanstack.com/table/latest/docs/guide/column-visibility
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<VisibilityState>(
      "songs:column-visibility",
      DEFAULT_COLUMNS,
    );

  // hide group column when songs are not grouped
  const effectiveColumnVisibility = useMemo(
    () => ({
      ...columnVisibility,
      group: groupSongs && columnVisibility.group,
    }),
    [columnVisibility, groupSongs],
  );

  // TABLE
  const table = useReactTable({
    data: songsByTab[activeTab],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getSubRows: (row) => row.children, // return the children array as sub-rows
    state: {
      globalFilter,
      expanded,
      sorting,
      columnOrder,
      columnVisibility: effectiveColumnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,

    // https://tanstack.com/table/latest/docs/guide/expanding#filtering-expanded-rows
    filterFromLeafRows: true, // search through the expanded rows
    maxLeafRowFilterDepth: 10, // limit the depth of the expanded rows that are searched

    // https://tanstack.com/table/latest/docs/guide/grouping#grouping-state
    groupedColumnMode: false,
  });

  const { rows } = table.getRowModel();

  const resetColumns = () => {
    setColumnOrder(table.getAllColumns().map((c) => c.id));
    setColumnVisibility(DEFAULT_COLUMNS);
  };

  // collapse all rows when songs change
  useEffect(() => {
    table.toggleAllRowsExpanded(false);
  }, [songs, table]);

  // RENDER
  if (isLoading) return <LoadingSpinner />;

  if (error)
    return (
      <Alert color="failure" icon={HiInformationCircle} className="mt-4">
        {error.message}
      </Alert>
    );

  if (songs.length === 0)
    return (
      <Alert color="warning" icon={HiInformationCircle} className="mt-4">
        No results found.
      </Alert>
    );

  return (
    <>
      {/* song tabs */}
      {songsByTab.mixed.length > 0 && (
        <ButtonGroup className="mt-4 mb-0.5 w-full rounded-full">
          {(Object.keys(songsByTab) as SongTab[]).map((key) => (
            <Button
              key={key}
              color="alternative"
              className={`section-btn ${key === activeTab ? "bg-gray-600! text-white! dark:bg-gray-900!" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              {key} ({songsByTab[key].length})
            </Button>
          ))}
        </ButtonGroup>
      )}

      {/* search bar + settings */}
      <div
        ref={searchBarRef}
        className="top-0 z-40 -mx-4 border-b border-b-gray-200 bg-white p-4 pb-2 dark:border-b-gray-600 dark:bg-gray-600"
        style={{ position: pinSearchBar ? "sticky" : "relative" }}
      >
        <div className="flex h-10.5 gap-2">
          {/* search input (h-10.5) */}
          <TextInput
            type="search"
            placeholder="Search..."
            className="flex-1"
            icon={HiSearch}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            onKeyDown={hideKeyboard}
          />

          {/* pin search bar */}
          <Button
            color="alternative"
            className="aspect-square h-auto p-0 shadow-xs"
            title="Pin search bar"
            onClick={() => setPinSearchBar((prevState) => !prevState)}
          >
            {pinSearchBar ? (
              <BsPinAngleFill size={20} />
            ) : (
              <BsPinAngle size={20} />
            )}
          </Button>

          <ButtonGroup id="songs-settings-group">
            {/* columns */}
            <DropdownColumns
              table={table}
              setColumnOrder={setColumnOrder}
              groupSongs={groupSongs}
            />

            {/* settings */}
            <DrawerSettings settings={settings} resetColumns={resetColumns} />

            {/* old settings in dropdown */}
            {/* eslint-disable-next-line no-constant-binary-expression */}
            {false && (
              <DropdownSettings
                settings={settings}
                resetColumns={resetColumns}
              />
            )}
          </ButtonGroup>
        </div>

        <div className="ms-1 mt-2 flex flex-wrap items-center gap-x-2 text-sm text-gray-500 dark:text-gray-400">
          {/* results */}
          <Tooltip
            placement="bottom"
            content="Number of songs matching current settings"
          >
            Results: {rows.length}
          </Tooltip>

          {/* divider */}
          <span className="h-4 border-s" />

          {/* loaded songs */}
          <Tooltip
            placement="bottom"
            content="Total number of songs loaded from Apple Music"
          >
            Songs: {songs.length}
            {songs.length !== totalSongs
              ? ` / ${totalSongs} (${Math.floor((songs.length / totalSongs) * 100)}%)`
              : ""}
          </Tooltip>

          {/* load all */}
          {songs.length !== totalSongs && (
            <Tooltip
              placement="bottom"
              content="Keep scrolling to load more songs automatically, or load all songs now."
            >
              <button
                className={`underline underline-offset-2 ${fetchAllPages ? "text-red-600" : ""}`}
                onClick={() => setFetchAllPages((prevState) => !prevState)}
              >
                {fetchAllPages ? "Stop loading" : "Load all"}
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* songs table */}
      {rows.length > 0 && (
        <SongsTable
          table={table}
          query={query}
          searchBarOffset={searchBarOffset}
          currentSong={currentSong}
          changeCurrentSong={changeCurrentSong}
        />
      )}

      {/* no results */}
      {rows.length === 0 && (
        <div className="py-4 text-center text-gray-500">
          <p>No results found.</p>
          <Button
            color="red"
            className="gradient mx-auto mt-2 rounded-full"
            onClick={() => setGlobalFilter("")}
          >
            Clear filter
          </Button>
        </div>
      )}

      {/* music player offset */}
      <div className="mb-13 md:mb-18 lg:mb-4" />

      {/* music player & scroll to top */}
      <div className="fixed bottom-0 left-0 z-30 w-full">
        <div className="absolute right-4 bottom-full -translate-y-4">
          <ScrollToTop smooth={false} />
        </div>

        <MusicPlayer
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          rows={rows}
        />
      </div>
    </>
  );
}
