import { useState } from "react";
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { Link } from "react-router";

import { Artist } from "../../@types/artist";
import { Type } from "../../@types/item-types";
import Avatar from "../../components/Avatar";

type ArtistListModalProps = {
  type: Type;
  artistName: string;
  artists: Artist[];
  className?: string;
};

export default function ArtistListModal({
  type,
  artistName,
  artists,
  className = "",
}: ArtistListModalProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <p
        className={`line-clamp-2 w-fit cursor-pointer hover:underline ${className}`}
        title={artistName}
        onClick={() => setOpenModal(true)}
      >
        {artistName}
      </p>

      <Modal
        dismissible
        size="lg"
        show={openModal}
        onClose={() => setOpenModal(false)}
        onDoubleClick={(e) => e.stopPropagation()} // prevent playing song preview
      >
        <ModalHeader className="items-center border-b-transparent! px-4">
          <div className="flex items-center gap-1.5">
            Artists
            <Badge
              size="sm"
              color="gray"
              className="bg-gray-200 dark:bg-gray-600"
            >
              {artists.length}
            </Badge>
          </div>
        </ModalHeader>

        <ModalBody className="p-0">
          {artists.map((artist) => {
            if (!artist.attributes) return;
            return (
              <div key={artist.id} className="group relative">
                {/* page link */}
                <Link
                  to={`/artist/${artist.id}/${type}`}
                  className="flex items-center gap-3 px-4 py-2 group-hover:bg-gray-200 dark:group-hover:bg-gray-800"
                >
                  {/* avatar */}
                  <Avatar
                    url={artist.attributes.artwork?.url}
                    className="size-12 shrink-0 shadow"
                  />

                  {/* name */}
                  <p className="me-15">{artist.attributes.name}</p>
                </Link>

                {/* apple music link */}
                <a
                  href={artist.attributes.url}
                  target="_blank"
                  className="absolute top-1/2 right-4 z-10 -translate-y-1/2 transition hover:scale-105"
                  title="Listen on Apple Music"
                >
                  <img
                    src="/apple-music-favicon-180.png"
                    alt="Apple Music logo"
                    className="size-12 rounded-full"
                  />
                </a>
              </div>
            );
          })}
        </ModalBody>

        <ModalFooter className="border-t-transparent! p-4">
          <Button
            color="alternative"
            className="ms-auto"
            onClick={() => setOpenModal(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
