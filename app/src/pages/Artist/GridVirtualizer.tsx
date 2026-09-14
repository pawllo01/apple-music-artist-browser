import { useLayoutEffect, useMemo, useRef } from "react";

import { Badge } from "flowbite-react";
import { groupBy } from "lodash-es";
import { useResizeObserver } from "use-resize-observer";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import { getVirtualSpacerHeights } from "../../@other/fuctions";
import type { Album } from "../../@types/album";
import type { Video } from "../../@types/video";
import type { FetchItems } from "./useFetchItems";
import useInfiniteScroll from "./useInfiniteScroll";
import useRestoreScrollPosition from "./useRestoreScrollPosition";

// grid virtualization example
// https://tanstack.com/virtual/latest/docs/framework/react/examples/dynamic

const GAP = 16;

type Row<T extends Album | Video> = {
  items: T[];
  startItemIndex: number;
  hasTitle: boolean;
  groupTitle: string;
  groupItemCount: number;
};

type GridVirtualizerProps<T extends Album | Video> = {
  items: T[];
  groupByYear: {
    enabled: boolean;
    sortDescFirst: boolean;
  };
  query: FetchItems;
  minCardWidth: number;
  maxSingleColumnCardWidth: number;
  getCardHeight: (width: number) => number;
  renderItem: (item: T, index: number) => React.ReactNode;
};

export default function GridVirtualizer<T extends Album | Video>({
  items,
  groupByYear,
  query,
  minCardWidth,
  maxSingleColumnCardWidth,
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
    columnCount === 1
      ? maxSingleColumnCardWidth
      : (parentWidth - (columnCount - 1) * GAP) / columnCount;

  // rows
  const rows = useMemo(() => {
    const groupedItems = groupByYear.enabled
      ? groupBy(items, (item) => item.attributes.releaseDate.slice(0, 4))
      : { all: items };

    const groupEntries = Object.entries(groupedItems);

    if (groupByYear.sortDescFirst) groupEntries.reverse();

    const rows: Row<T>[] = [];

    groupEntries.forEach(([year, items]) => {
      for (let i = 0; i < items.length; i += columnCount) {
        rows.push({
          items: items.slice(i, i + columnCount),
          startItemIndex: i,
          hasTitle: groupByYear.enabled && i === 0,
          groupTitle: year,
          groupItemCount: items.length,
        });
      }
    });

    return rows;
  }, [items, columnCount, groupByYear]);

  // virtualizer
  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: (index) =>
      getCardHeight(cardWidth) + (rows[index].hasTitle ? 45 : 0),
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
                      {row.groupItemCount}
                    </Badge>
                  </h3>
                )}

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
