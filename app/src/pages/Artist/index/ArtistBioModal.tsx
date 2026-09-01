import { useState } from "react";
import parse from "html-react-parser";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";

export default function ArtistBioModal({ text }: { text: string }) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const parsedText = parse(text.replace(/\n/g, "<br />"));

  return (
    <>
      <p
        className="line-clamp-3 text-gray-500 dark:text-gray-400"
        title="Biography"
        onClick={() => setOpenModal(true)}
      >
        {parsedText}
      </p>

      <Modal
        dismissible
        size="3xl"
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <ModalHeader className="border-b-gray-200">Biography</ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {parsedText}
            </p>
          </div>
        </ModalBody>

        <ModalFooter className="py-4">
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
