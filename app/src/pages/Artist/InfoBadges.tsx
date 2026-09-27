import { useContext } from "react";

import type { Album } from "../../@types/album";
import type { Song, SongAlbum } from "../../@types/song";
import type { Video } from "../../@types/video";
import { MarketContext } from "../../context/MarketContext";
import { INFO_BADGES } from "../constants";
import { getItemFlags } from "./getItemFlags";

type InfoBadgesProps = {
  item: Album | Song | Required<SongAlbum> | Video;
  showDolbyAtmos?: boolean;
};

export default function InfoBadges({
  item,
  showDolbyAtmos = false,
}: InfoBadgesProps) {
  const { hasItunesStore } = useContext(MarketContext)!;

  const itemFlags = getItemFlags(item);

  return (
    <>
      {itemFlags.isPrerelease && INFO_BADGES.prerelease}
      {itemFlags.isExplicit && INFO_BADGES.explicit}
      {itemFlags.isClean && INFO_BADGES.clean}
      {itemFlags.has4K && INFO_BADGES._4K}
      {showDolbyAtmos && itemFlags.hasDolbyAtmos && INFO_BADGES.dolby_atmos}
      {hasItunesStore &&
        itemFlags.isStreamingOnly &&
        INFO_BADGES.streaming_only}
      {hasItunesStore && itemFlags.isPurchaseOnly && INFO_BADGES.purchase_only}
      {itemFlags.isVA && INFO_BADGES.various_artists}
    </>
  );
}
