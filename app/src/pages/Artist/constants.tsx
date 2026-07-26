import { Badge } from "flowbite-react";
import { IoMdCloudOutline } from "react-icons/io";
import { MdOutlineShoppingBag } from "react-icons/md";
import { SiDolby } from "react-icons/si";

export const GROUP_BY_ISRC = "Group songs by ISRC";

export const VA = "Various Artists";

export const DEFAULT_COLUMNS = {
  isrc: false,
  upc: false,
  song_id: false,
  album_id: false,
};

export const INFO_BADGES = {
  explicit: createInfoBadge("failure", "Explicit", "E"),

  clean: createInfoBadge("light", "Clean / Edited", "C"),

  dolby_atmos: createInfoBadge("dark", "Dolby Atmos", <SiDolby />),

  streaming_only: createInfoBadge(
    "info",
    "Streaming only",
    <IoMdCloudOutline className="size-4" />,
  ),

  purchase_only: createInfoBadge(
    "warning",
    "Purchase only",
    <MdOutlineShoppingBag className="size-4" />,
  ),

  various_artists: createInfoBadge("indigo", VA, "VA"),
};

function createInfoBadge(
  color: string,
  title: string,
  children: React.ReactNode,
) {
  return (
    <Badge
      color={color}
      className="inline-grid min-h-5 min-w-5 place-items-center p-0 align-middle select-none"
      title={title}
    >
      {children}
    </Badge>
  );
}
