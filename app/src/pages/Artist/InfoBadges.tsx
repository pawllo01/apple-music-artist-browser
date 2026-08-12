import { useContext } from "react";

import { getOfferFlags } from "../../@other/fuctions";
import marketsWithoutStore from "../../@other/markets-without-store.json";
import type { Album } from "../../@types/album";
import type { Song } from "../../@types/song";
import { Video } from "../../@types/video";
import { MarketContext } from "../../context/MarketContext";
import { INFO_BADGES, VA } from "../constants";

type InfoBadgesProps = {
  item: Omit<Album, "relationships"> | Song | Video;
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

  const has4K = item.type === "music-videos" && item.attributes.has4K;

  const isDolbyAtmos =
    item.type !== "music-videos" &&
    item.attributes.audioTraits.includes("atmos");

  const { isStreamingOnly, isPurchaseOnly } = getOfferFlags(
    item.attributes.offers,
  );

  const isVA = item.attributes.artistName === VA;

  return (
    <>
      {isExplicit && INFO_BADGES.explicit}
      {isClean && INFO_BADGES.clean}
      {has4K && INFO_BADGES._4K}
      {showDolbyAtmos && isDolbyAtmos && INFO_BADGES.dolby_atmos}
      {hasItunesStore && isStreamingOnly && INFO_BADGES.streaming_only}
      {hasItunesStore && isPurchaseOnly && INFO_BADGES.purchase_only}
      {isVA && INFO_BADGES.various_artists}
    </>
  );
}
