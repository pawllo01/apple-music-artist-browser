import React, { useContext, useEffect, useMemo, useState } from "react";

import { Button, ButtonGroup } from "flowbite-react";
import Fuse, { type FuseOptionKey } from "fuse.js";
import { useParams } from "react-router";

import { getOfferFlags } from "../../@other/fuctions";
import type { Album } from "../../@types/album";
import type { Video } from "../../@types/video";
import { MarketContext } from "../../context/MarketContext";
import { INFO_BADGES } from "../constants";

type Tab = "all" | "streaming_only" | "purchase_only";

const tabNames: Record<Tab, React.ReactNode> = {
  all: "All",
  streaming_only: <>{INFO_BADGES.streaming_only}Streaming only</>,
  purchase_only: <>{INFO_BADGES.purchase_only}Purchase only</>,
};

export default function useFiltering<T extends Album | Video>(
  items: T[],
  fuseKeys: FuseOptionKey<T>[],
) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const { artistId } = useParams();
  const { market } = useContext(MarketContext)!;

  useEffect(() => {
    setActiveTab("all");
  }, [artistId, market]);

  const itemsByTab = useMemo(() => {
    return items.reduce<Record<Tab, T[]>>(
      (acc, item) => {
        const { isStreamingOnly, isPurchaseOnly } = getOfferFlags(
          item.attributes.offers,
        );

        acc.all.push(item);
        if (isStreamingOnly) acc.streaming_only.push(item);
        if (isPurchaseOnly) acc.purchase_only.push(item);

        return acc;
      },
      { all: [], streaming_only: [], purchase_only: [] },
    );
  }, [items]);

  // https://www.fusejs.io/fuzzy-search.html
  const fuse = useMemo(() => {
    return new Fuse(itemsByTab[activeTab], {
      keys: fuseKeys,
      threshold: 0,
      ignoreLocation: true,
      ignoreDiacritics: true,
      shouldSort: false,
    });
  }, [itemsByTab, activeTab, fuseKeys]);

  const filteredItems = fuse
    .search(globalFilter.trim())
    .map((fuseResult) => fuseResult.item);

  const tabs = (itemsByTab.streaming_only.length > 0 ||
    itemsByTab.purchase_only.length > 0) && (
    <ButtonGroup className="mt-4 mb-0.5 w-full rounded-full">
      {(Object.keys(itemsByTab) as Tab[]).map((key) => {
        const count = itemsByTab[key].length;
        if (count === 0) return;
        return (
          <Button
            key={key}
            color="alternative"
            className={`section-btn ${key === activeTab ? "bg-gray-600! text-white! dark:bg-gray-900!" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {tabNames[key]} ({count})
          </Button>
        );
      })}
    </ButtonGroup>
  );

  return {
    globalFilter,
    setGlobalFilter,
    filteredItems,
    tabs,
  };
}
