import { useContext, useEffect, useMemo, useState } from "react";

import { Button, ButtonGroup } from "flowbite-react";
import Fuse from "fuse.js/basic";
import { useParams } from "react-router";

import { getOfferFlags } from "../../../@other/fuctions";
import { Video } from "../../../@types/video";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ScrollToTop from "../../../components/ScrollToTop";
import { MarketContext } from "../../../context/MarketContext";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { INFO_BADGES } from "../../constants";
import AsyncState from "../AsyncState";
import ClearFilter from "../ClearFilter";
import SearchBar from "../SearchBar";
import useFetchItems from "../useFetchItems";
import GridVirtualizer from "./GridVirtualizer";
import { sortVideosByOption } from "./sortVideosByOption";
import SortVideosDropdown, { type Sort } from "./SortVideosDropdown";
import useVideosSettings from "./useVideosSettings";
import VideosSettings from "./VideosSettings";

type VideoTab = "all" | "streaming_only" | "purchase_only";

const tabNames: Record<VideoTab, React.ReactNode> = {
  all: "All",
  streaming_only: <>{INFO_BADGES.streaming_only}Streaming only</>,
  purchase_only: <>{INFO_BADGES.purchase_only}Purchase only</>,
};

export default function VideosPage() {
  const { artistId } = useParams();
  const { market } = useContext(MarketContext)!;

  const [activeTab, setActiveTab] = useState<VideoTab>("all");

  useEffect(() => {
    setActiveTab("all");
  }, [artistId, market]);

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
    () => sortVideosByOption(videos, sort),
    [videos, sort],
  );

  const videosByTab = useMemo(() => {
    return sortedVideos.reduce<Record<VideoTab, Video[]>>(
      (acc, video) => {
        const { isStreamingOnly, isPurchaseOnly } = getOfferFlags(
          video.attributes.offers,
        );

        acc.all.push(video);
        if (isStreamingOnly) acc.streaming_only.push(video);
        if (isPurchaseOnly) acc.purchase_only.push(video);

        return acc;
      },
      { all: [], streaming_only: [], purchase_only: [] },
    );
  }, [sortedVideos]);

  // FILTERING
  const [globalFilter, setGlobalFilter] = useState<string>("");

  // https://www.fusejs.io/fuzzy-search.html
  const fuse = useMemo(() => {
    return new Fuse(videosByTab[activeTab], {
      keys: [
        "attributes.name",
        "attributes.contentRating",
        "attributes.videoTraits",
        "attributes.albumName",
        "attributes.artistName",
        "attributes.releaseDate",
        "attributes.genreNames",
        "attributes.isrc",
        "id",
      ],
      threshold: 0,
      ignoreLocation: true,
      ignoreDiacritics: true,
      shouldSort: false,
    });
  }, [videosByTab, activeTab]);

  const filteredVideos = fuse
    .search(globalFilter.trim())
    .map((fuseResult) => fuseResult.item);

  return (
    <AsyncState
      type="videos"
      isLoading={isLoading}
      error={error}
      itemsLength={videos.length}
    >
      {/* video tabs */}
      {(videosByTab.streaming_only.length > 0 ||
        videosByTab.purchase_only.length > 0) && (
        <ButtonGroup className="mt-4 mb-0.5 w-full rounded-full">
          {(Object.keys(videosByTab) as VideoTab[]).map((key) => {
            const count = videosByTab[key].length;
            if (count === 0) return;
            return (
              <Button
                key={key}
                color="alternative"
                className={`section-btn ${key === activeTab ? "bg-gray-600! text-white! dark:bg-gray-900!" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                {tabNames[key]} ({count})
              </Button>
            );
          })}
        </ButtonGroup>
      )}

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
        {/* video cards */}
        {filteredVideos.length > 0 && (
          <GridVirtualizer
            videos={filteredVideos}
            settings={settings}
            query={query}
          />
        )}

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
