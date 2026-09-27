import type { Album } from "../../@types/album";
import type { Song, SongAlbum } from "../../@types/song";
import type { Video } from "../../@types/video";
import { VA } from "../constants";

export function getItemFlags(item: Album | Song | Required<SongAlbum> | Video) {
  const isNeutral = !item.attributes.contentRating;

  const isExplicit = item.attributes.contentRating === "explicit";

  const isClean = item.attributes.contentRating === "clean";

  const isVA = item.attributes.artistName === VA;

  const has4K = item.type === "music-videos" && item.attributes.has4K;

  const hasDolbyAtmos =
    item.type !== "music-videos" &&
    item.attributes.audioTraits.includes("atmos");

  const offerTypes = item.attributes.offers.map((offer) => offer.type);

  const isPrerelease =
    (item.type === "albums" && item.attributes.isPrerelease) ||
    (offerTypes.includes("preorder") && !offerTypes.includes("buy"));

  const isStreamingOnly =
    offerTypes.length === 1 && offerTypes.includes("subscription");

  const isPurchaseOnly = offerTypes.length === 1 && offerTypes.includes("buy");

  return {
    isNeutral,
    isExplicit,
    isClean,
    isVA,
    has4K,
    hasDolbyAtmos,
    isPrerelease,
    isStreamingOnly,
    isPurchaseOnly,
  };
}
