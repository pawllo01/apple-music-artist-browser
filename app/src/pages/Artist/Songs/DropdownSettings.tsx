import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  ToggleSwitch,
} from "flowbite-react";
import { HiOutlineCog } from "react-icons/hi";

import { GROUP_BY_ISRC, VA } from "../constants";
import { clearSongsSettings, type SettingsProps } from "./settings-utils";

export default function DropdownSettings({
  settings,
  resetColumns,
}: SettingsProps) {
  const createToggleSwitch = (
    label: string,
    checked: boolean,
    setChecked: React.Dispatch<React.SetStateAction<boolean>>,
  ) => (
    <DropdownItem
      as={ToggleSwitch}
      sizing="sm"
      className="rounded-none"
      label={label}
      checked={checked}
      onClick={() => setChecked((prev) => !prev)}
    />
  );

  return (
    <Dropdown
      dismissOnClick={false}
      className="dropdown"
      renderTrigger={() => (
        <Button color="alternative" className="h-auto px-3" title="Settings">
          <HiOutlineCog size={24} />
        </Button>
      )}
    >
      <DropdownHeader className="font-medium">Settings</DropdownHeader>

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

      <DropdownDivider />
      <DropdownHeader className="font-medium">Display options</DropdownHeader>

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

      <DropdownDivider />
      <DropdownHeader className="font-medium">Reset options</DropdownHeader>

      <DropdownHeader className="py-1">
        <Button
          tabIndex={-1}
          color="red"
          size="sm"
          className="w-full border-s-0!"
          onClick={resetColumns}
        >
          Reset columns
        </Button>
      </DropdownHeader>

      <DropdownHeader>
        <Button
          tabIndex={-1}
          color="red"
          size="sm"
          className="w-full border-s-0!"
          onClick={clearSongsSettings}
        >
          Reset everything
        </Button>
      </DropdownHeader>
    </Dropdown>
  );
}
