import { useLayoutEffect, useMemo, useRef } from "react";
import { groupBy } from "lodash-es";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import { getVirtualSpacerHeights } from "../../@other/fuctions";
import type { Album } from "../../@types/album";
import type { Video } from "../../@types/video";
import GroupTitle from "../../components/GroupTitle";
import type { FetchItems } from "./useFetchItems";
import useInfiniteScroll from "./useInfiniteScroll";

type ListVirtualizerProps<T extends Album | Video> = {
  items: T[];
  groupByYear: {
    enabled: boolean;
    sortDescFirst: boolean;
  };
  query: FetchItems;
  estimatedSize: number;
  renderItem: (item: T, index: number) => React.ReactNode;
};

export default function ListVirtualizer<T extends Album | Video>({
  items,
  groupByYear,
  query,
  estimatedSize,
  renderItem,
}: ListVirtualizerProps<T>) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  // rows
  const rows = useMemo(() => {
    const groupedItems = groupByYear.enabled
      ? groupBy(items, (item) => item.attributes.releaseDate.slice(0, 4))
      : { all: items };

    const groupEntries = Object.entries(groupedItems);
    if (groupByYear.sortDescFirst) groupEntries.reverse();

    return groupEntries.flatMap(([year, items]) =>
      items.map((item, index) => ({
        item,
        startItemIndex: index,
        title: groupByYear.enabled && index === 0 && (
          <GroupTitle title={year} count={items.length} className="mt-4" />
        ),
      })),
    );
  }, [items, groupByYear]);

  // virtualizer
  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: (index) => estimatedSize + (rows[index].title ? 45 : 0),
    overscan: 5,
    scrollMargin: parentOffsetRef.current,
    measureElement: (e) => e.getBoundingClientRect().height,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  const { topSpacerHeight, bottomSpacerHeight } =
    getVirtualSpacerHeights(rowVirtualizer);

  useInfiniteScroll(virtualRows, rows.length, query);

  return (
    <div ref={parentRef} className="mx-auto max-w-4xl">
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
            className={row.title ? "first:-mt-4" : ""}
          >
            {/* row title (optional) */}
            {row.title}

            {/* row items */}
            {renderItem(row.item, row.startItemIndex)}
          </div>
        );
      })}

      {bottomSpacerHeight > 0 && (
        <div style={{ height: `${bottomSpacerHeight}px` }} />
      )}
    </div>
  );
}
