import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "../../../@other/fuctions";
import type { Song } from "../../../@types/song";
import { MarketContext } from "../../../context/MarketContext";

type Data = {
  items: Song[];
  offset: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export default function useFetchSongs() {
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
  } = useInfiniteQuery<Data>({
    queryKey: ["artistSongs", artistId, market],
    initialPageParam: 0,
    retry: false,
    staleTime: Infinity,

    queryFn: async ({ pageParam, signal }) => {
      const params = new URLSearchParams({
        market,
        limit: "300", // max 300
        offset: String(pageParam),
      });

      const data = await apiFetch<Data>(
        `${import.meta.env.VITE_API_URL}/artists/${artistId}/songs?${params}`,
        "Something went wrong. Failed to fetch songs.",
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

  // songs
  // https://tanstack.com/table/latest/docs/framework/react/examples/virtualized-infinite-scrolling
  const songs = useMemo(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data],
  );
  const totalSongs = data?.pages?.[0]?.total ?? 0;

  return {
    songs,
    totalSongs,
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

export type FetchSongs = ReturnType<typeof useFetchSongs>;
