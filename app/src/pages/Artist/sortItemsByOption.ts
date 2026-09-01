import { orderBy } from "natural-orderby";
import type { Album } from "../../@types/album";
import type { Video } from "../../@types/video";
import type { Sort } from "./Videos/SortVideosDropdown";

export function sortItemsByOption<T extends Album | Video>(
  items: T[],
  sort: Sort,
) {
  const getId = (v: T) => Number(v.id);
  const getName = (v: T) => v.attributes.name;
  const getContentRating = (v: T) => v.attributes.contentRating;
  const getReleaseDate = (v: T) => v.attributes.releaseDate;

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
