import { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  DrawerHeader,
  DrawerItems,
  useThemeMode,
} from "flowbite-react";
import { HiOutlineCog } from "react-icons/hi";

type DrawerSettingsProps = {
  children: React.ReactNode;
};

export default function DrawerSettings({ children }: DrawerSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { computedMode } = useThemeMode();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    document.documentElement.style.scrollbarGutter = isOpen ? "stable" : "auto";
    if (computedMode === "dark")
      document.documentElement.style.backgroundColor = isOpen ? "#22292b" : "";
  }, [isOpen, computedMode]);

  return (
    <>
      <Button
        color="alternative"
        className="h-auto px-3"
        title="Settings"
        onClick={() => setIsOpen(true)}
      >
        <HiOutlineCog size={24} />
      </Button>

      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        position="right"
        className="border-s border-s-white max-sm:w-70 dark:border-s-gray-700"
      >
        <DrawerHeader
          titleIcon={() => (
            <span className="text-gray-800 dark:text-white">Settings</span>
          )}
        />

        <DrawerItems>{children}</DrawerItems>
      </Drawer>
    </>
  );
}
