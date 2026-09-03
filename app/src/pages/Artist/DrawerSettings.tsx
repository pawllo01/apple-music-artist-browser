import { useEffect, useState } from "react";
import { Button, Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { HiOutlineCog } from "react-icons/hi";

type DrawerSettingsProps = {
  children: React.ReactNode;
};

export default function DrawerSettings({ children }: DrawerSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    document.documentElement.style.scrollbarGutter = isOpen ? "stable" : "auto";
  }, [isOpen]);

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
        className="max-sm:w-70 dark:bg-gray-600"
      >
        <DrawerHeader title="Settings" titleIcon={() => <></>} />

        <DrawerItems>{children}</DrawerItems>
      </Drawer>
    </>
  );
}
