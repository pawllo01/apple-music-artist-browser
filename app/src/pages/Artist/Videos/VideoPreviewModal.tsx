import { useContext } from "react";
import { Modal, ModalBody, ThemeProvider } from "flowbite-react";
import ReactPlayer from "react-player";
import { CurrentVideoContext } from "../../../context/CurrentVideoContext";

export default function VideoPreviewModal() {
  const { currentVideo, setCurrentVideo } = useContext(CurrentVideoContext)!;

  if (!currentVideo) return;

  return (
    // https://flowbite-react.com/docs/components/modal#theme
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
        show={currentVideo !== null}
        onClose={() => setCurrentVideo(null)}
      >
        <ModalBody className="h-[90dvh] max-w-[90dvw] p-0">
          {/* https://www.npmjs.com/package/react-player */}
          <ReactPlayer
            src={currentVideo.attributes.previews[0].hlsUrl}
            autoPlay
            loop
            controls
            width="100%"
            height="100%"
          />
        </ModalBody>
      </Modal>
    </ThemeProvider>
  );
}
