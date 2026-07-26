import { useEffect, useLayoutEffect, useRef } from "react";

import {
  Table as FlowbiteTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { FaSquareCaretDown, FaSquareCaretUp } from "react-icons/fa6";
import { RxCaretSort } from "react-icons/rx";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

import { flexRender, type Table } from "@tanstack/react-table";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import type { SongWithChildren } from "../../../@types/song-with-children";
import SkeletonRow from "./SkeletonRow";
import type { FetchSongs } from "./useFetchSongs";

type SongsTableProps = {
  table: Table<SongWithChildren>;
  query: FetchSongs;
  searchBarOffset: number;
  currentSong: SongWithChildren | null;
  changeCurrentSong: (song: SongWithChildren) => void;
};

export default function SongsTable({
  table,
  query,
  searchBarOffset,
  currentSong,
  changeCurrentSong,
}: SongsTableProps) {
  const { rows } = table.getRowModel();
  const { isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = query;

  // VIRTUALIZATION
  // https://tanstack.com/virtual/latest/docs/framework/react/examples/window
  // https://tanstack.com/table/latest/docs/framework/react/examples/virtualized-rows

  const tbodyRef = useRef<HTMLTableSectionElement | null>(null);
  const tbodyOffsetRef = useRef(0);

  useLayoutEffect(() => {
    if (tbodyRef.current)
      tbodyOffsetRef.current = tbodyRef.current.getBoundingClientRect().top;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 57,
    overscan: 20,
    scrollMargin: tbodyOffsetRef.current,
  });

  const virtualRows = virtualizer.getVirtualItems();

  const topVirtualRowHeight =
    virtualRows.length > 0
      ? virtualRows[0].start - virtualizer.options.scrollMargin
      : 0;

  const bottomVirtualRowHeight =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() -
        virtualRows[virtualRows.length - 1].end +
        virtualizer.options.scrollMargin
      : 0;

  // fetch the next page when the last virtual row becomes visible
  // https://tanstack.com/virtual/latest/docs/framework/react/examples/infinite-scroll
  useEffect(() => {
    const lastItem = virtualRows[virtualRows.length - 1];
    if (!lastItem) return;
    if (lastItem.index >= rows.length - 1 && hasNextPage && !isFetchingNextPage)
      fetchNextPage();
  }, [
    hasNextPage,
    fetchNextPage,
    rows.length,
    isFetchingNextPage,
    virtualRows,
  ]);

  return (
    // https://www.npmjs.com/package/react-scroll-sync
    <ScrollSync>
      <>
        {/* Sticky header */}
        <ScrollSyncPane>
          <div
            className="sticky z-10 -mx-4 overflow-hidden"
            style={{ top: searchBarOffset }}
          >
            <FlowbiteTable className="rounded-none bg-gray-50 dark:bg-gray-700">
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="song-table-row min-h-12"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHeadCell
                        key={header.id}
                        className={`song-table-cell select-none ${header.column.columnDef.meta?.className} ${header.column.getIsSorted() ? "text-cyan-500" : ""}`}
                      >
                        {/* https://tanstack.com/table/latest/docs/framework/react/examples/sorting */}
                        <span
                          className={
                            header.column.getCanSort()
                              ? "inline-flex cursor-pointer items-center gap-1"
                              : ""
                          }
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
                                  ? "Sort descending"
                                  : "Clear sort"
                              : undefined
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() &&
                            header.column.id !== "group" && // group column has expand button
                            ({
                              asc: (
                                <FaSquareCaretUp
                                  size={16}
                                  className="shrink-0 text-cyan-500"
                                />
                              ),
                              desc: (
                                <FaSquareCaretDown
                                  size={16}
                                  className="shrink-0 text-cyan-500"
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? (
                              <RxCaretSort size={16} className="shrink-0" />
                            ))}
                        </span>
                      </TableHeadCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
            </FlowbiteTable>
          </div>
        </ScrollSyncPane>

        {/* Rows */}
        <ScrollSyncPane>
          <div className="-mx-4 overflow-x-auto drop-shadow-md">
            <FlowbiteTable
              hoverable
              className="rounded-none bg-white dark:bg-gray-800"
            >
              <TableBody ref={tbodyRef}>
                {/* top virtual row */}
                {topVirtualRowHeight > 0 && (
                  <tr style={{ height: `${topVirtualRowHeight}px` }} />
                )}

                {/* visible rows */}
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <TableRow
                      data-index={virtualRow.index} //needed for dynamic row height measurement
                      ref={(node) => virtualizer.measureElement(node)} //measure dynamic row height
                      key={row.id}
                      className={`song-table-row group ${row.original.id === currentSong?.id ? "gradient text-white" : ""} ${
                        row.depth > 0 ? "bg-gray-100 dark:bg-gray-900" : ""
                      }`}
                      onDoubleClick={() => changeCurrentSong(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={`song-table-cell ${cell.column.columnDef.meta?.className}`}
                        >
                          {flexRender(cell.column.columnDef.cell, {
                            ...cell.getContext(),
                            index: virtualRow.index, // pass row index for count column
                          })}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}

                {/* bottom virtual row */}
                {bottomVirtualRowHeight > 0 && (
                  <tr style={{ height: `${bottomVirtualRowHeight}px` }} />
                )}
              </TableBody>

              {/* skeleton rows */}
              {isFetching && (
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow
                      key={index}
                      columns={table.getVisibleLeafColumns()}
                    />
                  ))}
                </TableBody>
              )}
            </FlowbiteTable>
          </div>
        </ScrollSyncPane>
      </>
    </ScrollSync>
  );
}
