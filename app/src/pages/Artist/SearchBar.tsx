import { useLayoutEffect, useRef } from "react";

import { Button, ButtonGroup, TextInput, Tooltip } from "flowbite-react";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import { HiSearch } from "react-icons/hi";

import { hideKeyboard } from "../../@other/fuctions";
import type { Type } from "../../@types/item-types";
import { useLocalStorage } from "../../hooks/useLocalStorage";

type SearchBarProps = {
  type: Type;
  setSearchBarOffset?: React.Dispatch<React.SetStateAction<number>>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  fetchAllPages: boolean;
  setFetchAllPages: React.Dispatch<React.SetStateAction<boolean>>;
  resultsLength: number;
  itemsLength: number;
  totalLength: number;
  children?: React.ReactNode;
};

export default function SearchBar({
  type,
  setSearchBarOffset,
  globalFilter,
  setGlobalFilter,
  fetchAllPages,
  setFetchAllPages,
  resultsLength,
  itemsLength,
  totalLength,
  children,
}: SearchBarProps) {
  const [pinSearchBar, setPinSearchBar] = useLocalStorage(
    `${type}:pin-search-bar`,
    true,
  );

  const searchBarRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (setSearchBarOffset) {
      if (pinSearchBar)
        setSearchBarOffset(
          searchBarRef.current?.getBoundingClientRect().height ?? 0,
        );
      else setSearchBarOffset(0);
    }
  }, [pinSearchBar, setSearchBarOffset]);

  return (
    <div
      ref={searchBarRef}
      className="top-0 z-40 -mx-4 border-b border-b-gray-200 bg-white p-4 pb-2 dark:border-b-gray-700 dark:bg-gray-600"
      style={{ position: pinSearchBar ? "sticky" : "relative" }}
    >
      <div className="flex h-10.5 gap-2">
        {/* search input (h-10.5) */}
        <TextInput
          type="search"
          placeholder="Search..."
          className="flex-1"
          icon={HiSearch}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          onKeyDown={hideKeyboard}
        />

        {/* pin search bar */}
        <Button
          color="alternative"
          className="aspect-square h-auto p-0 shadow-xs"
          title="Pin search bar"
          onClick={() => setPinSearchBar((prevState) => !prevState)}
        >
          {pinSearchBar ? (
            <BsPinAngleFill size={20} />
          ) : (
            <BsPinAngle size={20} />
          )}
        </Button>

        {/* settings */}
        <ButtonGroup id="settings-group">{children}</ButtonGroup>
      </div>

      <div className="ms-1 mt-2 flex flex-wrap items-center gap-x-2 text-sm text-gray-500 dark:text-gray-400">
        {/* results */}
        <Tooltip
          placement="bottom"
          content={`Number of ${type} matching current settings`}
        >
          Results: {resultsLength}
        </Tooltip>

        {/* divider */}
        <span className="h-4 border-s" />

        {/* loaded items */}
        <Tooltip
          placement="bottom"
          content={`Total number of ${type} loaded from Apple Music`}
        >
          <span className="capitalize">{type}</span>: {itemsLength}
          {itemsLength !== totalLength
            ? ` / ${totalLength} (${Math.floor((itemsLength / totalLength) * 100)}%)`
            : ""}
        </Tooltip>

        {/* load all */}
        {itemsLength !== totalLength && (
          <Tooltip
            placement="bottom"
            content={`Keep scrolling to load more ${type} automatically, or load all ${type} now.`}
          >
            <button
              className={`underline underline-offset-2 ${fetchAllPages ? "text-red-500 dark:text-red-400" : ""}`}
              onClick={() => setFetchAllPages((prevState) => !prevState)}
            >
              {fetchAllPages ? "Stop loading" : "Load all"}
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
