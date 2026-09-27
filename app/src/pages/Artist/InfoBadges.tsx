import { useContext } from "react";
import { getOfferFlags } from "../../@other/fuctions";
import type { Album } from "../../@types/album";
import type { Song, SongAlbum } from "../../@types/song";
import type { Video } from "../../@types/video";
import { MarketContext } from "../../context/MarketContext";
import { INFO_BADGES, VA } from "../constants";

type InfoBadgesProps = {
  item: Album | Song | Required<SongAlbum> | Video;
  showDolbyAtmos?: boolean;
};

export default function InfoBadges({
  item,
  showDolbyAtmos = false,
}: InfoBadgesProps) {
  const { hasItunesStore } = useContext(MarketContext)!;

  const isExplicit = item.attributes.contentRating === "explicit";

  const isClean = item.attributes.contentRating === "clean";

  const has4K = item.type === "music-videos" && item.attributes.has4K;

  const isDolbyAtmos =
    item.type !== "music-videos" &&
    item.attributes.audioTraits.includes("atmos");

  const offerTypes = item.attributes.offers.map((offer) => offer.type);
  const isPrerelease =
    (item.type === "albums" && item.attributes.isPrerelease) ||
    (hasItunesStore &&
      offerTypes.includes("preorder") &&
      !offerTypes.includes("buy"));

  const { isStreamingOnly, isPurchaseOnly } = getOfferFlags(
    item.attributes.offers,
  );

  const isVA = item.attributes.artistName === VA;

  return (
    <>
      {isPrerelease && INFO_BADGES.prerelease}
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
