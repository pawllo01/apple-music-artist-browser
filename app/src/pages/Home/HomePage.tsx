import { useContext, useState } from "react";

import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useDebounce } from "use-debounce";

import { useQuery } from "@tanstack/react-query";

import { apiFetch, hideKeyboard } from "../../@other/fuctions";
import type { Artist } from "../../@types/artist";
import { ExpandButton } from "../../components/ExpandButton";
import { MarketContext } from "../../context/MarketContext";
import { RecentArtistsContext } from "../../context/RecentArtistsContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import ArtistResult, { ArtistResultSkeleton } from "./ArtistResult";

export default function HomePage() {
  const { market } = useContext(MarketContext)!;
  const { recentArtists } = useContext(RecentArtistsContext)!;

  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue] = useDebounce(
    inputValue.trim().toLowerCase(),
    500,
  );
  const [showRecentArtists, setShowRecentArtists] = useLocalStorage(
    "app:show-recent-artists",
    false,
  );

  const {
    data: artists = [],
    error,
    isPending,
  } = useQuery({
    queryKey: ["searchArtist", debouncedInputValue, market],
    enabled: !!debouncedInputValue,
    retry: false,
    staleTime: Infinity,

    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({ term: debouncedInputValue, market });

      const data = await apiFetch<Artist[]>(
        `${import.meta.env.VITE_API_URL}/search/artists?${params}`,
        "Failed to fetch artists. The service is temporarily unavailable.",
        signal,
      );

      return data;
    },
  });

  const isSearching = !!inputValue.trim();
  const items = isSearching ? artists : recentArtists;
  const showSkeletons =
    isSearching &&
    (isPending || inputValue.trim().toLowerCase() !== debouncedInputValue);

  return (
    <section className="mx-auto w-full max-w-5xl p-4">
      {/* Heading */}
      <h1 className="my-2.5 text-center text-4xl leading-tight font-semibold md:text-5xl/16">
        <span className="gradient bg-clip-text text-transparent">
          Browse&nbsp;Music.
        </span>{" "}
        Your&nbsp;Way.
      </h1>

      {/* Description */}
      {!isSearching && !showRecentArtists && (
        <p className="text-center text-base text-gray-500 dark:text-white">
          Search any artist, explore their complete{" "}
          <a
            href={`https://music.apple.com/${market}/new`}
            target="_blank"
            className="underline underline-offset-2"
          >
            Apple&nbsp;Music
          </a>{" "}
          discography,
          <br />
          and listen to track previews while discovering every album and song.
        </p>
      )}

      <div className="relative my-4 w-full">
        <div className="pointer-events-none absolute left-1/2 -z-10 h-full w-full -translate-x-1/2 bg-red-200/70 blur-[100px] dark:bg-red-500/70" />

        {/* Search bar */}
        <div className="flex w-full items-center gap-2 overflow-hidden rounded-full bg-white/80 px-5 drop-shadow-2xl dark:bg-gray-800/80">
          <IoSearch size={22} className="text-gray-500" />

          <input
            type="search"
            placeholder="Search for an artist..."
            className="ms-2 h-full w-full bg-transparent! py-5 text-lg text-gray-500 placeholder-gray-500 outline-none dark:text-gray-300 dark:placeholder-gray-300"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={hideKeyboard}
          />

          <ExpandButton
            title={`${showRecentArtists ? "Hide" : "Show"} recent artists`}
            expanded={showRecentArtists}
            onClick={() => setShowRecentArtists((prevState) => !prevState)}
          />
        </div>

        {/* Search results & Recent artists */}
        {(isSearching || showRecentArtists) && (
          <div className="relative mt-2 overflow-hidden rounded-2xl bg-white/80 shadow-xl dark:bg-gray-800/80">
            <div className="max-h-[calc(73px*5)] overflow-y-auto border-t border-t-transparent">
              {error && isSearching && (
                <Alert
                  color="failure"
                  icon={HiInformationCircle}
                  className="m-3 mb-0"
                >
                  {error.message}
                </Alert>
              )}

              {showSkeletons
                ? Array.from({ length: 5 }).map((_, i) => (
                    <ArtistResultSkeleton key={i} />
                  ))
                : items.map((artist) => (
                    <ArtistResult
                      key={artist.id}
                      artist={artist}
                      showRemoveArtist={!isSearching}
                    />
                  ))}

              {!showSkeletons && items.length === 0 && (
                <p className="py-6 text-center text-gray-500 dark:text-gray-300">
                  No results found.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        {!isSearching && !showRecentArtists && (
          <>
            <img
              src="/example-light.png"
              className="relative mt-6 w-full rounded-2xl select-none dark:hidden"
            />
            <img
              src="/example-dark.png"
              className="relative mt-6 hidden w-full rounded-2xl select-none dark:block"
            />

            <div className="mt-4 hidden md:flex md:flex-wrap md:items-center md:justify-center md:gap-2">
              {[
                "🎧 Song previews",
                "📚 Complete discographies",
                "🎛 Custom tables",
                "⚡ Smart filtering",
              ].map((item, index) => (
                <span
                  key={index}
                  className="rounded-full bg-white px-4 py-2 text-sm text-gray-600 dark:bg-gray-800/80 dark:text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
