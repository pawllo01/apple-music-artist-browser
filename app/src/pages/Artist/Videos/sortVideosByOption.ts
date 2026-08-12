import { orderBy } from "natural-orderby";
import type { Video } from "../../../@types/video";
import type { Sort } from "./SortVideosDropdown";

export function sortVideosByOption(videos: Video[], sort: Sort) {
  const getId = (v: Video) => Number(v.id);
  const getName = (v: Video) => v.attributes.name;
  const getContentRating = (v: Video) => v.attributes.contentRating;
  const getReleaseDate = (v: Video) => v.attributes.releaseDate;

  switch (sort.field) {
    default:
    case "id":
      return orderBy(videos, [getId], [sort.direction]);

    case "name":
      return orderBy(
        videos,
        [getName, getContentRating, getId],
        [sort.direction, "desc", "desc"],
      );

    case "release-date":
      return orderBy(
        videos,
        [getReleaseDate, getName, getContentRating, getId],
        [sort.direction, "desc", "desc", "desc"],
      );
  }
}
