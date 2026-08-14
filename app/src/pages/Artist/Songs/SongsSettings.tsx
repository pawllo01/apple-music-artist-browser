import { HR, ToggleSwitch } from "flowbite-react";
import { clearSettingsByType } from "../../../@other/fuctions";
import ResetButton from "../../../components/ResetButton";
import { GROUP_BY_ISRC, VA } from "../../constants";
import DrawerSettings from "../DrawerSettings";
import { SongsSettingsType } from "./useSongsSettings";

type SongsSettingsProps = {
  settings: SongsSettingsType;
  resetColumns: () => void;
};

export default function SongsSettings({
  settings,
  resetColumns,
}: SongsSettingsProps) {
  return (
    <DrawerSettings>
      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label={GROUP_BY_ISRC}
        checked={settings.groupSongs}
        onChange={() => settings.setGroupSongs((prev) => !prev)}
      />

      {/* will be useful for full mode */}
      {import.meta.env.DEV && (
        <ToggleSwitch
          sizing="sm"
          className="my-3"
          label={`Include all ${VA} albums`}
          checked={settings.showAllVariousArtistsAlbums}
          onChange={() =>
            settings.setShowAllVariousArtistsAlbums((prev) => !prev)
          }
        />
      )}

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Preserve column sorting"
        checked={settings.saveSorting}
        onChange={() => settings.setSaveSorting((prev) => !prev)}
      />

      <HR className="my-4" />
      <h5 className="mb-3 font-semibold text-gray-500 dark:text-gray-400">
        Display options
      </h5>

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Show [Dolby Atmos] badge"
        checked={settings.showDolbyAtmosBadge}
        onChange={() => settings.setShowDolbyAtmosBadge((prev) => !prev)}
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Hide Single/EP labels in album names"
        checked={settings.truncateAlbumNames}
        onChange={() => settings.setTruncateAlbumNames((prev) => !prev)}
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Show IDs next to song and album names"
        checked={settings.showIdsInCells}
        onChange={() => settings.setShowIdsInCells((prev) => !prev)}
      />

      <HR className="my-4" />
      <h5 className="mb-3 font-semibold text-gray-500 dark:text-gray-400">
        Reset options
      </h5>

      <ResetButton onClick={resetColumns}>Reset columns</ResetButton>

      <ResetButton onClick={() => clearSettingsByType("songs")}>
        Reset everything
      </ResetButton>
    </DrawerSettings>
  );
}
