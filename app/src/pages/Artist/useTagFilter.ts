import { useContext, useMemo, useState } from "react";

import type { Album } from "../../@types/album";
import type { Song } from "../../@types/song";
import type { Tags } from "../../@types/tags";
import type { Video } from "../../@types/video";
import { MarketContext } from "../../context/MarketContext";
import { VA } from "../constants";
import { getItemFlags } from "./getItemFlags";

const generalTags = {
  prerelease: "Pre-release",
  streamingOnly: "Streaming only",
  purchaseOnly: "Purchase only",
  dolbyAtmos: "Dolby Atmos",
  _4K: "4K",
  neutral: "Neutral",
  explicit: "Explicit",
  clean: "Clean",
  variousArtists: "VA",
};

const generalTagsOrder = Object.values(generalTags);

export default function useTagFilter<T extends Album | Song | Video>(
  items: T[],
) {
  const { hasItunesStore } = useContext(MarketContext)!;

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { itemsWithTags, tags } = useMemo(() => {
    const tagSets: Record<keyof Tags, Set<string>> = {
      general: new Set(),
      years: new Set(),
      genres: new Set(),
      artists: new Set(),
      labels: new Set(),
    };

    const itemsWithTags = items.map((item) => {
      const itemFlags = getItemFlags(item);

      const itemTags: string[] = [];

      const addTag = (tag: string | undefined, group: keyof Tags) => {
        if (!tag) return;
        itemTags.push(tag);
        tagSets[group].add(tag);
      };

      // general
      if (itemFlags.isPrerelease) addTag(generalTags.prerelease, "general");
      if (hasItunesStore && itemFlags.isStreamingOnly)
        addTag(generalTags.streamingOnly, "general");
      if (hasItunesStore && itemFlags.isPurchaseOnly)
        addTag(generalTags.purchaseOnly, "general");
      if (itemFlags.hasDolbyAtmos) addTag(generalTags.dolbyAtmos, "general");
      if (itemFlags.has4K) addTag(generalTags._4K, "general");

      if (itemFlags.isNeutral) addTag(generalTags.neutral, "general");
      else if (itemFlags.isExplicit) addTag(generalTags.explicit, "general");
      else if (itemFlags.isClean) addTag(generalTags.clean, "general");

      if (
        itemFlags.isVA ||
        (item.type === "songs" && item.attributes.albumArtistName === VA)
      )
        addTag(generalTags.variousArtists, "general");

      // years
      const year = item.attributes.releaseDate?.slice(0, 4);
      addTag(year, "years");

      // genres
      const genre = item.attributes.genreNames[0];
      addTag(genre, "genres");

      // artists
      item.relationships.artists.data.forEach((artist) => {
        addTag(artist.attributes?.name, "artists");
      });

      // record labels
      let recordLabel;
      if (item.type === "albums") recordLabel = item.attributes.recordLabel;
      else if (item.type === "songs")
        recordLabel = item.relationships.albums.data[0].attributes?.recordLabel;
      addTag(recordLabel, "labels");

      return {
        ...item,
        tags: itemTags,
      };
    });

    const tags: Tags = {
      general: [...tagSets.general].sort(
        (a, b) => generalTagsOrder.indexOf(a) - generalTagsOrder.indexOf(b),
      ),
      years: [...tagSets.years].sort().reverse(),
      genres: [...tagSets.genres].sort(),
      artists: [...tagSets.artists].sort(),
      labels: [...tagSets.labels].sort(),
    };

    return { itemsWithTags, tags };
  }, [items, hasItunesStore]);

  const matchedItems = useMemo(() => {
    return selectedTags.length > 0
      ? itemsWithTags.filter((item) =>
          item.tags.some((tag) => selectedTags.includes(tag)),
        )
      : itemsWithTags;
  }, [selectedTags, itemsWithTags]);

  return {
    matchedItems,
    tags,
    selectedTags,
    setSelectedTags,
  };
}
