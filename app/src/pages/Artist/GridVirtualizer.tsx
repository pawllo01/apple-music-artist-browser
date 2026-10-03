import { useLayoutEffect, useMemo, useRef } from "react";

import { groupBy } from "lodash-es";
import { useResizeObserver } from "use-resize-observer";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import { getVirtualSpacerHeights } from "../../@other/fuctions";
import type { Album } from "../../@types/album";
import type { Video } from "../../@types/video";
import GroupTitle from "../../components/GroupTitle";
import type { FetchItems } from "./useFetchItems";
import useInfiniteScroll from "./useInfiniteScroll";
import useRestoreScrollPosition from "./useRestoreScrollPosition";

// grid virtualization example
// https://tanstack.com/virtual/v3/docs/framework/react/examples/dynamic

const GAP = 16;

type GridVirtualizerProps<T extends Album | Video> = {
  items: T[];
  groupByYear: {
    enabled: boolean;
    sortDescFirst: boolean;
  };
  query: FetchItems;
  minCardWidth: number;
  getCardHeight: (width: number) => number;
  renderItem: (item: T, index: number) => React.ReactNode;
};

export default function GridVirtualizer<T extends Album | Video>({
  items,
  groupByYear,
  query,
  minCardWidth,
  getCardHeight,
  renderItem,
}: GridVirtualizerProps<T>) {
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
    Math.floor((parentWidth + GAP) / (minCardWidth + GAP)),
  );

  const cardWidth =
    columnCount <= 2
      ? minCardWidth
      : (parentWidth - (columnCount - 1) * GAP) / columnCount;

  // rows
  const rows = useMemo(() => {
    const groupedItems = groupByYear.enabled
      ? groupBy(items, (item) => item.attributes.releaseDate.slice(0, 4))
      : { all: items };

    const groupEntries = Object.entries(groupedItems);
    if (groupByYear.sortDescFirst) groupEntries.reverse();

    return groupEntries.flatMap(([year, items]) =>
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#using_arrow_functions_and_array.from
      Array.from(
        { length: Math.ceil(items.length / columnCount) },
        (_, index) => {
          const startItemIndex = index * columnCount;
          return {
            items: items.slice(startItemIndex, startItemIndex + columnCount),
            startItemIndex,
            title: groupByYear.enabled && index === 0 && (
              <GroupTitle title={year} count={items.length} className="mb-4" />
            ),
          };
        },
      ),
    );
  }, [items, columnCount, groupByYear]);

  // virtualizer
  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: (index) =>
      getCardHeight(cardWidth) + (rows[index].title ? 45 : 0),
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
                {/* row title (optional) */}
                {row.title}

                {/* row items */}
                <div
                  className="grid justify-center"
                  style={{
                    gridTemplateColumns: `repeat(${columnCount}, minmax(0, ${cardWidth}px))`,
                    columnGap: `${GAP}px`,
                    marginBottom: `${GAP}px`,
                  }}
                >
                  {row.items.map((item, index) =>
                    renderItem(item, row.startItemIndex + index),
                  )}
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
