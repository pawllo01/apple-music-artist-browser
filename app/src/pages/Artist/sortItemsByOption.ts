import { orderBy } from "natural-orderby";
import type { Album } from "../../@types/album";
import type { Video } from "../../@types/video";
import type { Sort } from "./SortItemsDropdown";

export function sortItemsByOption<T extends Album | Video>(
  items: T[],
  sort: Sort,
) {
  const getId = (item: T) => Number(item.id);
  const getName = (item: T) => item.attributes.name;
  const getContentRating = (item: T) => item.attributes.contentRating;
  const getReleaseDate = (item: T) => item.attributes.releaseDate;

  switch (sort.field) {
    default:
    case "id":
      return orderBy(items, [getId], [sort.direction]);

    case "name":
      return orderBy(
        items,
        [getName, getContentRating, getId],
        [sort.direction, "desc", "desc"],
      );

    case "release-date":
      return orderBy(
        items,
        [getReleaseDate, getName, getContentRating, getId],
        [sort.direction, "desc", "desc", "desc"],
      );
  }
}
