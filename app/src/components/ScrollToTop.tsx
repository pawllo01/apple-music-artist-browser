import { Button } from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import { HiMiniArrowUpTray } from "react-icons/hi2";
import { useWindowScroll } from "react-use";

export default function ScrollToTop({ smooth }: { smooth: boolean }) {
  const { y } = useWindowScroll();

  const distanceToBottom =
    document.documentElement.scrollHeight - (y + window.innerHeight);

  const isVisible = y > 300 && distanceToBottom > 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            aria-label="Scroll to top"
            color="alternative"
            className="size-15 rounded-full p-0 drop-shadow"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: smooth ? "smooth" : "instant",
              })
            }
          >
            <HiMiniArrowUpTray className="size-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
