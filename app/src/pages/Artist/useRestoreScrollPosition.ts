import { useEffect, useRef } from "react";
import { ReactVirtualizer } from "@tanstack/react-virtual";

export default function useRestoreScrollPosition(
  width: number,
  columnCount: number,
  rowVirtualizer: ReactVirtualizer<Window, Element>,
) {
  const virtualRows = rowVirtualizer.getVirtualItems();

  const prevWidth = useRef(width);
  const videoIndex = useRef(0);

  // update the video index only when user has stopped scrolling
  useEffect(() => {
    if (rowVirtualizer.isScrolling) return;

    // ignore this update when the width changes, since resizing the window or changing orientation can affect the scroll position
    if (prevWidth.current !== width) {
      prevWidth.current = width;
      return;
    }

    if (virtualRows.length === 0) return;

    const viewportCenter = window.scrollY + window.innerHeight / 2;

    // get the row closest to the viewport center
    const closestRow = virtualRows.reduce((closestRow, row) => {
      const rowCenter = row.start + row.size / 2;
      const closestRowCenter = closestRow.start + closestRow.size / 2;

      return Math.abs(rowCenter - viewportCenter) <
        Math.abs(closestRowCenter - viewportCenter)
        ? row
        : closestRow;
    });

    // store the first video's index from the row so we can calculate its position after resize
    videoIndex.current = closestRow.index * columnCount;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowVirtualizer.isScrolling]);

  // restore the row containing the last visible video after resize
  useEffect(() => {
    if (videoIndex.current === 0) return;
    const rowIndex = Math.floor(videoIndex.current / columnCount);
    rowVirtualizer.scrollToIndex(rowIndex, { align: "center" });
  }, [columnCount, rowVirtualizer, width]);
}
