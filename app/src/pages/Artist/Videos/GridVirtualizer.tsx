import { useEffect, useLayoutEffect, useRef } from "react";
import { useResizeObserver } from "use-resize-observer";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import type { Video } from "../../../@types/video";
import { FetchItems as FetchVideos } from "../useFetchItems";
import useRestoreScrollPosition from "./useRestoreScrollPosition";
import type { VideosSettingsType } from "./useVideosSettings";
import VideoCard from "./VideoCard";

// grid virtualization example
// https://tanstack.com/virtual/latest/docs/framework/react/examples/dynamic

const GAP = 16;
const MIN_CARD_WIDTH = 280;
const MAX_CARD_WIDTH = 360; // for single-column layout

type Props = {
  videos: Video[];
  settings: VideosSettingsType;
  query: FetchVideos;
};

export default function GridVirtualizer({ videos, settings, query }: Props) {
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;

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

  const rowCount = Math.ceil(videos.length / columnCount);

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

  // virtualizer
  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => minCardHeight,
    overscan: 2,
    scrollMargin: parentOffsetRef.current,
    gap: GAP,
    measureElement: (e) => e.getBoundingClientRect().height,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  const topHeight =
    virtualRows.length > 0
      ? virtualRows[0].start - rowVirtualizer.options.scrollMargin
      : 0;

  const bottomHeight =
    virtualRows.length > 0
      ? rowVirtualizer.getTotalSize() -
        virtualRows[virtualRows.length - 1].end +
        rowVirtualizer.options.scrollMargin
      : 0;

  // fetch the next page when the last virtual row becomes visible
  // https://tanstack.com/virtual/latest/docs/framework/react/examples/infinite-scroll
  useEffect(() => {
    const [lastRow] = [...virtualRows].reverse();
    if (!lastRow) return;
    if (lastRow.index >= rowCount - 1 && hasNextPage && !isFetchingNextPage)
      fetchNextPage();
  }, [hasNextPage, fetchNextPage, rowCount, isFetchingNextPage, virtualRows]);

  // restore scroll position on resize
  useRestoreScrollPosition(parentWidth, columnCount, rowVirtualizer);

  return (
    <div ref={parentRef}>
      {parentWidth > 0 && (
        <>
          {topHeight > 0 && <div style={{ height: `${topHeight}px` }} />}

          {virtualRows.map((row) => {
            const start = row.index * columnCount;
            const rowVideos = videos.slice(start, start + columnCount);

            return (
              <div
                key={row.key}
                data-index={row.index}
                ref={rowVirtualizer.measureElement}
                className="grid justify-center"
                style={{
                  gridTemplateColumns: `repeat(${columnCount}, minmax(0, ${cardWidth}px))`,
                  columnGap: `${GAP}px`,
                  marginBottom: `${GAP}px`,
                }}
              >
                {rowVideos.map((video, index) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    index={start + index}
                    settings={settings}
                  />
                ))}
              </div>
            );
          })}

          {bottomHeight > 0 && <div style={{ height: `${bottomHeight}px` }} />}
        </>
      )}
    </div>
  );
}
