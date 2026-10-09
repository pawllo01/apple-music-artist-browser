import { Dropdown, DropdownItem, HR } from "flowbite-react";
import { HiDotsHorizontal, HiLink } from "react-icons/hi";
import { RiImage2Fill } from "react-icons/ri";
import { SiItunes, SiMusicbrainz, SiSpotify } from "react-icons/si";

import type { Album } from "../../@types/album";
import type { Song } from "../../@types/song";
import type { Video } from "../../@types/video";

type ContextMenuProps = {
  item: Album | Song | Video;
};

export default function ContextMenu({ item }: ContextMenuProps) {
  const isAlbum = item.type === "albums";
  const isSong = item.type === "songs";

  const isInItunes = item.attributes.offers.some(
    (offer) => offer.type === "buy" || offer.type === "preorder",
  );

  const itunesLink = `${item.attributes.url.replace("http", "itm")}${isSong ? "&" : "?"}app=itunes`;

  const fullSizeArtworkLink = item.attributes.artwork.url
    .replace(
      "https://is1-ssl.mzstatic.com/image/thumb/",
      "https://a5.mzstatic.com/us/r1000/0/",
    )
    .replace(/\/[^/]+$/, "");

  const copyLink = () => {
    navigator.clipboard.writeText(item.attributes.url);
  };

  const musicBrainzLink = isAlbum
    ? `https://musicbrainz.org/search?query=barcode%3A${item.attributes.upc}&type=release&limit=25&method=advanced`
    : `https://musicbrainz.org/isrc/${item.attributes.isrc}`;

  const spotifyLink = `https://open.spotify.com/search/${item.relationships.artists.data[0].attributes.name} ${item.attributes.name.replace(/ - (Single|EP)$/, "")}`;

  return (
    <Dropdown
      className={`w-50 ${isSong ? "" : "dark:bg-gray-800"}`}
      renderTrigger={() => (
        <button
          className={`flex size-9 items-center justify-center rounded-full transition ${isSong ? "" : "hover:gradient absolute right-2 bottom-2 bg-black/50 opacity-0 group-hover:opacity-100"}`}
          title="Context menu"
        >
          <HiDotsHorizontal
            className={`size-5 ${isSong ? "" : "text-white"}`}
          />
        </button>
      )}
    >
      {/* itunes link */}
      {isInItunes && (
        <DropdownItem as="a" href={itunesLink} className="px-2">
          <SiItunes className="me-2 size-5" />
          View in the iTunes Store
        </DropdownItem>
      )}

      {/* full-size artwork link */}
      <DropdownItem
        as="a"
        href={fullSizeArtworkLink}
        target="_blank"
        className="px-2"
      >
        <RiImage2Fill className="me-2 size-5" />
        Open full-size artwork
      </DropdownItem>

      {/* copy link */}
      <DropdownItem className="px-2" onClick={copyLink}>
        <HiLink className="me-2 size-5" />
        Copy link
      </DropdownItem>

      <HR className="my-1 dark:bg-gray-600" />

      {/* musicbrainz link */}
      <DropdownItem
        as="a"
        href={musicBrainzLink}
        target="_blank"
        className="px-2"
      >
        <SiMusicbrainz className="me-2 size-5" />
        Find on MusicBrainz
      </DropdownItem>

      {/* spotify link */}
      <DropdownItem as="a" href={spotifyLink} target="_blank" className="px-2">
        <SiSpotify className="me-2 size-5" />
        Find on Spotify
      </DropdownItem>
    </Dropdown>
  );
}
