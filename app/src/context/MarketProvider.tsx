import type { ReactNode } from "react";
import type { Market } from "../@types/market";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { MarketContext } from "./MarketContext";

export default function MarketProvider({ children }: { children: ReactNode }) {
  const [market, setMarket] = useLocalStorage<Market>("app:market", "us");

  return (
    <MarketContext value={{ market, setMarket }}>{children}</MarketContext>
  );
}
