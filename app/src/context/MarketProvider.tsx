import type { ReactNode } from "react";
import marketsWithoutStore from "../@other/markets-without-store.json";
import type { Market } from "../@types/market";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { MarketContext } from "./MarketContext";

export default function MarketProvider({ children }: { children: ReactNode }) {
  const [market, setMarket] = useLocalStorage<Market>("app:market", "us");

  const hasItunesStore = !marketsWithoutStore.includes(market);

  return (
    <MarketContext value={{ market, setMarket, hasItunesStore }}>
      {children}
    </MarketContext>
  );
}
