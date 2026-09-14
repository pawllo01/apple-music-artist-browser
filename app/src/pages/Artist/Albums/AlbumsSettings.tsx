import { HR, ToggleSwitch } from "flowbite-react";
import { clearSettingsByType } from "../../../@other/fuctions";
import ResetButton from "../../../components/ResetButton";
import DrawerSettings from "../DrawerSettings";
import { AlbumsSettingsType } from "./useAlbumsSettings";

type AlbumsSettingsProps = {
  settings: AlbumsSettingsType;
};

export default function AlbumsSettings({ settings }: AlbumsSettingsProps) {
  return (
    <DrawerSettings>
      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Group albums by release year"
        checked={settings.groupByYear.enabled}
        onChange={() =>
          settings.setGroupByYear((prev) => ({
            ...prev,
            enabled: !prev.enabled,
          }))
        }
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Newest years first"
        disabled={!settings.groupByYear.enabled}
        checked={settings.groupByYear.sortDescFirst}
        onChange={() =>
          settings.setGroupByYear((prev) => ({
            ...prev,
            sortDescFirst: !prev.sortDescFirst,
          }))
        }
      />

      <HR className="my-4" />
      <h5 className="mb-3 font-semibold text-gray-500 dark:text-gray-400">
        Display options
      </h5>

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Show album numbers"
        checked={settings.showNumbering}
        onChange={() => settings.setShowNumbering((prev) => !prev)}
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
        label="Show [Dolby Atmos] badge"
        checked={settings.showDolbyAtmosBadge}
        onChange={() => settings.setShowDolbyAtmosBadge((prev) => !prev)}
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Show artists"
        checked={settings.showArtists}
        onChange={() => settings.setShowArtists((prev) => !prev)}
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Show full release date"
        checked={settings.showFullReleaseDate}
        onChange={() => settings.setShowFullReleaseDate((prev) => !prev)}
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Show song count"
        checked={settings.showSongCount}
        onChange={() => settings.setShowSongCount((prev) => !prev)}
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Show genre"
        checked={settings.showGenre}
        onChange={() => settings.setShowGenre((prev) => !prev)}
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Show record label"
        checked={settings.showLabel}
        onChange={() => settings.setShowLabel((prev) => !prev)}
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Show UPC"
        checked={settings.showUpc}
        onChange={() => settings.setShowUpc((prev) => !prev)}
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Show album ID"
        checked={settings.showAlbumId}
        onChange={() => settings.setShowAlbumId((prev) => !prev)}
      />

      <HR className="my-4" />
      <h5 className="mb-3 font-semibold text-gray-500 dark:text-gray-400">
        Reset options
      </h5>

      <ResetButton onClick={() => clearSettingsByType("albums")}>
        Reset
      </ResetButton>
    </DrawerSettings>
  );
}
