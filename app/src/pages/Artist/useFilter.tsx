import { useContext, useEffect, useMemo, useState } from "react";

import Fuse, { type FuseOptionKey } from "fuse.js";
import { useParams } from "react-router";

import type { Album } from "../../@types/album";
import type { Video } from "../../@types/video";
import TabSelector from "../../components/TabSelector";
import { MarketContext } from "../../context/MarketContext";
import useTagFilter from "./useTagFilter";

const TABS = [
  { value: "all", label: "All" },
  // albums only
  { value: "albums", label: "Albums" },
  { value: "singles", label: "Singles & EPs" },
  // videos only
  { value: "standalone", label: "Standalone" },
  { value: "fromAlbum", label: "From album" },
] as const;

type Tab = (typeof TABS)[number]["value"];

export default function useFilter<T extends Album | Video>(
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
        acc.all.push(item);

        // albums
        if (item.type === "albums") {
          if (/ (Single|EP)$/.test(item.attributes.name))
            acc.singles.push(item);
          else acc.albums.push(item);
        }

        // videos
        if (item.type === "music-videos") {
          if (item.relationships.albums.data[0]) acc.fromAlbum.push(item);
          else acc.standalone.push(item);
        }

        return acc;
      },
      { all: [], albums: [], singles: [], standalone: [], fromAlbum: [] },
    );
  }, [items]);

  const { matchedItems, tags, selectedTags, setSelectedTags } = useTagFilter(
    itemsByTab[activeTab],
  );

  // https://www.fusejs.io/fuzzy-search.html
  const fuse = useMemo(() => {
    return new Fuse(matchedItems, {
      keys: fuseKeys,
      threshold: 0,
      ignoreLocation: true,
      ignoreDiacritics: true,
      shouldSort: false,
    });
  }, [matchedItems, fuseKeys]);

  const filteredItems = fuse
    .search(globalFilter.trim())
    .map((fuseResult) => fuseResult.item);

  const showTabs =
    Object.values(itemsByTab).filter((items) => items.length > 0).length === 3;

  const tabs = showTabs && (
    <TabSelector
      options={TABS.filter(({ value }) => itemsByTab[value].length > 0).map(
        ({ value, label }) => ({
          value,
          label: `${label}\u00A0(${itemsByTab[value].length})`,
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
    tags,
    selectedTags,
    setSelectedTags,
  };
}
