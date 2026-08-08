import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";

import { apiFetch } from "../../@other/fuctions";
import { ItemMap, Type } from "../../@types/item-types";
import { MarketContext } from "../../context/MarketContext";

type Data<T extends Type> = {
  items: ItemMap[T][];
  offset: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export default function useFetchItems<T extends Type>(type: T) {
  const { artistId } = useParams();
  const { market } = useContext(MarketContext)!;

  // https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries
  const {
    data,
    error,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["artist", type, artistId, market],
    initialPageParam: 0,
    retry: false,
    staleTime: Infinity,

    queryFn: async ({ pageParam, signal }) => {
      const params = new URLSearchParams({
        market,
        limit: type === "songs" ? "300" : "100",
        offset: String(pageParam),
      });

      const data = await apiFetch<Data<T>>(
        `${import.meta.env.VITE_API_URL}/artists/${artistId}/${type}?${params}`,
        `Something went wrong. Failed to fetch ${type}.`,
        signal,
      );

      return data;
    },

    // Return undefined or null to indicate there is no next page available.
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined,
  });

  // fetch all pages
  const [fetchAllPages, setFetchAllPages] = useState(false);

  useEffect(() => {
    if (!fetchAllPages || isFetching) return;
    if (!hasNextPage) {
      setFetchAllPages(false);
      return;
    }
    fetchNextPage();
  }, [fetchAllPages, fetchNextPage, hasNextPage, isFetching]);

  // items
  // https://tanstack.com/table/latest/docs/framework/react/examples/virtualized-infinite-scrolling
  const items = useMemo(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data],
  );
  const totalItems = data?.pages?.[0]?.total ?? 0;

  return {
    items,
    totalItems,
    fetchAllPages,
    setFetchAllPages,
    error,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}

export type FetchItems = ReturnType<typeof useFetchItems>;
