import { useMemo, useState } from "react";
import { Video } from "../../../@types/video";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ScrollToTop from "../../../components/ScrollToTop";
import { CurrentVideoContext } from "../../../context/CurrentVideoContext";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import AsyncState from "../AsyncState";
import ClearFilter from "../ClearFilter";
import SearchBar from "../SearchBar";
import { sortItemsByOption } from "../sortItemsByOption";
import useFetchItems from "../useFetchItems";
import useFiltering from "../useFiltering";
import GridVirtualizer from "./GridVirtualizer";
import SortVideosDropdown, { type Sort } from "./SortVideosDropdown";
import useVideosSettings from "./useVideosSettings";
import VideoPreviewModal from "./VideoPreviewModal";
import VideosSettings from "./VideosSettings";

export default function VideosPage() {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  // SETTINGS
  const settings = useVideosSettings();

  // VIDEOS
  const query = useFetchItems("videos");
  const {
    items: videos,
    totalItems: totalVideos,
    fetchAllPages,
    setFetchAllPages,
    error,
    isLoading,
    hasNextPage,
  } = query;

  // SORTING
  const [sort, setSort] = useLocalStorage<Sort>("videos:sort", {
    field: "id",
    direction: "desc",
  });

  const sortedVideos = useMemo(
    () => sortItemsByOption(videos, sort),
    [videos, sort],
  );

  // FILTERING
  const {
    globalFilter,
    setGlobalFilter,
    filteredItems: filteredVideos,
    tabs,
  } = useFiltering(sortedVideos, [
    "attributes.name",
    "attributes.contentRating",
    "attributes.videoTraits",
    "attributes.albumName",
    "attributes.artistName",
    "attributes.releaseDate",
    "attributes.genreNames",
    "attributes.isrc",
    "id",
  ]);

  return (
    <AsyncState
      type="videos"
      isLoading={isLoading}
      error={error}
      itemsLength={videos.length}
    >
      {/* tabs */}
      {tabs}

      {/* search bar + settings */}
      <SearchBar
        type="videos"
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        fetchAllPages={fetchAllPages}
        setFetchAllPages={setFetchAllPages}
        resultsLength={filteredVideos.length}
        itemsLength={videos.length}
        totalLength={totalVideos}
      >
        {/* sort by */}
        <SortVideosDropdown sort={sort} setSort={setSort} />

        {/* settings */}
        <VideosSettings settings={settings} />
      </SearchBar>

      <div className="my-4">
        <CurrentVideoContext value={{ currentVideo, setCurrentVideo }}>
          {/* video cards */}
          {filteredVideos.length > 0 && (
            <GridVirtualizer
              videos={filteredVideos}
              settings={settings}
              query={query}
            />
          )}

          {/* video preview modal */}
          <VideoPreviewModal />
        </CurrentVideoContext>

        {/* no results */}
        {filteredVideos.length === 0 && (
          <ClearFilter setGlobalFilter={setGlobalFilter} />
        )}

        {/* loading spinner */}
        {hasNextPage && filteredVideos.length !== 0 && (
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
