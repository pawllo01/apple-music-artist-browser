import { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup } from "flowbite-react";
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

import type { SongWithChildren } from "../../../@types/song-with-children";
import ScrollToTop from "../../../components/ScrollToTop";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { DEFAULT_COLUMNS } from "../../constants";
import AsyncState from "../AsyncState";
import ClearFilter from "../ClearFilter";
import SearchBar from "../SearchBar";
import useFetchItems from "../useFetchItems";
import { createColumns } from "./columns";
import DropdownColumns from "./DropdownColumns";
import MusicPlayer from "./MusicPlayer";
import { processSongs } from "./processSongs";
import SongsSettings from "./SongsSettings";
import SongsTable from "./SongsTable";
import useSongsSettings from "./useSongsSettings";

type SongTab = "main" | "mixed" | "all";

export default function SongsPage() {
  const settings = useSongsSettings();
  const {
    groupSongs,
    showAllVariousArtistsAlbums,
    saveSorting,
    showDolbyAtmosBadge,
    truncateAlbumNames,
    showIdsInCells,
  } = settings;

  const [searchBarOffset, setSearchBarOffset] = useState<number>(0);

  // SONGS
  const query = useFetchItems("songs");
  const {
    items: songs,
    totalItems: totalSongs,
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

  return (
    <AsyncState
      type="songs"
      isLoading={isLoading}
      error={error}
      itemsLength={songs.length}
    >
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
      <SearchBar
        type="songs"
        setSearchBarOffset={setSearchBarOffset}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        fetchAllPages={fetchAllPages}
        setFetchAllPages={setFetchAllPages}
        resultsLength={rows.length}
        itemsLength={songs.length}
        totalLength={totalSongs}
      >
        {/* columns */}
        <DropdownColumns
          table={table}
          setColumnOrder={setColumnOrder}
          groupSongs={groupSongs}
        />

        {/* settings */}
        <SongsSettings settings={settings} resetColumns={resetColumns} />
      </SearchBar>

      {/* music player offset */}
      <div className="mb-17 md:mb-22 lg:mb-8">
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
        {rows.length === 0 && <ClearFilter setGlobalFilter={setGlobalFilter} />}
      </div>

      {/* music player & scroll to top */}
      <div className="fixed bottom-0 left-0 z-30 w-full">
        <div className="absolute right-6 bottom-full -translate-y-6">
          <ScrollToTop smooth={false} />
        </div>

        <MusicPlayer
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          rows={rows}
        />
      </div>
    </AsyncState>
  );
}
