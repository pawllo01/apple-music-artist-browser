import { IoMdAlbums } from "react-icons/io";
import type { IconType } from "react-icons/lib";
import { MdAudiotrack, MdPersonalVideo } from "react-icons/md";
import type { Type } from "../@types/item-types";

export const itemIcons: Record<Type, IconType> = {
  albums: IoMdAlbums,
  songs: MdAudiotrack,
  videos: MdPersonalVideo,
};

export const crossedShoppingBag = (
  <img
    title="Without iTunes Store"
    src="/shopping-bag_6737603.svg"
    className="inline-block size-5 opacity-50 dark:opacity-30 dark:invert"
    // https://www.flaticon.com/free-icon/shopping-bag_6737603
  />
);
