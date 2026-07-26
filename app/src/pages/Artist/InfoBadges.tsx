import { useContext } from "react";

import marketsWithoutStore from "../../@other/markets-without-store.json";
import type { Album } from "../../@types/album";
import type { Song } from "../../@types/song";
import { MarketContext } from "../../context/MarketContext";
import { INFO_BADGES, VA } from "./constants";

type InfoBadgesProps = {
  item: Song | Album;
  showDolbyAtmos?: boolean;
};

export default function InfoBadges({
  item,
  showDolbyAtmos = false,
}: InfoBadgesProps) {
  const { market } = useContext(MarketContext)!;
  const hasItunesStore = !marketsWithoutStore.includes(market);

  const isExplicit = item.attributes.contentRating === "explicit";

  const isClean = item.attributes.contentRating === "clean";

  const isDolbyAtmos = item.attributes.audioTraits.includes("atmos");

  const isStreamingOnly =
    item.attributes.offers.length === 1 &&
    item.attributes.offers[0].type === "subscription";

  const isPurchaseOnly =
    item.attributes.offers.length === 1 &&
    item.attributes.offers[0].type === "buy";

  const isVA = item.attributes.artistName === VA;

  return (
    <>
      {isExplicit && INFO_BADGES.explicit}
      {isClean && INFO_BADGES.clean}
      {showDolbyAtmos && isDolbyAtmos && INFO_BADGES.dolby_atmos}
      {hasItunesStore && isStreamingOnly && INFO_BADGES.streaming_only}
      {hasItunesStore && isPurchaseOnly && INFO_BADGES.purchase_only}
      {isVA && INFO_BADGES.various_artists}
    </>
  );
}
