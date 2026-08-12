import { useEffect } from "react";
import { VirtualItem } from "@tanstack/react-virtual";
import { FetchItems } from "./useFetchItems";

// https://tanstack.com/virtual/latest/docs/framework/react/examples/infinite-scroll
// fetch the next page when the last virtual row becomes visible

export default function useInfiniteScroll(
  virtualRows: VirtualItem[],
  rowCount: number,
  query: FetchItems,
) {
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = query;

  useEffect(() => {
    const [lastRow] = [...virtualRows].reverse();

    if (!lastRow) return;

    if (lastRow.index >= rowCount - 1 && hasNextPage && !isFetchingNextPage)
      fetchNextPage();
  }, [hasNextPage, fetchNextPage, rowCount, isFetchingNextPage, virtualRows]);
}
