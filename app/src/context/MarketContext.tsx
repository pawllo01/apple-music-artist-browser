import { createContext } from "react";
import type { Market } from "../@types/market";

type MarketContextType = {
  market: Market;
  setMarket: React.Dispatch<React.SetStateAction<Market>>;
};

export const MarketContext = createContext<MarketContextType | null>(null);
