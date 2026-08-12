import { useState } from "react";
import { Modal, ModalBody, ThemeProvider } from "flowbite-react";
import { FaPlay } from "react-icons/fa";
import ReactPlayer from "react-player";
import { Video } from "../../../@types/video";

export default function VideoPreviewModal({ video }: { video: Video }) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <button
        className="absolute bottom-3 left-3 rounded-full bg-black/50 transition hover:scale-110 lg:opacity-0 lg:group-hover:opacity-100"
        title="Watch Preview"
        onClick={() => setOpenModal(true)}
      >
        <FaPlay className="m-3 size-3 text-white" />
      </button>

      {/* https://flowbite-react.com/docs/components/modal#theme */}
      <ThemeProvider
        theme={{
          modal: {
            root: { sizes: { auto: "w-auto" } },
            content: { inner: "overflow-hidden rounded-xl bg-transparent" },
          },
        }}
      >
        <Modal
          dismissible
          size="auto"
          className="backdrop-blur-xl"
          show={openModal}
          onClose={() => setOpenModal(false)}
        >
          <ModalBody className="h-[90dvh] max-w-[90dvw] p-0">
            {/* https://www.npmjs.com/package/react-player */}
            <ReactPlayer
              src={video.attributes.previews[0].hlsUrl}
              playing={openModal}
              autoPlay
              loop
              controls
              width="100%"
              height="100%"
            />
          </ModalBody>
        </Modal>
      </ThemeProvider>
    </>
  );
}
