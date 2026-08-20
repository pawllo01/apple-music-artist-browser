import { HR, ToggleSwitch } from "flowbite-react";
import { clearSettingsByType } from "../../../@other/fuctions";
import ResetButton from "../../../components/ResetButton";
import DrawerSettings from "../DrawerSettings";
import { VideosSettingsType } from "./useVideosSettings";

type VideosSettingsProps = {
  settings: VideosSettingsType;
};

export default function VideosSettings({ settings }: VideosSettingsProps) {
  return (
    <DrawerSettings>
      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Group videos by release year"
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
        label="Crop thumbnails (remove black bars)"
        checked={settings.cropThumbnails}
        onChange={() => settings.setCropThumbnails((prev) => !prev)}
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Show video numbers"
        checked={settings.showVideoNumbers}
        onChange={() => settings.setShowVideoNumbers((prev) => !prev)}
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label='Show "From: Album"'
        checked={settings.showFromAlbum}
        onChange={() => settings.setShowFromAlbum((prev) => !prev)}
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
        label="Show genre"
        checked={settings.showGenre}
        onChange={() => settings.setShowGenre((prev) => !prev)}
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
        label="Show ISRC"
        checked={settings.showIsrc}
        onChange={() => settings.setShowIsrc((prev) => !prev)}
      />

      <ToggleSwitch
        sizing="sm"
        className="my-3"
        label="Show video ID"
        checked={settings.showVideoId}
        onChange={() => settings.setShowVideoId((prev) => !prev)}
      />

      <HR className="my-4" />
      <h5 className="mb-3 font-semibold text-gray-500 dark:text-gray-400">
        Reset options
      </h5>

      <ResetButton onClick={() => clearSettingsByType("videos")}>
        Reset
      </ResetButton>
    </DrawerSettings>
  );
}
