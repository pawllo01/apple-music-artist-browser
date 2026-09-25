import { useContext, useMemo, useState } from "react";

import { getOfferFlags } from "../../@other/fuctions";
import type { Album } from "../../@types/album";
import type { Song } from "../../@types/song";
import type { Tags } from "../../@types/tags";
import type { Video } from "../../@types/video";
import { MarketContext } from "../../context/MarketContext";
import { VA } from "../constants";

const generalTags = {
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
      const itemTags: string[] = [];

      const addTag = (tag: string | undefined, group: keyof Tags) => {
        if (!tag) return;
        itemTags.push(tag);
        tagSets[group].add(tag);
      };

      // streaming only / purchase only
      if (hasItunesStore) {
        const { isStreamingOnly, isPurchaseOnly } = getOfferFlags(
          item.attributes.offers,
        );
        if (isStreamingOnly) addTag(generalTags.streamingOnly, "general");
        if (isPurchaseOnly) addTag(generalTags.purchaseOnly, "general");
      }

      // content rating
      const contentRating =
        item.attributes.contentRating === "explicit"
          ? generalTags.explicit
          : item.attributes.contentRating === "clean"
            ? generalTags.clean
            : generalTags.neutral;
      addTag(contentRating, "general");

      // dolby atmos
      if (
        item.type !== "music-videos" &&
        item.attributes.audioTraits.includes("atmos")
      )
        addTag(generalTags.dolbyAtmos, "general");

      // 4k
      if (item.type === "music-videos" && item.attributes.has4K)
        addTag(generalTags._4K, "general");

      // various artists
      if (
        item.attributes.artistName === VA ||
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
