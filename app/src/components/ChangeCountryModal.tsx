import { useContext, useState } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { FaRegStar, FaStar } from "react-icons/fa";

import { hideKeyboard } from "../@other/fuctions";
import { crossedShoppingBag } from "../@other/icons";
import marketsWithoutStore from "../@other/markets-without-store.json";
import storesData from "../@other/storefronts.json";
import type { Market } from "../@types/market";
import type { Storefront } from "../@types/storefront";
import { MarketContext } from "../context/MarketContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

const stores = storesData as Record<Market, Storefront>;

export default function ChangeCountryModal() {
  const { market, setMarket } = useContext(MarketContext)!;

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const search = inputValue.trim().toLowerCase();

  const [favoriteMarkets, setFavoriteMarkets] = useLocalStorage<Market[]>(
    "app:favorite-markets",
    [],
  );

  const handleClose = () => {
    setOpenModal(false);
    setInputValue("");
  };

  const toggleFavoriteMarket = (market: Market) => {
    setFavoriteMarkets((prev) =>
      prev.includes(market)
        ? prev.filter((m) => m !== market)
        : [market, ...prev],
    );
  };

  const renderCountryItem = (store: Storefront) => (
    <li
      key={store.code}
      className="flex cursor-pointer items-center gap-x-2 rounded-md p-2 text-sm leading-tight text-gray-800 select-none hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
      onClick={() => {
        setMarket(store.code);
        handleClose();
      }}
    >
      {/* flag */}
      <img src={store.flag} alt={store.code.toUpperCase()} className="size-9" />

      {/* name */}
      {store.name}

      <span className="ms-auto flex shrink-0 items-center gap-1">
        {/* without iTunes Store */}
        {marketsWithoutStore.includes(store.code) && crossedShoppingBag}

        {/* add to favorite */}
        <span
          className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-900"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavoriteMarket(store.code);
          }}
        >
          {favoriteMarkets.includes(store.code) ? (
            <FaStar
              size={18}
              className="text-amber-400 dark:text-amber-500"
              title="Remove from favorites"
            />
          ) : (
            <FaRegStar
              size={18}
              className="text-gray-400 dark:text-gray-500"
              title="Add to favorites"
            />
          )}
        </span>
      </span>
    </li>
  );

  const storeList = Object.values(stores);

  const favoriteCountryElements = storeList
    .filter((s) => favoriteMarkets.includes(s.code))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(renderCountryItem);

  const countryElements = storeList
    .filter((s) => `${s.code} ${s.name.toLowerCase()}`.includes(search))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(renderCountryItem);

  const title = "Change country";
  const currentStore = stores[market];

  return (
    <>
      <Button
        color="alternative"
        className="border-0 bg-transparent p-2 dark:bg-transparent"
        title={title}
        onClick={() => setOpenModal(true)}
      >
        <img
          src={currentStore.flag}
          alt={market.toUpperCase()}
          className="h-full select-none"
        />
      </Button>

      <Modal dismissible size="4xl" show={openModal} onClose={handleClose}>
        <ModalHeader className="items-center border-b-gray-200">
          <div className="flex items-center gap-x-2">
            <img
              src={currentStore.flag}
              alt={currentStore.code.toUpperCase()}
              className="size-9"
            />
            {currentStore.name}
          </div>
        </ModalHeader>

        <ModalBody className="pt-2">
          {/* favorite countries */}
          {favoriteCountryElements.length > 0 && (
            <>
              <h3 className="my-2 text-xl font-medium">
                Favorite countries ({favoriteCountryElements.length})
              </h3>
              <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteCountryElements}
              </ul>
            </>
          )}

          {/* search */}
          <h3 className="my-2 text-xl font-medium">{title}</h3>
          <div className="sticky top-0 z-10 my-2">
            <TextInput
              type="search"
              placeholder="Search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={hideKeyboard}
            />
          </div>

          {/* markets */}
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {countryElements}
          </ul>
        </ModalBody>

        <ModalFooter className="py-4">
          <Button color="alternative" className="ms-auto" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
