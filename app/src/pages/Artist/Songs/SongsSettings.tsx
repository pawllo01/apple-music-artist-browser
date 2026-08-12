import { HR } from "flowbite-react";
import ResetButton from "../../../components/ResetButton";
import { GROUP_BY_ISRC, VA } from "../../constants";
import DrawerSettings from "../DrawerSettings";
import { clearSettingsByType, createToggleSwitch } from "../settings-utils";
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

      <ResetButton onClick={resetColumns}>Reset columns</ResetButton>

      <ResetButton onClick={() => clearSettingsByType("songs")}>
        Reset everything
      </ResetButton>
    </DrawerSettings>
  );
}
