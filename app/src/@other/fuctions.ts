import { ReactVirtualizer } from "@tanstack/react-virtual";

import type { Type } from "../@types/item-types";
import type { Market } from "../@types/market";
import type { Offer } from "../@types/offer";

export function changeUrlMarket(url: string, market: Market) {
  return url.replace(/\/[a-zA-Z]{2}\//, `/${market}/`);
}

export function convertMillisecondsToMMSS(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function hideKeyboard(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter") e.currentTarget.blur();
}

export async function apiFetch<T>(
  url: string,
  errorMessage: string,
  signal?: AbortSignal | null | undefined,
): Promise<T> {
  const res = await fetch(url, { signal });

  let data: unknown = null;

  try {
    data = await res.json();
  } catch (error) {
    console.error("Failed to parse response:", error);
    throw new Error(errorMessage);
  }

  if (!res.ok) {
    console.error("API error:", data);
    throw new Error(errorMessage);
  }

  return data as T;
}

export function getVirtualSpacerHeights(
  rowVirtualizer: ReactVirtualizer<Window, Element>,
) {
  const virtualRows = rowVirtualizer.getVirtualItems();

  const topSpacerHeight =
    virtualRows.length > 0
      ? virtualRows[0].start - rowVirtualizer.options.scrollMargin
      : 0;

  const bottomSpacerHeight =
    virtualRows.length > 0
      ? rowVirtualizer.getTotalSize() -
        virtualRows[virtualRows.length - 1].end +
        rowVirtualizer.options.scrollMargin
      : 0;

  return { topSpacerHeight, bottomSpacerHeight };
}

export function getOfferFlags(offers: Offer[]) {
  return {
    isStreamingOnly: offers.length === 1 && offers[0].type === "subscription",
    isPurchaseOnly: offers.length === 1 && offers[0].type === "buy",
  };
}

export const clearSettingsByType = (type: Type) => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`${type}:`)) localStorage.removeItem(key);
  });
  window.location.reload();
};
