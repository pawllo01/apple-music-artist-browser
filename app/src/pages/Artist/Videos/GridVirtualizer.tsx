import { useLayoutEffect, useMemo, useRef } from "react";

import { Badge } from "flowbite-react";
import { groupBy } from "lodash-es";
import { useResizeObserver } from "use-resize-observer";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import { getVirtualSpacerHeights } from "../../../@other/fuctions";
import type { Video } from "../../../@types/video";
import { FetchItems as FetchVideos } from "../useFetchItems";
import useInfiniteScroll from "../useInfiniteScroll";
import useRestoreScrollPosition from "./useRestoreScrollPosition";
import type { VideosSettingsType } from "./useVideosSettings";
import VideoCard from "./VideoCard";

// grid virtualization example
// https://tanstack.com/virtual/latest/docs/framework/react/examples/dynamic

const GAP = 16;
const MIN_CARD_WIDTH = 280;
const MAX_CARD_WIDTH = 360; // for single-column layout

type Row = {
  videos: Video[];
  startVideoIndex: number;
  hasTitle: boolean;
  groupTitle: string;
  groupVideoCount: number;
};

type Props = {
  videos: Video[];
  settings: VideosSettingsType;
  query: FetchVideos;
};

export default function GridVirtualizer({ videos, settings, query }: Props) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const parentOffsetRef = useRef(0);
  const { width: parentWidth = 0 } = useResizeObserver<HTMLDivElement>({
    ref: parentRef,
  });

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  // calculations
  const columnCount = Math.max(
    1,
    Math.floor((parentWidth + GAP) / (MIN_CARD_WIDTH + GAP)),
  );

  const cardWidth =
    columnCount === 1
      ? MAX_CARD_WIDTH
      : (parentWidth - (columnCount - 1) * GAP) / columnCount;

  const thumbnailHeight = cardWidth * (9 / 16); // aspect-video

  const minCardHeight =
    thumbnailHeight /* thumbnail */ +
    26 /* title + margin */ +
    20 /* release date */ +
    (settings.showArtists ? 20 : 0) /* artists */ +
    (settings.showIsrc || settings.showVideoId ? 13 : 0) /* horizontal line */ +
    (settings.showIsrc ? 20 : 0) /* isrc */ +
    (settings.showVideoId ? 20 : 0); /* video id */

  // rows
  const rows = useMemo(() => {
    const groupedVideos = settings.groupByYear.enabled
      ? groupBy(videos, (v) => v.attributes.releaseDate.slice(0, 4))
      : { all: videos };

    const groupEntries = Object.entries(groupedVideos);

    if (settings.groupByYear.sortDescFirst) groupEntries.reverse();

    const rows: Row[] = [];

    groupEntries.forEach(([year, videos]) => {
      for (let i = 0; i < videos.length; i += columnCount) {
        rows.push({
          videos: videos.slice(i, i + columnCount),
          startVideoIndex: i,
          hasTitle: settings.groupByYear.enabled && i === 0,
          groupTitle: year,
          groupVideoCount: videos.length,
        });
      }
    });

    return rows;
  }, [videos, columnCount, settings.groupByYear]);

  // virtualizer
  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: (index) => minCardHeight + (rows[index].hasTitle ? 45 : 0),
    overscan: 2,
    scrollMargin: parentOffsetRef.current,
    gap: GAP,
    measureElement: (e) => e.getBoundingClientRect().height,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  const { topSpacerHeight, bottomSpacerHeight } =
    getVirtualSpacerHeights(rowVirtualizer);

  useInfiniteScroll(virtualRows, rows.length, query);

  // restore scroll position on resize
  useRestoreScrollPosition(parentWidth, columnCount, rowVirtualizer);

  return (
    <div ref={parentRef}>
      {parentWidth > 0 && (
        <>
          {topSpacerHeight > 0 && (
            <div style={{ height: `${topSpacerHeight}px` }} />
          )}

          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
              >
                {/* row title */}
                {row.hasTitle && (
                  <h3 className="mb-4 flex items-center gap-x-1.5 border-b border-b-gray-200 pb-1 dark:border-b-gray-700">
                    <span className="text-2xl leading-none font-bold">
                      {row.groupTitle}
                    </span>
                    <Badge size="sm" color="gray" className="bg-gray-200">
                      {row.groupVideoCount}
                    </Badge>
                  </h3>
                )}

                {/* row videos */}
                <div
                  className="grid justify-center"
                  style={{
                    gridTemplateColumns: `repeat(${columnCount}, minmax(0, ${cardWidth}px))`,
                    columnGap: `${GAP}px`,
                    marginBottom: `${GAP}px`,
                  }}
                >
                  {row.videos.map((video, index) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      index={row.startVideoIndex + index}
                      settings={settings}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {bottomSpacerHeight > 0 && (
            <div style={{ height: `${bottomSpacerHeight}px` }} />
          )}
        </>
      )}
    </div>
  );
}
