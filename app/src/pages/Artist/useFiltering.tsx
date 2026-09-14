import { useContext, useEffect, useMemo, useState } from "react";

import Fuse, { type FuseOptionKey } from "fuse.js";
import { useParams } from "react-router";

import { getOfferFlags } from "../../@other/fuctions";
import marketsWithoutStore from "../../@other/markets-without-store.json";
import type { Album } from "../../@types/album";
import type { Video } from "../../@types/video";
import TabSelector from "../../components/TabSelector";
import { MarketContext } from "../../context/MarketContext";
import { INFO_BADGES } from "../constants";

const TABS = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "albums",
    label: "Albums",
  },
  {
    value: "singles",
    label: "Singles & EPs",
  },
  {
    value: "streaming_only",
    label: <>{INFO_BADGES.streaming_only} Streaming only</>,
  },
  {
    value: "purchase_only",
    label: <>{INFO_BADGES.purchase_only} Purchase only</>,
  },
] as const;

type Tab = (typeof TABS)[number]["value"];

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
    const hasItunesStore = !marketsWithoutStore.includes(market);

    return items.reduce<Record<Tab, T[]>>(
      (acc, item) => {
        acc.all.push(item);

        if (hasItunesStore) {
          const { isStreamingOnly, isPurchaseOnly } = getOfferFlags(
            item.attributes.offers,
          );
          if (isStreamingOnly) acc.streaming_only.push(item);
          if (isPurchaseOnly) acc.purchase_only.push(item);
        }

        if (item.type === "albums") {
          if (/ (Single|EP)$/.test(item.attributes.name))
            acc.singles.push(item);
          else acc.albums.push(item);
        }

        return acc;
      },
      {
        all: [],
        albums: [],
        singles: [],
        streaming_only: [],
        purchase_only: [],
      },
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

  const hasMultipleTabs =
    Object.values(itemsByTab).filter((items) => items.length > 0).length >= 2;

  const tabs = hasMultipleTabs && (
    <TabSelector
      options={TABS.filter(({ value }) => itemsByTab[value].length > 0).map(
        ({ value, label }) => ({
          value,
          label: (
            <>
              {label}&nbsp;({itemsByTab[value].length})
            </>
          ),
        }),
      )}
      value={activeTab}
      onChange={(value) => setActiveTab(value)}
    />
  );

  return {
    globalFilter,
    setGlobalFilter,
    filteredItems,
    tabs,
  };
}
