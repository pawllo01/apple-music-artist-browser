import { useMemo } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ScrollToTop from "../../../components/ScrollToTop";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import AsyncState from "../AsyncState";
import ClearFilter from "../ClearFilter";
import GridVirtualizer from "../GridVirtualizer";
import SearchBar from "../SearchBar";
import { sortItemsByOption } from "../sortItemsByOption";
import SortItemsDropdown, { type Sort } from "../SortItemsDropdown";
import useFetchItems from "../useFetchItems";
import useFiltering from "../useFiltering";
import AlbumCard from "./AlbumCard";
import AlbumsSettings from "./AlbumsSettings";
import useAlbumsSettings from "./useAlbumsSettings";

export default function AlbumsPage() {
  // SETTINGS
  const settings = useAlbumsSettings();

  // ALBUMS
  const query = useFetchItems("albums");
  const {
    items: albums,
    totalItems: totalAlbums,
    fetchAllPages,
    setFetchAllPages,
    error,
    isLoading,
    hasNextPage,
  } = query;

  // SORTING
  const [sort, setSort] = useLocalStorage<Sort>("albums:sort", {
    field: "id",
    direction: "desc",
  });

  const sortedAlbums = useMemo(
    () => sortItemsByOption(albums, sort),
    [albums, sort],
  );

  // FILTERING
  const {
    globalFilter,
    setGlobalFilter,
    filteredItems: filteredAlbums,
    tabs,
  } = useFiltering(sortedAlbums, [
    "attributes.name",
    "attributes.contentRating",
    "attributes.artistName",
    "attributes.releaseDate",
    "attributes.genreNames",
    "attributes.recordLabel",
    "attributes.upc",
    "id",
  ]);

  return (
    <AsyncState
      type="albums"
      isLoading={isLoading}
      error={error}
      itemsLength={albums.length}
    >
      {/* tabs */}
      {tabs}

      {/* search bar + settings */}
      <SearchBar
        type="albums"
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        fetchAllPages={fetchAllPages}
        setFetchAllPages={setFetchAllPages}
        resultsLength={filteredAlbums.length}
        itemsLength={albums.length}
        totalLength={totalAlbums}
      >
        {/* sort by */}
        <SortItemsDropdown sort={sort} setSort={setSort} />

        {/* settings */}
        <AlbumsSettings settings={settings} />
      </SearchBar>

      <div className="my-4">
        {/* album cards */}
        {filteredAlbums.length > 0 && (
          <GridVirtualizer
            items={filteredAlbums}
            groupByYear={settings.groupByYear}
            query={query}
            minCardWidth={220}
            maxSingleColumnCardWidth={280}
            getCardHeight={(width) =>
              /* thumbnail (1:1) */ width +
              /* title + margin */ 26 +
              /* release date */ 20 +
              /* artists */ (settings.showArtists ? 20 : 0) +
              /* label */ (settings.showLabel ? 20 : 0) +
              /* horizontal line */ (settings.showUpc || settings.showAlbumId
                ? 13
                : 0) +
              /* upc */ (settings.showUpc ? 20 : 0) +
              /* album id */ (settings.showAlbumId ? 20 : 0)
            }
            renderItem={(album, index) => (
              <AlbumCard
                key={album.id}
                album={album}
                index={index}
                settings={settings}
              />
            )}
          />
        )}

        {/* no results */}
        {filteredAlbums.length === 0 && (
          <ClearFilter setGlobalFilter={setGlobalFilter} />
        )}

        {/* loading spinner */}
        {hasNextPage && filteredAlbums.length !== 0 && (
          <LoadingSpinner className="text-center" />
        )}
      </div>

      {/* scroll to top */}
      <div className="fixed right-6 bottom-6 z-10">
        <ScrollToTop smooth={false} />
      </div>
    </AsyncState>
  );
}
