import { useEffect, useState } from "react";

import {
  Button,
  Drawer,
  DrawerHeader,
  DrawerItems,
  HR,
  ToggleSwitch,
} from "flowbite-react";
import { HiOutlineCog } from "react-icons/hi";

import { GROUP_BY_ISRC, VA } from "../constants";
import { clearSongsSettings, type SettingsProps } from "./settings-utils";

export default function DrawerSettings({
  settings,
  resetColumns,
}: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    if (document) document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const createToggleSwitch = (
    label: string,
    checked: boolean,
    setChecked: React.Dispatch<React.SetStateAction<boolean>>,
  ) => (
    <ToggleSwitch
      sizing="sm"
      className="my-3"
      label={label}
      checked={checked}
      onChange={() => setChecked((prev) => !prev)}
    />
  );

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
        onClose={handleClose}
        position="right"
        className="max-sm:w-70"
      >
        <DrawerHeader title="Settings" titleIcon={() => <></>} />

        <DrawerItems>
          {createToggleSwitch(
            GROUP_BY_ISRC,
            settings.groupSongs,
            settings.setGroupSongs,
          )}

          {/* will be useful for full mode */}
          {import.meta.env.DEV &&
            createToggleSwitch(
              `Include all ${VA} albums`,
              settings.showAllVariousArtistsAlbums,
              settings.setShowAllVariousArtistsAlbums,
            )}

          {createToggleSwitch(
            "Preserve column sorting",
            settings.saveSorting,
            settings.setSaveSorting,
          )}

          <HR className="my-4" />
          <h5 className="mb-3 font-semibold text-gray-500 dark:text-gray-400">
            Display options
          </h5>

          {createToggleSwitch(
            "Show [Dolby Atmos] badge",
            settings.showDolbyAtmosBadge,
            settings.setShowDolbyAtmosBadge,
          )}

          {createToggleSwitch(
            "Hide Single/EP labels in album names",
            settings.truncateAlbumNames,
            settings.setTruncateAlbumNames,
          )}

          {createToggleSwitch(
            "Show IDs next to song and album names",
            settings.showIdsInCells,
            settings.setShowIdsInCells,
          )}

          <HR className="my-4" />
          <h5 className="mb-3 font-semibold text-gray-500 dark:text-gray-400">
            Reset options
          </h5>

          <div className="my-2">
            <Button
              color="red"
              size="sm"
              className="w-full border-s-0!"
              onClick={() => {
                handleClose();
                resetColumns();
              }}
            >
              Reset columns
            </Button>
          </div>

          <div className="my-2">
            <Button
              color="red"
              size="sm"
              className="w-full border-s-0!"
              onClick={clearSongsSettings}
            >
              Reset everything
            </Button>
          </div>
        </DrawerItems>
      </Drawer>
    </>
  );
}
